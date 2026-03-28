import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable, sellersTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/cart", async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      return res.json({ sessionId: "", items: [], total: 0, itemCount: 0 });
    }

    const cartItems = await db
      .select({ item: cartItemsTable, product: productsTable, seller: { name: sellersTable.name } })
      .from(cartItemsTable)
      .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .leftJoin(sellersTable, eq(productsTable.sellerId, sellersTable.id))
      .where(eq(cartItemsTable.sessionId, sessionId));

    const items = cartItems.map(({ item, product: p, seller: s }) => ({
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
        sellerName: s?.name || "Vendeur",
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
    }));

    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ sessionId, items, total, itemCount });
  } catch (err) {
    req.log?.error({ err }, "Failed to get cart");
    res.status(500).json({ error: "Internal server error", message: "Failed to get cart" });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { sessionId, productId, quantity = 1, selectedSize, selectedColor } = req.body;

    if (!sessionId || !productId) {
      return res.status(400).json({ error: "bad_request", message: "sessionId and productId are required" });
    }

    const existing = await db
      .select()
      .from(cartItemsTable)
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)))
      .limit(1);

    if (existing.length) {
      await db
        .update(cartItemsTable)
        .set({ quantity: sql`${cartItemsTable.quantity} + ${quantity}` })
        .where(eq(cartItemsTable.id, existing[0].id));
    } else {
      await db.insert(cartItemsTable).values({
        sessionId,
        productId,
        quantity,
        selectedSize: selectedSize || null,
        selectedColor: selectedColor || null,
      });
    }

    const cartItems = await db
      .select({ item: cartItemsTable, product: productsTable, seller: { name: sellersTable.name } })
      .from(cartItemsTable)
      .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .leftJoin(sellersTable, eq(productsTable.sellerId, sellersTable.id))
      .where(eq(cartItemsTable.sessionId, sessionId));

    const items = cartItems.map(({ item, product: p, seller: s }) => ({
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
        sellerName: s?.name || "Vendeur",
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
    }));

    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ sessionId, items, total, itemCount });
  } catch (err) {
    req.log?.error({ err }, "Failed to add to cart");
    res.status(500).json({ error: "Internal server error", message: "Failed to add to cart" });
  }
});

router.delete("/cart/:itemId", async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      return res.status(400).json({ error: "bad_request", message: "sessionId is required" });
    }

    await db
      .delete(cartItemsTable)
      .where(and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.sessionId, sessionId)));

    const cartItems = await db
      .select({ item: cartItemsTable, product: productsTable, seller: { name: sellersTable.name } })
      .from(cartItemsTable)
      .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .leftJoin(sellersTable, eq(productsTable.sellerId, sellersTable.id))
      .where(eq(cartItemsTable.sessionId, sessionId));

    const items = cartItems.map(({ item, product: p, seller: s }) => ({
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
        sellerName: s?.name || "Vendeur",
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
    }));

    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ sessionId, items, total, itemCount });
  } catch (err) {
    req.log?.error({ err }, "Failed to remove from cart");
    res.status(500).json({ error: "Internal server error", message: "Failed to remove from cart" });
  }
});

export default router;
