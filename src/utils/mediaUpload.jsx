import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default async function mediaUpload(file) {

    if (!file) {
        throw new Error("Please select an image first.");
    }

    if (!(file instanceof File)) {
        throw new Error("Invalid image file.");
    }

    // Only allow images
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error(
            "Only JPG, PNG and WEBP images are allowed."
        );
    }

    // 10 MB maximum
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new Error(
            "Image size must be less than 10 MB."
        );
    }

    try {
        console.log("Uploading image:", file.name);

        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append("file", file);

        // Get token from localStorage
        const token = localStorage.getItem("adminToken");

        // Upload to backend endpoint
        const response = await axios.post(
            `${API_URL}/api/upload/image`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                timeout: 30000, // 30 second timeout
            }
        );

        if (!response.data.success) {
            throw new Error(
                response.data.message || "Upload failed"
            );
        }

        if (!response.data.publicUrl) {
            throw new Error(
                "Could not generate public image URL."
            );
        }

        const publicUrl = response.data.publicUrl;

        console.log(
            "Public image URL:",
            publicUrl
        );

        return publicUrl;

    } catch (error) {

        console.error(
            "mediaUpload error:",
            error.message
        );

        throw error;
    }
}
