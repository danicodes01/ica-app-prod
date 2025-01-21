'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { IDBStation } from '@/types/models/planet';
import { SupportedLanguage } from '@/types/base/editor';
import { PlanetType } from '@/types/shared/planetTypes';
import { TestResult } from '@/types/base/challenge';
import { runCodeTest } from '@/utils/editor/codeRunner';
import styles from './station.module.css';
import { useSession } from 'next-auth/react';
import StationEditor from './station-editor';
import { StationInstructions } from './station-intructions';
import Loading from '../ui/loading';

interface StationProps {
  planetId: string;
  station: IDBStation;
  planetType: PlanetType;
}



export function Station({ planetId, station, planetType }: StationProps) {
  const { data: session } = useSession();
  const { updateStationProgress, getStationStatus, isNavigating } = useGameStore();
  const mountedRef = useRef(true)

  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [output, setOutput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  // const navigationTimer = useRef<number>(null);

  // my cleanup function
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    }
  }, [])

  const handleLanguageChange = useCallback((newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
  }, []);

  const formatFailedTests = useCallback((results: TestResult[]): string => {
    return results
      .map((r, i) => 
        !r.passed
          ? `Test ${i + 1}:\n` +
            `Input: ${JSON.stringify(r.input)}\n` +
            `Expected: ${JSON.stringify(r.expected)}\n` +
            `Got: ${JSON.stringify(r.actual)}` +
            (r.executionTime ? `\nExecution time: ${r.executionTime.toFixed(2)}ms` : '')
          : null
      )
      .filter(Boolean)
      .join('\n\n');
  }, []);

  const navigateWithDelay = useCallback((delay: number = 1500) => {
    if (!mountedRef.current) return;

    console.log("navigation")
    
    setTimeout(() => {
      if (mountedRef.current) {
        window.location.replace(`/game/planets/${planetId}`);
        console.log("nagigated")
      }
    }, delay);
}, [planetId]);

  const handleCodeSubmit = useCallback(async (code: string) => {
    if (isSubmitting || !mountedRef.current) return;
    setIsSubmitting(true);
    setOutput(null);
    setLogs([]);

    try {
      const progress = getStationStatus(planetType, station.order);
      const currentAttempts = progress?.currentAttempts || 0;

      const results = station.challenge.testCases.map(testCase => {
        return runCodeTest(code, station.challenge, testCase);
      });

      const allPassed = results.every(r => r.passed);
      
      const result = await updateStationProgress(
        planetType,
        station.order,
        allPassed,
        planetId
      );

      if (!mountedRef.current) return;

      if (allPassed) {
        setOutput(`🎉 Success! You've completed the challenge and earned ${result.xpAwarded} XP!`);
        navigateWithDelay()
        return;
      }

      const failureMessages = formatFailedTests(results);
      
      if (result.stationsLocked) {
        setOutput(
          `Failed attempt (${currentAttempts + 1}/3). Station locked. Returning to station ${result.resetToStation}...`
        );
        // Wait for state to update before navigation
        navigateWithDelay()
        return;
      }

      setOutput(
        currentAttempts >= 2
          ? `Failed attempt (${currentAttempts + 1}/3). This is your last attempt!\n\n${failureMessages}`
          : `Failed attempt (${currentAttempts + 1}/3). Try again!\n\n${failureMessages}`
      );
    } catch (error) {
      console.error('Submit error:', error);
      setOutput('An unexpected error occurred. Please try again.');
    } finally {
      if(mountedRef.current){
        setIsSubmitting(false);

      }
    }
  }, [
    isSubmitting,
    planetType,
    station,
    planetId,
    formatFailedTests,
    getStationStatus,
    updateStationProgress,
    navigateWithDelay
  ]);

  const handleReturn = useCallback(() => {
    window.location.href = `/game/planets/${planetId}`;
  }, [planetId]);

  if (isNavigating) {
    return <Loading loadingData=' Planet 🌕'  />;  
  }

   if (isSubmitting) {
    return (
      <div className={`${styles.container} ${output?.includes('Success') ? styles.blurred : ''}`}>
        <div className={styles.layout}>
          <StationInstructions station={station} />
          <StationEditor
            station={station}
            language={language}
            output={output}
            logs={logs}
            session={session}
            onLanguageChange={handleLanguageChange}
            onCodeSubmit={handleCodeSubmit}
            onReturn={handleReturn}
          />
        </div>
      </div>
    );
  }
  

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <StationInstructions 
          station={station} 
        />
        <StationEditor
          station={station}
          language={language}
          output={output}
          logs={logs}
          session={session}
          onLanguageChange={handleLanguageChange}
          onCodeSubmit={handleCodeSubmit}
          onReturn={handleReturn}
        />
      </div>
    </div>
  );
}
