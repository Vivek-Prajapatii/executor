import React from "react";
import styles from "@/styles/components/Input.module.scss";
import { useCurrentContext } from "@/lib/common/ContextProvider";

export const Input = () => {
  const { stdInput, setStdInput } = useCurrentContext();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStdInput(value);
  };

  return (
    <div className={styles.input}>
      <h3>STDIN : </h3>
      <div>
        <input
          className={styles.inputBox}
          id="inputBox"
          type="text"
          value={stdInput}
          placeholder="Input for the program (optional)"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};
