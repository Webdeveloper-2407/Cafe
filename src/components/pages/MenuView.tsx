import React, { useEffect, useState } from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import { MenuItem, Category } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useCart } from '../../context/CartContext.js';
import { Search, Plus, Check, Eye } from 'lucide-react';

interface MenuViewProps {
  onGoToOrder: () => void;
}

export function MenuView({ onGoToOrder }: MenuViewProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [specialNote, setSpecialNote] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getMenuItems(), api.getCategories()])
      .then(([menuData, catData]) => {
        if (isMounted) {
          setItems(menuData);
          setCategories(catData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCat =
      selectedCategory === 'All' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleQuickAdd = (item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(item, 1);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleModalAdd = () => {
    if (!selectedItem) return;
    addToCart(selectedItem, 1, specialNote || undefined);
    setAddedId(selectedItem.id);
    setSelectedItem(null);
    setSpecialNote('');
  };

  return (
    <div className="bg-[#FAF4ED] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EBE0D2]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center mb-2">
            <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
          </div>
          <p className="font-script text-3xl sm:text-4xl text-[#785135] mb-2">
            Artisanal Selection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810] tracking-tight mb-3">
            Our Full Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#664C39] leading-relaxed">
            Handcrafted beverages, fresh oven-baked Viennoiseries, and gourmet lunch creations made from raw scratch ingredients.
          </p>
        </div>

        {/* Filter controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8DDCE]">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#6B4226] text-[#FFF8F0] shadow-sm'
                  : 'bg-[#F2E7DC] text-[#664C39] hover:bg-[#EAE0D3]'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-[#6B4226] text-[#FFF8F0] shadow-sm'
                    : 'bg-[#F2E7DC] text-[#664C39] hover:bg-[#EAE0D3]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F7461]" />
            <input
              type="text"
              placeholder="Search coffee, pastries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-[#FFFDF9] border border-[#D8C7B5] text-[#2C1810] placeholder:text-[#A08876] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
            />
          </div>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-[#FAF4ED] p-4 rounded-2xl border border-[#EDE2D4]">
                <div className="w-full aspect-[4/3] bg-[#E8DDD1] rounded-xl mb-4" />
                <div className="h-5 bg-[#E8DDD1] rounded w-32 mb-2" />
                <div className="h-4 bg-[#E8DDD1] rounded w-full mb-3" />
                <div className="h-4 bg-[#E8DDD1] rounded w-16" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF5EF] rounded-3xl border border-[#EDE2D4] space-y-2">
            <p className="font-serif text-lg font-bold text-[#2C1810]">No items match your search</p>
            <p className="text-xs text-[#7A6150]">Try adjusting your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item) => {
              const isJustAdded = addedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group bg-[#FAF4ED] p-4 rounded-2xl border border-[#EDE2D5] hover:border-[#D5C1AF] hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-[#F2E7DC]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => handleQuickAdd(item, e)}
                      aria-label={`Quick add ${item.name}`}
                      className={`absolute bottom-3 right-3 p-2 rounded-full shadow-md transition-all ${
                        isJustAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#6B4226] text-white hover:bg-[#52331B]'
                      }`}
                    >
                      {isJustAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif text-lg font-bold text-[#2C1810] group-hover:text-[#6B4226] transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-semibold text-sm text-[#6B4226] tabular-nums whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B513E] line-clamp-2 leading-relaxed mb-4 flex-grow font-normal">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EFE5D9] text-[11px] text-[#8C7260]">
                      <span>{item.category}</span>
                      <span className="flex items-center gap-1 group-hover:text-[#6B4226]">
                        <Eye className="w-3.5 h-3.5" /> Details
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Item Detail & Customize Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF4ED] border border-[#DFCFC0] rounded-3xl p-6 shadow-2xl">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-[#F2E7DC]">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
                {selectedItem.name}
              </h3>
              <span className="font-serif text-xl font-bold text-[#6B4226] tabular-nums">
                ${selectedItem.price.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-[#6B513E] leading-relaxed mb-4">
              {selectedItem.description}
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-semibold text-[#4A3223]">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Oat milk, extra hot, no cinnamon..."
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-xs text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-2.5 rounded-full text-xs font-semibold text-[#664C39] hover:bg-[#EFE5D8] border border-[#D8C7B5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalAdd}
                className="flex-1 py-2.5 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] transition-colors uppercase shadow-sm cursor-pointer"
              >
                ADD TO ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
