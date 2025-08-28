import React from "react";
import styles from "@/styles/components/SharePopup.module.scss";

type SharePopupProps = {
  onClose: () => void;
  open: boolean;
};

export const SharePopup: React.FC<SharePopupProps> = ({
  onClose,
  open,
}) => {

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window?.location?.href ?? "");
      console.log("Copied to clipboard");
      onClose();
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Share this code</h3>
        <input value={window?.location?.href ?? ""} readOnly className={styles.input} />
        <div className={styles.buttonRow}>
          <button onClick={handleCopy} className={styles.copyButton}>
            Copy
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
