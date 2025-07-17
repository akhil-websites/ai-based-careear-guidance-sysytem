import React, { useState } from "react";
import "./CareerRoadmap.css";

const CareerRoadmapGenerator = () => {
  const [careerGoal, setCareerGoal] = useState("");
  const [skills, setSkills] = useState("");
  const [industry, setIndustry] = useState("");
  const [education, setEducation] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [roadmap, setRoadmap] = useState(null);

  const generateRoadmap = async () => {
    if (!careerGoal || !skills || !industry || !education || !learningStyle) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/generate_roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          career: careerGoal,
          skills,
          industry,
          education,
          learning_style: learningStyle,
        }),
      });

      const data = await response.json();
      setRoadmap(data.roadmap);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      alert("Failed to fetch roadmap. Please try again.");
    }
  };

  return (
    <div className="career-roadmap-container">
      <h2>Career Roadmap Generator 🚀</h2>

      <div className="input-section">
        <label>🎯 Career Goal:</label>
        <input type="text" placeholder="e.g., Data Scientist" value={careerGoal} onChange={(e) => setCareerGoal(e.target.value)} />

        <label>🛠 Skills You Have:</label>
        <input type="text" placeholder="e.g., Python, SQL" value={skills} onChange={(e) => setSkills(e.target.value)} />

        <label>🏢 Preferred Industry:</label>
        <input type="text" placeholder="e.g., Tech, Finance" value={industry} onChange={(e) => setIndustry(e.target.value)} />

        <label>🎓 Education Level & Certifications:</label>
        <input type="text" placeholder="e.g., Bachelor's, Bootcamp" value={education} onChange={(e) => setEducation(e.target.value)} />

        <label>📚 Preferred Learning Style:</label>
        <select value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)}>
          <option value="">Select...</option>
          <option value="Online Courses">Online Courses</option>
          <option value="Bootcamps">Bootcamps</option>
          <option value="Self-Learning">Self-Learning</option>
          <option value="University Degree">University Degree</option>
        </select>

        <button className="generate-btn" onClick={generateRoadmap}>Generate Roadmap 🚀</button>
      </div>

      {roadmap && (
        <div className="roadmap-display">
          <h3>📍 Your Personalized Career Roadmap</h3>
          <p>{roadmap}</p>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmapGenerator;
