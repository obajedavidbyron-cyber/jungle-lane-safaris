import React from 'react';
import { Compass, Users, ShieldCheck, Heart, Truck, Award, CheckCircle2 } from 'lucide-react';
import { CONTACT_INFO, WHY_CHOOSE_US } from '../../data/safariData';
import { JungleLaneLogo } from '../JungleLaneLogo';

interface AboutUsViewProps {
  onOpenQuoteModal: () => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ onOpenQuoteModal }) => {
  return (
    <div className="py-12 sm:py-20 px-4 sm:px-8 bg-[#F9F6F0] min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner with Official Brand Logo */}
        <div className="bg-[#14422E] text-white p-8 sm:p-14 rounded-3xl relative overflow-hidden shadow-xl border border-emerald-800/40">
          <div className="relative z-10 max-w-4xl flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/15 shrink-0">
              <JungleLaneLogo size="lg" variant="stacked" theme="light" id="about-brand-logo" />
            </div>
            <div className="space-y-3">
              <span className="bg-[#C86D51] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                Explore Africa with Africans
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                About Jungle Lane Safaris
              </h1>
              <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed">
                We are a premier licensed native Kenyan safari company based in Nairobi. Our passion is delivering authentic, tailor-made wildlife adventures across Kenya and East Africa.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-md">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#C86D51] uppercase tracking-wider block">
              Our Journey & Roots
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#222222]">
              Born & Raised in the Heart of the Kenyan Wilderness
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed">
              Founded over a decade ago by experienced native Kenyan wildlife tracking guides, <strong>JUNGLE LANE SAFARIS</strong> was built on a singular belief: nobody shares the stories and secrets of Africa better than native Africans who grew up alongside these majestic lands.
            </p>
            <p className="text-stone-700 text-sm leading-relaxed">
              From the vast rolling savannahs of Maasai Mara to the snow-capped peak of Mount Kilimanjaro in Amboseli and the turquoise Indian Ocean in Diani, we pride ourselves on crafting authentic, safe, and deeply memorable safari itineraries.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2E4057]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fully Licensed Tour Operator by Tourism Regulatory Authority (TRA)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2E4057]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Certified Native Kenyan Professional Safari Guides & Wildlife Trackers</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2E4057]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dedicated 24/7 Safari Concierge On Ground in Nairobi</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200 h-80 sm:h-96 relative">
            <img
              src="/src/assets/images/jungle_lane_hero_1784824345971.jpg"
              alt="Jungle Lane Safaris Native Guides"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#222222]">
              The Core Pillars of Our Hospitality
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Why thousands of international guests trust Jungle Lane Safaris for their African holidays.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#2E4057] text-white flex items-center justify-center font-bold">
                  <Compass className="w-6 h-6 text-[#C86D51]" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#222222]">{item.title}</h3>
                <p className="text-stone-600 text-xs leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#2E4057] text-white p-10 rounded-3xl text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Start Crafting Your Custom Kenya Safari Today
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto">
            Connect directly with our local travel experts. We reply within minutes with customized itineraries and transparent pricing.
          </p>
          <button
            onClick={onOpenQuoteModal}
            className="bg-[#C86D51] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow hover:bg-[#b05a41]"
          >
            Request Free Custom Proposal
          </button>
        </div>
      </div>
    </div>
  );
};
