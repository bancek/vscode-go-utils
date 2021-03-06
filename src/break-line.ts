"use strict";

import * as vscode from "vscode";

export async function breakLine(argsOnly: boolean) {
  let editor = vscode.window.activeTextEditor!;

  const line = editor.selection.start.line;
  const lineText = editor.document.lineAt(line).text;
  const oldSelection = new vscode.Selection(
    new vscode.Position(line, 0),
    new vscode.Position(line, lineText.length)
  );

  const newText = breakLineText(lineText, argsOnly);

  await editor.edit((editBuilder) => {
    editBuilder.replace(oldSelection, newText);
  });
}

export function breakLineText(text: string, argsOnly: boolean): string {
  // func name(args) {
  // func name(args) res {
  // func name(args) (res) {
  // func (p *receiver) name(args) (res) {
  // name(args) {
  let bracketDepth = 0;
  let topLevelBracketsCount = 0;
  let done = false;

  let oldCharacters = [...text];
  let newCharacters: string[] = [];

  const prefixMatch = text.match(/^(\s+)/);
  const prefix = prefixMatch === null ? "" : prefixMatch[1];
  const isMethod = text.match(/^func \(/);

  const insideReceiver = () => topLevelBracketsCount === 1 && isMethod;

  for (let i = 0; i < oldCharacters.length; i++) {
    const c = oldCharacters[i];

    if (!done && c === "(") {
      if (bracketDepth === 0) {
        topLevelBracketsCount++;
      }
      bracketDepth++;
      newCharacters.push(c);

      if (bracketDepth === 1 && !insideReceiver()) {
        newCharacters.push("\n");
        newCharacters.push("\t");
        newCharacters.push(prefix);
      }
    } else if (!done && c === ")") {
      if (bracketDepth === 1 && !insideReceiver()) {
        newCharacters.push(",");
        newCharacters.push("\n");
        newCharacters.push(prefix);
      }

      newCharacters.push(c);
      bracketDepth--;

      if (bracketDepth === 0 && !insideReceiver() && argsOnly) {
        done = true;
      }
    } else if (!done && c === "," && bracketDepth === 1) {
      newCharacters.push(c);
      newCharacters.push("\n");
      newCharacters.push("\t");
      newCharacters.push(prefix);
      if (oldCharacters[i + 1] === " ") {
        i++;
      }
    } else {
      newCharacters.push(c);
    }
  }

  return newCharacters.join("");
}
