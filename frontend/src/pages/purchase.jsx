import React, { useEffect, useState } from "react";
import axios from "axios";

// CSS for Sky Cracker Animation
const skyCrackerAnimation = `
  @keyframes skyCracker {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    25% {
      transform: scale(1) rotate(90deg);
      opacity: 1;
    }
    50% {
      transform: scale(1.5) rotate(180deg);
      opacity: 0.8;
    }
    75% {
      transform: scale(2) rotate(270deg);
      opacity: 0.5;
    }
    100% {
      transform: scale(3) rotate(360deg);
      opacity: 0;
    }
  }

  .sky-cracker {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #ffcc00;
    border-radius: 50%;
    animation: skyCracker 1.5s ease-out forwards;
    opacity: 0;
  }

  .sky-cracker:nth-child(1) {
    animation-delay: 0s;
    top: 30%;
    left: 50%;
  }

  .sky-cracker:nth-child(2) {
    animation-delay: 0.2s;
    top: 25%;
    left: 55%;
  }

  .sky-cracker:nth-child(3) {
    animation-delay: 0.4s;
    top: 35%;
    left: 45%;
  }

  .sky-cracker:nth-child(4) {
    animation-delay: 0.6s;
    top: 40%;
    left: 60%;
  }

  .sky-cracker:nth-child(5) {
    animation-delay: 0.8s;
    top: 32%;
    left: 43%;
  }

  .sky-cracker:nth-child(6) {
    animation-delay: 1s;
    top: 33%;
    left: 48%;
  }
`;

const PurchaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [credits, setCredits] = useState(0);
  const userId = localStorage.getItem("senderId");
  const userType = localStorage.getItem("userType"); // 'buyer' or 'freelancer'

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/purchase-requests/${userId}`
        );
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load purchase requests.");
        setLoading(false);
      }
    };
    const fetchCredits = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}/credits`);
        setCredits(response.data.credits);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching credits:", err);
        setError("Unable to fetch credits.");
        setLoading(false);
      }
    };
    fetchRequests();
    fetchCredits();
  }, [userId]);

  const handleAccept = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/purchase-requests/${requestId}/accept`);
      // Update UI after accepting
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "accepted" } : req
        )
      );
    } catch (err) {
      console.error("Failed to accept request", err);
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-700 py-6">
      <div className="max-w-4xl mx-auto p-6 bg-white bg-opacity-80 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Purchase Requests</h2>

        {/* Displaying Credits */}
        <style>{skyCrackerAnimation}</style>
        <div className="bg-white p-6 shadow-lg rounded-md max-w-sm mx-auto mt-6 text-center border border-gray-200 bg-opacity-90 relative">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Credits</h2>
          <p className="text-3xl text-green-600 font-bold">{credits}</p>

          {/* Display Discount if credits >= 1 */}
          {credits >= 1 && (
            <div className="relative inline-block mt-4">
              <p className="text-lg text-blue-600 mt-2">
                You are eligible for a 100 INR discount on your next gig!
              </p>

              {/* Sky Cracker animation elements */}
              <div className="sky-cracker"></div>
              <div className="sky-cracker"></div>
              <div className="sky-cracker"></div>
              <div className="sky-cracker"></div>
              <div className="sky-cracker"></div>
              <div className="sky-cracker"></div>
            </div>
          )}
        </div>

        {/* Purchase Request List */}
        {requests.length === 0 ? (
          <p className="text-center text-gray-600 mt-6">No requests found.</p>
        ) : (
          <div>
            {requests.map((request) => (
              <div
                key={request._id}
                className="my-4 p-6 border rounded-lg shadow-lg bg-white hover:shadow-2xl transition-all duration-300 ease-in-out"
              >
                <h3 className="font-medium text-gray-800 text-lg">
                  Freelancer: {request.freelancerId?.name || request.freelancerId}
                </h3>
                <p className="text-gray-700 text-sm">Status: {request.status}</p>
                <p className="text-gray-600 text-sm">
                  Requested by: {request.buyerId?.name || request.buyerId}
                </p>
                <p className="text-gray-600 text-sm">
                  Created At: {new Date(request.createdAt).toLocaleString()}
                </p>

                {userType === "freelancer" && request.status === "pending" && (
                  <button
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    onClick={() => handleAccept(request._id)}
                  >
                    Accept Request
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseRequests;
