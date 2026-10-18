import { User } from "../models/usermodel.js";
import bcrypt from "bcrypt";
import { verifyMail } from "../verifyEmail/verifyEmail.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedpassword,
      isVerified: false,
    });

    const token = jwt.sign({
       id: newUser._id }, 
       process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    await verifyMail(token, email);

    newUser.token = token;
    await newUser.save();

    console.log(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
