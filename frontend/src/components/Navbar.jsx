import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaGraduationCap, 
  FaHome, 
  FaBriefcase, 
  FaConciergeBell, 
  FaTasks, 
  FaBell, 
  FaBars, 
  FaTimes, 
  FaChevronDown 
} from "react-icons/fa";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import API from "../services/Api";
import { useSocket } from "../context/SocketContext";
import NotificationInbox from "./NotificationInbox";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification Inbox States
  const [showNotificationInbox, setShowNotificationInbox] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const fileInputRef = useRef(null);

  // =========================================================
  // FETCH CONVERSATIONS & UNREAD COUNT
  // =========================================================
  const fetchConversations = useCallback(async () => {
    try {
      const res = await API.get("/messages/conversations");
      setConversations(res.data.conversations || []);
      setTotalUnreadCount(res.data.totalUnreadCount || 0);
    } catch (err) {
      console.log("Error fetching notifications/conversations:", err);
    }
  }, []);

  // =========================================================
  // CHECK LOGIN + GET PROFILE PICTURE
  // =========================================================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/me",
          { withCredentials: true }
        );

        setIsLoggedIn(true);
        setProfilePicture(response.data.user.profilePicture || "");
        fetchConversations();
      } catch (error) {
        console.log("Authentication error:", error);
        setIsLoggedIn(false);
        setProfilePicture("");
      }
    };

    checkAuth();
  }, [fetchConversations]);

  // Listen to socket for real-time unread updates
  useEffect(() => {
    if (!socket || !isLoggedIn) return;

    const handleUnreadUpdate = () => {
      fetchConversations();
    };

    socket.on("unread-update", handleUnreadUpdate);
    socket.on("receive-message", handleUnreadUpdate);

    return () => {
      socket.off("unread-update", handleUnreadUpdate);
      socket.off("receive-message", handleUnreadUpdate);
    };
  }, [socket, isLoggedIn, fetchConversations]);

  // Close menus on route change
  useEffect(() => {
    setShowProfileMenu(false);
    setShowNotificationInbox(false);
    setMobileMenuOpen(false);
    if (isLoggedIn) {
      fetchConversations();
    }
  }, [location.pathname, isLoggedIn, fetchConversations]);

  const handleProfileClick = () => {
    setShowNotificationInbox(false);
    setShowProfileMenu((prev) => !prev);
  };

  const handleNotificationClick = () => {
    setShowProfileMenu(false);
    setShowNotificationInbox((prev) => !prev);
    if (!showNotificationInbox) {
      fetchConversations();
    }
  };

  const handleSelectConversation = (requestId) => {
    setShowNotificationInbox(false);
    // Mark as read in local state optimistically
    setConversations((prev) =>
      prev.map((c) => (c.requestId === requestId ? { ...c, unreadCount: 0 } : c))
    );
    navigate(`/chat/${requestId}`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.post(
        "http://localhost:3000/api/auth/upload/profile",
        formData,
        { withCredentials: true }
      );

      setProfilePicture(response.data.profilePicture);
      setShowProfileMenu(false);
      setShowProfileViewer(false);
      setIsZoomed(false);
    } catch (error) {
      console.log("Profile upload error:", error);
      alert(error.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveProfile = async () => {
    try {
      setRemoving(true);
      const response = await axios.delete(
        "http://localhost:3000/api/auth/delete/profile",
        { withCredentials: true }
      );

      setProfilePicture("");
      setShowProfileMenu(false);
      setShowProfileViewer(false);
      setIsZoomed(false);
    } catch (error) {
      console.log("Remove profile picture error:", error);
      alert(error.response?.data?.message || "Failed to remove profile picture");
    } finally {
      setRemoving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete(
        "http://localhost:3000/api/auth/logout",
        { withCredentials: true }
      );

      setIsLoggedIn(false);
      setProfilePicture("");
      setShowProfileMenu(false);
      setShowNotificationInbox(false);
      setShowProfileViewer(false);
      setIsZoomed(false);

      window.location.href = "/login";
    } catch (error) {
      console.log("Logout error:", error);
      alert(error.response?.data?.message || "Failed to logout");
    }
  };

  const handleViewProfile = () => {
    setShowProfileMenu(false);
    setShowProfileViewer(true);
  };

  const closeProfileViewer = () => {
    setShowProfileViewer(false);
    setIsZoomed(false);
  };

  const handleImageZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  const navItems = [
    { label: "Home", path: "/", icon: FaHome },
    { label: "My Gigs", path: "/my-gigs", icon: FaBriefcase },
    ...(isLoggedIn
      ? [
          { label: "My Services", path: "/my-services", icon: FaConciergeBell },
          { label: "Service Requests", path: "/service-requests", icon: FaTasks },
        ]
      : []),
  ];

  return (
    <>
      {/* GLOBAL NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#0d1322]/90 backdrop-blur-md border-b border-[#1b253e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Student<span className="text-gradient">Gigs</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1 bg-[#131b2e]/60 p-1.5 rounded-full border border-[#1e2a47]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-purple-500/25"
                      : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
                  }`}
                >
                  <Icon className={`text-sm ${isActive ? "text-white" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            
            {/* NOTIFICATION BELL WITH DYNAMIC UNREAD BADGE */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  aria-label="Notifications"
                  className="relative p-2.5 rounded-full bg-[#131b2e] border border-[#1e2a47] text-slate-300 hover:text-white hover:bg-[#1a243d] transition cursor-pointer"
                >
                  <FaBell className="text-sm" />
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-[10px] font-extrabold text-white flex items-center justify-center ring-2 ring-[#0d1322] shadow-sm animate-pulse">
                      {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                    </span>
                  )}
                </button>

                {/* NOTIFICATION INBOX DROPDOWN */}
                {showNotificationInbox && (
                  <NotificationInbox
                    conversations={conversations}
                    totalUnreadCount={totalUnreadCount}
                    onClose={() => setShowNotificationInbox(false)}
                    onSelectConversation={handleSelectConversation}
                  />
                )}
              </div>
            )}

            {/* LOGGED IN USER AVATAR & DROPDOWN */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#131b2e] border border-[#1e2a47] hover:bg-[#1a243d] transition cursor-pointer"
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/40"
                    />
                  ) : (
                    <FaUserCircle className="text-2xl text-purple-400" />
                  )}
                  <FaChevronDown className={`text-xs text-slate-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
                </button>

                {/* HIDDEN FILE INPUT */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* PROFILE DROPDOWN MENU */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#111726] border border-[#1e2942] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#1b253e]">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/40"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30 text-purple-400 font-bold">
                          👤
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">Account Menu</p>
                        <p className="text-xs text-purple-400">Logged In</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {profilePicture && (
                        <button
                          onClick={handleViewProfile}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#161f36] hover:bg-[#1c2744] rounded-xl transition cursor-pointer"
                        >
                          🔍 View Profile Photo
                        </button>
                      )}

                      <button
                        onClick={handleUploadClick}
                        disabled={uploading || removing}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 rounded-xl transition disabled:opacity-50 cursor-pointer"
                      >
                        {uploading
                          ? "Uploading..."
                          : profilePicture
                          ? "📷 Upload New Photo"
                          : "📷 Upload Profile Picture"}
                      </button>

                      {profilePicture && (
                        <button
                          onClick={handleRemoveProfile}
                          disabled={removing || uploading}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition disabled:opacity-50 cursor-pointer"
                        >
                          {removing ? "Removing..." : "🗑️ Remove Profile Photo"}
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-rose-400 bg-[#161f36] hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/20 cursor-pointer"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-lg shadow-purple-500/25 hover:opacity-95 transition"
              >
                Login
              </Link>
            )}

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-xl bg-[#131b2e] border border-[#1e2a47] text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0d1322] border-b border-[#1b253e] px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-slate-300 hover:bg-[#131b2e]"
                  }`}
                >
                  <Icon className="text-base" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* PROFILE PHOTO VIEWER MODAL */}
      {showProfileViewer && profilePicture && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          onClick={closeProfileViewer}
        >
          <div
            className="relative bg-[#111726] border border-[#1e2a47] p-6 rounded-3xl max-w-lg w-full flex flex-col items-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeProfileViewer}
              aria-label="Close"
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>

            <img
              src={profilePicture}
              alt="Profile"
              onClick={handleImageZoom}
              className={`rounded-2xl object-contain cursor-zoom-in transition-all duration-300 border border-[#1e2a47] ${
                isZoomed
                  ? "max-w-[90vw] max-h-[80vh] scale-110 cursor-zoom-out"
                  : "max-w-[320px] max-h-[320px]"
              }`}
            />

            <div className="flex gap-3 mt-6 w-full justify-center">
              <button
                onClick={handleUploadClick}
                disabled={uploading || removing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-95 disabled:opacity-50 cursor-pointer"
              >
                {uploading ? "Uploading..." : "Upload New Photo"}
              </button>

              <button
                onClick={handleRemoveProfile}
                disabled={removing || uploading}
                className="bg-rose-600/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-rose-600/30 disabled:opacity-50 cursor-pointer"
              >
                {removing ? "Removing..." : "Remove Photo"}
              </button>
            </div>

            <p className="text-slate-400 text-xs mt-3">Click photo to zoom</p>
          </div>
        </div>
      )}
    </>
  );
}