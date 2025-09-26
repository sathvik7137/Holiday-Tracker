class CountryService {
  constructor() {
    // List of supported countries with their details
    this.countries = [
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
   * Get all supported countries
   * @returns {Promise<Array>} List of supported countries
   */
  async getSupportedCountries() {
    try {
      // Sort countries alphabetically by name
      const sortedCountries = [...this.countries].sort((a, b) => 
        a.name.localeCompare(b.name)
      );

      console.log(`📋 Retrieved ${sortedCountries.length} supported countries`);
      return sortedCountries;
    } catch (error) {
      console.error('Error getting supported countries:', error);
      throw new Error('Failed to retrieve supported countries');
    }
  }

  /**
   * Search countries by name or code
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching countries
   */
  async searchCountries(query) {
    try {
      const searchTerm = query.toLowerCase();
      
      const matchingCountries = this.countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm) ||
        country.code.toLowerCase().includes(searchTerm) ||
        country.continent.toLowerCase().includes(searchTerm)
      );

      // Sort by relevance (exact matches first, then partial matches)
      matchingCountries.sort((a, b) => {
        const aExactName = a.name.toLowerCase() === searchTerm;
        const bExactName = b.name.toLowerCase() === searchTerm;
        const aExactCode = a.code.toLowerCase() === searchTerm;
        const bExactCode = b.code.toLowerCase() === searchTerm;
        
        if (aExactName || aExactCode) return -1;
        if (bExactName || bExactCode) return 1;
        
        return a.name.localeCompare(b.name);
      });

      console.log(`🔍 Found ${matchingCountries.length} countries matching "${query}"`);
      return matchingCountries;
    } catch (error) {
      console.error('Error searching countries:', error);
      throw new Error('Failed to search countries');
    }
  }

  /**
   * Get detailed information about a specific country
   * @param {string} countryCode - ISO 3166-1 alpha-2 country code
   * @returns {Promise<Object|null>} Country details or null if not found
   */
  async getCountryDetails(countryCode) {
    try {
      const country = this.countries.find(c => 
        c.code.toUpperCase() === countryCode.toUpperCase()
      );

      if (!country) {
        console.log(`❌ Country with code ${countryCode} not found`);
        return null;
      }

      // Add additional metadata
      const countryDetails = {
        ...country,
        metadata: {
          supportedViews: ['monthly', 'quarterly'],
          holidayTypes: ['national', 'local', 'religious', 'observance'],
          lastUpdated: new Date().toISOString()
        }
      };

      console.log(`✅ Retrieved details for ${country.name} (${country.code})`);
      return countryDetails;
    } catch (error) {
      console.error('Error getting country details:', error);
      throw new Error('Failed to retrieve country details');
    }
  }

  /**
   * Get countries by continent
   * @param {string} continent - Continent name
   * @returns {Promise<Array>} Countries in the specified continent
   */
  async getCountriesByContinent(continent) {
    try {
      const continentCountries = this.countries.filter(country => 
        country.continent.toLowerCase() === continent.toLowerCase()
      );

      continentCountries.sort((a, b) => a.name.localeCompare(b.name));

      console.log(`🌍 Found ${continentCountries.length} countries in ${continent}`);
      return continentCountries;
    } catch (error) {
      console.error('Error getting countries by continent:', error);
      throw new Error('Failed to retrieve countries by continent');
    }
  }

  /**
   * Validate if a country code is supported
   * @param {string} countryCode - Country code to validate
   * @returns {boolean} True if supported, false otherwise
   */
  isCountrySupported(countryCode) {
    return this.countries.some(country => 
      country.code.toUpperCase() === countryCode.toUpperCase()
    );
  }

  /**
   * Get popular/recommended countries
   * @returns {Promise<Array>} List of popular countries
   */
  async getPopularCountries() {
    try {
      // Define popular countries based on common usage
      const popularCodes = ['US', 'IN', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP'];
      
      const popularCountries = this.countries.filter(country => 
        popularCodes.includes(country.code)
      );

      console.log(`⭐ Retrieved ${popularCountries.length} popular countries`);
      return popularCountries;
    } catch (error) {
      console.error('Error getting popular countries:', error);
      throw new Error('Failed to retrieve popular countries');
    }
  }
}

module.exports = new CountryService();