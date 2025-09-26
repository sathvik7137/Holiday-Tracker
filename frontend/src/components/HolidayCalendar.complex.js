import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import './HolidayCalendar.css';

const HolidayCalendar = () => {
  // State management
  const [selectedCountry, setSelectedCountry] = useState({ code: 'US', name: 'United States', flag: '🇺🇸' });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly', 'quarterly', 'yearly'
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available countries
  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' }
  ];

  // Fetch holidays from API
  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const year = moment(currentDate).year();
      let apiUrl;
      
      // Build API URL based on view mode
      if (viewMode === 'monthly') {
        const month = moment(currentDate).month() + 1;
        apiUrl = `http://localhost:3001/api/holidays?country=${selectedCountry.code}&year=${year}&month=${month}`;
      } else if (viewMode === 'quarterly') {
        const quarter = Math.floor(moment(currentDate).month() / 3) + 1;
        apiUrl = `http://localhost:3001/api/holidays/quarterly?country=${selectedCountry.code}&year=${year}&quarter=${quarter}`;
      } else if (viewMode === 'yearly') {
        apiUrl = `http://localhost:3001/api/holidays?country=${selectedCountry.code}&year=${year}`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setHolidays(data.data.holidays || []);
      } else {
        throw new Error(data.message || 'Failed to fetch holidays');
      }
    } catch (err) {
      setError(`Failed to load holidays: ${err.message}`);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry.code, currentDate, viewMode]);

  // Load holidays when country, date, or view mode changes
  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  // Get holidays for a specific date
  const getHolidaysForDate = (date) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    return holidays.filter(holiday => {
      const holidayDate = holiday.date?.iso || holiday.date;
      return moment(holidayDate).format('YYYY-MM-DD') === dateString;
    });
  };

  // Count holiday DAYS in a week (not individual festivals)
  const getHolidayDaysForWeek = (weekStart) => {
    let holidayDays = 0;
    for (let i = 0; i < 7; i++) {
      const day = moment(weekStart).add(i, 'days');
      const dayHolidays = getHolidaysForDate(day);
      // If this day has any holidays/festivals, count it as 1 holiday day
      if (dayHolidays.length > 0) {
        holidayDays++;
      }
    }
    return holidayDays;
  };

  // Get week color class based on holiday DAYS count
  const getWeekColorClass = (weekStart) => {
    const holidayDays = getHolidayDaysForWeek(weekStart);
    if (holidayDays === 0) return '';
    if (holidayDays === 1) return 'week-light-green';
    return 'week-dark-green'; // 2 or more holiday days in the week
  };

  // Navigation functions
  const goToPrevious = () => {
    if (viewMode === 'monthly') {
      setCurrentDate(moment(currentDate).subtract(1, 'month').toDate());
    } else if (viewMode === 'quarterly') {
      setCurrentDate(moment(currentDate).subtract(3, 'months').toDate());
    } else if (viewMode === 'yearly') {
      setCurrentDate(moment(currentDate).subtract(1, 'year').toDate());
    }
  };

  const goToNext = () => {
    if (viewMode === 'monthly') {
      setCurrentDate(moment(currentDate).add(1, 'month').toDate());
    } else if (viewMode === 'quarterly') {
      setCurrentDate(moment(currentDate).add(3, 'months').toDate());
    } else if (viewMode === 'yearly') {
      setCurrentDate(moment(currentDate).add(1, 'year').toDate());
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get period title based on view mode
  const getPeriodTitle = () => {
    const year = moment(currentDate).year();
    
    if (viewMode === 'monthly') {
      return moment(currentDate).format('MMMM YYYY');
    } else if (viewMode === 'quarterly') {
      const quarter = Math.floor(moment(currentDate).month() / 3) + 1;
      return `Q${quarter} ${year}`;
    } else if (viewMode === 'yearly') {
      return year.toString();
    }
    return '';
  };

  // Generate calendar days based on view mode
  const generateCalendarDays = () => {
    if (viewMode === 'monthly') {
      // Monthly view - single month
      const startOfMonth = moment(currentDate).startOf('month');
      const endOfMonth = moment(currentDate).endOf('month');
      const startOfWeek = moment(startOfMonth).startOf('week');
      const endOfWeek = moment(endOfMonth).endOf('week');

      const days = [];
      const current = moment(startOfWeek);

      while (current.isSameOrBefore(endOfWeek)) {
        days.push(moment(current));
        current.add(1, 'day');
      }

      // Group days by weeks
      const weeks = [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }

      return weeks;
    } else if (viewMode === 'quarterly') {
      // Quarterly view - 3 months
      const quarter = Math.floor(moment(currentDate).month() / 3);
      const quarterStart = moment(currentDate).month(quarter * 3).startOf('month');
      const quarterEnd = moment(quarterStart).add(2, 'months').endOf('month');
      
      const startOfWeek = moment(quarterStart).startOf('week');
      const endOfWeek = moment(quarterEnd).endOf('week');

      const days = [];
      const current = moment(startOfWeek);

      while (current.isSameOrBefore(endOfWeek)) {
        days.push(moment(current));
        current.add(1, 'day');
      }

      // Group days by weeks
      const weeks = [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }

      return weeks;
    } else if (viewMode === 'yearly') {
      // Yearly view - 12 months in a grid format
      const year = moment(currentDate).year();
      const months = [];
      
      for (let month = 0; month < 12; month++) {
        const monthStart = moment().year(year).month(month).startOf('month');
        const monthEnd = moment(monthStart).endOf('month');
        const startOfWeek = moment(monthStart).startOf('week');
        const endOfWeek = moment(monthEnd).endOf('week');

        const days = [];
        const current = moment(startOfWeek);

        while (current.isSameOrBefore(endOfWeek)) {
          days.push(moment(current));
          current.add(1, 'day');
        }

        // Group days by weeks for this month
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
          weeks.push(days.slice(i, i + 7));
        }

        months.push({
          name: monthStart.format('MMMM'),
          weeks: weeks,
          month: month
        });
      }

      return months;
    }

    return [];
  };

  const calendarData = generateCalendarDays();
  const periodTitle = getPeriodTitle();

  return (
    <div className="holiday-calendar-app">
      {/* Header Section */}
      <header className="calendar-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="app-title">🗓️ Holiday Calendar</h1>
            <p className="app-subtitle">Track holidays worldwide with visual indicators</p>
          </div>
          
          <div className="controls-section">
            {/* View Mode Selector */}
            <div className="view-selector">
              <label htmlFor="view-select" className="control-label">View:</label>
              <select
                id="view-select"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="view-dropdown"
              >
                <option value="monthly">📅 Monthly</option>
                <option value="quarterly">📊 Quarterly</option>
                <option value="yearly">🗓️ Yearly</option>
              </select>
            </div>

            {/* Country Selector */}
            <div className="country-selector">
              <label htmlFor="country-select" className="control-label">Country:</label>
              <select
                id="country-select"
                value={selectedCountry.code}
                onChange={(e) => {
                  const country = countries.find(c => c.code === e.target.value);
                  setSelectedCountry(country);
                }}
                className="country-dropdown"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation Controls */}
            <div className="nav-controls">
              <button onClick={goToPrevious} className="nav-btn" title={`Previous ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}`}>
                ← Previous
              </button>
              <button onClick={goToToday} className="today-btn" title="Go to Today">
                Today
              </button>
              <button onClick={goToNext} className="nav-btn" title={`Next ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}`}>
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Current Period Display */}
        <div className="period-display">
          <h2 className="current-period">
            {selectedCountry.flag} {periodTitle}
          </h2>
        </div>
      </header>

      {/* Legend Section */}
      <div className="legend-section">
        <div className="legend-content">
          <h3 className="legend-title">Week Color Coding</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color legend-white"></div>
              <span>No holidays in week</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-light-green"></div>
              <span>1 holiday day in week (Light Green)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-dark-green"></div>
              <span>2+ holiday days in week (Dark Green)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading holidays for {selectedCountry.name}...</p>
        </div>
      )}

      {error && (
        <div className="error-section">
          <p className="error-message">⚠️ {error}</p>
          <button onClick={fetchHolidays} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Calendar Section */}
      {!loading && !error && (
        <div className="calendar-section">
          {viewMode === 'yearly' ? (
            /* Yearly View - 12 months grid */
            <div className="yearly-calendar-container">
              <div className="months-grid">
                {calendarData.map((monthData, monthIndex) => (
                  <div key={monthIndex} className="month-grid">
                    <h3 className="month-title">{monthData.name}</h3>
                    <div className="mini-calendar">
                      {/* Mini day headers */}
                      <div className="mini-calendar-header">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                          <div key={idx} className="mini-day-header">{day}</div>
                        ))}
                      </div>
                      {/* Mini calendar weeks */}
                      <div className="mini-calendar-body">
                        {monthData.weeks.map((week, weekIndex) => {
                          const weekStart = week[0];
                          const weekColorClass = getWeekColorClass(weekStart);
                          const holidayDays = getHolidayDaysForWeek(weekStart);

                          return (
                            <div
                              key={weekIndex}
                              className={`mini-calendar-week ${weekColorClass}`}
                              title={holidayDays > 0 ? `${holidayDays} holiday day(s) this week` : 'No holidays this week'}
                            >
                              {week.map((day, dayIndex) => {
                                const dayHolidays = getHolidaysForDate(day);
                                const isCurrentMonth = day.month() === monthData.month;
                                const isToday = day.isSame(moment(), 'day');

                                return (
                                  <div
                                    key={dayIndex}
                                    className={`mini-calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${dayHolidays.length > 0 ? 'has-holiday' : ''}`}
                                    title={dayHolidays.length > 0 ? dayHolidays.map(h => h.name).join(', ') : ''}
                                  >
                                    {day.format('D')}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Monthly/Quarterly View */
            <div className="calendar-container">
              {/* Day Headers */}
              <div className="calendar-header-row">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div key={day} className="day-header">
                    <span className="day-full">{day}</span>
                    <span className="day-short">{day.substring(0, 3)}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Weeks */}
              <div className="calendar-body">
                {calendarData.map((week, weekIndex) => {
                  const weekStart = week[0];
                  const weekColorClass = getWeekColorClass(weekStart);
                  const holidayDays = getHolidayDaysForWeek(weekStart);

                  return (
                    <div
                      key={weekIndex}
                      className={`calendar-week ${weekColorClass}`}
                      data-holiday-days={holidayDays}
                      title={holidayDays > 0 ? `${holidayDays} holiday day(s) this week` : 'No holidays this week'}
                    >
                      {week.map((day, dayIndex) => {
                        const dayHolidays = getHolidaysForDate(day);
                        let isCurrentPeriod = false;
                        
                        if (viewMode === 'monthly') {
                          isCurrentPeriod = day.isSame(moment(currentDate), 'month');
                        } else if (viewMode === 'quarterly') {
                          const quarter = Math.floor(moment(currentDate).month() / 3);
                          const quarterStartMonth = quarter * 3;
                          const quarterEndMonth = quarterStartMonth + 2;
                          isCurrentPeriod = day.month() >= quarterStartMonth && day.month() <= quarterEndMonth;
                        }
                        
                        const isToday = day.isSame(moment(), 'day');
                        const isPast = day.isBefore(moment(), 'day');

                        return (
                          <div
                            key={dayIndex}
                            className={`calendar-day ${!isCurrentPeriod ? 'other-period' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
                          >
                            {/* Day Number */}
                            <div className="day-number">
                              {day.format('D')}
                              {viewMode === 'quarterly' && day.date() === 1 && (
                                <span className="month-label">{day.format('MMM')}</span>
                              )}
                            </div>

                            {/* Holidays for this day */}
                            {dayHolidays.length > 0 && (
                              <div className="day-holidays">
                                {dayHolidays.map((holiday, holidayIndex) => (
                                  <div
                                    key={holidayIndex}
                                    className="holiday-item"
                                    title={`${holiday.name} - ${holiday.type || 'Holiday'}`}
                                  >
                                    <span className="holiday-name">
                                      {holiday.name.length > (viewMode === 'quarterly' ? 10 : 15)
                                        ? holiday.name.substring(0, viewMode === 'quarterly' ? 10 : 15) + '...' 
                                        : holiday.name
                                      }
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Stats */}
      {!loading && !error && holidays.length > 0 && (
        <div className="footer-stats">
          <div className="stats-content">
            <div className="stat-item">
              <span className="stat-number">{holidays.length}</span>
              <span className="stat-label">
                Holidays this {viewMode === 'yearly' ? 'year' : viewMode === 'quarterly' ? 'quarter' : 'month'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {viewMode === 'yearly' 
                  ? calendarData.reduce((total, monthData) => 
                      total + monthData.weeks.filter(week => getHolidayDaysForWeek(week[0]) > 0).length, 0
                    )
                  : calendarData.filter(week => getHolidayDaysForWeek(week[0]) > 0).length
                }
              </span>
              <span className="stat-label">Weeks with holidays</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {viewMode === 'yearly' 
                  ? calendarData.reduce((total, monthData) => 
                      total + monthData.weeks.filter(week => getHolidayDaysForWeek(week[0]) >= 2).length, 0
                    )
                  : calendarData.filter(week => getHolidayDaysForWeek(week[0]) >= 2).length
                }
              </span>
              <span className="stat-label">Weeks with multiple holiday days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendar;