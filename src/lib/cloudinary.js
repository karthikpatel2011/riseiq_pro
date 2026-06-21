/**
 * Cloudinary unsigned upload utility
 *
 * Required env vars (add to your .env file):
 *   VITE_CLOUDINARY_CLOUD_NAME   — your Cloudinary cloud name
 *   VITE_CLOUDINARY_UPLOAD_PRESET — an unsigned upload preset you created
 *
 * How to set up in 2 minutes:
 *   1. Sign up free at https://cloudinary.com
 *   2. Dashboard → Settings → Upload → "Add upload preset"
 *   3. Set Signing Mode to "Unsigned", note the preset name
 *   4. Copy your Cloud Name from the top of the dashboard
 */

const CLOUD  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME  || "dk1ipdswb";
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "rise_iq";

const MAX_MB = 5;
const MAX_B  = MAX_MB * 1024 * 1024;

/**
 * Upload a file to Cloudinary with live progress.
 *
 * @param {File}     file         - The file to upload
 * @param {string}   folder       - Cloudinary folder path, e.g. "riseiq/users/uid123"
 * @param {string}   resourceType - "image" for photos, "raw" for PDFs/docs
 * @param {Function} onProgress   - Called with 0-100 during upload
 * @returns {Promise<string>}     - Resolves with the secure_url of the uploaded file
 */
export function uploadToCloudinary(file, folder, resourceType, onProgress) {
  if (file.size > MAX_B) {
    return Promise.reject(new Error(`File must be under ${MAX_MB} MB.`));
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD}/${resourceType}/upload`;

  const form = new FormData();
  form.append("file",           file);
  form.append("upload_preset",  PRESET);
  form.append("folder",         folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    // Live upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } catch {
          reject(new Error("Unexpected response from Cloudinary."));
        }
      } else {
        let msg = "Upload failed.";
        try {
          const data = JSON.parse(xhr.responseText);
          msg = data.error?.message || msg;
        } catch { /* ignore */ }
        reject(new Error(msg));
      }
    });

    xhr.addEventListener("error",  () => reject(new Error("Network error during upload.")));
    xhr.addEventListener("abort",  () => reject(new Error("Upload was cancelled.")));

    xhr.send(form);
  });
}

/** Convenience: upload a profile photo (image resource type) */
export const uploadPhoto = (file, userId, onProgress) =>
  uploadToCloudinary(file, `riseiq/users/${userId}`, "image", onProgress);

/** Convenience: upload a resume PDF (raw resource type) */
export const uploadResume = (file, userId, onProgress) =>
  uploadToCloudinary(file, `riseiq/users/${userId}`, "raw", onProgress);

/** Convenience: upload any project file (auto-detect type) */
export const uploadProjectFile = (file, userId, onProgress) =>
  uploadToCloudinary(file, `riseiq/users/${userId}/projects`, "auto", onProgress);
