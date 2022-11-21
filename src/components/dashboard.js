import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./CSS/dashboard.css";

const DashBoard = () => {
  const navigate = useNavigate();
  const { currentUser } = AuthContext;

  if (!currentUser) {
    navigate("/login");
  }

  const handlesignout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="">
      <div className="dashboard">
        <h1>House trader</h1>
        <label>เบอร์โทรศัพ: 0897232563</label>
        <label>ธนาคาร: ธนาคารกรุงศรีอยุธยา</label>
        <label>เลขที่บัญชี: 0503397781</label>
        <label>ชื่อ: นายสมจิตร</label>
        <label>นามสกุล: มุ่งหมาย</label>
        <button className="btn btn-danger" onClick={handlesignout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DashBoard;
