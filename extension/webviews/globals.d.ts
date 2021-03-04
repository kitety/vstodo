import * as _vscode from "vscode";
export interface IMessageType {
  type: string;
  value: any;
}
declare global {

  interface Window {
    token: string;
    apiBaseUrl: string;
    vscode: {
      postMessage: (IMessageType) => void;
    };
  }
}
