"use client";
import React, { useState } from "react";
import { useResizablePanes } from "@/lib/hooks/useResizablePanes";
import { Editor } from "@/components/Editor";
import { Input } from "@/components/Input";
import { Output } from "@/components/Output";
import { Resizer } from "@/components/Resizer";
import styles from "@/styles/app/compiler/Compiler.module.scss";

export default function CompilerPage() {
  const [code, setCode] = useState("console.log('Hello world');");
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

  function handleRun() {
    try {
      // NEVER use eval in production. Replace with proper safe execution in prod.
      // eslint-disable-next-line no-eval
      const result = eval(code);
      setOutput(result === undefined ? "No output" : String(result));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setOutput(err.toString());
    }
  }

  return (
    <section className={styles.editorWrapper}>
      <div ref={editorRef} style={{ flex: `${editorWidth} 1 0%` }}>
        <Editor code={code} setCode={setCode} />
      </div>

      <Resizer orientation="horizontal" onMouseDown={startHorizontalDrag} />

      <div
        ref={inputOutputRef}
        className={styles.inputOutput}
        style={{ flex: `${100 - editorWidth} 1 0%` }}
      >
        <div ref={inputRef} style={{ flex: `${inputHeight} 1 0%` }}>
          <Input code={code} />
        </div>

        <Resizer orientation="vertical" onMouseDown={startVerticalDrag} />

        <div style={{ flex: `${100 - inputHeight} 1 0%` }}>
          <Output output={output} />
        </div>
      </div>
    </section>
  );
}
