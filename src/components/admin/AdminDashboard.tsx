import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  Order,
  Reservation,
  ContactMessage,
  NewsletterSubscriber,
  BlogPost,
  GalleryImage,
  DashboardStats,
  AdminUser,
} from '../../types/index.js';
import { api } from '../../services/api.js';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  MessageSquare,
  Mail,
  BookOpen,
  Image as ImageIcon,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
} from 'lucide-react';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onBackToSite: () => void;
}

export function AdminDashboard({ user, onLogout, onBackToSite }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'menu' | 'orders' | 'reservations' | 'messages' | 'newsletter' | 'blog' | 'gallery'
  >('overview');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');

  // New Item Form State
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 3.50,
    category: 'Coffee & Espresso',
    image: '/images/coffee.jpg',
    featured: false,
    available: true,
  });

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        statsData,
        menuData,
        ordersData,
        resData,
        msgData,
        subData,
        blogData,
        galData,
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getMenuItems(),
        api.getOrders(),
        api.getReservations(),
        api.getContactMessages(),
        api.getNewsletterSubscribers(),
        api.getBlogPosts(true),
        api.getGalleryImages(),
      ]);

      setStats(statsData);
      setMenuItems(menuData);
      setOrders(ordersData);
      setReservations(resData);
      setMessages(msgData);
      setSubscribers(subData);
      setBlogPosts(blogData);
      setGalleryImages(galData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Menu Handlers
  const handleSaveNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createMenuItem(newItem);
      setMenuItems([created, ...menuItems]);
      setIsNewItemModalOpen(false);
      setNewItem({
        name: '',
        description: '',
        price: 3.50,
        category: 'Coffee & Espresso',
        image: '/images/coffee.jpg',
        featured: false,
        available: true,
      });
      showToast('Menu item added successfully!');
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create item', 'error');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.deleteMenuItem(id);
      setMenuItems(menuItems.filter((i) => i.id !== id));
      showToast('Menu item removed');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      const updated = await api.updateMenuItem(item.id, { available: !item.available });
      setMenuItems(menuItems.map((i) => (i.id === item.id ? updated : i)));
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  // Order Handlers
  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Order status updated to ${status}`);
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Reservation Handlers
  const handleReservationStatusChange = async (resId: string, status: Reservation['status']) => {
    try {
      const updated = await api.updateReservationStatus(resId, status);
      setReservations(reservations.map((r) => (r.id === resId ? updated : r)));
      showToast(`Reservation marked as ${status}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update reservation', 'error');
    }
  };

  // Message Handlers
  const handleMarkMessageRead = async (msgId: string) => {
    try {
      const updated = await api.markMessageRead(msgId);
      setMessages(messages.map((m) => (m.id === msgId ? updated : m)));
      showToast('Message marked as read');
    } catch (err: any) {
      showToast(err.message || 'Failed to mark message read', 'error');
    }
  };

  // Reset database seed
  const handleResetSeed = async () => {
    try {
      await api.resetSeed();
      await loadAllData();
      showToast('Database reset to defaults successfully');
    } catch (err: any) {
      showToast(err.message || 'Reset failed', 'error');
    }
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF4ED] text-[#2C1810]">
      {/* Top Bar */}
      <header className="bg-[#EFE7DE] border-b border-[#DFCFC0] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <CafeLeafIcon className="w-6 h-6 text-[#734A2E]" />
          <div>
            <h1 className="font-serif text-lg font-bold text-[#2C1810]">
              Café Management Console
            </h1>
            <p className="text-[11px] text-[#7A6150]">
              Logged in as <span className="font-semibold">{user.name}</span> ({user.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#6B4226] hover:bg-[#FAF4ED] border border-[#DFCFC0] transition-colors"
          >
            View Live Site
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {toastMsg && (
        <div className={`py-2 px-4 text-center text-xs font-semibold ${toastMsg.type === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {toastMsg.text}
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-4 border-b border-[#E3D7C9] scrollbar-none mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'menu', label: `Menu (${menuItems.length})`, icon: UtensilsCrossed },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'reservations', label: `Reservations (${reservations.length})`, icon: Calendar },
            { id: 'messages', label: `Messages (${messages.filter(m => !m.isRead).length} new)`, icon: MessageSquare },
            { id: 'newsletter', label: `Subscribers (${subscribers.length})`, icon: Mail },
            { id: 'blog', label: `Journal (${blogPosts.length})`, icon: BookOpen },
            { id: 'gallery', label: `Gallery (${galleryImages.length})`, icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#6B4226] text-white shadow-sm'
                    : 'text-[#664C39] hover:bg-[#F2E7DC]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-[#FAF5EF] p-5 rounded-2xl border border-[#EDE2D4]">
                <span className="text-[11px] font-semibold text-[#7A6150] uppercase tracking-wider block mb-1">
                  Total Orders
                </span>
                <span className="font-serif text-3xl font-bold text-[#2C1810]">
                  {stats?.totalOrders ?? orders.length}
                </span>
                <span className="text-[11px] text-[#6B4226] block mt-1">
                  {stats?.pendingOrders ?? 0} orders in preparation
                </span>
              </div>

              <div className="bg-[#FAF5EF] p-5 rounded-2xl border border-[#EDE2D4]">
                <span className="text-[11px] font-semibold text-[#7A6150] uppercase tracking-wider block mb-1">
                  Revenue
                </span>
                <span className="font-serif text-3xl font-bold text-[#2C1810] tabular-nums">
                  ${stats?.totalRevenue ?? 0}
                </span>
                <span className="text-[11px] text-emerald-800 block mt-1">Gross sales</span>
              </div>

              <div className="bg-[#FAF5EF] p-5 rounded-2xl border border-[#EDE2D4]">
                <span className="text-[11px] font-semibold text-[#7A6150] uppercase tracking-wider block mb-1">
                  Table Bookings
                </span>
                <span className="font-serif text-3xl font-bold text-[#2C1810]">
                  {stats?.pendingReservations ?? reservations.length}
                </span>
                <span className="text-[11px] text-[#6B4226] block mt-1">Pending approval</span>
              </div>

              <div className="bg-[#FAF5EF] p-5 rounded-2xl border border-[#EDE2D4]">
                <span className="text-[11px] font-semibold text-[#7A6150] uppercase tracking-wider block mb-1">
                  Subscribers
                </span>
                <span className="font-serif text-3xl font-bold text-[#2C1810]">
                  {stats?.totalSubscribers ?? subscribers.length}
                </span>
                <span className="text-[11px] text-[#6B4226] block mt-1">Active mailing list</span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-8 bg-[#FAF5EF] rounded-2xl border border-[#EDE2D4] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#6B4226] hover:underline"
                  >
                    View All Orders
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 5).map((o) => (
                    <div
                      key={o.id}
                      className="p-3.5 bg-[#FAF4ED] rounded-xl border border-[#EDE2D4] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2C1810] font-mono">{o.orderNumber}</span>
                          <span className="font-semibold text-[#5A3F2F]">{o.customerName}</span>
                          <span className="text-[#8F7461]">({o.orderType})</span>
                        </div>
                        <p className="text-[#7A6150] text-[11px] mt-0.5">
                          {o.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-[#2C1810] tabular-nums block">
                          ${o.total.toFixed(2)}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Tools */}
              <div className="lg:col-span-4 bg-[#FAF5EF] rounded-2xl border border-[#EDE2D4] p-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#2C1810]">System Utilities</h3>
                <p className="text-xs text-[#6B513E] leading-relaxed">
                  Reset the database to the initial photo-aligned seed catalog matching the reference image.
                </p>
                <button
                  onClick={handleResetSeed}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#D5C2B1] text-xs font-bold text-[#6B4226] hover:bg-[#F2E7DC] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Database Seed</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F7461]" />
                <input
                  type="text"
                  placeholder="Filter menu..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white border border-[#D8C7B5] focus:outline-none"
                />
              </div>

              <button
                onClick={() => setIsNewItemModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#6B4226] hover:bg-[#52331B] shadow-sm uppercase tracking-wider cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Menu Item</span>
              </button>
            </div>

            <div className="bg-[#FAF5EF] rounded-2xl border border-[#EDE2D4] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EFE7DE] border-b border-[#EDE2D4] text-[#6B513E] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Featured</th>
                      <th className="py-3 px-4">Available</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE2D4]">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF4ED] transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#F2E7DC] shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#2C1810] block">{item.name}</span>
                            <span className="text-[#8C7260] text-[11px] line-clamp-1 max-w-xs">
                              {item.description}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#5C4033]">{item.category}</td>
                        <td className="py-3 px-4 font-bold text-[#2C1810] tabular-nums">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.featured
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {item.featured ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleAvailable(item)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                              item.available
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.available ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-[#FAF5EF] rounded-2xl border border-[#EDE2D4] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EFE7DE] border-b border-[#EDE2D4] text-[#6B513E] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Type & Address</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE2D4]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF4ED] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#2C1810]">
                          {o.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#2C1810] block">{o.customerName}</span>
                          <span className="text-[#8C7260] text-[11px]">{o.phone} · {o.email}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-[#5A3F2F] uppercase text-[10px] block">
                            {o.orderType}
                          </span>
                          {o.deliveryAddress && (
                            <span className="text-[#7A6150] text-[11px] line-clamp-1">
                              {o.deliveryAddress}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5 text-[11px] text-[#5C4033]">
                            {o.items.map((it, idx) => (
                              <div key={idx}>
                                {it.quantity}x {it.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#2C1810] tabular-nums">
                          ${o.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleOrderStatusChange(o.id, e.target.value as any)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="bg-[#FAF5EF] rounded-2xl border border-[#EDE2D4] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EFE7DE] border-b border-[#EDE2D4] text-[#6B513E] uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Special Request</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE2D4]">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-[#FAF4ED] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#2C1810] block">{res.name}</span>
                        <span className="text-[#8C7260] text-[11px]">{res.phone} · {res.email}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#5C4033]">
                        {res.date} at {res.time}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#2C1810]">{res.guests} People</td>
                      <td className="py-3 px-4 text-[#7A6150] text-[11px] max-w-xs">
                        {res.specialRequest || 'None'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            res.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleReservationStatusChange(res.id, 'Confirmed')}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleReservationStatusChange(res.id, 'Cancelled')}
                          className="px-2.5 py-1 text-[11px] font-bold text-rose-800 hover:bg-rose-50 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all ${
                  m.isRead ? 'bg-[#FAF5EF] border-[#EDE2D4]' : 'bg-[#FAF4ED] border-[#C8A285] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2C1810] text-sm">{m.name}</span>
                    <span className="text-[#8C7260] text-xs">({m.email} {m.phone ? `· ${m.phone}` : ''})</span>
                    {!m.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6B4226] text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8C7260]">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-[#4A3223] mb-1 font-serif">
                  Subject: {m.subject}
                </h4>
                <p className="text-xs text-[#5C4033] leading-relaxed mb-3">{m.message}</p>
                {!m.isRead && (
                  <button
                    onClick={() => handleMarkMessageRead(m.id)}
                    className="text-[11px] font-bold text-[#6B4226] hover:underline"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: NEWSLETTER */}
        {activeTab === 'newsletter' && (
          <div className="bg-[#FAF5EF] rounded-2xl border border-[#EDE2D4] p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">
              Subscribers ({subscribers.length})
            </h3>
            <div className="divide-y divide-[#EDE2D4]">
              {subscribers.map((s) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-[#2C1810]">{s.email}</span>
                  <span className="text-[#8C7260]">
                    Joined: {new Date(s.subscribedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: BLOG */}
        {activeTab === 'blog' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((p) => (
                <div key={p.id} className="bg-[#FAF5EF] p-5 rounded-2xl border border-[#EDE2D4] space-y-2 text-xs">
                  <span className="text-[10px] text-[#7A6150] font-semibold uppercase">{p.author}</span>
                  <h4 className="font-serif text-base font-bold text-[#2C1810]">{p.title}</h4>
                  <p className="text-[#6B513E] line-clamp-2">{p.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((g) => (
              <div key={g.id} className="bg-[#FAF5EF] p-3 rounded-2xl border border-[#EDE2D4] text-xs">
                <img src={g.imageUrl} alt={g.title} className="w-full aspect-[4/3] object-cover rounded-xl mb-2" />
                <span className="font-bold text-[#2C1810] block">{g.title}</span>
                <span className="text-[#7A6150]">{g.category}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal: Add Menu Item */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF4ED] border border-[#DFCFC0] rounded-3xl p-6 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-[#2C1810] mb-4">
              Add New Menu Item
            </h3>

            <form onSubmit={handleSaveNewItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#4A3223] mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hazelnut Flat White"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D8C7B5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3223] mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D8C7B5] focus:outline-none"
                >
                  <option value="Coffee & Espresso">Coffee & Espresso</option>
                  <option value="Cold Brew & Iced">Cold Brew & Iced</option>
                  <option value="Fresh Bakery">Fresh Bakery</option>
                  <option value="Desserts & Cakes">Desserts & Cakes</option>
                  <option value="Gourmet Sandwiches">Gourmet Sandwiches</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#4A3223] mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D8C7B5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3223] mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tasting notes, preparation details..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D8C7B5] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#4A3223]">
                  <input
                    type="checkbox"
                    checked={newItem.featured}
                    onChange={(e) => setNewItem({ ...newItem, featured: e.target.checked })}
                    className="rounded text-[#6B4226]"
                  />
                  <span>Show on Homepage Highlights</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full text-xs font-semibold text-[#6B513E] border border-[#D8C7B5] hover:bg-[#EFE5D8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full text-xs font-bold tracking-wider text-white bg-[#6B4226] hover:bg-[#52331B] uppercase shadow-sm cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
