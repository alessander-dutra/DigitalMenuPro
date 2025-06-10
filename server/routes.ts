import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
