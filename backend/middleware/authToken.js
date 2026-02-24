const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
    try {
        // Look for token in cookies OR authorization header
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Please Login...",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if (err) {
                console.log("Auth Error", err);
                return res.status(401).json({ message: "Session Expired", error: true });
            }
            req.userId = decoded?._id;
            next();
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
