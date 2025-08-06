"use client";
import React from "react";
import styles from "@/styles/components/Editor.module.scss";
import { useCurrentContext } from "@/lib/common/ContextProvider";

export const Editor = () => {
  const {editorRef} = useCurrentContext();
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
        if (editorRef.current) {
          editorRef.current.selectionStart =
            editorRef.current.selectionEnd = selectionStart + 2;
        }
      }, 0);
    }
  };


  return (
    <div className={styles.editor}>
      <textarea
        ref={editorRef}
        defaultValue={code} // Use defaultValue instead of value to make it uncontrolled
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
    </div>
  );
};
