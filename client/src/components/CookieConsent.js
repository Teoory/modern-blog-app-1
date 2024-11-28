import React, { useState, useEffect } from 'react';
import './CookieConsent.css';
import ReactGA from 'react-ga4';

const CookieConsent = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      enableGoogleAnalytics();
    } else if (!consent) {
      setIsPopupVisible(true);
    }
  }, []);

  const enableGoogleAnalytics = () => {
    ReactGA.initialize('G-L90S7CY9N9');
    ReactGA.send('pageview');
  };

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    enableGoogleAnalytics();
    setHasConsented(true);
    setIsPopupVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setHasConsented(false);
    setIsPopupVisible(false);
  };

  if (!isPopupVisible || hasConsented) {
    return null;
  }

  return (
    <div className="cookie-consent-popup">
      <p>
        Bu web sitesi çerezleri kullanmaktadır. Deneyiminizi iyileştirmek için çerez kullanımına izin verir misiniz?
      </p>
      <div className="cookie-buttons">
        <button onClick={handleAccept}>Kabul Et</button>
        <button onClick={handleDecline}>Reddet</button>
      </div>
    </div>
  );
};

export default CookieConsent;
