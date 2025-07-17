import React, { useState } from "react";
import "./CoverLetterGenerator.css";

const CoverLetterGenerator = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedIn: "",
    jobTitle: "",
    workExperience: "",
    skills: "",
    education: "",
    jobCompany: "",
    jobDescription: "",
  });

  const [generatedLetter, setGeneratedLetter] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate_cover_letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setGeneratedLetter(data.cover_letter || "Error generating cover letter.");
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setGeneratedLetter("An error occurred while generating the cover letter.");
    }
  };

  return (
    <div className="cover-letter-container">
      <div className="input-panel">
        <h2>Enter Your Details</h2>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
        <input type="text" name="linkedIn" placeholder="LinkedIn Profile" value={formData.linkedIn} onChange={handleChange} />
        <h3>Job Details</h3>
        <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} />
        <input type="text" name="jobCompany" placeholder="Company Name" value={formData.jobCompany} onChange={handleChange} />
        <textarea name="jobDescription" placeholder="Job Description" value={formData.jobDescription} onChange={handleChange} />
        <button onClick={handleSubmit} className="submit-btn">🚀 Submit</button>
      </div>
      <div className="preview-panel">
        <h2>Cover Letter Preview</h2>
        <div className="cover-letter-box">
          <pre>{generatedLetter || "Your cover letter will appear here..."}</pre>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
