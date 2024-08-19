import express from "express";
import {
  login,
  logout,
  signup,
  getAllUsers,
} from "../controllers/user-controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/all-users", getAllUsers);

export default router;
