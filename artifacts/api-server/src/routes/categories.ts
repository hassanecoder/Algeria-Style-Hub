import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

export const CATEGORIES = [
  {
    id: "femmes",
    name: "Femmes",
    nameAr: "نساء",
    icon: "👗",
    subcategories: [
      { id: "robes", name: "Robes & Jupes" },
      { id: "hauts", name: "Hauts & Chemisiers" },
      { id: "pantalons-femmes", name: "Pantalons & Jeans" },
      { id: "manteaux-femmes", name: "Manteaux & Vestes" },
      { id: "lingerie", name: "Lingerie & Pyjamas" },
      { id: "maillots", name: "Maillots de bain" },
    ],
  },
  {
    id: "hommes",
    name: "Hommes",
    nameAr: "رجال",
    icon: "👔",
    subcategories: [
      { id: "chemises", name: "Chemises & T-shirts" },
      { id: "pantalons-hommes", name: "Pantalons & Jeans" },
      { id: "costumes", name: "Costumes & Vestes" },
      { id: "manteaux-hommes", name: "Manteaux & Parkas" },
      { id: "sous-vetements", name: "Sous-vêtements" },
      { id: "pyjamas-hommes", name: "Pyjamas & Loungewear" },
    ],
  },
  {
    id: "enfants",
    name: "Enfants",
    nameAr: "أطفال",
    icon: "🧒",
    subcategories: [
      { id: "bebes", name: "Bébés (0-24 mois)" },
      { id: "filles", name: "Filles (2-14 ans)" },
      { id: "garcons", name: "Garçons (2-14 ans)" },
      { id: "ados", name: "Adolescents" },
    ],
  },
  {
    id: "traditionnel",
    name: "Traditionnel",
    nameAr: "تقليدي",
    icon: "🌙",
    subcategories: [
      { id: "haik", name: "Haïk & Djebba" },
      { id: "burnous", name: "Burnous & Gandoura" },
      { id: "caftan", name: "Caftan & Karakou" },
      { id: "kabyle", name: "Tenue Kabyle" },
      { id: "constantinoise", name: "Tenue Constantinoise" },
      { id: "oranaise", name: "Tenue Oranaise" },
    ],
  },
  {
    id: "sportswear",
    name: "Sportswear",
    nameAr: "ملابس رياضية",
    icon: "🏃",
    subcategories: [
      { id: "fitness", name: "Fitness & Gym" },
      { id: "running", name: "Running & Jogging" },
      { id: "football", name: "Football & Sports" },
      { id: "yoga", name: "Yoga & Pilates" },
    ],
  },
  {
    id: "accessoires",
    name: "Accessoires",
    nameAr: "إكسسوارات",
    icon: "👜",
    subcategories: [
      { id: "sacs", name: "Sacs & Pochettes" },
      { id: "chaussures", name: "Chaussures & Sandales" },
      { id: "bijoux", name: "Bijoux & Montres" },
      { id: "ceintures", name: "Ceintures & Écharpes" },
      { id: "foulards", name: "Foulards & Voiles" },
      { id: "chapeaux", name: "Chapeaux & Casquettes" },
    ],
  },
];

router.get("/categories", async (_req, res) => {
  try {
    const counts = await db
      .select({ category: productsTable.category, count: sql<number>`count(*)::int` })
      .from(productsTable)
      .where(sql`${productsTable.isActive} = true`)
      .groupBy(productsTable.category);

    const countMap = Object.fromEntries(counts.map((c) => [c.category, c.count]));

    const categoriesWithCounts = CATEGORIES.map((cat) => ({
      ...cat,
      productCount: countMap[cat.id] || 0,
      subcategories: cat.subcategories.map((sub) => ({
        ...sub,
        productCount: countMap[sub.id] || 0,
      })),
    }));

    res.json(categoriesWithCounts);
  } catch (_err) {
    res.json(CATEGORIES.map((cat) => ({ ...cat, productCount: 0, subcategories: cat.subcategories.map((sub) => ({ ...sub, productCount: 0 })) })));
  }
});

export default router;
