import express from "express";
import { validateQuery, validateSearchQuery } from "../middleware/validateQuery";
import { getCentresController, getSearchOptionsController } from "../controllers/centreLocator.controller";

const router = express.Router();

router.get("/centr-locator", validateQuery, getCentresController as unknown as express.RequestHandler);
router.get("/centr-search", validateSearchQuery, getSearchOptionsController as unknown as express.RequestHandler);

export default router;
