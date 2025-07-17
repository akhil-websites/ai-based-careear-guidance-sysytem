import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import "../pages/login.css";
import app from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const db = getDatabase(app);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user exists in the Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        setError("Access denied: User not found in the system.");
        return;
      }
      
      const userData = snapshot.val();
      const isAdmin = userData.isAdmin || false;
      
      if (isAdmin) {
        navigate("/admin"); // Redirect admin to admin panel
      } else {
        navigate("/dashboard"); // Redirect normal user to dashboard
      }
    } catch (err) {
      setError("Invalid email or password. Try again!");
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in the Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      let isAdmin = false;
      if (!snapshot.exists()) {
        // If new user, store in database
        const isAdminUser = ["akwebsites369@gmail.com", "admin2@example.com"].includes(user.email);
        await set(userRef, {
          email: user.email,
          isAdmin: isAdminUser,
          uid: user.uid,
          createdAt: new Date().toISOString()
        });
        isAdmin = isAdminUser;
      } else {
        isAdmin = snapshot.val().isAdmin || false;
      }
      
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Google Login Failed. Try again!");
    }
  };

  return (
    <div className="login-auth-container">
      <div className="login-auth-card">
        <h2>Welcome Back!</h2>
        <p>Login to access your AI-powered job recommendations.</p>
        
        {error && <p className="login-error">{error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <input className="login-input" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <input className="login-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <Link to="/forgot-password" className="login-forgot-link">Forgot Password?</Link>
          </div>

          <button className="login-button" type="submit">Login</button>
        </form>

        <button className="login-google-btn" onClick={handleGoogleLogin}>
          Login with Google
        </button>

        <p>New user? <Link to="/signup">Create an account</Link></p>
      </div>
    </div>
  );
}
