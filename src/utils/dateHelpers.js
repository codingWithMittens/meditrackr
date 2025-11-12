export const formatDate = (date) => {
  // Use local timezone instead of UTC to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get today's date in local timezone
export const getTodayString = () => {
  return formatDate(new Date());
};

export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Add previous month days to fill the first week
  const prevMonth = new Date(year, month - 1, 0); // Last day of previous month
  const prevMonthDays = prevMonth.getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthDays - i));
  }

  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Add next month days to fill the last week (total should be 42 days for 6 weeks)
  const totalDays = days.length;
  const remainingDays = 42 - totalDays;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

export const getDatesInRange = (start, end) => {
  const dates = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  return dates;
};

export const getDateRangePreset = (preset) => {
  const today = new Date();
  let startDate;

  switch(preset) {
    case 'last-week':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      break;
    case 'last-month':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      break;
    case 'last-3-months':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 90);
      break;
    case 'last-6-months':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 180);
      break;
    case 'last-year':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 365);
      break;
    default:
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
  }

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(today)
  };
};

// Helper function to get start of week (Sunday)
export const getWeekStart = (date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};
