import express from "express";
import { loginUser, logout, registerUser } from "../controller/auth.js";
import checkAuthorization from "../middleware/checkAuthorization.js";
const router = express.Router();

/**
 * Auth route
 */
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(checkAuthorization, logout);
export default router;
