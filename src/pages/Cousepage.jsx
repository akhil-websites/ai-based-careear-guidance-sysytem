import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./CoursePage.css";
import app from "../firebase";

const CoursePage = () => {
  const db = getDatabase(app);
  const auth = getAuth(app);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const fetchUserJobTitle = async () => {
      if (auth.currentUser) {
        const userRef = ref(db, `users/${auth.currentUser.uid}/selectedJob`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setJobTitle(snapshot.val().toLowerCase());
        }
      }
    };
    fetchUserJobTitle();
  }, [auth, db]);

  useEffect(() => {
    const fetchRequiredSkills = async () => {
      if (!jobTitle) return;
      const skillsRef = ref(db, "skills");
      const snapshot = await get(skillsRef);
      if (snapshot.exists()) {
        const skillData = Object.values(snapshot.val()).find(
          (job) => job["JOB TITLE"].toLowerCase() === jobTitle
        );
        if (skillData) {
          setRequiredSkills(
            skillData["SKILLS"].split(",").map((skill) => skill.trim())
          );
        }
      }
    };
    fetchRequiredSkills();
  }, [jobTitle, db]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesRef = ref(db, "courses");
      const snapshot = await get(coursesRef);
      if (snapshot.exists()) {
        const courseData = Object.values(snapshot.val()).map((course) => ({
          ...course,
          ["Difficulty Level"]: course["Difficulty Level"] || difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)],
        }));

        setCourses(courseData);

        const filtered = courseData.filter((course) =>
          requiredSkills.some((skill) =>
            course["Programming Language"]?.toLowerCase().includes(skill.toLowerCase())
          )
        );
        setFilteredCourses(filtered);
      }
    };
    if (requiredSkills.length > 0) fetchCourses();
  }, [requiredSkills, db]);

  return (
    <div className="course-page-container">
      {/* Hero Section */}
      <section className="course-hero-section">
        <h1 className="course-hero-heading">🚀 Enhance Your Skills with Top Courses</h1>
        <p className="course-hero-description">
          Discover the best courses tailored for your career in {jobTitle ? jobTitle.toUpperCase() : "your selected job"}.
        </p>
      </section>

      <h2 className="course-section-heading">Courses for {jobTitle ? jobTitle.toUpperCase() : "your selected job"}</h2>
      <p className="course-required-skills"><strong>Required Skills:</strong> {requiredSkills.join(", ")}</p>

      {filteredCourses.length > 0 ? (
        <ul className="course-list-container">
          {filteredCourses.map((course, index) => (
            <li key={index} className="course-list-item">
              <h3 className="course-title">{course["Programming Language"]} Course</h3>
              <p className="course-difficulty"><strong>Difficulty Level:</strong> {course["Difficulty Level"]}</p>
              <p className="course-skills"><strong>Skills Covered:</strong> {course["Programming Language"]}</p>

              <div className="course-links">
                {course["Coursera Course Link"] && (
                  <a
                    className="course-link coursera"
                    href={course["Coursera Course Link"]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Coursera
                  </a>
                )}
                {course["Great Learning Course Link"] && (
                  <a
                    className="course-link greatlearning"
                    href={course["Great Learning Course Link"]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Great Learning
                  </a>
                )}
                {course["Udemy Course Link"] && (
                  <a
                    className="course-link udemy"
                    href={course["Udemy Course Link"]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Udemy
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-course-message">No courses found for this job title.</p>
      )}
    </div>
  );
};

export default CoursePage;
