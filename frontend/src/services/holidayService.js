import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.params) {
      console.log('📝 Request params:', config.params);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection and try again.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new Error(data.message || 'Invalid request parameters');
      case 401:
        throw new Error('Authentication failed. Please check your API key.');
      case 403:
        throw new Error('Access forbidden. You don\'t have permission to access this resource.');
      case 404:
        throw new Error('Requested resource not found');
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(data.message || `Server error (${status}). Please try again later.`);
    }
  }
);

class HolidayService {
  /**
   * Get holidays for a specific country and date range
   * @param {Object} params - Request parameters
   * @param {string} params.country - Country code (ISO 3166-1 alpha-2)
   * @param {number} params.year - Year
   * @param {number} [params.month] - Month (1-12)
   * @param {string} [params.startDate] - Start date (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of holiday objects
   */
  async getHolidays({ country, year, month, startDate, endDate }) {
    try {
      const params = {
        country: country.toUpperCase(),
        year,
      };

      if (month) params.month = month;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get('/holidays', { params });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch holidays');
      }

      return response.data.data.holidays || [];
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw error;
    }
  }

  /**
   * Get quarterly holidays (3 months)
   * @param {Object} params - Request parameters  
   * @param {string} params.country - Country code
   * @param {number} params.year - Year
   * @param {number} params.quarter - Quarter (1-4)
   * @returns {Promise<Array>} Array of holiday objects
   */
  async getQuarterlyHolidays({ country, year, quarter }) {
    try {
      const params = {
        country: country.toUpperCase(),
        year,
        quarter,
      };

      const response = await api.get('/holidays/quarterly', { params });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch quarterly holidays');
      }

      return response.data.data.holidays || [];
    } catch (error) {
      console.error('Error fetching quarterly holidays:', error);
      throw error;
    }
  }

  /**
   * Get week summary for color coding
   * @param {Object} params - Request parameters
   * @param {string} params.country - Country code
   * @param {number} params.year - Year
   * @param {number} [params.month] - Month (1-12)
   * @param {number} [params.quarter] - Quarter (1-4)
   * @returns {Promise<Array>} Array of week summary objects
   */
  async getWeekSummary({ country, year, month, quarter }) {
    try {
      const params = {
        country: country.toUpperCase(),
        year,
      };

      if (month) params.month = month;
      if (quarter) params.quarter = quarter;

      const response = await api.get('/holidays/week-summary', { params });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch week summary');
      }

      return response.data.data.weekSummary || [];
    } catch (error) {
      console.error('Error fetching week summary:', error);
      throw error;
    }
  }

  /**
   * Check API health
   * @returns {Promise<Object>} Health check response
   */
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const holidayService = new HolidayService();
export default holidayService;