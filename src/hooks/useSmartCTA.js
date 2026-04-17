import { useState, useEffect } from 'react';

/**
 * useSmartCTA
 * 
 * Automatically determines if the current context should use the 
 * internal pricing flow ("See Prices and Availability") or the 
 * external consultation flow ("Book a Free Consultation").
 */
export default function useSmartCTA(overrideType = null) {
  const [ctaConfig, setCtaConfig] = useState({
    type: 'external',
    label: 'Book a Free Consultation'
  });

  useEffect(() => {
    const updateConfig = () => {
      const path = window.location.pathname;
      const storedType = sessionStorage.getItem('serviceType');
      const selectedService = sessionStorage.getItem('selectedService');

      // 1. Check if the current context belongs to an internal pricing flow
      // Eligibility: Recurring, House Cleaning/oneTime, or Carpet Cleaning
      const isInternal = 
        overrideType === 'internal' ||
        path.includes('recurring-services') ||
        path.includes('one-time-maid-services') ||
        path.includes('deep-cleaning') ||
        path.includes('home-detailing-cleaning') ||
        path.includes('move-in-ready') ||
        path.includes('carpet-cleaning') ||
        storedType === 'recurring' ||
        storedType === 'oneTime' ||
        selectedService === 'Carpet Cleaning';

      // 2. Set the configuration based on eligibility
      if (isInternal) {
        setCtaConfig({
          type: 'internal',
          label: 'See Prices and Availability'
        });
      } else {
        setCtaConfig({
          type: 'external',
          label: 'Book a Free Consultation'
        });
      }
    };

    // Initial check
    updateConfig();

    // We use a short interval to sync state between components that share sessionStorage
    // (e.g., when ServiceFinder updates state, the Header catches up)
    const interval = setInterval(updateConfig, 1000);

    return () => clearInterval(interval);
  }, [overrideType]);

  return ctaConfig;
}
