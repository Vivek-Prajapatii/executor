"use client";
import React, { useRef, useEffect } from "react";
import styles from "@/styles/components/Editor.module.scss";

interface EditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

export const Editor: React.FC<EditorProps> = ({ code, setCode }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const { selectionStart, selectionEnd } = target;
      const newCode =
        code.substring(0, selectionStart) + "  " + code.substring(selectionEnd);
      setCode(newCode);

      // Set caret position after state update
      // Use useEffect to sync value & caret position after DOM update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = selectionStart + 2;
        }
      }, 0);
    }
  };

  return (
    <div className={styles.editor}>
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
    </div>
  );
};
