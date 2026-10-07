import React from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import baristaPourImage from '../../assets/images/cafe_barista_latte_pour_1791337603225.jpg';
import coffeeImage from '../../assets/images/cafe_feature_coffee_1791337560176.jpg';

interface AboutViewProps {
  onExploreMenu: () => void;
  onBookTable: () => void;
}

export function AboutView({ onExploreMenu, onBookTable }: AboutViewProps) {
  return (
    <div className="bg-[#FAF4ED] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EBE0D2]">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-2">
            <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
          </div>
          <p className="font-script text-3xl sm:text-4xl text-[#785135] mb-2">
            Our Story & Craft
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810] tracking-tight mb-4">
            A Haven for Coffee Lovers
          </h1>
          <p className="text-xs sm:text-sm text-[#664C39] leading-relaxed">
            Founded with a deep devotion to specialty coffee roasting and artisan French baking, our café is designed as an unhurried retreat for neighborhood friends and coffee purists alike.
          </p>
        </div>

        {/* Story Section Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-[#E3D6C5]">
            <img
              src={baristaPourImage}
              alt="Artisan barista crafting coffee"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Ethical Sourcing & Micro-Lot Beans
            </h2>
            <p className="text-xs sm:text-sm text-[#664C39] leading-relaxed">
              We collaborate directly with generational family coffee farms in Ethiopia, Colombia, and Guatemala. Every bean is harvested at peak maturity and roasted in small 5kg batches to highlight delicate terroir notes — from jasmine blossoms to rich cocoa caramel.
            </p>
            <p className="text-xs sm:text-sm text-[#664C39] leading-relaxed">
              Our milk is sourced fresh from local grass-fed pasture dairies, steamed to silky microfoam at exactly 65°C to preserve natural lactose sweetness without artificial syrups.
            </p>
            <div className="pt-2">
              <button
                onClick={onExploreMenu}
                className="inline-flex items-center justify-center px-7 py-2.5 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] transition-all uppercase shadow-sm cursor-pointer"
              >
                DISCOVER OUR BLENDS
              </button>
            </div>
          </div>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#E8DDCE]">
          <div className="bg-[#FAF5EF] p-6 rounded-2xl border border-[#EDE2D4] text-center space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">Single-Origin Beans</h3>
            <p className="text-xs text-[#6B513E] leading-relaxed font-normal">
              100% Arabica shade-grown specialty varieties evaluated at 85+ SCA points.
            </p>
          </div>

          <div className="bg-[#FAF5EF] p-6 rounded-2xl border border-[#EDE2D4] text-center space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">Scratch-Made Bakery</h3>
            <p className="text-xs text-[#6B513E] leading-relaxed font-normal">
              Laminated croissants and artisanal brioche baked fresh twice daily.
            </p>
          </div>

          <div className="bg-[#FAF5EF] p-6 rounded-2xl border border-[#EDE2D4] text-center space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">Cozy Warmth</h3>
            <p className="text-xs text-[#6B513E] leading-relaxed font-normal">
              A serene wooden aesthetic designed for focus, connection, and relaxation.
            </p>
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-[#F0E6DB] p-8 sm:p-12 rounded-3xl border border-[#DFD3C4] text-center space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Experience The Café In Person
          </h2>
          <p className="text-xs sm:text-sm text-[#664C39] max-w-md mx-auto">
            Open seven days a week from 7:00 AM to 9:00 PM. Reserve your favorite corner table or stop by for a morning espresso.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={onBookTable}
              className="px-6 py-2.5 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] transition-all uppercase shadow-sm cursor-pointer"
            >
              RESERVE A TABLE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
