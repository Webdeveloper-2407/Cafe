import React from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';

interface VisitSectionProps {
  onFindLocation: () => void;
}

export function VisitSection({ onFindLocation }: VisitSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF4ED] border-b border-[#ECE0D3]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, leaf icon, description, and button */}
          <div className="lg:col-span-5 text-left pr-0 lg:pr-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#2C1810] tracking-tight leading-tight mb-2">
              Visit Us Today
            </h2>

            <div className="mb-4">
              <CafeLeafIcon className="w-6 h-6 text-[#734A2E]" />
            </div>

            <p className="text-xs sm:text-sm text-[#664C39] leading-relaxed mb-8 font-normal max-w-sm">
              We&apos;d love to welcome you to our café.
              <br />
              Come for the coffee, stay for the good vibes!
            </p>

            <button
              onClick={onFindLocation}
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#54331B] shadow-sm active:scale-95 transition-all uppercase cursor-pointer"
            >
              FIND OUR LOCATION
            </button>
          </div>

          {/* Right Column: Three-image gallery arrangement matching screenshot */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {/* Image 1: Café Exterior */}
              <div className="aspect-[3/4.6] rounded-xl overflow-hidden shadow-sm border border-[#E8DDCE] bg-[#F2E7DC] group">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                  alt="Charming café exterior storefront"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero.jpg';
                  }}
                />
              </div>

              {/* Image 2: Barista Milk Pouring Craft */}
              <div className="aspect-[3/4.6] rounded-xl overflow-hidden shadow-sm border border-[#E8DDCE] bg-[#F2E7DC] group">
                <img
                  src="/images/barista.jpg"
                  alt="Barista pouring delicate latte art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/coffee.jpg';
                  }}
                />
              </div>

              {/* Image 3: Cozy Interior Seating */}
              <div className="aspect-[3/4.6] rounded-xl overflow-hidden shadow-sm border border-[#E8DDCE] bg-[#F2E7DC] group">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                  alt="Cozy warm café wooden tables"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero.jpg';
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
