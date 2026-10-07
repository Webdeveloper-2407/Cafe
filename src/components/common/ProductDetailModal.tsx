import React, { useState } from 'react';
import { MenuItem } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { X, Plus, Minus, Check, Clock, Flame, ShieldAlert, ShoppingBag } from 'lucide-react';
import { CafeLeafIcon } from './CafeLeafIcon.js';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onOpenCart?: () => void;
}

export function ProductDetailModal({ item, onClose, onOpenCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  if (!item) return null;

  const handleAddToCart = () => {
    addToCart(item, quantity, specialInstructions || undefined);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      if (onOpenCart) onOpenCart();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#FAF4ED] border border-[#DFCFC0] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#FAF4ED]/80 hover:bg-[#FAF4ED] text-[#4A3223] hover:text-[#2C1810] shadow-sm transition-colors border border-[#DFCFC0]"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Header image with aspect ratio and rounded container */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-sm border border-[#E5D7C7] bg-[#F2E7DC]">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {item.featured && (
              <span className="absolute top-3 left-3 bg-[#6B4226] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Featured Favorite
              </span>
            )}
            <span
              className={`absolute bottom-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${
                item.available
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {item.available ? 'Fresh & Available Today' : 'Sold Out for the Day'}
            </span>
          </div>

          {/* Title & Price Header */}
          <div className="border-b border-[#E8DDCE] pb-5">
            <div className="flex items-center gap-1.5 text-xs text-[#7A5034] font-semibold uppercase tracking-wider mb-1">
              <CafeLeafIcon className="w-4 h-4 text-[#7A5034]" />
              <span>{item.category}</span>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                {item.name}
              </h2>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#6B4226] tabular-nums whitespace-nowrap">
                ${item.price.toFixed(2)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5C4033] leading-relaxed mt-3">
              {item.fullDescription || item.description}
            </p>
          </div>

          {/* Quick Specs: Preparation Time & Calories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {item.preparationTime && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF5EF] border border-[#EDE2D4]">
                <Clock className="w-4 h-4 text-[#6B4226] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#8C7260] uppercase block">Prep Time</span>
                  <span className="font-semibold text-[#2C1810]">{item.preparationTime}</span>
                </div>
              </div>
            )}
            {item.calories && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF5EF] border border-[#EDE2D4]">
                <Flame className="w-4 h-4 text-[#6B4226] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#8C7260] uppercase block">Calories</span>
                  <span className="font-semibold text-[#2C1810] tabular-nums">{item.calories} kcal</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF5EF] border border-[#EDE2D4] col-span-2 sm:col-span-1">
              <ShoppingBag className="w-4 h-4 text-[#6B4226] shrink-0" />
              <div>
                <span className="text-[10px] text-[#8C7260] uppercase block">Fulfillment</span>
                <span className="font-semibold text-[#2C1810]">Pickup or Delivery</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A3223] mb-2">
                Ingredients & Sourcing
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF5EF] border border-[#DFD3C4] text-[11px] text-[#5A3F2F]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block text-[11px]">Allergen Advisory</span>
                <span className="text-amber-800 text-[11px]">{item.allergens.join(', ')}</span>
              </div>
            </div>
          )}

          {/* Special Instructions Input */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3223] mb-1.5">
              Custom Preparation Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra hot, oat milk substitute, light ice, dressing on the side..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-xs text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#6B4226]"
            />
          </div>

          {/* Actions: Quantity Stepper + Add to Cart + Continue Shopping */}
          <div className="pt-2 border-t border-[#E8DDCE] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs font-bold text-[#4A3223]">Quantity:</span>
              <div className="flex items-center border border-[#D5C2B1] rounded-xl bg-white overflow-hidden shadow-inner">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-[#F2E8DC] text-[#6B4226] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold text-[#2C1810] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-[#F2E8DC] text-[#6B4226] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-full text-xs font-semibold text-[#6B513E] hover:bg-[#EFE5D8] border border-[#D8C7B5] transition-colors"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                disabled={!item.available || added}
                onClick={handleAddToCart}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-xs font-bold tracking-widest text-white uppercase shadow-md active:scale-95 transition-all cursor-pointer ${
                  added
                    ? 'bg-emerald-700'
                    : 'bg-[#6B4226] hover:bg-[#52331B] disabled:opacity-50'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order · ${(item.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
