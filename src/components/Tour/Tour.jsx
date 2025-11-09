import React from 'react';
// Removed useTour import - now receives state as props
import TourTooltip from './TourTooltip.jsx';
import { tourSampleData } from '../../data/tourData.js';

const Tour = ({
  medications,
  pharmacies,
  providers,
  onAddMedication,
  onNavigateToPharmacies,
  onNavigateToProviders,
  onNavigateToReports,
  currentView,
  setCurrentView,
  // Tour state props
  currentStep,
  isActive,
  hasCompletedTour,
  nextStep,
  prevStep,
  completeTour,
  skipTour,
  // Form prefill props
  onPrefillMedicationForm,
  onPrefillPharmacyForm,
  onPrefillProviderForm
}) => {
  console.log('Tour component received props:', { currentStep, isActive, hasCompletedTour });

    // Realistic tour steps that guide users through actual form submission
  const tourSteps = [
    {
      id: 'welcome',
      targetSelector: '.calendar-header',
      title: '👋 Welcome to MedMindr!',
      content: 'Let\'s walk through creating your first medication setup! We\'ll guide you through adding a provider, pharmacy, and medication - just like you would in real use.',
      position: 'bottom'
    },
    {
      id: 'navigate-to-providers',
      targetSelector: '.user-menu',
      title: '👨‍⚕️ Step 1: Add a Healthcare Provider',
      content: 'First, let\'s add your healthcare provider. Click on your name in the top-right corner to access the settings menu.',
      position: 'left'
    },
    {
      id: 'click-providers-menu',
      targetSelector: '.settings-providers',
      title: '👨‍⚕️ Open Provider Settings',
      content: 'Perfect! Now click on "Providers" to manage your healthcare providers.',
      position: 'left',
      requiresDropdown: true
    },
    {
      id: 'provider-form-guide',
      targetSelector: '.provider-form',
      title: '📝 Fill Out Provider Information',
      content: 'Great! We\'ve pre-filled this form with sample data. You can edit any field, then click "Add Provider" to save it.',
      position: 'top',
      requiresView: 'providers'
    },
    {
      id: 'navigate-to-pharmacies',
      targetSelector: '.user-menu',
      title: '🏥 Step 2: Add Your Pharmacy',
      content: 'Excellent! Your provider is saved. Now let\'s add a pharmacy. Click on your name again to open the menu.',
      position: 'left',
      requiresView: 'calendar'
    },
    {
      id: 'click-pharmacies-menu',
      targetSelector: '.settings-pharmacies',
      title: '🏥 Open Pharmacy Settings',
      content: 'Now click on "Pharmacies" to manage where you get your medications.',
      position: 'left',
      requiresDropdown: true
    },
    {
      id: 'pharmacy-form-guide',
      targetSelector: '.pharmacy-form',
      title: '🏪 Fill Out Pharmacy Information',
      content: 'Perfect! Another pre-filled form with sample pharmacy data. Review it and click "Add Pharmacy" when ready.',
      position: 'top',
      requiresView: 'pharmacies'
    },
    {
      id: 'add-medication-guide',
      targetSelector: '.add-medication-btn',
      title: '💊 Step 3: Add Your First Medication',
      content: 'Awesome! Now for the final step - let\'s add a medication. Click "Add Your First Medication" below.',
      position: 'top',
      requiresView: 'calendar'
    },
    {
      id: 'medication-form-guide',
      targetSelector: '.medication-form',
      title: '💊 Complete Medication Details',
      content: 'Perfect! This form is pre-filled and linked to your provider and pharmacy. Review the details and click "Save Medication" to finish!',
      position: 'top',
      requiresView: 'form'
    },
    {
      id: 'calendar-success',
      targetSelector: '.calendar-grid',
      title: '🎉 Success! Your Medication is Scheduled',
      content: 'Fantastic! Your medication now appears on the calendar. You can see it scheduled for each day.',
      position: 'top',
      requiresView: 'calendar'
    },
    {
      id: 'daily-tracking',
      targetSelector: '.calendar-day-today',
      title: '✅ Try Daily Tracking',
      content: 'Click on today\'s date to see your medication and try tracking your daily health information.',
      position: 'top',
      requiresView: 'calendar'
    },
    {
      id: 'reports-feature',
      targetSelector: '.reports-btn',
      title: '📊 Explore Reports',
      content: 'You can also generate reports and export your data to share with healthcare providers.',
      position: 'left',
      requiresView: 'calendar'
    },
    {
      id: 'complete',
      targetSelector: '.calendar-header',
      title: '🎉 Tour Complete!',
      content: 'You\'ve successfully walked through the complete setup process! You now have a provider, pharmacy, and medication all working together.',
      position: 'bottom',
      requiresView: 'calendar'
    }
  ];

  // Enhanced tour logic to handle realistic form submission flow
  const shouldShowStep = (step) => {
    // Check view requirements
    if (step.requiresView && currentView !== step.requiresView) {
      return false;
    }

    // Check if step should be shown based on data conditions
    if (step.showOnlyIf !== undefined && !step.showOnlyIf) {
      return false;
    }

    return true;
  };

  // Get current step data
  const currentStepData = tourSteps[currentStep];

  console.log('Tour component render:', {
    isActive,
    currentStep,
    currentStepData: currentStepData ? currentStepData.id : 'none',
    totalSteps: tourSteps.length,
    currentView,
    hasCompletedTour
  });

  // Don't show tour if not active or no step data or step shouldn't show
  if (!isActive || !currentStepData || !shouldShowStep(currentStepData)) {
    return null;
  }

  return (
    <TourTooltip
      step={currentStep}
      isActive={isActive}
      targetSelector={currentStepData.targetSelector}
      title={currentStepData.title}
      content={currentStepData.content}
      position={currentStepData.position}
      onNext={nextStep}
      onPrev={prevStep}
      onComplete={completeTour}
      onSkip={skipTour}
      isFirstStep={currentStep === 0}
      isLastStep={currentStep === tourSteps.length - 1}
      actionIcon={currentStepData.actionIcon}
      actionText={currentStepData.actionText}
      onAction={currentStepData.onAction}
    />
  );
};

export default Tour;