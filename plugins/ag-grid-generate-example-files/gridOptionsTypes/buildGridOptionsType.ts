import ts from 'typescript';

import { _ALL_GRID_OPTIONS } from '../src/executors/generate/generator/_copiedFromCore/propertyKeys';

function getTypes(node: ts.Node) {
    let typesToInclude: string[] = [];
    if (ts.isIdentifier(node)) {
        const typeName = node.getText();
        if (!['HTMLElement', 'Function', 'Partial', 'TData', 'TContext', 'TValue'].includes(typeName)) {
            typesToInclude.push(typeName);
        }
    }
    node.forEachChild((ct) => {
        // Only recurse down the type branches of the tree so we do not include argument names
        if ((ct as any).type) {
            typesToInclude = [...typesToInclude, ...getTypes((ct as any).type)];
        } else {
            typesToInclude = [...typesToInclude, ...getTypes(ct)];
        }
    });
    return typesToInclude;
}

function getTypeLookupFunc(fileName) {
    const program = ts.createProgram([fileName], {});
    program.getTypeChecker(); // does something important to make types work below

    const optionsFile = program.getSourceFiles().find((f) => f.fileName.endsWith('gridOptions.d.ts'));
    if (optionsFile) {
        const gridOptionsInterface = optionsFile.statements.find(
            (i: ts.Node) => ts.isInterfaceDeclaration(i) && i.name.getText() == 'GridOptions'
        );

        const lookupType = (propName: string) => {
            if (gridOptionsInterface && ts.isInterfaceDeclaration(gridOptionsInterface)) {
                const pop = gridOptionsInterface.members.find(
                    (m) => (ts.isPropertySignature(m) || ts.isMethodSignature(m)) && m.name.getText() == propName
                ) as ts.PropertySignature | ts.MethodSignature | undefined;
                if (pop && pop.type) {
                    return { typeName: pop.type.getText(), typesToInclude: getTypes(pop.type) };
                }
            }
            return undefined;
        };

        const fullLookup = {};
        _ALL_GRID_OPTIONS.forEach((prop) => {
            fullLookup[prop] = lookupType(prop as string);
        });
        return fullLookup;
    }
    throw new Error('No gridOptions file found');
}

export function getGridOptionsType(): Record<
    string,
    {
        typeName: string;
        typesToInclude: string[];
    }
> {
    return getTypeLookupFunc('./plugins/ag-grid-generate-example-files/gridOptionsTypes/baseGridOptions.ts');
}
