const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images/inputImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputDir = "assets/images/pieces";

    // Clear old pieces
    if (fs.existsSync(outputDir)) {
      fs.readdirSync(outputDir).forEach((f) =>
        fs.unlinkSync(path.join(outputDir, f))
      );
    } else {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read metadata
    const metadata = await sharp(inputPath).metadata();

    // ✅ Now split into 4 columns × 5 rows
    const pieceWidth = Math.floor(metadata.width / 4); // 4 columns
    const pieceHeight = Math.floor(metadata.height / 5); // 5 rows

    let count = 0;
    for (let y = 0; y < 5; y++) {          // 5 rows
      for (let x = 0; x < 4; x++) {        // 4 columns
        const left = x * pieceWidth;
        const top = y * pieceHeight;

        const piecePath = path.join(outputDir, `piece_${count}.jpg`);

        // NEW sharp() per loop
        await sharp(inputPath)
          .extract({ left, top, width: pieceWidth, height: pieceHeight })
          .toFile(piecePath);

        count++;
      }
    }

    res.json({ message: "Image uploaded and split!", pieces: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image processing failed." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
