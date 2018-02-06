// @flow

const { traverse } = require("../AST/traverse");

export default function validate(ast: Program): Array<string> {
  const errors = [];
  const globalsInProgramMutability = [];

  traverse(ast, {
    Global({ node }: NodePath<Global>) {
      globalsInProgramMutability.push(node.globalType.mutability);
    }
  });

  traverse(ast, {
    Instr({ node }: NodePath<Instruction>) {
      if (node.id === "set_global") {
        const [index] = node.args;
        // $FlowIgnore: it's a NumberLiteral because of set_global
        const mutability = globalsInProgramMutability[index.value];

        if (mutability !== "var") {
          return errors.push("global is immutable");
        }
      }
    }
  });

  return errors;
}
