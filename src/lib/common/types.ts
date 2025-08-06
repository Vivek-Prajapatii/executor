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
}
