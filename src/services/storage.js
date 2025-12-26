import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., 'resources/userId/filename')
 * @param {Function} onProgress - Progress callback (percentage)
 * @returns {Promise<string>} - Download URL
 */
export const uploadFile = (file, path, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Delete a file from Firebase Storage
 * @param {string} fileUrl - The file URL to delete
 */
export const deleteFile = async (fileUrl) => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Upload profile photo
 * @param {File} file - Image file
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Download URL
 */
export const uploadProfilePhoto = async (file, userId) => {
  const path = `profiles/${userId}/${Date.now()}_${file.name}`;
  return uploadFile(file, path);
};

/**
 * Upload resource file
 * @param {File} file - Resource file
 * @param {string} userId - User ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string>} - Download URL
 */
export const uploadResourceFile = async (file, userId, onProgress) => {
  const path = `resources/${userId}/${Date.now()}_${file.name}`;
  return uploadFile(file, path, onProgress);
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Get file type category
 */
export const getFileType = (filename) => {
  const ext = getFileExtension(filename).toLowerCase();
  const types = {
    pdf: 'PDF',
    doc: 'Document',
    docx: 'Document',
    ppt: 'Presentation',
    pptx: 'Presentation',
    xls: 'Spreadsheet',
    xlsx: 'Spreadsheet',
    mp4: 'Video',
    mp3: 'Audio',
    zip: 'Archive',
    rar: 'Archive',
  };
  return types[ext] || 'File';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
