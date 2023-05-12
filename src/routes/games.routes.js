import { Router } from "express";
import { getGames, insertGame } from "../controllers/games.controllers.js";
import validadeSchema from "../middlewares/validateGames.middleware.js";
import { gameSchema } from "../schemas/games.schemas.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validadeSchema(gameSchema), insertGame);


export default gamesRouter;