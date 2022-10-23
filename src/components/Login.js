import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth";
import { auth } from "../config";
import { signInWithEmailAndPassword } from "firebase/auth";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const LogIn = () => {
  const navigate = useNavigate();

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

  //   const { currentUser } = AuthContext;
  //   if (currentUser) {
  //     navigate("/dashboard");
  //   }

  return (
    <>
      <h1>Log In</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LogIn;
