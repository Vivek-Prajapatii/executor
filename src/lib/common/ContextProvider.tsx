"use client";
import React, {
  useContext,
  useState,
  ReactNode,
  createContext,
  useRef,
  useCallback,
} from "react";
import { CurrentContextType } from "./types";

const CurrentContext = createContext<CurrentContextType | undefined>(undefined);

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string | Error>("Your Output will be printed here...\n\nUse Scratch Pad for rough work");
  const [stdInput, setStdInput] = useState<string>("");
  const inputLines = useRef<string[]>([]);
  const currentInputIndex = useRef<number>(0);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const [isClearPadClicked, setIsClearPadClicked] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");

  // Update input lines when stdInput changes
  React.useEffect(() => {
    inputLines.current = stdInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    currentInputIndex.current = 0;
  }, [stdInput]);

  const getNextInput = useCallback((): string | null => {
    if (currentInputIndex.current < inputLines.current.length) {
      return inputLines.current[currentInputIndex.current++];
    }
    return null;
  }, []);

  const resetInput = useCallback(() => {
    currentInputIndex.current = 0;
  }, []);

  return (
    <CurrentContext.Provider
      value={{
        uuid,
        setUuid,
        code,
        setCode,
        output,
        setOutput,
        editorRef,
        stdInput,
        setStdInput,
        getNextInput,
        resetInput,
        isClearPadClicked,
        setIsClearPadClicked,
      }}
    >
      {children}
    </CurrentContext.Provider>
  );
};

// Custom hook to consume the context safely
const useCurrentContext = (): CurrentContextType => {
  const context = useContext(CurrentContext);
  if (!context) {
    throw new Error("useCurrentContext must be used within a ContextProvider");
  }
  return context;
};

export { useCurrentContext, ContextProvider, CurrentContext };
