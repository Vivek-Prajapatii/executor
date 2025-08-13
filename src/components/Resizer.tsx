import React from "react";
import styles from "@/styles/components/Resizer.module.scss";

interface ResizerProps {
  orientation: "horizontal" | "vertical";
  onMouseDown: (e: React.MouseEvent) => void;
}

export const Resizer: React.FC<ResizerProps> = ({
  orientation,
  onMouseDown,
}) => {
  return (
    <div
      className={`${styles.resizer} ${
        orientation === "horizontal" ? styles.horizontal : styles.vertical
      }`}
      onMouseDown={onMouseDown}
    />
  );
};
