import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'; // 1. 匯入 ClerkProvider
import { CartProvider } from './contexts/CartProvider';

// 引入我們的 CSS 和元件
import './index.css';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import About from './pages/About.jsx';
import Cart from './pages/Cart.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';


const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY. Please add it to your .env.local file.");
}

// 建立路由設定物件
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // 使用 App 作為所有頁面的父層佈局
    // 在 children 中定義子路由
    children: [
      {
        index: true, // index: true 表示這個是預設的子路由
        element: <Home />,
      },
      {
        path: "menu",
        element: <Menu />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);

// 渲染應用程式，傳入 RouterProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      {/* 2. 用 CartProvider 包裹 RouterProvider */}
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ClerkProvider>
  </React.StrictMode>
);
