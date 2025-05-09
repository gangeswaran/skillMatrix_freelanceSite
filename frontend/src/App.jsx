// File: src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
// import Listings from "./pages/Listings";
import Messages from "./pages/Messages";
import Login from "./pages/Login";

import UserRegister from "./pages/UserRegister";
import FreelancerCategorySelection from "./pages/category";
import FreelancerProfile from "./pages/FreelancerProfile";
import PurchaseRequests from "./pages/purchase";
import FreelancerOffers from "./pages/Offers";
import EditProfile from "./pages/EditProfile";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/listings" element={<Listings />} /> */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<UserRegister/>} />
        <Route path="/category" element={<FreelancerCategorySelection />} />
        <Route path="/freelancer/:id" element={<FreelancerProfile />} />
        <Route path="/purchases" element={<PurchaseRequests />} />
        <Route path="/gigs" element={<FreelancerOffers />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;













