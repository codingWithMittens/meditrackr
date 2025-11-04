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
  onAddNew,
  isCurrentMonth = true
}) => {
  const groupedByTime = groupSchedulesByTime(schedulesForDay);
  const timeGroups = Object.values(groupedByTime).sort((a, b) => a.time.localeCompare(b.time));

  const isToday = dateStr === formatDate(new Date());
  const hasSchedules = timeGroups.length > 0;

  const allScheduledMeds = timeGroups.flatMap(g => g.medications.filter(m => !m.asNeeded));
  const allDayTaken = allScheduledMeds.length > 0 && allScheduledMeds.every(m => m.taken);

  return (
    <div
      className={`min-h-24 p-3 border rounded-xl relative transition-all duration-200 ${
        isToday ? 'bg-gradient-to-br from-blue-50 to-teal-50 border-blue-300 shadow-md' : 'border-gray-200/60 bg-white/50'
      } ${hasSchedules ? 'hover:bg-white/80 hover:shadow-lg hover:border-blue-200 cursor-pointer' : ''} ${
        !isCurrentMonth ? 'opacity-40' : ''
      }`}
      onClick={onClick}
    >
      {allDayTaken && (
        <div className="absolute top-2 right-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full p-1.5 shadow-lg shadow-emerald-500/30">
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
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
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
              className={`text-xs p-2 rounded-lg border relative overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${colorClass}`}
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
                <div className="absolute top-1 right-1">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full p-0.5 shadow-sm">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              )}

              {someScheduledTaken && (
                <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
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