import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/views/HomeView';
import { DayExcursionsView } from './components/views/DayExcursionsView';
import { MultiDaySafarisView } from './components/views/MultiDaySafarisView';
import { DestinationsView } from './components/views/DestinationsView';
import { AboutUsView } from './components/views/AboutUsView';
import { BlogView } from './components/views/BlogView';
import { ContactUsView } from './components/views/ContactUsView';
import { AdminDashboardView } from './components/views/AdminDashboardView';

import { ItineraryModal } from './components/ItineraryModal';
import { CustomQuoteModal } from './components/CustomQuoteModal';
import { AIPlannerModal } from './components/AIPlannerModal';

import { SafariPackage, FilterState } from './types';
import { CONTACT_INFO } from './data/safariData';
import { MessageSquare, Sparkles } from 'lucide-react';
import { tracker } from './lib/tracker';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin' || hash === '#/admin' || path === '/analytics' || hash === '#analytics' || hash === '#owner-analytics') {
        return 'admin';
      }
    }
    return 'home';
  });

  const [activeSearchFilter, setActiveSearchFilter] = useState<FilterState | undefined>(undefined);
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null);
  
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quotePackageTitle, setQuotePackageTitle] = useState<string | undefined>(undefined);

  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Sync tab change with URL & tracker
  useEffect(() => {
    tracker.pageView(currentTab);
    if (currentTab === 'admin') {
      window.history.replaceState(null, '', '#admin');
    } else if (window.location.hash === '#admin' || window.location.hash === '#analytics') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [currentTab]);

  // Listen to popstate / hash change
  useEffect(() => {
    const handleHashChange = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.pathname === '/admin' ||
        window.location.hash === '#analytics' ||
        window.location.hash === '#owner-analytics' ||
        window.location.pathname === '/analytics'
      ) {
        setCurrentTab('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenQuoteModal = (packageTitle?: string) => {
    setQuotePackageTitle(packageTitle);
    setQuoteModalOpen(true);
    tracker.bookmarkItinerary(packageTitle || 'Custom Safari Proposal Request');
  };

  const handleOpenAIModal = () => {
    setAiModalOpen(true);
    tracker.pageView('AI Safari Generator Modal');
  };

  const handleSearchFilter = (filters: FilterState) => {
    setActiveSearchFilter(filters);
    setCurrentTab('home');
    if (filters.destination) tracker.destinationView(filters.destination);
    if (filters.duration) tracker.filterUsage('Duration', filters.duration);
    if (filters.travelStyle) tracker.filterUsage('Travel Style', filters.travelStyle);
    
    const packagesElem = document.getElementById('safari-packages');
    if (packagesElem) {
      packagesElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#222222] font-sans flex flex-col selection:bg-[#C86D51] selection:text-white">
      {/* Header Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
        onOpenAIModal={handleOpenAIModal}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onSelectPackage={(pkg) => {
              setSelectedPackage(pkg);
              tracker.packageView(pkg.title, pkg.durationLabel, pkg.priceFromUSD);
            }}
            onOpenQuoteModal={handleOpenQuoteModal}
            onOpenAIModal={handleOpenAIModal}
            activeSearchFilter={activeSearchFilter}
            onSearchFilter={handleSearchFilter}
          />
        )}

        {currentTab === 'day-excursions' && (
          <DayExcursionsView
            onSelectPackage={(pkg) => {
              setSelectedPackage(pkg);
              tracker.packageView(pkg.title, pkg.durationLabel, pkg.priceFromUSD);
            }}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {currentTab === 'multi-day' && (
          <MultiDaySafarisView
            onSelectPackage={(pkg) => {
              setSelectedPackage(pkg);
              tracker.packageView(pkg.title, pkg.durationLabel, pkg.priceFromUSD);
            }}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {currentTab === 'destinations' && (
          <DestinationsView
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {currentTab === 'about' && (
          <AboutUsView
            onOpenQuoteModal={() => handleOpenQuoteModal()}
          />
        )}

        {currentTab === 'blog' && (
          <BlogView />
        )}

        {currentTab === 'contact' && (
          <ContactUsView />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
      />

      {/* Floating Action Bar / WhatsApp Sticky Widget */}
      {currentTab !== 'admin' && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
          <button
            onClick={handleOpenAIModal}
            className="bg-[#2E4057] hover:bg-[#1E2B22] text-[#F9F6F0] p-3 sm:px-4 sm:py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 border border-stone-400/30 cursor-pointer text-xs font-semibold"
            title="AI Safari Planner"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">AI Itinerary Planner</span>
          </button>

          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              tracker.outboundClick('Floating WhatsApp Widget', 'WhatsApp', CONTACT_INFO.whatsappUrl);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2.5 group cursor-pointer border border-emerald-400/30"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs sm:text-sm hidden sm:inline">
              WhatsApp Direct ({CONTACT_INFO.whatsappNumber})
            </span>
          </a>
        </div>
      )}

      {/* Modals */}
      <ItineraryModal
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <CustomQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedPackage={quotePackageTitle}
      />

      <AIPlannerModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  );
}
