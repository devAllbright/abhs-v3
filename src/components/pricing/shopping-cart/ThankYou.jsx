import React, { useEffect } from 'react'
import '../../../styles/pricing/thank-you.css'

export default function ThankYou() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='thank-you-msg'>
      <p>Thank you for choosing Allbright Home Services! You will now be redirected.</p>
    </div>
  );
}
