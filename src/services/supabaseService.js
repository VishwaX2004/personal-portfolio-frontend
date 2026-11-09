import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================
// PROJECT IMAGES - Upload to Supabase
// ============================================================

export const uploadProjectImages = async (files, projectId) => {
  try {
    const uploadedUrls = [];

    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${random}-${file.name}`;
      const filePath = `projects/${projectId}/${fileName}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from("portfolio-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(data.path);

      uploadedUrls.push({
        url: publicUrlData.publicUrl,
        path: data.path,
      });
    }

    return {
      success: true,
      uploaded: uploadedUrls,
    };
  } catch (error) {
    console.error("Project image upload error:", error);
    throw error;
  }
};

// ============================================================
// CERTIFICATE IMAGES - Upload to Supabase
// ============================================================

export const uploadCertificateImages = async (files, certificateId) => {
  try {
    const uploadedUrls = [];

    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${random}-${file.name}`;
      const filePath = `certificates/${certificateId}/${fileName}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from("portfolio-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(data.path);

      uploadedUrls.push({
        url: publicUrlData.publicUrl,
        path: data.path,
      });
    }

    return {
      success: true,
      uploaded: uploadedUrls,
    };
  } catch (error) {
    console.error("Certificate image upload error:", error);
    throw error;
  }
};

// ============================================================
// LOGO UPLOAD - Upload to Supabase
// ============================================================

export const uploadLogoToSupabase = async (file, institutionId) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${random}-${file.name}`;
    const filePath = `logos/${institutionId}/${fileName}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("portfolio-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(`Failed to upload logo: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(data.path);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error("Logo upload error:", error);
    throw error;
  }
};

// ============================================================
// DELETE IMAGE - Remove from Supabase
// ============================================================

export const deleteImageFromSupabase = async (imageUrl) => {
  try {
    // Extract path from public URL
    const urlParts = imageUrl.split("/storage/v1/object/public/portfolio-images/");
    if (urlParts.length < 2) {
      throw new Error("Invalid image URL");
    }

    const filePath = urlParts[1];

    // Delete from Supabase
    const { error } = await supabase.storage
      .from("portfolio-images")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Image deletion error:", error);
    throw error;
  }
};

// ============================================================
// BATCH DELETE - Remove multiple images
// ============================================================

export const deleteImagesFromSupabase = async (imageUrls) => {
  try {
    const filePaths = imageUrls.map((url) => {
      const urlParts = url.split("/storage/v1/object/public/portfolio-images/");
      return urlParts[1];
    }).filter(Boolean);

    if (filePaths.length === 0) {
      return { success: true };
    }

    // Delete from Supabase
    const { error } = await supabase.storage
      .from("portfolio-images")
      .remove(filePaths);

    if (error) {
      console.error("Batch delete error:", error);
      throw new Error(`Failed to delete images: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Batch deletion error:", error);
    throw error;
  }
};
