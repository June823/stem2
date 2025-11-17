const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
  try {
    // Support token provided either via cookie or Authorization header (Bearer <token>)
    let token = null
    if (req.cookies && req.cookies.token) token = req.cookies.token
    // Authorization: Bearer <token>
    if (!token && req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ')
      if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1]
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.userId = decode._id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
}

module.exports = authToken;
