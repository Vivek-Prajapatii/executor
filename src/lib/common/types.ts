export interface CurrentContextType {
  code: string;
  setCode: (code: string) => void;
  output: string | Error;
  setOutput: (output: string | Error) => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;
  stdInput: string;
  setStdInput: (stdInput: string) => void;
  getNextInput: () => string | null;
  resetInput: () => void;
  isClearPadClicked: boolean;
  setIsClearPadClicked: (isPad: boolean) => void;
}


export type ScratchPadProps = {
  clearTrigger?: number; // increment this value to trigger clear from parent
  onSaved?: (dataUrl: string) => void; // optional callback after save
  storageKey?: string; // localStorage key override
  lineWidth?: number;
  strokeStyle?: string;
};