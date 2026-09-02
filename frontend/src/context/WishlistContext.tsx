import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
  comparePrice?: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => boolean;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

function getStoredWishlist(email: string): WishlistItem[] {
  try {
    const stored = localStorage.getItem(`wishlist_${email}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const userEmail = isAuthenticated && user ? user.email : '';
  const [items, setItems] = useState<WishlistItem[]>(() => userEmail ? getStoredWishlist(userEmail) : []);

  const persistWishlist = useCallback((email: string, newItems: WishlistItem[]) => {
    localStorage.setItem(`wishlist_${email}`, JSON.stringify(newItems));
  }, []);

  const addToWishlist = useCallback((item: WishlistItem): boolean => {
    if (!userEmail) return false;
    setItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      const updated = [...prev, item];
      persistWishlist(userEmail, updated);
      return updated;
    });
    return true;
  }, [userEmail, persistWishlist]);

  const removeFromWishlist = useCallback((id: string) => {
    if (!userEmail) return;
    setItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      persistWishlist(userEmail, updated);
      return updated;
    });
  }, [userEmail, persistWishlist]);

  const isInWishlist = useCallback((id: string) => {
    return items.some(i => i.id === id);
  }, [items]);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
