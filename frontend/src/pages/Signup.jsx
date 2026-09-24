import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaGraduationCap, FaUser, FaEnvelope, FaLock, FaArrowLeft, FaLaptopCode } from "react-icons/fa";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        form,
        { withCredentials: true }
      );

      console.log("Signup Successful:", response.data);
      alert(response.data.message || "Signup Successful");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);

      if (error.response) {
        alert(error.response.data.message || "Signup Failed");
      } else if (error.request) {
        alert("Unable to connect to the server.");
      } else {
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-[#101626] border border-[#1e2a47] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* LEFT COLUMN: BRANDING & MOTIVATION */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0e1628] via-[#141d36] to-[#0e1628] p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1b253e] relative">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-white">
              Student<span className="text-gradient">Gigs</span>
            </span>
          </Link>

          <div className="my-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold tracking-widest uppercase">
              LEARN • EARN • GROW
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Create Your Account Today
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Join the student freelance platform to offer services, find gigs, and earn while studying.
            </p>
          </div>

          <div className="bg-[#0b101e] p-4 rounded-2xl border border-[#1b253e] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FaLaptopCode className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Quick Onboarding</p>
              <p className="text-[10px] text-slate-400">Get started in less than 2 minutes</p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SIGNUP FORM */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white">Sign Up</h3>
            <p className="text-slate-400 text-xs mt-1">Fill in details to register as a student freelancer or client</p>
          </div>

          <div className="space-y-4">
            {/* NAME INPUT */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-3.5 text-slate-500 text-xs" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0c1220] border border-[#1e2a47] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* EMAIL INPUT */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-3.5 text-slate-500 text-xs" />
                <input
                  type="email"
                  name="email"
                  placeholder="student@university.edu"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0c1220] border border-[#1e2a47] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-3.5 text-slate-500 text-xs" />
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  className="w-full pl-10 pr-4 py-3 bg-[#0c1220] border border-[#1e2a47] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* SIGNUP BUTTON */}
            <button
              onClick={handleSignup}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition cursor-pointer"
            >
              Create Free Account
            </button>
          </div>

          {/* FOOTER LINKS */}
          <div className="mt-8 pt-6 border-t border-[#1b253e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 font-bold hover:underline">
                Login
              </Link>
            </span>

            <button
              onClick={() => navigate("/")}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 transition"
            >
              <FaArrowLeft className="text-[10px]" /> Back to Home
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
