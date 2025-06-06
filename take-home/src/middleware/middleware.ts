import data from '../mock-data/MOCK_DATA.json';

// This is a tester function to show the intended flow of data from middleware to frontend.
export const fetchData = () => {
	console.log(data)
};

export type Listing = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	country: string | null;
	language: string | null;
	color: string | null;
};

export const getListingsByColorOrLanguage = (key: 'color' | 'language', value: string): Listing[] => {
	return (data as Listing[]).filter((item) => item[key]?.toLowerCase() === value.toLowerCase());
};


export const getAllCountries = () => {
	const countries = data.map((item: Listing) => item.country).filter(Boolean);
	return Array.from(new Set(countries));
};


export const getListingsWithNullKey = (key: 'color' | 'language' | 'country') => {
	return data.filter((item: Listing) => item[key] == null);
};

export const getListingsGroupedByCountry = (): Record<string, Listing[]> => {
	const grouped: Record<string, Listing[]> = {};

	(data as Listing[]).forEach((listing) => {
		const country = listing.country || 'Unknown';
		if (!grouped[country]) {
			grouped[country] = [];
		}
		grouped[country].push(listing);
	});

	return grouped;
};

export const getAllColors = (): string[] => {
	const colors = (data as Listing[])
		.map(item => item.color)
		.filter(Boolean) as string[];
	return Array.from(new Set(colors)).sort();
};

export const getAllLanguages = (): string[] => {
	const languages = (data as Listing[])
		.map(item => item.language)
		.filter(Boolean) as string[];
	return Array.from(new Set(languages)).sort();
};

export const getStatistics = () => {
	const totalListings = (data as Listing[]).length;
	const uniqueCountries = getAllCountries().length;
	const uniqueColors = getAllColors().length;
	const uniqueLanguages = getAllLanguages().length;

	const nullCounts = {
		color: getListingsWithNullKey('color').length,
		language: getListingsWithNullKey('language').length,
		country: getListingsWithNullKey('country').length,
	};

	return {
		totalListings,
		uniqueCountries,
		uniqueColors,
		uniqueLanguages,
		nullCounts,
	};
};