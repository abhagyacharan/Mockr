// src/App.jsx
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Header from "./components/pages/Header";
import Auth from "./components/pages/Auth";
import HeroSection from "./components/pages/HeroSection";
import FeaturesSection from "./components/pages/FeaturesSection";
import CTASection from "./components/pages/CTASection";
import Footer from "./components/pages/Footer";
import Login from "./components/pages/Login";
import ProtectedPage from "./components/pages/Protected";

const App = () => {
  return (
    <div className="relative min-h-screen bg-white">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/protected" element={<ProtectedPage />} />
        </Routes>
        <Auth />
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </Router>
    </div>
  );
};

export default App;
