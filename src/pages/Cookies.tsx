import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cookies() {
  useEffect(() => { document.title = 'Cookie Policy - BSC Exclusive'; }, []);
  return (
    <div style={{ background: '#FDF8F3', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link to="/" style={{ color: '#C47A6A', fontSize: '0.82rem', textDecoration: 'none' }}>← Back to Home</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#2C2826', margin: '20px 0' }}>Cookie <span style={{ fontWeight: 700, color: '#C47A6A' }}>Policy</span></h1>
        <div style={{ fontSize: '0.88rem', color: '#6B6B6B', lineHeight: 1.8 }}>
          <p>BSC Exclusive uses cookies to enhance your browsing experience, analyze site traffic, and personalize content.</p>
          <h3 style={{ color: '#2C2826', margin: '24px 0 8px' }}>What Are Cookies</h3>
          <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve site functionality.</p>
          <h3 style={{ color: '#2C2826', margin: '24px 0 8px' }}>How We Use Cookies</h3>
          <p>We use essential cookies for site operation, analytics cookies to understand usage patterns, and marketing cookies (with your consent) to show relevant offers.</p>
          <h3 style={{ color: '#2C2826', margin: '24px 0 8px' }}>Managing Cookies</h3>
          <p>You can control cookie preferences through your browser settings. Disabling cookies may affect certain site features.</p>
        </div>
      </div>
    </div>
  );
}
