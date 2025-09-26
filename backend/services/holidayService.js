const axios = require('axios');
const moment = require('moment');

class HolidayService {
  constructor() {
    this.apiKey = process.env.CALENDARIFIC_API_KEY;
    this.baseUrl = process.env.HOLIDAY_API_BASE_URL || 'https://calendarific.com/api/v2';
    this.apiProvider = process.env.HOLIDAY_API_PROVIDER || 'calendarific';
    
    if (!this.apiKey) {
      console.warn('⚠️  WARNING: CALENDARIFIC_API_KEY not found in environment variables');
      console.warn('   📝 To get your free API key:');
      console.warn('   1. Visit: https://calendarific.com/');
      console.warn('   2. Sign up for free account (1000 requests/month)');
      console.warn('   3. Copy API key from dashboard');
      console.warn('   4. Add to .env file: CALENDARIFIC_API_KEY=your_key_here');
      console.warn('   🔄 Using fallback mock data for now...');
    } else {
      console.log('✅ Calendarific API key configured successfully');
    }
  }

  /**
   * Fetches holidays from the external API with multi-provider support
   * @param {Object} params - Parameters for fetching holidays
   * @param {string} params.country - Country code (ISO 3166-1 alpha-2)
   * @param {number} params.year - Year
   * @param {number} [params.month] - Month (1-12)
   * @param {string} [params.startDate] - Start date (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of holiday objects
   */
  async getHolidays({ country, year, month = null, startDate = null, endDate = null }) {
    try {
      if (!this.apiKey && this.apiProvider === 'calendarific') {
        console.warn('🔄 No API key found, using mock data');
        return this.getMockHolidays({ country, year, month });
      }

      console.log(`🌐 Fetching holidays from ${this.apiProvider.toUpperCase()} API for ${country} ${year}${month ? ` (Month: ${month})` : ''}`);
      
      // Support multiple API providers
      switch (this.apiProvider) {
        case 'calendarific':
          return await this.getCalendarificHolidays({ country, year, month });
        case 'abstractapi':
          return await this.getAbstractAPIHolidays({ country, year, month });
        case 'nager':
          return await this.getNagerHolidays({ country, year, month });
        default:
          return await this.getCalendarificHolidays({ country, year, month });
      }
    } catch (error) {
      console.error('❌ Error fetching holidays from API:', error.message);
      console.warn('🔄 Falling back to mock data');
      throw error; // Let the route handler catch this and use fallback
    }
  }

  /**
   * Calendarific API implementation
   */
  async getCalendarificHolidays({ country, year, month }) {
    const params = {
      api_key: this.apiKey,
      country: country,
      year: year,
      type: 'national,local,religious,observance' // Fetch all types of holidays
    };

    if (month) {
      params.month = month;
    }

    const response = await axios.get(`${this.baseUrl}/holidays`, {
      params,
      timeout: 10000
    });

    if (response.data.meta.code !== 200) {
      throw new Error(`API Error: ${response.data.meta.error_detail || 'Unknown error'}`);
    }

    return response.data.response.holidays || [];
  }

  /**
   * AbstractAPI implementation
   */
  async getAbstractAPIHolidays({ country, year, month }) {
    const params = {
      api_key: process.env.ABSTRACTAPI_KEY,
      country: country,
      year: year
    };

    if (month) {
      params.month = month;
    }

    const response = await axios.get(`${this.baseUrl}`, {
      params,
      timeout: 10000
    });

    return response.data || [];
  }

  /**
   * Nager.Date API implementation (no key required)
   */
  async getNagerHolidays({ country, year, month }) {
    const response = await axios.get(`${this.baseUrl}/PublicHolidays/${year}/${country}`, {
      timeout: 10000
    });

    let holidays = response.data || [];

    // Filter by month if specified
    if (month) {
      holidays = holidays.filter(holiday => {
        const holidayMonth = new Date(holiday.date).getMonth() + 1;
        return holidayMonth === month;
      });
    }

    return holidays;
  }

