import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth";
import { auth } from "../config";
import { signOut } from "firebase/auth";

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
    <div>
      <div>
        <h1>House trader</h1>
        <button className="btn btn-danger" onClick={handlesignout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DashBoard;
