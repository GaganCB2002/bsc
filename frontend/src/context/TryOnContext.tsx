import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { tryOnService, type TryOnModel, type TryOnGeneration, type TryOnConfig } from '../services/tryOnService';
import { showToast } from '../components/Toast';

export type TryOnStatus = 'idle' | 'selected' | 'uploading' | 'processing' | 'completed' | 'failed' | 'retrying';

export interface TryOnSession {
  id: string;
  name: string;
  model: TryOnModel | null;
  customImageUrl: string;
  selectedProduct: { id: string; name: string; image: string; price?: number } | null;
  status: TryOnStatus;
  currentGeneration: TryOnGeneration | null;
  rotation: number;
}

interface TryOnContextType {
  isOpen: boolean;
  openFittingRoom: (productId: string, productName: string, productImage: string, productPrice?: number) => void;
  closeFittingRoom: () => void;
  
  // Legacy / Active Session proxies
  selectedProduct: { id: string; name: string; image: string; price?: number } | null;
  selectProduct: (id: string, name: string, image: string) => void;
  models: TryOnModel[];
  selectedModel: TryOnModel | null;
  selectModel: (model: TryOnModel) => void;
  customImageUrl: string;
  setCustomImageUrl: (url: string) => void;
  status: TryOnStatus;
  currentGeneration: TryOnGeneration | null;
  generateTryOn: () => Promise<void>;
  reset: () => void;
  
  config: TryOnConfig | null;
  loadConfig: () => Promise<void>;
  loadModels: () => Promise<void>;

  // Multi-model support
  sessions: TryOnSession[];
  activeSessionId: string;
  addSession: (model?: TryOnModel) => void;
  switchSession: (sessionId: string) => void;
  removeSession: (sessionId: string) => void;
  updateSessionRotation: (sessionId: string, rotation: number) => void;
}

const TryOnContext = createContext<TryOnContextType | null>(null);

