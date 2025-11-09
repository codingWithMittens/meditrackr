// Sample data for tour prefilling
export const tourSampleData = {
  medication: {
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'daily',
    times: [{ label: 'Morning', time: '08:00', isCustom: false }],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: 'Take with or without food for blood pressure.',
    indication: 'High Blood Pressure',
    provider: '', // Will be set after provider is created
    type: 'rx',
    pharmacy: '' // Will be set after pharmacy is created
  },
  
  pharmacy: {
    name: 'Springfield Pharmacy',
    address: '123 Main Street\nSpringfield, IL 62701',
    phone: '(555) 123-4567'
  },
  
  provider: {
    name: 'Dr. Sarah Johnson',
    specialty: 'Primary Care Physician',
    address: '456 Medical Plaza\nSpringfield, IL 62702',
    phone: '(555) 987-6543'
  }
};