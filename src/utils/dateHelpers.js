export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
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
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  };
};