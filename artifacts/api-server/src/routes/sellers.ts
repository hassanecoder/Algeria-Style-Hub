import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sellersTable, productsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/sellers", async (req, res) => {
  try {
    const sellers = await db
      .select()
      .from(sellersTable)
      .orderBy(desc(sellersTable.rating))
      .limit(20);

    res.json(sellers.map(formatSeller));
  } catch (err) {
    req.log?.error({ err }, "Failed to list sellers");
    res.status(500).json({ error: "Internal server error", message: "Failed to list sellers" });
  }
});

router.get("/sellers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ error: "not_found", message: "Seller not found" });
    }

    const sellers = await db.select().from(sellersTable).where(eq(sellersTable.id, id)).limit(1);
    if (!sellers.length) {
      return res.status(404).json({ error: "not_found", message: "Seller not found" });
    }

    const seller = sellers[0];
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.sellerId, id))
      .orderBy(desc(productsTable.createdAt))
      .limit(12);

    res.json({
      ...formatSeller(seller),
      products: products.map(formatProduct),
      reviews: [],
    });
  } catch (err) {
    req.log?.error({ err }, "Failed to get seller");
    res.status(500).json({ error: "Internal server error", message: "Failed to get seller" });
  }
});

router.get("/sellers/:id/products", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.sellerId, id))
      .orderBy(desc(productsTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      products: products.map(formatProduct),
      total: products.length,
      page,
      totalPages: Math.ceil(products.length / limit),
    });
  } catch (err) {
    req.log?.error({ err }, "Failed to get seller products");
    res.status(500).json({ error: "Internal server error", message: "Failed to get seller products" });
  }
});

function formatSeller(s: any) {
  return {
    id: s.id,
    name: s.name,
    avatar: s.avatar,
    bio: s.bio,
    wilaya: s.wilaya,
    city: s.city,
    rating: s.rating,
    reviewCount: s.reviewCount,
    productCount: s.productCount,
    isVerified: s.isVerified,
    joinedDate: s.joinedDate?.toISOString() || new Date().toISOString(),
    responseRate: s.responseRate,
  };
}

function formatProduct(p: any) {
  return {
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
    sellerName: "",
    sellerAvatar: null,
    wilaya: p.wilaya,
    city: p.city,
    rating: p.rating,
    reviewCount: p.reviewCount,
    viewCount: p.viewCount,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
  };
}

export default router;
