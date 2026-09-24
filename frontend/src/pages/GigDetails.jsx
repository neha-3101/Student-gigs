import { useLocation, useNavigate } from "react";
import ContactButton from "../components/ContactButton";
import { FaArrowLeft, FaTag, FaUser, FaCheckCircle } from "react-icons/fa";

export default function GigDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-xl font-bold text-rose-400 mb-2">No Gig Data Found</h3>
        <p className="text-slate-400 text-xs mb-6">Please return to the Home page and select a gig to view details.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const gig = state;

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 p-4 sm:p-8 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-[#111726] border border-[#1e2a47] p-6 sm:p-10 rounded-3xl shadow-2xl space-y-6 relative hero-glow">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center border-b border-[#1b253e] pb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-purple-400 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <FaArrowLeft className="text-[10px]" /> Back
          </button>
          
          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <FaTag className="text-[10px]" /> {gig.category || "General"}
          </span>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: TITLE & DESCRIPTION */}
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {gig.title}
            </h2>

            <div className="flex items-center gap-3 bg-[#0c1220] p-4 rounded-2xl border border-[#1e2a47] max-w-xs">
              <span className="text-slate-400 text-xs font-medium">Offered Price:</span>
              <span className="text-emerald-400 font-extrabold text-xl">₹ {gig.price}</span>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Description</h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-[#0c1220]/60 p-4 rounded-2xl border border-[#1e2a47]/60">
                {gig.description || "No detailed description provided for this gig."}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: OWNER & ACTIONS */}
          <div className="md:col-span-4 bg-[#0d1322] border border-[#1b253e] p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gig Creator</h4>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1b253e] border border-[#263554] overflow-hidden flex-shrink-0 flex items-center justify-center">
                {gig.profilePicture ? (
                  <img src={gig.profilePicture} alt={gig.name} className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-slate-500 text-lg" />
                )}
              </div>
              <div>
                <h5 className="font-bold text-sm text-white">{gig.name || "Anonymous"}</h5>
                <span className="text-[10px] text-purple-400 font-medium block">Verified Student</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1b253e] space-y-2">
              <span className="text-[10px] text-slate-400 font-semibold block">Gig ID:</span>
              <code className="text-[10px] text-slate-300 font-mono bg-[#070a12] px-2.5 py-1 rounded-md block overflow-hidden truncate">
                {gig._id}
              </code>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2">
              <ContactButton 
                gigId={gig._id} 
                gigOwnerEmail={gig.email} 
                gigPhone={gig.phone} 
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}