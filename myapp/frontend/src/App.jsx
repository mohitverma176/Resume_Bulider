import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landingpages from "./pages/Landingpages.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeEditor from "./pages/ResumeEditor.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Public Landing Page with Login & Register */}
      <Route path="/" element={<Landingpages />} />

      {/* Protected Pages (Logged-in users only) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume/:id" element={<ResumeEditor />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
