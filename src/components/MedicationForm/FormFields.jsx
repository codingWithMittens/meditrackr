import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { COMMON_MEDICATIONS } from '../../constants/medications';

const FormFields = ({ formData, formErrors, onChange, onUpdateFormData }) => {
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [genericSuggestions, setGenericSuggestions] = useState([]);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [showGenericDropdown, setShowGenericDropdown] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value;
    onChange(e);

    if (value.length > 0) {
      const filtered = COMMON_MEDICATIONS.filter(med =>
        med.brand.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setNameSuggestions(filtered);
      setShowNameDropdown(true);
    } else {
      setShowNameDropdown(false);
    }
  };

  const handleGenericChange = (e) => {
    const value = e.target.value;
    onChange(e);

    if (value.length > 0) {
      const filtered = COMMON_MEDICATIONS.filter(med =>
        med.generic.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setGenericSuggestions(filtered);
      setShowGenericDropdown(true);
    } else {
      setShowGenericDropdown(false);
    }
  };

  const selectDrugName = (med) => {
    onUpdateFormData(prev => ({ ...prev, name: med.brand, genericName: med.generic }));
    setShowNameDropdown(false);
  };

  const selectGenericName = (med) => {
    onUpdateFormData(prev => ({ ...prev, genericName: med.generic, name: med.brand }));
    setShowGenericDropdown(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative">
        <label className="block text-sm font-medium mb-1">
          Drug Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          onFocus={() => formData.name && setShowNameDropdown(true)}
          onBlur={() => setTimeout(() => setShowNameDropdown(false), 200)}
          className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : ''}`}
          placeholder="e.g., Lipitor"
          autoComplete="off"
        />
        {formErrors.name && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {formErrors.name}
          </p>
        )}
        {showNameDropdown && nameSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {nameSuggestions.map((med, idx) => (
              <div
                key={idx}
                onClick={() => selectDrugName(med)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{med.brand}</div>
                <div className="text-xs text-gray-500">{med.generic}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium mb-1">Generic Name (Optional)</label>
        <input
          type="text"
          name="genericName"
          value={formData.genericName}
          onChange={handleGenericChange}
          onFocus={() => formData.genericName && setShowGenericDropdown(true)}
          onBlur={() => setTimeout(() => setShowGenericDropdown(false), 200)}
          className="w-full p-2 border rounded"
          placeholder="e.g., Atorvastatin"
          autoComplete="off"
        />
        {showGenericDropdown && genericSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {genericSuggestions.map((med, idx) => (
              <div
                key={idx}
                onClick={() => selectGenericName(med)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{med.generic}</div>
                <div className="text-xs text-gray-500">{med.brand}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Dosage <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="dosage"
          value={formData.dosage}
          onChange={onChange}
          className={`w-full p-2 border rounded ${formErrors.dosage ? 'border-red-500' : ''}`}
          placeholder="e.g., 100mg"
        />
        {formErrors.dosage && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {formErrors.dosage}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Frequency</label>
        <select
          name="frequency"
          value={formData.frequency}
          onChange={onChange}
          className="w-full p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="as-needed">As Needed</option>
        </select>
      </div>
    </div>
  );
};

export default FormFields;