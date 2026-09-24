import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import GigCard from "../components/GigCard";
import { FaGraduationCap, FaLaptopCode } from "react-icons/fa";

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real gigs from backend
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:3000/api/gig/", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch gigs");
        }

        const data = await res.json();
        setGigs(data.gigs || []);
      } catch (err) {
        console.log(err);
        setError("Unable to load gigs");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // Search + Category filtering
  const filtered = gigs.filter((gig) => {
    const matchesSearch = gig.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filter === "All" ||
      gig.category?.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* HERO SECTION MATCHING IMAGE 2 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1425] via-[#121b33] to-[#0d1425] border border-[#1d2a4a] p-6 sm:p-10 shadow-2xl hero-glow">
          {/* Subtle Ambient Glow Spheres */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-bold tracking-widest uppercase">
                <span>LEARN</span> • <span>EARN</span> • <span>GROW</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Find & Offer Gigs, <br className="hidden sm:inline" />
                <span className="text-gradient">Build Your Future</span>
              </h1>

              <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
                Discover part-time gigs, share your skills, and get real-world experience while you study.
              </p>

              {/* SEARCH BAR EMBEDDED */}
              <div className="pt-2">
                <SearchBar search={search} setSearch={setSearch} />
              </div>
            </div>

            {/* Right Graphic Workspace Card (Matching Image 2 visual) */}
            <div className="lg:col-span-5 hidden lg:flex justify-end relative">
              <div className="w-full max-w-sm bg-[#090e1a]/80 backdrop-blur-md rounded-2xl border border-[#1e2a47] p-5 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between pb-3 border-b border-[#1c2742]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">student-gigs.v1</span>
                </div>

                <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-purple-600/30 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform">
                    <FaLaptopCode className="text-4xl text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                      <FaGraduationCap className="text-purple-400" /> Student Workspace
                    </h4>
                    <p className="text-xs text-slate-400 italic font-serif">"Small Gigs, Big Dreams"</p>
                  </div>
                </div>

                <div className="bg-[#121a2e] rounded-xl p-3 border border-[#1e2a47] flex justify-between items-center text-xs">
                  <span className="text-slate-400">Available Opportunities</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {gigs.length} Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mt-8">
          <CategoryFilter filter={filter} setFilter={setFilter} />
        </div>

        {/* LATEST GIGS SECTION HEADER */}
        <div className="flex justify-between items-center mt-8 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Latest Gigs
            </h3>
          </div>
          <button
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
          >
            View All <span className="text-sm">→</span>
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Loading Student Gigs...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm text-center my-6">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-[#0f1629] border border-[#1e2a47] rounded-3xl p-12 text-center my-6 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-[#162038] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-slate-400">
              🔍
            </div>
            <h4 className="text-lg font-bold text-white mb-1">No Gigs Found</h4>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">
              No gigs match your search or filter criteria. Try searching for a different keyword or category.
            </p>
          </div>
        )}

        {/* GIGS GRID */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}