import React from "react";

const Home = () => {
  const handlePage = () => {
    window.location.href = "/purchase";
  };

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen flex flex-col justify-center items-center relative bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://i.pinimg.com/736x/b0/3f/81/b03f815fb319ce720eea730cf59ff111.jpg")', // Replace with your image URL
      }}
    >
      {/* Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Main Heading */}
      <h1 className="text-5xl font-bold text-white mb-6 z-10 relative">
        Welcome to SkillMatrix
      </h1>
      <p className="text-lg text-white mb-8 z-10 relative">
        Connect with talented freelancers. Collaborate. Grow your business.
      </p>

      {/* Call to Action Section */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-x-6 md:space-y-0 mb-8 z-10 relative">
        <button
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handlePage}
        >
          Find Freelancers
        </button>
        <button className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition duration-300">
          Post a Job
        </button>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
        {/* Feature 1 */}
        <div className="bg-white p-6 shadow-lg rounded-md flex flex-col items-center justify-center space-y-4 hover:shadow-xl transition duration-300">
          <div className="text-4xl text-blue-600 mb-4">
            <i className="fas fa-users"></i>
          </div>
          <h3 className="text-2xl font-semibold">Find Skilled Freelancers</h3>
          <p className="text-gray-600">
            Browse a variety of talents from creative designers to expert developers. Start building your team now!
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-6 shadow-lg rounded-md flex flex-col items-center justify-center space-y-4 hover:shadow-xl transition duration-300">
          <div className="text-4xl text-green-600 mb-4">
            <i className="fas fa-briefcase"></i>
          </div>
          <h3 className="text-2xl font-semibold">Post a Project</h3>
          <p className="text-gray-600">
            Get the right talent for your project. Post a job and receive proposals from top freelancers within minutes.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-6 shadow-lg rounded-md flex flex-col items-center justify-center space-y-4 hover:shadow-xl transition duration-300">
          <div className="text-4xl text-red-600 mb-4">
            <i className="fas fa-thumbs-up"></i>
          </div>
          <h3 className="text-2xl font-semibold">Collaborate Seamlessly</h3>
          <p className="text-gray-600">
            Work together with freelancers and clients in real-time. Use our tools to chat, share files, and manage projects.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white p-6 shadow-lg rounded-md flex flex-col items-center justify-center space-y-4 hover:shadow-xl transition duration-300">
          <div className="text-4xl text-purple-600 mb-4">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3 className="text-2xl font-semibold">Grow Your Business</h3>
          <p className="text-gray-600">
            SkillMatrix helps you scale your projects by connecting you with the right people and providing tools for success.
          </p>
        </div>
      </div>

      {/* Additional Info */}
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
