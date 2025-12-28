# Google Drive Backend Setup Guide

## 🎯 Overview
This backend handles file uploads from the GyanaSetu frontend and stores them in your Google Drive.

## 📋 Prerequisites
- Node.js 18+ installed
- A Google Account
- Access to Google Cloud Console

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Dependencies
```bash
cd gyanasetu-backend
npm install
```

### Step 2: Create Google Cloud Project & Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Create a new project:
   - Click "Select a project" → "New Project"
   - Name it `GyanaSetu` → Click "Create"

3. Enable Google Drive API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click on it and click "Enable"

4. Create Service Account:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: `gyanasetu-uploader`
   - Click "Create and Continue" → "Done"

5. Download Service Account Key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" → Click "Create"
   - A JSON file will download - this is your `service-account.json`

6. Move the downloaded JSON file to the `gyanasetu-backend` folder and rename it to `service-account.json`

### Step 3: Create Google Drive Folder & Share with Service Account

1. Go to [Google Drive](https://drive.google.com/)

2. Create a new folder:
   - Click "New" → "Folder"
   - Name it `GyanaSetu-Resources`

3. Get the Folder ID:
   - Open the folder
   - Look at the URL: `https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXX`
   - Copy the `XXXXXXXXXXXXXXXX` part - this is your `DRIVE_FOLDER_ID`

4. **IMPORTANT** - Share the folder with your Service Account:
   - Right-click the folder → "Share"
   - Open your `service-account.json` file
   - Find the `client_email` field (looks like: `gyanasetu-uploader@your-project.iam.gserviceaccount.com`)
   - Paste this email in the "Add people" field
   - Set permission to "Editor"
   - Click "Send" (uncheck "Notify people" if asked)

### Step 4: Configure Environment Variables

1. Copy the example env file:
```bash
copy .env.example .env
```

2. Edit `.env` with your values:
```env
PORT=5000
DRIVE_FOLDER_ID=your_folder_id_from_step_3
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### Step 5: Start the Server
```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║   🚀 GyanaSetu Backend Server Running!     ║
║   📍 Port: 5000                            ║
║   🔗 http://localhost:5000                 ║
╚════════════════════════════════════════════╝
✅ Google Drive connected!
```

---

## 🧪 Test the Upload

Open your browser and go to: `http://localhost:5000`

You should see:
```json
{
  "status": "ok",
  "message": "GyanaSetu Backend is running!",
  "endpoints": {...}
}
```

### Test with curl:
```bash
curl -X POST -F "file=@test.pdf" http://localhost:5000/upload
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/upload` | Upload single file |
| POST | `/upload-multiple` | Upload multiple files (max 10) |
| DELETE | `/delete/:fileId` | Delete file from Drive |
| GET | `/file/:fileId` | Get file info |

### Upload Response:
```json
{
  "success": true,
  "fileId": "1abc123...",
  "fileName": "notes.pdf",
  "downloadUrl": "https://drive.google.com/uc?id=1abc123...&export=download",
  "viewUrl": "https://drive.google.com/file/d/1abc123.../view",
  "embedUrl": "https://drive.google.com/file/d/1abc123.../preview",
  "size": 1234567,
  "mimeType": "application/pdf"
}
```

---

## 🔧 Troubleshooting

### "Google Drive error: The caller does not have permission"
- Make sure you shared the Google Drive folder with your service account email
- Check that the email in "Share" matches exactly with `client_email` in service-account.json

### "Cannot find module 'googleapis'"
- Run `npm install` in the gyanasetu-backend folder

### "ENOENT: service-account.json not found"
- Make sure service-account.json is in the gyanasetu-backend folder
- Check the path in your .env file

### "Upload failed: Network error"
- Make sure the backend is running (`npm run dev`)
- Check that frontend is calling `http://localhost:5000`
- Check browser console for CORS errors

---

## 🚀 Running Frontend + Backend Together

**Terminal 1 - Backend:**
```bash
cd gyanasetu-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd ..
npm run dev
```

Frontend will run on `http://localhost:5173`
Backend will run on `http://localhost:5000`

---

## 📁 Project Structure
```
gyanasetu-backend/
├── server.js           # Main Express server
├── package.json        # Dependencies
├── .env               # Your environment variables (create from .env.example)
├── .env.example       # Example environment file
├── .gitignore         # Git ignore rules
├── service-account.json # Google credentials (YOU ADD THIS)
├── uploads/           # Temporary file storage
└── SETUP.md          # This guide
```

---

## 🔒 Security Notes

1. **Never commit** `service-account.json` or `.env` to Git
2. For production, use environment variables instead of files
3. Consider adding rate limiting for the upload endpoint
4. Add authentication if the backend is publicly accessible
