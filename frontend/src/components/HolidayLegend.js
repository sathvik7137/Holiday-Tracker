import React from 'react';

const HolidayLegend = ({ className = '' }) => {
  const legendItems = [
    {
      color: 'bg-white border-2 border-gray-300',
      textColor: 'text-gray-700',
      label: 'No holidays',
      description: 'Week with no holidays'
    },
    {
      color: 'bg-green-100 border-2 border-green-300', 
      textColor: 'text-green-800',
      label: '1 holiday',
      description: 'Week with exactly 1 holiday (light green)'
    },
    {
      color: 'bg-green-500 border-2 border-green-600',
      textColor: 'text-white',
      label: '2+ holidays', 
      description: 'Week with 2 or more holidays (dark green)'
    }
  ];

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">
          Calendar Legend
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Week color coding based on holiday frequency
        </p>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className={`
                  w-12 h-8 rounded ${item.color} flex items-center justify-center
                  flex-shrink-0
                `}
                aria-hidden="true"
              >
                <div className={`text-xs font-medium ${item.textColor}`}>
                  {index === 0 ? '0' : index === 1 ? '1' : '2+'}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {item.label}
                </div>
                <div className="text-sm text-gray-600">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            How it works:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Each week row in the calendar is colored based on the number of holidays</li>
            <li>• Holiday names are displayed within the respective date cells</li>
            <li>• Color coding helps you quickly identify holiday-heavy periods</li>
            <li>• Switch between monthly and quarterly views for different perspectives</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HolidayLegend;