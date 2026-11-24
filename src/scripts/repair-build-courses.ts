/**
 * Repairs the six "Build Your Own" courses so each lesson is a coherent,
 * buildable sequence instead of a mix of source summary, duplicated bullets,
 * and half-updated specifications.
 *
 * - Removes bullets that merely repeat the lesson paragraph or restate "you'll implement".
 * - Adds a project-setup step to every course and an end-to-end acceptance step to every capstone.
 * - Rebuilds the processor course around one coherent 8-bit datapath (16 x 8-bit registers,
 *   16-bit instructions, PC in words) instead of mixing 8-bit and 16-bit descriptions.
 * - Fixes the sigmoid/softmax stability note and the sigmoid + cross-entropy gradient in the NN course.
 * - Makes the OS shell lesson deliver the external-program execution it promises.
 *
 * Run with DATABASE_URL=postgres://dave:dave@localhost:5439/db npx tsx src/scripts/repair-build-courses.ts
 */
import postgres from "postgres";
import { buildExampleBlock } from "../lib/lesson-aids";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

type Step = { title: string; detail: string };
type Patch = {
  objective?: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: Step[];
  citationQuote?: string;
};

const norm = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Older rewrites stored JSONB payloads as JSON strings; unwrap them. */
function asObject(value: unknown): Record<string, unknown> {
  let current = value;
  while (typeof current === "string") {
    try {
      current = JSON.parse(current);
    } catch {
      return {};
    }
  }
  return current && typeof current === "object" ? (current as Record<string, unknown>) : {};
}

const processorSteps = {
  registerFile: [
    {
      title: "Define the storage",
      detail:
        "Create a module with 16 registers, each 8 bits wide, plus two read ports and one write port. Use a 4-bit register address everywhere.",
    },
    {
      title: "Implement synchronous writes",
      detail:
        "On a clock edge, write the input value to the addressed register when write-enable is high. All 16 registers are writable.",
    },
    {
      title: "Implement combinational reads",
      detail:
        "Drive both read ports from the addressed registers without a clock, so the ALU can consume two operands in the same cycle.",
    },
    {
      title: "Test the register file",
      detail:
        "Write a distinct value to each register, read every one back through both ports, and confirm the last write wins.",
    },
  ],
  alu: [
    {
      title: "Implement the operations",
      detail:
        "Support ADD, SUB, AND, OR, XOR, NOT, SHL, and SHR on 8-bit inputs. Use two's complement for subtraction and keep the result 8 bits wide.",
    },
    {
      title: "Produce status flags",
      detail:
        "Compute zero (result == 0), sign (bit 7), and carry or borrow out of bit 7. These flags drive conditional branches later.",
    },
    {
      title: "Add an operation selector",
      detail:
        "Use a 3-bit selector and a case statement or multiplexer to choose the operation. Default to passing operand A through for unknown selector values.",
    },
    {
      title: "Test with vectors",
      detail:
        "Write a table of operand pairs and expected results, including overflow, negative numbers, and shift-by-zero. Run every row and print failures.",
    },
  ],
  isa: [
    {
      title: "Choose the instruction formats",
      detail:
        "Write down both 16-bit layouts: register format (opcode, rd, rs, reserved) and immediate format (opcode, rd, imm8). Confirm every field fits.",
    },
    {
      title: "Write the opcode table",
      detail:
        "List LDI, LOAD, STORE, ADD, SUB, AND, OR, XOR, JMP, JZ, HALT, and NOOP with opcode, operands, and semantics. Mark 0xC-0xF reserved.",
    },
    {
      title: "Build an encoder and decoder",
      detail:
        "Write functions that pack fields into a 16-bit word and unpack them back. Round-trip every instruction in the table to prove the layout is consistent.",
    },
    {
      title: "Document the semantics",
      detail:
        "For each instruction, state which registers change, how flags update, and whether it branches. This document becomes your test oracle.",
    },
  ],
  fetch: [
    {
      title: "Add program counter and instruction memory",
      detail:
        "Create a PC register and a 256-word instruction memory. Fetch the word at PC, then increment PC by one word (two bytes) before decode.",
    },
    {
      title: "Decode the fields",
      detail:
        "Split the fetched word into opcode, destination register, source register or immediate. Drive the register file and ALU from those fields.",
    },
    {
      title: "Execute and write back",
      detail:
        "Select the ALU operation from the opcode, route the result to the destination register or memory, and update flags.",
    },
    {
      title: "Implement control flow",
      detail:
        "For JMP, load PC with the target. For JZ, load PC only when the zero flag is set. For HALT, stop advancing and freeze the machine.",
    },
    {
      title: "Trace a program",
      detail:
        "Load a three-instruction program and print PC, instruction, register writes, and flags each cycle until HALT. Check the trace against your ISA table.",
    },
  ],
  assembly: [
    {
      title: "Write a small assembler",
      detail:
        "Map mnemonics and register names to numbers, parse labels, resolve branch targets in a second pass, and emit 16-bit words.",
    },
    {
      title: "Program 1: arithmetic",
      detail:
        "Load two immediates with LDI, add them, store the result, and halt. Confirm the destination register and memory hold the expected sum.",
    },
    {
      title: "Program 2: a loop",
      detail:
        "Use a counter register, decrement it, and branch while non-zero. Verify the loop runs the exact number of times you intended.",
    },
    {
      title: "Program 3: memory",
      detail:
        "Store values to consecutive addresses, read them back, and compare. This exercises LOAD/STORE addressing and catches endianness mistakes.",
    },
    {
      title: "Debug with a trace",
      detail:
        "When a program fails, dump the instruction memory, PC, registers, and flags. Compare the first divergence from your expected trace.",
    },
  ],
  capstone: [
    {
      title: "Decode every instruction",
      detail:
        "Generate control signals for register-format, immediate, load, store, and branch instructions, and raise a fault on reserved opcodes.",
    },
    {
      title: "Split the datapath into stages",
      detail:
        "Add pipeline registers between fetch, decode, execute, memory, and write-back and verify a program still produces the same result.",
    },
    {
      title: "Add forwarding",
      detail:
        "Route results from execute and memory stages back to the ALU inputs and compare against a no-forwarding baseline.",
    },
    {
      title: "Detect load-use hazards",
      detail:
        "Stall fetch and decode for one cycle when an instruction depends on a load still in the memory stage.",
    },
    {
      title: "Add a data cache",
      detail:
        "Implement a small set-associative cache with tags and valid bits; measure hit rate on a loop-heavy program.",
    },
    {
      title: "Predict branches",
      detail:
        "Start with predict-not-taken, then a one-bit predictor, and flush the pipeline on a misprediction.",
    },
  ],
};

