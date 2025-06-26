import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertMenuItemSchema, 
  insertStoreSettingsSchema,
  insertCategorySchema,
  insertPromotionSchema,
  insertItemReviewSchema,
  insertScheduledOrderSchema
} from "@shared/schema";
import { z } from "zod";

const checkoutSchema = z.object({
  customerName: z.string().min(1, "Nome é obrigatório"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(1, "Telefone é obrigatório"),
  deliveryType: z.enum(["delivery", "pickup"]),
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  complement: z.string().optional(),
  paymentMethod: z.enum(["card", "pix", "cash"]),
  items: z.array(z.object({
    menuItemId: z.number(),
    quantity: z.number().min(1),
  })).min(1, "Carrinho não pode estar vazio"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all menu items
  app.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar itens do menu" });
    }
  });

  // Get menu items by category
  app.get("/api/menu-items/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const items = await storage.getMenuItemsByCategory(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar itens da categoria" });
    }
  });

  // Get single menu item
  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMenuItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Item não encontrado" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar item" });
    }
  });

  // Create order (checkout)
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = checkoutSchema.parse(req.body);

      // Calculate order totals
      let subtotal = 0;
      const orderItemsData = [];

      for (const cartItem of validatedData.items) {
        const menuItem = await storage.getMenuItem(cartItem.menuItemId);
        if (!menuItem) {
          return res.status(400).json({ message: `Item ${cartItem.menuItemId} não encontrado` });
        }

        const itemTotal = parseFloat(menuItem.price) * cartItem.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          menuItemId: cartItem.menuItemId,
          quantity: cartItem.quantity,
          price: menuItem.price,
        });
      }

      const deliveryFee = validatedData.deliveryType === "delivery" ? 5.00 : 0;
      const total = subtotal + deliveryFee;

      // Create order
      const order = await storage.createOrder({
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        deliveryType: validatedData.deliveryType,
        address: validatedData.address || null,
        addressNumber: validatedData.addressNumber || null,
        complement: validatedData.complement || null,
        paymentMethod: validatedData.paymentMethod,
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        total: total.toFixed(2),
        status: "preparing",
      });

      // Create order items
      for (const orderItemData of orderItemsData) {
        await storage.createOrderItem({
          orderId: order.id,
          ...orderItemData,
        });
      }

      res.status(201).json({
        orderNumber: order.orderNumber,
        total: order.total,
        estimatedTime: validatedData.deliveryType === "delivery" ? "30-45 min" : "15-20 min",
        status: order.status,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Erro ao criar pedido" });
    }
  });

  // Get order by order number
  app.get("/api/orders/:orderNumber", async (req, res) => {
    try {
      const { orderNumber } = req.params;
      const order = await storage.getOrder(orderNumber);
      
      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }
      
      const orderItems = await storage.getOrderItems(order.id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pedido" });
    }
  });

  // Admin routes for menu management
  app.post("/api/admin/menu-items", async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar item" });
    }
  });

  app.put("/api/admin/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMenuItemSchema.partial().parse(req.body);
      const item = await storage.updateMenuItem(id, validatedData);
      
      if (!item) {
        return res.status(404).json({ message: "Item não encontrado" });
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao atualizar item" });
    }
  });

  app.delete("/api/admin/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMenuItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Item não encontrado" });
      }
      
      res.json({ message: "Item removido com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao remover item" });
    }
  });

  // Store settings routes
  app.get("/api/store-settings", async (req, res) => {
    try {
      const settings = await storage.getStoreSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  });

  app.put("/api/store-settings", async (req, res) => {
    try {
      const validatedData = insertStoreSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateStoreSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao atualizar configurações" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar categorias" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar categoria" });
    }
  });

  // Reviews routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertItemReviewSchema.parse(req.body);
      const review = await storage.createItemReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar avaliação" });
    }
  });

  app.get("/api/reviews/:menuItemId", async (req, res) => {
    try {
      const menuItemId = parseInt(req.params.menuItemId);
      const reviews = await storage.getItemReviews(menuItemId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar avaliações" });
    }
  });

  app.get("/api/top-rated-items", async (req, res) => {
    try {
      const items = await storage.getTopRatedItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar itens mais avaliados" });
    }
  });

  // Promotions routes
  app.get("/api/promotions", async (req, res) => {
    try {
      const promotions = await storage.getPromotions();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar promoções" });
    }
  });

  app.post("/api/promotions", async (req, res) => {
    try {
      const validatedData = insertPromotionSchema.parse(req.body);
      const promotion = await storage.createPromotion(validatedData);
      res.status(201).json(promotion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar promoção" });
    }
  });

  // Scheduled orders routes
  app.post("/api/scheduled-orders", async (req, res) => {
    try {
      const validatedData = insertScheduledOrderSchema.parse(req.body);
      const scheduledOrder = await storage.createScheduledOrder(validatedData);
      res.status(201).json(scheduledOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar pedido agendado" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
