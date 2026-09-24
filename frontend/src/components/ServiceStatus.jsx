import React from "react";
import { FaCheck } from "react-icons/fa";

const PROGRESS_FLOWS = {
  Teaching: ["connected", "scheduled", "in_progress", "completed"],
  Coding: ["connected", "work_started", "in_progress", "ready_for_review", "completed"],
  Design: ["connected", "work_started", "in_progress", "ready_for_review", "completed"],
};

const DEFAULT_FLOW = ["connected", "in_progress", "completed"];

const formatStatusText = (status) => {
  return status
    ?.split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function ServiceStatus({ category, currentStatus, agreedTime, progressMessage }) {
  const steps = PROGRESS_FLOWS[category] || DEFAULT_FLOW;
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="bg-[#0d1425] p-5 rounded-2xl border border-[#1c2846] w-full mt-4">
      <h5 className="font-bold text-slate-200 text-xs tracking-wider uppercase mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
        Service Progress Timeline
      </h5>
      
      {/* Visual Timeline */}
      <div className="flex items-center justify-between w-full mb-8 relative px-2">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-[#1a243c] -translate-y-1/2 z-0 rounded-full"></div>
        <div 
          className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 -translate-y-1/2 z-0 transition-all duration-500 rounded-full shadow-sm shadow-purple-500/50"
          style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step} className="flex flex-col items-center z-10 relative">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-purple-600 text-white ring-4 ring-purple-500/30 scale-110 shadow-lg shadow-purple-500/40"
                    : isCompleted
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-[#111726] border-2 border-[#1e2a47] text-slate-500"
                }`}
              >
                {isCompleted ? <FaCheck className="text-[10px]" /> : index + 1}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold mt-2 whitespace-nowrap absolute top-7 text-center ${
                  isActive
                    ? "text-purple-400 font-bold"
                    : isCompleted
                    ? "text-blue-400"
                    : "text-slate-500"
                }`}
              >
                {formatStatusText(step)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Details Box */}
      <div className="mt-8 pt-4 border-t border-[#1a243c] flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Current Status:</span>
          <span className="font-bold text-purple-400 uppercase bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5">
            {formatStatusText(currentStatus || "connected")} <FaCheck className="text-[10px] text-emerald-400" />
          </span>
        </div>

        {agreedTime && (
          <div className="flex justify-between items-center text-xs bg-[#12192c] p-2.5 rounded-xl border border-[#1e2a47]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span>🕐</span> Agreed Schedule:
            </span>
            <span className="font-semibold text-white">{agreedTime}</span>
          </div>
        )}

        {progressMessage && (
          <div className="mt-1 p-3 bg-[#12192c] rounded-xl border border-[#1e2a47]">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1">Update Message:</span>
            <p className="text-xs text-slate-300 italic">"{progressMessage}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
