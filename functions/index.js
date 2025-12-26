const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const Busboy = require('busboy');
const cors = require('cors')({ origin: true });
const path = require('path');
const os = require('os');
const fs = require('fs');

// Initialize Firebase Admin
admin.initializeApp();

// Google Drive API Setup
// You'll need to add your service account credentials
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Load service account credentials from environment or file
const getAuthClient = () => {
  const credentials = JSON.parse(
    process.env.GOOGLE_SERVICE_ACCOUNT || 
    fs.readFileSync(path.join(__dirname, 'service-account.json'), 'utf8')
  );
  
  return new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
};

// The folder ID in Google Drive where files will be uploaded
// Create a folder in Drive and get its ID from the URL
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID || 'YOUR_FOLDER_ID';

/**
 * Upload file to Google Drive
 */
exports.uploadToDrive = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const auth = getAuthClient();
      const drive = google.drive({ version: 'v3', auth });

      // Parse multipart form data
      const busboy = Busboy({ headers: req.headers });
      const tmpdir = os.tmpdir();
      const uploads = {};
      const fileWrites = [];

      busboy.on('file', (fieldname, file, { filename, mimeType }) => {
        const filepath = path.join(tmpdir, filename);
        uploads[fieldname] = { filepath, filename, mimeType };
        
        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        const promise = new Promise((resolve, reject) => {
          file.on('end', () => writeStream.end());
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
        
        fileWrites.push(promise);
      });

      busboy.on('finish', async () => {
        await Promise.all(fileWrites);

        const upload = uploads['file'];
        if (!upload) {
          return res.status(400).json({ error: 'No file provided' });
        }

        try {
          // Upload to Google Drive
          const fileMetadata = {
            name: upload.filename,
            parents: [DRIVE_FOLDER_ID],
          };

          const media = {
            mimeType: upload.mimeType,
            body: fs.createReadStream(upload.filepath),
          };

          const driveResponse = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name, webViewLink, webContentLink',
          });

          const fileId = driveResponse.data.id;

          // Make file publicly accessible
          await drive.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'reader',
              type: 'anyone',
            },
          });

          // Clean up temp file
          fs.unlinkSync(upload.filepath);

          // Return response
          res.status(200).json({
            success: true,
            fileId: fileId,
            fileName: driveResponse.data.name,
            viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
            downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
            embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          });

        } catch (uploadError) {
          console.error('Drive upload error:', uploadError);
          // Clean up temp file on error
          if (fs.existsSync(upload.filepath)) {
            fs.unlinkSync(upload.filepath);
          }
          res.status(500).json({ error: 'Failed to upload to Drive', details: uploadError.message });
        }
      });

      busboy.end(req.rawBody);

    } catch (error) {
      console.error('Function error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
});

/**
 * Delete file from Google Drive
 */
exports.deleteFromDrive = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { fileId } = req.body;
      
      if (!fileId) {
        return res.status(400).json({ error: 'File ID required' });
      }

      const auth = getAuthClient();
      const drive = google.drive({ version: 'v3', auth });

      await drive.files.delete({ fileId });

      res.status(200).json({ success: true, message: 'File deleted' });

    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Failed to delete file', details: error.message });
    }
  });
});

/**
 * Get file info from Google Drive
 */
exports.getFileInfo = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const fileId = req.query.fileId;
      
      if (!fileId) {
        return res.status(400).json({ error: 'File ID required' });
      }

      const auth = getAuthClient();
      const drive = google.drive({ version: 'v3', auth });

      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, webViewLink, webContentLink, thumbnailLink',
      });

      res.status(200).json({
        success: true,
        file: response.data,
      });

    } catch (error) {
      console.error('Get file error:', error);
      res.status(500).json({ error: 'Failed to get file info', details: error.message });
    }
  });
});
