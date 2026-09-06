import React, { useState } from 'react';
import { Compass, Phone, Mail, MapPin, MessageSquare, Facebook, Instagram, Send, CheckCircle2, ShieldCheck, Award, Lock } from 'lucide-react';
import { CONTACT_INFO } from '../data/safariData';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenQuoteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenQuoteModal }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#2D3E33] text-stone-300 pt-16 pb-8 border-t border-[#3A4F41]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Main 4-Column Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Company Bio & Licensing Badges */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C86D51] text-white flex items-center justify-center font-bold shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-white leading-none uppercase tracking-wide">
                  JUNGLE LANE
                </span>
                <span className="text-[10px] font-bold text-[#E29578] tracking-widest uppercase">
                  SAFARIS & TOURS
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              JUNGLE LANE SAFARIS is a premier licensed Kenyan tour operator offering authentic, tailor-made wildlife safaris, day excursions, and beach holidays across East Africa.
            </p>

            {/* Licensing & Trust Badges */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-[#3A4F41]/60 p-2.5 rounded-sm border border-stone-600/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{CONTACT_INFO.guideCert}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 bg-[#3A4F41]/60 p-2.5 rounded-sm border border-stone-600/50">
                <Award className="w-4 h-4 text-[#C86D51] shrink-0" />
                <span>{CONTACT_INFO.ktbLicence}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider border-b border-stone-600/50 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'day-excursions', label: 'Day Excursions' },
                { id: 'multi-day', label: 'Multi-Day Safaris' },
                { id: 'destinations', label: 'National Parks & Destinations' },
                { id: 'about', label: 'About Us & Local Guides' },
                { id: 'blog', label: 'Safari Travel Guide & Blog' },
                { id: 'contact', label: 'Contact Us & Location' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      onSelectTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#C86D51] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-[#C86D51]">›</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider border-b border-stone-600/50 pb-2">
              Nairobi Office Contact
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C86D51] shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C86D51] shrink-0" />
                <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors font-bold text-emerald-400"
                >
                  WhatsApp: {CONTACT_INFO.whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C86D51] shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>

            <button
              onClick={onOpenQuoteModal}
              className="w-full mt-2 bg-[#C86D51] hover:bg-[#b05a41] text-white py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow"
            >
              Get Free Custom Quote
            </button>
          </div>

          {/* Column 4: Social Media & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider border-b border-stone-600/50 pb-2">
              Social Media & Newsletter
            </h4>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={CONTACT_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm bg-[#3A4F41] hover:bg-[#C86D51] text-white flex items-center justify-center transition-colors"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={CONTACT_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm bg-[#3A4F41] hover:bg-[#C86D51] text-white flex items-center justify-center transition-colors"
                title="Instagram Page"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                title="WhatsApp Direct"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>

            <p className="text-xs text-stone-400">
              Subscribe to receive seasonal safari deals, migration updates, and wildlife photo stories.
            </p>

            {subscribed ? (
              <div className="bg-emerald-900/50 border border-emerald-600 p-3 rounded-sm text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Asante sana! You are subscribed to Jungle Lane Safaris updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-[#3A4F41] border border-stone-600 rounded-sm py-2 px-3 pr-10 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#C86D51]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 bg-[#C86D51] hover:bg-[#b05a41] text-white px-2.5 rounded-sm flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 border-t border-stone-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} JUNGLE LANE SAFARIS & TOURS. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-stone-200 cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-stone-200 cursor-pointer">Eco-Safari Guidelines</span>
            <span>•</span>
            <button
              onClick={() => {
                onSelectTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-stone-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
              title="Restricted Staff & Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
