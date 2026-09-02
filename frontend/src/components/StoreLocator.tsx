import { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, X } from 'lucide-react';
import { storeLocations, type StoreLocation } from '../data/storeLocations';

export default function StoreLocator({ onClose }: { onClose?: () => void }) {
  const [activeStore, setActiveStore] = useState<StoreLocation>(storeLocations[0]);

  const openDirections = (store: StoreLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: '#fff', maxWidth: '1100px', width: '100%', maxHeight: '90vh',
        overflow: 'auto', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 28px', borderBottom: '1px solid #E8E0D6',
          background: '#1A1A2E', color: '#fff'
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
              <MapPin size={20} style={{ marginRight: '8px', color: '#1E3A8A' }} />
              Our Stores
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>
              {storeLocations.length} locations across Karnataka
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                border: 'none', color: '#fff', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '420px' }}>
          {/* Store List */}
          <div style={{
            flex: '0 0 320px', borderRight: '1px solid #E8E0D6', overflow: 'auto',
            maxHeight: '500px', background: '#FDF8F3'
          }}>
            {storeLocations.map(store => (
              <div
                key={store.id}
                onClick={() => setActiveStore(store)}
                style={{
                  padding: '18px 22px', cursor: 'pointer', transition: 'all 0.2s',
                  borderBottom: '1px solid #E8E0D6',
                  background: activeStore.id === store.id ? '#fff' : 'transparent',
                  borderLeft: activeStore.id === store.id ? '3px solid #B91C1C' : '3px solid transparent'
                }}
                onMouseEnter={(e) => { if (activeStore.id !== store.id) e.currentTarget.style.background = '#F1F5F9'; }}
                onMouseLeave={(e) => { if (activeStore.id !== store.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <MapPin size={16} color={store.isPrimary ? '#B91C1C' : '#1E3A8A'} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1A1A2E' }}>{store.city}</span>
                  {store.isPrimary && (
                    <span style={{
                      fontSize: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: '#B91C1C', border: '1px solid #B91C1C', padding: '1px 6px'
                    }}>Flagship</span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8A7A6A', lineHeight: 1.5, marginLeft: '26px' }}>
                  {store.address}, {store.city}
                </div>
              </div>
            ))}
          </div>

          {/* Map + Details */}
          <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
            {/* Map */}
            <div style={{ height: '300px', position: 'relative', zIndex: 1 }}>
              <iframe
                title="Store Location on Google Maps"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${activeStore.lat},${activeStore.lng}&hl=en&z=15&output=embed`}
                allowFullScreen
              ></iframe>
            </div>

            {/* Active Store Details */}
            <div style={{ padding: '24px 28px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1A1A2E', margin: '0 0 4px' }}>{activeStore.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#8A7A6A', margin: 0, lineHeight: 1.6 }}>
                    {activeStore.address}, {activeStore.city}, {activeStore.state} — {activeStore.pincode}
                  </p>
                </div>
                <button
                  onClick={() => openDirections(activeStore)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                    background: '#B91C1C', color: '#fff', border: 'none', fontSize: '0.75rem',
                    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap'
                  }}
                >
                  <Navigation size={16} /> Get Directions
                </button>
              </div>
              <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#6B6B6B' }}>
                  <Phone size={15} color="#B91C1C" /> {activeStore.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#6B6B6B' }}>
                  <Clock size={15} color="#B91C1C" /> {activeStore.hours}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .leaflet-popup-content-wrapper { border-radius: 2px; }
        .leaflet-popup-content { margin: 12px 16px; }
      `}</style>
    </div>
  );
}
