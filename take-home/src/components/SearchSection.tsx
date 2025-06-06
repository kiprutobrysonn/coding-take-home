import { useState } from "react";
import { Search, Filter } from "lucide-react";
import {
  getListingsByColorOrLanguage,
  getAllColors,
  getAllLanguages,
} from "../middleware/middleware";
import type { Listing } from "../middleware/middleware";

interface SearchSectionProps {
  onResults: (
    results: Listing[],
    searchType: "color" | "language",
    searchValue: string
  ) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onResults }) => {
  const [searchKey, setSearchKey] = useState<"color" | "language">("color");
  const [searchValue, setSearchValue] = useState("");
  const [isCustomSearch, setIsCustomSearch] = useState(false);

  const colors = getAllColors();
  const languages = getAllLanguages();
  const options = searchKey === "color" ? colors : languages;

  const handleSearch = () => {
    if (searchValue.trim()) {
      const results = getListingsByColorOrLanguage(searchKey, searchValue);
      onResults(results, searchKey, searchValue);
    }
  };

  const handleOptionSelect = (value: string) => {
    setSearchValue(value);
    const results = getListingsByColorOrLanguage(searchKey, value);
    onResults(results, searchKey, value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Search className="text-blue-600" />
        <h2 className="text-2xl font-semibold m-0">Search Listings</h2>
      </div>

      <div className="flex items-center gap-6 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <select
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value as "color" | "language");
              setSearchValue("");
            }}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium"
          >
            <option value="color">Color</option>
            <option value="language">Language</option>
          </select>
        </div>

        <div className="search-mode-toggle">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isCustomSearch}
              onChange={(e) => setIsCustomSearch(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span>Custom search</span>
          </label>
        </div>
      </div>

      {isCustomSearch ? (
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Enter ${searchKey}...`}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white border-none rounded-md font-semibold cursor-pointer transition-all hover:bg-blue-700 hover:-translate-y-0.5"
          >
            Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={`px-4 py-3 border rounded-md text-sm font-medium cursor-pointer transition-all text-center ${
                searchValue === option
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 bg-white text-gray-900 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
