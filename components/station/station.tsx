'use client';

import { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/editor/code-editor';
import { useGameStore } from '@/store/useGameStore';
import { IDBStation } from '@/types/models/planet';
import { SupportedLanguage } from '@/types/base/editor';
import { PlanetType } from '@/types/shared/planetTypes';
import { TestResult } from '@/types/base/challenge';
import { runCodeTest } from '@/utils/editor/codeRunner';
import styles from './station.module.css';
import { CODE_SNIPPETS } from '@/utils/constants/codeEditor/editor';
import { useSession } from 'next-auth/react';

interface StationProps {
  planetId: string;
  station: IDBStation;
  planetType: PlanetType;
}

export function Station({ planetId, station, planetType }: StationProps) {
  const { data: session } = useSession();
  const { updateStationProgress, getStationStatus } = useGameStore();
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [output, setOutput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  // const navigationTimer = useRef<number>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // my cleanup function
  useEffect(() => {
    if (shouldNavigate) {
      const timer = window.setTimeout(() => {
        window.location.assign(`/game/planets/${planetId}`);
      }, 2000);
      return () => window.clearTimeout(timer);
    }
  }, [shouldNavigate, planetId]);

  // const navigateToPlanet = useCallback(() => {
  //   router.push(`/game/planets/${planetId}`);
  // }, [router, planetId]);

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

  // const scheduleNavigation = useCallback((delay: number) => {
  //   // Clear any existing timer
  //   if (navigationTimer.current) {
  //     window.clearTimeout(navigationTimer.current);
  //   }
  //   // Set new timer
  //   navigationTimer.current = window.setTimeout(navigateToPlanet, delay);
  // }, [navigateToPlanet]);

  // const navigateWithDelay = useCallback((path: string, delay: number) => {
  //   // Clear any existing navigation timer
  //   if (navigationTimer.current) {
  //     clearTimeout(navigationTimer.current);
  //   }
    
  //   // Set new navigation timer
  //   navigationTimer.current = setTimeout(() => {
  //     router.replace(path);
  //   }, delay);
  // }, [router]);

  const handleCodeSubmit = useCallback(async (code: string) => {
    if (isSubmitting) return;
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
        allPassed
      );

      if (allPassed) {
        setOutput(`🎉 Success! You've completed the challenge and earned ${result.xpAwarded} XP!`);
        setShouldNavigate(true);
        return;
      }

      const failureMessages = formatFailedTests(results);
      
      if (result.stationsLocked) {
        setOutput(
          `Failed attempt (${currentAttempts + 1}/3). Station locked. Returning to station ${result.resetToStation}...`
        );
        // Wait for state to update before navigation
        setShouldNavigate(true);
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
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    planetType,
    station,
    formatFailedTests,
    getStationStatus,
    updateStationProgress
  ]);

  const handleReturn = useCallback(() => {
    window.location.href = `/game/planets/${planetId}`;
  }, [planetId]);

  // Early return to prevent rendering during navigation
  const renderContent = () => {
    if (isSubmitting) {
      return (
        <div className={styles.resultsPanel}>
          <div className={styles.output}>
            {output && (
              <div className={`${styles.outputDefault} ${
                output.includes('Success') 
                  ? styles.outputSuccess
                  : output.includes('Failed attempt') 
                    ? styles.outputError
                    : ''
              }`}>
                {output}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className={styles.instructionsPanel}>
          <div className="npc-dialog">
            <div className="npc-avatar">
              <span className="text-2xl">🤖</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{station.name}</h1>
            <p className="text-gray-300">{station.description}</p>
          </div>
  
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Challenge</h2>
            <div className="text-gray-300">
              {station.challenge.instructions}
            </div>
          </div>
  
          {station.challenge.testCases.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Test Cases</h3>
              <div className="space-y-4">
                {station.challenge.testCases.map((test, index) => (
                  <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="font-mono text-sm">Input: {JSON.stringify(test.input)}</div>
                    <div className="font-mono text-sm">Expected: {JSON.stringify(test.expectedOutput)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
  
        <div className={styles.editorPanel}>
          <div className={styles.editorContainer}>
            <div className={styles.editorWrapper}>
              <CodeEditor
                initialCode={station.challenge.initialCode}
                height={"100%"}
                defaultLanguage={language}
                defaultValue={CODE_SNIPPETS[language]}
                onLanguageChange={handleLanguageChange}
                onCodeSubmit={handleCodeSubmit}
                stationId={station.stationId} 
                userEmail={session?.user?.email}
              />
            </div>
          </div>
  
          {(output || logs.length > 0) && (
            <div className={styles.resultsPanel}>
              <div className={styles.output}>
                {output && (
                  <div
                    className={`${styles.outputDefault} ${
                      output.includes('Success') 
                        ? styles.outputSuccess
                        : output.includes('Failed attempt') 
                          ? styles.outputError
                          : ''
                    }`}
                  >
                    {output}
                  </div>
                )}
                {logs.length > 0 && (
                  <div className={styles.logs}>
                    {logs.map((log, index) => (
                      <pre key={index} className={styles.logLine}>
                        {log}
                      </pre>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
  
          {/* Controls */}
          <div className="flex justify-between items-center gap-4 mt-4 px-4">
            <button
              onClick={handleReturn}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-mono"
            >
              Return to Planet
            </button>
          </div>
        </div>
      </>
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {renderContent()}
      </div>
    </div>
  );
}