import React from 'react';
import heroSpreadImage from '../../assets/images/hero_cafe_spread_1791337542851.jpg';
import coffeeCupImage from '../../assets/images/cafe_feature_coffee_1791337560176.jpg';

interface HeroProps {
  onViewMenu: () => void;
}

export function Hero({ onViewMenu }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#FAF3EC] border-b border-[#EBE0D2]">
      {/* Tabletop background with soft ambient warmth */}
      <div className="relative min-h-[540px] md:min-h-[580px] lg:min-h-[640px] flex items-center justify-center py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        
        {/* Decorative corner flatlay elements matching reference composition */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          {/* Top-Left: Coffee Cup with latte art on saucer */}
          <div className="absolute -top-8 -left-8 lg:-top-10 lg:-left-10 w-52 h-52 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-xl border-4 border-white/80 transform -rotate-12 transition-transform duration-700 hover:rotate-0">
            <img
              src="/images/coffee.jpg"
              alt="Artisan Latte Art"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Bottom-Left: Golden Flaky Croissant plate */}
          <div className="absolute -bottom-10 -left-6 lg:-bottom-12 lg:-left-8 w-56 h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-2xl border-4 border-white/80 transform rotate-6">
            <img
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
              alt="Freshly Baked Croissant"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/cheesecake.jpg';
              }}
            />
          </div>

          {/* Top-Right: Cinnamon pastry with eucalyptus leaves */}
          <div className="absolute -top-6 -right-6 lg:-top-8 lg:-right-8 w-52 h-52 lg:w-68 lg:h-68 rounded-full overflow-hidden shadow-xl border-4 border-white/80 transform rotate-12">
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
              alt="Cinnamon Swirl Pastry"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero.jpg';
              }}
            />
          </div>

          {/* Bottom-Right: Chocolate Chip Muffin */}
          <div className="absolute -bottom-8 -right-6 lg:-bottom-10 lg:-right-8 w-56 h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-2xl border-4 border-white/80 transform -rotate-6">
            <img
              src="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80"
              alt="Fresh Chocolate Chip Muffin"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/sandwich.jpg';
              }}
            />
          </div>

          {/* Center-Bottom: Roasted coffee beans bowl detail */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-md border-2 border-white/90">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"
              alt="Roasted Coffee Beans"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/coffee.jpg';
              }}
            />
          </div>
        </div>

        {/* Center Content: Exact Typography and Spacing */}
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          {/* Script Subheading */}
          <p className="font-script text-3xl sm:text-4xl text-[#785135] mb-2 sm:mb-3 tracking-wide">
            Welcome to Our Cafe
          </p>

          {/* Large Main Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold text-[#2C1810] leading-[1.12] tracking-tight mb-4 sm:mb-6">
            Good Coffee,
            <br />
            Great Moments
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-[#5E4433] leading-relaxed max-w-md mx-auto mb-8 font-normal">
            Savor handcrafted coffee, fresh pastries, and cozy vibes.
            <br className="hidden sm:inline" />
            Your perfect daily escape.
          </p>

          {/* Primary Button */}
          <div className="flex justify-center">
            <button
              onClick={onViewMenu}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#56341D] shadow-md hover:shadow-lg active:scale-95 transition-all uppercase cursor-pointer"
            >
              VIEW OUR MENU
            </button>
          </div>
        </div>
      </div>

      {/* Featured visual banner row on tablet/mobile where corner elements are hidden */}
      <div className="lg:hidden w-full pb-8 px-4">
        <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-md border border-[#E5D7C7]">
          <img
            src="/images/hero.jpg"
            alt="Artisan Breakfast Spread"
            className="w-full h-52 sm:h-64 object-cover"
          />
        </div>
      </div>
    </section>
  );
}
