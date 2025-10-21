export const getColorClasses = (colorName) => {
  const colorMap = {
    'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'amber': 'bg-amber-100 text-amber-800 border-amber-300',
    'orange': 'bg-orange-100 text-orange-800 border-orange-300',
    'sky': 'bg-sky-100 text-sky-800 border-sky-300',
    'blue': 'bg-blue-100 text-blue-800 border-blue-300',
    'purple': 'bg-purple-100 text-purple-800 border-purple-300',
    'violet': 'bg-violet-100 text-violet-800 border-violet-300',
    'indigo': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'pink': 'bg-pink-100 text-pink-800 border-pink-300',
    'rose': 'bg-rose-100 text-rose-800 border-rose-300',
    'slate': 'bg-slate-100 text-slate-800 border-slate-300'
  };
  return colorMap[colorName] || colorMap['slate'];
};

export const getTimePeriodColor = (timeStr, taken, timePeriods) => {
  if (taken) return 'bg-green-100 text-green-800 border-green-300';

  const [hourStr, minuteStr] = timeStr.split(':');
  const totalMinutes = parseInt(hourStr, 10) * 60 + parseInt(minuteStr, 10);

  const sortedPeriods = [...timePeriods].sort((a, b) => {
    const aMin = parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1]);
    const bMin = parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1]);
    return aMin - bMin;
  });

  let selectedPeriod = sortedPeriods[sortedPeriods.length - 1];

  for (let i = sortedPeriods.length - 1; i >= 0; i--) {
    const periodMin = parseInt(sortedPeriods[i].time.split(':')[0]) * 60 + parseInt(sortedPeriods[i].time.split(':')[1]);
    if (totalMinutes >= periodMin) {
      selectedPeriod = sortedPeriods[i];
      break;
    }
  }

  return getColorClasses(selectedPeriod.color);
};
