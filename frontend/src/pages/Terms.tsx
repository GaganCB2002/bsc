import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  useEffect(() => { document.title = 'Terms of Service - BSC Exclusive'; }, []);
  return (
    <div style={{ background: '#FDF8F3', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link to="/" style={{ color: '#B91C1C', fontSize: '0.82rem', textDecoration: 'none' }}>← Back to Home</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#1A1A2E', margin: '20px 0' }}>Terms of <span style={{ fontWeight: 700, color: '#B91C1C' }}>Service</span></h1>
        <div style={{ fontSize: '0.88rem', color: '#6B6B6B', lineHeight: 1.8 }}>
          <p>By using BSC Exclusive website, you agree to the following terms and conditions.</p>
          <h3 style={{ color: '#1A1A2E', margin: '24px 0 8px' }}>Orders & Payments</h3>
          <p>All orders are subject to availability. We reserve the right to cancel any order due to pricing errors or stock unavailability. Full refunds will be processed in such cases.</p>
          <h3 style={{ color: '#1A1A2E', margin: '24px 0 8px' }}>Shipping & Delivery</h3>
          <p>Delivery times are estimates and not guaranteed. We are not responsible for delays caused by courier partners or customs clearance.</p>
          <h3 style={{ color: '#1A1A2E', margin: '24px 0 8px' }}>Returns & Refunds</h3>
          <p>Please refer to our Customer Service page for detailed return and refund policies.</p>
          <h3 style={{ color: '#1A1A2E', margin: '24px 0 8px' }}>Intellectual Property</h3>
          <p>All content on this website, including images, text, and designs, is the property of BSC Exclusive and may not be reproduced without permission.</p>
        </div>
      </div>
    </div>
  );
}
