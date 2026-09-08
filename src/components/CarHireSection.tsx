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
  Sparkles
} from 'lucide-react';
import { 
  CAR_HIRE_CATEGORIES, 
  CAR_HIRE_SERVICES_OFFERED, 
  CAR_HIRE_LOCATIONS 
} from '../data/carHireData';
import { CONTACT_INFO } from '../data/safariData';
import { CarHireCategoryItem } from '../types';
import { tracker } from '../lib/tracker';
import { CarHireEnquiryModal } from './CarHireEnquiryModal';

interface CarHireSectionProps {
  onNavigateCarHire?: () => void;
  onOpenCarHireModal?: (vehicleId?: string) => void;
}

export const CarHireSection: React.FC<CarHireSectionProps> = ({
  onNavigateCarHire,
  onOpenCarHireModal
}) => {
  const [selectedEnquiryCategory, setSelectedEnquiryCategory] = useState<CarHireCategoryItem | null>(null);

  const handleEnquireNow = (category: CarHireCategoryItem) => {
    setSelectedEnquiryCategory(category);
    tracker.outboundClick(`Car Hire Enquire Now - ${category.name}`, 'Other');
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
    <section id="car-hire-services" className="bg-[#F9F6F0] py-16 sm:py-20 px-4 sm:px-8 border-t border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 1. Header Section */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#14422E] text-white px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest">
            <Car className="w-3.5 h-3.5 text-[#E29578]" />
            <span>Kenya Vehicle Fleet</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14422E] tracking-tight">
            Car Hire Services
          </h2>

          <p className="text-base sm:text-lg text-stone-700 font-normal leading-relaxed">
            Reliable and affordable car hire services for your journeys across Kenya. Choose a vehicle that suits your needs and get in touch with us to make your booking.
          </p>
        </div>

        {/* 2. Vehicle Categories Grid (6 Cards) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Select Vehicle Category
            </h3>
            <span className="text-xs text-stone-500">
              6 Categories Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CAR_HIRE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Vehicle Image Container */}
                <div>
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-stone-900">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Label Badge */}
                    <span className="absolute top-3 left-3 bg-[#14422E] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-xs">
                      {cat.categoryLabel}
                    </span>

                    {/* Tag badge */}
                    {cat.tag && (
                      <span className="absolute top-3 right-3 bg-[#C86D51] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                        {cat.tag}
                      </span>
                    )}

                    {/* Optional Models subtitle on image */}
                    {cat.modelsExample && (
                      <span className="absolute bottom-2.5 left-3 text-white text-[11px] font-medium tracking-wide drop-shadow-md truncate max-w-[90%]">
                        {cat.modelsExample}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-[#14422E] group-hover:text-[#C86D51] transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                        {cat.shortDescription}
                      </p>
                    </div>

                    {/* Basic Info: Seats & Transmission */}
                    <div className="grid grid-cols-2 gap-3 py-2.5 border-y border-stone-100 text-xs">
                      <div className="flex items-center gap-2 text-stone-700">
                        <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Seating</span>
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
                    href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(`Hello Jungle Lane Safaris! I am interested in hiring a ${cat.name} in Kenya. Please provide rates and availability.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      tracker.outboundClick(`Car Hire WhatsApp - ${cat.name}`, 'WhatsApp', CONTACT_INFO.whatsappUrl);
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
                      tracker.outboundClick(`Car Hire Call - ${cat.name}`, 'Phone', `tel:${CONTACT_INFO.phoneRaw}`);
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
        </div>

        {/* 3. Services Offered Section */}
        <div className="bg-white rounded-lg p-6 sm:p-10 border border-stone-200 shadow-xs space-y-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51]">
              Flexible Hire Solutions
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#14422E]">
              Services Offered
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Tailored car hire options designed for every travel style, schedule, and budget across Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAR_HIRE_SERVICES_OFFERED.map((service) => (
              <div 
                key={service.id}
                className="p-4 rounded-md bg-stone-50 border border-stone-200/80 hover:border-emerald-700/40 transition-colors space-y-2"
              >
                <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  {getServiceIcon(service.id)}
                </div>
                <h4 className="font-serif font-bold text-sm text-[#14422E]">
                  {service.title}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Locations Section */}
        <div className="bg-[#14422E] text-white rounded-lg p-6 sm:p-8 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-[#E29578] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Nationwide Kenya Coverage</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Available In Major Kenyan Destinations
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Enjoy flexible vehicle pick-up, doorstep delivery, and airport meet-and-greet services across key hubs:
              </p>
            </div>

            {/* Destinations List Pills */}
            <div className="flex flex-wrap items-center gap-2 max-w-xl">
              {CAR_HIRE_LOCATIONS.map((loc, idx) => (
                <span
                  key={loc}
                  className="bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white tracking-wide transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E29578]" />
                  <span>{loc}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Simple Direct Enquiry Strip (WhatsApp, Phone, Email) */}
        <div className="bg-stone-100 rounded-lg p-6 border border-stone-300 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-[#14422E]">
              Have a Question or Ready to Book?
            </h4>
            <p className="text-xs text-stone-600">
              No online checkout or hidden fees. Reach our operations desk directly via your preferred channel:
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker.outboundClick('Car Hire Strip WhatsApp', 'WhatsApp', CONTACT_INFO.whatsappUrl);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Direct</span>
            </a>

            <a
              href={`tel:${CONTACT_INFO.phoneRaw}`}
              onClick={() => {
                tracker.outboundClick('Car Hire Strip Phone', 'Phone', `tel:${CONTACT_INFO.phoneRaw}`);
              }}
              className="bg-[#14422E] hover:bg-[#0E3020] text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{CONTACT_INFO.phoneDisplay}</span>
            </a>

            <a
              href={`mailto:${CONTACT_INFO.email}?subject=Car Hire Enquiry - Jungle Lane Safaris`}
              onClick={() => {
                tracker.outboundClick('Car Hire Strip Email', 'Email', `mailto:${CONTACT_INFO.email}`);
              }}
              className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Lightweight Direct Enquiry Modal */}
      <CarHireEnquiryModal
        isOpen={selectedEnquiryCategory !== null}
        onClose={() => setSelectedEnquiryCategory(null)}
        category={selectedEnquiryCategory}
      />
    </section>
  );
};
