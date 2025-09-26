import React from 'react';
import HolidayCalendar from './components/HolidayCalendar';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Vacation Calendar</h1>
        <p>Track holidays with perfect week-row color coding and with support for multiple countries</p>
      </header>
      
      <main className="app-main">
        <HolidayCalendar />
      </main>
      
      <footer className="app-footer">
        <p>Vacation Calendar App - Powered by Calendarific API</p>
        <p>Built with ❤️ using React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;