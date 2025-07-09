const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Ace Your Next <span className="text-blue-600">Interview</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Practice with AI-powered mock interviews tailored to your resume and job descriptions. Get 
          instant feedback and improve your interview skills.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 font-medium text-lg">
            Start Free Trial
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-100 font-medium text-lg">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;