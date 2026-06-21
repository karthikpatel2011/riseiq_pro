import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../lib/firebase";
import { db } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser,         setCurrentUser]         = useState(null);
  const [authLoading,         setAuthLoading]         = useState(true);
  const [onboardingComplete,  setOnboardingComplete]  = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          setOnboardingComplete(
            snap.exists() && snap.data().onboardingComplete === true
          );
        } catch {
          // Can't read Firestore yet (rules may not be set) — treat as not done
          setOnboardingComplete(false);
        }
      } else {
        setOnboardingComplete(false);
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, authLoading, onboardingComplete, setOnboardingComplete }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
