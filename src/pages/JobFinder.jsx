import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./JobFinder.css";
import app from "../firebase";

const JobFinder = () => {
  const db = getDatabase(app);
  const auth = getAuth(app);
  const [jobListings, setJobListings] = useState([]);
  const [internshipListings, setInternshipListings] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user's selected job title
  useEffect(() => {
    const fetchUserJobTitle = async () => {
      if (auth.currentUser) {
        const userRef = ref(db, `users/${auth.currentUser.uid}/selectedJob`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setJobTitle(snapshot.val().toLowerCase().trim());
        }
      }
    };
    fetchUserJobTitle();
  }, [auth, db]);

  // Fetch and filter listings
  useEffect(() => {
    if (!jobTitle) return;
    setLoading(true);

    const fetchListings = async (path, setListings, isInternship = false) => {
      const listingsRef = ref(db, path);
      const snapshot = await get(listingsRef);

      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());

        const filtered = data.filter((item) => {
          const jobRole =
            (item["Job Role"] || item.jobRole || item.JobRole || "").toLowerCase();
          return jobRole.includes(jobTitle); // partial and case-insensitive match
        });

        setListings(filtered);
      } else {
        setListings([]);
      }

      setLoading(false);
    };

    fetchListings("jobs", setJobListings);
    fetchListings("internships", setInternshipListings, true);
  }, [jobTitle, db]);

  return (
    <div className="job-finder-page-container">
      <section className="job-finder-hero">
        <h1 className="hero-heading">🚀 Boost Your Job Chance with AI-Powered Job Search!</h1>
        <p className="hero-description">Find the best jobs and internships based on your career choice.</p>
      </section>

      {loading ? (
        <p className="loading-message">Loading job listings...</p>
      ) : (
        <>
          {/* Jobs Section */}
          <section className="job-listings-section">
            <h2 className="job-listings-heading">
              Job Listings for {jobTitle.toUpperCase()} 💼
            </h2>
            {jobListings.length > 0 ? (
              <ul className="job-listings-list">
                {jobListings.map((job, index) => (
                  <li key={index} className="job-listing-item">
                    <h3 className="job-title">{job.Title}</h3>
                    <p><strong>Company:</strong> {job.Company}</p>
                    <p><strong>Location:</strong> {job.Location}</p>
                    <p><strong>Salary:</strong> ₹{job.Salary}</p>
                    <p><strong>Description:</strong> {job.Description}</p>
                    <p><strong>Role:</strong> {job["Job Role"] || job.jobRole}</p>
                    <a
                      className="job-apply-link"
                      href={job.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-job-listings-message">No job openings available for this role.</p>
            )}
          </section>

          {/* Internships Section */}
          <section className="internship-listings-section">
            <h2 className="internship-listings-heading">
              Internship Listings for {jobTitle.toUpperCase()} 🎓
            </h2>
            {internshipListings.length > 0 ? (
              <ul className="internship-listings-list">
                {internshipListings.map((internship, index) => (
                  <li key={index} className="internship-listing-item">
                    <h3 className="internship-title">{internship.Title}</h3>
                    <p><strong>Company:</strong> {internship.Company}</p>
                    <p><strong>Location:</strong> {internship.Location}</p>
                    <p><strong>Stipend:</strong> ₹{internship.Stipend}</p>
                    <p><strong>Duration:</strong> {internship.Duration}</p>
                    <p><strong>Description:</strong> {internship.Description}</p>
                    <p><strong>Role:</strong> {internship["Job Role"] || internship.jobRole}</p>
                    <a
                      className="internship-apply-link"
                      href={internship.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-internship-listings-message">No internships available for this role.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default JobFinder;
