import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Calendar } from 'lucide-react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import { useCart } from '../../context/CartContext.js';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenReservation: () => void;
}

export function Navbar({ currentView, onNavigate, onOpenReservation }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'menu', label: 'MENU' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'blog', label: 'BLOG' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF4ED]/95 backdrop-blur-md border-b border-[#EDE2D4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group focus:outline-none flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#EFE4D8] border border-[#DFCFC0] flex items-center justify-center text-[#6B4226] group-hover:bg-[#E8D9C9] transition-colors shrink-0">
            <CafeLeafIcon className="w-5 h-5 text-[#6B4226]" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2B1810] group-hover:text-[#6B4226] transition-colors">
              CAFÉ
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.24em] text-[#7A5034] mt-0.5 uppercase">
              Coffee & More
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-xs font-semibold tracking-wider text-[#4A3022]">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-colors uppercase relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-[#6B4226] font-bold'
                    : 'text-[#4A3022] hover:text-[#6B4226]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6B4226] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Reservation button + Cart + Order Online */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Reservation quick trigger */}
          <button
            onClick={onOpenReservation}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5A3822] hover:text-[#3D2314] hover:bg-[#F2E8DC] rounded-lg transition-colors border border-[#DFCFC0]"
            title="Book a Table"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>RESERVE</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#4A3022] hover:text-[#6B4226] hover:bg-[#F2E8DC] rounded-full transition-colors focus:outline-none"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6B4226] text-[#FAF4ED] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* Order Online Button (Screenshot Exact Style: rounded brown capsule button) */}
          <button
            onClick={() => onNavigate('order')}
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-[#FFF8F0] bg-[#6B4226] hover:bg-[#57351E] shadow-sm active:scale-95 transition-all uppercase whitespace-nowrap"
          >
            ORDER ONLINE
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#4A3022] hover:text-[#6B4226] rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF4ED] border-b border-[#EDE2D4] px-5 py-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left text-sm font-semibold tracking-wider uppercase py-1.5 transition-colors ${
                    isActive ? 'text-[#6B4226] font-bold pl-2 border-l-2 border-[#6B4226]' : 'text-[#4A3022]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#EDE2D4] flex flex-col gap-2.5">
            <button
              onClick={() => {
                onOpenReservation();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#D5C2B1] text-xs font-bold text-[#5A3822] hover:bg-[#F2E8DC] transition-colors uppercase"
            >
              <Calendar className="w-4 h-4" />
              <span>RESERVE A TABLE</span>
            </button>
            <button
              onClick={() => handleLinkClick('order')}
              className="w-full py-3 rounded-full text-xs font-bold tracking-wider text-[#FFF8F0] bg-[#6B4226] hover:bg-[#57351E] transition-colors uppercase shadow-sm"
            >
              ORDER ONLINE
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
