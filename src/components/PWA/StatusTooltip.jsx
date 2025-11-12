import React, { useState } from 'react';

const StatusTooltip = ({ children, isOnline }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipContent = isOnline 
    ? "Connected to internet. App can sync data and receive updates. All features available."
    : "No internet connection. App still works! Your medication data is stored locally on your device. You can track medications, view schedules, and add daily logs. Data will sync when connection returns. Push notifications require internet.";

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className={`px-3 py-2 text-sm rounded-lg shadow-lg border max-w-xs text-center ${
            isOnline 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">
                {isOnline ? '✅' : '📶'}
              </span>
              <div>
                <div className="font-semibold mb-1">
                  {isOnline ? 'Online' : 'Offline Mode'}
                </div>
                <div className="text-xs leading-relaxed">
                  {tooltipContent}
                </div>
              </div>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
            isOnline 
              ? 'border-t-4 border-t-green-200'
              : 'border-t-4 border-t-amber-200'
          }`} />
        </div>
      )}
    </div>
  );
};

export default StatusTooltip;