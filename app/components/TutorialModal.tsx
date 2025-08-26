'use client';

import { useState, useEffect, useRef } from 'react';
import { TutorialStep, ConsoleKey, markTutorialCompleted } from '@/lib/tutorials';

interface TutorialModalProps {
  consoleKey: ConsoleKey;
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function TutorialModal({
  consoleKey,
  steps,
  isOpen,
  onClose,
  onComplete
}: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Highlight target element
  useEffect(() => {
    if (currentStepData?.target) {
      const targetElement = document.querySelector(currentStepData.target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add highlight class
        targetElement.classList.add('tutorial-highlight');
        return () => {
          targetElement.classList.remove('tutorial-highlight');
        };
      }
    }
  }, [currentStepData]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        handleSkip();
        break;
      case 'ArrowRight':
        if (!isLastStep) handleNext();
        break;
      case 'ArrowLeft':
        if (!isFirstStep) handlePrevious();
        break;
      case 'Enter':
        if (isLastStep) handleComplete();
        else handleNext();
        break;
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await markTutorialCompleted(consoleKey, false);
      onComplete();
    } catch (error) {
      console.error('Error completing tutorial:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = async () => {
    setIsCompleting(true);
    try {
      await markTutorialCompleted(consoleKey, true);
      onComplete();
    } catch (error) {
      console.error('Error skipping tutorial:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDonShowAgain = async () => {
    setIsCompleting(true);
    try {
      await markTutorialCompleted(consoleKey, true);
      onComplete();
    } catch (error) {
      console.error('Error marking tutorial as don\'t show again:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleSkip}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      aria-describedby="tutorial-description"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="tutorial-title" className="text-xl font-semibold">
                Tutorial
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="text-white hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
              aria-label="Close tutorial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6" ref={stepRef}>
          {/* Step Image */}
          {currentStepData.image && (
            <div className="mb-6 text-center">
              <img
                src={currentStepData.image}
                alt=""
                className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Step Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {currentStepData.title}
          </h3>

          {/* Step Body */}
          <p id="tutorial-description" className="text-gray-600 mb-6 leading-relaxed">
            {currentStepData.body}
          </p>

          {/* Action Button */}
          {currentStepData.action && (
            <div className="mb-6">
              <button
                onClick={handleNext}
                className="w-full btn btn--primary"
                disabled={isCompleting}
              >
                {currentStepData.action}
              </button>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {/* Navigation */}
            <div className="flex space-x-2">
              <button
                onClick={handlePrevious}
                disabled={isFirstStep || isCompleting}
                className="btn btn--secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={isLastStep || isCompleting}
                className="btn btn--secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {isLastStep ? (
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="btn btn--primary"
                >
                  {isCompleting ? 'Completing...' : 'Got it!'}
                </button>
              ) : (
                <button
                  onClick={handleSkip}
                  disabled={isCompleting}
                  className="btn btn--ghost"
                >
                  Skip
                </button>
              )}
            </div>
          </div>

          {/* Don't show again option */}
          <div className="mt-4 text-center">
            <button
              onClick={handleDonShowAgain}
              disabled={isCompleting}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Don't show this tutorial again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
