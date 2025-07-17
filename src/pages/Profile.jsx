// Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import "./Profile.css";
import app from "../firebase";

const Profile = () => {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100");
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    careerGoal: "",
    selectedJob: "",
    skills: "",
    languages: "",
    imageUrl: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setProfileDetails(snapshot.val());
          setProfileImage(snapshot.val().imageUrl || "https://via.placeholder.com/100");
        }
      });
    }
  }, [auth.currentUser, db]);

  const handleProfileChange = (e) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setProfileDetails({ ...profileDetails, imageUrl });
    }
  };

  const saveProfileChanges = () => {
    if (auth.currentUser) {
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      update(userRef, profileDetails);
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
<div className="user-profile-container">
  <h2 className="user-profile-heading">Profile</h2>

  <img src={profileImage} alt="Profile" className="user-profile-pic" />
  <input type="file" accept="image/*" onChange={handleProfileImageChange} className="user-upload-profile-btn" />

  {isEditing ? (
    <div className="user-profile-edit-form">
      <input type="text" name="name" value={profileDetails.name} onChange={handleProfileChange} placeholder="Name" className="user-profile-input" />
      <input type="text" name="phone" value={profileDetails.phone} onChange={handleProfileChange} placeholder="Phone Number" className="user-profile-input" />
      <input type="text" name="college" value={profileDetails.college} onChange={handleProfileChange} placeholder="College Details" className="user-profile-input" />
      <input type="text" name="careerGoal" value={profileDetails.careerGoal} onChange={handleProfileChange} placeholder="Career Goal" className="user-profile-input" />

      <label className="user-profile-label">Select Job Role:</label>
      <select name="selectedJob" value={profileDetails.selectedJob} onChange={handleProfileChange} className="user-profile-select">
        <option value="">--Select a Job--</option>
        <option value="Data Scientist">Data Scientist</option>
        <option value="Software Engineer">Software Engineer</option>
        <option value="AI Engineer">AI Engineer</option>
      </select>

      <input type="text" name="skills" value={profileDetails.skills} onChange={handleProfileChange} placeholder="Enter Your Skills" className="user-profile-input" />
      <input type="text" name="languages" value={profileDetails.languages} onChange={handleProfileChange} placeholder="Languages Known" className="user-profile-input" />

      <button className="user-profile-save-btn" onClick={saveProfileChanges}>Save Changes</button>
    </div>
  ) : (
    <div className="user-profile-info">
      <p className="user-profile-text"><strong>Name:</strong> {profileDetails.name}</p>
      <p className="user-profile-text"><strong>Email:</strong> {profileDetails.email}</p>
      <p className="user-profile-text"><strong>Phone:</strong> {profileDetails.phone}</p>
      <p className="user-profile-text"><strong>College:</strong> {profileDetails.college}</p>
      <p className="user-profile-text"><strong>Career Goal:</strong> {profileDetails.careerGoal}</p>
      <p className="user-profile-text"><strong>Selected Job:</strong> {profileDetails.selectedJob || "Not Selected"}</p>
      <p className="user-profile-text"><strong>Skills:</strong> {profileDetails.skills || "Not Added"}</p>
      <p className="user-profile-text"><strong>Languages Known:</strong> {profileDetails.languages || "Not Added"}</p>
      
      <button className="user-profile-edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
    </div>
  )}

  <div className="user-profile-buttons">
    <button className="user-profile-nav-btn" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
    <button className="user-profile-nav-btn" onClick={() => navigate("/careerroadmap")}>Career Roadmap</button>
    <button className="user-profile-nav-btn" onClick={() => navigate("/resume")}>Resume Builder</button>
    <button className="user-profile-logout-btn" onClick={handleLogout}>Logout</button>
  </div>
</div>

  );
};

export default Profile;
