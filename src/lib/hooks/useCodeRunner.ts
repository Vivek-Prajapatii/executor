import { useCallback } from "react";
import { useCurrentContext } from "@/lib/common/ContextProvider";

export const useCodeRunner = () => {
  const { code, setOutput, editorRef, getNextInput, resetInput } =
    useCurrentContext();

  // Mock require function
  const mockRequire = (moduleName: string) => {
    // Map of allowed modules and their browser-compatible versions
    const modules: Record<string, unknown> = {
      fs: {
        readFileSync: () => {
          throw new Error("fs module is not available in browser");
        },
      },
      path: {
        join: (...args: string[]) => args.join("/"),
        dirname: (path: string) =>
          path.split("/").slice(0, -1).join("/") || ".",
        basename: (path: string) => path.split("/").pop() || "",
      },
      util: {
        inspect: (obj: unknown) => JSON.stringify(obj, null, 2),
        format: (format: string, ...args: unknown[]) => {
          return format.replace(/%[sdj%]/g, (x) => {
            if (x === "%%") return "%";
            const arg = args.shift();
            return String(arg);
          });
        },
      },
      crypto: {
        randomBytes: (size: number) =>
          window.crypto.getRandomValues(new Uint8Array(size)),
        randomInt: (min: number, max: number) =>
          Math.floor(Math.random() * (max - min + 1)) + min,
      },
      os: {
        platform: () => "browser",
        arch: () => "browser",
        homedir: () => "/home/user",
        tmpdir: () => "/tmp",
      },
      url: {
        parse: (urlString: string) => new URL(urlString, "http://example.com"),
      },
      querystring: {
        parse: (str: string) => {
          return str.split("&").reduce((acc: Record<string, string>, pair) => {
            const [key, value] = pair.split("=");
            if (key) {
              acc[decodeURIComponent(key)] = decodeURIComponent(value || "");
            }
            return acc;
          }, {});
        },
        stringify: (obj: Record<string, string>) => {
          return Object.entries(obj)
            .map(
              ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join("&");
        },
      },
    };

    if (moduleName in modules) {
      return modules[moduleName];
    }
    throw new Error(`Cannot find module '${moduleName}'`);
  };

  // Mock process object
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mockProcess: unknown = {
    env: {
      NODE_ENV: "development",
      ...(typeof process !== "undefined" ? process.env : {}),
    },
    argv: [],
    cwd: () => "/",
    exit: (code?: number) => {
      throw new Error(`Process exited with code ${code || 0}`);
    },
    nextTick: (callback: (...args: unknown[]) => void, ...args: unknown[]) => {
      setTimeout(() => callback(...args), 0);
    },
    version: "v16.0.0",
    versions: {
      node: "16.0.0",
      v8: "9.0.0",
      uv: "1.0.0",
      zlib: "1.0.0",
      brotli: "1.0.0",
      ares: "1.0.0",
      modules: "93",
      nghttp2: "1.0.0",
      napi: "8",
    },
    platform: "browser",
    arch: "x64",
    pid: 1,
    ppid: 0,
    hrtime: () => [
      Math.floor(performance.now() / 1000),
      (performance.now() % 1000) * 1e6,
    ],
  };

  const runCode = useCallback(async () => {
    try {
      resetInput();
      const currentCode = editorRef.current?.value || code;
      const logs: string[] = [];
      const originalConsoleLog = console.log;

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

      // Execute the user's code with require and other globals
      const func = new Function(
        "require",
        "process",
        "readline",
        "console",
        `
        // Make globals available
        const window = this;
        window.require = require;
        window.process = process;
        window.console = console;
        window.module = { exports: {} };
        window.exports = window.module.exports;
        
        // Wrap in try-catch to handle runtime errors
        try {
          // Use with statement to catch undefined variables
          with (window) {
            // Use eval to execute in the same scope
            const result = (function() {
              ${currentCode}
            })();
            
            // If the code doesn't return anything but has console output,
            // we'll see that in the logs
            return { success: true, returnValue: result };
          }
        } catch (err) {
          return { 
            success: false, 
            error: err instanceof Error ? err : String(err) 
          };
        }
      `
      );

      const result = await func(mockRequire, mockProcess, readline, console);

      // Restore original console.log
      console.log = originalConsoleLog;

      let output = "";

      if (logs.length > 0) {
        output += logs.join("\n") + "\n\n";
      }

      if (result?.success) {
        // Only append return value if it's not undefined
        if (result.returnValue !== undefined) {
          output += JSON.stringify(result.returnValue, null, 2);
        }
      } else if (result) {
        // Handle errors with full error details
        if (result.error instanceof Error) {
          output += `${result.error.name}: ${result.error.message}`;
        } else {
          output += String(result.error);
        }
      }

      setOutput(output);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error : "An unknown error occurred";
      setOutput(String(errorMessage));
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [code, editorRef, getNextInput, mockProcess, resetInput, setOutput]);

  return {
    runCode,
  };
};
