"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "@/styles/components/Editor.module.scss";
import { useCurrentContext } from "@/lib/common/ContextProvider";

export const Editor = () => {
  const { editorRef, code, setCode } = useCurrentContext();
  const [lineCount, setLineCount] = useState(1);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLineCount((code.match(/\n/g)?.length ?? 0) + 1);
  }, [code]);

  const handleScroll = useCallback(() => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const target = e.currentTarget;
        const { selectionStart, selectionEnd } = target;
        const newCode =
          code.substring(0, selectionStart) +
          "  " +
          code.substring(selectionEnd);
        setCode(newCode);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd = selectionStart + 2;
          }
        }, 0);
      }
    },
    [code, setCode]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(e.target.value);
    },
    [setCode]
  );

  useEffect(() => {
    if (textareaRef.current) {
      editorRef.current = textareaRef.current;
    }
  }, [editorRef]);

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
        ref={textareaRef}
        className={styles.textarea}
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        spellCheck={false}
      />
    </div>
  );
};
