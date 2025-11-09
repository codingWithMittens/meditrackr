// Script to generate comprehensive demo data including 2025 data
import { generateDemoDataForDateRange } from './generateHistoricalData.js';

// Generate 2025 data continuing from November 2024
export const generateExtended2025Data = () => {
  const baseData = {
    medications: [
      {
        "id": 1699000001,
        "name": "Lisinopril",
        "genericName": "Lisinopril",
        "dosage": "10mg",
        "frequency": "daily",
        "times": [{"label": "Morning", "time": "08:00", "isCustom": false}],
        "startDate": "2024-01-15",
        "endDate": "",
        "notes": "Take with or without food. Monitor blood pressure.",
        "indication": "High Blood Pressure",
        "provider": "1699000001",
        "type": "rx",
        "pharmacy": "1699000001",
        "takenLog": [
          "2024-09-01-08:00", "2024-09-02-08:00", "2024-09-03-08:00", "2024-09-05-08:00", "2024-09-06-08:00",
          "2024-09-07-08:00", "2024-09-08-08:00", "2024-09-10-08:00", "2024-09-11-08:00", "2024-09-12-08:00",
          "2024-09-13-08:00", "2024-09-14-08:00", "2024-09-16-08:00", "2024-09-17-08:00", "2024-09-18-08:00",
          "2024-09-19-08:00", "2024-09-20-08:00", "2024-09-21-08:00", "2024-09-22-08:00", "2024-09-24-08:00",
          "2024-09-25-08:00", "2024-09-26-08:00", "2024-09-27-08:00", "2024-09-28-08:00", "2024-09-29-08:00",
          "2024-09-30-08:00", "2024-10-01-08:00", "2024-10-02-08:00", "2024-10-03-08:00", "2024-10-05-08:00",
          "2024-10-06-08:00", "2024-10-07-08:00", "2024-10-08-08:00", "2024-10-09-08:00", "2024-10-10-08:00",
          "2024-10-11-08:00", "2024-10-12-08:00", "2024-10-14-08:00", "2024-10-15-08:00", "2024-10-16-08:00",
          "2024-10-17-08:00", "2024-10-18-08:00", "2024-10-19-08:00", "2024-10-20-08:00", "2024-10-22-08:00",
          "2024-10-23-08:00", "2024-10-24-08:00", "2024-10-25-08:00", "2024-10-26-08:00", "2024-10-27-08:00",
          "2024-10-28-08:00", "2024-10-29-08:00", "2024-10-31-08:00", "2024-11-01-08:00", "2024-11-02-08:00",
          "2024-11-03-08:00", "2024-11-05-08:00", "2024-11-06-08:00"
        ]
      },
      {
        "id": 1699000002,
        "name": "Metformin",
        "genericName": "Metformin HCl",
        "dosage": "500mg",
        "frequency": "daily",
        "times": [
          {"label": "Morning", "time": "08:00", "isCustom": false},
          {"label": "Evening", "time": "18:00", "isCustom": false}
        ],
        "startDate": "2024-02-01",
        "endDate": "",
        "notes": "Take with meals to reduce stomach upset.",
        "indication": "Type 2 Diabetes",
        "provider": "1699000002",
        "type": "rx",
        "pharmacy": "1699000001",
        "takenLog": [
          "2024-10-01-08:00", "2024-10-01-18:00", "2024-10-02-08:00", "2024-10-02-18:00", "2024-10-03-08:00",
          "2024-10-04-08:00", "2024-10-04-18:00", "2024-10-05-08:00", "2024-10-05-18:00", "2024-10-06-08:00",
          "2024-10-06-18:00", "2024-10-07-18:00", "2024-10-08-08:00", "2024-10-08-18:00", "2024-10-09-08:00",
          "2024-10-09-18:00", "2024-10-10-08:00", "2024-10-10-18:00", "2024-10-11-08:00", "2024-10-11-18:00",
          "2024-10-12-08:00", "2024-10-13-08:00", "2024-10-13-18:00", "2024-10-14-08:00", "2024-10-14-18:00",
          "2024-10-15-08:00", "2024-10-15-18:00", "2024-10-16-18:00", "2024-10-17-08:00", "2024-10-17-18:00",
          "2024-10-18-08:00", "2024-10-18-18:00", "2024-10-19-08:00", "2024-10-19-18:00", "2024-10-20-08:00",
          "2024-10-21-08:00", "2024-10-21-18:00", "2024-10-22-08:00", "2024-10-22-18:00", "2024-10-23-08:00",
          "2024-10-23-18:00", "2024-10-24-08:00", "2024-10-24-18:00", "2024-10-25-08:00", "2024-10-25-18:00",
          "2024-10-27-08:00", "2024-10-27-18:00", "2024-10-28-08:00", "2024-10-28-18:00", "2024-10-29-08:00",
          "2024-10-29-18:00", "2024-10-30-08:00", "2024-10-30-18:00", "2024-10-31-08:00", "2024-10-31-18:00",
          "2024-11-01-08:00", "2024-11-01-18:00", "2024-11-02-08:00", "2024-11-03-08:00", "2024-11-03-18:00",
          "2024-11-04-18:00", "2024-11-05-08:00", "2024-11-05-18:00", "2024-11-06-08:00", "2024-11-06-18:00"
        ]
      },
      {
        "id": 1699000003,
        "name": "Atorvastatin",
        "genericName": "Atorvastatin Calcium",
        "dosage": "20mg",
        "frequency": "daily",
        "times": [{"label": "Bedtime", "time": "22:00", "isCustom": false}],
        "startDate": "2024-03-10",
        "endDate": "",
        "notes": "Take at bedtime on empty stomach. Avoid grapefruit juice.",
        "indication": "High Cholesterol",
        "provider": "1699000001",
        "type": "rx",
        "pharmacy": "1699000001",
        "takenLog": [
          "2024-10-10-22:00", "2024-10-12-22:00", "2024-10-13-22:00", "2024-10-15-22:00", "2024-10-16-22:00",
          "2024-10-17-22:00", "2024-10-19-22:00", "2024-10-20-22:00", "2024-10-21-22:00", "2024-10-23-22:00",
          "2024-10-24-22:00", "2024-10-25-22:00", "2024-10-27-22:00", "2024-10-28-22:00", "2024-10-29-22:00",
          "2024-10-30-22:00", "2024-11-01-22:00", "2024-11-02-22:00", "2024-11-03-22:00", "2024-11-06-22:00"
        ]
      },
      {
        "id": 1699000004,
        "name": "Vitamin D3",
        "genericName": "Cholecalciferol",
        "dosage": "2000 IU",
        "frequency": "daily",
        "times": [{"label": "Morning", "time": "08:00", "isCustom": false}],
        "startDate": "2024-01-01",
        "endDate": "",
        "notes": "Take with breakfast for better absorption.",
        "indication": "Vitamin D Deficiency",
        "provider": "",
        "type": "otc",
        "pharmacy": "",
        "takenLog": [
          "2024-09-01-08:00", "2024-09-03-08:00", "2024-09-05-08:00", "2024-09-07-08:00", "2024-09-08-08:00",
          "2024-09-10-08:00", "2024-09-12-08:00", "2024-09-14-08:00", "2024-09-15-08:00", "2024-09-17-08:00",
          "2024-09-19-08:00", "2024-09-21-08:00", "2024-09-22-08:00", "2024-09-24-08:00", "2024-09-26-08:00",
          "2024-09-28-08:00", "2024-09-29-08:00", "2024-10-01-08:00", "2024-10-03-08:00", "2024-10-05-08:00",
          "2024-10-06-08:00", "2024-10-08-08:00", "2024-10-10-08:00", "2024-10-11-08:00", "2024-10-13-08:00",
          "2024-10-15-08:00", "2024-10-17-08:00", "2024-10-18-08:00", "2024-10-20-08:00", "2024-10-22-08:00",
          "2024-10-23-08:00", "2024-10-25-08:00", "2024-10-27-08:00", "2024-10-28-08:00", "2024-10-30-08:00",
          "2024-11-01-08:00", "2024-11-03-08:00", "2024-11-05-08:00", "2024-11-06-08:00"
        ]
      },
      {
        "id": 1699000005,
        "name": "Ibuprofen",
        "genericName": "Ibuprofen",
        "dosage": "400mg",
        "frequency": "as-needed",
        "times": [{"label": "As Needed", "time": "12:00", "isCustom": false}],
        "startDate": "2024-01-01",
        "endDate": "",
        "notes": "For headaches or muscle pain. Max 3 times per day. Take with food.",
        "indication": "Pain Relief",
        "provider": "",
        "type": "otc",
        "pharmacy": "",
        "takenLog": [
          "2024-09-08-12:00", "2024-09-15-12:00", "2024-09-22-12:00", "2024-09-28-12:00", "2024-10-03-12:00",
          "2024-10-07-12:00", "2024-10-12-12:00", "2024-10-18-12:00", "2024-10-25-12:00", "2024-10-30-12:00",
          "2024-11-04-12:00"
        ]
      }
    ],
    dailyLogs: {
      // Existing 2024 data would be here - truncated for brevity
    }
  };

  // Generate 2025 data from November 7, 2024 through current date + 30 days
  const startDate2025 = new Date('2024-11-07');
  const endDate2025 = new Date();
  endDate2025.setDate(endDate2025.getDate() + 30); // Add 30 days from today

  const extended2025Data = generateDemoDataForDateRange(startDate2025, endDate2025, baseData);
  
  return extended2025Data;
};

