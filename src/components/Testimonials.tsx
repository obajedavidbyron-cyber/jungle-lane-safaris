import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Award } from 'lucide-react';
import { TESTIMONIALS } from '../data/safariData';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#3A4F41] text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#2D3E33] text-amber-300 px-4 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-widest border border-[#2D3E33]">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Verified Guest Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            Loved By Safarigoers Worldwide
          </h2>
          <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto">
            Read what international travelers say about their tailor-made safaris with Jungle Lane Safaris.
          </p>
        </div>

        {/* Testimonial Card Slider */}
        <div className="bg-[#2D3E33]/70 border border-white/10 rounded-sm p-8 sm:p-12 relative shadow-2xl backdrop-blur-md max-w-4xl mx-auto">
          <Quote className="w-16 h-16 text-[#C86D51]/30 absolute top-6 right-6 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar & Flag */}
            <div className="relative shrink-0">
              <img
                src={current.avatarUrl}
                alt={current.guestName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#C86D51] shadow-lg"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 text-2xl bg-black/60 rounded-full p-1 border border-[#2D3E33]">
                {current.flagEmoji}
              </span>
            </div>

            {/* Testimonial Details */}
            <div className="space-y-4 text-center sm:text-left flex-1">
              {/* Star Rating */}
              <div className="flex items-center justify-center sm:justify-start gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                "{current.title}"
              </h3>

              <p className="text-stone-200 text-sm sm:text-base leading-relaxed italic">
                "{current.comment}"
              </p>

              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-300 gap-1">
                <div>
                  <span className="font-bold text-white text-sm block sm:inline mr-2">
                    {current.guestName}
                  </span>
                  <span className="text-[#E29578]">({current.country})</span>
                </div>
                <div className="text-stone-400">
                  Safari: <span className="text-stone-200 font-semibold">{current.safariTaken}</span> • {current.date}
                </div>
              </div>
            </div>
          </div>

          {/* Slider Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={prevTestimonial}
              className="p-2.5 rounded-sm bg-[#3A4F41] hover:bg-[#C86D51] text-white transition-colors cursor-pointer border border-white/20"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-stone-300 font-bold uppercase tracking-wider">
              {currentIndex + 1} of {TESTIMONIALS.length}
            </span>
            <button
              onClick={nextTestimonial}
              className="p-2.5 rounded-sm bg-[#3A4F41] hover:bg-[#C86D51] text-white transition-colors cursor-pointer border border-white/20"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
