import type { MenuItem } from "@shared/schema";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CheckoutData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: "delivery" | "pickup";
  address?: string;
  addressNumber?: string;
  complement?: string;
  paymentMethod: "card" | "pix" | "cash";
  items: Array<{
    menuItemId: number;
    quantity: number;
  }>;
}

export interface OrderResponse {
  orderNumber: string;
  total: string;
  estimatedTime: string;
  status: string;
}
