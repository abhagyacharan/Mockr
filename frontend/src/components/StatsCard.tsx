// components/StatsCard.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  isLoading?: boolean;
}

export function StatsCard({
  label,
  value,
  icon,
  color = "gray",
  isLoading,
}: StatsCardProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between">
        {/* Left side: text */}
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">{label}</p>
          {isLoading ? (
            <Skeleton className="h-6 sm:h-8 w-20 sm:w-24 mt-1 sm:mt-2 rounded-md" />
          ) : (
            <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
              {value}
            </p>
          )}
        </div>

        {/* Right side: icon inside colored circle - hidden on mobile */}
        <div
          className={`hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 rounded-full items-center justify-center ${
            colorMap[color]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
