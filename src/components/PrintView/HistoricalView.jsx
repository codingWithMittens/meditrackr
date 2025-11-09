import React, { useState } from 'react';
import { Check, Calendar, List } from 'lucide-react';
import { getDateRangePreset, getDatesInRange, formatDate } from '../../utils/dateHelpers';
import { getSchedulesForDate, getAdherenceStats } from '../../utils/scheduleHelpers';

const HistoricalView = ({ medications, dailyLogs }) => {
  const [historicalDateRange, setHistoricalDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [viewMode, setViewMode] = useState('medication'); // 'medication' or 'date'

  const setDateRangePresetHandler = (preset) => {
    const range = getDateRangePreset(preset);
    setHistoricalDateRange(range);
  };

  const getDailyLog = (dateStr) => {
    return dailyLogs?.[dateStr] || { pain: null, emotions: null, symptoms: '', notes: '' };
  };

  const getPainLabel = (value) => {
    const labels = ['No Pain', 'Mild', 'Moderate', 'Severe', 'Extreme'];
    return labels[value] || 'Not recorded';
  };

  const getEmotionLabel = (value) => {
    const labels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
    return labels[value] || 'Not recorded';
  };

  const adherenceStats = getAdherenceStats(medications, historicalDateRange.startDate, historicalDateRange.endDate);

  if (medications.length === 0) {
    return <p className="text-gray-500 text-center py-8">No medications to display</p>;
  }

  const dates = getDatesInRange(historicalDateRange.startDate, historicalDateRange.endDate);

  return (
    <>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg no-print">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Historical View Settings</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('medication')}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                viewMode === 'medication' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              By Medication
            </button>
            <button
              onClick={() => setViewMode('date')}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                viewMode === 'date' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              By Date
            </button>
          </div>
        </div>
        <h4 className="font-medium mb-3">Select Date Range</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setDateRangePresetHandler('last-week')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm">
            Last Week
          </button>
          <button onClick={() => setDateRangePresetHandler('last-month')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm">
            Last Month
          </button>
          <button onClick={() => setDateRangePresetHandler('last-3-months')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm">
            Last 3 Months
          </button>
          <button onClick={() => setDateRangePresetHandler('last-6-months')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm">
            Last 6 Months
          </button>
          <button onClick={() => setDateRangePresetHandler('last-year')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm">
            Last Year
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={historicalDateRange.startDate}
              onChange={(e) => setHistoricalDateRange(prev => ({...prev, startDate: e.target.value}))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={historicalDateRange.endDate}
              onChange={(e) => setHistoricalDateRange(prev => ({...prev, endDate: e.target.value}))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-lg mb-2">Adherence Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">{adherenceStats.totalTaken}</div>
            <div className="text-sm text-gray-600">Doses Taken</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{adherenceStats.totalScheduled}</div>
            <div className="text-sm text-gray-600">Total Scheduled</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{adherenceStats.percentage}%</div>
            <div className="text-sm text-gray-600">Adherence Rate</div>
          </div>
        </div>
      </div>

      {viewMode === 'medication' ? (
        <div className="space-y-6">
          {medications.sort((a, b) => a.name.localeCompare(b.name)).map(med => {
            const scheduledDates = dates.map(date => {
              const dateStr = formatDate(date);
              const schedules = getSchedulesForDate(med, dateStr).filter(s => !s.asNeeded);
              return {
                date: dateStr,
                dateObj: date,
                schedules
              };
            }).filter(d => d.schedules.length > 0);

          if (scheduledDates.length === 0) return null;

            const medTaken = scheduledDates.reduce((sum, d) => sum + d.schedules.filter(s => s.taken).length, 0);
            const medTotal = scheduledDates.reduce((sum, d) => sum + d.schedules.length, 0);
            const medPercentage = medTotal > 0 ? Math.round((medTaken / medTotal) * 100) : 0;

            return (
              <div key={med.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{med.name}</h3>
                      {med.genericName && <p className="text-sm text-gray-600">{med.genericName}</p>}
                      <p className="text-sm text-gray-600">{med.dosage}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{medPercentage}%</div>
                      <div className="text-xs text-gray-600">{medTaken}/{medTotal} taken</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <table className="w-full border-collapse border border-gray-300 medication-table print-text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Date</th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Time</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledDates.map(dateInfo => (
                        dateInfo.schedules.map((schedule, idx) => (
                          <tr key={`${dateInfo.date}-${idx}`} className="hover:bg-gray-50">
                            {idx === 0 && (
                              <td className="border border-gray-300 px-3 py-2 text-sm" rowSpan={dateInfo.schedules.length}>
                                <div className="font-medium">{dateInfo.dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                              </td>
                            )}
                            <td className="border border-gray-300 px-3 py-2 text-sm">
                              {schedule.label ? `${schedule.label} (${schedule.time})` : schedule.time}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              {schedule.taken ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  <Check className="w-3 h-3" />
                                  Taken
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                  Missed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {dates.sort((a, b) => b - a).map(date => {
            const dateStr = formatDate(date);
            const dailyLog = getDailyLog(dateStr);

            // Get all medication schedules for this date
            const dailySchedules = medications.flatMap(med => {
              const schedules = getSchedulesForDate(med, dateStr).filter(s => !s.asNeeded);
              return schedules.map(s => ({
                ...s,
                medName: med.name,
                medDosage: med.dosage,
                medGeneric: med.genericName
              }));
            });

            // Only show dates that have schedules or daily log entries
            const hasDailyData = dailyLog.pain !== null || dailyLog.emotions !== null || dailyLog.symptoms || dailyLog.notes;
            if (dailySchedules.length === 0 && !hasDailyData) return null;

            return (
              <div key={dateStr} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b">
                  <h3 className="font-bold text-lg">{date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</h3>
                </div>

                <div className="p-4">
                  {/* Medications for this date */}
                  {dailySchedules.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 mb-3">Medications</h4>
                      <table className="w-full border-collapse border border-gray-300 medication-table print-text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Medication</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Time</th>
                            <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailySchedules.map((schedule, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2 text-sm">
                                <div className="font-medium">{schedule.medName}</div>
                                <div className="text-xs text-gray-600">{schedule.medDosage}</div>
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-sm">
                                {schedule.label ? `${schedule.label} (${schedule.time})` : schedule.time}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center">
                                {schedule.taken ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    <Check className="w-3 h-3" />
                                    Taken
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                    Missed
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Daily Log Information */}
                  {hasDailyData && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Daily Log</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {dailyLog.pain !== null && (
                          <div className="bg-red-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-red-800">Pain Level</div>
                            <div className="text-lg font-semibold text-red-900">{getPainLabel(dailyLog.pain)}</div>
                          </div>
                        )}
                        {dailyLog.emotions !== null && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-blue-800">Emotional Well-being</div>
                            <div className="text-lg font-semibold text-blue-900">{getEmotionLabel(dailyLog.emotions)}</div>
                          </div>
                        )}
                      </div>
                      {dailyLog.symptoms && (
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-1">New Symptoms</div>
                          <div className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{dailyLog.symptoms}</div>
                        </div>
                      )}
                      {dailyLog.notes && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">{dailyLog.notes}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default HistoricalView;