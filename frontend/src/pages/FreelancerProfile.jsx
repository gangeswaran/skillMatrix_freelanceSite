import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const FreelancerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Freelancer ID (receiver)
  const [freelancer, setFreelancer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false); // State to control message box visibility
  const [rating, setRating] = useState(0); // State to hold rating value
  const [review, setReview] = useState(""); // State to hold review text
  const [reviews, setReviews] = useState([]); // State to hold freelancer's reviews
  const [averageRating, setAverageRating] = useState(0); // State to hold average rating

  const token = localStorage.getItem("token"); // Assuming token is saved after login

  useEffect(() => {
    const fetchFreelancerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/freelancer/${id}`
        );
        setFreelancer(response.data);
      } catch (error) {
        setError("Error fetching freelancer details");
        console.error(error);
      }
      setLoading(false);
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data.reverse()); // Reverse for chronological display
      } catch (error) {
        setError("Error fetching messages");
        console.error(error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reviews/${id}`);
        setReviews(response.data.reviews);
        const totalRating = response.data.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAverageRating(totalRating / response.data.length);
      } catch (error) {
        setError("Error fetching reviews");
        console.error(error);
      }
    };

    fetchFreelancerDetails();
    fetchMessages();
    fetchReviews();
  }, [id, token]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/send/${id}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data]);
      setMessage("");
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError("Message not sent.");
      console.error(err);
    }
  };

  const handleToggleMessageBox = () => {
    setIsMessageBoxOpen(!isMessageBoxOpen); // Toggle message box visibility
  };

  const handleReviewSubmit = async () => {
    if (!review.trim() || rating === 0) return;

    try {
      const buyerId = localStorage.getItem("senderId");
      const response = await axios.post(
        `http://localhost:5000/rate/${id}`,
        { review, rating, buyerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([...reviews, response.data]);
      setReview("");
      setRating(0);
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError("Error submitting review");
      console.error(error);
    }
  };

  const handleBuy = async () => {
    try {
      const buyerId = localStorage.getItem("senderId")
      const response = await axios.post(
        `http://localhost:5000/buy/${freelancer._id}`, 
        { buyerId: buyerId } // Replace this dynamically if using auth
      );
      alert("Purchase request sent successfully!");
    } catch (error) {
      alert("Failed to send purchase request.");
    }
  };

  const handlepurchse = () => {
    navigate("/purchases"); // Navigate to the purchases page
  };

  return (
    <div className="container mx-auto p-8">
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800">{freelancer?.name}'s Profile</h2>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleBuy}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                ₹{freelancer.price} per hour
              </button>
              <button
                onClick={handlepurchse}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Your Purchases
              </button>
            </div>

            <div className="mt-8">
              {/* Freelancer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium text-gray-700">Email:</p>
                  <p className="text-gray-600">{freelancer?.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Skills:</p>
                  <p className="text-gray-600">
                    {freelancer?.skills?.join(", ") || "No skills listed"}
                  </p>
                </div>
              </div>

              {/* Freelancer Portfolio */}
              <div className="mt-6">
                <strong className="font-medium text-gray-700">Portfolio:</strong>
                {freelancer?.portfolio?.length > 0 ? (
                  freelancer.portfolio.map((project, index) => (
                    <div key={index} className="my-4 p-4 border rounded-md shadow-sm">
                      <p className="font-medium text-gray-800">Project Title:</p>
                      <p className="text-gray-600">{project.title}</p>
                      <p className="font-medium text-gray-800 mt-2">Description:</p>
                      <p className="text-gray-600">{project.projectDescription}</p>
                      {project.portfolioLinks?.map((link, idx) => (
                        <div key={idx} className="mt-2">
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {link}
                          </a>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No portfolio available</p>
                )}
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800">
                Average Rating: {averageRating.toFixed(1)} / 5
              </h3>

              <div className="mt-6">
                <h4 className="text-xl font-semibold text-gray-700">Reviews:</h4>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="my-4 p-4 border rounded-md shadow-sm bg-gray-50">
                      <p className="font-medium text-gray-800">Rating: {review.rating} / 5</p>
                      <p className="text-gray-700">{review.reviewText}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No reviews yet.</p>
                )}
              </div>

              {/* Review and Rating Form */}
              <div className="mt-6">
                <h4 className="text-xl font-semibold text-gray-700">Write a Review:</h4>
                <div className="my-4">
                  <label className="text-gray-700">Rating (1-5):</label>
                  <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    min="1"
                    max="5"
                    className="w-20 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="my-4">
                  <label className="text-gray-700">Review:</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your review here..."
                  ></textarea>
                </div>
                <button
                  onClick={handleReviewSubmit}
                  className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>

          {/* Chat Message Box Button */}
          <button
            onClick={handleToggleMessageBox}
            className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
          >
            {isMessageBoxOpen ? "Close Chat" : "Message Freelancer"}
          </button>

          {/* Message Box */}
          {isMessageBoxOpen && (
            <div className="fixed bottom-20 right-8 w-80 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Send a Message:
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here..."
              ></textarea>
              <button
                onClick={handleSendMessage}
                className="mt-4 w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Send Message
              </button>
              {success && (
                <div className="mt-2 text-green-500">
                  Message sent successfully!
                </div>
              )}
              {error && <div className="mt-2 text-red-500">{error}</div>}

              {/* Display messages */}
              <div className="mt-4 max-h-60 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className="border p-4 mt-2 rounded-lg shadow-sm bg-gray-50"
                    >
                      <p className="font-medium text-gray-800">
                        {msg.senderId.name}:
                      </p>
                      <p className="text-gray-700">{msg.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Sent on {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No messages available</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FreelancerProfile;
