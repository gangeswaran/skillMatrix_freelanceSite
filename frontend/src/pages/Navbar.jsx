import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("type"); // 'buyer' or 'freelancer'

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <div className="font-bold">SkillMatrix</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>

        {token ? (
          <>
            {role === "buyer" && (
              <>
                <Link to="/category">Category</Link>
                <Link to="/purchases">Purchases</Link>
              </>
            )}
            {role === "freelancer" && (
              <>
                <Link to="/profile">Profile</Link>
                <Link to="/gigs">Gigs</Link>
              </>
            )}
            <button onClick={handleLogout} className="text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
