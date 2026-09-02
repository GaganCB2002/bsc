import { useState } from 'react';
import { ShieldCheck, Cookie, X, Check, FileText } from 'lucide-react';
import './CookieConsent.css';

function getStoredConsent() {
  return typeof window !== 'undefined' ? localStorage.getItem('cookieConsent') || '' : '';
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(() => getStoredConsent() === '');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
  };

  return (
    <>
      {showBanner && (
        <div className="cookie-banner-wrapper">
          <div className="cookie-banner-title">
            <Cookie size={22} color="#F59E0B" />
            Cookie & Terms Preferences
          </div>
          <div className="cookie-banner-desc">
            BSC Exclusive uses essential cookies and local caching to enhance your learning experience, maintain secure 24-hour user sessions, and store your course progress. By continuing, you accept our Terms & Conditions.
          </div>
          <div className="cookie-banner-actions">
            <button className="cookie-btn-accept" onClick={handleAccept}>
              <Check size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Accept All
            </button>
            <button className="cookie-btn-reject" onClick={handleReject}>
              Reject Non-Essential
            </button>
            <button className="cookie-btn-terms" onClick={() => setShowTermsModal(true)}>
              <FileText size={14} style={{ display: 'inline', marginRight: '4px' }} />
              View Terms & Conditions
            </button>
          </div>
        </div>
      )}

      {showTermsModal && (
        <div className="terms-modal-overlay">
          <div className="terms-modal-content">
            <div className="terms-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="#10B981" />
                <h3>Terms & Conditions - BSC Exclusive</h3>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="terms-modal-body">
              <h4>1. Introduction & Heritage</h4>
              <p>Welcome to BSC Exclusive Learning Academy (Established 1938). By accessing our digital learning platform, you agree to comply with our code of conduct, intellectual property protection, and privacy guidelines.</p>

              <h4>2. Session & Security Policy</h4>
              <p>User authentication tokens are maintained securely for 24 hours. After 24 hours of inactivity or active session duration, users are automatically logged out to safeguard profile data.</p>

              <h4>3. Rate Limiting & Account Protection</h4>
              <p>To prevent unauthorized access, user accounts will be locked for 15 minutes after 5 consecutive failed login attempts.</p>

              <h4>4. Intellectual Property Rights</h4>
              <p>All course materials, including silk weaving videos, textile care documentation, and instructional materials, are owned exclusively by BSC Exclusive and protected under copyright law.</p>

              <h4>5. Data Privacy & Local Storage</h4>
              <p>We utilize browser cache and local storage strictly to remember your authentication session, course progress, and site preferences.</p>
            </div>
            <div className="terms-modal-footer">
              <button
                className="cookie-btn-accept"
                onClick={() => {
                  handleAccept();
                  setShowTermsModal(false);
                }}
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
