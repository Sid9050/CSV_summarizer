const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "dev_secret";

function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "missing token" });
    const parts = authHeader.split(" ");
    if (parts.length !== 2)
        return res.status(401).json({ error: "bad auth header" });
    const token = parts[1];
    try {
        const payload = jwt.verify(token, SECRET);
        req.user = payload;
        next();
    } catch (e) {
        return res.status(401).json({ error: "invalid token" });
    }
}

module.exports = auth;
