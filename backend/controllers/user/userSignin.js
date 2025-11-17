const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    console.log("Incoming login:", email, password);
    if (!email || !password) {
      throw new Error("Please provide both email and password");
    }

    const user = await userModel.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      throw new Error("User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    console.log("checkPassword:", checkPassword);

    if (!checkPassword) {
      throw new Error("Invalid password");
    }

    const tokenData = {
      _id: user._id,
      email: user.email,
    };

    // ✅ use the same secret as your middleware
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "8h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    return res.status(400).json({
      message: err.message || "Login failed",
      success: false,
    });
  }
}

module.exports = userSignInController;
