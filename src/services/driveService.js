/**
 * Google Drive Service
 * Handles file uploads to Google Drive via Express Backend
 */

// Backend API URL - change this for production
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

/**
 * Upload file to Google Drive via Express Backend
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{fileId: string, fileName: string, downloadUrl: string, viewUrl: string}>}
 */
export const uploadToDrive = async (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            resolve({
              fileId: response.fileId,
              fileName: response.fileName || file.name,
              downloadUrl: response.downloadUrl,
              viewUrl: response.viewUrl,
              embedUrl: response.embedUrl,
              size: response.size || file.size,
              mimeType: response.mimeType || file.type
            });
          } else {
            reject(new Error(response.error || 'Upload failed'));
          }
        } catch (e) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.message || `Upload failed: ${xhr.statusText}`));
        } catch {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error - is the backend server running?'));
    });

    xhr.open('POST', `${BACKEND_URL}/upload`);
    xhr.send(formData);
  });
};

/**
 * Upload multiple files to Google Drive
 * @param {FileList|File[]} files - The files to upload
 * @param {Function} onProgress - Progress callback (receives current file index and progress)
 * @returns {Promise<Array>}
 */
export const uploadMultipleToDrive = async (files, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error - is the backend server running?'));
    });

    xhr.open('POST', `${BACKEND_URL}/upload-multiple`);
    xhr.send(formData);
  });
};

/**
 * Delete file from Google Drive
 * @param {string} fileId - The Google Drive file ID
 * @returns {Promise<boolean>}
 */
export const deleteFromDrive = async (fileId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/delete/${fileId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

/**
 * Convert Google Drive file ID to various URL formats
 */
export const getDriveUrls = (fileId) => ({
  // Direct download link
  downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
  // View in browser
  viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
  // Embed URL (for PDFs)
  embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
  // Thumbnail
  thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
});

/**
 * Extract file ID from various Google Drive URL formats
 */
export const extractDriveFileId = (url) => {
  if (!url) return null;
  
  // Already a file ID (no slashes or special chars)
  if (/^[\w-]+$/.test(url) && url.length > 20) {
    return url;
  }

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,           // /file/d/FILE_ID/
    /id=([a-zA-Z0-9_-]+)/,                    // ?id=FILE_ID
    /\/d\/([a-zA-Z0-9_-]+)/,                  // /d/FILE_ID
    /\/open\?id=([a-zA-Z0-9_-]+)/,            // /open?id=FILE_ID
    /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/, // uc?export=download&id=FILE_ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

/**
 * Validate if URL is a valid Google Drive link
 */
export const isValidDriveUrl = (url) => {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
};

/**
 * Get file type icon based on mime type
 */
export const getFileTypeIcon = (mimeType) => {
  if (!mimeType) return '📄';
  
  if (mimeType.includes('pdf')) return '📕';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📘';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📗';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📙';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('video')) return '🎬';
  if (mimeType.includes('audio')) return '🎵';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
  
  return '📄';
};

export default {
  uploadToDrive,
  getDriveUrls,
  extractDriveFileId,
  isValidDriveUrl,
  getFileTypeIcon,
};
