import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import LogIn from "./components/Login";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./components/Auth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route exact path="/" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
