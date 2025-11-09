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
          <div className="bg-gradient-to-br from-blue-100 to-teal-100 w-28 h-28 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Plus className="w-14 h-14 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Add Medications?</h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
            Create your personalized medication schedule and never miss a dose again.
            Track adherence, set reminders, and monitor your health journey.
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-teal-700 text-xl font-bold shadow-xl shadow-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105"
          >
            <Plus className="w-7 h-7" />
            Add Your First Medication
          </button>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
              <div className="text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-500 w-8 h-8 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-800">Smart Scheduling</span>
                </div>
                <p className="text-gray-600 text-sm ml-11">Daily, weekly, or as-needed</p>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-800">Visual Tracking</span>
                </div>
                <p className="text-gray-600 text-sm ml-11">Calendar & list views</p>
              </div>
            </div>
          </div>
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
