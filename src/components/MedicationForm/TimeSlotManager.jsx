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
        const preset = timePeriods.find(p => p.id === value || p.label === value);
        newTimes[index] = { label: preset.label, time: preset.time, isCustom: false, asNeeded: false };
      }
    } else if (field === 'time') {
      // Keep the original label when time is changed
      newTimes[index] = { ...newTimes[index], time: value };
    } else if (field === 'instructions') {
      newTimes[index].instructions = value;
    } else if (field === 'label') {
      newTimes[index].label = value;
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
          <div className="flex gap-2 mb-2 items-end">
            {/* Label Input */}
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Label</label>
              <input
                type="text"
                value={timeObj.label}
                onChange={(e) => handleTimeChange(index, 'label', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., Morning"
              />
            </div>

            {/* Time Input */}
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Time</label>
              <input
                type="time"
                value={timeObj.time}
                onChange={(e) => handleTimeChange(index, 'time', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Preset Quick Select */}
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Quick Select</label>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const period = timePeriods.find(p => p.id === e.target.value);
                    if (period) {
                      handleTimeChange(index, 'time', period.time);
                      handleTimeChange(index, 'label', period.label);
                    }
                  }
                }}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="">Choose preset...</option>
                {timePeriods.map(period => (
                  <option key={period.id} value={period.id}>
                    {period.label} ({period.time})
                  </option>
                ))}
              </select>
            </div>
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
