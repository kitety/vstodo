import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import * as polka from "polka";
import { TokenManager } from "./tokenManager";

export const authenticate = () => {
  const app = polka();
  app.get("/auth/:token", async (req, res) => {
    const { token } = req.params;
    if (!token) {
      return res.end(`<h1>Something went wrong!</h1>`);
    }
    // 设置token
    await TokenManager.setToken(token);
    res.end(`auth was successful,you can close this page now`);
    app.server?.close(() => {
      console.log(`> The server is closing on localhost:3000`);
    });
  });
  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
      return;
    }
    console.log(`> Running on localhost:3000`);
    vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
    );
  });
};
