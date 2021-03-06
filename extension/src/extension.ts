// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SiderProvider";
import { TokenManager } from "./tokenManager";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // token manager
  TokenManager.globalState = context.globalState;
  console.log("token", await TokenManager.getToken());
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  // 添加底部按鈕
  const bottomFooter = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  bottomFooter.text = "$(beaker) Add Todo";
  bottomFooter.command = "vstodo.addTodo";
  bottomFooter.show();

  // 打开侧边栏
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("vstodo-sidebar", sidebarProvider)
  );
  // 注册命令
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.helloWorld", () => {
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.authenticate", () => {
      try {
        authenticate();
      } catch (error) {
        console.log("error: ", error);
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.addTodo", () => {
      const { activeTextEditor } = vscode.window;
      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }
      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );
      if (!text) {
        return;
      }
      sidebarProvider._view?.webview.postMessage({
        type: "new-todo",
        value: text,
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.refresh", () => {
      HelloWorldPanel.kill();
      HelloWorldPanel.createOrShow(context.extensionUri);
      setTimeout(() => {
        // 需要放在回调里面
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "How was your day?",
        "good",
        "bad"
      );
      if (answer === "bad") {
        vscode.window.showInformationMessage("I am sorry to hear that");
      } else {
        console.log("answer: ", answer);
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
