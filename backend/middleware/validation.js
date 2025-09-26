const countryService = require('../services/countryService');

/**
 * Middleware to validate country parameter
 */
const validateCountry = (req, res, next) => {
  const { country } = req.query;
  
  if (!country) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameter',
      message: 'Country parameter is required'
    });
  }

  if (typeof country !== 'string' || country.length !== 2) {
    return res.status(400).json({
      success: false,
      error: 'Invalid country format',
      message: 'Country must be a 2-letter ISO 3166-1 alpha-2 code (e.g., US, IN, GB)'
    });
  }

  if (!countryService.isCountrySupported(country.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported country',
      message: `Country ${country.toUpperCase()} is not supported. Please check /api/countries for supported countries.`
    });
  }

  next();
};

/**
 * Middleware to validate date range parameters
 */
const validateDateRange = (req, res, next) => {
  const { year, month, startDate, endDate } = req.query;
  
  // Year validation
  if (!year) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameter',
      message: 'Year parameter is required'
    });
  }

  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 10) {
    return res.status(400).json({
      success: false,
      error: 'Invalid year',
      message: `Year must be between 1900 and ${currentYear + 10}`
    });
  }

  // Month validation (optional)
  if (month) {
    const monthNum = parseInt(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        error: 'Invalid month',
        message: 'Month must be between 1 and 12'
      });
    }
  }

  // Date range validation (optional)
  if (startDate && endDate) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format',
        message: 'Dates must be in YYYY-MM-DD format'
      });
    }

    if (startDateObj > endDateObj) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date range',
        message: 'Start date must be before or equal to end date'
      });
    }

    // Check if date range is reasonable (not more than 2 years)
    const daysDifference = (endDateObj - startDateObj) / (1000 * 60 * 60 * 24);
    if (daysDifference > 730) {
      return res.status(400).json({
        success: false,
        error: 'Date range too large',
        message: 'Date range cannot exceed 2 years'
      });
    }
  }

  next();
};

/**
 * Middleware to validate quarter parameter
 */
const validateQuarter = (req, res, next) => {
  const { quarter } = req.query;
  
  if (!quarter) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameter',
      message: 'Quarter parameter is required'
    });
  }

  const quarterNum = parseInt(quarter);
  if (isNaN(quarterNum) || quarterNum < 1 || quarterNum > 4) {
    return res.status(400).json({
      success: false,
      error: 'Invalid quarter',
      message: 'Quarter must be between 1 and 4'
    });
  }

  next();
};

/**
 * Middleware to validate search query
 */
const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Missing search query',
      message: 'Search query parameter "q" is required'
    });
  }

  if (typeof q !== 'string' || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Invalid search query',
      message: 'Search query must be at least 2 characters long'
    });
  }

  if (q.trim().length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Search query too long',
      message: 'Search query cannot exceed 100 characters'
    });
  }

  next();
};

/**
 * Middleware to sanitize input parameters
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize query parameters
  Object.keys(req.query).forEach(key => {
    if (typeof req.query[key] === 'string') {
      // Remove potentially harmful characters
      req.query[key] = req.query[key]
        .replace(/[<>\"']/g, '')
        .trim();
    }
  });

  // Sanitize body parameters
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/[<>\"']/g, '')
          .trim();
      }
    });
  }

  next();
};

/**
 * Middleware to log API requests
 */
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`📝 [${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log(`   Query params:`, req.query);
  }
  
  next();
};

module.exports = {
  validateCountry,
  validateDateRange,
  validateQuarter,
  validateSearchQuery,
  sanitizeInput,
  logRequest
};