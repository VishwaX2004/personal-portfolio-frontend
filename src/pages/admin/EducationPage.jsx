import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Award, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function EducationPage() {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [type, setType] = useState('education');

  const [formData, setFormData] = useState({
    // Education fields
    institution: "",
    degree: "",
    field: "",
    educationDescription: "",
    startYear: new Date().getFullYear(),
    endYear: "",
    isOngoing: false,
    
    // Certificate fields
    certificateName: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    certificateImage: "",
    certificateDescription: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchQualifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/qualifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setQualifications(data || []);
    } catch (error) {
      console.error("Error fetching:", error);
      toast.error("Failed to load qualifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    try {
      const payload = { type, ...formData };
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${API_URL}/api/admin/qualifications/${editingId}`
        : `${API_URL}/api/admin/qualifications`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save');

      toast.success(editingId ? '✏️ Updated!' : '✨ Added!');
      resetForm();
      fetchQualifications();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save qualification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`${API_URL}/api/admin/qualifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('🗑️ Deleted!');
      fetchQualifications();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setType(item.type);
    setFormData({
      institution: item.institution || "",
      degree: item.degree || "",
      field: item.field || "",
      educationDescription: item.educationDescription || "",
      startYear: item.startYear || new Date().getFullYear(),
      endYear: item.endYear || "",
      isOngoing: item.isOngoing || false,
      certificateName: item.certificateName || "",
      issuer: item.issuer || "",
      issueDate: item.issueDate ? item.issueDate.split('T')[0] : "",
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : "",
      credentialId: item.credentialId || "",
      credentialUrl: item.credentialUrl || "",
      certificateImage: item.certificateImage || "",
      certificateDescription: item.certificateDescription || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      field: "",
      educationDescription: "",
      startYear: new Date().getFullYear(),
      endYear: "",
      isOngoing: false,
      certificateName: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      certificateImage: "",
      certificateDescription: "",
    });
    setEditingId(null);
    setType('education');
    setShowForm(false);
  };

  const educations = qualifications.filter(q => q.type === 'education');
  const certificates = qualifications.filter(q => q.type === 'certificate');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">📚 Education & Certificates</h2>
          <p className="text-gray-400 mt-2">Manage your qualifications and certifications</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
          className="px-6 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-xl flex items-center gap-2 transition font-semibold"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add New'}
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 space-y-6"
          >
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Type</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setType('education');
                    setFormData(f => ({ ...f, certificateName: "", issuer: "" }));
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    type === 'education'
                      ? 'bg-[#6c63ff] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <BookOpen size={18} />
                  Education
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('certificate');
                    setFormData(f => ({ ...f, institution: "", degree: "", field: "" }));
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    type === 'certificate'
                      ? 'bg-[#6c63ff] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Award size={18} />
                  Certificate
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {type === 'education' ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Institution"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="University of Technology"
                      required
                    />
                    <Input
                      label="Degree"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="Bachelor of Science"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Field of Study"
                      value={formData.field}
                      onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                      placeholder="Computer Science"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Start Year"
                        type="number"
                        value={formData.startYear}
                        onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) })}
                        required
                      />
                      <Input
                        label="End Year"
                        type="number"
                        value={formData.endYear}
                        onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                        placeholder="Ongoing"
                      />
                    </div>
                  </div>

                  <textarea
                    value={formData.educationDescription}
                    onChange={(e) => setFormData({ ...formData, educationDescription: e.target.value })}
                    placeholder="Description (optional)"
                    rows="3"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] resize-none"
                  />
                </>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Certificate Name"
                      value={formData.certificateName}
                      onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                      placeholder="AWS Certified Solutions Architect"
                      required
                    />
                    <Input
                      label="Issuer"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                      placeholder="Amazon Web Services"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Issue Date"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    />
                    <Input
                      label="Expiry Date"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Credential ID"
                      value={formData.credentialId}
                      onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                      placeholder="ABC123XYZ789"
                    />
                    <Input
                      label="Credential URL"
                      type="url"
                      value={formData.credentialUrl}
                      onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                      placeholder="https://verify.credential.com/..."
                    />
                  </div>

                  <Input
                    label="Certificate Image URL"
                    type="url"
                    value={formData.certificateImage}
                    onChange={(e) => setFormData({ ...formData, certificateImage: e.target.value })}
                    placeholder="https://..."
                  />

                  <textarea
                    value={formData.certificateDescription}
                    onChange={(e) => setFormData({ ...formData, certificateDescription: e.target.value })}
                    placeholder="Description (optional)"
                    rows="3"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] resize-none"
                  />
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] text-white rounded-lg font-semibold transition"
                >
                  {editingId ? '💾 Update' : '✨ Add'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tree View */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Educations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <h3 className="text-xl font-bold flex items-center gap-2 text-[#6c63ff]">
            <BookOpen size={24} />
            Education ({educations.length})
          </h3>
          <div className="space-y-3">
            {educations.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">No education added yet</p>
            ) : (
              educations.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#6c63ff]/50 transition group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-white">{item.degree}</h4>
                      <p className="text-sm text-gray-400">{item.institution}</p>
                      <p className="text-xs text-gray-500">{item.field} • {item.startYear}{item.endYear ? ` - ${item.endYear}` : ' - Present'}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition text-blue-400"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {item.educationDescription && (
                    <p className="text-xs text-gray-400 mt-2">{item.educationDescription}</p>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Certificates */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <h3 className="text-xl font-bold flex items-center gap-2 text-[#6c63ff]">
            <Award size={24} />
            Certificates ({certificates.length})
          </h3>
          <div className="space-y-3">
            {certificates.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">No certificates added yet</p>
            ) : (
              certificates.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#6c63ff]/50 transition group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-white">{item.certificateName}</h4>
                      <p className="text-sm text-gray-400">{item.issuer}</p>
                      <p className="text-xs text-gray-500">
                        {item.issueDate ? new Date(item.issueDate).toLocaleDateString() : 'N/A'}
                        {item.expiryDate && ` - ${new Date(item.expiryDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition text-blue-400"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {item.certificateDescription && (
                    <p className="text-xs text-gray-400 mt-2">{item.certificateDescription}</p>
                  )}
                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#6c63ff] hover:underline mt-2 inline-block"
                    >
                      View Credential →
                    </a>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c63ff] transition text-sm"
      />
    </div>
  );
}
