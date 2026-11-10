import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "portfolio-images";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is missing from the frontend environment.");
}

if (!supabaseKey) {
    throw new Error(
        "VITE_SUPABASE_ANON_KEY is missing from the frontend environment."
    );
}

let projectUrl;

try {
    projectUrl = new URL(supabaseUrl);
} catch {
    throw new Error(
        "VITE_SUPABASE_URL is invalid. Copy the Project URL from Supabase."
    );
}

if (!["https:", "http:"].includes(projectUrl.protocol)) {
    throw new Error("VITE_SUPABASE_URL must start with https:// or http://.");
}

const supabase = createClient(supabaseUrl.replace(/\/+$/, ""), supabaseKey);

function createFilePath(file) {
    const cleanFileName = file.name.trim().replace(/[^a-zA-Z0-9.-]/g, "_");
    const randomSuffix = Math.random().toString(36).slice(2, 10);

    return `portfolio/${Date.now()}-${randomSuffix}-${cleanFileName}`;
}

export default async function mediaUpload(file) {
    if (!file) {
        throw new Error("Please select an image first.");
    }

    if (!(file instanceof File)) {
        throw new Error("Invalid image file.");
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error("Only JPG, PNG and WebP images are allowed.");
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error("Image size must be 10 MB or less.");
    }

    const bucket = supabase.storage.from(BUCKET_NAME);
    const filePath = createFilePath(file);

    try {
        const { data, error } = await bucket.upload(filePath, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false,
        });

        if (error) {
            throw error;
        }

        if (!data?.path) {
            throw new Error("Supabase did not return the uploaded file path.");
        }

        const { data: publicUrlData } = bucket.getPublicUrl(data.path);
        const publicUrl = publicUrlData?.publicUrl;

        if (!publicUrl) {
            throw new Error("Supabase did not return a public image URL.");
        }

        return publicUrl;
    } catch (error) {
        const message = error?.message || "Supabase image upload failed.";
        const status = error?.statusCode ?? error?.status;

        console.error("Supabase image upload failed", {
            hostname: projectUrl.hostname,
            bucket: BUCKET_NAME,
            path: filePath,
            status,
            error,
        });

        if (/failed to fetch|networkerror|network request failed|load failed/i.test(message)) {
            throw new Error(
                `Could not reach ${projectUrl.hostname}. Check the Supabase Project URL, project status, and your network.`,
                { cause: error }
            );
        }

        throw new Error(message, { cause: error });
    }
}