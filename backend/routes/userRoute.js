import express from "express";
import { login, registerUser, verification } from "../controllers/userControllers.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify' , verification);
router.post('/login' , login);

export default router;