import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { COMMON_MEDICATIONS } from '../../constants/medications';

// Common suggestions for various fields
const NOTES_SUGGESTIONS = [
  "Take with food",
  "Take on empty stomach",
  "Take with plenty of water",
  "Take at bedtime",
  "Monitor blood pressure",
  "Avoid alcohol",
  "Avoid grapefruit juice",
  "Take same time each day",
  "Do not crush or chew",
  "May cause drowsiness",
  "Take with breakfast",
  "Refrigerate after opening"
];

const INDICATION_SUGGESTIONS = [
  "High Blood Pressure",
  "Type 2 Diabetes",
  "High Cholesterol",
  "Depression",
  "Anxiety",
  "Acid Reflux",
  "Arthritis",
  "Asthma",
  "Heart Disease",
  "Thyroid Condition",
  "Pain Relief",
  "Allergy Relief",
  "Sleep Aid",
  "Vitamin Deficiency"
];

const FormFields = ({ formData, formErrors, onChange, onUpdateFormData, pharmacies, providers }) => {
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [genericSuggestions, setGenericSuggestions] = useState([]);
  const [notesSuggestions, setNotesSuggestions] = useState([]);
  const [indicationSuggestions, setIndicationSuggestions] = useState([]);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [showGenericDropdown, setShowGenericDropdown] = useState(false);
  const [showNotesDropdown, setShowNotesDropdown] = useState(false);
  const [showIndicationDropdown, setShowIndicationDropdown] = useState(false);



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

  const handleIndicationChange = (e) => {
    const value = e.target.value;
    onChange(e);

    if (value.length > 0) {
      const filtered = INDICATION_SUGGESTIONS.filter(indication =>
        indication.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setIndicationSuggestions(filtered);
      setShowIndicationDropdown(true);
    } else {
      setShowIndicationDropdown(false);
    }
  };

  const selectIndication = (indication) => {
    onUpdateFormData(prev => ({ ...prev, indication }));
    setShowIndicationDropdown(false);
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
          tabIndex={1}
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
        <label className="block text-sm font-medium mb-1">Generic Name</label>
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
          tabIndex={2}
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
          tabIndex={3}
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
          tabIndex={4}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="as-needed">As Needed</option>
        </select>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium mb-1">Indication</label>
        <input
          type="text"
          name="indication"
          value={formData.indication || ''}
          onChange={handleIndicationChange}
          onFocus={() => formData.indication && setShowIndicationDropdown(true)}
          onBlur={() => setTimeout(() => setShowIndicationDropdown(false), 200)}
          className="w-full p-2 border rounded"
          placeholder="e.g., High blood pressure"
          tabIndex={5}
          autoComplete="off"
        />
        {showIndicationDropdown && indicationSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {indicationSuggestions.map((indication, idx) => (
              <div
                key={idx}
                onClick={() => selectIndication(indication)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{indication}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Provider</label>
        <select
          name="provider"
          value={formData.provider || ''}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded"
          tabIndex={6}
        >
          <option value="">Select a provider</option>
          {providers && providers.map(provider => (
            <option key={provider.id} value={provider.id}>
              {provider.name}{provider.specialty ? ` (${provider.specialty})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="rx"
              checked={formData.type === 'rx'}
              onChange={onChange}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700">Prescription (Rx)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="otc"
              checked={formData.type === 'otc'}
              onChange={onChange}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700">Over the Counter (OTC)</span>
          </label>
        </div>
      </div>

      {formData.type === 'rx' && pharmacies && pharmacies.length > 0 && (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Pharmacy</label>
          <select
            name="pharmacy"
            value={formData.pharmacy || ''}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a pharmacy</option>
            {pharmacies.map(pharmacy => (
              <option key={pharmacy.id} value={pharmacy.id}>
                {pharmacy.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default FormFields;