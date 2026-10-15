import { useEffect, useState } from "react";
import { Trash2, Mail, Calendar, User, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getMessages, deleteMessage } from "../../services/adminService";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data || []);
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

  const handleDeleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      await deleteMessage(id);
      toast.success("Message deleted");
      setSelectedMessage(null);
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
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-gray-500 mt-1">
            View and manage contact form messages.
          </p>
        </div>

        <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl">
          <p className="text-sm text-gray-400">
            Total Messages: <span className="font-semibold text-white">{messages.length}</span>
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white/[0.03] border border-white/10 rounded-2xl">
          <MessageCircle size={48} className="text-gray-700 mb-3" />
          <p className="text-gray-500 text-center">No messages yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {messages.map((message) => (
                <button
                  key={message._id}
                  onClick={() => setSelectedMessage(message)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selectedMessage?._id === message._id
                      ? "bg-blue-600/20 border-blue-500/50"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
                  }`}
                >
                  <p className="font-medium text-sm truncate">{message.name}</p>
                  <p className="text-xs text-gray-500 truncate">{message.email}</p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {message.message}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
                {/* Header */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedMessage.name}</h3>
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
                        {selectedMessage.phone && (
                          <div className="flex items-center gap-3 text-gray-400">
                            <User size={16} />
                            <span>{selectedMessage.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-gray-400">
                          <Calendar size={16} />
                          <span>{formatDate(selectedMessage.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteMessage(selectedMessage._id)
                      }
                      className="p-3 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      aria-label="Delete message"
                      title="Delete message"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">
                    Message
                  </h4>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Subject if available */}
                {selectedMessage.subject && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Subject
                    </h4>
                    <p className="text-gray-300">{selectedMessage.subject}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                <p className="text-gray-500 text-center">
                  Select a message to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
