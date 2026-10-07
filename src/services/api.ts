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
import {
  FALLBACK_CATEGORIES,
  FALLBACK_MENU_ITEMS,
  FALLBACK_GALLERY_IMAGES,
} from '../data/cafeData.js';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('cafe_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (err: any) {
    throw new Error('Network connection error. Please check your connection and try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    // Non-JSON response (e.g. HTML 404 from proxy or server error)
    if (!res.ok) {
      throw new Error(`The café service is momentarily unavailable (${res.status}). Please try again.`);
    }
    throw new Error('Unexpected non-JSON response from server.');
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error('Invalid response format received from server.');
  }

  if (!res.ok) {
    const errorMsg = data?.message || data?.error || 'Operation failed. Please try again.';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Health
  async getHealth(): Promise<{ success: boolean; database: string; server: string }> {
    try {
      const data = await safeFetchJson<any>(`${API_BASE}/health`);
      return data;
    } catch {
      return { success: false, database: 'offline', server: 'offline' };
    }
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const data = await safeFetchJson<any>(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('cafe_admin_token', data.data.token);
    return data.data;
  },

  async getMe(): Promise<AdminUser> {
    const data = await safeFetchJson<any>(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return data.data;
  },

  logout() {
    localStorage.removeItem('cafe_admin_token');
  },

  // Menu & Categories
  async getCategories(): Promise<Category[]> {
    try {
      const data = await safeFetchJson<any>(`${API_BASE}/categories`);
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
      return FALLBACK_CATEGORIES;
    } catch {
      return FALLBACK_CATEGORIES;
    }
  },

  async getMenuItems(params?: { category?: string; search?: string; featured?: boolean }): Promise<MenuItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.featured !== undefined) query.set('featured', String(params.featured));

      const data = await safeFetchJson<any>(`${API_BASE}/menu?${query.toString()}`);
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
      // Fallback filtering if backend is offline
      return this.filterFallbackMenu(params);
    } catch {
      return this.filterFallbackMenu(params);
    }
  },

  filterFallbackMenu(params?: { category?: string; search?: string; featured?: boolean }): MenuItem[] {
    let items = [...FALLBACK_MENU_ITEMS];
    if (params?.category && params.category !== 'All') {
      items = items.filter(i => i.category.toLowerCase().trim() === params.category!.toLowerCase().trim());
    }
    if (params?.featured !== undefined) {
      items = items.filter(i => i.featured === params.featured);
    }
    if (params?.search) {
      const term = params.search.toLowerCase().trim();
      items = items.filter(i =>
        i.name.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term) ||
        i.category.toLowerCase().includes(term)
      );
    }
    return items;
  },

  async getMenuItemByIdOrSlug(idOrSlug: string): Promise<MenuItem> {
    try {
      const data = await safeFetchJson<any>(`${API_BASE}/menu/${encodeURIComponent(idOrSlug)}`);
      return data.data;
    } catch {
      const fallback = FALLBACK_MENU_ITEMS.find(i => i.id === idOrSlug || i.slug === idOrSlug);
      if (fallback) return fallback;
      throw new Error('Item not found');
    }
  },

  async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const data = await safeFetchJson<any>(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item),
    });
    return data.data;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const data = await safeFetchJson<any>(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    return data.data;
  },

  async deleteMenuItem(id: string): Promise<void> {
    await safeFetchJson<any>(`${API_BASE}/menu/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
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
    const data = await safeFetchJson<any>(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    return data.data;
  },

  async getOrders(): Promise<Order[]> {
    const data = await safeFetchJson<any>(`${API_BASE}/orders`, {
      headers: { ...getAuthHeader() },
    });
    return data.data || [];
  },

  async trackOrder(token: string): Promise<Order> {
    const data = await safeFetchJson<any>(`${API_BASE}/orders/track/${encodeURIComponent(token.trim())}`);
    return data.data;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const data = await safeFetchJson<any>(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
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
    const data = await safeFetchJson<any>(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resPayload),
    });
    return {
      reservation: data.reservation || data.data,
      message: data.message || 'Your table reservation request has been received!',
    };
  },

  async getReservations(): Promise<Reservation[]> {
    const data = await safeFetchJson<any>(`${API_BASE}/reservations`, {
      headers: { ...getAuthHeader() },
    });
    return data.data || [];
  },

  async updateReservationStatus(id: string, status: Reservation['status']): Promise<Reservation> {
    const data = await safeFetchJson<any>(`${API_BASE}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
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
    const data = await safeFetchJson<any>(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgPayload),
    });
    return { message: data.message || 'Thank you! Your message has been sent.' };
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const data = await safeFetchJson<any>(`${API_BASE}/contact`, {
      headers: { ...getAuthHeader() },
    });
    return data.data || [];
  },

  async markMessageRead(id: string): Promise<ContactMessage> {
    const data = await safeFetchJson<any>(`${API_BASE}/contact/${id}/read`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });
    return data.data;
  },

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ message: string }> {
    const data = await safeFetchJson<any>(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return { message: data.message || 'Thank you for subscribing!' };
  },

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const data = await safeFetchJson<any>(`${API_BASE}/newsletter`, {
      headers: { ...getAuthHeader() },
    });
    return data.data || [];
  },

  // Blog
  async getBlogPosts(all?: boolean): Promise<BlogPost[]> {
    try {
      const data = await safeFetchJson<any>(`${API_BASE}/blog${all ? '?all=true' : ''}`);
      return data.data || [];
    } catch {
      return [];
    }
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    const data = await safeFetchJson<any>(`${API_BASE}/blog/${encodeURIComponent(slug)}`);
    return data.data;
  },

  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const data = await safeFetchJson<any>(`${API_BASE}/blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(post),
    });
    return data.data;
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const data = await safeFetchJson<any>(`${API_BASE}/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    return data.data;
  },

  async deleteBlogPost(id: string): Promise<void> {
    await safeFetchJson<any>(`${API_BASE}/blog/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
  },

  // Gallery
  async getGalleryImages(): Promise<GalleryImage[]> {
    try {
      const data = await safeFetchJson<any>(`${API_BASE}/gallery`);
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
      return FALLBACK_GALLERY_IMAGES;
    } catch {
      return FALLBACK_GALLERY_IMAGES;
    }
  },

  async createGalleryImage(img: Partial<GalleryImage>): Promise<GalleryImage> {
    const data = await safeFetchJson<any>(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(img),
    });
    return data.data;
  },

  async deleteGalleryImage(id: string): Promise<void> {
    await safeFetchJson<any>(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
  },

  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const data = await safeFetchJson<any>(`${API_BASE}/dashboard/stats`, {
      headers: { ...getAuthHeader() },
    });
    return data.data;
  },

  async resetSeed(): Promise<void> {
    await safeFetchJson<any>(`${API_BASE}/seed/reset`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
  },
};
