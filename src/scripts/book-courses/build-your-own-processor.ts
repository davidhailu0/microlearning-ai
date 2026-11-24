import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const processorCourse: DraftCourse = {
  title: "Build Your Own Processor",
  description: "Design and implement a simple 8-bit processor from scratch: register file, ALU, control unit, instruction fetch-decode-execute cycle, and a minimal assembly language. Write and run programs (addition, loops) on your processor simulator. Learn how the CPU at the heart of every computer actually works.",
  category: "Systems",
  level: "intermediate",
  coverEmoji: "💿",
  tags: [
    "processor",
    "CPU",
    "assembly",
    "digital design",
    "pipelining",
  ],
  modules: [
    {
      title: "Architecture: Register File and ALU",
      summary: "Design the register file that holds 16 general-purpose registers and the ALU that performs arithmetic and logic operations.",
      lessons: [
        {
          title: "Register File: 16 General-Purpose Registers",
          objective: "Implement a register file with 16 general-purpose 8-bit registers and two read ports plus one write port.",
          hook: "The register file is the CPU's scratchpad — every instruction reads from and writes to registers.",
          paragraphs: [
            "A register file holds the CPU's working values. This processor has 16 general-purpose registers, each 8 bits wide, addressed by a 4-bit register number. Two read ports output the selected registers combinationally in the same cycle, and one write port updates a register on the rising clock edge when write-enable is high. All 16 registers are usable; there is no hardwired zero register.",
          ],
          bullets: [
            "16 registers x 8 bits = 128 bits of storage",
            "4-bit register numbers select any of the 16 registers",
            "Two combinational read ports feed both ALU operands in the same cycle",
            "A synchronous write port updates one register on the clock edge when write-enable is high",
          ],
          steps: [
            {
              title: "Set up the project",
              detail: "Pick a hardware description language (Verilog or VHDL) or a software simulator in Python/C. Create rtl/ or sim/ plus a testbench that clocks the design and dumps registers. Standardize on 8-bit data and 16-bit instructions.",
            },
            {
              title: "Define the storage",
              detail: "Create a module with 16 registers, each 8 bits wide, plus two read ports and one write port. Use a 4-bit register address everywhere.",
            },
            {
              title: "Implement synchronous writes",
              detail: "On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
            },
            {
              title: "Implement combinational reads",
              detail: "Drive both read ports from the addressed registers without a clock, so the ALU can consume two operands in the same cycle.",
            },
            {
              title: "Test the register file",
              detail: "Write a distinct value to each register, read every one back through both ports, and confirm the last write wins.",
            },
          ],
          takeaway: "The register file is the fastest storage in the CPU — all ALU operations read from it, and results are written back to it.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "rf",
                from: "ra",
                label: "select reads",
              },
              {
                to: "rf",
                from: "wa",
                label: "select write",
              },
              {
                to: "rf",
                from: "wd",
                label: "data to write",
              },
              {
                to: "rf",
                from: "we",
                label: "write enable",
              },
            ],
            nodes: [
              {
                id: "rf",
                label: "Register File (16×8)",
                emphasis: true,
              },
              {
                id: "ra",
                label: "Read addr (4b)",
                emphasis: false,
              },
              {
                id: "rb",
                label: "Read data out",
                emphasis: false,
              },
              {
                id: "wa",
                label: "Write addr (4b)",
                emphasis: false,
              },
              {
                id: "wd",
                label: "Write data in",
                emphasis: false,
              },
              {
                id: "we",
                label: "Write enable",
                emphasis: true,
              },
            ],
            title: "Register file organization",
          },
          quiz: {
            question: "How many bits are needed to address 16 registers?",
            options: [
              "4",
              "8",
              "16",
              "32",
            ],
            correctIndex: 0,
            explanation: "log2(16) = 4 bits can address all 16 registers.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of \"Register File: 16 General-Purpose Registers\"?",
              options: [
                "16 registers x 8 bits = 128 bits of storage",
                "Two 8-bit inputs A and B feed the ALU from registers or an immediate",
                "A 3-bit selector chooses one of eight operations",
                "The result is 8 bits wide; subtraction uses two's complement",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"16 registers x 8 bits = 128 bits of storage\"",
            },
            {
              question: "Which of these is a hands-on step in \"Register File: 16 General-Purpose Registers\"?",
              options: [
                "Define the storage",
                "Implement the operations",
                "Produce status flags",
                "Add an operation selector",
              ],
              correctIndex: 0,
              explanation: "\"Define the storage\" is part of this lesson's build sequence.",
            },
            {
              question: "What does the hands-on step \"Implement synchronous writes\" involve?",
              options: [
                "On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
                "Support ADD, SUB, AND, OR, XOR, NOT, SHL, and SHR on 8-bit inputs. Use two's complement for subtraction and keep the result 8 bits wide.",
                "Compute zero (result == 0), sign (bit 7), and carry or borrow out of bit 7. These flags drive conditional branches later.",
                "Use a 3-bit selector and a case statement or multiplexer to choose the operation. Default to passing operand A through for unknown selector values.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes \"Implement synchronous writes\" as: On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
            },
            {
              question: "Which statement best explains \"Register File: 16 General-Purpose Registers\"?",
              options: [
                "4-bit register numbers select any of the 16 registers",
                "Two 8-bit inputs A and B feed the ALU from registers or an immediate",
                "A 3-bit selector chooses one of eight operations",
                "The result is 8 bits wide; subtraction uses two's complement",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"4-bit register numbers select any of the 16 registers\"",
            },
          ],
          flashcards: [
            {
              front: "How do you set up the project?",
              back: "Pick a hardware description language (Verilog or VHDL) or a software simulator in Python/C. Create rtl/ or sim/ plus a testbench that clocks the design and dumps registers. Standardize on 8-bit data and 16-bit instructions.",
            },
            {
              front: "How do you define the storage?",
              back: "Create a module with 16 registers, each 8 bits wide, plus two read ports and one write port. Use a 4-bit register address everywhere.",
            },
            {
              front: "How do you implement synchronous writes?",
              back: "On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
            },
            {
              front: "How do you implement combinational reads?",
              back: "Drive both read ports from the addressed registers without a clock, so the ALU can consume two operands in the same cycle.",
            },
            {
              front: "How do you test the register file?",
              back: "Write a distinct value to each register, read every one back through both ports, and confirm the last write wins.",
            },
          ],
          sourceRef: {
            label: "Register file",
            pageStart: null,
            pageEnd: null,
            note: "16 × 8-bit register file; read two regs simultaneously; write with we signal",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
        {
          title: "ALU: Arithmetic and Logic Operations",
          objective: "Design an 8-bit ALU that supports ADD, SUB, AND, OR, XOR, NOT, SHL, and SHR, with Z, N, and C flags.",
          hook: "The ALU is where the CPU actually does work: add two registers, or combine them logically.",
          paragraphs: [
            "The Arithmetic Logic Unit takes two 8-bit inputs (from the register file or an immediate) and a 3-bit function selector, and produces an 8-bit result plus status flags. The operations are ADD, SUB, AND, OR, XOR, NOT, SHL, and SHR. Subtraction uses two's complement. The flags are Z (result is zero), N (result bit 7 is 1), and C (carry out of bit 7, or borrow for subtraction).",
          ],
          bullets: [
            "Two 8-bit inputs A and B feed the ALU from registers or an immediate",
            "A 3-bit selector chooses one of eight operations",
            "The result is 8 bits wide; subtraction uses two's complement",
            "Z, N, and C flags record zero, sign, and carry/borrow outcomes",
          ],
          steps: [
            {
              title: "Implement the operations",
              detail: "Support ADD, SUB, AND, OR, XOR, NOT, SHL, and SHR on 8-bit inputs. Use two's complement for subtraction and keep the result 8 bits wide.",
            },
            {
              title: "Produce status flags",
              detail: "Compute zero (result == 0), sign (bit 7), and carry or borrow out of bit 7. These flags drive conditional branches later.",
            },
            {
              title: "Add an operation selector",
              detail: "Use a 3-bit selector and a case statement or multiplexer to choose the operation. Default to passing operand A through for unknown selector values.",
            },
            {
              title: "Test with vectors",
              detail: "Write a table of operand pairs and expected results, including overflow, negative numbers, and shift-by-zero. Run every row and print failures.",
            },
          ],
          takeaway: "The ALU is the core of the CPU's data path — every instruction either runs through the ALU or bypasses it for moves/loads.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "result",
                from: "A",
                label: "operand 1",
              },
              {
                to: "result",
                from: "B",
                label: "operand 2",
              },
              {
                to: "result",
                from: "sel",
                label: "operation select",
              },
              {
                to: "Z",
                from: "result",
                label: "if result==0",
              },
              {
                to: "N",
                from: "result",
                label: "if result[7]==1",
              },
            ],
            nodes: [
              {
                id: "A",
                label: "Input A (8b)",
                emphasis: false,
              },
              {
                id: "B",
                label: "Input B (8b)",
                emphasis: false,
              },
              {
                id: "sel",
                label: "Sel (3b)",
                emphasis: true,
              },
              {
                id: "result",
                label: "8-bit output",
                emphasis: true,
              },
              {
                id: "Z",
                label: "Zero flag",
                emphasis: true,
              },
              {
                id: "N",
                label: "Negative flag",
                emphasis: true,
              },
            ],
            title: "ALU operation flow",
          },
          quiz: {
            question: "Which ALU operation computes the bitwise AND of A and B?",
            options: [
              "ADD",
              "SUB",
              "AND",
              "OR",
            ],
            correctIndex: 2,
            explanation: "The ALU selects AND when the function selector chooses it; the result is A & B.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of \"ALU: Arithmetic and Logic Operations\"?",
              options: [
                "Two 8-bit inputs A and B feed the ALU from registers or an immediate",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"Two 8-bit inputs A and B feed the ALU from registers or an immediate\"",
            },
            {
              question: "Which of these is a hands-on step in \"ALU: Arithmetic and Logic Operations\"?",
              options: [
                "Implement the operations",
                "Define the storage",
                "Implement synchronous writes",
                "Implement combinational reads",
              ],
              correctIndex: 0,
              explanation: "\"Implement the operations\" is part of this lesson's build sequence.",
            },
            {
              question: "What does the hands-on step \"Produce status flags\" involve?",
              options: [
                "Compute zero (result == 0), sign (bit 7), and carry or borrow out of bit 7. These flags drive conditional branches later.",
                "Create a module with 16 registers, each 8 bits wide, plus two read ports and one write port. Use a 4-bit register address everywhere.",
                "On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
                "Drive both read ports from the addressed registers without a clock, so the ALU can consume two operands in the same cycle.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes \"Produce status flags\" as: Compute zero (result == 0), sign (bit 7), and carry or borrow out of bit 7. These flags drive conditional branches later.",
            },
            {
              question: "Which statement best explains \"ALU: Arithmetic and Logic Operations\"?",
              options: [
                "A 3-bit selector chooses one of eight operations",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"A 3-bit selector chooses one of eight operations\"",
            },
          ],
          flashcards: [
            {
              front: "ALU operations",
              back: "ADD (a+b), SUB (a−b), AND (a∧b), OR (a∨b), NOOP (pass a)",
            },
            {
              front: "Flags Z and N",
              back: "Z: result is zero; N: result MSB (bit 7) is 1 — used for conditional jumps",
            },
            {
              front: "How do you implement the operations?",
              back: "Support ADD, SUB, AND, OR, XOR, NOT, SHL, and SHR on 8-bit inputs. Use two's complement for subtraction and keep the result 8 bits wide.",
            },
            {
              front: "How do you produce status flags?",
              back: "Compute zero (result == 0), sign (bit 7), and carry or borrow out of bit 7. These flags drive conditional branches later.",
            },
            {
              front: "How do you add an operation selector?",
              back: "Use a 3-bit selector and a case statement or multiplexer to choose the operation. Default to passing operand A through for unknown selector values.",
            },
            {
              front: "How do you test with vectors?",
              back: "Write a table of operand pairs and expected results, including overflow, negative numbers, and shift-by-zero. Run every row and print failures.",
            },
          ],
          sourceRef: {
            label: "ALU",
            pageStart: null,
            pageEnd: null,
            note: "ADD, SUB, AND, OR, XOR, NOT, SHL, SHR; 8-bit result; Z, N, C flags",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Control Unit and Instruction Set",
      summary: "Define the 16-bit instruction encoding and the control signals that select registers, ALU operations, memory access, and the next PC.",
      lessons: [
        {
          title: "Instruction Set Architecture (ISA)",
          objective: "Define a 16-bit instruction encoding with a 4-bit opcode and 4-bit register fields, plus a 12-instruction base set.",
          hook: "Assembly is just opcodes and operands — learn the encoding and you can read any program.",
          paragraphs: [
            "Every instruction is 16 bits. Register-format instructions use bits 15-12 for the opcode, 11-8 for the destination register, 7-4 for the source register, and 3-0 as reserved zero. Immediate-format instructions use bits 15-12 for the opcode, 11-8 for the destination register, and 7-0 for an 8-bit immediate or address. Four-bit register fields address all 16 registers. The base set is LDI, LOAD, STORE, ADD, SUB, AND, OR, XOR, JMP, JZ, HALT, and NOOP; opcodes 0xC-0xF are reserved and fault.",
          ],
          bullets: [
            "Register format: opcode(4) | rd(4) | rs(4) | reserved(4)",
            "Immediate format: opcode(4) | rd(4) | imm(8) for loads, stores, and branches",
            "4-bit register fields address all 16 registers",
            "12 base instructions; opcodes 0xC-0xF fault instead of executing",
          ],
          steps: [
            {
              title: "Choose the instruction formats",
              detail: "Write down both 16-bit layouts: register format (opcode, rd, rs, reserved) and immediate format (opcode, rd, imm8). Confirm every field fits.",
            },
            {
              title: "Write the opcode table",
              detail: "List LDI, LOAD, STORE, ADD, SUB, AND, OR, XOR, JMP, JZ, HALT, and NOOP with opcode, operands, and semantics. Mark 0xC-0xF reserved.",
            },
            {
              title: "Build an encoder and decoder",
              detail: "Write functions that pack fields into a 16-bit word and unpack them back. Round-trip every instruction in the table to prove the layout is consistent.",
            },
            {
              title: "Document the semantics",
              detail: "For each instruction, state which registers change, how flags update, and whether it branches. This document becomes your test oracle.",
            },
          ],
          takeaway: "A well-designed ISA is the interface between software (assembly/compiler) and hardware (datapath/control). Getting it right makes the rest of the design smoother.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "opcode",
                from: "inst",
                label: "extract",
              },
              {
                to: "reg1",
                from: "inst",
                label: "extract",
              },
              {
                to: "reg2",
                from: "inst",
                label: "extract",
              },
              {
                to: "imm",
                from: "inst",
                label: "extract",
              },
            ],
            nodes: [
              {
                id: "inst",
                label: "16-bit instruction",
                emphasis: true,
              },
              {
                id: "opcode",
                label: "bits 15-12 (4b)",
                emphasis: false,
              },
              {
                id: "reg1",
                label: "bits 11-9 (3b)",
                emphasis: false,
              },
              {
                id: "reg2",
                label: "bits 8-6 (3b)",
                emphasis: false,
              },
              {
                id: "imm",
                label: "bits 5-0 (6b)",
                emphasis: false,
              },
            ],
            title: "16-bit instruction encoding",
          },
          quiz: {
            question: "In the immediate format [opcode(4) | rd(4) | imm(8)], bits 7-0 are the:",
            options: [
              "4-bit opcode",
              "destination register",
              "source register",
              "8-bit immediate or address",
            ],
            correctIndex: 3,
            explanation: "Immediate-format instructions use bits 7-0 for an 8-bit immediate or memory address.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of \"Instruction Set Architecture (ISA)\"?",
              options: [
                "Register format: opcode(4) | rd(4) | rs(4) | reserved(4)",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"Register format: opcode(4) | rd(4) | rs(4) | reserved(4)\"",
            },
            {
              question: "Which of these is a hands-on step in \"Instruction Set Architecture (ISA)\"?",
              options: [
                "Choose the instruction formats",
                "Define the storage",
                "Implement synchronous writes",
                "Implement combinational reads",
              ],
              correctIndex: 0,
              explanation: "\"Choose the instruction formats\" is part of this lesson's build sequence.",
            },
            {
              question: "What does the hands-on step \"Write the opcode table\" involve?",
              options: [
                "List LDI, LOAD, STORE, ADD, SUB, AND, OR, XOR, JMP, JZ, HALT, and NOOP with opcode, operands, and semantics. Mark 0xC-0xF reserved.",
                "Create a module with 16 registers, each 8 bits wide, plus two read ports and one write port. Use a 4-bit register address everywhere.",
                "On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
                "Drive both read ports from the addressed registers without a clock, so the ALU can consume two operands in the same cycle.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes \"Write the opcode table\" as: List LDI, LOAD, STORE, ADD, SUB, AND, OR, XOR, JMP, JZ, HALT, and NOOP with opcode, operands, and semantics. Mark 0xC-0xF reserved.",
            },
            {
              question: "Which statement best explains \"Instruction Set Architecture (ISA)\"?",
              options: [
                "Immediate format: opcode(4) | rd(4) | imm(8) for loads, stores, and branches",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"Immediate format: opcode(4) | rd(4) | imm(8) for loads, stores, and branches\"",
            },
          ],
          flashcards: [
            {
              front: "ISA encoding",
              back: "16-bit instruction: opcode(4) + reg1(3) + reg2(3) + imm(6)",
            },
            {
              front: "HALT instruction",
              back: "Stops CPU execution; no memory access, no register update",
            },
            {
              front: "How do you choose the instruction formats?",
              back: "Write down both 16-bit layouts: register format (opcode, rd, rs, reserved) and immediate format (opcode, rd, imm8). Confirm every field fits.",
            },
            {
              front: "How do you write the opcode table?",
              back: "List LDI, LOAD, STORE, ADD, SUB, AND, OR, XOR, JMP, JZ, HALT, and NOOP with opcode, operands, and semantics. Mark 0xC-0xF reserved.",
            },
            {
              front: "How do you build an encoder and decoder?",
              back: "Write functions that pack fields into a 16-bit word and unpack them back. Round-trip every instruction in the table to prove the layout is consistent.",
            },
            {
              front: "How do you document the semantics?",
              back: "For each instruction, state which registers change, how flags update, and whether it branches. This document becomes your test oracle.",
            },
          ],
          sourceRef: {
            label: "ISA encoding",
            pageStart: null,
            pageEnd: null,
            note: "16-bit instruction: opcode(4)+rd(4)+rs(4)+reserved(4) or opcode(4)+rd(4)+imm(8); 12 base instructions",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Datapath: Fetch-Decode-Execute Cycle",
      summary: "Implement the state machine that fetches instructions, decodes the fields, and executes them as ALU or memory operations with write-back.",
      lessons: [
        {
          title: "Fetch-Decode-Execute Cycle",
          objective: "Implement the program counter, 256-word instruction memory, fetch-decode-execute cycle, and register write-back.",
          hook: "The heartbeat of the CPU: fetch, decode, execute — repeat forever (until HALT).",
          paragraphs: [
            "The CPU cycle repeats three steps. Fetch reads the 16-bit instruction at instruction_mem[PC] and increments PC by one word, which is two bytes in a byte-addressed memory. Decode extracts the 4-bit opcode and the register or immediate fields. Execute reads up to two registers, drives the ALU, writes the result back, and updates flags. HALT freezes the PC. The state machine advances on each clock edge.",
          ],
          bullets: [
            "PC is a word index into a 256-word instruction memory",
            "Fetch reads instruction_mem[PC], then PC <- PC + 1 word (2 bytes)",
            "Decode extracts the opcode and register/immediate fields from the 16-bit word",
            "Execute reads registers, runs the ALU, writes back, and updates flags",
          ],
          steps: [
            {
              title: "Add program counter and instruction memory",
              detail: "Create a PC register and a 256-word instruction memory. Fetch the word at PC, then increment PC by one word (two bytes) before decode.",
            },
            {
              title: "Decode the fields",
              detail: "Split the fetched word into opcode, destination register, source register or immediate. Drive the register file and ALU from those fields.",
            },
            {
              title: "Execute and write back",
              detail: "Select the ALU operation from the opcode, route the result to the destination register or memory, and update flags.",
            },
            {
              title: "Implement control flow",
              detail: "For JMP, load PC with the target. For JZ, load PC only when the zero flag is set. For HALT, stop advancing and freeze the machine.",
            },
            {
              title: "Trace a program",
              detail: "Load a three-instruction program and print PC, instruction, register writes, and flags each cycle until HALT. Check the trace against your ISA table.",
            },
          ],
          takeaway: "The fetch-decode-execute cycle is the fundamental state machine of every general-purpose CPU. Every modern processor (even superscalar, pipelined, out-of-order) is built on this same cyclic core.",
          diagram: {
            type: "cycle",
            edges: [
              {
                to: "imem",
                from: "pc",
                label: "address",
              },
              {
                to: "inst",
                from: "imem",
                label: "read instruction",
              },
              {
                to: "decode",
                from: "inst",
                label: "extract fields",
              },
              {
                to: "rf",
                from: "decode",
                label: "read reg values",
              },
              {
                to: "alu",
                from: "rf",
                label: "operands",
              },
              {
                to: "wb",
                from: "alu",
                label: "result + flags",
              },
              {
                to: "rf",
                from: "wb",
                label: "write register",
              },
              {
                to: "halt",
                from: "wb",
                label: "if HALT opcode",
              },
              {
                to: "pc",
                from: "halt",
                label: "stop or no-op",
              },
            ],
            nodes: [
              {
                id: "pc",
                label: "Program Counter",
                emphasis: true,
              },
              {
                id: "imem",
                label: "Instruction Memory",
                emphasis: true,
              },
              {
                id: "inst",
                label: "16-bit instruction",
                emphasis: false,
              },
              {
                id: "decode",
                label: "Extract opcode/regs",
                emphasis: true,
              },
              {
                id: "rf",
                label: "Register File",
                emphasis: true,
              },
              {
                id: "alu",
                label: "ALU + flags",
                emphasis: true,
              },
              {
                id: "wb",
                label: "Write-Back",
                emphasis: true,
              },
              {
                id: "halt",
                label: "HALT signal",
                emphasis: true,
              },
            ],
            title: "Fetch-Decode-Execute cycle",
          },
          quiz: {
            question: "What happens during the Fetch step of the CPU cycle?",
            options: [
              "The ALU computes an operation",
              "The register file is written with a new value",
              "Instruction memory is read at [PC], then PC increments by one word",
              "The opcode is extracted and a jump is taken",
            ],
            correctIndex: 2,
            explanation: "Fetch reads instruction_mem[PC] and increments PC by one 16-bit word (two bytes).",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of \"Fetch-Decode-Execute Cycle\"?",
              options: [
                "PC is a word index into a 256-word instruction memory",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"PC is a word index into a 256-word instruction memory\"",
            },
            {
              question: "Which of these is a hands-on step in \"Fetch-Decode-Execute Cycle\"?",
              options: [
                "Add program counter and instruction memory",
                "Define the storage",
                "Implement synchronous writes",
                "Implement combinational reads",
              ],
              correctIndex: 0,
              explanation: "\"Add program counter and instruction memory\" is part of this lesson's build sequence.",
            },
            {
              question: "What does the hands-on step \"Decode the fields\" involve?",
              options: [
                "Split the fetched word into opcode, destination register, source register or immediate. Drive the register file and ALU from those fields.",
                "Create a module with 16 registers, each 8 bits wide, plus two read ports and one write port. Use a 4-bit register address everywhere.",
                "On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
                "Drive both read ports from the addressed registers without a clock, so the ALU can consume two operands in the same cycle.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes \"Decode the fields\" as: Split the fetched word into opcode, destination register, source register or immediate. Drive the register file and ALU from those fields.",
            },
            {
              question: "Which statement best explains \"Fetch-Decode-Execute Cycle\"?",
              options: [
                "Fetch reads instruction_mem[PC], then PC <- PC + 1 word (2 bytes)",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"Fetch reads instruction_mem[PC], then PC <- PC + 1 word (2 bytes)\"",
            },
          ],
          flashcards: [
            {
              front: "Fetch-Decode-Execute cycle",
              back: "Fetch (read inst, inc PC) → Decode (extract fields) → Execute (ALU + write-back) → repeat (until HALT)",
            },
            {
              front: "PC (Program Counter)",
              back: "Holds the address of the next instruction to fetch; incremented each cycle",
            },
            {
              front: "How do you add program counter and instruction memory?",
              back: "Create a PC register and a 256-word instruction memory. Fetch the word at PC, then increment PC by one word (two bytes) before decode.",
            },
            {
              front: "How do you decode the fields?",
              back: "Split the fetched word into opcode, destination register, source register or immediate. Drive the register file and ALU from those fields.",
            },
            {
              front: "How do you execute and write back?",
              back: "Select the ALU operation from the opcode, route the result to the destination register or memory, and update flags.",
            },
            {
              front: "How do you implement control flow?",
              back: "For JMP, load PC with the target. For JZ, load PC only when the zero flag is set. For HALT, stop advancing and freeze the machine.",
            },
            {
              front: "How do you trace a program?",
              back: "Load a three-instruction program and print PC, instruction, register writes, and flags each cycle until HALT. Check the trace against your ISA table.",
            },
          ],
          sourceRef: {
            label: "CPU cycle",
            pageStart: null,
            pageEnd: null,
            note: "PC → imem → decode → rf → alu → wb → (halt?); clock-driven state machine",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Assembly Language and Programs",
      summary: "Write minimal assembly programs (addition, loop, sum 1..N) and simulate running them on your processor.",
      lessons: [
        {
          title: "Writing and Running Assembly Programs",
          objective: "Write an assembler for the 16-bit ISA and run three programs on the processor, checking final register and memory state.",
          hook: "From ISA encoding to running your first program — the moment the processor comes to life.",
          paragraphs: [
            "You'll write assembly using the 16-bit ISA and run three programs: (1) ADD loads two 8-bit values, adds them, and stores the result; (2) SUM loops from 1 to N and stores the total; (3) MEMORY writes and reads consecutive addresses. A testbench in Python or C initializes the register file, sets the PC, clocks the CPU, and dumps registers, flags, and memory so you can compare against expected values.",
          ],
          bullets: [
            "Program 1 (ADD): load two values, add them, halt; verify the destination register",
            "Program 2 (SUM 1..N): loop with a counter, accumulate, branch while non-zero, halt",
            "Program 3 (MEMORY): store values to consecutive addresses, read them back, compare",
            "Testbench: initialize registers, set PC, clock the CPU, and dump final state",
          ],
          steps: [
            {
              title: "Write a small assembler",
              detail: "Map mnemonics and register names to numbers, parse labels, resolve branch targets in a second pass, and emit 16-bit words.",
            },
            {
              title: "Program 1: arithmetic",
              detail: "Load two immediates with LDI, add them, store the result, and halt. Confirm the destination register and memory hold the expected sum.",
            },
            {
              title: "Program 2: a loop",
              detail: "Use a counter register, decrement it, and branch while non-zero. Verify the loop runs the exact number of times you intended.",
            },
            {
              title: "Program 3: memory",
              detail: "Store values to consecutive addresses, read them back, and compare. This exercises LOAD/STORE addressing and catches endianness mistakes.",
            },
            {
              title: "Debug with a trace",
              detail: "When a program fails, dump the instruction memory, PC, registers, and flags. Compare the first divergence from your expected trace.",
            },
          ],
          takeaway: "Writing and running assembly is the ultimate validation of an ISA and implementation: if the programs produce architecturally correct results, the design is sound.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "cpu",
                from: "asm",
                label: "write assembly",
              },
              {
                to: "tb",
                from: "asm",
                label: "specify test inputs",
              },
              {
                to: "regs",
                from: "cpu",
                label: "execute instructions",
              },
              {
                to: "tb",
                from: "cpu",
                label: "step or run N cycles",
              },
              {
                to: "result",
                from: "tb",
                label: "read registers, check values",
              },
            ],
            nodes: [
              {
                id: "asm",
                label: "Assembly program",
                emphasis: true,
              },
              {
                id: "tb",
                label: "Testbench",
                emphasis: true,
              },
              {
                id: "cpu",
                label: "CPU simulation",
                emphasis: true,
              },
              {
                id: "regs",
                label: "Register file",
                emphasis: false,
              },
              {
                id: "result",
                label: "Verified output",
                emphasis: true,
              },
            ],
            title: "Assembly program execution flow",
          },
          quiz: {
            question: "What does Program 2 (SUM 1..N) compute?",
            options: [
              "a + b",
              "1 + 2 + ... + N",
              "N x (N+1)",
              "N squared",
            ],
            correctIndex: 1,
            explanation: "Program 2 accumulates 1 + 2 + ... + N with a counter and a branch.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of \"Writing and Running Assembly Programs\"?",
              options: [
                "Program 1 (ADD): load two values, add them, halt; verify the destination register",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"Program 1 (ADD): load two values, add them, halt; verify the destination register\"",
            },
            {
              question: "Which of these is a hands-on step in \"Writing and Running Assembly Programs\"?",
              options: [
                "Write a small assembler",
                "Define the storage",
                "Implement synchronous writes",
                "Implement combinational reads",
              ],
              correctIndex: 0,
              explanation: "\"Write a small assembler\" is part of this lesson's build sequence.",
            },
            {
              question: "What does the hands-on step \"Program 1: arithmetic\" involve?",
              options: [
                "Load two immediates with LDI, add them, store the result, and halt. Confirm the destination register and memory hold the expected sum.",
                "Create a module with 16 registers, each 8 bits wide, plus two read ports and one write port. Use a 4-bit register address everywhere.",
                "On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
                "Drive both read ports from the addressed registers without a clock, so the ALU can consume two operands in the same cycle.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes \"Program 1: arithmetic\" as: Load two immediates with LDI, add them, store the result, and halt. Confirm the destination register and memory hold the expected sum.",
            },
            {
              question: "Which statement best explains \"Writing and Running Assembly Programs\"?",
              options: [
                "Program 2 (SUM 1..N): loop with a counter, accumulate, branch while non-zero, halt",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"Program 2 (SUM 1..N): loop with a counter, accumulate, branch while non-zero, halt\"",
            },
          ],
          flashcards: [
            {
              front: "Assembly program",
              back: "Sequence of ISA instructions (LOAD, ADD, SUB, branch, HALT) that the CPU executes",
            },
            {
              front: "Testbench",
              back: "Initializes state, clocks the CPU, reads final register values for verification",
            },
            {
              front: "How do you write a small assembler?",
              back: "Map mnemonics and register names to numbers, parse labels, resolve branch targets in a second pass, and emit 16-bit words.",
            },
            {
              front: "How do you program 1: arithmetic?",
              back: "Load two immediates with LDI, add them, store the result, and halt. Confirm the destination register and memory hold the expected sum.",
            },
            {
              front: "How do you program 2: a loop?",
              back: "Use a counter register, decrement it, and branch while non-zero. Verify the loop runs the exact number of times you intended.",
            },
            {
              front: "How do you program 3: memory?",
              back: "Store values to consecutive addresses, read them back, and compare. This exercises LOAD/STORE addressing and catches endianness mistakes.",
            },
            {
              front: "How do you debug with a trace?",
              back: "When a program fails, dump the instruction memory, PC, registers, and flags. Compare the first divergence from your expected trace.",
            },
          ],
          sourceRef: {
            label: "Assembly + testbench",
            pageStart: null,
            pageEnd: null,
            note: "Assembler for the 16-bit ISA; Program 1 (ADD), Program 2 (SUM 1..N), Program 3 (memory); testbench verifies final state",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Capstone: From Datapath to Pipelined CPU",
      summary: "Control logic, pipeline hazards, forwarding, caches, and branch prediction: what turns a working datapath into a credible processor.",
      lessons: [
        {
          title: "Capstone: Control, Pipelining, Hazards, and Caches",
          objective: "Implement control logic, a five-stage pipeline, forwarding, hazard detection, a data cache, and branch prediction on the 8-bit datapath.",
          hook: "A single-cycle CPU proves the datapath works. A pipelined CPU with caches is what makes the design fast enough to matter.",
          paragraphs: [
            "The control unit translates each instruction into signals: register write enable, ALU operation, memory read or write, and the next PC source. Hardwired control uses combinational logic and is fast but rigid; microcode stores a sequence of control words in a ROM and is easier to extend. Either way, the decoder must handle the full ISA, including immediate formats, branches, loads, and stores, and reserved encodings must fault rather than silently do nothing.",
            "Pipelining overlaps instruction stages to improve throughput, not single-instruction latency. A classic five-stage pipeline fetches, decodes, executes, accesses memory, and writes back. Hazards appear immediately: a load followed by a dependent instruction needs a stall, an ALU result can be forwarded from the execute stage, and a branch can fetch the wrong path. Forwarding paths, hazard-detection logic, and branch prediction keep the pipeline full without changing architectural results.",
            "Caches exist because memory is far slower than the ALU. A small direct-mapped or set-associative cache exploits temporal and spatial locality; a miss stalls the pipeline while the next level is fetched. Write-through versus write-back and write-allocate policies change traffic and complexity. Instruction and data caches are often split to avoid structural conflicts, and branch prediction plus speculation hide control hazards, provided mispredictions are flushed correctly.",
          ],
          bullets: [
            "Control signals select register writes, ALU operations, memory access, and the next PC",
            "Hardwired control is fast and rigid; microcode is slower but easier to extend",
            "Pipelining raises throughput by overlapping stages, not by shortening one instruction",
            "Forwarding resolves many data hazards; load-use hazards still require a stall",
            "Caches exploit locality, and miss latency usually dominates performance",
            "Branch prediction hides control hazards but mispredictions must flush younger instructions",
          ],
          steps: [
            {
              title: "Decode every instruction",
              detail: "Generate control signals for register-format, immediate, load, store, and branch instructions, and raise a fault on reserved opcodes.",
            },
            {
              title: "Split the datapath into stages",
              detail: "Add pipeline registers between fetch, decode, execute, memory, and write-back and verify a program still produces the same result.",
            },
            {
              title: "Add forwarding",
              detail: "Route results from execute and memory stages back to the ALU inputs and compare against a no-forwarding baseline.",
            },
            {
              title: "Detect load-use hazards",
              detail: "Stall fetch and decode for one cycle when an instruction depends on a load still in the memory stage.",
            },
            {
              title: "Add a data cache",
              detail: "Implement a small set-associative cache with tags and valid bits; measure hit rate on a loop-heavy program.",
            },
            {
              title: "Predict branches",
              detail: "Start with predict-not-taken, then a one-bit predictor, and flush the pipeline on a misprediction.",
            },
            {
              title: "Run the finished artifact",
              detail: "Assemble a loop, run it on the pipelined core, and compare the final register and memory state with the single-cycle baseline. Then disable the cache and compare cycle counts.",
            },
          ],
          takeaway: "A credible processor needs complete control, a pipeline that preserves architectural results under hazards, and a cache hierarchy that hides memory latency.",
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
                label: "Decode every instruction",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Split the datapath into stages",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Add forwarding",
                emphasis: false,
              },
              {
                id: "step-4",
                label: "Predict branches",
                emphasis: true,
              },
            ],
            title: "How Capstone: Control, Pipelining, Hazards, and Caches works",
          },
          quiz: {
            question: "What does pipelining improve?",
            options: [
              "Single-instruction latency",
              "Instruction throughput",
              "Clock frequency",
              "Cache size",
            ],
            correctIndex: 1,
            explanation: "Overlapping stages finishes more instructions per unit time without shortening one instruction.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of \"Capstone: Control, Pipelining, Hazards, and Caches\"?",
              options: [
                "Control signals select register writes, ALU operations, memory access, and the next PC",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"Control signals select register writes, ALU operations, memory access, and the next PC\"",
            },
            {
              question: "Which of these is a hands-on step in \"Capstone: Control, Pipelining, Hazards, and Caches\"?",
              options: [
                "Decode every instruction",
                "Define the storage",
                "Implement synchronous writes",
                "Implement combinational reads",
              ],
              correctIndex: 0,
              explanation: "\"Decode every instruction\" is part of this lesson's build sequence.",
            },
            {
              question: "What does the hands-on step \"Split the datapath into stages\" involve?",
              options: [
                "Add pipeline registers between fetch, decode, execute, memory, and write-back and verify a program still produces the same result.",
                "Create a module with 16 registers, each 8 bits wide, plus two read ports and one write port. Use a 4-bit register address everywhere.",
                "On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
                "Drive both read ports from the addressed registers without a clock, so the ALU can consume two operands in the same cycle.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes \"Split the datapath into stages\" as: Add pipeline registers between fetch, decode, execute, memory, and write-back and verify a program still produces the same result.",
            },
            {
              question: "Which statement best explains \"Capstone: Control, Pipelining, Hazards, and Caches\"?",
              options: [
                "Hardwired control is fast and rigid; microcode is slower but easier to extend",
                "16 registers x 8 bits = 128 bits of storage",
                "4-bit register numbers select any of the 16 registers",
                "Two combinational read ports feed both ALU operands in the same cycle",
              ],
              correctIndex: 0,
              explanation: "The lesson states: \"Hardwired control is fast and rigid; microcode is slower but easier to extend\"",
            },
          ],
          flashcards: [
            {
              front: "Control unit",
              back: "Logic that decodes an instruction and asserts the register, ALU, memory, and PC control signals needed to execute it.",
            },
            {
              front: "Hardwired vs microcoded control",
              back: "Hardwired control is fast combinational logic; microcode stores control words in ROM and is easier to extend.",
            },
            {
              front: "Load-use hazard",
              back: "A dependency on a load whose data is not yet available; requires a stall even when forwarding paths exist.",
            },
            {
              front: "Forwarding",
              back: "Bypassing a result from a later pipeline stage directly to the ALU input to avoid waiting for write-back.",
            },
            {
              front: "Cache locality",
              back: "Temporal locality reuses recently accessed data; spatial locality reuses nearby addresses, together making small caches effective.",
            },
            {
              front: "How do you decode every instruction?",
              back: "Generate control signals for register-format, immediate, load, store, and branch instructions, and raise a fault on reserved opcodes.",
            },
            {
              front: "How do you split the datapath into stages?",
              back: "Add pipeline registers between fetch, decode, execute, memory, and write-back and verify a program still produces the same result.",
            },
            {
              front: "How do you add forwarding?",
              back: "Route results from execute and memory stages back to the ALU inputs and compare against a no-forwarding baseline.",
            },
          ],
          sourceRef: {
            label: "Build Your Own Processor capstone",
            pageStart: null,
            pageEnd: null,
            note: "Complete build path from register file and ALU through ISA, datapath, and assembly, extended with control logic, pipelining, hazards, caches, and branch prediction.",
            sectionIndexes: [],
          },
          estimatedMinutes: 12,
        },
      ],
    },
  ],
};
