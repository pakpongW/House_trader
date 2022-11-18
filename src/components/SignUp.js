import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config";
import {
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import House from "../image/house.png";
import "./CSS/menuform.css";

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
    <div className="container">
      <div className="text-center mt-4 mb-3">
        <div className="px-5">
          <img src={House} className="img-fluid" alt="house"></img>
        </div>
      </div>
      <form className="menu-form" onSubmit={handleSubmit}>
        <div className="row mb-1">
          <label className="col-12 col-form-label">ธนาคาร</label>
          <div className="col">
            <select className="form-select">
              <option>- โปรดระบุธนาคาร -</option>
              <option>ธนาคารกรุงเทพ</option>
              <option>ธนาคารกรุงศรีอยุธยา</option>
              <option>ธนาคารเกียรตินาคินภัทร</option>
              <option>ธนาคารซีไอเอ็มบีไทย</option>
              <option>ธนาคารทหารไทยธนชาต</option>
              <option>ธนาคารทิสโก้</option>
              <option>ธนาคารไทยเครดิตเพื่อรายย่อย</option>
              <option>ธนาคารไทยพาณิชย์</option>
              <option>ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร</option>
              <option>ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย</option>
              <option>ธนาคารยูโอบี</option>
              <option>ธนาคารแลนด์ แอนด์ เฮ้าส์</option>
              <option>ธนาคารออมสิน</option>
              <option>ธนาคารอาคารสงเคราะห์</option>
              <option>ธนาคารอิสลามแห่งประเทศไทย</option>
              <option>ธนาคารไอซีบีซี (ไทย)</option>
            </select>
          </div>
        </div>

        <div className="row mb-1">
          <label class="col-12 col-form-label">เลขที่บัญชี</label>
          <div className="col">
            <input
              type="text"
              name="bank_account"
              className="form-control"
              minLength="10"
              maxLength="12"
              autocomplete="off"
              value=""
            />
          </div>
        </div>

        <div className="row mb-1">
          <label className="col-12 col-form-label">
            ชื่อ (ตรงกับบัญชีธนาคาร)
          </label>
          <div className="col">
            <input
              type="text"
              name="first_name"
              className="form-control"
              minLength="3"
              maxLength="50"
              autocomplete="off"
              value=""
            />
          </div>
        </div>

        <div className="row mb-1">
          <label className="col-12 col-form-label">
            นามสกุล (ตรงกับบัญชีธนาคาร)
          </label>
          <div className="col">
            <input
              type="text"
              name="last_name"
              className="form-control"
              minLength="3"
              maxLength="50"
              autocomplete="off"
              value=""
            />
          </div>
        </div>

        <div className="row mb-1" controlid="formPhoneNumber">
          <label className="col-12 col-form-label">หมายเลขโทรศัพท์ +66</label>
          <div className="col">
            <input
              type="tel"
              className="form-control"
              name="phonenumber"
              minLength="10"
              maxLength="10"
              autocomplete="off"
              pattern="[0-9]{10}"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </div>

          {/* <button className="btn btn-primary" onClick={requestOTP}>
            OTP
          </button>
          <div id="phoneHelp" className="form-text text-muted">
            please insert your phone number Ex: 0XXXXXXXXX
          </div> */}
        </div>

        <div className="row mb-1">
          <label className="col-12 col-form-label" for="otpCode">
            OTP
            <span className="small">
              <button
                type="button"
                class="btn btn-danger float-end btn-sm py-1 rounded-0"
                onClick={requestOTP}
              >
                รับรหัส
              </button>
            </span>
          </label>
          <div className="col">
            <div className="d-flex">
              <input
                type="text"
                name="otpCode"
                className="form-control float-end w-50"
                minlength="6"
                maxlength="6"
                autocomplete="off"
                id="otpInput"
                value={OTP}
                onChange={verifyOTP}
              />
              <input
                type="text"
                name="otpPrefixMock"
                className="form-control-plaintext ms-2 plaintext-color refno"
                readonly=""
                value="Ref No."
              ></input>
              <div className="inputRefno">
                <div className="mt-2 text-center bg-light">----</div>
              </div>
              <input
                type="text"
                name="otpPrefix"
                className="form-control-plaintext d-none"
                readonly=""
                value="----"
              ></input>
            </div>
          </div>
        </div>

        <div className="row mb-1">
          <label for="password" class="col-12 col-form-label">
            รหัสผ่าน
          </label>
          <div className="col">
            <input
              type="password"
              name="password"
              className="form-control"
              minlength="6"
              maxlength="30"
              autocomplete="off"
              value=""
            ></input>
          </div>
        </div>

        <div className="row mb-1">
          <label for="password2" class="col-12 col-form-label">
            ยืนยันรหัสผ่าน
          </label>
          <div className="col">
            <input
              type="password"
              name="password2"
              class="form-control"
              minlength="6"
              maxlength="30"
              autocomplete="off"
              value=""
            ></input>
          </div>
        </div>

        <div className="row my-3 mb-2">
          <div className="col-12"></div>
          <div className="col"></div>
        </div>

        {/* <div className="mb-3" controlid="formEmail">
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
        </button>*/}
      </form>
    </div>
  );
};

export default SignUp;
