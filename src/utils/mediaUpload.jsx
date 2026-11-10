import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
        console.log("Uploading image via backend:", file.name);

        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append('file', file);

        // Upload to backend which handles Supabase or local storage
        const response = await axios.post(
            `${API_URL}/api/upload/image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (!response.data.success) {
            throw new Error(`Upload failed: ${response.data.message}`);
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
