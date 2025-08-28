"use client";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import styles from "@/styles/components/Editor.module.scss";
import { useCurrentContext } from "@/lib/common/ContextProvider";
import { debounce } from "@/lib/common/utils";
import { saveSnippet } from "@/lib/common/snippetService";

export const Editor = () => {
  const { editorRef, code, setCode, uuid } = useCurrentContext();
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

  // Debounce the save function so it triggers after 500ms of inactivity
  const debouncedSave = useMemo(
    () =>
      debounce(async (value: string) => {
        await saveSnippet(uuid, value, "");
        localStorage.setItem("code", value);
      }, 5000),
    [uuid]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setCode(value);
      debouncedSave(value);
    },
    [setCode, debouncedSave]
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
