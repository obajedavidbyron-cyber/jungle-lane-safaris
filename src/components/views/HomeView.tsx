import React from 'react';
import { Hero } from '../Hero';
import { StatsBanner } from '../StatsBanner';
import { FeaturedPackages } from '../FeaturedPackages';
import { WhyChooseUs } from '../WhyChooseUs';
import { DestinationShowcase } from '../DestinationShowcase';
import { Testimonials } from '../Testimonials';
import { CTABanner } from '../CTABanner';
import { SafariPackage, FilterState } from '../../types';

interface HomeViewProps {
  onSelectPackage: (pkg: SafariPackage) => void;
  onOpenQuoteModal: (packageTitle?: string) => void;
  onOpenAIModal: () => void;
  activeSearchFilter?: FilterState;
  onSearchFilter: (filters: FilterState) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectPackage,
  onOpenQuoteModal,
  onOpenAIModal,
  activeSearchFilter,
  onSearchFilter
}) => {
  return (
    <div className="space-y-0">
      <Hero
        onSearch={onSearchFilter}
        onOpenQuoteModal={onOpenQuoteModal}
        onOpenAIModal={onOpenAIModal}
      />

      <StatsBanner />

      <FeaturedPackages
        onSelectPackage={onSelectPackage}
        onOpenQuoteModal={onOpenQuoteModal}
        activeFilter={activeSearchFilter}
      />

      <WhyChooseUs />

      <DestinationShowcase onOpenQuoteModal={onOpenQuoteModal} />

      <Testimonials />

      <CTABanner
        onOpenQuoteModal={onOpenQuoteModal}
        onOpenAIModal={onOpenAIModal}
      />
    </div>
  );
};
