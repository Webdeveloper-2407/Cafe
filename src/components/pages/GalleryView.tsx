import React, { useEffect, useState } from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import { GalleryImage } from '../../types/index.js';
import { api } from '../../services/api.js';
import { X, ZoomIn } from 'lucide-react';

export function GalleryView() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .getGalleryImages()
      .then((data) => {
        if (isMounted) {
          setImages(data);
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

  const categories = ['All', 'Food & Coffee', 'Barista Craft', 'Desserts', 'Atmosphere'];

  const filtered = images.filter(
    (img) => selectedCategory === 'All' || img.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  return (
    <div className="bg-[#FAF4ED] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EBE0D2]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center mb-2">
            <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
          </div>
          <p className="font-script text-3xl sm:text-4xl text-[#785135] mb-2">
            Visual Atmosphere
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810] tracking-tight mb-3">
            Our Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#664C39] leading-relaxed">
            Moments of warm morning light, espresso alchemy, and freshly baked confections captured in our sanctuary.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#6B4226] text-[#FFF8F0] shadow-sm'
                  : 'bg-[#F2E7DC] text-[#664C39] hover:bg-[#EAE0D3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse aspect-[4/3] bg-[#E8DDD1] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((img) => (
              <div
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-[#E8DDCE] bg-[#F2E7DC] cursor-pointer"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-amber-200">
                        {img.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold">{img.title}</h3>
                      {img.caption && <p className="text-xs text-white/80 line-clamp-1">{img.caption}</p>}
                    </div>
                    <ZoomIn className="w-5 h-5 text-amber-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-[#FAF4ED] border border-[#DFCFC0] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="p-5 bg-[#FAF4ED] text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#734A2E]">
                {lightboxImage.category}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                {lightboxImage.title}
              </h3>
              {lightboxImage.caption && (
                <p className="text-xs text-[#6B513E] mt-1">{lightboxImage.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
