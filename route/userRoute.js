import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../authMiddleware.js";
import { User } from "../models/userModel.js";

import { sendVerificationEmail } from "../mailer.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email is already registered
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    // Generate a verification token
    const token = jwt.sign(
      { id: newUser._id, type: "verification" },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Send verification email
     sendVerificationEmail(email, token);

    return res
      .status(201)
      .json({ message: "User registered. Verification email sent." });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const { token } = req.query;

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.type !== "verification") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const userId = decoded.id;

    // Update the user's verification status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Account not verified. Please verify your email." });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token with userId included
    const token = jwt.sign(
      { userId: user._id, type: "auth", isLogged: true },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token, username: user.username });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
