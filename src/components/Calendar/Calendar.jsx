import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, FileText } from 'lucide-react';
import { getDaysInMonth, formatDate } from '../../utils/dateHelpers';
import { getSchedulesForDate } from '../../utils/scheduleHelpers';
import { DAYS_OF_WEEK_SHORT } from '../../constants/medications';
import CalendarDay from './CalendarDay';
import DayModal from './DayModal';

const Calendar = ({ medications, timePeriods, toggleTaken, onAddNew, updateDailyLog, getDailyLog, onNavigateToReports, userId }) => {
  // Detect if mobile on mount
  const isMobile = () => window.innerWidth < 768;
  const [viewMode, setViewMode] = useState(isMobile() ? 'weekly' : 'monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDayModal, setSelectedDayModal] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  // Track if we've shown the initial modal for this user session
  const [hasShownInitialModal, setHasShownInitialModal] = useState(() => {
    // Check if we've already shown the modal for this user today
    if (!userId) return false;
    const sessionKey = `initial_modal_shown_${userId}_${new Date().toDateString()}`;
    return localStorage.getItem(sessionKey) === 'true';
  });

  const changeMonth = (offset) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1));
  };

  const changeWeek = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (offset * 7));
    setSelectedDate(newDate);
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push(currentDay);
    }
    return days;
  };

  const getWeekDateRange = () => {
    const weekDays = getWeekDays(selectedDate);
    const start = weekDays[0];
    const end = weekDays[6];

    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
    } else {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${end.getFullYear()}`;
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

  const days = viewMode === 'weekly' ? getWeekDays(selectedDate) : getDaysInMonth(selectedDate);

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
        {/* View Toggle */}
        <div className="flex justify-center mb-4">
                  <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50/80 p-1.5 backdrop-blur-sm">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              viewMode === 'weekly'
                ? 'bg-white text-blue-600 shadow-md shadow-blue-500/10'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              viewMode === 'monthly'
                ? 'bg-white text-blue-600 shadow-md shadow-blue-500/10'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
            }`}
          >
            Monthly
          </button>
        </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => viewMode === 'weekly' ? changeWeek(-1) : changeMonth(-1)}
            className="p-3 hover:bg-gray-100/70 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-gray-200"
          >
            ←
          </button>

          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              {viewMode === 'weekly'
                ? getWeekDateRange()
                : selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }
            </h2>

            {/* Reports/Export Button */}
            <button
              onClick={onNavigateToReports}
              className="flex items-center gap-2 bg-white/70 text-gray-700 px-3 py-2 rounded-xl hover:bg-white hover:shadow-md border border-gray-200/50 transition-all duration-200 reports-btn"
              title="Reports & Export"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Reports</span>
            </button>


          </div>

          <button
            onClick={() => viewMode === 'weekly' ? changeWeek(1) : changeMonth(1)}
            className="p-3 hover:bg-gray-100/70 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-gray-200"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 calendar-grid">
          {DAYS_OF_WEEK_SHORT.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 p-2">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            if (!day) return <div key={index} className="p-2"></div>;

                        const dateStr = formatDate(day);
            const schedulesForDay = medications.flatMap(med =>
              getSchedulesForDate(med, dateStr).map(s => ({
                ...s,
                medId: med.id,
                medName: med.name,
                medDosage: med.dosage
              }))
            );

            const isCurrentMonth = viewMode === 'monthly' ? day.getMonth() === selectedDate.getMonth() : true;

            return (
              <CalendarDay
                key={index}
                day={day}
                dateStr={dateStr}
                schedulesForDay={schedulesForDay}
                timePeriods={timePeriods}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                onClick={() => handleDayClick(day, schedulesForDay)}
                onAddNew={onAddNew}
                isCurrentMonth={isCurrentMonth}
                getDailyLog={getDailyLog}
              />
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