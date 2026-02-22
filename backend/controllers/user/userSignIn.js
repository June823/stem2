const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        success: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "8h" }
    );

    // ✅ COOKIE SETTINGS (VERY IMPORTANT)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,       // REQUIRED on Render
      sameSite: "none",   // REQUIRED for cross-domain
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
}

module.exports = userSignInController;
