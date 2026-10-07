import React from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';

interface WhyChooseUsProps {
  onLearnMore: (topic: string) => void;
}

export function WhyChooseUs({ onLearnMore }: WhyChooseUsProps) {
  const cards = [
    {
      id: 'coffee',
      image: '/images/coffee.jpg',
      alt: 'Artisan brewed cappuccino',
      title: 'Quality Coffee',
      description: 'We source the finest beans and brew every cup to perfection.',
    },
    {
      id: 'food',
      image: '/images/cheesecake.jpg',
      alt: 'Freshly baked berry cheesecake',
      title: 'Fresh & Delicious',
      description: 'From pastries to meals, everything is made fresh daily.',
    },
    {
      id: 'atmosphere',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      alt: 'Warm and cozy café interior',
      title: 'Cozy Atmosphere',
      description: 'A warm and welcoming space to relax, work, or catch up.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF4ED] border-b border-[#ECE0D3]">
      <div className="max-w-6xl mx-auto text-center">
        {/* Decorative Leaf Icon */}
        <div className="flex justify-center mb-3">
          <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
        </div>

        {/* Section Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] tracking-tight mb-3">
          Why Choose Us?
        </h2>

        {/* Supporting description */}
        <p className="text-xs sm:text-sm text-[#664C39] max-w-md mx-auto mb-14 leading-relaxed font-normal">
          We&apos;re passionate about quality, comfort, and creating memorable moments for every guest.
        </p>

        {/* Three Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Card Image Container (Square aspect ratio matching screenshot) */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 shadow-sm border border-[#E8DCCE] bg-[#F2E7DC]">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C1810] mb-2.5">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#6B513E] leading-relaxed max-w-xs mb-5 flex-grow font-normal">
                {card.description}
              </p>

              {/* Button */}
              <button
                onClick={() => onLearnMore(card.id)}
                className="inline-flex items-center justify-center px-6 py-2 rounded-full text-[11px] font-bold tracking-wider text-[#FFF8F0] bg-[#6B4226] hover:bg-[#54331B] active:scale-95 transition-all uppercase shadow-sm cursor-pointer"
              >
                LEARN MORE
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
