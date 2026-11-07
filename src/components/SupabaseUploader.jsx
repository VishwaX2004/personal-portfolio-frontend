import { useState, useRef } from "react";
import { Upload, X, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BUCKET_NAME = "portfolio-projects";

export default function SupabaseUploader({ onUploadComplete, previewImages = [] }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(previewImages || []);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs for selected files
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove a selected file
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    
    // Clean up preview URL
    if (previewUrls[index] && previewUrls[index].startsWith("blob:")) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload files to Supabase
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const uploadedUrls = [];
      const totalFiles = selectedFiles.length;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const fileName = `${timestamp}-${random}-${file.name}`;
        const filePath = `projects/${fileName}`;

        // Upload to Supabase
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file);

        if (error) {
          console.error(`Upload error for ${file.name}:`, error);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        // Get public URL
        const { data: publicData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          uploadedUrls.push(publicData.publicUrl);
        }

        // Update progress
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      if (uploadedUrls.length === 0) {
        toast.error("No files were uploaded successfully");
        setUploading(false);
        return;
      }

      // Pass uploaded URLs back to parent component
      onUploadComplete(uploadedUrls);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);

      // Clear selected files
      setSelectedFiles([]);
      const blobUrls = previewUrls.filter((url) => url.startsWith("blob:"));
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls(previewUrls.slice(-previewUrls.length + selectedFiles.length));

      setUploadProgress(0);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-blue-500/50 transition cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Upload size={32} className="mx-auto text-gray-500 mb-3" />
        <p className="text-gray-300 font-medium">Click to select images or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
      </div>

      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-3">
            Selected images ({previewUrls.length})
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />

                {/* First image badge */}
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-blue-500 text-xs px-2 py-1 rounded text-white font-semibold">
                    Cover
                  </div>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  title="Remove image"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            The first image will be used as the cover image
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader size={16} className="animate-spin text-blue-500" />
            <p className="text-sm text-gray-300">Uploading... {Math.round(uploadProgress)}%</p>
          </div>

          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && !uploading && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl font-medium transition flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          Upload {selectedFiles.length} Image{selectedFiles.length > 1 ? "s" : ""}
        </button>
      )}

      {/* Add More Button (if already has files) */}
      {previewUrls.length > 0 && selectedFiles.length > 0 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-2 border border-white/20 hover:border-blue-500/50 rounded-xl text-sm transition"
        >
          Add More Images
        </button>
      )}
    </div>
  );
}
