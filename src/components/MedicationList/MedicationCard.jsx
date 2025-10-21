import React from 'react';
import { Trash2 } from 'lucide-react';
import { getTimeString } from '../../utils/scheduleHelpers';
import { DAYS_OF_WEEK_SHORT } from '../../constants/medications';

const MedicationCard = ({ medication, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{medication.name}</h3>
          {medication.genericName && (
            <p className="text-sm text-gray-500 italic">{medication.genericName}</p>
          )}
          <p className="text-gray-600">{medication.dosage}</p>

          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Frequency:</span> {medication.frequency.replace('-', ' ')}
              {medication.frequency === 'weekly' && medication.weeklyDays && medication.weeklyDays.length > 0 && (
                <span className="ml-1">
                  ({medication.weeklyDays.map(d => DAYS_OF_WEEK_SHORT[d]).join(', ')})
                </span>
              )}
            </p>

            <p className="text-sm text-gray-500">
              <span className="font-medium">Times:</span>{' '}
              {medication.times.map(t => {
                const timeStr = getTimeString(t);
                const label = typeof t === 'string' ? null : t.label;
                return label && !t.isCustom ? `${label} (${timeStr})` : timeStr;
              }).join(', ')}
            </p>

            <p className="text-sm text-gray-500">
              <span className="font-medium">Start:</span> {medication.startDate}
              {medication.endDate && ` - End: ${medication.endDate}`}
            </p>

            {medication.notes && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Notes:</span> {medication.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-500 hover:bg-blue-50 p-2 rounded"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:bg-red-50 p-2 rounded"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
