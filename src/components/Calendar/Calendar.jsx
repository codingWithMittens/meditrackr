import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { getDaysInMonth, formatDate } from '../../utils/dateHelpers';
import { getSchedulesForDate } from '../../utils/scheduleHelpers';
import { DAYS_OF_WEEK_SHORT } from '../../constants/medications';
import CalendarDay from './CalendarDay';
import DayModal from './DayModal';

const Calendar = ({ medications, timePeriods, toggleTaken, onAddNew, updateDailyLog, getDailyLog, onNavigateToReports, userId }) => {
  // Enhanced mobile detection with responsive updates
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calendar state - weekly view with infinite scroll
  const today = new Date();
  const [centerDate, setCenterDate] = useState(today);
  const [loadedWeeks, setLoadedWeeks] = useState(() => {
    // Start with current week and surrounding weeks
    const currentWeek = getWeekStart(today);
    const weeks = [];

    // Load 3 weeks: previous, current, next
    for (let i = -1; i <= 1; i++) {
      const weekStart = new Date(currentWeek);
      weekStart.setDate(currentWeek.getDate() + (i * 7));
      weeks.push(weekStart);
    }

    return weeks;
  });

  const [isLoading, setIsLoading] = useState(false);

  const [selectedDayModal, setSelectedDayModal] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Touch/swipe handling for mobile navigation
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance required
  const minSwipeDistance = 50;
  // Track if we've shown the initial modal for this user session
  const [hasShownInitialModal, setHasShownInitialModal] = useState(() => {
    // Check if we've already shown the modal for this user today
    if (!userId) return false;
    const sessionKey = `initial_modal_shown_${userId}_${new Date().toDateString()}`;
    return localStorage.getItem(sessionKey) === 'true';
  });

    // Helper function to get start of week (Sunday)
  const getWeekStart = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // Get week days from a start date
  const getWeekDays = (weekStart) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Load more weeks functionality
  const loadPreviousWeeks = async (count = 2) => {
    if (isLoading) return;

    setIsLoading(true);
    const firstWeek = loadedWeeks[0];
    const newWeeks = [];

    for (let i = count; i > 0; i--) {
      const prevWeek = new Date(firstWeek);
      prevWeek.setDate(firstWeek.getDate() - (i * 7));
      newWeeks.push(prevWeek);
    }

    setLoadedWeeks(prev => [...newWeeks, ...prev]);

    // Small delay to prevent rapid fire loading
    setTimeout(() => setIsLoading(false), 100);
  };

  const loadNextWeeks = async (count = 2) => {
    if (isLoading) return;

    setIsLoading(true);
    const lastWeek = loadedWeeks[loadedWeeks.length - 1];
    const newWeeks = [];

    for (let i = 1; i <= count; i++) {
      const nextWeek = new Date(lastWeek);
      nextWeek.setDate(lastWeek.getDate() + (i * 7));
      newWeeks.push(nextWeek);
    }

    setLoadedWeeks(prev => [...prev, ...newWeeks]);

    // Small delay to prevent rapid fire loading
    setTimeout(() => setIsLoading(false), 100);
  };

    // Infinite scroll handler
  const handleScroll = (e) => {
    const container = e.target;
    const { scrollTop, scrollHeight, clientHeight } = container;

    // Load previous weeks when near top (within 200px)
    if (scrollTop < 200 && !isLoading) {
      loadPreviousWeeks();
    }

    // Load next weeks when near bottom (within 200px)
    if (scrollHeight - scrollTop - clientHeight < 200 && !isLoading) {
      loadNextWeeks();
    }
  };

  const handleDayClick = (day, schedulesForDay) => {
    if (!day) return;

    const dateStr = formatDate(day);

    // Always allow clicking on days - they might have as-needed medications
    // or user might want to add daily log info
    setSelectedDayModal({ date: day, dateStr, schedulesForDay });
  };

  const handleCloseModal = () => {
    setSelectedDayModal(null);
    // Don't reset hasShownInitialModal when manually closing
  };

  const handleToggleTaken = (medId, date, time) => {
    toggleTaken(medId, date, time);
  };

  // Get current date range for display
  const getDateRange = () => {
    if (loadedWeeks.length === 0) return 'Loading...';

    const firstWeek = loadedWeeks[0];
    const lastWeek = loadedWeeks[loadedWeeks.length - 1];
    const firstWeekEnd = new Date(firstWeek);
    firstWeekEnd.setDate(firstWeek.getDate() + 6);
    const lastWeekEnd = new Date(lastWeek);
    lastWeekEnd.setDate(lastWeek.getDate() + 6);

    if (loadedWeeks.length <= 3) {
      // Show current week range
      const currentWeekIndex = Math.floor(loadedWeeks.length / 2);
      const currentWeek = loadedWeeks[currentWeekIndex];
      const weekEnd = new Date(currentWeek);
      weekEnd.setDate(currentWeek.getDate() + 6);

      if (currentWeek.getMonth() === weekEnd.getMonth()) {
        return `${currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
      } else {
        return `${currentWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${weekEnd.getFullYear()}`;
      }
    } else {
      // Show full range when many weeks loaded
      return `${firstWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastWeekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${lastWeekEnd.getFullYear()}`;
    }
  };

  // Update modal when medications change
  useEffect(() => {
    if (selectedDayModal) {
      const updatedSchedules = medications.flatMap(med => {
        const schedules = getSchedulesForDate(med, selectedDayModal.dateStr);
        return schedules.map(s => ({
          ...s,
          medId: med.id,
          medName: med.name,
          medDosage: med.dosage
        }));
      });

      setSelectedDayModal({
        ...selectedDayModal,
        schedulesForDay: updatedSchedules
      });
    }
  }, [medications, selectedDayModal?.dateStr]);

  // Auto-open today's modal if there are scheduled medications (only on initial login)
  useEffect(() => {
    if (medications.length > 0 && !selectedDayModal && !hasShownInitialModal) {
      const today = new Date();
      const todayStr = formatDate(today);

      const todaysSchedules = medications.flatMap(med => {
        const schedules = getSchedulesForDate(med, todayStr);
        return schedules.map(s => ({
          ...s,
          medId: med.id,
          medName: med.name,
          medDosage: med.dosage
        }));
      });

      // Only open if there are scheduled medications for today (not as-needed only)
      const hasScheduledMeds = todaysSchedules.some(schedule => !schedule.asNeeded);

      if (hasScheduledMeds) {
        setSelectedDayModal({
          date: today,
          dateStr: todayStr,
          schedulesForDay: todaysSchedules
        });
      }

      // Mark that we've shown the initial modal (or decided not to) for today
      if (userId) {
        const sessionKey = `initial_modal_shown_${userId}_${new Date().toDateString()}`;
        localStorage.setItem(sessionKey, 'true');
        setHasShownInitialModal(true);
      }
    }
  }, [medications, selectedDayModal, hasShownInitialModal]); // Include all dependencies

  if (medications.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-600 text-white p-8 text-center">
          <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <CalendarIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome to MedMindr!</h2>
          <p className="text-blue-100 text-lg">Your personal medication tracking companion</p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Let's Get Started</h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Add your medications to start tracking your schedule, monitor adherence, and take control of your health journey.
            </p>

            {/* Primary CTA */}
            <div className="mb-8">
              <button
                onClick={onAddNew}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-teal-700 text-xl font-bold shadow-2xl shadow-blue-500/40 transition-all duration-300 hover:shadow-3xl hover:shadow-blue-500/50 transform hover:scale-105 hover:-translate-y-1 add-medication-btn pulse-animation"
                style={{
                  animation: 'pulse 2s infinite'
                }}
              >
                <Plus className="w-7 h-7" />
                Add Your First Medication
              </button>
            </div>

            {/* Feature Preview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200/50">
                <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Smart Calendar</h4>
                <p className="text-gray-600 text-sm">Visual tracking with daily, weekly & monthly views</p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200/50">
                <div className="bg-teal-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Never Miss a Dose</h4>
                <p className="text-gray-600 text-sm">Easy one-click marking & adherence tracking</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200/50">
                <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Health Insights</h4>
                <p className="text-gray-600 text-sm">Track symptoms, mood & export reports</p>
              </div>
            </div>

            {/* Secondary Options */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-500 text-sm mb-4">Or explore with sample data first:</p>
              <button
                onClick={() => {
                  // This would trigger loading demo data
                  const event = new CustomEvent('loadDemoData');
                  window.dispatchEvent(event);
                }}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                Try Demo Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        {/* Header */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
            <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold leading-tight`}>
              {getDateRange()}
            </h2>

            {/* Reports/Export Button */}
            <button
              onClick={onNavigateToReports}
              className={`flex items-center gap-2 bg-white/70 text-gray-700 ${isMobile ? 'px-2 py-1.5' : 'px-3 py-2'} rounded-xl hover:bg-white hover:shadow-md border border-gray-200/50 transition-all duration-200 reports-btn touch-manipulation`}
              title="Reports & Export"
            >
              <FileText className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium ${isMobile ? '' : 'hidden sm:inline'}`}>
                {isMobile ? 'Report' : 'Reports'}
              </span>
            </button>
          </div>
        </div>

                {/* Day Headers */}
        <div className={`grid grid-cols-7 ${isMobile ? 'gap-1' : 'gap-2'} mb-4`}>
          {DAYS_OF_WEEK_SHORT.map(day => (
            <div key={day} className={`text-center font-semibold text-gray-600 ${isMobile ? 'p-1 text-xs' : 'p-2 text-sm'}`}>
              {isMobile ? day.slice(0, 1) : day}
            </div>
          ))}
        </div>

        {/* Scrollable Weekly Calendar Container */}
        <div
          className="max-h-96 sm:max-h-[500px] overflow-y-auto space-y-6"
          onScroll={handleScroll}
        >
          {isLoading && (
            <div className="text-center py-2 text-gray-500 text-sm">
              Loading more weeks...
            </div>
          )}

          {loadedWeeks.map((weekStart, weekIndex) => {
            const weekDays = getWeekDays(weekStart);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            // Show month indicator when month changes
            const showMonthHeader = weekIndex === 0 ||
              (weekIndex > 0 && weekStart.getMonth() !== loadedWeeks[weekIndex - 1].getMonth());

            return (
              <div key={weekStart.getTime()} className="space-y-2">
                {/* Month Header Indicator */}
                {showMonthHeader && (
                  <div className="flex items-center justify-center py-2">
                    <div className={`bg-gradient-to-r from-blue-500 to-teal-600 text-white ${isMobile ? 'px-3 py-1' : 'px-4 py-2'} rounded-full shadow-lg`}>
                      <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold`}>
                        {weekStart.toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </h3>
                    </div>
                  </div>
                )}

                {/* Weekly Calendar Grid */}
                <div className={`grid grid-cols-7 ${isMobile ? 'gap-1' : 'gap-2'} calendar-grid`}>
                  {weekDays.map((day, dayIndex) => {
                    const dateStr = formatDate(day);
                    const schedulesForDay = medications.flatMap(med =>
                      getSchedulesForDate(med, dateStr).map(s => ({
                        ...s,
                        medId: med.id,
                        medName: med.name,
                        medDosage: med.dosage
                      }))
                    );

                    return (
                      <CalendarDay
                        key={`${weekStart.getTime()}-${dayIndex}`}
                        day={day}
                        dateStr={dateStr}
                        schedulesForDay={schedulesForDay}
                        timePeriods={timePeriods}
                        hoveredCard={hoveredCard}
                        setHoveredCard={setHoveredCard}
                        onClick={() => handleDayClick(day, schedulesForDay)}
                        onAddNew={onAddNew}
                        isCurrentMonth={true} // Always true for weekly view
                        getDailyLog={getDailyLog}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDayModal && (
        <DayModal
          selectedDayModal={selectedDayModal}
          onClose={handleCloseModal}
          onToggleTaken={handleToggleTaken}
          updateDailyLog={updateDailyLog}
          getDailyLog={getDailyLog}
        />
      )}
    </>
  );
};

export default Calendar;