  /**
   * Returns mock holiday data for testing and fallback
   * @param {Object} params - Parameters
   * @param {string} params.country - Country code
   * @param {number} params.year - Year
   * @param {number} [params.month] - Month (1-12)
   * @returns {Array} Array of mock holiday objects
   */
  getMockHolidays({ country, year, month = null }) {
    console.log(`🎭 Using mock holiday data for ${country} ${year}${month ? ` (Month: ${month})` : ''}`);
    
    const mockHolidays = {
      'US': [
        { name: "New Year's Day", date: `${year}-01-01`, type: 'National holiday' },
        { name: "Martin Luther King Jr. Day", date: `${year}-01-15`, type: 'National holiday' },
        { name: "Presidents' Day", date: `${year}-02-19`, type: 'National holiday' },
        { name: "Memorial Day", date: `${year}-05-27`, type: 'National holiday' },
        { name: "Independence Day", date: `${year}-07-04`, type: 'National holiday' },
        { name: "Labor Day", date: `${year}-09-02`, type: 'National holiday' },
        { name: "Columbus Day", date: `${year}-10-14`, type: 'National holiday' },
        { name: "Veterans Day", date: `${year}-11-11`, type: 'National holiday' },
        { name: "Thanksgiving Day", date: `${year}-11-28`, type: 'National holiday' },
        { name: "Christmas Day", date: `${year}-12-25`, type: 'National holiday' }
      ],
      'GB': [
        { name: "New Year's Day", date: `${year}-01-01`, type: 'National holiday' },
        { name: "Good Friday", date: `${year}-03-29`, type: 'National holiday' },
        { name: "Easter Monday", date: `${year}-04-01`, type: 'National holiday' },
        { name: "Early May Bank Holiday", date: `${year}-05-06`, type: 'National holiday' },
        { name: "Spring Bank Holiday", date: `${year}-05-27`, type: 'National holiday' },
        { name: "Summer Bank Holiday", date: `${year}-08-26`, type: 'National holiday' },
        { name: "Christmas Day", date: `${year}-12-25`, type: 'National holiday' },
        { name: "Boxing Day", date: `${year}-12-26`, type: 'National holiday' }
      ],
      'CA': [
        { name: "New Year's Day", date: `${year}-01-01`, type: 'National holiday' },
        { name: "Family Day", date: `${year}-02-19`, type: 'National holiday' },
        { name: "Good Friday", date: `${year}-03-29`, type: 'National holiday' },
        { name: "Easter Monday", date: `${year}-04-01`, type: 'National holiday' },
        { name: "Victoria Day", date: `${year}-05-20`, type: 'National holiday' },
        { name: "Canada Day", date: `${year}-07-01`, type: 'National holiday' },
        { name: "Labour Day", date: `${year}-09-02`, type: 'National holiday' },
        { name: "Thanksgiving", date: `${year}-10-14`, type: 'National holiday' },
        { name: "Christmas Day", date: `${year}-12-25`, type: 'National holiday' },
        { name: "Boxing Day", date: `${year}-12-26`, type: 'National holiday' }
      ],
      'IN': [
        { name: "New Year's Day", date: `${year}-01-01`, type: 'National holiday' },
        { name: "Republic Day", date: `${year}-01-26`, type: 'National holiday' },
        { name: "Holi", date: `${year}-03-13`, type: 'National holiday' },
        { name: "Good Friday", date: `${year}-03-29`, type: 'National holiday' },
        { name: "Independence Day", date: `${year}-08-15`, type: 'National holiday' },
        { name: "Gandhi Jayanti", date: `${year}-10-02`, type: 'National holiday' },
        { name: "Diwali", date: `${year}-11-12`, type: 'National holiday' },
        { name: "Christmas Day", date: `${year}-12-25`, type: 'National holiday' }
      ]
    };

    let holidays = mockHolidays[country] || mockHolidays['US'];

    // Filter by month if specified
    if (month) {
      holidays = holidays.filter(holiday => {
        const holidayMonth = new Date(holiday.date).getMonth() + 1;
        return holidayMonth === month;
      });
    }

    return holidays;
  }

