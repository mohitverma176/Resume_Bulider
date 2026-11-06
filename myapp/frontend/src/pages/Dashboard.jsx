import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Trash2,
  Edit3,
  Calendar,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import axiosInstance from "../utils/axiosinstance.js";
import { API_PATHS } from "../utils/apipath.js";
import { useUser } from "../context/Usercontext.jsx";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // State
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null); // resume to delete
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 1. Fetch user's resumes on page load
  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setResumes(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // 2. Create a new resume
  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreateLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title: newTitle.trim(),
      });
      setShowCreateModal(false);
      setNewTitle("");
      // Navigate straight to the editor for this new resume
      navigate(`/resume/${response.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating resume.");
    } finally {
      setCreateLoading(false);
    }
  };

  // 3. Delete a resume
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(deleteTarget._id));
      // Remove from state
      setResumes((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete resume.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onNewResume={() => setShowCreateModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome back, {user?.name || "Job Seeker"}! 👋
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Manage, edit, or create new professional resumes.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-200 hover:scale-105 transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus size={18} />
            <span>Create New Resume</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium text-sm mt-4">
              Loading your resumes...
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm mb-6">
            {error}
          </div>
        )}

        {/* Resumes Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* "Create New Resume" Card */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="flex flex-col items-center justify-center min-h-[320px] p-8 bg-white border-2 border-dashed border-violet-200 hover:border-violet-500 rounded-3xl cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-violet-50 group-hover:bg-gradient-to-br group-hover:from-violet-600 group-hover:to-fuchsia-600 text-violet-600 group-hover:text-white flex items-center justify-center mb-4 transition-all shadow-sm">
                <Plus size={32} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-violet-600 transition-colors">
                New Resume
              </h3>
              <p className="text-slate-400 text-xs mt-1 max-w-[200px]">
                Start with a blank canvas or chosen ATS-friendly template.
              </p>
            </div>

            {/* Existing Resumes */}
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-violet-300 transition-all group"
              >
                {/* Resume Card Preview Area */}
                <div
                  onClick={() => navigate(`/resume/${resume._id}`)}
                  className="relative aspect-[4/3] bg-gradient-to-br from-violet-50 via-slate-50 to-fuchsia-50 flex items-center justify-center p-6 cursor-pointer overflow-hidden border-b border-slate-100"
                >
                  {resume.thumbnailLink ? (
                    <img
                      src={resume.thumbnailLink}
                      alt={resume.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-20 h-24 bg-white rounded-xl shadow-md border border-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
                      <FileText size={32} className="text-violet-500 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {resume.template?.theme || "Modern"}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5">
                      <Edit3 size={14} /> Open Editor
                    </span>
                  </div>
                </div>

                {/* Resume Info Area */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base truncate group-hover:text-violet-600 transition-colors">
                      {resume.title || "Untitled Resume"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Calendar size={13} />
                      <span>
                        Updated{" "}
                        {new Date(
                          resume.updatedAt || resume.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/resume/${resume._id}`)}
                      className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-fuchsia-600 transition-colors cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>Edit Resume</span>
                    </button>

                    <button
                      onClick={() => setDeleteTarget(resume)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Resume"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state when 0 resumes */}
        {!loading && resumes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-base">
              You haven't created any resumes yet.
            </p>
          </div>
        )}
      </main>

      {/* ── CREATE RESUME MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 animate-fade-in">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Name Your Resume
              </h2>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              Give your resume a descriptive title (e.g., "Full Stack Developer"
              or "Marketing Specialist").
            </p>

            <form onSubmit={handleCreateResume}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Resume Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer Resume"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-violet-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-xs rounded-xl hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {createLoading ? "Creating..." : "Continue"}
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative border border-slate-100 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-2">
              Delete Resume?
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-800">
                "{deleteTarget.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-all cursor-pointer"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
