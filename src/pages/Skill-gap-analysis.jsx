import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./skillgap.css";
import app from "../firebase";

const SkillGapAnalysis = () => {
  const db = getDatabase(app);
  const auth = getAuth(app);

  const [userSkills, setUserSkills] = useState([]);
  const [targetJob, setTargetJob] = useState("");
  const [jobSkills, setJobSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [readinessScore, setReadinessScore] = useState(0);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userRef = ref(db, `users/${auth.currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setTargetJob(userData.selectedJob || "");
          setUserSkills(userData.skills ? userData.skills.split(",").map(skill => skill.trim().toLowerCase()) : []);
          setCompletedCourses(Array.isArray(userData.completedCourses) ? userData.completedCourses : []);
        }
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [auth, db]);

  useEffect(() => {
    if (!targetJob) return;

    const fetchJobSkills = async () => {
      const jobRef = ref(db, "skills");
      const snapshot = await get(jobRef);

      if (snapshot.exists()) {
        const jobData = snapshot.val();
        console.log("Fetched Job Data:", jobData);

        const jobEntry = Object.values(jobData).find(job => job["JOB TITLE"]?.toLowerCase().trim() === targetJob.toLowerCase().trim());

        if (jobEntry && jobEntry["SKILLS"]) {
          let skillArray = jobEntry["SKILLS"].split(",").map(skill => skill.trim().toLowerCase());
          console.log("Extracted Job Skills:", skillArray);
          setJobSkills(skillArray);
        } else {
          console.log("No skills found for this job title.");
          setJobSkills([]);
        }
      } else {
        console.log("No job skills found in database.");
        setJobSkills([]);
      }
    };

    fetchJobSkills();
  }, [targetJob, db]);

  useEffect(() => {
    if (userSkills.length && jobSkills.length) {
      const missing = jobSkills.filter(skill => !userSkills.includes(skill));
      setMissingSkills(missing);
      setReadinessScore(((jobSkills.length - missing.length) / jobSkills.length * 100).toFixed(2));
    }
  }, [userSkills, jobSkills]);

  useEffect(() => {
    if (!missingSkills.length) return;

    const fetchCourses = async () => {
      const coursesRef = ref(db, "courses");
      const snapshot = await get(coursesRef);

      if (snapshot.exists()) {
        const allCourses = Object.values(snapshot.val());

        // Convert missing skills to lowercase for accurate comparison
        const missingSkillsLower = missingSkills.map(skill => skill.toLowerCase());

        const filteredCourses = allCourses
          .map(course => ({
            ...course,
            matchedSkills: missingSkillsLower.filter(skill =>
              course["Programming Language"]?.toLowerCase().includes(skill)
            )
          }))
          .filter(course => course.matchedSkills.length > 0) // Ensure there's at least one match
          .sort((a, b) => b.matchedSkills.length - a.matchedSkills.length); // Prioritize courses with more matches

        setRecommendedCourses(filteredCourses);
      }
    };

    fetchCourses();
  }, [missingSkills, db]);

  return (
    <div className="skill-gap-analysis-container">
      <section className="skill-gap-hero">
        <h1>🔍 Skill Gap Analysis</h1>
        <p>Identify missing skills & bridge the gap for your dream career.</p>
      </section>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <section className="skill-gap-comparison">
            <h2>Skill Gap Analysis for {targetJob || "your selected job"}</h2>
            <p><strong>Your Skills:</strong> {userSkills.length > 0 ? userSkills.join(", ") : "No skills added"}</p>
            <p><strong>Required Skills:</strong> {jobSkills.length > 0 ? jobSkills.join(", ") : "Fetching..."}</p>
            <p><strong>Missing Skills:</strong> {missingSkills.length > 0 ? missingSkills.join(", ") : "None! You're ready!"}</p>
          </section>

          <section className="skill-gap-readiness">
            <h2>Job Readiness Score</h2>
            <p>{readinessScore}% Ready</p>
          </section>

          <section className="skill-gap-recommended-courses">
            <h2>Recommended Learning Resources</h2>
            <ul>
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map((course, index) => (
                  <li key={index}>
                    <strong>Programming Language:</strong> {course["Programming Language"]} <br />
                    📚 <a href={course["Coursera Course Link"]} target="_blank" rel="noopener noreferrer">Coursera</a> |
                    🎓 <a href={course["Great Learning Course Link"]} target="_blank" rel="noopener noreferrer">Great Learning</a> |
                    📖 <a href={course["Udemy Course Link"]} target="_blank" rel="noopener noreferrer">Udemy</a>
                  </li>
                ))
              ) : (
                <p className="no-courses-message">🎉 No additional courses needed! You're on the right track!</p>
              )}
            </ul>
          </section>

          <section className="skill-gap-completed-courses">
            <h2>Completed Courses</h2>
            <ul>
              {completedCourses.length > 0 ? (
                completedCourses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))
              ) : (
                <p>You haven't completed any courses yet.</p>
              )}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default SkillGapAnalysis;
