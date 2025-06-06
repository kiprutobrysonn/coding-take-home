import { useState } from "react";
import { SearchSection } from "./components/SearchSection";
import { CountryView } from "./components/CountryView";
import { StatsDashboard } from "./components/StatsDashboard";
import { ResultsDisplay } from "./components/ResultsDisplay";
import type { Listing } from "./middleware/middleware";

type SearchType = "color" | "language";
type NullDataType = "color" | "language" | "country";

interface AppState {
  searchResults: Listing[];
  searchType?: SearchType;
  searchValue: string;
  nullDataResults: Listing[];
  nullDataType?: NullDataType;
}

const initialState: AppState = {
  searchResults: [],
  searchType: undefined,
  searchValue: "",
  nullDataResults: [],
  nullDataType: undefined,
};

function App() {
  const [appState, setAppState] = useState<AppState>(initialState);

  const handleSearchResults = (
    results: Listing[],
    type: SearchType,
    value: string
  ) => {
    setAppState({
      searchResults: results,
      searchType: type,
      searchValue: value,
      nullDataResults: [],
      nullDataType: undefined,
    });
  };

  const handleNullListingsClick = (
    key: NullDataType,
    listings: Listing[]
  ) => {
    setAppState({
      searchResults: [],
      searchType: undefined,
      searchValue: "",
      nullDataResults: listings,
      nullDataType: key,
    });
  };

  const handleClearResults = () => {
    setAppState(initialState);
  };

  const displayResults =
    appState.searchResults.length > 0 ? appState.searchResults : appState.nullDataResults;
  const highlightedListings =
    appState.searchResults.length > 0 ? appState.searchResults : undefined;

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
          searchType={appState.searchType}
          searchValue={appState.searchValue}
          nullDataType={appState.nullDataType}
          onClear={handleClearResults}
        />
      )}

      <CountryView
        highlightedListings={highlightedListings}
        searchType={appState.searchType}
        searchValue={appState.searchValue}
      />
    </div>
  );
}

export default App;
