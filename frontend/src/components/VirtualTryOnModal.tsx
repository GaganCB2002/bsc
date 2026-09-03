import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Sparkles, Download, Share2, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import tryOnService from '../services/tryOnService';
import type { TryOnModel, TryOnConfig } from '../services/tryOnService';
import { useAuth } from '../context/AuthContext';
import { showToast } from './Toast';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
    category?: string;
  };
  onAddToCart?: () => void;
}

export default function VirtualTryOnModal({ isOpen, onClose, product, onAddToCart }: VirtualTryOnModalProps) {
  const { isAuthenticated } = useAuth();
  const [config, setConfig] = useState<TryOnConfig | null>(null);
  const [models, setModels] = useState<TryOnModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'preset' | 'upload'>('preset');
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Guard against setState-after-unmount when the modal closes mid-generation.
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setResultImage(null);
      setIsGenerating(false);
      setGenerationStep(0);
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [configData, modelsData] = await Promise.all([
          tryOnService.getConfig(),
          tryOnService.getModels()
        ]);

        if (cancelled) return;
        setConfig(configData.data.config);
        setModels(modelsData.data);

        if (modelsData.data.length > 0) {
          const defaultModel = modelsData.data.find((m: TryOnModel) => m.isDefault);
          setSelectedModelId(defaultModel?._id || modelsData.data[0]._id);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load Virtual Try-On data';
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('error', 'Please upload a JPEG, PNG, or WebP image');
      e.target.value = '';
      return;
    }
    const maxMB = config?.maxImageUploadSizeMB || 10;
    if (file.size > maxMB * 1024 * 1024) {
      showToast('error', `Image must be under ${maxMB}MB`);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!isMountedRef.current) return;
      setUploadedImage(event.target?.result as string);
      setActiveTab('upload');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleGenerate = async () => {
    if (!config?.enabled) {
      setError('Virtual Try-On is currently disabled.');
      return;
    }
    
    if (!isAuthenticated && !config.allowGuestUsers) {
      setError('Please log in to use Virtual Try-On.');
      return;
    }

    if (activeTab === 'preset' && !selectedModelId) {
      setError('Please select a model.');
      return;
    }

    if (activeTab === 'upload' && !uploadedImage) {
      setError('Please upload a photo.');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Animation sequence
      const steps = [
        'Analyzing garment fabric and texture...',
        'Mapping silhouette and dimensions...',
        'Rendering high-precision fit...'
      ];

      for (let i = 0; i < steps.length; i++) {
        if (!isMountedRef.current) return;
        setGenerationStep(i);
        await new Promise(r => setTimeout(r, 800));
      }
      if (!isMountedRef.current) return;

      await tryOnService.generate({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        modelId: activeTab === 'preset' ? selectedModelId : undefined,
        customImageUrl: activeTab === 'upload' ? uploadedImage! : undefined
      });

      // Since we simulate processing in backend, we poll or just wait a bit
      // For demo, we just wait 1.5s and assume success
      await new Promise(r => setTimeout(r, 1500));
      if (!isMountedRef.current) return;

      // Fake successful result for demo purposes
      // In reality, we'd fetch the completed generation status
      setResultImage(product.image); // Using product image as placeholder

    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      const message = err instanceof Error ? err.message : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Generation failed. Please try again.';
      setError(message);
    } finally {
      if (isMountedRef.current) setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '1000px',
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E2E8F0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(to right, #F8FAFC, #FFFFFF)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#FEF2F2', padding: '8px', borderRadius: '8px', color: '#B91C1C' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B', margin: 0 }}>AI Virtual Try-On</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>See how {product.name} looks on you</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
            color: '#64748B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} title="Close">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* LEFT: Controls */}
          <div style={{ width: '380px', borderRight: '1px solid #E2E8F0', padding: '24px', overflowY: 'auto', background: '#F8FAFC' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>Loading models...</div>
            ) : error ? (
              <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'start', gap: '12px' }}>
                <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9rem' }}>{error}</span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '8px', background: '#E2E8F0', padding: '4px', borderRadius: '10px', marginBottom: '24px' }}>
                  <button 
                    onClick={() => setActiveTab('preset')}
                    style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: activeTab === 'preset' ? '#fff' : 'transparent', color: activeTab === 'preset' ? '#1E293B' : '#64748B', boxShadow: activeTab === 'preset' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                  >
                    Select Model
                  </button>
                  <button 
                    onClick={() => setActiveTab('upload')}
                    style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: activeTab === 'upload' ? '#fff' : 'transparent', color: activeTab === 'upload' ? '#1E293B' : '#64748B', boxShadow: activeTab === 'upload' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                  >
                    Upload Photo
                  </button>
                </div>

                {activeTab === 'preset' && (
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>Choose a Model</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {models.map(model => (
                        <div 
                          key={model._id} 
                          onClick={() => setSelectedModelId(model._id)}
                          style={{
                            border: selectedModelId === model._id ? '2px solid #B91C1C' : '2px solid transparent',
                            borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                          }}
                        >
                          <img src={model.imageUrl} alt={model.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                          {selectedModelId === model._id && (
                            <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#B91C1C', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '6px 8px' }}>
                            <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 500 }}>{model.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'upload' && (
                  <div>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '40px 20px',
                        textAlign: 'center', cursor: 'pointer', background: '#fff', transition: 'all 0.2s',
                        marginBottom: '16px'
                      }}
                    >
                      <Upload size={32} color="#94A3B8" style={{ marginBottom: '12px' }} />
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', margin: '0 0 4px 0' }}>Click to upload</h3>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>JPG, PNG up to {config?.maxImageUploadSizeMB || 10}MB</p>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '8px 0 0 0' }}>For best results, use a full-body photo facing forward.</p>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} />
                    </div>
                    {uploadedImage && (
                      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', width: '120px', aspectRatio: '3/4', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <img src={uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={() => setUploadedImage(null)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', color: '#fff', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!resultImage && !isGenerating && (
                  <button 
                    onClick={handleGenerate}
                    style={{
                      width: '100%', marginTop: '30px', background: '#B91C1C', color: '#fff',
                      border: 'none', padding: '14px', borderRadius: '8px', fontSize: '0.95rem',
                      fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '0 4px 12px rgba(185, 28, 28, 0.3)'
                    }}
                  >
                    <Sparkles size={18} /> Generate Virtual Fit
                  </button>
                )}
              </>
            )}
          </div>

          {/* RIGHT: Preview / Result Area */}
          <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
            
            {!isGenerating && !resultImage && (
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '160px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <img src={product.image} alt="Product" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ color: '#94A3B8', fontSize: '2rem' }}>+</div>
                <div style={{ width: '160px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#E2E8F0', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '3/4' }}>
                  {activeTab === 'preset' && selectedModelId ? (
                    <img src={models.find(m => m._id === selectedModelId)?.imageUrl} alt="Selected Model" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : activeTab === 'upload' && uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Select Model</span>
                  )}
                </div>
              </div>
            )}

            {isGenerating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative', width: '240px', aspectRatio: '3/4', borderRadius: '16px', overflow: 'hidden', background: '#E2E8F0' }}>
                  {activeTab === 'preset' ? (
                     <img src={models.find(m => m._id === selectedModelId)?.imageUrl} alt="Model" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px)' }} />
                  ) : (
                     <img src={uploadedImage!} alt="Upload" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px)' }} />
                  )}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(185,28,28,0.1), rgba(185,28,28,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  </div>
                </div>
                <div style={{ background: '#fff', padding: '12px 24px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Sparkles size={16} color="#B91C1C" />
                  <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>
                    {generationStep === 0 && 'Analyzing garment fabric and texture...'}
                    {generationStep === 1 && 'Mapping silhouette and dimensions...'}
                    {generationStep === 2 && 'Rendering high-precision fit...'}
                  </span>
                </div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {resultImage && !isGenerating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
                <div style={{ width: '280px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', position: 'relative' }}>
                  <img src={resultImage} alt="Fit Result" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', padding: '6px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Perfect Fit
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={() => setResultImage(null)} style={{ padding: '10px 20px', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    Try Another
                  </button>
                  {config?.allowImageDownload && (
                    <button style={{ padding: '10px 20px', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Download size={16} /> Save Image
                    </button>
                  )}
                  {config?.allowResultSharing && (
                    <button style={{ padding: '10px 20px', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Share2 size={16} /> Share
                    </button>
                  )}
                </div>

                {onAddToCart && (
                  <button 
                    onClick={() => { onAddToCart(); onClose(); }}
                    style={{ padding: '14px 32px', background: '#B91C1C', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(185, 28, 28, 0.3)' }}
                  >
                    <ShoppingBag size={18} /> Add to Cart
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
