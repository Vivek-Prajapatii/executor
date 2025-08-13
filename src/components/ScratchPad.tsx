"use client";
import { useCurrentContext } from "@/lib/common/ContextProvider";
import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "@/styles/components/ScratchPad.module.scss";
import { ScratchPadProps } from "@/lib/common/types";

const ScratchPad: React.FC<ScratchPadProps> = ({
  clearTrigger,
  onSaved,
  storageKey = "scratchPadData",
  lineWidth = 2,
  strokeStyle = "#222",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const saveTimeoutRef = useRef<number>(0);
  const mountedRef = useRef(true);

  // If using context instead of prop clearTrigger:
  const { isClearPadClicked, setIsClearPadClicked } = useCurrentContext();

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const getPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e && e.touches.length > 0) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      const me = e as React.MouseEvent<HTMLCanvasElement>;
      return {
        x: me.nativeEvent.offsetX,
        y: me.nativeEvent.offsetY,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if ("touches" in e) e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    if ("touches" in e) e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const saveCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      try {
        const dataUrl = canvas.toDataURL("image/png");
        localStorage.setItem(storageKey, dataUrl);
        onSaved?.(dataUrl);
      } catch (err) {
        console.error("Failed to save scratch pad:", err);
      }
    },
    [onSaved, storageKey]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    if (canvasRef.current) {
      saveCanvas(canvasRef.current);
    }
  }, [saveCanvas]);

  // Ensure drawing stops even if mouse/touch ends outside canvas
  useEffect(() => {
    const up = () => setIsDrawing(false);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  // Debounced save after drawing stops
  useEffect(() => {
    if (!isDrawing && canvasRef.current) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = window.setTimeout(() => {
        if (mountedRef.current && canvasRef.current) {
          saveCanvas(canvasRef.current);
        }
      }, 400);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [isDrawing, saveCanvas]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        saveCanvas(canvasRef.current);
      }
    };
  }, [saveCanvas]);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    if (isClearPadClicked) {
      handleClear();
      setIsClearPadClicked(false);
    }
  }, [isClearPadClicked, setIsClearPadClicked, handleClear]);

  // Prop-based clear trigger (increment value to trigger clear)
  useEffect(() => {
    if (clearTrigger !== undefined) {
      handleClear();
    }
  }, [clearTrigger, handleClear]);

  // Initialize: set size, drawing style, and restore from localStorage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size to fit parent container
    const parent = canvas.parentElement ?? undefined;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = Math.max(200, parent.clientHeight); // ensure usable height
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeStyle;

    // Restore saved image
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = saved;
    }

    // Optional: preserve bitmap on container resize
    const ro = parent
      ? new ResizeObserver(() => {
          const prev = document.createElement("canvas");
          prev.width = canvas.width;
          prev.height = canvas.height;
          const pctx = prev.getContext("2d");
          if (pctx) pctx.drawImage(canvas, 0, 0);

          canvas.width = parent.clientWidth;
          canvas.height = Math.max(200, parent.clientHeight);

          ctx.lineWidth = lineWidth;
          ctx.lineCap = "round";
          ctx.strokeStyle = strokeStyle;

          if (pctx) ctx.drawImage(prev, 0, 0);
        })
      : null;

    if (ro && parent) ro.observe(parent);
    return () => ro?.disconnect();
  }, [lineWidth, strokeStyle, storageKey]);

  return (
    <div className={styles.scratchPad}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};

export default ScratchPad;
