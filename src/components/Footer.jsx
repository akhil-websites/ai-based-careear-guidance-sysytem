import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      {/* Company Branding & About */}
      <div className="footer-section footer-about">
        <h2 className="footer-title">AI Career Assistant</h2>
        <p className="footer-description">
          Helping job seekers and students find the best career opportunities with AI-driven recommendations.
        </p>
      </div>
      
      {/* Quick Links */}
      <div className="footer-section footer-links">
        <h3 className="footer-subtitle">Quick Links</h3>
        <ul className="footer-list">
          <li><Link to="/" className="footer-link">Home</Link></li>
          <li><Link to="/jobs" className="footer-link">Job & Internship Finder</Link></li>
          <li><Link to="/course" className="footer-link">Courses</Link></li>
          <li><Link to="/resume-analysis" className="footer-link">Resume Analysis</Link></li>
          <li><Link to="/skill-gap" className="footer-link">Skill Gap Analysis</Link></li>
          <li><Link to="/career-insights" className="footer-link">Career Insights</Link></li>
          <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
        </ul>
      </div>
      
      {/* User Resources */}
      <div className="footer-section footer-resources">
        <h3 className="footer-subtitle">User Resources</h3>
        <ul className="footer-list">
          <li><Link to="/faqs" className="footer-link">FAQs</Link></li>
          <li><Link to="/blog" className="footer-link">Career Blog</Link></li>
          <li><Link to="/help-center" className="footer-link">Help Center</Link></li>
        </ul>
      </div>
      
      {/* Legal & Policies */}
      <div className="footer-section footer-legal">
        <h3 className="footer-subtitle">Legal & Policies</h3>
        <ul className="footer-list">
          <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
          <li><Link to="/terms-of-service" className="footer-link">Terms of Service</Link></li>
          <li><Link to="/cookie-policy" className="footer-link">Cookie Policy</Link></li>
        </ul>
      </div>
      
      {/* Social Media Links */}
      <div className="footer-section footer-social">
        <h3 className="footer-subtitle">Follow Us</h3>
        <div className="footer-social-icons">
          <a href="#" target="_blank" className="footer-social-link"><Linkedin size={20} /></a>
          <a href="#" target="_blank" className="footer-social-link"><Twitter size={20} /></a>
          <a href="#" target="_blank" className="footer-social-link"><Facebook size={20} /></a>
          <a href="#" target="_blank" className="footer-social-link"><Instagram size={20} /></a>
        </div>
      </div>
      
      {/* Newsletter Subscription */}
      <div className="footer-section footer-newsletter">
        <h3 className="footer-subtitle">Subscribe for Updates</h3>
        <input type="email" className="footer-input" placeholder="Enter your email" />
        <button className="footer-button">Subscribe</button>
      </div>
      
      {/* Contact Information */}
      <div className="footer-section footer-contact">
        <h3 className="footer-subtitle">Contact Us</h3>
        <p className="footer-contact-info"><Mail size={16} /> support@yourdomain.com</p>
        <p className="footer-contact-info"><Phone size={16} /> +91 XXXXXXXXXX</p>
        <p className="footer-contact-info"><MapPin size={16} /> Your Address Here</p>
      </div>
      
      {/* Copyright Notice */}
      <div className="footer-bottom">
        <p className="footer-copyright">&copy; 2024 AI Career Assistant. All rights reserved.</p>
      </div>
    </footer>
  );
}
