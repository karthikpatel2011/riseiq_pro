import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser,         setCurrentUser]         = useState(null);
  const [userData,            setUserData]            = useState(null);
  const [authLoading,         setAuthLoading]         = useState(true);
  const [onboardingComplete,  setOnboardingComplete]  = useState(false);

  /* ── Track auth state + live user document ── */
  useEffect(() => {
    let unsubUser = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Tear down any previous user-doc subscription
      if (unsubUser) { unsubUser(); unsubUser = null; }

      setCurrentUser(user);

      if (user) {
        // Live-subscribe to the user document so profile edits, bookmarks,
        // and onboarding completion reflect instantly app-wide.
        unsubUser = onSnapshot(
          doc(db, "users", user.uid),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setUserData({ id: snap.id, ...data });
              setOnboardingComplete(data.onboardingComplete === true);
            } else {
              setUserData(null);
              setOnboardingComplete(false);
            }
            setAuthLoading(false);
          },
          (err) => {
            // Rules may not be deployed yet — fail soft, treat as not-onboarded
            console.warn("AuthContext: user doc read failed", err);
            setUserData(null);
            setOnboardingComplete(false);
            setAuthLoading(false);
          }
        );
      } else {
        setUserData(null);
        setOnboardingComplete(false);
        setAuthLoading(false);
      }
    });

    return () => {
      if (unsubUser) unsubUser();
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        authLoading,
        onboardingComplete,
        setOnboardingComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
