import {
  menuItems,
  orders,
  orderItems,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "@shared/schema";

export interface IStorage {
  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(orderNumber: string): Promise<Order | undefined>;
  
  // Order Items
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentMenuItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.menuItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentMenuItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;

    // Initialize with sample menu data
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    const sampleItems: InsertMenuItem[] = [
      // Entradas
      {
        name: "Bruschetta de Tomate e Manjericão",
        description: "Pão artesanal tostado com tomates frescos, manjericão e azeite extra virgem",
        price: "18.90",
        category: "entradas",
        imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&h=600&fit=crop",
        available: 1,
      },
      {
        name: "Salada Caesar Gourmet",
        description: "Alface romana, croutons artesanais, parmesão e molho caesar especial",
        price: "24.90",
        category: "entradas",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
        available: 1,
      },
      {
        name: "Tábua de Antepastos",
        description: "Seleção de queijos, embutidos, azeitonas e geleia artesanal",
        price: "32.90",
        category: "entradas",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
        available: 1,
      },

      // Pratos Principais
      {
        name: "Salmão Grelhado com Legumes",
        description: "Filé de salmão grelhado, acompanha legumes salteados e molho de ervas",
        price: "45.90",
        category: "principais",
        imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
        available: 1,
      },
      {
        name: "Bife Ancho Grelhado",
        description: "Corte premium grelhado na brasa, acompanha batatas rústicas e salada",
        price: "52.90",
        category: "principais",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
        available: 1,
      },
      {
        name: "Peito de Frango ao Molho de Cogumelos",
        description: "Peito de frango grelhado com molho cremoso de cogumelos e risotto",
        price: "38.90",
        category: "principais",
        imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&h=600&fit=crop",
        available: 1,
      },

      // Massas
      {
        name: "Spaghetti Carbonara",
        description: "Massa fresca com molho cremoso, bacon, ovos e parmesão ralado",
        price: "28.90",
        category: "massas",
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop",
        available: 1,
      },
      {
        name: "Fettuccine Alfredo",
        description: "Fettuccine ao molho branco cremoso com frango grelhado e brócolis",
        price: "32.90",
        category: "massas",
        imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&h=600&fit=crop",
        available: 1,
      },

      // Sobremesas
      {
        name: "Petit Gateau",
        description: "Bolinho de chocolate quente com sorvete de baunilha e calda especial",
        price: "16.90",
        category: "sobremesas",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
        available: 1,
      },
      {
        name: "Tiramisu Clássico",
        description: "Sobremesa italiana com camadas de mascarpone, café e cacau",
        price: "14.90",
        category: "sobremesas",
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop",
        available: 1,
      },

      // Bebidas
      {
        name: "Vinho Tinto Reserva",
        description: "Vinho tinto encorpado, ideal para acompanhar carnes",
        price: "45.00",
        category: "bebidas",
        imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop",
        available: 1,
      },
      {
        name: "Suco Natural de Laranja",
        description: "Suco de laranja fresco, espremido na hora",
        price: "8.90",
        category: "bebidas",
        imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&h=600&fit=crop",
        available: 1,
      },
    ];

    sampleItems.forEach((item) => {
      this.createMenuItem(item);
    });
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.category === category
    );
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item: MenuItem = { 
      ...insertItem, 
      id,
      available: insertItem.available ?? 1
    };
    this.menuItems.set(id, item);
    return item;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const orderNumber = `SD${new Date().getFullYear()}${String(id).padStart(3, '0')}`;
    const order: Order = {
      id,
      orderNumber,
      customerName: insertOrder.customerName,
      customerEmail: insertOrder.customerEmail,
      customerPhone: insertOrder.customerPhone,
      deliveryType: insertOrder.deliveryType,
      address: insertOrder.address || null,
      addressNumber: insertOrder.addressNumber || null,
      complement: insertOrder.complement || null,
      paymentMethod: insertOrder.paymentMethod,
      subtotal: insertOrder.subtotal,
      deliveryFee: insertOrder.deliveryFee,
      total: insertOrder.total,
      status: insertOrder.status || "preparing",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.orderNumber === orderNumber
    );
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
}

export const storage = new MemStorage();
