import { Router, Request, Response } from 'express';
import { db, verifyPassword, MenuItem } from '../db/index.js';
import { generateToken, requireAdmin, requireAuth, AuthRequest } from '../middleware/auth.js';
import {
  sendOrderNotificationEmail,
  sendReservationNotificationEmail,
  sendContactNotificationEmail,
} from '../services/email.js';

export const apiRouter = Router();

// ==========================================
// 0. HEALTH CHECK
// ==========================================
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Café API server is healthy and online',
    database: db.isMongoConnected ? 'connected (MongoDB Atlas)' : 'active (persistent document store)',
    server: 'running',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 1. AUTHENTICATION
// ==========================================
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  res.json({
    success: true,
    message: 'Authenticated successfully',
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
  const { category, search, featured, available } = req.query;
  let items = [...db.menuItems];

  if (category && typeof category === 'string' && category !== 'All') {
    items = items.filter(i => i.category.toLowerCase().trim() === category.toLowerCase().trim());
  }

  if (featured === 'true') {
    items = items.filter(i => i.featured);
  }

  if (available === 'true') {
    items = items.filter(i => i.available);
  }

  if (search && typeof search === 'string') {
    const term = search.toLowerCase().trim();
    items = items.filter(i =>
      i.name.toLowerCase().includes(term) ||
      i.description.toLowerCase().includes(term) ||
      (i.fullDescription && i.fullDescription.toLowerCase().includes(term)) ||
      i.category.toLowerCase().includes(term) ||
      (i.tags && i.tags.some(t => t.toLowerCase().includes(term)))
    );
  }

  res.json({ success: true, count: items.length, data: items });
});

apiRouter.get('/menu/:idOrSlug', (req: Request, res: Response) => {
  const param = req.params.idOrSlug;
  const item = db.menuItems.find(i => i.id === param || i.slug === param);
  if (!item) {
    res.status(404).json({ success: false, message: 'Menu item not found' });
    return;
  }
  res.json({ success: true, data: item });
});

apiRouter.post('/menu', requireAdmin, (req: Request, res: Response) => {
  const { name, description, fullDescription, price, image, category, available, featured, ingredients, allergens, preparationTime, calories, tags } = req.body;
  if (!name || price === undefined || !category) {
    res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    return;
  }

  const newItem = db.addMenuItem({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: description || '',
    fullDescription: fullDescription || description || '',
    price: Number(price),
    image: image || '/images/coffee.jpg',
    category,
    available: available !== false,
    featured: Boolean(featured),
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    allergens: Array.isArray(allergens) ? allergens : [],
    preparationTime: preparationTime || '3-5 mins',
    calories: calories ? Number(calories) : undefined,
    tags: Array.isArray(tags) ? tags : [],
  });

  res.status(201).json({ success: true, message: 'Menu item created successfully', data: newItem });
});

apiRouter.put('/menu/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateMenuItem(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Menu item not found' });
    return;
  }
  res.json({ success: true, message: 'Menu item updated', data: updated });
});

apiRouter.delete('/menu/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteMenuItem(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Menu item not found' });
    return;
  }
  res.json({ success: true, message: 'Menu item deleted successfully' });
});

// ==========================================
// 4. ORDERS & TRACKING
// ==========================================
apiRouter.get('/orders', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, count: db.orders.length, data: db.orders });
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  const { customerName, email, phone, orderType, deliveryAddress, items, notes } = req.body;

  if (!customerName || !email || !phone || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ success: false, message: 'Please provide customer name, email, phone, and at least one order item.' });
    return;
  }

  if (orderType === 'delivery' && !deliveryAddress) {
    res.status(400).json({ success: false, message: 'Delivery address is required for delivery orders.' });
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

  // Trigger email notification in background
  sendOrderNotificationEmail({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    orderType: order.orderType,
    deliveryAddress: order.deliveryAddress,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    tax: order.tax,
    total: order.total,
    notes: order.notes,
  }).catch(err => console.error('[Order Email Error]', err));

  res.status(201).json({
    success: true,
    message: `Order confirmed successfully! Your order reference is ${order.orderNumber}`,
    data: order,
    orderToken: order.orderNumber,
  });
});

// Customer tracking lookup
apiRouter.get('/orders/track/:token', (req: Request, res: Response) => {
  const token = req.params.token.trim();
  const order = db.orders.find(o => o.orderNumber.toUpperCase() === token.toUpperCase() || o.id === token);
  if (!order) {
    res.status(404).json({ success: false, message: `No order found with reference "${token}".` });
    return;
  }
  res.json({ success: true, data: order });
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }
  res.json({ success: true, data: order });
});

apiRouter.patch('/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ success: false, message: 'Status is required' });
    return;
  }

  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }
  res.json({ success: true, message: `Order status updated to ${status}`, data: updated });
});

// ==========================================
// 5. RESERVATIONS
// ==========================================
apiRouter.get('/reservations', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, count: db.reservations.length, data: db.reservations });
});

