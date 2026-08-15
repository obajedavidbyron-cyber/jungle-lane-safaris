import React, { useState, useEffect } from 'react';
import { Phone, Mail, Compass, Menu, X, MessageSquare, ChevronRight, Sparkles, BarChart3, Shield } from 'lucide-react';
import { CONTACT_INFO } from '../data/safariData';
import { tracker } from '../lib/tracker';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenQuoteModal: () => void;
  onOpenAIModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuoteModal,
  onOpenAIModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'day-excursions', label: 'Day Excursions' },
    { id: 'multi-day', label: 'Multi-Day Safaris' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'about', label: 'About Us' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 shadow-sm">
      {/* Top Announcement & Quick Contact Strip */}
      <div className="bg-[#3A4F41] text-[#F9F6F0] text-xs py-2 px-4 sm:px-8 border-b border-[#2D3E33]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <a 
              href={`tel:${CONTACT_INFO.phoneRaw}`} 
              onClick={() => {
                tracker.outboundClick('Header Direct Phone Call', 'Phone', `tel:${CONTACT_INFO.phoneRaw}`);
              }}
              className="flex items-center gap-1.5 hover:text-[#C86D51] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C86D51]" />
              <span>{CONTACT_INFO.phoneDisplay}</span>
            </a>
            <a 
              href={`mailto:${CONTACT_INFO.email}`} 
              onClick={() => {
                tracker.outboundClick('Header Email Inquiry', 'Other', `mailto:${CONTACT_INFO.email}`);
              }}
              className="hidden md:flex items-center gap-1.5 hover:text-[#C86D51] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#C86D51]" />
              <span>{CONTACT_INFO.email}</span>
            </a>
            <span className="hidden lg:inline text-stone-300">
              • Licensed KATO Member & Local Kenyan Guides
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onOpenAIModal();
                tracker.pageView('AI Safari Planner Header Modal');
              }}
              className="flex items-center gap-1 text-[#E29578] hover:text-white font-medium bg-[#2D3E33]/60 px-2.5 py-1 rounded-full transition-all text-[11px] cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="uppercase tracking-wider font-semibold">AI Safari Planner</span>
            </button>
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker.outboundClick('Header WhatsApp Inquire', 'WhatsApp', CONTACT_INFO.whatsappUrl);
              }}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>WhatsApp Us: {CONTACT_INFO.whatsappNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Nav */}
      <nav 
        className={`bg-white/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'py-3 shadow-md border-b border-stone-200' : 'py-4 border-b border-stone-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#3A4F41] text-white flex items-center justify-center shadow-md group-hover:bg-[#C86D51] transition-all">
              <Compass className="w-5 h-5 transform group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#3A4F41] uppercase leading-none">
                JUNGLE LANE SAFARIS
              </span>
              <span className="block text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#C86D51]">
                TAILOR-MADE KENYA SAFARIS
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors relative py-1 cursor-pointer ${
                  currentTab === item.id
                    ? 'text-[#C86D51]'
                    : 'text-[#222222] hover:text-[#C86D51]'
                }`}
              >
                <span>{item.label}</span>
                {currentTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C86D51]" />
                )}
              </button>
            ))}
          </div>

          {/* Header Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => {
                onOpenQuoteModal();
                tracker.outboundClick('Header Book Custom Safari CTA', 'Other');
              }}
              className="bg-[#C86D51] hover:bg-[#b05a41] text-white px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Book Custom Safari</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => {
                onOpenQuoteModal();
                tracker.outboundClick('Mobile Book Safari CTA', 'Other');
              }}
              className="bg-[#C86D51] text-white px-3 py-1.5 rounded-sm font-bold uppercase text-[10px] tracking-widest sm:hidden"
            >
              Book Safari
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#3A4F41] hover:text-[#C86D51] rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#F9F6F0] border-b border-stone-200 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2.5 px-3 rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                    currentTab === item.id
                      ? 'bg-[#3A4F41] text-white font-bold'
                      : 'text-[#222222] hover:bg-stone-200'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                  tracker.outboundClick('Mobile Drawer Custom Safari CTA', 'Other');
                }}
                className="w-full bg-[#C86D51] hover:bg-[#b05a41] text-white py-3 rounded-sm font-bold text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
              >
                <span>Book Custom Safari</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAIModal();
                  tracker.pageView('Mobile AI Safari Planner');
                }}
                className="w-full bg-[#3A4F41] text-[#F9F6F0] py-2.5 rounded-sm font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Safari Planner</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
