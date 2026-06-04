import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { storeLocations, type StoreLocation } from '../data/storeLocations';
import 'leaflet/dist/leaflet.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function primaryIcon() {
  return L.divIcon({
    className: '',
    html: '<div style="background:#C47A6A;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)">BS</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  });
}

function secondaryIcon() {
  return L.divIcon({
    className: '',
    html: '<div style="background:#D4A574;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25)">BS</div>',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -32],
  });
}

function FlyToStore({ store }: { store: StoreLocation }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([store.lat, store.lng], 15, { duration: 1.2 });
  }, [map, store]);
  return null;
}

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
          background: '#2C2826', color: '#fff'
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
              <MapPin size={20} style={{ marginRight: '8px', color: '#D4A574' }} />
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
                  borderLeft: activeStore.id === store.id ? '3px solid #C47A6A' : '3px solid transparent'
                }}
                onMouseEnter={(e) => { if (activeStore.id !== store.id) e.currentTarget.style.background = '#F5E6D3'; }}
                onMouseLeave={(e) => { if (activeStore.id !== store.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <MapPin size={16} color={store.isPrimary ? '#C47A6A' : '#D4A574'} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#2C2826' }}>{store.city}</span>
                  {store.isPrimary && (
                    <span style={{
                      fontSize: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: '#C47A6A', border: '1px solid #C47A6A', padding: '1px 6px'
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
              <MapContainer
                center={[activeStore.lat, activeStore.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FlyToStore store={activeStore} />
                {storeLocations.map(s => (
                  <Marker
                    key={s.id}
                    position={[s.lat, s.lng]}
                    icon={s.isPrimary ? primaryIcon() : secondaryIcon()}
                    eventHandlers={{ click: () => setActiveStore(s) }}
                  >
                    <Popup>
                      <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                        <strong style={{ color: '#C47A6A' }}>{s.name}</strong><br />
                        {s.address}<br />
                        {s.city}, {s.state} — {s.pincode}<br />
                        <span style={{ color: '#8A7A6A' }}>📞 {s.phone}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Active Store Details */}
            <div style={{ padding: '24px 28px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2C2826', margin: '0 0 4px' }}>{activeStore.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#8A7A6A', margin: 0, lineHeight: 1.6 }}>
                    {activeStore.address}, {activeStore.city}, {activeStore.state} — {activeStore.pincode}
                  </p>
                </div>
                <button
                  onClick={() => openDirections(activeStore)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                    background: '#C47A6A', color: '#fff', border: 'none', fontSize: '0.75rem',
                    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap'
                  }}
                >
                  <Navigation size={16} /> Get Directions
                </button>
              </div>
              <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#6B6B6B' }}>
                  <Phone size={15} color="#C47A6A" /> {activeStore.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#6B6B6B' }}>
                  <Clock size={15} color="#C47A6A" /> {activeStore.hours}
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
