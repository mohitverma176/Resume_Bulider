import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/Usercontext.jsx";

// ProtectedRoute: Only allows logged-in users to access the page
const ProtectedRoute = () => {
  const { user, loading } = useUser();

  // Show a loading spinner while checking if user is logged in
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, redirect to landing page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If logged in, render the child pages (Dashboard, ResumeEditor, etc.)
  return <Outlet />;
};

export default ProtectedRoute;
