import React from 'react';
import { Compass, ShieldCheck, Sparkles, Truck, Users, Camera, Headphones, Heart } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/safariData';

export const WhyChooseUs: React.FC = () => {
  const iconsMap: Record<string, React.ReactNode> = {
    Compass: <Users className="w-7 h-7 text-[#C86D51]" />,
    Truck: <Truck className="w-7 h-7 text-[#C86D51]" />,
    ShieldCheck: <Headphones className="w-7 h-7 text-[#C86D51]" />,
    Sparkles: <Sparkles className="w-7 h-7 text-[#C86D51]" />
  };

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#3A4F41] text-white relative overflow-hidden">
      {/* Background Subtle Accent Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C86D51]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#2D3E33] text-[#E29578] px-4 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-widest border border-[#2D3E33]">
            <Heart className="w-3.5 h-3.5 text-[#C86D51] fill-[#C86D51]" />
            <span>The Jungle Lane Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            Why Travel With Jungle Lane Safaris?
          </h2>
          <p className="text-stone-200 text-base sm:text-lg leading-relaxed">
            We are not just a tour agency; we are local Kenyans passionate about sharing our homeland’s wildlife heritage with authentic hospitality and professional care.
          </p>
        </div>

        {/* 4-Column Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_CHOOSE_US.map((item, index) => (
            <div
              key={index}
              className="bg-[#2D3E33]/60 hover:bg-[#2D3E33] border border-[#2D3E33]/90 p-7 rounded-sm transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-sm bg-[#3A4F41] border border-white/10 flex items-center justify-center shadow-md group-hover:bg-[#C86D51] group-hover:border-[#C86D51] transition-all">
                  <div className="group-hover:text-white transition-colors">
                    {iconsMap[item.icon] || <Compass className="w-6 h-6 text-[#C86D51]" />}
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#E29578] font-bold uppercase tracking-wider">
                <span>Verified Standard</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle Feature Spotlight */}
        <div className="bg-[#2D3E33] border border-white/10 rounded-sm p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-xl">
          <div className="w-full lg:w-1/2 space-y-4">
            <span className="text-xs font-bold text-[#E29578] uppercase tracking-widest block">
              Dedicated Safari Fleet
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Guaranteed 4x4 Safari Land Cruisers with Pop-Up Roofs
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              Every multi-day safari with Jungle Lane Safaris is conducted in rugged, customized 4x4 Toyota Land Cruisers designed specifically for the African bush. Features include pop-up roofs for 360° photo vantage points, high ground clearance, inverter battery chargers for cameras, electric mini-fridge with cold drinks, and high-frequency long-range radio systems.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-stone-200 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#C86D51]" />
                <span>360° Unobstructed Photos</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C86D51]" />
                <span>High Clearance Off-Road</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 rounded-sm overflow-hidden shadow-lg border border-white/20 h-64 sm:h-80 relative">
            <img
              src="/src/assets/images/jungle_lane_hero_1784824345971.jpg"
              alt="4x4 Safari Land Cruiser Maasai Mara"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-sm text-white text-xs flex items-center justify-between">
              <span>Jungle Lane Safaris 4x4 Fleet in Maasai Mara</span>
              <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">100% Private Options</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
