# Holiday Tracker

A comprehensive web application for tracking holidays and vacation days across different countries.

## Features

- 🌍 **Multi-Country Support**: Track holidays across multiple countries
- 📅 **Calendar View**: Interactive calendar interface for easy holiday visualization
- 🔍 **Holiday Search**: Find holidays by date, name, or country
- 📊 **Different Views**: Month, year, and list views for holiday display
- 🎨 **Modern UI**: Clean and responsive user interface
- ⚡ **Real-time Updates**: Fast and responsive data loading

## Technology Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **CSS3** - Custom styling with responsive design
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **RESTful API** - Clean API architecture
- **Validation Middleware** - Input validation and error handling

## Project Structure

```
Holiday-Tracker/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── services/         # API service functions
│   │   └── ...
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic services
│   ├── middleware/          # Custom middleware
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sathvik7137/Holiday-Tracker.git
   cd Holiday-Tracker
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   ```bash
   # In the backend directory
   cp .env.example .env
   # Edit .env file with your configuration
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend application will run on `http://localhost:3000`

## API Endpoints

### Countries
- `GET /api/countries` - Get list of available countries
- `GET /api/countries/:code` - Get specific country information

### Holidays
- `GET /api/holidays` - Get holidays with query parameters
- `GET /api/holidays/:country/:year` - Get holidays for specific country and year

## Components Overview

### Frontend Components
- **CountrySelector** - Dropdown for selecting countries
- **HolidayCalendar** - Main calendar component for displaying holidays
- **ViewSelector** - Toggle between different view modes
- **HolidayLegend** - Legend for holiday types and colors
- **LoadingSpinner** - Loading indicator component
- **ErrorBoundary** - Error handling wrapper component

### Backend Services
- **Country Service** - Handles country-related operations
- **Holiday Service** - Manages holiday data and API calls
- **Validation Middleware** - Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Holiday data provided by various public APIs
- Icons and UI elements from open-source libraries
- Community contributions and feedback

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/sathvik7137/Holiday-Tracker/issues) on GitHub.

---

Made with ❤️ by [sathvik7137](https://github.com/sathvik7137)