export function TryOnProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<TryOnModel[]>([]);
  const [config, setConfig] = useState<TryOnConfig | null>(null);

  const [sessions, setSessions] = useState<TryOnSession[]>([{
    id: 'default',
    name: 'Model 1',
    model: null,
    customImageUrl: '',
    selectedProduct: null,
    status: 'idle',
    currentGeneration: null,
    rotation: 0
  }]);
  const [activeSessionId, setActiveSessionId] = useState<string>('default');

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Hold poll handles
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  const updateActiveSession = useCallback((updates: Partial<TryOnSession>) => {
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, ...updates } : s));
  }, [activeSessionId]);

  const updateSessionById = useCallback((id: string, updates: Partial<TryOnSession>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      const res = await tryOnService.getConfig();
      if (res.success) setConfig(res.data.config);
    } catch {
      // Silently fail
    }
  }, []);

  const loadModels = useCallback(async () => {
    try {
      const res = await tryOnService.getModels();
      if (!isMountedRef.current) return;
      if (res.success) {
        setModels(res.data);
        const defaultModel = res.data.find((m: TryOnModel) => m.isDefault) || res.data[0];
        
        setSessions(prev => prev.map(s => {
          if (!s.model && !s.customImageUrl) {
            let matchingModel = defaultModel;
            if (s.selectedProduct) {
              const isFemale = s.selectedProduct.id.startsWith('w-');
              const isMale = s.selectedProduct.id.startsWith('m-');
              if (isFemale) {
                matchingModel = res.data.find((m: TryOnModel) => m.gender === 'female') || matchingModel;
              } else if (isMale) {
                matchingModel = res.data.find((m: TryOnModel) => m.gender === 'male') || matchingModel;
              }
            }
            return { ...s, model: matchingModel };
          }
          return s;
        }));
      }
    } catch {
      // Silently fail
    }
  }, []);

  const openFittingRoom = useCallback((productId: string, productName: string, productImage: string, productPrice?: number) => {
    stopPolling();
    // Reset sessions on open for clean slate
    const newSessionId = 'session_' + Date.now();
    
    // Auto-select gender based on product
    const isFemale = productId.startsWith('w-');
    const isMale = productId.startsWith('m-');
    let matchingModel = models.find(m => m.isDefault) || models[0] || null;
    
    if (isFemale) {
      matchingModel = models.find(m => m.gender === 'female') || matchingModel;
    } else if (isMale) {
      matchingModel = models.find(m => m.gender === 'male') || matchingModel;
    }
    
    setSessions([{
      id: newSessionId,
      name: 'Model 1',
      model: matchingModel,
      customImageUrl: '',
      selectedProduct: { id: productId, name: productName, image: productImage, price: productPrice },
      status: 'idle',
      currentGeneration: null,
      rotation: 0
    }]);
    setActiveSessionId(newSessionId);
    setIsOpen(true);
    loadConfig();
    if (models.length === 0) loadModels();
  }, [loadConfig, loadModels, stopPolling, models]);

  const closeFittingRoom = useCallback(() => {
    stopPolling();
    setIsOpen(false);
  }, [stopPolling]);

  const selectProduct = useCallback((id: string, name: string, image: string) => {
    updateActiveSession({
      selectedProduct: { id, name, image },
      status: 'idle',
      currentGeneration: null
    });
  }, [updateActiveSession]);

  const selectModel = useCallback((model: TryOnModel) => {
    updateActiveSession({ model });
  }, [updateActiveSession]);

  const setCustomImageUrl = useCallback((url: string) => {
    updateActiveSession({ customImageUrl: url, model: null });
  }, [updateActiveSession]);

  const reset = useCallback(() => {
    stopPolling();
    updateActiveSession({ status: 'idle', currentGeneration: null });
  }, [stopPolling, updateActiveSession]);

  const generateTryOn = useCallback(async () => {
    const session = sessions.find(s => s.id === activeSessionId);
    if (!session || !session.selectedProduct) return;

    const modelToSend = session.customImageUrl ? undefined : session.model?._id;
    if (!modelToSend && !session.customImageUrl) {
      showToast('warning', 'Please select a model or upload your photo');
      return;
    }

    try {
      updateActiveSession({ status: 'processing' });
      const res = await tryOnService.generate({
        productId: session.selectedProduct.id,
        productName: session.selectedProduct.name,
        productImage: session.selectedProduct.image,
        modelId: modelToSend,
        customImageUrl: session.customImageUrl || undefined,
      });

      if (!isMountedRef.current) return;

      if (res.success) {
        const gen = res.data;
        updateActiveSession({ currentGeneration: gen });

        stopPolling();
        pollIntervalRef.current = setInterval(async () => {
          if (!isMountedRef.current) {
            stopPolling();
            return;
          }
          try {
            const statusRes = await tryOnService.getStatus(gen._id);
            if (!isMountedRef.current) return;
            if (statusRes.success) {
              const updated = statusRes.data;
              updateActiveSession({ currentGeneration: updated });

              if (updated.status === 'completed') {
                stopPolling();
                updateActiveSession({ status: 'completed' });
                showToast('success', 'Virtual try-on complete!');
              } else if (updated.status === 'failed') {
                stopPolling();
                updateActiveSession({ status: 'failed' });
                showToast('error', 'Try-on generation failed. Please try again.');
              }
            }
          } catch {
            stopPolling();
            updateActiveSession({ status: 'failed' });
          }
        }, 2000);

        pollTimeoutRef.current = setTimeout(() => stopPolling(), 60_000);
      } else {
        updateActiveSession({ status: 'failed' });
        showToast('error', res.message || 'Failed to start generation');
      }
    } catch {
      if (!isMountedRef.current) return;
      updateActiveSession({ status: 'failed' });
      showToast('error', 'Unable to connect to try-on service');
    }
  }, [sessions, activeSessionId, stopPolling, updateActiveSession]);

  // Multi-model specific methods
  const addSession = useCallback((model?: TryOnModel) => {
    const newSessionId = 'session_' + Date.now();
    const newSessionName = `Model ${sessions.length + 1}`;
    setSessions(prev => [...prev, {
      id: newSessionId,
      name: newSessionName,
      model: model || models.find(m => m.isDefault) || models[0] || null,
      customImageUrl: '',
      selectedProduct: null, // New sessions start with no product
      status: 'idle',
      currentGeneration: null,
      rotation: 0
    }]);
    setActiveSessionId(newSessionId);
  }, [sessions.length, models]);

  const switchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const removeSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (filtered.length === 0) {
        // Fallback if deleting last session
        const newId = 'session_' + Date.now();
        setActiveSessionId(newId);
        return [{
          id: newId,
          name: 'Model 1',
          model: models.find(m => m.isDefault) || models[0] || null,
          customImageUrl: '',
          selectedProduct: null,
          status: 'idle',
          currentGeneration: null,
          rotation: 0
        }];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeSessionId, models]);

  const updateSessionRotation = useCallback((sessionId: string, rotation: number) => {
    updateSessionById(sessionId, { rotation });
  }, [updateSessionById]);

  return (
    <TryOnContext.Provider
      value={{
        isOpen,
        openFittingRoom,
        closeFittingRoom,
        
        // Proxy to active session
        selectedProduct: activeSession.selectedProduct,
        selectProduct,
        models,
        selectedModel: activeSession.model,
        selectModel,
        customImageUrl: activeSession.customImageUrl,
        setCustomImageUrl,
        status: activeSession.status,
        currentGeneration: activeSession.currentGeneration,
        generateTryOn,
        reset,
        
        config,
        loadConfig,
        loadModels,

        // Multi-model
        sessions,
        activeSessionId,
        addSession,
        switchSession,
        removeSession,
        updateSessionRotation
      }}
    >
      {children}
    </TryOnContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTryOn() {
  const ctx = useContext(TryOnContext);
  if (!ctx) throw new Error('useTryOn must be used within TryOnProvider');
  return ctx;
}
