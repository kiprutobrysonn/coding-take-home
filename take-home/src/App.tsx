import { useState } from "react";
import { SearchSection } from "./components/SearchSection";
import { CountryView } from "./components/CountryView";
import { StatsDashboard } from "./components/StatsDashboard";
import { ResultsDisplay } from "./components/ResultsDisplay";
import type { Listing } from "./middleware/middleware";

function App() {
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [searchType, setSearchType] = useState<
    "color" | "language" | undefined
  >();
  const [searchValue, setSearchValue] = useState<string>("");
  const [nullDataResults, setNullDataResults] = useState<Listing[]>([]);
  const [nullDataType, setNullDataType] = useState<
    "color" | "language" | "country" | undefined
  >();

  const handleSearchResults = (
    results: Listing[],
    type: "color" | "language",
    value: string
  ) => {
    setSearchResults(results);
    setSearchType(type);
    setSearchValue(value);
    setNullDataResults([]);
    setNullDataType(undefined);
  };

  const handleNullListingsClick = (
    key: "color" | "language" | "country",
    listings: Listing[]
  ) => {
    setNullDataResults(listings);
    setNullDataType(key);
    setSearchResults([]);
    setSearchType(undefined);
    setSearchValue("");
  };

  const handleClearResults = () => {
    setSearchResults([]);
    setSearchType(undefined);
    setSearchValue("");
    setNullDataResults([]);
    setNullDataType(undefined);
  };

  const displayResults =
    searchResults.length > 0 ? searchResults : nullDataResults;
  const highlightedListings =
    searchResults.length > 0 ? searchResults : undefined;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Listing Analytics Dashboard
        </h1>
      </header>

      <StatsDashboard onNullListingsClick={handleNullListingsClick} />

      <SearchSection onResults={handleSearchResults} />

      {displayResults.length > 0 && (
        <ResultsDisplay
          results={displayResults}
          searchType={searchType}
          searchValue={searchValue}
          nullDataType={nullDataType}
          onClear={handleClearResults}
        />
      )}

      <CountryView
        highlightedListings={highlightedListings}
        searchType={searchType}
        searchValue={searchValue}
      />
    </div>
  );
}

export default App;
