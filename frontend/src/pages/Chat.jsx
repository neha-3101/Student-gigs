import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/Api";
import ChatWindow from "../components/ChatWindow";
import { FaArrowLeft, FaPhoneAlt, FaUser } from "react-icons/fa";

export default function Chat() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        setLoading(true);
        setError("");
        
        const meRes = await API.get("/auth/me");
        setCurrentUser(meRes.data.user);
        
        const reqRes = await API.get(`/service-requests/${requestId}`);
        setRequest(reqRes.data.request);
      } catch (err) {
        console.error("Error loading chat details:", err);
        setError(err.response?.data?.message || "Failed to load chat details");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchChatDetails();
    }
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-3"></div>
        <p className="text-slate-400 text-xs font-semibold">Initializing secure chat room...</p>
      </div>
    );
  }

  if (error || !request || !currentUser) {
    return (
      <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 text-2xl mb-4">
          ⚠️
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
        <p className="text-slate-400 text-xs max-w-md mb-6">{error || "Could not load chat session."}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-purple-500/20"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isRequester = request.requesterId.id === currentUser.id || request.requesterId._id === currentUser.id;
  const otherUser = isRequester ? request.gigOwnerId : request.requesterId;
  const phoneToCall = isRequester ? (request.gigId?.phone || request.gigOwnerId.phone) : null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#070913] text-slate-100 p-4 sm:p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl flex flex-col gap-4">
        
        {/* Chat Header */}
        <div className="bg-[#111726] border border-[#1e2a47] rounded-2xl p-4 shadow-xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-[#0c1220] border border-[#1e2a47] text-slate-400 hover:text-white transition"
              aria-label="Back"
            >
              <FaArrowLeft className="text-xs" />
            </button>

            <div className="w-11 h-11 rounded-2xl bg-[#1b253e] border border-[#273656] overflow-hidden flex-shrink-0 flex items-center justify-center">
              {otherUser.profilePicture ? (
                <img
                  src={otherUser.profilePicture}
                  alt={otherUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-slate-400 text-sm" />
              )}
            </div>

            <div>
              <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                {otherUser.name}
              </h4>
              <span className="text-[10px] text-purple-400 font-semibold block">
                {isRequester ? "Service Provider" : "Client Requester"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {phoneToCall && (
              <a
                href={`tel:${phoneToCall}`}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <FaPhoneAlt className="text-[10px]" /> <span className="hidden sm:inline">Call</span>
              </a>
            )}
            
            <button
              onClick={() => navigate(-1)}
              className="bg-[#18223a] text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              Back
            </button>
          </div>
        </div>

        {/* Chat Window Component with requestInfo context */}
        <ChatWindow conversationId={requestId} currentUser={currentUser} requestInfo={request} />

      </div>
    </div>
  );
}