  /**
   * Process holidays for calendar display
   * @param {Array} holidays - Raw holiday data from API
   * @returns {Array} Processed holiday objects
   */
  processHolidaysForCalendar(holidays) {
    return holidays.map(holiday => {
      // Handle different API response formats
      let date;
      let momentDate;
      
      if (holiday.date_iso) {
        // Calendarific API format
        date = holiday.date_iso;
        momentDate = moment(date);
      } else if (holiday.date && typeof holiday.date === 'object' && holiday.date.iso) {
        // API format with nested date object
        date = holiday.date.iso;
        momentDate = moment(date);
      } else if (holiday.date && typeof holiday.date === 'string') {
        // Simple string date format
        date = holiday.date;
        momentDate = moment(date);
      } else {
        // Fallback - use current date
        date = moment().format('YYYY-MM-DD');
        momentDate = moment(date);
      }

      return {
        id: `${date}-${holiday.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: holiday.name,
        date: date,
        type: holiday.type || 'Holiday',
        description: holiday.description || '',
        country: holiday.country || '',
        dayOfWeek: momentDate.format('dddd'),
        weekNumber: momentDate.week(),
        month: momentDate.month() + 1,
        year: momentDate.year()
      };
    });
  }

  /**
   * Group holidays by month for quarterly view
   * @param {Array} holidays - Processed holiday objects
   * @returns {Object} Holidays grouped by month
   */
  groupHolidaysByMonth(holidays) {
    const grouped = {};
    
    holidays.forEach(holiday => {
      const month = holiday.month;
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(holiday);
    });

    return grouped;
  }

  /**
   * Generate week summary for color coding
   * @param {Array} holidays - Holiday objects
   * @param {Object} params - Parameters
   * @param {number} params.year - Year
   * @param {number} [params.month] - Month (optional)
   * @returns {Array} Week summary with color codes
   */
  generateWeekSummary(holidays, { year, month = null }) {
    const weeks = [];
    
    // Determine date range
    const startDate = month ? moment(`${year}-${month}-01`) : moment(`${year}-01-01`);
    const endDate = month ? startDate.clone().endOf('month') : moment(`${year}-12-31`);
    
    // Start from the beginning of the first week
    const currentDate = startDate.clone().startOf('week');
    
    while (currentDate.isSameOrBefore(endDate)) {
      const weekStart = currentDate.clone();
      const weekEnd = currentDate.clone().endOf('week');
      
      // Count holidays in this week
      const weekHolidays = holidays.filter(holiday => {
        const holidayDate = moment(holiday.date);
        return holidayDate.isBetween(weekStart, weekEnd, 'day', '[]');
      });

      const holidayCount = weekHolidays.length;
      const colorCode = this.getWeekColorCode(holidayCount);

      weeks.push({
        weekStart: weekStart.format('YYYY-MM-DD'),
        weekEnd: weekEnd.format('YYYY-MM-DD'),
        weekNumber: weekStart.week(),
        holidayCount,
        colorCode,
        colorName: this.getColorName(colorCode),
        holidays: weekHolidays
      });

      currentDate.add(1, 'week');
    }

    return weeks;
  }

  /**
   * Get color code based on holiday count
   * @param {number} holidayCount - Number of holidays in the week
   * @returns {string} Color code
   */
  getWeekColorCode(holidayCount) {
    if (holidayCount === 0) return 'default';
    if (holidayCount === 1) return 'light-green';
    return 'dark-green';
  }

  /**
   * Get human-readable color name
   * @param {string} colorCode - Color code
   * @returns {string} Color name
   */
  getColorName(colorCode) {
    const colorNames = {
      'default': 'Default',
      'light-green': 'Light Green',
      'dark-green': 'Dark Green'
    };
    return colorNames[colorCode] || 'Default';
  }
}

module.exports = new HolidayService();