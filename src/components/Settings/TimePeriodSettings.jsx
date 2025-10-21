import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getColorClasses } from '../../utils/colorHelpers';
import { COLOR_OPTIONS } from '../../constants/medications';

const TimePeriodSettings = ({ timePeriods, onUpdate, onAdd, onDelete }) => {
  const handleUpdate = (id, field, value) => {
    if (field === 'name' && !value.trim()) return;
    onUpdate(id, { [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Time Periods</h2>
      <p className="text-gray-600 mb-4">Configure your custom time periods for medication scheduling.</p>

      <div className="space-y-3 mb-6">
        {timePeriods.sort((a, b) => a.time.localeCompare(b.time)).map((period) => (
          <div key={period.id} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className={`w-12 h-12 rounded flex-shrink-0 border-2 ${getColorClasses(period.color)}`}></div>

            <div className="flex-1 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={period.name}
                  onChange={(e) => handleUpdate(period.id, 'name', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Period name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={period.time}
                  onChange={(e) => handleUpdate(period.id, 'time', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Color</label>
                <select
                  value={period.color}
                  onChange={(e) => handleUpdate(period.id, 'color', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  {COLOR_OPTIONS.map(color => (
                    <option key={color.value} value={color.value}>{color.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => onDelete(period.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
              disabled={timePeriods.length === 1}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <Plus className="w-5 h-5" />
        Add Time Period
      </button>
    </div>
  );
};

export default TimePeriodSettings;