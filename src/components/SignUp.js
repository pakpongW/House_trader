import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config";
import {
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import House from "../image/house.png";

const SignUp = () => {
  const navigate = useNavigate();
  let tempNumber = "+66";
  const [currentUser, setCurrentUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [OTP, setOTP] = useState("");

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
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    );
  };

  const checkPhoneNumber = (e) => {
    let ArrayNumber = phoneNumber.split("");
    console.log(ArrayNumber);

    if (ArrayNumber[0] === "0") {
      for (let i = 1; i < ArrayNumber.length; i++) {
        tempNumber += ArrayNumber[i];
      }
      console.log("tempNumber:" + tempNumber);
      setPhoneNumber(tempNumber);
    }
  };

  const requestOTP = (e) => {
    checkPhoneNumber();
    console.log("Hello OTP");
    e.preventDefault();
    if (phoneNumber.length >= 12) {
      console.log("I'm in");
      console.log(phoneNumber);
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

  const verifyOTP = (e) => {
    let otp = e.target.value;
    setOTP(otp);
    console.log(otp);

    if (otp.length === 6) {
      //Verify OTP
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          // User signed in successfully.
          const user = result.user;
          // ...
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          alert(error);
        });
    }
  };

  return (
    <div className="container ">
      <form onSubmit={handleSubmit}>
        <div className="text-center mt-4 mb-3">
          <div className="px-5">
            <img src={House} className="img-fluid" alt="house"></img>
          </div>
        </div>
        <div className="mb-3 w-50" controlid="formPhoneNumber">
          <label>Phone number</label>
          <div className="input-group">
            <span className="input-group-text">thailand +66</span>
            <input
              type="tel"
              className="form-control"
              name="phonenumber"
              pattern="[0-9]{10}"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
            <button className="btn btn-primary" onClick={requestOTP}>
              OTP
            </button>
          </div>
          <div id="phoneHelp" className="form-text text-muted">
            please insert your phone number Ex: 0XXXXXXXXX
          </div>
        </div>
        <div id="recaptcha-container"></div>
        <div className="mb-3" controlid="formOTP">
          <label className="form-label">OTP</label>
          <input
            type="number"
            className="form-control"
            id="otpInput"
            value={OTP}
            onChange={verifyOTP}
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
