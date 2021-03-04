import * as vscode from "vscode";

const KEY = "vstodoToken";
export class TokenManager {
  static globalState: vscode.Memento;

  static setToken(token: string): Thenable<void> {
    return this.globalState.update(KEY, token);
  }
  static getToken(): string | undefined {
    return this.globalState.get(KEY);
  }
}
