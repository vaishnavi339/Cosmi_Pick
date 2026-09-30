'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ScanProgressBar } from '@/components/scan/ScanProgressBar';
import { StepConsent } from '@/components/scan/StepConsent';
import { StepWebcam } from '@/components/scan/StepWebcam';
import { StepAnalysis } from '@/components/scan/StepAnalysis';
import { StepRequirements } from '@/components/scan/StepRequirements';
import { StepResults } from '@/components/scan/StepResults';
import { ResultsSkeleton } from '@/components/results/ResultsSkeleton';
import { ExtractedFaceTraits, UserRequirements, RecommendationResult } from '@/types';
import { getFallbackDefaultTraits } from '@/lib/face-analysis';

export default function ScanWizardPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [traits, setTraits] = useState<ExtractedFaceTraits | null>(null);
  const [requirements, setRequirements] = useState<UserRequirements | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Smooth scroll to top when changing steps
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // 1. Consent Given -> Move to Step 2 (Scan)
  const handleConsentGiven = () => {
    setCurrentStep(2);
  };

  // 2. Face Scan Completed -> Move to Step 3 (Analysis Review)
  const handleScanComplete = (extractedTraits: ExtractedFaceTraits) => {
    setTraits(extractedTraits);
    setCurrentStep(3);
  };

  // 3. Traits Confirmed -> Move to Step 4 (Requirements)
  const handleTraitsConfirmed = (confirmedTraits: ExtractedFaceTraits) => {
    setTraits(confirmedTraits);
    setCurrentStep(4);
  };

  // 4. Requirements Submitted -> Trigger API -> Move to Step 5 (Results)
  const handleRequirementsSubmit = async (
    rawText: string,
    manualReqs: Partial<UserRequirements>
  ) => {
    setLoading(true);
    setErrorMessage(null);

    const activeTraits = traits || getFallbackDefaultTraits();

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traits: activeTraits,
          rawText,
          manualRequirements: manualReqs,
        }),
      });

      if (!response.ok) {
        throw new Error(`Recommendation service error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        setRequirements(data.parsedRequirements);
        setCurrentStep(5);

        // Fire celebratory luxury confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#3B1F2B', '#CE7F79', '#D9B99B', '#8CA583', '#F4D9D6'],
          });
        } catch {
          // ignore confetti error on headless/ssr
        }
      } else {
        throw new Error('No recommendations generated.');
      }
    } catch (err: any) {
      console.error('Error generating recommendations:', err);
      setErrorMessage(err.message || 'Unable to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Restart wizard
  const handleRestart = () => {
    setCurrentStep(1);
    setTraits(null);
    setRequirements(null);
    setRecommendations([]);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[85vh] py-8 relative">
      {/* Progress Bar Header */}
      <ScanProgressBar
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step < currentStep) setCurrentStep(step);
        }}
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto px-4 mb-6">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton Transition */}
      {loading && (
        <div className="py-4">
          <ResultsSkeleton />
        </div>
      )}

      {/* Step Components */}
      {!loading && currentStep === 1 && <StepConsent onConsentGiven={handleConsentGiven} />}

      {!loading && currentStep === 2 && (
        <StepWebcam
          onScanComplete={handleScanComplete}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {!loading && currentStep === 3 && traits && (
        <StepAnalysis
          traits={traits}
          onTraitsConfirmed={handleTraitsConfirmed}
          onRescan={() => setCurrentStep(2)}
        />
      )}

      {!loading && currentStep === 4 && traits && (
        <StepRequirements
          traits={traits}
          onSubmit={handleRequirementsSubmit}
          onBack={() => setCurrentStep(3)}
          loading={loading}
        />
      )}

      {!loading && currentStep === 5 && traits && requirements && (
        <StepResults
          initialResults={recommendations}
          traits={traits}
          requirements={requirements}
          onRestart={handleRestart}
          onEditTraits={() => setCurrentStep(3)}
          onEditRequirements={() => setCurrentStep(4)}
        />
      )}
    </div>
  );
}
