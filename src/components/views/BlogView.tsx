import React, { useState } from 'react';
import { BLOG_POSTS } from '../../data/safariData';
import { BlogPost } from '../../types';
import { BookOpen, Calendar, Clock, ChevronRight, X } from 'lucide-react';

export const BlogView: React.FC = () => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-8 bg-[#F9F6F0] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner */}
        <div className="bg-[#2E4057] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl border border-[#3A4F68]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-[#C86D51] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Safari Travel Insights & Tips
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Jungle Lane Safari Travel Guide
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Expert advice on wildebeest migration timing, packing lists, malaria precautions, and choosing between budget vs luxury tented camps.
            </p>
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-stone-200 cursor-pointer flex flex-col group"
            >
              <div className="relative h-48 bg-stone-900">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#2E4057] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#C86D51]" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C86D51]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#222222] group-hover:text-[#C86D51] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#2E4057] group-hover:text-[#C86D51]">
                  <span>Read Full Article</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blog Reading Modal */}
        {activePost && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#F9F6F0] rounded-2xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative my-8 border border-stone-300 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-4 right-4 bg-stone-200 hover:bg-stone-300 p-2 rounded-full text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="bg-[#C86D51] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {activePost.category}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#222222]">
                    {activePost.title}
                  </h2>
                  <div className="text-xs text-stone-500 flex items-center gap-2">
                    <span>By {activePost.author}</span>
                    <span>•</span>
                    <span>{activePost.date}</span>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden h-64 sm:h-80">
                  <img
                    src={activePost.imageUrl}
                    alt={activePost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="prose max-w-none text-stone-800 text-sm leading-relaxed whitespace-pre-line">
                  {activePost.content}
                </div>

                <div className="pt-6 border-t border-stone-300 text-center">
                  <button
                    onClick={() => setActivePost(null)}
                    className="bg-[#2E4057] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
                  >
                    Back to Blog List
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
