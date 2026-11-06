import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutTemplate, LogOut, Plus } from "lucide-react";
import { useUser } from "../context/Usercontext.jsx";

const Navbar = ({ onNewResume }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-violet-200">
            <LayoutTemplate size={20} />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            ResumeExpert
          </span>
        </Link>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {onNewResume && (
            <button
              onClick={onNewResume}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Resume</span>
            </button>
          )}

          {/* User Badge */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-bold text-slate-800 leading-tight">
                  {user.name}
                </div>
                <div className="text-xs text-slate-400 leading-tight truncate max-w-[150px]">
                  {user.email}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
