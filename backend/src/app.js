const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

app.get("/", (req, res) => res.json({ ok: true, msg: "CSV Summary Backend" }));

module.exports = app;
