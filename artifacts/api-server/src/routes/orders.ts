import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, cartItemsTable, productsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { WILAYAS } from "./wilayas.js";

const router: IRouter = Router();

router.post("/orders", async (req, res) => {
  try {
    const { sessionId, customerName, customerPhone, deliveryWilaya, deliveryAddress, notes } = req.body;

    if (!sessionId || !customerName || !customerPhone || !deliveryWilaya || !deliveryAddress) {
      return res.status(400).json({ error: "bad_request", message: "Missing required fields" });
    }

    const cartItems = await db
      .select({ item: cartItemsTable, product: productsTable })
      .from(cartItemsTable)
      .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .where(eq(cartItemsTable.sessionId, sessionId));

    if (!cartItems.length) {
      return res.status(400).json({ error: "bad_request", message: "Cart is empty" });
    }

    const wilayaData = WILAYAS.find((w) => w.name === deliveryWilaya || w.code === deliveryWilaya);
    const deliveryFee = wilayaData?.deliveryFee || 500;

    const orderItems = cartItems.map(({ item, product: p }) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: p?.price || 0,
      title: p?.title || "Article",
      selectedSize: item.selectedSize || undefined,
      selectedColor: item.selectedColor || undefined,
    }));

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + deliveryFee;

    const [order] = await db
      .insert(ordersTable)
      .values({
        sessionId,
        items: orderItems,
        total,
        status: "pending",
        customerName,
        customerPhone,
        deliveryWilaya,
        deliveryAddress,
        deliveryFee,
        notes: notes || null,
      })
      .returning();

    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

    res.status(201).json({
      id: order.id,
      sessionId: order.sessionId,
      items: cartItems.map(({ item, product: p }) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        product: p ? {
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice,
          currency: p.currency,
          images: p.images || [],
          category: p.category,
          subcategory: p.subcategory,
          sizes: p.sizes || [],
          colors: p.colors || [],
          condition: p.condition,
          brand: p.brand,
          sellerId: p.sellerId,
          sellerName: "Vendeur",
          sellerAvatar: null,
          wilaya: p.wilaya,
          city: p.city,
          rating: p.rating,
          reviewCount: p.reviewCount,
          viewCount: p.viewCount,
          isFeatured: p.isFeatured,
          isNew: p.isNew,
          createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
        } : null,
      })),
      total: order.total,
      status: order.status,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryWilaya: order.deliveryWilaya,
      deliveryAddress: order.deliveryAddress,
      deliveryFee: order.deliveryFee,
      createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
    });
  } catch (err) {
    req.log?.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Internal server error", message: "Failed to create order" });
  }
});

export default router;
