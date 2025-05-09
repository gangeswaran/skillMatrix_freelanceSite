import React from "react";

// Sample data for listings
const listingsData = [
  {
    id: 1,
    title: "Web Developer Needed for E-Commerce Site",
    description: "We need an experienced web developer to build an e-commerce platform using React and Node.js. The project includes building product pages, a shopping cart, and a payment gateway.",
    freelancerType: "Developer",
    budget: "$2000 - $3000",
    skillsRequired: ["React", "Node.js", "JavaScript", "E-commerce"],
    location: "Remote",
  },
  {
    id: 2,
    title: "Graphic Designer for Marketing Campaign",
    description: "Looking for a creative graphic designer to design banners, social media posts, and marketing materials for our upcoming campaign. Must have experience with Adobe Photoshop and Illustrator.",
    freelancerType: "Designer",
    budget: "$500 - $1000",
    skillsRequired: ["Photoshop", "Illustrator", "Design"],
    location: "Remote",
  },
  {
    id: 3,
    title: "Content Writer for Blog Articles",
    description: "We need a talented content writer to produce high-quality blog articles related to technology and digital marketing. Strong writing skills and research ability are a must.",
    freelancerType: "Writer",
    budget: "$100 - $500 per article",
    skillsRequired: ["Writing", "SEO", "Content Creation"],
    location: "Remote",
  },
  // Add more listings as needed
];

const Listings = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Freelance Listings</h2>

      {/* Loop through each listing and display a card */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {listingsData.map((listing) => (
          <div key={listing.id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
            <p className="text-gray-700 mb-2">{listing.description}</p>
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Freelancer Type:</span> {listing.freelancerType}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Skills Required:</span>{" "}
              {listing.skillsRequired.join(", ")}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Budget:</span> {listing.budget}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Location:</span> {listing.location}
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;
