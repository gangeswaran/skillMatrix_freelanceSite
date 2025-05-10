import React from "react";

const Home = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("type");

  const goTo = (path) => {
    window.location.href = path;
  };

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen flex flex-col justify-center items-center relative bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://i.pinimg.com/736x/b0/3f/81/b03f815fb319ce720eea730cf59ff111.jpg")',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <h1 className="text-5xl font-bold text-white mb-6 z-10 relative">
        Welcome to SkillMatrix
      </h1>
      <p className="text-lg text-white mb-8 z-10 relative">
        Connect with talented freelancers. Collaborate. Grow your business.
      </p>

      {/* Conditional CTAs */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-x-6 md:space-y-0 mb-8 z-10 relative">
        {token ? (
          <>
            {role === "buyer" && (
              <>
                <button
                  className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={() => goTo("/category")}
                >
                  Find Freelancers
                </button>
                <button
                  className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition duration-300"
                  onClick={() => goTo("/purchases")}
                >
                  View Purchases
                </button>
              </>
            )}
            {role === "freelancer" && (
              <>
                <button
                  className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={() => goTo("/gigs")}
                >
                  Manage Gigs
                </button>
                <button
                  className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition duration-300"
                  onClick={() => goTo("/profile")}
                >
                  View Profile
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <button
              className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition duration-300"
              onClick={() => goTo("/register")}
            >
              Join as Freelancer
            </button>
            <button
              className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition duration-300"
              onClick={() => goTo("/register")}
            >
              Hire Talent
            </button>
          </>
        )}
      </div>

      {/* Reuse your features section */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
        {/* ... features same as before ... */}
      </div>

      {/* Bottom info */}
      <div className="mt-12 text-center z-10 relative">
        <p className="text-xl text-white mb-4">
          Whether you're looking to hire, collaborate, or start your own freelancing journey, SkillMatrix is here to help!
        </p>
        <p className="text-sm text-gray-200">
          Sign up now and get started with SkillMatrix, where freelancers and businesses meet.
        </p>
      </div>
    </div>
  );
};

export default Home;
