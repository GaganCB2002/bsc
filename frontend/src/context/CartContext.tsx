import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { showToast } from '../components/Toast';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => boolean;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

const storageKey = (email: string) => `cart_${email}`;

function loadCart(email: string): CartItem[] {
  try {
    const stored = localStorage.getItem(storageKey(email));
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidCartItem) : [];
  } catch {
    return [];
  }
}

function saveCart(email: string, items: CartItem[]) {
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(items));
  } catch {
    showToast('warning', 'Could not save cart — storage full or unavailable.');
  }
}

function isValidCartItem(x: unknown): x is CartItem {
  if (!x || typeof x !== 'object') return false;
  const it = x as Partial<CartItem>;
  return (
    typeof it.id === 'string' &&
    typeof it.name === 'string' &&
    typeof it.size === 'string' &&
    typeof it.price === 'number' && Number.isFinite(it.price) && it.price >= 0 &&
    typeof it.quantity === 'number' && Number.isFinite(it.quantity) && it.quantity > 0
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const userEmail = isAuthenticated && user ? user.email : '';
  const [items, setItems] = useState<CartItem[]>(() => (userEmail ? loadCart(userEmail) : []));

  // Reload the cart when the signed-in user changes.
  useEffect(() => {
    setItems(userEmail ? loadCart(userEmail) : []);
  }, [userEmail]);

  const persist = useCallback(
    (email: string, next: CartItem[]) => {
      if (email) saveCart(email, next);
    },
    []
  );

  const addToCart = useCallback(
    (item: Omit<CartItem, 'quantity'>, qty: number = 1): boolean => {
      // Defensive validation: a malformed item from a future API should not crash the tree.
      if (!item || typeof item.id !== 'string' || typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) {
        if (import.meta.env.DEV) console.warn('addToCart: invalid item', item);
        return false;
      }
      const safeQty = Math.max(1, Math.min(99, Math.floor(qty)));
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id && i.size === item.size);
        const next = existing
          ? prev.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: Math.min(99, i.quantity + safeQty) }
                : i
            )
          : [...prev, { ...item, quantity: safeQty }];
        if (userEmail) persist(userEmail, next);
        return next;
      });
      return true;
    },
    [userEmail, persist]
  );

  const removeFromCart = useCallback(
    (id: string, size: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => !(i.id === id && i.size === size));
        if (userEmail) persist(userEmail, next);
        return next;
      });
    },
    [userEmail, persist]
  );

  const updateQuantity = useCallback(
    (id: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id, size);
        return;
      }
      const safeQty = Math.max(1, Math.min(99, Math.floor(quantity)));
      setItems((prev) => {
        const next = prev.map((i) =>
          i.id === id && i.size === size ? { ...i, quantity: safeQty } : i
        );
        if (userEmail) persist(userEmail, next);
        return next;
      });
    },
    [removeFromCart, userEmail, persist]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (userEmail) persist(userEmail, []);
  }, [userEmail, persist]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
