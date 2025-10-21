import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { getTimeString, groupSchedulesByTime } from '../../utils/scheduleHelpers';
import { formatDate } from '../../utils/dateHelpers';

const DayModal = ({ selectedDayModal, onClose, onToggleTaken, updateDailyLog, getDailyLog }) => {
  const groupedByTime = groupSchedulesByTime(selectedDayModal.schedulesForDay);
  const timeGroups = Object.values(groupedByTime).sort((a, b) => a.time.localeCompare(b.time));

  // Check if the selected date is in the future (compared to today)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
  const selectedDateObj = new Date(selectedDayModal.date);
  selectedDateObj.setHours(0, 0, 0, 0);
  const isFutureDate = selectedDateObj > today;

  const dailyLog = getDailyLog(selectedDayModal.dateStr);
  const [pain, setPain] = useState(dailyLog.pain);
  const [emotions, setEmotions] = useState(dailyLog.emotions);
  const [hasSymptoms, setHasSymptoms] = useState(Boolean(dailyLog.symptoms));
  const [symptoms, setSymptoms] = useState(dailyLog.symptoms || '');
  const [notes, setNotes] = useState(dailyLog.notes || '');

  useEffect(() => {
    const log = getDailyLog(selectedDayModal.dateStr);
    setPain(log.pain);
    setEmotions(log.emotions);
    setHasSymptoms(Boolean(log.symptoms));
    setSymptoms(log.symptoms || '');
    setNotes(log.notes || '');
  }, [selectedDayModal.dateStr, getDailyLog]);

  const handlePainChange = (value) => {
    setPain(value);
    updateDailyLog(selectedDayModal.dateStr, { pain: value, emotions, symptoms, notes });
  };

  const handleEmotionsChange = (value) => {
    setEmotions(value);
    updateDailyLog(selectedDayModal.dateStr, { pain, emotions: value, symptoms, notes });
  };

  const handleSymptomsToggle = () => {
    const newHasSymptoms = !hasSymptoms;
    setHasSymptoms(newHasSymptoms);
    if (!newHasSymptoms) {
      setSymptoms('');
      updateDailyLog(selectedDayModal.dateStr, { pain, emotions, symptoms: '', notes });
    }
  };

  const handleSymptomsChange = (e) => {
    const value = e.target.value;
    setSymptoms(value);
    updateDailyLog(selectedDayModal.dateStr, { pain, emotions, symptoms: value, notes });
  };

  const handleNotesChange = (e) => {
    const value = e.target.value;
    setNotes(value);
    updateDailyLog(selectedDayModal.dateStr, { pain, emotions, symptoms, notes: value });
  };

  const getPainIcon = (value) => {
    const icons = ['😊', '🙂', '😐', '😟', '😫'];
    return icons[value] || '😐';
  };

  const getEmotionIcon = (value) => {
    const icons = ['😢', '😞', '😐', '😊', '😄'];
    return icons[value] || '😐';
  };

  const getPainLabel = (value) => {
    const labels = ['No Pain', 'Mild', 'Moderate', 'Severe', 'Extreme'];
    return labels[value];
  };

  const getEmotionLabel = (value) => {
    const labels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
    return labels[value];
  };

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
                          {isFutureDate ? (
                            <div className="w-8 h-8 rounded border-2 flex items-center justify-center mx-auto bg-gray-100 border-gray-300">
                              {med.taken && <Check className="w-5 h-5 text-gray-400" />}
                            </div>
                          ) : (
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
                          )}
                        </td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          )}

          {/* Pain and Emotions Section */}
          <div className="mt-8 space-y-6 border-t border-gray-200 pt-6">
            {isFutureDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-blue-700 font-medium">Future Date - View Only</p>
                </div>
                <p className="text-blue-600 text-sm mt-1">You can view the scheduled medications, but cannot mark them as taken or edit daily logs for future dates.</p>
              </div>
            )}
            {/* Pain Scale */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <label className="text-lg font-semibold text-gray-700">Pain Level:</label>
                <span className="text-gray-600">{pain !== null ? getPainLabel(pain) : 'Not set'}</span>
              </div>
              <div className="flex gap-3">
                {[0, 1, 2, 3, 4].map((value) => (
                  <button
                    key={value}
                    onClick={isFutureDate ? undefined : () => handlePainChange(value)}
                    disabled={isFutureDate}
                    className={`flex-1 py-4 px-2 rounded-lg border-2 transition-all text-3xl ${
                      isFutureDate
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        : pain === value
                        ? 'bg-red-100 border-red-500 scale-110 shadow-md'
                        : 'bg-white border-gray-300 hover:border-red-400 hover:scale-105'
                    }`}
                    title={isFutureDate ? 'Cannot edit future dates' : getPainLabel(value)}
                  >
                    {getPainIcon(value)}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                <span>No Pain</span>
                <span>Extreme</span>
              </div>
            </div>

            {/* Emotions Scale */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <label className="text-lg font-semibold text-gray-700">Emotional Well-being:</label>
                <span className="text-gray-600">{emotions !== null ? getEmotionLabel(emotions) : 'Not set'}</span>
              </div>
              <div className="flex gap-3">
                {[0, 1, 2, 3, 4].map((value) => (
                  <button
                    key={value}
                    onClick={isFutureDate ? undefined : () => handleEmotionsChange(value)}
                    disabled={isFutureDate}
                    className={`flex-1 py-4 px-2 rounded-lg border-2 transition-all text-3xl ${
                      isFutureDate
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        : emotions === value
                        ? 'bg-blue-100 border-blue-500 scale-110 shadow-md'
                        : 'bg-white border-gray-300 hover:border-blue-400 hover:scale-105'
                    }`}
                    title={isFutureDate ? 'Cannot edit future dates' : getEmotionLabel(value)}
                  >
                    {getEmotionIcon(value)}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                <span>Very Low</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Additional Tracking */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Tracking (Optional)</h3>

              {/* New Symptoms Toggle */}
              <div className="mb-4">
                <label className={`flex items-center gap-3 ${isFutureDate ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    checked={hasSymptoms}
                    onChange={isFutureDate ? undefined : handleSymptomsToggle}
                    disabled={isFutureDate}
                    className={`w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 ${
                      isFutureDate ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  <span className={`font-medium ${isFutureDate ? 'text-gray-400' : 'text-gray-700'}`}>New Symptoms</span>
                </label>
                {hasSymptoms && (
                  <textarea
                    value={symptoms}
                    onChange={isFutureDate ? undefined : handleSymptomsChange}
                    disabled={isFutureDate}
                    placeholder={isFutureDate ? 'Cannot edit future dates' : 'Describe any new symptoms...'}
                    className={`mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                      isFutureDate ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
                    }`}
                    rows="3"
                  />
                )}
              </div>

              {/* Notes */}
              <div>
                <label className={`block font-medium mb-2 ${isFutureDate ? 'text-gray-400' : 'text-gray-700'}`}>Notes</label>
                <textarea
                  value={notes}
                  onChange={isFutureDate ? undefined : handleNotesChange}
                  disabled={isFutureDate}
                  placeholder={isFutureDate ? 'Cannot edit future dates' : 'Any additional notes for the day...'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    isFutureDate ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
                  }`}
                  rows="3"
                />
              </div>
            </div>
          </div>

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
