import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import mediaUpload from "../utils/mediaUpload";

export default function ImageUploader({ onImagesUploaded, maxImages = 5 }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCover, setSelectedCover] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    // Check total count
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      setUploading(true);
      const uploadPromises = Array.from(files).map((file) => mediaUpload(file));
      const urls = await Promise.all(uploadPromises);

      const newImages = urls.map((url) => ({
        url,
        uploaded: true,
        id: Math.random().toString(36).substr(2, 9),
      }));

      const allImages = [...images, ...newImages];
      setImages(allImages);
      onImagesUploaded(allImages.map((img) => img.url));
      toast.success(`${urls.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesUploaded(newImages.map((img) => img.url));

    // Reset cover selection if removed image was selected
    if (selectedCover === index) {
      setSelectedCover(0);
    } else if (selectedCover > index) {
      setSelectedCover(selectedCover - 1);
    }
  };

  const setCoverImage = (index) => {
    setSelectedCover(index);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative border-2 border-dashed border-white/20 rounded-xl p-8 hover:border-[#6c63ff]/50 transition cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={uploading}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-lg bg-[#6c63ff]/10 group-hover:bg-[#6c63ff]/20 transition">
            <Upload size={24} className="text-[#6c63ff]" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">
              {uploading ? "Uploading..." : "Drag images here or click to select"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              JPG, PNG, WebP up to 10MB • Max {maxImages} images
            </p>
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#6c63ff] border-t-transparent" />
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Uploaded Images ({images.length}/{maxImages})
            </label>
            <p className="text-xs text-gray-500">
              First image will be cover image
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative group aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10"
              >
                {/* Image */}
                <img
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  {/* Cover Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#6c63ff] rounded text-xs font-medium text-white">
                      Cover
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeImage(index)}
                    className="p-2 rounded-lg bg-red-500/80 hover:bg-red-600 transition text-white"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cover Image Note */}
          <p className="text-xs text-gray-400 flex items-center gap-2">
            <ImageIcon size={14} />
            First image will be used as the project cover image
          </p>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
