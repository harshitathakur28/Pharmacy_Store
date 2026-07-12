import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'medicart_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((medicine, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.medicineId === medicine._id);
      const maxQty = medicine.stock;
      if (existing) {
        return prev.map((i) =>
          i.medicineId === medicine._id
            ? { ...i, qty: Math.min(i.qty + qty, maxQty) }
            : i
        );
      }
      return [
        ...prev,
        {
          medicineId: medicine._id,
          name: medicine.name,
          price: medicine.price,
          imageUrl: medicine.imageUrl,
          stock: medicine.stock,
          qty: Math.min(qty, maxQty),
        },
      ];
    });
  }, []);

  const removeItem = useCallback((medicineId) => {
    setItems((prev) => prev.filter((i) => i.medicineId !== medicineId));
  }, []);

  const updateQty = useCallback((medicineId, qty) => {
    setItems((prev) =>
      prev.map((i) =>
        i.medicineId === medicineId
          ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
