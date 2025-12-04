"use client";

import { useState, useRef } from "react";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface UseFileUploadOptions {
  type?: "avatar" | "product";
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { type = "product", onSuccess, onError } = options;
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(null);
      return;
    }

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      // Simulate progress (since we don't have real progress tracking)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      if (onSuccess) {
        onSuccess(data.url);
      }

      return {
        success: true,
        url: data.url,
      };
    } catch (error: any) {
      const errorMessage = error.message || "Upload failed";

      if (onError) {
        onError(errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFileSelect(file);
    await uploadFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const reset = () => {
    setPreview(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    uploading,
    progress,
    preview,
    fileInputRef,
    uploadFile,
    handleFileInputChange,
    handleFileSelect,
    triggerFileInput,
    reset,
  };
}
