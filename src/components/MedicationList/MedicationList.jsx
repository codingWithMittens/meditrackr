import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import MedicationCard from './MedicationCard';

const MedicationList = ({ medications, onEdit, onDelete, onAddNew }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Medications</h2>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
          Add Medication
        </button>
      </div>

      {medications.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Medications Added</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start tracking your medications by adding your first one
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-medium shadow-lg"
          >
            <Plus className="w-6 h-6" />
            Add Your First Medication
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map(med => (
            <MedicationCard
              key={med.id}
              medication={med}
              onEdit={() => onEdit(med)}
              onDelete={() => onDelete(med.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationList;
