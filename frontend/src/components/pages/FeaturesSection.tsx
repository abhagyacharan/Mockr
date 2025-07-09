import { BookOpen, MessageSquare, BarChart3, Users, Zap, CheckCircle } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Resume-Based Questions",
      description: "Upload your resume and get tailored questions based on your experience and skills.",
      iconColor: "bg-blue-500"
    },
    {
      icon: MessageSquare,
      title: "Job Description Matching",
      description: "Practice with questions specifically designed for your target job descriptions.",
      iconColor: "bg-green-500"
    },
    {
      icon: BarChart3,
      title: "Instant Scoring",
      description: "Get immediate feedback on your answers with detailed scoring and improvement suggestions.",
      iconColor: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Multiple Formats",
      description: "Practice with MCQ, technical Q&A, and behavioral interview formats.",
      iconColor: "bg-orange-500"
    },
    {
      icon: Zap,
      title: "ATS Optimization",
      description: "Coming soon: Score your resume against job descriptions for ATS compatibility.",
      iconColor: "bg-red-500"
    },
    {
      icon: CheckCircle,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and insights.",
      iconColor: "bg-teal-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Mockr?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform provides personalized interview preparation that 
            adapts to your experience and target roles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;