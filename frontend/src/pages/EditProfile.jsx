import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    skills: "",
    price: 0,
    portfolio: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/freelancer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setFormData({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          location: data.location || "",
          skills: data.skills.join(", ") || "",
          price: data.price || 0,
          portfolio: data.portfolio || [],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the field is "price", convert the value to a number
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handlePortfolioChange = (index, field, value) => {
    const updated = [...formData.portfolio];
    if (field === "portfolioLinks") {
      updated[index][field] = value.split(",").map((link) => link.trim());
    } else {
      updated[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, portfolio: updated }));
  };

  const addPortfolioProject = () => {
    setFormData((prev) => ({
      ...prev,
      portfolio: [...prev.portfolio, { title: "", projectDescription: "", portfolioLinks: [] }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        ...formData,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      };

      // Send the updated data to the backend
      await axios.put("http://localhost:5000/freelancer/update", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">✏️ Edit Profile</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="input"
          />
          <input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
            className="input"
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
            className="input"
          />
          <input
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Bio"
            className="input"
          />
          <input
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="Skills (comma separated)"
            className="input"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price per hour"
            className="input"
          />

          <h3 className="text-lg font-semibold mt-6">Portfolio</h3>
          {formData.portfolio.map((project, index) => (
            <div key={index} className="border p-4 rounded-lg mb-4 bg-gray-50">
              <input
                value={project.title}
                onChange={(e) => handlePortfolioChange(index, "title", e.target.value)}
                placeholder="Project Title"
                className="input mb-2"
              />
              <textarea
                value={project.projectDescription}
                onChange={(e) => handlePortfolioChange(index, "projectDescription", e.target.value)}
                placeholder="Project Description"
                className="input mb-2"
              />
              <input
                value={project.portfolioLinks?.join(", ") || ""}
                onChange={(e) => handlePortfolioChange(index, "portfolioLinks", e.target.value)}
                placeholder="Project Links (comma separated)"
                className="input"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addPortfolioProject}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            ➕ Add Project
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            ✅ Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
