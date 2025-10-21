import React, { useState } from 'react';
import MedicationTable from './MedicationTable';
import HistoricalView from './HistoricalView';

const PrintView = ({ medications, timePeriods }) => {
  const [printViewType, setPrintViewType] = useState('list');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6 no-print">
        <h2 className="text-2xl font-bold">Export View</h2>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </div>

      <div className="flex gap-2 mb-6 no-print">
        <button
          onClick={() => setPrintViewType('list')}
          className={`px-4 py-2 rounded ${printViewType === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Med List
        </button>
        <button
          onClick={() => setPrintViewType('historical')}
          className={`px-4 py-2 rounded ${printViewType === 'historical' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Historical
        </button>
      </div>

      {printViewType === 'list' ? (
        <MedicationTable medications={medications} />
      ) : (
        <HistoricalView medications={medications} />
      )}
    </div>
  );
};

export default PrintView;