import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">Mockr</span>
          </div>
          
          {/* <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium">About</a>
          </nav> */}
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 font-medium">Sign In</button>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 font-medium">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;