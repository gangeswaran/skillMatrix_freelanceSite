import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FreelancerInfo = () => {
  const [freelancer, setFreelancer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreelancerInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/freelancer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFreelancer(response.data);
        console.log(response.data);
        
      } catch (err) {
        setError("Failed to fetch freelancer data.");
        console.error(err);
      }
    };

    const fetchMessages = async () => {
      const freelancerId = localStorage.getItem("senderId");
      try {
        const response = await axios.get(
          `http://localhost:5000/messages/${freelancerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(response.data.messages);
      } catch (err) {
        setError("Failed to fetch messages.");
        console.error(err);
      }
    };

    fetchFreelancerInfo();
    fetchMessages();
  }, []);

  if (error)
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!freelancer)
    return <div className="text-center mt-6">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Freelancer Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Welcome back, {freelancer.name}</p>
          <p className="text-green-600 font-semibold mt-2">
            💰 Price per hour: ${freelancer.price || 0}
          </p>
        </header>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-500 text-white text-3xl rounded-full flex items-center justify-center">
            {freelancer.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{freelancer.name}</h2>
            <p className="text-gray-600">@{freelancer.username}</p>
            <p className="text-gray-500 mt-2">
              {freelancer.bio || "No bio available."}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📍 {freelancer.location || "Not provided"} | ✉️ {freelancer.email}
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-1">
          {/* Skills */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Skills</h3>
            <ul className="space-y-2">
              {freelancer.skills && freelancer.skills.length > 0 ? (
                freelancer.skills.map((skill, index) => (
                  <li key={index} className="text-gray-700">
                    ✅ {skill}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet.</p>
              )}
            </ul>
          </section>

          {/* Messages */}
          {/* <section className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Messages</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {messages && messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className="border p-3 rounded-lg bg-gray-50">
                    <p>{msg.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      📅 {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No messages received yet.</p>
              )}
            </div>
          </section> */}
        </div>

        {/* Portfolio */}
        <section className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
              freelancer.portfolio.map((project, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition"
                >
                  <h4 className="text-lg font-semibold mb-2">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {project.projectDescription || "No description available"}
                  </p>
                  {project.portfolioLinks?.length > 0 ? (
                    project.portfolioLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        className="text-blue-600 text-sm hover:underline block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🔗 View Project {i + 1}
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No links available</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No portfolio projects found.</p>
            )}
          </div>
        </section>

        {/* Edit Button */}
        <div className="mt-8 text-right">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            <Link to="/edit-profile">✏️ Edit Profile</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerInfo;
