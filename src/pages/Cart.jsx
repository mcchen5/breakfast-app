import React, { useState } from 'react'; // 引入 useState
import { Link, useNavigate } from 'react-router-dom'; // 引入 useNavigate
import useCart from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';

const CartPage = () => {
  // 從 useCart Hook 中取得所有我們需要的狀態和函式
  const { cartItems, cartCount, totalAmount, updateQuantity, removeFromCart, checkout } = useCart();
  const navigate = useNavigate(); // 用於頁面跳轉
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);

  // 2. 建立結帳處理函式
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError(null);
    try {
      await checkout();
      // 結帳成功後，可以跳轉到一個感謝頁面或訂單頁
      alert("下單成功！感謝您的購買！");
      navigate('/'); // 跳轉回首頁
    } catch (err) {
      setError(err.message || "結帳過程中發生錯誤，請稍後再試。");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // 狀況一：購物車是空的
  if (cartCount === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">你的購物車是空的</h1>
        <p className="mb-6">快去看看我們的美味菜單，把喜歡的都加進來！</p>
        <Link to="/menu" className="btn btn-primary">
          前往菜單
        </Link>
      </div>
    );
  }

  // 狀況二：購物車有商品
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">我的購物車</h1>
      {/* 商品列表 */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>商品</th>
              <th>單價</th>
              <th>數量</th>
              <th>小計</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={item.image} alt={item.name} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td>{formatCurrency(item.price)}</td>
                <td>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="btn btn-xs"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className="btn btn-xs"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{formatCurrency(item.price * item.quantity)}</td>
                <td>
                  <button 
                    className="btn btn-ghost btn-xs"
                    onClick={() => removeFromCart(item.id)}
                  >
                    移除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <div className="alert alert-error mt-4"><span>{error}</span></div>}
      {/* 總計與結帳 */}
      <div className="mt-8 flex justify-end">
        <div className="card w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">訂單摘要</h2>
            <div className="flex justify-between">
              <span>商品總數</span>
              <span>{cartCount}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>總金額</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="card-actions justify-end mt-4">
               <button 
                className="btn btn-primary w-full"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? <span className="loading loading-spinner"></span> : "前往結帳"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;