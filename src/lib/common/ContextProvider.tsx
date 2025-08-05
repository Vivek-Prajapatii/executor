"use client";
import React, { useContext, useState, ReactNode, createContext } from "react";

export interface CurrentContextType {
  code: string;
  setCode: (code: string) => void;
  output: string;
  setOutput: (output: string) => void;
}

const CurrentContext = createContext<CurrentContextType | undefined>(undefined);

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");


  console.log(code);
  return (
    <CurrentContext.Provider
      value={{code, setCode, output, setOutput }}
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
