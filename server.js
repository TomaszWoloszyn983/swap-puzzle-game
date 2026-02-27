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
    cb(null, "public/assets/images/inputImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload route
// app.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     const inputPath = req.file.path;
//     const outputDir = "public/assets/images/pieces";
//     // const defaultDir = "public/assets/images/default";

//     // Clear old pieces
//     if (fs.existsSync(outputDir)) {
//       fs.readdirSync(outputDir).forEach((f) =>
//         fs.unlinkSync(path.join(outputDir, f))
//       );
//     } else {
//       fs.mkdirSync(outputDir, { recursive: true });
//     }

//     // Read metadata
//     const metadata = await sharp(inputPath).metadata();

//     // ✅ Now split into 4 columns × 5 rows
//     const pieceWidth = Math.floor(metadata.width / 4); // 4 columns
//     const pieceHeight = Math.floor(metadata.height / 5); // 5 rows

//     let count = 0;
//     for (let y = 0; y < 5; y++) {          // 5 rows
//       for (let x = 0; x < 4; x++) {        // 4 columns
//         const left = x * pieceWidth;
//         const top = y * pieceHeight;

//         const piecePath = path.join(outputDir, `piece_${count}.jpg`);

//         // NEW sharp() per loop
//         await sharp(inputPath)
//           .extract({ left, top, width: pieceWidth, height: pieceHeight })
//           .toFile(piecePath);

//         count++;
//       }
//     }

//       // ✅ Delete the uploaded file after processing
//     fs.unlink(inputPath, (err) => {
//         if (err) console.error("Failed to delete temp file:", err);
//         else console.log("🗑️ Deleted uploaded file:", inputPath);
//     });

//     res.json({ message: "Image uploaded and split!", pieces: count });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Image processing failed." });
//   }
// });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputDir = path.join(__dirname, "public/assets/images/pieces");

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Clear old pieces
    fs.readdirSync(outputDir).forEach((f) =>
      fs.unlinkSync(path.join(outputDir, f))
    );

    const metadata = await sharp(inputPath).metadata();

    const rows = 5;
    const cols = 4;
    const pieceWidth = Math.floor(metadata.width / cols);
    const pieceHeight = Math.floor(metadata.height / rows);

    let count = 0;
    let writePromises = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const left = x * pieceWidth;
        const top = y * pieceHeight;

        const piecePath = path.join(outputDir, `piece_${count}.jpg`);

        // push promise instead of awaiting immediately
        writePromises.push(
          sharp(inputPath)
            .extract({ left, top, width: pieceWidth, height: pieceHeight })
            .toFile(piecePath)
        );

        count++;
      }
    }

    // 🔥 Wait for ALL pieces to finish writing
    await Promise.all(writePromises);

    // 🔥 Double-check files exist (extra safety for cloud FS)
    const finalFiles = fs.readdirSync(outputDir);
    if (finalFiles.length !== rows * cols) {
      throw new Error("Not all pieces were written.");
    }

    // Delete uploaded temp file
    fs.unlinkSync(inputPath);

    res.json({ message: "Image uploaded and split!", pieces: count });

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
            res.json({ dir: "public/assets/images/default" });
        } else {
            res.json({ dir: "public/assets/images/pieces" });
        }
    });
});
