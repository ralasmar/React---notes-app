
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCgdAReko_6U0pvDTMIpPBctfYtjpgsMb0",
  authDomain: "react-notes-91621.firebaseapp.com",
  projectId: "react-notes-91621",
  storageBucket: "react-notes-91621.appspot.com",
  messagingSenderId: "835056780221",
  appId: "1:835056780221:web:3a4d9b4fca2792bcd7c8d4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")