// Function to generate realistic 2025 medication entries
export const generate2025MedicationData = () => {
  const today = new Date();
  const startDate = new Date('2024-11-07'); // Continue from where 2024 data left off
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate() + 15); // Go 15 days into future
  
  // Helper to format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Medication configurations with realistic 2025 adherence patterns
  const medicationConfigs = [
    {
      id: 1699000001,
      name: "Lisinopril", 
      times: ["08:00"],
      adherenceRate: 0.88, // Slight improvement in 2025
      skipPattern: [] // Rare misses
    },
    {
      id: 1699000002,
      name: "Metformin",
      times: ["08:00", "18:00"], 
      adherenceRate: 0.85, // Good adherence
      skipPattern: ["Sunday morning"] // Occasional weekend morning miss
    },
    {
      id: 1699000003,
      name: "Atorvastatin",
      times: ["22:00"],
      adherenceRate: 0.78, // Evening meds often missed
      skipPattern: ["Friday", "Saturday"] // Weekend social activities
    },
    {
      id: 1699000004,
      name: "Vitamin D3",
      times: ["08:00"],
      adherenceRate: 0.72, // Vitamins less consistent  
      skipPattern: ["Monday", "busy days"]
    },
    {
      id: 1699000005,
      name: "Ibuprofen",
      times: ["12:00"],
      adherenceRate: 0.25, // As-needed, seasonal increase in winter
      skipPattern: [] // As-needed basis
    }
  ];

  const medicationData = {};
  medicationConfigs.forEach(config => {
    medicationData[config.id] = [];
  });

  // Generate entries for each date
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = formatDate(date);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';

    medicationConfigs.forEach(config => {
      config.times.forEach(time => {
        let shouldTake = Math.random() < config.adherenceRate;

        // Apply skip patterns
        if (config.skipPattern.includes(dayOfWeek)) {
          shouldTake = shouldTake * 0.3; // Reduce likelihood
        }
        
        // Special handling for as-needed medication (more in winter months)
        if (config.name === "Ibuprofen") {
          const month = date.getMonth();
          const isWinter = month === 11 || month === 0 || month === 1;
          const winterMultiplier = isWinter ? 1.8 : 1.0;
          shouldTake = Math.random() < (config.adherenceRate * winterMultiplier);
        }

        if (shouldTake) {
          medicationData[config.id].push(`${dateStr}-${time}`);
        }
      });
    });
  }

  return medicationData;
};