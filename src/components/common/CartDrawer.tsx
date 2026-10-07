import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    deliveryFee,
    total,
    orderType,
    setOrderType,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF4ED] border-l border-[#E3D7C9] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#E3D7C9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#6B4226]" />
              <h2 className="font-serif text-xl font-bold text-[#2C1810]">Your Order</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-[#7A5B46] hover:text-[#2C1810] hover:bg-[#EFE5D8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fulfillment Toggle */}
          <div className="px-6 py-3 bg-[#F2E7DC] border-b border-[#E3D7C9]">
            <div className="flex items-center p-1 bg-[#FAF4ED] rounded-xl border border-[#DFD3C4]">
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  orderType === 'pickup'
                    ? 'bg-[#6B4226] text-white shadow-sm'
                    : 'text-[#664C39] hover:text-[#2C1810]'
                }`}
              >
                Pickup (Ready in 15m)
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  orderType === 'delivery'
                    ? 'bg-[#6B4226] text-white shadow-sm'
                    : 'text-[#664C39] hover:text-[#2C1810]'
                }`}
              >
                Delivery (+$3.50)
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#7A6150] space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#BFA896] stroke-1" />
                <p className="font-serif text-lg font-semibold text-[#3D2619]">Your bag is empty</p>
                <p className="text-xs max-w-xs text-[#8A7160]">
                  Explore our handcrafted coffees, hot pastries, and desserts.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center gap-3 bg-[#FAF5EF] p-3 rounded-2xl border border-[#EDE2D4]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#F2E7DC] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-[#2C1810] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#7A5B46] tabular-nums font-semibold">
                      ${item.price.toFixed(2)}
                    </p>
                    {item.specialInstructions && (
                      <p className="text-[11px] text-[#917460] italic truncate">
                        &quot;{item.specialInstructions}&quot;
                      </p>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-[#D5C2B1] rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="p-1 hover:bg-[#F2E8DC] text-[#6B4226] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#2C1810] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="p-1 hover:bg-[#F2E8DC] text-[#6B4226] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="p-1.5 text-[#A38876] hover:text-rose-700 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Totals */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E3D7C9] bg-[#FAF5EF] space-y-3">
              <div className="space-y-1.5 text-xs text-[#6B513E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C1810] tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (8%)</span>
                  <span className="font-semibold text-[#2C1810] tabular-nums">${tax.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-[#2C1810] tabular-nums">${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#E3D7C9] flex justify-between text-sm font-bold text-[#2C1810]">
                  <span>Total</span>
                  <span className="tabular-nums font-serif text-base text-[#6B4226]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-3 rounded-full text-xs font-semibold text-[#7A5B46] hover:bg-[#EFE5D8] transition-colors border border-[#D8C7B5]"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] active:scale-95 transition-all uppercase shadow-md cursor-pointer"
                >
                  <span>CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
