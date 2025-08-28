"use client";
import React, { useState } from "react";
import { useCodeRunner } from "@/lib/hooks/useCodeRunner";
import { useFileDownload } from "@/lib/hooks/useFileDownload";
import styles from "@/styles/components/Header.module.scss";
import { FaJsSquare, FaFileDownload, FaShareAlt } from "react-icons/fa";
import { SharePopup } from "./SharePopup";

const Header = () => {
  const { runCode } = useCodeRunner();
  const { downloadFile } = useFileDownload();
  const [showPopup, setShowPopup] = useState(false);

  const handleShare = async () => {
    setShowPopup(true);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.title}>
          <FaJsSquare size={35} color="yellow" />
          <span className={styles.titleText}>kode</span>
        </span>

        <div onClick={runCode} className={styles.runButton} title="Run Code">
          Run
        </div>
        <div className={styles.iconContainer}>
          <FaFileDownload
            size={25}
            color="white"
            title="Download code as file"
            onClick={downloadFile}
            style={{ cursor: "pointer" }}
          />
          <FaShareAlt
            size={25}
            color="white"
            title="Share code"
            onClick={handleShare}
            style={{ cursor: "pointer" }}
          />
          <SharePopup
            open={showPopup}
            onClose={() => setShowPopup(false)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
