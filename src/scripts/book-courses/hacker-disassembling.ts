import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const hackerDisassemblingCourse: DraftCourse = {
  title: "Hacker Disassembling Uncovered",
  description: "Kaspersky's reverse-engineering manual, rebuilt as a course: classify a protection, take a program apart with a disassembler and debugger, reconstruct C++ objects and calling conventions, and understand how debuggers and protections actually work at the instruction level.",
  category: "Reverse Engineering",
  level: "advanced",
  coverEmoji: "🔬",
  tags: [
    "reverse engineering",
    "disassembly",
    "debugging",
    "x86",
    "software protection",
  ],
  modules: [
    {
      title: "Module 1 — Classifying Protections and Taking a Program Apart (Steps One to Three)",
      summary: "How protections are classified and graded, and the first three practical steps: warm up, learn the disassembler, then patch with surgery.",
      lessons: [
        {
          title: "Protection Classifications and Protection Strength",
          objective: "Classify a protection scheme by what it does and how it is implemented, and judge its strength in terms of the effort required to defeat it.",
          hook: "Every protection is a lock, and every lock is a promise that the reverse engineer gets to test.",
          paragraphs: [
            "Kaspersky opens by refusing to treat 'protection' as one thing. Protections are classified by the asset they defend (a password, a serial number, a whole program), by the moment they check (at launch, at a specific feature, continuously), and by the mechanism they rely on (a comparison, a hardware dongle, a cryptographic key, code obfuscation). The classification matters because each category has a characteristic weakness: static comparisons fall to patched jumps, continuous checks fall to interrupts, and key-based schemes fall to whoever holds the key.",
            "The second half is about strength, and Kaspersky insists strength is not a property of the algorithm alone. A theoretically weak check surrounded by anti-debugging, self-modifying code, and checksum verification may consume far more attacker time than a strong cipher with a trivially locatable key comparison. Strength is therefore measured in the effort and expertise needed to break it — the reverse engineer's cost function — which is why commercial protections spend most of their complexity on making analysis expensive rather than on making the secret mathematically unguessable.",
            "He also introduces the economic framing that runs through the book: a protection only needs to be stronger than the value of what it protects, and only against the attackers who actually care. This is why dongles and online activation coexist with pure algorithmic schemes, and why the result of most cracking is not a broken algorithm but a bypassed check.",
          ],
          bullets: [
            "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
            "Strength is attacker effort, not cryptographic rigour: layering anti-debugging, self-modifying code, and checksums around a weak check often costs more to defeat than a strong check with an obvious key comparison.",
            "The economic frame governs design — a protection need only exceed the value of the asset against realistic attackers, which is why bypassing a check beats breaking an algorithm.",
            "Understanding the classification tells the analyst where to look first, converting a blind search into a targeted hypothesis about which check to locate and patch.",
            "The classification matters because each category has a characteristic weakness: static comparisons fall to patched jumps, continuous checks fall to interrupts, and key-based schemes fall to whoever holds the key.",
            "He also introduces the economic framing that runs through the book: a protection only needs to be stronger than the value of what it protects, and only against the attackers who actually care.",
          ],
          steps: [
            {
              title: "Classify five programs",
              detail: "Pick five binaries and record packing, anti-debugging, registration checks, and integrity checks. Rate each protection from weak to strong.",
            },
            {
              title: "Inspect the imports",
              detail: "List security-relevant imports such as IsDebuggerPresent, VirtualProtect, and CreateRemoteThread. Explain what each implies.",
            },
            {
              title: "Write the assessment",
              detail: "For one target, state the likely protection scheme and the analysis approach you would use first.",
            },
          ],
          takeaway: "Protection strength is the cost it imposes on an attacker, so the study of protection is the study of analysis cost rather than of secrecy alone.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "layers",
                from: "cmp",
                label: "hardening",
              },
              {
                to: "layers",
                from: "cont",
                label: "hardening",
              },
              {
                to: "layers",
                from: "key",
                label: "hardening",
              },
            ],
            nodes: [
              {
                id: "cmp",
                label: "Static comparison -> patched jump",
                emphasis: true,
              },
              {
                id: "cont",
                label: "Continuous check -> interrupt",
                emphasis: false,
              },
              {
                id: "key",
                label: "Key-based -> key extraction",
                emphasis: false,
              },
              {
                id: "layers",
                label: "Layered anti-debug -> time cost",
                emphasis: true,
              },
            ],
            title: "Where protections fail",
          },
          quiz: {
            question: "Why does Kaspersky treat protection strength as a measure of attacker effort rather than of algorithmic security?",
            options: [
              "Because all protection algorithms are equally weak in practice",
              "Because what determines whether a protection holds is the time, skill, and tooling an attacker must invest — which anti-debugging, obfuscation, and self-modifying code raise far more cheaply than stronger cryptography does",
              "Because cryptographic strength cannot be measured for closed-source programs",
              "Because attackers never attempt to break strong algorithms",
            ],
            correctIndex: 1,
            explanation: "The attacker's goal is usually to bypass a check, not to break a cipher. Anything that raises the cost of finding and patching that check — layers, deception, continuous verification — delays the attack, so effort is the meaningful metric.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Protection Classifications and Protection Strength”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
                "Method 2 breaks on the input API, lets it fire when the credential is requested, and steps out to the caller — the code that will perform verification — instead of reading the whole binary.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.”",
            },
            {
              question: "Which statement best explains “What are the three axes Kaspersky uses to classify a protection?”?",
              options: [
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
                "Because the API itself is not the target — the code that called it is. The return address on the stack points at the caller, which is where the credential is handled and eventually verified. Stepping over would return control to the caller only after the API finishes, and you would still need to find the caller; stepping out lands you inside it directly, with the return address known.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.”",
            },
            {
              question: "Which of these is a hands-on step in “Protection Classifications and Protection Strength”?",
              options: [
                "Find array indexing",
                "Map the struct",
                "Trace allocation",
                "Classify five programs",
              ],
              correctIndex: 3,
              explanation: "“Classify five programs” is part of this lesson's sequence: Pick five binaries and record packing, anti-debugging, registration checks, and integrity checks. Rate each protection from weak to strong.",
            },
            {
              question: "What does the hands-on step “Inspect the imports” involve?",
              options: [
                "List security-relevant imports such as IsDebuggerPresent, VirtualProtect, and CreateRemoteThread. Explain what each implies.",
                "Invert the jump or NOP the check in a copy, then run it with both correct and incorrect input. Confirm the patched behavior.",
                "Open it in a disassembler, find the entry point, and locate the string or message shown on failure.",
                "Read the valid password from memory, then confirm it works in the unmodified program.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Inspect the imports” as: List security-relevant imports such as IsDebuggerPresent, VirtualProtect, and CreateRemoteThread. Explain what each implies.",
            },
          ],
          flashcards: [
            {
              front: "What are the three axes Kaspersky uses to classify a protection?",
              back: "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
            },
            {
              front: "Why do commercial protections invest more in anti-analysis than in cryptography?",
              back: "Because breaking the cipher is usually unnecessary — the attacker can find the comparison that decides 'licensed or not' and invert it. Making that discovery expensive (packing, anti-debugging, integrity checks, self-modifying code) attacks the actual bottleneck, which is the analyst's time. Strong crypto helps only if the secret is genuinely needed at run time, which is rarely the case for a simple licence flag.",
            },
            {
              front: "How do you write the assessment?",
              back: "For one target, state the likely protection scheme and the analysis approach you would use first.",
            },
            {
              front: "How do you inspect the imports?",
              back: "List security-relevant imports such as IsDebuggerPresent, VirtualProtect, and CreateRemoteThread. Explain what each implies.",
            },
            {
              front: "How do you classify five programs?",
              back: "Pick five binaries and record packing, anti-debugging, registration checks, and integrity checks. Rate each protection from weak to strong.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Protection Classifications; Protection Strength",
            pageStart: null,
            pageEnd: null,
            note: "Classifies protections by protected asset, check timing, and mechanism, and argues that strength equals the effort imposed on an attacker, so layering anti-analysis beats stronger cryptography.",
            sectionIndexes: [
              3,
              4,
            ],
          },
          estimatedMinutes: 13,
        },
        {
          title: "Steps One to Three: Warming Up, the Disassembler, and Surgery",
          objective: "Use a disassembler to locate a protection check, and patch the binary surgically by altering the decision rather than the algorithm.",
          hook: "Surgery means changing one conditional jump — and the program believes it is registered.",
          paragraphs: [
            "Step One is preparation, and Kaspersky treats it as reconnaissance rather than action. Identify the executable's type and packer, note its imports (which reveal the APIs it must call for input, comparison, and message boxes), run it under observation, and gather strings. The goal is a map: where the program asks for a password, where it might compare, and where it reports failure. Warming up means avoiding the temptation to start reading disassembly before you know what you are looking for.",
            "Step Two introduces the disassembler as an instrument with limitations. It converts bytes to mnemonics, resolves jumps into labels, and annotates imported calls, but it cannot distinguish code from data — so data embedded in the text section, jump tables, and obfuscated sequences all produce plausible-looking nonsense. Kaspersky teaches the reader to cross-check statically derived addresses against dynamic behaviour, and to be suspicious of any listing that looks superficially reasonable but does not fit the program's observed actions.",
            "Step Three is the classic patch. Find the conditional jump that follows the comparison of the entered password against the computed one, and invert or remove it. Kaspersky explains the mechanics — the opcode for JE versus JNE, unconditional jumps over the failure path, or replacing the comparison with a constant — and equally the discipline: patch the smallest possible region, record the original bytes, and verify by re-running rather than assuming. He insists on understanding why a patch works, because a patch that works by accident breaks on the next build.",
            "The chapter's method is what makes the book practical: observe, locate, understand, then modify minimally. Every later technique in the book is a variation on this loop, with more sophisticated instruments.",
          ],
          bullets: [
            "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
            "A disassembler cannot tell code from data, so embedded tables, jump tables, and obfuscation produce convincing garbage — static listings must be validated against dynamic behaviour.",
            "Surgery means inverting a conditional jump or replacing a comparison with a constant, patching the smallest region and saving the original bytes so the change is reversible.",
            "Verify every patch by re-running and by explaining why it works; a patch that succeeds by accident will fail on the next version of the binary.",
            "Identify the executable's type and packer, note its imports (which reveal the APIs it must call for input, comparison, and message boxes), run it under observation, and gather strings.",
            "The goal is a map: where the program asks for a password, where it might compare, and where it reports failure.",
          ],
          steps: [
            {
              title: "Load the crackme",
              detail: "Open it in a disassembler, find the entry point, and locate the string or message shown on failure.",
            },
            {
              title: "Find the check",
              detail: "Follow references to the failure message back to the conditional jump that decides success or failure.",
            },
            {
              title: "Patch and verify",
              detail: "Invert the jump or NOP the check in a copy, then run it with both correct and incorrect input. Confirm the patched behavior.",
            },
          ],
          takeaway: "Locate the decision, understand the condition, and change the smallest possible number of bytes — the discipline of the patch is as important as the patch itself.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "locate",
                from: "recon",
                label: "map",
              },
              {
                to: "under",
                from: "locate",
                label: "read flags",
              },
              {
                to: "patch",
                from: "under",
                label: "invert jump",
              },
              {
                to: "verify",
                from: "patch",
                label: "",
              },
            ],
            nodes: [
              {
                id: "recon",
                label: "Warm up: type, imports, strings",
                emphasis: false,
              },
              {
                id: "locate",
                label: "Locate check in disassembly",
                emphasis: true,
              },
              {
                id: "under",
                label: "Understand condition + flags",
                emphasis: true,
              },
              {
                id: "patch",
                label: "Minimal patch, save originals",
                emphasis: false,
              },
              {
                id: "verify",
                label: "Re-run and explain",
                emphasis: false,
              },
            ],
            title: "The reversing loop",
          },
          quiz: {
            question: "Why does Kaspersky insist on understanding the comparison before patching the jump that follows it?",
            options: [
              "Because disassemblers refuse to patch bytes that have not been annotated",
              "Because a conditional jump tests flags set by the preceding comparison, so a patch that inverts the wrong condition or lands on a different code path will appear to work in one scenario and fail in others",
              "Because patching without understanding violates the software licence",
              "Because the CPU requires the comparison and jump to be adjacent in memory",
            ],
            correctIndex: 1,
            explanation: "The jump's meaning depends entirely on which flag the comparison set and which branch leads to the success path. Without that reasoning you cannot know whether your byte change alters the decision or merely breaks an unrelated path — and you cannot adapt when the binary changes.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Steps One to Three: Warming Up, the Disassembler, and Surgery”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
                "Method 2 breaks on the input API, lets it fire when the credential is requested, and steps out to the caller — the code that will perform verification — instead of reading the whole binary.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.”",
            },
            {
              question: "Which statement best explains “What does a disassembler fundamentally fail to determine, and why does it matter?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "Because the API itself is not the target — the code that called it is. The return address on the stack points at the caller, which is where the credential is handled and eventually verified. Stepping over would return control to the caller only after the API finishes, and you would still need to find the caller; stepping out lands you inside it directly, with the return address known.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.”",
            },
            {
              question: "Which of these is a hands-on step in “Steps One to Three: Warming Up, the Disassembler, and Surgery”?",
              options: [
                "Assess a modern protector",
                "Diff optimization levels",
                "Recognize optimized idioms",
                "Load the crackme",
              ],
              correctIndex: 3,
              explanation: "“Load the crackme” is part of this lesson's sequence: Open it in a disassembler, find the entry point, and locate the string or message shown on failure.",
            },
            {
              question: "What does the hands-on step “Find the check” involve?",
              options: [
                "Follow references to the failure message back to the conditional jump that decides success or failure.",
                "Raise a divide-by-zero in a debuggee. Follow the debug event, the SEH chain, and the handler that runs.",
                "Compile a program that calls IsDebuggerPresent and changes behavior. Observe it under and without a debugger.",
                "Find a routine that writes to its own code page, then sets execution permission. Dump the page after modification.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Find the check” as: Follow references to the failure message back to the conditional jump that decides success or failure.",
            },
          ],
          flashcards: [
            {
              front: "What does a disassembler fundamentally fail to determine, and why does it matter?",
              back: "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
            },
            {
              front: "Why is the smallest possible patch the right patch?",
              back: "Because every modified byte is a chance to break something unrelated, and because a minimal change is easier to explain, to reproduce on other builds, and to revert. Changing one conditional jump leaves the surrounding logic — buffer handling, error reporting, cleanup — intact. Rewriting a routine invites side effects, and an unexplained working binary cannot be maintained or re-applied when the protection is updated.",
            },
            {
              front: "How do you load the crackme?",
              back: "Open it in a disassembler, find the entry point, and locate the string or message shown on failure.",
            },
            {
              front: "How do you find the check?",
              back: "Follow references to the failure message back to the conditional jump that decides success or failure.",
            },
            {
              front: "How do you patch and verify?",
              back: "Invert the jump or NOP the check in a copy, then run it with both correct and incorrect input. Confirm the patched behavior.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Step One: Warming up; Step Two: Getting Acquainted with the Disassembler; Step Three: Surgery",
            pageStart: null,
            pageEnd: null,
            note: "Covers reconnaissance by file type, packer, imports, strings and behaviour; the disassembler's inability to separate code from data; and the discipline of patching a conditional jump minimally, reversibly, and verifiably.",
            sectionIndexes: [
              5,
              6,
              7,
            ],
          },
          estimatedMinutes: 16,
        },
      ],
    },
    {
      title: "Module 2 — The Four Attack Methods, IDA, and Disassembler-plus-Debugger",
      summary: "Four progressively smarter attacks on a password check, then the professional toolset: IDA's analysis and a disassembler paired with a debugger.",
      lessons: [
        {
          title: "Method 0 and Method 1: Cracking the Password and Searching Memory",
          objective: "Recover a password by understanding its check, then by searching process memory for the entered string.",
          hook: "Sometimes the fastest way to find a password is to type one and look at what the program did with it.",
          paragraphs: [
            "Method 0 is the thoughtful attack: read the check and recover the real password rather than bypassing it. Kaspersky walks a program that compares the input against a stored or computed value, then shows how to identify the comparison, trace where the expected value came from, and follow the transformation back to the credential. Where the check is a simple byte comparison the answer is sitting in memory; where it is a hash, the analyst instead learns the hash function and the stored digest, which converts password recovery into an offline problem.",
            "Method 1 abandons deduction and uses the program's own behaviour against it. Enter a distinctive string, then search the process's memory for that exact byte sequence. The address found is the input buffer; from there, set a memory breakpoint on it to catch the instant the program reads or compares it, and you land directly in the verification routine without reading a single instruction beforehand. Kaspersky stresses picking a long, unusual string, because short strings collide with everything.",
            "The two methods illustrate a principle that recurs throughout the book: static reasoning tells you what the program intends, dynamic observation tells you what it actually does. Method 0 is cheap when the check is simple and honest; Method 1 is far more robust against renamed functions, stripped symbols, and unfamiliar code. Combining them — search memory, break, then read the surrounding logic — is how real analysis proceeds.",
            "Worth noting is what Method 1 implies about stored secrets. If a program keeps a plaintext password in memory to compare against, any attacker with a debugger can read it no matter how clever the interface. That is the practical argument for hashing with a salt, and Kaspersky's method shows exactly how quickly the shortcut fails.",
          ],
          bullets: [
            "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
            "Method 1 enters a distinctive long string and searches process memory for it, giving the input buffer address immediately without any prior disassembly of the program.",
            "A memory breakpoint on the found buffer catches the moment of comparison, dropping the analyst straight into the verification routine and bypassing symbol stripping altogether.",
            "The methods together demonstrate the static-versus-dynamic pairing — intended logic from the listing, actual behaviour from the debugger — and expose why plaintext password comparison is indefensible.",
            "Method 0 is the thoughtful attack: read the check and recover the real password rather than bypassing it.",
            "Method 0 is cheap when the check is simple and honest; Method 1 is far more robust against renamed functions, stripped symbols, and unfamiliar code.",
          ],
          steps: [
            {
              title: "Search the binary",
              detail: "Use strings and a hex search for the password or a related error message. Record the address of every hit.",
            },
            {
              title: "Break on comparison",
              detail: "Set a breakpoint on strcmp or the equivalent and inspect both arguments when the dialog is submitted.",
            },
            {
              title: "Extract the secret",
              detail: "Read the valid password from memory, then confirm it works in the unmodified program.",
            },
          ],
          takeaway: "Recover the secret by reading the check, or find the check by watching your own input — either way the attacker's cheapest path is the program's own data flow.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "search",
                from: "type",
                label: "bytes in memory",
              },
              {
                to: "bp",
                from: "search",
                label: "address found",
              },
              {
                to: "cmp",
                from: "bp",
                label: "access caught",
              },
            ],
            nodes: [
              {
                id: "type",
                label: "Enter distinctive string",
                emphasis: false,
              },
              {
                id: "search",
                label: "Search process memory",
                emphasis: true,
              },
              {
                id: "bp",
                label: "Memory breakpoint on buffer",
                emphasis: true,
              },
              {
                id: "cmp",
                label: "Verification routine",
                emphasis: false,
              },
            ],
            title: "Method 1: from typed input to verification code",
          },
          quiz: {
            question: "Why is searching memory for the entered password so effective against unfamiliar binaries?",
            options: [
              "Because it decrypts the password before the program can hash it",
              "Because it requires no knowledge of the code: the string you typed must exist in memory as bytes, so finding it yields the buffer address and a breakpoint there reveals the comparison code directly",
              "Because memory searches bypass the operating system's protection mechanisms",
              "Because the password is always stored in the executable's resources",
            ],
            correctIndex: 1,
            explanation: "The input has to live somewhere as plain bytes. Searching for a long distinctive string gives that location without symbols or prior analysis, and watching accesses to it lands you in the verification logic — a purely behavioural shortcut.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Method 0 and Method 1: Cracking the Password and Searching Memory”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
                "Method 2 breaks on the input API, lets it fire when the credential is requested, and steps out to the caller — the code that will perform verification — instead of reading the whole binary.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.”",
            },
            {
              question: "Which statement best explains “When is Method 0 better than Method 1?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "Because the API itself is not the target — the code that called it is. The return address on the stack points at the caller, which is where the credential is handled and eventually verified. Stepping over would return control to the caller only after the API finishes, and you would still need to find the caller; stepping out lands you inside it directly, with the return address known.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.”",
            },
            {
              question: "Which of these is a hands-on step in “Method 0 and Method 1: Cracking the Password and Searching Memory”?",
              options: [
                "Annotate in IDA",
                "Sync with the debugger",
                "Write the map",
                "Search the binary",
              ],
              correctIndex: 3,
              explanation: "“Search the binary” is part of this lesson's sequence: Use strings and a hex search for the password or a related error message. Record the address of every hit.",
            },
            {
              question: "What does the hands-on step “Break on comparison” involve?",
              options: [
                "Set a breakpoint on strcmp or the equivalent and inspect both arguments when the dialog is submitted.",
                "Attach x64dbg or gdb using the same base address, set a breakpoint at your annotated function, and confirm it hits.",
                "Produce a short function map from input to validation to success. Use it to explain the protection without stepping again.",
                "Rename the functions you identified, add comments at the check, and rebuild the call graph around the registration path.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Break on comparison” as: Set a breakpoint on strcmp or the equivalent and inspect both arguments when the dialog is submitted.",
            },
          ],
          flashcards: [
            {
              front: "What does Method 1 reveal about keeping plaintext secrets in memory?",
              back: "That they are readable by anyone with a debugger, regardless of interface obfuscation or password masking. A comparison against plaintext requires the plaintext to exist in address space, so a memory dump or breakpoint yields it directly. This is why credentials are stored as salted hashes and why 'the field shows asterisks' is not a security measure.",
            },
            {
              front: "When is Method 0 better than Method 1?",
              back: "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
            },
            {
              front: "How do you search the binary?",
              back: "Use strings and a hex search for the password or a related error message. Record the address of every hit.",
            },
            {
              front: "How do you extract the secret?",
              back: "Read the valid password from memory, then confirm it works in the unmodified program.",
            },
            {
              front: "How do you break on comparison?",
              back: "Set a breakpoint on strcmp or the equivalent and inspect both arguments when the dialog is submitted.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Method 0: Cracking the Original Password; Method 1: Searching Directly for the Entered Password in Memory",
            pageStart: null,
            pageEnd: null,
            note: "Method 0 recovers the credential by reading and tracing the comparison; Method 1 types a distinctive string, searches process memory for its bytes, and sets a memory breakpoint to reach the verification routine without prior disassembly.",
            sectionIndexes: [
              8,
              9,
              10,
            ],
          },
          estimatedMinutes: 14,
        },
        {
          title: "Method 2 and Method 3: Breakpoints on the Input Function and on Messages",
          objective: "Intercept the user-input API to find the verification code, and use message-box breakpoints to locate the decision from the failure path backwards.",
          hook: "Follow the error message home and you will find the check that produced it.",
          paragraphs: [
            "Method 2 replaces guesswork with interception. Rather than searching memory, set a breakpoint on the input API the program must call — the function that reads a line from the console or shows a dialog — and let it fire when the password is requested. The return address on the stack at that moment is, in effect, the caller that handles the credential, so stepping out of the API lands you in the code that will eventually verify it. Kaspersky notes the practical detail that the analyst must step out rather than over the breakpoint, because the interesting code is in the caller.",
            "Method 3 inverts the direction. Instead of starting at input, start at output: set a breakpoint on the API that displays the error message ('Invalid password'), let the program fail, and then walk backwards. The caller of that message is either the failure branch or a routine invoked with a status flag, and the conditional jump immediately before it is the decision. This is often the fastest route in a large binary, because failure messages are few, distinctive, and always reachable by simply entering something wrong.",
            "Both methods exploit the same structural feature: programs must interact with the operating system through a small set of documented APIs, and those APIs are the only places the attacker can attach without understanding the code. Kaspersky points out the arms race this creates — protections that inline API calls, obfuscate imports, or implement checks without any message at all specifically defeat these two methods, which is why the next steps move to full analysis tools.",
            "The methodological lesson is to choose an anchor you can find cheaply. Input and error output are anchors; the verification logic between them is the target. This inversion of the search direction — from visible behaviour to hidden decision — is the core skill of practical reversing.",
          ],
          bullets: [
            "Method 2 breaks on the input API, lets it fire when the credential is requested, and steps out to the caller — the code that will perform verification — instead of reading the whole binary.",
            "Method 3 breaks on the failure message API, fails deliberately, and walks backwards to the conditional jump that chose the failure branch, which is often the fastest route in a large program.",
            "Both rely on documented OS APIs as attachable anchors, so protections that inline calls, hide imports, or fail silently specifically neutralise them — the reason the book then moves to full analysis tools.",
            "The general technique is to anchor on cheap, visible behaviour (input prompt, error message) and traverse from it to the hidden decision, inverting the direction of the search.",
            "Rather than searching memory, set a breakpoint on the input API the program must call — the function that reads a line from the console or shows a dialog — and let it fire when the password is requested.",
            "Kaspersky notes the practical detail that the analyst must step out rather than over the breakpoint, because the interesting code is in the caller.",
          ],
          steps: [
            {
              title: "Break on input",
              detail: "Set a breakpoint on GetDlgItemText or the input API, submit a known string, and find the buffer address.",
            },
            {
              title: "Trace to the check",
              detail: "Set a memory breakpoint on the buffer and follow execution to the comparison or hashing routine.",
            },
            {
              title: "Break on the message",
              detail: "Break on MessageBox and walk up the call stack to the branch that chose the failure message. Patch that branch.",
            },
          ],
          takeaway: "Anchor where the program must touch the operating system, then walk from your anchor to the decision instead of searching blindly for it.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "dec",
                from: "in",
                label: "step out to caller",
              },
              {
                to: "dec",
                from: "msg",
                label: "walk backwards",
              },
            ],
            nodes: [
              {
                id: "in",
                label: "Input API breakpoint",
                emphasis: true,
              },
              {
                id: "dec",
                label: "Verification decision",
                emphasis: true,
              },
              {
                id: "msg",
                label: "Error message breakpoint",
                emphasis: true,
              },
            ],
            title: "Two anchors, one target",
          },
          quiz: {
            question: "Why is breaking on a failure message often faster than breaking on the input function?",
            options: [
              "Because message boxes are implemented in the kernel and cannot be blocked",
              "Because failure messages are few and distinctive and are reliably reached by entering wrong data, so a single breakpoint followed by a short backwards walk reaches the decision without tracing the whole input path",
              "Because the input function is never called by protected programs",
              "Because message API breakpoints also decrypt the stored password",
            ],
            correctIndex: 1,
            explanation: "The failure path is guaranteed to execute if you simply fail, and it contains the branch that decided you failed. Anchoring there collapses the search to a few instructions before the message call, regardless of how convoluted the input handling is.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Method 2 and Method 3: Breakpoints on the Input Function and on Messages”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
                "Method 2 breaks on the input API, lets it fire when the credential is requested, and steps out to the caller — the code that will perform verification — instead of reading the whole binary.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Method 2 breaks on the input API, lets it fire when the credential is requested, and steps out to the caller — the code that will perform verification — instead of reading the whole binary.”",
            },
            {
              question: "Which statement best explains “Why must you step out of an input-API breakpoint rather than step over it?”?",
              options: [
                "Because the API itself is not the target — the code that called it is. The return address on the stack points at the caller, which is where the credential is handled and eventually verified. Stepping over would return control to the caller only after the API finishes, and you would still need to find the caller; stepping out lands you inside it directly, with the return address known.",
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Because the API itself is not the target — the code that called it is. The return address on the stack points at the caller, which is where the credential is handled and eventually verified. Stepping over would return control to the caller only after the API finishes, and you would still need to find the caller; stepping out lands you inside it directly, with the return address known.”",
            },
            {
              question: "Which of these is a hands-on step in “Method 2 and Method 3: Breakpoints on the Input Function and on Messages”?",
              options: [
                "Apply signatures",
                "Reduce the noise",
                "Spot statically linked code",
                "Break on input",
              ],
              correctIndex: 3,
              explanation: "“Break on input” is part of this lesson's sequence: Set a breakpoint on GetDlgItemText or the input API, submit a known string, and find the buffer address.",
            },
            {
              question: "What does the hands-on step “Trace to the check” involve?",
              options: [
                "Set a memory breakpoint on the buffer and follow execution to the comparison or hashing routine.",
                "Read the valid password from memory, then confirm it works in the unmodified program.",
                "Set a breakpoint on strcmp or the equivalent and inspect both arguments when the dialog is submitted.",
                "Use strings and a hex search for the password or a related error message. Record the address of every hit.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Trace to the check” as: Set a memory breakpoint on the buffer and follow execution to the comparison or hashing routine.",
            },
          ],
          flashcards: [
            {
              front: "Why must you step out of an input-API breakpoint rather than step over it?",
              back: "Because the API itself is not the target — the code that called it is. The return address on the stack points at the caller, which is where the credential is handled and eventually verified. Stepping over would return control to the caller only after the API finishes, and you would still need to find the caller; stepping out lands you inside it directly, with the return address known.",
            },
            {
              front: "How do protections defeat API-anchored methods?",
              back: "By removing the anchors: inlining string and input routines instead of calling documented APIs, resolving imports at run time through hashed names, implementing checks with no user-visible message, or reporting failure with the same output as success. With no recognisable API call to break on, the analyst must fall back to reading the disassembly or to full symbolic analysis.",
            },
            {
              front: "How do you trace to the check?",
              back: "Set a memory breakpoint on the buffer and follow execution to the comparison or hashing routine.",
            },
            {
              front: "How do you break on input?",
              back: "Set a breakpoint on GetDlgItemText or the input API, submit a known string, and find the buffer address.",
            },
            {
              front: "How do you break on the message?",
              back: "Break on MessageBox and walk up the call stack to the branch that chose the failure message. Patch that branch.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Method 2: Setting a Breakpoint at the Password Input Function; Method 3: Setting a Breakpoint on Messages",
            pageStart: null,
            pageEnd: null,
            note: "Method 2 breaks on the input API and steps out to the caller that handles the credential; Method 3 breaks on the failure message and walks backwards to the deciding conditional jump, with notes on how protections remove these anchors.",
            sectionIndexes: [
              11,
              12,
            ],
          },
          estimatedMinutes: 13,
        },
        {
          title: "Step Five and Step Six: IDA's Analysis and Pairing a Disassembler with a Debugger",
          objective: "Use IDA's cross-references, naming, and graph view to understand a binary, and explain why static and dynamic tools must be used together.",
          hook: "A disassembler shows you the map; a debugger shows you the journey. You need both to know where you are.",
          paragraphs: [
            "Step Five introduces IDA as a fundamentally different instrument from a linear disassembler. It performs recursive descent from entry points, identifies functions, propagates names, and builds cross-references so every call, jump, and data access can be navigated in both directions. Kaspersky demonstrates the workflow: rename functions as you understand them, follow cross-references to find who calls a suspicious routine, and use the graph view to see a function's control flow as blocks rather than as a column of mnemonics.",
            "The cross-reference feature is the real subject of the chapter. Reversing without xrefs means reading linearly and hoping to encounter the relevant code; with xrefs, the question 'who calls this?' and 'where is this string used?' become single commands. Kaspersky shows how string references alone can restore most of a program's structure, because messages, format strings, and API names cluster around the functionality they serve.",
            "Step Six addresses the complementary failure modes. A disassembler cannot know which branch is actually taken, cannot see decrypted code, and cannot resolve run-time-computed addresses. A debugger can see all of that but has no global structure and no persistence. Pairing them — static analysis to understand, dynamic analysis to confirm — means using the debugger to answer the questions the listing raises, and using the listing to know where to put the debugger's breakpoints.",
            "The practical output is a discipline: never trust a static conclusion without dynamic confirmation, and never step through code without a hypothesis about what it should do. Kaspersky closes the step by noting that this pairing is exactly what attackers of packed and polymorphic code are forced into, since neither tool alone suffices.",
          ],
          bullets: [
            "IDA performs recursive descent to identify functions and builds cross-references, so questions like 'who calls this routine' and 'where is this string used' become direct commands rather than linear searches.",
            "Renaming, graph view, and above all cross-references let an analyst rebuild a program's structure incrementally, with string and API references clustering around the functionality they serve.",
            "A disassembler cannot know which branch executes, cannot see decrypted or generated code, and cannot resolve run-time addresses — all of which a debugger shows, at the cost of any global structure.",
            "The discipline is to pair them: static analysis generates hypotheses and breakpoint locations, dynamic analysis confirms or refutes them, which is mandatory for packed and polymorphic binaries.",
            "Reversing without xrefs means reading linearly and hoping to encounter the relevant code; with xrefs, the question 'who calls this?'",
            "The practical output is a discipline: never trust a static conclusion without dynamic confirmation, and never step through code without a hypothesis about what it should do.",
          ],
          steps: [
            {
              title: "Annotate in IDA",
              detail: "Rename the functions you identified, add comments at the check, and rebuild the call graph around the registration path.",
            },
            {
              title: "Sync with the debugger",
              detail: "Attach x64dbg or gdb using the same base address, set a breakpoint at your annotated function, and confirm it hits.",
            },
            {
              title: "Write the map",
              detail: "Produce a short function map from input to validation to success. Use it to explain the protection without stepping again.",
            },
          ],
          takeaway: "Static structure plus dynamic truth: cross-references tell you where to look, and the debugger tells you whether you were right.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "hyp",
                from: "ida",
                label: "where to look",
              },
              {
                to: "hyp",
                from: "dbg",
                label: "what really happens",
              },
            ],
            nodes: [
              {
                id: "ida",
                label: "IDA: functions, xrefs, graph",
                emphasis: true,
              },
              {
                id: "dbg",
                label: "Debugger: actual path, memory, registers",
                emphasis: true,
              },
              {
                id: "hyp",
                label: "Hypothesis -> breakpoint -> confirm",
                emphasis: false,
              },
            ],
            title: "Complementary instruments",
          },
          quiz: {
            question: "What specific class of question does a debugger answer that a disassembler cannot?",
            options: [
              "Which functions exist in the binary and who calls them",
              "Which branch is actually taken at run time, what decrypted or generated code looks like in memory, and where run-time-computed addresses really point",
              "What the source code looked like before compilation",
              "How many instructions each function contains",
            ],
            correctIndex: 1,
            explanation: "Static analysis sees all possible paths but not the executed one, and it sees the file rather than the loaded image. The debugger observes the real path with real memory contents, which is exactly what packing, decryption, and indirect calls hide from a listing.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Step Five and Step Six: IDA's Analysis and Pairing a Disassembler with a Debugger”?",
              options: [
                "IDA performs recursive descent to identify functions and builds cross-references, so questions like 'who calls this routine' and 'where is this string used' become direct commands rather than linear searches.",
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “IDA performs recursive descent to identify functions and builds cross-references, so questions like 'who calls this routine' and 'where is this string used' become direct commands rather than linear searches.”",
            },
            {
              question: "Which statement best explains “Why are cross-references the highest-value feature of an interactive disassembler?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Because reversing is a search problem, and xrefs collapse the search. Instead of reading linearly until you stumble on relevant code, you ask who calls a function or where a string is used and get the complete answer. That lets you work outward from visible artefacts — messages, imported APIs, constants — and rebuild the program's structure in the order that matters.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Because reversing is a search problem, and xrefs collapse the search. Instead of reading linearly until you stumble on relevant code, you ask who calls a function or where a string is used and get the complete answer. That lets you work outward from visible artefacts — messages, imported APIs, constants — and rebuild the program's structure in the order that matters.”",
            },
            {
              question: "Which of these is a hands-on step in “Step Five and Step Six: IDA's Analysis and Pairing a Disassembler with a Debugger”?",
              options: [
                "Recognize the prologue",
                "Rename and type",
                "Find the vtable",
                "Annotate in IDA",
              ],
              correctIndex: 3,
              explanation: "“Annotate in IDA” is part of this lesson's sequence: Rename the functions you identified, add comments at the check, and rebuild the call graph around the registration path.",
            },
            {
              question: "What does the hands-on step “Sync with the debugger” involve?",
              options: [
                "Attach x64dbg or gdb using the same base address, set a breakpoint at your annotated function, and confirm it hits.",
                "Write position-independent code that finds its own base. Compare it with code that assumes a fixed image base.",
                "Compile the same function at -O0 and -O2. Identify inlining, loop unrolling, and register reuse in the disassembly.",
                "Find a memset, memcpy, or division turned into shifts and multiplication. Rewrite the likely source in C.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Sync with the debugger” as: Attach x64dbg or gdb using the same base address, set a breakpoint at your annotated function, and confirm it hits.",
            },
          ],
          flashcards: [
            {
              front: "Why are cross-references the highest-value feature of an interactive disassembler?",
              back: "Because reversing is a search problem, and xrefs collapse the search. Instead of reading linearly until you stumble on relevant code, you ask who calls a function or where a string is used and get the complete answer. That lets you work outward from visible artefacts — messages, imported APIs, constants — and rebuild the program's structure in the order that matters.",
            },
            {
              front: "Why can neither a disassembler nor a debugger alone handle packed malware?",
              back: "A disassembler sees the packer's stub and encrypted payload, not the code that will run, so its structure is largely meaningless. A debugger can run to the unpacking stub's end and dump the decrypted image, but has no persistent analysis of it and no cross-references. The workable approach is to use the debugger to reach the unpacked code and then re-analyse that dump statically.",
            },
            {
              front: "How do you write the map?",
              back: "Produce a short function map from input to validation to success. Use it to explain the protection without stepping again.",
            },
            {
              front: "How do you sync with the debugger?",
              back: "Attach x64dbg or gdb using the same base address, set a breakpoint at your annotated function, and confirm it hits.",
            },
            {
              front: "How do you annotate in IDA?",
              back: "Rename the functions you identified, add comments at the check, and rebuild the call graph around the registration path.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Step Five: IDA Emerges onto the Scene; Step Six: Using a Disassembler with a Debugger",
            pageStart: null,
            pageEnd: null,
            note: "Covers IDA's recursive descent, function identification, renaming, graph view and cross-references, then argues static and dynamic analysis are complementary: the listing supplies hypotheses and breakpoint addresses, the debugger supplies actual paths, decrypted code, and resolved addresses.",
            sectionIndexes: [
              13,
              14,
            ],
          },
          estimatedMinutes: 15,
        },
      ],
    },
    {
      title: "Module 3 — Reversing C++: Functions, Objects, and Calling Conventions",
      summary: "Recognising functions and start-up code, vtables and virtual dispatch, constructors and destructors, object layouts, and the calling conventions that pass arguments.",
      lessons: [
        {
          title: "Functions and Start-up Functions",
          objective: "Recognise a function from its prologue and epilogue, and navigate from the CRT start-up code to the program's real main.",
          hook: "Every function begins by building a stack frame, and that makes it visible even without symbols.",
          paragraphs: [
            "Kaspersky's overview of the C++ reversing section explains why compiled C++ looks so different from compiled C. Name mangling, classes, overloads, exceptions, and templates all produce code patterns that a C-only mental model cannot explain, and the reverse engineer must learn those patterns as a vocabulary. He frames the section as a catalogue: each construct has a recognisable assembly fingerprint, and once you know the fingerprint you can read the construct from the listing.",
            "The function chapter establishes the most important fingerprint. A standard function opens with a prologue — push the frame pointer, set the frame pointer to the current stack pointer, subtract space for locals — and ends with an epilogue that restores the stack and returns. Locals appear as negative offsets from the frame pointer, parameters as positive offsets, and the return address lives just above them. Recognising this pattern lets an analyst find function boundaries in an unlabelled listing and reason about which slot holds what.",
            "Start-up functions explain why the program's real entry point is not where execution begins. The CRT provides a start-up routine that initialises the runtime, sets up the heap, and calls the program's main with argc, argv, and the environment block, then tears everything down and exits. Kaspersky shows how to locate this chain and jump to the user's main, which matters because entry-point analysis of a packed or obfuscated binary often spends a long time inside runtime initialisation before anything interesting happens.",
            "The practical payoff is orientation. Without symbols, an analyst needs two anchors: the function-boundary pattern to segment code into routines, and the start-up chain to find where application logic begins. With those two, an otherwise featureless listing becomes navigable.",
          ],
          bullets: [
            "C++ reversing requires learning construct fingerprints — mangled names, classes, overloads, exceptions, templates — because a C-only model cannot explain the generated code.",
            "The prologue (push frame pointer, set frame, subtract locals) and its matching epilogue are the universal function fingerprint: locals at negative frame offsets, parameters at positive ones, return address above them.",
            "Execution starts in CRT start-up code that initialises the runtime and calls main with argc, argv, and the environment block, so the declared entry point is never the application's logic.",
            "Two anchors — the function-boundary pattern and the start-up chain — turn an unlabelled listing into something navigable, which is essential for packed binaries that hide logic behind runtime initialisation.",
            "Name mangling, classes, overloads, exceptions, and templates all produce code patterns that a C-only mental model cannot explain, and the reverse engineer must learn those patterns as a vocabulary.",
            "He frames the section as a catalogue: each construct has a recognisable assembly fingerprint, and once you know the fingerprint you can read the construct from the listing.",
          ],
          steps: [
            {
              title: "Recognize the prologue",
              detail: "Find push ebp, mov ebp, esp patterns and mark every function start in a small binary.",
            },
            {
              title: "Identify the calling convention",
              detail: "At one call site, determine which arguments are pushed and who cleans the stack. Name the convention.",
            },
            {
              title: "Rename and type",
              detail: "Give each function a name and a prototype in the disassembler. Verify the decompiler output becomes readable.",
            },
          ],
          takeaway: "Find function boundaries from stack-frame patterns and find application logic by walking the start-up chain out of the runtime.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "crt",
                from: "entry",
                label: "",
              },
              {
                to: "main",
                from: "crt",
                label: "call",
              },
              {
                to: "fn",
                from: "main",
                label: "calls",
              },
            ],
            nodes: [
              {
                id: "entry",
                label: "PE entry point",
                emphasis: false,
              },
              {
                id: "crt",
                label: "CRT start-up init",
                emphasis: false,
              },
              {
                id: "main",
                label: "main(argc, argv, envp)",
                emphasis: true,
              },
              {
                id: "fn",
                label: "Application functions (prologue pattern)",
                emphasis: true,
              },
            ],
            title: "Locating application code",
          },
          quiz: {
            question: "Why does recognising the function prologue matter so much when symbols are stripped?",
            options: [
              "Because the prologue contains the function's name encoded as an immediate",
              "Because it gives a reliable boundary pattern, so code can be segmented into routines and locals and parameters can be identified by their frame offsets",
              "Because the CPU requires every function to start with that exact sequence",
              "Because the prologue reveals the function's return type",
            ],
            correctIndex: 1,
            explanation: "Stripped binaries keep no structure, so the analyst must recover it. The frame-building sequence is highly consistent across compilers and marks both boundaries and the layout of the frame, which is what allows arguments and locals to be attributed.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Functions and Start-up Functions”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "C++ reversing requires learning construct fingerprints — mangled names, classes, overloads, exceptions, templates — because a C-only model cannot explain the generated code.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “C++ reversing requires learning construct fingerprints — mangled names, classes, overloads, exceptions, templates — because a C-only model cannot explain the generated code.”",
            },
            {
              question: "Which statement best explains “What do negative and positive offsets from the frame pointer mean?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "After the prologue, the frame pointer marks the base of the current frame. Locals and saved registers live below it at negative offsets, because the stack grows downward and the compiler reserved space with a subtraction. Parameters passed by the caller sit above it at positive offsets, because they were pushed before the call. This convention is what makes it possible to label a frame correctly from the listing alone.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “After the prologue, the frame pointer marks the base of the current frame. Locals and saved registers live below it at negative offsets, because the stack grows downward and the compiler reserved space with a subtraction. Parameters passed by the caller sit above it at positive offsets, because they were pushed before the call. This convention is what makes it possible to label a frame correctly from the listing alone.”",
            },
            {
              question: "Which of these is a hands-on step in “Functions and Start-up Functions”?",
              options: [
                "Diff optimization levels",
                "Recognize optimized idioms",
                "Classify five programs",
                "Recognize the prologue",
              ],
              correctIndex: 3,
              explanation: "“Recognize the prologue” is part of this lesson's sequence: Find push ebp, mov ebp, esp patterns and mark every function start in a small binary.",
            },
            {
              question: "What does the hands-on step “Identify the calling convention” involve?",
              options: [
                "At one call site, determine which arguments are pushed and who cleans the stack. Name the convention.",
                "Open it in a disassembler, find the entry point, and locate the string or message shown on failure.",
                "Read the valid password from memory, then confirm it works in the unmodified program.",
                "Set a breakpoint on strcmp or the equivalent and inspect both arguments when the dialog is submitted.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Identify the calling convention” as: At one call site, determine which arguments are pushed and who cleans the stack. Name the convention.",
            },
          ],
          flashcards: [
            {
              front: "Why does execution not begin at main?",
              back: "Because the C runtime must initialise first: set up the heap, initialise static objects and security cookies, prepare the environment block, and only then call main. The executable's declared entry point is a CRT start-up routine. That routine also handles the return path — calling exit with main's result — which is why main's return value ends up as the process exit code.",
            },
            {
              front: "What do negative and positive offsets from the frame pointer mean?",
              back: "After the prologue, the frame pointer marks the base of the current frame. Locals and saved registers live below it at negative offsets, because the stack grows downward and the compiler reserved space with a subtraction. Parameters passed by the caller sit above it at positive offsets, because they were pushed before the call. This convention is what makes it possible to label a frame correctly from the listing alone.",
            },
            {
              front: "How do you identify the calling convention?",
              back: "At one call site, determine which arguments are pushed and who cleans the stack. Name the convention.",
            },
            {
              front: "How do you recognize the prologue?",
              back: "Find push ebp, mov ebp, esp patterns and mark every function start in a small binary.",
            },
            {
              front: "How do you rename and type?",
              back: "Give each function a name and a prototype in the disassembler. Verify the decompiler output becomes readable.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Overview (C++ section); Functions; Start-up Functions",
            pageStart: null,
            pageEnd: null,
            note: "Frames compiled C++ as recognisable assembly fingerprints, establishes the prologue/epilogue as the universal function boundary with locals at negative and parameters at positive frame offsets, and traces the CRT start-up chain to main.",
            sectionIndexes: [
              15,
              16,
              17,
            ],
          },
          estimatedMinutes: 13,
        },
        {
          title: "Virtual Functions, Constructors, and Destructors",
          objective: "Identify virtual dispatch through vtable pointers and calls, and recognise constructor and destructor code including vtable installation and virtual destructor mechanics.",
          hook: "A virtual call is an indirect call through a pointer stored in the object's first field.",
          paragraphs: [
            "Kaspersky explains the vtable mechanism from the machine's point of view. Every class with virtual functions gets a table of function pointers, and every object of that class stores a pointer to the table — typically at offset zero. A virtual call compiles to loading that pointer, adding the slot offset, loading the function address, and calling indirectly. Once you know this, an indirect call through memory near the start of an object is not mysterious; it is a virtual dispatch, and the vtable itself reveals how many virtual functions the class has.",
            "The chapter also covers the complications. Multiple inheritance gives an object several vtable pointers and adjusts the this pointer when a call crosses a base boundary, which is why thunks — tiny functions that add a constant and jump — appear in the listing. Virtual inheritance goes further and introduces indirect base-class references. Kaspersky's advice is to work outward from the vtable: dump it, count the slots, and follow each pointer to understand the class's interface before reading any implementation.",
            "Constructors have an equally distinct signature: they set the vtable pointer, call base-class constructors, initialise members in declaration order, and may register the object with global structures. Because the vtable pointer is written during construction, an object under construction dispatches only to the constructors already run — a detail that explains many subtle bugs and also tells the analyst where construction ends. Destructors reverse the process, restoring base vtable pointers as they unwind, which is why multiple vtable writes appear in a destructor of a polymorphic class.",
            "Virtual destructors add a recognisable layer: the compiler generates a deleting destructor, and a virtual delete goes through the vtable to it. Kaspersky uses this to show that the vtable is not only about calling member functions — it encodes object lifetime policy too, and misreading it leads to confusion about who frees memory.",
          ],
          bullets: [
            "A virtual call is an indirect call through the vtable pointer stored at the start of the object, so an indirect call via a near-zero object offset identifies polymorphic dispatch.",
            "Multiple and virtual inheritance add multiple vtable pointers and this-pointer adjustments, producing thunks that add a constant and jump — artifacts that reveal class layering.",
            "Constructors install the vtable pointer, call base constructors, and initialise members in declaration order, so multiple vtable writes mark construction stages; destructors restore base tables as they unwind.",
            "Virtual destructors generate a deleting destructor reached through the vtable, showing that virtual dispatch encodes object lifetime policy, not just method calls.",
            "Once you know this, an indirect call through memory near the start of an object is not mysterious; it is a virtual dispatch, and the vtable itself reveals how many virtual functions the class has.",
            "Multiple inheritance gives an object several vtable pointers and adjusts the this pointer when a call crosses a base boundary, which is why thunks — tiny functions that add a constant and jump — appear in the listing.",
          ],
          steps: [
            {
              title: "Find the vtable",
              detail: "Locate a constructor that writes a pointer to a table of function addresses. Dump the table and map each slot.",
            },
            {
              title: "Resolve virtual calls",
              detail: "At an indirect call through [eax+offset], identify the object and the slot. Follow it to the concrete implementation.",
            },
            {
              title: "Reconstruct the class",
              detail: "Write a pseudo-C++ class with fields in offset order and virtual methods in vtable order. Check it against two call sites.",
            },
          ],
          takeaway: "The vtable pointer at offset zero is the door to polymorphism: find it, dump the table, and the class's interface and lifetime policy become readable.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "vt",
                from: "obj",
                label: "load vptr",
              },
              {
                to: "slot",
                from: "vt",
                label: "index",
              },
              {
                to: "call",
                from: "slot",
                label: "address",
              },
            ],
            nodes: [
              {
                id: "obj",
                label: "Object: vptr at offset 0",
                emphasis: true,
              },
              {
                id: "vt",
                label: "vtable of function pointers",
                emphasis: true,
              },
              {
                id: "slot",
                label: "Slot offset for method",
                emphasis: false,
              },
              {
                id: "call",
                label: "Indirect call",
                emphasis: false,
              },
            ],
            title: "How a virtual call resolves",
          },
          quiz: {
            question: "What does an indirect call through a pointer loaded from the first field of an object usually indicate?",
            options: [
              "A call to an imported API through the import address table",
              "A virtual function call dispatched through the object's vtable pointer",
              "A call through a function pointer stored in a local variable",
              "A return from a nested function",
            ],
            correctIndex: 1,
            explanation: "That is the canonical code shape for virtual dispatch: load the vtable pointer from the object, index to the slot, load the target, and call indirectly. Recognising it immediately identifies polymorphic code and points to the vtable to enumerate the class's virtual methods.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Virtual Functions, Constructors, and Destructors”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "A virtual call is an indirect call through the vtable pointer stored at the start of the object, so an indirect call via a near-zero object offset identifies polymorphic dispatch.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “A virtual call is an indirect call through the vtable pointer stored at the start of the object, so an indirect call via a near-zero object offset identifies polymorphic dispatch.”",
            },
            {
              question: "Which statement best explains “Why does a constructor write the vtable pointer, and why does that matter?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
                "Because virtual dispatch must work as soon as the object exists. During construction the vtable pointer is set to the class whose constructor is running, then updated as base and derived parts initialise, which is why virtual calls made inside a base constructor do not dispatch to the derived override. For an analyst, those vtable writes mark exactly where each construction stage begins.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Because virtual dispatch must work as soon as the object exists. During construction the vtable pointer is set to the class whose constructor is running, then updated as base and derived parts initialise, which is why virtual calls made inside a base constructor do not dispatch to the derived override. For an analyst, those vtable writes mark exactly where each construction stage begins.”",
            },
            {
              question: "Which of these is a hands-on step in “Virtual Functions, Constructors, and Destructors”?",
              options: [
                "Handle relocation",
                "Inject a DLL",
                "Test stack execution",
                "Find the vtable",
              ],
              correctIndex: 3,
              explanation: "“Find the vtable” is part of this lesson's sequence: Locate a constructor that writes a pointer to a table of function addresses. Dump the table and map each slot.",
            },
            {
              question: "What does the hands-on step “Resolve virtual calls” involve?",
              options: [
                "At an indirect call through [eax+offset], identify the object and the slot. Follow it to the concrete implementation.",
                "Open it in a disassembler, find the entry point, and locate the string or message shown on failure.",
                "Read the valid password from memory, then confirm it works in the unmodified program.",
                "Set a breakpoint on strcmp or the equivalent and inspect both arguments when the dialog is submitted.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Resolve virtual calls” as: At an indirect call through [eax+offset], identify the object and the slot. Follow it to the concrete implementation.",
            },
          ],
          flashcards: [
            {
              front: "What is a thunk, and why do multiple-inheritance binaries contain them?",
              back: "A thunk is a tiny routine that adjusts a pointer and jumps to the real function. With multiple inheritance an object has several vtable pointers, and a call made through a secondary base must see a this pointer that refers to that base subobject. The thunk performs the constant adjustment so a single implementation can serve all bases, and its appearance in a listing is strong evidence of multiple inheritance.",
            },
            {
              front: "Why does a constructor write the vtable pointer, and why does that matter?",
              back: "Because virtual dispatch must work as soon as the object exists. During construction the vtable pointer is set to the class whose constructor is running, then updated as base and derived parts initialise, which is why virtual calls made inside a base constructor do not dispatch to the derived override. For an analyst, those vtable writes mark exactly where each construction stage begins.",
            },
            {
              front: "How do you find the vtable?",
              back: "Locate a constructor that writes a pointer to a table of function addresses. Dump the table and map each slot.",
            },
            {
              front: "How do you reconstruct the class?",
              back: "Write a pseudo-C++ class with fields in offset order and virtual methods in vtable order. Check it against two call sites.",
            },
            {
              front: "How do you resolve virtual calls?",
              back: "At an indirect call through [eax+offset], identify the object and the slot. Follow it to the concrete implementation.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Virtual Functions; Constructors and Destructors",
            pageStart: null,
            pageEnd: null,
            note: "Explains vtable layout with the pointer at offset zero, indirect virtual calls, multiple-inheritance thunks and this-pointer adjustment, vtable installation during construction, and deleting destructors behind virtual destructors.",
            sectionIndexes: [
              18,
              19,
            ],
          },
          estimatedMinutes: 15,
        },
        {
          title: "Objects, Structures, Arrays, the this Pointer, and new/delete",
          objective: "Recover struct and class layouts from member offsets, identify the hidden this argument, and recognise allocation and deallocation sequences.",
          hook: "A class does not exist at run time — only offsets, padding, and a pointer passed in a register.",
          paragraphs: [
            "Kaspersky treats object layout as an exercise in offsets. A class or struct becomes a contiguous block whose members sit at fixed offsets chosen by declaration order and alignment rules; the compiler inserts padding so each member meets its natural alignment, which is why a structure with a char followed by an int is not five bytes. An array of objects is that block repeated, so indexing compiles to multiplying the index by the element size and adding a base — a scaled index in the addressing mode, and a strong hint about the element's size.",
            "Recovering a layout from assembly means watching which offsets are read and written and how wide the accesses are. A byte access to offset 4, a dword to offset 8, and a pointer to offset 0 suggest a specific arrangement, and the pattern of padding becomes visible in the gaps. Kaspersky shows how nested structures compound this: a member at offset 12 may itself be a structure at offset 4 within an outer block, and distinguishing the two requires following the accesses rather than guessing.",
            "The this pointer is the mechanism that makes member functions work. Non-static member functions receive a hidden first argument — the address of the object — passed in a register under thiscall on 32-bit Microsoft compilers or on the stack elsewhere, and every member access becomes an offset from it. Recognising that an incoming argument is used as a base for repeated offset accesses is how you identify a method and recover its class. On x64 the same idea holds with the pointer in the first argument register.",
            "Allocation and deallocation complete the picture. A new expression compiles to a call to operator new, a null check, then a constructor call on the returned pointer; delete compiles to a destructor call followed by operator delete. Array forms add size bookkeeping and loop over elements. Kaspersky notes that this sequence is so distinctive that heap traffic in a listing can be classified purely by spotting these call pairs, which is invaluable when tracking object lifetimes in an unfamiliar program.",
          ],
          bullets: [
            "Objects are contiguous blocks with members at fixed offsets set by declaration order and alignment padding, so layout is recovered by watching which offsets are accessed and at what width.",
            "Array indexing compiles to base plus scaled index, and the scale factor reveals the element size — the quickest way to determine how large a structure really is, padding included.",
            "Member functions receive a hidden this argument used as the base of every member access, which is how a method is identified and its class reconstructed on both x86 thiscall and x64.",
            "new compiles to operator new, a null check, and a constructor call; delete to a destructor followed by operator delete, so heap traffic can be classified by recognising these call pairs.",
            "Recovering a layout from assembly means watching which offsets are read and written and how wide the accesses are.",
            "Kaspersky shows how nested structures compound this: a member at offset 12 may itself be a structure at offset 4 within an outer block, and distinguishing the two requires following the accesses rather than guessing.",
          ],
          steps: [
            {
              title: "Map the struct",
              detail: "From field accesses at fixed offsets, build a struct layout with types and padding. Mark the this pointer in each method.",
            },
            {
              title: "Find array indexing",
              detail: "Locate a scaled index such as [ebx+ecx*4] and determine the element size and bounds behavior.",
            },
            {
              title: "Trace allocation",
              detail: "Break on new or malloc, record the requested size, and follow the returned pointer into the constructor.",
            },
          ],
          takeaway: "There are no classes at run time, only offsets from a hidden pointer — recover the offsets and the class reappears.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "m1",
                from: "vptr",
                label: "offset",
              },
              {
                to: "pad",
                from: "m1",
                label: "alignment",
              },
              {
                to: "m2",
                from: "pad",
                label: "offset",
              },
            ],
            nodes: [
              {
                id: "vptr",
                label: "+0 vtable pointer",
                emphasis: true,
              },
              {
                id: "m1",
                label: "+4 int member",
                emphasis: false,
              },
              {
                id: "pad",
                label: "+8 padding",
                emphasis: false,
              },
              {
                id: "m2",
                label: "+12 nested struct / pointer",
                emphasis: false,
              },
            ],
            title: "A reconstructed object layout",
          },
          quiz: {
            question: "An instruction reads a dword at [ebx+ecx*4+0x10]. What does the scale factor tell you?",
            options: [
              "That the array has four elements",
              "That each element is four bytes wide, so the array is of 32-bit values and the access is an indexed array read with a base offset",
              "That the loop counter is stored in ecx",
              "That the structure uses four levels of inheritance",
            ],
            correctIndex: 1,
            explanation: "The scaled index multiplies by the element size. A scale of four means the compiler computed index times four, the size of a 32-bit element, so the array's element width and therefore the structure's stride are both revealed by the addressing mode alone.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Objects, Structures, Arrays, the this Pointer, and new/delete”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
                "Objects are contiguous blocks with members at fixed offsets set by declaration order and alignment padding, so layout is recovered by watching which offsets are accessed and at what width.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Objects are contiguous blocks with members at fixed offsets set by declaration order and alignment padding, so layout is recovered by watching which offsets are accessed and at what width.”",
            },
            {
              question: "Which statement best explains “How do you recognise a member function without symbols?”?",
              options: [
                "Look for an incoming argument that is repeatedly used as the base of offset accesses. Under thiscall the object pointer arrives in a register (ecx on 32-bit Microsoft), and virtually all the function's memory traffic appears as [this+offset]. That pattern — one pointer plus many fixed offsets — is the signature of a method, and the offsets enumerate the class's members.",
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Look for an incoming argument that is repeatedly used as the base of offset accesses. Under thiscall the object pointer arrives in a register (ecx on 32-bit Microsoft), and virtually all the function's memory traffic appears as [this+offset]. That pattern — one pointer plus many fixed offsets — is the signature of a method, and the offsets enumerate the class's members.”",
            },
            {
              question: "Which of these is a hands-on step in “Objects, Structures, Arrays, the this Pointer, and new/delete”?",
              options: [
                "Recognize optimized idioms",
                "Classify five programs",
                "Inspect the imports",
                "Map the struct",
              ],
              correctIndex: 3,
              explanation: "“Map the struct” is part of this lesson's sequence: From field accesses at fixed offsets, build a struct layout with types and padding. Mark the this pointer in each method.",
            },
            {
              question: "What does the hands-on step “Find array indexing” involve?",
              options: [
                "Locate a scaled index such as [ebx+ecx*4] and determine the element size and bounds behavior.",
                "Use OpenProcess, VirtualAllocEx, WriteProcessMemory, and CreateRemoteThread to load a benign DLL into a lab process.",
                "Write position-independent code that finds its own base. Compare it with code that assumes a fixed image base.",
                "Compile the same function at -O0 and -O2. Identify inlining, loop unrolling, and register reuse in the disassembly.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Find array indexing” as: Locate a scaled index such as [ebx+ecx*4] and determine the element size and bounds behavior.",
            },
          ],
          flashcards: [
            {
              front: "Why does the new expression produce three distinct steps in the listing?",
              back: "Because allocation and construction are separate operations. The compiler first calls operator new to obtain raw storage, then checks the result for null, then calls the constructor on that storage to establish the object's invariants. That separation is exactly why placement new exists and why a failed constructor must free the memory, and it gives the analyst three recognisable anchors per allocation site.",
            },
            {
              front: "How do you recognise a member function without symbols?",
              back: "Look for an incoming argument that is repeatedly used as the base of offset accesses. Under thiscall the object pointer arrives in a register (ecx on 32-bit Microsoft), and virtually all the function's memory traffic appears as [this+offset]. That pattern — one pointer plus many fixed offsets — is the signature of a method, and the offsets enumerate the class's members.",
            },
            {
              front: "How do you trace allocation?",
              back: "Break on new or malloc, record the requested size, and follow the returned pointer into the constructor.",
            },
            {
              front: "How do you find array indexing?",
              back: "Locate a scaled index such as [ebx+ecx*4] and determine the element size and bounds behavior.",
            },
            {
              front: "How do you map the struct?",
              back: "From field accesses at fixed offsets, build a struct layout with types and padding. Mark the this pointer in each method.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Objects, Structures, and Arrays; The this Pointer; The new and delete Operators",
            pageStart: null,
            pageEnd: null,
            note: "Recovers struct and class layouts from member offsets, alignment padding, and scaled index addressing; identifies methods by the hidden this argument; and covers operator new/delete sequences for scalars and arrays.",
            sectionIndexes: [
              20,
              21,
              22,
            ],
          },
          estimatedMinutes: 15,
        },
        {
          title: "Library Functions: Recognising Code You Did Not Write",
          objective: "Identify statically linked and inlined library routines so analysis time is spent on application logic rather than on compiler-provided code.",
          hook: "Most of a binary is not the program — it is the library, and recognising it is triage.",
          paragraphs: [
            "Kaspersky's chapter on library functions is about triage. A statically linked binary contains the C runtime, the C++ standard library, and often third-party code, and in a large executable the analyst's own target may be a small fraction of the listing. Learning to recognise library code by signature — the shape of a memcpy loop, a strlen scanner, a memset fill, a formatted-output routine — collapses the problem from 'understand this binary' to 'understand this residue'.",
            "Two mechanisms make this harder and easier at once. Harder, because compilers inline library functions: a call to strlen may not exist as a call at all, but as a short loop scanning for a zero byte that appears inside the application function and looks like application logic. Easier, because optimisation makes those patterns extremely regular — the same compiler emits the same sequence for the same library call — so signature databases and pattern matching work well.",
            "He distinguishes this from the dynamic case. A binary using the DLL form of a library simply calls through an import table, so the analyst sees a named import and moves on. The difficulty is entirely in static linking, where names are gone and the library's code is interleaved with the program's.",
            "The analytical habit to take away is to label aggressively and skip confidently. Once a region is identified as runtime initialisation or a formatting routine, it can be collapsed and ignored, and the remaining unknowns become tractable. Reversing time is a budget, and the library is where most of it is wasted.",
          ],
          bullets: [
            "Statically linked binaries embed the C and C++ runtimes, so the analyst's real target may be a small minority of the code and triage by signature is the first skill.",
            "Inlining removes the call that would identify a library routine and plants its loop inside application code, so the pattern must be recognised by shape rather than by symbol.",
            "Because the same compiler emits the same sequence for the same library call, pattern matching and signature databases remain effective even without names or imports.",
            "Label and skip: collapsing known runtime regions leaves a small set of unknowns, which is the difference between an endless listing and an analysable program.",
            "Harder, because compilers inline library functions: a call to strlen may not exist as a call at all, but as a short loop scanning for a zero byte that appears inside the application function and looks like application logic.",
            "Easier, because optimisation makes those patterns extremely regular — the same compiler emits the same sequence for the same library call — so signature databases and pattern matching work well.",
          ],
          steps: [
            {
              title: "Spot statically linked code",
              detail: "Find repeated function prologues with no imports nearby. Compare byte patterns with a known libc build.",
            },
            {
              title: "Apply signatures",
              detail: "Use FLIRT or a signature pack to label known library functions. Verify one label by checking its arguments and behavior.",
            },
            {
              title: "Reduce the noise",
              detail: "Rename the identified library functions and hide them. Recheck how much easier the remaining code is to read.",
            },
          ],
          takeaway: "Recognise the library by its shape, name it, collapse it, and spend the remaining effort where the program's own decisions live.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "sig",
                from: "all",
                label: "patterns",
              },
              {
                to: "collapse",
                from: "sig",
                label: "identify",
              },
              {
                to: "rest",
                from: "collapse",
                label: "remove",
              },
            ],
            nodes: [
              {
                id: "all",
                label: "Whole listing",
                emphasis: false,
              },
              {
                id: "sig",
                label: "Match library signatures",
                emphasis: true,
              },
              {
                id: "collapse",
                label: "Name and collapse",
                emphasis: false,
              },
              {
                id: "rest",
                label: "Application residue",
                emphasis: true,
              },
            ],
            title: "Triage a large binary",
          },
          quiz: {
            question: "Why can inlined library code be harder to spot than a statically linked library function?",
            options: [
              "Because inlined code is encrypted by the compiler",
              "Because the call disappears: the routine's instructions are pasted directly into the surrounding function, so there is no boundary or call site to flag it as library code",
              "Because inlined code always contains no loops",
              "Because inlined code is executed more slowly and therefore appears rarely",
            ],
            correctIndex: 1,
            explanation: "A call site is a natural label. Inlining erases it and merges the routine's instructions into the caller, so the analyst must recognise the operation by its instruction pattern instead of by a name or call.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Library Functions: Recognising Code You Did Not Write”?",
              options: [
                "Statically linked binaries embed the C and C++ runtimes, so the analyst's real target may be a small minority of the code and triage by signature is the first skill.",
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Statically linked binaries embed the C and C++ runtimes, so the analyst's real target may be a small minority of the code and triage by signature is the first skill.”",
            },
            {
              question: "Which statement best explains “How does static linking change the reversing problem compared with dynamic linking?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "With dynamic linking the library stays outside the file and the binary calls it through an import table, so the analyst sees named imports and can skip them. With static linking the library's machine code is copied into the executable with no symbol names, so it must be identified by shape and then mentally excluded — otherwise the analyst spends most effort on compiler-provided routines rather than on the program's own logic.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “With dynamic linking the library stays outside the file and the binary calls it through an import table, so the analyst sees named imports and can skip them. With static linking the library's machine code is copied into the executable with no symbol names, so it must be identified by shape and then mentally excluded — otherwise the analyst spends most effort on compiler-provided routines rather than on the program's own logic.”",
            },
            {
              question: "Which of these is a hands-on step in “Library Functions: Recognising Code You Did Not Write”?",
              options: [
                "Identify the calling convention",
                "Recognize the prologue",
                "Rename and type",
                "Spot statically linked code",
              ],
              correctIndex: 3,
              explanation: "“Spot statically linked code” is part of this lesson's sequence: Find repeated function prologues with no imports nearby. Compare byte patterns with a known libc build.",
            },
            {
              question: "What does the hands-on step “Apply signatures” involve?",
              options: [
                "Use FLIRT or a signature pack to label known library functions. Verify one label by checking its arguments and behavior.",
                "Pick five binaries and record packing, anti-debugging, registration checks, and integrity checks. Rate each protection from weak to strong.",
                "Follow references to the failure message back to the conditional jump that decides success or failure.",
                "Invert the jump or NOP the check in a copy, then run it with both correct and incorrect input. Confirm the patched behavior.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Apply signatures” as: Use FLIRT or a signature pack to label known library functions. Verify one label by checking its arguments and behavior.",
            },
          ],
          flashcards: [
            {
              front: "What makes compiler-generated library patterns reliable enough to match?",
              back: "Determinism. A given compiler version with given optimisation settings emits a specific instruction sequence for a library function, so the same bytes appear across binaries. Recognition can therefore be automated with signature databases or learned by hand as a small set of idioms, and the patterns are stable within a toolchain generation even though they differ between compilers.",
            },
            {
              front: "How does static linking change the reversing problem compared with dynamic linking?",
              back: "With dynamic linking the library stays outside the file and the binary calls it through an import table, so the analyst sees named imports and can skip them. With static linking the library's machine code is copied into the executable with no symbol names, so it must be identified by shape and then mentally excluded — otherwise the analyst spends most effort on compiler-provided routines rather than on the program's own logic.",
            },
            {
              front: "How do you apply signatures?",
              back: "Use FLIRT or a signature pack to label known library functions. Verify one label by checking its arguments and behavior.",
            },
            {
              front: "How do you spot statically linked code?",
              back: "Find repeated function prologues with no imports nearby. Compare byte patterns with a known libc build.",
            },
            {
              front: "How do you reduce the noise?",
              back: "Rename the identified library functions and hide them. Recheck how much easier the remaining code is to read.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Library Functions",
            pageStart: null,
            pageEnd: null,
            note: "Explains triage of statically linked binaries by recognising runtime and standard library signatures, the difficulty of inlined library routines with no call site, and the determinism of compiler output that makes pattern matching viable.",
            sectionIndexes: [
              23,
            ],
          },
          estimatedMinutes: 12,
        },
        {
          title: "Function Arguments, Part 1–2: Calling Conventions and Reading a Prototype",
          objective: "Distinguish cdecl, stdcall, fastcall, and thiscall from the code itself, and reconstruct a function's parameter list from how its frame is read.",
          hook: "The calling convention is a contract, and the stack layout is its signature on the binary.",
          paragraphs: [
            "Kaspersky devotes five chapters to arguments because a function's interface is the single hardest thing to recover from a stripped binary. The first half establishes the conventions. Under cdecl the caller pushes arguments right to left and cleans the stack afterwards, which produces an epilogue ending in a plain return and an add-to-stack at every call site. Under stdcall the callee cleans up, which produces a return-with-population instruction at the end of the function and no stack adjustment at call sites.",
            "Under fastcall, the first arguments travel in registers and only the remainder on the stack, and under thiscall the object pointer is the implicit first argument.",
            "The identifier is therefore structural rather than symbolic. A function that ends by returning and popping bytes is stdcall and, once you know how many bytes it pops, you know the total size of its arguments. A function that ends with a bare return and whose callers adjust the stack afterwards is cdecl. Parameters appear as positive frame offsets in order, with the first argument at the lowest offset under the usual right-to-left push order — which is why the analyst reads up the frame rather than down it.",
            "The chapters then show how to use this inversion. Instead of guessing a prototype and checking it, read the callee: which positive offsets are dereferenced, at what width, and whether they are used as pointers, integers, or structures. A value used as a base for further accesses is a pointer; a value compared against a limit is a length; a value loaded and then scaled is an index. Each access constrains the parameter's type, and the set of accesses reconstructs the interface.",
            "Kaspersky also covers the practical obstacles: by-value structures copied onto the stack enlarge the argument area, variadic functions make the count dynamic so the caller must clean, and mismatched conventions between a caller and callee are a classic source of stack corruption. Recognising a convention mismatch is often the explanation for a crash that makes no sense at the instruction level.",
          ],
          bullets: [
            "cdecl has the caller clean the stack after the call, stdcall has the callee pop arguments on return, fastcall passes the first arguments in registers, and thiscall adds an implicit object pointer as the first argument.",
            "The epilogue identifies the convention: return-and-pop means stdcall and the popped byte count is the total argument size, while a bare return with caller-side adjustment means cdecl.",
            "Parameters occupy positive frame offsets, and reconstructing a prototype means reading which offsets are dereferenced, at what width, and whether they serve as pointer, length, index, or structure base.",
            "Structures passed by value enlarge the stack area, variadic functions force caller cleanup, and a convention mismatch between caller and callee corrupts the stack — a frequent explanation for otherwise inexplicable crashes.",
            "Kaspersky devotes five chapters to arguments because a function's interface is the single hardest thing to recover from a stripped binary.",
            "Instead of guessing a prototype and checking it, read the callee: which positive offsets are dereferenced, at what width, and whether they are used as pointers, integers, or structures.",
          ],
          steps: [
            {
              title: "Compile three conventions",
              detail: "Write the same function with cdecl, stdcall, and fastcall. Compare the caller and callee disassembly for each.",
            },
            {
              title: "Read a prototype",
              detail: "At a call site, infer argument count and types from pushes, register loads, and later use. Write the C prototype.",
            },
            {
              title: "Verify with a harness",
              detail: "Call the function from a small test program using your prototype. If it crashes or returns garbage, revise the types.",
            },
          ],
          takeaway: "Read the callee, not the guess: the epilogue names the convention and the accesses to positive frame offsets describe each parameter's type.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "stdcall",
                from: "cdecl",
                label: "cleanup moves",
              },
              {
                to: "thiscall",
                from: "fastcall",
                label: "register passing",
              },
            ],
            nodes: [
              {
                id: "cdecl",
                label: "cdecl: caller cleans",
                emphasis: false,
              },
              {
                id: "stdcall",
                label: "stdcall: callee pops",
                emphasis: true,
              },
              {
                id: "fastcall",
                label: "fastcall: regs + stack",
                emphasis: false,
              },
              {
                id: "thiscall",
                label: "thiscall: implicit this",
                emphasis: true,
              },
            ],
            title: "Four conventions, one frame",
          },
          quiz: {
            question: "A function ends with a return instruction that also adds a constant to the stack pointer. What does that tell you?",
            options: [
              "That the function is variadic and the constant is the number of arguments actually passed",
              "That it uses a callee-cleanup convention such as stdcall, and the constant is the total size in bytes of its arguments",
              "That the function returns a structure larger than four bytes",
              "That the caller forgot to clean the stack and the callee is compensating",
            ],
            correctIndex: 1,
            explanation: "Return-with-pop is the callee taking responsibility for the argument area. The popped byte count is exactly the size of the parameters, so the epilogue both identifies the convention and measures the argument list.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Function Arguments, Part 1–2: Calling Conventions and Reading a Prototype”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "cdecl has the caller clean the stack after the call, stdcall has the callee pop arguments on return, fastcall passes the first arguments in registers, and thiscall adds an implicit object pointer as the first argument.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “cdecl has the caller clean the stack after the call, stdcall has the callee pop arguments on return, fastcall passes the first arguments in registers, and thiscall adds an implicit object pointer as the first argument.”",
            },
            {
              question: "Which statement best explains “Why does a calling-convention mismatch corrupt the stack?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "Because caller and callee disagree about who removes the arguments. If the callee pops and the caller also adjusts, the stack pointer moves twice and every subsequent local and return address is shifted, so a return jumps to the wrong place. If neither cleans it, the stack grows on every call. The convention is part of the binary interface, which is why it is encoded in mangled names.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Because caller and callee disagree about who removes the arguments. If the callee pops and the caller also adjusts, the stack pointer moves twice and every subsequent local and return address is shifted, so a return jumps to the wrong place. If neither cleans it, the stack grows on every call. The convention is part of the binary interface, which is why it is encoded in mangled names.”",
            },
            {
              question: "Which of these is a hands-on step in “Function Arguments, Part 1–2: Calling Conventions and Reading a Prototype”?",
              options: [
                "Reconstruct the class",
                "Resolve virtual calls",
                "Find array indexing",
                "Compile three conventions",
              ],
              correctIndex: 3,
              explanation: "“Compile three conventions” is part of this lesson's sequence: Write the same function with cdecl, stdcall, and fastcall. Compare the caller and callee disassembly for each.",
            },
            {
              question: "What does the hands-on step “Read a prototype” involve?",
              options: [
                "At a call site, infer argument count and types from pushes, register loads, and later use. Write the C prototype.",
                "Compile a program that calls IsDebuggerPresent and changes behavior. Observe it under and without a debugger.",
                "Find a routine that writes to its own code page, then sets execution permission. Dump the page after modification.",
                "Patch the conditional branch or hook the API to return false. Confirm the protected path now runs.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Read a prototype” as: At a call site, infer argument count and types from pushes, register loads, and later use. Write the C prototype.",
            },
          ],
          flashcards: [
            {
              front: "How do you tell a pointer parameter from an integer parameter in a listing?",
              back: "By usage. A pointer is dereferenced — it appears as the base of a memory operand, possibly with an offset — or is passed onward to a function known to take a pointer. An integer is compared, added, shifted, or used as a count, and a size is typically compared against a limit. A float is moved through floating-point registers. The type is inferred from the operations, never from the slot alone.",
            },
            {
              front: "Why does a calling-convention mismatch corrupt the stack?",
              back: "Because caller and callee disagree about who removes the arguments. If the callee pops and the caller also adjusts, the stack pointer moves twice and every subsequent local and return address is shifted, so a return jumps to the wrong place. If neither cleans it, the stack grows on every call. The convention is part of the binary interface, which is why it is encoded in mangled names.",
            },
            {
              front: "How do you compile three conventions?",
              back: "Write the same function with cdecl, stdcall, and fastcall. Compare the caller and callee disassembly for each.",
            },
            {
              front: "How do you verify with a harness?",
              back: "Call the function from a small test program using your prototype. If it crashes or returns garbage, revise the types.",
            },
            {
              front: "How do you read a prototype?",
              back: "At a call site, infer argument count and types from pushes, register loads, and later use. Write the C prototype.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Function Arguments (part 1); Function Arguments (part 2)",
            pageStart: null,
            pageEnd: null,
            note: "Establishes cdecl, stdcall, fastcall, and thiscall conventions, identifies them from epilogue and stack-adjustment patterns, reconstructs prototypes from accesses to positive frame offsets, and covers by-value structs, variadic functions, and mismatch crashes.",
            sectionIndexes: [
              24,
              25,
            ],
          },
          estimatedMinutes: 16,
        },
        {
          title: "Function Arguments, Part 3–5: Register Passing, Return Values, and Reconstructing Prototypes",
          objective: "Read 64-bit register-based argument passing and the different return-value channels, then assemble a complete prototype from callee evidence.",
          hook: "On x64 the arguments are in registers, and the stack slot may hold nothing but a spill.",
          paragraphs: [
            "The later chapters move to 64-bit code, where the Microsoft convention passes the first four arguments in registers — the first in the integer argument register, then the second, third, and fourth — and reserves stack space for them anyway. That reserved shadow space explains a puzzle that confuses newcomers: the callee often writes its incoming registers to fixed stack slots immediately, not because it needs them in memory but because the ABI gives it the space and the debugger expects it. Reading those stores is therefore the cleanest way to recover the incoming arguments.",
            "Beyond four arguments the rest go on the stack at fixed offsets, and floating-point arguments travel in separate vector registers, so a function can take eight values before any stack slot is used. Kaspersky shows how this changes the analysis: the old rule 'arguments are above the frame pointer' no longer holds, and the analyst must trace register writes at entry before concluding anything about the parameter list.",
            "Return values add another channel to track. Integers arrive in the accumulator, floating-point values in a floating-point register, and large structures through a hidden pointer argument that names the caller's destination buffer — which means a function with one visible argument may really take two. Small structures are packed into registers. Recognising which channel is in use is what tells the analyst whether a call produced a value at all, and where to look for it.",
            "The module closes on method. Reconstructing a prototype is a constraint-solving exercise: the convention fixes placement, the callee's reads fix width and type, the return channel fixes the result, and mangled names — when present — encode the whole signature including argument sizes. Kaspersky's recurring advice is to write the prototype down, annotate the listing, and revise it as evidence accumulates, rather than trying to hold an implicit guess in mind.",
          ],
          bullets: [
            "The 64-bit Microsoft convention passes the first four arguments in registers and reserves shadow space, so the callee's immediate stores of incoming registers are the easiest way to recover arguments.",
            "Further arguments go on the stack at fixed offsets while floating-point values use separate vector registers, so a function may accept many values without touching the stack at all.",
            "Return values travel through distinct channels — integer accumulator, floating-point register, or a hidden pointer to a caller-provided buffer for large structures — and small structures are packed into registers.",
            "Prototype reconstruction is constraint solving: convention gives placement, callee reads give types, return channel gives the result, and mangled names, when present, encode the full signature.",
            "The later chapters move to 64-bit code, where the Microsoft convention passes the first four arguments in registers — the first in the integer argument register, then the second, third, and fourth — and reserves stack space for them anyway.",
            "Kaspersky shows how this changes the analysis: the old rule 'arguments are above the frame pointer' no longer holds, and the analyst must trace register writes at entry before concluding anything about the parameter list.",
          ],
          steps: [
            {
              title: "Map x64 arguments",
              detail: "Compile a function with six integer arguments and identify RCX, RDX, R8, R9, and the stack slots.",
            },
            {
              title: "Find the return value",
              detail: "Check RAX after the call and how the caller uses it. Distinguish a value return from a struct return via hidden pointer.",
            },
            {
              title: "Reconstruct and test",
              detail: "Write the full prototype, call the function with sample inputs, and compare the result with the disassembly's logic.",
            },
          ],
          takeaway: "On x64, arguments arrive in registers and shadow space, results arrive in distinct channels, and a prototype is reconstructed by accumulating evidence rather than by guessing.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "shadow",
                from: "regs",
                label: "stored at entry",
              },
              {
                to: "stack",
                from: "shadow",
                label: "beyond four",
              },
              {
                to: "ret",
                from: "stack",
                label: "result",
              },
            ],
            nodes: [
              {
                id: "regs",
                label: "First 4 args in registers",
                emphasis: true,
              },
              {
                id: "shadow",
                label: "Shadow-space spills reveal them",
                emphasis: true,
              },
              {
                id: "stack",
                label: "Args 5+ on stack",
                emphasis: false,
              },
              {
                id: "ret",
                label: "Return channel: rax / xmm / hidden ptr",
                emphasis: false,
              },
            ],
            title: "Recovering a 64-bit prototype",
          },
          quiz: {
            question: "Why does a 64-bit function often store its incoming argument registers to the stack immediately?",
            options: [
              "Because registers cannot be read more than once after entry",
              "Because the calling convention reserves shadow space for those arguments, and spilling them there preserves them for debugging and for reuse as the registers are needed",
              "Because the stack is faster than registers on x64",
              "Because the operating system requires all arguments to be written to memory before any call",
            ],
            correctIndex: 1,
            explanation: "The ABI mandates the reserved area so a callee can spill its register arguments — and a debugger or exception handler can find them. The stores are not a sign that the arguments were passed on the stack; they are the callee saving registers it needs for other work.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Function Arguments, Part 3–5: Register Passing, Return Values, and Reconstructing Prototypes”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "The 64-bit Microsoft convention passes the first four arguments in registers and reserves shadow space, so the callee's immediate stores of incoming registers are the easiest way to recover arguments.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “The 64-bit Microsoft convention passes the first four arguments in registers and reserves shadow space, so the callee's immediate stores of incoming registers are the easiest way to recover arguments.”",
            },
            {
              question: "Which statement best explains “How can a function appear to take one argument but actually take two?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
                "When it returns a large structure. The calling convention requires the caller to supply storage, so the compiler inserts a hidden pointer as the first argument naming that destination, and the function writes its result there instead of returning it in a register. The analyst sees an extra incoming pointer, which is the tell — and explains why the visible parameter list looks one short.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “When it returns a large structure. The calling convention requires the caller to supply storage, so the compiler inserts a hidden pointer as the first argument naming that destination, and the function writes its result there instead of returning it in a register. The analyst sees an extra incoming pointer, which is the tell — and explains why the visible parameter list looks one short.”",
            },
            {
              question: "Which of these is a hands-on step in “Function Arguments, Part 3–5: Register Passing, Return Values, and Reconstructing Prototypes”?",
              options: [
                "Reconstruct the class",
                "Resolve virtual calls",
                "Find array indexing",
                "Map x64 arguments",
              ],
              correctIndex: 3,
              explanation: "“Map x64 arguments” is part of this lesson's sequence: Compile a function with six integer arguments and identify RCX, RDX, R8, R9, and the stack slots.",
            },
            {
              question: "What does the hands-on step “Find the return value” involve?",
              options: [
                "Check RAX after the call and how the caller uses it. Distinguish a value return from a struct return via hidden pointer.",
                "List security-relevant imports such as IsDebuggerPresent, VirtualProtect, and CreateRemoteThread. Explain what each implies.",
                "Pick five binaries and record packing, anti-debugging, registration checks, and integrity checks. Rate each protection from weak to strong.",
                "Follow references to the failure message back to the conditional jump that decides success or failure.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Find the return value” as: Check RAX after the call and how the caller uses it. Distinguish a value return from a struct return via hidden pointer.",
            },
          ],
          flashcards: [
            {
              front: "Why is reconstructing a prototype described as constraint solving?",
              back: "Because no single observation determines it. The convention fixes where each value travels, the callee's dereferences fix which are pointers, the comparisons and arithmetic fix which are integers or sizes, the return channel fixes the result type, and any mangled name fixes argument byte counts. Each fact narrows the possibilities, and only the accumulated set pins the signature down.",
            },
            {
              front: "How can a function appear to take one argument but actually take two?",
              back: "When it returns a large structure. The calling convention requires the caller to supply storage, so the compiler inserts a hidden pointer as the first argument naming that destination, and the function writes its result there instead of returning it in a register. The analyst sees an extra incoming pointer, which is the tell — and explains why the visible parameter list looks one short.",
            },
            {
              front: "How do you reconstruct and test?",
              back: "Write the full prototype, call the function with sample inputs, and compare the result with the disassembly's logic.",
            },
            {
              front: "How do you map x64 arguments?",
              back: "Compile a function with six integer arguments and identify RCX, RDX, R8, R9, and the stack slots.",
            },
            {
              front: "How do you find the return value?",
              back: "Check RAX after the call and how the caller uses it. Distinguish a value return from a struct return via hidden pointer.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Function Arguments (part 3); Function Arguments (part 4); Function Arguments (part 5)",
            pageStart: null,
            pageEnd: null,
            note: "Covers 64-bit register argument passing with shadow space, stack arguments beyond the fourth, vector registers for floating point, return-value channels including hidden pointers for large structures, and prototype reconstruction as accumulating evidence.",
            sectionIndexes: [
              26,
              27,
              28,
            ],
          },
          estimatedMinutes: 16,
        },
      ],
    },
    {
      title: "Module 4 — Debugger Internals and Protection Techniques",
      summary: "How debuggers actually work, how exceptions are delivered in protected mode, and the arms race: anti-tracing, anti-breakpoint checks, self-modifying code, and the Windows memory rules that constrain them.",
      lessons: [
        {
          title: "How the Debugger Works and How Exceptions Are Delivered",
          objective: "Explain software and hardware breakpoints, single stepping, and the protected-mode exception path that makes a debugger possible at all.",
          hook: "A debugger is not privileged magic — it is an exception handler that the operating system agrees to tell about your process.",
          paragraphs: [
            "Kaspersky's introduction sets the theme: protections and debuggers are two sides of one mechanism, because every anti-debugging trick is a claim about how the debugger must behave. The brief history that follows establishes that debugging facilities were designed into processors from early on, and that the operating system's cooperation — not the debugger's cleverness — is what makes breakpoints possible.",
            "The mechanism is then laid out precisely. A software breakpoint replaces one byte of the target instruction with a trap instruction, so when execution reaches it the processor raises an exception and the debugger, which saved the original byte, restores it, reports the stop, and re-inserts the trap when resuming. A hardware breakpoint uses dedicated debug registers in the processor that compare addresses without touching code, which is why hardware breakpoints are limited to a handful and why they survive self-checksumming code.",
            "Single stepping sets a trap flag in the flags register so an exception fires after each instruction.",
            "The exception path explains why all of this works in protected mode. Interrupts and exceptions are vectored through a descriptor table that the kernel owns, so an application never handles a trap directly; the kernel decides whether to deliver it to the process (through its structured exception handling chain) or to a debugger attached to the process, and the debugger interacts with memory and registers through the kernel's debugging interface rather than by touching another process directly.",
            "The consequence is the whole protection landscape. Because the debugger's presence is visible to the kernel and to the process, a program can ask whether it is being debugged, whether any debug registers are in use, or whether its code bytes have changed — and those questions are the basis of every anti-debugging technique in the following chapters.",
          ],
          bullets: [
            "A software breakpoint overwrites one byte with a trap instruction and relies on the debugger restoring and reinstalling it, while a hardware breakpoint uses processor debug registers and leaves code untouched.",
            "Single stepping sets a trap flag so an exception fires after each instruction, which is why tracing is observable and therefore detectable.",
            "In protected mode exceptions are vectored through a kernel-owned table, so traps reach a debugger only through the operating system's debugging interface and not by a process touching another directly.",
            "Because the kernel and the process can both observe debugging state, every anti-debugging technique is a question about breakpoints, registers, timing, or code integrity.",
            "Kaspersky's introduction sets the theme: protections and debuggers are two sides of one mechanism, because every anti-debugging trick is a claim about how the debugger must behave.",
            "The brief history that follows establishes that debugging facilities were designed into processors from early on, and that the operating system's cooperation — not the debugger's cleverness — is what makes breakpoints possible.",
          ],
          steps: [
            {
              title: "Trace an exception",
              detail: "Raise a divide-by-zero in a debuggee. Follow the debug event, the SEH chain, and the handler that runs.",
            },
            {
              title: "Set a handler breakpoint",
              detail: "Break on the exception dispatcher or your handler. Inspect the exception record and context.",
            },
            {
              title: "Write a handler",
              detail: "Add a vectored exception handler that logs the address and continues. Confirm it runs before the default crash dialog.",
            },
          ],
          takeaway: "Breakpoints are exceptions, exceptions are mediated by the kernel, and that mediation is what makes debugging both possible and detectable.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "exec",
                from: "patch",
                label: "reaches address",
              },
              {
                to: "kernel",
                from: "exec",
                label: "exception",
              },
              {
                to: "dbg",
                from: "kernel",
                label: "debug event",
              },
            ],
            nodes: [
              {
                id: "patch",
                label: "Debugger writes trap byte",
                emphasis: false,
              },
              {
                id: "exec",
                label: "CPU executes trap",
                emphasis: true,
              },
              {
                id: "kernel",
                label: "Kernel exception dispatcher",
                emphasis: true,
              },
              {
                id: "dbg",
                label: "Debugger notified, byte restored",
                emphasis: false,
              },
            ],
            title: "A software breakpoint fires",
          },
          quiz: {
            question: "Why do hardware breakpoints survive code that verifies its own bytes, while software breakpoints do not?",
            options: [
              "Because hardware breakpoints are encrypted by the processor",
              "Because hardware breakpoints compare addresses in processor debug registers without modifying the code, so an integrity check finds the original bytes intact",
              "Because hardware breakpoints suspend the integrity check while it runs",
              "Because software breakpoints are stored in a different memory region",
            ],
            correctIndex: 1,
            explanation: "A software breakpoint changes the instruction stream, which a checksum detects immediately. A hardware breakpoint changes only a debug register, leaving every byte in place, so self-verification cannot see it — although the anti-debugging code can still query whether debug registers are in use.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “How the Debugger Works and How Exceptions Are Delivered”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
                "A software breakpoint overwrites one byte with a trap instruction and relies on the debugger restoring and reinstalling it, while a hardware breakpoint uses processor debug registers and leaves code untouched.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “A software breakpoint overwrites one byte with a trap instruction and relies on the debugger restoring and reinstalling it, while a hardware breakpoint uses processor debug registers and leaves code untouched.”",
            },
            {
              question: "Which statement best explains “Why is the number of hardware breakpoints strictly limited?”?",
              options: [
                "Because they are implemented as a small fixed set of address-comparison registers inside the processor, with limited width and few slots. Every comparison must happen in parallel with instruction fetch, so adding slots costs silicon area and complexity. This is why analysts fall back to software breakpoints for bulk work and use the hardware slots for code that checks its own integrity.",
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Because they are implemented as a small fixed set of address-comparison registers inside the processor, with limited width and few slots. Every comparison must happen in parallel with instruction fetch, so adding slots costs silicon area and complexity. This is why analysts fall back to software breakpoints for bulk work and use the hardware slots for code that checks its own integrity.”",
            },
            {
              question: "Which of these is a hands-on step in “How the Debugger Works and How Exceptions Are Delivered”?",
              options: [
                "Map x64 arguments",
                "Reconstruct and test",
                "Defeat the check",
                "Trace an exception",
              ],
              correctIndex: 3,
              explanation: "“Trace an exception” is part of this lesson's sequence: Raise a divide-by-zero in a debuggee. Follow the debug event, the SEH chain, and the handler that runs.",
            },
            {
              question: "What does the hands-on step “Set a handler breakpoint” involve?",
              options: [
                "Break on the exception dispatcher or your handler. Inspect the exception record and context.",
                "Set a breakpoint on strcmp or the equivalent and inspect both arguments when the dialog is submitted.",
                "Use strings and a hex search for the password or a related error message. Record the address of every hit.",
                "Break on MessageBox and walk up the call stack to the branch that chose the failure message. Patch that branch.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Set a handler breakpoint” as: Break on the exception dispatcher or your handler. Inspect the exception record and context.",
            },
          ],
          flashcards: [
            {
              front: "What does the kernel's role in exception delivery imply for anti-debugging?",
              back: "That debugging is a state the system knows about, not a hidden observation. The kernel records which process is being debugged, delivers debug events to the debugger, and exposes flags in the process environment block. A program can therefore ask the operating system whether it is being debugged and get a truthful answer — which is why the simplest anti-debugging check is also one of the most effective.",
            },
            {
              front: "Why is the number of hardware breakpoints strictly limited?",
              back: "Because they are implemented as a small fixed set of address-comparison registers inside the processor, with limited width and few slots. Every comparison must happen in parallel with instruction fetch, so adding slots costs silicon area and complexity. This is why analysts fall back to software breakpoints for bulk work and use the hardware slots for code that checks its own integrity.",
            },
            {
              front: "How do you write a handler?",
              back: "Add a vectored exception handler that logs the address and continues. Confirm it runs before the default crash dialog.",
            },
            {
              front: "How do you set a handler breakpoint?",
              back: "Break on the exception dispatcher or your handler. Inspect the exception record and context.",
            },
            {
              front: "How do you trace an exception?",
              back: "Raise a divide-by-zero in a debuggee. Follow the debug event, the SEH chain, and the handler that runs.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Introduction (debugger section); A Brief History; How the Debugger Works; Processing Exceptions in Real and Protected Modes",
            pageStart: null,
            pageEnd: null,
            note: "Explains software breakpoints via trap-byte replacement, hardware breakpoints via processor debug registers, single stepping through the trap flag, and protected-mode exception delivery through the kernel's descriptor table and debugging interface.",
            sectionIndexes: [
              29,
              30,
              31,
              32,
            ],
          },
          estimatedMinutes: 16,
        },
        {
          title: "Protecting Programs: Anti-Tracing, Anti-Breakpoint, and Self-Modifying Code",
          objective: "Explain how programs detect and resist tracing and breakpoints, and how self-modifying code is both a protection technique and a compatibility problem.",
          hook: "The best anti-debugging code does not block the debugger — it makes every answer the debugger gives suspect.",
          paragraphs: [
            "Kaspersky's protection chapter starts from the observation that a traced program is slow, and that this is exploitable. Timing checks measure the interval between two points and conclude that a debugger is present when the interval is implausibly long. Trap-flag checks read the flags register or attempt to set the single-step bit and observe whether an exception follows. More devious variants execute an instruction whose behaviour differs under a debugger, or rely on the fact that stepping changes the order in which exceptions are delivered.",
            "Breakpoints are attacked directly. Since a software breakpoint is a byte substitution, a program can checksum its own code and refuse to run when a byte has changed; it can scan for the trap opcode; or it can install its own exception handler so that the trap is consumed inside the process before the debugger ever sees it. Kaspersky presents these as escalating countermeasures, each answerable by a smarter debugger and each cheap enough to be worth including.",
            "Self-modifying code is the strongest of the family. If the instructions that perform a check are generated or decrypted just before execution and overwritten afterwards, a static listing never shows the real logic and a breakpoint placed on the wrong bytes never fires. The chapter explains why this was once routine and why modern operating systems restrict it: memory pages are marked either writable or executable, so code modification requires explicitly changing page protections, which is both a performance cost and a visible event.",
            "The chapter's framing is the important part. None of these techniques makes analysis impossible; they make it expensive and error-prone, shifting the attacker's work from 'find the check' to 'build a harness that survives the deception'. Kaspersky is explicit that protection is an economic contest measured in analyst hours.",
          ],
          bullets: [
            "Timing checks exploit tracing overhead, while trap-flag manipulation and debugger-sensitive instructions detect stepping by observing behaviour that only occurs under single-step execution.",
            "Code checksums, trap-opcode scanning, and in-process exception handlers attack software breakpoints at the byte and exception-delivery level rather than trying to hide the check itself.",
            "Self-modifying code defeats static listings and misplaced breakpoints by generating or decrypting instructions just before use, which modern page-protection rules make costly and detectable.",
            "The goal is never impossibility but cost: anti-debugging turns a search into an engineering project, and strength is measured in the analyst hours it consumes.",
            "Timing checks measure the interval between two points and conclude that a debugger is present when the interval is implausibly long.",
            "If the instructions that perform a check are generated or decrypted just before execution and overwritten afterwards, a static listing never shows the real logic and a breakpoint placed on the wrong bytes never fires.",
          ],
          steps: [
            {
              title: "Detect a debugger",
              detail: "Compile a program that calls IsDebuggerPresent and changes behavior. Observe it under and without a debugger.",
            },
            {
              title: "Defeat the check",
              detail: "Patch the conditional branch or hook the API to return false. Confirm the protected path now runs.",
            },
            {
              title: "Spot self-modifying code",
              detail: "Find a routine that writes to its own code page, then sets execution permission. Dump the page after modification.",
            },
          ],
          takeaway: "Anti-debugging attacks the analyst's assumptions — timing, bytes, and exception flow — rather than the debugger itself, and success is measured in cost imposed.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "bpx",
                from: "time",
                label: "escalate",
              },
              {
                to: "smc",
                from: "bpx",
                label: "escalate",
              },
            ],
            nodes: [
              {
                id: "time",
                label: "Timing / trap-flag checks",
                emphasis: true,
              },
              {
                id: "bpx",
                label: "Checksums, trap scans, own handler",
                emphasis: true,
              },
              {
                id: "smc",
                label: "Self-modifying / decrypt-on-use",
                emphasis: false,
              },
            ],
            title: "Anti-analysis families",
          },
          quiz: {
            question: "Why can a program detect single stepping more easily than it can detect a plain breakpoint?",
            options: [
              "Because single stepping is implemented in the kernel rather than the processor",
              "Because stepping leaves the trap flag set and executes instructions one at a time, producing measurable timing and exception-ordering differences that the program can observe",
              "Because single stepping requires the program to be paused",
              "Because breakpoints are always cleared before the program runs",
            ],
            correctIndex: 1,
            explanation: "Stepping is a persistent, observable state change with a large performance cost and altered exception delivery. A one-shot breakpoint is harder to notice, which is why the checksum and trap-scan techniques exist as separate responses.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Protecting Programs: Anti-Tracing, Anti-Breakpoint, and Self-Modifying Code”?",
              options: [
                "Timing checks exploit tracing overhead, while trap-flag manipulation and debugger-sensitive instructions detect stepping by observing behaviour that only occurs under single-step execution.",
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Timing checks exploit tracing overhead, while trap-flag manipulation and debugger-sensitive instructions detect stepping by observing behaviour that only occurs under single-step execution.”",
            },
            {
              question: "Which statement best explains “How does a program defeat a software breakpoint without knowing where it is?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "By verifying its own integrity. A checksum or hash over each code region detects the substituted byte regardless of its location, and comparing the result against an expected value reveals tampering. The technique needs no knowledge of the debugger's plan, which is why it is so widely used — and why hardware breakpoints, which modify no bytes, exist as the countermeasure.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “By verifying its own integrity. A checksum or hash over each code region detects the substituted byte regardless of its location, and comparing the result against an expected value reveals tampering. The technique needs no knowledge of the debugger's plan, which is why it is so widely used — and why hardware breakpoints, which modify no bytes, exist as the countermeasure.”",
            },
            {
              question: "Which of these is a hands-on step in “Protecting Programs: Anti-Tracing, Anti-Breakpoint, and Self-Modifying Code”?",
              options: [
                "Find the check",
                "Load the crackme",
                "Patch and verify",
                "Detect a debugger",
              ],
              correctIndex: 3,
              explanation: "“Detect a debugger” is part of this lesson's sequence: Compile a program that calls IsDebuggerPresent and changes behavior. Observe it under and without a debugger.",
            },
            {
              question: "What does the hands-on step “Defeat the check” involve?",
              options: [
                "Patch the conditional branch or hook the API to return false. Confirm the protected path now runs.",
                "Use FLIRT or a signature pack to label known library functions. Verify one label by checking its arguments and behavior.",
                "At a call site, infer argument count and types from pushes, register loads, and later use. Write the C prototype.",
                "Call the function from a small test program using your prototype. If it crashes or returns garbage, revise the types.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Defeat the check” as: Patch the conditional branch or hook the API to return false. Confirm the protected path now runs.",
            },
          ],
          flashcards: [
            {
              front: "How does a program defeat a software breakpoint without knowing where it is?",
              back: "By verifying its own integrity. A checksum or hash over each code region detects the substituted byte regardless of its location, and comparing the result against an expected value reveals tampering. The technique needs no knowledge of the debugger's plan, which is why it is so widely used — and why hardware breakpoints, which modify no bytes, exist as the countermeasure.",
            },
            {
              front: "Why is self-modifying code harder to protect on modern operating systems?",
              back: "Because pages are marked writable or executable but not both, so a program cannot simply overwrite its own instructions. It must call an API to change page protections, which flushes instruction caches, costs performance, and is visible to security tooling. That is a deliberate trade: forbidding simultaneous write and execute eliminates a whole class of exploits at the cost of making legitimate generated code more elaborate.",
            },
            {
              front: "How do you spot self-modifying code?",
              back: "Find a routine that writes to its own code page, then sets execution permission. Dump the page after modification.",
            },
            {
              front: "How do you defeat the check?",
              back: "Patch the conditional branch or hook the API to return false. Confirm the protected path now runs.",
            },
            {
              front: "How do you detect a debugger?",
              back: "Compile a program that calls IsDebuggerPresent and changes behavior. Observe it under and without a debugger.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Protecting Programs; How to Counteract Tracing; Counteracting Breakpoints; Self-Modifying Code in Contemporary Operating Systems",
            pageStart: null,
            pageEnd: null,
            note: "Covers timing and trap-flag detection of tracing, checksum and trap-scan detection of breakpoints, in-process exception handlers, decrypt-on-use self-modifying code, and the write-xor-execute page rules that constrain it today.",
            sectionIndexes: [
              33,
              34,
              35,
              36,
            ],
          },
          estimatedMinutes: 16,
        },
        {
          title: "Windows Memory Architecture, WriteProcessMemory, Stack Execution, and Relocatable Code",
          objective: "Describe the Windows per-process address space and page protections, and explain why injection, stack execution, and relocation are constrained by them.",
          hook: "Before you can write to another process, you have to understand what 'memory' means to Windows.",
          paragraphs: [
            "Kaspersky describes the Windows address space as a per-process fiction built from committed regions, each with its own protection attribute: read-only, read-write, execute, or some combination, plus guard pages and reserved-but-uncommitted ranges. Tooling sees regions rather than a flat span, which is why a debugger's memory view is a list of ranges with attributes rather than a single dump, and why writing to an arbitrary address commonly fails until the protection is changed.",
            "WriteProcessMemory is introduced as the primitive behind debuggers, injectors, and patch tools. It requires the target process to be opened with the right access, and it must target a region the caller may legally modify; the operating system does not permit arbitrary cross-process writes, and modern mitigations narrow the circumstances further. Kaspersky uses it to show what patching and code injection have in common: both are writes into another address space followed by a redirection of control flow.",
            "Executing code in the stack is the classic variation. Place machine code in a buffer and jump to it — a technique that once required only a writable stack and now requires explicitly executable pages, since data execution prevention marks stack and heap non-executable by default. The chapter explains the mechanism and the obstacle together, which is the pattern of the whole protection section: every technique is paired with the mitigation that followed it.",
            "Relocatable code closes the chapter with a subtler constraint. Code that embeds absolute addresses must be patched when loaded at a different base, which is what the relocation table exists for; injected or generated code has no such table, so it must be written to compute its own addresses or to be placed at a known base. With address-space randomisation the base is no longer predictable, so hand-written machine code that assumes a fixed address simply crashes — a practical failure that teaches why position independence matters.",
          ],
          bullets: [
            "A Windows process sees its address space as committed regions with separate protection attributes, so memory operations target ranges and succeed only when the protection permits them.",
            "WriteProcessMemory is the shared primitive behind debuggers, injectors, and patchers: a legal cross-process write into a writable region, followed by redirection of execution.",
            "Executing code from the stack or heap now requires explicitly executable pages because data execution prevention marks those regions non-executable by default.",
            "Injected or generated code carries no relocation table, so it must compute its own addresses — a requirement made unavoidable by address-space randomisation, since a hard-coded base will not be valid.",
            "Kaspersky uses it to show what patching and code injection have in common: both are writes into another address space followed by a redirection of control flow.",
            "Place machine code in a buffer and jump to it — a technique that once required only a writable stack and now requires explicitly executable pages, since data execution prevention marks stack and heap non-executable by default.",
          ],
          steps: [
            {
              title: "Inject a DLL",
              detail: "Use OpenProcess, VirtualAllocEx, WriteProcessMemory, and CreateRemoteThread to load a benign DLL into a lab process.",
            },
            {
              title: "Test stack execution",
              detail: "Allocate RWX memory and run a small stub that returns a value. Then enable DEP and confirm execution is blocked.",
            },
            {
              title: "Handle relocation",
              detail: "Write position-independent code that finds its own base. Compare it with code that assumes a fixed image base.",
            },
          ],
          takeaway: "Injection and patching are constrained by page protections and relocation, so understanding the address-space model is a prerequisite for every run-time modification.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "prot",
                from: "open",
                label: "",
              },
              {
                to: "wpm",
                from: "prot",
                label: "permit",
              },
              {
                to: "exec",
                from: "wpm",
                label: "now map executable",
              },
            ],
            nodes: [
              {
                id: "open",
                label: "Open process with access rights",
                emphasis: false,
              },
              {
                id: "prot",
                label: "Region must be writable",
                emphasis: true,
              },
              {
                id: "wpm",
                label: "WriteProcessMemory",
                emphasis: true,
              },
              {
                id: "exec",
                label: "Redirect execution to code",
                emphasis: false,
              },
            ],
            title: "Writing and running foreign code",
          },
          quiz: {
            question: "Why does hand-written machine code injected into a modern Windows process often crash immediately?",
            options: [
              "Because injected code cannot call any API functions",
              "Because it typically assumes a fixed load address or an executable data page, and address-space randomisation plus non-executable data pages invalidate both assumptions",
              "Because WriteProcessMemory corrupts bytes during the copy",
              "Because the stack is always too small for injected code",
            ],
            correctIndex: 1,
            explanation: "Code with embedded absolute addresses has no relocation information, so a randomised base breaks it, and a buffer on the stack or heap is not executable unless protection was explicitly changed. Both are mitigations aimed precisely at this technique.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Windows Memory Architecture, WriteProcessMemory, Stack Execution, and Relocatable Code”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "A Windows process sees its address space as committed regions with separate protection attributes, so memory operations target ranges and succeed only when the protection permits them.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “A Windows process sees its address space as committed regions with separate protection attributes, so memory operations target ranges and succeed only when the protection permits them.”",
            },
            {
              question: "Which statement best explains “What is the relocation table for, and why can't injected code have one?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "It lists every place in the image that contains an absolute address, so the loader can adjust them when the module is mapped somewhere other than its preferred base. Injected code was not produced by a linker, so no such list exists; it must therefore be written to compute addresses at run time — relative to its own instruction pointer, or via an API lookup — rather than embedding them.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “It lists every place in the image that contains an absolute address, so the loader can adjust them when the module is mapped somewhere other than its preferred base. Injected code was not produced by a linker, so no such list exists; it must therefore be written to compute addresses at run time — relative to its own instruction pointer, or via an API lookup — rather than embedding them.”",
            },
            {
              question: "Which of these is a hands-on step in “Windows Memory Architecture, WriteProcessMemory, Stack Execution, and Relocatable Code”?",
              options: [
                "Recognize optimized idioms",
                "Classify five programs",
                "Inspect the imports",
                "Inject a DLL",
              ],
              correctIndex: 3,
              explanation: "“Inject a DLL” is part of this lesson's sequence: Use OpenProcess, VirtualAllocEx, WriteProcessMemory, and CreateRemoteThread to load a benign DLL into a lab process.",
            },
            {
              question: "What does the hands-on step “Test stack execution” involve?",
              options: [
                "Allocate RWX memory and run a small stub that returns a value. Then enable DEP and confirm execution is blocked.",
                "Call the function from a small test program using your prototype. If it crashes or returns garbage, revise the types.",
                "Write the same function with cdecl, stdcall, and fastcall. Compare the caller and callee disassembly for each.",
                "Check RAX after the call and how the caller uses it. Distinguish a value return from a struct return via hidden pointer.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Test stack execution” as: Allocate RWX memory and run a small stub that returns a value. Then enable DEP and confirm execution is blocked.",
            },
          ],
          flashcards: [
            {
              front: "Why does Windows expose memory as regions with protection attributes instead of a flat writable space?",
              back: "Because protection is the enforcement mechanism for process isolation and for data execution prevention. If every page were writable, code could modify other modules and execute injected buffers freely. Per-region attributes let the system mark code read-execute, data read-write, and stack non-executable, which blocks whole classes of attack at the cost of requiring explicit API calls when legitimate code needs to change protections.",
            },
            {
              front: "What is the relocation table for, and why can't injected code have one?",
              back: "It lists every place in the image that contains an absolute address, so the loader can adjust them when the module is mapped somewhere other than its preferred base. Injected code was not produced by a linker, so no such list exists; it must therefore be written to compute addresses at run time — relative to its own instruction pointer, or via an API lookup — rather than embedding them.",
            },
            {
              front: "How do you handle relocation?",
              back: "Write position-independent code that finds its own base. Compare it with code that assumes a fixed image base.",
            },
            {
              front: "How do you test stack execution?",
              back: "Allocate RWX memory and run a small stub that returns a value. Then enable DEP and confirm execution is blocked.",
            },
            {
              front: "How do you inject a DLL?",
              back: "Use OpenProcess, VirtualAllocEx, WriteProcessMemory, and CreateRemoteThread to load a benign DLL into a lab process.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — The Architecture of Windows Memory; Using the WriteProcessMemory Function; Executing Code in the Stack; The Pitfalls of Relocatable Code",
            pageStart: null,
            pageEnd: null,
            note: "Describes per-process regions with protection attributes, WriteProcessMemory as the primitive behind debugging and injection, data execution prevention blocking stack code, and relocation and address-space randomisation breaking hard-coded addresses.",
            sectionIndexes: [
              37,
              38,
              39,
              40,
            ],
          },
          estimatedMinutes: 15,
        },
        {
          title: "Optimizing Compilers, Self-Modifying Protection, and Where Protection Goes Next",
          objective: "Weigh optimising compilers as both obstacle and aid, see how self-modifying code protects a real application, and assess the future of software protection.",
          hook: "Optimisation destroys the program you wrote and replaces it with one that is harder to read but more consistent to recognise.",
          paragraphs: [
            "Kaspersky's treatment of optimising compilers is genuinely two-sided. On the negative side, optimisation inlines functions until boundaries vanish, reorders instructions, keeps variables in registers so the frame offsets that identified parameters disappear, eliminates dead code that would have explained intent, and unrolls loops into unrecognisable straight-line sequences. A prototype reconstructed from an unoptimised build may be unrecoverable from the optimised one by the same method.",
            "On the positive side, optimised code is idiomatic. Compilers converge on a small set of canonical sequences for division by constants, string scans, switch dispatch, and structure copies, so a reverse engineer who learns the idioms can read an optimised binary faster than a naive one. Kaspersky encourages learning these patterns precisely because they recur across unrelated programs and compilers.",
            "The chapter on using self-modifying code to protect applications turns the earlier discussion into a design. Code is stored encrypted and decrypted only into pages that are about to execute, integrity checks span regions rather than individual bytes, and the decryption key is derived at run time from several sources so that no single location yields it. The aim is not to stop a determined analyst but to ensure that every step — finding the check, dumping the code, tracing the key — costs separately.",
            "The closing chapter and the book's final summary gather the advice into a method: classify the protection, use the cheapest anchor available, prefer dynamic confirmation over static speculation, understand the calling convention before reconstructing a prototype, and remember that protection and analysis are an economic contest. Kaspersky ends by inviting the reader to design better protections, on the argument that the defender who understands the attack has the advantage.",
          ],
          bullets: [
            "Optimisation erases function boundaries, frame offsets, and dead code, so prototypes recovered from an unoptimised build may be unrecoverable from an optimised one by the same technique.",
            "Optimised output is idiomatic — canonical sequences for constant division, string scans, switch dispatch, and structure copies recur across programs, making a trained reader faster on optimised code.",
            "Self-modifying protection encrypts code, decrypts only what is about to execute, checks integrity over regions, and derives keys at run time from several sources so no single location leaks them.",
            "The book's method: classify, anchor cheaply, confirm dynamically, learn the calling convention, and treat protection as an economic contest in analyst hours.",
            "Kaspersky encourages learning these patterns precisely because they recur across unrelated programs and compilers.",
            "The aim is not to stop a determined analyst but to ensure that every step — finding the check, dumping the code, tracing the key — costs separately.",
          ],
          steps: [
            {
              title: "Diff optimization levels",
              detail: "Compile the same function at -O0 and -O2. Identify inlining, loop unrolling, and register reuse in the disassembly.",
            },
            {
              title: "Recognize optimized idioms",
              detail: "Find a memset, memcpy, or division turned into shifts and multiplication. Rewrite the likely source in C.",
            },
            {
              title: "Assess a modern protector",
              detail: "Run a demo of a commercial packer or VM-based protector. List the layers you can identify and which analysis method would attack each.",
            },
          ],
          takeaway: "Optimisation makes code harder to map to source but easier to recognise by idiom, and durable protection spreads cost across every step of analysis rather than hiding one secret.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "good",
                from: "bad",
                label: "learn idioms",
              },
              {
                to: "prot",
                from: "good",
                label: "defender uses both",
              },
            ],
            nodes: [
              {
                id: "bad",
                label: "Inlining, reordering: structure lost",
                emphasis: false,
              },
              {
                id: "good",
                label: "Canonical idioms: fast to read",
                emphasis: true,
              },
              {
                id: "prot",
                label: "Decrypt-on-use + layered keys",
                emphasis: true,
              },
            ],
            title: "Optimisation, both ways",
          },
          quiz: {
            question: "Why does deriving a decryption key at run time from several sources strengthen a protection more than storing it once?",
            options: [
              "Because multiple sources make the key mathematically longer",
              "Because no single memory location or code path yields the key, so the analyst must understand every contributing source and the combination logic — multiplying the work per secret",
              "Because the operating system encrypts multi-source keys automatically",
              "Because a single stored key would be too large to fit in a register",
            ],
            correctIndex: 1,
            explanation: "Protection cost scales with the number of independent things an attacker must understand. A single stored key is one search; a key assembled from several run-time sources forces the analyst to reverse each source and the combination, and missing one yields nothing usable.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Optimizing Compilers, Self-Modifying Protection, and Where Protection Goes Next”?",
              options: [
                "Protections are classified by protected asset, check timing, and mechanism — and each category has a characteristic weakness that determines the attack.",
                "Reconnaissance comes first: file type, packer, imports, strings, and observed behaviour give a map of where the check must be before any disassembly is read.",
                "Optimisation erases function boundaries, frame offsets, and dead code, so prototypes recovered from an unoptimised build may be unrecoverable from an optimised one by the same technique.",
                "Method 0 recovers the credential itself by locating the comparison and tracing the expected value back through its transformation, turning password recovery into analysis rather than bypass.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Optimisation erases function boundaries, frame offsets, and dead code, so prototypes recovered from an unoptimised build may be unrecoverable from an optimised one by the same technique.”",
            },
            {
              question: "Which statement best explains “Why can optimisation make a binary easier to reverse even though it destroys structure?”?",
              options: [
                "What is protected (password, serial, whole program), when the check occurs (at start-up, on a feature, continuously), and how it is implemented (comparison, key, hardware token, obfuscation). The axes matter practically: knowing when a check runs tells you whether to patch one jump or intercept a repeating interrupt, and knowing how it is implemented tells you whether to look for a cmp or for a decrypt routine.",
                "Where code ends and data begins. The instruction stream is just bytes, and a disassembler walking linearly will happily decode a jump table or an embedded string as instructions. In practice this means listings can contain convincing nonsense, addresses can be off, and analyst time is wasted chasing phantom logic — which is why static listings must be confirmed dynamically with a debugger.",
                "When you need the actual credential rather than a bypass — for example to understand a licensing scheme or to recover data. Method 0 reads the comparison and traces the expected value back, which works on the stored digest even offline. Method 1 only tells you where the check happens, which is enough to patch but not enough to reproduce the secret.",
                "Because compilers are consistent. A given optimisation setting produces the same canonical sequence for the same source construct — division by a constant becomes a multiply and shift, a string copy becomes a specific loop, a switch becomes a jump table. Once those idioms are learned, they are recognised instantly and their meaning is known without analysis, whereas unoptimised code must be read instruction by instruction.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Because compilers are consistent. A given optimisation setting produces the same canonical sequence for the same source construct — division by a constant becomes a multiply and shift, a string copy becomes a specific loop, a switch becomes a jump table. Once those idioms are learned, they are recognised instantly and their meaning is known without analysis, whereas unoptimised code must be read instruction by instruction.”",
            },
            {
              question: "Which of these is a hands-on step in “Optimizing Compilers, Self-Modifying Protection, and Where Protection Goes Next”?",
              options: [
                "Inject a DLL",
                "Test stack execution",
                "Classify five programs",
                "Diff optimization levels",
              ],
              correctIndex: 3,
              explanation: "“Diff optimization levels” is part of this lesson's sequence: Compile the same function at -O0 and -O2. Identify inlining, loop unrolling, and register reuse in the disassembly.",
            },
            {
              question: "What does the hands-on step “Recognize optimized idioms” involve?",
              options: [
                "Find a memset, memcpy, or division turned into shifts and multiplication. Rewrite the likely source in C.",
                "Find repeated function prologues with no imports nearby. Compare byte patterns with a known libc build.",
                "Rename the identified library functions and hide them. Recheck how much easier the remaining code is to read.",
                "Use FLIRT or a signature pack to label known library functions. Verify one label by checking its arguments and behavior.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Recognize optimized idioms” as: Find a memset, memcpy, or division turned into shifts and multiplication. Rewrite the likely source in C.",
            },
          ],
          flashcards: [
            {
              front: "What is the economic argument at the heart of the book's conclusion?",
              back: "That protection succeeds by making attack more expensive than the attacker's budget, not by being unbreakable. Each layer — anti-debugging, checksums, encryption, key derivation, obfuscation — adds hours to the analysis, and the defender chooses layers whose cost to implement is lower than the cost they impose. The defender who understands the attacker's method can price each layer correctly.",
            },
            {
              front: "Why can optimisation make a binary easier to reverse even though it destroys structure?",
              back: "Because compilers are consistent. A given optimisation setting produces the same canonical sequence for the same source construct — division by a constant becomes a multiply and shift, a string copy becomes a specific loop, a switch becomes a jump table. Once those idioms are learned, they are recognised instantly and their meaning is known without analysis, whereas unoptimised code must be read instruction by instruction.",
            },
            {
              front: "How do you diff optimization levels?",
              back: "Compile the same function at -O0 and -O2. Identify inlining, loop unrolling, and register reuse in the disassembly.",
            },
            {
              front: "How do you assess a modern protector?",
              back: "Run a demo of a commercial packer or VM-based protector. List the layers you can identify and which analysis method would attack each.",
            },
            {
              front: "How do you recognize optimized idioms?",
              back: "Find a memset, memcpy, or division turned into shifts and multiplication. Rewrite the likely source in C.",
            },
          ],
          sourceRef: {
            label: "Kaspersky, Hacker Disassembling Uncovered — Optimizing Compilers; Self-Modifying Protection; New Protection Tips; How to…",
            pageStart: null,
            pageEnd: null,
            note: "Weighs optimisation as both structure-destroying and idiom-producing, designs a self-modifying protection with decrypt-on-use and multi-source key derivation, and closes with the book's method: classify, anchor cheaply, confirm dynamically, and price protection in analyst hours.",
            sectionIndexes: [
              41,
              42,
              43,
              44,
              45,
            ],
          },
          estimatedMinutes: 14,
        },
      ],
    },
  ],
};
