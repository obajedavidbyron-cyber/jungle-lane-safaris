import React, { useState } from 'react';
import { 
  Car, 
  Truck, 
  Users, 
  Settings, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Plane, 
  Clock, 
  Briefcase, 
  Compass, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  HelpCircle,
  Check
} from 'lucide-react';
import { 
  CAR_HIRE_CATEGORIES, 
  CAR_HIRE_SERVICES_OFFERED, 
  CAR_HIRE_LOCATIONS,
  CAR_HIRE_INCLUSIONS,
  CAR_HIRE_FAQS
} from '../../data/carHireData';
import { CONTACT_INFO } from '../../data/safariData';
import { CarHireCategoryItem } from '../../types';
import { tracker } from '../../lib/tracker';
import { CarHireEnquiryModal } from '../CarHireEnquiryModal';

interface CarHireViewProps {
  onOpenCarHireModal?: (vehicleId?: string) => void;
  onOpenGeneralQuoteModal?: () => void;
}

export const CarHireView: React.FC<CarHireViewProps> = () => {
  const [selectedEnquiryCategory, setSelectedEnquiryCategory] = useState<CarHireCategoryItem | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleEnquireNow = (category: CarHireCategoryItem) => {
    setSelectedEnquiryCategory(category);
    tracker.outboundClick(`Car Hire View Enquire - ${category.name}`, 'Other');
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'self-drive':
        return <Compass className="w-5 h-5 text-emerald-700" />;
      case 'chauffeur-driven':
        return <Users className="w-5 h-5 text-emerald-700" />;
      case 'airport-transfers':
        return <Plane className="w-5 h-5 text-emerald-700" />;
      case 'short-term':
        return <Clock className="w-5 h-5 text-emerald-700" />;
      case 'long-term':
        return <Sparkles className="w-5 h-5 text-emerald-700" />;
      case 'corporate':
        return <Briefcase className="w-5 h-5 text-emerald-700" />;
      case 'safari-4x4':
        return <Truck className="w-5 h-5 text-emerald-700" />;
      case 'delivery':
        return <MapPin className="w-5 h-5 text-emerald-700" />;
      default:
        return <Car className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="bg-[#F9F6F0] min-h-screen text-[#222222]">
      {/* 1. Hero Header Banner */}
      <section className="relative bg-[#14422E] text-white py-14 sm:py-20 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=2000&q=80"
            alt="Car hire services across Kenya"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E3020] via-[#14422E]/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#C86D51] text-white px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest shadow-xs">
            <Car className="w-3.5 h-3.5" />
            <span>Kenya Vehicle Fleet</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Car Hire Services
            </h1>
            <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-normal">
              Reliable and affordable car hire services for your journeys across Kenya. Choose a vehicle that suits your needs and get in touch with us to make your booking.
            </p>
          </div>

          {/* Quick Contact CTAs in Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker.outboundClick('Car Hire Hero WhatsApp Direct', 'WhatsApp', CONTACT_INFO.whatsappUrl);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-sm font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Us: {CONTACT_INFO.whatsappNumber}</span>
            </a>

            <a
              href={`tel:${CONTACT_INFO.phoneRaw}`}
              onClick={() => {
                tracker.outboundClick('Car Hire Hero Direct Phone', 'Phone', `tel:${CONTACT_INFO.phoneRaw}`);
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#E29578]" />
              <span>Call: {CONTACT_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Vehicle Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-300 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C86D51] block mb-1">
              Explore Our Fleet
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14422E]">
              Vehicle Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Carefully maintained vehicles for city travel, business, safari trails, and group excursions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <span>6 Categories</span>
            <span>•</span>
            <span>Self-Drive & Chauffeur Options</span>
          </div>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CAR_HIRE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-stone-900">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 bg-[#14422E] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-xs">
                    {cat.categoryLabel}
                  </span>

                  {cat.tag && (
                    <span className="absolute top-3 right-3 bg-[#C86D51] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                      {cat.tag}
                    </span>
                  )}

                  {cat.modelsExample && (
                    <span className="absolute bottom-2.5 left-3 text-white text-[11px] font-medium tracking-wide drop-shadow-md truncate max-w-[90%]">
                      {cat.modelsExample}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#14422E] group-hover:text-[#C86D51] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                      {cat.shortDescription}
                    </p>
                  </div>

                  {/* Basic Information: Seats & Transmission */}
                  <div className="grid grid-cols-2 gap-3 py-2.5 border-y border-stone-100 text-xs">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Seats</span>
                        <span className="font-semibold">{cat.seats}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-stone-700">
                      <Settings className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Transmission</span>
                        <span className="font-semibold truncate">{cat.transmission}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Specifications */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500 font-medium">
                    <span>Drive: <strong className="text-stone-700 font-semibold">{cat.driveType || '2WD'}</strong></span>
                    <span>Fuel: <strong className="text-stone-700 font-semibold">{cat.fuelType || 'Petrol'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card Actions: "Enquire Now" & Quick Contact */}
              <div className="p-5 sm:p-6 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleEnquireNow(cat)}
                  className="flex-1 bg-[#14422E] hover:bg-[#0E3020] text-white py-2.5 px-4 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(`Hello Jungle Lane Safaris! I want to enquire about hiring a ${cat.name} in Kenya. Please let me know rates and availability.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    tracker.outboundClick(`Car Hire View WhatsApp - ${cat.name}`, 'WhatsApp', CONTACT_INFO.whatsappUrl);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-sm transition-colors cursor-pointer"
                  title={`Chat on WhatsApp about ${cat.name}`}
                  aria-label={`Chat on WhatsApp about ${cat.name}`}
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                </a>

                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  onClick={() => {
                    tracker.outboundClick(`Car Hire View Call - ${cat.name}`, 'Phone', `tel:${CONTACT_INFO.phoneRaw}`);
                  }}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 p-2.5 rounded-sm transition-colors cursor-pointer"
                  title={`Call Us directly about ${cat.name}`}
                  aria-label={`Call Us directly about ${cat.name}`}
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Services Offered Section */}
      <section className="bg-white border-y border-stone-200 py-14 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C86D51]">
              Comprehensive Fleet Solutions
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14422E]">
              Services Offered
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              From personal holiday trips to full corporate transport logistics across East Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAR_HIRE_SERVICES_OFFERED.map((service) => (
              <div 
                key={service.id}
                className="p-5 rounded-md bg-stone-50 border border-stone-200 hover:border-emerald-700/40 transition-colors space-y-2.5"
              >
                <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  {getServiceIcon(service.id)}
                </div>
                <h3 className="font-serif font-bold text-base text-[#14422E]">
                  {service.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Locations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-[#14422E] text-white rounded-lg p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-[#E29578] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Nationwide Kenya Coverage</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Available In Major Kenyan Destinations
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                We deliver and collect vehicles at airports, hotels, and city locations across Kenya:
              </p>
            </div>

            {/* Destinations List */}
            <div className="flex flex-wrap items-center gap-2 max-w-xl">
              {CAR_HIRE_LOCATIONS.map((loc) => (
                <span
                  key={loc}
                  className="bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-full text-xs font-semibold text-white tracking-wide transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E29578]" />
                  <span>{loc}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Inclusions & Trust Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#14422E]">
              What Is Included In Your Car Hire
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Transparent, honest terms with no surprise charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {CAR_HIRE_INCLUSIONS.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-sm">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800 block">{item.title}</span>
                  <span className="text-stone-500 text-[11px]">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions (Accordion) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C86D51]">
            Common Inquiries
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14422E]">
            Car Hire Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Everything you need to know about renting a vehicle with Jungle Lane Safaris in Kenya.
          </p>
        </div>

        <div className="space-y-3">
          {CAR_HIRE_FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-stone-200 rounded-md overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span className="font-bold text-xs sm:text-sm text-stone-800 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#C86D51] shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeFaq === index && (
                <div className="px-4 pb-4 pt-1 text-xs text-stone-600 border-t border-stone-100 bg-stone-50/50 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Bottom Simple Enquiry Strip (WhatsApp, Phone, Email) */}
      <section className="bg-stone-200 border-t border-stone-300 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#14422E]">
              Get in Touch to Book Your Vehicle
            </h3>
            <p className="text-xs text-stone-600 max-w-xl">
              Our team in Nairobi is ready to assist you with rates, availability, and vehicle recommendations for your itinerary.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker.outboundClick('Car Hire Bottom WhatsApp', 'WhatsApp', CONTACT_INFO.whatsappUrl);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Direct</span>
            </a>

            <a
              href={`tel:${CONTACT_INFO.phoneRaw}`}
              onClick={() => {
                tracker.outboundClick('Car Hire Bottom Phone', 'Phone', `tel:${CONTACT_INFO.phoneRaw}`);
              }}
              className="bg-[#14422E] hover:bg-[#0E3020] text-white px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us: {CONTACT_INFO.phoneDisplay}</span>
            </a>

            <a
              href={`mailto:${CONTACT_INFO.email}?subject=Car Hire Enquiry - Jungle Lane Safaris`}
              onClick={() => {
                tracker.outboundClick('Car Hire Bottom Email', 'Email', `mailto:${CONTACT_INFO.email}`);
              }}
              className="bg-stone-800 hover:bg-stone-900 text-white px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Email Desk</span>
            </a>
          </div>
        </div>
      </section>

      {/* Simple Enquiry Modal */}
      <CarHireEnquiryModal
        isOpen={selectedEnquiryCategory !== null}
        onClose={() => setSelectedEnquiryCategory(null)}
        category={selectedEnquiryCategory}
      />
    </div>
  );
};
