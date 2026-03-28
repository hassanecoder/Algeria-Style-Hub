import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, sellersTable, reviewsTable } from "@workspace/db/schema";
import { eq, desc, asc, gte, lte, like, and, sql, type SQL } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      wilaya,
      size,
      color,
      condition,
      search,
      sort = "newest",
      page = "1",
      limit = "24",
      featured,
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 24, 100);
    const offset = (pageNum - 1) * limitNum;

    const conditions: SQL[] = [eq(productsTable.isActive, true)];

    if (category) conditions.push(eq(productsTable.category, category));
    if (subcategory) conditions.push(eq(productsTable.subcategory, subcategory));
    if (wilaya) conditions.push(eq(productsTable.wilaya, wilaya));
    if (condition) conditions.push(eq(productsTable.condition, condition));
    if (minPrice) conditions.push(gte(productsTable.price, parseFloat(minPrice)));
    if (maxPrice) conditions.push(lte(productsTable.price, parseFloat(maxPrice)));
    if (featured === "true") conditions.push(eq(productsTable.isFeatured, true));
    if (search) conditions.push(like(productsTable.title, `%${search}%`));

    let orderBy;
    switch (sort) {
      case "price_asc": orderBy = asc(productsTable.price); break;
      case "price_desc": orderBy = desc(productsTable.price); break;
      case "popular": orderBy = desc(productsTable.viewCount); break;
      default: orderBy = desc(productsTable.createdAt);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [products, countResult] = await Promise.all([
      db
        .select({ product: productsTable, seller: { name: sellersTable.name, avatar: sellersTable.avatar } })
        .from(productsTable)
        .leftJoin(sellersTable, eq(productsTable.sellerId, sellersTable.id))
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limitNum)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(productsTable)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count || 0;

    res.json({
      products: products.map(({ product: p, seller: s }) => formatProduct(p, s?.name, s?.avatar)),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    req.log?.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Internal server error", message: "Failed to list products" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const data = req.body;
    const [product] = await db
      .insert(productsTable)
      .values({
        title: data.title,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        images: data.images || [],
        category: data.category,
        subcategory: data.subcategory,
        sizes: data.sizes || [],
        colors: data.colors || [],
        condition: data.condition,
        brand: data.brand,
        sellerId: data.sellerId,
        wilaya: data.wilaya,
        city: data.city,
        isActive: true,
        isNew: true,
        isFeatured: false,
      })
      .returning();

    await db
      .update(sellersTable)
      .set({ productCount: sql`${sellersTable.productCount} + 1` })
      .where(eq(sellersTable.id, data.sellerId));

    res.status(201).json(formatProduct(product, null, null));
  } catch (err) {
    req.log?.error({ err }, "Failed to create product");
    res.status(500).json({ error: "Internal server error", message: "Failed to create product" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ error: "not_found", message: "Product not found" });
    }

    await db
      .update(productsTable)
      .set({ viewCount: sql`${productsTable.viewCount} + 1` })
      .where(eq(productsTable.id, id));

    const products = await db
      .select({ product: productsTable, seller: sellersTable })
      .from(productsTable)
      .leftJoin(sellersTable, eq(productsTable.sellerId, sellersTable.id))
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!products.length) {
      return res.status(404).json({ error: "not_found", message: "Product not found" });
    }

    const { product: p, seller: s } = products[0];

    const [relatedProducts, reviews] = await Promise.all([
      db
        .select({ product: productsTable, seller: { name: sellersTable.name, avatar: sellersTable.avatar } })
        .from(productsTable)
        .leftJoin(sellersTable, eq(productsTable.sellerId, sellersTable.id))
        .where(and(eq(productsTable.category, p.category), sql`${productsTable.id} != ${id}`, eq(productsTable.isActive, true)))
        .limit(8),
      db.select().from(reviewsTable).where(eq(reviewsTable.productId, id)).orderBy(desc(reviewsTable.createdAt)),
    ]);

    const sellerFormatted = s ? {
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
    } : null;

    res.json({
      ...formatProduct(p, s?.name, s?.avatar),
      seller: sellerFormatted,
      relatedProducts: relatedProducts.map(({ product, seller }) => formatProduct(product, seller?.name, seller?.avatar)),
      reviews: reviews.map(formatReview),
    });
  } catch (err) {
    req.log?.error({ err }, "Failed to get product");
    res.status(500).json({ error: "Internal server error", message: "Failed to get product" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [productCount, sellerCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.isActive, true)),
      db.select({ count: sql<number>`count(*)::int` }).from(sellersTable),
    ]);

    res.json({
      totalProducts: productCount[0]?.count || 0,
      totalSellers: sellerCount[0]?.count || 0,
      totalCategories: 6,
      totalWilayas: 58,
    });
  } catch (err) {
    req.log?.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Internal server error", message: "Failed to get stats" });
  }
});

function formatProduct(p: any, sellerName: string | null | undefined, sellerAvatar: string | null | undefined) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    currency: p.currency || "DZD",
    images: p.images || [],
    category: p.category,
    subcategory: p.subcategory,
    sizes: p.sizes || [],
    colors: p.colors || [],
    condition: p.condition,
    brand: p.brand,
    sellerId: p.sellerId,
    sellerName: sellerName || "Vendeur",
    sellerAvatar: sellerAvatar || null,
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

function formatReview(r: any) {
  return {
    id: r.id,
    productId: r.productId,
    reviewerName: r.reviewerName,
    reviewerAvatar: r.reviewerAvatar,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
  };
}

export default router;
