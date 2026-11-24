import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const zeroDayCourse: DraftCourse = {
  title: "From Day Zero to Zero Day",
  description: "A full-book distillation of Eugene Lim's guide to zero-day vulnerability research: what counts as a vulnerability, the three disciplines of code review, reverse engineering, and fuzzing, and how to disclose what you find. 20 lessons covering every chapter.",
  category: "Security",
  level: "intermediate",
  coverEmoji: "🎯",
  tags: [
    "security",
    "vulnerability research",
    "fuzzing",
    "code review",
    "reverse engineering",
  ],
  modules: [
    {
      title: "Ground Zero: What Zero-Day Research Is",
      summary: "Chapter 0 and the introduction: definitions, the difference from penetration testing, the three disciplines, and how to pick a target worth researching.",
      lessons: [
        {
          title: "What Counts as a Vulnerability",
          objective: "Distinguish a vulnerability from a bug and describe impact using the CIA triad and CVE records.",
          hook: "A router reports the wrong day of the week. Bug or vulnerability? The answer decides whether anyone will ever fix it.",
          paragraphs: [
            "The book anchors on NIST's definition: a vulnerability is a weakness in an information system, security procedures, internal controls, or implementation that could be exploited or triggered by a threat source. Two conditions must hold. First, there is a flaw in the design or implementation that makes the system behave insecurely. Second, a threat source must actually be able to trigger it. Miss the second condition and you have a bug, not a vulnerability.",
            "CVSS evaluates impact through the CIA triad: confidentiality (attacker reads data they should not), integrity (attacker modifies data they should not), and availability (attacker disrupts the system itself). These components frame how you communicate a finding. CVE identifiers, assigned by federated Numbering Authorities, reference disclosed vulnerabilities - but the book warns that not every vulnerability has a CVE and not every CVE is a real vulnerability.",
            "The disputed curl CVE-2020-19909 (a retry-delay integer overflow) and the Postgres SIGHUP CVE-2020-21469 both failed the security-boundary test and were amended or rejected by their projects.",
          ],
          bullets: [
            "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
            "Bug vs vulnerability: can a threat source exploit it across a security boundary?",
            "CVEs are references, not verdicts - projects successfully dispute bogus ones",
            "The book anchors on NIST's definition: a vulnerability is a weakness in an information system, security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
            "CVSS evaluates impact through the CIA triad: confidentiality (attacker reads data they should not), integrity (attacker modifies data they should not), and availability (attacker disrupts the system itself).",
            "CVE identifiers, assigned by federated Numbering Authorities, reference disclosed vulnerabilities - but the book warns that not every vulnerability has a CVE and not every CVE is a real vulnerability.",
          ],
          steps: [
            {
              title: "Trigger a real bug",
              detail: "Write a small C program that copies input with strcpy into a fixed buffer. Feed it a long string under AddressSanitizer and capture the crash.",
            },
            {
              title: "Classify the root cause",
              detail: "Label the bug as memory corruption, injection, or logic error. Point to the exact line and the missing check.",
            },
            {
              title: "Fix and retest",
              detail: "Replace the copy with a bounded operation and rerun the same input. Confirm the crash is gone and normal input still works.",
            },
          ],
          takeaway: "If a weakness cannot be triggered by anyone across a security boundary, it is a bug: log it, don't report it as a vulnerability.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "trigger",
                from: "flaw",
                label: "test",
              },
              {
                to: "boundary",
                from: "trigger",
                label: "yes",
              },
              {
                to: "vuln",
                from: "boundary",
                label: "yes",
              },
            ],
            nodes: [
              {
                id: "flaw",
                label: "Flaw in design or code",
                emphasis: false,
              },
              {
                id: "trigger",
                label: "Triggerable by a threat source?",
                emphasis: true,
              },
              {
                id: "boundary",
                label: "Crosses a security boundary?",
                emphasis: true,
              },
              {
                id: "vuln",
                label: "Vulnerability (CIA impact)",
                emphasis: false,
              },
            ],
            title: "From weakness to vulnerability",
          },
          quiz: {
            question: "Which statement best separates a vulnerability from a bug?",
            options: [
              "The vulnerability appears in the CVE catalog and the bug does not",
              "A threat source can exploit it to cross a security boundary",
              "The vulnerability is exploitable only by the system's own administrators",
              "Bugs are always fixed, while vulnerabilities are always left open",
            ],
            correctIndex: 1,
            explanation: "NIST's definition requires exploitability by a threat source. The Postgres SIGHUP example fails this test: an attacker who already has superuser access can do worse without any 'exploit', so it never crossed a security boundary.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “What Counts as a Vulnerability”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
                "Familiarity: language, platform, and prior research you can lean on",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “CIA triad: confidentiality, integrity, availability - the lens for describing impact”",
            },
            {
              question: "Which statement best explains “NIST definition of a vulnerability”?",
              options: [
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
                "Familiarity (can you read it?), Availability (can you obtain, build, and test it, and reach owners?), Impact (would anyone care if it broke?).",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.”",
            },
            {
              question: "Which of these is a hands-on step in “What Counts as a Vulnerability”?",
              options: [
                "Write a harness",
                "Fix and verify",
                "Instrument the target",
                "Trigger a real bug",
              ],
              correctIndex: 3,
              explanation: "“Trigger a real bug” is part of this lesson's sequence: Write a small C program that copies input with strcpy into a fixed buffer. Feed it a long string under AddressSanitizer and capture the crash.",
            },
            {
              question: "What does the hands-on step “Classify the root cause” involve?",
              options: [
                "Label the bug as memory corruption, injection, or logic error. Point to the exact line and the missing check.",
                "For one candidate bug, combine the source line, runtime trace, and crashing input into a single reproducible note.",
                "Review the target statically, trace it dynamically, and fuzz one input. Record what each method found that the others missed.",
                "Pick the target with the best total and write one paragraph explaining why the others lost.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Classify the root cause” as: Label the bug as memory corruption, injection, or logic error. Point to the exact line and the missing check.",
            },
          ],
          flashcards: [
            {
              front: "CIA triad in CVSS impact terms",
              back: "Confidentiality (unauthorized read), integrity (unauthorized modify), availability (disrupt access to the system).",
            },
            {
              front: "NIST definition of a vulnerability",
              back: "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
            },
            {
              front: "How do you fix and retest?",
              back: "Replace the copy with a bounded operation and rerun the same input. Confirm the crash is gone and normal input still works.",
            },
            {
              front: "How do you classify the root cause?",
              back: "Label the bug as memory corruption, injection, or logic error. Point to the exact line and the missing check.",
            },
            {
              front: "How do you trigger a real bug?",
              back: "Write a small C program that copies input with strcpy into a fixed buffer. Feed it a long string under AddressSanitizer and capture the crash.",
            },
          ],
          sourceRef: {
            label: "Introduction – Chapter 0: Day Zero",
            pageStart: 15,
            pageEnd: 30,
            note: "NIST definition, CIA triad, bug vs vulnerability, and disputed CVE records for curl and Postgres.",
            sectionIndexes: [
              1,
              2,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Vulnerability Research vs. Penetration Testing",
          objective: "Explain how vulnerability research differs from penetration testing in goals, targets, and technique.",
          hook: "A pentester finds an outdated server with a public exploit. A researcher finds a flaw no one has ever seen. Same tools, different game.",
          paragraphs: [
            "Penetration testing aims to find and exploit vulnerabilities in a particular system - Enterprise X's network, a specific web server - and those vulnerabilities are not necessarily new; a scanner plus a public exploit script is enough. Vulnerability research aims to discover vulnerabilities in software or hardware targets themselves. Find a new bug in a router and every network using that router is theoretically at risk, which is why the targets must be publicly available software, not one organization's private custom script.",
            "The disciplines also differ in depth. Penetration tests are often confined to black-box testing of external attack surfaces. Vulnerability research works white-box (full source) or gray-box (partial internals), taking an inside-out view with code review and reverse engineering to find deeper flaws. And research does not require exploitation: a proof of concept that triggers a buffer overflow is sufficient - developing a full exploit is a separate discipline, exploit development, often handled by a different team. For this book, the focus stays narrowly on vulnerability discovery.",
          ],
          bullets: [
            "Pentest targets an instance; research targets the software product for everyone",
            "Black-box outside-in vs white/gray-box inside-out analysis",
            "Discovery and exploit development are separate jobs - PoC is enough for research",
            "Penetration testing aims to find and exploit vulnerabilities in a particular system - Enterprise X's network, a specific web server - and those vulnerabilities are not necessarily new; a scanner plus a public exploit script is enough.",
            "Find a new bug in a router and every network using that router is theoretically at risk, which is why the targets must be publicly available software, not one organization's private custom script.",
            "And research does not require exploitation: a proof of concept that triggers a buffer overflow is sufficient - developing a full exploit is a separate discipline, exploit development, often handled by a different team.",
          ],
          steps: [
            {
              title: "Write rules of engagement",
              detail: "For a lab target, define scope, allowed techniques, time window, and emergency contact. Explicitly list out-of-scope hosts.",
            },
            {
              title: "Map the assets",
              detail: "List domains, ports, services, and user roles in scope. Mark which ones you may test destructively and which are read-only.",
            },
            {
              title: "Define success",
              detail: "Write what counts as a finding: reproducible impact, affected version, and evidence. Decide what you will not report.",
            },
          ],
          takeaway: "Vulnerability research is systematic discovery against publicly available targets, and it stops at a triggering proof of concept.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Write rules of engagement",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Map the assets",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Define success",
                emphasis: true,
              },
            ],
            title: "How Vulnerability Research vs. Penetration Testing works",
          },
          quiz: {
            question: "During a penetration test you find a custom script that exists only on the client's server. Why is it out of scope for typical vulnerability research?",
            options: [
              "Custom scripts cannot contain exploitable vulnerabilities",
              "The target is not publicly available software that others could be exposed to",
              "Penetration tests always forbid reporting anything they find",
              "Vulnerability research only covers hardware targets",
            ],
            correctIndex: 1,
            explanation: "Research targets must be obtainable by others - open source or commercially available. A private script on one server exposes no wider population, so finding bugs in it is pentesting, not research.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Vulnerability Research vs. Penetration Testing”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
                "Familiarity: language, platform, and prior research you can lean on",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Pentest targets an instance; research targets the software product for everyone”",
            },
            {
              question: "Which statement best explains “White-box vs gray-box vs black-box analysis”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Familiarity (can you read it?), Availability (can you obtain, build, and test it, and reach owners?), Impact (would anyone care if it broke?).",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.”",
            },
            {
              question: "Which of these is a hands-on step in “Vulnerability Research vs. Penetration Testing”?",
              options: [
                "Walk backwards",
                "Fix the cause",
                "Prove impact",
                "Write rules of engagement",
              ],
              correctIndex: 3,
              explanation: "“Write rules of engagement” is part of this lesson's sequence: For a lab target, define scope, allowed techniques, time window, and emergency contact. Explicitly list out-of-scope hosts.",
            },
            {
              question: "What does the hands-on step “Map the assets” involve?",
              options: [
                "List domains, ports, services, and user roles in scope. Mark which ones you may test destructively and which are read-only.",
                "Follow the argument up the call graph until you reach an HTTP parameter or file read. Note any validation on the way.",
                "Pick a dangerous call in a small app and list every caller that can reach it. Mark which arguments are attacker-controlled.",
                "In the lab, demonstrate a concrete effect such as reading a protected file or executing a benign command. Capture the output.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Map the assets” as: List domains, ports, services, and user roles in scope. Mark which ones you may test destructively and which are read-only.",
            },
          ],
          flashcards: [
            {
              front: "White-box vs gray-box vs black-box analysis",
              back: "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
            },
            {
              front: "Where does exploit development fit?",
              back: "It is a separate discipline from vulnerability discovery; research output is a triggering PoC, which may be passed to an exploit-development team.",
            },
            {
              front: "How do you map the assets?",
              back: "List domains, ports, services, and user roles in scope. Mark which ones you may test destructively and which are read-only.",
            },
            {
              front: "How do you define success?",
              back: "Write what counts as a finding: reproducible impact, affected version, and evidence. Decide what you will not report.",
            },
            {
              front: "How do you write rules of engagement?",
              back: "For a lab target, define scope, allowed techniques, time window, and emergency contact. Explicitly list out-of-scope hosts.",
            },
          ],
          sourceRef: {
            label: "Chapter 0: Day Zero",
            pageStart: 21,
            pageEnd: 30,
            note: "Vulnerability research vs penetration testing: goals, public targets, and the discovery/exploit-development split.",
            sectionIndexes: [
              2,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Three Disciplines, One Workflow",
          objective: "Describe code review, reverse engineering, and fuzzing, and explain why the book teaches them in that order.",
          hook: "Magic trick or systematic process? The author's answer: the method behind zero-day hunting is learnable - there are three crafts behind it.",
          paragraphs: [
            "Code review analyzes source to find vulnerabilities, and the book starts here because it builds the foundations - root cause analysis and taint analysis - that later disciplines reuse. Understanding how the target works in source makes its behavior conceptually visible when you reverse engineer or fuzz it. It is also where decades-old vulnerable code hides: Log4j's JNDI injection (CVE-2021-44228) sat unnoticed since 2013, the liblzma backdoor rode distributions worldwide, and forked projects often fail to propagate patches upstream - the author found RCE in Apache OpenOffice that LibreOffice had already fixed.",
            "Reverse engineering picks up where code review leaves off: taking apart binaries to see their inner workings. It is like exploring a dark tunnel where treasures may hide at the next turn, and it defeats security-by-obscurity - the first researcher to properly reverse a neglected target often finds many flaws just beneath the surface. Fuzzing then automates input generation: early 'caveman' fuzzing just hammered targets, while modern coverage-guided fuzzing steers mutations with runtime feedback.",
            "The author's advice is to read in order - skipping straight to fuzzing without data-flow understanding wastes time fuzzing the wrong part of a target.",
          ],
          bullets: [
            "Code review: source analysis that teaches root cause and taint analysis",
            "Reverse engineering: recover behavior when source is absent or hidden",
            "Fuzzing: automated unexpected-input testing, now coverage-guided",
            "Read the disciplines in order - each one feeds the next",
            "Code review analyzes source to find vulnerabilities, and the book starts here because it builds the foundations - root cause analysis and taint analysis - that later disciplines reuse.",
            "Understanding how the target works in source makes its behavior conceptually visible when you reverse engineer or fuzz it.",
          ],
          steps: [
            {
              title: "Set up the lab",
              detail: "Create an isolated VM with a vulnerable target, a proxy, a disassembler, and a static analyzer. Snapshot it before testing.",
            },
            {
              title: "Run all three lenses",
              detail: "Review the target statically, trace it dynamically, and fuzz one input. Record what each method found that the others missed.",
            },
            {
              title: "Merge the evidence",
              detail: "For one candidate bug, combine the source line, runtime trace, and crashing input into a single reproducible note.",
            },
          ],
          takeaway: "Code review teaches you how targets work, reverse engineering extends that to binaries, and fuzzing automates the search - in that order.",
          diagram: {
            type: "cycle",
            edges: [
              {
                to: "re",
                from: "cr",
                label: "patterns carry over",
              },
              {
                to: "fz",
                from: "re",
                label: "targets identified",
              },
              {
                to: "cr",
                from: "fz",
                label: "crashes to triage",
              },
              {
                to: "harness",
                from: "fz",
                label: "feedback",
              },
            ],
            nodes: [
              {
                id: "cr",
                label: "Code review",
                emphasis: false,
              },
              {
                id: "re",
                label: "Reverse engineering",
                emphasis: false,
              },
              {
                id: "fz",
                label: "Fuzzing",
                emphasis: false,
              },
              {
                id: "harness",
                label: "Better harnesses and rules",
                emphasis: true,
              },
            ],
            title: "The three disciplines reinforce each other",
          },
          quiz: {
            question: "Why does the book introduce code review before reverse engineering and fuzzing?",
            options: [
              "Because source code is always easier to obtain than binaries",
              "Because the foundations of root cause and taint analysis transfer to the later disciplines",
              "Because fuzzing cannot be performed without first writing documentation",
              "Because reverse engineering is no longer a relevant skill",
            ],
            correctIndex: 1,
            explanation: "The author states that understanding the target's data flows first prevents wasting time fuzzing the wrong part of a target; taint and root-cause skills are reused in every later chapter.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Three Disciplines, One Workflow”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
                "Familiarity: language, platform, and prior research you can lean on",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Code review: source analysis that teaches root cause and taint analysis”",
            },
            {
              question: "Which statement best explains “Why 'security by obscurity' fails”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Familiarity (can you read it?), Availability (can you obtain, build, and test it, and reach owners?), Impact (would anyone care if it broke?).",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.”",
            },
            {
              question: "Which of these is a hands-on step in “Three Disciplines, One Workflow”?",
              options: [
                "Build the exploit",
                "Start at the sink",
                "Walk backwards",
                "Set up the lab",
              ],
              correctIndex: 3,
              explanation: "“Set up the lab” is part of this lesson's sequence: Create an isolated VM with a vulnerable target, a proxy, a disassembler, and a static analyzer. Snapshot it before testing.",
            },
            {
              question: "What does the hands-on step “Run all three lenses” involve?",
              options: [
                "Review the target statically, trace it dynamically, and fuzz one input. Record what each method found that the others missed.",
                "Patch all confirmed variants with one shared helper, then add a test that would catch the pattern returning.",
                "Write a query or grep for the pattern and collect every candidate. Manually confirm which ones are reachable.",
                "Decide whether it is a GUI app, a service, a driver, or a firmware image. Note the input path you can control.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Run all three lenses” as: Review the target statically, trace it dynamically, and fuzz one input. Record what each method found that the others missed.",
            },
          ],
          flashcards: [
            {
              front: "Why 'security by obscurity' fails",
              back: "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
            },
            {
              front: "Caveman vs modern fuzzing",
              back: "Caveman: point a fuzzer at a target and wait. Modern: coverage-guided mutations plus custom harnesses that target interesting or neglected code paths.",
            },
            {
              front: "How do you merge the evidence?",
              back: "For one candidate bug, combine the source line, runtime trace, and crashing input into a single reproducible note.",
            },
            {
              front: "How do you run all three lenses?",
              back: "Review the target statically, trace it dynamically, and fuzz one input. Record what each method found that the others missed.",
            },
            {
              front: "How do you set up the lab?",
              back: "Create an isolated VM with a vulnerable target, a proxy, a disassembler, and a static analyzer. Snapshot it before testing.",
            },
          ],
          sourceRef: {
            label: "Introduction – Chapter 0: Day Zero",
            pageStart: 15,
            pageEnd: 30,
            note: "The three disciplines (code review, reverse engineering, fuzzing), Log4j/liblzma examples, and the recommended reading order.",
            sectionIndexes: [
              1,
              2,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Picking a Target: Familiarity, Availability, Impact",
          objective: "Apply the rule of three - familiarity, availability, and impact - to choose a research target.",
          hook: "The target you choose decides most of your odds. The book gives you a rule of three, borrowed from the CIA triad but with a new 'availability'.",
          paragraphs: [
            "Familiarity is how much you already know about the target: a language and framework you are comfortable with, a platform you understand (web app? native library? Windows APIs? client or server?), and any prior research - conference talks, whitepapers, write-ups - that speeds up your ramp. The book pushes back on avoiding well-researched targets: popular projects constantly change and add features, so don't give up before trying.",
            "Availability means how easy the target is to access and analyze: source on GitHub with trackable branches (beware scattered monorepos and private dependencies), a workable test environment - ideally containerized builds or documented setup with debug symbols - and accessible project owners with a security contact. The author quotes PoC || GTFO: what looks like a vulnerability in source may be mitigated by runtime checks, so validate while you review. Impact is who cares if you win: stars, forks, downloads, dependents.",
            "The tiny js-yaml package - 33 files, rarely updated - has 20,000+ dependents and 100 million downloads a week, so a bug there echoes everywhere.",
          ],
          bullets: [
            "Familiarity: language, platform, and prior research you can lean on",
            "Availability: obtainable source, buildable test env, reachable maintainers",
            "Impact: downstream dependents and downloads, not just stars",
            "Hunt on GitHub topics/trending and the ASF directory; skip end-of-life projects",
            "Familiarity is how much you already know about the target: a language and framework you are comfortable with, a platform you understand (web app?",
            "The book pushes back on avoiding well-researched targets: popular projects constantly change and add features, so don't give up before trying.",
          ],
          steps: [
            {
              title: "Score three targets",
              detail: "Rate three programs from 1-5 on familiarity, ease of setup, and potential impact. Put the scores in a table.",
            },
            {
              title: "Choose and justify",
              detail: "Pick the target with the best total and write one paragraph explaining why the others lost.",
            },
            {
              title: "Write a hypothesis",
              detail: "State the most likely vulnerability class and the input path you will test first. Keep it falsifiable.",
            },
          ],
          takeaway: "Choose a target you can read, can build, and whose failure would matter - then verify your assumptions against a running instance.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "f",
                from: "t",
                label: "can you read it?",
              },
              {
                to: "a",
                from: "t",
                label: "can you build it?",
              },
              {
                to: "i",
                from: "t",
                label: "does it matter?",
              },
            ],
            nodes: [
              {
                id: "t",
                label: "Research target",
                emphasis: true,
              },
              {
                id: "f",
                label: "Familiarity",
                emphasis: false,
              },
              {
                id: "a",
                label: "Availability",
                emphasis: false,
              },
              {
                id: "i",
                label: "Impact",
                emphasis: false,
              },
            ],
            title: "The rule of three for target selection",
          },
          quiz: {
            question: "A project has almost no stars but is the only known parser for a legacy format used by major software. Which factor makes it interesting?",
            options: [
              "Familiarity, because old code is always written in familiar languages",
              "Availability, because legacy projects are easy to build",
              "Impact, because dead-looking projects can carry hidden downstream importance",
              "None - dead projects should always be avoided",
            ],
            correctIndex: 2,
            explanation: "The book explicitly warns that a dead project could be the only known parsing library for a legacy format some major software depends on - impact isn't measured by stars alone.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Picking a Target: Familiarity, Availability, Impact”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
                "Familiarity: language, platform, and prior research you can lean on",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Familiarity: language, platform, and prior research you can lean on”",
            },
            {
              question: "Which statement best explains “Rule of three for picking a target”?",
              options: [
                "Familiarity (can you read it?), Availability (can you obtain, build, and test it, and reach owners?), Impact (would anyone care if it broke?).",
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Familiarity (can you read it?), Availability (can you obtain, build, and test it, and reach owners?), Impact (would anyone care if it broke?).”",
            },
            {
              question: "Which of these is a hands-on step in “Picking a Target: Familiarity, Availability, Impact”?",
              options: [
                "Find the entry point",
                "Reconstruct one structure",
                "Trace user input",
                "Score three targets",
              ],
              correctIndex: 3,
              explanation: "“Score three targets” is part of this lesson's sequence: Rate three programs from 1-5 on familiarity, ease of setup, and potential impact. Put the scores in a table.",
            },
            {
              question: "What does the hands-on step “Choose and justify” involve?",
              options: [
                "Pick the target with the best total and write one paragraph explaining why the others lost.",
                "Run tcpdump or Wireshark against a lab service. Save a capture that includes a full request and response.",
                "Send a length larger and smaller than the actual body. Watch for crashes, hangs, or parser confusion and record the behavior.",
                "Express a source-to-sink taint flow for the same bug. Compare its results with your Semgrep rule.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Choose and justify” as: Pick the target with the best total and write one paragraph explaining why the others lost.",
            },
          ],
          flashcards: [
            {
              front: "PoC || GTFO (in target selection)",
              back: "Always test against a working instance: what looks vulnerable in source may be mitigated by validation or runtime checks. Demonstrate exploitability.",
            },
            {
              front: "Rule of three for picking a target",
              back: "Familiarity (can you read it?), Availability (can you obtain, build, and test it, and reach owners?), Impact (would anyone care if it broke?).",
            },
            {
              front: "How do you choose and justify?",
              back: "Pick the target with the best total and write one paragraph explaining why the others lost.",
            },
            {
              front: "How do you score three targets?",
              back: "Rate three programs from 1-5 on familiarity, ease of setup, and potential impact. Put the scores in a table.",
            },
            {
              front: "How do you write a hypothesis?",
              back: "State the most likely vulnerability class and the input path you will test first. Keep it falsifiable.",
            },
          ],
          sourceRef: {
            label: "Chapter 0: Day Zero",
            pageStart: 21,
            pageEnd: 30,
            note: "Target selection: familiarity, availability, impact; where to explore projects (GitHub topics, ASF directory).",
            sectionIndexes: [
              2,
            ],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Part I · Code Review: Reading for Weaknesses",
      summary: "Chapters 1-3: taint analysis by hand, the sink-to-source strategy, proving exploitability, mapping attack surfaces, and scaling up with CodeQL, Semgrep, and variant analysis.",
      lessons: [
        {
          title: "Taint Analysis: Sources, Sinks, and Propagators",
          objective: "Trace attacker-controlled input from source to sink and explain taint propagation, propagators, and sanitizers.",
          hook: "A large number of vulnerabilities share one shape: attacker input flows to a dangerous function. Taint analysis is how you follow that flow.",
          paragraphs: [
            "Taint analysis (source-and-sink analysis) tracks input through a program. A source is a function that retrieves attacker-controlled input; a sink is a dangerous function that corrupts memory or executes commands if its inputs are controlled. When a source writes to a variable, that variable is tainted; if it modifies others, they become tainted too - taint propagation. In theory, analyzing every path from sources to sinks covers every attack vector. In practice, paths explode exponentially as programs grow.",
            "The chapter's worked example is a toy TCP server: recv() reads messages into a buffer (source), and memcpy copies them into a 128-byte final buffer whose offset grows unbounded (sink). Sending 1,024 bytes causes a segmentation fault; in GDB the backtrace shows return addresses overwritten with 0x41414141 - a classic exploitable overflow. Compiling with -fstack-protector adds a stack canary that trips 'stack smashing detected' instead.",
            "Two subtleties make manual review irreplaceable: propagators (recv taints the buffer argument, not just its return value - you must know which functions modify arguments) and sanitizers (bounds checks before memcpy, which can be written several different ways, none capturable by one rule).",
          ],
          bullets: [
            "Source: function retrieving attacker input (recv). Sink: dangerous function (memcpy)",
            "Taint propagates through variables - and through functions that write to arguments",
            "Sanitizers/validators break the flow; path explosion bounds full-path analysis",
            "A source is a function that retrieves attacker-controlled input; a sink is a dangerous function that corrupts memory or executes commands if its inputs are controlled.",
            "When a source writes to a variable, that variable is tainted; if it modifies others, they become tainted too - taint propagation.",
            "Sending 1,024 bytes causes a segmentation fault; in GDB the backtrace shows return addresses overwritten with 0x41414141 - a classic exploitable overflow.",
          ],
          steps: [
            {
              title: "Annotate a small app",
              detail: "Mark request parameters as sources, SQL or file calls as sinks, and string concatenation as a propagator.",
            },
            {
              title: "Trace one flow by hand",
              detail: "Follow a parameter from the route handler to the sink. Write down every function and transformation it passes through.",
            },
            {
              title: "Confirm with a rule",
              detail: "Write a Semgrep taint rule for the same source and sink. Run it and check it finds your hand-traced flow.",
            },
          ],
          takeaway: "Find the source, find the sink, then trace the tainted variables between them - knowing that propagators and sanitizers are why automation never fully replaces review.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "buf",
                from: "src",
                label: "taints",
              },
              {
                to: "snk",
                from: "buf",
                label: "flows to",
              },
              {
                to: "crash",
                from: "snk",
                label: "unbounded copy",
              },
            ],
            nodes: [
              {
                id: "src",
                label: "recv() source",
                emphasis: false,
              },
              {
                id: "buf",
                label: "buffer + offset (tainted)",
                emphasis: false,
              },
              {
                id: "snk",
                label: "memcpy() sink",
                emphasis: true,
              },
              {
                id: "crash",
                label: "overwrite / crash",
                emphasis: false,
              },
            ],
            title: "A buffer overflow as a taint flow",
          },
          quiz: {
            question: "In the TCP server example, which call is the sink?",
            options: [
              "recv(), because it accepts network data",
              "memcpy(), because it copies tainted bytes into a fixed buffer",
              "printf(), because it prints to stdout",
              "listen(), because it opens the port",
            ],
            correctIndex: 1,
            explanation: "The source is recv(); memcpy at line 20 is the dangerous function whose destination can be driven past the 128-byte buffer - the GDB backtrace confirms the crash happens inside memcpy.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Taint Analysis: Sources, Sinks, and Propagators”?",
              options: [
                "Source: function retrieving attacker input (recv). Sink: dangerous function (memcpy)",
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Source: function retrieving attacker input (recv). Sink: dangerous function (memcpy)”",
            },
            {
              question: "Which statement best explains “Taint propagation”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "Once a source taints a variable, every later variable modified from it is tainted too - the chain continues until a sanitizer or sink.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Once a source taints a variable, every later variable modified from it is tainted too - the chain continues until a sanitizer or sink.”",
            },
            {
              question: "Which of these is a hands-on step in “Taint Analysis: Sources, Sinks, and Propagators”?",
              options: [
                "Run and minimize",
                "Deduplicate crashes",
                "Handle state",
                "Annotate a small app",
              ],
              correctIndex: 3,
              explanation: "“Annotate a small app” is part of this lesson's sequence: Mark request parameters as sources, SQL or file calls as sinks, and string concatenation as a propagator.",
            },
            {
              question: "What does the hands-on step “Trace one flow by hand” involve?",
              options: [
                "Follow a parameter from the route handler to the sink. Write down every function and transformation it passes through.",
                "Release the advisory after the fix or agreed deadline. Include mitigation guidance and credit the reporter.",
                "Label the bug as memory corruption, injection, or logic error. Point to the exact line and the missing check.",
                "Replace the copy with a bounded operation and rerun the same input. Confirm the crash is gone and normal input still works.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Trace one flow by hand” as: Follow a parameter from the route handler to the sink. Write down every function and transformation it passes through.",
            },
          ],
          flashcards: [
            {
              front: "Propagator in taint analysis",
              back: "A function that modifies its arguments (like recv writing into its buffer parameter), so taint spreads beyond simple return-value assignments.",
            },
            {
              front: "Taint propagation",
              back: "Once a source taints a variable, every later variable modified from it is tainted too - the chain continues until a sanitizer or sink.",
            },
            {
              front: "How do you trace one flow by hand?",
              back: "Follow a parameter from the route handler to the sink. Write down every function and transformation it passes through.",
            },
            {
              front: "How do you confirm with a rule?",
              back: "Write a Semgrep taint rule for the same source and sink. Run it and check it finds your hand-traced flow.",
            },
            {
              front: "How do you annotate a small app?",
              back: "Mark request parameters as sources, SQL or file calls as sinks, and string concatenation as a propagator.",
            },
          ],
          sourceRef: {
            label: "Chapter 1: Taint Analysis",
            pageStart: 31,
            pageEnd: 58,
            note: "Buffer overflow example, sources/sinks/propagators/sanitizers, taint propagation and path explosion.",
            sectionIndexes: [
              3,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Sink-to-Source: Solving the Maze Backwards",
          objective: "Justify starting analysis at dangerous sinks and working backward toward attacker-controlled sources.",
          hook: "A maze is easy from a bird's-eye view - especially when you start at the center. In code review, the center is the exploitable sink.",
          paragraphs: [
            "The obvious approach - start at input sources and follow every tainted path - favors completeness but drowns you: paths branch exponentially and most lead nowhere. Sink-to-source analysis favors selection. The book's analogy is a hedge maze seen from above: many entrances, many dead ends, but you only need one path to the center - here, one exploitable vulnerability. Starting at the center and working backward finds it faster.",
            "The chapter puts this into practice against dhcp6relay, a DHCPv6 relay server in the SONiC networking project, which the author uses to rediscover a known vulnerability from scratch. The workflow: pick the dangerous sinks first (the functions that would matter if controlled), trace backward to see whether attacker-controlled data can reach them, and ignore paths that cannot. This is the strategy the rest of Part I optimizes - manual in Chapter 1, automated with CodeQL and Semgrep in Chapter 3, and mirrored in the disassembler in Chapter 5.",
          ],
          bullets: [
            "Source-to-sink = completeness, exponential branching, many dead ends",
            "Sink-to-source = selection: start where the damage would happen",
            "One proven path from sink to attacker input is enough",
            "The obvious approach - start at input sources and follow every tainted path - favors completeness but drowns you: paths branch exponentially and most lead nowhere.",
            "The book's analogy is a hedge maze seen from above: many entrances, many dead ends, but you only need one path to the center - here, one exploitable vulnerability.",
            "The workflow: pick the dangerous sinks first (the functions that would matter if controlled), trace backward to see whether attacker-controlled data can reach them, and ignore paths that cannot.",
          ],
          steps: [
            {
              title: "Start at the sink",
              detail: "Pick a dangerous call in a small app and list every caller that can reach it. Mark which arguments are attacker-controlled.",
            },
            {
              title: "Walk backwards",
              detail: "Follow the argument up the call graph until you reach an HTTP parameter or file read. Note any validation on the way.",
            },
            {
              title: "Build the exploit",
              detail: "Craft the smallest request that reaches the sink with a harmless proof, such as reading a known file. Then patch the validation.",
            },
          ],
          takeaway: "Begin at the dangerous function and walk backward; you need only one reachable path to prove a vulnerability.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Start at the sink",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Walk backwards",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Build the exploit",
                emphasis: true,
              },
            ],
            title: "How Sink-to-Source: Solving the Maze Backwards works",
          },
          quiz: {
            question: "What is the main advantage of sink-to-source analysis over source-to-sink?",
            options: [
              "It examines every possible path through the program",
              "It bounds the search to paths that could actually reach a dangerous function",
              "It eliminates the need to identify what input is attacker-controlled",
              "It only works on programs under 100 lines of code",
            ],
            correctIndex: 1,
            explanation: "Following sources forward explodes into exponentially branching paths. Starting at exploitable sinks and working backward keeps only paths that matter - the bird's-eye maze view.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Sink-to-Source: Solving the Maze Backwards”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Source-to-sink = completeness, exponential branching, many dead ends",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Source-to-sink = completeness, exponential branching, many dead ends”",
            },
            {
              question: "Which statement best explains “Sink-to-source strategy”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Start at dangerous functions (sinks) and trace backward to attacker-controlled inputs, rather than following every path forward from sources.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Start at dangerous functions (sinks) and trace backward to attacker-controlled inputs, rather than following every path forward from sources.”",
            },
            {
              question: "Which of these is a hands-on step in “Sink-to-Source: Solving the Maze Backwards”?",
              options: [
                "Trigger a real bug",
                "Define success",
                "Map the assets",
                "Start at the sink",
              ],
              correctIndex: 3,
              explanation: "“Start at the sink” is part of this lesson's sequence: Pick a dangerous call in a small app and list every caller that can reach it. Mark which arguments are attacker-controlled.",
            },
            {
              question: "What does the hands-on step “Walk backwards” involve?",
              options: [
                "Follow the argument up the call graph until you reach an HTTP parameter or file read. Note any validation on the way.",
                "Agree on a disclosure date and a status update cadence. Document what happens if the deadline passes without a fix.",
                "Find the security contact and send a concise report with a private reproduction. Record the date and response.",
                "Include affected versions, root cause, impact, reproduction steps, and a suggested fix. Remove unnecessary exploit detail.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Walk backwards” as: Follow the argument up the call graph until you reach an HTTP parameter or file read. Note any validation on the way.",
            },
          ],
          flashcards: [
            {
              front: "dhcp6relay case study",
              back: "A DHCPv6 relay server in SONiC used to demonstrate rediscovering a disclosed vulnerability with the sink-to-source workflow.",
            },
            {
              front: "Sink-to-source strategy",
              back: "Start at dangerous functions (sinks) and trace backward to attacker-controlled inputs, rather than following every path forward from sources.",
            },
            {
              front: "How do you build the exploit?",
              back: "Craft the smallest request that reaches the sink with a harmless proof, such as reading a known file. Then patch the validation.",
            },
            {
              front: "How do you start at the sink?",
              back: "Pick a dangerous call in a small app and list every caller that can reach it. Mark which arguments are attacker-controlled.",
            },
            {
              front: "How do you walk backwards?",
              back: "Follow the argument up the call graph until you reach an HTTP parameter or file read. Note any validation on the way.",
            },
          ],
          sourceRef: {
            label: "Chapter 1: Taint Analysis",
            pageStart: 31,
            pageEnd: 58,
            note: "Sink-to-source analysis strategy and the dhcp6relay walkthrough.",
            sectionIndexes: [
              3,
            ],
          },
          estimatedMinutes: 3,
        },
        {
          title: "From Suspicious to Exploitable",
          objective: "Apply the filtering pipeline that turns a suspicious sink into a proven, reportable vulnerability.",
          hook: "Not every dangerous call is a vulnerability. The chapter's pipeline filters suspicion down to proof: sink, source, reachability, trigger.",
          paragraphs: [
            "The first filter is sink selection: prioritize the vulnerable sinks that matter, above all memory corruption classes - when code makes unintended changes to memory or writes beyond buffers. The second is confirming exploitability: does the program's own logic let the dangerous path execute? The third is identifying an attacker-controlled source: in dhcp6relay, the author verifies that option->option_length reaches the memcpy only after ntohs(option->option_code) checks pass, so the length really is attacker-set.",
            "Next, confirm the attack surface is reachable - the path must be live in a realistic configuration - and then test the exploit end to end. The book is explicit that this is where many researchers stop short: you build a minimal environment (a Dockerfile pinning sonic-buildimage at a specific commit, building dhcp6relay with debug flags), run exploit.py (packing AAAA padding and a 60,000-byte overflow payload into a DHCPv6 RELAY_REPL message), and watch the Segmentation fault under GDB. PoC || GTFO: a demonstrated, controllable crash - not a full ROP chain - is what earns a response from developers.",
          ],
          bullets: [
            "Filter 1: choose memory-corruption sinks worth the effort",
            "Filter 2: prove the source value is attacker-controlled, not constant",
            "Filter 3: show reachability in a realistic configuration",
            "Then trigger it: reproducible environment + minimal PoC",
            "The first filter is sink selection: prioritize the vulnerable sinks that matter, above all memory corruption classes - when code makes unintended changes to memory or writes beyond buffers.",
            "The third is identifying an attacker-controlled source: in dhcp6relay, the author verifies that option->option_length reaches the memcpy only after ntohs(option->option_code) checks pass, so the length really is attacker-set.",
          ],
          steps: [
            {
              title: "Write a minimal PoC",
              detail: "Turn the suspicious path into a repeatable request or input file. Remove everything not needed to trigger it.",
            },
            {
              title: "Prove impact",
              detail: "In the lab, demonstrate a concrete effect such as reading a protected file or executing a benign command. Capture the output.",
            },
            {
              title: "Fix the cause",
              detail: "Patch the missing validation, not just the exact payload. Rerun the PoC and a variant to confirm both are blocked.",
            },
          ],
          takeaway: "A finding becomes a vulnerability only when you've shown a controlled input reaches a dangerous sink through a live path - and reproduced the crash.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "ctrl",
                from: "sink",
                label: "trace back",
              },
              {
                to: "reach",
                from: "ctrl",
                label: "yes",
              },
              {
                to: "poc",
                from: "reach",
                label: "trigger",
              },
            ],
            nodes: [
              {
                id: "sink",
                label: "Dangerous sink",
                emphasis: false,
              },
              {
                id: "ctrl",
                label: "Attacker-controlled?",
                emphasis: true,
              },
              {
                id: "reach",
                label: "Reachable path?",
                emphasis: true,
              },
              {
                id: "poc",
                label: "Reproduced PoC",
                emphasis: true,
              },
            ],
            title: "Filtering pipeline: suspicion to proof",
          },
          quiz: {
            question: "You found a memcpy with attacker data but no working crash. What does the book's standard require before calling it a vulnerability?",
            options: [
              "A CVE number must already have been assigned",
              "A full ROP exploit achieving arbitrary code execution",
              "A proof of concept showing controllable memory corruption on a working build",
              "A disassembly listing of the vulnerable function",
            ],
            correctIndex: 2,
            explanation: "Demonstrating controllable memory corruption - a triggering PoC - is sufficient for vulnerability research and typically enough for developers; exploit development is a separate discipline.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “From Suspicious to Exploitable”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Filter 1: choose memory-corruption sinks worth the effort",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Filter 1: choose memory-corruption sinks worth the effort”",
            },
            {
              question: "Which statement best explains “Confirming an attacker-controlled source”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
                "Verify the value reaching the sink actually derives from attacker input (e.g., option_length after ntohs checks), not a constant or sanitized path.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Verify the value reaching the sink actually derives from attacker input (e.g., option_length after ntohs checks), not a constant or sanitized path.”",
            },
            {
              question: "Which of these is a hands-on step in “From Suspicious to Exploitable”?",
              options: [
                "Write rules of engagement",
                "Merge the evidence",
                "Run all three lenses",
                "Write a minimal PoC",
              ],
              correctIndex: 3,
              explanation: "“Write a minimal PoC” is part of this lesson's sequence: Turn the suspicious path into a repeatable request or input file. Remove everything not needed to trigger it.",
            },
            {
              question: "What does the hands-on step “Prove impact” involve?",
              options: [
                "In the lab, demonstrate a concrete effect such as reading a protected file or executing a benign command. Capture the output.",
                "Pick the target with the best total and write one paragraph explaining why the others lost.",
                "Rate three programs from 1-5 on familiarity, ease of setup, and potential impact. Put the scores in a table.",
                "State the most likely vulnerability class and the input path you will test first. Keep it falsifiable.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Prove impact” as: In the lab, demonstrate a concrete effect such as reading a protected file or executing a benign command. Capture the output.",
            },
          ],
          flashcards: [
            {
              front: "Confirming an attacker-controlled source",
              back: "Verify the value reaching the sink actually derives from attacker input (e.g., option_length after ntohs checks), not a constant or sanitized path.",
            },
            {
              front: "Why pin the build environment?",
              back: "A container with exact commits and debug flags makes the PoC reproducible for the developer - their first job is reproducing your report.",
            },
            {
              front: "How do you fix the cause?",
              back: "Patch the missing validation, not just the exact payload. Rerun the PoC and a variant to confirm both are blocked.",
            },
            {
              front: "How do you prove impact?",
              back: "In the lab, demonstrate a concrete effect such as reading a protected file or executing a benign command. Capture the output.",
            },
            {
              front: "How do you write a minimal PoC?",
              back: "Turn the suspicious path into a repeatable request or input file. Remove everything not needed to trigger it.",
            },
          ],
          sourceRef: {
            label: "Chapter 1: Taint Analysis",
            pageStart: 31,
            pageEnd: 58,
            note: "Choosing sinks, filtering for exploitable scenarios, confirming reachability, and building the dhcp6relay PoC.",
            sectionIndexes: [
              3,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Mapping the Web Attack Surface",
          objective: "Identify web client and web server attack surfaces directly in source code.",
          hook: "Excel opens more than spreadsheets:.slk,.dbf,.dif files, COM interfaces, external data connections. Complexity is attack surface - and code review narrows the map.",
          paragraphs: [
            "As software grows, so does its attack surface - the number of potential entry points - and inexperienced researchers waste effort testing every one blindly. Code review replaces brute force with evidence: instead of dodging rate limits to enumerate routes, read the routing code. The chapter surveys the internet-facing surface, starting with web clients.",
            "A client that fetches web data dangerously can be exploited depending on how much of the URL it controls: the Nintendo Switch fetched a hardcoded captive-portal URL, so exploiting its WebKit bug (CVE-2016-4657) required a MITM position - worth it only because the payoff was a jailbreak. The author's Facebook Gameroom finding was richer: a manipulable fbgame:// custom URI scheme plus redirection gadgets on apps. facebook. com reached an outdated Chromium (CVE-2018-6056).",
            "Identification is pattern recognition in APIs: recognizing CefSharp. dll and ChromiumWebBrowser. Load() in decompiled C# instantly scopes the web client surface - and note these calls are closer to sinks than sources, a reminder that attack-surface mapping and taint analysis interlock. On the server side, frameworks and MVC structure the surface (model, controllers, routes), while unfamiliar or custom frameworks mean hand-rolled parsing of raw requests - the 'POST /items' listing.",
            "Nontraditional surfaces keep appearing: OAuth flows (GitHub's oauth WebAppFlow), WebRTC, real-time communication - each an entry point you can find by searching for its library calls.",
          ],
          bullets: [
            "Attack surface = entry points; code review narrows it faster than enumeration",
            "Web client risk scales with how much of the destination URL the attacker controls",
            "Recognize library APIs (CefSharp) to scope - they often sit near sinks",
            "Custom/unfamiliar frameworks hand-roll request parsing: a recurring weak spot",
            "Code review replaces brute force with evidence: instead of dodging rate limits to enumerate routes, read the routing code.",
            "The author's Facebook Gameroom finding was richer: a manipulable fbgame:// custom URI scheme plus redirection gadgets on apps. facebook. com reached an outdated Chromium (CVE-2018-6056).",
          ],
          steps: [
            {
              title: "Inventory the routes",
              detail: "Use the proxy and source to list every endpoint, method, parameter, and auth requirement. Put it in a spreadsheet.",
            },
            {
              title: "Mark the risky ones",
              detail: "Flag endpoints that touch files, SQL, redirects, or other users' objects. Prioritize those for manual testing.",
            },
            {
              title: "Test one object reference",
              detail: "Change an object id to another user's id and observe the response. Record whether authorization is enforced server-side.",
            },
          ],
          takeaway: "Search for web-related APIs and framework patterns in source to map client and server surfaces before you analyze a single request.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Inventory the routes",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Mark the risky ones",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Test one object reference",
                emphasis: true,
              },
            ],
            title: "How Mapping the Web Attack Surface works",
          },
          quiz: {
            question: "You find CefSharp.dll and a ChromiumWebBrowser.Load() call in a desktop app. What does that tell you?",
            options: [
              "The app contains an embedded browser - its web client code is a scannable attack surface",
              "The app is definitely vulnerable to cross-site scripting",
              "The app cannot make network requests without a proxy",
              "The app's database layer is implemented in C#",
            ],
            correctIndex: 0,
            explanation: "Recognizing popular libraries lets you scope the surface quickly: CefSharp wraps Chromium, so URL handling in the app is web client surface - and Load() is sink-adjacent code to trace.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Mapping the Web Attack Surface”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
                "Attack surface = entry points; code review narrows it faster than enumeration",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Attack surface = entry points; code review narrows it faster than enumeration”",
            },
            {
              question: "Which statement best explains “Web client vulnerability preconditions”?",
              options: [
                "Depends on parsing (JSON vs headless browser) and URL control: hardcoded URLs need MITM; attacker-controlled destinations open much larger exploitation.",
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Depends on parsing (JSON vs headless browser) and URL control: hardcoded URLs need MITM; attacker-controlled destinations open much larger exploitation.”",
            },
            {
              question: "Which of these is a hands-on step in “Mapping the Web Attack Surface”?",
              options: [
                "Set up the lab",
                "Choose and justify",
                "Score three targets",
                "Inventory the routes",
              ],
              correctIndex: 3,
              explanation: "“Inventory the routes” is part of this lesson's sequence: Use the proxy and source to list every endpoint, method, parameter, and auth requirement. Put it in a spreadsheet.",
            },
            {
              question: "What does the hands-on step “Mark the risky ones” involve?",
              options: [
                "Flag endpoints that touch files, SQL, redirects, or other users' objects. Prioritize those for manual testing.",
                "Scan the repository and classify each hit as true positive, false positive, or needs review. Fix one true positive.",
                "Target a dangerous pattern in your language, such as string-built SQL. Include a message and severity.",
                "Describe the vulnerable shape without naming the exact function, for example unchecked user input reaches a filesystem path.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Mark the risky ones” as: Flag endpoints that touch files, SQL, redirects, or other users' objects. Prioritize those for manual testing.",
            },
          ],
          flashcards: [
            {
              front: "Attack surface (definition)",
              back: "The number of potential entry points to exploit a vulnerability - it grows with features, complexity, and deprecated or rushed code.",
            },
            {
              front: "Web client vulnerability preconditions",
              back: "Depends on parsing (JSON vs headless browser) and URL control: hardcoded URLs need MITM; attacker-controlled destinations open much larger exploitation.",
            },
            {
              front: "How do you inventory the routes?",
              back: "Use the proxy and source to list every endpoint, method, parameter, and auth requirement. Put it in a spreadsheet.",
            },
            {
              front: "How do you mark the risky ones?",
              back: "Flag endpoints that touch files, SQL, redirects, or other users' objects. Prioritize those for manual testing.",
            },
            {
              front: "How do you test one object reference?",
              back: "Change an object id to another user's id and observe the response. Record whether authorization is enforced server-side.",
            },
          ],
          sourceRef: {
            label: "Chapter 2: Mapping Code to Attack Surface (part 1)",
            pageStart: 59,
            pageEnd: 82,
            note: "Web client/server vulnerabilities, identification via library APIs, MVC frameworks, and nontraditional surfaces.",
            sectionIndexes: [
              4,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Protocols, Data Structures, and Local Surfaces",
          objective: "Locate network-protocol, data-structure, and local IPC attack surfaces in source code.",
          hook: "Past the browser sits the rest of the stack: protocol handshakes, RFC-defined structs, IPC files, and hardcoded paths - all waiting to be read.",
          paragraphs: [
            "Network protocols expose layers of surface: application, transport, internet, link. Implementing a protocol means handling handshaking, session management, state management, error handling, encryption, and session termination - and developers usually roll their own implementations only when no library fits, which is exactly when the RFC's defined data structures become prime sinks.",
            "The book works examples in sonic-snmpagent (PDU header parsing straight from RFC 2741, byte-order handling) and iccpd (its own initialization code): struct layouts parsed from specs trust attacker bytes by design, so mismatched sizes and network-byte-order conversions are where memory corruption hides. Procedures - the state machines above - are a parallel class: discrepancies here usually lead to memory corruption or logic flaws.",
            "Local attack surface follows the same logic one layer down. Files used for inter-process communication invite surprises: the vim swap-file 'E325: ATTENTION' scenario shows how predictable temp paths collide with attacker-planted files. Hardcoded paths are a classic - Apport's check_lock used /var/lock/apport/lock, an attacker-writable location. Race conditions in file handling appear in Paramiko's _write_private_key_file.",
            "And file formats carry their own surface: child-format vulnerabilities occur because developers parse embedded formats they don't control, plus custom fields that few parsers handle consistently.",
          ],
          bullets: [
            "Protocol implementations = handshakes, state, crypto, teardown - each a procedure to audit",
            "RFC-defined structs (SNMP PDU) are trusted layouts: prime memory-corruption sinks",
            "Local surface: predictable IPC paths, hardcoded paths, file race conditions",
            "Child formats and custom fields multiply parsing risk inside parsers",
            "Files used for inter-process communication invite surprises: the vim swap-file 'E325: ATTENTION' scenario shows how predictable temp paths collide with attacker-planted files.",
            "And file formats carry their own surface: child-format vulnerabilities occur because developers parse embedded formats they don't control, plus custom fields that few parsers handle consistently.",
          ],
          steps: [
            {
              title: "Capture traffic",
              detail: "Run tcpdump or Wireshark against a lab service. Save a capture that includes a full request and response.",
            },
            {
              title: "Parse the framing",
              detail: "Identify the length field, message type, and payload in the binary protocol. Write a parser for one message.",
            },
            {
              title: "Fuzz a length field",
              detail: "Send a length larger and smaller than the actual body. Watch for crashes, hangs, or parser confusion and record the behavior.",
            },
          ],
          takeaway: "Follow the data: protocol layers, spec-defined structs, and local file interactions each define a distinct class of entry points to trace.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Capture traffic",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Parse the framing",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Fuzz a length field",
                emphasis: true,
              },
            ],
            title: "How Protocols, Data Structures, and Local Surfaces works",
          },
          quiz: {
            question: "Why are data structures defined by RFCs especially interesting to audit?",
            options: [
              "RFCs are always written in memory-safe languages",
              "Their exact binary layouts are parsed from untrusted input, so size and byte-order mistakes become memory corruption",
              "They are only used by hardware devices, which cannot be patched",
              "They eliminate the need for validation checks",
            ],
            correctIndex: 1,
            explanation: "sonic-snmpagent parses the RFC 2741 PDU header directly: a spec-defined layout trusting attacker bytes means field sizes, offsets, and network-byte-order conversions are where bugs concentrate.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Protocols, Data Structures, and Local Surfaces”?",
              options: [
                "Protocol implementations = handshakes, state, crypto, teardown - each a procedure to audit",
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Protocol implementations = handshakes, state, crypto, teardown - each a procedure to audit”",
            },
            {
              question: "Which statement best explains “Procedure-level bugs in protocol code”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "Handshaking, session/state management, error handling, encryption, teardown - discrepancies between spec and implementation cause corruption or logic flaws.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Handshaking, session/state management, error handling, encryption, teardown - discrepancies between spec and implementation cause corruption or logic flaws.”",
            },
            {
              question: "Which of these is a hands-on step in “Protocols, Data Structures, and Local Surfaces”?",
              options: [
                "Classify the root cause",
                "Fix and retest",
                "Trigger a real bug",
                "Capture traffic",
              ],
              correctIndex: 3,
              explanation: "“Capture traffic” is part of this lesson's sequence: Run tcpdump or Wireshark against a lab service. Save a capture that includes a full request and response.",
            },
            {
              question: "What does the hands-on step “Parse the framing” involve?",
              options: [
                "Identify the length field, message type, and payload in the binary protocol. Write a parser for one message.",
                "Run the target with a coverage build or AFL instrumentation. Identify the parser branches your inputs never reach.",
                "Use symbolic execution to find an input that reaches a target branch in a crackme. Confirm the solution dynamically.",
                "Add three valid inputs and one malformed input. Run a dumb fuzzer for a few minutes and collect crashes.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Parse the framing” as: Identify the length field, message type, and payload in the binary protocol. Write a parser for one message.",
            },
          ],
          flashcards: [
            {
              front: "Procedure-level bugs in protocol code",
              back: "Handshaking, session/state management, error handling, encryption, teardown - discrepancies between spec and implementation cause corruption or logic flaws.",
            },
            {
              front: "Local attack surface examples",
              back: "IPC file collisions (vim E325), hardcoded paths (Apport), and file race conditions (Paramiko's private-key write).",
            },
            {
              front: "How do you parse the framing?",
              back: "Identify the length field, message type, and payload in the binary protocol. Write a parser for one message.",
            },
            {
              front: "How do you capture traffic?",
              back: "Run tcpdump or Wireshark against a lab service. Save a capture that includes a full request and response.",
            },
            {
              front: "How do you fuzz a length field?",
              back: "Send a length larger and smaller than the actual body. Watch for crashes, hangs, or parser confusion and record the behavior.",
            },
          ],
          sourceRef: {
            label: "Chapter 2: Mapping Code to Attack Surface (part 1) → (part 2)",
            pageStart: 59,
            pageEnd: 92,
            note: "Network protocol layers, RFC data structures, procedures, local IPC, hardcoded paths, race conditions, and file formats.",
            sectionIndexes: [
              4,
              5,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Automating Review: CodeQL and Semgrep",
          objective: "Explain how ASTs power CodeQL and Semgrep for scalable source-code analysis.",
          hook: "Manual review doesn't scale across a million lines - but a query over an abstract syntax tree does.",
          paragraphs: [
            "Chapter 3 begins from abstract syntax trees: parsers reduce source to tree structures (Module, FunctionDef, Assign, BinOp...) that tools can reason about symbolically instead of textually. Static code analysis tools build on that. CodeQL treats your codebase as a queryable database: you write queries in a language full of convenient classes for common sources, sinks, and taint propagators, and the engine computes flows across files. The chapter's RemoteCommandInjection.",
            "ql example declares a RemoteCommandInjectionFlow::PathNode sink and lists concrete source-to-sink paths, and a VS Code extension manages the CLI and databases for interactive use.",
            "Semgrep takes the lighter-weight path: pattern-based rules that match code shapes quickly, with a.semgrepignore to keep noise down - the book's scans report '18/18 tasks' and '19/19 tasks' results against known CVE patterns. Both tools embody the chapter's central caveat: automation augments manual review but never replaces it. Taint propagators, custom wrappers, macros, and third-party libraries must be curated and customized per context - which is why the next lesson turns these tools toward variant analysis, where a rule derived from one real bug finds its siblings.",
          ],
          bullets: [
            "ASTs turn source into queryable structure (Module, FunctionDef, Assign...)",
            "CodeQL: query language with source/sink/propagator classes over a code database",
            "Semgrep: fast pattern rules with ignore files for curated scans",
            "Rules need per-context curation - automation augments, not replaces, review",
            "Chapter 3 begins from abstract syntax trees: parsers reduce source to tree structures (Module, FunctionDef, Assign, BinOp...) that tools can reason about symbolically instead of textually.",
            "Both tools embody the chapter's central caveat: automation augments manual review but never replaces it.",
          ],
          steps: [
            {
              title: "Write a Semgrep rule",
              detail: "Target a dangerous pattern in your language, such as string-built SQL. Include a message and severity.",
            },
            {
              title: "Run and triage",
              detail: "Scan the repository and classify each hit as true positive, false positive, or needs review. Fix one true positive.",
            },
            {
              title: "Write a CodeQL query",
              detail: "Express a source-to-sink taint flow for the same bug. Compare its results with your Semgrep rule.",
            },
          ],
          takeaway: "Encode your source-and-sink knowledge as queries or patterns once, then run it across whole repositories - and keep curating the rules.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "ast",
                from: "src",
                label: "parse",
              },
              {
                to: "rule",
                from: "ast",
                label: "evaluate",
              },
              {
                to: "find",
                from: "rule",
                label: "match",
              },
            ],
            nodes: [
              {
                id: "src",
                label: "Source code",
                emphasis: false,
              },
              {
                id: "ast",
                label: "AST / code database",
                emphasis: false,
              },
              {
                id: "rule",
                label: "Query or pattern rule",
                emphasis: true,
              },
              {
                id: "find",
                label: "Ranked findings",
                emphasis: false,
              },
            ],
            title: "From source code to findings",
          },
          quiz: {
            question: "What is CodeQL's core idea for finding vulnerabilities?",
            options: [
              "It brute-forces every input against a running binary",
              "It treats the codebase as data you can query for source-to-sink flows",
              "It decompiles binaries back into C source",
              "It replaces manual review with a single universal rule",
            ],
            correctIndex: 1,
            explanation: "CodeQL compiles code into a queryable database with classes for sources, sinks, and propagators, so a query like RemoteCommandInjection.ql computes flows across files.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Automating Review: CodeQL and Semgrep”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "ASTs turn source into queryable structure (Module, FunctionDef, Assign...)",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “ASTs turn source into queryable structure (Module, FunctionDef, Assign...)”",
            },
            {
              question: "Which statement best explains “Abstract syntax tree (AST)”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "A tree representation of source structure (functions, assignments, operators) that analysis tools traverse instead of raw text.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “A tree representation of source structure (functions, assignments, operators) that analysis tools traverse instead of raw text.”",
            },
            {
              question: "Which of these is a hands-on step in “Automating Review: CodeQL and Semgrep”?",
              options: [
                "Test one object reference",
                "Capture traffic",
                "Fuzz a length field",
                "Write a Semgrep rule",
              ],
              correctIndex: 3,
              explanation: "“Write a Semgrep rule” is part of this lesson's sequence: Target a dangerous pattern in your language, such as string-built SQL. Include a message and severity.",
            },
            {
              question: "What does the hands-on step “Run and triage” involve?",
              options: [
                "Scan the repository and classify each hit as true positive, false positive, or needs review. Fix one true positive.",
                "Describe the vulnerable shape without naming the exact function, for example unchecked user input reaches a filesystem path.",
                "Patch all confirmed variants with one shared helper, then add a test that would catch the pattern returning.",
                "Write a query or grep for the pattern and collect every candidate. Manually confirm which ones are reachable.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Run and triage” as: Scan the repository and classify each hit as true positive, false positive, or needs review. Fix one true positive.",
            },
          ],
          flashcards: [
            {
              front: "CodeQL vs Semgrep",
              back: "CodeQL: rich query language over a compiled code database, deep cross-file flows. Semgrep: fast pattern-based rules, easier to write and run.",
            },
            {
              front: "Abstract syntax tree (AST)",
              back: "A tree representation of source structure (functions, assignments, operators) that analysis tools traverse instead of raw text.",
            },
            {
              front: "How do you write a Semgrep rule?",
              back: "Target a dangerous pattern in your language, such as string-built SQL. Include a message and severity.",
            },
            {
              front: "How do you write a CodeQL query?",
              back: "Express a source-to-sink taint flow for the same bug. Compare its results with your Semgrep rule.",
            },
            {
              front: "How do you run and triage?",
              back: "Scan the repository and classify each hit as true positive, false positive, or needs review. Fix one true positive.",
            },
          ],
          sourceRef: {
            label: "Chapter 3: Automated Variant Analysis (part 1)",
            pageStart: 93,
            pageEnd: 118,
            note: "ASTs, CodeQL query language and taint tracking, Semgrep pattern rules.",
            sectionIndexes: [
              6,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Variant Analysis: When One Bug Means Many",
          objective: "Use a root cause and its patch to find sibling vulnerabilities across repositories.",
          hook: "A single fix can hide a family: Expat's doProlog flaw became CVE-2022-22822 through CVE-2022-22827 - six CVEs, one root cause.",
          paragraphs: [
            "Variant analysis asks: now that we know what one bug looks like, where else does that pattern live? It starts with root cause analysis. The book's example is Expat, where a single defective function (doProlog) produced a cascade of integer-overflow CVEs. The patch is your best teacher - it tells you exactly which values, functions, and checks were wrong - so you write a rule capturing that shape: CodeQL's IntegerOverflowFlow query or a Semgrep rule matching Id((\"REALLOC\"...)) call patterns with untrusted size arguments.",
            "Then you scale. Single-repository variant analysis runs the rule across the project and its history (the book's scans surface CVE-2021-46143 matches); multi-repository variant analysis takes the same rule to other projects that share the library or the coding pattern - the way one vulnerable parsing routine can ripple through every dependent. The lesson from Expat's well-documented remediation history is that patterns are portable: once you can describe the root cause precisely, finding its variants becomes mechanical - which is exactly the leverage Part I has been building toward.",
          ],
          bullets: [
            "Root cause first: the patch reveals the exact defective pattern",
            "Encode the pattern as a CodeQL or Semgrep rule",
            "Run it across the repo, its history, then across dependent repositories",
            "One root cause can yield a family of CVEs (Expat: six from one flaw)",
            "Variant analysis asks: now that we know what one bug looks like, where else does that pattern live?",
            "The book's example is Expat, where a single defective function (doProlog) produced a cascade of integer-overflow CVEs.",
          ],
          steps: [
            {
              title: "Abstract the bug pattern",
              detail: "Describe the vulnerable shape without naming the exact function, for example unchecked user input reaches a filesystem path.",
            },
            {
              title: "Search the codebase",
              detail: "Write a query or grep for the pattern and collect every candidate. Manually confirm which ones are reachable.",
            },
            {
              title: "Fix the family",
              detail: "Patch all confirmed variants with one shared helper, then add a test that would catch the pattern returning.",
            },
          ],
          takeaway: "Turn every fixed bug into a rule, then hunt that rule everywhere - variant analysis is how one discovery becomes many.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Abstract the bug pattern",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Search the codebase",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Fix the family",
                emphasis: true,
              },
            ],
            title: "How Variant Analysis: When One Bug Means Many works",
          },
          quiz: {
            question: "Your team patches an integer-overflow vulnerability. What is the highest-leverage next step?",
            options: [
              "Close the ticket and wait for the next fuzzing cycle",
              "Write an analysis rule encoding the pattern and scan sibling code and dependent projects",
              "Immediately request six separate CVE identifiers",
              "Rewrite the affected module in a memory-safe language",
            ],
            correctIndex: 1,
            explanation: "Variant analysis converts the root cause (revealed by the patch) into a reusable rule, then searches for siblings - the Expat case turned one flaw into six CVEs this way.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Variant Analysis: When One Bug Means Many”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Root cause first: the patch reveals the exact defective pattern",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Root cause first: the patch reveals the exact defective pattern”",
            },
            {
              question: "Which statement best explains “Variant analysis”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
                "After finding a vulnerability, systematically search for the same root-cause pattern in other code paths, repositories, and shared libraries.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “After finding a vulnerability, systematically search for the same root-cause pattern in other code paths, repositories, and shared libraries.”",
            },
            {
              question: "Which of these is a hands-on step in “Variant Analysis: When One Bug Means Many”?",
              options: [
                "Handle state",
                "Pick a new surface",
                "Contact the maintainer",
                "Abstract the bug pattern",
              ],
              correctIndex: 3,
              explanation: "“Abstract the bug pattern” is part of this lesson's sequence: Describe the vulnerable shape without naming the exact function, for example unchecked user input reaches a filesystem path.",
            },
            {
              question: "What does the hands-on step “Search the codebase” involve?",
              options: [
                "Write a query or grep for the pattern and collect every candidate. Manually confirm which ones are reachable.",
                "Follow a parameter from the route handler to the sink. Write down every function and transformation it passes through.",
                "Mark request parameters as sources, SQL or file calls as sinks, and string concatenation as a propagator.",
                "Write a Semgrep taint rule for the same source and sink. Run it and check it finds your hand-traced flow.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Search the codebase” as: Write a query or grep for the pattern and collect every candidate. Manually confirm which ones are reachable.",
            },
          ],
          flashcards: [
            {
              front: "Variant analysis",
              back: "After finding a vulnerability, systematically search for the same root-cause pattern in other code paths, repositories, and shared libraries.",
            },
            {
              front: "Root cause analysis's role",
              back: "Identify the exact lines and values that caused the bug; the fix teaches you the pattern to encode in CodeQL/Semgrep rules.",
            },
            {
              front: "How do you abstract the bug pattern?",
              back: "Describe the vulnerable shape without naming the exact function, for example unchecked user input reaches a filesystem path.",
            },
            {
              front: "How do you fix the family?",
              back: "Patch all confirmed variants with one shared helper, then add a test that would catch the pattern returning.",
            },
            {
              front: "How do you search the codebase?",
              back: "Write a query or grep for the pattern and collect every candidate. Manually confirm which ones are reachable.",
            },
          ],
          sourceRef: {
            label: "Chapter 3: Automated Variant Analysis (part 1) → (part 2)",
            pageStart: 93,
            pageEnd: 124,
            note: "Variant analysis, Expat root cause (CVE-2022-22822..22827), pattern matching rules, and multi-repository scaling.",
            sectionIndexes: [
              6,
              7,
            ],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Part II · Reverse Engineering: Mapping the Unknown",
      summary: "Chapters 4-6: triage binaries by type, find sources and sinks statically and dynamically, then combine coverage, emulation, and symbolic execution.",
      lessons: [
        {
          title: "Binary Taxonomy: Triage Before You Disassemble",
          objective: "Classify binaries as scripts, intermediate representations, or machine code and choose the right analysis approach.",
          hook: "Not all binaries are created - or rather, compiled - equal. Triage the type first, or you'll fight assembly that was never there.",
          paragraphs: [
            "The chapter's strategy is to understand the lay of the land before getting into the weeds: rather than dropping every file into Ghidra, sort it into three categories. Scripts (JavaScript, Python, Ruby) run in interpreters that may JIT-compile, and packaged executables may embed obfuscated or minified scripts - or just wrap source files with an embedded interpreter. The book's examples: a Node.",
            "js Electron app (DbGate), where source maps can unpack minified code back to near-original (plus beautifiers and a dangerous sink like handleRunMacro), and a Python PyInstaller game (Galaxy Attack) whose embedded modules can be listed and extracted.",
            "Intermediate representations - Java bytecode and. NET CIL assemblies - decompile remarkably well: with proper metadata you can retrieve near-original source, then simply do code review. Machine code (PE on Windows, ELF on Linux, Mach-O on macOS) is the classic disassembly case. Modern apps mix all three: WhatsApp, Slack, and Zoom ship executables containing Node. js scripts, WebAssembly, and CIL.",
            "The security boundaries differ by medium - Electron's old nodeIntegration setting turned an XSS into desktop RCE - and cross-interactions (a Node script instantiating WASM, CIL loading unmanaged libraries) mean your triage must keep the bird's-eye view. Packed binaries are the adversarial case: unpack first, analyze second.",
          ],
          bullets: [
            "Scripts: unpack/deobfuscate, then review source as usual",
            "Bytecode (CIL, JVM): decompile to near-source, then review",
            "Machine code (PE/ELF/Mach-O): the classic disassembly path",
            "Electron nodeIntegration history: sandbox escapes amplify web bugs to RCE",
            "The chapter's strategy is to understand the lay of the land before getting into the weeds: rather than dropping every file into Ghidra, sort it into three categories.",
            "NET CIL assemblies - decompile remarkably well: with proper metadata you can retrieve near-original source, then simply do code review.",
          ],
          steps: [
            {
              title: "Fingerprint the binary",
              detail: "Run file, strings, and checksec. Record architecture, packing, imports, and enabled mitigations.",
            },
            {
              title: "Classify the target",
              detail: "Decide whether it is a GUI app, a service, a driver, or a firmware image. Note the input path you can control.",
            },
            {
              title: "Choose a method",
              detail: "Pick static, dynamic, or hybrid analysis based on the mitigations and input surface. Write down why.",
            },
          ],
          takeaway: "Identify which of the three binary categories you're holding before choosing tools - the type dictates the technique.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "scr",
                from: "bin",
                label: "interpreter",
              },
              {
                to: "ir",
                from: "bin",
                label: "VM runtime",
              },
              {
                to: "mc",
                from: "bin",
                label: "native CPU",
              },
            ],
            nodes: [
              {
                id: "bin",
                label: "Binary",
                emphasis: true,
              },
              {
                id: "scr",
                label: "Scripts (JS/Python)",
                emphasis: false,
              },
              {
                id: "ir",
                label: "Bytecode (CIL/JVM)",
                emphasis: false,
              },
              {
                id: "mc",
                label: "Machine code (PE/ELF)",
                emphasis: false,
              },
            ],
            title: "Binary taxonomy",
          },
          quiz: {
            question: "Which binary type is most likely to decompile back to near-original source code?",
            options: [
              "A packed Windows executable",
              "Bytecode with metadata (.NET CIL or Java bytecode)",
              "A minified JavaScript bundle without source maps",
              "A stripped ELF binary",
            ],
            correctIndex: 1,
            explanation: "IR binaries carry rich metadata: with it you can recover near-original source and fall back to ordinary code review - the opposite of stripped machine code.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Binary Taxonomy: Triage Before You Disassemble”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
                "Scripts: unpack/deobfuscate, then review source as usual",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Scripts: unpack/deobfuscate, then review source as usual”",
            },
            {
              question: "Which statement best explains “Three binary categories for triage”?",
              options: [
                "Scripts (interpreters), intermediate representations (bytecode), and machine code (PE/ELF/Mach-O) - each needs a different toolchain.",
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Scripts (interpreters), intermediate representations (bytecode), and machine code (PE/ELF/Mach-O) - each needs a different toolchain.”",
            },
            {
              question: "Which of these is a hands-on step in “Binary Taxonomy: Triage Before You Disassemble”?",
              options: [
                "Write a harness",
                "Fix and verify",
                "Instrument the target",
                "Fingerprint the binary",
              ],
              correctIndex: 3,
              explanation: "“Fingerprint the binary” is part of this lesson's sequence: Run file, strings, and checksec. Record architecture, packing, imports, and enabled mitigations.",
            },
            {
              question: "What does the hands-on step “Classify the target” involve?",
              options: [
                "Decide whether it is a GUI app, a service, a driver, or a firmware image. Note the input path you can control.",
                "For a lab target, define scope, allowed techniques, time window, and emergency contact. Explicitly list out-of-scope hosts.",
                "List domains, ports, services, and user roles in scope. Mark which ones you may test destructively and which are read-only.",
                "Write what counts as a finding: reproducible impact, affected version, and evidence. Decide what you will not report.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Classify the target” as: Decide whether it is a GUI app, a service, a driver, or a firmware image. Note the input path you can control.",
            },
          ],
          flashcards: [
            {
              front: "Three binary categories for triage",
              back: "Scripts (interpreters), intermediate representations (bytecode), and machine code (PE/ELF/Mach-O) - each needs a different toolchain.",
            },
            {
              front: "Why Electron raised the stakes",
              back: "nodeIntegration let renderer JavaScript call Node APIs, turning a website XSS into full desktop code execution - web and native surfaces merged.",
            },
            {
              front: "How do you classify the target?",
              back: "Decide whether it is a GUI app, a service, a driver, or a firmware image. Note the input path you can control.",
            },
            {
              front: "How do you fingerprint the binary?",
              back: "Run file, strings, and checksec. Record architecture, packing, imports, and enabled mitigations.",
            },
            {
              front: "How do you choose a method?",
              back: "Pick static, dynamic, or hybrid analysis based on the mitigations and input surface. Write down why.",
            },
          ],
          sourceRef: {
            label: "Chapter 4: Binary Taxonomy (part 1) → (part 2)",
            pageStart: 125,
            pageEnd: 164,
            note: "Scripts, IRs, and machine code; Electron/PyInstaller unpacking, source maps, CLR and Java bytecode, packed binaries.",
            sectionIndexes: [
              8,
              9,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Static Analysis in Binaries: Strings to Pseudocode",
          objective: "Use strings, disassembly, and decompilation to find sources and sinks in a compiled binary.",
          hook: "Before you open a disassembler, run strings. In FreshTomato's httpd, four lines of output reveal system(), shell format strings, and CGI routes.",
          paragraphs: [
            "Chapter 5 applies prioritization to machine-code binaries using FreshTomato router firmware as its black-box target. Extraction itself is reconnaissance: binwalk unpacks the.trx image (with Sasquatch for SquashFS), and the first question is where the logic lives - /www holds only view files, so the self-contained httpd binary (custom routing hardcoded inside, thanks to device constraints) is the target. Then strings: seeing system, 'Content-Type: %s', and 'grep -ih \"%s\" $(ls -1rv %s %s.*)' immediately flags command-execution sinks, format strings, and routes - a shockingly effective first pass.",
            "Next comes Ghidra's CodeBrowser, which disassembles machine code to assembly and decompiles it to higher-level pseudocode. The Symbol Tree becomes your map: for large binaries, work backward from dangerous library calls - the same sink-to-source strategy from Chapter 1, now executed with an xrefs view instead of source code (the 'mashing X key' joke: bringing up all references to a function). Thunked functions like popen show wrappers around externals; response strings and error messages give contextual clues to locate request handlers.",
            "The chapter's discipline: approach from the black-box perspective first, then compare your findings against the actual open-source code to check your reasoning.",
          ],
          bullets: [
            "Extract firmware (binwalk/Sasquatch), then find the self-contained logic binary",
            "strings = cheap triage: sinks (system), format strings, routes",
            "Ghidra: disassemble → decompile to pseudocode; Symbol Tree for navigation",
            "Work backward from dangerous calls - xrefs are the sink-to-source view",
            "Chapter 5 applies prioritization to machine-code binaries using FreshTomato router firmware as its black-box target.",
            "Then strings: seeing system, 'Content-Type: %s', and 'grep -ih \"%s\" $(ls -1rv %s %s.*)' immediately flags command-execution sinks, format strings, and routes - a shockingly effective first pass.",
          ],
          steps: [
            {
              title: "Find the entry point",
              detail: "Open the binary in Ghidra, locate main or the service loop, and list the functions it calls.",
            },
            {
              title: "Reconstruct one structure",
              detail: "Identify a struct by how fields are accessed at fixed offsets. Define it in the decompiler and rename the fields.",
            },
            {
              title: "Trace user input",
              detail: "Follow a recv or read buffer into the parser. Mark the bounds checks that are present and the ones that are missing.",
            },
          ],
          takeaway: "Strings first, pseudocode second, and always trace from the dangerous call back toward input.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Find the entry point",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Reconstruct one structure",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Trace user input",
                emphasis: true,
              },
            ],
            title: "How Static Analysis in Binaries: Strings to Pseudocode works",
          },
          quiz: {
            question: "Why is running strings on httpd before opening Ghidra a good move?",
            options: [
              "strings decompiles the binary into C source",
              "It cheaply reveals sinks like system(), shell format strings, and route names for further investigation",
              "It bypasses the need to identify sources entirely",
              "It unpacks the SquashFS filesystem automatically",
            ],
            correctIndex: 1,
            explanation: "The strings output showed system, HTTP format strings, shell commands with %s, and CGI routes - enough to pinpoint areas for disassembly before spending time in the decompiler.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Static Analysis in Binaries: Strings to Pseudocode”?",
              options: [
                "Extract firmware (binwalk/Sasquatch), then find the self-contained logic binary",
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Extract firmware (binwalk/Sasquatch), then find the self-contained logic binary”",
            },
            {
              question: "Which statement best explains “Ghidra CodeBrowser”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "Disassembles machine code to assembly and decompiles to pseudocode, with a Symbol Tree for navigating functions and references (xrefs).",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Disassembles machine code to assembly and decompiles to pseudocode, with a Symbol Tree for navigating functions and references (xrefs).”",
            },
            {
              question: "Which of these is a hands-on step in “Static Analysis in Binaries: Strings to Pseudocode”?",
              options: [
                "Score three targets",
                "Write a hypothesis",
                "Annotate a small app",
                "Find the entry point",
              ],
              correctIndex: 3,
              explanation: "“Find the entry point” is part of this lesson's sequence: Open the binary in Ghidra, locate main or the service loop, and list the functions it calls.",
            },
            {
              question: "What does the hands-on step “Reconstruct one structure” involve?",
              options: [
                "Identify a struct by how fields are accessed at fixed offsets. Define it in the decompiler and rename the fields.",
                "Use the proxy and source to list every endpoint, method, parameter, and auth requirement. Put it in a spreadsheet.",
                "Identify the length field, message type, and payload in the binary protocol. Write a parser for one message.",
                "Run tcpdump or Wireshark against a lab service. Save a capture that includes a full request and response.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Reconstruct one structure” as: Identify a struct by how fields are accessed at fixed offsets. Define it in the decompiler and rename the fields.",
            },
          ],
          flashcards: [
            {
              front: "Sink-to-source in a disassembler",
              back: "Start from calls to dangerous functions (popen, system) and use cross-references to walk backward to the input handling that feeds them.",
            },
            {
              front: "Ghidra CodeBrowser",
              back: "Disassembles machine code to assembly and decompiles to pseudocode, with a Symbol Tree for navigating functions and references (xrefs).",
            },
            {
              front: "How do you find the entry point?",
              back: "Open the binary in Ghidra, locate main or the service loop, and list the functions it calls.",
            },
            {
              front: "How do you trace user input?",
              back: "Follow a recv or read buffer into the parser. Mark the bounds checks that are present and the ones that are missing.",
            },
            {
              front: "How do you reconstruct one structure?",
              back: "Identify a struct by how fields are accessed at fixed offsets. Define it in the decompiler and rename the fields.",
            },
          ],
          sourceRef: {
            label: "Chapter 5: Source and Sink Discovery",
            pageStart: 165,
            pageEnd: 190,
            note: "FreshTomato firmware triage, strings, Ghidra disassembly/decompilation, static analysis.",
            sectionIndexes: [
              10,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Dynamic Analysis: Tracing, Hooking, and Proving Exploitability",
          objective: "Trace library calls at runtime with strace/ltrace and Frida, then evaluate whether findings are exploitable.",
          hook: "Static analysis guesses at behavior. Dynamic analysis watches it happen - and lets you reach in and change it mid-flight.",
          paragraphs: [
            "Static analysis shows every instruction but can't tell which ones matter at runtime; dynamic analysis executes the target and observes. The book starts with tracing library calls: strace/ltrace on ImageMagick's delegate execution reveals ffmpeg being invoked with a constructed command string ('ffmpeg' -nostdin... -i '/tmp/magick-...'), turning an opaque binary into an observable command-construction surface. Higher-level events - debugging output, error messages across processes - add context that syscalls alone don't give.",
            "Then instrumentation: Frida scripts attach Interceptor. attach hooks to exported functions like system and popen, logging arguments, timestamps, and return values ('system(command=\"echo Hello, canary123\")', 'modified argument!' ). Crucially, a hook can modify arguments at runtime - demonstrating control, not just observation. The chapter closes by evaluating exploitability: analyze error paths (ImageMagick's ThrowMagickException arguments), plant canary strings (writing /tmp/hacked to prove a write primitive), and examine inter-process communication artifacts with tools like James Forshaw's OleViewDotNet.",
            "Each technique converts 'the binary does something interesting' into 'the attacker can drive it here'.",
          ],
          bullets: [
            "strace/ltrace: observe library and syscall behavior with real inputs",
            "Frida: hook system/popen, log arguments, and modify them live",
            "Higher-level events (debug/error logs) contextualize syscall traces",
            "Prove exploitability: error analysis, canary strings, IPC artifacts",
            "Static analysis shows every instruction but can't tell which ones matter at runtime; dynamic analysis executes the target and observes.",
            "Then instrumentation: Frida scripts attach Interceptor. attach hooks to exported functions like system and popen, logging arguments, timestamps, and return values ('system(command=\"echo Hello, canary123\")', 'modified argument!'",
          ],
          steps: [
            {
              title: "Break on input",
              detail: "Run the target under gdb and set a breakpoint on the read or recv call. Inspect the buffer before and after.",
            },
            {
              title: "Trace the parser",
              detail: "Single-step through the parsing function and record how the length and offsets are used. Note any unchecked arithmetic.",
            },
            {
              title: "Hook the function",
              detail: "Use Frida or an LD_PRELOAD shim to log arguments and return values. Confirm the vulnerable path is reachable from normal input.",
            },
          ],
          takeaway: "Watch the dangerous call fire, then prove you can influence it - observation becomes evidence.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Break on input",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Trace the parser",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Hook the function",
                emphasis: true,
              },
            ],
            title: "How Dynamic Analysis: Tracing, Hooking, and Proving Exploitability works",
          },
          quiz: {
            question: "What does hooking popen with Frida and modifying its argument demonstrate?",
            options: [
              "That the binary cannot be debugged with GDB",
              "Attacker control over the command-execution path - direct evidence of exploitability",
              "That static analysis is unnecessary for all future work",
              "That the binary is packed and must be unpacked first",
            ],
            correctIndex: 1,
            explanation: "Logging the argument shows the flow; changing it at runtime ('modified argument!') shows the value is attacker-influenceable - the difference between interesting and exploitable.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Dynamic Analysis: Tracing, Hooking, and Proving Exploitability”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "strace/ltrace: observe library and syscall behavior with real inputs",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “strace/ltrace: observe library and syscall behavior with real inputs”",
            },
            {
              question: "Which statement best explains “Frida instrumentation”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Runtime instrumentation framework: Interceptor.attach on exports like system/popen to log, trace, and modify arguments while the program runs.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Runtime instrumentation framework: Interceptor.attach on exports like system/popen to log, trace, and modify arguments while the program runs.”",
            },
            {
              question: "Which of these is a hands-on step in “Dynamic Analysis: Tracing, Hooking, and Proving Exploitability”?",
              options: [
                "Confirm with a rule",
                "Trace one flow by hand",
                "Build the exploit",
                "Break on input",
              ],
              correctIndex: 3,
              explanation: "“Break on input” is part of this lesson's sequence: Run the target under gdb and set a breakpoint on the read or recv call. Inspect the buffer before and after.",
            },
            {
              question: "What does the hands-on step “Trace the parser” involve?",
              options: [
                "Single-step through the parsing function and record how the length and offsets are used. Note any unchecked arithmetic.",
                "For a lab target, define scope, allowed techniques, time window, and emergency contact. Explicitly list out-of-scope hosts.",
                "List domains, ports, services, and user roles in scope. Mark which ones you may test destructively and which are read-only.",
                "Write what counts as a finding: reproducible impact, affected version, and evidence. Decide what you will not report.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Trace the parser” as: Single-step through the parsing function and record how the length and offsets are used. Note any unchecked arithmetic.",
            },
          ],
          flashcards: [
            {
              front: "Canary strings for exploitability",
              back: "Write a recognizable marker (e.g., /tmp/hacked) to prove a write primitive actually fires - turning a suspected sink into demonstrated control.",
            },
            {
              front: "Frida instrumentation",
              back: "Runtime instrumentation framework: Interceptor.attach on exports like system/popen to log, trace, and modify arguments while the program runs.",
            },
            {
              front: "How do you hook the function?",
              back: "Use Frida or an LD_PRELOAD shim to log arguments and return values. Confirm the vulnerable path is reachable from normal input.",
            },
            {
              front: "How do you trace the parser?",
              back: "Single-step through the parsing function and record how the length and offsets are used. Note any unchecked arithmetic.",
            },
            {
              front: "How do you break on input?",
              back: "Run the target under gdb and set a breakpoint on the read or recv call. Inspect the buffer before and after.",
            },
          ],
          sourceRef: {
            label: "Chapter 5: Source and Sink Discovery",
            pageStart: 165,
            pageEnd: 190,
            note: "Dynamic analysis: strace/ltrace, Frida hooking, higher-level events, and exploitability evaluation (errors, canaries, IPC artifacts).",
            sectionIndexes: [
              10,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Hybrid Analysis: Coverage, Emulation, Symbolic Execution",
          objective: "Combine code coverage, emulation, and symbolic execution to focus and automate reverse engineering.",
          hook: "Static sees everything but understands little; dynamic understands but only what you trigger. Hybrid analysis marries them.",
          paragraphs: [
            "The chapter's thesis: enrich dynamic instrumentation with static data. First, code coverage - in RE, the instructions actually executed during a run, not test-suite percentage. Collect it with DynamoRIO's drcov (a dynamic instrumentation framework that copies instructions into a manipulable code cache; Intel Pin and Frida Stalker are siblings), then visualize the hit blocks over Ghidra's listing with Lighthouse.",
            "Coverage immediately kills rabbit holes: for a web-server binary, highlight which basic blocks handle an HTTP request instead of guessing from response strings, and gather coverage first so static analysis can parse just the code that handled your input.",
            "Second, emulation: Qiling runs the FreshTomato httpd firmware binary on your host with its real filesystem context, letting you exercise request handlers you could never trigger on hardware - then hijack API calls and bind virtual paths to inject test data, with Light Keeper visualizing the new coverage. Third, symbolic execution with angr: instructions become VEX IR (IRSB), values become symbolic variables, and a solver finds the inputs satisfying path constraints - automating 'what input reaches this branch?' at scale.",
            "When the model of a library function is missing, you write SimProcedures to replace it (disable, or reimplement), keeping the exploration moving.",
          ],
          bullets: [
            "Coverage (DynamoRIO + Lighthouse): which code actually ran - focus static effort",
            "Emulation (Qiling): execute firmware binaries with real filesystem context",
            "Symbolic execution (angr): solve for inputs that reach target paths",
            "SimProcedures patch library-function gaps in the model",
            "Collect it with DynamoRIO's drcov (a dynamic instrumentation framework that copies instructions into a manipulable code cache; Intel Pin and Frida Stalker are siblings), then visualize the hit blocks over Ghidra's listing with Lighthouse.",
            "Third, symbolic execution with angr: instructions become VEX IR (IRSB), values become symbolic variables, and a solver finds the inputs satisfying path constraints - automating 'what input reaches this branch?'",
          ],
          steps: [
            {
              title: "Measure coverage",
              detail: "Run the target with a coverage build or AFL instrumentation. Identify the parser branches your inputs never reach.",
            },
            {
              title: "Emulate a function",
              detail: "Load the binary in angr or Qiling and call the parser with a controlled buffer. Observe the return value and memory writes.",
            },
            {
              title: "Solve a constraint",
              detail: "Use symbolic execution to find an input that reaches a target branch in a crackme. Confirm the solution dynamically.",
            },
          ],
          takeaway: "Let dynamic evidence - coverage, traces, solver-found inputs - tell static analysis exactly where to look.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "cov",
                from: "st",
                label: "guess paths",
              },
              {
                to: "st",
                from: "cov",
                label: "focus listing",
              },
              {
                to: "sym",
                from: "em",
                label: "seed constraints",
              },
              {
                to: "st",
                from: "sym",
                label: "inputs found",
              },
            ],
            nodes: [
              {
                id: "st",
                label: "Static: pseudocode + xrefs",
                emphasis: false,
              },
              {
                id: "cov",
                label: "Dynamic coverage",
                emphasis: true,
              },
              {
                id: "em",
                label: "Emulation / traces",
                emphasis: false,
              },
              {
                id: "sym",
                label: "Symbolic solving",
                emphasis: true,
              },
            ],
            title: "The hybrid analysis loop",
          },
          quiz: {
            question: "What is the primary value of code coverage in reverse engineering?",
            options: [
              "It replaces the need for a decompiler",
              "It shows which instructions actually executed, so static analysis can focus there",
              "It automatically exploits any crash it finds",
              "It decrypts packed binaries without unpacking",
            ],
            correctIndex: 1,
            explanation: "Coverage collected dynamically (drcov + Lighthouse) maps real execution onto the listing, saving you from chasing dead code and guessing at handlers.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Hybrid Analysis: Coverage, Emulation, Symbolic Execution”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Coverage (DynamoRIO + Lighthouse): which code actually ran - focus static effort",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Coverage (DynamoRIO + Lighthouse): which code actually ran - focus static effort”",
            },
            {
              question: "Which statement best explains “Qiling emulation”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
                "Runs a target binary (e.g., router httpd) on the host with its original filesystem, enabling requests and API-call hijacking you can't do on device.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Runs a target binary (e.g., router httpd) on the host with its original filesystem, enabling requests and API-call hijacking you can't do on device.”",
            },
            {
              question: "Which of these is a hands-on step in “Hybrid Analysis: Coverage, Emulation, Symbolic Execution”?",
              options: [
                "Test one object reference",
                "Capture traffic",
                "Fuzz a length field",
                "Measure coverage",
              ],
              correctIndex: 3,
              explanation: "“Measure coverage” is part of this lesson's sequence: Run the target with a coverage build or AFL instrumentation. Identify the parser branches your inputs never reach.",
            },
            {
              question: "What does the hands-on step “Emulate a function” involve?",
              options: [
                "Load the binary in angr or Qiling and call the parser with a controlled buffer. Observe the return value and memory writes.",
                "Replace the copy with a bounded operation and rerun the same input. Confirm the crash is gone and normal input still works.",
                "Write a small C program that copies input with strcpy into a fixed buffer. Feed it a long string under AddressSanitizer and capture the crash.",
                "For a lab target, define scope, allowed techniques, time window, and emergency contact. Explicitly list out-of-scope hosts.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Emulate a function” as: Load the binary in angr or Qiling and call the parser with a controlled buffer. Observe the return value and memory writes.",
            },
          ],
          flashcards: [
            {
              front: "Symbolic execution (anggr)",
              back: "Treats values as symbolic variables and solves path constraints to compute inputs that reach a given branch - automating input discovery.",
            },
            {
              front: "Qiling emulation",
              back: "Runs a target binary (e.g., router httpd) on the host with its original filesystem, enabling requests and API-call hijacking you can't do on device.",
            },
            {
              front: "How do you solve a constraint?",
              back: "Use symbolic execution to find an input that reaches a target branch in a crackme. Confirm the solution dynamically.",
            },
            {
              front: "How do you measure coverage?",
              back: "Run the target with a coverage build or AFL instrumentation. Identify the parser branches your inputs never reach.",
            },
            {
              front: "How do you emulate a function?",
              back: "Load the binary in angr or Qiling and call the parser with a controlled buffer. Observe the return value and memory writes.",
            },
          ],
          sourceRef: {
            label: "Chapter 6: Hybrid Binary Analysis",
            pageStart: 191,
            pageEnd: 220,
            note: "Code coverage with DynamoRIO/Lighthouse, Qiling emulation, angr symbolic analysis and SimProcedures.",
            sectionIndexes: [
              11,
            ],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Part III · Fuzzing and Beyond Day Zero",
      summary: "Chapters 7-10: black-box and coverage-guided fuzzing with AFL++, fuzzing every kind of target, then disclosing findings responsibly with a report and a CVE.",
      lessons: [
        {
          title: "Quick-and-Dirty Fuzzing",
          objective: "Classify fuzzers and bootstrap black-box fuzzing against a protocol and a file format.",
          hook: "Modern coverage-guided fuzzing is powerful - but the book starts you where every caveman started: with a corpus and zero setup.",
          paragraphs: [
            "Why fuzzing works at all: programs assume well-formed input, so invalid input trips paths developers never guarded. The chapter gives you a fuzzer taxonomy to navigate the tooling: by target information (protocol fuzzers must speak multistep conversations), by generation approach (mutation-based mutates an initial corpus; generation-based builds inputs from a predefined format), by input type, and by feedback loop (black-box fuzzers get none). Its advice is pragmatic: fuzz first, optimize later - get crashes flowing before reaching for harnesses.",
            "The hands-on path: boofuzz for black-box protocol fuzzing. You dissect the MQTT CONNECT and PUBLISH packets (bit fields, variable headers), define them in boofuzz's DSL, and fuzz NanoMQ - an AddressSanitizer report ('READ of size 1', shadow bytes) proves the approach on a real broker. For zero-setup file fuzzing, radamsa mutates seeds blindly - the book points it at libxls and at corpus-garbage outputs. You then analyze fuzz coverage with OSS-Fuzz's tooling, and bootstrap structured formats with FormatFuzzer: binary templates (PNG's.",
            "bt describing chunks and interlace enums) generate both parsers and mutators, converting your format knowledge into a fuzzer without writing one.",
          ],
          bullets: [
            "Fuzzer axes: target info, mutation vs generation, input type, feedback loop",
            "Fuzz first, optimize later - crashes beat perfect setup",
            "boofuzz: dissect protocol packets (MQTT CONNECT/PUBLISH) and fuzz NanoMQ",
            "radamsa for zero-setup mutation; FormatFuzzer templates for structured formats",
            "Why fuzzing works at all: programs assume well-formed input, so invalid input trips paths developers never guarded.",
            "Its advice is pragmatic: fuzz first, optimize later - get crashes flowing before reaching for harnesses.",
          ],
          steps: [
            {
              title: "Write a harness",
              detail: "Call the parser directly with a byte buffer instead of launching the whole program. Keep the harness deterministic.",
            },
            {
              title: "Seed the corpus",
              detail: "Add three valid inputs and one malformed input. Run a dumb fuzzer for a few minutes and collect crashes.",
            },
            {
              title: "Triage the first crash",
              detail: "Reproduce it, minimize the input, and get a stack trace. Decide whether it is a real memory-safety bug or a handled error.",
            },
          ],
          takeaway: "Start black-box with a corpus or a packet definition, get crashes, then invest in instrumentation and harnesses.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Write a harness",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Seed the corpus",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Triage the first crash",
                emphasis: true,
              },
            ],
            title: "How Quick-and-Dirty Fuzzing works",
          },
          quiz: {
            question: "What distinguishes a mutation-based fuzzer from a generation-based one?",
            options: [
              "Mutation-based derives new inputs by altering seeds; generation-based builds inputs from a format definition",
              "Mutation-based requires source code; generation-based does not",
              "Mutation-based uses coverage feedback; generation-based never executes the target",
              "They are two names for the same technique",
            ],
            correctIndex: 0,
            explanation: "The taxonomy is explicit: mutation-based generates inputs by mutating an initial corpus, generation-based constructs them from a predefined input format - and either may or may not use feedback.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Quick-and-Dirty Fuzzing”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
                "Fuzzer axes: target info, mutation vs generation, input type, feedback loop",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Fuzzer axes: target info, mutation vs generation, input type, feedback loop”",
            },
            {
              question: "Which statement best explains “boofuzz”?",
              options: [
                "Black-box network protocol fuzzer: you describe packets (fields, bit widths) and it mutates them - used against MQTT and NanoMQ in the book.",
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Black-box network protocol fuzzer: you describe packets (fields, bit widths) and it mutates them - used against MQTT and NanoMQ in the book.”",
            },
            {
              question: "Which of these is a hands-on step in “Quick-and-Dirty Fuzzing”?",
              options: [
                "Map the assets",
                "Write rules of engagement",
                "Merge the evidence",
                "Write a harness",
              ],
              correctIndex: 3,
              explanation: "“Write a harness” is part of this lesson's sequence: Call the parser directly with a byte buffer instead of launching the whole program. Keep the harness deterministic.",
            },
            {
              question: "What does the hands-on step “Seed the corpus” involve?",
              options: [
                "Add three valid inputs and one malformed input. Run a dumb fuzzer for a few minutes and collect crashes.",
                "Follow a parameter from the route handler to the sink. Write down every function and transformation it passes through.",
                "Mark request parameters as sources, SQL or file calls as sinks, and string concatenation as a propagator.",
                "Write a Semgrep taint rule for the same source and sink. Run it and check it finds your hand-traced flow.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Seed the corpus” as: Add three valid inputs and one malformed input. Run a dumb fuzzer for a few minutes and collect crashes.",
            },
          ],
          flashcards: [
            {
              front: "Feedback loop in fuzzing",
              back: "Whether the fuzzer learns from the target: none = black-box; coverage feedback = coverage-guided (Chapter 8's AFL++).",
            },
            {
              front: "boofuzz",
              back: "Black-box network protocol fuzzer: you describe packets (fields, bit widths) and it mutates them - used against MQTT and NanoMQ in the book.",
            },
            {
              front: "How do you seed the corpus?",
              back: "Add three valid inputs and one malformed input. Run a dumb fuzzer for a few minutes and collect crashes.",
            },
            {
              front: "How do you triage the first crash?",
              back: "Reproduce it, minimize the input, and get a stack trace. Decide whether it is a real memory-safety bug or a handled error.",
            },
            {
              front: "How do you write a harness?",
              back: "Call the parser directly with a byte buffer instead of launching the whole program. Keep the harness deterministic.",
            },
          ],
          sourceRef: {
            label: "Chapter 7: Quick and Dirty Fuzzing",
            pageStart: 221,
            pageEnd: 250,
            note: "Why fuzzing works, fuzzer taxonomy, boofuzz/MQTT, radamsa, OSS-Fuzz coverage, FormatFuzzer bootstrapping.",
            sectionIndexes: [
              12,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Coverage-Guided Fuzzing with AFL++",
          objective: "Explain how coverage feedback, harnesses, and fuzz blockers determine fuzzing effectiveness.",
          hook: "A black-box fuzzer can't know that flipping one interlace byte unlocks new code. A coverage-guided fuzzer discovers it on its own.",
          paragraphs: [
            "The PNG example makes the case: a parser branches on chunk type (IHDR, PLTE, IDAT...) and then on values like the interlace byte - black-box mutation has no idea those branches matter, but instrumented feedback keeps mutations that reach new instructions. Coverage even solves magic-byte gates: afl-fuzz learns tokens like 'IHDR' by observing which bit flips change execution paths. CRC checks remain true bottlenecks - identify them from the format spec or coverage data, then patch or bypass them carefully to avoid false positives.",
            "Then AFL++ in earnest: build it yourself, watch the status screen (stage progress, execs/sec, stability - keep stability above 80%), and write a harness - a wrapper isolating the interesting function (LLVMFuzzerTestOneInput for LibreDWG's dwgread path) so fuzzing skips uninteresting startup and runs thousands of iterations per second. Optimizations follow: patch validation checks (the CRC call site in decode_r2007), minimize the corpus so the fuzzer works from good seeds, fuzz in parallel, and measure with afl-cov.",
            "Finally, Fuzz Introspector visualizes coverage heat, ranks functions by complexity, and exposes fuzz blockers - like a bitsize check that silently rejects most mutations - so you know exactly what to fix next.",
          ],
          bullets: [
            "Coverage feedback keeps inputs that reach new paths; it also learns magic tokens",
            "Harnesses (LLVMFuzzerTestOneInput) skip dead time - speed is coverage",
            "Optimize: patch CRC-style blockers, minimize corpus, fuzz in parallel",
            "Fuzz Introspector: coverage heat, complexity ranking, blocker detection",
            "Coverage even solves magic-byte gates: afl-fuzz learns tokens like 'IHDR' by observing which bit flips change execution paths.",
            "Optimizations follow: patch validation checks (the CRC call site in decode_r2007), minimize the corpus so the fuzzer works from good seeds, fuzz in parallel, and measure with afl-cov.",
          ],
          steps: [
            {
              title: "Instrument the target",
              detail: "Build with AFL++ instrumentation and confirm the forkserver starts. Set a memory limit and a timeout.",
            },
            {
              title: "Run and minimize",
              detail: "Fuzz with your seed corpus until you collect crashes. Use afl-tmin on each crash to shrink it.",
            },
            {
              title: "Fix and verify",
              detail: "Patch the root cause, rebuild, and replay the minimized crash. Then run the corpus again to check for regressions.",
            },
          ],
          takeaway: "Maximize coverage per second: instrument, harness away the dead time, remove fuzz blockers, and let the status screen tell you what's working.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "mut",
                from: "seed",
                label: "queue",
              },
              {
                to: "run",
                from: "mut",
                label: "execute",
              },
              {
                to: "cov",
                from: "run",
                label: "feedback",
              },
              {
                to: "mut",
                from: "cov",
                label: "keep if new",
              },
            ],
            nodes: [
              {
                id: "seed",
                label: "Seed corpus",
                emphasis: false,
              },
              {
                id: "mut",
                label: "Mutate",
                emphasis: false,
              },
              {
                id: "run",
                label: "Run + instrument",
                emphasis: true,
              },
              {
                id: "cov",
                label: "New coverage?",
                emphasis: true,
              },
            ],
            title: "Coverage-guided fuzzing loop",
          },
          quiz: {
            question: "What does coverage feedback do in AFL++?",
            options: [
              "It automatically writes a harness for the target",
              "It keeps mutations that reach new program paths so they seed further mutations",
              "It patches all validation checks before fuzzing",
              "It converts the target into a generation-based fuzzer",
            ],
            correctIndex: 1,
            explanation: "The fuzzer instruments the target, records which paths each input reaches, and prioritizes inputs that expand coverage - that's how it discovers significant tokens like IHDR on its own.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Coverage-Guided Fuzzing with AFL++”?",
              options: [
                "Coverage feedback keeps inputs that reach new paths; it also learns magic tokens",
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Coverage feedback keeps inputs that reach new paths; it also learns magic tokens”",
            },
            {
              question: "Which statement best explains “Fuzzing harness”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "A custom wrapper that imports and executes a specific function or path of the target, skipping uninteresting work so iterations run at high speed.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “A custom wrapper that imports and executes a specific function or path of the target, skipping uninteresting work so iterations run at high speed.”",
            },
            {
              question: "Which of these is a hands-on step in “Coverage-Guided Fuzzing with AFL++”?",
              options: [
                "Trigger a real bug",
                "Define success",
                "Map the assets",
                "Instrument the target",
              ],
              correctIndex: 3,
              explanation: "“Instrument the target” is part of this lesson's sequence: Build with AFL++ instrumentation and confirm the forkserver starts. Set a memory limit and a timeout.",
            },
            {
              question: "What does the hands-on step “Run and minimize” involve?",
              options: [
                "Fuzz with your seed corpus until you collect crashes. Use afl-tmin on each crash to shrink it.",
                "Identify the length field, message type, and payload in the binary protocol. Write a parser for one message.",
                "Run tcpdump or Wireshark against a lab service. Save a capture that includes a full request and response.",
                "Send a length larger and smaller than the actual body. Watch for crashes, hangs, or parser confusion and record the behavior.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Run and minimize” as: Fuzz with your seed corpus until you collect crashes. Use afl-tmin on each crash to shrink it.",
            },
          ],
          flashcards: [
            {
              front: "Fuzz blocker",
              back: "A check (magic bytes, CRC, bitsize validation) that rejects most mutated inputs before they reach deep code - remove or satisfy it to raise coverage.",
            },
            {
              front: "Fuzzing harness",
              back: "A custom wrapper that imports and executes a specific function or path of the target, skipping uninteresting work so iterations run at high speed.",
            },
            {
              front: "How do you run and minimize?",
              back: "Fuzz with your seed corpus until you collect crashes. Use afl-tmin on each crash to shrink it.",
            },
            {
              front: "How do you fix and verify?",
              back: "Patch the root cause, rebuild, and replay the minimized crash. Then run the corpus again to check for regressions.",
            },
            {
              front: "How do you instrument the target?",
              back: "Build with AFL++ instrumentation and confirm the forkserver starts. Set a memory limit and a timeout.",
            },
          ],
          sourceRef: {
            label: "Chapter 8: Coverage-Guided Fuzzing",
            pageStart: 251,
            pageEnd: 276,
            note: "Coverage advantages, AFL++ workflow, harness writing, corpus minimization, afl-cov, and Fuzz Introspector.",
            sectionIndexes: [
              13,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Fuzzing Everything Else",
          objective: "Fuzz closed-source binaries, managed-memory languages, and structured formats with the right mode or tool.",
          hook: "Golang servers, Electron clients, Kotlin apps: not everything compiles to an instrumented ELF - and not every bug is memory corruption.",
          paragraphs: [
            "For closed-source binaries, coverage still matters - AFL++ gets it dynamically. QEMU mode uses user-space emulation to translate instructions for a single binary (the book fuzzes NConvert's TIFF parsing, where prior CVEs cluster; CMPLOG mode with -c logs comparison instructions to slip past magic-byte checks; stability above 80% means you're good). Frida mode (-O) injects afl-frida-trace.so and instruments via Frida Stalker at runtime - it works on real devices like Android, though it runs slower and gives GDB less symbol information; a Frida script even patches LibreDWG's bit_calc_CRC to sidestep the blocker.",
            "Managed-memory binaries need different bug expectations: Jazzer brings coverage-guided fuzzing to Java, finding not crashes but logic flaws - its SSRF finding (a crafted Base64 path making the target connect out) is reported via Jazzer. reportFindingFromHook. Go ships fuzzing built in, with testdata/fuzz corpora and failures written back for replay - the book fuzzes a domain-validation function until it fails.",
            "Finally, syntactic and semantic targets: non-binary formats like HTML/XML need dictionaries (a manual HTML tag list vs AFL++'s autodictionary), grammars (Grammar-Mutator for structured languages), and intermediate representations - the same format knowledge from Chapter 7, now guiding coverage-guided tools.",
          ],
          bullets: [
            "QEMU mode: emulate un-instrumented binaries; CMPLOG beats magic bytes",
            "Frida mode: runtime Stalker instrumentation, device-friendly, slower",
            "Jazzer (Java) and Go's native fuzzer find logic bugs, not just crashes",
            "Dictionaries, grammars, and IRs guide fuzzers over structured formats",
            "For closed-source binaries, coverage still matters - AFL++ gets it dynamically.",
            "Go ships fuzzing built in, with testdata/fuzz corpora and failures written back for replay - the book fuzzes a domain-validation function until it fails.",
          ],
          steps: [
            {
              title: "Pick a new surface",
              detail: "Choose an HTTP API, a file format, or a network protocol. Write a harness that feeds one input to one parser.",
            },
            {
              title: "Handle state",
              detail: "For stateful targets, reset the service between runs or model the protocol handshake in the harness.",
            },
            {
              title: "Deduplicate crashes",
              detail: "Group crashes by stack trace and root cause. Report unique bugs, not the number of crashing inputs.",
            },
          ],
          takeaway: "Match the tool to the target: emulation for binaries, language-native fuzzers for managed runtimes, dictionaries and grammars for formats.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Pick a new surface",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Handle state",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Deduplicate crashes",
                emphasis: true,
              },
            ],
            title: "How Fuzzing Everything Else works",
          },
          quiz: {
            question: "You must fuzz a closed-source Linux binary with no instrumentation. What does the book recommend?",
            options: [
              "Rewrite the binary from scratch in Rust",
              "AFL++ QEMU or Frida mode for binary-only coverage-guided fuzzing",
              "Skip fuzzing and use only manual code review",
              "Compile it with GCC instrumentation flags",
            ],
            correctIndex: 1,
            explanation: "Both modes add coverage without source: QEMU user-space emulation (with CMPLOG for magic bytes) and Frida's runtime Stalker injection - demonstrated on NConvert and LibreDWG.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Fuzzing Everything Else”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "QEMU mode: emulate un-instrumented binaries; CMPLOG beats magic bytes",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “QEMU mode: emulate un-instrumented binaries; CMPLOG beats magic bytes”",
            },
            {
              question: "Which statement best explains “Jazzer”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Coverage-guided Java fuzzer that reports findings like SSRF through hooks - it targets logic flaws in managed runtimes, not just memory corruption.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Coverage-guided Java fuzzer that reports findings like SSRF through hooks - it targets logic flaws in managed runtimes, not just memory corruption.”",
            },
            {
              question: "Which of these is a hands-on step in “Fuzzing Everything Else”?",
              options: [
                "Test one object reference",
                "Capture traffic",
                "Fuzz a length field",
                "Pick a new surface",
              ],
              correctIndex: 3,
              explanation: "“Pick a new surface” is part of this lesson's sequence: Choose an HTTP API, a file format, or a network protocol. Write a harness that feeds one input to one parser.",
            },
            {
              question: "What does the hands-on step “Handle state” involve?",
              options: [
                "For stateful targets, reset the service between runs or model the protocol handshake in the harness.",
                "Patch all confirmed variants with one shared helper, then add a test that would catch the pattern returning.",
                "Write a query or grep for the pattern and collect every candidate. Manually confirm which ones are reachable.",
                "Decide whether it is a GUI app, a service, a driver, or a firmware image. Note the input path you can control.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Handle state” as: For stateful targets, reset the service between runs or model the protocol handshake in the harness.",
            },
          ],
          flashcards: [
            {
              front: "Dictionaries vs grammars in fuzzing",
              back: "Dictionaries supply known tokens (HTML tags) for mutation; grammars (Grammar-Mutator) generate syntactically valid structures to go deeper.",
            },
            {
              front: "Jazzer",
              back: "Coverage-guided Java fuzzer that reports findings like SSRF through hooks - it targets logic flaws in managed runtimes, not just memory corruption.",
            },
            {
              front: "How do you pick a new surface?",
              back: "Choose an HTTP API, a file format, or a network protocol. Write a harness that feeds one input to one parser.",
            },
            {
              front: "How do you handle state?",
              back: "For stateful targets, reset the service between runs or model the protocol handshake in the harness.",
            },
            {
              front: "How do you deduplicate crashes?",
              back: "Group crashes by stack trace and root cause. Report unique bugs, not the number of crashing inputs.",
            },
          ],
          sourceRef: {
            label: "Chapter 9: Fuzzing Everything",
            pageStart: 277,
            pageEnd: 302,
            note: "QEMU and Frida modes, CMPLOG, Jazzer, Go fuzzing, dictionaries, grammars, and intermediate representations.",
            sectionIndexes: [
              14,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Disclosure Without Drama",
          objective: "Navigate coordinated vulnerability disclosure, bug bounties, and the legal and ethical lines around selling research.",
          hook: "Finding the bug is half the job. Getting it fixed - without getting sued or sidelined - is the other half.",
          paragraphs: [
            "Coordinated vulnerability disclosure (CVD, or responsible disclosure) gives the vendor time to fix before public disclosure. The book traces why it matters: reporting was dangerous for decades, driving research underground and fueling a murky zero-day market; the 2010s resurgence of bug bounties and vulnerability disclosure programs legitimized the work. National policies now exist (ENISA's frameworks, CISA's 2020 directive for federal agencies), but legal risk persists - research the target's published policy and your jurisdiction's laws before you start.",
            "Full disclosure remains a last resort when a vendor ignores you and the risk is severe: a breakdown all parties should avoid.",
            "Money complicates everything. Zero days are bought by third parties (governments, organizations, criminals), brokers (resellers), middlemen (bug-bounty platforms triaging payouts), and vendors themselves (bounties). Selling to third parties or brokers is ethically wrong and likely illegal - consider where a flaw will end up. Bug bounties tilt the economics toward legitimate payment, but read the terms: Microsoft's program requires confidentiality until the fix, with detailed disclosure allowed only 30 days after; demanding payment without an existing program is extortion.",
            "If you want the right to publish, report directly via CVD. On the practical side: security. txt (RFC 9116) at /. well-known/security. txt names the contact, GitHub's reporting features and SECURITY files cover open source, CERT/CC is the last resort - and always allow time for a human on the other end to read your report.",
          ],
          bullets: [
            "CVD: vendor fixes first, public disclosure after - policies and law vary by jurisdiction",
            "Who buys zero days: third parties, brokers, middlemen, vendors - selling to the first two is the red line",
            "Bug bounty terms restrict publication; no program + demanded payment = extortion",
            "Find contacts via security.txt (RFC 9116), SECURITY.md, or CERT/CC",
            "National policies now exist (ENISA's frameworks, CISA's 2020 directive for federal agencies), but legal risk persists - research the target's published policy and your jurisdiction's laws before you start.",
            "Full disclosure remains a last resort when a vendor ignores you and the risk is severe: a breakdown all parties should avoid.",
          ],
          steps: [
            {
              title: "Write the advisory",
              detail: "Include affected versions, root cause, impact, reproduction steps, and a suggested fix. Remove unnecessary exploit detail.",
            },
            {
              title: "Contact the maintainer",
              detail: "Find the security contact and send a concise report with a private reproduction. Record the date and response.",
            },
            {
              title: "Set a timeline",
              detail: "Agree on a disclosure date and a status update cadence. Document what happens if the deadline passes without a fix.",
            },
          ],
          takeaway: "Disclose to the right party, in writing, within policy - and never sell to third parties or brokers.",
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
            ],
            nodes: [
              {
                id: "step-1",
                label: "Write the advisory",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Contact the maintainer",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Set a timeline",
                emphasis: true,
              },
            ],
            title: "How Disclosure Without Drama works",
          },
          quiz: {
            question: "You find a vulnerability at a company with no bug bounty or disclosure program and demand payment before reporting it. How does the book characterize this?",
            options: [
              "Standard industry practice",
              "Unethical and potentially extortion - there is no pre-existing program to claim under",
              "A reasonable use of coordinated vulnerability disclosure",
              "Full disclosure, which is always acceptable",
            ],
            correctIndex: 1,
            explanation: "The book is blunt: demanding a reward without a pre-existing bug bounty or disclosure policy is unethical and can be considered extortion.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Disclosure Without Drama”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "CVD: vendor fixes first, public disclosure after - policies and law vary by jurisdiction",
                "Code review: source analysis that teaches root cause and taint analysis",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “CVD: vendor fixes first, public disclosure after - policies and law vary by jurisdiction”",
            },
            {
              question: "Which statement best explains “Coordinated Vulnerability Disclosure (CVD)”?",
              options: [
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
                "Researcher reports to the responsible party first; the vendor gets time to fix or mitigate before public disclosure, ideally under a published policy.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Researcher reports to the responsible party first; the vendor gets time to fix or mitigate before public disclosure, ideally under a published policy.”",
            },
            {
              question: "Which of these is a hands-on step in “Disclosure Without Drama”?",
              options: [
                "Confirm with a rule",
                "Trace one flow by hand",
                "Build the exploit",
                "Write the advisory",
              ],
              correctIndex: 3,
              explanation: "“Write the advisory” is part of this lesson's sequence: Include affected versions, root cause, impact, reproduction steps, and a suggested fix. Remove unnecessary exploit detail.",
            },
            {
              question: "What does the hands-on step “Contact the maintainer” involve?",
              options: [
                "Find the security contact and send a concise report with a private reproduction. Record the date and response.",
                "Label the bug as memory corruption, injection, or logic error. Point to the exact line and the missing check.",
                "Replace the copy with a bounded operation and rerun the same input. Confirm the crash is gone and normal input still works.",
                "Write a small C program that copies input with strcpy into a fixed buffer. Feed it a long string under AddressSanitizer and capture the crash.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Contact the maintainer” as: Find the security contact and send a concise report with a private reproduction. Record the date and response.",
            },
          ],
          flashcards: [
            {
              front: "security.txt (RFC 9116)",
              back: "A machine-readable file at /.well-known/security.txt listing an organization's vulnerability contacts, policy, and encryption keys.",
            },
            {
              front: "Coordinated Vulnerability Disclosure (CVD)",
              back: "Researcher reports to the responsible party first; the vendor gets time to fix or mitigate before public disclosure, ideally under a published policy.",
            },
            {
              front: "How do you write the advisory?",
              back: "Include affected versions, root cause, impact, reproduction steps, and a suggested fix. Remove unnecessary exploit detail.",
            },
            {
              front: "How do you contact the maintainer?",
              back: "Find the security contact and send a concise report with a private reproduction. Record the date and response.",
            },
            {
              front: "How do you set a timeline?",
              back: "Agree on a disclosure date and a status update cadence. Document what happens if the deadline passes without a fix.",
            },
          ],
          sourceRef: {
            label: "Chapter 10: Beyond Day Zero",
            pageStart: 303,
            pageEnd: 321,
            note: "CVD model, national policies, zero-day markets, bug bounty terms, and finding disclosure contacts.",
            sectionIndexes: [
              15,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Writing the Report, Getting the CVE",
          objective: "Structure a vulnerability report that developers can act on and request a CVE correctly.",
          hook: "Your report has one reader: a developer who has never seen your bug. Make reproduction their easiest task of the day.",
          paragraphs: [
            "The book dissects a real report (CVE-2021-33035, Apache OpenOffice Calc) into four sections. Summary: a title naming the software, the impact, and the cause; CVSS for triage; your contact details (reports land in ticketing systems); and two or three sentences of bottom-line-up-front. Reproduction steps: exact environment (Windows 10 build, AOO4110m), a readable Python PoC with comments, numbered steps, and a screen recording - and, in hindsight, fewer exploit details: ROP chains and ASLR/DEP talk distract developers whose job is just to reproduce.",
            "Root cause: the key lines of code (memcpy with a file-defined nLen into a sal_Int32), why they're unsafe, and a hint that other variants may follow - but leave mitigation-bypass fireworks for a blog post. Recommendations: speak the developer's language - 'review field sizes blindly trusted into fixed buffers,' not 'memory corruption primitives.'",
            "Then delivery. Find the right human: security.txt, the project's README/SECURITY file, GitHub's vulnerability reporting, or CERT/CC as last resort; follow up politely after a few weeks if silence persists - someone overworked may be maintaining the project alone. For the CVE: check whether one is already assigned (search NVD first), request through the appropriate CNA, and expect the benefits - a globally recognized registry entry, credit for your research, and vendor accountability. Examples of polished public reports live on HackerOne's Hacktivity and the Chromium bug tracker.",
          ],
          bullets: [
            "Report = Summary, Reproduction steps, Root cause, Recommendations",
            "Reproduction must be easy: pinned environment, readable PoC, numbered steps",
            "Keep exploit-dev detail out of the report; give developers actionable root cause",
            "Check for an existing CVE, then request via the right CNA",
            "The book dissects a real report (CVE-2021-33035, Apache OpenOffice Calc) into four sections.",
            "Root cause: the key lines of code (memcpy with a file-defined nLen into a sal_Int32), why they're unsafe, and a hint that other variants may follow - but leave mitigation-bypass fireworks for a blog post.",
          ],
          steps: [
            {
              title: "Score the issue",
              detail: "Build a CVSS vector from the actual attack path. Justify each metric with evidence from the lab.",
            },
            {
              title: "Submit the request",
              detail: "Fill in the CVE request form with vendor, product, versions, and a clear description. Attach the advisory.",
            },
            {
              title: "Publish responsibly",
              detail: "Release the advisory after the fix or agreed deadline. Include mitigation guidance and credit the reporter.",
            },
          ],
          takeaway: "Write for the maintainer who must reproduce and patch: clear title, exact steps, root cause lines, and developer-language fixes.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "repro",
                from: "sum",
                label: "what",
              },
              {
                to: "rc",
                from: "repro",
                label: "confirm",
              },
              {
                to: "fix",
                from: "rc",
                label: "explain",
              },
              {
                to: "cve",
                from: "fix",
                label: "send",
              },
            ],
            nodes: [
              {
                id: "sum",
                label: "Summary + title",
                emphasis: false,
              },
              {
                id: "repro",
                label: "Reproduction steps",
                emphasis: true,
              },
              {
                id: "rc",
                label: "Root cause",
                emphasis: true,
              },
              {
                id: "fix",
                label: "Recommendations",
                emphasis: false,
              },
              {
                id: "cve",
                label: "Disclose + CVE",
                emphasis: false,
              },
            ],
            title: "From finding to fixed",
          },
          quiz: {
            question: "What belongs in the Root Cause section of a report?",
            options: [
              "Your full ROP chain and mitigation bypasses",
              "The key lines of code and why they are unsafe, hinting at sibling variants",
              "A demand for the bounty amount you expect",
              "The vendor's entire commit history",
            ],
            correctIndex: 1,
            explanation: "Root cause saves the developer from debugging it themselves: cite the responsible lines, explain the unsafe assumption, and note similar patterns - exploit fireworks belong elsewhere.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Writing the Report, Getting the CVE”?",
              options: [
                "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
                "Pentest targets an instance; research targets the software product for everyone",
                "Code review: source analysis that teaches root cause and taint analysis",
                "Report = Summary, Reproduction steps, Root cause, Recommendations",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Report = Summary, Reproduction steps, Root cause, Recommendations”",
            },
            {
              question: "Which statement best explains “Four sections of a vulnerability report”?",
              options: [
                "Summary (title, version, impact, contact), Reproduction steps (env + PoC), Root cause (key code lines), Recommendations (developer-language fixes).",
                "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
                "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
                "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Summary (title, version, impact, contact), Reproduction steps (env + PoC), Root cause (key code lines), Recommendations (developer-language fixes).”",
            },
            {
              question: "Which of these is a hands-on step in “Writing the Report, Getting the CVE”?",
              options: [
                "Fuzz a length field",
                "Parse the framing",
                "Run and triage",
                "Score the issue",
              ],
              correctIndex: 3,
              explanation: "“Score the issue” is part of this lesson's sequence: Build a CVSS vector from the actual attack path. Justify each metric with evidence from the lab.",
            },
            {
              question: "What does the hands-on step “Submit the request” involve?",
              options: [
                "Fill in the CVE request form with vendor, product, versions, and a clear description. Attach the advisory.",
                "Write a small C program that copies input with strcpy into a fixed buffer. Feed it a long string under AddressSanitizer and capture the crash.",
                "For a lab target, define scope, allowed techniques, time window, and emergency contact. Explicitly list out-of-scope hosts.",
                "List domains, ports, services, and user roles in scope. Mark which ones you may test destructively and which are read-only.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Submit the request” as: Fill in the CVE request form with vendor, product, versions, and a clear description. Attach the advisory.",
            },
          ],
          flashcards: [
            {
              front: "Before requesting a CVE",
              back: "Check whether a record already exists (search NVD) and confirm the right CNA - vendor CNAs assign IDs for their own products.",
            },
            {
              front: "Four sections of a vulnerability report",
              back: "Summary (title, version, impact, contact), Reproduction steps (env + PoC), Root cause (key code lines), Recommendations (developer-language fixes).",
            },
            {
              front: "How do you score the issue?",
              back: "Build a CVSS vector from the actual attack path. Justify each metric with evidence from the lab.",
            },
            {
              front: "How do you submit the request?",
              back: "Fill in the CVE request form with vendor, product, versions, and a clear description. Attach the advisory.",
            },
            {
              front: "How do you publish responsibly?",
              back: "Release the advisory after the fix or agreed deadline. Include mitigation guidance and credit the reporter.",
            },
          ],
          sourceRef: {
            label: "Chapter 10: Beyond Day Zero",
            pageStart: 303,
            pageEnd: 321,
            note: "Writing vulnerability reports (summary, repro, root cause, recommendations) and the CVE assignment process.",
            sectionIndexes: [
              15,
            ],
          },
          estimatedMinutes: 4,
        },
      ],
    },
  ],
};
