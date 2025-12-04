"use client";

import { useFileUpload } from "@/hooks/useFileUpload";
import Image from "next/image";

interface FileUploadProps {
  type?: "avatar" | "product";
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentImage?: string;
  label?: string;
  acceptedTypes?: string;
}

export function FileUpload({
  type = "product",
  onUploadSuccess,
  onUploadError,
  currentImage,
  label = "Upload Image",
  acceptedTypes = "image/jpeg,image/jpg,image/png,image/webp,image/gif",
}: FileUploadProps) {
  const {
    uploading,
    progress,
    preview,
    fileInputRef,
    handleFileInputChange,
    triggerFileInput,
  } = useFileUpload({
    type,
    onSuccess: onUploadSuccess,
    onError: onUploadError,
  });

  const displayImage = preview || currentImage;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Preview */}
      {displayImage && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={displayImage}
            alt="Preview"
            fill
            className="object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-lg font-semibold mb-2">{progress}%</div>
                <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading
            ? "Uploading..."
            : displayImage
            ? "Change Image"
            : "Select Image"}
        </button>
      </div>

      {/* Info */}
      <p className="text-sm text-gray-500">
        {type === "avatar"
          ? "Max size: 2MB. Formats: JPG, PNG, WEBP, GIF"
          : "Max size: 10MB. Formats: JPG, PNG, WEBP, GIF"}
      </p>
    </div>
  );
}
