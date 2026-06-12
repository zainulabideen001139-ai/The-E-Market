export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  specifications: Specification[];
  imageUrl: string;
  sku: string;
  stock: number;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'JazzCash' | 'Easypaisa' | 'Stripe' | 'PayPal' | 'Credit / Debit Card (Safepay)';
  status: OrderStatus;
  trackingNumber: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export type ActivePage =
  | 'home'
  | 'shop'
  | 'categories'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'shipping-policy'
  | 'refund-policy'
  | 'account'
  | 'admin'
  | 'safepay-verify'
  | 'safepay-cancel'
  | 'safepay-simulator';
