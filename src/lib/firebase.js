import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// File uploads are handled by Cloudinary (src/lib/cloudinary.js)

const firebaseConfig = {
  apiKey:            "AIzaSyCjTKi1oiMxH0HwBkKr2osYeHkcNKTPRjU",
  authDomain:        "riseiq.firebaseapp.com",
  projectId:         "riseiq",
  messagingSenderId: "65095828992",
  appId:             "1:65095828992:web:1153426003e5b8616c7ae5",
  measurementId:     "G-J3GCK75FFW",
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics      = getAnalytics(app);
export const db             = getFirestore(app);
