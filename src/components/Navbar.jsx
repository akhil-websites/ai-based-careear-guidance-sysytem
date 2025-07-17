import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";
import { User } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* Logo Title (Text-Based) */}
      <Link to="/" className="navbar-logo">AI-Based Career Guidance</Link>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
        </li>

        {!user ? (
          <>
            <li>
              <Link to="/signup" className={location.pathname === "/signup" ? "active" : ""}>
                Signup
              </Link>
            </li>
            <li>
              <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
                Login
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/jobs" className={location.pathname === "/jobs" ? "active" : ""}>
                Job & Internship Finder
              </Link>
            </li>
            <li>
              <Link to="/course" className={location.pathname === "/course" ? "active" : ""}>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/resume-analysis" className={location.pathname === "/resume-analysis" ? "active" : ""}>
                Resume Analysis
              </Link>
            </li>
            <li>
              <Link to="/skill-gap" className={location.pathname === "/skill-gap" ? "active" : ""}>
                Skill Gap Analysis
              </Link>
            </li>
            <li>
              <Link to="/career-insights" className={location.pathname === "/career-insights" ? "active" : ""}>
                Career Insights
              </Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
                <User size={16} /> Profile
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
                  Admin
                </Link>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}
