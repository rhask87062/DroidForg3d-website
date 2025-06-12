import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitTracker } from '../lib/visitTracker';

/**
 * SplashRouter component handles the logic for showing the splash page
 * or redirecting to the main application based on visit count
 */
export const SplashRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user should see splash page
    const shouldShowSplash = VisitTracker.shouldShowSplash();
    
    if (!shouldShowSplash) {
      // User has visited 4+ times, redirect to main app
      navigate('/', { replace: true });
      return;
    }

    // Increment visit count for this session
    VisitTracker.incrementVisitCount();
  }, [navigate]);

  // If we reach here, user should see the splash page
  return <>{children}</>;
};

/**
 * Hook to handle navigation from splash page to main app
 */
export const useSplashNavigation = () => {
  const navigate = useNavigate();

  const navigateToMainApp = () => {
    // Navigate to the main application
    navigate('/', { replace: true });
  };

  const getVisitInfo = () => {
    return {
      visitCount: VisitTracker.getVisitCount(),
      isFirstVisit: VisitTracker.isFirstVisit(),
      maxVisits: VisitTracker.getMaxSplashVisits(),
      remainingVisits: Math.max(0, VisitTracker.getMaxSplashVisits() - VisitTracker.getVisitCount())
    };
  };

  return {
    navigateToMainApp,
    getVisitInfo
  };
};

