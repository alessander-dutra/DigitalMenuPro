import {
  menuItems,
  orders,
  orderItems,
  storeSettings,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type StoreSettings,
  type InsertStoreSettings,
  type Category,
  type InsertCategory,
  type Promotion,
  type InsertPromotion,
  type ScheduledOrder,
  type InsertScheduledOrder,
  type ItemReview,
  type InsertItemReview,
} from "@shared/schema";

export interface IStorage {
  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(orderNumber: string): Promise<Order | undefined>;
  
  // Order Items
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Store Settings
  getStoreSettings(): Promise<StoreSettings>;
  updateStoreSettings(settings: Partial<InsertStoreSettings>): Promise<StoreSettings>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Promotions
  getPromotions(): Promise<Promotion[]>;
  getActivePromotions(): Promise<Promotion[]>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: number, promotion: Partial<InsertPromotion>): Promise<Promotion | undefined>;
  deletePromotion(id: number): Promise<boolean>;
  
  // Scheduled Orders
  createScheduledOrder(scheduledOrder: InsertScheduledOrder): Promise<ScheduledOrder>;
  getScheduledOrders(): Promise<ScheduledOrder[]>;
  
  // Reviews
  createItemReview(review: InsertItemReview): Promise<ItemReview>;
  getItemReviews(menuItemId: number): Promise<ItemReview[]>;
  getTopRatedItems(): Promise<MenuItem[]>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private categories: Map<number, Category>;
  private promotions: Map<number, Promotion>;
  private scheduledOrders: Map<number, ScheduledOrder>;
  private itemReviews: Map<number, ItemReview>;
  private storeSettings: StoreSettings;
  private currentMenuItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentCategoryId: number;
  private currentPromotionId: number;
  private currentScheduledOrderId: number;
  private currentReviewId: number;

  constructor() {
    this.menuItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.categories = new Map();
    this.promotions = new Map();
    this.scheduledOrders = new Map();
    this.itemReviews = new Map();
    this.currentMenuItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentCategoryId = 1;
    this.currentPromotionId = 1;
    this.currentScheduledOrderId = 1;
    this.currentReviewId = 1;

    // Initialize store settings
    this.storeSettings = {
      id: 1,
      storeName: "Sabor Digital",
      storePhone: "(11) 99999-9999",
      storeEmail: "contato@sabordigital.com",
      storeAddress: "Rua das Flores, 123 - Centro",
      isOpen: 1,
      openingTime: "08:00",
      closingTime: "22:00",
      allowPickup: 1,
      allowCheckout: 1,
      allowScheduling: 1,
      deliveryTime: "30-45 min",
      pickupTime: "15-20 min",
      deliveryFee: "5.00",
      paymentMethods: "card,pix,cash",
      updatedAt: new Date(),
    };

    // Initialize with sample menu data
    this.initializeMenuItems();
    this.initializeCategories();
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
      deliveryFee: insertOrder.deliveryFee ?? "0",
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

  async updateMenuItem(id: number, updateItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existingItem = this.menuItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem: MenuItem = {
      ...existingItem,
      ...updateItem,
    };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async getStoreSettings(): Promise<StoreSettings> {
    return this.storeSettings;
  }

  async updateStoreSettings(settings: Partial<InsertStoreSettings>): Promise<StoreSettings> {
    this.storeSettings = {
      ...this.storeSettings,
      ...settings,
      updatedAt: new Date(),
    };
    return this.storeSettings;
  }

  private initializeCategories() {
    const defaultCategories = [
      { name: "Entradas", icon: "Cookie", minItems: 0, maxItems: 50, displayOrder: 1, isActive: 1 },
      { name: "Pratos Principais", icon: "ChefHat", minItems: 0, maxItems: 100, displayOrder: 2, isActive: 1 },
      { name: "Sobremesas", icon: "IceCream", minItems: 0, maxItems: 30, displayOrder: 3, isActive: 1 },
      { name: "Bebidas", icon: "Coffee", minItems: 0, maxItems: 50, displayOrder: 4, isActive: 1 },
    ];

    defaultCategories.forEach((categoryData) => {
      const id = this.currentCategoryId++;
      const category: Category = { 
        id,
        name: categoryData.name,
        icon: categoryData.icon,
        minItems: categoryData.minItems,
        maxItems: categoryData.maxItems,
        displayOrder: categoryData.displayOrder,
        isActive: categoryData.isActive,
        createdAt: new Date(),
      };
      this.categories.set(id, category);
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      id,
      name: insertCategory.name,
      icon: insertCategory.icon || "Utensils",
      minItems: insertCategory.minItems || 0,
      maxItems: insertCategory.maxItems || 100,
      displayOrder: insertCategory.displayOrder || 0,
      isActive: insertCategory.isActive || 1,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateCategory: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory: Category = {
      ...category,
      ...updateCategory,
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Promotions
  async getPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values());
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return Array.from(this.promotions.values()).filter(
      promo => promo.isActive === 1 && now >= promo.startDate && now <= promo.endDate
    );
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const id = this.currentPromotionId++;
    const promotion: Promotion = { 
      id,
      menuItemId: insertPromotion.menuItemId,
      originalPrice: insertPromotion.originalPrice,
      promotionalPrice: insertPromotion.promotionalPrice,
      startDate: insertPromotion.startDate,
      endDate: insertPromotion.endDate,
      isActive: insertPromotion.isActive || 1,
      createdAt: new Date(),
    };
    this.promotions.set(id, promotion);
    return promotion;
  }

  async updatePromotion(id: number, updatePromotion: Partial<InsertPromotion>): Promise<Promotion | undefined> {
    const promotion = this.promotions.get(id);
    if (!promotion) return undefined;
    
    const updatedPromotion: Promotion = {
      ...promotion,
      ...updatePromotion,
    };
    this.promotions.set(id, updatedPromotion);
    return updatedPromotion;
  }

  async deletePromotion(id: number): Promise<boolean> {
    return this.promotions.delete(id);
  }

  // Scheduled Orders
  async createScheduledOrder(insertScheduledOrder: InsertScheduledOrder): Promise<ScheduledOrder> {
    const id = this.currentScheduledOrderId++;
    const scheduledOrder: ScheduledOrder = { 
      id,
      orderId: insertScheduledOrder.orderId,
      scheduledDateTime: insertScheduledOrder.scheduledDateTime,
      scheduledType: insertScheduledOrder.scheduledType,
      notes: insertScheduledOrder.notes || null,
      createdAt: new Date(),
    };
    this.scheduledOrders.set(id, scheduledOrder);
    return scheduledOrder;
  }

  async getScheduledOrders(): Promise<ScheduledOrder[]> {
    return Array.from(this.scheduledOrders.values());
  }

  // Reviews
  async createItemReview(insertReview: InsertItemReview): Promise<ItemReview> {
    const id = this.currentReviewId++;
    const review: ItemReview = { 
      id,
      menuItemId: insertReview.menuItemId,
      customerName: insertReview.customerName,
      customerEmail: insertReview.customerEmail,
      rating: insertReview.rating,
      comment: insertReview.comment || null,
      createdAt: new Date(),
    };
    this.itemReviews.set(id, review);
    return review;
  }

  async getItemReviews(menuItemId: number): Promise<ItemReview[]> {
    return Array.from(this.itemReviews.values()).filter(review => review.menuItemId === menuItemId);
  }

  async getTopRatedItems(): Promise<MenuItem[]> {
    const reviewsByItem = new Map<number, ItemReview[]>();
    
    // Group reviews by menu item
    Array.from(this.itemReviews.values()).forEach(review => {
      if (!reviewsByItem.has(review.menuItemId)) {
        reviewsByItem.set(review.menuItemId, []);
      }
      reviewsByItem.get(review.menuItemId)!.push(review);
    });

    // Calculate average ratings and get top items
    const itemRatings = new Map<number, { averageRating: number, reviewCount: number }>();
    
    Array.from(reviewsByItem.entries()).forEach(([menuItemId, reviews]) => {
      const averageRating = reviews.reduce((sum: number, review: ItemReview) => sum + review.rating, 0) / reviews.length;
      itemRatings.set(menuItemId, { averageRating, reviewCount: reviews.length });
    });

    // Get menu items with their ratings, sorted by rating
    const topRatedItems = Array.from(this.menuItems.values())
      .filter(item => itemRatings.has(item.id))
      .sort((a, b) => {
        const ratingA = itemRatings.get(a.id)!.averageRating;
        const ratingB = itemRatings.get(b.id)!.averageRating;
        return ratingB - ratingA;
      })
      .slice(0, 10); // Top 10 items

    return topRatedItems;
  }
}

export const storage = new MemStorage();
