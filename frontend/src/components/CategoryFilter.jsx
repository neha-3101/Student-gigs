import { FaThLarge, FaPalette, FaCode, FaBookOpen } from "react-icons/fa";

export default function CategoryFilter({ filter, setFilter }) {
  const categories = [
    { name: "All", icon: FaThLarge },
    { name: "Design", icon: FaPalette },
    { name: "Coding", icon: FaCode },
    { name: "Teaching", icon: FaBookOpen },
  ];

  return (
    <div className="flex flex-wrap gap-3 my-6">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = filter === cat.name;

        return (
          <button
            key={cat.name}
            onClick={() => setFilter(cat.name)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-500/30 scale-[1.02]"
                : "bg-[#12192c] text-slate-300 border border-[#1e2a47] hover:bg-[#18233d] hover:text-white hover:border-[#2b3b63]"
            }`}
          >
            <Icon className={`text-sm ${isActive ? "text-white" : "text-slate-400"}`} />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}