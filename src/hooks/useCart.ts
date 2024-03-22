import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import { Guitar, CartItem } from "../types";
export const useCart = () => {

  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item: Guitar) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);

    if (itemExists < 0) {
      const newItem: CartItem = { ...item, quantity: 1 }
      setCart([...cart, newItem]);
    } else {
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    }
  }

  function removeCart(guitar: Guitar['id']) {
    setCart((prev) => prev.filter((item) => item.id !== guitar));
  }

  const MAX_ITEMS = 10;
  const MIN_ITEMS = 1;

  function increaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }
  function cleanCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + (item.quantity * item.price), 0),
    [cart]
  );

  return {
    addToCart,
    data,
    cart,
    cleanCart,
    removeCart,
    increaseQuantity,
    decreaseQuantity,
    isEmpty,
    cartTotal
  };
};
