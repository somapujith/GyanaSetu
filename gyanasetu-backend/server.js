import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// CORS - Allow your frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Multer config - store files temporarily
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Google Auth Setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json',
  scopes: ["https://www.googleapis.com/auth/drive.file"]
});

const drive = google.drive({ version: "v3", auth });

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "GyanaSetu Backend is running!",
    endpoints: {
      upload: "POST /upload",
      delete: "DELETE /delete/:fileId",
      health: "GET /"
    }
  });
});

// ============================================
// UPLOAD ENDPOINT
// ============================================
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("📤 Upload request received");
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`📁 File: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`);

    // File metadata for Google Drive
    const fileMetadata = {
      name: req.file.originalname,
      parents: [process.env.DRIVE_FOLDER_ID]
    };

    // File content
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path)
    };

    // Upload to Google Drive
    console.log("☁️ Uploading to Google Drive...");
    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, webViewLink, webContentLink"
    });

    const fileId = driveResponse.data.id;
    console.log(`✅ Uploaded! File ID: ${fileId}`);

    // Make file publicly accessible (anyone with link can view)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone"
      }
    });
    console.log("🔓 File made public");

    // Delete temporary file
    fs.unlinkSync(req.file.path);
    console.log("🗑️ Temp file cleaned up");

    // Generate URLs
    const downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
    const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

    // Send response
    res.json({
      success: true,
      fileId: fileId,
      fileName: driveResponse.data.name,
      downloadUrl: downloadUrl,
      viewUrl: viewUrl,
      embedUrl: embedUrl,
      size: req.file.size,
      mimeType: req.file.mimetype
    });

  } catch (err) {
    console.error("❌ Upload error:", err.message);
    
    // Clean up temp file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: "Upload failed", 
      message: err.message 
    });
  }
});

// ============================================
// MULTIPLE FILES UPLOAD ENDPOINT
// ============================================
app.post("/upload-multiple", upload.array("files", 10), async (req, res) => {
  console.log("📤 Multiple upload request received");
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    console.log(`📁 Files count: ${req.files.length}`);

    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        console.log(`☁️ Uploading: ${file.originalname}`);

        const fileMetadata = {
          name: file.originalname,
          parents: [process.env.DRIVE_FOLDER_ID]
        };

        const media = {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.path)
        };

        const driveResponse = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: "id, name"
        });

        const fileId = driveResponse.data.id;

        // Make public
        await drive.permissions.create({
          fileId: fileId,
          requestBody: {
            role: "reader",
            type: "anyone"
          }
        });

        // Clean up temp file
        fs.unlinkSync(file.path);

        uploadedFiles.push({
          success: true,
          fileId: fileId,
          fileName: driveResponse.data.name,
          originalName: file.originalname,
          downloadUrl: `https://drive.google.com/uc?id=${fileId}&export=download`,
          viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
          embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          size: file.size,
          mimeType: file.mimetype
        });

        console.log(`✅ Uploaded: ${file.originalname}`);

      } catch (fileErr) {
        console.error(`❌ Failed: ${file.originalname}`, fileErr.message);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        uploadedFiles.push({
          success: false,
          fileName: file.originalname,
          error: fileErr.message
        });
      }
    }

    res.json({
      success: true,
      totalFiles: req.files.length,
      uploadedCount: uploadedFiles.filter(f => f.success).length,
      files: uploadedFiles
    });

  } catch (err) {
    console.error("❌ Multiple upload error:", err.message);
    res.status(500).json({ error: "Upload failed", message: err.message });
  }
});

// ============================================
// DELETE FILE ENDPOINT
// ============================================
app.delete("/delete/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!fileId) {
      return res.status(400).json({ error: "File ID required" });
    }

    console.log(`🗑️ Deleting file: ${fileId}`);
    
    await drive.files.delete({ fileId });
    
    console.log(`✅ File deleted: ${fileId}`);
    res.json({ success: true, message: "File deleted" });

  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: "Delete failed", message: err.message });
  }
});

// ============================================
// GET FILE INFO ENDPOINT
// ============================================
app.get("/file/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const response = await drive.files.get({
      fileId: fileId,
      fields: "id, name, mimeType, size, webViewLink, webContentLink"
    });

    res.json({
      success: true,
      file: response.data
    });

  } catch (err) {
    console.error("❌ Get file error:", err.message);
    res.status(500).json({ error: "Failed to get file", message: err.message });
  }
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚀 GyanaSetu Backend Server Running!     ║
║   📍 Port: ${PORT}                            ║
║   🔗 http://localhost:${PORT}                 ║
╚════════════════════════════════════════════╝
  `);
  
  // Verify Google Drive connection
  drive.files.list({ pageSize: 1 })
    .then(() => console.log("✅ Google Drive connected!"))
    .catch((err) => console.error("❌ Google Drive error:", err.message));
});
