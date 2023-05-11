import { Router } from "express";
import customersRouter from "./customers.routes";
import gamesRouter from "./games.routes";
import rentalsRouter from "./rentals.routes";

const router = Router();

router.use(gamesRouter);
router.use(rentalsRouter);
router.use(customersRouter);

export default router;