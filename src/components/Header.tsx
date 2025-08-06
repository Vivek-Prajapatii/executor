"use client";
import React from "react";
import { useCurrentContext } from "@/lib/common/ContextProvider";
import styles from "@/styles/components/Header.module.scss";

const Header = () => {
  const { code, setOutput, editorRef, getNextInput, resetInput } =
    useCurrentContext();

  const handleRunCode = () => {
    try {
      resetInput(); // Reset input pointer to start
      const currentCode = editorRef.current?.value || code;
      const logs: string[] = [];
      const originalConsoleLog = console.log;

      // Mock require function
      const mockRequire = (moduleName: string) => {
        // Map of allowed modules and their browser-compatible versions
        const modules: Record<string, unknown> = {
          fs: {
            readFileSync: () => {
              throw new Error("fs module is not available in browser");
            },
            // Add other fs methods as needed
          },
          path: {
            join: (...args: string[]) => args.join("/"),
            // Add other path methods as needed
          },
          http: {
            // Mock http methods
          },
          https: {
            // Mock https methods
          },
          util: {
            // Mock util methods
            inspect: (obj: unknown) => JSON.stringify(obj, null, 2),
          },
          crypto: {
            // Mock crypto methods
            randomBytes: (size: number) =>
              new Uint8Array(size).map(() => Math.floor(Math.random() * 256)),
          },
          os: {
            platform: () => "browser",
            // Add other os methods as needed
          },
        };

        if (moduleName in modules) {
          return modules[moduleName];
        }
        throw new Error(`Cannot find module '${moduleName}'`);
      };

      // Override console.log to capture output
      console.log = (...args) => {
        const logString = args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
          )
          .join(" ");
        logs.push(logString);
        originalConsoleLog(...args);
      };

      // Create a mock readline interface
      const readline = {
        createInterface: () => ({
          question: (query: string, callback: (answer: string) => void) => {
            const input = getNextInput();
            if (input !== null) {
              console.log(query); // Log the question
              callback(input);
            } else {
              console.log(query + "\nNo more input available");
              callback("");
            }
          },
          close: () => {},
        }),
      };

      // Create a mock process object
      const process = {
        env: { NODE_ENV: "development" },
        argv: [],
        cwd: () => "/",
        exit: (code?: number) => {
          throw new Error(`Process exited with code ${code || 0}`);
        },
        // Add other process methods as needed
      };

      // Execute the user's code with require and other globals
      const func = new Function(
        "require",
        "process",
        "readline",
        "console",
        `
        // Make require available globally
        const global = this;
        global.require = require;
        global.process = process;
        global.console = console;
        
        // Wrap in try-catch to handle errors
        try {
          ${currentCode}
          return { success: true, returnValue: undefined };
        } catch (err) {
          return { 
            success: false, 
            error: err instanceof Error ? err : String(err) 
          };
        }
      `
      );

      const result = func(mockRequire, process, readline, console);

      // Restore original console.log
      console.log = originalConsoleLog;

      let output = "";

      if (logs.length > 0) {
        output += logs.join("\n") + "\n\n";
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
      const errorMessage =
        error instanceof Error ? error : "An unknown error occurred";
      setOutput(errorMessage);
      console.error(errorMessage);
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
