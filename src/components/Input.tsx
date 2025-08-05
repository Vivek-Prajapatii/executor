import React from "react";
import styles from "@/styles/components/Input.module.scss";

export const Input = () => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Store or use the value as needed
  };

  return (
    <div className={styles.input}>
      <h3>STDIN : </h3>
      <div>
        <input
          className={styles.inputBox}
          id="inputBox"
          type="text"
          placeholder="Input for the program (optional)"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};
