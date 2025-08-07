"use client";
import React from "react";
import { useCodeRunner } from "@/lib/hooks/useCodeRunner";
import { useFileDownload } from "@/lib/hooks/useFileDownload";
import styles from "@/styles/components/Header.module.scss";
import { FaJsSquare, FaFileDownload } from "react-icons/fa";

const Header = () => {
  const { runCode } = useCodeRunner();
  const { downloadFile } = useFileDownload();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.title}>
          <FaJsSquare size={35} color="yellow" />
          <span className={styles.titleText}>Code</span>
        </span>

        <div className={styles.iconContainer}>
          <div
            onClick={runCode}
            className={styles.runButton}
            title="Run Code (Ctrl+Enter)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.icon}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Run
          </div>
          <FaFileDownload
            size={25}
            color="white"
            title="Download code as file"
            onClick={downloadFile}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
