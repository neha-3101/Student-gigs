import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/Api";
import ServiceStatus from "../components/ServiceStatus";
import { FaArrowLeft, FaConciergeBell, FaComments, FaPhoneAlt, FaUser } from "react-icons/fa";

export default function MyServices() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/service-requests/my");
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
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
              My Purchased <span className="text-gradient">Services</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Track requests and communicate with service providers 🚀
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
              <FaConciergeBell />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Services Requested</h3>
            <p className="text-slate-400 text-xs mb-6">
              You haven't requested any services from other students yet. Explore Home to find Gigs!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-purple-500/20"
            >
              Browse Gigs
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {requests.map((request) => {
              const gig = request.gigId || {};
              const owner = request.gigOwnerId || {};
              const isConnected = request.status === "accepted" || request.status === "completed";

              return (
                <div 
                  key={request._id} 
                  className="bg-[#12192c] border border-[#1e2a47] rounded-3xl p-6 shadow-xl flex flex-col gap-6"
                >
                  
                  {/* Gig Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#1a243d] pb-4">
                      <div>
                        <h4 className="font-extrabold text-lg text-white">{gig.title || "Deleted Gig"}</h4>
                        <span className="text-purple-400 font-semibold text-xs capitalize block mt-0.5">{gig.category}</span>
                      </div>
                      <div>{getStatusBadge(request.status)}</div>
                    </div>

                    <div className="flex items-center justify-between bg-[#0c1220] p-3.5 rounded-2xl border border-[#1e2a47]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1b253e] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#263554]">
                          {owner.profilePicture ? (
                            <img
                              src={owner.profilePicture}
                              alt={owner.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUser className="text-slate-500 text-sm" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Provider</p>
                          <p className="text-xs font-bold text-white">{owner.name || "Unknown Owner"}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Agreed Price</span>
                        <span className="font-extrabold text-emerald-400 text-sm">₹ {gig.price || 0}</span>
                      </div>
                    </div>

                    {/* Progress tracking display if accepted/completed */}
                    {isConnected && (
                      <ServiceStatus
                        category={gig.category}
                        currentStatus={request.progressStatus}
                        agreedTime={request.agreedTime}
                        progressMessage={request.progressMessage}
                      />
                    )}
                  </div>

                  {/* Actions for connected */}
                  {isConnected && (
                    <div className="flex gap-3 border-t border-[#1a243d] pt-4">
                      <button
                        onClick={() => navigate(`/chat/${request._id}`)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white px-5 py-2.5 rounded-xl font-bold text-xs text-center shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <FaComments className="text-xs" /> Chat with Provider
                      </button>
                      <a
                        href={`tel:${gig.phone || owner.phone}`}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs text-center shadow flex items-center justify-center gap-1.5 transition"
                      >
                        <FaPhoneAlt className="text-xs" /> Direct Call
                      </a>
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
