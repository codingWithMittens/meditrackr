import React from 'react';
import { getTimeString } from '../../utils/scheduleHelpers';
import { DAYS_OF_WEEK_SHORT } from '../../constants/medications';

const MedicationTable = ({ medications }) => {
  if (medications.length === 0) {
    return <p className="text-gray-500 text-center py-8">No medications to display</p>;
  }

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Drug Name</th>
          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Generic Name</th>
          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Dosage</th>
          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Frequency</th>
          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Times to Take</th>
          <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Notes</th>
        </tr>
      </thead>
      <tbody>
        {medications.sort((a, b) => a.name.localeCompare(b.name)).map((med, index) => (
          <tr key={med.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="border border-gray-300 px-4 py-3 font-medium">{med.name}</td>
            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">{med.genericName || '-'}</td>
            <td className="border border-gray-300 px-4 py-3">{med.dosage}</td>
            <td className="border border-gray-300 px-4 py-3 capitalize">
              {med.frequency.replace('-', ' ')}
              {med.frequency === 'weekly' && med.weeklyDays && med.weeklyDays.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {med.weeklyDays.map(d => DAYS_OF_WEEK_SHORT[d]).join(', ')}
                </div>
              )}
            </td>
            <td className="border border-gray-300 px-4 py-3">
              {med.frequency === 'as-needed' ? (
                <span className="text-gray-500 italic">As needed</span>
              ) : (
                <div className="space-y-1">
                  {med.times.map((timeObj, idx) => {
                    const timeStr = getTimeString(timeObj);
                    const label = typeof timeObj === 'string' ? null : timeObj.label;
                    return (
                      <div key={idx} className="text-sm">
                        {label && !timeObj.isCustom ? `${label} (${timeStr})` : timeStr}
                      </div>
                    );
                  })}
                </div>
              )}
            </td>
            <td className="border border-gray-300 px-4 py-3 text-sm">{med.notes || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MedicationTable;