const setupStep = (detail: string): Step => ({ title: "Set up the project", detail });
const acceptanceStep = (detail: string): Step => ({ title: "Run the finished artifact", detail });

const setupSteps: Record<string, string> = {
  "Build Your Own Database":
    "Pick a language with file I/O and a test runner (Go, Rust, or Python). Create src/, tests/, and one command that runs the suite. Keep a tiny key-value API (put, get, scan) as the seam every lesson plugs into.",
  "Build Your Own Blockchain":
    "Pick a language with SHA-256 and an Ed25519 or ECDSA library (Go, Rust, Python, or TypeScript). Create blockchain/, tests/, and a CLI entry point. Define the Block and Chain module boundaries before coding.",
  "Build Your Own Neural Network":
    "Use Python with NumPy only for data loading, not for the network math, or another language with arrays. Create nn/ and tests/, plus a script that runs one forward pass on fixed inputs.",
  "Build Your Own Processor":
    "Pick a hardware description language (Verilog or VHDL) or a software simulator in Python/C. Create rtl/ or sim/ plus a testbench that clocks the design and dumps registers. Standardize on 8-bit data and 16-bit instructions.",
  "Build Your Own Programming Language":
    "Pick a language with pattern matching and a test runner (Rust, Go, OCaml, or TypeScript). Create lexer/, parser/, runtime/, tests/, and a CLI that reads a source file.",
  "Build Your Own Operating System":
    "Create boot/, kernel/, drivers/, fs/, and a Makefile that builds boot.bin, kernel.bin, and a disk image. Add a run target that launches QEMU so every later lesson boots the same image.",
};

const acceptanceSteps: Record<string, string> = {
  "Build Your Own Database":
    "Start the server, create a table, insert rows, commit a transaction, kill the process, restart, and verify committed rows survive. Run a point lookup and a range scan against the same data.",
  "Build Your Own Blockchain":
    "Start two nodes, mine a block on each, exchange chains, and confirm both converge. Submit a signed transaction, mine it, and verify the balance and a Merkle inclusion proof.",
  "Build Your Own Neural Network":
    "Train on a real dataset (XOR or a small CSV), save the weights, reload them, and confirm the reloaded model reproduces the same predictions and test metrics.",
  "Build Your Own Operating System":
    "Boot the image in QEMU, run ls and cat on a file, then execute a user program. Confirm a page fault and a syscall both return control to the kernel.",
  "Build Your Own Processor":
    "Assemble a loop, run it on the pipelined core, and compare the final register and memory state with the single-cycle baseline. Then disable the cache and compare cycle counts.",
  "Build Your Own Programming Language":
    "Write a program that uses closures, recursion, and a deliberate type error, then run it through the interpreter and the bytecode VM. Confirm both produce the same output and the type error points at the right line.",
};

/** Citation quotes that describe rewritten lessons; keeps the UI citation in sync. */
const citationQuotes: Record<string, string> = {
  "Build Your Own Processor::ALU: Arithmetic and Logic Operations":
    "ADD, SUB, AND, OR, XOR, NOT, SHL, SHR; 8-bit result; Z, N, C flags",
  "Build Your Own Processor::Writing and Running Assembly Programs":
    "Assembler for the 16-bit ISA; Program 1 (ADD), Program 2 (SUM 1..N), Program 3 (memory); testbench verifies final state",
  "Build Your Own Neural Network::Backpropagation: Gradients through the Network":
    "Sigmoid + cross-entropy: δ² = y_hat − y_true; ∂L/∂W² = hiddenᵀ · δ²; δ¹ = (δ² · W2ᵀ) ⊙ σ'(X·W1+b1); ∂L/∂W¹ = Xᵀ · δ¹",
  "Build Your Own Operating System::Writing a Minimal Bootloader":
    "GDT, A20 line, BIOS int 0x13 kernel load, protected mode, far jump to the kernel entry at 0x10000",
  "Build Your Own Operating System::Simple Command Shell":
    "Line input, argv tokenizing, built-ins (help, clear, echo, ls, cat, exit), loading a flat binary from FAT16",
  "Build Your Own Programming Language::Writing an Interpreter":
    "Visitor pattern on AST; environment for vars; control flow; REPL that reads, evaluates, and prints",
};

const capstoneObjectives: Record<string, string> = {
  "Build Your Own Database":
    "Implement the pieces a minimal database needs before it can safely store real data: a write-ahead log, atomic transactions, compaction, a query planner, and a client protocol.",
  "Build Your Own Blockchain":
    "Implement ownership, tamper evidence, consensus under competing chains, and a scaling extension on top of the basic block-and-PoW loop.",
  "Build Your Own Operating System":
    "Implement how a kernel takes control from hardware, isolates user programs with paging and privilege levels, exposes syscalls, and drives devices.",
  "Build Your Own Programming Language":
    "Implement symbol tables, type checking, function calls, closures, and a bytecode runtime on top of the parser and evaluator.",
};

