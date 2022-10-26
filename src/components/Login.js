import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth";
import { auth } from "../config";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./CSS/Login.css";
import House from "../image/house.png";

const LogIn = () => {
  const navigate = useNavigate();
  const { currentUser } = AuthContext;

  if (currentUser) {
    navigate("/dashboard");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = e.target.elements;

    try {
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then(async (currentUser) => {
          if (currentUser) {
            navigate("/dashboard");
          }
        })
        .catch((error) => {
          alert(error);
        });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="text-center mt-4 mb-3">
          <div className="px-5">
            <img src={House} className="img-fluid" alt="house"></img>
          </div>
        </div>
        <form className="menu-form" onSubmit={handleSubmit}>
          <div className="row mb-3" controlid="formBasicEmail">
            <label className="col-12 col-form-label">หมายเลขโทรศัพท์</label>
            <div className="col">
              <input
                className="form-control"
                type="text"
                name="username"
                minLength="10"
                maxLength="10"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="row mb-3" controlid="formBasicPassword">
            <label className="col-12 col-form-label">รหัสผ่าน</label>
            <div className="col">
              <input
                className="form-control"
                type="password"
                name="password"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="text-center">
              <button className="btn-form" type="submit">
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </form>
        <div className="text-center">
          <span className="bg-light px-3 py-1 link-round">
            <a href="/signup" className="link-text">
              สมัครสมาชิก
            </a>
            <span className="px-2 small">I</span>
            <a href="/" className="link-text">
              ลืมรหัสผ่าน
            </a>
          </span>
        </div>
      </div>
    </>
  );
};

export default LogIn;
