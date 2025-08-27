"use client";
import React, { use, useEffect } from "react";
import { useResizablePanes } from "@/lib/hooks/useResizablePanes";
import { Editor } from "@/components/Editor";
import { Resizer } from "@/components/Resizer";
import styles from "@/styles/app/page.module.scss";
import ToggleOutput from "@/components/ToggleOutput";
import { useCurrentContext } from "@/lib/common/ContextProvider";
import { readCodeSnippet } from "@/lib/common/firebase";

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
  const resolvedParams = React.use(params);
  const id = resolvedParams?.id;

  useEffect(() => {
    const fetchCode = async () => {
      try {
        console.log(id);
        setUuid(id);
        const snippet = await readCodeSnippet(id);
        console.log(snippet);
        if (snippet) {
          setCode(snippet);
        }
      } catch (error) {
        console.error("Error fetching code snippet:", error);
      }
    };

    fetchCode();
  }, [id, setCode, setUuid]);

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
