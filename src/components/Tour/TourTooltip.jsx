import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ArrowRight, ArrowLeft, Plus, Settings, FileText, User } from 'lucide-react';

const TourTooltip = ({
  step,
  isActive,
  targetSelector,
  title,
  content,
  position = 'bottom',
  onNext,
  onPrev,
  onComplete,
  onSkip,
  isFirstStep = false,
  isLastStep = false,
  actionIcon,
  actionText,
  onAction
}) => {
  const [targetElement, setTargetElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isActive && targetSelector) {
      console.log('Looking for element with selector:', targetSelector);

      // Try to find element, with retries for elements that might not be ready
      const findElement = (attempts = 0) => {
        const element = document.querySelector(targetSelector);
        console.log('Found element (attempt', attempts + 1, '):', element);

        if (element) {
          setTargetElement(element);


          // Add highlight class to target element
          element.classList.add('tour-highlight');
          element.style.position = 'relative';
          element.style.zIndex = '10000';

                        // Simplified positioning - always position relative to element
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        let top, left;

        // Simple positioning based on position preference
        switch (position) {
          case 'top':
            top = rect.top + scrollTop - 20;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case 'left':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.left + scrollLeft - 20;
            break;
          case 'right':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.right + scrollLeft + 20;
            break;
          default: // bottom
            top = rect.bottom + scrollTop + 20;
            left = rect.left + scrollLeft + rect.width / 2;
        }


          setTooltipPosition({ top, left });

          // Scroll element into view
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        } else if (attempts < 5) {
          // Retry after a short delay if element not found
          console.log(`Retrying to find element: ${targetSelector}`);
          setTimeout(() => findElement(attempts + 1), 200);
        } else {
          console.error(`Tour target not found after 5 attempts: ${targetSelector}`);
        }
      };

      findElement();


      return () => {
        const currentElement = document.querySelector(targetSelector);
        if (currentElement) {
          currentElement.classList.remove('tour-highlight');
          currentElement.style.position = '';
          currentElement.style.zIndex = '';
        }
      };
    }
  }, [isActive, targetSelector, position]);

  if (!isActive || !targetElement) return null;

  const getActionIcon = () => {
    switch (actionIcon) {
      case 'plus': return <Plus className="w-4 h-4" />;
      case 'settings': return <Settings className="w-4 h-4" />;
      case 'file': return <FileText className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      default: return <ArrowRight className="w-4 h-4" />;
    }
  };

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9999]" />

      {/* Tooltip */}
      <div
                className="fixed z-[10001] bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 p-6"
        style={{
          top: Math.max(20, Math.min(tooltipPosition.top, window.innerHeight - 300)),
          left: Math.max(20, Math.min(tooltipPosition.left - 160, window.innerWidth - 340)),
        }}
      >
                {/* Simplified arrow - always point to target */}
        <div className="absolute w-3 h-3 bg-white border transform rotate-45 border-l border-t border-gray-200 top-[-7px] left-1/2 -translate-x-1/2" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="text-gray-600 mb-6 text-sm leading-relaxed">
          {content}
        </div>

        {/* Action Button (if provided) */}
        {onAction && actionText && (
          <div className="mb-4">
            <button
              onClick={onAction}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-teal-700 font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
            >
              {getActionIcon()}
              {actionText}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {!isFirstStep && (
              <button
                onClick={onPrev}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Skip Tour
            </button>

            <button
              onClick={isLastStep ? onComplete : onNext}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default TourTooltip;