const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "frontend/public/assets/images/inputImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const path = require("path");
    const fs = require("fs");
    const sharp = require("sharp");

    // 🔥 Always build absolute path
    const inputPath = path.resolve(req.file.path);

    // Build output directory safely
    const outputDir = path.join(
      __dirname,
      "public",
      "assets",
      "images",
      "pieces"
    );

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Clear old pieces
    fs.readdirSync(outputDir).forEach((file) =>
      fs.unlinkSync(path.join(outputDir, file))
    );
    
    // Make sure input file really exists before sharp runs
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file does not exist: ${inputPath}`);
    }

    const metadata = await sharp(inputPath).metadata();

    const rows = 5;
    const cols = 4;
    const pieceWidth = Math.floor(metadata.width / cols);
    const pieceHeight = Math.floor(metadata.height / rows);

    let count = 0;
    const writePromises = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const left = x * pieceWidth;
        const top = y * pieceHeight;

        const piecePath = path.join(outputDir, `piece_${count}.jpg`);

        writePromises.push(
          sharp(inputPath)
            .extract({ left, top, width: pieceWidth, height: pieceHeight })
            .toFile(piecePath)
        );
        count++;
      }
    }

    await Promise.all(writePromises);
    res.json({ message: "Image successfully split into pieces." });
    // clearFolder("frontend/public/assets/images/inputImages");

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image processing failed." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


app.get("/getPiecesDir", (req, res) => {
    const piecesPath = path.join(__dirname, "public/assets/images/pieces");

    fs.readdir(piecesPath, (err, files) => {
        if (err || files.length === 0) {
            res.json({ dir: "assets/images/default" });
        } else {
            res.json({ dir: "assets/images/pieces" });
        }
    });
});

/**
 * Deletes previously uploaded images from inputimages folder 
 * Keeps the default image only.
 * 
 * @param {*} folderPath 
 * @returns 
 */
function clearFolder(folderPath) {
  if (!fs.existsSync(folderPath)) return;
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (file.includes("man_in_a_hat")) continue;
    fs.unlinkSync(path.join(folderPath, file));
  }

}
