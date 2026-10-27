import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdminEducation,
  createAdminEducation,
  updateAdminEducation,
  deleteAdminEducation,
} from "../../services/adminService";
import AdminModal from "../../components/admin/AdminModal";

export default function EducationPage() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    description: "",
    order: "",
  });

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const data = await getAdminEducation();
      setEducation(data || []);
    } catch (error) {
      console.error("Error fetching education:", error);
      toast.error("Failed to load education data");
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

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      description: "",
      order: "",
    });
    setEditingEducation(null);
  };

  const openEditModal = (item) => {
    setEditingEducation(item);
    setFormData({
      institution: item.institution || "",
      degree: item.degree || "",
      field: item.field || "",
      startYear: item.startYear?.toString() || "",
      endYear: item.endYear?.toString() || "",
      description: item.description || "",
      order: item.order?.toString() || "",
    });
  };

  const handleCreateEducation = async (e) => {
    e.preventDefault();

    if (!formData.institution || !formData.degree || !formData.field || !formData.startYear) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate year range (1900-2099)
    const startYearNum = parseInt(formData.startYear, 10);
    if (startYearNum < 1900 || startYearNum > 2099) {
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
      await createAdminEducation({
        institution: formData.institution,
        degree: formData.degree,
        field: formData.field,
        startYear: startYearNum,
        endYear: formData.endYear ? parseInt(formData.endYear, 10) : null,
        description: formData.description,
        order: formData.order ? parseInt(formData.order, 10) : 0,
      });

      toast.success("Education added successfully!");
      resetForm();
      setShowAddForm(false);
      fetchEducation();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add education");
    }
  };

  const handleUpdateEducation = async (e) => {
    e.preventDefault();

    if (!formData.institution || !formData.degree || !formData.field || !formData.startYear) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate year range (1900-2099)
    const startYearNum = parseInt(formData.startYear, 10);
    if (startYearNum < 1900 || startYearNum > 2099) {
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
      await updateAdminEducation(editingEducation._id, {
        institution: formData.institution,
        degree: formData.degree,
        field: formData.field,
        startYear: startYearNum,
        endYear: formData.endYear ? parseInt(formData.endYear, 10) : null,
        description: formData.description,
        order: formData.order ? parseInt(formData.order, 10) : 0,
      });

      toast.success("Education updated successfully!");
      resetForm();
      setEditingEducation(null);
      fetchEducation();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update education");
    }
  };

  const handleDeleteEducation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this education entry?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAdminEducation(id);
      toast.success("Education deleted");
      fetchEducation();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete education");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Education & Qualifications</h2>
          <p className="text-gray-500 mt-1">
            Manage your education and qualifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) resetForm();
          }}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2 transition"
        >
          {showAddForm ? (
            <>
              <X size={18} />
              Close
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Education
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreateEducation}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 mb-8"
        >
          <h3 className="text-xl font-semibold mb-6">Add New Education</h3>

          <EducationFormFields form={formData} onChange={handleFormChange} />

          <button
            type="submit"
            className="mt-7 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition"
          >
            Add Education
          </button>
        </form>
      )}

      {education.length === 0 ? (
        <div className="border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-gray-500">No education entries yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 font-semibold text-gray-400">
                  Institution
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-400">
                  Degree
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-400">
                  Field
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-400">
                  Years
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {education.map((item) => (
                <tr key={item._id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-4 px-4">{item.institution}</td>
                  <td className="py-4 px-4">{item.degree}</td>
                  <td className="py-4 px-4">{item.field}</td>
                  <td className="py-4 px-4">{item.startYear} {item.endYear ? `- ${item.endYear}` : "- Present"}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        aria-label="Edit education"
                        title="Edit education"
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-white/5 transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(item._id)}
                        aria-label="Delete education"
                        title="Delete education"
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        isOpen={editingEducation !== null}
        title="Edit Education"
        onClose={() => {
          resetForm();
          setEditingEducation(null);
        }}
      >
        <form onSubmit={handleUpdateEducation} className="space-y-5">
          <EducationFormFields form={formData} onChange={handleFormChange} />

          <div className="flex gap-3 pt-5">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition"
            >
              Save Changes
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

function EducationFormFields({ form, onChange }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Input
        label="Institution"
        name="institution"
        value={form.institution}
        onChange={onChange}
        placeholder="University of Example"
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
        label="End Year (Optional)"
        name="endYear"
        type="number"
        value={form.endYear}
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
        <label className="block text-sm text-gray-400 mb-2">
          Description (Optional)
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows="4"
          placeholder="Add any additional details..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500 transition resize-none"
        />
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
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
        className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 outline-none focus:border-blue-500 transition"
      />
    </div>
  );
}
