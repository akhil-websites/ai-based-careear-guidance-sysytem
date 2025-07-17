import React, { useState, useEffect } from "react";
import "./CareerInsights.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const CareerInsights = () => {
  const [jobTrends, setJobTrends] = useState([]);
  const [salaryInsights, setSalaryInsights] = useState([]);
  const [skillDemand, setSkillDemand] = useState([]);
  const [careerComparison, setCareerComparison] = useState(null);
  const [careerRoadmap, setCareerRoadmap] = useState([]);
  const [companyInsights, setCompanyInsights] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [liveStats, setLiveStats] = useState({ careerInsights: 50000, trendingJobs: "AI Engineer +20%", careerChanges: 10000 });
  const [quizResult, setQuizResult] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  

  useEffect(() => {
    setJobTrends([
      "AI & Cybersecurity are booming!",
      "Remote work is increasing in demand",
      "Data Science jobs are growing at 35% per year"
    ]);

    setSalaryInsights([
      { role: "Software Engineer", location: "USA", avgSalary: "$120,000", growth: "+15%" },
      { role: "Data Scientist", location: "USA", avgSalary: "$130,000", growth: "+20%" }
    ]);

    setSkillDemand([
      "Python for AI",
      "Cloud Computing",
      "Blockchain Development"
    ]);
  }, []);

  

 

  return (
    
    <div className="career-insights">
      <section className="hero">
        <h1>🚀 Boost Your Career with AI-Powered Analysis!</h1>
        <p>Follow Our Ai Suggestions To improve your future.</p>
      </section>

      {/* ✅ Job Market Trends */}
      <section className="job-market-trends">
        <h2>Job Market Trends 📈</h2>
        <ul>
          {jobTrends.map((trend, index) => (
            <li key={index}>{trend}</li>
          ))}
        </ul>
      </section>

      {/* ✅ Salary Insights */}
      <section className="salary-insights">
        <h2>Salary Insights 💰</h2>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Location</th>
              <th>Average Salary</th>
              <th>Growth Rate</th>
            </tr>
          </thead>
          <tbody>
            {salaryInsights.map((insight, index) => (
              <tr key={index}>
                <td>{insight.role}</td>
                <td>{insight.location}</td>
                <td>{insight.avgSalary}</td>
                <td>{insight.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ✅ Industry & Skill Demand Analysis */}
      <section className="skill-demand">
        <h2>Industry & Skill Demand Analysis 🏭</h2>
        <ul>
          {skillDemand.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      {/* ✅ AI-Powered Career Comparisons */}
      <section className="career-comparison">
        <h2>AI-Powered Career Comparisons 🤖</h2>
        <button onClick={() => navigate("/careercomparisons")}>Compare Data Scientist vs. Software Engineer</button>
      </section>

      {/* ✅ Career Roadmap Generator */}
      <section className="career-roadmap">
        <h2>Career Roadmap Generator 🛤️</h2>
        <button onClick={() => navigate("/careerroadmap")}>Generate Career Roadmap</button>
        <ul>
          {careerRoadmap.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </section>
       {/* ✅ Career Success Stories */}
       <section className="career-success-stories">
        <h2>Career Success Stories 🚀</h2>
        <ul>
          <li>"From Customer Support to Data Science in 6 Months!"</li>
          <li>"Switched from Marketing to Software Engineering and landed a job at Google!"</li>
        </ul>
      </section>

      {/* ✅ Auto-Updating Live Stats */}
      <section className="live-stats">
        <h2>Auto-Updating Live Stats 📊</h2>
        <p>Total Career Insights Generated: {liveStats.careerInsights}</p>
        <p>Trending Jobs This Month: {liveStats.trendingJobs}</p>
        <p>Users Who Successfully Changed Careers: {liveStats.careerChanges}</p>
      </section>

      {/* ✅ AI-Powered Career Quiz */}
      <section className="career-quiz">
        <h2>AI-Powered Career Quiz 🔥</h2>
        <button onClick={() => navigate("/careerquiz")}>Take Quiz</button>
        {quizResult && <p>{quizResult}</p>}
      </section>

      {/* ✅ Real-Time Job Alerts */}
      <section className="job-alerts">
        <h2>Real-Time Job Alerts 🚀</h2>
        <button>Enable Job Alerts</button>
      </section>

      {/* ✅ LinkedIn & Resume Optimization Tips */}
      <section className="optimization-tips">
        <h2>LinkedIn & Resume Optimization Tips</h2>
        <ul>
          <li>Use industry keywords in your LinkedIn headline</li>
          <li>Optimize your resume with job-specific skills</li>
          <li>Engage with industry posts and share insights</li>
        </ul>
      </section>
    </div>
  );
};

export default CareerInsights;
