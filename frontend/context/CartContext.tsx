'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Material } from '@/lib/api';

export interface CartItem extends Material {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (material: Material, quantity?: number) => void;
  removeItem: (uuid: string) => void;
  updateQuantity: (uuid: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (material: Material, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.uuid === material.uuid);

      if (existingItem) {
        return currentItems.map((item) =>
          item.uuid === material.uuid
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { ...material, quantity }];
    });
  };

  const removeItem = (uuid: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.uuid !== uuid));
  };

  const updateQuantity = (uuid: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(uuid);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.uuid === uuid ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}