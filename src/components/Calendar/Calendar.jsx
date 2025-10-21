import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { getDaysInMonth, formatDate } from '../../utils/dateHelpers';
import { getSchedulesForDate } from '../../utils/scheduleHelpers';
import { DAYS_OF_WEEK_SHORT } from '../../constants/medications';
import CalendarDay from './CalendarDay';
import DayModal from './DayModal';

const Calendar = ({ medications, timePeriods, toggleTaken, onAddNew }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDayModal, setSelectedDayModal] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const changeMonth = (offset) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1));
  };

  const handleDayClick = (day, schedulesForDay) => {
    if (!day || schedulesForDay.length === 0) return;

    const dateStr = formatDate(day);
    setSelectedDayModal({ date: day, dateStr, schedulesForDay });
  };

  const handleToggleTaken = (medId, date, time) => {
    toggleTaken(medId, date, time);

    // Update modal if open
    if (selectedDayModal && selectedDayModal.dateStr === date) {
      const updatedSchedules = medications.flatMap(med => {
        const schedules = getSchedulesForDate(med, date);
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
  };

  if (medications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-16">
          <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarIcon className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Medications Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by adding your first medication to track your schedule and adherence
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-medium shadow-lg"
          >
            <Plus className="w-6 h-6" />
            Add Your First Medication
          </button>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(selectedDate);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded"
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
        />
      )}
    </>
  );
};

export default Calendar;