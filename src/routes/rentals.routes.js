import { Router } from "express";
import { completeRent, deleteRent, getRents, insertRent } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRents);
rentalsRouter.post("/rentals", insertRent);
rentalsRouter.post("/rentals/:id/return", completeRent);
rentalsRouter.delete("/rentals/:id", deleteRent);

export default rentalsRouter;