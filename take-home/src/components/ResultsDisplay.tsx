import { X, User, Mail, MapPin, Palette, MessageSquare } from "lucide-react";
import type { Listing } from "../middleware/middleware";

interface ResultsDisplayProps {
  results: Listing[];
  searchType?: "color" | "language";
  searchValue?: string;
  nullDataType?: "color" | "language" | "country";
  onClear: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  searchType,
  searchValue,
  nullDataType,
  onClear,
}) => {
  if (results.length === 0) return null;

  const getTitle = () => {
    if (nullDataType) {
      return `Listings with Missing ${
        nullDataType.charAt(0).toUpperCase() + nullDataType.slice(1)
      }`;
    }
    if (searchType && searchValue) {
      return `${
        searchType.charAt(0).toUpperCase() + searchType.slice(1)
      }: ${searchValue}`;
    }
    return "Search Results";
  };

  const getIcon = () => {
    if (nullDataType === "country") return <MapPin size={20} />;
    if (nullDataType === "color") return <Palette size={20} />;
    if (nullDataType === "language") return <MessageSquare size={20} />;
    if (searchType === "color") return <Palette size={20} />;
    if (searchType === "language") return <MessageSquare size={20} />;
    return <User size={20} />;
  };

  const getMissingDataLabel = (listing: Listing) => {
    if (!nullDataType) return null;

    const missingItems = [];
    if (!listing.color) missingItems.push("Color");
    if (!listing.language) missingItems.push("Language");
    if (!listing.country) missingItems.push("Country");

    return missingItems.length > 0
      ? `Missing: ${missingItems.join(", ")}`
      : null;
  };

  return (
    <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {getIcon()}
          <h2 className="text-2xl font-semibold m-0">{getTitle()}</h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-md cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-900"
        >
          <X size={20} />
          Clear
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {results.map((listing) => (
          <div
            key={listing.id}
            className="bg-white border border-gray-200 rounded-lg p-5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-semibold text-base">
                <User size={16} />
                {listing.first_name} {listing.last_name}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                #{listing.id}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} />
                <span className="text-blue-600 font-mono">{listing.email}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} />
                <span
                  className={`${
                    !listing.country ? "text-gray-400 italic" : "text-gray-600"
                  }`}
                >
                  {listing.country || "Not specified"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MessageSquare size={14} />
                <span
                  className={`${
                    !listing.language ? "text-gray-400 italic" : "text-gray-600"
                  } ${
                    searchType === "language"
                      ? "bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold"
                      : ""
                  }`}
                >
                  {listing.language || "Not specified"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Palette size={14} />
                <span
                  className={`${
                    !listing.color ? "text-gray-400 italic" : "text-gray-600"
                  } ${
                    searchType === "color"
                      ? "bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold"
                      : ""
                  }`}
                >
                  {listing.color || "Not specified"}
                </span>
              </div>
            </div>

            {nullDataType && (
              <div className="mt-3 px-3 py-2 bg-amber-50 text-orange-600 rounded-md text-xs font-semibold border-l-4 border-orange-500">
                {getMissingDataLabel(listing)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
