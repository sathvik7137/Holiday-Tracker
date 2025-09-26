const express = require('express');
const router = express.Router();
const holidayService = require('../services/holidayService');
const { validateDateRange, validateCountry } = require('../middleware/validation');

/**
 * GET /api/holidays
 * Fetch holidays for a specific country and date range
 * Query params:
 * - country: Country code (ISO 3166-1 alpha-2)
 * - year: Year (required)
 * - month: Month (optional, 1-12)
 * - startDate: Start date for range (optional, YYYY-MM-DD)
 * - endDate: End date for range (optional, YYYY-MM-DD)
 */
router.get('/', validateCountry, validateDateRange, async (req, res) => {
  // Extract parameters first so they're accessible in catch block
  const { country, year, month, startDate, endDate } = req.query;
  
  try {
    console.log(`📅 Fetching holidays for ${country.toUpperCase()} in ${year}${month ? ` (Month: ${month})` : ''}`);
    
    const holidays = await holidayService.getHolidays({
      country: country.toUpperCase(),
      year: parseInt(year),
      month: month ? parseInt(month) : null,
      startDate,
      endDate
    });

    const processedHolidays = holidayService.processHolidaysForCalendar(holidays);

    res.json({
      success: true,
      data: {
        holidays: processedHolidays,
        metadata: {
          country: country.toUpperCase(),
          year: parseInt(year),
          month: month ? parseInt(month) : null,
          totalHolidays: holidays.length,
          dateRange: {
            start: startDate || `${year}-${month ? month.toString().padStart(2, '0') : '01'}-01`,
            end: endDate || `${year}-${month ? month.toString().padStart(2, '0') : '12'}-${month ? new Date(year, month, 0).getDate() : '31'}`
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    console.warn('🔄 Using fallback data due to API error');
    
    // Always fallback to mock data instead of throwing errors
    try {
      const fallbackHolidays = holidayService.getMockHolidays({
        country: country.toUpperCase(),
        year: parseInt(year),
        month: month ? parseInt(month) : null
      });

      const processedHolidays = holidayService.processHolidaysForCalendar(fallbackHolidays);

      res.json({
        success: true,
        data: {
          holidays: processedHolidays,
          metadata: {
            country: country.toUpperCase(),
            year: parseInt(year),
            month: month ? parseInt(month) : null,
            totalHolidays: fallbackHolidays.length,
            usingFallbackData: true,
            dateRange: {
              start: startDate || `${year}-${month ? month.toString().padStart(2, '0') : '01'}-01`,
              end: endDate || `${year}-${month ? month.toString().padStart(2, '0') : '12'}-${month ? new Date(year, month, 0).getDate() : '31'}`
            }
          }
        }
      });
    } catch (fallbackError) {
      console.error('❌ Fallback data also failed:', fallbackError);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch holidays',
        message: 'Both API and fallback data failed'
      });
    }
  }
});

/**
 * GET /api/holidays/quarterly
 * Fetch holidays for a quarterly view (3 months)
 * Query params:
 * - country: Country code (ISO 3166-1 alpha-2)
 * - year: Year (required)
 * - quarter: Quarter number (1-4, required)
 */
router.get('/quarterly', validateCountry, async (req, res) => {
  // Extract parameters first so they're accessible in catch block
  const { country, year, quarter } = req.query;
  
  try {
    if (!quarter || quarter < 1 || quarter > 4) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quarter',
        message: 'Quarter must be between 1 and 4'
      });
    }

    console.log(`📅 Fetching quarterly holidays for ${country.toUpperCase()} Q${quarter} ${year}`);
    
    const quarterMonths = {
      1: [1, 2, 3],
      2: [4, 5, 6],
      3: [7, 8, 9],
      4: [10, 11, 12]
    };
    
    const months = quarterMonths[quarter];
    const holidayPromises = months.map(month => 
      holidayService.getHolidays({
        country: country.toUpperCase(),
        year: parseInt(year),
        month
      })
    );

    const monthlyHolidays = await Promise.all(holidayPromises);
    const allHolidays = monthlyHolidays.flat();
    
    const processedHolidays = holidayService.processHolidaysForCalendar(allHolidays);
    const holidaysByMonth = holidayService.groupHolidaysByMonth(processedHolidays);

    res.json({
      success: true,
      data: {
        holidays: processedHolidays,
        holidaysByMonth,
        metadata: {
          country: country.toUpperCase(),
          year: parseInt(year),
          quarter: parseInt(quarter),
          months: months,
          totalHolidays: allHolidays.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching quarterly holidays:', error);
    console.warn('🔄 Using fallback data for quarterly view');
    
    // Fallback for quarterly view
    try {
      const quarterMonths = {
        1: [1, 2, 3],
        2: [4, 5, 6],
        3: [7, 8, 9],
        4: [10, 11, 12]
      };
      
      const months = quarterMonths[quarter];
      const allHolidays = [];
      
      for (const month of months) {
        const monthHolidays = holidayService.getMockHolidays({
          country: country.toUpperCase(),
          year: parseInt(year),
          month
        });
        allHolidays.push(...monthHolidays);
      }
      
      const processedHolidays = holidayService.processHolidaysForCalendar(allHolidays);
      const holidaysByMonth = holidayService.groupHolidaysByMonth(processedHolidays);

      res.json({
        success: true,
        data: {
          holidays: processedHolidays,
          holidaysByMonth,
          metadata: {
            country: country.toUpperCase(),
            year: parseInt(year),
            quarter: parseInt(quarter),
            months: months,
            totalHolidays: allHolidays.length,
            usingFallbackData: true
          }
        }
      });
    } catch (fallbackError) {
      console.error('❌ Quarterly fallback also failed:', fallbackError);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch quarterly holidays',
        message: 'Both API and fallback data failed'
      });
    }
  }
});

/**
 * GET /api/holidays/week-summary
 * Get week-wise summary for color coding
 * Query params:
 * - country: Country code (ISO 3166-1 alpha-2)
 * - year: Year (required)
 * - month: Month (optional, 1-12)
 */
router.get('/week-summary', validateCountry, validateDateRange, async (req, res) => {
  // Extract parameters first so they're accessible in catch block
  const { country, year, month } = req.query;
  
  try {
    console.log(`📊 Generating week summary for ${country.toUpperCase()} ${year}${month ? `-${month}` : ''}`);
    
    const holidays = await holidayService.getHolidays({
      country: country.toUpperCase(),
      year: parseInt(year),
      month: month ? parseInt(month) : null
    });

    const weekSummary = holidayService.generateWeekSummary(holidays, {
      year: parseInt(year),
      month: month ? parseInt(month) : null
    });

    res.json({
      success: true,
      data: {
        weekSummary,
        metadata: {
          country: country.toUpperCase(),
          year: parseInt(year),
          month: month ? parseInt(month) : null,
          totalWeeks: weekSummary.length
        }
      }
    });
  } catch (error) {
    console.error('Error generating week summary:', error);
    console.warn('🔄 Using fallback data for week summary');
    
    // Fallback for week summary
    try {
      const fallbackHolidays = holidayService.getMockHolidays({
        country: country.toUpperCase(),
        year: parseInt(year),
        month: month ? parseInt(month) : null
      });

      const weekSummary = holidayService.generateWeekSummary(fallbackHolidays, {
        year: parseInt(year),
        month: month ? parseInt(month) : null
      });

      res.json({
        success: true,
        data: {
          weekSummary,
          metadata: {
            country: country.toUpperCase(),
            year: parseInt(year),
            month: month ? parseInt(month) : null,
            totalWeeks: weekSummary.length,
            usingFallbackData: true
          }
        }
      });
    } catch (fallbackError) {
      console.error('❌ Week summary fallback also failed:', fallbackError);
      res.status(500).json({
        success: false,
        error: 'Failed to generate week summary',
        message: 'Both API and fallback data failed'
      });
    }
  }
});

module.exports = router;