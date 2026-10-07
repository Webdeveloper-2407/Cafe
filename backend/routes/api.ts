import { Router, Request, Response } from 'express';
import { db, verifyPassword, hashPassword, MenuItem, BlogPost } from '../db/index.js';
import { generateToken, requireAdmin, requireAuth, AuthRequest } from '../middleware/auth.js';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION
// ==========================================
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required' });
    return;
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
    return;
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ==========================================
// 2. CATEGORIES
// ==========================================
apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.categories });
});

// ==========================================
// 3. MENU ITEMS
// ==========================================
apiRouter.get('/menu', (req: Request, res: Response) => {
  const { category, search, featured } = req.query;
  let items = [...db.menuItems];

  if (category && typeof category === 'string' && category !== 'All') {
    items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }

  if (featured === 'true') {
    items = items.filter(i => i.featured);
  }

  if (search && typeof search === 'string') {
    const term = search.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(term) ||
      i.description.toLowerCase().includes(term) ||
      i.category.toLowerCase().includes(term)
    );
  }

  res.json({ success: true, data: items, count: items.length });
});

apiRouter.get('/menu/:id', (req: Request, res: Response) => {
  const item = db.menuItems.find(i => i.id === req.params.id);
  if (!item) {
    res.status(404).json({ success: false, error: 'Menu item not found' });
    return;
  }
  res.json({ success: true, data: item });
});

apiRouter.post('/menu', requireAdmin, (req: Request, res: Response) => {
  const { name, description, price, image, category, available, featured, tags } = req.body;
  if (!name || price === undefined || !category) {
    res.status(400).json({ success: false, error: 'Name, price, and category are required' });
    return;
  }

  const newItem = db.addMenuItem({
    name,
    description: description || '',
    price: Number(price),
    image: image || '/src/assets/images/cafe_feature_coffee_1791337560176.jpg',
    category,
    available: available !== false,
    featured: Boolean(featured),
    tags: Array.isArray(tags) ? tags : [],
  });

  res.status(201).json({ success: true, data: newItem });
});

apiRouter.put('/menu/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateMenuItem(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Menu item not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

apiRouter.delete('/menu/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteMenuItem(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, error: 'Menu item not found' });
    return;
  }
  res.json({ success: true, message: 'Menu item deleted' });
});

// ==========================================
// 4. ORDERS
// ==========================================
apiRouter.get('/orders', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, data: db.orders });
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  const { customerName, email, phone, orderType, deliveryAddress, items, notes } = req.body;

  if (!customerName || !email || !phone || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ success: false, error: 'Please provide customer name, email, phone, and order items' });
    return;
  }

  if (orderType === 'delivery' && !deliveryAddress) {
    res.status(400).json({ success: false, error: 'Delivery address is required for delivery orders' });
    return;
  }

  const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const deliveryFee = orderType === 'delivery' ? 3.50 : 0;
  const total = Number((subtotal + tax + deliveryFee).toFixed(2));

  const order = db.addOrder({
    customerName,
    email,
    phone,
    orderType: orderType || 'pickup',
    deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
    items,
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    deliveryFee,
    total,
    status: 'Pending',
    notes: notes || '',
  });

  res.status(201).json({ success: true, data: order });
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    res.status(404).json({ success: false, error: 'Order not found' });
    return;
  }
  res.json({ success: true, data: order });
});

apiRouter.patch('/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ success: false, error: 'Status is required' });
    return;
  }

  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Order not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// ==========================================
// 5. RESERVATIONS
// ==========================================
apiRouter.get('/reservations', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, data: db.reservations });
});

apiRouter.post('/reservations', (req: Request, res: Response) => {
  const { name, email, phone, date, time, guests, specialRequest } = req.body;
  if (!name || !email || !phone || !date || !time || !guests) {
    res.status(400).json({ success: false, error: 'All reservation fields (name, email, phone, date, time, guests) are required' });
    return;
  }

  const reservation = db.addReservation({
    name,
    email,
    phone,
    date,
    time,
    guests: Number(guests),
    specialRequest: specialRequest || '',
    status: 'Pending',
  });

  res.status(201).json({
    success: true,
    data: reservation,
    message: 'Your table reservation request has been received! We look forward to welcoming you.',
  });
});

