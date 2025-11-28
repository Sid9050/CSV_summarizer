const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");

const router = express.Router();

// Configure Multer
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const csvPath = path.join(__dirname, "../../uploads", req.file.filename);
    const pythonScript = path.join(
        __dirname,
        "../../../python-module/data_processor/processor.py"
    );

    // Execute Python script
    exec(`python "${pythonScript}" "${csvPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error("Python Error:", stderr);
            return res.status(500).json({ error: "Failed to process CSV" });
        }

        try {
            const output = JSON.parse(stdout);
            res.json(output);
        } catch (err) {
            console.error("JSON Parse Error:", err);
            res.status(500).json({ error: "Invalid Python output" });
        }
    });
});

module.exports = router;
