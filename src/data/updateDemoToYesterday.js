// Auto-update demo data to ensure "taken" records up to yesterday
export function ensureDemoDataToYesterday() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  console.log('Checking demo data currency:', { todayStr, yesterdayStr });
  
  try {
    // Get demo user data
    const demoUserId = 'demo_user_2024';
    const medicationsKey = `medications_${demoUserId}`;
    const dailyLogsKey = `dailyLogs_${demoUserId}`;
    
    const medications = JSON.parse(localStorage.getItem(medicationsKey) || '[]');
    const dailyLogs = JSON.parse(localStorage.getItem(dailyLogsKey) || '{}');
    
    console.log('Current medications count:', medications.length);
    console.log('Current daily logs count:', Object.keys(dailyLogs).length);
    
    if (medications.length === 0) {
      console.log('No medications found, demo data may need to be reset first');
      return false;
    }
    
    let dataUpdated = false;
    
    // Update each medication's takenLog to include entries up to yesterday
    medications.forEach((medication, medIndex) => {
      if (!medication.takenLog) {
        medication.takenLog = [];
      }
      
      // Find the last entry for this medication
      const lastEntry = medication.takenLog
        .map(entry => entry.split('-').slice(0, 3).join('-'))
        .sort()
        .pop();
      
      console.log(`${medication.name} last entry:`, lastEntry);
      
      if (!lastEntry || lastEntry < yesterdayStr) {
        console.log(`Updating ${medication.name} data to yesterday`);
        
        // Generate realistic entries from last entry date to yesterday
        const startDate = lastEntry ? new Date(lastEntry) : new Date('2024-09-01');
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1); // Start from day after last entry
        
        const newEntries = [];
        
        while (currentDate <= yesterday) {
          const dateStr = currentDate.toISOString().split('T')[0];
          
          // Generate realistic adherence based on medication type
          medication.times.forEach(timeSlot => {
            let shouldTake = true;
            
            // Realistic adherence patterns
            switch (medication.name) {
              case 'Lisinopril': // Blood pressure - high adherence (88%)
                shouldTake = Math.random() < 0.88;
                break;
              case 'Metformin': // Diabetes - good adherence (82%), miss Sunday mornings
                shouldTake = Math.random() < 0.82;
                if (currentDate.getDay() === 0 && timeSlot.time === '08:00') { // Sunday morning
                  shouldTake = shouldTake && Math.random() < 0.5;
                }
                break;
              case 'Atorvastatin': // Evening cholesterol - moderate adherence (78%), miss weekends more
                shouldTake = Math.random() < 0.78;
                if ([5, 6].includes(currentDate.getDay())) { // Weekends
                  shouldTake = shouldTake && Math.random() < 0.7;
                }
                break;
              case 'Vitamin D3': // Supplement - moderate (72%), miss Mondays
                shouldTake = Math.random() < 0.72;
                if (currentDate.getDay() === 1) { // Monday
                  shouldTake = shouldTake && Math.random() < 0.5;
                }
                break;
              case 'Ibuprofen': // As needed - low usage (25%), higher in winter
                const month = currentDate.getMonth();
                const isWinter = month === 11 || month === 0 || month === 1;
                const baseRate = isWinter ? 0.4 : 0.2;
                shouldTake = Math.random() < baseRate;
                break;
              default:
                shouldTake = Math.random() < 0.8; // Default 80% adherence
            }
            
            if (shouldTake) {
              newEntries.push(`${dateStr}-${timeSlot.time}`);
            }
          });
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        if (newEntries.length > 0) {
          medication.takenLog = [...medication.takenLog, ...newEntries];
          console.log(`Added ${newEntries.length} entries for ${medication.name}`);
          dataUpdated = true;
        }
      }
    });
    
    // Update daily logs to include recent entries
    const lastLogDate = Object.keys(dailyLogs).sort().pop();
    console.log('Last daily log date:', lastLogDate);
    
    if (!lastLogDate || lastLogDate < yesterdayStr) {
      console.log('Adding daily log entries up to yesterday');
      
      const startDate = lastLogDate ? new Date(lastLogDate) : new Date('2024-09-01');
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + 1);
      
      while (currentDate <= yesterday) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Only add entries occasionally (not every day)
        if (Math.random() < 0.3) { // 30% chance of daily log entry
          const painLevel = Math.floor(Math.random() * 5);
          const emotionLevel = Math.floor(Math.random() * 5);
          
          const sampleNotes = [
            "Good energy levels and mood today.",
            "Feeling excellent today. Blood pressure stable.",
            "Productive day. All meds taken on schedule.",
            "Getting better at remembering evening medications.",
            "Busy day but managed to stay on track with meds.",
            "Doctor visit went well - blood work looks good.",
            "New Year resolution to be more consistent with meds is working!",
            "Exercise routine helping with overall well-being.",
            "Feeling positive about health progress in 2025.",
            "Great start to 2025! All medications taken consistently.",
            "Spring weather lifting my spirits.",
            "Adjusting well to daylight saving time change.",
            "Work stress manageable today.",
            "Feeling better than yesterday."
          ];
          
          const sampleSymptoms = [
            "", "", "", // Most days no new symptoms
            "Mild headache",
            "Joint stiffness", 
            "Lower back tension",
            "Slight fatigue",
            "Seasonal allergy symptoms"
          ];
          
          dailyLogs[dateStr] = {
            pain: painLevel,
            emotions: emotionLevel,
            symptoms: sampleSymptoms[Math.floor(Math.random() * sampleSymptoms.length)],
            notes: sampleNotes[Math.floor(Math.random() * sampleNotes.length)]
          };
          
          dataUpdated = true;
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    if (dataUpdated) {
      // Save updated data back to localStorage
      localStorage.setItem(medicationsKey, JSON.stringify(medications));
      localStorage.setItem(dailyLogsKey, JSON.stringify(dailyLogs));
      
      console.log('Demo data updated successfully to include entries up to yesterday');
      console.log('Updated medications count:', medications.length);
      console.log('Updated daily logs count:', Object.keys(dailyLogs).length);
      
      return true;
    } else {
      console.log('Demo data is already current - no updates needed');
      return false;
    }
    
  } catch (error) {
    console.error('Error updating demo data to yesterday:', error);
    return false;
  }
}