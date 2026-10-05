"use client";
import { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
  className?: string;
}

export default function ImageUploader({ onUpload, defaultImage = "", className = "" }: ImageUploaderProps) {
  const [image, setImage] = useState(defaultImage);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setImage(data.url);
        onUpload(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage("");
    onUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`w-full ${className}`}>
      {image ? (
        <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-gray-200 group">
          <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={removeImage}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
              title="Remove Image"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-sm aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 cursor-pointer transition"
        >
          {loading ? (
            <Loader2 className="animate-spin mb-2" size={32} />
          ) : (
            <UploadCloud className="mb-2" size={32} />
          )}
          <p className="text-sm font-semibold">{loading ? "Uploading..." : "Click to upload image"}</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
