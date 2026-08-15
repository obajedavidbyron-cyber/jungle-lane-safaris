import React from 'react';
import { Award, HeartHandshake, ShieldCheck, Star } from 'lucide-react';
import { COMPANY_STATS } from '../data/safariData';

export const StatsBanner: React.FC = () => {
  const icons = [
    <Award key="1" className="w-8 h-8 text-[#C86D51]" />,
    <HeartHandshake key="2" className="w-8 h-8 text-[#C86D51]" />,
    <ShieldCheck key="3" className="w-8 h-8 text-[#C86D51]" />,
    <Star key="4" className="w-8 h-8 text-amber-400 fill-amber-400" />
  ];

  return (
    <section className="bg-[#3A4F41] text-[#F9F6F0] py-12 px-4 sm:px-8 border-y border-[#2D3E33]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 lg:divide-x divide-[#2D3E33]">
          {COMPANY_STATS.map((stat, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center p-4 ${
                index > 0 ? 'pt-6 sm:pt-4' : ''
              }`}
            >
              <div className="mb-3 p-3 rounded-full bg-[#2D3E33]/80 border border-[#2D3E33]">
                {icons[index]}
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
                {stat.value}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E29578]">
                {stat.label}
              </span>
              <span className="text-xs text-stone-300 mt-1">
                {stat.subtext}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
