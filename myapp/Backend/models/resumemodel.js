import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "Untitled Resume",
    },
    thumbnailLink: {
      type: String,
      default: "",
    },
    template: {
      theme: {
        type: String,
        default: "modern",
      },
      colorPalette: [
        {
          type: String,
        },
      ],
    },
    profileInfo: {
      profilePreviewurl: {
        type: String,
        default: "",
      },
      fullName: {
        type: String,
        default: "",
      },
      designation: {
        type: String,
        default: "",
      },
      summary: {
        type: String,
        default: "",
      },
    },
    contactInfo: {
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    workExperience: [
      {
        company: { type: String },
        role: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        percentage: { type: String },
      },
    ],
    skills: [
      {
        name: { type: String },
        level: { type: String },
      },
    ],
    projects: [
      {
        title: { type: String },
        description: { type: String },
        techStack: [{ type: String }],
        githubLink: { type: String },
        liveLink: { type: String },
      },
    ],
    certifications: [
      {
        title: { type: String },
        issuer: { type: String },
        date: { type: String },
        certificateLink: { type: String },
      },
    ],
    languages: [
      {
        language: { type: String },
        proficiency: { type: String },
      },
    ],
    interests: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
