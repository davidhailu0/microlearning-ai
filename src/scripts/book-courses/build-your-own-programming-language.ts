import type { DraftCourse } from "./types";

/**
 * "Build Your Own Programming Language" — CodeCrafters-style tutorial.
 * Covers: lexer, parser, AST, interpreter, REPL, simple compiler targeting assembly.
 * Typical 20-30 step guided tutorial from the build-your-own-x repo (rusty-lean-four).
 */
export const plCourse: DraftCourse = {
  title: "Build Your Own Programming Language",
  description:
    "Implement a complete programming language from scratch: a lexer, parser with AST, interpreter with REPL, and a simple compiler that outputs x86 assembly. Learn how programming languages are designed and implemented under the hood.",
  category: "Systems",
  level: "intermediate",
  coverEmoji: "💻",
  tags: ["parser", "compiler", "lexer", "ast", "interpreter"],
  modules: [
    {
      title: "Lexical Analysis: The Lexer",
      summary:
        "Build a tokenizer that reads source code and produces a stream of tokens.",
      lessons: [
        {
          title: "Writing a Lexer",
          objective:
            "Implement a tokenizer that converts source code into a stream of tokens.",
          hook:
            "The first step in building a language: breaking source code into tokens.",
          paragraphs: [
            "A lexer (or scanner) reads the source code character by character and produces tokens such as keywords, identifiers, numbers, and operators. You'll implement a function that takes source text and returns a vector of tokens, handling comments, strings, and whitespace appropriately.",
          ],
          bullets: [
            "Read source code character by character",
            "Recognize keywords (if, else, while, return) vs identifiers",
            "Parse number literals and string literals",
            "Emit token type and source position for error reporting",
          ],
          takeaway:
            "The lexer is the front-end of the compiler: it transforms raw text into structured tokens for the parser.",
          diagram: {
            type: "process",
            title: "Lexer pipeline",
            nodes: [
              { id: "src", label: "Source text", emphasis: false },
              { id: "lex", label: "Lexer", emphasis: true },
              { id: "tokens", label: "Token stream", emphasis: false },
            ],
            edges: [
              { from: "src", to: "lex", label: "input" },
              { from: "lex", to: "tokens", label: "produce tokens" },
            ],
          },
          quiz: {
            question: "What does a lexer primarily produce?",
            options: [
              "An AST representation",
              "A stream of tokens",
              "Compiled machine code",
              "An intermediate representation",
            ],
            correctIndex: 1,
            explanation:
              "The lexer converts source code into a token stream that the parser can consume.",
          },
          flashcards: [
            {
              front: "Lexer",
              back:
                "Transforms source text into tokens; first phase of compilation",
            },
            {
              front: "Token",
              back:
                "A pair of type (keyword/identifier/number) and position in source",
            },
          ],
          sourceRef: {
            label: "Lexer",
            pageStart: null,
            pageEnd: null,
            note: "Character-by-character scanning, keyword recognition, token emission",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Parsing: The Parser and AST",
      summary:
        "Build a parser that consumes tokens and produces an Abstract Syntax Tree.",
      lessons: [
        {
          title: "Writing a Parser",
          objective:
            "Implement a recursive descent parser that builds an AST from the token stream.",
          hook:
            "The parser transforms tokens into a tree representing the program structure.",
          paragraphs: [
            "A recursive descent parser uses mutually recursive functions to parse language constructs. Given a token stream, it parses expressions, statements, and declarations, constructing nodes for the AST such as binary operations, variable assignments, and function calls.",
          ],
          bullets: [
            "Implement parse functions for each language construct",
            "Use recursive calls to handle nested expressions",
            "Build AST nodes for binary operations, variables, and literals",
            "Handle operator precedence and associativity",
          ],
          takeaway:
            "The parser imposes structure on the token stream, producing an AST that represents the program's syntax.",
          diagram: {
            type: "hierarchy",
            title: "AST structure",
            nodes: [
              { id: "prog", label: "Program", emphasis: true },
              { id: "stmt", label: "Statement", emphasis: false },
              { id: "expr", label: "Expression", emphasis: false },
              { id: "binop", label: "Binary operation", emphasis: true },
            ],
            edges: [
              { from: "prog", to: "stmt", label: "contains" },
              { from: "stmt", to: "expr", label: "includes" },
              { from: "expr", to: "binop", label: "is" },
            ],
          },
          quiz: {
            question: "What does the parser produce from the token stream?",
            options: [
              "Machine code",
              "A stream of tokens",
              "An Abstract Syntax Tree",
              "Object code",
            ],
            correctIndex: 2,
            explanation:
              "The parser builds an AST, a tree representation of the program's syntactic structure.",
          },
          flashcards: [
            {
              front: "AST (Abstract Syntax Tree)",
              back:
                "Tree representing the program's syntax; nodes are statements/expressions",
            },
            {
              front: "Recursive descent",
              back:
                "Parsing technique using mutually recursive functions",
            },
          ],
          sourceRef: {
            label: "Parser",
            pageStart: null,
            pageEnd: null,
            note: "Recursive descent parser building AST from tokens",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Interpretation: The Interpreter",
      summary:
        "Build an interpreter that traverses the AST and executes the program.",
      lessons: [
        {
          title: "Writing an Interpreter",
          objective:
            "Implement a visitor pattern that walks the AST and executes each node.",
          hook:
            "The interpreter brings the AST to life by executing it step by step.",
          paragraphs: [
            "An interpreter traverses the AST and performs the action corresponding to each node. For each expression type (binary operation, variable lookup, number literal), it computes a value. For statements (assignment, print, if/else), it updates state or produces output. You'll maintain an environment mapping variable names to values.",
          ],
          bullets: [
            "Traverse the AST using the visitor pattern",
            "Evaluate each node type: binary, literal, variable",
            "Maintain an environment for variable bindings",
            "Handle control flow: if/else, while loops",
          ],
          takeaway:
            "The interpreter executes the program directly from the AST, demonstrating how language semantics are realized.",
          diagram: {
            type: "process",
            title: "Interpreter execution",
            nodes: [
              { id: "ast", label: "AST", emphasis: true },
              { id: "env", label: "Environment", emphasis: true },
              { id: "eval", label: "eval(node)", emphasis: true },
              { id: "result", label: "Output/value", emphasis: false },
            ],
            edges: [
              { from: "ast", to: "eval", label: "visit" },
              { from: "eval", to: "env", label: "read/write vars" },
              { from: "eval", to: "result", label: "produce output" },
            ],
          },
          quiz: {
            question: "What does an interpreter do with the AST?",
            options: [
              "Compiles it to machine code",
              "Traverses and executes it directly",
              "Transforms it to an IR",
              "Optimizes it",
            ],
            correctIndex: 1,
            explanation:
              "The interpreter walks the AST and performs the operation at each node, producing a result.",
          },
          flashcards: [
            {
              front: "Interpreter",
              back:
                "Executes the AST directly; each node type has a handler",
            },
            {
              front: "Environment",
              back:
                "Maps variable names to runtime values",
            },
          ],
          sourceRef: {
            label: "Interpreter",
            pageStart: null,
            pageEnd: null,
            note: "Visitor pattern on AST; environment for vars; control flow handling",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Compilation: Simple Compiler",
      summary:
        "Build a compiler that translates the AST to x86 assembly language.",
      lessons: [
        {
          title: "Writing a Compiler",
          objective:
            "Implement a code generator that emits x86 assembly from the AST.",
          hook:
            "Compile the high-level language down to assembly language.",
          paragraphs: [
            "A simple code generator walks the AST and emits x86 assembly instructions. For each expression, it generates the necessary load, operate, and store instructions. You'll handle integer arithmetic, variable access, and function prologue/epilogue. The output is a .asm file that can be assembled and linked.",
          ],
          bullets: [
            "Walk the AST and emit corresponding x86 assembly instructions",
            "Handle integer arithmetic: add, sub, mul, div",
            "Generate variable access: load/store from stack or registers",
            "Emit function prologue (push rbp, mov rbp, rsp) and epilogue",
          ],
          takeaway:
            "Compilation transforms the AST into a lower-level representation that can be assembled and executed.",
          diagram: {
            type: "process",
            title: "Code generation",
            nodes: [
              { id: "ast", label: "AST", emphasis: true },
              { id: "asm", label: "Assembly output", emphasis: true },
              { id: "gen", label: "codegen(node)", emphasis: true },
            ],
            edges: [
              { from: "ast", to: "gen", label: "walk" },
              { from: "gen", to: "asm", label: "emit instructions" },
            ],
          },
          quiz: {
            question: "What does the code generator produce?",
            options: [
              "x86 assembly language",
              "Machine code",
              "Bytecode",
              "An IR",
            ],
            correctIndex: 0,
            explanation:
              "The code generator emits x86 assembly instructions that can be assembled and linked.",
          },
          flashcards: [
            {
              front: "Code generator",
              back: "Emits x86 assembly from AST nodes",
            },
            {
              front: "Prologue/Epilogue",
              back: "Function setup and teardown in assembly",
            },
          ],
          sourceRef: {
            label: "Code generator",
            pageStart: null,
            pageEnd: null,
            note: "Walk AST → emit x86 asm; handle arithmetic, vars, functions",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
  ],
};