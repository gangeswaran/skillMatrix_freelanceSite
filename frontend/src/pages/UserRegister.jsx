import React, { useState } from "react";
import axios from "axios";

const UserRegister = () => {
  const [userType, setUserType] = useState("freelancer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState([]);
  const [portfolioTitle, setPortfolioTitle] = useState(""); // New field
  const [projectDescription, setProjectDescription] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const skillOptions = [
    "Web Development",
    "Graphic Design",
    "Content Writing",
    "SEO",
    "Mobile App Development",
    "Data Analysis",
    "Marketing",
    "UI/UX Design"
  ];

  const handleSkillChange = (skill) => {
    setSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };

  const handlePortfolioLinkChange = (index, value) => {
    const updatedLinks = [...portfolioLinks];
    updatedLinks[index] = value;
    setPortfolioLinks(updatedLinks);
  };

  const handleAddPortfolioLink = () => {
    setPortfolioLinks([...portfolioLinks, ""]);
  };

  const handleRemovePortfolioLink = (index) => {
    const updatedLinks = portfolioLinks.filter((_, i) => i !== index);
    setPortfolioLinks(updatedLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const userData = {
      name,
      email,
      password,
      skills,
      userType,
      portfolio: [
        {
          title: portfolioTitle,
          projectDescription,
          portfolioLinks
        }
      ]
    };

    try {
      const response = await axios.post("http://localhost:5000/register", userData);
      console.log("User Registered:", response.data);
      alert("Success");
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="freelancer"
            checked={userType === "freelancer"}
            onChange={() => setUserType("freelancer")}
          />
          Freelancer
        </label>
        <label>
          <input
            type="radio"
            value="buyer"
            checked={userType === "buyer"}
            onChange={() => setUserType("buyer")}
          />
          Buyer
        </label>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {userType === "freelancer" && (
          <div>
            <h3 className="text-lg font-medium mb-2">Select Your Skills:</h3>
            <div className="grid grid-cols-2 gap-4">
              {skillOptions.map((skill) => (
                <label key={skill} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={skills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>

            {/* Portfolio Title */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Project Title:</h3>
              <input
                className="w-full border p-2"
                placeholder="Title of the project"
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
              />
            </div>

            {/* Project Description */}
            <div>
              <h3 className="text-lg font-medium mb-2">Project Description:</h3>
              <textarea
                className="w-full border p-2"
                placeholder="Describe your previous projects"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>

            {/* Portfolio Links */}
            <div>
              <h3 className="text-lg font-medium mb-2">Portfolio Links:</h3>
              {portfolioLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Portfolio link"
                    className="w-full border p-2"
                    value={link}
                    onChange={(e) => handlePortfolioLinkChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-red-500 text-white px-2 py-1"
                    onClick={() => handleRemovePortfolioLink(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2"
                onClick={handleAddPortfolioLink}
              >
                Add Portfolio Link
              </button>
            </div>
          </div>
        )}

        {userType === "buyer" && (
          <div>
            <h3 className="text-lg font-medium mb-2">Select Skills You're Looking For:</h3>
            <div className="grid grid-cols-2 gap-4">
              {skillOptions.map((skill) => (
                <label key={skill} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={skill}
                    onChange={() => handleSkillChange(skill)}
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <button
          type="submit"
          className={`bg-green-500 text-white px-4 py-2 mt-4 ${loading && "opacity-50 cursor-not-allowed"}`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default UserRegister;
