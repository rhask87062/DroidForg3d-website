// Visit tracking utility for splash page
export class VisitTracker {
  private static readonly STORAGE_KEY = 'droidforge_visit_count';
  private static readonly MAX_SPLASH_VISITS = 4;

  /**
   * Get the current visit count from localStorage
   */
  static getVisitCount(): number {
    try {
      const count = localStorage.getItem(this.STORAGE_KEY);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      console.warn('Failed to read visit count from localStorage:', error);
      return 0;
    }
  }

  /**
   * Increment the visit count and store it
   */
  static incrementVisitCount(): number {
    try {
      const currentCount = this.getVisitCount();
      const newCount = currentCount + 1;
      localStorage.setItem(this.STORAGE_KEY, newCount.toString());
      return newCount;
    } catch (error) {
      console.warn('Failed to update visit count in localStorage:', error);
      return this.getVisitCount();
    }
  }

  /**
   * Check if the user should see the splash page
   * Returns true for visits 1-4, false for visit 5+
   */
  static shouldShowSplash(): boolean {
    const visitCount = this.getVisitCount();
    return visitCount < this.MAX_SPLASH_VISITS;
  }

  /**
   * Check if this is the user's first visit
   */
  static isFirstVisit(): boolean {
    return this.getVisitCount() === 0;
  }

  /**
   * Reset the visit counter (useful for testing)
   */
  static resetVisitCount(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to reset visit count:', error);
    }
  }

  /**
   * Get the maximum number of splash visits allowed
   */
  static getMaxSplashVisits(): number {
    return this.MAX_SPLASH_VISITS;
  }
}

// Hook for using visit tracking in React components
import { useState, useEffect } from 'react';

export const useVisitTracking = () => {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [shouldShowSplash, setShouldShowSplash] = useState<boolean>(true);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);

  useEffect(() => {
    // Get current visit count
    const currentCount = VisitTracker.getVisitCount();
    const isFirst = VisitTracker.isFirstVisit();
    
    // Increment visit count for this session
    const newCount = VisitTracker.incrementVisitCount();
    
    // Update state
    setVisitCount(newCount);
    setShouldShowSplash(VisitTracker.shouldShowSplash());
    setIsFirstVisit(isFirst);
  }, []);

  return {
    visitCount,
    shouldShowSplash,
    isFirstVisit,
    resetVisitCount: VisitTracker.resetVisitCount,
    maxSplashVisits: VisitTracker.getMaxSplashVisits()
  };
};

