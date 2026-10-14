import { useEffect, useState } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { getMessages, deleteMessage } from "../../services/api";
import { formatDate } from "../../utils/adminHelpers";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH MESSAGES
  // =========================================================

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

  // =========================================================
  // DELETE MESSAGE
  // =========================================================

  const handleDeleteMessage = async (id) => {
    const confirmDelete = window.confirm("Delete this message?");

    if (!confirmDelete) return;

    try {
      await deleteMessage(id);
      toast.success("Message deleted");
      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
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

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Contact Messages</h2>

        <p className="text-gray-500 mt-1">
          Messages submitted through your portfolio.
        </p>
      </div>

      {/* Messages */}

      {messages.length === 0 ? (
        <div className="border border-white/10 rounded-2xl p-12 text-center">
          <MessageSquare size={40} className="mx-auto text-gray-700" />

          <p className="text-gray-500 mt-4">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold">{message.name}</h3>

                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                      {message.email}
                    </span>
                  </div>

                  <h4 className="text-lg font-medium mt-4">
                    {message.subject}
                  </h4>

                  <p className="text-gray-400 mt-3 leading-relaxed">
                    {message.message}
                  </p>

                  <p className="text-xs text-gray-600 mt-5">
                    {formatDate(message.createdAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteMessage(message._id)}
                  className="self-start p-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  aria-label="Delete message"
                  title="Delete message"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
