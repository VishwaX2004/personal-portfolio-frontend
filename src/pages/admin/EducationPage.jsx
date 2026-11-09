import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, X, GraduationCap, Award, Upload } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdminQualifications,
  createAdminQualification,
  updateAdminQualification,
  deleteAdminQualification,
  uploadLogo,
  uploadCertificationImages,
} from "../../services/adminService";
import AdminModal from "../../components/admin/AdminModal";

export default function EducationPage() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [entryType, setEntryType] = useState("education");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    type: "education",
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    description: "",
    certificateUrl: "",
    order: "",
    logoUrl: "",
    certificateImages: [],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [certificateImageFiles, setCertificateImageFiles] = useState([]);
  const [certificatePreviewUrls, setCertificatePreviewUrls] = useState([]);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const data = await getAdminQualifications();
      setEducation(data || []);
    } catch (error) {
      console.error("Error fetching qualifications:", error);
      toast.error("Failed to load qualifications data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreviewUrl(previewUrl);
    }
  };

  const handleCertificateImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setCertificateImageFiles(files);
    
    // Generate preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setCertificatePreviewUrls(previewUrls);
  };

  const removeCertificatePreview = (index) => {
    setCertificateImageFiles(prev => prev.filter((_, i) => i !== index));
    setCertificatePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingCertificateImage = (index) => {
    setFormData(prev => ({
      ...prev,
      certificateImages: prev.certificateImages.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      type: "education",
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      description: "",
      certificateUrl: "",
      order: "",
      logoUrl: "",
      certificateImages: [],
    });
    setLogoFile(null);
    setLogoPreviewUrl("");
    setCertificateImageFiles([]);
    setCertificatePreviewUrls([]);
    setEditingEducation(null);
    setEntryType("education");
  };

  const handleTypeChange = (type) => {
    setEntryType(type);
    setFormData((prev) => ({
      ...prev,
      type,
    }));
  };

  const openEditModal = (item) => {
    setEditingEducation(item);
    setEntryType(item.type || "education");
    setFormData({
      type: item.type || "education",
      institution: item.institution || "",
      degree: item.degree || "",
      field: item.field || "",
      startYear: item.startYear?.toString() || "",
      endYear: item.endYear?.toString() || "",
      description: item.description || "",
      certificateUrl: item.certificateUrl || "",
      order: item.order?.toString() || "",
      logoUrl: item.logoUrl || "",
      certificateImages: item.certificateImages || [],
    });
    setLogoFile(null);
    setLogoPreviewUrl("");
    setCertificateImageFiles([]);
    setCertificatePreviewUrls([]);
  };

  const handleCreateEducation = async (e) => {
    e.preventDefault();

    if (entryType === "education") {
      if (!formData.institution || !formData.degree || !formData.field || !formData.startYear) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else {
      if (!formData.degree) {
        toast.error("Certificate name is required");
        return;
      }
    }

    const startYearNum = parseInt(formData.startYear || 0, 10);
    if (formData.startYear && (startYearNum < 1900 || startYearNum > 2099)) {
      toast.error("Start year must be between 1900 and 2099");
      return;
    }

    if (formData.endYear) {
      const endYearNum = parseInt(formData.endYear, 10);
      if (endYearNum < 1900 || endYearNum > 2099) {
        toast.error("End year must be between 1900 and 2099");
        return;
      }
    }

    try {
      setUploading(true);

      let logoUrl = "";
      let certificateImages = [];

      // **GRANULAR ERROR HANDLING FOR LOGO UPLOAD**
      if (entryType === "education" && logoFile) {
        try {
          const uploadResponse = await uploadLogo(logoFile);
          if (uploadResponse?.success && uploadResponse?.publicUrl) {
            logoUrl = uploadResponse.publicUrl;
          } else {
            const errorMsg = uploadResponse?.message || "Upload failed";
            toast.error(`Logo upload failed: ${errorMsg}`);
            setUploading(false);
            return;
          }
        } catch (uploadError) {
          const errorMsg = uploadError?.response?.data?.message || uploadError?.message || "Network error";
          toast.error(`Logo upload error: ${errorMsg}`);
          setUploading(false);
          return;
        }
      }

      // **GRANULAR ERROR HANDLING FOR CERTIFICATE IMAGES UPLOAD**
      if (entryType === "certificate" && certificateImageFiles.length > 0) {
        try {
          const uploadResponse = await uploadCertificationImages(certificateImageFiles);
          if (uploadResponse?.success && Array.isArray(uploadResponse?.uploaded)) {
            certificateImages = uploadResponse.uploaded
              .map(item => item?.publicUrl)
              .filter(url => typeof url === 'string' && url.length > 0);
            
            if (certificateImages.length === 0) {
              toast.error("Certificate images uploaded but no URLs returned");
              setUploading(false);
              return;
            }
          } else {
            const errorMsg = uploadResponse?.message || "Upload failed";
            toast.error(`Certificate images upload failed: ${errorMsg}`);
            setUploading(false);
            return;
          }
        } catch (uploadError) {
          const errorMsg = uploadError?.response?.data?.message || uploadError?.message || "Network error";
          toast.error(`Certificate images upload error: ${errorMsg}`);
          setUploading(false);
          return;
        }
      }

      // If we get here, uploads succeeded; now submit to API
      const submitData = {
        type: entryType,
        ...(entryType === "education" && {
          institution: formData.institution,
          degree: formData.degree,
          field: formData.field,
          startYear: startYearNum || null,
          endYear: formData.endYear ? parseInt(formData.endYear, 10) : null,
          ...(logoUrl && { logoUrl }),
        }),
        ...(entryType === "certificate" && {
          degree: formData.degree,  // Keep degree field name
          field: formData.field,    // Keep field as issuer
          startYear: startYearNum || null,
          ...(certificateImages.length > 0 && { certificateImages }),
        }),
        description: formData.description,
        certificateUrl: formData.certificateUrl,
        order: formData.order ? parseInt(formData.order, 10) : 0,
      };

      await createAdminQualification(submitData);
      toast.success(`${entryType === "education" ? "Education" : "Certificate"} added successfully!`);
      resetForm();
      setShowAddForm(false);
      fetchEducation();
    } catch (error) {
      console.error("API error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Unknown error";
      toast.error(`Failed to save entry: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateEducation = async (e) => {
    e.preventDefault();

    if (entryType === "education") {
      if (!formData.institution || !formData.degree || !formData.field || !formData.startYear) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else {
      if (!formData.degree) {
        toast.error("Certificate name is required");
        return;
      }
    }

    try {
      setUploading(true);

      let logoUrl = formData.logoUrl || "";
      let certificateImages = formData.certificateImages || [];

      // **GRANULAR ERROR HANDLING FOR LOGO UPLOAD**
      if (entryType === "education" && logoFile) {
        try {
          const uploadResponse = await uploadLogo(logoFile);
          if (uploadResponse?.success && uploadResponse?.publicUrl) {
            logoUrl = uploadResponse.publicUrl;
          } else {
            const errorMsg = uploadResponse?.message || "Upload failed";
            toast.error(`Logo upload failed: ${errorMsg}`);
            setUploading(false);
            return;
          }
        } catch (uploadError) {
          const errorMsg = uploadError?.response?.data?.message || uploadError?.message || "Network error";
          toast.error(`Logo upload error: ${errorMsg}`);
          setUploading(false);
          return;
        }
      }

      // **GRANULAR ERROR HANDLING FOR CERTIFICATE IMAGES UPLOAD**
      if (entryType === "certificate" && certificateImageFiles.length > 0) {
        try {
          const uploadResponse = await uploadCertificationImages(certificateImageFiles);
          if (uploadResponse?.success && Array.isArray(uploadResponse?.uploaded)) {
            const newImages = uploadResponse.uploaded
              .map(item => item?.publicUrl)
              .filter(url => typeof url === 'string' && url.length > 0);
            
            if (newImages.length === 0) {
              toast.error("Certificate images uploaded but no URLs returned");
              setUploading(false);
              return;
            }
            
            // Append new images to existing ones
            certificateImages = [...certificateImages, ...newImages];
          } else {
            const errorMsg = uploadResponse?.message || "Upload failed";
            toast.error(`Certificate images upload failed: ${errorMsg}`);
            setUploading(false);
            return;
          }
        } catch (uploadError) {
          const errorMsg = uploadError?.response?.data?.message || uploadError?.message || "Network error";
          toast.error(`Certificate images upload error: ${errorMsg}`);
          setUploading(false);
          return;
        }
      }

      // If we get here, uploads succeeded; now submit to API
      const submitData = {
        type: entryType,
        ...(entryType === "education" && {
          institution: formData.institution,
          degree: formData.degree,
          field: formData.field,
          startYear: parseInt(formData.startYear, 10) || null,
          endYear: formData.endYear ? parseInt(formData.endYear, 10) : null,
          ...(logoUrl && { logoUrl }),
        }),
        ...(entryType === "certificate" && {
          degree: formData.degree,  // Keep degree field name
          field: formData.field,    // Keep field as issuer
          startYear: parseInt(formData.startYear, 10) || null,
          ...(certificateImages.length > 0 && { certificateImages }),
        }),
        description: formData.description,
        certificateUrl: formData.certificateUrl,
        order: formData.order ? parseInt(formData.order, 10) : 0,
      };

      await updateAdminQualification(editingEducation._id, submitData);
      toast.success("Entry updated successfully!");
      resetForm();
      setEditingEducation(null);
      fetchEducation();
    } catch (error) {
      console.error("API error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Unknown error";
      toast.error(`Failed to update entry: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEducation = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    try {
      await deleteAdminQualification(id);
      toast.success("Entry deleted");
      fetchEducation();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete entry");
    }
  };

  const educationList = education.filter((e) => e.type !== "certificate");
  const certificateList = education.filter((e) => e.type === "certificate");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Education & Certificates</h2>
          <p className="text-gray-500 mt-1">Manage your education history and certifications.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) resetForm();
          }}
          className="px-5 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-xl flex items-center justify-center gap-2 transition font-medium"
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? "Close" : "Add New"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6">Add New Entry</h3>

          {/* Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-4">Select Type *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition"
                style={{
                  borderColor: entryType === "education" ? "#6c63ff" : "rgba(255,255,255,0.1)",
                  backgroundColor: entryType === "education" ? "rgba(108,99,255,0.1)" : "transparent"
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value="education"
                  checked={entryType === "education"}
                  onChange={() => handleTypeChange("education")}
                  className="w-4 h-4 accent-[#6c63ff] cursor-pointer"
                />
                <GraduationCap size={20} className="text-[#6c63ff]" />
                <span className="text-white font-medium">Education</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition"
                style={{
                  borderColor: entryType === "certificate" ? "#6c63ff" : "rgba(255,255,255,0.1)",
                  backgroundColor: entryType === "certificate" ? "rgba(108,99,255,0.1)" : "transparent"
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value="certificate"
                  checked={entryType === "certificate"}
                  onChange={() => handleTypeChange("certificate")}
                  className="w-4 h-4 accent-[#6c63ff] cursor-pointer"
                />
                <Award size={20} className="text-[#6c63ff]" />
                <span className="text-white font-medium">Certificate</span>
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleCreateEducation} className="space-y-6">
            {entryType === "education" ? (
              <EducationFormFields 
                form={formData} 
                onChange={handleFormChange}
                logoFile={logoFile}
                logoPreviewUrl={logoPreviewUrl}
                onLogoChange={handleLogoChange}
                onRemoveLogo={() => {
                  setLogoFile(null);
                  setLogoPreviewUrl("");
                }}
              />
            ) : (
              <CertificateFormFields 
                form={formData} 
                onChange={handleFormChange}
                certificateImageFiles={certificateImageFiles}
                certificatePreviewUrls={certificatePreviewUrls}
                onCertificateImagesChange={handleCertificateImagesChange}
                onRemoveCertificatePreview={removeCertificatePreview}
                existingCertificateImages={formData.certificateImages}
                onRemoveExistingCertificateImage={removeExistingCertificateImage}
              />
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full px-6 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : `Add ${entryType === "education" ? "Education" : "Certificate"}`}
            </button>
          </form>
        </div>
      )}

      {/* Tree Layout - Education and Certificates Side by Side */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Education Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={24} className="text-[#6c63ff]" />
            <h3 className="text-xl font-bold">Education</h3>
            {educationList.length > 0 && (
              <span className="text-sm text-gray-400 ml-auto">({educationList.length})</span>
            )}
          </div>

          {educationList.length === 0 ? (
            <div className="border border-dashed border-white/20 rounded-xl p-6 text-center text-gray-500">
              No education entries yet
            </div>
          ) : (
            <div className="space-y-3">
              {educationList.map((item, index) => (
                <EducationCard
                  key={item._id}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === educationList.length - 1}
                  onEdit={openEditModal}
                  onDelete={handleDeleteEducation}
                />
              ))}
            </div>
          )}
        </div>

        {/* Certificates Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Award size={24} className="text-orange-400" />
            <h3 className="text-xl font-bold">Certificates</h3>
            {certificateList.length > 0 && (
              <span className="text-sm text-gray-400 ml-auto">({certificateList.length})</span>
            )}
          </div>

          {certificateList.length === 0 ? (
            <div className="border border-dashed border-white/20 rounded-xl p-6 text-center text-gray-500">
              No certificates yet
            </div>
          ) : (
            <div className="space-y-3">
              {certificateList.map((item, index) => (
                <CertificateCard
                  key={item._id}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === certificateList.length - 1}
                  onEdit={openEditModal}
                  onDelete={handleDeleteEducation}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AdminModal
        isOpen={editingEducation !== null}
        title={editingEducation?.type === "certificate" ? "Edit Certificate" : "Edit Education"}
        onClose={() => {
          resetForm();
          setEditingEducation(null);
        }}
      >
        <form onSubmit={handleUpdateEducation} className="space-y-5">
          {entryType === "education" ? (
            <EducationFormFields 
              form={formData} 
              onChange={handleFormChange}
              logoFile={logoFile}
              logoPreviewUrl={logoPreviewUrl}
              onLogoChange={handleLogoChange}
              onRemoveLogo={() => {
                setLogoFile(null);
                setLogoPreviewUrl("");
              }}
              existingLogoUrl={editingEducation?.logoUrl}
            />
          ) : (
            <CertificateFormFields 
              form={formData} 
              onChange={handleFormChange}
              certificateImageFiles={certificateImageFiles}
              certificatePreviewUrls={certificatePreviewUrls}
              onCertificateImagesChange={handleCertificateImagesChange}
              onRemoveCertificatePreview={removeCertificatePreview}
              existingCertificateImages={formData.certificateImages}
              onRemoveExistingCertificateImage={removeExistingCertificateImage}
            />
          )}

          <div className="flex gap-3 pt-5">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Updating..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditingEducation(null);
              }}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}

function EducationCard({ item, isFirst, isLast, onEdit, onDelete }) {
  return (
    <div className="relative">
      {!isLast && <div className="absolute left-5 top-16 w-0.5 h-12 bg-gradient-to-b from-[#6c63ff] to-transparent" />}

      <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02] hover:bg-white/[0.05] transition relative pl-12">
        <div className="absolute left-2 top-4 w-6 h-6 bg-[#6c63ff] rounded-full border-2 border-[#1a1a2e]" />

        <div className="space-y-2">
          {item.logoUrl && (
            <div className="mb-3">
              <img 
                src={item.logoUrl} 
                alt={`${item.institution} logo`}
                className="w-10 h-10 rounded-full object-cover border border-blue-500/30"
              />
            </div>
          )}
          <h4 className="font-semibold text-white">{item.degree}</h4>
          <p className="text-sm text-gray-400">{item.institution}</p>
          <p className="text-xs text-gray-500">
            {item.field} • {item.startYear}
            {item.endYear ? ` - ${item.endYear}` : " - Present"}
          </p>
          {item.description && <p className="text-sm text-gray-400 mt-2">{item.description}</p>}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 px-2 py-1.5 text-xs bg-[#6c63ff]/20 hover:bg-[#6c63ff]/30 text-[#6c63ff] rounded transition flex items-center justify-center gap-1"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="flex-1 px-2 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition flex items-center justify-center gap-1"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificateCard({ item, isFirst, isLast, onEdit, onDelete }) {
  return (
    <div className="relative">
      {!isLast && <div className="absolute left-5 top-16 w-0.5 h-12 bg-gradient-to-b from-orange-400 to-transparent" />}

      <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02] hover:bg-white/[0.05] transition relative pl-12">
        <div className="absolute left-2 top-4 w-6 h-6 bg-orange-400 rounded-full border-2 border-[#1a1a2e]" />

        <div className="space-y-2">
          <h4 className="font-semibold text-white">{item.degree}</h4>
          <p className="text-sm text-gray-400">{item.field}</p>
          <p className="text-xs text-gray-500">{item.startYear || "Date not specified"}</p>
          {item.description && <p className="text-sm text-gray-400 mt-2">{item.description}</p>}
          
          {item.certificateImages && item.certificateImages.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {item.certificateImages.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Certificate ${idx + 1}`}
                  className="w-16 h-16 rounded-lg object-cover border border-orange-400/30"
                />
              ))}
            </div>
          )}
          
          {item.certificateUrl && (
            <a
              href={item.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#6c63ff] hover:underline block mt-2"
            >
              View Certificate →
            </a>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 px-2 py-1.5 text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded transition flex items-center justify-center gap-1"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="flex-1 px-2 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition flex items-center justify-center gap-1"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationFormFields({ form, onChange, logoFile, logoPreviewUrl, onLogoChange, onRemoveLogo, existingLogoUrl }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 space-y-4 md:space-y-0">
      <Input
        label="Institution"
        name="institution"
        value={form.institution}
        onChange={onChange}
        placeholder="University Name"
        required
      />

      <Input
        label="Degree"
        name="degree"
        value={form.degree}
        onChange={onChange}
        placeholder="Bachelor of Science"
        required
      />

      <Input
        label="Field of Study"
        name="field"
        value={form.field}
        onChange={onChange}
        placeholder="Computer Science"
        required
      />

      <Input
        label="Start Year"
        name="startYear"
        type="number"
        value={form.startYear}
        onChange={onChange}
        placeholder="2020"
        required
      />

      <Input
        label="End Year"
        name="endYear"
        type="number"
        value={form.endYear}
        onChange={onChange}
        placeholder="2024 (or leave blank for present)"
      />

      <Input
        label="Order"
        name="order"
        type="number"
        value={form.order}
        onChange={onChange}
        placeholder="0"
      />

      <div className="md:col-span-2">
        <label className="block text-sm text-gray-400 mb-2">Institute Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={onLogoChange}
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-[#6c63ff] transition"
        />
        
        {(logoPreviewUrl || existingLogoUrl) && (
          <div className="mt-3 flex items-center gap-3">
            <img 
              src={logoPreviewUrl || existingLogoUrl} 
              alt="Logo preview"
              className="w-12 h-12 rounded-full object-cover border border-[#6c63ff]"
            />
            <button
              type="button"
              onClick={onRemoveLogo}
              className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm text-gray-400 mb-2">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows="3"
          placeholder="Add any details about your education..."
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-[#6c63ff] transition resize-none"
        />
      </div>
    </div>
  );
}

function CertificateFormFields({ 
  form, 
  onChange, 
  certificateImageFiles,
  certificatePreviewUrls,
  onCertificateImagesChange,
  onRemoveCertificatePreview,
  existingCertificateImages,
  onRemoveExistingCertificateImage
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4 space-y-4 md:space-y-0">
      <Input
        label="Certificate Name"
        name="degree"
        value={form.degree}
        onChange={onChange}
        placeholder="e.g., AWS Certified Developer"
        required
      />

      <Input
        label="Issuer"
        name="field"
        value={form.field}
        onChange={onChange}
        placeholder="e.g., Amazon Web Services"
      />

      <Input
        label="Issue Year"
        name="startYear"
        type="number"
        value={form.startYear}
        onChange={onChange}
        placeholder="2024"
      />

      <Input
        label="Order"
        name="order"
        type="number"
        value={form.order}
        onChange={onChange}
        placeholder="0"
      />

      <div className="md:col-span-2">
        <Input
          label="Certificate URL"
          name="certificateUrl"
          type="url"
          value={form.certificateUrl}
          onChange={onChange}
          placeholder="https://..."
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm text-gray-400 mb-2">Certificate Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onCertificateImagesChange}
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-[#6c63ff] transition"
        />
        
        {/* New images preview */}
        {certificatePreviewUrls.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">New Images:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {certificatePreviewUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={url} 
                    alt={`Preview ${idx}`}
                    className="w-20 h-20 rounded-lg object-cover border border-[#6c63ff]"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveCertificatePreview(idx)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing images */}
        {existingCertificateImages && existingCertificateImages.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Existing Images:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {existingCertificateImages.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={url} 
                    alt={`Existing ${idx}`}
                    className="w-20 h-20 rounded-lg object-cover border border-orange-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveExistingCertificateImage(idx)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm text-gray-400 mb-2">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows="3"
          placeholder="Add any details about this certificate..."
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-[#6c63ff] transition resize-none"
        />
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-[#6c63ff] transition"
      />
    </div>
  );
}
