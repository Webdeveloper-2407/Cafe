import React, { useState } from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import { useCart } from '../../context/CartContext.js';
import { api } from '../../services/api.js';
import { Order } from '../../types/index.js';
import {
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface OrderViewProps {
  onBackToMenu: () => void;
}

export function OrderView({ onBackToMenu }: OrderViewProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    deliveryFee,
    total,
    orderType,
    setOrderType,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please enter your delivery address');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        customerName,
        email,
        phone,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        items: cart.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          specialInstructions: i.specialInstructions,
        })),
        notes,
      };

      const created = await api.createOrder(orderPayload);
      setPlacedOrder(created);
      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="bg-[#FAF4ED] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EBE0D2]">
        <div className="max-w-2xl mx-auto bg-[#FAF5EF] border border-[#DFCFC0] rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest text-[#734A2E] uppercase">
              Order Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] mt-1">
              Thank You, {placedOrder.customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#664C39] mt-2">
              Your order has been sent directly to our café baristas and kitchen.
            </p>
          </div>

          <div className="bg-[#FAF4ED] p-5 rounded-2xl border border-[#EDE2D4] text-left space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-[#E8DDCE] pb-2">
              <span className="text-[#7A6150]">Order Reference:</span>
              <span className="font-bold text-[#2C1810] font-mono">{placedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#E8DDCE] pb-2">
              <span className="text-[#7A6150]">Fulfillment:</span>
              <span className="font-semibold text-[#2C1810] uppercase">{placedOrder.orderType}</span>
            </div>
            {placedOrder.deliveryAddress && (
              <div className="flex justify-between items-start border-b border-[#E8DDCE] pb-2">
                <span className="text-[#7A6150]">Delivery Address:</span>
                <span className="font-semibold text-[#2C1810] max-w-xs text-right">
                  {placedOrder.deliveryAddress}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center border-b border-[#E8DDCE] pb-2">
              <span className="text-[#7A6150]">Status:</span>
              <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                {placedOrder.status}
              </span>
            </div>
            <div className="pt-1 space-y-1">
              <span className="font-semibold text-[#4A3223] block mb-1">Ordered Items:</span>
              {placedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[#6B513E]">
                  <span>
                    {it.quantity}x {it.name}
                  </span>
                  <span className="tabular-nums font-medium">${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[#E8DDCE] flex justify-between font-bold text-sm text-[#2C1810]">
              <span>Total Paid:</span>
              <span className="tabular-nums text-[#6B4226]">${placedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onBackToMenu}
              className="px-7 py-3 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] transition-all uppercase shadow-sm cursor-pointer"
            >
              ORDER MORE ITEMS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF4ED] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EBE0D2]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center mb-2">
            <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
          </div>
          <p className="font-script text-3xl sm:text-4xl text-[#785135] mb-2">
            Fresh & Handcrafted
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810] tracking-tight mb-3">
            Online Ordering
          </h1>
          <p className="text-xs sm:text-sm text-[#664C39] leading-relaxed">
            Order ahead for rapid in-store pickup or convenient neighborhood doorstep delivery.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 bg-[#FAF5EF] rounded-3xl border border-[#EDE2D4] p-8 space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#BFA896] mx-auto stroke-1" />
            <h2 className="font-serif text-2xl font-bold text-[#2C1810]">Your Order is Empty</h2>
            <p className="text-xs text-[#6B513E] max-w-xs mx-auto">
              Please add your favorite espresso drinks, bakery treats, or savory sandwiches from the menu to continue.
            </p>
            <button
              onClick={onBackToMenu}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] transition-all uppercase shadow-sm cursor-pointer"
            >
              BROWSE CAFÉ MENU
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Column: Customer and fulfillment form */}
            <div className="lg:col-span-7 bg-[#FAF5EF] border border-[#EDE2D4] rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Pickup vs Delivery Toggle */}
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1810] mb-3">
                  1. Choose Fulfillment
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      orderType === 'pickup'
                        ? 'border-[#6B4226] bg-[#FAF4ED] shadow-sm'
                        : 'border-[#DFCFC0] hover:bg-[#FAF4ED]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-[#6B4226]" />
                      <span className="font-serif text-sm font-bold text-[#2C1810]">Store Pickup</span>
                    </div>
                    <p className="text-[11px] text-[#7A6150]">Ready in ~15 minutes · Free</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      orderType === 'delivery'
                        ? 'border-[#6B4226] bg-[#FAF4ED] shadow-sm'
                        : 'border-[#DFCFC0] hover:bg-[#FAF4ED]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-[#6B4226]" />
                      <span className="font-serif text-sm font-bold text-[#2C1810]">Local Delivery</span>
                    </div>
                    <p className="text-[11px] text-[#7A6150]">Delivered to your door · $3.50 fee</p>
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <form id="orderForm" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                <h3 className="font-serif text-lg font-bold text-[#2C1810] pt-2">
                  2. Contact & Details
                </h3>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A3223] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#4A3223] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3223] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                  />
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="block font-semibold text-[#4A3223] mb-1">Delivery Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, apartment or suite number"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-[#4A3223] mb-1">Order Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Special delivery instructions, cutlery preferences, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                  />
                </div>
              </form>

            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div className="lg:col-span-5 bg-[#FAF5EF] border border-[#EDE2D4] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1810] mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="flex items-center gap-3 bg-[#FAF4ED] p-2.5 rounded-xl border border-[#EDE2D4]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-[#F2E7DC] shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <h4 className="font-serif font-bold text-[#2C1810] truncate">{item.name}</h4>
                        <span className="text-[#6B4226] font-semibold tabular-nums">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="p-1 text-[#7A5B46] hover:bg-[#EFE5D8] rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold tabular-nums px-1 text-[#2C1810]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="p-1 text-[#7A5B46] hover:bg-[#EFE5D8] rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="p-1 text-[#A38876] hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#E8DDCE] space-y-2 text-xs text-[#6B513E] mt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2C1810] tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span className="font-semibold text-[#2C1810] tabular-nums">${tax.toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-[#2C1810] tabular-nums">${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#E8DDCE] flex justify-between font-bold text-base text-[#2C1810]">
                    <span>Total Amount</span>
                    <span className="tabular-nums font-serif text-lg text-[#6B4226]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  form="orderForm"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] disabled:opacity-50 active:scale-95 transition-all uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{loading ? 'PROCESSING ORDER...' : 'PLACE ORDER'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8C7260] mt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Secure Direct Order Submission</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
