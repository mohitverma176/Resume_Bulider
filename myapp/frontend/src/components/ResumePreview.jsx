import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Link2,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Code,
} from "lucide-react";

const ResumePreview = ({ resume }) => {
  if (!resume) return null;

  const {
    profileInfo = {},
    contactInfo = {},
    workExperience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    interests = [],
    template = {},
  } = resume;

  const themeColor = template.colorPalette?.[0] || "#7c3aed"; // Default to violet
  const activeTheme = template.theme || "modern"; // modern, tech, or minimal

  return (
    <div className="w-full flex justify-center py-4 print:py-0">
      {/* 
        The resume container is styled like a standard US Letter / A4 paper sheet 
        with white background, subtle shadow, and clean padding.
      */}
      <div
        id="resume-printable"
        className="resume-container w-full max-w-[800px] min-h-[1050px] bg-white p-8 sm:p-12 shadow-2xl print:shadow-none print:p-8 rounded-2xl print:rounded-none text-slate-800 transition-all font-sans"
      >
        {/* ── HEADER SECTION ── */}
        <div className="border-b pb-6 mb-6" style={{ borderColor: `${themeColor}30` }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Photo */}
            {profileInfo.profilePreviewurl && (
              <img
                src={profileInfo.profilePreviewurl}
                alt={profileInfo.fullName || "Profile"}
                className="w-24 h-24 rounded-2xl object-cover shadow-md border-2"
                style={{ borderColor: themeColor }}
              />
            )}

            <div className="flex-1 text-center sm:text-left">
              <h1
                className="text-3xl sm:text-4xl font-black tracking-tight"
                style={{ color: activeTheme === "minimal" ? "#0f172a" : themeColor }}
              >
                {profileInfo.fullName || "Your Full Name"}
              </h1>
              <p className="text-base sm:text-lg font-semibold text-slate-600 mt-1">
                {profileInfo.designation || "Target Role / Job Title"}
              </p>

              {/* Contact Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 text-xs text-slate-500 mt-3 font-medium">
                {contactInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={13} style={{ color: themeColor }} />
                    {contactInfo.email}
                  </span>
                )}
                {contactInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} style={{ color: themeColor }} />
                    {contactInfo.phone}
                  </span>
                )}
                {contactInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} style={{ color: themeColor }} />
                    {contactInfo.location}
                  </span>
                )}
                {contactInfo.linkedin && (
                  <span className="flex items-center gap-1">
                    <Link2 size={13} style={{ color: themeColor }} />
                    {contactInfo.linkedin}
                  </span>
                )}
                {contactInfo.github && (
                  <span className="flex items-center gap-1">
                    <Link2 size={13} style={{ color: themeColor }} />
                    {contactInfo.github}
                  </span>
                )}
                {contactInfo.website && (
                  <span className="flex items-center gap-1">
                    <Globe size={13} style={{ color: themeColor }} />
                    {contactInfo.website}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {profileInfo.summary && (
            <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed font-normal">
              {profileInfo.summary}
            </p>
          )}
        </div>

        {/* ── BODY SECTIONS (Experience, Education, Skills, Projects) ── */}
        <div className="space-y-6">
          {/* 1. Work Experience */}
          {workExperience.length > 0 && workExperience.some((w) => w.company || w.role) && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
                <Briefcase size={16} style={{ color: themeColor }} />
                <h2
                  className="text-sm font-black uppercase tracking-wider"
                  style={{ color: themeColor }}
                >
                  Work Experience
                </h2>
              </div>

              <div className="space-y-4">
                {workExperience.map((exp, idx) => (
                  <div key={idx} className="text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {exp.role || "Role"}
                        {exp.company ? ` • ${exp.company}` : ""}
                      </span>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs font-semibold text-slate-400">
                          {exp.startDate || "Start"} — {exp.endDate || "Present"}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Education */}
          {education.length > 0 && education.some((e) => e.institution || e.degree) && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
                <GraduationCap size={16} style={{ color: themeColor }} />
                <h2
                  className="text-sm font-black uppercase tracking-wider"
                  style={{ color: themeColor }}
                >
                  Education
                </h2>
              </div>

              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-left">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {edu.degree || "Degree"}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {edu.institution || "Institution"}
                        {edu.percentage ? ` (${edu.percentage})` : ""}
                      </div>
                    </div>
                    {(edu.startDate || edu.endDate) && (
                      <span className="text-xs font-semibold text-slate-400 mt-1 sm:mt-0">
                        {edu.startDate || "Start"} — {edu.endDate || "End"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Skills */}
          {skills.length > 0 && skills.some((s) => s.name) && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
                <Code size={16} style={{ color: themeColor }} />
                <h2
                  className="text-sm font-black uppercase tracking-wider"
                  style={{ color: themeColor }}
                >
                  Key Skills
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: `${themeColor}15`,
                      color: themeColor,
                    }}
                  >
                    {skill.name} {skill.level ? `(${skill.level})` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 4. Projects */}
          {projects.length > 0 && projects.some((p) => p.title) && (
            <div>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
                <Award size={16} style={{ color: themeColor }} />
                <h2
                  className="text-sm font-black uppercase tracking-wider"
                  style={{ color: themeColor }}
                >
                  Key Projects
                </h2>
              </div>

              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {proj.title}
                      </span>
                      <div className="flex gap-3 text-xs">
                        {proj.githubLink && (
                          <a
                            href={proj.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold underline hover:text-violet-600"
                            style={{ color: themeColor }}
                          >
                            GitHub
                          </a>
                        )}
                        {proj.liveLink && (
                          <a
                            href={proj.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold underline hover:text-violet-600"
                            style={{ color: themeColor }}
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Certifications & Languages */}
          {((certifications.length > 0 && certifications.some((c) => c.title)) ||
            (languages.length > 0 && languages.some((l) => l.language))) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {certifications.length > 0 && certifications.some((c) => c.title) && (
                <div>
                  <h3
                    className="text-xs font-black uppercase tracking-wider mb-2"
                    style={{ color: themeColor }}
                  >
                    Certifications
                  </h3>
                  <div className="space-y-1.5">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="text-xs text-slate-700">
                        <span className="font-bold">{cert.title}</span>
                        {cert.issuer && ` — ${cert.issuer}`}
                        {cert.date && ` (${cert.date})`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {languages.length > 0 && languages.some((l) => l.language) && (
                <div>
                  <h3
                    className="text-xs font-black uppercase tracking-wider mb-2"
                    style={{ color: themeColor }}
                  >
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-medium"
                      >
                        {lang.language} {lang.proficiency ? `• ${lang.proficiency}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
