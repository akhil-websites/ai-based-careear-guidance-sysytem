import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ResumeAnalysis.css";

const ResumeAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);
  const [resumesAnalyzed, setResumesAnalyzed] = useState(5000);
  const [jobsSecured, setJobsSecured] = useState(2000);
  const [liveUsers, setLiveUsers] = useState(100);
  const navigate = useNavigate(); // Initialize navigate




  useEffect(() => {
    const interval = setInterval(() => {
      setResumesAnalyzed((prev) => prev + Math.floor(Math.random() * 5));
      setJobsSecured((prev) => prev + Math.floor(Math.random() * 2));
      setLiveUsers((prev) => Math.max(50, prev + Math.floor(Math.random() * 5 - 2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("⚠️ Please select a resume to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      console.log("✅ API Response Data:", data);

      // Ensure extracted data is properly formatted
      setAnalysisResult({
        name: data?.["Full Name"] || "Not Available",
        email: data?.["Email"] || "Not Available",
        phone: data?.["Phone"] || "Not Available",
        linkedin: data?.["LinkedIn"] || "Not Available",
        skills: Array.isArray(data?.["Skills"]) && data["Skills"].length > 0 ? data["Skills"] : ["Not Available"],
        certifications: Array.isArray(data?.["Certifications"]) && data["Certifications"].length > 0 ? data["Certifications"] : ["Not Available"],
        education: data?.["Latest Education"] || "Not Available",
        experience: data?.["Latest Experience"] || "Not Available",
        projects: Array.isArray(data?.["Projects"]) && data["Projects"].length > 0 ? data["Projects"] : ["Not Available"],
        ai_score: typeof data?.["AI Score"] === "number" ? data["AI Score"] : "N/A",
      });

      // Handle job matches
      setJobMatches(Array.isArray(data?.job_matches) ? data.job_matches : []);
    } catch (error) {
      console.error("❌ Error processing resume:", error);
      alert("⚠️ Failed to process the resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="resume-analysis">
      <section className="hero">
        <h1>🚀 Boost Your Resume with AI-Powered Analysis!</h1>
        <p>Upload your resume and get AI-driven insights to improve your chances of landing your dream job.</p>
      </section>

      <section className="upload-section">
        <h2>📄 Upload Your Resume</h2>
        <div className="upload-box">
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
        </div>
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "⏳ Analyzing..." : "📤 Upload & Analyze"}
        </button>
      </section>

      {analysisResult && (
        <section className="analysis-output">
          <h2>📊 Resume Analysis Results</h2>
          <p><strong>Full Name:</strong> {analysisResult.name}</p>
          <p><strong>Email:</strong> {analysisResult.email}</p>
          <p><strong>Phone:</strong> {analysisResult.phone}</p>
          <p>
            <strong>LinkedIn:</strong>{" "}
            {analysisResult.linkedin !== "Not Available" ? (
              <a href={analysisResult.linkedin} target="_blank" rel="noopener noreferrer">
                {analysisResult.linkedin}
              </a>
            ) : (
              "Not Available"
            )}
          </p>
          <p><strong>Skills:</strong> {analysisResult.skills.join(", ")}</p>
          <p><strong>Certifications:</strong> {analysisResult.certifications.join(", ")}</p>
          <p><strong>Latest Education:</strong> {analysisResult.education}</p>
          <p><strong>Latest Experience:</strong> {analysisResult.experience}</p>
          <p><strong>Projects:</strong> {analysisResult.projects.join(", ")}</p>
          <h3>⭐ Final Resume Score: <span className="resume-score">{analysisResult.ai_score}/100</span></h3>
        </section>
      )}

      <section className="job-matches">
        <h2>🎯 Job Matches for You</h2>
        <div className="job-listings">
          {jobMatches.length > 0 ? (
            jobMatches.map((job, index) => (
              <div key={index} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <a href={job.link} target="_blank" rel="noopener noreferrer">Apply Now</a>
              </div>
            ))
          ) : (
            <p>🔍 No job matches found yet.</p>
          )}
        </div>
      </section>

      <div className="stats-container">
        <div className="stat-box">📊 {resumesAnalyzed}+ Resumes Analyzed</div>
        <div className="stat-box">🎯 {jobsSecured}+ Users Landed Jobs</div>
        <div className="stat-box">👥 {liveUsers} Live Users Now</div>
      </div>

      <section className="faq-container">
        <h2>❓ FAQ & Help</h2>
        <div className="faq-item"><h4>🧐 How does AI improve my resume?</h4><p>AI analyzes structure, keywords, grammar, and ATS compatibility.</p></div>
        <div className="faq-item"><h4>📥 Can I download my improved resume?</h4><p>Yes! You can download it in PDF or DOCX format.</p></div>
        <div className="faq-item"><h4>🔒 Is my data secure?</h4><p>Absolutely. We do not store personal data permanently.</p></div>
      </section>

      <section className="chatbot-container">
        <h3>🤖 AI Chatbot - Resume Help</h3>
        <button onClick={() => navigate("/chatbot")}>Chat with AI</button>
      </section>

      <section className="ats-container">
        <h3>📑 ATS Compatibility Checker</h3>
        <button onClick={() => navigate("/ats-checker")}>Check Resume</button>
      </section>

      <section className="cover-container">
      <h3>📝 AI Cover Letter Generator</h3>
      <button onClick={() => navigate("/cover-letter")}>Generate Cover Letter</button>
    </section>
    </div>
  );
};

export default ResumeAnalysis;
