const API_BASE_URL = 'http://localhost:3301';

// 輔助函式，用於處理 fetch 回應
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '發生未知錯誤' }));
    throw new Error(error.message || '請求失敗');
  }
  return response.json();
}

// 獲取某個使用者的購物車
export async function fetchCart(userId) {
  if (!userId) return [];
  const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}`);
  return handleResponse(response);
}

// 根據菜單 ID 查詢購物車中是否已有該商品
export async function findCartItemByMenuId(menuItemId, userId) {
  if (!userId) return null;
  const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}&menuItemId=${menuItemId}`);
  const items = await handleResponse(response);
  return items[0] || null;
}

// 新增一個商品到購物車
export async function addCartItem(item) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return handleResponse(response);
}

// 更新購物車中的商品 (例如更新數量)
export async function updateCartItem(itemId, updatedFields) {
  const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFields),
  });
  return handleResponse(response);
}

// 從購物車中刪除一個商品
export async function removeCartItem(itemId) {
  const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}