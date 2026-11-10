import { useEffect, useState } from "react";
import { Trash2, Mail, Calendar, User, MessageCircle, Check } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { getMessages, deleteMessage, markAsRead } from "../../services/adminService";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      // Sort with unread first, then by newest date
      const sorted = (data || []).sort((a, b) => {
        if (a.isRead === b.isRead) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isRead ? 1 : -1;
      });
      setMessages(sorted);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const updatedMessage = await markAsRead(id);
      setMessages(messages.map(m => 
        m._id === id ? { ...m, isRead: true } : m
      ).sort((a, b) => {
        if (a.isRead === b.isRead) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isRead ? 1 : -1;
      }));
      if (selectedMessage?._id === id) {
        setSelectedMessage(updatedMessage);
      }
      toast.success("Marked as read");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark as read");
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await deleteMessage(id);
      toast.success("Message deleted");
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      setDeleteConfirmId(null);
      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

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
          <h2 className="text-3xl font-bold">Messages</h2>
          <p className="text-gray-400 mt-2">
            View and manage contact form messages.
          </p>
        </div>

        <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl">
          <p className="text-sm text-gray-400">
            Total Messages: <span className="font-semibold text-white">{messages.length}</span>
            {unreadCount > 0 && (
              <span className="ml-3 inline-block px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full flex flex-col items-center justify-center py-16 bg-white/[0.03] border border-white/10 rounded-2xl"
        >
          <MessageCircle size={48} className="text-gray-700 mb-3" />
          <p className="text-gray-500 text-center">No messages yet.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {messages.map((message, index) => (
                <motion.button
                  key={message._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedMessage(message)}
                  className={`w-full text-left p-4 rounded-xl border transition relative group ${
                    selectedMessage?._id === message._id
                      ? "bg-blue-600/20 border-blue-500/50"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!message.isRead && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${!message.isRead ? 'font-bold' : ''}`}>
                        {message.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{message.email}</p>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8"
              >
                {/* Header */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{selectedMessage.name}</h3>
                        {!selectedMessage.isRead && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                            NEW
                          </span>
                        )}
                        {selectedMessage.isRead && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold">
                            READ
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-3 text-gray-400">
                          <Mail size={16} />
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            {selectedMessage.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                          <Calendar size={16} />
                          <span>{formatDate(selectedMessage.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(selectedMessage._id)}
                      className="p-3 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition flex-shrink-0"
                      aria-label="Delete message"
                      title="Delete message"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Subject if available */}
                {selectedMessage.subject && (
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Subject
                    </h4>
                    <p className="text-gray-300">{selectedMessage.subject}</p>
                  </div>
                )}

                {/* Message Content */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">
                    Message
                  </h4>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
                  {!selectedMessage.isRead && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMarkAsRead(selectedMessage._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
                    >
                      <Check size={16} />
                      Mark as Read
                    </motion.button>
                  )}
                  
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`mailto:${selectedMessage.email}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition"
                  >
                    <Mail size={16} />
                    Reply via Email
                  </motion.a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full bg-white/[0.03] border border-white/10 rounded-2xl p-8"
              >
                <p className="text-gray-500 text-center">
                  Select a message to view details
                </p>
              </motion.div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirmId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setDeleteConfirmId(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#050505] border border-white/10 rounded-2xl p-6 max-w-sm"
              >
                <h3 className="text-lg font-bold mb-2">Delete Message?</h3>
                <p className="text-gray-400 mb-6">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteMessage(deleteConfirmId)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}
