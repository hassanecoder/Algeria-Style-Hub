import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable, productsTable } from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/reviews", async (req, res) => {
  try {
    const productId = parseInt(req.query.productId as string);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "bad_request", message: "productId is required" });
    }

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, productId))
      .orderBy(desc(reviewsTable.createdAt));

    res.json(reviews.map(formatReview));
  } catch (err) {
    req.log?.error({ err }, "Failed to list reviews");
    res.status(500).json({ error: "Internal server error", message: "Failed to list reviews" });
  }
});

router.post("/reviews", async (req, res) => {
  try {
    const { productId, reviewerName, rating, comment } = req.body;

    if (!productId || !reviewerName || !rating || !comment) {
      return res.status(400).json({ error: "bad_request", message: "Missing required fields" });
    }

    const [review] = await db
      .insert(reviewsTable)
      .values({ productId, reviewerName, rating, comment })
      .returning();

    const avgResult = await db
      .select({ avg: sql<number>`avg(rating)::float`, count: sql<number>`count(*)::int` })
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, productId));

    if (avgResult.length) {
      await db
        .update(productsTable)
        .set({ rating: avgResult[0].avg, reviewCount: avgResult[0].count })
        .where(eq(productsTable.id, productId));
    }

    res.status(201).json(formatReview(review));
  } catch (err) {
    req.log?.error({ err }, "Failed to create review");
    res.status(500).json({ error: "Internal server error", message: "Failed to create review" });
  }
});

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
