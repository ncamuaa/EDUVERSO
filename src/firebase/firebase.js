
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCses7AM3QGrBTBtz1ihRWn7hylwNsPiyk",
  authDomain: "eduversoo.firebaseapp.com",
  projectId: "eduversoo",
  storageBucket: "eduversoo.firebasestorage.app",
  messagingSenderId: "615754349452",
  appId: "1:615754349452:web:5d49c1cc7276ad1bea74a9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
