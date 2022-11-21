import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./Auth";

const Home = () => {
  const { currentUser } = AuthContext;

  return (
    <>
      <div className="container mt-5">
        {currentUser ? (
          <p>
            You are logged in - <Link to="/dashboard">View Dashboard</Link>
          </p>
        ) : (
          <p>
            <Link to="/Login">Log In</Link> or <Link to="/signup">Sign Up</Link>
          </p>
        )}
      </div>
    </>
  );
};

export default Home;
