const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
  try {
    let token = null;

    // From cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // From header (optional)
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    req.userId = decode._id;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authToken;
