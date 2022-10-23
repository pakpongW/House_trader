import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHJ7-AIwDn7G_mZHFJdV_5GuMNJOaDZMY",
  authDomain: "house-trader.firebaseapp.com",
  projectId: "house-trader",
  storageBucket: "house-trader.appspot.com",
  messagingSenderId: "435884096400",
  appId: "1:435884096400:web:dacdffa76640f7f7d85115",
  measurementId: "G-VENC3X0EDG",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
