import type { LucideIcon } from 'lucide-react';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, iconColor }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center mb-6`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;