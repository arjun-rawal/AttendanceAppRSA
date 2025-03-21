import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyB9KQk2I1C3cSVgpCprKZjOppOTA9nY1Gw",
  authDomain: "attendancersa.firebaseapp.com",
  projectId: "attendancersa",
  storageBucket: "attendancersa.firebasestorage.app",
  messagingSenderId: "758738287727",
  appId: "1:758738287727:web:8800a2a8f1b58aa881e19a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db,auth,storage };