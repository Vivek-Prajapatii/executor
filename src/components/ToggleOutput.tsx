"use client";
import { useState } from "react";
import styles from "@/styles/components/ToggleOutput.module.scss";
import { Output } from "@/components/Output";
import ScratchPad from "@/components/ScratchPad";
import { GrClear } from "react-icons/gr";
import { useCurrentContext } from "@/lib/common/ContextProvider";

type ViewType = "output" | "scratchpad";

const ToggleOutput = () => {
  const [activeView, setActiveView] = useState<ViewType>("output");
  const { setIsClearPadClicked } = useCurrentContext();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${
              activeView === "output" ? styles.active : ""
            }`}
            onClick={() => setActiveView("output")}
          >
            Output
          </button>
          <button
            className={`${styles.button} ${
              activeView === "scratchpad" ? styles.active : ""
            }`}
            onClick={() => setActiveView("scratchpad")}
          >
            Scratch Pad
          </button>
        </div>
        {activeView === "scratchpad" && (
          <GrClear color="white" onClick={() => setIsClearPadClicked(true)} title={ "Clear Scratch Pad"} style={{ cursor: "pointer", marginRight: "15px" }} />
        )}
      </div>
      <div className={styles.content}>
        {activeView === "output" ? <Output /> : <ScratchPad />}
      </div>
    </div>
  );
};

export default ToggleOutput;