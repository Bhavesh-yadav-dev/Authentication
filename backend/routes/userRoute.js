import express from "express";
import {  loginUser, registerUser, verification,logoutUser, forgetPassword, otpverify } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify' , verification);
router.post('/login' , loginUser);
router.post('/logout' , isAuthenticated,logoutUser);
router.post('/forget-password',forgetPassword);
router.post('/otp-verify/:email', otpverify);

export default router;