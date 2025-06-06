import { useState, useEffect } from "react";
import { Globe, Users, ChevronDown, ChevronUp } from "lucide-react";
import { getListingsGroupedByCountry } from "../middleware/middleware";
import type { Listing } from "../middleware/middleware";

interface CountryViewProps {
  highlightedListings?: Listing[];
  searchType?: "color" | "language";
  searchValue?: string;
}

export const CountryView: React.FC<CountryViewProps> = ({
  highlightedListings,
  searchType,
  searchValue,
}) => {
  const [groupedListings, setGroupedListings] = useState<
    Record<string, Listing[]>
  >({});
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const grouped = getListingsGroupedByCountry();
    setGroupedListings(grouped);

    if (highlightedListings && highlightedListings.length > 0) {
      const countriesWithHighlights = new Set<string>();
      highlightedListings.forEach((listing) => {
        const country = listing.country || "Unknown";
        countriesWithHighlights.add(country);
      });
      setExpandedCountries(countriesWithHighlights);
    }
  }, [highlightedListings]);

  const toggleCountry = (country: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(country)) {
      newExpanded.delete(country);
    } else {
      newExpanded.add(country);
    }
    setExpandedCountries(newExpanded);
  };

  const isListingHighlighted = (listing: Listing) => {
    return highlightedListings?.some((h) => h.id === listing.id) || false;
  };

  const getCountryHighlightCount = (country: string) => {
    if (!highlightedListings) return 0;
    return (
      groupedListings[country]?.filter((listing) =>
        highlightedListings.some((h) => h.id === listing.id)
      ).length || 0
    );
  };

  const sortedCountries = Object.keys(groupedListings).sort((a, b) => {
    const aHighlights = getCountryHighlightCount(a);
    const bHighlights = getCountryHighlightCount(b);

    if (aHighlights !== bHighlights) {
      return bHighlights - aHighlights;
    }

    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Globe className="text-blue-600" />
        <h2 className="text-2xl font-semibold m-0">Listings by Country</h2>
        {searchType && searchValue && (
          <div className="ml-auto px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Showing {searchType}:{" "}
            <span className="font-bold">{searchValue}</span>
          </div>
        )}
      </div>

      <div className="grid gap-5">
        {sortedCountries.map((country) => {
          const listings = groupedListings[country];
          const isExpanded = expandedCountries.has(country);
          const highlightCount = getCountryHighlightCount(country);

          return (
            <div
              key={country}
              className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all hover:shadow-md ${
                highlightCount > 0 ? "border-blue-600 shadow-md" : ""
              }`}
            >
              <div
                className="p-5 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50"
                onClick={() => toggleCountry(country)}
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2 m-0">{country}</h3>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Users size={16} />
                    <span>{listings.length} listings</span>
                    {highlightCount > 0 && (
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded-xl font-semibold">
                        {highlightCount} match{highlightCount !== 1 ? "es" : ""}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-0">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className={`p-4 border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50 ${
                        isListingHighlighted(listing)
                          ? "bg-blue-50 border-l-4 border-l-blue-600"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">
                          {listing.first_name} {listing.last_name}
                        </span>
                        <span className="text-gray-600 text-sm font-mono">
                          {listing.email}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex gap-2 text-sm">
                          <span className="text-gray-600 font-medium min-w-[70px]">
                            Language:
                          </span>
                          <span
                            className={`${
                              !listing.language
                                ? "text-gray-400 italic"
                                : "text-gray-900"
                            }`}
                          >
                            {listing.language || "Not specified"}
                          </span>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <span className="text-gray-600 font-medium min-w-[70px]">
                            Color:
                          </span>
                          <span
                            className={`${
                              !listing.color
                                ? "text-gray-400 italic"
                                : "text-gray-900"
                            }`}
                          >
                            {listing.color || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
