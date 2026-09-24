import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import API from "../services/Api";
import { FaPaperPlane, FaComments, FaExclamationTriangle, FaBriefcase, FaTag } from "react-icons/fa";

export default function ChatWindow({ conversationId, currentUser, requestInfo }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch chat history and mark messages as read
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        // GET /messages/:conversationId automatically marks unread messages as read on backend
        const res = await API.get(`/messages/${conversationId}`);
        setMessages(res.data.messages || []);
        
        // Also call markAsRead explicitly to be 100% sure
        await API.patch(`/messages/read/${conversationId}`);
      } catch (err) {
        console.error("Error fetching message history:", err);
        setError(err.response?.data?.message || "Failed to load chat history");
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchHistory();
    }
  }, [conversationId]);

  // Handle socket connections
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("join-room", conversationId);

    const handleReceiveMessage = (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
        // If receiver, mark as read
        if (currentUser && message.receiverId?._id === currentUser.id) {
          API.patch(`/messages/read/${conversationId}`).catch(() => {});
        }
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, conversationId, currentUser]);

  // Scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (socket) {
      socket.emit("send-message", {
        conversationId,
        message: inputText,
      });
      setInputText("");
    } else {
      setError("Socket not connected. Try refreshing the page.");
    }
  };

  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[420px] bg-[#0d1322] border border-[#1b253e] rounded-2xl p-6 text-center">
        <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-3"></div>
        <p className="text-slate-400 text-xs font-semibold">Loading chat history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[420px] bg-[#170e17] border border-rose-500/30 rounded-2xl p-6 text-center">
        <FaExclamationTriangle className="text-3xl text-rose-500 mb-2" />
        <p className="text-rose-400 font-bold text-sm mb-1">Error Loading Chat</p>
        <p className="text-xs text-slate-400 max-w-xs">{error}</p>
      </div>
    );
  }

  const gig = requestInfo?.gigId || {};

  return (
    <div className="flex-1 flex flex-col bg-[#0b101d] border border-[#1b253e] rounded-2xl overflow-hidden shadow-2xl h-[520px]">
      
      {/* GIG CONTEXT HEADER BANNER */}
      {gig.title && (
        <div className="bg-[#0e1628] border-b border-[#1b253e] px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <FaBriefcase className="text-purple-400 text-xs flex-shrink-0" />
            <span className="font-bold text-white truncate">{gig.title}</span>
            <span className="text-purple-400 font-semibold text-[11px] capitalize flex items-center gap-1">
              <FaTag className="text-[9px]" /> {gig.category}
            </span>
          </div>
          {gig.price && (
            <span className="text-emerald-400 font-extrabold flex-shrink-0 ml-2">
              ₹ {gig.price}
            </span>
          )}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080c16]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#12192c] border border-[#1e2a47] flex items-center justify-center text-2xl text-purple-400">
              <FaComments />
            </div>
            <p className="text-slate-200 text-sm font-bold">No messages yet.</p>
            <p className="text-xs text-slate-400 max-w-xs">
              Start the conversation regarding your service request below!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const isMe = currentUser && senderId === currentUser.id;

            return (
              <div
                key={msg._id}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[65%] p-3.5 rounded-2xl shadow-md relative ${
                    isMe
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none"
                      : "bg-[#131b2e] border border-[#1e2a47] text-slate-200 rounded-tl-none"
                  }`}
                >
                  <p className="text-xs sm:text-sm break-words whitespace-pre-wrap leading-relaxed pb-3">
                    {msg.message}
                  </p>
                  <span
                    className={`text-[9px] font-mono absolute bottom-1 right-2.5 block text-right select-none ${
                      isMe ? "text-purple-200" : "text-slate-500"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSend} className="p-3 bg-[#0d1322] flex gap-2 border-t border-[#1b253e]">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message... (Press Enter to send)"
          className="flex-1 px-4 py-2.5 bg-[#131b2e] rounded-xl border border-[#1e2a47] text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs sm:text-sm"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition disabled:opacity-50 cursor-pointer"
        >
          <span>Send</span>
          <FaPaperPlane className="text-xs" />
        </button>
      </form>
    </div>
  );
}
