import * as _vscode from "vscode";
export interface IMessageType {
  type: string;
  value: any;
}
declare global {
  interface tsvscode {
    postMessage: (IMessageType) => void;
  }
  interface Window {
    tsvscode: {
      postMessage: (IMessageType) => void;
    };
  }
}
