import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import FormFields from './FormFields';
import TimeSlotManager from './TimeSlotManager';
import { DAYS_OF_WEEK } from '../../constants/medications';

const MedicationForm = ({ editingMed, timePeriods, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    dosage: '',
    frequency: 'daily',
    weeklyDays: [],
    times: [{ label: 'Morning', time: '08:00', isCustom: false }],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    indication: '',
    provider: '',
    type: 'rx'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (editingMed) {
      setFormData({
        name: editingMed.name,
        genericName: editingMed.genericName || '',
        dosage: editingMed.dosage,
        frequency: editingMed.frequency,
        weeklyDays: editingMed.weeklyDays || [],
        times: editingMed.times,
        startDate: editingMed.startDate,
        endDate: editingMed.endDate || '',
        notes: editingMed.notes || '',
        indication: editingMed.indication || '',
        provider: editingMed.provider || '',
        type: editingMed.type || 'rx'
      });
    }
  }, [editingMed]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'frequency' && value === 'weekly' && formData.weeklyDays.length === 0) {
      setFormData(prev => ({ ...prev, [name]: value, weeklyDays: [0] }));
    }
  };

  const toggleWeeklyDay = (dayIndex) => {
    setFormData(prev => {
      const currentDays = prev.weeklyDays || [];
      if (currentDays.includes(dayIndex)) {
        const newDays = currentDays.filter(d => d !== dayIndex);
        return { ...prev, weeklyDays: newDays.length > 0 ? newDays : [dayIndex] };
      } else {
        return { ...prev, weeklyDays: [...currentDays, dayIndex].sort() };
      }
    });
  };

  const handleSubmit = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Drug name is required';
    }

    if (!formData.dosage.trim()) {
      errors.dosage = 'Dosage is required';
    }

    if (formData.frequency === 'as-needed' && !formData.notes.trim()) {
      errors.notes = 'Please describe when to take this "as needed" medication';
    }

    if (formData.frequency === 'weekly' && (!formData.weeklyDays || formData.weeklyDays.length === 0)) {
      errors.weeklyDays = 'Please select at least one day of the week';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingMed ? 'Edit Medication' : 'Add New Medication'}
      </h2>
      <div className="space-y-4">
        <FormFields
          formData={formData}
          formErrors={formErrors}
          onChange={handleInputChange}
          onUpdateFormData={setFormData}
        />

        {formData.frequency === 'weekly' && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Days of the Week <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleWeeklyDay(index)}
                  className={`px-4 py-2 rounded border-2 transition-colors ${
                    formData.weeklyDays.includes(index)
                      ? 'bg-blue-500 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            {formErrors.weeklyDays && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.weeklyDays}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">Select at least one day of the week</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {formData.frequency !== 'as-needed' && (
          <TimeSlotManager
            times={formData.times}
            timePeriods={timePeriods}
            onChange={(newTimes) => setFormData(prev => ({ ...prev, times: newTimes }))}
          />
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes {formData.frequency === 'as-needed' && <span className="text-red-500">*</span>}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${formErrors.notes ? 'border-red-500' : ''}`}
            rows="3"
            placeholder={formData.frequency === 'as-needed' ? "Required: Describe when to take this medication..." : "Any special instructions..."}
          />
          {formErrors.notes && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {formErrors.notes}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            {editingMed ? 'Update Medication' : 'Save Medication'}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationForm;