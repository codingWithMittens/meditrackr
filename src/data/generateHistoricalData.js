// Helper to generate realistic medication adherence data for demo user
export const generateDemoDataForDateRange = (startDate, endDate, existingData = null) => {
  const medications = [
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
      "takenLog": []
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
      "takenLog": []
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
      "takenLog": []
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
      "takenLog": []
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
      "takenLog": []
    }
  ];

  const dailyLogs = existingData ? {...existingData.dailyLogs} : {};

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Realistic adherence patterns: 85% for prescriptions, 70% for vitamins, 20% for as-needed
  const adherenceRates = {
    "1699000001": 0.85, // Lisinopril (blood pressure - high adherence)
    "1699000002": 0.80, // Metformin (diabetes - good adherence)
    "1699000003": 0.75, // Atorvastatin (cholesterol - lower evening adherence)
    "1699000004": 0.70, // Vitamin D (supplement - moderate adherence)
    "1699000005": 0.20  // Ibuprofen (as-needed - occasional use)
  };

  // Initialize takenLog arrays if extending existing data
  if (existingData) {
    medications.forEach((med, index) => {
      med.takenLog = [...existingData.medications[index].takenLog];
    });
  }

  // Generate data for each day
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = formatDate(date);

    // Skip dates before medication start dates
    medications.forEach(med => {
      const medStartDate = new Date(med.startDate);
      if (date >= medStartDate) {
        const adherenceRate = adherenceRates[med.id];

        med.times.forEach(timeSlot => {
          const shouldTake = Math.random() < adherenceRate;

          if (shouldTake || (med.frequency === 'as-needed' && Math.random() < 0.15)) {
            const hour = parseInt(timeSlot.time.split(':')[0]);
            const minute = parseInt(timeSlot.time.split(':')[1]);

            // Add some realistic time variation (+/- 30 minutes)
            const variation = (Math.random() - 0.5) * 60; // -30 to +30 minutes
            const actualTime = new Date(date);
            actualTime.setHours(hour, minute + variation, 0, 0);

            med.takenLog.push(`${dateStr}-${timeSlot.time}`);
          }
        });
      }
    });

    // Generate daily logs for about 60% of days
    if (Math.random() < 0.6) {
      // Pain levels: mostly low with occasional spikes
      const painWeights = [0.4, 0.3, 0.2, 0.08, 0.02]; // 0-4 scale
      const painLevel = weightedRandom(painWeights);

      // Emotions: generally positive with some variation
      const emotionWeights = [0.05, 0.15, 0.25, 0.35, 0.2]; // 0-4 scale
      const emotionLevel = weightedRandom(emotionWeights);

      // Generate realistic notes based on pain/emotion levels
      const notes = generateRealisticNotes(date, painLevel, emotionLevel);
      const symptoms = generateSymptoms(painLevel);

      dailyLogs[dateStr] = {
        pain: painLevel,
        emotions: emotionLevel,
        symptoms: symptoms,
        notes: notes
      };
    }
  }

  // Helper function for weighted random selection
  function weightedRandom(weights) {
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) return i;
    }
    return weights.length - 1;
  }

  // Generate realistic notes based on context
  function generateRealisticNotes(date, pain, emotions) {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const notes = [];

    if (pain === 0 && emotions >= 3) {
      notes.push("Feeling great today! All medications taken on schedule.");
    } else if (pain === 0) {
      notes.push("No pain today, feeling good.");
    }

    if (pain >= 3) {
      const painReasons = [
        "Headache from work stress",
        "Back pain from poor sleep",
        "Joint stiffness from weather change",
        "Muscle soreness from exercise yesterday"
      ];
      notes.push(painReasons[Math.floor(Math.random() * painReasons.length)]);
    }

    if (emotions <= 1) {
      const moodReasons = [
        "Feeling down due to rainy weather",
        "Stressed about upcoming appointment",
        "Tired from poor sleep last night",
        "Worried about work situation"
      ];
      notes.push(moodReasons[Math.floor(Math.random() * moodReasons.length)]);
    } else if (emotions >= 4) {
      const goodMoodReasons = [
        "Great day with family!",
        "Productive day at work",
        "Nice weather lifted my spirits",
        "Good news from doctor visit"
      ];
      notes.push(goodMoodReasons[Math.floor(Math.random() * goodMoodReasons.length)]);
    }

    if (isWeekend && Math.random() < 0.3) {
      notes.push("Relaxing weekend day.");
    }

    // Medication-related notes (10% chance)
    if (Math.random() < 0.1) {
      const medNotes = [
        "Remember to refill prescriptions next week",
        "Blood pressure check went well",
        "Feeling more energy since adjusting med timing",
        "No side effects noticed lately"
      ];
      notes.push(medNotes[Math.floor(Math.random() * medNotes.length)]);
    }

    return notes.join(' ');
  }

  // Generate symptoms based on pain level
  function generateSymptoms(painLevel) {
    if (painLevel === 0) return '';
    if (Math.random() < 0.3) { // 30% chance of symptoms when in pain
      const symptoms = [
        "Mild headache",
        "Stiff neck",
        "Lower back tension",
        "Slight nausea",
        "Fatigue",
        "Joint stiffness"
      ];
      return symptoms[Math.floor(Math.random() * symptoms.length)];
    }
    return '';
  }

  return {
    medications,
    dailyLogs
  };
};