import { useEffect, useState } from "react";
import { GripVertical, Save, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  getAdminProjects,
  getAdminQualifications,
  reorderProjects,
  reorderQualifications,
  getDisplaySettings,
  updateDisplaySettings,
} from "../../services/adminService";

export default function OrderManagementPage() {
  const [qualifications, setQualifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [displaySettings, setDisplaySettings] = useState({
    sectionOrder: ["education", "certificates", "projects"],
    showEducation: true,
    showCertificates: true,
    showProjects: true,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sections");
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      const [qualData, projData, settingsData] = await Promise.all([
        getAdminQualifications(),
        getAdminProjects(),
        getDisplaySettings(),
      ]);

      setQualifications(qualData || []);
      setProjects(projData || []);
      setDisplaySettings(settingsData || {
        sectionOrder: ["education", "certificates", "projects"],
        showEducation: true,
        showCertificates: true,
        showProjects: true,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load ordering data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================================
  // DRAG AND DROP HANDLERS
  // =========================================================

  const handleDragStart = (e, item, type) => {
    setDraggedItem(item);
    setDraggedFrom(type);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropReorder = (e, targetItem, type) => {
    e.preventDefault();
    
    if (!draggedItem || draggedFrom !== type) return;

    if (type === "qualifications") {
      const sourceIndex = qualifications.findIndex(q => q._id === draggedItem._id);
      const targetIndex = qualifications.findIndex(q => q._id === targetItem._id);
      
      if (sourceIndex !== targetIndex) {
        const newList = [...qualifications];
        const [removed] = newList.splice(sourceIndex, 1);
        newList.splice(targetIndex, 0, removed);
        setQualifications(newList);
      }
    } else if (type === "projects") {
      const sourceIndex = projects.findIndex(p => p._id === draggedItem._id);
      const targetIndex = projects.findIndex(p => p._id === targetItem._id);
      
      if (sourceIndex !== targetIndex) {
        const newList = [...projects];
        const [removed] = newList.splice(sourceIndex, 1);
        newList.splice(targetIndex, 0, removed);
        setProjects(newList);
      }
    }

    setDraggedItem(null);
    setDraggedFrom(null);
  };

  // =========================================================
  // ORDER INPUT CHANGES
  // =========================================================

  const handleOrderChange = (id, newOrder, type) => {
    const orderNum = parseInt(newOrder) || 0;
    
    if (type === "qualifications") {
      setQualifications(
        qualifications.map(q => q._id === id ? { ...q, globalOrder: orderNum } : q)
      );
    } else if (type === "projects") {
      setProjects(
        projects.map(p => p._id === id ? { ...p, globalOrder: orderNum } : p)
      );
    }
  };

  // =========================================================
  // SAVE REORDERING
  // =========================================================

  const saveReordering = async () => {
    try {
      toast.loading("Saving order...");
      
      // Save qualifications order
      if (qualifications.length > 0) {
        await reorderQualifications(
          qualifications.map((q, idx) => ({
            id: q._id,
            globalOrder: idx * 10,
          }))
        );
      }

      // Save projects order
      if (projects.length > 0) {
        await reorderProjects(
          projects.map((p, idx) => ({
            id: p._id,
            globalOrder: idx * 10,
          }))
        );
      }

      // Save display settings
      await updateDisplaySettings(displaySettings);

      toast.dismiss();
      toast.success("Ordering saved successfully!");
      fetchData();
    } catch (error) {
      console.error("Error saving order:", error);
      toast.dismiss();
      toast.error("Failed to save ordering");
    }
  };

  // =========================================================
  // SECTION ORDER HANDLER
  // =========================================================

  const handleSectionOrderChange = (newOrder) => {
    setDisplaySettings({
      ...displaySettings,
      sectionOrder: newOrder,
    });
  };

  const toggleSectionVisibility = (section) => {
    setDisplaySettings({
      ...displaySettings,
      [section]: !displaySettings[section],
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

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
      <div>
        <h2 className="text-2xl font-bold mb-2">Content Ordering</h2>
        <p className="text-gray-500">Control how your content displays on the public portfolio</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        {["sections", "qualifications", "projects"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition-all border-b-2 capitalize ${
              activeTab === tab
                ? "border-[#6c63ff] text-[#6c63ff]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab === "sections" ? "Display Sections" : 
             tab === "qualifications" ? `Education (${qualifications.length})` :
             `Projects (${projects.length})`}
          </button>
        ))}
      </div>

      {/* Section Order Tab */}
      {activeTab === "sections" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
        >
          <h3 className="text-xl font-semibold">Which sections appear first?</h3>
          
          <p className="text-sm text-gray-400">
            Drag to reorder which sections display first on your portfolio timeline
          </p>

          <div className="space-y-2">
            {["education", "certificates", "projects"].map((section) => (
              <div
                key={section}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("section", section);
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedSection = e.dataTransfer.getData("section");
                  const fromIdx = displaySettings.sectionOrder.indexOf(draggedSection);
                  const toIdx = displaySettings.sectionOrder.indexOf(section);
                  
                  if (fromIdx !== toIdx) {
                    const newOrder = [...displaySettings.sectionOrder];
                    [newOrder[fromIdx], newOrder[toIdx]] = [newOrder[toIdx], newOrder[fromIdx]];
                    handleSectionOrderChange(newOrder);
                  }
                }}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-move transition"
              >
                <GripVertical size={18} className="text-gray-600 flex-shrink-0" />
                
                <div className="flex-1">
                  <p className="font-medium capitalize">{section}</p>
                  <p className="text-xs text-gray-500">
                    Position: {displaySettings.sectionOrder.indexOf(section) + 1}
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={displaySettings[`show${section.charAt(0).toUpperCase() + section.slice(1)}`]}
                    onChange={() => toggleSectionVisibility(`show${section.charAt(0).toUpperCase() + section.slice(1)}`)}
                    className="w-4 h-4 accent-[#6c63ff]"
                  />
                  <span className="text-sm text-gray-400">Show</span>
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Qualifications Tab */}
      {activeTab === "qualifications" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
        >
          <h3 className="text-xl font-semibold">
            Education & Certificates ({qualifications.length})
          </h3>

          {qualifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No education or certificates to order</p>
          ) : (
            <div className="space-y-2">
              {qualifications.map((item, index) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, "qualifications")}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropReorder(e, item, "qualifications")}
                  className={`flex items-center gap-4 p-4 bg-white/5 border rounded-lg transition ${
                    draggedItem?._id === item._id
                      ? "border-[#6c63ff] bg-[#6c63ff]/10 opacity-75"
                      : "border-white/10 hover:bg-white/10"
                  } cursor-move`}
                >
                  <GripVertical size={18} className="text-gray-600 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.certificateName || item.degree}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.type === "education" ? "📚 Education" : "🏆 Certificate"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">Pos:</span>
                    <input
                      type="number"
                      value={item.globalOrder || index * 10}
                      onChange={(e) => handleOrderChange(item._id, e.target.value, "qualifications")}
                      className="w-16 px-2 py-1 bg-black/40 border border-white/10 rounded text-sm text-center focus:border-[#6c63ff] outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
        >
          <h3 className="text-xl font-semibold">Projects ({projects.length})</h3>

          {projects.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No projects to order</p>
          ) : (
            <div className="space-y-2">
              {projects.map((item, index) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, "projects")}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropReorder(e, item, "projects")}
                  className={`flex items-center gap-4 p-4 bg-white/5 border rounded-lg transition ${
                    draggedItem?._id === item._id
                      ? "border-[#6c63ff] bg-[#6c63ff]/10 opacity-75"
                      : "border-white/10 hover:bg-white/10"
                  } cursor-move`}
                >
                  <GripVertical size={18} className="text-gray-600 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">🔧 {item.status || "draft"}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">Pos:</span>
                    <input
                      type="number"
                      value={item.globalOrder || index * 10}
                      onChange={(e) => handleOrderChange(item._id, e.target.value, "projects")}
                      className="w-16 px-2 py-1 bg-black/40 border border-white/10 rounded text-sm text-center focus:border-[#6c63ff] outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Info Alert */}
      <div className="flex gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <AlertCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">
          💡 Drag items to reorder them. Lower order numbers appear first on your portfolio. Click Save when done.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={saveReordering}
          className="flex-1 px-6 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-xl font-medium transition flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save All Changes
        </button>
      </div>
    </div>
  );
}
