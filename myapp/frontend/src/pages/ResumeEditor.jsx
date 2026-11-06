import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Download,
  Upload,
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Palette,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import axiosInstance from "../utils/axiosinstance.js";
import { API_PATHS } from "../utils/apipath.js";
import ResumePreview from "../components/ResumePreview.jsx";

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Active form tab
  const [activeTab, setActiveTab] = useState("profile");

  // Resume state
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Fetch resume details by ID
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(id));
        setResume(response.data);
      } catch (error) {
        alert("Failed to load resume. Returning to dashboard.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, navigate]);

  // 2. Save resume changes to the backend
  const handleSave = async () => {
    if (!resume) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(id),
        resume
      );
      setResume(response.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  // 3. Download / Print PDF
  const handlePrint = () => {
    window.print();
  };

  // 4. Handle Profile Photo Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    setUploadingImage(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(id),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data?.profilePreviewurl) {
        setResume((prev) => ({
          ...prev,
          profileInfo: {
            ...prev.profileInfo,
            profilePreviewurl: response.data.profilePreviewurl,
          },
        }));
      }
    } catch (err) {
      alert("Failed to upload image. Please try a valid JPEG/PNG file.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper functions for state updates
  const updateProfile = (field, value) => {
    setResume((prev) => ({
      ...prev,
      profileInfo: { ...prev.profileInfo, [field]: value },
    }));
  };

  const updateContact = (field, value) => {
    setResume((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value },
    }));
  };

  // Experience Helpers
  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      workExperience: [
        ...(prev.workExperience || []),
        { company: "", role: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    const list = [...(resume.workExperience || [])];
    list[index][field] = value;
    setResume((prev) => ({ ...prev, workExperience: list }));
  };

  const removeExperience = (index) => {
    const list = [...(resume.workExperience || [])];
    list.splice(index, 1);
    setResume((prev) => ({ ...prev, workExperience: list }));
  };

  // Education Helpers
  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { degree: "", institution: "", startDate: "", endDate: "", percentage: "" },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    const list = [...(resume.education || [])];
    list[index][field] = value;
    setResume((prev) => ({ ...prev, education: list }));
  };

  const removeEducation = (index) => {
    const list = [...(resume.education || [])];
    list.splice(index, 1);
    setResume((prev) => ({ ...prev, education: list }));
  };

  // Skill Helpers
  const addSkill = () => {
    setResume((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { name: "", level: "Intermediate" }],
    }));
  };

  const updateSkill = (index, field, value) => {
    const list = [...(resume.skills || [])];
    list[index][field] = value;
    setResume((prev) => ({ ...prev, skills: list }));
  };

  const removeSkill = (index) => {
    const list = [...(resume.skills || [])];
    list.splice(index, 1);
    setResume((prev) => ({ ...prev, skills: list }));
  };

  // Project Helpers
  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { title: "", description: "", githubLink: "", liveLink: "" },
      ],
    }));
  };

  const updateProject = (index, field, value) => {
    const list = [...(resume.projects || [])];
    list[index][field] = value;
    setResume((prev) => ({ ...prev, projects: list }));
  };

  const removeProject = (index) => {
    const list = [...(resume.projects || [])];
    list.splice(index, 1);
    setResume((prev) => ({ ...prev, projects: list }));
  };

  // Color & Theme Helpers
  const setColorTheme = (color) => {
    setResume((prev) => ({
      ...prev,
      template: {
        ...prev.template,
        colorPalette: [color],
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* ── TOP ACTION BAR (Hidden when printing) ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </Link>

            <input
              type="text"
              value={resume?.title || ""}
              onChange={(e) =>
                setResume((prev) => ({ ...prev, title: e.target.value }))
              }
              className="text-base sm:text-lg font-black text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-violet-500 outline-none px-1 py-0.5 transition-all"
              placeholder="Resume Title"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{saving ? "Saving..." : "Save"}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-violet-200 transition-all cursor-pointer"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 print:p-0">
        {/* ── LEFT COLUMN: EDITING FORM (Hidden when printing) ── */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[85vh] print:hidden">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-2 border-b border-slate-100 bg-slate-50/50">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "contact", label: "Contact", icon: Mail },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "skills", label: "Skills", icon: Code },
              { id: "projects", label: "Projects", icon: Award },
              { id: "theme", label: "Theme", icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-violet-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* ── 1. PROFILE TAB ── */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800">
                  Profile Information
                </h3>

                {/* Profile Photo */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  {resume.profileInfo?.profilePreviewurl ? (
                    <img
                      src={resume.profileInfo.profilePreviewurl}
                      alt="Avatar"
                      className="w-14 h-14 rounded-xl object-cover border"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-lg">
                      {resume.profileInfo?.fullName?.charAt(0) || "U"}
                    </div>
                  )}

                  <label className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs">
                    <Upload size={14} />
                    <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={resume.profileInfo?.fullName || ""}
                    onChange={(e) => updateProfile("fullName", e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Role / Designation
                  </label>
                  <input
                    type="text"
                    value={resume.profileInfo?.designation || ""}
                    onChange={(e) => updateProfile("designation", e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Professional Summary
                  </label>
                  <textarea
                    rows={4}
                    value={resume.profileInfo?.summary || ""}
                    onChange={(e) => updateProfile("summary", e.target.value)}
                    placeholder="Briefly describe your career background, strengths, and goals..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* ── 2. CONTACT TAB ── */}
            {activeTab === "contact" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800">
                  Contact Information
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resume.contactInfo?.email || ""}
                    onChange={(e) => updateContact("email", e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={resume.contactInfo?.phone || ""}
                    onChange={(e) => updateContact("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={resume.contactInfo?.location || ""}
                    onChange={(e) => updateContact("location", e.target.value)}
                    placeholder="New York, USA"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={resume.contactInfo?.linkedin || ""}
                    onChange={(e) => updateContact("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={resume.contactInfo?.github || ""}
                    onChange={(e) => updateContact("github", e.target.value)}
                    placeholder="github.com/username"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* ── 3. EXPERIENCE TAB ── */}
            {activeTab === "experience" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">
                    Work Experience
                  </h3>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 cursor-pointer"
                  >
                    <Plus size={14} /> Add Role
                  </button>
                </div>

                {(resume.workExperience || []).map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(idx, "company", e.target.value)
                        }
                        placeholder="Google, Microsoft, etc."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Job Title / Role
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) =>
                          updateExperience(idx, "role", e.target.value)
                        }
                        placeholder="Software Engineer"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(idx, "startDate", e.target.value)
                          }
                          placeholder="Jan 2022"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) =>
                            updateExperience(idx, "endDate", e.target.value)
                          }
                          placeholder="Present"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Responsibilities & Achievements
                      </label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(idx, "description", e.target.value)
                        }
                        placeholder="• Built features using React and Node.js..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── 4. EDUCATION TAB ── */}
            {activeTab === "education" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">
                    Education
                  </h3>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 cursor-pointer"
                  >
                    <Plus size={14} /> Add School
                  </button>
                </div>

                {(resume.education || []).map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Degree / Certificate
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(idx, "degree", e.target.value)
                        }
                        placeholder="B.S. in Computer Science"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(idx, "institution", e.target.value)
                        }
                        placeholder="Stanford University"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Dates
                        </label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) =>
                            updateEducation(idx, "startDate", e.target.value)
                          }
                          placeholder="2020 — 2024"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          GPA / Grade
                        </label>
                        <input
                          type="text"
                          value={edu.percentage}
                          onChange={(e) =>
                            updateEducation(idx, "percentage", e.target.value)
                          }
                          placeholder="3.8 / 4.0 GPA"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── 5. SKILLS TAB ── */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">
                    Skills
                  </h3>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 cursor-pointer"
                  >
                    <Plus size={14} /> Add Skill
                  </button>
                </div>

                <div className="space-y-2">
                  {(resume.skills || []).map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          updateSkill(idx, "name", e.target.value)
                        }
                        placeholder="e.g. React.js, Python, Figma"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 6. PROJECTS TAB ── */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">
                    Projects
                  </h3>
                  <button
                    type="button"
                    onClick={addProject}
                    className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 cursor-pointer"
                  >
                    <Plus size={14} /> Add Project
                  </button>
                </div>

                {(resume.projects || []).map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) =>
                          updateProject(idx, "title", e.target.value)
                        }
                        placeholder="E-Commerce App"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          GitHub Link
                        </label>
                        <input
                          type="text"
                          value={proj.githubLink}
                          onChange={(e) =>
                            updateProject(idx, "githubLink", e.target.value)
                          }
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Live Demo Link
                        </label>
                        <input
                          type="text"
                          value={proj.liveLink}
                          onChange={(e) =>
                            updateProject(idx, "liveLink", e.target.value)
                          }
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(idx, "description", e.target.value)
                        }
                        placeholder="Key features built and technologies used..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── 7. THEME & COLORS TAB ── */}
            {activeTab === "theme" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">
                    Primary Accent Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: "Violet", hex: "#7c3aed" },
                      { name: "Blue", hex: "#2563eb" },
                      { name: "Emerald", hex: "#059669" },
                      { name: "Rose", hex: "#e11d48" },
                      { name: "Amber", hex: "#d97706" },
                      { name: "Slate", hex: "#334155" },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setColorTheme(c.hex)}
                        className={`w-9 h-9 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center shadow-xs ${
                          resume.template?.colorPalette?.[0] === c.hex
                            ? "ring-4 ring-offset-2 ring-slate-400 scale-105"
                            : ""
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {resume.template?.colorPalette?.[0] === c.hex && (
                          <Check size={16} className="text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">
                    Resume Layout Style
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "modern", label: "Modern" },
                      { id: "tech", label: "Tech ATS" },
                      { id: "minimal", label: "Minimal" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() =>
                          setResume((prev) => ({
                            ...prev,
                            template: { ...prev.template, theme: style.id },
                          }))
                        }
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          resume.template?.theme === style.id
                            ? "border-violet-600 bg-violet-50 text-violet-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: LIVE RESUME PREVIEW ── */}
        <div className="lg:col-span-7 overflow-y-auto max-h-[85vh] print:max-h-none print:overflow-visible">
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
