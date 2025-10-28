const API_BASE_URL = 'https://functions.poehali.dev/34f1da25-ce05-42fc-ab88-0cc15ff780ed';

export const api = {
  async getProducts(limit?: number) {
    const params = new URLSearchParams({ action: 'products' });
    if (limit) params.append('limit', limit.toString());
    const res = await fetch(`${API_BASE_URL}?${params}`);
    return res.json();
  },

  async getReviews() {
    const res = await fetch(`${API_BASE_URL}?action=reviews`);
    return res.json();
  },

  async checkDiscount(phone: string) {
    const params = new URLSearchParams({ action: 'check-discount', phone });
    const res = await fetch(`${API_BASE_URL}?${params}`);
    return res.json();
  },

  async createOrder(phone: string, items: any[], discount_percent: number) {
    const res = await fetch(`${API_BASE_URL}?action=create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, items, discount_percent }),
    });
    return res.json();
  },

  async getOrders(phone: string) {
    const params = new URLSearchParams({ action: 'orders', phone });
    const res = await fetch(`${API_BASE_URL}?${params}`);
    return res.json();
  },
};
