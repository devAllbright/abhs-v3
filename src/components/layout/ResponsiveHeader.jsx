import { useEffect, useState } from 'react';
import Header from './Header';
import MobileHeader from './MobileHeader';

export default function ResponsiveHeader() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1024px)');
    const handler = () => setIsMobile(media.matches);
    handler();
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return isMobile ? <MobileHeader /> : <Header />;
}
