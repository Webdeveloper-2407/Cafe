import {
  MenuItem,
  Category,
  Order,
  Reservation,
  ContactMessage,
  NewsletterSubscriber,
  BlogPost,
  GalleryImage,
  DashboardStats,
  AdminUser,
} from '../types/index.js';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('cafe_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('cafe_admin_token', data.data.token);
    return data.data;
  },

  async getMe(): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to authenticate');
    return data.data;
  },

  logout() {
    localStorage.removeItem('cafe_admin_token');
  },

  // Menu & Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    return data.data || [];
  },

  async getMenuItems(params?: { category?: string; search?: string; featured?: boolean }): Promise<MenuItem[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));

    const res = await fetch(`${API_BASE}/menu?${query.toString()}`);
    const data = await res.json();
    return data.data || [];
  },

  async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create menu item');
    return data.data;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update menu item');
    return data.data;
  },

  async deleteMenuItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete menu item');
  },

  // Orders
  async createOrder(orderPayload: {
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
    notes?: string;
  }): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data.data;
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
    return data.data || [];
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order status');
    return data.data;
  },

  // Reservations
  async createReservation(resPayload: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
  }): Promise<{ reservation: Reservation; message: string }> {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resPayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to book reservation');
    return { reservation: data.data, message: data.message };
  },

  async getReservations(): Promise<Reservation[]> {
    const res = await fetch(`${API_BASE}/reservations`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch reservations');
    return data.data || [];
  },

  async updateReservationStatus(id: string, status: Reservation['status']): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update reservation');
    return data.data;
  },

  // Contact
  async sendContact(msgPayload: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgPayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send message');
    return { message: data.message };
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch contact messages');
    return data.data || [];
  },

  async markMessageRead(id: string): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/contact/${id}/read`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to mark message read');
    return data.data;
  },

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
    return { message: data.message };
  },

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const res = await fetch(`${API_BASE}/newsletter`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch subscribers');
    return data.data || [];
  },

  // Blog
  async getBlogPosts(all?: boolean): Promise<BlogPost[]> {
    const res = await fetch(`${API_BASE}/blog${all ? '?all=true' : ''}`);
    const data = await res.json();
    return data.data || [];
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blog/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Post not found');
    return data.data;
  },

  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(post),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create blog post');
    return data.data;
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update blog post');
    return data.data;
  },

  async deleteBlogPost(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/blog/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete blog post');
  },

  // Gallery
  async getGalleryImages(): Promise<GalleryImage[]> {
    const res = await fetch(`${API_BASE}/gallery`);
    const data = await res.json();
    return data.data || [];
  },

  async createGalleryImage(img: Partial<GalleryImage>): Promise<GalleryImage> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(img),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add image');
    return data.data;
  },

  async deleteGalleryImage(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete gallery image');
  },

  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard stats');
    return data.data;
  },

  async resetSeed(): Promise<void> {
    const res = await fetch(`${API_BASE}/seed/reset`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to reset seed');
  },
};
