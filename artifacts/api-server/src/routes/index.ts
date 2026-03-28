import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";
import sellersRouter from "./sellers.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import reviewsRouter from "./reviews.js";
import wilayasRouter from "./wilayas.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(sellersRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(reviewsRouter);
router.use(wilayasRouter);

export default router;
