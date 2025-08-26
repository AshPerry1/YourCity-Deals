'use client';

import { useState, useEffect } from 'react';
import { ConsoleKey, shouldShowTutorial, getTutorialSteps, TutorialStep } from '@/lib/tutorials';

interface UseTutorialReturn {
  isTutorialOpen: boolean;
  tutorialSteps: TutorialStep[];
  showTutorial: () => void;
  hideTutorial: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
  isLoading: boolean;
}

export function useTutorial(consoleKey: ConsoleKey): UseTutorialReturn {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldAutoShow, setShouldAutoShow] = useState(false);

  const tutorialSteps = getTutorialSteps(consoleKey);

  // Check if tutorial should be shown on mount
  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        const shouldShow = await shouldShowTutorial(consoleKey);
        setShouldAutoShow(shouldShow);
      } catch (error) {
        console.error('Error checking tutorial status:', error);
        setShouldAutoShow(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTutorialStatus();
  }, [consoleKey]);

  // Auto-show tutorial if needed
  useEffect(() => {
    if (!isLoading && shouldAutoShow) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        setIsTutorialOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, shouldAutoShow]);

  const showTutorial = () => {
    setIsTutorialOpen(true);
  };

  const hideTutorial = () => {
    setIsTutorialOpen(false);
  };

  const completeTutorial = () => {
    setIsTutorialOpen(false);
    // The actual completion is handled by the TutorialModal component
  };

  const skipTutorial = () => {
    setIsTutorialOpen(false);
    // The actual skipping is handled by the TutorialModal component
  };

  return {
    isTutorialOpen,
    tutorialSteps,
    showTutorial,
    hideTutorial,
    completeTutorial,
    skipTutorial,
    isLoading
  };
}
