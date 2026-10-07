import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext.js';
import { TopBar } from './components/layout/TopBar.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { Hero } from './components/home/Hero.js';
import { WhyChooseUs } from './components/home/WhyChooseUs.js';
import { MenuHighlights } from './components/home/MenuHighlights.js';
import { VisitSection } from './components/home/VisitSection.js';
import { AboutView } from './components/pages/AboutView.js';
import { MenuView } from './components/pages/MenuView.js';
import { OrderView } from './components/pages/OrderView.js';
import { GalleryView } from './components/pages/GalleryView.js';
import { BlogView } from './components/pages/BlogView.js';
import { ContactView } from './components/pages/ContactView.js';
import { CartDrawer } from './components/common/CartDrawer.js';
import { ReservationModal } from './components/common/ReservationModal.js';
import { AdminLoginModal } from './components/admin/AdminLoginModal.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { AdminUser } from './types/index.js';
import { api } from './services/api.js';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem('cafe_admin_token');
    if (token) {
      api
        .getMe()
        .then((user) => setAdminUser(user))
        .catch(() => {
          localStorage.removeItem('cafe_admin_token');
          setAdminUser(null);
        });
    }
  }, []);

  const [legalModal, setLegalModal] = useState<{ title: string; text: string } | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    if (adminUser) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLogoutAdmin = () => {
    api.logout();
    setAdminUser(null);
    setCurrentView('home');
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF4ED] text-[#2C1810]">
        {/* Render Admin Dashboard when in admin view and authenticated */}
        {currentView === 'admin' && adminUser ? (
          <AdminDashboard
            user={adminUser}
            onLogout={handleLogoutAdmin}
            onBackToSite={() => handleNavigate('home')}
          />
        ) : (
          <>
            {/* Customer Website Top Bar & Navbar */}
            <TopBar />
            <Navbar
              currentView={currentView}
              onNavigate={handleNavigate}
              onOpenReservation={() => setIsReservationOpen(true)}
            />

            {/* Main Content Area */}
            <main className="flex-grow">
              {currentView === 'home' && (
                <>
                  {/* Hero Section matching screenshot */}
                  <Hero onViewMenu={() => handleNavigate('menu')} />

                  {/* Why Choose Us Section matching screenshot */}
                  <WhyChooseUs
                    onLearnMore={(topic) => {
                      if (topic === 'food' || topic === 'coffee') {
                        handleNavigate('menu');
                      } else {
                        handleNavigate('about');
                      }
                    }}
                  />

                  {/* Our Menu Highlights matching screenshot */}
                  <MenuHighlights onViewFullMenu={() => handleNavigate('menu')} />

                  {/* Visit Us Today matching screenshot */}
                  <VisitSection onFindLocation={() => handleNavigate('contact')} />
                </>
              )}

              {currentView === 'about' && (
                <AboutView
                  onExploreMenu={() => handleNavigate('menu')}
                  onBookTable={() => setIsReservationOpen(true)}
                />
              )}

              {currentView === 'menu' && (
                <MenuView onGoToOrder={() => handleNavigate('order')} />
              )}

              {currentView === 'order' && (
                <OrderView onBackToMenu={() => handleNavigate('menu')} />
              )}

              {currentView === 'gallery' && <GalleryView />}

              {currentView === 'blog' && <BlogView />}

              {currentView === 'contact' && <ContactView />}
            </main>

            {/* Customer Website Footer matching screenshot */}
            <Footer
              onNavigateAdmin={handleOpenAdmin}
              onOpenPrivacy={() =>
                setLegalModal({
                  title: 'Privacy Policy',
                  text: 'At our café, we value and respect your privacy. Any personal details provided for table reservations, online pickup/delivery, or newsletter subscriptions are strictly used for hospitality services and are never shared with third parties.',
                })
              }
              onOpenTerms={() =>
                setLegalModal({
                  title: 'Terms & Conditions',
                  text: 'All coffees, Viennoiseries, and meals are freshly handcrafted. Orders placed online are prepared upon confirmation. Cancellations for table reservations can be requested at any time prior to arrival.',
                })
              }
            />
          </>
        )}

        {/* Legal Modal */}
        {legalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#FAF4ED] border border-[#DFCFC0] rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="font-serif text-xl font-bold text-[#2C1810] mb-2">{legalModal.title}</h3>
              <p className="text-xs text-[#6B513E] leading-relaxed mb-6">{legalModal.text}</p>
              <button
                onClick={() => setLegalModal(null)}
                className="w-full py-2.5 rounded-full text-xs font-bold text-white bg-[#6B4226] uppercase"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Global Slide-out Cart Drawer */}
        <CartDrawer onProceedToCheckout={() => handleNavigate('order')} />

        {/* Global Reservation Modal */}
        <ReservationModal
          isOpen={isReservationOpen}
          onClose={() => setIsReservationOpen(false)}
        />

        {/* Global Admin Login Modal */}
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={(user) => {
            setAdminUser(user);
            setCurrentView('admin');
          }}
        />
      </div>
    </CartProvider>
  );
}
