import axios from 'axios';

// Create axios instance for country service
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Country service error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    const { status, data } = error.response;
    throw new Error(data.message || `Server error (${status})`);
  }
);

class CountryService {
  /**
   * Get all supported countries
   * @returns {Promise<Array>} Array of country objects
   */
  async getCountries() {
    try {
      console.log('🌍 Fetching countries list...');
      
      const response = await api.get('/countries');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch countries');
      }

      const countries = response.data.data.countries || [];
      console.log(`✅ Loaded ${countries.length} countries`);
      
      return countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      
      // Return fallback countries if API fails
      console.warn('🔄 Using fallback countries data');
      return this.getFallbackCountries();
    }
  }

  /**
   * Search countries by name or code
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching countries
   */
  async searchCountries(query) {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const params = { q: query.trim() };
      const response = await api.get('/countries/search', { params });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to search countries');
      }

      return response.data.data.countries || [];
    } catch (error) {
      console.error('Error searching countries:', error);
      
      // Fallback to local search
      const allCountries = await this.getCountries();
      return this.searchCountriesLocally(allCountries, query);
    }
  }

  /**
   * Get details for a specific country
   * @param {string} countryCode - ISO 3166-1 alpha-2 country code
   * @returns {Promise<Object|null>} Country details or null
   */
  async getCountryDetails(countryCode) {
    try {
      const response = await api.get(`/countries/${countryCode.toUpperCase()}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Country not found');
      }

      return response.data.data.country;
    } catch (error) {
      console.error('Error fetching country details:', error);
      throw error;
    }
  }

  /**
   * Get popular/recommended countries
   * @returns {Promise<Array>} Array of popular countries
   */
  async getPopularCountries() {
    try {
      const allCountries = await this.getCountries();
      const popularCodes = ['US', 'IN', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP'];
      
      return allCountries.filter(country => 
        popularCodes.includes(country.code)
      );
    } catch (error) {
      console.error('Error fetching popular countries:', error);
      return this.getFallbackCountries().slice(0, 8);
    }
  }

  /**
   * Local search through countries array
   * @param {Array} countries - Countries array
   * @param {string} query - Search query
   * @returns {Array} Filtered countries
   */
  searchCountriesLocally(countries, query) {
    if (!query || query.trim().length < 2) {
      return countries;
    }

    const searchTerm = query.toLowerCase();
    
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm) ||
      (country.continent && country.continent.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get fallback countries data when API is unavailable
   * @returns {Array} Fallback countries array
   */
  getFallbackCountries() {
    return [
      {
        code: 'US',
        name: 'United States',
        flag: '🇺🇸',
        timezone: 'America/New_York',
        continent: 'North America'
      },
      {
        code: 'IN',
        name: 'India',
        flag: '🇮🇳',
        timezone: 'Asia/Kolkata',
        continent: 'Asia'
      },
      {
        code: 'GB',
        name: 'United Kingdom',
        flag: '🇬🇧',
        timezone: 'Europe/London',
        continent: 'Europe'
      },
      {
        code: 'CA',
        name: 'Canada',
        flag: '🇨🇦',
        timezone: 'America/Toronto',
        continent: 'North America'
      },
      {
        code: 'AU',
        name: 'Australia',
        flag: '🇦🇺',
        timezone: 'Australia/Sydney',
        continent: 'Oceania'
      },
      {
        code: 'DE',
        name: 'Germany',
        flag: '🇩🇪',
        timezone: 'Europe/Berlin',
        continent: 'Europe'
      },
      {
        code: 'FR',
        name: 'France',
        flag: '🇫🇷',
        timezone: 'Europe/Paris',
        continent: 'Europe'
      },
      {
        code: 'JP',
        name: 'Japan',
        flag: '🇯🇵',
        timezone: 'Asia/Tokyo',
        continent: 'Asia'
      },
      {
        code: 'CN',
        name: 'China',
        flag: '🇨🇳',
        timezone: 'Asia/Shanghai',
        continent: 'Asia'
      },
      {
        code: 'BR',
        name: 'Brazil',
        flag: '🇧🇷',
        timezone: 'America/Sao_Paulo',
        continent: 'South America'
      },
      {
        code: 'MX',
        name: 'Mexico',
        flag: '🇲🇽',
        timezone: 'America/Mexico_City',
        continent: 'North America'
      },
      {
        code: 'RU',
        name: 'Russia',
        flag: '🇷🇺',
        timezone: 'Europe/Moscow',
        continent: 'Europe'
      },
      {
        code: 'ZA',
        name: 'South Africa',
        flag: '🇿🇦',
        timezone: 'Africa/Johannesburg',
        continent: 'Africa'
      },
      {
        code: 'IT',
        name: 'Italy',
        flag: '🇮🇹',
        timezone: 'Europe/Rome',
        continent: 'Europe'
      },
      {
        code: 'ES',
        name: 'Spain',
        flag: '🇪🇸',
        timezone: 'Europe/Madrid',
        continent: 'Europe'
      },
      {
        code: 'NL',
        name: 'Netherlands',
        flag: '🇳🇱',
        timezone: 'Europe/Amsterdam',
        continent: 'Europe'
      },
      {
        code: 'SE',
        name: 'Sweden',
        flag: '🇸🇪',
        timezone: 'Europe/Stockholm',
        continent: 'Europe'
      },
      {
        code: 'NO',
        name: 'Norway',
        flag: '🇳🇴',
        timezone: 'Europe/Oslo',
        continent: 'Europe'
      },
      {
        code: 'DK',
        name: 'Denmark',
        flag: '🇩🇰',
        timezone: 'Europe/Copenhagen',
        continent: 'Europe'
      },
      {
        code: 'SG',
        name: 'Singapore',
        flag: '🇸🇬',
        timezone: 'Asia/Singapore',
        continent: 'Asia'
      },
      {
        code: 'KR',
        name: 'South Korea',
        flag: '🇰🇷',
        timezone: 'Asia/Seoul',
        continent: 'Asia'
      },
      {
        code: 'TH',
        name: 'Thailand',
        flag: '🇹🇭',
        timezone: 'Asia/Bangkok',
        continent: 'Asia'
      },
      {
        code: 'MY',
        name: 'Malaysia',
        flag: '🇲🇾',
        timezone: 'Asia/Kuala_Lumpur',
        continent: 'Asia'
      },
      {
        code: 'PH',
        name: 'Philippines',
        flag: '🇵🇭',
        timezone: 'Asia/Manila',
        continent: 'Asia'
      },
      {
        code: 'ID',
        name: 'Indonesia',
        flag: '🇮🇩',
        timezone: 'Asia/Jakarta',
        continent: 'Asia'
      },
      {
        code: 'VN',
        name: 'Vietnam',
        flag: '🇻🇳',
        timezone: 'Asia/Ho_Chi_Minh',
        continent: 'Asia'
      },
      {
        code: 'AE',
        name: 'United Arab Emirates',
        flag: '🇦🇪',
        timezone: 'Asia/Dubai',
        continent: 'Asia'
      },
      {
        code: 'SA',
        name: 'Saudi Arabia',
        flag: '🇸🇦',
        timezone: 'Asia/Riyadh',
        continent: 'Asia'
      },
      {
        code: 'IL',
        name: 'Israel',
        flag: '🇮🇱',
        timezone: 'Asia/Jerusalem',
        continent: 'Asia'
      },
      {
        code: 'EG',
        name: 'Egypt',
        flag: '🇪🇬',
        timezone: 'Africa/Cairo',
        continent: 'Africa'
      },
      {
        code: 'NG',
        name: 'Nigeria',
        flag: '🇳🇬',
        timezone: 'Africa/Lagos',
        continent: 'Africa'
      },
      {
        code: 'KE',
        name: 'Kenya',
        flag: '🇰🇪',
        timezone: 'Africa/Nairobi',
        continent: 'Africa'
      },
      {
        code: 'AR',
        name: 'Argentina',
        flag: '🇦🇷',
        timezone: 'America/Argentina/Buenos_Aires',
        continent: 'South America'
      },
      {
        code: 'CL',
        name: 'Chile',
        flag: '🇨🇱',
        timezone: 'America/Santiago',
        continent: 'South America'
      },
      {
        code: 'CO',
        name: 'Colombia',
        flag: '🇨🇴',
        timezone: 'America/Bogota',
        continent: 'South America'
      }
    ];
  }

  /**
   * Validate country code format
   * @param {string} countryCode - Country code to validate
   * @returns {boolean} True if valid format
   */
  isValidCountryCode(countryCode) {
    return typeof countryCode === 'string' && 
           countryCode.length === 2 && 
           /^[A-Z]{2}$/.test(countryCode.toUpperCase());
  }
}

// Export singleton instance
export const countryService = new CountryService();
export default countryService;