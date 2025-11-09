import { useState, useEffect } from 'react';
import { useAuth } from './useAuth.jsx';

export const useTour = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  // Check if user has completed tour
  useEffect(() => {
    if (user) {
      const tourKey = `tour_completed_${user.id}`;
      const completed = localStorage.getItem(tourKey) === 'true';
      console.log('Tour completion check:', { userId: user.id, completed, tourKey });
      setHasCompletedTour(completed);

      // Start tour for new users who haven't completed it
      if (!completed) {
        console.log('New user detected, starting tour after delay');
        // Small delay to let the app fully load
        setTimeout(() => {
          console.log('Auto-starting tour for new user');
          setIsActive(true);
        }, 1000);
      }
    }
  }, [user]);

  // Debug event listener
  useEffect(() => {
    const handleDebugTour = () => {
      console.log('Debug tour event received');
      startTour();
    };

    window.addEventListener('startTour', handleDebugTour);
    return () => window.removeEventListener('startTour', handleDebugTour);
  }, []);

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const completeTour = () => {
    if (user) {
      const tourKey = `tour_completed_${user.id}`;
      localStorage.setItem(tourKey, 'true');
      setHasCompletedTour(true);
    }
    setIsActive(false);
    setCurrentStep(0);
  };

  const skipTour = () => {
    completeTour();
  };

  const startTour = () => {
    console.log('startTour called - setting currentStep to 0, isActive to true');
    setCurrentStep(0);
    setIsActive(true);
    console.log('startTour completed - should trigger tour render');
  };

    const resetTour = () => {
    console.log('resetTour called, user:', user);
    console.log('Current tour state before reset:', { currentStep, isActive, hasCompletedTour });
    if (user) {
      const tourKey = `tour_completed_${user.id}`;
      console.log('Removing tour key:', tourKey);
      localStorage.removeItem(tourKey);

      // Force immediate state updates
      setHasCompletedTour(false);
      setCurrentStep(0);
      setIsActive(true);

      console.log('Tour state updated - should be active now');
    } else {
      console.log('No user found, cannot reset tour');
    }
  };

  return {
    currentStep,
    isActive,
    hasCompletedTour,
    nextStep,
    prevStep,
    completeTour,
    skipTour,
    startTour,
    resetTour,
    setCurrentStep
  };
};