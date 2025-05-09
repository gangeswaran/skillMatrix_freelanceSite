import React, { useEffect, useState } from "react";
import axios from "axios";

const FreelancerOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const freelancerId = localStorage.getItem("senderId");
  const userType = localStorage.getItem("type");

  useEffect(() => {
    if (userType !== "freelancer") {
      setError("Unauthorized: Only freelancers can view this page.");
      setLoading(false);
      return;
    }

    const fetchOffers = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/purchase-requests/${freelancerId}`);
          console.log("Response from server:", response.data);
          
          const data = response.data;
          const offerArray = Array.isArray(data) ? data : data?.offers || [];
          setOffers(offerArray);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching offers:", err);
          setError("Failed to load offers.");
          setLoading(false);
        }
      };
      

    fetchOffers();
  }, [freelancerId, userType]);

  const handleAccept = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/purchase-requests/${requestId}/accept`);
      setOffers((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "accepted" } : req
        )
      );
    } catch (err) {
      console.error("Failed to accept offer", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Offers</h2>
      {offers.length === 0 ? (
        <p>No job offers found.</p>
      ) : (
        <div>
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="my-4 p-4 border rounded-md shadow-sm bg-gray-50"
            >
              <h3 className="font-medium text-gray-800">
                Buyer: {offer.buyerId?.name || offer.buyerId}
              </h3>
              <p className="text-gray-700">Status: {offer.status}</p>
              <p className="text-gray-600">
                Created At: {new Date(offer.createdAt).toLocaleString()}
              </p>

              {offer.status === "pending" && (
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => handleAccept(offer._id)}
                >
                  Accept Offer
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerOffers;
