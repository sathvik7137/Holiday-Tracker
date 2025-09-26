import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Globe, Check } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const CountrySelector = ({ 
  countries = [], 
  selectedCountry, 
  onCountryChange, 
  loading = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter countries based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery, countries]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleCountrySelect = (country) => {
    onCountryChange(country);
    setIsOpen(false);
    setSearchQuery('');
  };

  const toggleDropdown = () => {
    if (!loading) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (event, country) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCountrySelect(country);
    }
  };

  if (!selectedCountry) {
    return (
      <div className="flex items-center space-x-2">
        <LoadingSpinner size="small" />
        <span className="text-sm text-gray-500">Loading countries...</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Country Button */}
      <button
        onClick={toggleDropdown}
        disabled={loading}
        className={`
          flex items-center space-x-3 px-4 py-2 bg-white border border-gray-300 
          rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 transition-colors
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected country: ${selectedCountry.name}`}
      >
        {loading ? (
          <LoadingSpinner size="small" />
        ) : (
          <>
            <span className="text-lg" role="img" aria-label={`${selectedCountry.name} flag`}>
              {selectedCountry.flag}
            </span>
            <div className="text-left">
              <div className="font-medium text-gray-900">
                {selectedCountry.name}
              </div>
              <div className="text-xs text-gray-500">
                {selectedCountry.code}
              </div>
            </div>
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !loading && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No countries found</p>
                <p className="text-xs">Try adjusting your search query</p>
              </div>
            ) : (
              <ul role="listbox" aria-label="Country list">
                {filteredCountries.map((country) => (
                  <li key={country.code}>
                    <button
                      onClick={() => handleCountrySelect(country)}
                      onKeyDown={(e) => handleKeyDown(e, country)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 text-left
                        hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                        transition-colors ${
                          selectedCountry.code === country.code 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-900'
                        }
                      `}
                    >
                      <span 
                        className="text-lg flex-shrink-0" 
                        role="img" 
                        aria-label={`${country.name} flag`}
                      >
                        {country.flag}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {country.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {country.code}
                          {country.continent && ` • ${country.continent}`}
                        </div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {countries.length} countries available
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;