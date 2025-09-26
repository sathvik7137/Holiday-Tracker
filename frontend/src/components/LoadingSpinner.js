import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6', 
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
    green: 'border-green-600'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        border-2 border-gray-200 border-t-transparent
        ${colorClasses[color]}
        rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;