const processorPatches: Record<string, Patch> = {
  "Register File: 16 General-Purpose Registers": {
    objective:
      "Implement a register file with 16 general-purpose 8-bit registers and two read ports plus one write port.",
    paragraphs: [
      "A register file holds the CPU's working values. This processor has 16 general-purpose registers, each 8 bits wide, addressed by a 4-bit register number. Two read ports output the selected registers combinationally in the same cycle, and one write port updates a register on the rising clock edge when write-enable is high. All 16 registers are usable; there is no hardwired zero register.",
    ],
    bullets: [
      "16 registers x 8 bits = 128 bits of storage",
      "4-bit register numbers select any of the 16 registers",
      "Two combinational read ports feed both ALU operands in the same cycle",
      "A synchronous write port updates one register on the clock edge when write-enable is high",
    ],
    steps: processorSteps.registerFile,
  },
  "ALU: Arithmetic and Logic Operations": {
    objective:
      "Design an 8-bit ALU that supports ADD, SUB, AND, OR, XOR, NOT, SHL, and SHR, with Z, N, and C flags.",
    paragraphs: [
      "The Arithmetic Logic Unit takes two 8-bit inputs (from the register file or an immediate) and a 3-bit function selector, and produces an 8-bit result plus status flags. The operations are ADD, SUB, AND, OR, XOR, NOT, SHL, and SHR. Subtraction uses two's complement. The flags are Z (result is zero), N (result bit 7 is 1), and C (carry out of bit 7, or borrow for subtraction).",
    ],
    bullets: [
      "Two 8-bit inputs A and B feed the ALU from registers or an immediate",
      "A 3-bit selector chooses one of eight operations",
      "The result is 8 bits wide; subtraction uses two's complement",
      "Z, N, and C flags record zero, sign, and carry/borrow outcomes",
    ],
    steps: processorSteps.alu,
  },
  "Instruction Set Architecture (ISA)": {
    objective:
      "Define a 16-bit instruction encoding with a 4-bit opcode and 4-bit register fields, plus a 12-instruction base set.",
    paragraphs: [
      "Every instruction is 16 bits. Register-format instructions use bits 15-12 for the opcode, 11-8 for the destination register, 7-4 for the source register, and 3-0 as reserved zero. Immediate-format instructions use bits 15-12 for the opcode, 11-8 for the destination register, and 7-0 for an 8-bit immediate or address. Four-bit register fields address all 16 registers. The base set is LDI, LOAD, STORE, ADD, SUB, AND, OR, XOR, JMP, JZ, HALT, and NOOP; opcodes 0xC-0xF are reserved and fault.",
    ],
    bullets: [
      "Register format: opcode(4) | rd(4) | rs(4) | reserved(4)",
      "Immediate format: opcode(4) | rd(4) | imm(8) for loads, stores, and branches",
      "4-bit register fields address all 16 registers",
      "12 base instructions; opcodes 0xC-0xF fault instead of executing",
    ],
    steps: processorSteps.isa,
    citationQuote:
      "16-bit instruction: opcode(4)+rd(4)+rs(4)+reserved(4) or opcode(4)+rd(4)+imm(8); 12 base instructions",
  },
  "Fetch-Decode-Execute Cycle": {
    objective:
      "Implement the program counter, 256-word instruction memory, fetch-decode-execute cycle, and register write-back.",
    paragraphs: [
      "The CPU cycle repeats three steps. Fetch reads the 16-bit instruction at instruction_mem[PC] and increments PC by one word, which is two bytes in a byte-addressed memory. Decode extracts the 4-bit opcode and the register or immediate fields. Execute reads up to two registers, drives the ALU, writes the result back, and updates flags. HALT freezes the PC. The state machine advances on each clock edge.",
    ],
    bullets: [
      "PC is a word index into a 256-word instruction memory",
      "Fetch reads instruction_mem[PC], then PC <- PC + 1 word (2 bytes)",
      "Decode extracts the opcode and register/immediate fields from the 16-bit word",
      "Execute reads registers, runs the ALU, writes back, and updates flags",
    ],
    steps: processorSteps.fetch,
  },
  "Writing and Running Assembly Programs": {
    objective:
      "Write an assembler for the 16-bit ISA and run three programs on the processor, checking final register and memory state.",
    paragraphs: [
      "You'll write assembly using the 16-bit ISA and run three programs: (1) ADD loads two 8-bit values, adds them, and stores the result; (2) SUM loops from 1 to N and stores the total; (3) MEMORY writes and reads consecutive addresses. A testbench in Python or C initializes the register file, sets the PC, clocks the CPU, and dumps registers, flags, and memory so you can compare against expected values.",
    ],
    bullets: [
      "Program 1 (ADD): load two values, add them, halt; verify the destination register",
      "Program 2 (SUM 1..N): loop with a counter, accumulate, branch while non-zero, halt",
      "Program 3 (MEMORY): store values to consecutive addresses, read them back, compare",
      "Testbench: initialize registers, set PC, clock the CPU, and dump final state",
    ],
    steps: processorSteps.assembly,
  },
  "Capstone: Control, Pipelining, Hazards, and Caches": {
    objective:
      "Implement control logic, a five-stage pipeline, forwarding, hazard detection, a data cache, and branch prediction on the 8-bit datapath.",
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
    steps: [...processorSteps.capstone, acceptanceStep(acceptanceSteps["Build Your Own Processor"])],
  },
};

