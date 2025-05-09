import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Skill options
const skillOptions = [
  "Web Development",
  "Graphic Design",
  "Content Writing",
  "SEO",
  "Mobile App Development",
  "Data Analysis",
  "Marketing",
  "UI/UX Design",
];

const FreelancerCategorySelection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedCategory) {
      fetchFreelancersByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchFreelancersByCategory = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/search?skill=${category}`
      );
      setFreelancers(response.data);
    } catch (err) {
      setError("Failed to fetch freelancers");
      console.error(err);
    }
  };

  // Helper function to render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center text-yellow-500 text-lg">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`}>&#9733;</span> // ★
        ))}
        {halfStar && <span key="half">&#189;</span>} // ½ star fallback
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://i.pinimg.com/736x/3c/59/55/3c59556efdc2aa8cd6807431e013dc6d.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 p-6 max-w-5xl mx-auto text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Pick a Freelancer Category
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Dropdown */}
        <div className="mb-6">
          <select
            className="w-full border border-gray-300 rounded-lg p-3 text-black"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {skillOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Freelancer List */}
        {selectedCategory && (
          <>
            <h3 className="text-xl font-semibold mb-4">
              Freelancers in "{selectedCategory}" Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {freelancers.length > 0 ? (
                freelancers.map((freelancer) => (
                  <div
                    key={freelancer._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-4 border"
                  >
                    {/* Avatar or Placeholder */}
                    <div className="h-32 w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-6xl">
                      <span role="img" aria-label="avatar">
                        👤
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-black">{freelancer.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {freelancer.skills.join(", ")}
                    </p>

                    {/* Rating */}
                    {Array.isArray(freelancer.ratings) &&
                      freelancer.ratings.length > 0 && (
                        <div className="flex items-center mb-2">
                          {renderStars(
                            freelancer.ratings.reduce((a, b) => a + b, 0) /
                              freelancer.ratings.length
                          )}
                          <span className="text-sm text-gray-500 ml-2">
                            (
                            {(
                              freelancer.ratings.reduce((a, b) => a + b, 0) /
                              freelancer.ratings.length
                            ).toFixed(1)}
                            )
                          </span>
                        </div>
                      )}

                    {/* View Profile */}
                    <Link
                      to={`/freelancer/${freelancer._id}`}
                      className="text-blue-600 font-semibold hover:underline text-sm mt-2 block"
                    >
                      View Profile →
                    </Link>
                  </div>
                ))
              ) : (
                <p>No freelancers found in this category</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FreelancerCategorySelection;
