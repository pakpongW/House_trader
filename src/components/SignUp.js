import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config";
import {
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";

const SignUp = () => {
  const countryCode = "+66";
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(countryCode);

  if (currentUser) {
    navigate("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;

    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      setCurrentUser(true);
    } catch (error) {
      alert(error);
    }
  };

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    );
  };

  const requestOTP = (e) => {
    console.log("Hello OTP");
    e.preventDefault();
    if (phoneNumber.length >= 12) {
      console.log("I'm in");
      generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;

      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          // Error; SMS not sent to user
          alert(error);
        });
    }
  };

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="mb-3" controlid="formPhoneNumber">
          <label>Phone number</label>

          <div className="input-group mb3">
            <span className="input-group-text">+66</span>
            <input
              type="tel"
              className="form-control"
              name="phonenumber"
              value={phoneNumber}
              pattern="+66[0-9]{}"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button className="btn btn-primary" onClick={requestOTP}>
              OTP
            </button>
          </div>
          <div id="phoneHelp" className="form-text text-muted">
            please insert your phone number.
          </div>
        </div>
        <div id="recaptcha-container"></div>
        <div className="mb-3" controlid="formOTP">
          <label className="form-label">OTP</label>
          <input
            type="number"
            className="form-control"
            id="otpInput"
            pattern="[0-9]{6}"
          />
          <div id="otpHelp" className="form-text">
            Please enter your otp
          </div>
        </div>
        <div className="mb-3" controlid="formEmail">
          <label className="form-label">Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>

        <div className="mb-3" controlid="formPassword">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
          />
        </div>
        <button variant="primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignUp;
