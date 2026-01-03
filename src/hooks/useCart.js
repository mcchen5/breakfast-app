import { useContext } from "react";
import CartContext from "../contexts/CartContext.js";

export default function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    // 建立一個保護機制，確保這個 Hook 只在 CartProvider 內部使用
    throw new Error("useCart 必須在 CartProvider 中使用");
  }
  return context;
}