"use client";
import React, { use, useEffect } from "react";
import { useResizablePanes } from "@/lib/hooks/useResizablePanes";
import { Editor } from "@/components/Editor";
import { Resizer } from "@/components/Resizer";
import styles from "@/styles/app/page.module.scss";
import ToggleOutput from "@/components/ToggleOutput";
import { useCurrentContext } from "@/lib/common/ContextProvider";
import { subscribeToSnippet } from "@/lib/common/snippetService";

type ParamsType = {
  id: string;
};

export default function CompilerPage({
  params,
}: {
  params: Promise<ParamsType>;
}) {
  // this is being used to resize the output and editor window
  const { editorWidth, editorRef, inputOutputRef, startHorizontalDrag } =
    useResizablePanes();
  const { setCode, setUuid } = useCurrentContext();
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  useEffect(() => {
    if (!id) return;
    setUuid(id);
    const unsubscribe = subscribeToSnippet(id, (data) => {
      if (data?.code) {
        setCode(data.code);
      } else {
        setCode("//Type your things here..."); // or handle no code case
      }
    });

    return () => unsubscribe(); // cleanup listener on unmount or id change
  }, [id, setCode, setUuid]);

  return (
    <section className={`${styles.editorWrapper} ${styles.mobileLayout}`}>
      <div
        className={styles.editorContainer}
        ref={editorRef}
        style={{ flex: `${editorWidth} 1 0%` }}
      >
        <Editor />
      </div>

      <Resizer
        orientation="horizontal"
        onMouseDown={startHorizontalDrag}
        // className={styles.resizer}
      />

      <div
        ref={inputOutputRef}
        className={`${styles.inputOutput} ${styles.outputContainer}`}
        style={{ flex: `${100 - editorWidth} 1 0%` }}
      >
        <ToggleOutput />
      </div>
    </section>
  );
}
