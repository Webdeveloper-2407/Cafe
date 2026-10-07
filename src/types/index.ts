export interface MenuItem {
  id: string;
  name: string;
  slug?: string;
  description: string;
  fullDescription?: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  featured: boolean;
  ingredients?: string[];
  allergens?: string[];
  preparationTime?: string;
  calories?: number;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. CAF-2026-0001
  customerName: string;
  email: string;
  phone: string;
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
  }[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  notes?: string;
  estimatedTime?: string;
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

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  pendingReservations: number;
  unreadMessages: number;
  totalSubscribers: number;
  totalMenuItems: number;
  recentOrders: Order[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}
