// src/contexts/CartProvider.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import CartContext from './CartContext';
import * as api from '../services/api';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;

  // 載入購物車
  useEffect(() => {
    if (!isUserLoaded) return;

    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (!userId) {
          setCartItems([]);
        } else {
          const items = await api.fetchCart(userId);
          setCartItems(items || []); 
        }
      } catch (err) {
        console.error('抓取購物車失敗:', err);
        setError(err.message);
        setCartItems([]); 
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [userId, isUserLoaded]);

  // 重新整理購物車
  const refreshCart = useCallback(async () => {
    if (!userId) return;
    try {
      const items = await api.fetchCart(userId);
      setCartItems(items || []);
    } catch (err) {
      console.error('刷新購物車失敗:', err);
      setError(err.message);
      setCartItems([]);
    }
  }, [userId]);

  const addToCart = useCallback(async (menuItem) => {
    if (!userId) throw new Error("請先登入");
    try {
      const existingItem = await api.findCartItemByMenuId(menuItem.id, userId);
      if (existingItem) {
        await api.updateCartItem(existingItem.id, { quantity: existingItem.quantity + 1 });
      } else {
        await api.addCartItem({
          ...menuItem,
          menuItemId: menuItem.id,
          id: undefined,
          userId,
          quantity: 1,
        });
      }
      await refreshCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, refreshCart]);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      await api.removeCartItem(itemId);
      await refreshCart();
    } catch (err) {
      console.error('刪除購物車項目失敗:', err);
      setError(err.message);
    }
  }, [refreshCart]);

  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    const quantity = Math.max(0, newQuantity);
    if (quantity === 0) {
      await removeFromCart(itemId);
    } else {
      try {
        await api.updateCartItem(itemId, { quantity });
        await refreshCart();
      } catch (err) {
        console.error('更新數量失敗:', err);
        setError(err.message);
      }
    }
  }, [removeFromCart, refreshCart]);

  const clearCart = useCallback(async () => {
    if (!userId) return;
    try {
      const items = await api.fetchCart(userId);
      for (const item of items || []) {
        await api.removeCartItem(item.id);
      }
      await refreshCart();
    } catch (err) {
      console.error('清空購物車失敗:', err);
      setError(err.message);
    }
  }, [userId, refreshCart]);

  const checkout = useCallback(async () => {
    const safeItems = cartItems || [];
    if (!userId || safeItems.length === 0) throw new Error("購物車是空的或使用者未登入");

    const orderPayload = {
      userId,
      items: safeItems.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      await api.createOrder(orderPayload);
      await clearCart();
    } catch (err) {
      console.error('結帳失敗:', err);
      setError(err.message);
      throw err;
    }
  }, [userId, cartItems, clearCart]);

  const safeCartItems = cartItems || [];
  const cartCount = safeCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = safeCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({
    cartItems: safeCartItems,
    cartCount,
    totalAmount,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    clearCart,
  }), [safeCartItems, cartCount, totalAmount, isLoading, error, addToCart, removeFromCart, updateQuantity, checkout, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
