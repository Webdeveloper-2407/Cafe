import React, { useEffect, useState } from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import { BlogPost } from '../../types/index.js';
import { api } from '../../services/api.js';
import { Clock, User, ArrowRight, X } from 'lucide-react';

export function BlogView() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .getBlogPosts()
      .then((data) => {
        if (isMounted) {
          setPosts(data);
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

  return (
    <div className="bg-[#FAF4ED] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EBE0D2]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center mb-2">
            <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
          </div>
          <p className="font-script text-3xl sm:text-4xl text-[#785135] mb-2">
            Coffee & Culture
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810] tracking-tight mb-3">
            The Café Journal
          </h1>
          <p className="text-xs sm:text-sm text-[#664C39] leading-relaxed">
            Stories on coffee origin farms, bean extraction chemistry, culinary pairings, and our seasonal bakery creations.
          </p>
        </div>

        {/* Blog Post Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[#FAF4ED] p-4 rounded-3xl border border-[#EDE2D4]">
                <div className="w-full aspect-[16/10] bg-[#E8DDD1] rounded-2xl mb-4" />
                <div className="h-4 bg-[#E8DDD1] rounded w-28 mb-2" />
                <div className="h-6 bg-[#E8DDD1] rounded w-48 mb-3" />
                <div className="h-3 bg-[#E8DDD1] rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group bg-[#FAF4ED] p-4 rounded-3xl border border-[#EDE2D4] hover:border-[#D5C1AF] hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-[#F2E7DC]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#7A6150] mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                  <span>·</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#2C1810] group-hover:text-[#6B4226] transition-colors mb-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-[#6B513E] line-clamp-3 leading-relaxed mb-4 flex-grow font-normal">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#EFE5D9] text-xs font-semibold text-[#6B4226]">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Story <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#FAF4ED] border border-[#DFCFC0] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-[#7A5B46] hover:text-[#2C1810] hover:bg-[#EFE5D8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-[#F2E7DC]">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-[#7A6150] mb-2">
              <span className="font-semibold text-[#6B4226]">{selectedPost.author}</span>
              <span>·</span>
              <span>{selectedPost.readTime}</span>
              <span>·</span>
              <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] mb-4">
              {selectedPost.title}
            </h2>

            <div className="prose prose-stone text-xs sm:text-sm text-[#4E3524] leading-relaxed space-y-4 whitespace-pre-line border-t border-[#E8DDCE] pt-4">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
