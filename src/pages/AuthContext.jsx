import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import app from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = getAuth(app);
  const db = getDatabase(app);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const adminEmails = ["akwebsites369@gmail.com", "admin2@example.com"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        let userData = snapshot.exists() ? snapshot.val() : {};
        
        let isAdminUser = adminEmails.includes(currentUser.email);
        if (isAdminUser) {
          userData.isAdmin = true;
          setIsAdmin(true);
        } else {
          setIsAdmin(userData.isAdmin === true);
        }
        
        // Save admin status to the database if not already set
        if (!snapshot.exists() || snapshot.val().isAdmin !== isAdminUser) {
          await set(userRef, {
            email: currentUser.email,
            isAdmin: isAdminUser,
            uid: currentUser.uid,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
