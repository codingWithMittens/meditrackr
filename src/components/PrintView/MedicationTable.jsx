import React from 'react';
import { getTimeString } from '../../utils/scheduleHelpers';
import { DAYS_OF_WEEK_SHORT } from '../../constants/medications';

const MedicationTable = ({ medications, selectedFields, pharmacies, providers }) => {
  if (medications.length === 0) {
    return <p className="text-gray-500 text-center py-8">No medications to display</p>;
  }

  // Default field selection if not provided
  const defaultFields = {
    name: true,
    genericName: true,
    dosage: true,
    frequency: true,
    times: true,
    notes: true
  };

  const fieldsToUse = selectedFields || defaultFields;
  const getProviderById = (id) => providers?.find(p => p.id === id);
  const getPharmacyById = (id) => pharmacies?.find(p => p.id === id);

  const fieldHeaders = {
    name: 'Drug Name',
    genericName: 'Generic Name',
    dosage: 'Dosage',
    frequency: 'Frequency',
    times: 'Times to Take',
    indication: 'Indication',
    provider: 'Provider',
    providerDetails: 'Provider Contact',
    pharmacy: 'Pharmacy',
    pharmacyDetails: 'Pharmacy Contact',
    startDate: 'Start Date',
    endDate: 'End Date',
    notes: 'Notes'
  };

  const selectedFieldKeys = Object.keys(fieldsToUse).filter(key => fieldsToUse[key]);

  const renderFieldContent = (med, field) => {
    const provider = getProviderById(med.provider);
    const pharmacy = getPharmacyById(med.pharmacy);

    switch (field) {
      case 'name':
        return <span className="font-medium">{med.name}</span>;
      case 'genericName':
        return <span className="text-sm text-gray-600">{med.genericName || '-'}</span>;
      case 'dosage':
        return med.dosage;
      case 'frequency':
        return (
          <div className="capitalize">
            {med.frequency.replace('-', ' ')}
            {med.frequency === 'weekly' && med.weeklyDays && med.weeklyDays.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {med.weeklyDays.map(d => DAYS_OF_WEEK_SHORT[d]).join(', ')}
              </div>
            )}
          </div>
        );
      case 'times':
        return med.frequency === 'as-needed' ? (
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
        );
      case 'indication':
        return <span className="text-sm">{med.indication || '-'}</span>;
      case 'provider':
        return provider ? (
          <div>
            <div>{provider.name}</div>
            {provider.specialty && <div className="text-xs text-gray-500">{provider.specialty}</div>}
          </div>
        ) : '-';
      case 'providerDetails':
        return provider ? (
          <div className="text-sm">
            <div>{provider.phone}</div>
            <div className="text-xs text-gray-500 mt-1">{provider.address}</div>
          </div>
        ) : '-';
      case 'pharmacy':
        return pharmacy ? pharmacy.name : '-';
      case 'pharmacyDetails':
        return pharmacy ? (
          <div className="text-sm">
            <div>{pharmacy.phone}</div>
            <div className="text-xs text-gray-500 mt-1">{pharmacy.address}</div>
          </div>
        ) : '-';
      case 'startDate':
        return med.startDate ? new Date(med.startDate).toLocaleDateString() : '-';
      case 'endDate':
        return med.endDate ? new Date(med.endDate).toLocaleDateString() : '-';
      case 'notes':
        return <span className="text-sm">{med.notes || '-'}</span>;
      default:
        return '-';
    }
  };

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm print:overflow-visible print:border-none print:shadow-none page-break-inside-avoid">
      <table className="min-w-full border-collapse print:table-auto medication-table">
      <thead>
        <tr className="bg-gray-100">
          {selectedFieldKeys.map(field => (
            <th key={field} className="border-r border-b border-gray-300 px-4 py-3 text-left font-semibold whitespace-nowrap min-w-0 print-font-bold">
              {fieldHeaders[field]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {medications.sort((a, b) => {
          // As-needed medications should appear at the bottom
          const aIsAsNeeded = a.frequency === 'as-needed';
          const bIsAsNeeded = b.frequency === 'as-needed';

          if (aIsAsNeeded && !bIsAsNeeded) return 1; // a comes after b
          if (!aIsAsNeeded && bIsAsNeeded) return -1; // a comes before b

          // If both are same type (both as-needed or both scheduled), sort alphabetically by name
          return a.name.localeCompare(b.name);
        }).map((med, index) => (
          <tr key={med.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50/50 transition-colors page-break-inside-avoid`}>
            {selectedFieldKeys.map((field, fieldIndex) => (
              <td key={field} className={`border-r border-b border-gray-300 px-4 py-3 align-top min-w-0 print-text-sm ${
                field === 'name' ? 'font-medium print-font-bold' : ''
              } ${
                ['providerDetails', 'pharmacyDetails', 'notes', 'symptoms'].includes(field) ? 'max-w-xs' : 'max-w-sm'
              }`}>
                <div className="truncate print:whitespace-normal" title={typeof renderFieldContent(med, field) === 'string' ? renderFieldContent(med, field) : ''}>
                  {renderFieldContent(med, field)}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default MedicationTable;