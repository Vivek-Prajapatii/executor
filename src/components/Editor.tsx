"use client";
import React, { useRef, useCallback } from "react";
import styles from "@/styles/components/Editor.module.scss";
import { useCurrentContext } from "@/lib/common/ContextProvider";

export const Editor = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { code, setCode } = useCurrentContext();

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

  const timerRef = useRef<NodeJS.Timeout>(null);

  const debouncedSetCode = useCallback((value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      setCode(value);
    }, 3000); // 3 second debounce
  }, [setCode]);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Update the textarea value immediately for better UX
    if (textareaRef.current) {
      textareaRef.current.value = value;
    }
    debouncedSetCode(value);
  };

  return (
    <div className={styles.editor}>
      <textarea
        ref={textareaRef}
        defaultValue={code} // Use defaultValue instead of value to make it uncontrolled
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
    </div>
  );
};