apiRouter.patch('/reservations/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateReservationStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Reservation not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// ==========================================
// 6. CONTACT MESSAGES
// ==========================================
apiRouter.get('/contact', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, data: db.contactMessages });
});

apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ success: false, error: 'Please fill out name, email, subject, and message' });
    return;
  }

  const msg = db.addContactMessage({
    name,
    email,
    phone: phone || '',
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    data: msg,
    message: 'Thank you! Your message has been sent to our café team.',
  });
});

apiRouter.patch('/contact/:id/read', requireAdmin, (req: Request, res: Response) => {
  const updated = db.markMessageRead(req.params.id);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Message not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// ==========================================
// 7. NEWSLETTER
// ==========================================
apiRouter.get('/newsletter', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, data: db.newsletterSubscribers });
});

apiRouter.post('/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    return;
  }

  const { subscriber, isNew } = db.addNewsletterSubscriber(email);
  res.json({
    success: true,
    data: subscriber,
    message: isNew
      ? 'Thank you for subscribing! Welcome to the café family.'
      : 'You are already subscribed to our newsletter! Thank you for staying connected.',
  });
});

// ==========================================
// 8. BLOG
// ==========================================
apiRouter.get('/blog', (req: Request, res: Response) => {
  const all = req.query.all === 'true';
  const posts = all ? db.blogPosts : db.blogPosts.filter(p => p.published);
  res.json({ success: true, data: posts });
});

apiRouter.get('/blog/:slug', (req: Request, res: Response) => {
  const post = db.blogPosts.find(p => p.slug === req.params.slug || p.id === req.params.slug);
  if (!post) {
    res.status(404).json({ success: false, error: 'Post not found' });
    return;
  }
  res.json({ success: true, data: post });
});

apiRouter.post('/blog', requireAdmin, (req: Request, res: Response) => {
  const { title, slug, excerpt, content, image, author, readTime, published } = req.body;
  if (!title || !content) {
    res.status(400).json({ success: false, error: 'Title and content are required' });
    return;
  }

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const post = db.addBlogPost({
    title,
    slug: generatedSlug,
    excerpt: excerpt || content.slice(0, 140) + '...',
    content,
    image: image || '/src/assets/images/hero_cafe_spread_1791337542851.jpg',
    author: author || 'Café Team',
    readTime: readTime || '4 min read',
    published: published !== false,
  });

  res.status(201).json({ success: true, data: post });
});

apiRouter.put('/blog/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateBlogPost(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Post not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

apiRouter.delete('/blog/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteBlogPost(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, error: 'Post not found' });
    return;
  }
  res.json({ success: true, message: 'Blog post deleted' });
});

// ==========================================
// 9. GALLERY
// ==========================================
apiRouter.get('/gallery', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.galleryImages });
});

apiRouter.post('/gallery', requireAdmin, (req: Request, res: Response) => {
  const { title, category, imageUrl, caption, published } = req.body;
  if (!title || !imageUrl) {
    res.status(400).json({ success: false, error: 'Title and image URL are required' });
    return;
  }

  const img = db.addGalleryImage({
    title,
    category: category || 'General',
    imageUrl,
    caption,
    published: published !== false,
  });

  res.status(201).json({ success: true, data: img });
});

apiRouter.delete('/gallery/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteGalleryImage(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, error: 'Gallery image not found' });
    return;
  }
  res.json({ success: true, message: 'Image deleted' });
});

// ==========================================
// 10. ADMIN DASHBOARD STATS
// ==========================================
apiRouter.get('/dashboard/stats', requireAdmin, (_req: Request, res: Response) => {
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
  const totalRevenue = db.orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingReservations = db.reservations.filter(r => r.status === 'Pending').length;
  const unreadMessages = db.contactMessages.filter(m => !m.isRead).length;
  const totalSubscribers = db.newsletterSubscribers.filter(s => s.active).length;
  const totalMenuItems = db.menuItems.length;

  res.json({
    success: true,
    data: {
      totalOrders,
      pendingOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      pendingReservations,
      unreadMessages,
      totalSubscribers,
      totalMenuItems,
      recentOrders: db.orders.slice(0, 5),
    },
  });
});

// Reseed utility endpoint for admin
apiRouter.post('/seed/reset', requireAdmin, (_req: Request, res: Response) => {
  const fresh = db.resetToSeed();
  res.json({ success: true, message: 'Database reset to default seed', data: fresh });
});
