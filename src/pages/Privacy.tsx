import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  useEffect(() => { document.title = 'Privacy Policy - BS Channabasappa'; }, []);
  return (
    <div style={{ background: '#FDF8F3', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link to="/" style={{ color: '#C47A6A', fontSize: '0.82rem', textDecoration: 'none' }}>← Back to Home</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#2C2826', margin: '20px 0' }}>Privacy <span style={{ fontWeight: 700, color: '#C47A6A' }}>Policy</span></h1>
        <div style={{ fontSize: '0.88rem', color: '#6B6B6B', lineHeight: 1.8 }}>
          <p>At BS Channabasappa Silks & Sarees, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
          <h3 style={{ color: '#2C2826', margin: '24px 0 8px' }}>Information We Collect</h3>
          <p>We collect information you provide when creating an account, placing an order, or subscribing to our newsletter — including your name, email address, phone number, shipping address, and payment details.</p>
          <h3 style={{ color: '#2C2826', margin: '24px 0 8px' }}>How We Use Your Information</h3>
          <p>We use your information to process orders, provide customer support, send order updates, and occasionally share promotional offers (with your consent).</p>
          <h3 style={{ color: '#2C2826', margin: '24px 0 8px' }}>Data Security</h3>
          <p>We implement industry-standard security measures to protect your personal data. Payment information is encrypted and never stored on our servers.</p>
          <h3 style={{ color: '#2C2826', margin: '24px 0 8px' }}>Contact</h3>
          <p>For privacy-related inquiries, contact us at hello@bschannabasappa.com.</p>
        </div>
      </div>
    </div>
  );
}
