import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

export default function Homepage() {
  const [stats, setStats] = useState({
    users: 12543,
    jobs: 98432,
    resumes: 23410,
    hires: 4829,
    visits: 150000,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) => ({
        users: prevStats.users + Math.floor(Math.random() * 5),
        jobs: prevStats.jobs + Math.floor(Math.random() * 10),
        resumes: prevStats.resumes + Math.floor(Math.random() * 3),
        hires: prevStats.hires + Math.floor(Math.random() * 2),
        visits: prevStats.visits + Math.floor(Math.random() * 20),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <h1>🚀 Find Your Dream Job with AI-Powered Precision!</h1>
        <p>AI-driven recommendations tailored just for you. Find jobs & internships effortlessly!</p>
        <div className="cta-buttons">
          <Link to="/signup" className="cta">Get Started</Link>
          <Link to="/resume-analysis" className="cta upload">Upload Resume for AI Analysis</Link>
        </div>
      </section>

      {/* Auto-Incrementing Statistics Section */}
      <section className="stats">
        <div className="stat-item">👥 Total Users Registered: {stats.users}+</div>
        <div className="stat-item">🔍 Jobs & Internships Available: {stats.jobs}+</div>
        <div className="stat-item">📄 Resumes Analyzed: {stats.resumes}+</div>
        <div className="stat-item">🎯 Users Successfully Hired: {stats.hires}+</div>
        <div className="stat-item">👀 Website Visits: {stats.visits}+</div>
      </section>

      {/* AI-Powered Job & Internship Finder */}
      <section className="job-finder2">
        <h2>🔍 Find Your Perfect Job or Internship</h2>
        <input type="text" placeholder="Job Role / Internship Title" />
        <input type="text" placeholder="Location (Remote, Hybrid, City-based)" />
        <input type="text" placeholder="Industry / Category" />
        <input type="text" placeholder="Experience Level" />
        <button>Search Jobs</button>
      </section>

      {/* Resume & Profile Optimization */}
      <section className="resume-optimization">
        <h2>🟢 Optimize Your Resume</h2>
        <p>Upload your resume for instant feedback and job matches.</p>
        <Link to="/resume-analysis" className="cta upload">Upload Resume</Link>
      </section>

      {/* Skill Gap Analysis & Learning Resources */}
      <section className="skill-gap-analysis">
        <h2>📊 Identify & Improve Your Skills</h2>
        <p>Get AI-powered recommendations to upgrade your skills.</p>
        <Link to="/skill-gap" className="cta">Upgrade Your Skills</Link>
      </section>

     <section className="testimonials">
  <h2>🎉 Success Stories</h2>
  <div className="carousel">
    <div className="testimonial-item">
      <img src="/images/akhil.jpg" alt="Akhil Vithanala" />
      <p>🟢 "Akhil Vithanala landed a Software Engineer role at Google using our AI career assistant!"</p>
    </div>
    <div className="testimonial-item">
      <img src="/images/priya.jpg" alt="Priya Sharma" />
      <p>🟢 "Priya Sharma got her dream internship at Microsoft after resume optimization!"</p>
    </div>
  </div>
</section>


      {/* Featured & Popular Jobs */}
      <section className="featured-jobs">
        <h2>🔥 Featured Jobs</h2>
        <p>Check out trending job opportunities.</p>
      </section>

      {/* Blog & Career Insights */}
      <section className="career-blog">
        <h2>📝 Career Insights</h2>
        <p>Stay updated with the latest job trends and career tips.</p>
        <Link to="/career-insights" className="cta">Explore More Articles</Link>
      </section>

      {/* AI Chatbot for Career Guidance */}
      <section className="chatbot">
        <h2>💬 AI Career Assistant</h2>
        <p>Ask career-related questions and get instant AI-powered suggestions.</p>
      </section>

      {/* Call to Action */}
      <section className="call-to-action">
        <h2>🟢 Ready to Find Your Dream Job?</h2>
        <div className="cta-buttons">
          <Link to="/signup" className="cta">Get Started</Link>
          <Link to="/resume-analysis" className="cta upload">Upload Resume</Link>
        </div>
      </section>
    </div>
  );
}
