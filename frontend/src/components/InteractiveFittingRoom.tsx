import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { X, ShoppingCart, Download, Upload, User, Sparkles, Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTryOn } from '../context/TryOnContext';
import { useCart } from '../context/CartContext';
import { getProductsByCategory, type Product } from '../data/mockProducts';
import { showToast } from './Toast';
import { useDragRotation } from '../hooks/useDragRotation';

// Gender mismatch dialog component
function GenderWarningDialog({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', borderRadius: '12px' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', maxWidth: '300px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#1E293B', fontSize: '1.1rem' }}>Model Gender Mismatch</h3>
        <p style={{ margin: '0 0 20px 0', color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5 }}>
          The product you selected appears to be for a different gender than your current model. 
          Would you like to try it on anyway?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#B91C1C', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            Yes, apply it
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveFittingRoom() {
  const {
    isOpen, closeFittingRoom,
    models,
    sessions, activeSessionId, addSession, switchSession, removeSession,
    updateSessionRotation, selectProduct, selectModel, setCustomImageUrl, generateTryOn,
  } = useTryOn();
  
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSize] = useState('');
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');

  const activeSession = useMemo(() => sessions.find(s => s.id === activeSessionId) || sessions[0], [sessions, activeSessionId]);

  const { handlers: dragHandlers } = useDragRotation({
    sensitivity: 2.5,
    onRotationChange: (newRot) => {
      updateSessionRotation(activeSession.id, newRot);
    }
  });

  const suggestions = useMemo(() => {
    if (!activeSession.selectedProduct) return [];
    const pId = activeSession.selectedProduct.id;
    return getProductsByCategory(
      pId.startsWith('w') ? 'women' : pId.startsWith('m') ? 'men' : 'kids'
    ).filter(p => p.virtualTryOn && p.id !== pId).slice(0, 10);
  }, [activeSession.selectedProduct]);

  // Auto-apply Try-On when product and model are selected and status is idle
  useEffect(() => {
    if (activeSession.status === 'idle' && activeSession.selectedProduct && (activeSession.model || activeSession.customImageUrl)) {
      generateTryOn();
    }
  }, [activeSession.status, activeSession.selectedProduct, activeSession.model, activeSession.customImageUrl, generateTryOn]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('error', 'Please upload a JPEG, PNG, or WebP image');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'Image must be under 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomImageUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [setCustomImageUrl]);

  const handleAddToCart = useCallback(() => {
    if (!activeSession.selectedProduct) return;
    if (!selectedSize) {
      showToast('info', 'Please select a size before adding to cart');
      return;
    }
    const numericPrice = Number(activeSession.selectedProduct.price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      showToast('info', 'Cannot add this product to cart from the virtual fitting room yet. Please use the product page.');
      return;
    }
    addToCart({
      id: activeSession.selectedProduct.id,
      name: activeSession.selectedProduct.name,
      price: numericPrice,
      image: activeSession.selectedProduct.image,
      size: selectedSize,
    });
    showToast('success', 'Added to cart!');
  }, [activeSession.selectedProduct, selectedSize, addToCart]);

  const handleDownload = useCallback(() => {
    if (!activeSession.currentGeneration?.resultImage) return;
    const link = document.createElement('a');
    link.href = activeSession.currentGeneration.resultImage;
    link.download = `try-on-${activeSession.selectedProduct?.name || 'result'}.jpg`;
    link.click();
  }, [activeSession.currentGeneration, activeSession.selectedProduct]);

  const handleProductSelect = useCallback((p: Product) => {
    // Check gender mismatch heuristically
    const isProductFemale = p.id.startsWith('w-');
    const isProductMale = p.id.startsWith('m-');
    const isModelFemale = activeSession.model?.gender === 'female';
    const isModelMale = activeSession.model?.gender === 'male';

    if ((isProductFemale && isModelMale) || (isProductMale && isModelFemale)) {
      setPendingProduct(p);
    } else {
      selectProduct(p.id, p.name, p.image);
    }
  }, [activeSession.model, selectProduct]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex' }}>
      {/* Overlay */}
      <div
        onClick={closeFittingRoom}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      />

      {/* Main Panel */}
      <div style={{
        position: 'relative', margin: 'auto', width: '100%', maxWidth: '1200px', height: '90vh',
        background: '#fff', display: 'flex', flexDirection: 'row', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        
        {/* Left Sidebar: Session & Model Switcher */}
        <div style={{ width: '280px', borderRight: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Sparkles size={24} color="#B91C1C" />
             <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Fitting Room</h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              People in Room ({sessions.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sessions.map(session => (
                <div key={session.id} onClick={() => switchSession(session.id)} style={{
                  padding: '12px', background: activeSession.id === session.id ? '#fff' : 'transparent',
                  borderRadius: '12px', border: activeSession.id === session.id ? '2px solid #B91C1C' : '2px solid transparent',
                  boxShadow: activeSession.id === session.id ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#E2E8F0', flexShrink: 0 }}>
                    {(session.currentGeneration?.resultImage || session.customImageUrl || session.model?.imageUrl) ? (
                       <img src={session.currentGeneration?.resultImage || session.customImageUrl || session.model?.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Model" />
                    ) : (
                       <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="#94A3B8" /></div>
                    )}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{session.name}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {session.selectedProduct?.name || 'No clothing selected'}
                    </p>
                  </div>
                  {sessions.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeSession(session.id); }} style={{
                      position: 'absolute', top: '-6px', right: '-6px', background: '#fff', border: '1px solid #E2E8F0',
                      borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#94A3B8', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}

              <button onClick={() => addSession()} style={{
                padding: '12px', background: 'transparent', border: '2px dashed #CBD5E1', borderRadius: '12px',
                color: '#64748B', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}>
                <Plus size={18} /> Add Person
              </button>
            </div>
          </div>
        </div>

        {/* Center: 360 Canvas & Details */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Top Bar inside Center */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={closeFittingRoom} style={{
              background: '#F1F5F9', border: 'none', cursor: 'pointer', padding: '8px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', color: '#64748B',
            }} aria-label="Close fitting room">
              <X size={20} />
            </button>
          </div>

          {/* Viewer Area */}
          <div style={{ flex: 1, background: '#fff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <GenderWarningDialog 
              isOpen={!!pendingProduct} 
              onCancel={() => setPendingProduct(null)} 
              onConfirm={() => { 
                if(pendingProduct) selectProduct(pendingProduct.id, pendingProduct.name, pendingProduct.image); 
                setPendingProduct(null); 
              }} 
            />

            {/* Simulating 360 Container */}
            <div 
              {...dragHandlers}
              style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'grab', userSelect: 'none', position: 'relative'
              }}
            >
              {activeSession.status === 'processing' ? (
                 <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{
                      width: '60px', height: '60px', border: '3px solid #F1F5F9',
                      borderTopColor: '#B91C1C', borderRadius: '50%',
                      animation: 'spin 1s linear infinite', margin: '0 auto 20px',
                    }} />
                    <p style={{ color: '#64748B', fontSize: '1rem', fontWeight: 500 }}>
                      Applying {activeSession.selectedProduct?.name}...
                    </p>
                 </div>
              ) : activeSession.currentGeneration?.resultImage ? (
                 <img
                    src={activeSession.currentGeneration.resultImage}
                    alt="Result"
                    style={{
                      maxHeight: '80%', maxWidth: '80%', objectFit: 'contain',
                      transform: `rotateY(${activeSession.rotation}deg)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                    draggable={false}
                 />
              ) : activeSession.model || activeSession.customImageUrl ? (
                 <img
                    src={activeSession.customImageUrl || activeSession.model?.imageUrl}
                    alt="Model"
                    style={{
                      maxHeight: '80%', maxWidth: '80%', objectFit: 'contain', borderRadius: '16px',
                      transform: `rotateY(${activeSession.rotation}deg)`,
                      transition: 'transform 0.1s ease-out', opacity: 0.8
                    }}
                    draggable={false}
                 />
              ) : (
                <div style={{ color: '#94A3B8', textAlign: 'center' }}>
                  <User size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p>Select a model to start</p>
                </div>
              )}

              {/* 360 indicator overlay */}
              <div style={{ position: 'absolute', bottom: '30px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '8px 16px', borderRadius: '24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                <ChevronLeft size={16} /> Drag to rotate <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* Action Bar (Add to cart, Try On Button) */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'center', gap: '16px', background: '#F8FAFC' }}>
            {activeSession.status === 'idle' || activeSession.status === 'failed' ? (
               <button onClick={generateTryOn} disabled={!activeSession.selectedProduct || (!activeSession.model && !activeSession.customImageUrl)} style={{
                padding: '14px 32px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '1rem', fontWeight: 600, cursor: (!activeSession.selectedProduct || (!activeSession.model && !activeSession.customImageUrl)) ? 'not-allowed' : 'pointer',
                opacity: (!activeSession.selectedProduct || (!activeSession.model && !activeSession.customImageUrl)) ? 0.5 : 1,
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(185, 28, 28, 0.2)'
              }}>
                <Sparkles size={18} /> Apply Clothing
              </button>
            ) : activeSession.status === 'completed' ? (
              <>
                <button onClick={handleAddToCart} style={{
                  padding: '14px 32px', background: '#B91C1C', color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button onClick={handleDownload} style={{
                  padding: '14px 24px', background: '#fff', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '8px',
                  fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <Download size={18} /> Save Image
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Right Sidebar: Model Details & Clothing Selection */}
        <div style={{ width: '320px', borderLeft: '1px solid #E2E8F0', background: '#fff', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9' }}>
             <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '16px' }}>Select Model</h3>
             
             <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button onClick={() => setGenderFilter('all')} style={{ flex: 1, padding: '6px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #E2E8F0', borderRadius: '6px', background: genderFilter === 'all' ? '#1E293B' : '#fff', color: genderFilter === 'all' ? '#fff' : '#64748B', cursor: 'pointer' }}>All</button>
                <button onClick={() => setGenderFilter('female')} style={{ flex: 1, padding: '6px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #E2E8F0', borderRadius: '6px', background: genderFilter === 'female' ? '#1E293B' : '#fff', color: genderFilter === 'female' ? '#fff' : '#64748B', cursor: 'pointer' }}>Female</button>
                <button onClick={() => setGenderFilter('male')} style={{ flex: 1, padding: '6px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #E2E8F0', borderRadius: '6px', background: genderFilter === 'male' ? '#1E293B' : '#fff', color: genderFilter === 'male' ? '#fff' : '#64748B', cursor: 'pointer' }}>Male</button>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {models.filter(m => genderFilter === 'all' || m.gender === genderFilter).map(model => (
                  <div key={model._id} onClick={() => { selectModel(model); setCustomImageUrl(''); }} style={{
                    border: activeSession.model?._id === model._id ? '2px solid #B91C1C' : '2px solid transparent',
                    borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', position: 'relative'
                  }}>
                    <img src={model.imageUrl} alt={model.name} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.65rem', padding: '4px', textAlign: 'center' }}>
                      {model.name}
                    </div>
                  </div>
                ))}
             </div>
             <button onClick={() => fileInputRef.current?.click()} style={{
                width: '100%', marginTop: '12px', padding: '10px', background: '#F1F5F9', color: '#64748B', border: 'none',
                borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
             }}>
                <Upload size={16} /> Upload Your Photo
             </button>
             <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} style={{ display: 'none' }} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '16px' }}>Available Clothing</h3>
            {activeSession.selectedProduct && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                 <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: 600 }}>Currently Selected</p>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={activeSession.selectedProduct.image} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} alt="Selected" />
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', margin: '0 0 4px 0' }}>{activeSession.selectedProduct.name}</p>
                      <p style={{ fontSize: '0.85rem', color: '#B91C1C', margin: 0, fontWeight: 700 }}>${activeSession.selectedProduct.price}</p>
                    </div>
                 </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {suggestions.map((p) => (
                <div key={p.id} onClick={() => handleProductSelect(p)} style={{
                  border: activeSession.selectedProduct?.id === p.id ? '2px solid #B91C1C' : '1px solid #E2E8F0',
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', background: '#fff'
                }}>
                  <div style={{ width: '100%', paddingBottom: '125%', position: 'relative' }}>
                    <img src={p.image} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '8px' }}>
                    <p style={{ fontSize: '0.7rem', color: '#1E293B', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{p.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#B91C1C', margin: 0, fontWeight: 700 }}>${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
