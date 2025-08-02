import React from "react";
import styles from "@/styles/components/Input.module.scss";

interface InputProps {
  code: string;
}

export const Input: React.FC<InputProps> = ({ code }) => {
  return (
    <div className={styles.input}>
      <pre>{code}</pre>
    </div>
  );
};
