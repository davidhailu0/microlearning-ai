import type { CourseStep } from "./course-steps";

/**
 * Hands-on steps for the technical book courses (part B): From Day Zero to
 * Zero Day, Hacker Disassembling Uncovered, and Fundamentals of Software
 * Architecture.
 */
export const bookCourseStepsB: Record<string, Record<string, CourseStep[]>> = {
  "From Day Zero to Zero Day": {
    "What Counts as a Vulnerability": [
      {
        title: "Trigger a real bug",
        detail:
          "Write a small C program that copies input with strcpy into a fixed buffer. Feed it a long string under AddressSanitizer and capture the crash.",
      },
      {
        title: "Classify the root cause",
        detail:
          "Label the bug as memory corruption, injection, or logic error. Point to the exact line and the missing check.",
      },
      {
        title: "Fix and retest",
        detail:
          "Replace the copy with a bounded operation and rerun the same input. Confirm the crash is gone and normal input still works.",
      },
    ],
    "Vulnerability Research vs. Penetration Testing": [
      {
        title: "Write rules of engagement",
        detail:
          "For a lab target, define scope, allowed techniques, time window, and emergency contact. Explicitly list out-of-scope hosts.",
      },
      {
        title: "Map the assets",
        detail:
          "List domains, ports, services, and user roles in scope. Mark which ones you may test destructively and which are read-only.",
      },
      {
        title: "Define success",
        detail:
          "Write what counts as a finding: reproducible impact, affected version, and evidence. Decide what you will not report.",
      },
    ],
    "Three Disciplines, One Workflow": [
      {
        title: "Set up the lab",
        detail:
          "Create an isolated VM with a vulnerable target, a proxy, a disassembler, and a static analyzer. Snapshot it before testing.",
      },
      {
        title: "Run all three lenses",
        detail:
          "Review the target statically, trace it dynamically, and fuzz one input. Record what each method found that the others missed.",
      },
      {
        title: "Merge the evidence",
        detail:
          "For one candidate bug, combine the source line, runtime trace, and crashing input into a single reproducible note.",
      },
    ],
    "Picking a Target: Familiarity, Availability, Impact": [
      {
        title: "Score three targets",
        detail:
          "Rate three programs from 1-5 on familiarity, ease of setup, and potential impact. Put the scores in a table.",
      },
      {
        title: "Choose and justify",
        detail:
          "Pick the target with the best total and write one paragraph explaining why the others lost.",
      },
      {
        title: "Write a hypothesis",
        detail:
          "State the most likely vulnerability class and the input path you will test first. Keep it falsifiable.",
      },
    ],
    "Taint Analysis: Sources, Sinks, and Propagators": [
      {
        title: "Annotate a small app",
        detail:
          "Mark request parameters as sources, SQL or file calls as sinks, and string concatenation as a propagator.",
      },
      {
        title: "Trace one flow by hand",
        detail:
          "Follow a parameter from the route handler to the sink. Write down every function and transformation it passes through.",
      },
      {
        title: "Confirm with a rule",
        detail:
          "Write a Semgrep taint rule for the same source and sink. Run it and check it finds your hand-traced flow.",
      },
    ],
    "Sink-to-Source: Solving the Maze Backwards": [
      {
        title: "Start at the sink",
        detail:
          "Pick a dangerous call in a small app and list every caller that can reach it. Mark which arguments are attacker-controlled.",
      },
      {
        title: "Walk backwards",
        detail:
          "Follow the argument up the call graph until you reach an HTTP parameter or file read. Note any validation on the way.",
      },
      {
        title: "Build the exploit",
        detail:
          "Craft the smallest request that reaches the sink with a harmless proof, such as reading a known file. Then patch the validation.",
      },
    ],
    "From Suspicious to Exploitable": [
      {
        title: "Write a minimal PoC",
        detail:
          "Turn the suspicious path into a repeatable request or input file. Remove everything not needed to trigger it.",
      },
      {
        title: "Prove impact",
        detail:
          "In the lab, demonstrate a concrete effect such as reading a protected file or executing a benign command. Capture the output.",
      },
      {
        title: "Fix the cause",
        detail:
          "Patch the missing validation, not just the exact payload. Rerun the PoC and a variant to confirm both are blocked.",
      },
    ],
    "Mapping the Web Attack Surface": [
      {
        title: "Inventory the routes",
        detail:
          "Use the proxy and source to list every endpoint, method, parameter, and auth requirement. Put it in a spreadsheet.",
      },
      {
        title: "Mark the risky ones",
        detail:
          "Flag endpoints that touch files, SQL, redirects, or other users' objects. Prioritize those for manual testing.",
      },
      {
        title: "Test one object reference",
        detail:
          "Change an object id to another user's id and observe the response. Record whether authorization is enforced server-side.",
      },
    ],
    "Protocols, Data Structures, and Local Surfaces": [
      {
        title: "Capture traffic",
        detail:
          "Run tcpdump or Wireshark against a lab service. Save a capture that includes a full request and response.",
      },
      {
        title: "Parse the framing",
        detail:
          "Identify the length field, message type, and payload in the binary protocol. Write a parser for one message.",
      },
      {
        title: "Fuzz a length field",
        detail:
          "Send a length larger and smaller than the actual body. Watch for crashes, hangs, or parser confusion and record the behavior.",
      },
    ],
    "Automating Review: CodeQL and Semgrep": [
      {
        title: "Write a Semgrep rule",
        detail:
          "Target a dangerous pattern in your language, such as string-built SQL. Include a message and severity.",
      },
      {
        title: "Run and triage",
        detail:
          "Scan the repository and classify each hit as true positive, false positive, or needs review. Fix one true positive.",
      },
      {
        title: "Write a CodeQL query",
        detail:
          "Express a source-to-sink taint flow for the same bug. Compare its results with your Semgrep rule.",
      },
    ],
    "Variant Analysis: When One Bug Means Many": [
      {
        title: "Abstract the bug pattern",
        detail:
          "Describe the vulnerable shape without naming the exact function, for example unchecked user input reaches a filesystem path.",
      },
      {
        title: "Search the codebase",
        detail:
          "Write a query or grep for the pattern and collect every candidate. Manually confirm which ones are reachable.",
      },
      {
        title: "Fix the family",
        detail:
          "Patch all confirmed variants with one shared helper, then add a test that would catch the pattern returning.",
      },
    ],
    "Binary Taxonomy: Triage Before You Disassemble": [
      {
        title: "Fingerprint the binary",
        detail:
          "Run file, strings, and checksec. Record architecture, packing, imports, and enabled mitigations.",
      },
      {
        title: "Classify the target",
        detail:
          "Decide whether it is a GUI app, a service, a driver, or a firmware image. Note the input path you can control.",
      },
      {
        title: "Choose a method",
        detail:
          "Pick static, dynamic, or hybrid analysis based on the mitigations and input surface. Write down why.",
      },
    ],
    "Static Analysis in Binaries: Strings to Pseudocode": [
      {
        title: "Find the entry point",
        detail:
          "Open the binary in Ghidra, locate main or the service loop, and list the functions it calls.",
      },
      {
        title: "Reconstruct one structure",
        detail:
          "Identify a struct by how fields are accessed at fixed offsets. Define it in the decompiler and rename the fields.",
      },
      {
        title: "Trace user input",
        detail:
          "Follow a recv or read buffer into the parser. Mark the bounds checks that are present and the ones that are missing.",
      },
    ],
    "Dynamic Analysis: Tracing, Hooking, and Proving Exploitability": [
      {
        title: "Break on input",
        detail:
          "Run the target under gdb and set a breakpoint on the read or recv call. Inspect the buffer before and after.",
      },
      {
        title: "Trace the parser",
        detail:
          "Single-step through the parsing function and record how the length and offsets are used. Note any unchecked arithmetic.",
      },
      {
        title: "Hook the function",
        detail:
          "Use Frida or an LD_PRELOAD shim to log arguments and return values. Confirm the vulnerable path is reachable from normal input.",
      },
    ],
    "Hybrid Analysis: Coverage, Emulation, Symbolic Execution": [
      {
        title: "Measure coverage",
        detail:
          "Run the target with a coverage build or AFL instrumentation. Identify the parser branches your inputs never reach.",
      },
      {
        title: "Emulate a function",
        detail:
          "Load the binary in angr or Qiling and call the parser with a controlled buffer. Observe the return value and memory writes.",
      },
      {
        title: "Solve a constraint",
        detail:
          "Use symbolic execution to find an input that reaches a target branch in a crackme. Confirm the solution dynamically.",
      },
    ],
    "Quick-and-Dirty Fuzzing": [
      {
        title: "Write a harness",
        detail:
          "Call the parser directly with a byte buffer instead of launching the whole program. Keep the harness deterministic.",
      },
      {
        title: "Seed the corpus",
        detail:
          "Add three valid inputs and one malformed input. Run a dumb fuzzer for a few minutes and collect crashes.",
      },
      {
        title: "Triage the first crash",
        detail:
          "Reproduce it, minimize the input, and get a stack trace. Decide whether it is a real memory-safety bug or a handled error.",
      },
    ],
    "Coverage-Guided Fuzzing with AFL++": [
      {
        title: "Instrument the target",
        detail:
          "Build with AFL++ instrumentation and confirm the forkserver starts. Set a memory limit and a timeout.",
      },
      {
        title: "Run and minimize",
        detail:
          "Fuzz with your seed corpus until you collect crashes. Use afl-tmin on each crash to shrink it.",
      },
      {
        title: "Fix and verify",
        detail:
          "Patch the root cause, rebuild, and replay the minimized crash. Then run the corpus again to check for regressions.",
      },
    ],
    "Fuzzing Everything Else": [
      {
        title: "Pick a new surface",
        detail:
          "Choose an HTTP API, a file format, or a network protocol. Write a harness that feeds one input to one parser.",
      },
      {
        title: "Handle state",
        detail:
          "For stateful targets, reset the service between runs or model the protocol handshake in the harness.",
      },
      {
        title: "Deduplicate crashes",
        detail:
          "Group crashes by stack trace and root cause. Report unique bugs, not the number of crashing inputs.",
      },
    ],
    "Disclosure Without Drama": [
      {
        title: "Write the advisory",
        detail:
          "Include affected versions, root cause, impact, reproduction steps, and a suggested fix. Remove unnecessary exploit detail.",
      },
      {
        title: "Contact the maintainer",
        detail:
          "Find the security contact and send a concise report with a private reproduction. Record the date and response.",
      },
      {
        title: "Set a timeline",
        detail:
          "Agree on a disclosure date and a status update cadence. Document what happens if the deadline passes without a fix.",
      },
    ],
    "Writing the Report, Getting the CVE": [
      {
        title: "Score the issue",
        detail:
          "Build a CVSS vector from the actual attack path. Justify each metric with evidence from the lab.",
      },
      {
        title: "Submit the request",
        detail:
          "Fill in the CVE request form with vendor, product, versions, and a clear description. Attach the advisory.",
      },
      {
        title: "Publish responsibly",
        detail:
          "Release the advisory after the fix or agreed deadline. Include mitigation guidance and credit the reporter.",
      },
    ],
  },

  "Hacker Disassembling Uncovered": {
    "Protection Classifications and Protection Strength": [
      {
        title: "Classify five programs",
        detail:
          "Pick five binaries and record packing, anti-debugging, registration checks, and integrity checks. Rate each protection from weak to strong.",
      },
      {
        title: "Inspect the imports",
        detail:
          "List security-relevant imports such as IsDebuggerPresent, VirtualProtect, and CreateRemoteThread. Explain what each implies.",
      },
      {
        title: "Write the assessment",
        detail:
          "For one target, state the likely protection scheme and the analysis approach you would use first.",
      },
    ],
    "Steps One to Three: Warming Up, the Disassembler, and Surgery": [
      {
        title: "Load the crackme",
        detail:
          "Open it in a disassembler, find the entry point, and locate the string or message shown on failure.",
      },
      {
        title: "Find the check",
        detail:
          "Follow references to the failure message back to the conditional jump that decides success or failure.",
      },
      {
        title: "Patch and verify",
        detail:
          "Invert the jump or NOP the check in a copy, then run it with both correct and incorrect input. Confirm the patched behavior.",
      },
    ],
    "Method 0 and Method 1: Cracking the Password and Searching Memory": [
      {
        title: "Search the binary",
        detail:
          "Use strings and a hex search for the password or a related error message. Record the address of every hit.",
      },
      {
        title: "Break on comparison",
        detail:
          "Set a breakpoint on strcmp or the equivalent and inspect both arguments when the dialog is submitted.",
      },
      {
        title: "Extract the secret",
        detail:
          "Read the valid password from memory, then confirm it works in the unmodified program.",
      },
    ],
    "Method 2 and Method 3: Breakpoints on the Input Function and on Messages": [
      {
        title: "Break on input",
        detail:
          "Set a breakpoint on GetDlgItemText or the input API, submit a known string, and find the buffer address.",
      },
      {
        title: "Trace to the check",
        detail:
          "Set a memory breakpoint on the buffer and follow execution to the comparison or hashing routine.",
      },
      {
        title: "Break on the message",
        detail:
          "Break on MessageBox and walk up the call stack to the branch that chose the failure message. Patch that branch.",
      },
    ],
    "Step Five and Step Six: IDA's Analysis and Pairing a Disassembler with a Debugger": [
      {
        title: "Annotate in IDA",
        detail:
          "Rename the functions you identified, add comments at the check, and rebuild the call graph around the registration path.",
      },
      {
        title: "Sync with the debugger",
        detail:
          "Attach x64dbg or gdb using the same base address, set a breakpoint at your annotated function, and confirm it hits.",
      },
      {
        title: "Write the map",
        detail:
          "Produce a short function map from input to validation to success. Use it to explain the protection without stepping again.",
      },
    ],
    "Functions and Start-up Functions": [
      {
        title: "Recognize the prologue",
        detail:
          "Find push ebp, mov ebp, esp patterns and mark every function start in a small binary.",
      },
      {
        title: "Identify the calling convention",
        detail:
          "At one call site, determine which arguments are pushed and who cleans the stack. Name the convention.",
      },
      {
        title: "Rename and type",
        detail:
          "Give each function a name and a prototype in the disassembler. Verify the decompiler output becomes readable.",
      },
    ],
    "Virtual Functions, Constructors, and Destructors": [
      {
        title: "Find the vtable",
        detail:
          "Locate a constructor that writes a pointer to a table of function addresses. Dump the table and map each slot.",
      },
      {
        title: "Resolve virtual calls",
        detail:
          "At an indirect call through [eax+offset], identify the object and the slot. Follow it to the concrete implementation.",
      },
      {
        title: "Reconstruct the class",
        detail:
          "Write a pseudo-C++ class with fields in offset order and virtual methods in vtable order. Check it against two call sites.",
      },
    ],
    "Objects, Structures, Arrays, the this Pointer, and new/delete": [
      {
        title: "Map the struct",
        detail:
          "From field accesses at fixed offsets, build a struct layout with types and padding. Mark the this pointer in each method.",
      },
      {
        title: "Find array indexing",
        detail:
          "Locate a scaled index such as [ebx+ecx*4] and determine the element size and bounds behavior.",
      },
      {
        title: "Trace allocation",
        detail:
          "Break on new or malloc, record the requested size, and follow the returned pointer into the constructor.",
      },
    ],
    "Library Functions: Recognising Code You Did Not Write": [
      {
        title: "Spot statically linked code",
        detail:
          "Find repeated function prologues with no imports nearby. Compare byte patterns with a known libc build.",
      },
      {
        title: "Apply signatures",
        detail:
          "Use FLIRT or a signature pack to label known library functions. Verify one label by checking its arguments and behavior.",
      },
      {
        title: "Reduce the noise",
        detail:
          "Rename the identified library functions and hide them. Recheck how much easier the remaining code is to read.",
      },
    ],
    "Function Arguments, Part 1–2: Calling Conventions and Reading a Prototype": [
      {
        title: "Compile three conventions",
        detail:
          "Write the same function with cdecl, stdcall, and fastcall. Compare the caller and callee disassembly for each.",
      },
      {
        title: "Read a prototype",
        detail:
          "At a call site, infer argument count and types from pushes, register loads, and later use. Write the C prototype.",
      },
      {
        title: "Verify with a harness",
        detail:
          "Call the function from a small test program using your prototype. If it crashes or returns garbage, revise the types.",
      },
    ],
    "Function Arguments, Part 3–5: Register Passing, Return Values, and Reconstructing Prototypes": [
      {
        title: "Map x64 arguments",
        detail:
          "Compile a function with six integer arguments and identify RCX, RDX, R8, R9, and the stack slots.",
      },
      {
        title: "Find the return value",
        detail:
          "Check RAX after the call and how the caller uses it. Distinguish a value return from a struct return via hidden pointer.",
      },
      {
        title: "Reconstruct and test",
        detail:
          "Write the full prototype, call the function with sample inputs, and compare the result with the disassembly's logic.",
      },
    ],
    "How the Debugger Works and How Exceptions Are Delivered": [
      {
        title: "Trace an exception",
        detail:
          "Raise a divide-by-zero in a debuggee. Follow the debug event, the SEH chain, and the handler that runs.",
      },
      {
        title: "Set a handler breakpoint",
        detail:
          "Break on the exception dispatcher or your handler. Inspect the exception record and context.",
      },
      {
        title: "Write a handler",
        detail:
          "Add a vectored exception handler that logs the address and continues. Confirm it runs before the default crash dialog.",
      },
    ],
    "Protecting Programs: Anti-Tracing, Anti-Breakpoint, and Self-Modifying Code": [
      {
        title: "Detect a debugger",
        detail:
          "Compile a program that calls IsDebuggerPresent and changes behavior. Observe it under and without a debugger.",
      },
      {
        title: "Defeat the check",
        detail:
          "Patch the conditional branch or hook the API to return false. Confirm the protected path now runs.",
      },
      {
        title: "Spot self-modifying code",
        detail:
          "Find a routine that writes to its own code page, then sets execution permission. Dump the page after modification.",
      },
    ],
    "Windows Memory Architecture, WriteProcessMemory, Stack Execution, and Relocatable Code": [
      {
        title: "Inject a DLL",
        detail:
          "Use OpenProcess, VirtualAllocEx, WriteProcessMemory, and CreateRemoteThread to load a benign DLL into a lab process.",
      },
      {
        title: "Test stack execution",
        detail:
          "Allocate RWX memory and run a small stub that returns a value. Then enable DEP and confirm execution is blocked.",
      },
      {
        title: "Handle relocation",
        detail:
          "Write position-independent code that finds its own base. Compare it with code that assumes a fixed image base.",
      },
    ],
    "Optimizing Compilers, Self-Modifying Protection, and Where Protection Goes Next": [
      {
        title: "Diff optimization levels",
        detail:
          "Compile the same function at -O0 and -O2. Identify inlining, loop unrolling, and register reuse in the disassembly.",
      },
      {
        title: "Recognize optimized idioms",
        detail:
          "Find a memset, memcpy, or division turned into shifts and multiplication. Rewrite the likely source in C.",
      },
      {
        title: "Assess a modern protector",
        detail:
          "Run a demo of a commercial packer or VM-based protector. List the layers you can identify and which analysis method would attack each.",
      },
    ],
  },

  "Fundamentals of Software Architecture": {
    "What Software Architecture Actually Is": [
      {
        title: "Define it for a real system",
        detail:
          "Pick a system you know and write its architecture as the set of structures, decisions, and constraints that are hard to change.",
      },
      {
        title: "List the structures",
        detail:
          "Draw the component, deployment, and data structures separately. Note which diagram answers which stakeholder question.",
      },
      {
        title: "Identify the decisions",
        detail:
          "Mark three choices that would be expensive to reverse. Explain the forces behind each.",
      },
    ],
    "The Three Laws of Software Architecture": [
      {
        title: "Find a real tradeoff",
        detail:
          "Choose a system and show one decision that improved performance but hurt maintainability, or the reverse.",
      },
      {
        title: "Show why there is no free lunch",
        detail:
          "List the benefit, the cost, and who pays it. Explain why the alternative also has a cost.",
      },
      {
        title: "Rank the tradeoff",
        detail:
          "Decide whether the tradeoff was worth it for that context. Write the conditions under which you would reverse it.",
      },
    ],
    "What Architects Are Expected to Do": [
      {
        title: "Write the role charter",
        detail:
          "List the architect's responsibilities across discovery, design, delivery, and operations. Keep it to one page.",
      },
      {
        title: "Map the stakeholders",
        detail:
          "Identify business, development, operations, and security stakeholders. Note what each needs from the architecture.",
      },
      {
        title: "Define the deliverables",
        detail:
          "Choose the artifacts you will produce: diagrams, ADRs, fitness functions, and a risk register. Say when each is due.",
      },
    ],
    "Architectural Thinking: Design, Breadth, and the Caveman Trap": [
      {
        title: "Separate design from architecture",
        detail:
          "Take one feature and list its local design choices versus the architectural constraints it must respect.",
      },
      {
        title: "Spot the caveman trap",
        detail:
          "Find a decision made from habit rather than context. Rewrite it as an explicit tradeoff with alternatives.",
      },
      {
        title: "Write the memo",
        detail:
          "Explain the decision, the forces, the alternatives, and the consequence in under 300 words.",
      },
    ],
    "Styles, Patterns, and the Big Ball of Mud": [
      {
        title: "Catalog three systems",
        detail:
          "For three systems you know, name the dominant architecture style and the patterns visible in the code.",
      },
      {
        title: "Find the mud",
        detail:
          "Identify one area with no clear boundaries. List the symptoms: shared tables, cyclic dependencies, or unclear ownership.",
      },
      {
        title: "Propose seams",
        detail:
          "Suggest two boundaries that could be introduced incrementally. Explain what would move behind each.",
      },
    ],
    "Modularity and the Metrics of Code": [
      {
        title: "Compute coupling",
        detail:
          "For one module, count afferent and efferent dependencies. Calculate instability as efferent divided by total coupling.",
      },
      {
        title: "Draw the graph",
        detail:
          "Build a dependency graph for ten modules. Mark cycles and the modules with the highest fan-in.",
      },
      {
        title: "Break one cycle",
        detail:
          "Introduce an interface or move a shared type to break a cycle. Recompute the metrics and show the change.",
      },
    ],
    "Architectural Characteristics Defined": [
      {
        title: "Define ten characteristics",
        detail:
          "Write one-sentence definitions for availability, scalability, performance, security, and six others.",
      },
      {
        title: "Make them measurable",
        detail:
          "For three characteristics, define a metric, target, and measurement method. Avoid adjectives without numbers.",
      },
      {
        title: "Pick three",
        detail:
          "Choose the three that matter most for a sample system. Explain why the others are lower priority.",
      },
    ],
    "Finding the Right Characteristics": [
      {
        title: "Interview a stakeholder",
        detail:
          "Ask what success looks like and what failure costs. Turn the answers into candidate characteristics.",
      },
      {
        title: "Rank them",
        detail:
          "Score each candidate by business importance and technical risk. Keep the top five.",
      },
      {
        title: "Validate the list",
        detail:
          "Review the five with a developer and an operator. Remove any that cannot be measured or do not change a decision.",
      },
    ],
    "Measuring, Governing, and Fitness Functions": [
      {
        title: "Write a fitness function",
        detail:
          "Add an ArchUnit or equivalent test that fails when a layer depends on a forbidden layer.",
      },
      {
        title: "Put it in CI",
        detail:
          "Run the fitness function on every pull request. Make the failure message name the offending dependency.",
      },
      {
        title: "Break it on purpose",
        detail:
          "Add a forbidden import, watch CI fail, then remove it. Confirm the guard actually protects the characteristic.",
      },
    ],
    "Architecture Quantum and the Scope of Characteristics": [
      {
        title: "Identify the quanta",
        detail:
          "For a system, group components that share a database and deployment. Each group is a candidate quantum.",
      },
      {
        title: "Map the coupling",
        detail:
          "Draw synchronous calls and shared data between quanta. Mark where a characteristic must hold across a boundary.",
      },
      {
        title: "Split one quantum",
        detail:
          "Propose splitting a shared database or deployment. List the new failure modes and the coordination cost.",
      },
    ],
    "Component-Based Thinking": [
      {
        title: "Decompose the domain",
        detail:
          "List the business capabilities and group them into components with one reason to change each.",
      },
      {
        title: "Define contracts",
        detail:
          "For each component, write its responsibilities, inputs, outputs, and owned data. Note what it must not expose.",
      },
      {
        title: "Check cohesion and coupling",
        detail:
          "Score each component on internal cohesion and external dependencies. Merge or split the worst outliers.",
      },
    ],
    "Layered Architecture": [
      {
        title: "Build three layers",
        detail:
          "Implement presentation, domain, and persistence layers for one feature. Keep the domain free of framework imports.",
      },
      {
        title: "Enforce the rules",
        detail:
          "Add a test that forbids the domain from importing the web or database layer. Run it in CI.",
      },
      {
        title: "Measure the cost",
        detail:
          "Trace one request through the layers and count the mapping steps. Decide whether the isolation is worth it here.",
      },
    ],
    "The Modular Monolith": [
      {
        title: "Define module APIs",
        detail:
          "Create modules with explicit public interfaces and private internals. Hide the database schema behind each module.",
      },
      {
        title: "Enforce boundaries",
        detail:
          "Add build or test rules that block cross-module access to internal packages. Verify a violation fails.",
      },
      {
        title: "Extract one module",
        detail:
          "Move a module behind an HTTP or in-process boundary. Measure the change in deployment and latency.",
      },
    ],
    "Pipeline Architecture (Pipes and Filters)": [
      {
        title: "Build a pipeline",
        detail:
          "Implement three filters for parsing, transforming, and writing log lines. Connect them with a simple pipe.",
      },
      {
        title: "Add a filter",
        detail:
          "Insert a redaction filter without changing the existing filters. Confirm the pipeline still composes.",
      },
      {
        title: "Test failure handling",
        detail:
          "Make one filter fail on a bad record. Decide whether to skip, retry, or stop, and implement that policy.",
      },
    ],
    "Microkernel (Plug-In) Architecture": [
      {
        title: "Define the plug-in contract",
        detail:
          "Write the interface a plug-in must implement, including lifecycle and error handling. Keep the core independent of concrete plug-ins.",
      },
      {
        title: "Build two plug-ins",
        detail:
          "Implement one real plug-in and one stub. Load both through the same registry.",
      },
      {
        title: "Add one without core changes",
        detail:
          "Create a third plug-in and register it. Confirm no core file changed and the new behavior appears.",
      },
    ],
    "Service-Based Architecture": [
      {
        title: "Split into services",
        detail:
          "Divide a small app into two or three services with clear data ownership. Define the synchronous contracts between them.",
      },
      {
        title: "Implement the calls",
        detail:
          "Build REST or RPC endpoints for the contracts. Add timeouts and a clear error shape.",
      },
      {
        title: "Measure the coupling",
        detail:
          "Trace a request across services and count network hops. Decide whether a shared library or a coarser service would be simpler.",
      },
    ],
    "Event-Driven Architecture": [
      {
        title: "Build a topic",
        detail:
          "Publish domain events to a broker such as Kafka or Redis Streams. Include an event id, type, and timestamp.",
      },
      {
        title: "Add an idempotent consumer",
        detail:
          "Track processed event ids and ignore duplicates. Replay the topic and verify side effects happen once.",
      },
      {
        title: "Test replay and ordering",
        detail:
          "Replay from the beginning and confirm the read model rebuilds. Then send an out-of-order event and handle it explicitly.",
      },
    ],
    "Space-Based Architecture": [
      {
        title: "Add an in-memory grid",
        detail:
          "Put a cache or data grid in front of the database. Route reads and writes through it with a clear consistency policy.",
      },
      {
        title: "Test under load",
        detail:
          "Drive concurrent requests and measure latency with and without the grid. Record cache hit rate.",
      },
      {
        title: "Handle a node loss",
        detail:
          "Stop one grid node and verify data is not lost and requests reroute. Document the recovery behavior.",
      },
    ],
    "Orchestration-Driven SOA: A Cautionary Tale": [
      {
        title: "Diagram the anti-pattern",
        detail:
          "Draw a central orchestrator calling many services with shared contracts. Mark the single point of failure and the coupling.",
      },
      {
        title: "List the symptoms",
        detail:
          "Identify long release cycles, chatty calls, and shared data. Explain how each follows from the orchestration model.",
      },
      {
        title: "Propose a simplification",
        detail:
          "Suggest two services that could merge or an event that could replace a synchronous call. Estimate the reduction in coupling.",
      },
    ],
    "Microservices": [
      {
        title: "Define boundaries",
        detail:
          "Choose two business capabilities and give each its own data store and deployable service.",
      },
      {
        title: "Add a gateway",
        detail:
          "Route external calls through a gateway or reverse proxy. Keep service discovery and auth concerns there.",
      },
      {
        title: "Test failure isolation",
        detail:
          "Stop one service and confirm the other still serves its own traffic. Add a timeout or circuit breaker where the failure leaked.",
      },
    ],
    "Choosing the Appropriate Architecture Style": [
      {
        title: "Build a decision matrix",
        detail:
          "List five characteristics as rows and four candidate styles as columns. Score each style 1-5 with a short justification.",
      },
      {
        title: "Weight the rows",
        detail:
          "Assign weights to the characteristics based on business priorities. Recompute the scores.",
      },
      {
        title: "Defend the choice",
        detail:
          "Write the recommendation, the runner-up, and the conditions that would change your mind.",
      },
    ],
    "Architectural Patterns That Recur": [
      {
        title: "Map patterns to a system",
        detail:
          "Find examples of layered, pipeline, and event-driven patterns in one codebase. Note where each appears.",
      },
      {
        title: "Name the forces",
        detail:
          "For each pattern, write the problem it solves and the cost it introduces.",
      },
      {
        title: "Document the reuse",
        detail:
          "Create a short pattern catalog for your team with one local example per pattern.",
      },
    ],
    "Decision Antipatterns and Architecture Decision Records": [
      {
        title: "Write an ADR",
        detail:
          "Record the context, decision, alternatives, and consequences for a real choice. Give it a number and status.",
      },
      {
        title: "Spot an antipattern",
        detail:
          "Find a decision made without alternatives or without recording consequences. Explain the risk.",
      },
      {
        title: "Review the ADR",
        detail:
          "Have a peer challenge the decision. Update the record with the strongest counterargument.",
      },
    ],
    "Analyzing Risk with Risk Storming": [
      {
        title: "Run the session",
        detail:
          "Put a diagram on the wall and have participants mark risks individually before discussing them.",
      },
      {
        title: "Rank the risks",
        detail:
          "Score impact and likelihood for each mark. Group duplicates and keep the top five.",
      },
      {
        title: "Mitigate one",
        detail:
          "Choose the highest risk and write a concrete mitigation, owner, and check. Add it to the architecture backlog.",
      },
    ],
    "Diagramming Architecture": [
      {
        title: "Draw the context view",
        detail:
          "Show the system, its users, and external systems with arrows for data flow. Keep technology out of this level.",
      },
      {
        title: "Draw the container view",
        detail:
          "Show deployable units, databases, and protocols. Label every arrow with the protocol and direction.",
      },
      {
        title: "Review for clarity",
        detail:
          "Ask someone unfamiliar to explain the diagram back. Fix any arrow or box they cannot justify.",
      },
    ],
    "Making Teams Effective": [
      {
        title: "Map the teams",
        detail:
          "List teams, their ownership, and their dependencies. Identify one stream-aligned, platform, and enabling role.",
      },
      {
        title: "Find the cognitive load",
        detail:
          "Mark the systems each team must understand. Flag any team owning too many unrelated domains.",
      },
      {
        title: "Propose a change",
        detail:
          "Suggest one boundary or platform service that would reduce load. State the tradeoff and the migration cost.",
      },
    ],
    "Negotiating with Stakeholders, Architects, and Developers": [
      {
        title: "Role-play the conflict",
        detail:
          "Take a stakeholder who wants speed and a developer who wants correctness. Write both positions fairly.",
      },
      {
        title: "Find the shared constraint",
        detail:
          "Identify the outcome both sides need. Reframe the decision around that outcome rather than either preference.",
      },
      {
        title: "Write the tradeoff memo",
        detail:
          "Record the options, the cost of each, and the recommendation. Get an explicit decision and owner.",
      },
    ],
    "Architectural Intersections": [
      {
        title: "Map the intersections",
        detail:
          "List where architecture touches product, operations, security, and org design. Give one concrete example each.",
      },
      {
        title: "Find the friction",
        detail:
          "Identify one place where an architectural decision creates an organizational problem, or the reverse.",
      },
      {
        title: "Propose an adjustment",
        detail:
          "Suggest a change to the architecture or the team boundary that reduces the friction. State the tradeoff.",
      },
    ],
    "The Laws, Revisited: Doing Trade-Off Analysis": [
      {
        title: "Score two options",
        detail:
          "Pick two realistic architecture options and score them against five weighted characteristics.",
      },
      {
        title: "Write the recommendation",
        detail:
          "State the winner, the margin, and the assumptions that drove the result. Name the runner-up's advantage.",
      },
      {
        title: "Record the reversal conditions",
        detail:
          "Write what would have to change for the other option to win. Add the analysis to an ADR.",
      },
    ],
  },
};
