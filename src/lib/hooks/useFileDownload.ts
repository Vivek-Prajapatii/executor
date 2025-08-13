import { useCallback } from "react";
import { useCurrentContext } from "@/lib/common/ContextProvider";

export const useFileDownload = () => {
  const { code } = useCurrentContext();

  const downloadFile = useCallback(() => {
    if (!code) return;

    // Create a blob with the code content
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.js";

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code]);

  return { downloadFile };
};
