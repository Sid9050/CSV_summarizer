const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "dev_secret";

// Inmemory storage for demo
const users = [];

function register(req, res) {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "username & password required" });
    if (users.find((u) => u.username === username))
        return res.status(409).json({ error: "user exists" });
    const user = { id: users.length + 1, username, password };
    users.push(user);
    return res.status(201).json({ id: user.id, username: user.username });
}

function login(req, res) {
    const { username, password } = req.body;
    const user = users.find(
        (u) => u.username === username && u.password === password
    );
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const token = jwt.sign({ sub: user.id, username: user.username }, SECRET, {
        expiresIn: "1h",
    });
    return res.json({ token });
}

module.exports = { register, login, _users: users };
