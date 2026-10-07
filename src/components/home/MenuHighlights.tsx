import React, { useEffect, useState } from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import { MenuItem } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useCart } from '../../context/CartContext.js';
import { Plus, Check } from 'lucide-react';

interface MenuHighlightsProps {
  onViewFullMenu: () => void;
}

const DEFAULT_HIGHLIGHTS: MenuItem[] = [
  {
    id: 'item_1',
    name: 'Cappuccino',
    description: 'Rich espresso balanced with velvety steamed milk foam and delicate latte art.',
    price: 3.50,
    image: '/images/coffee.jpg',
    category: 'Coffee & Espresso',
    available: true,
    featured: true,
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'item_2',
    name: 'Chocolate Cake',
    description: 'Multi-layered rich Belgian dark chocolate sponge topped with fresh blueberries.',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    category: 'Desserts & Cakes',
    available: true,
    featured: true,
    createdAt: '2026-03-01T08:05:00Z',
  },
  {
    id: 'item_3',
    name: 'Chicken Sandwich',
    description: 'Grilled herb-marinated chicken breast, crispy lettuce, sliced tomato on toasted ciabatta.',
    price: 6.50,
    image: '/images/sandwich.jpg',
    category: 'Gourmet Sandwiches',
    available: true,
    featured: true,
    createdAt: '2026-03-01T08:10:00Z',
  },
  {
    id: 'item_4',
    name: 'Iced Latte',
    description: 'Double shot of signature espresso poured over cold milk and crystal ice cubes.',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    category: 'Cold Brew & Iced',
    available: true,
    featured: true,
    createdAt: '2026-03-01T08:15:00Z',
  },
];

export function MenuHighlights({ onViewFullMenu }: MenuHighlightsProps) {
  const [items, setItems] = useState<MenuItem[]>(DEFAULT_HIGHLIGHTS);
  const [loading, setLoading] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    api
      .getMenuItems({ featured: true })
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setItems(data.slice(0, 4));
        }
      })
      .catch((err) => {
        console.error('Failed to load menu highlights from API, using defaults:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickAdd = (item: MenuItem) => {
    addToCart(item, 1);
    setAddedId(item.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1200);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF4ED] border-b border-[#ECE0D3]">
      <div className="max-w-6xl mx-auto text-center">
        {/* Decorative Icon */}
        <div className="flex justify-center mb-3">
          <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] tracking-tight mb-2">
          Our Menu Highlights
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#664C39] mb-12 font-normal">
          Handcrafted with love, made for you.
        </p>

        {/* Four-Column Card Layout matching the screenshot */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse flex flex-col items-center">
                <div className="w-full aspect-square bg-[#E8DDD1] rounded-2xl mb-4" />
                <div className="h-4 bg-[#E8DDD1] rounded w-24 mb-2" />
                <div className="h-3 bg-[#E8DDD1] rounded w-12" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mb-12">
            {items.map((item) => {
              const isJustAdded = addedId === item.id;
              return (
                <div
                  key={item.id}
                  className="group bg-[#FAF4ED] p-3 rounded-2xl border border-[#EDE2D5] hover:border-[#DFCFC0] hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
                >
                  {/* Square Image container with soft rounded corners */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-[#F2E7DC]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Quick Add Overlay Button */}
                    <button
                      onClick={() => handleQuickAdd(item)}
                      aria-label={`Add ${item.name} to order`}
                      className={`absolute bottom-2.5 right-2.5 p-2 rounded-full shadow-md transition-all duration-200 ${
                        isJustAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#6B4226] text-white hover:bg-[#52331B] opacity-90 group-hover:opacity-100'
                      }`}
                    >
                      {isJustAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C1810] mb-1">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <p className="text-xs sm:text-sm font-semibold text-[#664C39] tabular-nums">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* "VIEW FULL MENU" Button matching screenshot */}
        <div className="flex justify-center">
          <button
            onClick={onViewFullMenu}
            className="inline-flex items-center justify-center px-7 py-2.5 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#54331B] shadow-sm active:scale-95 transition-all uppercase cursor-pointer"
          >
            VIEW FULL MENU
          </button>
        </div>
      </div>
    </section>
  );
}
