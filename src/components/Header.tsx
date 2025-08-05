'use client'
import React from 'react';
import { useCurrentContext } from '@/lib/common/ContextProvider';
import styles from '@/styles/components/Header.module.scss';

const Header = () => {
  const { code, setOutput } = useCurrentContext();

  const handleRunCode = () => {
    try {
      // Create a new function that overrides console.log to capture output
      const logs: string[] = [];
      const originalConsoleLog = console.log;
      
      // Override console.log to capture output
      console.log = (...args) => {
        const logString = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        logs.push(logString);
        originalConsoleLog(...args);
      };
      
      // Execute the user's code
      const func = new Function(`
        try {
          ${code}
          return { success: true, returnValue: undefined };
        } catch (err) {
          return { 
            success: false, 
            error: err instanceof Error ? err.message : String(err) 
          };
        }
      `);
      
      const result = func();
      
      console.log = originalConsoleLog;      
      let output = '';
      
      if (logs.length > 0) {
        output += logs.join('\n') + '\n\n';
      }
      if (result.success) {
        if (result.returnValue !== undefined) {
          output += JSON.stringify(result.returnValue, null, 2);
        }
      } else {
        output += result.error;
      }
      
      setOutput(output);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setOutput(errorMessage);
      console.error(error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Executor</h1>
        <div
          onClick={handleRunCode}
          className={styles.runButton}
          title="Run Code (Ctrl+Enter)"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
          </svg>
          Run
        </div>
      </div>
    </header>
  );
};

export default Header;
