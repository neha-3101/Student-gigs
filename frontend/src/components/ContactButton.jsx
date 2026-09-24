import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/Api";
import { FaCheckCircle, FaExclamationCircle, FaPaperPlane, FaComments, FaPhoneAlt, FaUserCheck, FaTimesCircle, FaClock } from "react-icons/fa";

export default function ContactButton({ gigId, gigOwnerEmail, gigPhone }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [request, setRequest] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [isHoveredPending, setIsHoveredPending] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        // Get current user info to check ownership
        const meRes = await API.get("/auth/me");
        setCurrentUser(meRes.data.user);

        if (meRes.data.user.email === gigOwnerEmail) {
          setLoading(false);
          return; // Own gig, no need to fetch request status
        }

        const statusRes = await API.get(`/service-requests/gig/${gigId}/status`);
        setRequest(statusRes.data.request);
      } catch (err) {
        console.error("Error fetching request status:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (gigId) {
      fetchStatus();
    }
  }, [gigId, gigOwnerEmail]);

  // Send request
  const handleSendRequest = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      const res = await API.post("/service-requests", { gigId });
      setRequest(res.data.serviceRequest);
    } catch (err) {
      console.error("Error creating service request:", err);
      setError(err.response?.data?.message || "Failed to send request");
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel request toggle (Pending -> Cancelled)
  const handleCancelRequest = async () => {
    if (!request || request.status !== "pending") return;

    try {
      setActionLoading(true);
      setError("");
      const res = await API.patch(`/service-requests/${request._id}/cancel`);
      setRequest(res.data.request);
    } catch (err) {
      console.error("Error cancelling request:", err);
      // Fallback try by gigId
      try {
        const fallbackRes = await API.patch(`/service-requests/gig/${gigId}/cancel`);
        setRequest(fallbackRes.data.request);
      } catch (fallbackErr) {
        setError(err.response?.data?.message || "Failed to cancel request");
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <span className="text-slate-400 text-xs animate-pulse inline-block">
        Checking status...
      </span>
    );
  }

  // If it is the current user's own gig
  if (currentUser && currentUser.email === gigOwnerEmail) {
    return (
      <span className="bg-[#1a253e] text-purple-300 border border-purple-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
        <FaUserCheck className="text-xs" /> Your Gig
      </span>
    );
  }

  // Handle NO REQUEST or CANCELLED status -> [ + Request Gig ]
  if (!request || request.status === "cancelled") {
    return (
      <div className="flex flex-col items-start gap-1">
        <button
          onClick={handleSendRequest}
          disabled={actionLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
        >
          <FaPaperPlane className="text-[10px]" />
          {actionLoading ? "Sending..." : "Request Gig"}
        </button>
        {error && <p className="text-rose-400 text-[11px]">{error}</p>}
      </div>
    );
  }

  // Handle PENDING status -> [ Request Pending ] (Hover: Cancel Request)
  if (request.status === "pending") {
    return (
      <div className="flex flex-col items-start gap-1">
        <button
          onClick={handleCancelRequest}
          disabled={actionLoading}
          onMouseEnter={() => setIsHoveredPending(true)}
          onMouseLeave={() => setIsHoveredPending(false)}
          title="Click to cancel pending request"
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
            isHoveredPending
              ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}
        >
          {actionLoading ? (
            "Cancelling..."
          ) : isHoveredPending ? (
            <>
              <FaTimesCircle className="text-xs text-rose-400" />
              <span>Cancel Request</span>
            </>
          ) : (
            <>
              <FaClock className="text-xs text-amber-400 animate-pulse" />
              <span>Request Pending</span>
            </>
          )}
        </button>
        {error && <p className="text-rose-400 text-[11px]">{error}</p>}
      </div>
    );
  }

  // Handle REJECTED status -> [ Request Rejected ] + [ Send Request Again ]
  if (request.status === "rejected") {
    return (
      <div className="flex flex-col items-start gap-2">
        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <FaExclamationCircle className="text-xs" /> Request Rejected
        </span>
        <button
          onClick={handleSendRequest}
          disabled={actionLoading}
          className="bg-[#1b2742] hover:bg-[#233357] text-slate-200 border border-[#2e3e66] px-3 py-1 rounded-xl text-[11px] font-semibold transition disabled:opacity-50 cursor-pointer"
        >
          {actionLoading ? "Sending..." : "Send Request Again"}
        </button>
        {error && <p className="text-rose-400 text-[11px]">{error}</p>}
      </div>
    );
  }

  // Handle ACCEPTED or COMPLETED status -> [ Connected ] + Chat + Call
  if (request.status === "accepted" || request.status === "completed") {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <FaCheckCircle className="text-xs text-emerald-400" /> Connected
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => navigate(`/chat/${request._id}`)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-sm cursor-pointer"
          >
            <FaComments className="text-[10px]" /> Chat
          </button>
          <a
            href={`tel:${gigPhone || request.gigId?.phone}`}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-sm"
          >
            <FaPhoneAlt className="text-[10px]" /> Call
          </a>
        </div>
      </div>
    );
  }

  return null;
}
