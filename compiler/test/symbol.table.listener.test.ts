import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";
import { ErrorListener } from "../src/listener/error.listener";
import { GenericSymbol, GlobalSymbolTableListener } from "../src/listener/symbol.table.listener";
import { DuplicatedSubroutineError } from "../src/error";
import { parseJackFile, getTestResourcePath, traverseTree } from "./test.helper";
import fs from 'fs';
import path from "path";

describe('Global symbol table', () => {

    test("should fail on duplicated subroutine", () => {
        const filePath = getTestResourcePath("DuplicatedSubroutine.jack");
        const errorListener = ErrorListener.getInstance()
        errorListener.filepath = filePath;
        const tree = parseJackFile(filePath, errorListener);
        expect(errorListener.error).toBe(false)
        const globalSymbolsListener = new GlobalSymbolTableListener()
        traverseTree(tree, globalSymbolsListener)
        const symbolsErrors = globalSymbolsListener.errors
        expect(globalSymbolsListener.errors.length).toBe(1)
        expect(symbolsErrors[0]).toBeInstanceOf(DuplicatedSubroutineError)
    })

    test("basic", () => {
        const expected = {
            'Fraction': {},
            'Fraction.new': { subroutineParameterCount: 2 },
            'Fraction.reduce': { subroutineParameterCount: 0 },
            'Fraction.getNumerator': { subroutineParameterCount: 0 },
            'Fraction.getDenominator': { subroutineParameterCount: 0 },
            'Fraction.plus': { subroutineParameterCount: 1 },
            'Fraction.dispose': { subroutineParameterCount: 0 },
            'Fraction.print': { subroutineParameterCount: 0 },
            'Fraction.gcd': { subroutineParameterCount: 2 },
            'Main': {},
            'Main.main': { subroutineParameterCount: 0 }
        }
        let globalSymbolsListener = new GlobalSymbolTableListener()

        const testFolder = getTestResourcePath("Fraction");
        const files = fs.readdirSync(testFolder).filter(file => file.endsWith(".jack")).map(file => path.join(testFolder, file));
        for (const filePath of files) {
            const errorListener = ErrorListener.getInstance()
            const tree = parseJackFile(filePath, errorListener);
            globalSymbolsListener = traverseTree(tree, globalSymbolsListener);
            console.log("Symbols for " + path.basename(filePath) + ":", globalSymbolsListener.globalSymbolTable)
        }
        expect(globalSymbolsListener.globalSymbolTable).toEqual(expected)

    })
})
