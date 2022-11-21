import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

import House from "../image/house.png";
import "./CSS/menuform.css";
import { toBePartiallyChecked } from "@testing-library/jest-dom/dist/matchers";

const SignUp = () => {
  const navigate = useNavigate();
  let tempNumber = "+66";
  let refcount = 0;

  const [currentUser, setCurrentUser] = useState(null);
  const [bank, setBank] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [expandForm, setExpandForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [OTP, setOTP] = useState("");
  const [ref, setRef] = useState("----");

  if (currentUser) {
    navigate("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataRef = await addDoc(collection(db, "userdata"), {
        Phonenumber: phoneNumber,
        Firstname: firstName,
        Lastname: lastName,
        Bank: bank,
        Banknumber: bankNumber,
        Passwords: pass1,
      });
      console.log("Data written with ID: ", dataRef.id);
    } catch (e) {
      console.error("error adding document", e);
    }
  };

  const generateRecaptcha = () => {
    console.log("captcha");
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

  const checkInputNum = (e) => {
    const number = e.target.value;
    console.log(number);
    let ArrayNumber = number.split("");

    for (let i = 0; i < ArrayNumber.length; i++) {
      // check every value in array that is not a word
      if (Number.isInteger(parseInt(ArrayNumber[i])) === false) {
        // if found word return false
        return false;
      }
    }

    // if not found string that a word
    return true;
  };

  const checkPhoneNumber = (e) => {
    // ใช้เช็คเลขโทรศัพเพื่อเซ็ท format เป็น +66 ข้างหน้า
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
    //กดเพื่อขอ OTP
    checkPhoneNumber();
    console.log("Hello OTP");
    e.preventDefault();

    if (phoneNumber.length >= 12) {
      console.log("I'm in");
      console.log(phoneNumber);
      generateRecaptcha();

      signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          refcount += 1;
          setRef("---" + refcount.toString());
        })
        .catch((error) => {
          // Error; SMS not sent to user
          alert(error);
        });
    }
  };

  const verifyOTP = (e) => {
    //ใช้เมื่อมีการใส่เลขโอทีพี
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
          setExpandForm(true);
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
      <div className="menu-form">
        <div className="row mb-1" controlid="formPhoneNumber">
          <label className="col-12 col-form-label">หมายเลขโทรศัพท์ +66</label>
          <div className="col">
            <input
              type="tel"
              className="form-control"
              name="phonenumber"
              minLength="10"
              maxLength="10"
              autoComplete="off"
              pattern="[0-9]{10}"
              value={phoneNumber}
              onChange={(e) => {
                if (checkInputNum(e) === true) {
                  setPhoneNumber(e.target.value);
                }
              }}
            />
          </div>
        </div>

        <div className="row mb-1">
          <span className="small">
            <button
              type="button"
              className="btn btn-danger float-end btn-sm py-1 rounded-0"
              onClick={requestOTP}
            >
              รับรหัส
            </button>
          </span>

          <div id="recaptcha-container"></div>

          <label className="col-12 col-form-label">OTP</label>
          <div className="col">
            <div className="d-flex">
              <input
                type="text"
                name="otpCode"
                className="form-control float-end w-50"
                minLength="6"
                maxLength="6"
                autoComplete="off"
                id="otpInput"
                value={OTP}
                onChange={(e) => {
                  if (checkInputNum(e) === true) {
                    verifyOTP(e);
                  }
                }}
              />
              <input
                type="text"
                name="otpPrefixMock"
                className="form-control-plaintext ms-2 plaintext-color refno"
                value="Ref No."
                readOnly="Ref No."
              ></input>
              <div className="inputRefno">
                <div className="mt-2 text-center bg-light">{ref}</div>
                <input
                  type="text"
                  name="otpPrefix"
                  className="form-control-plaintext d-none"
                  value={ref}
                  readOnly={ref}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form className="menu-form" onSubmit={handleSubmit}>
        {expandForm === true ? (
          <>
            <div className="row mb-1">
              <label className="col-12 col-form-label">ธนาคาร</label>
              <div className="col">
                <select
                  className="form-select"
                  id="bankselect"
                  onChange={(e) => {
                    setBank(e.target.value);
                  }}
                >
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
              <label className="col-12 col-form-label">เลขที่บัญชี</label>
              <div className="col">
                <input
                  type="text"
                  name="bank_account"
                  className="form-control"
                  minLength="10"
                  maxLength="12"
                  autoComplete="off"
                  value={bankNumber}
                  onChange={(e) => {
                    if (checkInputNum(e) === true) {
                      setBankNumber(e.target.value);
                    }
                  }}
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
                  autoComplete="off"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
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
                  autoComplete="off"
                  value={lastName}
                  onChange={(e) => {
                    setlastName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="row mb-1">
              <label className="col-12 col-form-label">รหัสผ่าน</label>
              <div className="col">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  minLength="6"
                  maxLength="30"
                  autoComplete="off"
                  value={pass1}
                  onChange={(e) => {
                    setPass1(e.target.value);
                  }}
                ></input>
              </div>
            </div>

            <div className="row mb-1">
              <label className="col-12 col-form-label">ยืนยันรหัสผ่าน</label>
              <div className="col">
                <input
                  type="password"
                  name="password2"
                  className="form-control"
                  minLength="6"
                  maxLength="30"
                  autoComplete="off"
                  value={pass2}
                  onChange={(e) => {
                    setPass2(e.target.value);
                  }}
                ></input>
              </div>
            </div>

            {/* <div className="row my-3 mb-2">
              <div className="col-12"></div>
              <div className="col"></div>
            </div> */}

            <div className="row mb-3">
              <div className="text-center">
                <button className="btn-form" type="submit">
                  สมัครสมาชิก
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="row mt-2">
            <label className="messageTel">**กรุณาใส่เบอร์โทรศัพท์**</label>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUp;
