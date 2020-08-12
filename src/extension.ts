import * as vscode from "vscode";

import { breakLine } from "./break-line";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("go-utils.breakLine", () => {
    breakLine();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
