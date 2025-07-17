import React, { useState } from "react";
import "./CareerComparisons.css";

const CareerComparisons = () => {
  const [career1, setCareer1] = useState("");
  const [career2, setCareer2] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const compareCareers = async () => {
    if (!career1 || !career2 || !industry || !experience) {
      alert("Please enter all fields before comparing careers.");
      return;
    }

    setLoading(true);
    setError("");
    setComparisonData(null);

    try {
      const response = await fetch("http://localhost:5000/compare_careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career1, career2, industry, experience }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setComparisonData(data.comparison);
      }
    } catch (err) {
      setError("Error fetching career comparison data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-comparison-main-container">
      <h2 className="career-comparison-title">AI-Powered Career Comparisons 🚀</h2>

      <div className="career-selection-box">
        <input type="text" className="career-input-one" placeholder="Enter Career 1" value={career1} onChange={(e) => setCareer1(e.target.value)} />
        <input type="text" className="career-input-two" placeholder="Enter Career 2" value={career2} onChange={(e) => setCareer2(e.target.value)} />
        
        <select className="career-industry-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="">Select Industry</option>
          <option value="Tech">Tech</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
        </select>

        <select className="career-experience-select" value={experience} onChange={(e) => setExperience(e.target.value)}>
          <option value="">Select Experience Level</option>
          <option value="Entry-Level">Entry-Level</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior-Level">Senior-Level</option>
        </select>

        <button className="career-compare-btn" onClick={compareCareers} disabled={loading}>
          {loading ? "Comparing..." : "Compare Careers 🔍"}
        </button>
      </div>

      {error && <p className="career-error-message">❌ {error}</p>}

      {comparisonData && (
        <div className="career-comparison-table">
          <h3 className="career-comparison-subtitle">📊 AI-Generated Career Comparison</h3>
          <table className="career-comparison-results">
            <thead>
              <tr>
                <th>Category</th>
                <th>{career1}</th>
                <th>{career2}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(comparisonData).map(([category, details], index) => (
                <tr key={index}>
                  <td>{category}</td>
                  <td>{details || "N/A"}</td>
                  <td>{details || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CareerComparisons;
