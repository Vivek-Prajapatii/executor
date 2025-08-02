"use client";
import React, { useState } from "react";
import { useResizablePanes } from "@/lib/hooks/useResizablePanes";
import { Editor } from "@/components/Editor";
import { Input } from "@/components/Input";
import { Output } from "@/components/Output";
import { Resizer } from "@/components/Resizer";
import styles from "@/styles/app/compiler/Compiler.module.scss";

export default function CompilerPage() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const {
    editorWidth,
    inputHeight,
    editorRef,
    inputOutputRef,
    inputRef,
    startHorizontalDrag,
    startVerticalDrag,
  } = useResizablePanes();

  return (
    <section className={styles.editorWrapper}>
      <div ref={editorRef} style={{ flex: `${editorWidth} 1 0%` }}>
        <Editor code={code || ''} setCode={setCode} />
      </div>

      <Resizer orientation="horizontal" onMouseDown={startHorizontalDrag} />

      <div
        ref={inputOutputRef}
        className={styles.inputOutput}
        style={{ flex: `${100 - editorWidth} 1 0%` }}
      >
        <div ref={inputRef} style={{ flex: `${inputHeight} 1 0%` }}>
          <Input code={code || ''} />
        </div>

        <Resizer orientation="vertical" onMouseDown={startVerticalDrag} />

        <div style={{ flex: `${100 - inputHeight} 1 0%` }}>
          <Output output={output} />
        </div>
      </div>
    </section>
  );
}
