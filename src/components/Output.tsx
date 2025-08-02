import React from "react";
import styles from "@/styles/components/Output.module.scss";

interface OutputProps {
  output: string;
}

export const Output: React.FC<OutputProps> = ({ output }) => {
  return (
    <div className={styles.output}>
      <pre>{output}</pre>
    </div>
  );
};
