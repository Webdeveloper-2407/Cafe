import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  featured: boolean;
  tags?: string[];
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  readTime: string;
  published: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string;
  published: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  reservations: Reservation[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  blogPosts: BlogPost[];
  galleryImages: GalleryImage[];
}

export function hashPassword(password: string): string {
  const salt = 'cafe_artisan_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

function getInitialData(): DatabaseSchema {
  return {
    users: [
      {
        id: 'usr_admin',
        name: 'Head Barista & Manager',
        email: 'admin@cafe.com',
        passwordHash: hashPassword('adminpassword123'),
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ],
    categories: [
      { id: 'cat_coffee', name: 'Coffee & Espresso', slug: 'coffee', description: 'Freshly roasted single-origin coffees and espresso crafts', displayOrder: 1 },
      { id: 'cat_cold', name: 'Cold Brew & Iced', slug: 'cold-drinks', description: 'Chilled coffees and artisanal teas', displayOrder: 2 },
      { id: 'cat_bakery', name: 'Fresh Bakery', slug: 'bakery', description: 'Flaky croissants, muffins, and morning pastries', displayOrder: 3 },
      { id: 'cat_desserts', name: 'Desserts & Cakes', slug: 'desserts', description: 'Decadent cakes and handcrafted sweet treats', displayOrder: 4 },
      { id: 'cat_sandwiches', name: 'Gourmet Sandwiches', slug: 'sandwiches', description: 'Warm toasted paninis and artisan deli subs', displayOrder: 5 },
    ],
    menuItems: [
      {
        id: 'item_1',
        name: 'Cappuccino',
        description: 'Rich espresso balanced with velvety steamed milk foam and delicate latte art.',
        price: 3.50,
        image: '/src/assets/images/cafe_feature_coffee_1791337560176.jpg',
        category: 'Coffee & Espresso',
        available: true,
        featured: true,
        tags: ['Classic', 'Espresso', 'Popular'],
        createdAt: '2026-03-01T08:00:00Z',
      },
      {
        id: 'item_2',
        name: 'Chocolate Cake',
        description: 'Multi-layered rich Belgian dark chocolate sponge topped with fresh blueberries.',
        price: 4.50,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        category: 'Desserts & Cakes',
        available: true,
        featured: true,
        tags: ['Dessert', 'Chocolate', 'Sweet'],
        createdAt: '2026-03-01T08:05:00Z',
      },
      {
        id: 'item_3',
        name: 'Chicken Sandwich',
        description: 'Grilled herb-marinated chicken breast, crispy lettuce, sliced tomato on toasted ciabatta.',
        price: 6.50,
        image: '/src/assets/images/cafe_menu_sandwich_1791337589767.jpg',
        category: 'Gourmet Sandwiches',
        available: true,
        featured: true,
        tags: ['Savory', 'Lunch', 'Chef Special'],
        createdAt: '2026-03-01T08:10:00Z',
      },
      {
        id: 'item_4',
        name: 'Iced Latte',
        description: 'Double shot of signature espresso poured over cold milk and crystal ice cubes.',
        price: 4.00,
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
        category: 'Cold Brew & Iced',
        available: true,
        featured: true,
        tags: ['Chilled', 'Refreshing'],
        createdAt: '2026-03-01T08:15:00Z',
      },
      {
        id: 'item_5',
        name: 'Berry Cheesecake',
        description: 'Velvety New York style baked cheesecake topped with raspberry coulis and fresh berries.',
        price: 4.25,
        image: '/src/assets/images/cafe_feature_cheesecake_1791337576939.jpg',
        category: 'Desserts & Cakes',
        available: true,
        featured: true,
        tags: ['Signature', 'Fruit'],
        createdAt: '2026-03-01T08:20:00Z',
      },
      {
        id: 'item_6',
        name: 'Flaky Butter Croissant',
        description: 'Traditional French butter croissant baked fresh every morning with golden honeycomb layers.',
        price: 2.95,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
        category: 'Fresh Bakery',
        available: true,
        featured: false,
        tags: ['Bakery', 'Breakfast'],
        createdAt: '2026-03-01T08:25:00Z',
      },
      {
        id: 'item_7',
        name: 'Caramel Macchiato',
        description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and caramel drizzle.',
        price: 4.75,
        image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80',
        category: 'Coffee & Espresso',
        available: true,
        featured: false,
        tags: ['Sweet', 'Caramel'],
        createdAt: '2026-03-01T08:30:00Z',
      },
      {
        id: 'item_8',
        name: 'Artisan Avocado Toast',
        description: 'Crushed avocado on toasted sourdough with micro-greens, cherry tomatoes, and red pepper flakes.',
        price: 5.95,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
        category: 'Gourmet Sandwiches',
        available: true,
        featured: false,
        tags: ['Healthy', 'Brunch'],
        createdAt: '2026-03-01T08:35:00Z',
      },
    ],
    orders: [
      {
        id: 'ord_101',
        orderNumber: 'CF-2026-101',
        customerName: 'Eleanor Vance',
        email: 'eleanor@example.com',
        phone: '+1 (555) 234-8901',
        orderType: 'pickup',
        items: [
          { menuItemId: 'item_1', name: 'Cappuccino', price: 3.50, quantity: 2, specialInstructions: 'Oat milk please' },
          { menuItemId: 'item_5', name: 'Berry Cheesecake', price: 4.25, quantity: 1 },
        ],
        subtotal: 11.25,
        tax: 0.90,
        deliveryFee: 0,
        total: 12.15,
        status: 'Preparing',
        notes: 'Ready by 10:30 AM',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'ord_102',
        orderNumber: 'CF-2026-102',
        customerName: 'Marcus Bennett',
        email: 'marcus.b@example.com',
        phone: '+1 (555) 789-1234',
        orderType: 'delivery',
        deliveryAddress: '428 Elm Street, Apt 3B',
        items: [
          { menuItemId: 'item_3', name: 'Chicken Sandwich', price: 6.50, quantity: 2 },
          { menuItemId: 'item_4', name: 'Iced Latte', price: 4.00, quantity: 2 },
        ],
        subtotal: 21.00,
        tax: 1.68,
        deliveryFee: 3.50,
        total: 26.18,
        status: 'Confirmed',
        notes: 'Ring doorbell 3B',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    reservations: [
      {
        id: 'res_201',
        name: 'Sophia Laurent',
        email: 'sophia@example.com',
        phone: '+1 (555) 456-7890',
        date: '2026-10-08',
        time: '14:00',
        guests: 3,
        specialRequest: 'Window table if available for casual business meeting',
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'res_202',
        name: 'David Kim',
        email: 'david.k@example.com',
        phone: '+1 (555) 890-4321',
        date: '2026-10-09',
        time: '10:30',
        guests: 2,
        specialRequest: 'Anniversary morning coffee',
        status: 'Pending',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ],
    contactMessages: [
      {
        id: 'msg_301',
        name: 'Hannah Abbott',
        email: 'hannah@example.com',
        phone: '+1 (555) 678-9012',
        subject: 'Catering for Weekend Book Club',
        message: 'Hello! We are hosting a 12-person book club gathering next Saturday morning. Do you provide pastry box catering and pump pots of brewed coffee?',
        isRead: false,
        createdAt: new Date(Date.now() - 5400000).toISOString(),
      },
    ],
    newsletterSubscribers: [
      {
        id: 'sub_401',
        email: 'coffee.enthusiast@example.com',
        subscribedAt: '2026-03-01T12:00:00Z',
        active: true,
      },
      {
        id: 'sub_402',
        email: 'ranaahmaed2407@gmail.com',
        subscribedAt: '2026-03-02T15:30:00Z',
        active: true,
      },
    ],
    blogPosts: [
      {
        id: 'post_1',
        title: 'The Art of Slow Brewing: Bean to Cup',
        slug: 'the-art-of-slow-brewing',
        excerpt: 'Discover the meticulous roasting curve, extraction pressure, and temperature profiles that bring out floral and chocolate notes.',
        content: `At our café, brewing is treated as both a craft and a mindfulness ritual. Every morning begins with calibrating the grinder burrs down to the micron. 

### Why Sourcing Matters
We partner directly with high-elevation micro-lot farms in Ethiopia and Colombia. By paying above fair-trade premiums, we guarantee access to hand-picked cherries grown under canopy shade.

### The Pour-Over Technique
Water heated to precisely 93°C is poured in gentle concentric circles over freshly ground beans. The bloom phase releases trapped carbon dioxide, awakening delicate floral aromatics before the steady extraction produces a clean, sweet cup.

Visit us this weekend and ask our head barista for a tasting flight of this season's washed Geisha lot!`,
        image: '/src/assets/images/cafe_barista_latte_pour_1791337603225.jpg',
        author: 'Julian Thorne, Head Barista',
        readTime: '4 min read',
        published: true,
        createdAt: '2026-03-02T10:00:00Z',
      },
      {
        id: 'post_2',
        title: 'Pairing Espresso with Handcrafted Pastries',
        slug: 'pairing-espresso-with-pastries',
        excerpt: 'How the bright acidity of single-origin coffee cuts through buttery croissant laminations and dark cocoa.',
        content: `Finding harmony between pastry and espresso is a culinary balance. The rich fat content of French European butter in our laminated croissants coats the palate, creating the ideal canvas for high-altitude espresso.

When enjoying our signature Cappuccino, pair it with our freshly baked fruit tart or berry cheesecake to experience a delightful play of tart berry brightness against toasted caramel crema.`,
        image: '/src/assets/images/hero_cafe_spread_1791337542851.jpg',
        author: 'Elena Rostova, Pastry Chef',
        readTime: '3 min read',
        published: true,
        createdAt: '2026-03-04T14:30:00Z',
      },
      {
        id: 'post_3',
        title: 'Designing a Cozy Sanctuary in the Heart of the City',
        slug: 'designing-a-cozy-sanctuary',
        excerpt: 'Natural oak, warm diffused lighting, and acoustic tranquility: creating your daily home away from home.',
        content: `A great café is more than coffee; it is a refuge. When designing our space, we focused on tactile natural materials: reclaimed oak, warm terracotta tiling, live greenery, and low-frequency ambient music tuned for deep focus and intimate conversations.`,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        author: 'Liam Chen, Creative Director',
        readTime: '5 min read',
        published: true,
        createdAt: '2026-03-05T09:15:00Z',
      },
    ],
    galleryImages: [
      {
        id: 'gal_1',
        title: 'Artisan Morning Spread',
        category: 'Food & Coffee',
        imageUrl: '/src/assets/images/hero_cafe_spread_1791337542851.jpg',
        caption: 'Freshly baked croissants and signature latte art to kickstart your day.',
        published: true,
        createdAt: '2026-03-01T09:00:00Z',
      },
      {
        id: 'gal_2',
        title: 'Barista Milk Pouring Craft',
        category: 'Barista Craft',
        imageUrl: '/src/assets/images/cafe_barista_latte_pour_1791337603225.jpg',
        caption: 'Steaming microfoam to silky perfection at 65°C.',
        published: true,
        createdAt: '2026-03-01T09:10:00Z',
      },
      {
        id: 'gal_3',
        title: 'Velvety Berry Cheesecake',
        category: 'Desserts',
        imageUrl: '/src/assets/images/cafe_feature_cheesecake_1791337576939.jpg',
        caption: 'Made with organic cream cheese and wild mountain berry coulis.',
        published: true,
        createdAt: '2026-03-01T09:20:00Z',
      },
      {
        id: 'gal_4',
        title: 'Cappuccino Rosette Art',
        category: 'Coffee Craft',
        imageUrl: '/src/assets/images/cafe_feature_coffee_1791337560176.jpg',
        caption: 'Double shot espresso balanced with creamy microfoam.',
        published: true,
        createdAt: '2026-03-01T09:30:00Z',
      },
      {
        id: 'gal_5',
        title: 'Gourmet Ciabatta Sandwiches',
        category: 'Food & Coffee',
        imageUrl: '/src/assets/images/cafe_menu_sandwich_1791337589767.jpg',
        caption: 'Toasted artisan breads filled with local farm ingredients.',
        published: true,
        createdAt: '2026-03-01T09:40:00Z',
      },
      {
        id: 'gal_6',
        title: 'Warm Rustic Seating',
        category: 'Atmosphere',
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        caption: 'A sunny quiet corner for reading, working, and catching up.',
        published: true,
        createdAt: '2026-03-01T09:50:00Z',
      },
    ],
  };
}

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = getInitialData();
  }

  public init() {
    if (this.isLoaded) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          ...getInitialData(),
          ...parsed,
        };
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('[DB] Error initializing database:', err);
      this.data = getInitialData();
      this.isLoaded = true;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error writing to file:', err);
    }
  }

  public resetToSeed() {
    this.data = getInitialData();
    this.save();
    return this.data;
  }

  // Generic collection operations
  public get users() { return this.data.users; }
  public get categories() { return this.data.categories; }
  public get menuItems() { return this.data.menuItems; }
  public get orders() { return this.data.orders; }
  public get reservations() { return this.data.reservations; }
  public get contactMessages() { return this.data.contactMessages; }
  public get newsletterSubscribers() { return this.data.newsletterSubscribers; }
  public get blogPosts() { return this.data.blogPosts; }
  public get galleryImages() { return this.data.galleryImages; }

  // Mutations
  public addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.menuItems.unshift(newItem);
    this.save();
    return newItem;
  }

  public updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const index = this.data.menuItems.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.data.menuItems[index] = { ...this.data.menuItems[index], ...updates };
    this.save();
    return this.data.menuItems[index];
  }

  public deleteMenuItem(id: string): boolean {
    const prevLen = this.data.menuItems.length;
    this.data.menuItems = this.data.menuItems.filter(i => i.id !== id);
    const deleted = this.data.menuItems.length !== prevLen;
    if (deleted) this.save();
    return deleted;
  }

  public addOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orderNumber = `CF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    this.save();
    return order;
  }

  public addReservation(resData: Omit<Reservation, 'id' | 'createdAt'>): Reservation {
    const newReservation: Reservation = {
      ...resData,
      id: `res_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.reservations.unshift(newReservation);
    this.save();
    return newReservation;
  }

  public updateReservationStatus(id: string, status: Reservation['status']): Reservation | null {
    const res = this.data.reservations.find(r => r.id === id);
    if (!res) return null;
    res.status = status;
    this.save();
    return res;
  }

  public addContactMessage(msgData: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.data.contactMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  public markMessageRead(id: string): ContactMessage | null {
    const msg = this.data.contactMessages.find(m => m.id === id);
    if (!msg) return null;
    msg.isRead = true;
    this.save();
    return msg;
  }

  public addNewsletterSubscriber(email: string): { subscriber: NewsletterSubscriber; isNew: boolean } {
    const existing = this.data.newsletterSubscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.active = true;
      this.save();
      return { subscriber: existing, isNew: false };
    }
    const newSub: NewsletterSubscriber = {
      id: `sub_${Date.now()}`,
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      active: true,
    };
    this.data.newsletterSubscribers.unshift(newSub);
    this.save();
    return { subscriber: newSub, isNew: true };
  }

  public addBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt'>): BlogPost {
    const newPost: BlogPost = {
      ...postData,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.blogPosts.unshift(newPost);
    this.save();
    return newPost;
  }

  public updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const index = this.data.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.blogPosts[index] = { ...this.data.blogPosts[index], ...updates };
    this.save();
    return this.data.blogPosts[index];
  }

  public deleteBlogPost(id: string): boolean {
    const prev = this.data.blogPosts.length;
    this.data.blogPosts = this.data.blogPosts.filter(p => p.id !== id);
    const deleted = this.data.blogPosts.length !== prev;
    if (deleted) this.save();
    return deleted;
  }

  public addGalleryImage(imgData: Omit<GalleryImage, 'id' | 'createdAt'>): GalleryImage {
    const newImg: GalleryImage = {
      ...imgData,
      id: `gal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.galleryImages.unshift(newImg);
    this.save();
    return newImg;
  }

  public deleteGalleryImage(id: string): boolean {
    const prev = this.data.galleryImages.length;
    this.data.galleryImages = this.data.galleryImages.filter(g => g.id !== id);
    const deleted = this.data.galleryImages.length !== prev;
    if (deleted) this.save();
    return deleted;
  }
}

export const db = new Database();
db.init();
