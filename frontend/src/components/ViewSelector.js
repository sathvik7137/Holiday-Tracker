import React from 'react';
import { Calendar, Grid3X3 } from 'lucide-react';

const ViewSelector = ({ viewMode, onViewModeChange, disabled = false }) => {
  const views = [
    {
      id: 'monthly',
      label: 'Monthly',
      icon: Calendar,
      description: 'View one month at a time'
    },
    {
      id: 'quarterly',
      label: 'Quarterly',  
      icon: Grid3X3,
      description: 'View three months at once'
    }
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = viewMode === view.id;
        
        return (
          <button
            key={view.id}
            onClick={() => onViewModeChange(view.id)}
            disabled={disabled}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isActive 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={view.description}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" />
            <span>{view.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewSelector;