import { useEffect, useState } from "react";
import {
  BarChart3,
  AlertCircle,
  Database,
  MapPin,
  Palette,
  MessageSquare,
} from "lucide-react";
import {
  getStatistics,
  getListingsWithNullKey,
} from "../middleware/middleware";
import type { Listing } from "../middleware/middleware";

interface StatsDashboardProps {
  onNullListingsClick: (
    key: "color" | "language" | "country",
    listings: Listing[]
  ) => void;
}

interface Statistics {
  totalListings: number;
  uniqueCountries: number;
  uniqueColors: number;
  uniqueLanguages: number;
  nullCounts: {
    color: number;
    language: number;
    country: number;
  };
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  onNullListingsClick,
}) => {
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    const statistics = getStatistics();
    setStats(statistics);
  }, []);

  const handleNullClick = (key: "color" | "language" | "country") => {
    const nullListings = getListingsWithNullKey(key);
    onNullListingsClick(key, nullListings);
  };

  if (!stats) return <div>Loading statistics...</div>;

  const statCards = [
    {
      title: "Total Listings",
      value: stats.totalListings,
      icon: <Database size={24} />,
      color: "blue",
    },
    {
      title: "Countries",
      value: stats.uniqueCountries,
      icon: <MapPin size={24} />,
      color: "green",
    },
    {
      title: "Colors",
      value: stats.uniqueColors,
      icon: <Palette size={24} />,
      color: "purple",
    },
    {
      title: "Languages",
      value: stats.uniqueLanguages,
      icon: <MessageSquare size={24} />,
      color: "orange",
    },
  ];

  const nullDataCards = [
    {
      key: "color" as const,
      title: "Missing Color",
      count: stats.nullCounts.color,
      percentage: (
        (stats.nullCounts.color / stats.totalListings) *
        100
      ).toFixed(1),
    },
    {
      key: "language" as const,
      title: "Missing Language",
      count: stats.nullCounts.language,
      percentage: (
        (stats.nullCounts.language / stats.totalListings) *
        100
      ).toFixed(1),
    },
    {
      key: "country" as const,
      title: "Missing Country",
      count: stats.nullCounts.country,
      percentage: (
        (stats.nullCounts.country / stats.totalListings) *
        100
      ).toFixed(1),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-blue-600" />
        <h2 className="text-2xl font-semibold m-0">Data Overview</h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-8">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`bg-white rounded-lg p-6 flex items-center gap-4 border-2 border-transparent transition-all hover:-translate-y-0.5 hover:shadow-md ${
              card.color === "blue"
                ? "border-blue-600"
                : card.color === "green"
                ? "border-green-600"
                : card.color === "purple"
                ? "border-purple-600"
                : "border-orange-500"
            }`}
          >
            <div
              className={`opacity-80 ${
                card.color === "blue"
                  ? "text-blue-600"
                  : card.color === "green"
                  ? "text-green-600"
                  : card.color === "purple"
                  ? "text-purple-600"
                  : "text-orange-500"
              }`}
            >
              {card.icon}
            </div>
            <div>
              <div className="text-3xl font-bold m-0">
                {card.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center gap-3 mb-5">
          <AlertCircle className="text-orange-500" />
          <h3 className="text-xl font-semibold m-0">Data Quality Issues</h3>
          <span className="text-gray-600 text-sm ml-auto">
            Click to view listings with missing data
          </span>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {nullDataCards.map((card) => (
            <button
              key={card.key}
              onClick={() => handleNullClick(card.key)}
              className={`bg-white border rounded-lg p-5 text-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
                card.count > 0
                  ? "border-orange-500 bg-amber-50 hover:bg-amber-100"
                  : "border-green-600 bg-green-50"
              }`}
            >
              <div
                className={`text-3xl font-bold mb-2 ${
                  card.count > 0 ? "text-orange-500" : "text-green-600"
                }`}
              >
                {card.count}
              </div>
              <div className="font-semibold mb-1">{card.title}</div>
              <div className="text-sm text-gray-600">{card.percentage}%</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
