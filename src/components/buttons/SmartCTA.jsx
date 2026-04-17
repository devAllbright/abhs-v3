import useSmartCTA from '../../hooks/useSmartCTA';
import CTAButton from './CTAButton';
import HCPButton from './HCPButton';

/**
 * SmartCTA
 * 
 * A unified button component that automatically chooses between 
 * the internal pricing flow and the external consultation flow.
 * 
 * @param {string} buttonClass - CSS class for the button
 * @param {string} secondaryCta - Fallback label for the consultation flow
 * @param {string} forceType - Optional override ('internal' | 'external')
 */
export default function SmartCTA({ buttonClass, secondaryCta, forceType = null }) {
  const { type, label } = useSmartCTA(forceType);

  // If internal, use the mandatory "See Prices and Availability"
  // If external, use the provided secondaryCta or the default "Book a Free Consultation"
  const finalLabel = type === 'internal' ? 'See Prices and Availability' : (secondaryCta || label);

  if (type === 'internal') {
    return (
      <CTAButton 
        buttonClass={buttonClass} 
        label={finalLabel} 
      />
    );
  }

  return (
    <HCPButton 
      secondaryCta={finalLabel} 
      buttonClass={buttonClass} 
    />
  );
}
