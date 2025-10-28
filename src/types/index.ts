export interface Product {
  id: number;
  name: string;
  category: string;
  condition: 'new' | 'used';
  price: number;
  description: string;
  image_url: string;
  stock: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  source: string;
  created_at: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  total_amount: number;
  discount_percent: number;
  status: string;
  is_preorder: boolean;
  created_at: string;
}

export interface Customer {
  id: number;
  phone: string;
  name?: string;
  email?: string;
  total_orders: number;
  discount_tier: number;
  created_at: string;
}
