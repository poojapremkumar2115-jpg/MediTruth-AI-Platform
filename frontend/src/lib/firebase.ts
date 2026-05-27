import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if keys are filled
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("[MediTruth Firebase] Firebase Client SDK successfully configured.");
  } catch (error) {
    console.error("[MediTruth Firebase] Error initializing Firebase, using local mocks:", error);
  }
} else {
  console.log(
    "[MediTruth Firebase] No environment keys found. Running on robust Mock Offline Mode."
  );
}

// Export Auth / Firestore instances or mock utilities
export { app, auth, db, isFirebaseConfigured };
export const mockAuthService = {
  login: async (email: string) => {
    const user = { email, uid: "mock_user_123", joinDate: new Date().toLocaleDateString() };
    localStorage.setItem("meditruth_user", JSON.stringify(user));
    return user;
  },
  logout: async () => {
    localStorage.removeItem("meditruth_user");
  }
};
