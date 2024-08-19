import express from "express";
import { getTredingMovie } from "../controllers/movie-controller.js";

const router = express.Router();

router.get("/trending", getTredingMovie);

export default router;
