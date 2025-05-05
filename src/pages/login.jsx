import React, { useState } from "react";
import logo from '../assets/logo.svg';

import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  // State to store the email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handler for email input change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Handler for password input change
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Here you can add the logic to compare the email and password with the backend
    // For now, we'll just log the values to the console
    console.log("Email:", email);
    console.log("Password:", password);

    // Once the backend is ready, you can make an API call here
    // Example:
    // fetch('/api/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email, password }),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   if (data.success) {
    //     // Redirect to the desired page
    //     window.location.href = '/dashboard';
    //   } else {
    //     // Handle login error
    //     alert('Invalid email or password');
    //   }
    // });
  };

  return (
    <div className="w-screen h-screen bg-main flex items-center justify-center">
      <div className="bg-white login rounded-md p-4">
        <div className="w-full flex items-center justify-center">
          <img src={logo} alt="Logo" />
        </div>
        <div className="w-full flex flex-col items-start text-blk mt-3">
          <p className="text-4xl font-bold">Login</p>
          <p>Please fill your detail to access your account.</p>
        </div>
        <form onSubmit={() => navigate("/teacher/dashboard")}>
          <div className="w-full flex flex-col items-start text-blk mt-4">
            <label htmlFor="email" className="mb-2">Email</label>
            <input
              type="text"
              id="email"
              placeholder="youremail@example.com"
              className="text-blk w-full p-2 border border-current rounded-md focus:border-main"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="w-full flex flex-col items-start text-blk mt-4">
            <label htmlFor="password" className="mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="text-blk w-full p-2 border border-current rounded-md focus:border-main"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="w-full flex flex-col items-end mt-8">
            <a className="text-main hover:cursor-pointer">Forgot Password!</a>
            <button type="submit" className="w-full bg-main rounded-lg h-10 hover:cursor-pointer">Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;