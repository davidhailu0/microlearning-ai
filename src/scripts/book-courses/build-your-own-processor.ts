import type { DraftCourse } from "./types";

/**
 * "Build Your Own Processor" — CodeCrafters-style tutorial.
 * Covers: instruction fetch/decode/execute cycle, ALU operations, register file,
 * assembly language, simple program (addition, loop), pipelining basics.
 * Typical 20-30 step guided tutorial from the build-your-own-x repo.
 */
export const processorCourse: DraftCourse = {
  title: "Build Your Own Processor",
  description:
    "Design and implement a simple 8-bit processor from scratch: register file, ALU, control unit, instruction fetch-decode-execute cycle, and a minimal assembly language. Write and run programs (addition, loops) on your processor simulator. Learn how the CPU at the heart of every computer actually works.",
  category: "Systems",
  level: "intermediate",
  coverEmoji: "💿",
  tags: ["processor", "CPU", "assembly", "digital design", "pipelining"],
  modules: [
    {
      title: "Architecture: Register File and ALU",
      summary:
        "Design the register file that holds 16 general-purpose registers and the ALU that performs arithmetic and logic operations.",
      lessons: [
        {
          title: "Register File: 16 General-Purpose Registers",
          objective:
            "Implement a register file with 16 registers of 8 bits each, with read and write ports.",
          hook:
            "The register file is the CPU's scratchpad — every instruction reads from and writes to registers.",
          paragraphs: [
            "A minimal register file contains N registers of W bits each. Read ports output the register value in one cycle; a write port updates a register on the rising clock edge. We'll implement 16 × 8: four address bits select the read register (two registers read simultaneously) and four bits select the write register + write data. The write port is enabled by a write-enable signal.",
          ],
          bullets: [
            "16 registers × 8 bits = 128 bits total storage",
            "Read address (4 bits) selects two registers to read simultaneously",
            "Write address (4 bits) selects which register to update; write enable gates the write",
            "Write data comes from the ALU output or immediate values",
          ],
          takeaway:
            "The register file is the fastest storage in the CPU — all ALU operations read from it, and results are written back to it.",
          diagram: {
            type: "hierarchy",
            title: "Register file organization",
            nodes: [
              { id: "rf", label: "Register File (16×8)", emphasis: true },
              { id: "ra", label: "Read addr (4b)", emphasis: false },
              { id: "rb", label: "Read data out", emphasis: false },
              { id: "wa", label: "Write addr (4b)", emphasis: false },
              { id: "wd", label: "Write data in", emphasis: false },
              { id: "we", label: "Write enable", emphasis: true },
            ],
            edges: [
              { from: "ra", to: "rf", label: "select reads" },
              { from: "wa", to: "rf", label: "select write" },
              { from: "wd", to: "rf", label: "data to write" },
              { from: "we", to: "rf", label: "write enable" },
            ],
          },
          quiz: {
            question: "How many bits are needed to address 16 registers?",
            options: ["4", "8", "16", "32"],
            correctIndex: 0,
            explanation:
              "log2(16) = 4 bits can address 16 registers (2⁴ = 16).",
          },
          flashcards: [
            {
              front: "Register file",
              back:
                "16 × 8-bit registers; read two simultaneously, write one on clock edge",
            },
            {
              front: "Write enable (we)",
              back:
                "When high, the selected register is updated with write data on the next clock edge",
            },
          ],
          sourceRef: {
            label: "Register file",
            pageStart: null,
            pageEnd: null,
            note:
              "16 × 8-bit register file; read two regs simultaneously; write with we signal",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
        {
          title: "ALU: Arithmetic and Logic Operations",
          objective:
            "Design the ALU to support ADD, SUB, AND, OR, and a HALT/NOOP operation.",
          hook:
            "The ALU is where the CPU actually does work: add two registers, or combine them logically.",
          paragraphs: [
            "The Arithmetic Logic Unit takes two 8-bit inputs (from register file or immediates) and a function selector, and produces an 8-bit result plus zero/negative flags. We'll support: ADD (a + b), SUB (a − b), AND (a ∧ b), OR (a ∨ b), and NOOP (pass a through unchanged). Flags: Z (result is zero) and N (result bit 7 = 1).",
          ],
          bullets: [
            "Two 8-bit inputs A and B (from register file or immediate)",
            "Function selector (3 bits): 000=ADD, 001=SUB, 010=AND, 011=OR, 100=NOOP",
            "8-bit output result",
            "Flags: Zero Z (result == 0) and Negative N (result bit 7 = 1)",
          ],
          takeaway:
            "The ALU is the core of the CPU's data path — every instruction either runs through the ALU or bypasses it for moves/loads.",
          diagram: {
            type: "process",
            title: "ALU operation flow",
            nodes: [
              { id: "A", label: "Input A (8b)", emphasis: false },
              { id: "B", label: "Input B (8b)", emphasis: false },
              { id: "sel", label: "Sel (3b)", emphasis: true },
              { id: "result", label: "8-bit output", emphasis: true },
              { id: "Z", label: "Zero flag", emphasis: true },
              { id: "N", label: "Negative flag", emphasis: true },
            ],
            edges: [
              { from: "A", to: "result", label: "operand 1" },
              { from: "B", to: "result", label: "operand 2" },
              { from: "sel", to: "result", label: "operation select" },
              { from: "result", to: "Z", label: "if result==0" },
              { from: "result", to: "N", label: "if result[7]==1" },
            ],
          },
          quiz: {
            question: "Which ALU operation computes the bitwise AND of A and B?",
            options: ["ADD", "SUB", "AND", "OR"],
            correctIndex: 2,
            explanation:
              "The ALU's function selector 010 selects the AND operation: result = A ∧ B.",
          },
          flashcards: [
            {
              front: "ALU operations",
              back: "ADD (a+b), SUB (a−b), AND (a∧b), OR (a∨b), NOOP (pass a)",
            },
            {
              front: "Flags Z and N",
              back:
                "Z: result is zero; N: result MSB (bit 7) is 1 — used for conditional jumps",
            },
          ],
          sourceRef: {
            label: "ALU",
            pageStart: null,
            pageEnd: null,
            note:
              "ADD, SUB, AND, OR, NOOP; 8-bit result; Z flag (result==0), N flag (result[7]==1)",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Control Unit and Instruction Set",
      summary:
        "Design the instruction fetch-decode-execute cycle, encoding, and a minimal assembly language.",
      lessons: [
        {
          title: "Instruction Set Architecture (ISA)",
          objective:
            "Define the encoding: opcode (4 bits) + two register specifiers (3 bits each) + immediate (8 bits), and the 8-instruction base set.",
          hook:
            "Assembly is just opcodes and operands — learn the encoding and you can read any program.",
          paragraphs: [
            "A simple ISA: each instruction is 16 bits. Bits 15-12: opcode (4 bits, 16 possible instructions). Bits 11-9: first register specifier (3 bits, selects read register 1). Bits 8-6: second register specifier (3 bits, selects read register 2 or write register). Bits 5-0: 6-bit immediate or sub-opcode. The base instruction set includes: LOAD (load register from memory), STORE (store register to memory), ADD (reg ← reg1 + reg2), SUB, AND, OR, HALT (stop execution), and NOOP (do nothing, advance PC).",
          ],
          bullets: [
            "16-bit instruction word: [opcode(4) | reg1(3) | reg2(3) | imm(6)] — fixed width simplifies fetch and decode",
            "16 possible opcodes — enough for a minimal but useful instruction set",
            "LOAD/STORE access memory; arithmetic/logic instructions operate on registers",
            "HALT stops the CPU; NOOP just advances the program counter",
          ],
          takeaway:
            "A well-designed ISA is the interface between software (assembly/compiler) and hardware (datapath/control). Getting it right makes the rest of the design smoother.",
          diagram: {
            type: "process",
            title: "16-bit instruction encoding",
            nodes: [
              { id: "inst", label: "16-bit instruction", emphasis: true },
              { id: "opcode", label: "bits 15-12 (4b)", emphasis: false },
              { id: "reg1", label: "bits 11-9 (3b)", emphasis: false },
              { id: "reg2", label: "bits 8-6 (3b)", emphasis: false },
              { id: "imm", label: "bits 5-0 (6b)", emphasis: false },
            ],
            edges: [
              { from: "inst", to: "opcode", label: "extract" },
              { from: "inst", to: "reg1", label: "extract" },
              { from: "inst", to: "reg2", label: "extract" },
              { from: "inst", to: "imm", label: "extract" },
            ],
          },
          quiz: {
            question: "In the encoding [opcode(4) | reg1(3) | reg2(3) | imm(6)], bits 5-0 are the:",
            options: [
              "immediate value",
              "function selector",
              "destination register",
              "condition code",
            ],
            correctIndex: 0,
            explanation:
              "Bits 5-0 encode a 6-bit immediate value used by LOAD/STORE or as a sub-opcode for some instructions.",
          },
          flashcards: [
            {
              front: "ISA encoding",
              back:
                "16-bit instruction: opcode(4) + reg1(3) + reg2(3) + imm(6)",
            },
            {
              front: "HALT instruction",
              back: "Stops CPU execution; no memory access, no register update",
            },
          ],
          sourceRef: {
            label: "ISA encoding",
            pageStart: null,
            pageEnd: null,
            note:
              "16-bit: opcode(4)+reg1(3)+reg2(3)+imm(6); 8 base instructions: LOAD, STORE, ADD, SUB, AND, OR, HALT, NOOP",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Datapath: Fetch-Decode-Execute Cycle",
      summary:
        "Implement the state machine that fetches instructions from memory, decodes them, and executes them ALU or memory operations.",
      lessons: [
        {
          title: "Fetch-Decode-Execute Cycle",
          objective:
            "Implement the PC (program counter), instruction memory, PC+4 increment, opcode extraction, register file read, ALU operation, and register write-back.",
          hook:
            "The heartbeat of the CPU: fetch, decode, execute — repeat forever (until HALT).",
          paragraphs: [
            "The classic CPU cycle repeats three steps: (1) Fetch: increment PC, read instruction memory at address PC, increment PC to PC+4. (2) Decode: extract opcode and register specifiers from the 16-bit instruction. (3) Execute: read two registers from the register file, feed them to the ALU with the selected operation, write the result back to the destination register. HALT stops the cycle. This state machine runs at the clock frequency (determined by the critical path delay).",
          ],
          bullets: [
            "PC (program counter) holds the address of the next instruction; incremented after each fetch",
            "Instruction memory reads the 16-bit instruction at [PC]",
            "Decode: extract opcode (bits 15-12) and register specifiers (bits 11-0) from the instruction",
            "Execute: register file → ALU → write-back to register file; HALT stops the cycle",
          ],
          takeaway:
            "The fetch-decode-execute cycle is the fundamental state machine of every general-purpose CPU. Every modern processor (even superscalar, pipelined, out-of-order) is built on this same cyclic core.",
          diagram: {
            type: "cycle",
            title: "Fetch-Decode-Execute cycle",
            nodes: [
              { id: "pc", label: "Program Counter", emphasis: true },
              { id: "imem", label: "Instruction Memory", emphasis: true },
              { id: "inst", label: "16-bit instruction", emphasis: false },
              { id: "decode", label: "Extract opcode/regs", emphasis: true },
              { id: "rf", label: "Register File", emphasis: true },
              { id: "alu", label: "ALU + flags", emphasis: true },
              { id: "wb", label: "Write-Back", emphasis: true },
              { id: "halt", label: "HALT signal", emphasis: true },
            ],
            edges: [
              { from: "pc", to: "imem", label: "address" },
              { from: "imem", to: "inst", label: "read instruction" },
              { from: "inst", to: "decode", label: "extract fields" },
              { from: "decode", to: "rf", label: "read reg values" },
              { from: "rf", to: "alu", label: "operands" },
              { from: "alu", to: "wb", label: "result + flags" },
              { from: "wb", to: "rf", label: "write register" },
              { from: "wb", to: "halt", label: "if HALT opcode" },
              { from: "halt", to: "pc", label: "stop or no-op" },
            ],
          },
          quiz: {
            question: "What happens during the Fetch step of the CPU cycle?",
            options: [
              "PC is incremented, instruction memory reads at [PC], PC ← PC+4",
              "The ALU computes an operation",
              "The register file is written with a new value",
              "The opcode is extracted and a jump is taken",
            ],
            correctIndex: 0,
            explanation:
              "Fetch: read the instruction at the current PC, then advance PC by 4 (for 16-bit instructions) so the next iteration fetches the next instruction.",
          },
          flashcards: [
            {
              front: "Fetch-Decode-Execute cycle",
              back:
                "Fetch (read inst, inc PC) → Decode (extract fields) → Execute (ALU + write-back) → repeat (until HALT)",
            },
            {
              front: "PC (Program Counter)",
              back:
                "Holds the address of the next instruction to fetch; incremented each cycle",
            },
          ],
          sourceRef: {
            label: "CPU cycle",
            pageStart: null,
            pageEnd: null,
            note:
              "PC → imem → decode → rf → alu → wb → (halt?); clock-driven state machine",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Assembly Language and Programs",
      summary:
        "Write minimal assembly programs (addition, loop, sum 1..N) and simulate running them on your processor.",
      lessons: [
        {
          title: "Writing and Running Assembly Programs",
          objective:
            "Write a small assembly program that adds two numbers, computes a loop summation, and halts; then simulate it and verify the output with a testbench.",
          hook:
            "From ISA encoding to running your first program — the moment the processor comes to life.",
          paragraphs: [
            "You'll write assembly (using the ISA encoding defined earlier) to perform three small tasks: (1) ADD: add two 8-bit values and store the result in a register; (2) LOOP: add the numbers 1+2+...+N and store the sum; (3) HALT: stop execution. Using a simple testbench (a Python or C program that initializes the register file, sets the PC, clocks the CPU for N cycles, and reads the register file at the end), you'll verify that the program produces the correct results. This bridges the gap between ISA design and observable behavior.",
          ],
          bullets: [
            "Program 1 (ADD): LOAD two values into registers, ADD them, HALT; verify result = a+b in the destination register",
            "Program 2 (SUM 1..N): Use a loop: initialize a counter register to N, a sum register to 0, repeatedly ADD the counter to sum, decrement counter, branch if non-zero to the loop start, HALT; verify sum = N·(N+1)/2",
            "Testbench: initialize register file, set PC, clock CPU, and read final register values",
            "Debugging: use Z and N flags to track carry/overflow",
          ],
          takeaway:
            "Writing and running assembly is the ultimate validation of an ISA and implementation: if the programs produce architecturally correct results, the design is sound.",
          diagram: {
            type: "process",
            title: "Assembly program execution flow",
            nodes: [
              { id: "asm", label: "Assembly program", emphasis: true },
              { id: "tb", label: "Testbench", emphasis: true },
              { id: "cpu", label: "CPU simulation", emphasis: true },
              { id: "regs", label: "Register file", emphasis: false },
              { id: "result", label: "Verified output", emphasis: true },
            ],
            edges: [
              { from: "asm", to: "cpu", label: "write assembly" },
              { from: "asm", to: "tb", label: "specify test inputs" },
              { from: "cpu", to: "regs", label: "execute instructions" },
              { from: "cpu", to: "tb", label: "step or run N cycles" },
              { from: "tb", to: "result", label: "read registers, check values" },
            ],
          },
          quiz: {
            question: "What does Program 2 (SUM 1..N) compute?",
            options: ["a + b", "1 + 2 + ... + N", "N × (N+1)", "N²"],
            correctIndex: 1,
            explanation:
              "Program 2 computes the summation 1 + 2 + ... + N, the classic arithmetic series.",
          },
          flashcards: [
            {
              front: "Assembly program",
              back:
                "Sequence of ISA instructions (LOAD, ADD, SUB, branch, HALT) that the CPU executes",
            },
            {
              front: "Testbench",
              back:
                "Initializes state, clocks the CPU, reads final register values for verification",
            },
          ],
          sourceRef: {
            label: "Assembly + testbench",
            pageStart: null,
            pageEnd: null,
            note:
              "Program 1 (ADD two values); Program 2 (SUM 1..N loop); testbench verifies results",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
  ],
};