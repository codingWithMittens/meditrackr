import React from 'react';
import { Check } from 'lucide-react';
import { getTimeString, groupSchedulesByTime } from '../../utils/scheduleHelpers';

const DayModal = ({ selectedDayModal, onClose, onToggleTaken }) => {
  const groupedByTime = groupSchedulesByTime(selectedDayModal.schedulesForDay);
  const timeGroups = Object.values(groupedByTime).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">Daily Schedule</h2>
            <p className="text-gray-600">
              {selectedDayModal.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {timeGroups.filter(g => !g.medications.every(m => m.asNeeded)).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No scheduled medications for this day</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Drug Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Dosage</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Taken</th>
                </tr>
              </thead>
              <tbody>
                {timeGroups.filter(g => !g.medications.every(m => m.asNeeded)).map((group, groupIdx) => (
                  group.medications.filter(m => !m.asNeeded).map((med, medIdx) => {
                    const firstMed = group.medications[0];
                    const allSameLabel = group.medications.every(m => m.label === firstMed.label);
                    const useLabel = firstMed?.label && !group.isCustom && allSameLabel;
                    const displayLabel = useLabel ? firstMed.label : null;

                    return (
                      <tr key={`${groupIdx}-${medIdx}`} className={medIdx === 0 ? '' : 'border-t-0'}>
                        {medIdx === 0 && (
                          <td
                            className="border border-gray-300 px-4 py-3 font-semibold align-top"
                            rowSpan={group.medications.filter(m => !m.asNeeded).length}
                          >
                            {displayLabel ? (
                              <>
                                <div>{displayLabel}</div>
                                <div className="text-xs text-gray-500 font-normal">{group.time}</div>
                              </>
                            ) : (
                              group.time
                            )}
                          </td>
                        )}
                        <td className="border border-gray-300 px-4 py-3">{med.medName}</td>
                        <td className="border border-gray-300 px-4 py-3">{med.medDosage}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <button
                            onClick={() => onToggleTaken(med.medId, selectedDayModal.dateStr, med.time)}
                            className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-colors mx-auto ${
                              med.taken
                                ? 'bg-green-500 border-green-600 text-white hover:bg-green-600'
                                : 'bg-white border-gray-300 hover:border-green-500 hover:bg-green-50'
                            }`}
                            title={med.taken ? "Mark as not taken" : "Mark as taken"}
                          >
                            {med.taken && <Check className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayModal;
