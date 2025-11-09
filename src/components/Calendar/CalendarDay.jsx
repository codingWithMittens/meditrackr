import React from 'react';
import { Check } from 'lucide-react';
import { formatDate, getTodayString } from '../../utils/dateHelpers';
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
  isCurrentMonth = true,
  getDailyLog
}) => {
  const groupedByTime = groupSchedulesByTime(schedulesForDay);
  const timeGroups = Object.values(groupedByTime).sort((a, b) => {
    // As-needed medications should always come last
    const aHasAsNeeded = a.medications.some(m => m.asNeeded);
    const bHasAsNeeded = b.medications.some(m => m.asNeeded);

    if (aHasAsNeeded && !bHasAsNeeded) return 1; // a comes after b
    if (!aHasAsNeeded && bHasAsNeeded) return -1; // a comes before b

    // If both are same type (both as-needed or both scheduled), sort by time
    return a.time.localeCompare(b.time);
  });

  const isToday = dateStr === getTodayString();
  const hasSchedules = timeGroups.length > 0;

  // Check for as-needed medications
  const asNeededSchedules = schedulesForDay.filter(s => s.asNeeded);
  const hasAsNeeded = asNeededSchedules.length > 0;
  // Always make days clickable if they have schedules, as-needed meds, or are today
  // Also make non-current month days clickable for viewing/editing
  const isClickable = hasSchedules || hasAsNeeded || isToday || !isCurrentMonth;

  // Include both scheduled and as-needed medications for visual indicators
  const allMeds = timeGroups.flatMap(g => g.medications);
  const scheduledMeds = allMeds.filter(m => !m.asNeeded);
  const asNeededMeds = allMeds.filter(m => m.asNeeded);

  // Day is "complete" if all scheduled medications are taken (as-needed are optional)
  const allDayTaken = scheduledMeds.length > 0 && scheduledMeds.every(m => m.taken);

  // Get daily log for emoji indicators
  const dailyLog = getDailyLog ? getDailyLog(dateStr) : { pain: null, emotions: null };

  // Icon functions with distinct visual styles
  const getPainIcon = (value) => {
    const icons = ['😊', '🙂', '😐', '😣', '😵'];
    return icons[value] || null;
  };

  const getEmotionIcon = (value) => {
    const icons = ['💙', '💚', '💛', '🧡', '❤️'];
    return icons[value] || null;
  };

  // Get readable labels
  const getPainLabel = (value) => {
    return ['No Pain', 'Mild', 'Moderate', 'Severe', 'Extreme'][value];
  };

  const getEmotionLabel = (value) => {
    return ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'][value];
  };

  return (
    <div
      className={`min-h-24 p-3 border rounded-xl relative transition-all duration-200 ${
        isToday ? 'bg-gradient-to-br from-blue-50 to-teal-50 border-blue-300 shadow-md calendar-day-today' : 'border-gray-200/60 bg-white/50'
      } ${isClickable ? 'hover:bg-white/80 hover:shadow-lg hover:border-blue-200 cursor-pointer' : ''} ${
        !isCurrentMonth ? 'opacity-60 hover:opacity-90' : ''
      }`}
      onClick={onClick}
    >
            {allDayTaken && (
        <div className="absolute top-2 right-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full p-1.5 shadow-lg shadow-emerald-500/30 z-10">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold text-sm">{day.getDate()}</div>
        {/* Daily Log Indicators with clear differentiation */}
        <div className={`flex gap-1 items-center ${allDayTaken ? 'mr-8' : ''}`}>
          {dailyLog.pain !== null && (
            <div
              className="bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200/50"
              title={`Pain Level: ${getPainLabel(dailyLog.pain)}`}
            >
              <span className="text-xs leading-none">
                {getPainIcon(dailyLog.pain)}
              </span>
            </div>
          )}
          {dailyLog.emotions !== null && (
            <div
              className="bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200/50"
              title={`Emotional Well-being: ${getEmotionLabel(dailyLog.emotions)}`}
            >
              <span className="text-xs leading-none">
                {getEmotionIcon(dailyLog.emotions)}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Show as-needed medications indicator */}
      {!hasSchedules && hasAsNeeded && (
        <div className="text-center py-1">
          <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
            As-needed available
          </div>
        </div>
      )}

      {!hasSchedules && !hasAsNeeded && isToday && (
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
          // For time blocks, consider all medications in the group
          const allGroupMeds = group.medications;
          const scheduledMeds = allGroupMeds.filter(m => !m.asNeeded);
          const asNeededInGroup = allGroupMeds.filter(m => m.asNeeded);

          // Visual state based on all medications in this time group
          const allTaken = allGroupMeds.length > 0 && allGroupMeds.every(m => m.taken);
          const someTaken = allGroupMeds.some(m => m.taken) && !allTaken;
          const takenCount = allGroupMeds.filter(m => m.taken).length;
          const totalCount = allGroupMeds.length;

          // For progress bar, prioritize scheduled meds but include as-needed
          const hasScheduled = scheduledMeds.length > 0;
          const displayAllTaken = hasScheduled ?
            scheduledMeds.every(m => m.taken) : // If has scheduled, only check scheduled for "complete" state
            allTaken; // If only as-needed, check all
          const displaySomeTaken = hasScheduled ?
            (scheduledMeds.some(m => m.taken) && !scheduledMeds.every(m => m.taken)) || (asNeededInGroup.some(m => m.taken)) :
            someTaken;

          const colorClass = getTimePeriodColor(group.time, displayAllTaken, timePeriods);

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
              {displaySomeTaken && totalCount > 0 && (
                <div
                  className="absolute inset-0 bg-green-100 opacity-40"
                  style={{ width: `${(takenCount / totalCount) * 100}%` }}
                ></div>
              )}

              {displayAllTaken && totalCount > 0 && (
                <div className="absolute top-1 right-1">
                  <div className={`rounded-full p-0.5 shadow-sm ${
                    hasScheduled
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              )}

              {displaySomeTaken && !displayAllTaken && (
                <div className={`absolute top-1 right-1 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm ${
                  hasScheduled
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                    : 'bg-gradient-to-r from-purple-400 to-purple-500'
                }`}>
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
                    {asNeededInGroup.length > 0 && (
                      <span className="text-purple-600 font-medium">
                        {scheduledMeds.length > 0 ? ' + as-needed' : ' as-needed'}
                      </span>
                    )}
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