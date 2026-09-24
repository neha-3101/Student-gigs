import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaArrowLeft, FaEdit, FaTrash, FaBriefcase, FaTag, FaUser, FaUserCheck, FaTimes } from "react-icons/fa";

export default function MyGigs() {
  const navigate = useNavigate();

  const [gigs, setGigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    name: "",
    email: "",
    phone: "",
  });

  // ========================================
  // FETCH MY GIGS
  // ========================================
  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/gig/my", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch my gigs");
      }

      const data = await res.json();
      setGigs(data.gigs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      description: "",
      category: "",
      name: "",
      email: "",
      phone: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.category) {
      alert("Please fill all required fields (Title, Price, Category)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (editingId) {
        const res = await fetch(`http://localhost:3000/api/gig/gig/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to update gig");
        }

        const data = await res.json();
        setGigs((prev) =>
          prev.map((g) => (g._id === editingId ? data.gig : g))
        );
      } else {
        const res = await fetch("http://localhost:3000/api/gig/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to create gig");
        }

        await res.json();
        await fetchGigs();
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (gig) => {
    setForm({
      title: gig.title,
      price: gig.price,
      description: gig.description,
      category: gig.category || "",
      name: gig.name,
      email: gig.email,
      phone: gig.phone,
    });

    setEditingId(gig._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/api/gig/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete gig");
      }

      setGigs((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[#1b253e]">
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-slate-400 hover:text-purple-400 text-xs font-semibold flex items-center gap-1.5 mb-2 transition"
            >
              <FaArrowLeft className="text-[10px]" /> Back to Home
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              My Created <span className="text-gradient">Gigs</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage your offered services and grow your freelance profile 🚀
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                price: "",
                description: "",
                category: "",
                name: "",
                email: "",
                phone: "",
              });
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 flex items-center gap-2 transition cursor-pointer"
          >
            <FaPlus className="text-xs" /> Add New Gig
          </button>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && gigs.length === 0 && !error && (
          <div className="bg-[#0e1526] border border-[#1e2a47] p-12 rounded-3xl text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 bg-[#16213b] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-purple-400">
              <FaBriefcase />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">You haven't created any gigs yet</h3>
            <p className="text-slate-400 text-xs mb-6">
              Share your skills with other students by offering your first gig!
            </p>
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-purple-500/20"
            >
              + Create First Gig
            </button>
          </div>
        )}

        {/* GIGS GRID */}
        {!loading && gigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="bg-[#12192c] border border-[#1e2a47] rounded-2xl p-5 hover:border-purple-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 
                      onClick={() => navigate(`/gig/${gig._id}`, { state: gig })}
                      className="text-base font-bold text-white group-hover:text-purple-300 cursor-pointer truncate"
                    >
                      {gig.title}
                    </h3>
                    <span className="text-emerald-400 font-extrabold text-sm flex-shrink-0">
                      ₹ {gig.price}
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs line-clamp-2 mb-4">
                    {gig.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 pt-3 border-t border-[#1a243d]">
                    <span className="flex items-center gap-1 text-purple-400 font-medium capitalize">
                      <FaTag className="text-[10px]" /> {gig.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <FaUser className="text-[10px]" /> {gig.name}
                    </span>
                  </div>
                </div>

                {/* Profile Pic & Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1a243d]">
                  <div className="w-10 h-10 rounded-xl bg-[#0c1220] border border-[#1e2a47] overflow-hidden flex items-center justify-center">
                    {gig.profilePicture ? (
                      <img src={gig.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-500 text-xs">👤</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(gig)}
                      className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <FaEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(gig._id)}
                      className="bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <FaTrash className="text-[10px]" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ADD / EDIT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111726] border border-[#1e2a47] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
            
            <button
              onClick={resetForm}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg transition"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? "✏️ Edit Gig" : "✨ Create New Gig"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Gig Title *</label>
                <input
                  name="title"
                  placeholder="e.g. Full-Stack Web Development in React & Node"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-[#0c1220] border border-[#1e2a47] rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    placeholder="e.g. 2000"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full bg-[#0c1220] border border-[#1e2a47] rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-[#0c1220] border border-[#1e2a47] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Design">Design</option>
                    <option value="Coding">Coding</option>
                    <option value="Teaching">Teaching</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Describe your gig service in detail..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-[#0c1220] border border-[#1e2a47] rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 border-t border-[#1a243d]">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <input
                    name="name"
                    placeholder="Your Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-[#0c1220] border border-[#1e2a47] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-[#0c1220] border border-[#1e2a47] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    name="phone"
                    placeholder="Phone Number (for direct call)"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-[#0c1220] border border-[#1e2a47] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1a243d]">
              <button
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#18223a] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-purple-500/25 hover:opacity-95 transition disabled:opacity-50"
              >
                {editingId ? "Update Gig" : "Save Gig"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}