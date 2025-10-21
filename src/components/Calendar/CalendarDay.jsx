import React from 'react';
import { Check } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';
import { getTimeString, groupSchedulesByTime } from '../../utils/scheduleHelpers';
import { getTimePeriodColor } from '../../utils/colorHelpers';

const CalendarDay = ({
  day,
  dateStr,
  schedulesForDay,
  timePeriods,
  hoveredCard,
  setHoveredCard,
  onClick,
  onAddNew
}) => {
  const groupedByTime = groupSchedulesByTime(schedulesForDay);
  const timeGroups = Object.values(groupedByTime).sort((a, b) => a.time.localeCompare(b.time));

  const isToday = dateStr === formatDate(new Date());
  const hasSchedules = timeGroups.length > 0;

  const allScheduledMeds = timeGroups.flatMap(g => g.medications.filter(m => !m.asNeeded));
  const allDayTaken = allScheduledMeds.length > 0 && allScheduledMeds.every(m => m.taken);

  return (
    <div
      className={`min-h-24 p-2 border rounded relative ${
        isToday ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
      } ${hasSchedules ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {allDayTaken && (
        <div className="absolute top-1 right-1 bg-green-600 rounded-full p-1 shadow-md">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="font-semibold text-sm mb-1">{day.getDate()}</div>
      {!hasSchedules && isToday && (
        <div className="text-center py-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddNew();
            }}
            className="text-xs text-blue-500 hover:text-blue-700 underline"
          >
            Add medication
          </button>
        </div>
      )}
      <div className="space-y-1">
        {timeGroups.map((group) => {
          const scheduledMeds = group.medications.filter(m => !m.asNeeded);
          const allScheduledTaken = scheduledMeds.length > 0 && scheduledMeds.every(m => m.taken);
          const someScheduledTaken = scheduledMeds.some(m => m.taken) && !allScheduledTaken;
          const takenCount = scheduledMeds.filter(m => m.taken).length;
          const totalCount = scheduledMeds.length;

          const colorClass = getTimePeriodColor(group.time, allScheduledTaken, timePeriods);

          const firstMed = group.medications[0];
          const allSameLabel = group.medications.every(m => m.label === firstMed.label);
          const useLabel = firstMed?.label && !group.isCustom && allSameLabel;
          const displayLabel = useLabel ? firstMed.label : null;

          return (
            <div
              key={group.time}
              className={`text-xs p-1.5 rounded border relative overflow-hidden ${colorClass}`}
              onMouseEnter={() => setHoveredCard(`${dateStr}-${group.time}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {someScheduledTaken && totalCount > 0 && (
                <div
                  className="absolute inset-0 bg-green-100 opacity-40"
                  style={{ width: `${(takenCount / totalCount) * 100}%` }}
                ></div>
              )}

              {allScheduledTaken && totalCount > 0 && (
                <div className="absolute top-0.5 right-0.5">
                  <div className="bg-green-600 rounded-full p-0.5">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              )}

              {someScheduledTaken && (
                <div className="absolute top-0.5 right-0.5 bg-yellow-500 text-white text-[9px] font-bold px-1 rounded">
                  {takenCount}/{totalCount}
                </div>
              )}

              <div className="flex items-start justify-between gap-1 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">
                    {displayLabel || group.time}
                  </div>
                  <div className="text-xs opacity-75 truncate">
                    {group.medications.length} med{group.medications.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarDay;