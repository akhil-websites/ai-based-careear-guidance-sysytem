import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "../pages/signup.css"; // Ensure this file has styles for animations
import app from "../firebase"; // Ensure firebase.js is correctly configured

function Signup() {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    userType: "job-seeker",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.fullName });
      await set(ref(db, `users/${user.uid}`), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || "Not Provided",
        country: formData.country,
        userType: formData.userType,
        createdAt: new Date().toISOString(),
      });

      alert("Account created successfully!");
      navigate("/");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await set(ref(db, `users/${user.uid}`), {
        fullName: user.displayName,
        email: user.email,
        phone: "Not Provided",
        country: "Not Provided",
        userType: "job-seeker",
        createdAt: new Date().toISOString(),
      });

      alert("Google account linked successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Google Signup failed: " + error.message);
    }
  };

  return (
    <div className="signup-auth-container">
      <div className="signup-auth-card">
        <h2>🚀 Create an Account</h2>
        <p>Join AI Career Assistant and get job recommendations powered by AI!</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input className="signup-input" type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
          {errors.fullName && <p className="signup-error">{errors.fullName}</p>}

          <input className="signup-input" type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="signup-error">{errors.email}</p>}

          <input className="signup-input" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="signup-error">{errors.password}</p>}

          <input className="signup-input" type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p className="signup-error">{errors.confirmPassword}</p>}

          <input className="signup-input" type="text" name="phone" placeholder="Phone Number (Optional)" value={formData.phone} onChange={handleChange} />

          <button className="signup-button" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "🟢 Create Account"}
          </button>
        </form>

        <button className="signup-google-btn" onClick={handleGoogleSignup}>
          Sign Up with Google
        </button>

        <p>Already have an account? <Link to="/login">Login instead</Link></p>
      </div>
    </div>
  );
}

export default Signup;
