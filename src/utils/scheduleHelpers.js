import { formatDate, getDatesInRange } from './dateHelpers';

export const getTimeString = (timeObj) => {
  return typeof timeObj === 'string' ? timeObj : timeObj.time;
};

export const isTaken = (med, date, time) => {
  const logEntry = `${date}-${time}`;
  return med.takenLog && med.takenLog.includes(logEntry);
};

export const getSchedulesForDate = (med, date) => {
  const medDate = new Date(date);
  const startDate = new Date(med.startDate);
  const endDate = med.endDate ? new Date(med.endDate) : null;

  if (medDate < startDate || (endDate && medDate > endDate)) return [];

  if (med.frequency === 'as-needed') {
    return med.times.map(timeObj => {
      const time = getTimeString(timeObj);
      return {
        time,
        label: typeof timeObj === 'string' ? null : timeObj.label,
        taken: isTaken(med, date, time),
        medication: med,
        asNeeded: true
      };
    });
  }

  let shouldTake = false;

  switch (med.frequency) {
    case 'daily':
      shouldTake = true;
      break;
    case 'weekly':
      const dayOfWeek = medDate.getDay();
      shouldTake = med.weeklyDays && med.weeklyDays.includes(dayOfWeek);
      break;
    default:
      shouldTake = true;
  }

  if (!shouldTake) return [];

  return med.times.map(timeObj => {
    const time = getTimeString(timeObj);
    return {
      time,
      label: typeof timeObj === 'string' ? null : timeObj.label,
      taken: isTaken(med, date, time),
      medication: med,
      asNeeded: false
    };
  });
};

export const groupSchedulesByTime = (schedules) => {
  return schedules.reduce((acc, schedule) => {
    const timeKey = schedule.time;
    const matchingTimeObj = schedule.medication.times.find(t => getTimeString(t) === schedule.time);

    if (!acc[timeKey]) {
      acc[timeKey] = {
        time: schedule.time,
        label: schedule.label,
        medications: [],
        isCustom: matchingTimeObj?.isCustom || false
      };
    }
    acc[timeKey].medications.push(schedule);
    return acc;
  }, {});
};

export const getAdherenceStats = (medications, startDate, endDate) => {
  const dates = getDatesInRange(startDate, endDate);
  let totalScheduled = 0;
  let totalTaken = 0;

  dates.forEach(date => {
    const dateStr = formatDate(date);
    medications.forEach(med => {
      const schedules = getSchedulesForDate(med, dateStr).filter(s => !s.asNeeded);
      totalScheduled += schedules.length;
      totalTaken += schedules.filter(s => s.taken).length;
    });
  });

  return {
    totalScheduled,
    totalTaken,
    percentage: totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0
  };
};