apiRouter.post('/reservations', (req: Request, res: Response) => {
  const { name, email, phone, date, time, guests, specialRequest } = req.body;
  if (!name || !email || !phone || !date || !time || !guests) {
    res.status(400).json({
      success: false,
      message: 'All reservation fields (name, email, phone, date, time, guests) are required.',
    });
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

  // Trigger email notification
  sendReservationNotificationEmail({
    name,
    email,
    phone,
    date,
    time,
    guests: Number(guests),
    specialRequest,
  }).catch(err => console.error('[Reservation Email Error]', err));

  res.status(201).json({
    success: true,
    message: 'Your table reservation request has been received! We look forward to welcoming you.',
    reservation,
    data: reservation,
  });
});

apiRouter.patch('/reservations/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateReservationStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Reservation not found' });
    return;
  }
  res.json({ success: true, message: `Reservation marked as ${status}`, data: updated });
});

// ==========================================
// 6. CONTACT MESSAGES
// ==========================================
apiRouter.get('/contact', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, count: db.contactMessages.length, data: db.contactMessages });
});

apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ success: false, message: 'Please fill out name, email, subject, and message.' });
    return;
  }

  const msg = db.addContactMessage({
    name,
    email,
    phone: phone || '',
    subject,
    message,
  });

  // Trigger email notification
  sendContactNotificationEmail({
    name,
    email,
    phone,
    subject,
    message,
  }).catch(err => console.error('[Contact Email Error]', err));

  res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been sent to our café team.',
    data: msg,
  });
});

apiRouter.patch('/contact/:id/read', requireAdmin, (req: Request, res: Response) => {
  const updated = db.markMessageRead(req.params.id);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Message not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// ==========================================
// 7. NEWSLETTER
// ==========================================
apiRouter.get('/newsletter', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, count: db.newsletterSubscribers.length, data: db.newsletterSubscribers });
});

apiRouter.post('/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    return;
  }

  const { subscriber, isNew } = db.addNewsletterSubscriber(email);
  res.json({
    success: true,
    message: isNew
      ? 'Thank you for subscribing! Welcome to the café family.'
      : 'You are already subscribed to our newsletter! Thank you for staying connected.',
    data: subscriber,
  });
});

// ==========================================
// 8. BLOG
// ==========================================
apiRouter.get('/blog', (req: Request, res: Response) => {
  const all = req.query.all === 'true';
  const posts = all ? db.blogPosts : db.blogPosts.filter(p => p.published);
  res.json({ success: true, count: posts.length, data: posts });
});

apiRouter.get('/blog/:slug', (req: Request, res: Response) => {
  const post = db.blogPosts.find(p => p.slug === req.params.slug || p.id === req.params.slug);
  if (!post) {
    res.status(404).json({ success: false, message: 'Blog post not found' });
    return;
  }
  res.json({ success: true, data: post });
});

apiRouter.post('/blog', requireAdmin, (req: Request, res: Response) => {
  const { title, slug, excerpt, content, image, author, readTime, published } = req.body;
  if (!title || !content) {
    res.status(400).json({ success: false, message: 'Title and content are required' });
    return;
  }

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const post = db.addBlogPost({
    title,
    slug: generatedSlug,
    excerpt: excerpt || content.slice(0, 140) + '...',
    content,
    image: image || '/images/hero.jpg',
    author: author || 'Café Team',
    readTime: readTime || '4 min read',
    published: published !== false,
  });

  res.status(201).json({ success: true, message: 'Blog post created', data: post });
});

apiRouter.put('/blog/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateBlogPost(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Blog post not found' });
    return;
  }
  res.json({ success: true, message: 'Blog post updated', data: updated });
});

apiRouter.delete('/blog/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteBlogPost(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Blog post not found' });
    return;
  }
  res.json({ success: true, message: 'Blog post deleted successfully' });
});

// ==========================================
// 9. GALLERY
// ==========================================
apiRouter.get('/gallery', (_req: Request, res: Response) => {
  res.json({ success: true, count: db.galleryImages.length, data: db.galleryImages });
});

apiRouter.post('/gallery', requireAdmin, (req: Request, res: Response) => {
  const { title, category, imageUrl, caption, published } = req.body;
  if (!title || !imageUrl) {
    res.status(400).json({ success: false, message: 'Title and image URL are required' });
    return;
  }

  const img = db.addGalleryImage({
    title,
    category: category || 'Food & Coffee',
    imageUrl,
    caption,
    published: published !== false,
  });

  res.status(201).json({ success: true, message: 'Image added to gallery', data: img });
});

apiRouter.delete('/gallery/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteGalleryImage(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Gallery image not found' });
    return;
  }
  res.json({ success: true, message: 'Gallery image deleted successfully' });
});

// ==========================================
// 10. ADMIN DASHBOARD STATS
// ==========================================
apiRouter.get('/dashboard/stats', requireAdmin, (_req: Request, res: Response) => {
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
  const completedOrders = db.orders.filter(o => o.status === 'Completed').length;
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
      completedOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      pendingReservations,
      unreadMessages,
      totalSubscribers,
      totalMenuItems,
      galleryItemsCount: db.galleryImages.length,
      blogPostsCount: db.blogPosts.length,
      recentOrders: db.orders.slice(0, 6),
    },
  });
});

// Reseed utility endpoint for admin
apiRouter.post('/seed/reset', requireAdmin, (_req: Request, res: Response) => {
  const fresh = db.resetToSeed();
  res.json({ success: true, message: 'Database reset to default seed with complete menu and gallery', data: fresh });
});
