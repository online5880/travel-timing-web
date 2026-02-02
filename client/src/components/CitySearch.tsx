/* Data-Driven Expedition Interface Design
 * - City/Country search with autocomplete
 * - Open-Meteo Geocoding API integration
 * - Real-time search results
 */

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchResult {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  country_code: string;
}

interface CitySearchProps {
  onSelect: (location: SearchResult) => void;
}

export default function CitySearch({ onSelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=ko`
        );
        const data = await response.json();

        if (data.results) {
          const formattedResults = data.results.map((result: any) => ({
            name: result.name,
            admin1: result.admin1,
            country: result.country,
            latitude: result.latitude,
            longitude: result.longitude,
            country_code: result.country_code,
          }));
          setResults(formattedResults);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="도시 또는 국가 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="pl-10 border-border"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((result, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-muted border-b border-border last:border-0 transition-colors"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{result.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {result.admin1 && `${result.admin1}, `}
                    {result.country}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">
                    {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded p-4 text-center text-sm text-muted-foreground">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
}
