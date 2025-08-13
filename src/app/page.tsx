"use client";
import React from "react";
import { useResizablePanes } from "@/lib/hooks/useResizablePanes";
import { Editor } from "@/components/Editor";
import { Input } from "@/components/Input";
import { Resizer } from "@/components/Resizer";
import styles from "@/styles/app/page.module.scss";
import ToggleOutput from "@/components/ToggleOutput";

export default function CompilerPage() {
  const {
    editorWidth,
    editorRef,
    inputOutputRef,
    startHorizontalDrag,
  } = useResizablePanes();

  return (
    <section className={styles.editorWrapper}>
      <div ref={editorRef} style={{ flex: `${editorWidth} 1 0%` }}>
        <Editor />
      </div>

      <Resizer orientation="horizontal" onMouseDown={startHorizontalDrag} />

      <div
        ref={inputOutputRef}
        className={styles.inputOutput}
        style={{ flex: `${100 - editorWidth} 1 0%` }}
      >
        <ToggleOutput />
      </div>
    </section>
  );
}
