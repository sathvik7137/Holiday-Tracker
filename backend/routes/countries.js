const express = require('express');
const router = express.Router();
const countryService = require('../services/countryService');

/**
 * GET /api/countries
 * Get list of supported countries
 */
router.get('/', async (req, res) => {
  try {
    console.log('🌍 Fetching supported countries list');
    
    const countries = await countryService.getSupportedCountries();
    
    res.json({
      success: true,
      data: {
        countries,
        metadata: {
          totalCountries: countries.length,
          lastUpdated: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries',
      message: error.message
    });
  }
});

/**
 * GET /api/countries/search
 * Search countries by name or code
 * Query params:
 * - q: Search query
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search query',
        message: 'Search query must be at least 2 characters long'
      });
    }

    console.log(`🔍 Searching countries with query: "${q}"`);
    
    const countries = await countryService.searchCountries(q.trim());
    
    res.json({
      success: true,
      data: {
        countries,
        metadata: {
          searchQuery: q.trim(),
          resultsCount: countries.length
        }
      }
    });
  } catch (error) {
    console.error('Error searching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search countries',
      message: error.message
    });
  }
});

/**
 * GET /api/countries/:code
 * Get detailed information about a specific country
 */
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    if (!code || code.length !== 2) {
      return res.status(400).json({
        success: false,
        error: 'Invalid country code',
        message: 'Country code must be a 2-letter ISO code'
      });
    }

    console.log(`🌍 Fetching details for country: ${code.toUpperCase()}`);
    
    const country = await countryService.getCountryDetails(code.toUpperCase());
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: 'Country not found',
        message: `Country with code ${code.toUpperCase()} not found`
      });
    }
    
    res.json({
      success: true,
      data: {
        country
      }
    });
  } catch (error) {
    console.error('Error fetching country details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch country details',
      message: error.message
    });
  }
});

module.exports = router;