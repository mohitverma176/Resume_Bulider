import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutTemplate,
  X,
  Menu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  User as UserIcon,
  Mail,
  Lock,
  Star,
  Zap,
} from "lucide-react";
import { landingPageStyles, authStyles, modalStyles } from "../assets/dummystyle.js";
import UserContext from "../context/Usercontext.jsx";
import ProfileInfoCard from "../components/card.jsx";
import axiosInstance from "../utils/axiosinstance.js";
import { API_PATHS } from "../utils/apipath.js";

import Resume1 from "../assets/Resume1.png";
import Resume2 from "../assets/Resume2.png";
import Resume3 from "../assets/Resume3.png";

const Landingpages = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, login } = useContext(UserContext);
  const navigate = useNavigate();

  // Auth modal states
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login"); // 'login' or 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    setAuthError("");
    setAuthLoading(true);

    try {
      if (currentPage === "login") {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
          email,
          password,
        });
        login(response.data, response.data.token);
        setOpenAuthModal(false);
        navigate("/dashboard");
      } else {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          name,
          email,
          password,
        });
        login(response.data, response.data.token);
        setOpenAuthModal(false);
        navigate("/dashboard");
      }
    } catch (error) {
      setAuthError(
        error.response?.data?.message || "Authentication failed. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const switchAuthMode = (mode) => {
    setCurrentPage(mode);
    setAuthError("");
  };

  const templates = [
    {
      id: 1,
      name: "Modern Executive",
      tag: "Most Popular",
      image: Resume1,
      tagColor: "bg-violet-100 text-violet-700 border-violet-200",
    },
    {
      id: 2,
      name: "Minimalist Tech",
      tag: "ATS Optimized",
      image: Resume2,
      tagColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
      id: 3,
      name: "Creative Vanguard",
      tag: "Creative",
      image: Resume3,
      tagColor: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    },
  ];

  return (
    <div className={landingPageStyles.container}>
      {/* ── HEADER ── */}
      <header className={landingPageStyles.header}>
        <div className={landingPageStyles.headerContainer}>
          {/* Logo */}
          <div
            className={landingPageStyles.logoContainer + " cursor-pointer"}
            onClick={() => navigate("/")}
          >
            <div className={landingPageStyles.logoIcon}>
              <LayoutTemplate className={landingPageStyles.logoIconInner} />
            </div>
            <span className={landingPageStyles.logoText}>ResumeExpert</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a
              href="#templates"
              className="hover:text-white transition-colors"
            >
              Templates
            </a>
            <a
              href="#features"
              className="hover:text-white transition-colors"
            >
              Features
            </a>
            <button
              onClick={handleCTA}
              className="hover:text-white transition-colors"
            >
              Dashboard
            </button>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className={landingPageStyles.desktopAuthButton}
                onClick={() => {
                  setCurrentPage("login");
                  setOpenAuthModal(true);
                }}
              >
                <div className={landingPageStyles.desktopAuthButtonOverlay}></div>
                <span className={landingPageStyles.desktopAuthButtonText}>
                  Get Started
                </span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={landingPageStyles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className={landingPageStyles.mobileMenuIcon} />
            ) : (
              <Menu size={24} className={landingPageStyles.mobileMenuIcon} />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={landingPageStyles.mobileMenu}>
            <div className={landingPageStyles.mobileMenuContainer}>
              <a
                href="#templates"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 font-semibold py-2 hover:text-violet-400"
              >
                Templates
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 font-semibold py-2 hover:text-violet-400"
              >
                Features
              </a>

              {user ? (
                <div className={landingPageStyles.mobileUserInfo}>
                  <div className={landingPageStyles.mobileUserWelcome}>
                    Welcome back, {user.name || "User"}!
                  </div>
                  <button
                    className={landingPageStyles.mobileDashboardButton}
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <button
                  className={landingPageStyles.mobileAuthButton}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPage("login");
                    setOpenAuthModal(true);
                  }}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className={landingPageStyles.main}>
        {/* ── HERO SECTION ── */}
        <section className={landingPageStyles.heroSection}>
          <div className={landingPageStyles.heroGrid}>
            {/* Left Hero Column */}
            <div className={landingPageStyles.heroLeft}>
              <div className={landingPageStyles.tagline}>
                <Sparkles size={16} className="text-violet-600 animate-pulse" />
                <span>Professional Resume Builder</span>
              </div>

              <h1 className={landingPageStyles.heading}>
                <span className={landingPageStyles.headingText}>Craft</span>
                <span className={landingPageStyles.headingGradient}>
                  Professional
                </span>
                <span className={landingPageStyles.headingText}>Resumes</span>
              </h1>

              <p className={landingPageStyles.description}>
                Create job-winning resumes with expert, ATS-friendly designs
                tailored to land you more interviews and achieve your dream
                career goals in minutes.
              </p>

              {/* Action Buttons */}
              <div className={landingPageStyles.ctaButtons}>
                <button
                  className={landingPageStyles.primaryButton}
                  onClick={handleCTA}
                >
                  <div className={landingPageStyles.primaryButtonOverlay}></div>
                  <span className={landingPageStyles.primaryButtonContent}>
                    Start Building
                    <ArrowRight
                      className={landingPageStyles.primaryButtonIcon}
                      size={18}
                    />
                  </span>
                </button>

                <a
                  href="#templates"
                  className={landingPageStyles.secondaryButton + " text-center"}
                >
                  View Templates
                </a>
              </div>

              {/* Social Proof Stats */}
              <div className={landingPageStyles.statsContainer}>
                {[
                  {
                    value: "50K+",
                    label: "Resumes Created",
                    gradient: "from-violet-600 to-fuchsia-600",
                  },
                  {
                    value: "4.9★",
                    label: "User Rating",
                    gradient: "from-orange-500 to-red-500",
                  },
                  {
                    value: "5 Min",
                    label: "Build Time",
                    gradient: "from-emerald-500 to-teal-500",
                  },
                ].map((stat, idx) => (
                  <div className={landingPageStyles.statItem} key={idx}>
                    <div
                      className={`${landingPageStyles.statNumber} bg-gradient-to-r ${stat.gradient}`}
                    >
                      {stat.value}
                    </div>
                    <div className={landingPageStyles.statLabel}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Column: Illustration / Mockup */}
            <div className={landingPageStyles.heroIllustration}>
              <div className={landingPageStyles.heroIllustrationBg}></div>
              <div className={landingPageStyles.heroIllustrationContainer}>
                {/* Featured Mockup Card */}
                <div className="relative rounded-3xl bg-white p-3 shadow-2xl border border-slate-100 hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src={Resume1}
                    alt="Resume Preview Mockup"
                    className="w-full h-auto rounded-2xl object-cover shadow-inner"
                  />

                  {/* Floating Badges */}
                  <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md border border-violet-100 rounded-2xl p-3 shadow-xl flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        ATS Score
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        98% Match
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-md border border-violet-100 rounded-2xl p-3 shadow-xl flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white">
                      <Zap size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Status
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        Interview Ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES SECTION ── */}
        <section id="features" className={landingPageStyles.featuresSection}>
          <div className={landingPageStyles.featuresContainer}>
            <div className={landingPageStyles.featuresHeader}>
              <h2 className={landingPageStyles.featuresTitle}>
                Everything You Need to{" "}
                <span className={landingPageStyles.featuresTitleGradient}>
                  Stand Out
                </span>
              </h2>
              <p className={landingPageStyles.featuresDescription}>
                Supercharge your job application with our intuitive builder,
                expert formatting tools, and recruiter-approved templates.
              </p>
            </div>

            <div className={landingPageStyles.featuresGrid}>
              {/* Feature 1 */}
              <div className={landingPageStyles.featureCard}>
                <div className={landingPageStyles.featureCardHover}></div>
                <div
                  className={`${landingPageStyles.featureCardContent} ${landingPageStyles.featureCardViolet}`}
                >
                  <div
                    className={`${landingPageStyles.featureIconContainer} ${landingPageStyles.featureIconViolet}`}
                  >
                    <Sparkles className={landingPageStyles.featureIcon} />
                  </div>
                  <h3 className={landingPageStyles.featureTitle}>
                    Effortless Online Editor
                  </h3>
                  <p className={landingPageStyles.featureDescription}>
                    Intuitive step-by-step form editor that helps you structure
                    your experience, skills, and achievements seamlessly.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className={landingPageStyles.featureCard}>
                <div className={landingPageStyles.featureCardHover}></div>
                <div
                  className={`${landingPageStyles.featureCardContent} ${landingPageStyles.featureCardFuchsia}`}
                >
                  <div
                    className={`${landingPageStyles.featureIconContainer} ${landingPageStyles.featureIconFuchsia}`}
                  >
                    <CheckCircle2 className={landingPageStyles.featureIcon} />
                  </div>
                  <h3 className={landingPageStyles.featureTitle}>
                    100% ATS Optimized
                  </h3>
                  <p className={landingPageStyles.featureDescription}>
                    Designed following strict applicant tracking systems
                    standards so your resume sails past screening bots to real
                    recruiters.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className={landingPageStyles.featureCard}>
                <div className={landingPageStyles.featureCardHover}></div>
                <div
                  className={`${landingPageStyles.featureCardContent} ${landingPageStyles.featureCardOrange}`}
                >
                  <div
                    className={`${landingPageStyles.featureIconContainer} ${landingPageStyles.featureIconOrange}`}
                  >
                    <Download className={landingPageStyles.featureIcon} />
                  </div>
                  <h3 className={landingPageStyles.featureTitle}>
                    Instant PDF Export
                  </h3>
                  <p className={landingPageStyles.featureDescription}>
                    Download high-resolution, print-ready PDFs with clean vector
                    fonts and perfect margins with a single click.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TEMPLATES SHOWCASE SECTION ── */}
        <section id="templates" className="py-16 sm:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
                <Star size={14} className="fill-violet-700" /> Professional Templates
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Proven Designs for{" "}
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Every Career Stage
                </span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg font-medium">
                Select from our curated gallery of modern, recruiter-tested
                layouts crafted to highlight your unique strengths.
              </p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="group relative bg-slate-50 border border-slate-200 rounded-3xl p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[3/4] bg-slate-100">
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                      <button
                        onClick={handleCTA}
                        className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-violet-50 transition-colors text-sm"
                      >
                        Use This Template
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {tpl.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tpl.tagColor}`}
                    >
                      {tpl.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION SECTION ── */}
        <section className={landingPageStyles.ctaSection}>
          <div className={landingPageStyles.ctaContainer}>
            <div className={landingPageStyles.ctaCard}>
              <div className={landingPageStyles.ctaCardBg}></div>
              <div className={landingPageStyles.ctaCardContent}>
                <h2 className={landingPageStyles.ctaTitle}>
                  Ready to Land Your{" "}
                  <span className={landingPageStyles.ctaTitleGradient}>
                    Dream Job?
                  </span>
                </h2>
                <p className={landingPageStyles.ctaDescription}>
                  Join over 50,000 professionals who transformed their job search
                  and accelerated their careers with ResumeExpert today.
                </p>
                <button
                  className={landingPageStyles.ctaButton}
                  onClick={handleCTA}
                >
                  <div className={landingPageStyles.ctaButtonOverlay}></div>
                  <span className={landingPageStyles.ctaButtonText}>
                    Build Your Resume Now
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className={landingPageStyles.footer}>
        <div className={landingPageStyles.footerContainer}>
          <p className={landingPageStyles.footerText}>
            © {new Date().getFullYear()} ResumeExpert. Built with{" "}
            <span className={landingPageStyles.footerHeart}>♥</span> for job
            seekers worldwide.
          </p>
        </div>
      </footer>

      {/* ── AUTH MODAL (LOGIN / REGISTER) ── */}
      {openAuthModal && (
        <div className={modalStyles.overlay}>
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setOpenAuthModal(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-xl z-20 transition-all"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div
              className={
                currentPage === "login"
                  ? authStyles.container
                  : authStyles.signupContainer
              }
            >
              {/* Header */}
              <div className={authStyles.headerWrapper}>
                <h2
                  className={
                    currentPage === "login"
                      ? authStyles.title
                      : authStyles.signupTitle
                  }
                >
                  {currentPage === "login"
                    ? "Welcome Back"
                    : "Create an Account"}
                </h2>
                <p
                  className={
                    currentPage === "login"
                      ? authStyles.subtitle
                      : authStyles.signupSubtitle
                  }
                >
                  {currentPage === "login"
                    ? "Log in to access your resumes"
                    : "Start building your job-winning resume"}
                </p>
              </div>

              {/* Error Message */}
              {authError && (
                <div className={authStyles.errorMessage + " mb-4"}>
                  {authError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className={authStyles.form}>
                {currentPage === "signup" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative flex items-center bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 transition-all">
                      <UserIcon size={18} className="text-slate-400 mr-2.5" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative flex items-center bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 transition-all">
                    <Mail size={18} className="text-slate-400 mr-2.5" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative flex items-center bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200 transition-all">
                    <Lock size={18} className="text-slate-400 mr-2.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className={
                    currentPage === "login"
                      ? authStyles.submitButton
                      : authStyles.signupSubmit
                  }
                >
                  {authLoading
                    ? "Please wait..."
                    : currentPage === "login"
                    ? "Sign In"
                    : "Create Account"}
                </button>
              </form>

              {/* Switch Auth Mode */}
              <div className={authStyles.switchText + " mt-6"}>
                {currentPage === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchAuthMode("signup")}
                      className={authStyles.switchButton}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchAuthMode("login")}
                      className={authStyles.signupSwitchButton}
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landingpages;