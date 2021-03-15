import * as vscode from "vscode";

import { breakLine } from "./break-line";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("go-utils.breakLine", () => {
      breakLine(false);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("go-utils.breakLineArgsOnly", () => {
      breakLine(true);
    })
  );
}

export function deactivate() {}
