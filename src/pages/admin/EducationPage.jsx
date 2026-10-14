import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../services/api";
import AdminModal from "../../components/admin/AdminModal";
import { validateEducationForm, parseErrorMessage } from "../../utils/adminHelpers";

export default function EducationPage() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    school: "",
    year: "",
    grade: "",
    description: "",
  });

  // =========================================================
  // FETCH EDUCATION
  // =========================================================

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const data = await getEducation();
      setEducation(data || []);
    } catch (error) {
      console.error("Error fetching education:", error);
      // Don't show error toast if endpoint doesn't exist yet
      if (error.response?.status !== 404) {
        toast.error("Failed to load education data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  // =========================================================
  // HANDLE FORM INPUT
  // =========================================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
      title: "",
      school: "",
      year: "",
      grade: "",
      description: "",
    });
    setEditingEducation(null);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (item) => {
    setEditingEducation(item);
    setFormData({
      title: item.title || "",
      school: item.school || "",
      year: item.year?.toString() || "",
      grade: item.grade || "",
      description: item.description || "",
    });
  };

  // =========================================================
  // CREATE EDUCATION
  // =========================================================

  const handleCreateEducation = async (e) => {
    e.preventDefault();

    const errors = validateEducationForm(formData);

    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      await createEducation({
        title: formData.title,
        school: formData.school,
        year: parseInt(formData.year, 10),
        grade: formData.grade,
        description: formData.description,
      });

      toast.success("Education added successfully!");
      resetForm();
      setShowAddForm(false);
      fetchEducation();
    } catch (error) {
      console.error(error);
      toast.error(parseErrorMessage(error));
    }
  };

  // =========================================================
  // UPDATE EDUCATION
  // =========================================================

  const handleUpdateEducation = async (e) => {
    e.preventDefault();

    const errors = validateEducationForm(formData);

    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      await updateEducation(editingEducation._id, {
        title: formData.title,
        school: formData.school,
        year: parseInt(formData.year, 10),
        grade: formData.grade,
        description: formData.description,
      });

      toast.success("Education updated successfully!");
      resetForm();
      setEditingEducation(null);
      fetchEducation();
    } catch (error) {
      console.error(error);
      toast.error(parseErrorMessage(error));
    }
  };

  // =========================================================
  // DELETE EDUCATION
  // =========================================================

  const handleDeleteEducation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this education entry?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEducation(id);
      toast.success("Education deleted");
      fetchEducation();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete education");
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}

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

      {/* Add Form */}

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

      {/* Education List */}

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
                  Degree
                </th>

                <th className="text-left py-4 px-4 font-semibold text-gray-400">
                  Institution
                </th>

                <th className="text-left py-4 px-4 font-semibold text-gray-400">
                  Year
                </th>

                <th className="text-left py-4 px-4 font-semibold text-gray-400">
                  Grade
                </th>

                <th className="text-left py-4 px-4 font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {education.map((item) => (
                <tr key={item._id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-4 px-4">{item.title}</td>

                  <td className="py-4 px-4">{item.school}</td>

                  <td className="py-4 px-4">{item.year}</td>

                  <td className="py-4 px-4">{item.grade || "-"}</td>

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
                        onClick={() =>
                          handleDeleteEducation(item._id)
                        }
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

      {/* Edit Modal */}

      <AdminModal
        isOpen={editingEducation !== null}
        title="Edit Education"
        onClose={() => {
          setEditingEducation(null);
          resetForm();
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
                setEditingEducation(null);
                resetForm();
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

// =============================================================
// EDUCATION FORM FIELDS
// =============================================================

function EducationFormFields({ form, onChange }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Degree/Title */}

      <Input
        label="Degree/Title"
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="Bachelor of Science"
        required
      />

      {/* Institution */}

      <Input
        label="Institution/School"
        name="school"
        value={form.school}
        onChange={onChange}
        placeholder="University of Example"
        required
      />

      {/* Year */}

      <Input
        label="Year"
        name="year"
        type="number"
        value={form.year}
        onChange={onChange}
        placeholder="2023"
        required
      />

      {/* Grade */}

      <Input
        label="Grade/GPA (Optional)"
        name="grade"
        value={form.grade}
        onChange={onChange}
        placeholder="3.8 / 4.0"
      />

      {/* Description */}

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

// =============================================================
// INPUT COMPONENT
// =============================================================

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
