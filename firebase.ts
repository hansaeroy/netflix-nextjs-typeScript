// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA8UGHoywmkv3f9gO79fAKSqJljsoJDkvo',
  authDomain: 'netflix-clone-4716e.firebaseapp.com',
  projectId: 'netflix-clone-4716e',
  storageBucket: 'netflix-clone-4716e.appspot.com',
  messagingSenderId: '682280921010',
  appId: '1:682280921010:web:7673b9fbd0e7a5e50626ab',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export default app;
export { auth, db };
