import { useState, useRef, useEffect } from "react";

interface UseResizablePanesProps {
  initialEditorWidth?: number;
  initialInputHeight?: number;
}

interface UseResizablePanesReturn {
  editorWidth: number;
  setEditorWidth: React.Dispatch<React.SetStateAction<number>>;
  inputHeight: number;
  setInputHeight: React.Dispatch<React.SetStateAction<number>>;
  editorRef: React.RefObject<HTMLDivElement | null>;
  inputOutputRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLDivElement | null>;
  isDraggingHorizontal: React.MutableRefObject<boolean>;
  isDraggingVertical: React.MutableRefObject<boolean>;
  startHorizontalDrag: (e: React.MouseEvent) => void;
  startVerticalDrag: (e: React.MouseEvent) => void;
}

export const useResizablePanes = ({
  initialEditorWidth = 50,
  initialInputHeight = 50,
}: UseResizablePanesProps = {}): UseResizablePanesReturn => {
  const [editorWidth, setEditorWidth] = useState(initialEditorWidth);
  const [inputHeight, setInputHeight] = useState(initialInputHeight);

  const editorRef = useRef<HTMLDivElement>(null);
  const inputOutputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const isDraggingHorizontal = useRef(false);
  const isDraggingVertical = useRef(false);

  // Horizontal resizing (between editor and input/output)
  const startHorizontalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingHorizontal.current = true;

    const startX = e.clientX;
    const startWidth = editorWidth;

    const doDrag = (moveEvent: MouseEvent) => {
      if (!editorRef.current || !inputOutputRef.current) return;

      const containerWidth = editorRef.current.parentElement?.clientWidth || 1;
      const diff = moveEvent.clientX - startX;
      const newWidth = startWidth + (diff / containerWidth) * 100;

      // Keep within reasonable bounds
      if (newWidth > 20 && newWidth < 80) {
        setEditorWidth(newWidth);
      }
    };

    const stopDrag = () => {
      isDraggingHorizontal.current = false;
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  // Vertical resizing (between input and output)
  const startVerticalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVertical.current = true;

    const startY = e.clientY;
    const startHeight = inputHeight;

    const doDrag = (moveEvent: MouseEvent) => {
      if (!inputRef.current) return;

      const containerHeight = inputRef.current.parentElement?.clientHeight || 1;
      const diff = moveEvent.clientY - startY;
      const newHeight = startHeight + (diff / containerHeight) * 100;

      // Keep within reasonable bounds
      if (newHeight > 20 && newHeight < 80) {
        setInputHeight(newHeight);
      }
    };

    const stopDrag = () => {
      isDraggingVertical.current = false;
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Component will re-render with new dimensions
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    editorWidth,
    setEditorWidth,
    inputHeight,
    setInputHeight,
    editorRef,
    inputOutputRef,
    inputRef,
    isDraggingHorizontal,
    isDraggingVertical,
    startHorizontalDrag,
    startVerticalDrag,
  };
};