const neuralPatches: Record<string, Patch> = {
  "Sigmoid Activation and Derivative": {
    paragraphs: [
      "Sigmoid squashes any real number into (0, 1), interpretable as a probability. Its derivative, crucial for backpropagation, has a compact form: σ'(x) = σ(x) · (1 − σ(x)). You'll implement both the forward pass (compute σ(x)) and the backward pass (compute the gradient for chain-rule propagation).",
    ],
    bullets: [
      "Forward: σ(x) = 1 / (1 + e⁻ˣ); clamp extreme inputs to avoid overflow",
      "Backward: σ'(x) = σ(x) · (1 − σ(x)); reuse the forward value",
      "Numerical stability: clamp x or guard the exponential; subtracting max(x) is a softmax trick, not a sigmoid one",
      "Test: σ(0) = 0.5, σ(∞) → 1, σ(−∞) → 0",
    ],
  },
  "Backpropagation: Gradients through the Network": {
    paragraphs: [
      "Given a binary cross-entropy loss L and a sigmoid output, the output error simplifies to δ² = y_hat − y_true. Then ∂L/∂W² = hiddenᵀ · δ² and ∂L/∂b² = sum(δ²). Propagate to the hidden layer: δ¹ = (δ² · W2ᵀ) ⊙ σ'(X·W1 + b1), then ∂L/∂W¹ = Xᵀ · δ¹ and ∂L/∂b¹ = sum(δ¹). If you use mean squared error instead, multiply δ² by σ'(z²) before continuing. This is the essence of backpropagation.",
    ],
    bullets: [
      "Output error for sigmoid + cross-entropy: δ² = y_hat − y_true (multiply by σ'(z²) only for MSE)",
      "Output gradients: ∂L/∂W² = hiddenᵀ · δ², ∂L/∂b² = sum(δ²)",
      "Hidden error: δ¹ = (δ² · W2ᵀ) ⊙ σ'(X·W1 + b1)",
      "Hidden gradients: ∂L/∂W¹ = Xᵀ · δ¹, ∂L/∂b¹ = sum(δ¹)",
    ],
  },
};

/**
 * Quiz answers that quote lesson text this script rewrote. Each entry maps the
 * old correct option to the sentence that replaced it, so a claim question never
 * points at a sentence the learner cannot find.
 */
const claimAnswerFixes: { course: string; lesson: string; from: string; to: string }[] = [
  {
    course: "Build Your Own Operating System",
    lesson: "Simple Command Shell",
    from: "Read a line of input from stdin (serial port or keyboard)",
    to: "Read a line from the keyboard or serial port and echo it to VGA",
  },
  {
    course: "Build Your Own Operating System",
    lesson: "Writing a Minimal Bootloader",
    from: "Set up GDT with at least one code segment descriptor",
    to: "Set up a GDT with at least one code segment descriptor",
  },
  {
    course: "Build Your Own Neural Network",
    lesson: "Sigmoid Activation and Derivative",
    from: "Forward: σ(x) = 1 / (1 + e⁻ˣ), clip extreme inputs to avoid overflow",
    to: "Forward: σ(x) = 1 / (1 + e⁻ˣ); clamp extreme inputs to avoid overflow",
  },
  {
    course: "Build Your Own Neural Network",
    lesson: "Backpropagation: Gradients through the Network",
    from: "Output error: δ² = (y_hat − y_true) ⊙ σ'(·) — the gradient of cross-entropy with sigmoid",
    to: "Output error for sigmoid + cross-entropy: δ² = y_hat − y_true (multiply by σ'(z²) only for MSE)",
  },
  {
    course: "Build Your Own Programming Language",
    lesson: "Writing a Compiler",
    from: "Walk the AST and emit corresponding x86 assembly instructions",
    to: "Walk the AST and emit corresponding x86-64 assembly instructions",
  },
];

/** Flashcard backs that repeat text this script rewrote. */
const flashcardFixes: { course: string; lesson: string; front: string; back?: string; newFront?: string }[] = [
  {
    course: "Build Your Own Operating System",
    lesson: "Simple Command Shell",
    front: "Built-in vs external command",
    back: "Built-in (help, clear, echo, ls, cat, exit) runs inside the kernel; an external program is loaded from FAT16 into a fixed buffer and run until it returns to the shell.",
  },
  {
    course: "Build Your Own Programming Language",
    lesson: "Writing a Compiler",
    front: "How do you choose a target?",
    newFront: "How do you fix the target and calling convention?",
    back: "Emit x86-64 assembly for the System V ABI: arguments in rdi/rsi/rdx/rcx/r8/r9, integer return in rax. Provide a `_start` or a C `main` that calls your generated entry so the binary links.",
  },
];

/** Cards that the rewritten lessons need and the old generator never produced. */
const flashcardAdds: { course: string; lesson: string; front: string; back: string }[] = [
  {
    course: "Build Your Own Programming Language",
    lesson: "Writing an Interpreter",
    front: "How do you add a REPL?",
    back: "Print a prompt, read a line from stdin, run the lexer, parser, and evaluator on it, and print the value of an expression statement. Catch errors per line so one bad command does not end the session.",
  },
];

async function fixFlashcards() {
  let updated = 0;
  for (const fix of flashcardFixes) {
    const rows = await sql<{ id: string; back: string }[]>`
      select f.id, f.back
      from flashcards f
      join lessons l on l.id = f.lesson_id
      join courses c on c.id = l.course_id
      where c.title = ${fix.course} and l.title = ${fix.lesson} and f.front = ${fix.front}
    `;
    for (const row of rows) {
      if (fix.newFront) {
        await sql`update flashcards set front = ${fix.newFront} where id = ${row.id}`;
      }
      if (fix.back) {
        await sql`update flashcards set back = ${fix.back} where id = ${row.id}`;
      }
      updated += 1;
    }
  }

  for (const add of flashcardAdds) {
    const [lesson] = await sql<{ id: string; courseId: string }[]>`
      select l.id, l.course_id as "courseId"
      from lessons l join courses c on c.id = l.course_id
      where c.title = ${add.course} and l.title = ${add.lesson}
    `;
    if (!lesson) continue;
    const [{ count }] = await sql<{ count: number }[]>`
      select count(*)::int as count from flashcards where lesson_id = ${lesson.id}
    `;
    if (count >= 8) continue;
    const existing = await sql<{ id: string }[]>`
      select id from flashcards where lesson_id = ${lesson.id} and front = ${add.front}
    `;
    if (existing.length) continue;
    await sql`
      insert into flashcards (lesson_id, course_id, concept, front, back)
      values (${lesson.id}, ${lesson.courseId}, ${add.lesson}, ${add.front}, ${add.back})
    `;
    updated += 1;
  }
  return updated;
}

