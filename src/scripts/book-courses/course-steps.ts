/**
 * Hands-on steps for the build-your-own courses, keyed by course title then
 * lesson title. Persist merges these into the lesson as a `steps` block when
 * the draft itself does not define any, so every implementation lesson has a
 * follow-along checklist instead of only prose.
 */

export type CourseStep = { title: string; detail: string };

export const courseSteps: Record<string, Record<string, CourseStep[]>> = {
  "Build Your Own Operating System": {
    "Bootloader Basics: Real Mode to Protected Mode": [
      {
        title: "Install the toolchain",
        detail:
          "Install nasm, qemu-system-i386, and gdb. Verify with `nasm -v` and `qemu-system-i386 --version` before writing any code.",
      },
      {
        title: "Create a 512-byte boot sector",
        detail:
          "Write boot.asm with `[bits 16]`, `[org 0x7c00]`, and a label. Assemble with `nasm -f bin boot.asm -o boot.bin` and confirm the file is exactly 512 bytes.",
      },
      {
        title: "Add the boot signature",
        detail:
          "Pad to byte 510 and append `dw 0xaa55`. The BIOS only treats the sector as bootable when those two bytes are present.",
      },
      {
        title: "Run it in QEMU",
        detail:
          "Boot with `qemu-system-i386 -drive format=raw,file=boot.bin`. Attach `-s -S` and connect gdb to inspect the first instruction at 0x7c00.",
      },
    ],
    "Writing a Minimal Bootloader": [
      {
        title: "Build a GDT",
        detail:
          "Define a null descriptor, a flat 32-bit code descriptor (base 0, limit 0xfffff, granularity 4K, access 0x9a), and a data descriptor (access 0x92). Load it with `lgdt [gdt_descriptor]`.",
      },
      {
        title: "Enable the A20 line",
        detail:
          "Use BIOS int 0x15, ax=0x2401, or the fast A20 port 0x92. Without A20, addresses above 1 MiB wrap around and your kernel cannot load.",
      },
      {
        title: "Switch to protected mode",
        detail:
          "Set CR0 bit 0 (PE), then far-jump to a 32-bit code selector so the CPU reloads CS with the new descriptor.",
      },
      {
        title: "Print from protected mode",
        detail:
          "Write a character and attribute byte to 0xB8000, then increment by 2 for the next cell. Add a `cli; hlt` loop so QEMU does not reboot.",
      },
      {
        title: "Verify the mode switch",
        detail:
          "In gdb, confirm CR0.PE is set and EIP is in your 32-bit code. If QEMU triple-faults, recheck the GDT base, limit, and far jump selector.",
      },
    ],
    "Simple Memory Allocator: Bump Pointer": [
      {
        title: "Find the end of the kernel",
        detail:
          "Export a linker symbol such as `kernel_end` in your linker script and read its address in C. Align it up to 16 bytes.",
      },
      {
        title: "Implement kmalloc",
        detail:
          "Keep a global `next_free` pointer. On allocation, align the requested size, return the current pointer, then advance `next_free` by that size.",
      },
      {
        title: "Add alignment and zeroing",
        detail:
          "Align every allocation to 8 or 16 bytes and optionally zero the returned region. Reject requests that would cross your reserved memory limit.",
      },
      {
        title: "Test and inspect",
        detail:
          "Allocate several blocks, write distinct patterns, and verify no block overlaps. Print `next_free` before and after to confirm the pointer only moves forward.",
      },
    ],
    "Process Scheduling: Cooperative Round-Robin": [
      {
        title: "Define a task control block",
        detail:
          "Store task id, saved stack pointer, state (ready/running/done), and an entry function. Keep a fixed array of tasks plus a current index.",
      },
      {
        title: "Give each task its own stack",
        detail:
          "Allocate a stack per task from your bump allocator and set the saved stack pointer to its top, 16-byte aligned.",
      },
      {
        title: "Write the context switch",
        detail:
          "In assembly, push callee-saved registers, save ESP into the current task, load the next task's ESP, pop registers, and `ret` into the new task.",
      },
      {
        title: "Yield cooperatively",
        detail:
          "Implement `task_yield()` that calls the scheduler explicitly. Run two tasks that print and yield in a loop; confirm output interleaves fairly.",
      },
      {
        title: "Detect completion",
        detail:
          "Mark a task done when its entry function returns, skip done tasks in the round-robin scan, and halt when no runnable tasks remain.",
      },
    ],
    "Minimal FAT16 Reader": [
      {
        title: "Read the boot sector",
        detail:
          "Load sector 0 and parse bytes per sector, sectors per cluster, reserved sectors, number of FATs, root entry count, and FAT size from the BPB.",
      },
      {
        title: "Locate the root directory",
        detail:
          "Compute the root directory's first sector from the reserved and FAT regions. Read entries until you find a name matching an 8.3 filename.",
      },
      {
        title: "Follow the cluster chain",
        detail:
          "Read the starting cluster from the directory entry, then walk the FAT: each entry gives the next cluster, with 0xFFF8+ marking end of file.",
      },
      {
        title: "Load a file into memory",
        detail:
          "Copy each cluster's sectors into a buffer until the chain ends. Compare the bytes with the file on your host to verify the read.",
      },
      {
        title: "Handle errors",
        detail:
          "Return clear failures for missing files, bad signatures, and chains that loop or point outside the volume. Never read past the buffer you allocated.",
      },
    ],
    "Simple Command Shell": [
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
          "Implement `help`, `clear`, `echo`, `ls`, and `cat` using your FAT16 reader. Compare argv[0] against a table of names and call the matching function.",
      },
      {
        title: "Add a prompt loop",
        detail:
          "Print a prompt, read, execute, and repeat forever. Keep the loop small so a bad command prints an error instead of halting the kernel.",
      },
      {
        title: "Try it end to end",
        detail:
          "Boot the image, run `ls` to list the root directory, `cat` a known file, and `clear` the screen. Confirm the output matches the disk contents.",
      },
    ],
  },

  "Build Your Own Processor": {
    "Register File: 16 General-Purpose Registers": [
      {
        title: "Define the storage",
        detail:
          "Create a module with 16 registers, each 16 bits wide, plus read and write ports. Decide now that register 0 always reads as zero.",
      },
      {
        title: "Implement synchronous writes",
        detail:
          "On a clock edge, write the input value to the addressed register unless the write-enable is low or the address is 0.",
      },
      {
        title: "Implement combinational reads",
        detail:
          "Drive two read ports from the addressed registers without a clock, so the ALU can consume both operands in the same cycle.",
      },
      {
        title: "Test the register file",
        detail:
          "Write a distinct value to each register, read every one back, and confirm writing to register 0 leaves it at zero.",
      },
    ],
    "ALU: Arithmetic and Logic Operations": [
      {
        title: "Implement the operations",
        detail:
          "Support add, sub, and, or, xor, not, and left/right shifts. Use two's complement for subtraction and keep the result 16 bits wide.",
      },
      {
        title: "Produce status flags",
        detail:
          "Compute zero (result == 0), carry/borrow, and sign (top bit). These flags drive conditional branches later.",
      },
      {
        title: "Add an operation selector",
        detail:
          "Use a 3- or 4-bit opcode input and a case statement or multiplexer to choose the operation. Default to passing operand A through for unknown opcodes.",
      },
      {
        title: "Test with vectors",
        detail:
          "Write a table of operand pairs and expected results, including overflow, negative numbers, and shifts by zero. Run every row and print failures.",
      },
    ],
    "Instruction Set Architecture (ISA)": [
      {
        title: "Choose the instruction formats",
        detail:
          "Define a 16-bit word: 4-bit opcode plus register fields and an immediate or address field. Write the exact bit layout down before coding.",
      },
      {
        title: "Write the opcode table",
        detail:
          "List every instruction (LOAD, STORE, ADD, SUB, AND, OR, JMP, JZ, HALT) with its opcode, operands, and semantics. Keep reserved opcodes explicit.",
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
    "Fetch-Decode-Execute Cycle": [
      {
        title: "Add program counter and instruction memory",
        detail:
          "Create a PC register and a 256-word instruction memory. Fetch the word at PC, then increment PC by 1 (or 2 bytes) before decode.",
      },
      {
        title: "Decode the fields",
        detail:
          "Split the fetched word into opcode, destination register, source register, and immediate. Drive the register file and ALU from those fields.",
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
    "Writing and Running Assembly Programs": [
      {
        title: "Write a small assembler",
        detail:
          "Map mnemonics and register names to numbers, parse labels, resolve branch targets in a second pass, and emit 16-bit words.",
      },
      {
        title: "Program 1: arithmetic",
        detail:
          "Load two immediates, add them, store the result, and halt. Run it and confirm the destination register and memory hold the expected sum.",
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
  },

  "Build Your Own Database": {
    "Writing SSTables": [
      {
        title: "Choose the file layout",
        detail:
          "Write a header, then sorted key-value blocks, then a block-offset table, then a bloom filter. Every block records its offset and length.",
      },
      {
        title: "Write sorted entries",
        detail:
          "Buffer entries in memory, sort by key, and flush blocks of a fixed size. Reject duplicate keys or keep only the newest value.",
      },
      {
        title: "Implement point lookup",
        detail:
          "Check the bloom filter first, binary-search the offset table, read the block, and binary-search within it. Return not-found cleanly.",
      },
      {
        title: "Implement a range scan",
        detail:
          "Seek to the first key >= start, then read blocks sequentially, yielding entries until the end key.",
      },
      {
        title: "Test persistence",
        detail:
          "Write 10,000 random keys, close the file, reopen it, and verify every key and a sample of ranges. Corrupt one offset and confirm the reader fails loudly.",
      },
    ],
    "Memtable: In-Memory Write Buffer": [
      {
        title: "Use a sorted in-memory map",
        detail:
          "Store writes in a balanced tree or sorted map keyed by the user key. Each entry carries a sequence number so newer writes win.",
      },
      {
        title: "Add a write-ahead log",
        detail:
          "Append every write to a WAL and fsync before acknowledging. On startup, replay the WAL to rebuild the memtable after a crash.",
      },
      {
        title: "Flush at a threshold",
        detail:
          "When the memtable exceeds a size limit, freeze it, write a new SSTable, and swap in an empty memtable without blocking reads.",
      },
      {
        title: "Merge reads across levels",
        detail:
          "Check the active memtable, then immutable memtables, then newest to oldest SSTables. Return the first hit by sequence number.",
      },
      {
        title: "Test crash recovery",
        detail:
          "Kill the process after writing but before flushing, restart, and confirm the WAL restores every acknowledged key exactly once.",
      },
    ],
    "B+-Tree Fundamentals": [
      {
        title: "Define the node layout",
        detail:
          "Use fixed-size pages with a header (leaf/internal, key count), sorted keys, and either child pointers or values. Pick an order that fits a page.",
      },
      {
        title: "Implement search",
        detail:
          "Binary-search keys in each internal node, descend to the correct child, and binary-search the leaf. Return the value or a clean miss.",
      },
      {
        title: "Implement insertion with splits",
        detail:
          "Insert into the leaf in sorted order. When it overflows, split it, promote the middle key to the parent, and split parents recursively up to a new root.",
      },
      {
        title: "Implement range scans",
        detail:
          "Find the starting leaf, then follow sibling pointers to the end key. Confirm the scan returns keys in order with no duplicates.",
      },
      {
        title: "Stress the tree",
        detail:
          "Insert 100,000 sequential and random keys, then verify every lookup and a full ordered scan. Check tree height stays logarithmic.",
      },
    ],
    "SQL Parsing and Planning": [
      {
        title: "Tokenize SQL",
        detail:
          "Split input into keywords, identifiers, numbers, strings, operators, and punctuation. Preserve positions so syntax errors can point at the offending token.",
      },
      {
        title: "Parse into an AST",
        detail:
          "Support `CREATE TABLE`, `INSERT`, and `SELECT ... FROM ... WHERE`. Use recursive descent with clear precedence for AND/OR and comparisons.",
      },
      {
        title: "Plan the statement",
        detail:
          "Turn the AST into iterators: table scan, filter, projection. Choose an index scan when the WHERE clause matches an indexed column.",
      },
      {
        title: "Execute and return rows",
        detail:
          "Pull rows through the iterator tree, apply the filter, project the requested columns, and print a table. Handle NULLs and type mismatches explicitly.",
      },
      {
        title: "Test end to end",
        detail:
          "Create a table, insert rows, run filtered and unfiltered selects, and verify output order and values. Add a syntax-error test that returns a useful message.",
      },
    ],
  },

  "Build Your Own Neural Network": {
    "Matrix Multiplication from Scratch": [
      {
        title: "Represent matrices",
        detail:
          "Use arrays of arrays or a flat typed array with rows and columns. Write shape checks that throw before multiplication.",
      },
      {
        title: "Implement the triple loop",
        detail:
          "For C = A × B, loop over rows of A, columns of B, and the shared dimension. Accumulate into C[i][j] and keep the inner loop contiguous.",
      },
      {
        title: "Test against known values",
        detail:
          "Multiply a 2×3 by a 3×2 matrix with hand-computed results. Add identity and zero matrices, and confirm incompatible shapes fail.",
      },
      {
        title: "Measure and optimize",
        detail:
          "Time the triple loop on a 200×200 multiply. Reorder loops for cache locality or use a typed array, then measure again rather than assuming.",
      },
    ],
    "Sigmoid Activation and Derivative": [
      {
        title: "Implement the forward pass",
        detail:
          "Compute `1 / (1 + exp(-x))` elementwise. Clamp large negative inputs to avoid overflow and return a new array.",
      },
      {
        title: "Implement the derivative",
        detail:
          "Use `sigmoid(x) * (1 - sigmoid(x))`. Accept the already-computed activation to avoid recomputing the exponential.",
      },
      {
        title: "Check numerically",
        detail:
          "Compare the analytic derivative with `(f(x+h) - f(x-h)) / 2h` for h = 1e-5 over several inputs. They should agree to about six digits.",
      },
      {
        title: "Plot the curve",
        detail:
          "Print or plot sigmoid over -8..8 and its derivative. Note the vanishing gradient at both tails before you build a deep network.",
      },
    ],
    "Two-Layer Network: Forward Pass": [
      {
        title: "Initialize weights and biases",
        detail:
          "Use small random weights (for example, uniform in ±0.1 or Xavier) and zero biases. Record every shape: input, hidden, output.",
      },
      {
        title: "Compute the hidden layer",
        detail:
          "Calculate `z1 = X·W1 + b1`, then `a1 = sigmoid(z1)`. Verify the result has one row per sample and one column per hidden unit.",
      },
      {
        title: "Compute the output layer",
        detail:
          "Calculate `z2 = a1·W2 + b2`, then `a2 = sigmoid(z2)`. For binary classification, a2 is the predicted probability.",
      },
      {
        title: "Test with fixed weights",
        detail:
          "Set weights by hand and feed one known sample. Compare the forward output with a calculator or spreadsheet before training anything.",
      },
    ],
    "Backpropagation: Gradients through the Network": [
      {
        title: "Define the loss",
        detail:
          "Use binary cross-entropy or mean squared error. Write both the loss and its derivative with respect to the output.",
      },
      {
        title: "Compute output gradients",
        detail:
          "Calculate `dz2 = a2 - y`, then `dW2 = a1ᵀ·dz2` and `db2 = sum(dz2)`. Confirm each gradient has the same shape as its parameter.",
      },
      {
        title: "Backpropagate to the hidden layer",
        detail:
          "Calculate `dz1 = (dz2·W2ᵀ) * sigmoid_prime(z1)`, then `dW1 = Xᵀ·dz1` and `db1 = sum(dz1)`.",
      },
      {
        title: "Run a gradient check",
        detail:
          "Perturb one weight by ±h and compare the numerical slope with the analytic gradient. Relative error below 1e-4 means the chain rule is correct.",
      },
    ],
    "Training Loop: Gradient Descent": [
      {
        title: "Write one training step",
        detail:
          "Forward pass, loss, backward pass, then update every parameter with `p -= learning_rate * dp`. Keep the order identical every iteration.",
      },
      {
        title: "Add mini-batches",
        detail:
          "Shuffle the dataset each epoch and process batches of 16-64 samples. Average gradients within a batch before updating.",
      },
      {
        title: "Track the loss curve",
        detail:
          "Record loss every epoch. A flat curve means the learning rate is too small; oscillation or NaN means it is too large or the inputs are unnormalized.",
      },
      {
        title: "Learn XOR",
        detail:
          "Train on the four XOR examples until loss drops below 0.05. A single-layer network cannot do this; your hidden layer should.",
      },
      {
        title: "Evaluate on held-out data",
        detail:
          "Split off a validation set, report accuracy, and stop when validation loss rises. That is your first real overfitting check.",
      },
    ],
  },

  "Build Your Own Programming Language": {
    "Writing a Lexer": [
      {
        title: "Define token types",
        detail:
          "List identifiers, numbers, strings, operators, keywords, punctuation, EOF, and an error token. Write the list down before coding.",
      },
      {
        title: "Scan character by character",
        detail:
          "Skip whitespace, then dispatch on the current character. Consume maximal identifiers and numbers, and track line and column for errors.",
      },
      {
        title: "Handle multi-character operators",
        detail:
          "Check for `==`, `!=`, `<=`, `>=`, and `&&` before treating a single character as an operator. Longest match wins.",
      },
      {
        title: "Test the token stream",
        detail:
          "Feed a small program and print every token with its type and lexeme. Add tests for unterminated strings and unknown characters.",
      },
    ],
    "Writing a Parser": [
      {
        title: "Define the AST nodes",
        detail:
          "Create node types for literals, identifiers, binary/unary expressions, assignments, blocks, if, while, and function calls. Each node stores only what it needs.",
      },
      {
        title: "Write recursive-descent functions",
        detail:
          "Implement expression, term, and factor levels so multiplication binds tighter than addition. Parse statements in a separate function.",
      },
      {
        title: "Handle precedence and associativity",
        detail:
          "Use one function per precedence level or precedence climbing. Left-associative operators loop; parentheses recurse.",
      },
      {
        title: "Report syntax errors",
        detail:
          "On an unexpected token, include the line, column, expected token set, and actual token. Recover at the next statement so one error does not hide the rest.",
      },
      {
        title: "Test the tree shape",
        detail:
          "Parse `1 + 2 * 3` and assert the root is `+` with `2 * 3` on the right. Add a malformed program and check the error message.",
      },
    ],
    "Writing an Interpreter": [
      {
        title: "Build an environment",
        detail:
          "Use a chain of maps from name to value, with a parent pointer for nested scopes. Lookup walks outward; assignment updates the nearest binding.",
      },
      {
        title: "Evaluate expressions",
        detail:
          "Implement literals, variables, unary/binary operators, and calls. Check operand types and report runtime errors with a source position.",
      },
      {
        title: "Execute statements",
        detail:
          "Implement expression statements, variable declarations, assignment, blocks, if/else, and while. Return a control-flow signal for break/return.",
      },
      {
        title: "Add functions and closures",
        detail:
          "Capture the defining environment when a function is created. On call, bind parameters in a new child scope and execute the body.",
      },
      {
        title: "Run real programs",
        detail:
          "Write Fibonacci, a loop that sums 1..100, and a closure counter. Compare each output with the same program in Python or JavaScript.",
      },
    ],
    "Writing a Compiler": [
      {
        title: "Choose a target",
        detail:
          "Emit stack-machine bytecode or simple x86-64 assembly. A stack machine is easier to verify; assembly is closer to a real toolchain.",
      },
      {
        title: "Walk the AST and emit",
        detail:
          "Compile expressions to push operands then apply the operator. Compile statements to load, store, jump, and call instructions with resolved labels.",
      },
      {
        title: "Handle control flow and variables",
        detail:
          "Allocate stack slots or registers for locals, emit conditional jumps for if/while, and patch forward label addresses after emission.",
      },
      {
        title: "Build a tiny VM or assemble the output",
        detail:
          "For bytecode, write a fetch-decode-execute loop with a value stack. For assembly, assemble and link with the system toolchain.",
      },
      {
        title: "Differential-test against the interpreter",
        detail:
          "Run the same programs through both the interpreter and the compiled path. Any output mismatch is a code-generation bug; fix it before adding features.",
      },
    ],
  },

  "Build Your Own Blockchain": {
    "Defining the Block Structure": [
      {
        title: "Define the block fields",
        detail:
          "Include index, timestamp, transactions, previous hash, nonce, and hash. Serialize fields in a fixed order so hashing is deterministic.",
      },
      {
        title: "Implement hashing",
        detail:
          "Hash the serialized block with SHA-256. Store the hex digest and recompute it on validation instead of trusting the stored value.",
      },
      {
        title: "Create the genesis block",
        detail:
          "Hard-code index 0 with no previous hash and a fixed timestamp. Every node must produce the same genesis hash or they will reject each other.",
      },
      {
        title: "Validate the chain",
        detail:
          "Walk from genesis: each block's previous hash must equal the prior hash, and each stored hash must match a recomputation. Reject the first mismatch.",
      },
      {
        title: "Test tampering",
        detail:
          "Change one transaction in an old block and confirm validation fails at that block and every block after it.",
      },
    ],
    "Proof-of-Work Algorithm": [
      {
        title: "Define the difficulty target",
        detail:
          "Require the block hash to start with N hexadecimal zeros. Store the difficulty in the block so other nodes can verify it.",
      },
      {
        title: "Mine with a nonce loop",
        detail:
          "Increment the nonce, recompute the hash, and stop when it meets the target. Print attempts per second so you can see the cost grow with N.",
      },
      {
        title: "Verify cheaply",
        detail:
          "Validation rehashes once and checks the prefix. Mining is expensive; verification must stay constant time.",
      },
      {
        title: "Adjust difficulty",
        detail:
          "Measure the time for a fixed number of blocks. If it is below target, raise the difficulty; if above, lower it. Clamp changes to avoid oscillation.",
      },
      {
        title: "Test determinism",
        detail:
          "Mine the same block twice with the same starting nonce and confirm the found nonce and hash are identical.",
      },
    ],
    "Creating and Validating Transactions": [
      {
        title: "Define the transaction shape",
        detail:
          "Include sender, recipient, amount, a unique id, and a signature field. Serialize deterministically before signing.",
      },
      {
        title: "Sign and verify",
        detail:
          "Use Ed25519 or ECDSA: sign the transaction hash with the sender's private key and verify with the public key. Reject a signature that does not match the sender.",
      },
      {
        title: "Add a mempool",
        detail:
          "Keep pending transactions in an ordered pool. Drop duplicates by id and reject transactions that fail signature or balance checks.",
      },
      {
        title: "Validate against balances",
        detail:
          "Replay confirmed transactions to compute balances, then check the sender can afford the amount plus a fee. Handle the same address sending twice in one block.",
      },
      {
        title: "Test bad inputs",
        detail:
          "Try a tampered amount, a wrong key, a negative value, a duplicate id, and an overdraft. Each must be rejected with a distinct reason.",
      },
    ],
    "Network Consensus": [
      {
        title: "Define the wire messages",
        detail:
          "Use JSON messages for `hello`, `get_blocks`, `blocks`, and `new_block`. Include protocol version and chain height so peers can decide what to send.",
      },
      {
        title: "Implement the longest-chain rule",
        detail:
          "On receiving a chain, validate every block and adopt it only if it is longer than the current chain. Ties keep the existing chain to avoid churn.",
      },
      {
        title: "Handle forks",
        detail:
          "When a competing branch arrives, validate it independently, compare cumulative work or length, and reorg to the winner. Re-add orphaned transactions to the mempool.",
      },
      {
        title: "Sync a new node",
        detail:
          "A fresh node requests the chain from a peer, validates from genesis, then subscribes to new blocks. Refuse to serve an invalid chain.",
      },
      {
        title: "Test with two nodes",
        detail:
          "Run two processes, mine on each, and confirm both converge on the same chain. Partition them, mine different lengths, reconnect, and verify the longer chain wins.",
      },
    ],
  },
};
