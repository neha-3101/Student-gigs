import { FaSearch } from "react-icons/fa";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="relative flex items-center w-full max-w-2xl">
      <div className="absolute left-4 text-slate-400">
        <FaSearch className="text-sm" />
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search services, skills, or gigs..."
        className="w-full pl-11 pr-32 py-3.5 bg-[#0e1628]/90 text-white placeholder-slate-400 rounded-2xl border border-[#1e2a47] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm shadow-inner transition"
      />
      <button 
        type="button"
        className="absolute right-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white px-5 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition cursor-pointer"
      >
        Search <span className="text-sm">→</span>
      </button>
    </div>
  );
}