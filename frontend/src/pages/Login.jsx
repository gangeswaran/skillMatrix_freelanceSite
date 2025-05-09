import React, { useState } from "react";
import axios from "axios";  // Import axios for API requests

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // Store the JWT token in localStorage (or any other storage you prefer)
      localStorage.setItem("token", response.data.token);

      // Redirect to a protected page or dashboard after successful login
      // For example: history.push('/dashboard');
      console.log("Login successful:", response.data);
      // alert("success")
      console.log(response.data.type);
      localStorage.setItem("type",response.data.type)
      if(response.data.type == 'buyer'){
         window.location.href ='/category'
         localStorage.setItem("senderId" ,response.data.id)
        }      
      else{window.location.href ='/profile'}
    } catch (error) {
      // Handle any errors, like invalid login
      setError("Invalid email or password");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}  // Handle email change
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}  // Handle password change
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
