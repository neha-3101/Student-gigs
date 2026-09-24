import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/Api";
import ServiceStatus from "../components/ServiceStatus";
import { FaArrowLeft, FaInbox, FaComments, FaCheckCircle, FaTimesCircle, FaUser, FaSave } from "react-icons/fa";

const PROGRESS_FLOWS = {
  Teaching: ["connected", "scheduled", "in_progress", "completed"],
  Coding: ["connected", "work_started", "in_progress", "ready_for_review", "completed"],
  Design: ["connected", "work_started", "in_progress", "ready_for_review", "completed"],
};

const DEFAULT_FLOW = ["connected", "in_progress", "completed"];

const formatStatusText = (status) => {
  return status
    ?.split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function ServiceRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const [progressForms, setProgressForms] = useState({});

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const fetchReceivedRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/service-requests/received");
      setRequests(res.data.requests || []);
      
      const forms = {};
      res.data.requests.forEach((req) => {
        if (req.status === "accepted") {
          forms[req._id] = {
            progressStatus: req.progressStatus || "connected",
            progressMessage: req.progressMessage || "",
            agreedTime: req.agreedTime || "",
          };
        }
      });
      setProgressForms(forms);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      setActionLoading(id);
      setError("");
      await API.patch(`/service-requests/${id}/accept`);
      
      setRequests((prev) =>
        prev.map((r) => {
          if (r._id === id) {
            const updated = { ...r, status: "accepted", progressStatus: "connected" };
            setProgressForms((prevForms) => ({
              ...prevForms,
              [id]: { progressStatus: "connected", progressMessage: "", agreedTime: "" },
            }));
            return updated;
          }
          return r;
        })
      );
    } catch (err) {
      console.error("Error accepting request:", err);
      setError(err.response?.data?.message || "Failed to accept request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      setError("");
      await API.patch(`/service-requests/${id}/reject`);
      
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r))
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError(err.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleProgressChange = (id, field, value) => {
    setProgressForms((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdateProgress = async (id, category) => {
    const formData = progressForms[id];
    if (!formData) return;

    try {
      setActionLoading(id);
      setError("");
      const res = await API.patch(`/service-requests/${id}/progress`, formData);
      
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...res.data.request } : r))
      );
      
      alert("Progress updated successfully!");
    } catch (err) {
      console.error("Error updating progress:", err);
      setError(err.response?.data?.message || "Failed to update progress");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pending</span>;
      case "accepted":
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Active</span>;
      case "rejected":
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Rejected</span>;
      case "completed":
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Completed</span>;
      case "cancelled":
        return <span className="bg-slate-500/10 text-slate-400 border border-slate-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="bg-slate-500/10 text-slate-400 border border-slate-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back and Header */}
        <div className="flex flex-col gap-2 mb-8 pb-6 border-b border-[#1b253e]">
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-purple-400 text-xs font-semibold flex items-center gap-1.5 self-start transition"
          >
            <FaArrowLeft className="text-[10px]" /> Back to Home
          </button>
          
          <div className="text-center sm:text-left mt-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Incoming Service <span className="text-gradient">Requests</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage requests for gigs you own and update service status 🚀
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs sm:text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-[#0e1526] border border-[#1e2a47] p-12 rounded-3xl text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 bg-[#16213b] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-purple-400">
              <FaInbox />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Requests Received</h3>
            <p className="text-slate-400 text-xs mb-6">
              Nobody has requested your gigs yet. Try creating more high-demand services!
            </p>
            <button
              onClick={() => navigate("/my-gigs")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-purple-500/20"
            >
              Manage My Gigs
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {requests.map((request) => {
              const gig = request.gigId || {};
              const requester = request.requesterId || {};
              const isPending = request.status === "pending";
              const isConnected = request.status === "accepted" || request.status === "completed";
              const allowedStatuses = PROGRESS_FLOWS[gig.category] || DEFAULT_FLOW;
              const form = progressForms[request._id] || {
                progressStatus: request.progressStatus || "connected",
                progressMessage: request.progressMessage || "",
                agreedTime: request.agreedTime || "",
              };

              return (
                <div key={request._id} className="bg-[#12192c] border border-[#1e2a47] rounded-3xl p-6 shadow-xl flex flex-col gap-6">
                  
                  {/* Requester & Gig Info Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1a243d] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#1b253e] border border-[#273656] overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {requester.profilePicture ? (
                          <img
                            src={requester.profilePicture}
                            alt={requester.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-slate-400 text-lg" />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Requester Client</span>
                        <h4 className="text-sm font-bold text-white">{requester.name || "Unknown"}</h4>
                        <p className="text-xs text-purple-400">{requester.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Target Gig</span>
                      <h5 className="font-bold text-sm text-slate-200">{gig.title || "Deleted Gig"}</h5>
                      <span className="text-xs text-purple-400 font-semibold capitalize">{gig.category}</span>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-1">
                      <div>{getStatusBadge(request.status)}</div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex justify-between items-center bg-[#0c1220] px-4 py-2.5 rounded-2xl border border-[#1e2a47] text-xs max-w-xs">
                        <span className="text-slate-400">Service Price:</span>
                        <span className="font-extrabold text-emerald-400 text-sm">₹ {gig.price || 0}</span>
                      </div>

                      {/* Display Progress timeline if accepted/completed */}
                      {isConnected && (
                        <ServiceStatus
                          category={gig.category}
                          currentStatus={request.progressStatus}
                          agreedTime={request.agreedTime}
                          progressMessage={request.progressMessage}
                        />
                      )}
                    </div>

                    {/* Pending Buttons */}
                    {isPending && (
                      <div className="flex gap-3 w-full md:w-auto self-end">
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={actionLoading === request._id}
                          className="flex-1 md:flex-initial bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 px-5 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FaTimesCircle className="text-xs" />
                          {actionLoading === request._id ? "Rejecting..." : "Reject"}
                        </button>
                        <button
                          onClick={() => handleAccept(request._id)}
                          disabled={actionLoading === request._id}
                          className="flex-1 md:flex-initial bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FaCheckCircle className="text-xs" />
                          {actionLoading === request._id ? "Accepting..." : "Accept Request"}
                        </button>
                      </div>
                    )}

                    {/* Action buttons if connected */}
                    {isConnected && (
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => navigate(`/chat/${request._id}`)}
                          className="flex-1 md:flex-initial bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <FaComments className="text-xs" /> Chat
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Progress Update Form (For accepted status) */}
                  {isConnected && request.status === "accepted" && (
                    <div className="border-t border-[#1a243d] pt-4 mt-2">
                      <h5 className="font-bold text-xs text-purple-400 uppercase tracking-wider mb-3">
                        Update Progress Information
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] text-slate-400 font-semibold block mb-1">Timeline Step</label>
                          <select
                            value={form.progressStatus}
                            onChange={(e) => handleProgressChange(request._id, "progressStatus", e.target.value)}
                            className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e2a47] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                          >
                            {allowedStatuses.map((status) => (
                              <option key={status} value={status}>
                                {formatStatusText(status)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 font-semibold block mb-1">Agreed Schedule (e.g. 5:00 PM)</label>
                          <input
                            type="text"
                            value={form.agreedTime}
                            onChange={(e) => handleProgressChange(request._id, "agreedTime", e.target.value)}
                            placeholder="e.g. 5:00 PM Tomorrow"
                            className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e2a47] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 font-semibold block mb-1">Progress Message</label>
                          <input
                            type="text"
                            value={form.progressMessage}
                            onChange={(e) => handleProgressChange(request._id, "progressMessage", e.target.value)}
                            placeholder="e.g. Work is in progress..."
                            className="w-full px-3 py-2 bg-[#0c1220] border border-[#1e2a47] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpdateProgress(request._id, gig.category)}
                        disabled={actionLoading === request._id}
                        className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 hover:opacity-95 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <FaSave className="text-xs" />
                        {actionLoading === request._id ? "Saving..." : "Save Progress Info"}
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
