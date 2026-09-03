import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, RotateCcw, ShoppingCart, Download, RefreshCw, Upload, User, Sparkles, Check } from 'lucide-react';
import { useTryOn } from '../context/TryOnContext';
import { useCart } from '../context/CartContext';
import { getProductsByCategory, type Product } from '../data/mockProducts';
import { showToast } from './Toast';

const statusMessages: Record<string, string> = {
  idle: '',
  selected: '',
  uploading: 'Uploading your image...',
  processing: 'Creating your virtual try-on...',
  completed: 'Try-on complete!',
  failed: 'Unable to generate the try-on. Please try again.',
  retrying: 'Retrying...',
};

export default function VirtualFittingRoom() {
  const {
    isOpen, closeFittingRoom, selectedProduct, selectProduct,
    models, selectedModel, selectModel, customImageUrl, setCustomImageUrl,
    status, currentGeneration, generateTryOn, reset,
  } = useTryOn();
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizePicker, setShowSizePicker] = useState(false);

  const suggestions = selectedProduct
    ? getProductsByCategory(
        selectedProduct.id.startsWith('w') ? 'women' :
        selectedProduct.id.startsWith('m') ? 'men' : 'kids'
      ).filter(p => p.virtualTryOn && p.id !== selectedProduct.id).slice(0, 8)
    : [];

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
      selectModel({ _id: '', name: 'Custom Photo', imageUrl: ev.target?.result as string, gender: 'unisex', isDefault: false });
    };
    reader.readAsDataURL(file);
  }, [setCustomImageUrl, selectModel]);

  const handleAddToCart = useCallback(() => {
    if (!selectedProduct) return;
    if (!selectedSize) {
      setShowSizePicker(true);
      showToast('info', 'Please select a size before adding to cart');
      return;
    }
    // TODO(integration): tryOn virtual products need a real price lookup.
    // Until that endpoint exists, we refuse to add a price-0 product to the
    // cart so the user isn't surprised by a "free" order at checkout.
    const numericPrice = Number(selectedProduct.price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      showToast('info', 'Cannot add this product to cart from the virtual fitting room yet. Please use the product page.');
      return;
    }
    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: numericPrice,
      image: selectedProduct.image,
      size: selectedSize,
    });
    showToast('success', 'Added to cart!');
  }, [selectedProduct, selectedSize, addToCart]);

  const handleDownload = useCallback(() => {
    if (!currentGeneration?.resultImage) return;
    const link = document.createElement('a');
    link.href = currentGeneration.resultImage;
    link.download = `try-on-${selectedProduct?.name || 'result'}.jpg`;
    link.click();
  }, [currentGeneration, selectedProduct]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex' }}>
      {/* Overlay */}
      <div
        onClick={closeFittingRoom}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />

      {/* Panel */}
      <div style={{
        position: 'relative', marginLeft: 'auto', width: '100%', maxWidth: '900px',
        background: '#fff', display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 30px rgba(0,0,0,0.2)', animation: 'slideInRight 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid #E2E8F0', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#B91C1C" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Virtual Fitting Room</h2>
          </div>
          <button onClick={closeFittingRoom} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
            borderRadius: '8px', display: 'flex', alignItems: 'center', color: '#64748B',
          }} aria-label="Close fitting room">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Main area: Preview + Product selection */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Preview Area */}
            <div style={{
              flex: 1, minHeight: '300px', background: '#F8FAFC', display: 'flex',
              alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              {status === 'processing' || status === 'uploading' || status === 'retrying' ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{
                    width: '60px', height: '60px', border: '3px solid #F1F5F9',
                    borderTopColor: '#B91C1C', borderRadius: '50%',
                    animation: 'spin 1s linear infinite', margin: '0 auto 20px',
                  }} />
                  <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 500 }}>
                    {statusMessages[status]}
                  </p>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '8px' }}>
                    This may take a few moments
                  </p>
                </div>
              ) : status === 'completed' && currentGeneration?.resultImage ? (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={currentGeneration.resultImage}
                    alt="Virtual try-on result"
                    style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(22,163,74,0.9)', color: '#fff', padding: '6px 16px',
                    borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <Check size={14} /> Try-on complete
                  </div>
                </div>
              ) : status === 'failed' ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%', background: '#FEE2E2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                  }}>
                    <X size={24} color="#B91C1C" />
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '16px' }}>
                    Unable to generate the try-on. Please try again.
                  </p>
                  <button onClick={reset} style={{
                    padding: '8px 20px', background: '#B91C1C', color: '#fff', border: 'none',
                    borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}>
                    Try Again
                  </button>
                </div>
              ) : selectedProduct ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  {selectedModel ? (
                    <div>
                      <img
                        src={selectedModel.imageUrl}
                        alt={selectedModel.name}
                        style={{ width: '200px', height: '260px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }}
                      />
                      <p style={{ color: '#64748B', fontSize: '0.8rem' }}>{selectedModel.name}</p>
                    </div>
                  ) : (
                    <div style={{
                      width: '200px', height: '260px', borderRadius: '12px', background: '#E2E8F0',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto', color: '#94A3B8',
                    }}>
                      <User size={40} />
                      <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Select a model</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#94A3B8', padding: '40px' }}>
                  <Sparkles size={32} />
                  <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>Select a product to try on</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid #E2E8F0',
              display: 'flex', gap: '10px', flexWrap: 'wrap', flexShrink: 0,
            }}>
              {status === 'completed' && currentGeneration?.resultImage ? (
                <>
                  <button onClick={reset} style={{
                    flex: 1, padding: '10px 16px', background: '#F1F5F9', color: '#1E293B',
                    border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <RefreshCw size={15} /> Try Another
                  </button>
                  <button onClick={handleAddToCart} style={{
                    flex: 1, padding: '10px 16px', background: '#B91C1C', color: '#fff',
                    border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <ShoppingCart size={15} /> Add to Cart
                  </button>
                  <button onClick={handleDownload} style={{
                    padding: '10px 16px', background: '#fff', color: '#64748B',
                    border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem',
                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <Download size={15} /> Save
                  </button>
                </>
              ) : status === 'idle' || status === 'failed' ? (
                <button onClick={generateTryOn} disabled={!selectedProduct || (!selectedModel && !customImageUrl)} style={{
                  flex: 1, padding: '12px 20px', background: '#B91C1C', color: '#fff',
                  border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
                  cursor: (!selectedProduct || (!selectedModel && !customImageUrl)) ? 'not-allowed' : 'pointer',
                  opacity: (!selectedProduct || (!selectedModel && !customImageUrl)) ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  <Sparkles size={16} /> Try On Virtually
                </button>
              ) : null}

              {selectedProduct && (
                <Link to={`/product/${selectedProduct.id}`} onClick={closeFittingRoom} style={{
                  padding: '10px 16px', background: '#fff', color: '#64748B',
                  border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem',
                  fontWeight: 600, textDecoration: 'none', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  View Product
                </Link>
              )}

              <button onClick={reset} style={{
                padding: '10px 16px', background: '#fff', color: '#64748B',
                border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem',
                fontWeight: 600, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                <RotateCcw size={15} /> Reset
              </button>
            </div>
          </div>

          {/* Bottom section: Model Selection + Product Carousel */}
          <div style={{ borderTop: '1px solid #E2E8F0', flexShrink: 0 }}>
            {/* Model Selection */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', margin: 0 }}>Choose Model</h3>
                <button onClick={() => fileInputRef.current?.click()} style={{
                  padding: '6px 12px', background: '#F1F5F9', color: '#64748B', border: 'none',
                  borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <Upload size={13} /> Upload Photo
                </button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {models.map(model => (
                  <button
                    key={model._id}
                    onClick={() => { selectModel(model); setCustomImageUrl(''); }}
                    style={{
                      flexShrink: 0, width: '72px', padding: '4px',
                      border: selectedModel?._id === model._id ? '2px solid #B91C1C' : '2px solid #E2E8F0',
                      borderRadius: '10px', background: '#fff', cursor: 'pointer',
                      opacity: selectedModel?._id === model._id ? 1 : 0.7,
                      transition: 'all 0.2s',
                    }}
                  >
                    <img src={model.imageUrl} alt={model.name} style={{
                      width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px',
                    }} />
                    <p style={{ fontSize: '0.6rem', color: '#64748B', marginTop: '4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {model.name}
                    </p>
                  </button>
                ))}
                {customImageUrl && (
                  <button
                    onClick={() => {}}
                    style={{
                      flexShrink: 0, width: '72px', padding: '4px',
                      border: '2px solid #B91C1C', borderRadius: '10px', background: '#fff',
                      cursor: 'default', opacity: 1,
                    }}
                  >
                    <img src={customImageUrl} alt="Your photo" style={{
                      width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px',
                    }} />
                    <p style={{ fontSize: '0.6rem', color: '#B91C1C', marginTop: '4px', textAlign: 'center', fontWeight: 600 }}>
                      Your Photo
                    </p>
                  </button>
                )}
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '8px' }}>
                Upload your own photo or use one of our models. Your photo is not stored permanently.
              </p>
            </div>

            {/* Product Selection */}
            {selectedProduct && (
              <div style={{ padding: '16px 24px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', margin: '0 0 12px' }}>
                  Currently Trying: <span style={{ color: '#B91C1C' }}>{selectedProduct.name}</span>
                </h3>

                {/* Size picker */}
                {showSizePicker && (
                  <div style={{ marginBottom: '12px', padding: '12px', background: '#FEF3C7', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                    <p style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 600, marginBottom: '8px' }}>Select a size:</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <button key={size} onClick={() => { setSelectedSize(size); setShowSizePicker(false); }} style={{
                          width: '44px', height: '44px', border: `1.5px solid ${selectedSize === size ? '#B91C1C' : '#E2E8F0'}`,
                          backgroundColor: selectedSize === size ? '#FEE2E2' : '#fff',
                          color: selectedSize === size ? '#B91C1C' : '#1E293B',
                          fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer', borderRadius: '6px', fontFamily: 'inherit',
                        }}>{size}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product carousel */}
                {suggestions.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '8px' }}>
                      Switch to another product:
                    </p>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {suggestions.map((p: Product) => (
                        <button
                          key={p.id}
                          onClick={() => selectProduct(p.id, p.name, p.image)}
                          style={{
                            flexShrink: 0, width: '80px', padding: '4px',
                            border: selectedProduct.id === p.id ? '2px solid #B91C1C' : '2px solid #E2E8F0',
                            borderRadius: '8px', background: '#fff', cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          <img src={p.image} alt={p.name} style={{
                            width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px',
                          }} />
                          <p style={{ fontSize: '0.55rem', color: '#64748B', marginTop: '4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
