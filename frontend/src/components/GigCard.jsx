import ContactButton from "./ContactButton";
import { FaCode, FaPalette, FaBookOpen, FaBriefcase, FaClock, FaTag, FaUser } from "react-icons/fa";

export default function GigCard({ gig }) {
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "coding":
        return <FaCode className="text-xl text-blue-400" />;
      case "design":
        return <FaPalette className="text-xl text-purple-400" />;
      case "teaching":
        return <FaBookOpen className="text-xl text-emerald-400" />;
      default:
        return <FaBriefcase className="text-xl text-indigo-400" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const date = new Date(dateStr);
      const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays > 1 && diffDays < 30) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="bg-[#12192c] border border-[#1e2a47] rounded-2xl p-5 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex justify-between items-start md:items-center gap-4 group">
      
      {/* LEFT SECTION: Icon + Details */}
      <div className="flex gap-4 items-start flex-1 min-w-0">
        {/* Category Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-[#1b253e] border border-[#273656] flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
          {getCategoryIcon(gig.category)}
        </div>

        {/* Gig Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-base md:text-lg text-white truncate group-hover:text-purple-300 transition-colors">
            {gig.title}
          </h4>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-emerald-400 font-extrabold text-base">
              ₹ {gig.price}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 capitalize text-purple-400 font-medium">
              <FaTag className="text-[10px]" /> {gig.category || "General"}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <FaUser className="text-[10px]" /> By: {gig.name || "Anonymous"}
            </span>
          </div>

          {/* Contact Button / Request Status */}
          <div className="mt-3">
            <ContactButton 
              gigId={gig._id} 
              gigOwnerEmail={gig.email} 
              gigPhone={gig.phone} 
            />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Profile Picture & Timestamp */}
      <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-[#0a0f1d] border border-[#1e2a47] rounded-2xl overflow-hidden flex items-center justify-center shadow-md">
          {gig.profilePicture ? (
            <img
              src={gig.profilePicture}
              alt={`${gig.name}'s profile`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-500 text-xs">
              <FaUser className="text-xl mb-1 text-slate-600" />
              <span>No Photo</span>
            </div>
          )}
        </div>

        <span className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
          <FaClock className="text-[9px]" /> {formatDate(gig.createdAt)}
        </span>
      </div>

    </div>
  );
}