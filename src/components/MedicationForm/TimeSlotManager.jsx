import React from 'react';
import { Trash2 } from 'lucide-react';

const TimeSlotManager = ({ times, timePeriods, onChange }) => {
  const handleTimeChange = (index, field, value) => {
    const newTimes = [...times];
    if (field === 'preset') {
      if (value === 'custom') {
        newTimes[index] = { label: 'Custom', time: '09:00', isCustom: true, asNeeded: false };
      } else if (value === 'as-needed') {
        newTimes[index] = { label: 'As Needed', time: '', isCustom: false, asNeeded: true, instructions: '' };
      } else {
        const preset = timePeriods.find(p => p.name === value);
        newTimes[index] = { label: preset.name, time: preset.time, isCustom: false, asNeeded: false };
      }
    } else if (field === 'time') {
      newTimes[index].time = value;
    } else if (field === 'instructions') {
      newTimes[index].instructions = value;
    }
    onChange(newTimes);
  };

  const addTimeSlot = () => {
    onChange([...times, { label: 'Morning', time: '08:00', isCustom: false, asNeeded: false }]);
  };

  const removeTimeSlot = (index) => {
    if (times.length > 1) {
      onChange(times.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Times to Take</label>
      {times.map((timeObj, index) => (
        <div key={index} className="mb-3">
          <div className="flex gap-2 mb-2">
            <select
              value={timeObj.asNeeded ? 'as-needed' : (timeObj.isCustom ? 'custom' : timeObj.label)}
              onChange={(e) => handleTimeChange(index, 'preset', e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              {timePeriods.map(period => (
                <option key={period.id} value={period.name}>
                  {period.name} ({period.time})
                </option>
              ))}
              <option value="custom">Custom</option>
              <option value="as-needed">As Needed</option>
            </select>
            {timeObj.isCustom && !timeObj.asNeeded && (
              <input
                type="time"
                value={timeObj.time}
                onChange={(e) => handleTimeChange(index, 'time', e.target.value)}
                className="flex-1 p-2 border rounded"
              />
            )}
            {times.length > 1 && (
              <button
                onClick={() => removeTimeSlot(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          {timeObj.asNeeded && (
            <div className="ml-0">
              <input
                type="text"
                value={timeObj.instructions || ''}
                onChange={(e) => handleTimeChange(index, 'instructions', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Instructions: e.g., Take when pain level is above 5"
              />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addTimeSlot}
        className="text-blue-500 text-sm hover:underline"
      >
        + Add another time
      </button>
    </div>
  );
};

export default TimeSlotManager;
