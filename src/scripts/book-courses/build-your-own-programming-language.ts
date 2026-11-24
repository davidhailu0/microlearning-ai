import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const plCourse: DraftCourse = {
  title: "Build Your Own Programming Language",
  description: "Implement a complete programming language from scratch: a lexer, parser with AST, interpreter with REPL, and a simple compiler that outputs x86 assembly. Learn how programming languages are designed and implemented under the hood.",
  category: "Systems",
  level: "intermediate",
  coverEmoji: "💻",
  tags: [
    "parser",
    "compiler",
    "lexer",
    "ast",
    "interpreter",
  ],
  modules: [
    {
      title: "Lexical Analysis: The Lexer",
      summary: "Build a tokenizer that reads source code and produces a stream of tokens.",
      lessons: [
        {
          title: "Writing a Lexer",
          objective: "Implement a tokenizer that converts source code into a stream of tokens.",
          hook: "The first step in building a language: breaking source code into tokens.",
          paragraphs: [
            "A lexer (or scanner) reads the source code character by character and produces tokens such as keywords, identifiers, numbers, and operators. You'll implement a function that takes source text and returns a vector of tokens, handling comments, strings, and whitespace appropriately.",
          ],
          bullets: [
            "Read source code character by character",
            "Recognize keywords (if, else, while, return) vs identifiers",
            "Parse number literals and string literals",
            "Emit token type and source position for error reporting",
          ],
          steps: [
            {
              title: "Set up the project",
              detail: "Pick a language with pattern matching and a test runner (Rust, Go, OCaml, or TypeScript). Create lexer/, parser/, runtime/, tests/, and a CLI that reads a source file.",
            },
            {
              title: "Define token types",
              detail: "List identifiers, numbers, strings, operators, keywords, punctuation, EOF, and an error token. Write the list down before coding.",
            },
            {
              title: "Scan character by character",
              detail: "Skip whitespace, then dispatch on the current character. Consume maximal identifiers and numbers, and track line and column for errors.",
            },
            {
              title: "Handle multi-character operators",
              detail: "Check for `==`, `!=`, `<=`, `>=`, and `&&` before treating a single character as an operator. Longest match wins.",
            },
            {
              title: "Test the token stream",
              detail: "Feed a small program and print every token with its type and lexeme. Add tests for unterminated strings and unknown characters.",
            },
          ],
          takeaway: "The lexer is the front-end of the compiler: it transforms raw text into structured tokens for the parser.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "lex",
                from: "src",
                label: "input",
              },
              {
                to: "tokens",
                from: "lex",
                label: "produce tokens",
              },
            ],
            nodes: [
              {
                id: "src",
                label: "Source text",
                emphasis: false,
              },
              {
                id: "lex",
                label: "Lexer",
                emphasis: true,
              },
              {
                id: "tokens",
                label: "Token stream",
                emphasis: false,
              },
            ],
            title: "Lexer pipeline",
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
            explanation: "The lexer converts source code into a token stream that the parser can consume.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Writing a Lexer”?",
              options: [
                "Read source code character by character",
                "Implement parse functions for each language construct",
                "Traverse the AST using the visitor pattern",
                "Walk the AST and emit corresponding x86 assembly instructions",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Read source code character by character”",
            },
            {
              question: "Which statement best explains “Lexer”?",
              options: [
                "Tree representing the program's syntax; nodes are statements/expressions",
                "Transforms source text into tokens; first phase of compilation",
                "Executes the AST directly; each node type has a handler",
                "Emits x86 assembly from AST nodes",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Transforms source text into tokens; first phase of compilation”",
            },
            {
              question: "Which of these is a hands-on step in “Writing a Lexer”?",
              options: [
                "Define the AST nodes",
                "Handle precedence and associativity",
                "Report syntax errors",
                "Define token types",
              ],
              correctIndex: 3,
              explanation: "“Define token types” is part of this lesson's sequence: List identifiers, numbers, strings, operators, keywords, punctuation, EOF, and an error token. Write the list down before coding.",
            },
            {
              question: "What does the hands-on step “Scan character by character” involve?",
              options: [
                "Skip whitespace, then dispatch on the current character. Consume maximal identifiers and numbers, and track line and column for errors.",
                "Write Fibonacci, a loop that sums 1..100, and a closure counter. Compare each output with the same program in Python or JavaScript.",
                "Allocate stack slots or registers for locals, emit conditional jumps for if/while, and patch forward label addresses after emission.",
                "Compile expressions to push operands then apply the operator. Compile statements to load, store, jump, and call instructions with resolved labels.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Scan character by character” as: Skip whitespace, then dispatch on the current character. Consume maximal identifiers and numbers, and track line and column for errors.",
            },
          ],
          flashcards: [
            {
              front: "Lexer",
              back: "Transforms source text into tokens; first phase of compilation",
            },
            {
              front: "Token",
              back: "A pair of type (keyword/identifier/number) and position in source",
            },
            {
              front: "How do you handle multi-character operators?",
              back: "Check for `==`, `!=`, `<=`, `>=`, and `&&` before treating a single character as an operator. Longest match wins.",
            },
            {
              front: "How do you define token types?",
              back: "List identifiers, numbers, strings, operators, keywords, punctuation, EOF, and an error token. Write the list down before coding.",
            },
            {
              front: "How do you scan character by character?",
              back: "Skip whitespace, then dispatch on the current character. Consume maximal identifiers and numbers, and track line and column for errors.",
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
      summary: "Build a parser that consumes tokens and produces an Abstract Syntax Tree.",
      lessons: [
        {
          title: "Writing a Parser",
          objective: "Implement a recursive descent parser that builds an AST from the token stream.",
          hook: "The parser transforms tokens into a tree representing the program structure.",
          paragraphs: [
            "A recursive descent parser uses mutually recursive functions to parse language constructs. Given a token stream, it parses expressions, statements, and declarations, constructing nodes for the AST such as binary operations, variable assignments, and function calls.",
          ],
          bullets: [
            "Implement parse functions for each language construct",
            "Use recursive calls to handle nested expressions",
            "Build AST nodes for binary operations, variables, and literals",
            "Handle operator precedence and associativity",
          ],
          steps: [
            {
              title: "Define the AST nodes",
              detail: "Create node types for literals, identifiers, binary/unary expressions, assignments, blocks, if, while, and function calls. Each node stores only what it needs.",
            },
            {
              title: "Write recursive-descent functions",
              detail: "Implement expression, term, and factor levels so multiplication binds tighter than addition. Parse statements in a separate function.",
            },
            {
              title: "Handle precedence and associativity",
              detail: "Use one function per precedence level or precedence climbing. Left-associative operators loop; parentheses recurse.",
            },
            {
              title: "Report syntax errors",
              detail: "On an unexpected token, include the line, column, expected token set, and actual token. Recover at the next statement so one error does not hide the rest.",
            },
            {
              title: "Test the tree shape",
              detail: "Parse `1 + 2 * 3` and assert the root is `+` with `2 * 3` on the right. Add a malformed program and check the error message.",
            },
          ],
          takeaway: "The parser imposes structure on the token stream, producing an AST that represents the program's syntax.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "stmt",
                from: "prog",
                label: "contains",
              },
              {
                to: "expr",
                from: "stmt",
                label: "includes",
              },
              {
                to: "binop",
                from: "expr",
                label: "is",
              },
            ],
            nodes: [
              {
                id: "prog",
                label: "Program",
                emphasis: true,
              },
              {
                id: "stmt",
                label: "Statement",
                emphasis: false,
              },
              {
                id: "expr",
                label: "Expression",
                emphasis: false,
              },
              {
                id: "binop",
                label: "Binary operation",
                emphasis: true,
              },
            ],
            title: "AST structure",
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
            explanation: "The parser builds an AST, a tree representation of the program's syntactic structure.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Writing a Parser”?",
              options: [
                "Read source code character by character",
                "Implement parse functions for each language construct",
                "Traverse the AST using the visitor pattern",
                "Walk the AST and emit corresponding x86 assembly instructions",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Implement parse functions for each language construct”",
            },
            {
              question: "Which statement best explains “AST (Abstract Syntax Tree)”?",
              options: [
                "Transforms source text into tokens; first phase of compilation",
                "Executes the AST directly; each node type has a handler",
                "Tree representing the program's syntax; nodes are statements/expressions",
                "Emits x86 assembly from AST nodes",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Tree representing the program's syntax; nodes are statements/expressions”",
            },
            {
              question: "Which of these is a hands-on step in “Writing a Parser”?",
              options: [
                "Execute statements",
                "Run real programs",
                "Build a tiny VM or assemble the output",
                "Define the AST nodes",
              ],
              correctIndex: 3,
              explanation: "“Define the AST nodes” is part of this lesson's sequence: Create node types for literals, identifiers, binary/unary expressions, assignments, blocks, if, while, and function calls. Each node stores only what it needs.",
            },
            {
              question: "What does the hands-on step “Write recursive-descent functions” involve?",
              options: [
                "Implement expression, term, and factor levels so multiplication binds tighter than addition. Parse statements in a separate function.",
                "Feed a small program and print every token with its type and lexeme. Add tests for unterminated strings and unknown characters.",
                "List identifiers, numbers, strings, operators, keywords, punctuation, EOF, and an error token. Write the list down before coding.",
                "Pick a language with pattern matching and a test runner (Rust, Go, OCaml, or TypeScript). Create lexer/, parser/, runtime/, tests/, and a CLI that reads a source file.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Write recursive-descent functions” as: Implement expression, term, and factor levels so multiplication binds tighter than addition. Parse statements in a separate function.",
            },
          ],
          flashcards: [
            {
              front: "AST (Abstract Syntax Tree)",
              back: "Tree representing the program's syntax; nodes are statements/expressions",
            },
            {
              front: "Recursive descent",
              back: "Parsing technique using mutually recursive functions",
            },
            {
              front: "How do you handle precedence and associativity?",
              back: "Use one function per precedence level or precedence climbing. Left-associative operators loop; parentheses recurse.",
            },
            {
              front: "How do you write recursive-descent functions?",
              back: "Implement expression, term, and factor levels so multiplication binds tighter than addition. Parse statements in a separate function.",
            },
            {
              front: "How do you define the AST nodes?",
              back: "Create node types for literals, identifiers, binary/unary expressions, assignments, blocks, if, while, and function calls. Each node stores only what it needs.",
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
      summary: "Build an interpreter that traverses the AST and executes the program.",
      lessons: [
        {
          title: "Writing an Interpreter",
          objective: "Implement a visitor that walks the AST and executes each node, then wrap it in a REPL that reads, evaluates, and prints.",
          hook: "The interpreter brings the AST to life by executing it step by step.",
          paragraphs: [
            "An interpreter traverses the AST and performs the action corresponding to each node. For each expression type (binary operation, variable lookup, number literal), it computes a value. For statements (assignment, print, if/else), it updates state or produces output. You'll maintain an environment mapping variable names to values, then add a REPL so you can type an expression and see the result immediately.",
          ],
          bullets: [
            "Traverse the AST using the visitor pattern",
            "Evaluate each node type: binary, literal, variable",
            "Maintain an environment for variable bindings",
            "Handle control flow: if/else, while loops",
            "Wrap the evaluator in a REPL: read a line, parse, evaluate, print, repeat",
          ],
          steps: [
            {
              title: "Build an environment",
              detail: "Use a chain of maps from name to value, with a parent pointer for nested scopes. Lookup walks outward; assignment updates the nearest binding.",
            },
            {
              title: "Evaluate expressions",
              detail: "Implement literals, variables, unary/binary operators, and calls. Check operand types and report runtime errors with a source position.",
            },
            {
              title: "Execute statements",
              detail: "Implement expression statements, variable declarations, assignment, blocks, if/else, and while. Return a control-flow signal for break/return.",
            },
            {
              title: "Add functions and closures",
              detail: "Capture the defining environment when a function is created. On call, bind parameters in a new child scope and execute the body.",
            },
            {
              title: "Add a REPL",
              detail: "Print a prompt, read a line from stdin, run the lexer, parser, and evaluator on it, and print the value of an expression statement. Catch parse and runtime errors per line so one bad command does not end the session.",
            },
            {
              title: "Run real programs",
              detail: "In the REPL, write Fibonacci, a loop that sums 1..100, and a closure counter. Compare each output with the same program in Python or JavaScript, then load a whole file in one REPL command.",
            },
          ],
          takeaway: "The interpreter executes the program directly from the AST, demonstrating how language semantics are realized.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "eval",
                from: "ast",
                label: "visit",
              },
              {
                to: "env",
                from: "eval",
                label: "read/write vars",
              },
              {
                to: "result",
                from: "eval",
                label: "produce output",
              },
            ],
            nodes: [
              {
                id: "ast",
                label: "AST",
                emphasis: true,
              },
              {
                id: "env",
                label: "Environment",
                emphasis: true,
              },
              {
                id: "eval",
                label: "eval(node)",
                emphasis: true,
              },
              {
                id: "result",
                label: "Output/value",
                emphasis: false,
              },
            ],
            title: "Interpreter execution",
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
            explanation: "The interpreter walks the AST and performs the operation at each node, producing a result.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Writing an Interpreter”?",
              options: [
                "Read source code character by character",
                "Implement parse functions for each language construct",
                "Traverse the AST using the visitor pattern",
                "Walk the AST and emit corresponding x86 assembly instructions",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Traverse the AST using the visitor pattern”",
            },
            {
              question: "Which statement best explains “Interpreter”?",
              options: [
                "Transforms source text into tokens; first phase of compilation",
                "Tree representing the program's syntax; nodes are statements/expressions",
                "Emits x86 assembly from AST nodes",
                "Executes the AST directly; each node type has a handler",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Executes the AST directly; each node type has a handler”",
            },
            {
              question: "Which of these is a hands-on step in “Writing an Interpreter”?",
              options: [
                "Build a scoped symbol table",
                "Compile to bytecode",
                "Implement functions and closures",
                "Build an environment",
              ],
              correctIndex: 3,
              explanation: "“Build an environment” is part of this lesson's sequence: Use a chain of maps from name to value, with a parent pointer for nested scopes. Lookup walks outward; assignment updates the nearest binding.",
            },
            {
              question: "What does the hands-on step “Evaluate expressions” involve?",
              options: [
                "Implement literals, variables, unary/binary operators, and calls. Check operand types and report runtime errors with a source position.",
                "Check for `==`, `!=`, `<=`, `>=`, and `&&` before treating a single character as an operator. Longest match wins.",
                "Feed a small program and print every token with its type and lexeme. Add tests for unterminated strings and unknown characters.",
                "List identifiers, numbers, strings, operators, keywords, punctuation, EOF, and an error token. Write the list down before coding.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Evaluate expressions” as: Implement literals, variables, unary/binary operators, and calls. Check operand types and report runtime errors with a source position.",
            },
          ],
          flashcards: [
            {
              front: "Interpreter",
              back: "Executes the AST directly; each node type has a handler",
            },
            {
              front: "Environment",
              back: "Maps variable names to runtime values",
            },
            {
              front: "How do you evaluate expressions?",
              back: "Implement literals, variables, unary/binary operators, and calls. Check operand types and report runtime errors with a source position.",
            },
            {
              front: "How do you build an environment?",
              back: "Use a chain of maps from name to value, with a parent pointer for nested scopes. Lookup walks outward; assignment updates the nearest binding.",
            },
            {
              front: "How do you execute statements?",
              back: "Implement expression statements, variable declarations, assignment, blocks, if/else, and while. Return a control-flow signal for break/return.",
            },
            {
              front: "How do you add a REPL?",
              back: "Print a prompt, read a line from stdin, run the lexer, parser, and evaluator on it, and print the value of an expression statement. Catch errors per line so one bad command does not end the session.",
            },
          ],
          sourceRef: {
            label: "Interpreter",
            pageStart: null,
            pageEnd: null,
            note: "Visitor pattern on AST; environment for vars; control flow; REPL that reads, evaluates, and prints",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Compilation: Simple Compiler",
      summary: "Build a compiler that translates the AST to x86 assembly language.",
      lessons: [
        {
          title: "Writing a Compiler",
          objective: "Implement a code generator that emits x86-64 assembly from the AST, then assemble and run it.",
          hook: "Compile the high-level language down to assembly language.",
          paragraphs: [
            "A simple code generator walks the AST and emits x86-64 assembly instructions. For each expression, it generates the necessary load, operate, and store instructions. You'll handle integer arithmetic, variable access, and function prologue/epilogue, write the result to a .s file, assemble it with nasm, and link it with the system toolchain so the output runs as a real binary.",
          ],
          bullets: [
            "Walk the AST and emit corresponding x86-64 assembly instructions",
            "Handle integer arithmetic: add, sub, mul, div",
            "Generate variable access: load/store from stack slots",
            "Emit function prologue (push rbp, mov rbp, rsp) and epilogue",
            "Assemble with `nasm -f elf64` and link with `gcc -no-pie` to get a runnable binary",
          ],
          steps: [
            {
              title: "Fix the target and calling convention",
              detail: "Emit x86-64 assembly for the System V ABI: arguments in rdi/rsi/rdx/rcx/r8/r9, integer return in rax. Write a hand-written `_start` or a C `main` that calls your generated entry so the binary links cleanly.",
            },
            {
              title: "Walk the AST and emit",
              detail: "Compile expressions to push operands then apply the operator. Compile statements to load, store, jump, and call instructions with resolved labels.",
            },
            {
              title: "Handle control flow and variables",
              detail: "Allocate stack slots for locals, emit conditional jumps for if/while, and patch forward label addresses after emission.",
            },
            {
              title: "Assemble and link the output",
              detail: "Write the .s file, run `nasm -f elf64 out.s -o out.o`, and link with `gcc -no-pie out.o -o out`. Run the binary and compare its output with the interpreter.",
            },
            {
              title: "Differential-test against the interpreter",
              detail: "Run the same programs through both the interpreter and the compiled binary. Any output mismatch is a code-generation bug: bisect by dumping the emitted assembly for the failing expression.",
            },
          ],
          takeaway: "Compilation transforms the AST into a lower-level representation that can be assembled and executed.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "gen",
                from: "ast",
                label: "walk",
              },
              {
                to: "asm",
                from: "gen",
                label: "emit instructions",
              },
            ],
            nodes: [
              {
                id: "ast",
                label: "AST",
                emphasis: true,
              },
              {
                id: "asm",
                label: "Assembly output",
                emphasis: true,
              },
              {
                id: "gen",
                label: "codegen(node)",
                emphasis: true,
              },
            ],
            title: "Code generation",
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
            explanation: "The code generator emits x86 assembly instructions that can be assembled and linked.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Writing a Compiler”?",
              options: [
                "Read source code character by character",
                "Implement parse functions for each language construct",
                "Traverse the AST using the visitor pattern",
                "Walk the AST and emit corresponding x86-64 assembly instructions",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Walk the AST and emit corresponding x86 assembly instructions”",
            },
            {
              question: "Which statement best explains “Code generator”?",
              options: [
                "Emits x86 assembly from AST nodes",
                "Transforms source text into tokens; first phase of compilation",
                "Tree representing the program's syntax; nodes are statements/expressions",
                "Executes the AST directly; each node type has a handler",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Emits x86 assembly from AST nodes”",
            },
            {
              question: "Which of these is a hands-on step in “Writing a Compiler”?",
              options: [
                "Write recursive-descent functions",
                "Add functions and closures",
                "Build an environment",
                "Choose a target",
              ],
              correctIndex: 3,
              explanation: "“Choose a target” is part of this lesson's sequence: Emit stack-machine bytecode or simple x86-64 assembly. A stack machine is easier to verify; assembly is closer to a real toolchain.",
            },
            {
              question: "What does the hands-on step “Walk the AST and emit” involve?",
              options: [
                "Compile expressions to push operands then apply the operator. Compile statements to load, store, jump, and call instructions with resolved labels.",
                "Feed a small program and print every token with its type and lexeme. Add tests for unterminated strings and unknown characters.",
                "List identifiers, numbers, strings, operators, keywords, punctuation, EOF, and an error token. Write the list down before coding.",
                "Pick a language with pattern matching and a test runner (Rust, Go, OCaml, or TypeScript). Create lexer/, parser/, runtime/, tests/, and a CLI that reads a source file.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Walk the AST and emit” as: Compile expressions to push operands then apply the operator. Compile statements to load, store, jump, and call instructions with resolved labels.",
            },
          ],
          flashcards: [
            {
              front: "Code generator",
              back: "Emits x86 assembly from AST nodes",
            },
            {
              front: "Prologue/Epilogue",
              back: "Function setup and teardown in assembly",
            },
            {
              front: "How do you walk the AST and emit?",
              back: "Compile expressions to push operands then apply the operator. Compile statements to load, store, jump, and call instructions with resolved labels.",
            },
            {
              front: "How do you fix the target and calling convention?",
              back: "Emit x86-64 assembly for the System V ABI: arguments in rdi/rsi/rdx/rcx/r8/r9, integer return in rax. Provide a `_start` or a C `main` that calls your generated entry so the binary links.",
            },
            {
              front: "How do you handle control flow and variables?",
              back: "Allocate stack slots or registers for locals, emit conditional jumps for if/while, and patch forward label addresses after emission.",
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
    {
      title: "Capstone: From Tree-Walker to Real Language",
      summary: "Scopes, type checking, functions, closures, bytecode, and runtime services that make a language usable beyond arithmetic.",
      lessons: [
        {
          title: "Capstone: Scopes, Types, Closures, and a Bytecode VM",
          objective: "Implement symbol tables, type checking, function calls, closures, and a bytecode runtime on top of the parser and evaluator.",
          hook: "A tree-walking interpreter can evaluate expressions. A language also needs names that respect scope, calls that return, and values that outlive the stack frame that created them.",
          paragraphs: [
            "Names need a symbol table with lexical scope. Each block pushes a scope; declarations enter it, and lookup walks outward until it finds a binding. Shadowing, forward references, and duplicate declarations are decided here. A resolver pass can annotate each identifier with its depth, so the runtime does not search a chain of environments for every access.",
            "Types catch errors before execution. A checker walks the AST with an environment of variable types and function signatures, verifies arguments and returns, and rejects invalid operations. Static types can be simple (int, bool, string) or inferred; either way, the checker must handle recursive functions, nullability, and the difference between a declaration and an assignment. Functions add call frames, parameters, and return values. Closures capture the environment where a function was defined, not where it is called, which is why a returned function can still read its creator's variables.",
            "A bytecode VM separates compilation from execution. The compiler lowers the AST to stack instructions, resolves jumps, and emits constants and local slots; the VM fetches, decodes, and executes them with an explicit stack and frame pointer. This is faster than walking the tree and easier to optimize. A garbage collector reclaims unreachable objects, and error reporting must map bytecode offsets back to source lines. Optimization passes, from constant folding to inline caching, come after correctness.",
          ],
          bullets: [
            "Lexical scopes resolve names outward; shadowing and duplicate declarations need explicit rules",
            "A resolver can annotate identifier depth so runtime lookup is constant time",
            "A type checker walks the AST with variable types and function signatures before execution",
            "Closures capture the defining environment, not the calling environment",
            "Bytecode compilation lowers the AST to stack instructions with resolved jumps and slots",
            "A VM needs an explicit stack, call frames, garbage collection, and source-mapped errors",
          ],
          steps: [
            {
              title: "Build a scoped symbol table",
              detail: "Push and pop scopes for blocks, record declarations, and reject duplicate names in the same scope.",
            },
            {
              title: "Resolve identifiers",
              detail: "Annotate each variable reference with the number of scopes to walk, then use that depth at runtime.",
            },
            {
              title: "Add a type checker",
              detail: "Track variable and function types, verify calls and returns, and report the source location of the first mismatch.",
            },
            {
              title: "Implement functions and closures",
              detail: "Create a call frame with parameters and locals; capture the defining environment so returned functions keep working.",
            },
            {
              title: "Compile to bytecode",
              detail: "Emit stack instructions for expressions, jumps for control flow, and slot indices for locals; run a small program on the VM.",
            },
            {
              title: "Add runtime services",
              detail: "Implement a mark-and-sweep collector and map bytecode offsets to source lines for runtime errors.",
            },
            {
              title: "Run the finished artifact",
              detail: "Write a program that uses closures, recursion, and a deliberate type error, then run it through the interpreter and the bytecode VM. Confirm both produce the same output and the type error points at the right line.",
            },
          ],
          takeaway: "A real language implementation resolves names by scope, checks types before running, gives functions proper frames and closures, and executes compiled bytecode with a managed runtime.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "step-2",
                from: "step-1",
                label: "",
              },
              {
                to: "step-3",
                from: "step-2",
                label: "",
              },
              {
                to: "step-4",
                from: "step-3",
                label: "",
              },
            ],
            nodes: [
              {
                id: "step-1",
                label: "Build a scoped symbol table",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Resolve identifiers",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Add a type checker",
                emphasis: false,
              },
              {
                id: "step-4",
                label: "Add runtime services",
                emphasis: true,
              },
            ],
            title: "How Capstone: Scopes, Types, Closures, and a Bytecode VM works",
          },
          quiz: {
            question: "What does a closure capture?",
            options: [
              "The environment where the function was defined",
              "The environment where the function is called",
              "Only global variables",
              "The parser's token stream",
            ],
            correctIndex: 0,
            explanation: "A closure keeps the defining environment alive, so a returned function can still access its creator's locals.",
          },
          extraQuestions: [
            {
              question: "Why resolve identifier depth ahead of time?",
              options: [
                "To avoid searching a chain of environments on every access",
                "To remove the need for a parser",
                "To make all variables global",
                "To skip type checking",
              ],
              correctIndex: 0,
              explanation: "The resolver computes how many scopes to walk, so the runtime can jump directly to the right slot.",
            },
            {
              question: "What is the job of a type checker?",
              options: [
                "Verify operations and calls against declared or inferred types before execution",
                "Convert the AST to machine code",
                "Collect garbage at runtime",
                "Tokenize the source",
              ],
              correctIndex: 0,
              explanation: "The checker walks the AST with type information and rejects programs that would perform invalid operations.",
            },
            {
              question: "What is a key advantage of bytecode over tree-walking?",
              options: [
                "Faster execution with resolved jumps and compact instructions",
                "It removes the need for a parser",
                "It makes every program statically typed",
                "It eliminates the call stack",
              ],
              correctIndex: 0,
              explanation: "Bytecode avoids repeatedly traversing the AST and gives the VM a compact instruction stream with resolved control flow.",
            },
            {
              question: "Why map bytecode offsets back to source lines?",
              options: [
                "So runtime errors point to the user's code",
                "So the garbage collector can find roots",
                "So the lexer can skip whitespace",
                "So closures capture the right scope",
              ],
              correctIndex: 0,
              explanation: "The VM executes bytecode, but users need diagnostics in terms of their source file and line.",
            },
          ],
          flashcards: [
            {
              front: "Source map",
              back: "A mapping from bytecode offsets to source locations so runtime errors can point at the user's code.",
            },
            {
              front: "Lexical scope",
              back: "Name resolution based on where code is written; lookup walks outward through enclosing scopes and respects shadowing.",
            },
            {
              front: "Closure",
              back: "A function plus the defining environment it captured, allowing it to access outer locals after the outer call returns.",
            },
            {
              front: "Bytecode VM",
              back: "Executes a compact instruction stream with an explicit operand stack and call frames instead of walking the AST.",
            },
            {
              front: "Resolver pass",
              back: "An AST pass that annotates each identifier with its scope depth so runtime lookup does not search environment chains.",
            },
          ],
          sourceRef: {
            label: "Build Your Own Programming Language capstone",
            pageStart: null,
            pageEnd: null,
            note: "Complete build path from lexer and parser through interpreter and compiler, extended with scopes, type checking, functions, closures, bytecode, GC, and diagnostics.",
            sectionIndexes: [],
          },
          estimatedMinutes: 12,
        },
      ],
    },
  ],
};
