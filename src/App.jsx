import React from 'react';
import { Outlet } from 'react-router-dom'; // 匯入 Outlet
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Outlet 是 react-router 的一個特殊元件，
            它會根據當前的 URL，將對應的子路由頁面元件渲染到這裡 */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
