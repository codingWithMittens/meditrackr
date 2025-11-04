import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, FileText } from 'lucide-react';
import { getDaysInMonth, formatDate } from '../../utils/dateHelpers';
import { getSchedulesForDate } from '../../utils/scheduleHelpers';
import { DAYS_OF_WEEK_SHORT } from '../../constants/medications';
import CalendarDay from './CalendarDay';
import DayModal from './DayModal';

const Calendar = ({ medications, timePeriods, toggleTaken, onAddNew, updateDailyLog, getDailyLog, onNavigateToReports }) => {
  // Detect if mobile on mount
  const isMobile = () => window.innerWidth < 768;
  const [viewMode, setViewMode] = useState(isMobile() ? 'weekly' : 'monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDayModal, setSelectedDayModal] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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
    if (!day || schedulesForDay.length === 0) return;

    const dateStr = formatDate(day);
    setSelectedDayModal({ date: day, dateStr, schedulesForDay });
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

  // Auto-open today's modal if there are scheduled medications (on login)
  useEffect(() => {
    if (medications.length > 0 && !selectedDayModal) {
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
    }
  }, [medications]); // Only depend on medications to trigger on login

  if (medications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-blue-100 to-teal-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CalendarIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Medications Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by adding your first medication to track your schedule and adherence
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-teal-700 text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            Add Your First Medication
          </button>
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
              className="flex items-center gap-2 bg-white/70 text-gray-700 px-3 py-2 rounded-xl hover:bg-white hover:shadow-md border border-gray-200/50 transition-all duration-200"
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

        <div className="grid grid-cols-7 gap-2">
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
              />
            );
          })}
        </div>
      </div>

      {selectedDayModal && (
        <DayModal
          selectedDayModal={selectedDayModal}
          onClose={() => setSelectedDayModal(null)}
          onToggleTaken={handleToggleTaken}
          updateDailyLog={updateDailyLog}
          getDailyLog={getDailyLog}
        />
      )}
    </>
  );
};

export default Calendar;