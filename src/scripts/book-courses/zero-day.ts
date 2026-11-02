import type { DraftCourse } from "./types";

/**
 * "From Day Zero to Zero Day" by Eugene Lim (PDF, 321 pages).
 * Full-book distillation: Introduction + Chapters 0-10 → 4 modules / 20 lessons.
 * sourceRef section indexes refer to parseSections() output for this PDF:
 *  0 Opening p.6-14 · 1 Introduction p.15-20 · 2 Ch0 p.21-30 · 3 Ch1 p.31-58
 *  4 Ch2 part1 p.59-82 · 5 Ch2 part2 p.83-92 · 6 Ch3 part1 p.93-118
 *  7 Ch3 part2 p.119-124 · 8 Ch4 part1 p.125-154 · 9 Ch4 part2 p.155-164
 *  10 Ch5 p.165-190 · 11 Ch6 p.191-220 · 12 Ch7 p.221-250 · 13 Ch8 p.251-276
 *  14 Ch9 p.277-302 · 15 Ch10 p.303-321
 */

export const zeroDayCourse: DraftCourse = {
  title: "From Day Zero to Zero Day",
  description:
    "A full-book distillation of Eugene Lim's guide to zero-day vulnerability research: what counts as a vulnerability, the three disciplines of code review, reverse engineering, and fuzzing, and how to disclose what you find. 20 lessons covering every chapter.",
  category: "Security",
  level: "intermediate",
  coverEmoji: "🎯",
  tags: ["security", "vulnerability research", "fuzzing", "code review", "reverse engineering"],
  modules: [
    {
      title: "Ground Zero: What Zero-Day Research Is",
      summary:
        "Chapter 0 and the introduction: definitions, the difference from penetration testing, the three disciplines, and how to pick a target worth researching.",
      lessons: [
        {
          title: "What Counts as a Vulnerability",
          objective:
            "Distinguish a vulnerability from a bug and describe impact using the CIA triad and CVE records.",
          hook: "A router reports the wrong day of the week. Bug or vulnerability? The answer decides whether anyone will ever fix it.",
          paragraphs: [
            "The book anchors on NIST's definition: a vulnerability is a weakness in an information system, security procedures, internal controls, or implementation that could be exploited or triggered by a threat source. Two conditions must hold. First, there is a flaw in the design or implementation that makes the system behave insecurely. Second, a threat source must actually be able to trigger it. Miss the second condition and you have a bug, not a vulnerability.",
            "CVSS evaluates impact through the CIA triad: confidentiality (attacker reads data they should not), integrity (attacker modifies data they should not), and availability (attacker disrupts the system itself). These components frame how you communicate a finding. CVE identifiers, assigned by federated Numbering Authorities, reference disclosed vulnerabilities - but the book warns that not every vulnerability has a CVE and not every CVE is a real vulnerability. The disputed curl CVE-2020-19909 (a retry-delay integer overflow) and the Postgres SIGHUP CVE-2020-21469 both failed the security-boundary test and were amended or rejected by their projects.",
          ],
          bullets: [
            "CIA triad: confidentiality, integrity, availability - the lens for describing impact",
            "Bug vs vulnerability: can a threat source exploit it across a security boundary?",
            "CVEs are references, not verdicts - projects successfully dispute bogus ones",
          ],
          takeaway:
            "If a weakness cannot be triggered by anyone across a security boundary, it is a bug: log it, don't report it as a vulnerability.",
          diagram: {
            type: "process",
            title: "From weakness to vulnerability",
            nodes: [
              { id: "flaw", label: "Flaw in design or code", emphasis: false },
              { id: "trigger", label: "Triggerable by a threat source?", emphasis: true },
              { id: "boundary", label: "Crosses a security boundary?", emphasis: true },
              { id: "vuln", label: "Vulnerability (CIA impact)", emphasis: false },
            ],
            edges: [
              { from: "flaw", to: "trigger", label: "test" },
              { from: "trigger", to: "boundary", label: "yes" },
              { from: "boundary", to: "vuln", label: "yes" },
            ],
          },
          quiz: {
            question:
              "Which statement best separates a vulnerability from a bug?",
            options: [
              "The vulnerability appears in the CVE catalog and the bug does not",
              "A threat source can exploit it to cross a security boundary",
              "The vulnerability is exploitable only by the system's own administrators",
              "Bugs are always fixed, while vulnerabilities are always left open",
            ],
            correctIndex: 1,
            explanation:
              "NIST's definition requires exploitability by a threat source. The Postgres SIGHUP example fails this test: an attacker who already has superuser access can do worse without any 'exploit', so it never crossed a security boundary.",
          },
          flashcards: [
            {
              front: "NIST definition of a vulnerability",
              back: "A weakness in an information system, system security procedures, internal controls, or implementation that could be exploited or triggered by a threat source.",
            },
            {
              front: "CIA triad in CVSS impact terms",
              back: "Confidentiality (unauthorized read), integrity (unauthorized modify), availability (disrupt access to the system).",
            },
          ],
          sourceRef: {
            label: "Introduction – Chapter 0: Day Zero",
            pageStart: 15,
            pageEnd: 30,
            note:
              "NIST definition, CIA triad, bug vs vulnerability, and disputed CVE records for curl and Postgres.",
            sectionIndexes: [1, 2],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Vulnerability Research vs. Penetration Testing",
          objective:
            "Explain how vulnerability research differs from penetration testing in goals, targets, and technique.",
          hook: "A pentester finds an outdated server with a public exploit. A researcher finds a flaw no one has ever seen. Same tools, different game.",
          paragraphs: [
            "Penetration testing aims to find and exploit vulnerabilities in a particular system - Enterprise X's network, a specific web server - and those vulnerabilities are not necessarily new; a scanner plus a public exploit script is enough. Vulnerability research aims to discover vulnerabilities in software or hardware targets themselves. Find a new bug in a router and every network using that router is theoretically at risk, which is why the targets must be publicly available software, not one organization's private custom script.",
            "The disciplines also differ in depth. Penetration tests are often confined to black-box testing of external attack surfaces. Vulnerability research works white-box (full source) or gray-box (partial internals), taking an inside-out view with code review and reverse engineering to find deeper flaws. And research does not require exploitation: a proof of concept that triggers a buffer overflow is sufficient - developing a full exploit is a separate discipline, exploit development, often handled by a different team. For this book, the focus stays narrowly on vulnerability discovery.",
          ],
          bullets: [
            "Pentest targets an instance; research targets the software product for everyone",
            "Black-box outside-in vs white/gray-box inside-out analysis",
            "Discovery and exploit development are separate jobs - PoC is enough for research",
          ],
          takeaway:
            "Vulnerability research is systematic discovery against publicly available targets, and it stops at a triggering proof of concept.",
          diagram: null,
          quiz: {
            question:
              "During a penetration test you find a custom script that exists only on the client's server. Why is it out of scope for typical vulnerability research?",
            options: [
              "Custom scripts cannot contain exploitable vulnerabilities",
              "The target is not publicly available software that others could be exposed to",
              "Penetration tests always forbid reporting anything they find",
              "Vulnerability research only covers hardware targets",
            ],
            correctIndex: 1,
            explanation:
              "Research targets must be obtainable by others - open source or commercially available. A private script on one server exposes no wider population, so finding bugs in it is pentesting, not research.",
          },
          flashcards: [
            {
              front: "White-box vs gray-box vs black-box analysis",
              back: "White-box: full source knowledge. Gray-box: partial internals. Black-box: no internal knowledge, external surfaces only. Research favors the first two.",
            },
            {
              front: "Where does exploit development fit?",
              back: "It is a separate discipline from vulnerability discovery; research output is a triggering PoC, which may be passed to an exploit-development team.",
            },
          ],
          sourceRef: {
            label: "Chapter 0: Day Zero",
            pageStart: 21,
            pageEnd: 30,
            note:
              "Vulnerability research vs penetration testing: goals, public targets, and the discovery/exploit-development split.",
            sectionIndexes: [2],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Three Disciplines, One Workflow",
          objective:
            "Describe code review, reverse engineering, and fuzzing, and explain why the book teaches them in that order.",
          hook: "Magic trick or systematic process? The author's answer: the method behind zero-day hunting is learnable - there are three crafts behind it.",
          paragraphs: [
            "Code review analyzes source to find vulnerabilities, and the book starts here because it builds the foundations - root cause analysis and taint analysis - that later disciplines reuse. Understanding how the target works in source makes its behavior conceptually visible when you reverse engineer or fuzz it. It is also where decades-old vulnerable code hides: Log4j's JNDI injection (CVE-2021-44228) sat unnoticed since 2013, the liblzma backdoor rode distributions worldwide, and forked projects often fail to propagate patches upstream - the author found RCE in Apache OpenOffice that LibreOffice had already fixed.",
            "Reverse engineering picks up where code review leaves off: taking apart binaries to see their inner workings. It is like exploring a dark tunnel where treasures may hide at the next turn, and it defeats security-by-obscurity - the first researcher to properly reverse a neglected target often finds many flaws just beneath the surface. Fuzzing then automates input generation: early 'caveman' fuzzing just hammered targets, while modern coverage-guided fuzzing steers mutations with runtime feedback. The author's advice is to read in order - skipping straight to fuzzing without data-flow understanding wastes time fuzzing the wrong part of a target.",
          ],
          bullets: [
            "Code review: source analysis that teaches root cause and taint analysis",
            "Reverse engineering: recover behavior when source is absent or hidden",
            "Fuzzing: automated unexpected-input testing, now coverage-guided",
            "Read the disciplines in order - each one feeds the next",
          ],
          takeaway:
            "Code review teaches you how targets work, reverse engineering extends that to binaries, and fuzzing automates the search - in that order.",
          diagram: {
            type: "cycle",
            title: "The three disciplines reinforce each other",
            nodes: [
              { id: "cr", label: "Code review", emphasis: false },
              { id: "re", label: "Reverse engineering", emphasis: false },
              { id: "fz", label: "Fuzzing", emphasis: false },
              { id: "harness", label: "Better harnesses and rules", emphasis: true },
            ],
            edges: [
              { from: "cr", to: "re", label: "patterns carry over" },
              { from: "re", to: "fz", label: "targets identified" },
              { from: "fz", to: "cr", label: "crashes to triage" },
              { from: "fz", to: "harness", label: "feedback" },
            ],
          },
          quiz: {
            question:
              "Why does the book introduce code review before reverse engineering and fuzzing?",
            options: [
              "Because source code is always easier to obtain than binaries",
              "Because the foundations of root cause and taint analysis transfer to the later disciplines",
              "Because fuzzing cannot be performed without first writing documentation",
              "Because reverse engineering is no longer a relevant skill",
            ],
            correctIndex: 1,
            explanation:
              "The author states that understanding the target's data flows first prevents wasting time fuzzing the wrong part of a target; taint and root-cause skills are reused in every later chapter.",
          },
          flashcards: [
            {
              front: "Why 'security by obscurity' fails",
              back: "Neglected binaries accumulate unnoticed flaws; the first researcher to reverse them properly often finds many vulnerabilities just beneath the surface.",
            },
            {
              front: "Caveman vs modern fuzzing",
              back: "Caveman: point a fuzzer at a target and wait. Modern: coverage-guided mutations plus custom harnesses that target interesting or neglected code paths.",
            },
          ],
          sourceRef: {
            label: "Introduction – Chapter 0: Day Zero",
            pageStart: 15,
            pageEnd: 30,
            note:
              "The three disciplines (code review, reverse engineering, fuzzing), Log4j/liblzma examples, and the recommended reading order.",
            sectionIndexes: [1, 2],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Picking a Target: Familiarity, Availability, Impact",
          objective:
            "Apply the rule of three - familiarity, availability, and impact - to choose a research target.",
          hook: "The target you choose decides most of your odds. The book gives you a rule of three, borrowed from the CIA triad but with a new 'availability'.",
          paragraphs: [
            "Familiarity is how much you already know about the target: a language and framework you are comfortable with, a platform you understand (web app? native library? Windows APIs? client or server?), and any prior research - conference talks, whitepapers, write-ups - that speeds up your ramp. The book pushes back on avoiding well-researched targets: popular projects constantly change and add features, so don't give up before trying.",
            "Availability means how easy the target is to access and analyze: source on GitHub with trackable branches (beware scattered monorepos and private dependencies), a workable test environment - ideally containerized builds or documented setup with debug symbols - and accessible project owners with a security contact. The author quotes PoC || GTFO: what looks like a vulnerability in source may be mitigated by runtime checks, so validate while you review. Impact is who cares if you win: stars, forks, downloads, dependents. The tiny js-yaml package - 33 files, rarely updated - has 20,000+ dependents and 100 million downloads a week, so a bug there echoes everywhere.",
          ],
          bullets: [
            "Familiarity: language, platform, and prior research you can lean on",
            "Availability: obtainable source, buildable test env, reachable maintainers",
            "Impact: downstream dependents and downloads, not just stars",
            "Hunt on GitHub topics/trending and the ASF directory; skip end-of-life projects",
          ],
          takeaway:
            "Choose a target you can read, can build, and whose failure would matter - then verify your assumptions against a running instance.",
          diagram: {
            type: "hierarchy",
            title: "The rule of three for target selection",
            nodes: [
              { id: "t", label: "Research target", emphasis: true },
              { id: "f", label: "Familiarity", emphasis: false },
              { id: "a", label: "Availability", emphasis: false },
              { id: "i", label: "Impact", emphasis: false },
            ],
            edges: [
              { from: "t", to: "f", label: "can you read it?" },
              { from: "t", to: "a", label: "can you build it?" },
              { from: "t", to: "i", label: "does it matter?" },
            ],
          },
          quiz: {
            question:
              "A project has almost no stars but is the only known parser for a legacy format used by major software. Which factor makes it interesting?",
            options: [
              "Familiarity, because old code is always written in familiar languages",
              "Availability, because legacy projects are easy to build",
              "Impact, because dead-looking projects can carry hidden downstream importance",
              "None - dead projects should always be avoided",
            ],
            correctIndex: 2,
            explanation:
              "The book explicitly warns that a dead project could be the only known parsing library for a legacy format some major software depends on - impact isn't measured by stars alone.",
          },
          flashcards: [
            {
              front: "Rule of three for picking a target",
              back: "Familiarity (can you read it?), Availability (can you obtain, build, and test it, and reach owners?), Impact (would anyone care if it broke?).",
            },
            {
              front: "PoC || GTFO (in target selection)",
              back: "Always test against a working instance: what looks vulnerable in source may be mitigated by validation or runtime checks. Demonstrate exploitability.",
            },
          ],
          sourceRef: {
            label: "Chapter 0: Day Zero",
            pageStart: 21,
            pageEnd: 30,
            note:
              "Target selection: familiarity, availability, impact; where to explore projects (GitHub topics, ASF directory).",
            sectionIndexes: [2],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Part I · Code Review: Reading for Weaknesses",
      summary:
        "Chapters 1-3: taint analysis by hand, the sink-to-source strategy, proving exploitability, mapping attack surfaces, and scaling up with CodeQL, Semgrep, and variant analysis.",
      lessons: [
        {
          title: "Taint Analysis: Sources, Sinks, and Propagators",
          objective:
            "Trace attacker-controlled input from source to sink and explain taint propagation, propagators, and sanitizers.",
          hook: "A large number of vulnerabilities share one shape: attacker input flows to a dangerous function. Taint analysis is how you follow that flow.",
          paragraphs: [
            "Taint analysis (source-and-sink analysis) tracks input through a program. A source is a function that retrieves attacker-controlled input; a sink is a dangerous function that corrupts memory or executes commands if its inputs are controlled. When a source writes to a variable, that variable is tainted; if it modifies others, they become tainted too - taint propagation. In theory, analyzing every path from sources to sinks covers every attack vector. In practice, paths explode exponentially as programs grow.",
            "The chapter's worked example is a toy TCP server: recv() reads messages into a buffer (source), and memcpy copies them into a 128-byte final buffer whose offset grows unbounded (sink). Sending 1,024 bytes causes a segmentation fault; in GDB the backtrace shows return addresses overwritten with 0x41414141 - a classic exploitable overflow. Compiling with -fstack-protector adds a stack canary that trips 'stack smashing detected' instead. Two subtleties make manual review irreplaceable: propagators (recv taints the buffer argument, not just its return value - you must know which functions modify arguments) and sanitizers (bounds checks before memcpy, which can be written several different ways, none capturable by one rule).",
          ],
          bullets: [
            "Source: function retrieving attacker input (recv). Sink: dangerous function (memcpy)",
            "Taint propagates through variables - and through functions that write to arguments",
            "Sanitizers/validators break the flow; path explosion bounds full-path analysis",
          ],
          takeaway:
            "Find the source, find the sink, then trace the tainted variables between them - knowing that propagators and sanitizers are why automation never fully replaces review.",
          diagram: {
            type: "process",
            title: "A buffer overflow as a taint flow",
            nodes: [
              { id: "src", label: "recv() source", emphasis: false },
              { id: "buf", label: "buffer + offset (tainted)", emphasis: false },
              { id: "snk", label: "memcpy() sink", emphasis: true },
              { id: "crash", label: "overwrite / crash", emphasis: false },
            ],
            edges: [
              { from: "src", to: "buf", label: "taints" },
              { from: "buf", to: "snk", label: "flows to" },
              { from: "snk", to: "crash", label: "unbounded copy" },
            ],
          },
          quiz: {
            question:
              "In the TCP server example, which call is the sink?",
            options: [
              "recv(), because it accepts network data",
              "memcpy(), because it copies tainted bytes into a fixed buffer",
              "printf(), because it prints to stdout",
              "listen(), because it opens the port",
            ],
            correctIndex: 1,
            explanation:
              "The source is recv(); memcpy at line 20 is the dangerous function whose destination can be driven past the 128-byte buffer - the GDB backtrace confirms the crash happens inside memcpy.",
          },
          flashcards: [
            {
              front: "Taint propagation",
              back: "Once a source taints a variable, every later variable modified from it is tainted too - the chain continues until a sanitizer or sink.",
            },
            {
              front: "Propagator in taint analysis",
              back: "A function that modifies its arguments (like recv writing into its buffer parameter), so taint spreads beyond simple return-value assignments.",
            },
          ],
          sourceRef: {
            label: "Chapter 1: Taint Analysis",
            pageStart: 31,
            pageEnd: 58,
            note:
              "Buffer overflow example, sources/sinks/propagators/sanitizers, taint propagation and path explosion.",
            sectionIndexes: [3],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Sink-to-Source: Solving the Maze Backwards",
          objective:
            "Justify starting analysis at dangerous sinks and working backward toward attacker-controlled sources.",
          hook: "A maze is easy from a bird's-eye view - especially when you start at the center. In code review, the center is the exploitable sink.",
          paragraphs: [
            "The obvious approach - start at input sources and follow every tainted path - favors completeness but drowns you: paths branch exponentially and most lead nowhere. Sink-to-source analysis favors selection. The book's analogy is a hedge maze seen from above: many entrances, many dead ends, but you only need one path to the center - here, one exploitable vulnerability. Starting at the center and working backward finds it faster.",
            "The chapter puts this into practice against dhcp6relay, a DHCPv6 relay server in the SONiC networking project, which the author uses to rediscover a known vulnerability from scratch. The workflow: pick the dangerous sinks first (the functions that would matter if controlled), trace backward to see whether attacker-controlled data can reach them, and ignore paths that cannot. This is the strategy the rest of Part I optimizes - manual in Chapter 1, automated with CodeQL and Semgrep in Chapter 3, and mirrored in the disassembler in Chapter 5.",
          ],
          bullets: [
            "Source-to-sink = completeness, exponential branching, many dead ends",
            "Sink-to-source = selection: start where the damage would happen",
            "One proven path from sink to attacker input is enough",
          ],
          takeaway:
            "Begin at the dangerous function and walk backward; you need only one reachable path to prove a vulnerability.",
          diagram: null,
          quiz: {
            question:
              "What is the main advantage of sink-to-source analysis over source-to-sink?",
            options: [
              "It examines every possible path through the program",
              "It bounds the search to paths that could actually reach a dangerous function",
              "It eliminates the need to identify what input is attacker-controlled",
              "It only works on programs under 100 lines of code",
            ],
            correctIndex: 1,
            explanation:
              "Following sources forward explodes into exponentially branching paths. Starting at exploitable sinks and working backward keeps only paths that matter - the bird's-eye maze view.",
          },
          flashcards: [
            {
              front: "Sink-to-source strategy",
              back: "Start at dangerous functions (sinks) and trace backward to attacker-controlled inputs, rather than following every path forward from sources.",
            },
            {
              front: "dhcp6relay case study",
              back: "A DHCPv6 relay server in SONiC used to demonstrate rediscovering a disclosed vulnerability with the sink-to-source workflow.",
            },
          ],
          sourceRef: {
            label: "Chapter 1: Taint Analysis",
            pageStart: 31,
            pageEnd: 58,
            note: "Sink-to-source analysis strategy and the dhcp6relay walkthrough.",
            sectionIndexes: [3],
          },
          estimatedMinutes: 3,
        },
        {
          title: "From Suspicious to Exploitable",
          objective:
            "Apply the filtering pipeline that turns a suspicious sink into a proven, reportable vulnerability.",
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
          ],
          takeaway:
            "A finding becomes a vulnerability only when you've shown a controlled input reaches a dangerous sink through a live path - and reproduced the crash.",
          diagram: {
            type: "process",
            title: "Filtering pipeline: suspicion to proof",
            nodes: [
              { id: "sink", label: "Dangerous sink", emphasis: false },
              { id: "ctrl", label: "Attacker-controlled?", emphasis: true },
              { id: "reach", label: "Reachable path?", emphasis: true },
              { id: "poc", label: "Reproduced PoC", emphasis: true },
            ],
            edges: [
              { from: "sink", to: "ctrl", label: "trace back" },
              { from: "ctrl", to: "reach", label: "yes" },
              { from: "reach", to: "poc", label: "trigger" },
            ],
          },
          quiz: {
            question:
              "You found a memcpy with attacker data but no working crash. What does the book's standard require before calling it a vulnerability?",
            options: [
              "A CVE number must already have been assigned",
              "A full ROP exploit achieving arbitrary code execution",
              "A proof of concept showing controllable memory corruption on a working build",
              "A disassembly listing of the vulnerable function",
            ],
            correctIndex: 2,
            explanation:
              "Demonstrating controllable memory corruption - a triggering PoC - is sufficient for vulnerability research and typically enough for developers; exploit development is a separate discipline.",
          },
          flashcards: [
            {
              front: "Confirming an attacker-controlled source",
              back: "Verify the value reaching the sink actually derives from attacker input (e.g., option_length after ntohs checks), not a constant or sanitized path.",
            },
            {
              front: "Why pin the build environment?",
              back: "A container with exact commits and debug flags makes the PoC reproducible for the developer - their first job is reproducing your report.",
            },
          ],
          sourceRef: {
            label: "Chapter 1: Taint Analysis",
            pageStart: 31,
            pageEnd: 58,
            note:
              "Choosing sinks, filtering for exploitable scenarios, confirming reachability, and building the dhcp6relay PoC.",
            sectionIndexes: [3],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Mapping the Web Attack Surface",
          objective:
            "Identify web client and web server attack surfaces directly in source code.",
          hook: "Excel opens more than spreadsheets: .slk, .dbf, .dif files, COM interfaces, external data connections. Complexity is attack surface - and code review narrows the map.",
          paragraphs: [
            "As software grows, so does its attack surface - the number of potential entry points - and inexperienced researchers waste effort testing every one blindly. Code review replaces brute force with evidence: instead of dodging rate limits to enumerate routes, read the routing code. The chapter surveys the internet-facing surface, starting with web clients. A client that fetches web data dangerously can be exploited depending on how much of the URL it controls: the Nintendo Switch fetched a hardcoded captive-portal URL, so exploiting its WebKit bug (CVE-2016-4657) required a MITM position - worth it only because the payoff was a jailbreak. The author's Facebook Gameroom finding was richer: a manipulable fbgame:// custom URI scheme plus redirection gadgets on apps.facebook.com reached an outdated Chromium (CVE-2018-6056).",
            "Identification is pattern recognition in APIs: recognizing CefSharp.dll and ChromiumWebBrowser.Load() in decompiled C# instantly scopes the web client surface - and note these calls are closer to sinks than sources, a reminder that attack-surface mapping and taint analysis interlock. On the server side, frameworks and MVC structure the surface (model, controllers, routes), while unfamiliar or custom frameworks mean hand-rolled parsing of raw requests - the 'POST /items' listing. Nontraditional surfaces keep appearing: OAuth flows (GitHub's oauth WebAppFlow), WebRTC, real-time communication - each an entry point you can find by searching for its library calls.",
          ],
          bullets: [
            "Attack surface = entry points; code review narrows it faster than enumeration",
            "Web client risk scales with how much of the destination URL the attacker controls",
            "Recognize library APIs (CefSharp) to scope - they often sit near sinks",
            "Custom/unfamiliar frameworks hand-roll request parsing: a recurring weak spot",
          ],
          takeaway:
            "Search for web-related APIs and framework patterns in source to map client and server surfaces before you analyze a single request.",
          diagram: null,
          quiz: {
            question:
              "You find CefSharp.dll and a ChromiumWebBrowser.Load() call in a desktop app. What does that tell you?",
            options: [
              "The app contains an embedded browser - its web client code is a scannable attack surface",
              "The app is definitely vulnerable to cross-site scripting",
              "The app cannot make network requests without a proxy",
              "The app's database layer is implemented in C#",
            ],
            correctIndex: 0,
            explanation:
              "Recognizing popular libraries lets you scope the surface quickly: CefSharp wraps Chromium, so URL handling in the app is web client surface - and Load() is sink-adjacent code to trace.",
          },
          flashcards: [
            {
              front: "Web client vulnerability preconditions",
              back: "Depends on parsing (JSON vs headless browser) and URL control: hardcoded URLs need MITM; attacker-controlled destinations open much larger exploitation.",
            },
            {
              front: "Attack surface (definition)",
              back: "The number of potential entry points to exploit a vulnerability - it grows with features, complexity, and deprecated or rushed code.",
            },
          ],
          sourceRef: {
            label: "Chapter 2: Mapping Code to Attack Surface (part 1)",
            pageStart: 59,
            pageEnd: 82,
            note:
              "Web client/server vulnerabilities, identification via library APIs, MVC frameworks, and nontraditional surfaces.",
            sectionIndexes: [4],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Protocols, Data Structures, and Local Surfaces",
          objective:
            "Locate network-protocol, data-structure, and local IPC attack surfaces in source code.",
          hook: "Past the browser sits the rest of the stack: protocol handshakes, RFC-defined structs, IPC files, and hardcoded paths - all waiting to be read.",
          paragraphs: [
            "Network protocols expose layers of surface: application, transport, internet, link. Implementing a protocol means handling handshaking, session management, state management, error handling, encryption, and session termination - and developers usually roll their own implementations only when no library fits, which is exactly when the RFC's defined data structures become prime sinks. The book works examples in sonic-snmpagent (PDU header parsing straight from RFC 2741, byte-order handling) and iccpd (its own initialization code): struct layouts parsed from specs trust attacker bytes by design, so mismatched sizes and network-byte-order conversions are where memory corruption hides. Procedures - the state machines above - are a parallel class: discrepancies here usually lead to memory corruption or logic flaws.",
            "Local attack surface follows the same logic one layer down. Files used for inter-process communication invite surprises: the vim swap-file 'E325: ATTENTION' scenario shows how predictable temp paths collide with attacker-planted files. Hardcoded paths are a classic - Apport's check_lock used /var/lock/apport/lock, an attacker-writable location. Race conditions in file handling appear in Paramiko's _write_private_key_file. And file formats carry their own surface: child-format vulnerabilities occur because developers parse embedded formats they don't control, plus custom fields that few parsers handle consistently.",
          ],
          bullets: [
            "Protocol implementations = handshakes, state, crypto, teardown - each a procedure to audit",
            "RFC-defined structs (SNMP PDU) are trusted layouts: prime memory-corruption sinks",
            "Local surface: predictable IPC paths, hardcoded paths, file race conditions",
            "Child formats and custom fields multiply parsing risk inside parsers",
          ],
          takeaway:
            "Follow the data: protocol layers, spec-defined structs, and local file interactions each define a distinct class of entry points to trace.",
          diagram: null,
          quiz: {
            question:
              "Why are data structures defined by RFCs especially interesting to audit?",
            options: [
              "RFCs are always written in memory-safe languages",
              "Their exact binary layouts are parsed from untrusted input, so size and byte-order mistakes become memory corruption",
              "They are only used by hardware devices, which cannot be patched",
              "They eliminate the need for validation checks",
            ],
            correctIndex: 1,
            explanation:
              "sonic-snmpagent parses the RFC 2741 PDU header directly: a spec-defined layout trusting attacker bytes means field sizes, offsets, and network-byte-order conversions are where bugs concentrate.",
          },
          flashcards: [
            {
              front: "Procedure-level bugs in protocol code",
              back: "Handshaking, session/state management, error handling, encryption, teardown - discrepancies between spec and implementation cause corruption or logic flaws.",
            },
            {
              front: "Local attack surface examples",
              back: "IPC file collisions (vim E325), hardcoded paths (Apport), and file race conditions (Paramiko's private-key write).",
            },
          ],
          sourceRef: {
            label: "Chapter 2: Mapping Code to Attack Surface (part 1) → (part 2)",
            pageStart: 59,
            pageEnd: 92,
            note:
              "Network protocol layers, RFC data structures, procedures, local IPC, hardcoded paths, race conditions, and file formats.",
            sectionIndexes: [4, 5],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Automating Review: CodeQL and Semgrep",
          objective:
            "Explain how ASTs power CodeQL and Semgrep for scalable source-code analysis.",
          hook: "Manual review doesn't scale across a million lines - but a query over an abstract syntax tree does.",
          paragraphs: [
            "Chapter 3 begins from abstract syntax trees: parsers reduce source to tree structures (Module, FunctionDef, Assign, BinOp...) that tools can reason about symbolically instead of textually. Static code analysis tools build on that. CodeQL treats your codebase as a queryable database: you write queries in a language full of convenient classes for common sources, sinks, and taint propagators, and the engine computes flows across files. The chapter's RemoteCommandInjection.ql example declares a RemoteCommandInjectionFlow::PathNode sink and lists concrete source-to-sink paths, and a VS Code extension manages the CLI and databases for interactive use.",
            "Semgrep takes the lighter-weight path: pattern-based rules that match code shapes quickly, with a .semgrepignore to keep noise down - the book's scans report '18/18 tasks' and '19/19 tasks' results against known CVE patterns. Both tools embody the chapter's central caveat: automation augments manual review but never replaces it. Taint propagators, custom wrappers, macros, and third-party libraries must be curated and customized per context - which is why the next lesson turns these tools toward variant analysis, where a rule derived from one real bug finds its siblings.",
          ],
          bullets: [
            "ASTs turn source into queryable structure (Module, FunctionDef, Assign...)",
            "CodeQL: query language with source/sink/propagator classes over a code database",
            "Semgrep: fast pattern rules with ignore files for curated scans",
            "Rules need per-context curation - automation augments, not replaces, review",
          ],
          takeaway:
            "Encode your source-and-sink knowledge as queries or patterns once, then run it across whole repositories - and keep curating the rules.",
          diagram: {
            type: "process",
            title: "From source code to findings",
            nodes: [
              { id: "src", label: "Source code", emphasis: false },
              { id: "ast", label: "AST / code database", emphasis: false },
              { id: "rule", label: "Query or pattern rule", emphasis: true },
              { id: "find", label: "Ranked findings", emphasis: false },
            ],
            edges: [
              { from: "src", to: "ast", label: "parse" },
              { from: "ast", to: "rule", label: "evaluate" },
              { from: "rule", to: "find", label: "match" },
            ],
          },
          quiz: {
            question:
              "What is CodeQL's core idea for finding vulnerabilities?",
            options: [
              "It brute-forces every input against a running binary",
              "It treats the codebase as data you can query for source-to-sink flows",
              "It decompiles binaries back into C source",
              "It replaces manual review with a single universal rule",
            ],
            correctIndex: 1,
            explanation:
              "CodeQL compiles code into a queryable database with classes for sources, sinks, and propagators, so a query like RemoteCommandInjection.ql computes flows across files.",
          },
          flashcards: [
            {
              front: "Abstract syntax tree (AST)",
              back: "A tree representation of source structure (functions, assignments, operators) that analysis tools traverse instead of raw text.",
            },
            {
              front: "CodeQL vs Semgrep",
              back: "CodeQL: rich query language over a compiled code database, deep cross-file flows. Semgrep: fast pattern-based rules, easier to write and run.",
            },
          ],
          sourceRef: {
            label: "Chapter 3: Automated Variant Analysis (part 1)",
            pageStart: 93,
            pageEnd: 118,
            note: "ASTs, CodeQL query language and taint tracking, Semgrep pattern rules.",
            sectionIndexes: [6],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Variant Analysis: When One Bug Means Many",
          objective:
            "Use a root cause and its patch to find sibling vulnerabilities across repositories.",
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
          ],
          takeaway:
            "Turn every fixed bug into a rule, then hunt that rule everywhere - variant analysis is how one discovery becomes many.",
          diagram: null,
          quiz: {
            question:
              "Your team patches an integer-overflow vulnerability. What is the highest-leverage next step?",
            options: [
              "Close the ticket and wait for the next fuzzing cycle",
              "Write an analysis rule encoding the pattern and scan sibling code and dependent projects",
              "Immediately request six separate CVE identifiers",
              "Rewrite the affected module in a memory-safe language",
            ],
            correctIndex: 1,
            explanation:
              "Variant analysis converts the root cause (revealed by the patch) into a reusable rule, then searches for siblings - the Expat case turned one flaw into six CVEs this way.",
          },
          flashcards: [
            {
              front: "Variant analysis",
              back: "After finding a vulnerability, systematically search for the same root-cause pattern in other code paths, repositories, and shared libraries.",
            },
            {
              front: "Root cause analysis's role",
              back: "Identify the exact lines and values that caused the bug; the fix teaches you the pattern to encode in CodeQL/Semgrep rules.",
            },
          ],
          sourceRef: {
            label: "Chapter 3: Automated Variant Analysis (part 1) → (part 2)",
            pageStart: 93,
            pageEnd: 124,
            note:
              "Variant analysis, Expat root cause (CVE-2022-22822..22827), pattern matching rules, and multi-repository scaling.",
            sectionIndexes: [6, 7],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Part II · Reverse Engineering: Mapping the Unknown",
      summary:
        "Chapters 4-6: triage binaries by type, find sources and sinks statically and dynamically, then combine coverage, emulation, and symbolic execution.",
      lessons: [
        {
          title: "Binary Taxonomy: Triage Before You Disassemble",
          objective:
            "Classify binaries as scripts, intermediate representations, or machine code and choose the right analysis approach.",
          hook: "Not all binaries are created - or rather, compiled - equal. Triage the type first, or you'll fight assembly that was never there.",
          paragraphs: [
            "The chapter's strategy is to understand the lay of the land before getting into the weeds: rather than dropping every file into Ghidra, sort it into three categories. Scripts (JavaScript, Python, Ruby) run in interpreters that may JIT-compile, and packaged executables may embed obfuscated or minified scripts - or just wrap source files with an embedded interpreter. The book's examples: a Node.js Electron app (DbGate), where source maps can unpack minified code back to near-original (plus beautifiers and a dangerous sink like handleRunMacro), and a Python PyInstaller game (Galaxy Attack) whose embedded modules can be listed and extracted.",
            "Intermediate representations - Java bytecode and .NET CIL assemblies - decompile remarkably well: with proper metadata you can retrieve near-original source, then simply do code review. Machine code (PE on Windows, ELF on Linux, Mach-O on macOS) is the classic disassembly case. Modern apps mix all three: WhatsApp, Slack, and Zoom ship executables containing Node.js scripts, WebAssembly, and CIL. The security boundaries differ by medium - Electron's old nodeIntegration setting turned an XSS into desktop RCE - and cross-interactions (a Node script instantiating WASM, CIL loading unmanaged libraries) mean your triage must keep the bird's-eye view. Packed binaries are the adversarial case: unpack first, analyze second.",
          ],
          bullets: [
            "Scripts: unpack/deobfuscate, then review source as usual",
            "Bytecode (CIL, JVM): decompile to near-source, then review",
            "Machine code (PE/ELF/Mach-O): the classic disassembly path",
            "Electron nodeIntegration history: sandbox escapes amplify web bugs to RCE",
          ],
          takeaway:
            "Identify which of the three binary categories you're holding before choosing tools - the type dictates the technique.",
          diagram: {
            type: "hierarchy",
            title: "Binary taxonomy",
            nodes: [
              { id: "bin", label: "Binary", emphasis: true },
              { id: "scr", label: "Scripts (JS/Python)", emphasis: false },
              { id: "ir", label: "Bytecode (CIL/JVM)", emphasis: false },
              { id: "mc", label: "Machine code (PE/ELF)", emphasis: false },
            ],
            edges: [
              { from: "bin", to: "scr", label: "interpreter" },
              { from: "bin", to: "ir", label: "VM runtime" },
              { from: "bin", to: "mc", label: "native CPU" },
            ],
          },
          quiz: {
            question:
              "Which binary type is most likely to decompile back to near-original source code?",
            options: [
              "A packed Windows executable",
              "Bytecode with metadata (.NET CIL or Java bytecode)",
              "A minified JavaScript bundle without source maps",
              "A stripped ELF binary",
            ],
            correctIndex: 1,
            explanation:
              "IR binaries carry rich metadata: with it you can recover near-original source and fall back to ordinary code review - the opposite of stripped machine code.",
          },
          flashcards: [
            {
              front: "Three binary categories for triage",
              back: "Scripts (interpreters), intermediate representations (bytecode), and machine code (PE/ELF/Mach-O) - each needs a different toolchain.",
            },
            {
              front: "Why Electron raised the stakes",
              back: "nodeIntegration let renderer JavaScript call Node APIs, turning a website XSS into full desktop code execution - web and native surfaces merged.",
            },
          ],
          sourceRef: {
            label: "Chapter 4: Binary Taxonomy (part 1) → (part 2)",
            pageStart: 125,
            pageEnd: 164,
            note:
              "Scripts, IRs, and machine code; Electron/PyInstaller unpacking, source maps, CLR and Java bytecode, packed binaries.",
            sectionIndexes: [8, 9],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Static Analysis in Binaries: Strings to Pseudocode",
          objective:
            "Use strings, disassembly, and decompilation to find sources and sinks in a compiled binary.",
          hook: "Before you open a disassembler, run strings. In FreshTomato's httpd, four lines of output reveal system(), shell format strings, and CGI routes.",
          paragraphs: [
            "Chapter 5 applies prioritization to machine-code binaries using FreshTomato router firmware as its black-box target. Extraction itself is reconnaissance: binwalk unpacks the .trx image (with Sasquatch for SquashFS), and the first question is where the logic lives - /www holds only view files, so the self-contained httpd binary (custom routing hardcoded inside, thanks to device constraints) is the target. Then strings: seeing system, 'Content-Type: %s', and 'grep -ih \"%s\" $(ls -1rv %s %s.*)' immediately flags command-execution sinks, format strings, and routes - a shockingly effective first pass.",
            "Next comes Ghidra's CodeBrowser, which disassembles machine code to assembly and decompiles it to higher-level pseudocode. The Symbol Tree becomes your map: for large binaries, work backward from dangerous library calls - the same sink-to-source strategy from Chapter 1, now executed with an xrefs view instead of source code (the 'mashing X key' joke: bringing up all references to a function). Thunked functions like popen show wrappers around externals; response strings and error messages give contextual clues to locate request handlers. The chapter's discipline: approach from the black-box perspective first, then compare your findings against the actual open-source code to check your reasoning.",
          ],
          bullets: [
            "Extract firmware (binwalk/Sasquatch), then find the self-contained logic binary",
            "strings = cheap triage: sinks (system), format strings, routes",
            "Ghidra: disassemble → decompile to pseudocode; Symbol Tree for navigation",
            "Work backward from dangerous calls - xrefs are the sink-to-source view",
          ],
          takeaway:
            "Strings first, pseudocode second, and always trace from the dangerous call back toward input.",
          diagram: null,
          quiz: {
            question:
              "Why is running strings on httpd before opening Ghidra a good move?",
            options: [
              "strings decompiles the binary into C source",
              "It cheaply reveals sinks like system(), shell format strings, and route names for further investigation",
              "It bypasses the need to identify sources entirely",
              "It unpacks the SquashFS filesystem automatically",
            ],
            correctIndex: 1,
            explanation:
              "The strings output showed system, HTTP format strings, shell commands with %s, and CGI routes - enough to pinpoint areas for disassembly before spending time in the decompiler.",
          },
          flashcards: [
            {
              front: "Ghidra CodeBrowser",
              back: "Disassembles machine code to assembly and decompiles to pseudocode, with a Symbol Tree for navigating functions and references (xrefs).",
            },
            {
              front: "Sink-to-source in a disassembler",
              back: "Start from calls to dangerous functions (popen, system) and use cross-references to walk backward to the input handling that feeds them.",
            },
          ],
          sourceRef: {
            label: "Chapter 5: Source and Sink Discovery",
            pageStart: 165,
            pageEnd: 190,
            note: "FreshTomato firmware triage, strings, Ghidra disassembly/decompilation, static analysis.",
            sectionIndexes: [10],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Dynamic Analysis: Tracing, Hooking, and Proving Exploitability",
          objective:
            "Trace library calls at runtime with strace/ltrace and Frida, then evaluate whether findings are exploitable.",
          hook: "Static analysis guesses at behavior. Dynamic analysis watches it happen - and lets you reach in and change it mid-flight.",
          paragraphs: [
            "Static analysis shows every instruction but can't tell which ones matter at runtime; dynamic analysis executes the target and observes. The book starts with tracing library calls: strace/ltrace on ImageMagick's delegate execution reveals ffmpeg being invoked with a constructed command string ('ffmpeg' -nostdin ... -i '/tmp/magick-...'), turning an opaque binary into an observable command-construction surface. Higher-level events - debugging output, error messages across processes - add context that syscalls alone don't give.",
            "Then instrumentation: Frida scripts attach Interceptor.attach hooks to exported functions like system and popen, logging arguments, timestamps, and return values ('system(command=\"echo Hello, canary123\")', 'modified argument!'). Crucially, a hook can modify arguments at runtime - demonstrating control, not just observation. The chapter closes by evaluating exploitability: analyze error paths (ImageMagick's ThrowMagickException arguments), plant canary strings (writing /tmp/hacked to prove a write primitive), and examine inter-process communication artifacts with tools like James Forshaw's OleViewDotNet. Each technique converts 'the binary does something interesting' into 'the attacker can drive it here'.",
          ],
          bullets: [
            "strace/ltrace: observe library and syscall behavior with real inputs",
            "Frida: hook system/popen, log arguments, and modify them live",
            "Higher-level events (debug/error logs) contextualize syscall traces",
            "Prove exploitability: error analysis, canary strings, IPC artifacts",
          ],
          takeaway:
            "Watch the dangerous call fire, then prove you can influence it - observation becomes evidence.",
          diagram: null,
          quiz: {
            question:
              "What does hooking popen with Frida and modifying its argument demonstrate?",
            options: [
              "That the binary cannot be debugged with GDB",
              "Attacker control over the command-execution path - direct evidence of exploitability",
              "That static analysis is unnecessary for all future work",
              "That the binary is packed and must be unpacked first",
            ],
            correctIndex: 1,
            explanation:
              "Logging the argument shows the flow; changing it at runtime ('modified argument!') shows the value is attacker-influenceable - the difference between interesting and exploitable.",
          },
          flashcards: [
            {
              front: "Frida instrumentation",
              back: "Runtime instrumentation framework: Interceptor.attach on exports like system/popen to log, trace, and modify arguments while the program runs.",
            },
            {
              front: "Canary strings for exploitability",
              back: "Write a recognizable marker (e.g., /tmp/hacked) to prove a write primitive actually fires - turning a suspected sink into demonstrated control.",
            },
          ],
          sourceRef: {
            label: "Chapter 5: Source and Sink Discovery",
            pageStart: 165,
            pageEnd: 190,
            note:
              "Dynamic analysis: strace/ltrace, Frida hooking, higher-level events, and exploitability evaluation (errors, canaries, IPC artifacts).",
            sectionIndexes: [10],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Hybrid Analysis: Coverage, Emulation, Symbolic Execution",
          objective:
            "Combine code coverage, emulation, and symbolic execution to focus and automate reverse engineering.",
          hook: "Static sees everything but understands little; dynamic understands but only what you trigger. Hybrid analysis marries them.",
          paragraphs: [
            "The chapter's thesis: enrich dynamic instrumentation with static data. First, code coverage - in RE, the instructions actually executed during a run, not test-suite percentage. Collect it with DynamoRIO's drcov (a dynamic instrumentation framework that copies instructions into a manipulable code cache; Intel Pin and Frida Stalker are siblings), then visualize the hit blocks over Ghidra's listing with Lighthouse. Coverage immediately kills rabbit holes: for a web-server binary, highlight which basic blocks handle an HTTP request instead of guessing from response strings, and gather coverage first so static analysis can parse just the code that handled your input.",
            "Second, emulation: Qiling runs the FreshTomato httpd firmware binary on your host with its real filesystem context, letting you exercise request handlers you could never trigger on hardware - then hijack API calls and bind virtual paths to inject test data, with Light Keeper visualizing the new coverage. Third, symbolic execution with angr: instructions become VEX IR (IRSB), values become symbolic variables, and a solver finds the inputs satisfying path constraints - automating 'what input reaches this branch?' at scale. When the model of a library function is missing, you write SimProcedures to replace it (disable, or reimplement), keeping the exploration moving.",
          ],
          bullets: [
            "Coverage (DynamoRIO + Lighthouse): which code actually ran - focus static effort",
            "Emulation (Qiling): execute firmware binaries with real filesystem context",
            "Symbolic execution (angr): solve for inputs that reach target paths",
            "SimProcedures patch library-function gaps in the model",
          ],
          takeaway:
            "Let dynamic evidence - coverage, traces, solver-found inputs - tell static analysis exactly where to look.",
          diagram: {
            type: "process",
            title: "The hybrid analysis loop",
            nodes: [
              { id: "st", label: "Static: pseudocode + xrefs", emphasis: false },
              { id: "cov", label: "Dynamic coverage", emphasis: true },
              { id: "em", label: "Emulation / traces", emphasis: false },
              { id: "sym", label: "Symbolic solving", emphasis: true },
            ],
            edges: [
              { from: "st", to: "cov", label: "guess paths" },
              { from: "cov", to: "st", label: "focus listing" },
              { from: "em", to: "sym", label: "seed constraints" },
              { from: "sym", to: "st", label: "inputs found" },
            ],
          },
          quiz: {
            question:
              "What is the primary value of code coverage in reverse engineering?",
            options: [
              "It replaces the need for a decompiler",
              "It shows which instructions actually executed, so static analysis can focus there",
              "It automatically exploits any crash it finds",
              "It decrypts packed binaries without unpacking",
            ],
            correctIndex: 1,
            explanation:
              "Coverage collected dynamically (drcov + Lighthouse) maps real execution onto the listing, saving you from chasing dead code and guessing at handlers.",
          },
          flashcards: [
            {
              front: "Qiling emulation",
              back: "Runs a target binary (e.g., router httpd) on the host with its original filesystem, enabling requests and API-call hijacking you can't do on device.",
            },
            {
              front: "Symbolic execution (anggr)",
              back: "Treats values as symbolic variables and solves path constraints to compute inputs that reach a given branch - automating input discovery.",
            },
          ],
          sourceRef: {
            label: "Chapter 6: Hybrid Binary Analysis",
            pageStart: 191,
            pageEnd: 220,
            note: "Code coverage with DynamoRIO/Lighthouse, Qiling emulation, angr symbolic analysis and SimProcedures.",
            sectionIndexes: [11],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Part III · Fuzzing and Beyond Day Zero",
      summary:
        "Chapters 7-10: black-box and coverage-guided fuzzing with AFL++, fuzzing every kind of target, then disclosing findings responsibly with a report and a CVE.",
      lessons: [
        {
          title: "Quick-and-Dirty Fuzzing",
          objective:
            "Classify fuzzers and bootstrap black-box fuzzing against a protocol and a file format.",
          hook: "Modern coverage-guided fuzzing is powerful - but the book starts you where every caveman started: with a corpus and zero setup.",
          paragraphs: [
            "Why fuzzing works at all: programs assume well-formed input, so invalid input trips paths developers never guarded. The chapter gives you a fuzzer taxonomy to navigate the tooling: by target information (protocol fuzzers must speak multistep conversations), by generation approach (mutation-based mutates an initial corpus; generation-based builds inputs from a predefined format), by input type, and by feedback loop (black-box fuzzers get none). Its advice is pragmatic: fuzz first, optimize later - get crashes flowing before reaching for harnesses.",
            "The hands-on path: boofuzz for black-box protocol fuzzing. You dissect the MQTT CONNECT and PUBLISH packets (bit fields, variable headers), define them in boofuzz's DSL, and fuzz NanoMQ - an AddressSanitizer report ('READ of size 1', shadow bytes) proves the approach on a real broker. For zero-setup file fuzzing, radamsa mutates seeds blindly - the book points it at libxls and at corpus-garbage outputs. You then analyze fuzz coverage with OSS-Fuzz's tooling, and bootstrap structured formats with FormatFuzzer: binary templates (PNG's .bt describing chunks and interlace enums) generate both parsers and mutators, converting your format knowledge into a fuzzer without writing one.",
          ],
          bullets: [
            "Fuzzer axes: target info, mutation vs generation, input type, feedback loop",
            "Fuzz first, optimize later - crashes beat perfect setup",
            "boofuzz: dissect protocol packets (MQTT CONNECT/PUBLISH) and fuzz NanoMQ",
            "radamsa for zero-setup mutation; FormatFuzzer templates for structured formats",
          ],
          takeaway:
            "Start black-box with a corpus or a packet definition, get crashes, then invest in instrumentation and harnesses.",
          diagram: null,
          quiz: {
            question:
              "What distinguishes a mutation-based fuzzer from a generation-based one?",
            options: [
              "Mutation-based derives new inputs by altering seeds; generation-based builds inputs from a format definition",
              "Mutation-based requires source code; generation-based does not",
              "Mutation-based uses coverage feedback; generation-based never executes the target",
              "They are two names for the same technique",
            ],
            correctIndex: 0,
            explanation:
              "The taxonomy is explicit: mutation-based generates inputs by mutating an initial corpus, generation-based constructs them from a predefined input format - and either may or may not use feedback.",
          },
          flashcards: [
            {
              front: "boofuzz",
              back: "Black-box network protocol fuzzer: you describe packets (fields, bit widths) and it mutates them - used against MQTT and NanoMQ in the book.",
            },
            {
              front: "Feedback loop in fuzzing",
              back: "Whether the fuzzer learns from the target: none = black-box; coverage feedback = coverage-guided (Chapter 8's AFL++).",
            },
          ],
          sourceRef: {
            label: "Chapter 7: Quick and Dirty Fuzzing",
            pageStart: 221,
            pageEnd: 250,
            note: "Why fuzzing works, fuzzer taxonomy, boofuzz/MQTT, radamsa, OSS-Fuzz coverage, FormatFuzzer bootstrapping.",
            sectionIndexes: [12],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Coverage-Guided Fuzzing with AFL++",
          objective:
            "Explain how coverage feedback, harnesses, and fuzz blockers determine fuzzing effectiveness.",
          hook: "A black-box fuzzer can't know that flipping one interlace byte unlocks new code. A coverage-guided fuzzer discovers it on its own.",
          paragraphs: [
            "The PNG example makes the case: a parser branches on chunk type (IHDR, PLTE, IDAT...) and then on values like the interlace byte - black-box mutation has no idea those branches matter, but instrumented feedback keeps mutations that reach new instructions. Coverage even solves magic-byte gates: afl-fuzz learns tokens like 'IHDR' by observing which bit flips change execution paths. CRC checks remain true bottlenecks - identify them from the format spec or coverage data, then patch or bypass them carefully to avoid false positives.",
            "Then AFL++ in earnest: build it yourself, watch the status screen (stage progress, execs/sec, stability - keep stability above 80%), and write a harness - a wrapper isolating the interesting function (LLVMFuzzerTestOneInput for LibreDWG's dwgread path) so fuzzing skips uninteresting startup and runs thousands of iterations per second. Optimizations follow: patch validation checks (the CRC call site in decode_r2007), minimize the corpus so the fuzzer works from good seeds, fuzz in parallel, and measure with afl-cov. Finally, Fuzz Introspector visualizes coverage heat, ranks functions by complexity, and exposes fuzz blockers - like a bitsize check that silently rejects most mutations - so you know exactly what to fix next.",
          ],
          bullets: [
            "Coverage feedback keeps inputs that reach new paths; it also learns magic tokens",
            "Harnesses (LLVMFuzzerTestOneInput) skip dead time - speed is coverage",
            "Optimize: patch CRC-style blockers, minimize corpus, fuzz in parallel",
            "Fuzz Introspector: coverage heat, complexity ranking, blocker detection",
          ],
          takeaway:
            "Maximize coverage per second: instrument, harness away the dead time, remove fuzz blockers, and let the status screen tell you what's working.",
          diagram: {
            type: "process",
            title: "Coverage-guided fuzzing loop",
            nodes: [
              { id: "seed", label: "Seed corpus", emphasis: false },
              { id: "mut", label: "Mutate", emphasis: false },
              { id: "run", label: "Run + instrument", emphasis: true },
              { id: "cov", label: "New coverage?", emphasis: true },
            ],
            edges: [
              { from: "seed", to: "mut", label: "queue" },
              { from: "mut", to: "run", label: "execute" },
              { from: "run", to: "cov", label: "feedback" },
              { from: "cov", to: "mut", label: "keep if new" },
            ],
          },
          quiz: {
            question:
              "What does coverage feedback do in AFL++?",
            options: [
              "It automatically writes a harness for the target",
              "It keeps mutations that reach new program paths so they seed further mutations",
              "It patches all validation checks before fuzzing",
              "It converts the target into a generation-based fuzzer",
            ],
            correctIndex: 1,
            explanation:
              "The fuzzer instruments the target, records which paths each input reaches, and prioritizes inputs that expand coverage - that's how it discovers significant tokens like IHDR on its own.",
          },
          flashcards: [
            {
              front: "Fuzzing harness",
              back: "A custom wrapper that imports and executes a specific function or path of the target, skipping uninteresting work so iterations run at high speed.",
            },
            {
              front: "Fuzz blocker",
              back: "A check (magic bytes, CRC, bitsize validation) that rejects most mutated inputs before they reach deep code - remove or satisfy it to raise coverage.",
            },
          ],
          sourceRef: {
            label: "Chapter 8: Coverage-Guided Fuzzing",
            pageStart: 251,
            pageEnd: 276,
            note:
              "Coverage advantages, AFL++ workflow, harness writing, corpus minimization, afl-cov, and Fuzz Introspector.",
            sectionIndexes: [13],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Fuzzing Everything Else",
          objective:
            "Fuzz closed-source binaries, managed-memory languages, and structured formats with the right mode or tool.",
          hook: "Golang servers, Electron clients, Kotlin apps: not everything compiles to an instrumented ELF - and not every bug is memory corruption.",
          paragraphs: [
            "For closed-source binaries, coverage still matters - AFL++ gets it dynamically. QEMU mode uses user-space emulation to translate instructions for a single binary (the book fuzzes NConvert's TIFF parsing, where prior CVEs cluster; CMPLOG mode with -c logs comparison instructions to slip past magic-byte checks; stability above 80% means you're good). Frida mode (-O) injects afl-frida-trace.so and instruments via Frida Stalker at runtime - it works on real devices like Android, though it runs slower and gives GDB less symbol information; a Frida script even patches LibreDWG's bit_calc_CRC to sidestep the blocker.",
            "Managed-memory binaries need different bug expectations: Jazzer brings coverage-guided fuzzing to Java, finding not crashes but logic flaws - its SSRF finding (a crafted Base64 path making the target connect out) is reported via Jazzer.reportFindingFromHook. Go ships fuzzing built in, with testdata/fuzz corpora and failures written back for replay - the book fuzzes a domain-validation function until it fails. Finally, syntactic and semantic targets: non-binary formats like HTML/XML need dictionaries (a manual HTML tag list vs AFL++'s autodictionary), grammars (Grammar-Mutator for structured languages), and intermediate representations - the same format knowledge from Chapter 7, now guiding coverage-guided tools.",
          ],
          bullets: [
            "QEMU mode: emulate un-instrumented binaries; CMPLOG beats magic bytes",
            "Frida mode: runtime Stalker instrumentation, device-friendly, slower",
            "Jazzer (Java) and Go's native fuzzer find logic bugs, not just crashes",
            "Dictionaries, grammars, and IRs guide fuzzers over structured formats",
          ],
          takeaway:
            "Match the tool to the target: emulation for binaries, language-native fuzzers for managed runtimes, dictionaries and grammars for formats.",
          diagram: null,
          quiz: {
            question:
              "You must fuzz a closed-source Linux binary with no instrumentation. What does the book recommend?",
            options: [
              "Rewrite the binary from scratch in Rust",
              "AFL++ QEMU or Frida mode for binary-only coverage-guided fuzzing",
              "Skip fuzzing and use only manual code review",
              "Compile it with GCC instrumentation flags",
            ],
            correctIndex: 1,
            explanation:
              "Both modes add coverage without source: QEMU user-space emulation (with CMPLOG for magic bytes) and Frida's runtime Stalker injection - demonstrated on NConvert and LibreDWG.",
          },
          flashcards: [
            {
              front: "Jazzer",
              back: "Coverage-guided Java fuzzer that reports findings like SSRF through hooks - it targets logic flaws in managed runtimes, not just memory corruption.",
            },
            {
              front: "Dictionaries vs grammars in fuzzing",
              back: "Dictionaries supply known tokens (HTML tags) for mutation; grammars (Grammar-Mutator) generate syntactically valid structures to go deeper.",
            },
          ],
          sourceRef: {
            label: "Chapter 9: Fuzzing Everything",
            pageStart: 277,
            pageEnd: 302,
            note:
              "QEMU and Frida modes, CMPLOG, Jazzer, Go fuzzing, dictionaries, grammars, and intermediate representations.",
            sectionIndexes: [14],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Disclosure Without Drama",
          objective:
            "Navigate coordinated vulnerability disclosure, bug bounties, and the legal and ethical lines around selling research.",
          hook: "Finding the bug is half the job. Getting it fixed - without getting sued or sidelined - is the other half.",
          paragraphs: [
            "Coordinated vulnerability disclosure (CVD, or responsible disclosure) gives the vendor time to fix before public disclosure. The book traces why it matters: reporting was dangerous for decades, driving research underground and fueling a murky zero-day market; the 2010s resurgence of bug bounties and vulnerability disclosure programs legitimized the work. National policies now exist (ENISA's frameworks, CISA's 2020 directive for federal agencies), but legal risk persists - research the target's published policy and your jurisdiction's laws before you start. Full disclosure remains a last resort when a vendor ignores you and the risk is severe: a breakdown all parties should avoid.",
            "Money complicates everything. Zero days are bought by third parties (governments, organizations, criminals), brokers (resellers), middlemen (bug-bounty platforms triaging payouts), and vendors themselves (bounties). Selling to third parties or brokers is ethically wrong and likely illegal - consider where a flaw will end up. Bug bounties tilt the economics toward legitimate payment, but read the terms: Microsoft's program requires confidentiality until the fix, with detailed disclosure allowed only 30 days after; demanding payment without an existing program is extortion. If you want the right to publish, report directly via CVD. On the practical side: security.txt (RFC 9116) at /.well-known/security.txt names the contact, GitHub's reporting features and SECURITY files cover open source, CERT/CC is the last resort - and always allow time for a human on the other end to read your report.",
          ],
          bullets: [
            "CVD: vendor fixes first, public disclosure after - policies and law vary by jurisdiction",
            "Who buys zero days: third parties, brokers, middlemen, vendors - selling to the first two is the red line",
            "Bug bounty terms restrict publication; no program + demanded payment = extortion",
            "Find contacts via security.txt (RFC 9116), SECURITY.md, or CERT/CC",
          ],
          takeaway:
            "Disclose to the right party, in writing, within policy - and never sell to third parties or brokers.",
          diagram: null,
          quiz: {
            question:
              "You find a vulnerability at a company with no bug bounty or disclosure program and demand payment before reporting it. How does the book characterize this?",
            options: [
              "Standard industry practice",
              "Unethical and potentially extortion - there is no pre-existing program to claim under",
              "A reasonable use of coordinated vulnerability disclosure",
              "Full disclosure, which is always acceptable",
            ],
            correctIndex: 1,
            explanation:
              "The book is blunt: demanding a reward without a pre-existing bug bounty or disclosure policy is unethical and can be considered extortion.",
          },
          flashcards: [
            {
              front: "Coordinated Vulnerability Disclosure (CVD)",
              back: "Researcher reports to the responsible party first; the vendor gets time to fix or mitigate before public disclosure, ideally under a published policy.",
            },
            {
              front: "security.txt (RFC 9116)",
              back: "A machine-readable file at /.well-known/security.txt listing an organization's vulnerability contacts, policy, and encryption keys.",
            },
          ],
          sourceRef: {
            label: "Chapter 10: Beyond Day Zero",
            pageStart: 303,
            pageEnd: 321,
            note: "CVD model, national policies, zero-day markets, bug bounty terms, and finding disclosure contacts.",
            sectionIndexes: [15],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Writing the Report, Getting the CVE",
          objective:
            "Structure a vulnerability report that developers can act on and request a CVE correctly.",
          hook: "Your report has one reader: a developer who has never seen your bug. Make reproduction their easiest task of the day.",
          paragraphs: [
            "The book dissects a real report (CVE-2021-33035, Apache OpenOffice Calc) into four sections. Summary: a title naming the software, the impact, and the cause; CVSS for triage; your contact details (reports land in ticketing systems); and two or three sentences of bottom-line-up-front. Reproduction steps: exact environment (Windows 10 build, AOO4110m), a readable Python PoC with comments, numbered steps, and a screen recording - and, in hindsight, fewer exploit details: ROP chains and ASLR/DEP talk distract developers whose job is just to reproduce. Root cause: the key lines of code (memcpy with a file-defined nLen into a sal_Int32), why they're unsafe, and a hint that other variants may follow - but leave mitigation-bypass fireworks for a blog post. Recommendations: speak the developer's language - 'review field sizes blindly trusted into fixed buffers,' not 'memory corruption primitives.'",
            "Then delivery. Find the right human: security.txt, the project's README/SECURITY file, GitHub's vulnerability reporting, or CERT/CC as last resort; follow up politely after a few weeks if silence persists - someone overworked may be maintaining the project alone. For the CVE: check whether one is already assigned (search NVD first), request through the appropriate CNA, and expect the benefits - a globally recognized registry entry, credit for your research, and vendor accountability. Examples of polished public reports live on HackerOne's Hacktivity and the Chromium bug tracker.",
          ],
          bullets: [
            "Report = Summary, Reproduction steps, Root cause, Recommendations",
            "Reproduction must be easy: pinned environment, readable PoC, numbered steps",
            "Keep exploit-dev detail out of the report; give developers actionable root cause",
            "Check for an existing CVE, then request via the right CNA",
          ],
          takeaway:
            "Write for the maintainer who must reproduce and patch: clear title, exact steps, root cause lines, and developer-language fixes.",
          diagram: {
            type: "process",
            title: "From finding to fixed",
            nodes: [
              { id: "sum", label: "Summary + title", emphasis: false },
              { id: "repro", label: "Reproduction steps", emphasis: true },
              { id: "rc", label: "Root cause", emphasis: true },
              { id: "fix", label: "Recommendations", emphasis: false },
              { id: "cve", label: "Disclose + CVE", emphasis: false },
            ],
            edges: [
              { from: "sum", to: "repro", label: "what" },
              { from: "repro", to: "rc", label: "confirm" },
              { from: "rc", to: "fix", label: "explain" },
              { from: "fix", to: "cve", label: "send" },
            ],
          },
          quiz: {
            question:
              "What belongs in the Root Cause section of a report?",
            options: [
              "Your full ROP chain and mitigation bypasses",
              "The key lines of code and why they are unsafe, hinting at sibling variants",
              "A demand for the bounty amount you expect",
              "The vendor's entire commit history",
            ],
            correctIndex: 1,
            explanation:
              "Root cause saves the developer from debugging it themselves: cite the responsible lines, explain the unsafe assumption, and note similar patterns - exploit fireworks belong elsewhere.",
          },
          flashcards: [
            {
              front: "Four sections of a vulnerability report",
              back: "Summary (title, version, impact, contact), Reproduction steps (env + PoC), Root cause (key code lines), Recommendations (developer-language fixes).",
            },
            {
              front: "Before requesting a CVE",
              back: "Check whether a record already exists (search NVD) and confirm the right CNA - vendor CNAs assign IDs for their own products.",
            },
          ],
          sourceRef: {
            label: "Chapter 10: Beyond Day Zero",
            pageStart: 303,
            pageEnd: 321,
            note: "Writing vulnerability reports (summary, repro, root cause, recommendations) and the CVE assignment process.",
            sectionIndexes: [15],
          },
          estimatedMinutes: 4,
        },
      ],
    },
  ],
};
