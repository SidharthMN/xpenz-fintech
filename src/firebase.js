import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export async function signUpUser({ firstName, lastName, email, password }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();

  if (displayName) {
    await firebaseUpdateProfile(user, { displayName });
  }

  await setDoc(doc(db, "users", user.uid), {
    firstName,
    lastName,
    displayName,
    email,
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function signInUser({ email, password }) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function observeUser(onChange) {
  return onAuthStateChanged(auth, onChange);
}

export async function signOutUser() {
  return signOut(auth);
}

export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function saveUserProfile(uid, data) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserDisplayName(user, displayName) {
  return firebaseUpdateProfile(user, { displayName });
}

export async function updateUserPassword(user, password) {
  return firebaseUpdatePassword(user, password);
}

export { auth };
