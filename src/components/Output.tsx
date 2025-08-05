import React, { useContext } from "react";
import styles from "@/styles/components/Output.module.scss";
import { CurrentContext } from "@/lib/common/ContextProvider";

export const Output = () => {
  const context = useContext(CurrentContext);
  
  if (!context) {
    throw new Error("context must be used within a ContextProvider");
  }
  const { output } = context;
  return (
    <div className={styles.output}>
      <h3>Output : </h3>
      <pre>{output}</pre>
    </div>
  );
};
