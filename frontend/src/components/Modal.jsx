import { FaTimes } from "react-icons/fa";

export default function Modal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-[#111726] border border-[#1e2a47] p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold text-white mb-4">Contact Seller</h2>

        <div className="space-y-3">
          <input 
            className="w-full p-3 bg-[#0c1220] border border-[#1e2a47] rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500" 
            placeholder="Your Name" 
          />
          <textarea 
            rows="4"
            className="w-full p-3 bg-[#0c1220] border border-[#1e2a47] rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500" 
            placeholder="Message details..." 
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#18223a] rounded-xl transition"
          >
            Close
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 hover:opacity-95 transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}