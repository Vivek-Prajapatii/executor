import React from "react";
import styles from "@/styles/components/Output.module.scss";
import { useCurrentContext } from "@/lib/common/ContextProvider";

export const Output = () => {
  const { output } = useCurrentContext();

  return (
    <div className={styles.output}>
      {/* <h3>Output : </h3> */}
      <pre>{`${output}`}</pre>
    </div>
  );
};