/** Module summaries that overpromise or contradict the lessons underneath. */
const moduleSummaryFixes: { course: string; module: string; summary: string }[] = [
  {
    course: "Build Your Own Processor",
    module: "Control Unit and Instruction Set",
    summary:
      "Define the 16-bit instruction encoding and the control signals that select registers, ALU operations, memory access, and the next PC.",
  },
  {
    course: "Build Your Own Processor",
    module: "Datapath: Fetch-Decode-Execute Cycle",
    summary:
      "Implement the state machine that fetches instructions, decodes the fields, and executes them as ALU or memory operations with write-back.",
  },
  {
    course: "Build Your Own Neural Network",
    module: "Network Architecture: Forward Propagation",
    summary:
      "Build a 2-layer (input→hidden→output) network, compute predictions, and cache the values backpropagation needs.",
  },
  {
    course: "Build Your Own Operating System",
    module: "Storage and Filesystem",
    summary:
      "Parse a FAT16 volume from a raw disk image: boot sector, FAT, root directory, and cluster chains, then read a file into memory.",
  },
];

async function fixModuleSummaries() {
  let updated = 0;
  for (const fix of moduleSummaryFixes) {
    const rows = await sql<{ id: string }[]>`
      select m.id
      from modules m join courses c on c.id = m.course_id
      where c.title = ${fix.course} and m.title = ${fix.module}
    `;
    for (const row of rows) {
      await sql`update modules set summary = ${fix.summary} where id = ${row.id}`;
      updated += 1;
    }
  }
  return updated;
}

async function fixClaimAnswers() {
  let updated = 0;
  for (const fix of claimAnswerFixes) {
    const rows = await sql<{ id: string }[]>`
      select o.id
      from quiz_options o
      join questions q on q.id = o.question_id
      join quizzes z on z.id = q.quiz_id
      join lessons l on l.id = z.lesson_id
      join courses c on c.id = l.course_id
      where c.title = ${fix.course}
        and l.title = ${fix.lesson}
        and o.is_correct
        and o.label = ${fix.from}
    `;
    for (const row of rows) {
      await sql`update quiz_options set label = ${fix.to} where id = ${row.id}`;
      updated += 1;
    }
  }
  return updated;
}

const osPatches: Record<string, Patch> = {
  "Writing a Minimal Bootloader": {
    objective:
      "Write a bootloader that switches to protected mode, loads the kernel from disk, and jumps to its entry point.",
    paragraphs: [
      "Using NASM or gcc, you'll write a bootloader that sets up a minimal GDT, loads the kernel from disk with BIOS int 0x13, enables the A20 line, turns on protected mode, and far-jumps to the kernel entry point. The kernel then writes characters to video memory at 0xB8000. This is the 'Hello, world' of OS development: the first 512 bytes hand control to code you wrote.",
    ],
    bullets: [
      "Set up a GDT with at least one code segment descriptor",
      "Enable the A20 line (address line 20, needed for >1MB memory)",
      "Load kernel.bin with BIOS int 0x13 while still in real mode",
      "Set the PE bit in CR0 to enter protected mode",
      "Far-jump to the kernel entry point so it runs in your flat code segment",
      "The boot sector must end with the 0xAA55 signature, or the BIOS will refuse to treat it as bootable.",
    ],
    steps: [
      {
        title: "Build a GDT",
        detail: "Define a null descriptor, a flat 32-bit code descriptor (base 0, limit 0xfffff, granularity 4K, access 0x9a), and a data descriptor (access 0x92). Load it with `lgdt [gdt_descriptor]`.",
      },
      {
        title: "Enable the A20 line",
        detail: "Use BIOS int 0x15, ax=0x2401, or the fast A20 port 0x92. Without A20, addresses above 1 MiB wrap around and your kernel cannot load.",
      },
      {
        title: "Load the kernel from disk",
        detail: "Still in real mode, call BIOS int 0x13, ah=0x02 to read the kernel's sectors into a known segment:offset such as 0x1000:0x0000 (physical 0x10000). Retry on carry set, and record how many sectors you read so the kernel entry address is fixed.",
      },
      {
        title: "Switch to protected mode",
        detail: "Set CR0 bit 0 (PE), then far-jump to a 32-bit code selector so the CPU reloads CS with the new descriptor.",
      },
      {
        title: "Jump to the kernel entry",
        detail: "Far-jump to the load address (0x10000) with your flat code segment selected. The kernel's first instructions should write a character to 0xB8000 and then spin in `cli; hlt` until you add interrupts.",
      },
      {
        title: "Verify the boot path",
        detail: "Run QEMU with `-d int` or attach gdb: CR0.PE must be 1, EIP must land at the kernel entry, and the kernel must print. A triple fault here means a bad GDT base, a wrapped address from A20, or a wrong load segment.",
      },
    ],
  },
  "Simple Command Shell": {
    objective:
      "Implement a shell that reads input, parses commands, runs built-ins, and loads a flat binary program from disk.",
    paragraphs: [
      "The shell is the user's primary interface to your OS. You'll read lines from stdin, split them into arguments, dispatch built-in commands, and load a flat binary from the FAT16 filesystem into a fixed buffer and jump to its entry point. Built-ins such as help, clear, echo, ls, cat, and exit run inside the kernel; external programs return to the shell through a known return address or a trap.",
    ],
    bullets: [
      "Read a line from the keyboard or serial port and echo it to VGA",
      "Tokenize the line into a command name and an argv array",
      "Run built-ins in the kernel: help, clear, echo, ls, cat, exit",
      "Load a flat binary from the FAT16 filesystem at a fixed address and jump to it",
    ],
    steps: [
      {
        title: "Read a line",
        detail:
          "Poll the keyboard or use your serial input, echo characters to VGA, handle backspace, and terminate on Enter.",
      },
      {
        title: "Tokenize the command",
        detail:
          "Split on spaces into argv, preserving the command name. Handle empty input and a fixed maximum number of arguments.",
      },
      {
        title: "Dispatch built-ins",
        detail:
          "Implement help, clear, echo, ls, cat, and exit using your FAT16 reader. Compare argv[0] against a table of names and call the matching function.",
      },
      {
        title: "Load and run an external program",
        detail:
          "Read a flat binary from the FAT16 filesystem into a fixed buffer, jump to its entry point, and return to the shell through a known return address or a trap. Test with a tiny program that prints a character and returns.",
      },
      {
        title: "Add a prompt loop",
        detail:
          "Print a prompt, read, execute, and repeat forever. Keep the loop small so a bad command prints an error instead of halting the kernel.",
      },
      {
        title: "Try it end to end",
        detail:
          "Boot the image, run ls to list the root directory, cat a known file, clear the screen, and run the external test program. Confirm each output matches the disk contents.",
      },
    ],
  },
};

