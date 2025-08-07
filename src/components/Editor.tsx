"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "@/styles/components/Editor.module.scss";
import { useCurrentContext } from "@/lib/common/ContextProvider";

export const Editor = () => {
  const { editorRef } = useCurrentContext();
  const { code, setCode } = useCurrentContext();
  const [lineCount, setLineCount] = useState(1);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update line count when code changes
  useEffect(() => {
    const lines = code.split("\n");
    setLineCount(lines.length || 1);
  }, [code]);

  // Sync scroll between line numbers and textarea
  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const { selectionStart, selectionEnd } = target;
      const newCode =
        code.substring(0, selectionStart) + "  " + code.substring(selectionEnd);
      setCode(newCode);

      // Set caret position after state update
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd =
            selectionStart + 2;
        }
      }, 0);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.lineNumbers} ref={lineNumbersRef}>
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className={styles.lineNumber}>
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={(el) => {
          if (el) {
            editorRef.current = el;
            textareaRef.current = el;
          }
        }}
        className={styles.textarea}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        spellCheck={false}
      />
    </div>
  );
};
