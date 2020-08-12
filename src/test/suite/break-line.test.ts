import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

import { breakLine } from "../../break-line";

type Range = [[number, number], [number, number]];

interface Case {
  input: string;
  range: Range;
  output: string;
}

const cases: Case[] = [
  {
    input: `func funcName(arg1 type1, arg2 type2, arg3 type3) {
	body
}`,
    range: [
      [0, 0],
      [0, 0],
    ],
    output: `func funcName(
	arg1 type1,
	arg2 type2,
	arg3 type3,
) {
	body
}`,
  },
  {
    input: `func funcName(arg1 type1, arg2 type2, arg3 type3) error {
	body
}`,
    range: [
      [0, 0],
      [0, 0],
    ],
    output: `func funcName(
	arg1 type1,
	arg2 type2,
	arg3 type3,
) error {
	body
}`,
  },
  {
    input: `func funcName(arg1 type1, arg2 type2, arg3 type3) (error) {
	body
}`,
    range: [
      [0, 0],
      [0, 0],
    ],
    output: `func funcName(
	arg1 type1,
	arg2 type2,
	arg3 type3,
) (
	error,
) {
	body
}`,
  },
  {
    input: `func funcName(arg1 func (a1 t1, a2 t2) (tres), arg2 type2, arg3 type3) (func (a1 t1, a2 t2) (tres), error) {
	body
}`,
    range: [
      [0, 0],
      [0, 0],
    ],
    output: `func funcName(
	arg1 func (a1 t1, a2 t2) (tres),
	arg2 type2,
	arg3 type3,
) (
	func (a1 t1, a2 t2) (tres),
	error,
) {
	body
}`,
  },
  {
    input: `func funcName(
	arg1 func (a1 t1, a2 t2) (tres),
	arg2 type2,
	arg3 type3,
) (
	func (a1 t1, a2 t2) (tres),
	error,
) {
	body
}`,
    range: [
      [1, 0],
      [1, 0],
    ],
    output: `func funcName(
	arg1 func (
		a1 t1,
		a2 t2,
	) (
		tres,
	),
	arg2 type2,
	arg3 type3,
) (
	func (a1 t1, a2 t2) (tres),
	error,
) {
	body
}`,
  },
  {
    input: `func funcName(
	arg1 func (a1 t1, a2 t2) (tres),
	arg2 type2,
	arg3 type3,
) (
	func (a1 t1, a2 t2) (tres),
	error,
) {
	body
}`,
    range: [
      [5, 0],
      [5, 1],
    ],
    output: `func funcName(
	arg1 func (a1 t1, a2 t2) (tres),
	arg2 type2,
	arg3 type3,
) (
	func (
		a1 t1,
		a2 t2,
	) (
		tres,
	),
	error,
) {
	body
}`,
  },
  {
    input: `func (p *receiver) funcName(arg1 type1, arg2 type2, arg3 type3) {
	body
}`,
    range: [
      [0, 0],
      [0, 0],
    ],
    output: `func (p *receiver) funcName(
	arg1 type1,
	arg2 type2,
	arg3 type3,
) {
	body
}`,
  },
];

async function doBreakLine(input: string, range: Range) {
  let testFilePath = path.join(
    os.tmpdir(),
    "break-line-" + Math.random() * 100000 + ".go"
  );

  fs.writeFileSync(testFilePath, input);

  const document = await vscode.workspace.openTextDocument(testFilePath);
  const editor = await vscode.window.showTextDocument(document);

  editor.selection = new vscode.Selection(
    new vscode.Position(range[0][0], range[0][1]),
    new vscode.Position(range[1][0], range[1][1])
  );

  breakLine();

  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

  return editor.document.getText();
}

suite("breakLine", () => {
  test("breakLine", async () => {
    for (const c of cases) {
      const output = await doBreakLine(c.input, c.range);

      assert.equal(output, c.output);
    }
  });
});
