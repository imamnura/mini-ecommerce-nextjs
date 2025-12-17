/**
 * File Upload Service
 * Handles image uploads for products and user avatars
 */

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  folder?: string;
}

const DEFAULT_OPTIONS: UploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  folder: "uploads",
};

/**
 * Validate file
 */
function validateFile(
  file: File,
  options: UploadOptions = DEFAULT_OPTIONS
): { valid: boolean; error?: string } {
  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${(options.maxSize / 1024 / 1024).toFixed(
        1
      )}MB limit`,
    };
  }

  // Check file type
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type
        } is not allowed. Allowed types: ${options.allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Generate unique filename
 */
function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const sanitized = nameWithoutExt.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return `${sanitized}_${timestamp}_${random}${ext}`;
}

/**
 * Upload file to local storage
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = DEFAULT_OPTIONS
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file, options);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Generate filename and paths
    const filename = generateFilename(file.name);
    const folder = options.folder || DEFAULT_OPTIONS.folder!;
    const uploadDir = path.join(process.cwd(), "public", folder);
    const filePath = path.join(uploadDir, filename);
    const publicUrl = `/${folder}/${filename}`;

    // Create upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    console.log("✅ File uploaded:", publicUrl);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error: unknown) {
    console.error("❌ Upload error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}

/**
 * Upload product image
 */
export async function uploadProductImage(file: File): Promise<UploadResult> {
  return uploadFile(file, {
    ...DEFAULT_OPTIONS,
    folder: "uploads/products",
    maxSize: 10 * 1024 * 1024, // 10MB for product images
  });
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(file: File): Promise<UploadResult> {
  return uploadFile(file, {
    ...DEFAULT_OPTIONS,
    folder: "uploads/avatars",
    maxSize: 2 * 1024 * 1024, // 2MB for avatars
  });
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  options: UploadOptions = DEFAULT_OPTIONS
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadFile(file, options));
  return Promise.all(uploadPromises);
}

/**
 * Validate image dimensions (client-side helper)
 */
export function validateImageDimensions(
  file: File,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<{
  valid: boolean;
  error?: string;
  dimensions?: { width: number; height: number };
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const { width, height } = img;

      if (minWidth && width < minWidth) {
        resolve({
          valid: false,
          error: `Image width must be at least ${minWidth}px (current: ${width}px)`,
        });
        return;
      }

      if (minHeight && height < minHeight) {
        resolve({
          valid: false,
          error: `Image height must be at least ${minHeight}px (current: ${height}px)`,
        });
        return;
      }

      if (maxWidth && width > maxWidth) {
        resolve({
          valid: false,
          error: `Image width must not exceed ${maxWidth}px (current: ${width}px)`,
        });
        return;
      }

      if (maxHeight && height > maxHeight) {
        resolve({
          valid: false,
          error: `Image height must not exceed ${maxHeight}px (current: ${height}px)`,
        });
        return;
      }

      resolve({
        valid: true,
        dimensions: { width, height },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        valid: false,
        error: "Failed to load image",
      });
    };

    img.src = objectUrl;
  });
}
