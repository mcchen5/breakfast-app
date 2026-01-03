import { useState, useEffect } from 'react';

export default function useMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 定義一個非同步函式來獲取資料
    const fetchMenuItems = async () => {
      try {
        // 使用 Fetch API 向我們的模擬伺服器請求資料
        const response = await fetch('http://localhost:3301/menu');
        if (!response.ok) {
          throw new Error('無法獲取菜單資料');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        // 無論成功或失敗，最後都將載入狀態設為 false
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []); // 空依賴陣列 [] 表示這個 effect 只在元件掛載時執行一次

  // 回傳狀態和資料
  return { menuItems, isLoading, error };
}