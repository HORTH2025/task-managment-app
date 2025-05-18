import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSgMtiO7QexPAC_XlnmeNcPp28mHxTkNU",
    authDomain: "management-5f7b4.firebaseapp.com",
    projectId: "management-5f7b4",
    storageBucket: "management-5f7b4.firebasestorage.app",
    messagingSenderId: "495029031581",
    appId: "1:495029031581:web:1aae5358e8039953803a74",
    measurementId: "G-L203JK90B4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };    