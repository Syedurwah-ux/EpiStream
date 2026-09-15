import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNCa7EGTn6Bydq4ovA5-YFyYnxmNyfMO8",
  authDomain: "epistream-82a37.firebaseapp.com",
  projectId: "epistream-82a37",
  storageBucket: "epistream-82a37.firebasestorage.app",
  messagingSenderId: "929468030123",
  appId: "1:929468030123:web:7d6f077e9db28a1f4f6bee",
  measurementId: "G-NRS16H6E4T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);