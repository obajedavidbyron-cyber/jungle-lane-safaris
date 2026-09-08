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
import { CarHireView } from './components/views/CarHireView';
import { AdminDashboardView } from './components/views/AdminDashboardView';

import { ItineraryModal } from './components/ItineraryModal';
import { CustomQuoteModal } from './components/CustomQuoteModal';
import { CarHireQuoteModal } from './components/CarHireQuoteModal';
import { AIPlannerModal } from './components/AIPlannerModal';

import { SafariPackage, FilterState } from './types';
import { CONTACT_INFO } from './data/safariData';
import { MessageSquare, Sparkles } from 'lucide-react';
import { tracker } from './lib/tracker';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      if (path === '/admin' || rawHash === 'admin' || path === '/analytics' || rawHash === 'analytics' || rawHash === 'owner-analytics') {
        return 'admin';
      }
      if (['home', 'day-excursions', 'multi-day', 'car-hire', 'destinations', 'about', 'blog', 'contact'].includes(rawHash)) {
        return rawHash;
      }
    }
    return 'home';
  });

  const [activeSearchFilter, setActiveSearchFilter] = useState<FilterState | undefined>(undefined);
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null);
  
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quotePackageTitle, setQuotePackageTitle] = useState<string | undefined>(undefined);

  const [carHireModalOpen, setCarHireModalOpen] = useState(false);
  const [carHireVehicleId, setCarHireVehicleId] = useState<string | undefined>(undefined);

  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Sync tab change with URL & tracker
  useEffect(() => {
    tracker.pageView(currentTab);
    if (currentTab === 'admin') {
      window.history.replaceState(null, '', '#admin');
    } else if (currentTab === 'home') {
      if (window.location.hash && window.location.hash !== '#home') {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      window.history.replaceState(null, '', `#${currentTab}`);
    }
  }, [currentTab]);

  // Listen to popstate / hash change
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      if (
        rawHash === 'admin' ||
        window.location.pathname === '/admin' ||
        rawHash === 'analytics' ||
        rawHash === 'owner-analytics' ||
        window.location.pathname === '/analytics'
      ) {
        setCurrentTab('admin');
      } else if (['home', 'day-excursions', 'multi-day', 'car-hire', 'destinations', 'about', 'blog', 'contact'].includes(rawHash)) {
        setCurrentTab(rawHash);
      } else if (!rawHash) {
        setCurrentTab('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleOpenQuoteModal = (packageTitle?: string) => {
    setQuotePackageTitle(packageTitle);
    setQuoteModalOpen(true);
    tracker.bookmarkItinerary(packageTitle || 'Custom Safari Proposal Request');
  };

  const handleOpenCarHireModal = (vehicleId?: string) => {
    setCarHireVehicleId(vehicleId);
    setCarHireModalOpen(true);
    tracker.pageView(vehicleId ? `Car Hire Modal - ${vehicleId}` : 'Car Hire Modal');
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
            onNavigateCarHire={() => setCurrentTab('car-hire')}
            onOpenCarHireModal={handleOpenCarHireModal}
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

        {currentTab === 'car-hire' && (
          <CarHireView
            onOpenCarHireModal={handleOpenCarHireModal}
            onOpenGeneralQuoteModal={() => handleOpenQuoteModal()}
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

      <CarHireQuoteModal
        isOpen={carHireModalOpen}
        onClose={() => setCarHireModalOpen(false)}
        preselectedVehicleId={carHireVehicleId}
      />

      <AIPlannerModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  );
}
