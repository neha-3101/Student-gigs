import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaComments, FaCheckCircle, FaClock, FaTimes, FaBriefcase } from "react-icons/fa";

export default function NotificationInbox({ conversations = [], totalUnreadCount = 0, onClose, onSelectConversation }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hr ago`;
      if (diffDays === 1) return "Yesterday";
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111726] border border-[#1e2942] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 bg-[#0d1322] border-b border-[#1b253e]">
        <div className="flex items-center gap-2">
          <FaComments className="text-purple-400 text-sm" />
          <h3 className="text-sm font-bold text-white">Notifications & Messages</h3>
          {totalUnreadCount > 0 && (
            <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {totalUnreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs p-1 transition"
          aria-label="Close inbox"
        >
          <FaTimes />
        </button>
      </div>

      {/* CONVERSATION / NOTIFICATION LIST */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#1b253e]">
        {conversations.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#162038] flex items-center justify-center mx-auto text-slate-500 text-xl">
              🔔
            </div>
            <p className="text-xs font-bold text-white">No notifications or messages</p>
            <p className="text-[11px] text-slate-400">
              When you send or receive gig requests, conversations will appear here.
            </p>
          </div>
        ) : (
          conversations.map((item) => {
            const isUnread = item.unreadCount > 0;
            return (
              <div
                key={item.requestId}
                onClick={() => {
                  if (onSelectConversation) {
                    onSelectConversation(item.requestId);
                  } else {
                    navigate(`/chat/${item.requestId}`);
                    onClose();
                  }
                }}
                className={`p-3.5 flex gap-3 items-start cursor-pointer transition-colors ${
                  isUnread
                    ? "bg-[#16213b]/80 hover:bg-[#1a294a]"
                    : "hover:bg-[#161f36]"
                }`}
              >
                {/* AVATAR */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#1e2a47] border border-[#2a3a5f] overflow-hidden flex items-center justify-center">
                    {item.otherUser?.profilePicture ? (
                      <img
                        src={item.otherUser.profilePicture}
                        alt={item.otherUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-slate-400 text-xs" />
                    )}
                  </div>
                  {isUnread && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-[#111726]"></span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs font-bold truncate ${isUnread ? "text-white" : "text-slate-200"}`}>
                      {item.otherUser?.name || "User"}
                    </h4>
                    <span className="text-[9px] text-slate-400 flex-shrink-0">
                      {formatTimestamp(item.updatedAt)}
                    </span>
                  </div>

                  {/* GIG CONTEXT TAG */}
                  {item.gig?.title && (
                    <div className="flex items-center gap-1 text-[10px] text-purple-400 font-medium truncate">
                      <FaBriefcase className="text-[9px]" />
                      <span className="truncate">{item.gig.title}</span>
                      {item.gig.price && (
                        <span className="text-emerald-400 font-bold ml-1">₹{item.gig.price}</span>
                      )}
                    </div>
                  )}

                  {/* LATEST MESSAGE PREVIEW */}
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[11px] truncate ${isUnread ? "text-purple-200 font-semibold" : "text-slate-400"}`}>
                      {item.latestMessageSender ? `${item.latestMessageSender}: ` : ""}
                      {item.latestMessage}
                    </p>

                    {item.unreadCount > 0 && (
                      <span className="bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        {item.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER ACTION */}
      <div className="p-3 bg-[#0d1322] border-t border-[#1b253e] text-center">
        <button
          onClick={() => {
            navigate("/service-requests");
            onClose();
          }}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
        >
          View All Requests & Services →
        </button>
      </div>
    </div>
  );
}