const plPatches: Record<string, Patch> = {
  "Writing an Interpreter": {
    objective:
      "Implement a visitor that walks the AST and executes each node, then wrap it in a REPL that reads, evaluates, and prints.",
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
  },
  "Writing a Compiler": {
    objective:
      "Implement a code generator that emits x86-64 assembly from the AST, then assemble and run it.",
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
  },
};

const capstoneFinalSteps: Record<string, string> = {
  "Build Your Own Database": acceptanceSteps["Build Your Own Database"],
  "Build Your Own Blockchain": acceptanceSteps["Build Your Own Blockchain"],
  "Build Your Own Neural Network": acceptanceSteps["Build Your Own Neural Network"],
  "Build Your Own Operating System": acceptanceSteps["Build Your Own Operating System"],
  "Build Your Own Programming Language": acceptanceSteps["Build Your Own Programming Language"],
};

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

async function rebuildBlocks(lesson: {
  id: string;
  objective: string;
  hook: string;
  title: string;
  keyTakeaway: string;
}) {
  const rawBlocks = await sql<
    { id: string; position: number; type: string; payload: Record<string, unknown> }[]
  >`select id, position, type, payload from content_blocks where lesson_id = ${lesson.id} order by position`;
  const blocks = rawBlocks.map((block) => ({ ...block, payload: asObject(block.payload) }));

  const paragraphTexts = blocks.filter((b) => b.type === "paragraph").map((b) => String(b.payload.text ?? ""));
  const bulletsBlock = blocks.find((b) => b.type === "bullets");
  const stepsBlock = blocks.find((b) => b.type === "steps");
  const diagramBlock = blocks.find((b) => b.type === "diagram");
  const takeawayBlock = blocks.find((b) => b.type === "takeaway");

  // Safety net: an earlier revision of this script read a payload shape it did
  // not understand and wrote back empty text/items. Never let that happen again.
  if (blocks.length === 0) {
    throw new Error(`no content blocks found for ${lesson.title}`);
  }
  if (blocks.some((b) => b.type === "paragraph" && !String(b.payload.text ?? "").trim())) {
    throw new Error(`empty paragraph payload for ${lesson.title}`);
  }
  const sourceBulletCount = ((bulletsBlock?.payload.items as string[] | undefined) ?? []).length;
  const sourceStepCount = ((stepsBlock?.payload.items as Step[] | undefined) ?? []).length;

  let bullets = ((bulletsBlock?.payload.items as string[] | undefined) ?? []).slice();
  const paragraphBlob = norm(paragraphTexts.join(" "));
  bullets = bullets.filter((bullet) => {
    const value = norm(bullet);
    const echoesParagraph = value.length > 40 && paragraphBlob.includes(value);
    const generic = /^(you'll|you will|this lesson|learn how|understand )/i.test(bullet.trim()) && value.length > 40;
    return !echoesParagraph && !generic;
  });
  bullets = [...new Set(bullets)];

  let steps = ((stepsBlock?.payload.items as Step[] | undefined) ?? []).slice();

  const course = await sql<{ title: string }[]>`
    select c.title from courses c join lessons l on l.course_id = c.id where l.id = ${lesson.id}
  `;
  const courseTitle = course[0]?.title ?? "";
  const patch: Patch = {};

  if (courseTitle === "Build Your Own Processor") {
    const processorPatch = processorPatches[lesson.title];
    if (processorPatch) Object.assign(patch, processorPatch);
  } else if (courseTitle === "Build Your Own Neural Network") {
    const neuralPatch = neuralPatches[lesson.title];
    if (neuralPatch) Object.assign(patch, neuralPatch);
  } else if (courseTitle === "Build Your Own Operating System") {
    const osPatch = osPatches[lesson.title];
    if (osPatch) Object.assign(patch, osPatch);
  } else if (courseTitle === "Build Your Own Programming Language") {
    const plPatch = plPatches[lesson.title];
    if (plPatch) Object.assign(patch, plPatch);
  }

  if (patch.bullets) bullets = patch.bullets;
  if (patch.steps) steps = patch.steps;

  const isFirstLesson =
    (await sql`select count(*)::int as count from lessons where course_id = (select course_id from lessons where id = ${lesson.id}) and position < (select position from lessons where id = ${lesson.id})`)[0]!.count === 0;
  const isLastLesson =
    (await sql`select count(*)::int as count from lessons where course_id = (select course_id from lessons where id = ${lesson.id}) and position > (select position from lessons where id = ${lesson.id})`)[0]!.count === 0;

  if (isFirstLesson && setupSteps[courseTitle] && !steps.some((step) => norm(step.title) === "set up the project")) {
    steps = [setupStep(setupSteps[courseTitle]!), ...steps];
  }
  if (isLastLesson && capstoneFinalSteps[courseTitle] && !steps.some((step) => norm(step.title) === "run the finished artifact")) {
    steps = [...steps, acceptanceStep(capstoneFinalSteps[courseTitle]!)];
  }

  if (sourceBulletCount > 0 && bullets.length === 0) {
    throw new Error(`refusing to write empty bullets for ${lesson.title}`);
  }
  if (sourceStepCount > 0 && steps.length === 0) {
    throw new Error(`refusing to write empty steps for ${lesson.title}`);
  }

  const objectives = patch.objective ?? (isLastLesson ? capstoneObjectives[courseTitle] : undefined) ?? lesson.objective;
  await sql`update lessons set objective = ${objectives} where id = ${lesson.id}`;

  const quote = patch.citationQuote ?? citationQuotes[`${courseTitle}::${lesson.title}`];
  if (quote) {
    await sql`update citations set quote = ${quote} where lesson_id = ${lesson.id}`;
  }

  const paragraphs = patch.paragraphs ?? paragraphTexts;
  const hookText = String((blocks.find((b) => b.type === "hook")?.payload.text as string | undefined) ?? lesson.hook);
  const takeawayText = String(
    (takeawayBlock?.payload.text as string | undefined) ?? lesson.keyTakeaway,
  );

  const rebuilt: { type: string; payload: Record<string, unknown> }[] = [
    { type: "hook", payload: { type: "hook", text: hookText } },
    ...paragraphs.map((text) => ({ type: "paragraph", payload: { type: "paragraph", text } })),
    { type: "bullets", payload: { type: "bullets", items: bullets } },
  ];
  const example = buildExampleBlock(steps);
  if (example) rebuilt.push({ type: "example", payload: example as unknown as Record<string, unknown> });
  rebuilt.push({ type: "steps", payload: { type: "steps", title: "Do it yourself", items: steps } });
  if (diagramBlock) rebuilt.push({ type: "diagram", payload: diagramBlock.payload });
  rebuilt.push({ type: "takeaway", payload: { type: "takeaway", text: takeawayText } });

  await sql`delete from content_blocks where lesson_id = ${lesson.id}`;
  for (const [index, block] of rebuilt.entries()) {
    await sql`
      insert into content_blocks (lesson_id, position, type, payload)
      values (${lesson.id}, ${index}, ${block.type}, ${sql.json(block.payload as unknown as never)})
    `;
  }

  return { steps, bullets, paragraphs, courseTitle };
}

async function regenerateProcessorAssessment(
  lessonId: string,
  lessonTitle: string,
  steps: Step[],
  bullets: string[],
) {
  const courseLessons = await sql<{ title: string; bullets: string[]; steps: Step[] }[]>`
    select l.title,
           coalesce((select payload->'items' from content_blocks where lesson_id = l.id and type = 'bullets'), '[]'::jsonb) as bullets,
           coalesce((select payload->'items' from content_blocks where lesson_id = l.id and type = 'steps'), '[]'::jsonb) as steps
    from lessons l join courses c on c.id = l.course_id
    where c.title = 'Build Your Own Processor'
    order by l.position
  `;

  const otherLessons = courseLessons.filter((item) => item.title !== lessonTitle);
  const pick = (items: string[], index = 0) => items[index] ?? items[0] ?? "";

  const q1: Record<string, { question: string; options: string[]; correctIndex: number; explanation: string }> = {
    "Register File: 16 General-Purpose Registers": {
      question: "How many bits are needed to address 16 registers?",
      options: ["4", "8", "16", "32"],
      correctIndex: 0,
      explanation: "log2(16) = 4 bits can address all 16 registers.",
    },
    "ALU: Arithmetic and Logic Operations": {
      question: "Which ALU operation computes the bitwise AND of A and B?",
      options: ["ADD", "SUB", "AND", "OR"],
      correctIndex: 2,
      explanation: "The ALU selects AND when the function selector chooses it; the result is A & B.",
    },
    "Instruction Set Architecture (ISA)": {
      question: "In the immediate format [opcode(4) | rd(4) | imm(8)], bits 7-0 are the:",
      options: ["4-bit opcode", "destination register", "source register", "8-bit immediate or address"],
      correctIndex: 3,
      explanation: "Immediate-format instructions use bits 7-0 for an 8-bit immediate or memory address.",
    },
    "Fetch-Decode-Execute Cycle": {
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
    "Writing and Running Assembly Programs": {
      question: "What does Program 2 (SUM 1..N) compute?",
      options: ["a + b", "1 + 2 + ... + N", "N x (N+1)", "N squared"],
      correctIndex: 1,
      explanation: "Program 2 accumulates 1 + 2 + ... + N with a counter and a branch.",
    },
    "Capstone: Control, Pipelining, Hazards, and Caches": {
      question: "What does pipelining improve?",
      options: ["Single-instruction latency", "Instruction throughput", "Clock frequency", "Cache size"],
      correctIndex: 1,
      explanation: "Overlapping stages finishes more instructions per unit time without shortening one instruction.",
    },
  };

  const first = q1[lessonTitle];
  if (!first) return;

  const otherBullets = otherLessons.flatMap((item) => item.bullets).filter(Boolean);
  const otherStepTitles = otherLessons
    .flatMap((item) => item.steps.map((step) => step.title))
    .filter((title) => norm(title) !== "set up the project");
  const otherStepDetails = otherLessons
    .flatMap((item) =>
      item.steps
        .filter((step) => norm(step.title) !== "set up the project")
        .map((step) => step.detail),
    );

  const domainSteps = steps.filter((step) => norm(step.title) !== "set up the project");
  const stepForTitle = domainSteps[0] ?? steps[0]!;
  const stepForDetail = domainSteps[1] ?? domainSteps[0] ?? steps[0]!;

  const unique = (items: string[], count: number, exclude: string) => {
    const seen = new Set<string>([norm(exclude)]);
    const output: string[] = [];
    for (const item of items) {
      const key = norm(item);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      output.push(item);
      if (output.length === count) break;
    }
    return output;
  };

  const bulletDistractors = unique(otherBullets, 3, pick(bullets));
  const stepTitleDistractors = unique(otherStepTitles, 3, stepForTitle.title);
  const detailDistractors = unique(otherStepDetails, 3, stepForDetail.detail);

  const questions = [
    first,
    {
      question: `Which statement is a key claim of "${lessonTitle}"?`,
      options: [pick(bullets), ...bulletDistractors],
      correctIndex: 0,
      explanation: `The lesson states: "${pick(bullets)}"`,
    },
    {
      question: `Which of these is a hands-on step in "${lessonTitle}"?`,
      options: [stepForTitle.title, ...stepTitleDistractors],
      correctIndex: 0,
      explanation: `"${stepForTitle.title}" is part of this lesson's build sequence.`,
    },
    {
      question: `What does the hands-on step "${stepForDetail.title}" involve?`,
      options: [stepForDetail.detail, ...detailDistractors],
      correctIndex: 0,
      explanation: `The lesson describes "${stepForDetail.title}" as: ${stepForDetail.detail}`,
    },
    {
      question: `Which statement best explains "${lessonTitle}"?`,
      options: [pick(bullets, 1), ...unique(otherBullets, 3, pick(bullets, 1))],
      correctIndex: 0,
      explanation: `The lesson states: "${pick(bullets, 1)}"`,
    },
  ];

  const quizRows = await sql<{ id: string }[]>`select id from quizzes where lesson_id = ${lessonId} limit 1`;
  const quizId = quizRows[0]?.id;
  if (!quizId) return;

  const existing = await sql<{ id: string; position: number }[]>`
    select id, position from questions where quiz_id = ${quizId} order by position
  `;

  for (let index = 0; index < questions.length; index++) {
    const question = questions[index]!;
    const row = existing[index];
    if (!row) continue;
    await sql`update questions set prompt = ${question.question}, explanation = ${question.explanation} where id = ${row.id}`;
    const optionRows = await sql<{ id: string; position: number }[]>`
      select id, position from quiz_options where question_id = ${row.id} order by position
    `;
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex++) {
      const optionRow = optionRows[optionIndex];
      if (!optionRow) continue;
      await sql`
        update quiz_options
        set label = ${question.options[optionIndex]!}, is_correct = ${optionIndex === question.correctIndex}
        where id = ${optionRow.id}
      `;
    }
  }

  const conceptCards = await sql<{ id: string; front: string; back: string }[]>`
    select id, front, back from flashcards where lesson_id = ${lessonId} order by created_at
  `;
  const keptConcepts = conceptCards.filter((card) => !/^how do you /i.test(card.front)).slice(0, 5);
  const stepCards = steps.slice(0, Math.max(0, 8 - keptConcepts.length)).map((step) => ({
    front: `How do you ${lowerFirst(step.title)}?`,
    back: step.detail,
  }));

  const courseRow = await sql<{ courseId: string }[]>`
    select course_id as "courseId" from lessons where id = ${lessonId}
  `;
  const courseId = courseRow[0]!.courseId;
  await sql`delete from flashcards where lesson_id = ${lessonId}`;
  for (const card of [...keptConcepts, ...stepCards]) {
    await sql`
      insert into flashcards (lesson_id, course_id, concept, front, back)
      values (${lessonId}, ${courseId}, ${lessonTitle}, ${card.front}, ${card.back})
    `;
  }
}

async function main() {
  const courses = await sql<{ id: string; title: string }[]>`
    select id, title from courses where source_kind = 'text' order by title
  `;

  let lessonsTouched = 0;
  for (const course of courses) {
    const lessons = await sql<
      { id: string; title: string; objective: string; hook: string; keyTakeaway: string }[]
    >`
      select id, title, objective, hook, key_takeaway as "keyTakeaway"
      from lessons where course_id = ${course.id} order by position
    `;
    for (const lesson of lessons) {
      const result = await rebuildBlocks(lesson);
      if (result.courseTitle === "Build Your Own Processor") {
        await regenerateProcessorAssessment(lesson.id, lesson.title, result.steps, result.bullets);
      }
      lessonsTouched++;
    }
    console.log(`patched ${course.title}: ${lessons.length} lessons`);
  }

  const fixedAnswers = await fixClaimAnswers();
  const fixedCards = await fixFlashcards();
  const fixedSummaries = await fixModuleSummaries();
  console.log(`\n${lessonsTouched} lessons patched`);
  console.log(`${fixedAnswers} quiz answer(s) re-anchored to the lesson text`);
  console.log(`${fixedCards} flashcard(s) updated`);
  console.log(`${fixedSummaries} module summary/summaries updated`);
  await sql.end();
}

main().catch(async (error) => {
  console.error(error);
  await sql.end();
  process.exit(1);
});
