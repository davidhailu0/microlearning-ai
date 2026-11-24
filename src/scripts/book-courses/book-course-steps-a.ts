import type { CourseStep } from "./course-steps";

/**
 * Hands-on steps for the technical book courses (part A): Code, Structured
 * Computer Organization, How LLMs Actually Work, and DDIA. Keys match the
 * persisted lesson titles exactly so enrichment can attach the right checklist.
 */
export const bookCourseStepsA: Record<string, Record<string, CourseStep[]>> = {
  "Code: The Hidden Language of Computer Hardware and Software": {
    "Codes and Combinations: Best Friends and Why Codes Exist": [
      {
        title: "Encode a small alphabet",
        detail:
          "Pick 8 words and assign each a unique 3-bit code. Write the table, encode a sentence, and confirm no two words share a code.",
      },
      {
        title: "Find the ambiguity",
        detail:
          "Remove the spaces from your encoded sentence and try to decode it. Add a separator or fixed width and show why framing is required.",
      },
      {
        title: "Add error detection",
        detail:
          "Append a parity bit to each code and flip one bit deliberately. Write a decoder that rejects the corrupted word instead of guessing.",
      },
    ],
    "Braille, Flashlights, and Communicating Around Corners": [
      {
        title: "Build a flashlight transmitter",
        detail:
          "Choose short and long flashes for dot and dash, then send HELLO to a friend or phone camera. Keep a fixed gap between letters.",
      },
      {
        title: "Write the decoder",
        detail:
          "Record the on/off durations as a list and map them back to letters. Handle an unknown pattern by printing a clear error.",
      },
      {
        title: "Test the timing boundary",
        detail:
          "Send at two different speeds and find where your decoder breaks. Add a start signal and a calibrated unit duration to fix it.",
      },
    ],
    "Logic with Switches: Telegraphs, Relays, and Gates": [
      {
        title: "Wire AND and OR",
        detail:
          "Use two switches in series for AND and in parallel for OR. Fill in the truth table by observing the lamp for all four input combinations.",
      },
      {
        title: "Build XOR from NAND",
        detail:
          "In a simulator or on a breadboard, wire four NAND gates into XOR. Verify the output is 1 only when exactly one input is 1.",
      },
      {
        title: "Replace a relay with a transistor",
        detail:
          "Drive an LED through an NPN transistor and a base resistor. Measure the base current needed to switch it and compare with a relay coil.",
      },
    ],
    "Our Ten Digits and Alternative 10s": [
      {
        title: "Convert between bases",
        detail:
          "Write functions for binary, octal, and hexadecimal to decimal and back. Round-trip every number from 0 to 255 and assert equality.",
      },
      {
        title: "Add in binary by hand",
        detail:
          "Add 0111 + 0001 and 1111 + 0001 on paper, showing each carry. Confirm the second result overflows a 4-bit register.",
      },
      {
        title: "Use BCD",
        detail:
          "Encode 0-9 as four-bit nibbles and add 9 + 1. Show why binary addition gives 1010 and why BCD needs a correction step.",
      },
    ],
    "Bit by Bit, Bytes and Hexadecimal, and From ASCII to Unicode": [
      {
        title: "Encode UTF-8 yourself",
        detail:
          "Write an encoder for A, é, €, and 😀. Print the bytes in hex and compare them with a hexdump of the same text.",
      },
      {
        title: "Decode the bytes",
        detail:
          "Read the byte sequence back, detect continuation bytes by their high bits, and reconstruct each code point. Assert it matches the input.",
      },
      {
        title: "Break it safely",
        detail:
          "Truncate a multi-byte character and confirm your decoder reports an error instead of emitting a replacement character silently.",
      },
    ],
    "Adding with Logic Gates, Real Numbers, and Subtraction": [
      {
        title: "Build a half adder",
        detail:
          "Wire XOR for the sum and AND for the carry. Test all four input pairs and record the truth table.",
      },
      {
        title: "Chain full adders",
        detail:
          "Build a full adder from two half adders and an OR, then chain four to add 4-bit numbers. Test 7 + 1 and 15 + 1.",
      },
      {
        title: "Subtract with two's complement",
        detail:
          "Invert the second operand, add 1, and feed it to your adder. Verify 5 - 3 and 3 - 5, including the sign bit.",
      },
    ],
    "Feedback and Flip-Flops: How a Circuit Remembers": [
      {
        title: "Build an SR latch",
        detail:
          "Cross-couple two NOR gates and test set, reset, and hold. Record what happens when both inputs are asserted at once.",
      },
      {
        title: "Add a clock",
        detail:
          "Turn the latch into a gated D flip-flop. Store a 1, remove the input, and confirm the output stays 1 across clock cycles.",
      },
      {
        title: "Race the latch",
        detail:
          "Toggle both inputs quickly in a simulator and observe the metastable or undefined state. Explain why real designs avoid it.",
      },
    ],
    "Building a Clock and Assembling Memory": [
      {
        title: "Make a clock",
        detail:
          "Build an astable multivibrator with a 555 timer or simulate one. Measure the frequency with a scope or simulator and change it with the RC values.",
      },
      {
        title: "Build an 8-bit register",
        detail:
          "Connect eight D flip-flops with a shared clock and load line. Write 10101010, disable load, and confirm the value survives.",
      },
      {
        title: "Put registers on a bus",
        detail:
          "Add tri-state buffers to two registers and select one at a time. Verify two drivers are never enabled together.",
      },
    ],
    "Automating Arithmetic: The Accumulator and the First Program": [
      {
        title: "Build the accumulator",
        detail:
          "Connect a register to an adder with its output fed back to the input. Add load and add control signals.",
      },
      {
        title: "Hand-assemble a program",
        detail:
          "Write the control steps to load 2, add 3, add 4, and halt. List the signal asserted at every step.",
      },
      {
        title: "Single-step it",
        detail:
          "Run the program one clock at a time in your simulator and print the accumulator after each step. Confirm it reaches 9.",
      },
    ],
    "The Arithmetic Logic Unit, Registers, and Buses": [
      {
        title: "Extend the ALU",
        detail:
          "Add AND, OR, XOR, and NOT to your adder with a multiplexer selected by an opcode. Include zero and carry flags.",
      },
      {
        title: "Connect two registers",
        detail:
          "Place two registers on a shared bus with tri-state outputs. Move a value from A to B in two cycles and verify the bus is never double-driven.",
      },
      {
        title: "Test every operation",
        detail:
          "Write a vector table of operands, opcode, result, and flags. Run all rows and fail loudly on the first mismatch.",
      },
    ],
    "CPU Control Signals, Then Loops, Jumps, and Calls": [
      {
        title: "Write the control table",
        detail:
          "For each instruction, list which registers load, which ALU op runs, and which bus source is selected during each cycle.",
      },
      {
        title: "Implement fetch-decode-execute",
        detail:
          "Build a state machine that fetches the next instruction, decodes the opcode, and asserts the matching control signals.",
      },
      {
        title: "Close a loop",
        detail:
          "Add JMP and JZ, then write a program that counts down to zero. Trace the program counter to prove the loop exits.",
      },
    ],
    "Peripherals, the Operating System, Coding, and the World Brain": [
      {
        title: "Memory-map a device",
        detail:
          "Reserve an address for a keyboard status byte and a data byte. Poll the status bit before reading a key.",
      },
      {
        title: "Add an interrupt path",
        detail:
          "Trigger a handler when the keyboard flag sets, save registers, read the key, and return. Compare polling with interrupts.",
      },
      {
        title: "Load a program from storage",
        detail:
          "Write a tiny loader that copies bytes from a simulated disk into instruction memory and jumps to the entry point.",
      },
    ],
  },

  "Structured Computer Organization": {
    "Why Structure a Computer? Multilevel Machines": [
      {
        title: "Build a two-level machine",
        detail:
          "Define a tiny L1 instruction set and translate each instruction into three L0 operations. Write the translator as a table.",
      },
      {
        title: "Run the interpreter",
        detail:
          "Write a loop that fetches an L1 instruction, looks up its L0 expansion, and executes it. Add a trace of both levels.",
      },
      {
        title: "Measure the abstraction cost",
        detail:
          "Count L0 operations for the same program written directly and via L1. Explain where the extra work comes from.",
      },
    ],
    "From Relay to VLSI: A Short History and the Computer Families": [
      {
        title: "Compare two ISAs",
        detail:
          "Pick x86-64 and ARM64 and list register counts, instruction lengths, and addressing modes in a table.",
      },
      {
        title: "Emulate a stack machine",
        detail:
          "Implement a small stack-based interpreter and run a factorial program. Count pushes, pops, and branches.",
      },
      {
        title: "Compare instruction counts",
        detail:
          "Write the same factorial for a register machine and compare dynamic instruction counts. Explain the tradeoff.",
      },
    ],
    "Measuring Computers: Metrics, Benchmarks, and Amdahl's Law": [
      {
        title: "Benchmark a loop",
        detail:
          "Time a CPU-bound loop with enough iterations to run for seconds. Report wall time, iterations per second, and variance across runs.",
      },
      {
        title: "Apply Amdahl's law",
        detail:
          "Speed up only the parallel fraction of your loop and predict the new runtime. Compare the prediction with the measurement.",
      },
      {
        title: "Compute CPI",
        detail:
          "Count instructions and cycles for a small kernel. Derive cycles per instruction and explain which stalls dominate.",
      },
    ],
    "Anatomy of a Computer: Processors, Memories, Buses, and I/O": [
      {
        title: "Model the bus",
        detail:
          "Write a simulator with a CPU, memory, and a shared bus. Each transfer carries an address, data, and read/write signal.",
      },
      {
        title: "Fetch over the bus",
        detail:
          "Implement the fetch cycle: put PC on the address bus, assert read, latch data into the instruction register, then increment PC.",
      },
      {
        title: "Add wait states",
        detail:
          "Make memory respond after two cycles and stall the CPU until ready. Measure how wait states reduce throughput.",
      },
    ],
    "Gates and Boolean Algebra": [
      {
        title: "Build a NAND-only library",
        detail:
          "Derive NOT, AND, OR, and XOR using only NAND gates. Write each as a composition and test all input combinations.",
      },
      {
        title: "Prove equivalence",
        detail:
          "Simplify a Boolean expression with algebra, then compare its truth table with the original. They must match on every row.",
      },
      {
        title: "Use a Karnaugh map",
        detail:
          "Simplify a 4-variable expression with a K-map and implement the result. Count the gates before and after.",
      },
    ],
    "Combinational Circuits: Adders, Decoders, Multiplexers, and ALUs": [
      {
        title: "Build a 4-bit adder",
        detail:
          "Chain four full adders and expose carry-in, carry-out, and overflow. Test 3 + 4, 15 + 1, and signed overflow.",
      },
      {
        title: "Build a decoder and multiplexer",
        detail:
          "Implement a 3-to-8 decoder with AND gates and a 2-to-1 multiplexer. Use the mux to select between two 4-bit inputs.",
      },
      {
        title: "Assemble a small ALU",
        detail:
          "Combine the adder, logic unit, and mux under a 3-bit opcode. Verify each operation and the zero flag with a vector table.",
      },
    ],
    "Sequential Circuits: Clocks, Flip-Flops, Registers, and Memory": [
      {
        title: "Build a D flip-flop",
        detail:
          "Construct one from NAND gates with a clock input. Confirm the output only changes on the active edge.",
      },
      {
        title: "Build a register and a RAM cell",
        detail:
          "Connect four flip-flops with a shared load line, then build a 1-bit memory cell with read/write selects.",
      },
      {
        title: "Test timing",
        detail:
          "Change the input just before and after the clock edge. Identify the setup and hold window where behavior becomes unreliable.",
      },
    ],
    "Memory Chips, Processor Chips, and Chip-Level Buses": [
      {
        title: "Model a memory array",
        detail:
          "Implement a 2D array with row and column decoders. Read and write a cell by address and verify no neighboring cell changes.",
      },
      {
        title: "Add chip select",
        detail:
          "Place two memory chips on one bus and use chip-select lines to route an address to the correct chip.",
      },
      {
        title: "Measure access patterns",
        detail:
          "Time sequential and strided reads over your array. Explain the difference using row locality.",
      },
    ],
    "The Data Path of the Mic-1": [
      {
        title: "Implement the registers",
        detail:
          "Build PC, MBR, MAR, SP, LV, CPP, TOS, and OPC as a register file with explicit load lines and a B-bus selector.",
      },
      {
        title: "Route the ALU",
        detail:
          "Connect the A and B buses through the ALU shifter. Implement the AMUX and COND bits that choose the next microinstruction.",
      },
      {
        title: "Microstep one instruction",
        detail:
          "Trace a single ADD through the datapath cycle by cycle. Print every register value and compare it with the book's table.",
      },
    ],
    "Microinstructions, Control Store, and the Microprogram": [
      {
        title: "Encode a microinstruction",
        detail:
          "Define bit fields for AMUX, COND, ALU, shift, and the C-bus destination. Pack and unpack one instruction correctly.",
      },
      {
        title: "Write the ADD microcode",
        detail:
          "Hand-assemble the microinstructions that fetch, decode, and execute ADD. Store them at the matching addresses.",
      },
      {
        title: "Build the control store",
        detail:
          "Implement a ROM indexed by MPC. Run a two-instruction program from microcode and verify the control signals.",
      },
    ],
    "A Worked Example ISA: IJVM": [
      {
        title: "Implement the IJVM stack",
        detail:
          "Build an operand stack with push, pop, and dup. Store the stack pointer in SP and grow toward lower addresses.",
      },
      {
        title: "Implement frames",
        detail:
          "Add LINK and RETURN using LV, CPP, TOS, and OPC. Draw the frame layout before writing the microcode.",
      },
      {
        title: "Call a method",
        detail:
          "Assemble a main that calls a function with two arguments. Trace the frame pointers and confirm the return value lands on the stack.",
      },
    ],
    "Microarchitecture Performance: Cycles, Pipelining, and Superscalar Ideas": [
      {
        title: "Model a pipeline",
        detail:
          "Implement a 5-stage fetch/decode/execute/memory/writeback simulator. Compute throughput for a straight-line program.",
      },
      {
        title: "Add hazards",
        detail:
          "Detect a load-use dependency and insert a stall. Compare cycles with and without forwarding.",
      },
      {
        title: "Measure speedup",
        detail:
          "Run the same program on your single-cycle and pipelined models. Report cycles, latency, and the speedup you actually observed.",
      },
    ],
    "The Instruction Set Architecture Level": [
      {
        title: "Design a small ISA",
        detail:
          "Define eight instructions with fixed 16-bit encodings. Write the opcode table, operand fields, and flag behavior.",
      },
      {
        title: "Write an assembler",
        detail:
          "Parse mnemonics and labels and emit 16-bit words. Resolve branch targets in a second pass.",
      },
      {
        title: "Write an emulator",
        detail:
          "Fetch, decode, and execute your ISA in a loop. Run a loop and a function call and verify the final registers.",
      },
    ],
    "The Operating System Level: Virtual Memory, Processes, and Files": [
      {
        title: "Implement page translation",
        detail:
          "Split a virtual address into page number and offset. Walk a two-level page table and produce the physical address.",
      },
      {
        title: "Handle a page fault",
        detail:
          "Mark a page not-present, trap on access, allocate a frame, copy the page in, and retry the instruction.",
      },
      {
        title: "Schedule processes",
        detail:
          "Implement round-robin over three processes with saved register contexts. Verify each process makes progress.",
      },
    ],
    "The Assembly Language Level: Macros, Assemblers, and Linkage": [
      {
        title: "Add macros",
        detail:
          "Implement a macro processor that substitutes parameters and expands a macro before assembly. Test nested expansion.",
      },
      {
        title: "Relocate symbols",
        detail:
          "Emit relocatable object code with a symbol table. Link two modules and patch external call addresses.",
      },
      {
        title: "Link and run",
        detail:
          "Combine your objects into one image, load it in your emulator, and confirm a cross-module call returns correctly.",
      },
    ],
    "Parallel Computer Architectures": [
      {
        title: "Parallelize a kernel",
        detail:
          "Implement matrix multiplication with threads or processes. Split rows across workers and join before timing.",
      },
      {
        title: "Measure scaling",
        detail:
          "Run with 1, 2, 4, and 8 workers. Compute speedup and efficiency, then compare with Amdahl's prediction.",
      },
      {
        title: "Expose a coherence bug",
        detail:
          "Have two threads increment a shared counter without synchronization. Show the lost updates, then fix them with an atomic operation.",
      },
    ],
  },

  "How LLMs Actually Work": {
    "Tokens, not words": [
      {
        title: "Train a tiny BPE tokenizer",
        detail:
          "Implement byte-pair encoding on a small text corpus. Start from characters and merge the most frequent pair for 100 rounds.",
      },
      {
        title: "Round-trip text",
        detail:
          "Encode and decode a paragraph, then assert the output is identical. Check how many tokens emoji and rare words consume.",
      },
      {
        title: "Compare tokenizers",
        detail:
          "Tokenize the same text with your BPE and a library tokenizer. Compare token counts and where the splits differ.",
      },
    ],
    "Prediction, one token at a time": [
      {
        title: "Build a bigram model",
        detail:
          "Count next-token frequencies from a corpus and normalize each row into a probability distribution.",
      },
      {
        title: "Sample with controls",
        detail:
          "Generate text with temperature and top-k. Run each setting several times and compare repetition and diversity.",
      },
      {
        title: "Measure perplexity",
        detail:
          "Compute perplexity on held-out text. Lower perplexity should match the model that predicts the sample better.",
      },
    ],
    "The problem with fixed meaning": [
      {
        title: "Build co-occurrence vectors",
        detail:
          "Count word co-occurrences in a window, apply PPMI, and reduce with SVD to 50 dimensions.",
      },
      {
        title: "Find neighbors",
        detail:
          "Compute cosine similarity and print the nearest words for five terms. Check whether they are semantically related.",
      },
      {
        title: "Show the limitation",
        detail:
          "Find a word with two senses and inspect its single vector. Explain why contextual embeddings are needed.",
      },
    ],
    "Attention as a weighted lookup": [
      {
        title: "Implement scaled dot-product attention",
        detail:
          "Write Q, K, and V projections in NumPy. Compute softmax(QKᵀ/√d)V and check the output shape.",
      },
      {
        title: "Add a causal mask",
        detail:
          "Mask future positions with negative infinity before softmax. Confirm each row attends only to itself and earlier tokens.",
      },
      {
        title: "Add multiple heads",
        detail:
          "Split the model dimension across heads, run attention per head, concatenate, and project. Verify row weights sum to one.",
      },
    ],
    "Why it hallucinates": [
      {
        title: "Build a grounded prompt",
        detail:
          "Create a question-answering prompt that includes source passages and requires a citation for every claim.",
      },
      {
        title: "Compare grounded and ungrounded",
        detail:
          "Ask the same five questions with and without context. Count unsupported claims and note where the model invents details.",
      },
      {
        title: "Add a refusal path",
        detail:
          "Instruct the model to answer only from context. Test with an unanswerable question and verify it declines instead of guessing.",
      },
    ],
    "Context windows and forgetting": [
      {
        title: "Implement truncation",
        detail:
          "Build a sliding window that keeps the system prompt plus the most recent tokens that fit the budget.",
      },
      {
        title: "Test recall by position",
        detail:
          "Place a fact at the start, middle, and end of a long context. Ask for it and record which positions survive.",
      },
      {
        title: "Summarize instead of dropping",
        detail:
          "Summarize older turns into a fixed-size memory and prepend it. Compare fact recall with plain truncation.",
      },
    ],
  },

  "Designing Data-Intensive Applications": {
    "Reliability: Hardware, Software, and Human Faults": [
      {
        title: "Inject faults",
        detail:
          "Build a tiny service backed by a file. Kill the process mid-write and simulate a disk error, then observe what the client sees.",
      },
      {
        title: "Add idempotent retries",
        detail:
          "Give every request an idempotency key and store completed keys. Retry a timed-out write and confirm it is applied once.",
      },
      {
        title: "Measure recovery",
        detail:
          "Restart after each fault and verify committed data survives. Record time to recover and any data lost.",
      },
    ],
    "Scalability: Load, Latency, and the Tail": [
      {
        title: "Load test a service",
        detail:
          "Drive a simple endpoint with 1, 10, and 100 concurrent clients. Record throughput and p50, p95, and p99 latency.",
      },
      {
        title: "Find the bottleneck",
        detail:
          "Profile CPU, memory, and I/O under load. Identify which resource saturates first and explain the latency curve.",
      },
      {
        title: "Scale and remeasure",
        detail:
          "Add a cache or a second worker, then repeat the same load test. Report the actual improvement, not the expected one.",
      },
    ],
    "Maintainability: Operability, Simplicity, Evolvability": [
      {
        title: "Add observability",
        detail:
          "Instrument a small service with structured logs, a request counter, and a latency histogram. Expose a health endpoint.",
      },
      {
        title: "Write the runbook",
        detail:
          "Document how to start, stop, back up, and restore the service. Include the three most likely failures and their checks.",
      },
      {
        title: "Make a safe change",
        detail:
          "Add a feature behind an interface, keep the old path working, and add a test that pins the previous behavior.",
      },
    ],
    "Relational vs Document Models": [
      {
        title: "Model the same data twice",
        detail:
          "Store a user with posts, comments, and tags in normalized tables and as one JSONB document. Insert the same sample data into both.",
      },
      {
        title: "Query both shapes",
        detail:
          "Fetch a user with all posts and the latest comments from each model. Note the joins versus the single-document read.",
      },
      {
        title: "Compare evolution",
        detail:
          "Add a new optional field and a one-to-many relation. Record which model required a migration and which required rewriting documents.",
      },
    ],
    "Query Languages and Graph Models": [
      {
        title: "Model a graph",
        detail:
          "Create a people table and a friendships edge table in SQL. Insert a small social graph with at least two cycles.",
      },
      {
        title: "Traverse with a recursive CTE",
        detail:
          "Write a recursive query for friends-of-friends up to depth three. Deduplicate paths and show the depth of each result.",
      },
      {
        title: "Compare with a graph query",
        detail:
          "Express the same traversal in a graph query language or library. Compare readability, query length, and execution plan.",
      },
    ],
    "Storage Engines: Hash Indexes, LSM-Trees, and B-Trees": [
      {
        title: "Build a log-structured store",
        detail:
          "Append key-value records to a file and keep an in-memory hash map from key to byte offset. Read and overwrite keys.",
      },
      {
        title: "Add SSTables and compaction",
        detail:
          "Flush sorted segments, keep a sparse index, and merge segments in the background. Delete tombstones during compaction.",
      },
      {
        title: "Benchmark the tradeoffs",
        detail:
          "Measure write throughput, point-read latency, and disk usage for your log store and an embedded B-tree database. Explain the differences.",
      },
    ],
    "Analytics: Warehouses, Stars, and Column Storage": [
      {
        title: "Build a star schema",
        detail:
          "Create one fact table and three dimension tables for sales data. Load a CSV and write a query that aggregates by region and month.",
      },
      {
        title: "Scan columns directly",
        detail:
          "Store the fact table as Parquet or one file per column. Read only the columns a query needs and measure bytes scanned.",
      },
      {
        title: "Compare row and column",
        detail:
          "Run the same aggregation against a row store and your columnar files. Report latency and I/O for both.",
      },
    ],
    "Encoding and Schema Evolution": [
      {
        title: "Encode with a schema",
        detail:
          "Define a record in Protobuf or Avro, write several records, and decode them with the same schema.",
      },
      {
        title: "Evolve forward",
        detail:
          "Add an optional field with a default. Confirm old readers can read new data and new readers can read old data.",
      },
      {
        title: "Break it deliberately",
        detail:
          "Rename a required field or change its type and observe the failure. Document which changes are safe and which are breaking.",
      },
    ],
    "Dataflow: Databases, Services, and Messages": [
      {
        title: "Build a message pipeline",
        detail:
          "Publish events from one service to a queue and consume them in another. Include an event id and timestamp.",
      },
      {
        title: "Make the consumer idempotent",
        detail:
          "Track processed event ids and ignore duplicates. Re-deliver the same event twice and verify the effect happens once.",
      },
      {
        title: "Handle ordering",
        detail:
          "Send events out of order and add a sequence check or reordering buffer. Show how the consumer copes with a late event.",
      },
    ],
    "Replication: Leaders, Followers, and Logs": [
      {
        title: "Replicate an append-only log",
        detail:
          "Run one leader and two followers. The leader appends writes to a log and streams entries to each follower.",
      },
      {
        title: "Simulate replication lag",
        detail:
          "Delay one follower and read from it immediately after a write. Show the stale read and then catch up.",
      },
      {
        title: "Fail over",
        detail:
          "Stop the leader, promote the most up-to-date follower, and redirect writes. Verify no acknowledged write disappears.",
      },
    ],
    "Replication Lag, Multi-Leader, and Leaderless Systems": [
      {
        title: "Guarantee read-your-writes",
        detail:
          "Track the last write version per user and route that user's reads to a replica that has caught up, or to the leader.",
      },
      {
        title: "Test monotonic reads",
        detail:
          "Read from two replicas with different lag and observe time moving backwards. Pin a user to one replica and retest.",
      },
      {
        title: "Resolve a conflict",
        detail:
          "Write the same key on two leaders and merge with last-write-wins using synchronized clocks. Then try a version vector and compare.",
      },
    ],
    "Partitioning and Rebalancing": [
      {
        title: "Partition by hash",
        detail:
          "Assign keys to 16 partitions with a hash function. Verify the distribution on 10,000 keys and find the hottest partition.",
      },
      {
        title: "Add consistent hashing",
        detail:
          "Place nodes and keys on a ring. Add a node and count how many keys move compared with modulo hashing.",
      },
      {
        title: "Rebalance safely",
        detail:
          "Move one partition to a new node while reads continue. Verify no key is lost or served by two owners at once.",
      },
    ],
    "Transactions and Isolation Levels": [
      {
        title: "Reproduce a lost update",
        detail:
          "Open two transactions that read the same counter and write it back. Commit both and show that one increment vanished.",
      },
      {
        title: "Fix it with locking",
        detail:
          "Use SELECT ... FOR UPDATE or an atomic increment. Repeat the concurrent test and confirm both updates survive.",
      },
      {
        title: "Try write skew",
        detail:
          "Enforce a rule across two rows that each transaction checks separately. Show the violation under snapshot isolation and fix it with serializable.",
      },
    ],
    "Faults, Clocks, and Distributed Truth": [
      {
        title: "Measure clock skew",
        detail:
          "Compare timestamps from two machines over a minute. Record the offset and drift before and after an NTP sync.",
      },
      {
        title: "Build a hybrid logical clock",
        detail:
          "Combine physical time with a logical counter. Order events from two nodes and show causality is preserved across a clock jump.",
      },
      {
        title: "Test a clock jump",
        detail:
          "Move one clock backwards and run your ordering again. Explain which guarantees break with raw wall-clock timestamps.",
      },
    ],
    "Consistency, Ordering, and Consensus": [
      {
        title: "Run a consensus cluster",
        detail:
          "Start a three-node Raft or etcd cluster. Write a key through the leader and read it back from a follower.",
      },
      {
        title: "Partition the cluster",
        detail:
          "Isolate the leader and try to write. Confirm the majority elects a new leader and the old one stops accepting writes.",
      },
      {
        title: "Test linearizability",
        detail:
          "Run concurrent reads and writes through a register. Record the history and check that no read returns an older value after a completed write.",
      },
    ],
    "Batch Processing and MapReduce": [
      {
        title: "Implement word count",
        detail:
          "Write map and reduce functions over a large text file. Shuffle by key and sum counts per word.",
      },
      {
        title: "Add a combiner and partitioner",
        detail:
          "Aggregate partial counts before the shuffle and route keys to reducers by hash. Measure the reduction in shuffled bytes.",
      },
      {
        title: "Handle skew",
        detail:
          "Create one very hot key and observe a slow reducer. Add salting or a two-stage aggregation and remeasure.",
      },
    ],
    "Stream Processing and Change Data Capture": [
      {
        title: "Capture changes",
        detail:
          "Use a database trigger or an outbox table to publish every insert and update to a stream. Include the row key and version.",
      },
      {
        title: "Aggregate in windows",
        detail:
          "Compute a one-minute tumbling count per key. Compare event time with processing time and emit window results.",
      },
      {
        title: "Handle late events",
        detail:
          "Delay an event past its window and decide whether to drop, retract, or update the result. Document the policy.",
      },
    ],
    "The Future of Data Systems: Integration and Correctness": [
      {
        title: "Build an end-to-end pipeline",
        detail:
          "Ingest events, store them, derive a materialized view, and serve it through an API. Use idempotency keys at every stage.",
      },
      {
        title: "Add an audit log",
        detail:
          "Record the input event, the transformation version, and the output for every derived row. Make the derivation replayable.",
      },
      {
        title: "Inject a failure",
        detail:
          "Crash a consumer mid-batch and restart it. Verify the materialized view is correct and no event is applied twice.",
      },
    ],
  },
};
