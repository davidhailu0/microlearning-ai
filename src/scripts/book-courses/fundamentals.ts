import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const fundamentalsCourse: DraftCourse = {
  title: "Fundamentals of Software Architecture",
  description: "A full-book distillation of Richards and Ford's modern classic: what architecture is, the three laws, characteristics and components, ten architecture styles, and the decisions, risk analysis, diagrams, and people skills that carry a system from idea to production. All 27 chapters.",
  category: "Software Engineering",
  level: "beginner",
  coverEmoji: "🏗️",
  tags: [
    "software architecture",
    "design patterns",
    "microservices",
    "trade-offs",
    "engineering leadership",
  ],
  modules: [
    {
      title: "Thinking Like an Architect",
      summary: "Chapters 1-2 and 9: the definition of software architecture, the three laws, the architect's job, architectural thinking versus design, and the styles/patterns vocabulary.",
      lessons: [
        {
          title: "What Software Architecture Actually Is",
          objective: "Describe the four dimensions of software architecture and why context shapes every architecture.",
          hook: "In 2002, proposing microservices would have meant buying 50 Windows licenses. Architecture is a product of its context - and of four dimensions.",
          paragraphs: [
            "Richards and Ford define software architecture along four dimensions: an architecture style as the starting point, the architecture characteristics the system must support (the '-ilities' that define success), the logical components that implement behavior (domains, entities, workflows), and the architecture decisions that justify how it all gets built. Architects analyze them roughly in that order: characteristics plus components tell you which style fits, and decisions record the rules - like restricting database access to the Business and Services layers.",
            "The second half of the definition is context. Late-20th-century architecture optimized for expensive shared infrastructure; microservices was inconceivable before open source and DevOps made per-service machinery affordable. All architectures are products of their environment - the book asks you to carry that lens through every chapter. It also frames the profession's durability: architects make exactly the trade-off decisions AI cannot, evaluating options inside complex, changing contexts with incomplete information.",
          ],
          bullets: [
            "Style + characteristics + logical components + decisions = the four dimensions",
            "Characteristics define capabilities; components define behavior",
            "Decisions are the constraints that tell teams what is and isn't allowed",
            "Every architecture is a product of its context - cost, tools, and era matter",
            "Architects analyze them roughly in that order: characteristics plus components tell you which style fits, and decisions record the rules - like restricting database access to the Business and Services layers.",
            "Late-20th-century architecture optimized for expensive shared infrastructure; microservices was inconceivable before open source and DevOps made per-service machinery affordable.",
          ],
          steps: [
            {
              title: "Define it for a real system",
              detail: "Pick a system you know and write its architecture as the set of structures, decisions, and constraints that are hard to change.",
            },
            {
              title: "List the structures",
              detail: "Draw the component, deployment, and data structures separately. Note which diagram answers which stakeholder question.",
            },
            {
              title: "Identify the decisions",
              detail: "Mark three choices that would be expensive to reverse. Explain the forces behind each.",
            },
          ],
          takeaway: "Architecture is the set of trade-off decisions - grounded in context - that determines what a system can do and how it may be built.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "style",
                from: "arch",
                label: "starting point",
              },
              {
                to: "char",
                from: "arch",
                label: "must support",
              },
              {
                to: "comp",
                from: "arch",
                label: "implements",
              },
              {
                to: "dec",
                from: "arch",
                label: "justifies",
              },
            ],
            nodes: [
              {
                id: "arch",
                label: "Software architecture",
                emphasis: true,
              },
              {
                id: "style",
                label: "Architecture style",
                emphasis: false,
              },
              {
                id: "char",
                label: "Characteristics (-ilities)",
                emphasis: false,
              },
              {
                id: "comp",
                label: "Logical components",
                emphasis: false,
              },
              {
                id: "dec",
                label: "Architecture decisions",
                emphasis: false,
              },
            ],
            title: "The four dimensions of software architecture",
          },
          quiz: {
            question: "According to the book's definition, which dimension of architecture records the rules for how a system should be constructed?",
            options: [
              "Architecture characteristics",
              "Logical components",
              "Architecture decisions",
              "The architecture style",
            ],
            correctIndex: 2,
            explanation: "Architecture decisions define constraints - for example, only Business and Services layers may access the database - and direct teams on what is and isn't allowed.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “What Software Architecture Actually Is”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "Three tests: strategic vs tactical, effort to change, significance of trade-offs",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Style + characteristics + logical components + decisions = the four dimensions”",
            },
            {
              question: "Which statement best explains “Four dimensions of software architecture”?",
              options: [
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
                "Know / know you don't know / don't know you don't know. Architects grow the middle layer - breadth beats depth.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.”",
            },
            {
              question: "Which of these is a hands-on step in “What Software Architecture Actually Is”?",
              options: [
                "Find the shared constraint",
                "Role-play the conflict",
                "Write the tradeoff memo",
                "Define it for a real system",
              ],
              correctIndex: 3,
              explanation: "“Define it for a real system” is part of this lesson's sequence: Pick a system you know and write its architecture as the set of structures, decisions, and constraints that are hard to change.",
            },
            {
              question: "What does the hands-on step “List the structures” involve?",
              options: [
                "Draw the component, deployment, and data structures separately. Note which diagram answers which stakeholder question.",
                "Record the options, the cost of each, and the recommendation. Get an explicit decision and owner.",
                "Take a stakeholder who wants speed and a developer who wants correctness. Write both positions fairly.",
                "Identify one place where an architectural decision creates an organizational problem, or the reverse.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “List the structures” as: Draw the component, deployment, and data structures separately. Note which diagram answers which stakeholder question.",
            },
          ],
          flashcards: [
            {
              front: "Four dimensions of software architecture",
              back: "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
            },
            {
              front: "Why context matters in architecture",
              back: "Architectures are products of their environment: microservices was unaffordable in 2002 and only became practical with open source and DevOps.",
            },
            {
              front: "How do you define it for a real system?",
              back: "Pick a system you know and write its architecture as the set of structures, decisions, and constraints that are hard to change.",
            },
            {
              front: "How do you identify the decisions?",
              back: "Mark three choices that would be expensive to reverse. Explain the forces behind each.",
            },
            {
              front: "How do you list the structures?",
              back: "Draw the component, deployment, and data structures separately. Note which diagram answers which stakeholder question.",
            },
          ],
          sourceRef: {
            label: "Chapter 1. Introduction",
            pageStart: null,
            pageEnd: null,
            note: "Defining software architecture: the four dimensions and the role of context.",
            sectionIndexes: [
              0,
              1,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "The Three Laws of Software Architecture",
          objective: "State the three laws and their corollaries and apply them to a real decision.",
          hook: "The authors hoped to find 10-15 universal truths. After two editions they found three. Here they are.",
          paragraphs: [
            "First Law: everything in software architecture is a trade-off. Nothing exists on a clean spectrum, and if you think you've found something that isn't a trade-off, you just haven't identified it yet (Corollary 1). You also can't run one Big Trade-off Jamboree and be done - trade-off analysis must be repeated for every situation (Corollary 2). Second Law: why is more important than how - you can often reconstruct how a system works, but the trade-offs behind a decision are the hard-won part. Third Law: most architecture decisions aren't binary; they exist on a spectrum between extremes.",
            "The laws are operational, not decorative. In Chapter 27 the authors return to them with worked analyses (shared library versus shared service, synchronous versus asynchronous messaging) and warn against two failure modes: becoming an evangelist for yesterday's best practice - which tends to become tomorrow's antipattern - and treating decisions as one-time events. Instead, build a reputation as an objective arbiter of trade-offs: decision makers want sober objectivity they can trust when the stakes are high.",
          ],
          bullets: [
            "Law 1: everything is a trade-off - and you re-analyze constantly",
            "Law 2: why beats how; record the reasoning, not just the choice",
            "Law 3: decisions are spectrums, not binaries",
            "Evangelize nothing: best practices age into antipatterns",
            "Nothing exists on a clean spectrum, and if you think you've found something that isn't a trade-off, you just haven't identified it yet (Corollary 1).",
            "Instead, build a reputation as an objective arbiter of trade-offs: decision makers want sober objectivity they can trust when the stakes are high.",
          ],
          steps: [
            {
              title: "Find a real tradeoff",
              detail: "Choose a system and show one decision that improved performance but hurt maintainability, or the reverse.",
            },
            {
              title: "Show why there is no free lunch",
              detail: "List the benefit, the cost, and who pays it. Explain why the alternative also has a cost.",
            },
            {
              title: "Rank the tradeoff",
              detail: "Decide whether the tradeoff was worth it for that context. Write the conditions under which you would reverse it.",
            },
          ],
          takeaway: "Your real product as an architect is trusted trade-off analysis - repeated over time, documented with its reasoning.",
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
                label: "Find a real tradeoff",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Show why there is no free lunch",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Rank the tradeoff",
                emphasis: true,
              },
            ],
            title: "How The Three Laws of Software Architecture works",
          },
          quiz: {
            question: "A colleague claims they found an architecture decision with no downsides. What do the laws say?",
            options: [
              "They have found an ideal architecture",
              "The trade-off simply hasn't been identified yet (Corollary 1)",
              "The decision is therefore binary",
              "Trade-off analysis only applies to distributed systems",
            ],
            correctIndex: 1,
            explanation: "Corollary 1: 'If you think you've discovered something that isn't a trade-off, more likely you just haven't identified the trade-off...yet.'",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “The Three Laws of Software Architecture”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "Three tests: strategic vs tactical, effort to change, significance of trade-offs",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Law 1: everything is a trade-off - and you re-analyze constantly”",
            },
            {
              question: "Which statement best explains “First Law of Software Architecture”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Know / know you don't know / don't know you don't know. Architects grow the middle layer - breadth beats depth.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.”",
            },
            {
              question: "Which of these is a hands-on step in “The Three Laws of Software Architecture”?",
              options: [
                "Find the mud",
                "Propose seams",
                "Break one cycle",
                "Find a real tradeoff",
              ],
              correctIndex: 3,
              explanation: "“Find a real tradeoff” is part of this lesson's sequence: Choose a system and show one decision that improved performance but hurt maintainability, or the reverse.",
            },
            {
              question: "What does the hands-on step “Show why there is no free lunch” involve?",
              options: [
                "List the benefit, the cost, and who pays it. Explain why the alternative also has a cost.",
                "Draw a central orchestrator calling many services with shared contracts. Mark the single point of failure and the coupling.",
                "Identify long release cycles, chatty calls, and shared data. Explain how each follows from the orchestration model.",
                "Suggest two services that could merge or an event that could replace a synchronous call. Estimate the reduction in coupling.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Show why there is no free lunch” as: List the benefit, the cost, and who pays it. Explain why the alternative also has a cost.",
            },
          ],
          flashcards: [
            {
              front: "First Law of Software Architecture",
              back: "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
            },
            {
              front: "Second and Third Laws",
              back: "Second: why is more important than how. Third: most decisions aren't binary - they exist on a spectrum between extremes.",
            },
            {
              front: "How do you find a real tradeoff?",
              back: "Choose a system and show one decision that improved performance but hurt maintainability, or the reverse.",
            },
            {
              front: "How do you rank the tradeoff?",
              back: "Decide whether the tradeoff was worth it for that context. Write the conditions under which you would reverse it.",
            },
            {
              front: "How do you show why there is no free lunch?",
              back: "List the benefit, the cost, and who pays it. Explain why the alternative also has a cost.",
            },
          ],
          sourceRef: {
            label: "Chapter 1. Introduction → Chapter 27. The Laws of Software Architecture, Revisited",
            pageStart: null,
            pageEnd: null,
            note: "The three laws, their corollaries, and why architects must be objective arbiters of trade-offs.",
            sectionIndexes: [
              0,
              1,
              52,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "What Architects Are Expected to Do",
          objective: "List the eight core expectations of a software architect and what each requires.",
          hook: "The role ranges from expert programmer to company strategist - so the authors pin it down with eight expectations instead of a job title.",
          paragraphs: [
            "The eight expectations: make architecture decisions (guide technology choices rather than specify them - 'use a reactive framework' not 'use React'); continually analyze the architecture, watching for structural decay and remembering that agility dies if testing and releases take weeks; keep current with trends, because architectural decisions are long-lived; ensure compliance with decisions, or UI developers will wire the presentation layer straight to the database and quietly destroy your isolation.",
            "The people half of the list matters just as much: understand diverse technologies (breadth over depth - knowing the pros and cons of ten caching products beats expert knowledge of one), know the business domain (you can't design for a bank without speaking its language), possess interpersonal and leadership skills (Weinberg: 'No matter what they tell you, it's always a people problem' - leadership is at least half the job), and understand and navigate organizational politics.",
            "That last one is the shock for ex-developers: almost every architectural decision gets challenged - a CRM architect restricting database access suddenly faces product owners, project managers, and other teams objecting to the cost.",
          ],
          bullets: [
            "Guide rather than specify; analyze continuously; stay current; enforce compliance",
            "Breadth over depth across technologies",
            "Business-domain fluency earns credibility with stakeholders",
            "Leadership and politics: most decisions must be justified and won",
            "That last one is the shock for ex-developers: almost every architectural decision gets challenged - a CRM architect restricting database access suddenly faces product owners, project managers, and other teams objecting to the cost.",
            "Architects translate business goals into technical direction and explain trade-offs in language both engineers and executives can act on.",
          ],
          steps: [
            {
              title: "Write the role charter",
              detail: "List the architect's responsibilities across discovery, design, delivery, and operations. Keep it to one page.",
            },
            {
              title: "Map the stakeholders",
              detail: "Identify business, development, operations, and security stakeholders. Note what each needs from the architecture.",
            },
            {
              title: "Define the deliverables",
              detail: "Choose the artifacts you will produce: diagrams, ADRs, fitness functions, and a risk register. Say when each is due.",
            },
          ],
          takeaway: "Half the architect's job is technical direction; the other half is persuading an organization to follow it.",
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
                label: "Write the role charter",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Map the stakeholders",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Define the deliverables",
                emphasis: true,
              },
            ],
            title: "How What Architects Are Expected to Do works",
          },
          quiz: {
            question: "Which of these is most consistent with the 'make architecture decisions' expectation?",
            options: [
              "Mandating React for all frontend work",
              "Guiding teams to choose a reactive-based framework themselves",
              "Writing pseudocode for every class",
              "Approving every pull request personally",
            ],
            correctIndex: 1,
            explanation: "Architects should guide technology choices, not make them - unless a specific choice is needed to preserve a characteristic like scalability or availability.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “What Architects Are Expected to Do”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "Three tests: strategic vs tactical, effort to change, significance of trade-offs",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Guide rather than specify; analyze continuously; stay current; enforce compliance”",
            },
            {
              question: "Which statement best explains “The eight expectations of an architect”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Know / know you don't know / don't know you don't know. Architects grow the middle layer - breadth beats depth.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.”",
            },
            {
              question: "Which of these is a hands-on step in “What Architects Are Expected to Do”?",
              options: [
                "Score two options",
                "Write the recommendation",
                "Define it for a real system",
                "Write the role charter",
              ],
              correctIndex: 3,
              explanation: "“Write the role charter” is part of this lesson's sequence: List the architect's responsibilities across discovery, design, delivery, and operations. Keep it to one page.",
            },
            {
              question: "What does the hands-on step “Map the stakeholders” involve?",
              options: [
                "Identify business, development, operations, and security stakeholders. Note what each needs from the architecture.",
                "Decide whether the tradeoff was worth it for that context. Write the conditions under which you would reverse it.",
                "List the benefit, the cost, and who pays it. Explain why the alternative also has a cost.",
                "Explain the decision, the forces, the alternatives, and the consequence in under 300 words.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Map the stakeholders” as: Identify business, development, operations, and security stakeholders. Note what each needs from the architecture.",
            },
          ],
          flashcards: [
            {
              front: "The eight expectations of an architect",
              back: "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
            },
            {
              front: "Architecture vitality / structural decay",
              back: "How viable a 3+ year old architecture remains; decay happens when code changes erode required characteristics - hence continual analysis.",
            },
            {
              front: "How do you write the role charter?",
              back: "List the architect's responsibilities across discovery, design, delivery, and operations. Keep it to one page.",
            },
            {
              front: "How do you define the deliverables?",
              back: "Choose the artifacts you will produce: diagrams, ADRs, fitness functions, and a risk register. Say when each is due.",
            },
            {
              front: "How do you map the stakeholders?",
              back: "Identify business, development, operations, and security stakeholders. Note what each needs from the architecture.",
            },
          ],
          sourceRef: {
            label: "Chapter 1. Introduction",
            pageStart: null,
            pageEnd: null,
            note: "Expectations of an architect - all eight core expectations.",
            sectionIndexes: [
              0,
              1,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Architectural Thinking: Design, Breadth, and the Caveman Trap",
          objective: "Distinguish architecture from design and explain why technical breadth matters more than depth.",
          hook: "Architecture is the structure of the house; design is the carpet. Knowing which is which tells you who decides.",
          paragraphs: [
            "Architecture is structure, design is appearance - but most decisions fall on a spectrum, so the book offers three tests: is the decision strategic or tactical (long-term with many stakeholders = architectural)? What's the level of effort to change (Fowler: architecture is 'the stuff that's hard to change')? And how significant are the trade-offs (microservices' trade-offs are huge; splitting a class file's are not)? These criteria locate responsibility: rearranging screen fields is design; moving a monolith to microservices is architecture.",
            "Architects also need breadth, not depth. The knowledge pyramid sorts what you know, what you know you don't know, and what you don't know you don't know - an architect's value is expanding the middle layer, letting expertise at the top usefully atrophy. The 20-minute rule operationalizes it: 20 minutes each morning, before email, on something new (InfoQ, DZone, the Thoughtworks Technology Radar). The failure mode is the Frozen Caveman antipattern: architects relitigating their pet past trauma - 'But what if we lose Italy?' - on every decision. Risk assessment must be realistic, not fossilized.",
          ],
          bullets: [
            "Three tests: strategic vs tactical, effort to change, significance of trade-offs",
            "Architecture is structure; design is appearance - but the line is a spectrum",
            "Breadth = know you don't know; 20 minutes every morning before email",
            "Frozen Caveman: don't rebuild past obsessions into every decision",
            "Architecture is structure, design is appearance - but most decisions fall on a spectrum, so the book offers three tests: is the decision strategic or tactical (long-term with many stakeholders = architectural)?",
            "The failure mode is the Frozen Caveman antipattern: architects relitigating their pet past trauma - 'But what if we lose Italy?' - on every decision.",
          ],
          steps: [
            {
              title: "Separate design from architecture",
              detail: "Take one feature and list its local design choices versus the architectural constraints it must respect.",
            },
            {
              title: "Spot the caveman trap",
              detail: "Find a decision made from habit rather than context. Rewrite it as an explicit tradeoff with alternatives.",
            },
            {
              title: "Write the memo",
              detail: "Explain the decision, the forces, the alternatives, and the consequence in under 300 words.",
            },
          ],
          takeaway: "Judge decisions by effort and trade-off significance, and invest daily in expanding what you know you don't know.",
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
                label: "Separate design from architecture",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Spot the caveman trap",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Write the memo",
                emphasis: true,
              },
            ],
            title: "How Architectural Thinking: Design, Breadth, and the Caveman Trap works",
          },
          quiz: {
            question: "Which question best locates a decision on the architecture-versus-design spectrum?",
            options: [
              "Is the decision written in the coding standards?",
              "How hard is it to change, and how significant are its trade-offs?",
              "Was it made by a senior developer?",
              "Does it involve a database?",
            ],
            correctIndex: 1,
            explanation: "Level of effort (Fowler's 'hard to change') and trade-off significance are two of the book's three criteria; strategic-vs-tactical is the third.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Architectural Thinking: Design, Breadth, and the Caveman Trap”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "Three tests: strategic vs tactical, effort to change, significance of trade-offs",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Three tests: strategic vs tactical, effort to change, significance of trade-offs”",
            },
            {
              question: "Which statement best explains “Knowledge pyramid for architects”?",
              options: [
                "Know / know you don't know / don't know you don't know. Architects grow the middle layer - breadth beats depth.",
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Know / know you don't know / don't know you don't know. Architects grow the middle layer - breadth beats depth.”",
            },
            {
              question: "Which of these is a hands-on step in “Architectural Thinking: Design, Breadth, and the Caveman Trap”?",
              options: [
                "Define the deliverables",
                "Map the stakeholders",
                "Write the role charter",
                "Separate design from architecture",
              ],
              correctIndex: 3,
              explanation: "“Separate design from architecture” is part of this lesson's sequence: Take one feature and list its local design choices versus the architectural constraints it must respect.",
            },
            {
              question: "What does the hands-on step “Spot the caveman trap” involve?",
              options: [
                "Find a decision made from habit rather than context. Rewrite it as an explicit tradeoff with alternatives.",
                "Write the interface a plug-in must implement, including lifecycle and error handling. Keep the core independent of concrete plug-ins.",
                "Build REST or RPC endpoints for the contracts. Add timeouts and a clear error shape.",
                "Divide a small app into two or three services with clear data ownership. Define the synchronous contracts between them.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Spot the caveman trap” as: Find a decision made from habit rather than context. Rewrite it as an explicit tradeoff with alternatives.",
            },
          ],
          flashcards: [
            {
              front: "Frozen Caveman antipattern",
              back: "An architect who reverts to a pet past concern for every decision (e.g. 'But what if we lose Italy?') instead of realistic risk assessment.",
            },
            {
              front: "Knowledge pyramid for architects",
              back: "Know / know you don't know / don't know you don't know. Architects grow the middle layer - breadth beats depth.",
            },
            {
              front: "How do you spot the caveman trap?",
              back: "Find a decision made from habit rather than context. Rewrite it as an explicit tradeoff with alternatives.",
            },
            {
              front: "How do you separate design from architecture?",
              back: "Take one feature and list its local design choices versus the architectural constraints it must respect.",
            },
            {
              front: "How do you write the memo?",
              back: "Explain the decision, the forces, the alternatives, and the consequence in under 300 words.",
            },
          ],
          sourceRef: {
            label: "Chapter 2. Architectural Thinking",
            pageStart: null,
            pageEnd: null,
            note: "Architecture versus design criteria, technical breadth, the 20-minute rule, and the Frozen Caveman antipattern.",
            sectionIndexes: [
              2,
              3,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Styles, Patterns, and the Big Ball of Mud",
          objective: "Differentiate architectural styles from patterns and recognize the absence of architecture.",
          hook: "A style is a named topology with assumptions baked in. A pattern is a contextualized solution. Confusing them is how projects drift into mud.",
          paragraphs: [
            "An architectural style bundles a lot of understood detail into one name: how components and dependencies are organized (technical vs domain partitioning), the physical architecture it implies (monolithic vs distributed), granularity and deployment cadence, how components communicate (method calls vs REST vs queues), and its data topology (one database vs database-per-service). Naming a style lets architects shorthand all of that. Patterns are different: contextualized solutions to problems, inspired by Design Patterns - and calling something a 'best practice' wrongly implies you must always use it.",
            "Styles aren't decreed by an ivory-tower cabal; they emerge from the ecosystem and get named when common enough to discuss - microservices is a label, not a commandment to build the smallest services possible. At the other pole sits the Big Ball of Mud: the absence of discernible structure, where information is shared promiscuously and change has unpredictable rippling side effects - the fate of projects that start with 'just start coding' (Architecture by Implication).",
            "The chapter also walks the historical line from unitary architectures to client/server variants (desktop/db, browser/web, single-page JavaScript), and warns about the network fallacies: the network is not reliable, latency is not zero, bandwidth is not infinite, and the network is not secure.",
          ],
          bullets: [
            "Style = topology + physical + deployment + communication + data assumptions",
            "Pattern = contextualized solution; 'best practice' wrongly shuts down judgment",
            "Styles emerge from the ecosystem - names are labels, not commandments",
            "Big Ball of Mud: unregulated growth with unpredictable change costs",
            "Patterns are different: contextualized solutions to problems, inspired by Design Patterns - and calling something a 'best practice' wrongly implies you must always use it.",
            "Styles aren't decreed by an ivory-tower cabal; they emerge from the ecosystem and get named when common enough to discuss - microservices is a label, not a commandment to build the smallest services possible.",
          ],
          steps: [
            {
              title: "Catalog three systems",
              detail: "For three systems you know, name the dominant architecture style and the patterns visible in the code.",
            },
            {
              title: "Find the mud",
              detail: "Identify one area with no clear boundaries. List the symptoms: shared tables, cyclic dependencies, or unclear ownership.",
            },
            {
              title: "Propose seams",
              detail: "Suggest two boundaries that could be introduced incrementally. Explain what would move behind each.",
            },
          ],
          takeaway: "Learn the vocabulary - styles bundle structural assumptions, patterns solve contextual problems, and mud is what happens without either.",
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
                label: "Catalog three systems",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Find the mud",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Propose seams",
                emphasis: true,
              },
            ],
            title: "How Styles, Patterns, and the Big Ball of Mud works",
          },
          quiz: {
            question: "What is the key difference between an architectural style and an architectural pattern?",
            options: [
              "Styles are always distributed; patterns are always monolithic",
              "Styles are named topologies with structural assumptions; patterns are contextualized solutions to problems",
              "Patterns only apply to microservices",
              "There is no difference - the terms are interchangeable",
            ],
            correctIndex: 1,
            explanation: "Chapter 9 draws the line explicitly: a style describes topology, deployment, communication, and data assumptions; a pattern captures a contextualized solution.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Styles, Patterns, and the Big Ball of Mud”?",
              options: [
                "Style = topology + physical + deployment + communication + data assumptions",
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Style = topology + physical + deployment + communication + data assumptions”",
            },
            {
              question: "Which statement best explains “Big Ball of Mud”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Haphazard, sprawling structure from unregulated growth and repeated expedient repair; everything coupled to everything, so change has rippling side effects.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Haphazard, sprawling structure from unregulated growth and repeated expedient repair; everything coupled to everything, so change has rippling side effects.”",
            },
            {
              question: "Which of these is a hands-on step in “Styles, Patterns, and the Big Ball of Mud”?",
              options: [
                "Put it in CI",
                "Write a fitness function",
                "Identify the quanta",
                "Catalog three systems",
              ],
              correctIndex: 3,
              explanation: "“Catalog three systems” is part of this lesson's sequence: For three systems you know, name the dominant architecture style and the patterns visible in the code.",
            },
            {
              question: "What does the hands-on step “Find the mud” involve?",
              options: [
                "Identify one area with no clear boundaries. List the symptoms: shared tables, cyclic dependencies, or unclear ownership.",
                "Create modules with explicit public interfaces and private internals. Hide the database schema behind each module.",
                "Move a module behind an HTTP or in-process boundary. Measure the change in deployment and latency.",
                "Implement three filters for parsing, transforming, and writing log lines. Connect them with a simple pipe.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Find the mud” as: Identify one area with no clear boundaries. List the symptoms: shared tables, cyclic dependencies, or unclear ownership.",
            },
          ],
          flashcards: [
            {
              front: "Big Ball of Mud",
              back: "Haphazard, sprawling structure from unregulated growth and repeated expedient repair; everything coupled to everything, so change has rippling side effects.",
            },
            {
              front: "Four network fallacies (Bethe/Gabler) as used in ch. 9",
              back: "The network is reliable; latency is zero; bandwidth is infinite; the network is secure - plus topology/admin/transport-cost/homogeneity variants.",
            },
            {
              front: "How do you propose seams?",
              back: "Suggest two boundaries that could be introduced incrementally. Explain what would move behind each.",
            },
            {
              front: "How do you catalog three systems?",
              back: "For three systems you know, name the dominant architecture style and the patterns visible in the code.",
            },
            {
              front: "How do you find the mud?",
              back: "Identify one area with no clear boundaries. List the symptoms: shared tables, cyclic dependencies, or unclear ownership.",
            },
          ],
          sourceRef: {
            label: "Chapter 9. Foundations",
            pageStart: null,
            pageEnd: null,
            note: "Styles versus patterns, where styles come from, Big Ball of Mud, unitary/client-server history, and network fallacies.",
            sectionIndexes: [
              13,
              14,
              15,
            ],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Structural Foundations: Modularity, Characteristics, Components",
      summary: "Chapters 3-8: measuring modularity, defining and finding architectural characteristics, governing them with fitness functions, scoping with architecture quanta, and designing logical components.",
      lessons: [
        {
          title: "Modularity and the Metrics of Code",
          objective: "Define modularity and apply cohesion, coupling, distance from the main sequence, and connascence.",
          hook: "95% of words about software extol modularity; almost none say how to achieve it. The book answers with three metrics.",
          paragraphs: [
            "Modularity is a logical grouping of related code (classes, functions, namespaces) - a logical, not necessarily physical, separation. Keep it distinct from granularity: modularity is breaking systems apart, granularity is how big the pieces get. The authors' warning: 'Embrace modularity, but beware of granularity' - wrong-sized pieces produce Spaghetti Architecture, Distributed Monoliths, and Big Ball of Distributed Mud.",
            "To measure modularity the book leans on three language-agnostic concepts. Cohesion is how related a module's parts are, ranked from functional (everything belongs together) down through sequential, communicational, logical, temporal, and coincidental (unrelated code sharing a file) - dividing a cohesive module only increases coupling and hurts readability. Coupling is how much modules depend on each other: two things are coupled if changing one might break the other.",
            "Connascence is a deeper taxonomy of 'co-change' relationships, and Distance from the Main Sequence (from Robert Glass's stability/plasticity plot) gives an objective measure: components should sit near the line, not drift into the unstable-yet-rigid corners.",
          ],
          bullets: [
            "Modularity = logical grouping; granularity = size of the pieces",
            "Cohesion ranks from functional to coincidental - higher is better",
            "Coupling: if changing one thing might break another, they're coupled",
            "Distance from the Main Sequence: keep components near the line",
            "The authors' warning: 'Embrace modularity, but beware of granularity' - wrong-sized pieces produce Spaghetti Architecture, Distributed Monoliths, and Big Ball of Distributed Mud.",
            "Coupling is how much modules depend on each other: two things are coupled if changing one might break the other.",
          ],
          steps: [
            {
              title: "Compute coupling",
              detail: "For one module, count afferent and efferent dependencies. Calculate instability as efferent divided by total coupling.",
            },
            {
              title: "Draw the graph",
              detail: "Build a dependency graph for ten modules. Mark cycles and the modules with the highest fan-in.",
            },
            {
              title: "Break one cycle",
              detail: "Introduce an interface or move a shared type to break a cycle. Recompute the metrics and show the change.",
            },
          ],
          takeaway: "Modularity is an organizing principle you must actively maintain - entropy wins unless cohesion and coupling are measured and governed.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "grn",
                from: "mod",
                label: "must balance",
              },
              {
                to: "risk",
                from: "grn",
                label: "too fine / too coarse",
              },
            ],
            nodes: [
              {
                id: "mod",
                label: "Modularity: how you split",
                emphasis: false,
              },
              {
                id: "grn",
                label: "Granularity: how big the pieces are",
                emphasis: true,
              },
              {
                id: "risk",
                label: "Wrong size → distributed mud",
                emphasis: false,
              },
            ],
            title: "Modularity vs granularity",
          },
          quiz: {
            question: "Which statement correctly distinguishes modularity from granularity?",
            options: [
              "They are interchangeable terms for component design",
              "Modularity is about breaking systems apart; granularity is about the size of the pieces",
              "Granularity only applies to databases",
              "Modularity is measurable; granularity is not",
            ],
            correctIndex: 1,
            explanation: "The book separates them sharply: 'Embrace modularity, but beware of granularity' - wrong granularity creates Spaghetti Architecture and Distributed Monoliths.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Modularity and the Metrics of Code”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Modularity = logical grouping; granularity = size of the pieces",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Modularity = logical grouping; granularity = size of the pieces”",
            },
            {
              question: "Which statement best explains “Cohesion (best to worst)”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Functional → sequential → communicational → logical → temporal → coincidental. Dividing a cohesive module only raises coupling.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Functional → sequential → communicational → logical → temporal → coincidental. Dividing a cohesive module only raises coupling.”",
            },
            {
              question: "Which of these is a hands-on step in “Modularity and the Metrics of Code”?",
              options: [
                "Diagram the anti-pattern",
                "List the symptoms",
                "Propose a simplification",
                "Compute coupling",
              ],
              correctIndex: 3,
              explanation: "“Compute coupling” is part of this lesson's sequence: For one module, count afferent and efferent dependencies. Calculate instability as efferent divided by total coupling.",
            },
            {
              question: "What does the hands-on step “Draw the graph” involve?",
              options: [
                "Build a dependency graph for ten modules. Mark cycles and the modules with the highest fan-in.",
                "List the architect's responsibilities across discovery, design, delivery, and operations. Keep it to one page.",
                "Explain the decision, the forces, the alternatives, and the consequence in under 300 words.",
                "Find a decision made from habit rather than context. Rewrite it as an explicit tradeoff with alternatives.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Draw the graph” as: Build a dependency graph for ten modules. Mark cycles and the modules with the highest fan-in.",
            },
          ],
          flashcards: [
            {
              front: "Connascence",
              back: "A taxonomy of co-change: names, types, meaning, position, and more - the degree to which code must change together.",
            },
            {
              front: "Cohesion (best to worst)",
              back: "Functional → sequential → communicational → logical → temporal → coincidental. Dividing a cohesive module only raises coupling.",
            },
            {
              front: "How do you compute coupling?",
              back: "For one module, count afferent and efferent dependencies. Calculate instability as efferent divided by total coupling.",
            },
            {
              front: "How do you draw the graph?",
              back: "Build a dependency graph for ten modules. Mark cycles and the modules with the highest fan-in.",
            },
            {
              front: "How do you break one cycle?",
              back: "Introduce an interface or move a shared type to break a cycle. Recompute the metrics and show the change.",
            },
          ],
          sourceRef: {
            label: "Chapter 3. Modularity",
            pageStart: null,
            pageEnd: null,
            note: "Modularity vs granularity, cohesion levels, coupling, core metrics, distance from the main sequence, connascence.",
            sectionIndexes: [
              4,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Architectural Characteristics Defined",
          objective: "Apply the three criteria for a characteristic and categorize explicit versus implicit and operational versus structural.",
          hook: "Nobody writes 'prevent technical debt' in a requirements document - yet it shapes every design. Meet architectural characteristics.",
          paragraphs: [
            "To count as an architectural characteristic, a requirement must (1) specify a nondomain design consideration, (2) influence some structural aspect of the design, and (3) be critical to the application's success. Domain = behavior; characteristics = capabilities. The authors reject 'non-functional requirements' (self-denigrating: who champions something non-functional?) and 'quality attributes' (implies after-the-fact assessment), preferring architectural characteristics - capabilities of the system.",
            "Two distinctions matter. Explicit characteristics appear in requirements (expected user counts); implicit ones rarely appear yet underpin success - availability, reliability, security - and must be excavated from domain knowledge (a medical-software architect already knows data integrity is life-critical). And not everything needs structural treatment: security in a monolith may be good coding hygiene, while in microservices it demands hardened structure; scalability, however, no amount of clever design gives a monolith.",
            "The book also insists on restraint: every characteristic adds complexity, so choose the fewest possible. Categories span operational (performance, scalability, elasticity, availability, reliability), structural (modularity, maintainability, extensibility), cloud (on-demand scaling, zone/region properties), and cross-cutting (accessibility, authentication, authorization).",
          ],
          bullets: [
            "Three criteria: nondomain, structural influence, critical to success",
            "Explicit vs implicit: the -ilities you must discover from the domain",
            "Design vs structure: security can be hygiene; scalability cannot",
            "Fewest possible characteristics - each one adds complexity",
            "To count as an architectural characteristic, a requirement must (1) specify a nondomain design consideration, (2) influence some structural aspect of the design, and (3) be critical to the application's success.",
            "The authors reject 'non-functional requirements' (self-denigrating: who champions something non-functional?)",
          ],
          steps: [
            {
              title: "Define ten characteristics",
              detail: "Write one-sentence definitions for availability, scalability, performance, security, and six others.",
            },
            {
              title: "Make them measurable",
              detail: "For three characteristics, define a metric, target, and measurement method. Avoid adjectives without numbers.",
            },
            {
              title: "Pick three",
              detail: "Choose the three that matter most for a sample system. Explain why the others are lower priority.",
            },
          ],
          takeaway: "A characteristic earns its place only if it's nondomain, structural, and critical - then you must decide whether it needs structure or just design.",
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
                label: "Define ten characteristics",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Make them measurable",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Pick three",
                emphasis: true,
              },
            ],
            title: "How Architectural Characteristics Defined works",
          },
          quiz: {
            question: "Which requirement most clearly qualifies as an architectural characteristic?",
            options: [
              "The system must support CSV export",
              "The UI must use the brand color palette",
              "The system must sustain 10,000 concurrent users at peak",
              "The admin screen must list users alphabetically",
            ],
            correctIndex: 2,
            explanation: "Sustained concurrency is nondomain, influences structural decisions, and is critical to success - all three criteria. The others are domain behavior or mere design.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Architectural Characteristics Defined”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Three criteria: nondomain, structural influence, critical to success",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Three criteria: nondomain, structural influence, critical to success”",
            },
            {
              question: "Which statement best explains “Three criteria of an architectural characteristic”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
                "1) nondomain design consideration, 2) influences structural design, 3) critical/important to the application's success.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “1) nondomain design consideration, 2) influences structural design, 3) critical/important to the application's success.”",
            },
            {
              question: "Which of these is a hands-on step in “Architectural Characteristics Defined”?",
              options: [
                "Propose seams",
                "Break one cycle",
                "Compute coupling",
                "Define ten characteristics",
              ],
              correctIndex: 3,
              explanation: "“Define ten characteristics” is part of this lesson's sequence: Write one-sentence definitions for availability, scalability, performance, security, and six others.",
            },
            {
              question: "What does the hands-on step “Make them measurable” involve?",
              options: [
                "For three characteristics, define a metric, target, and measurement method. Avoid adjectives without numbers.",
                "Score impact and likelihood for each mark. Group duplicates and keep the top five.",
                "Ask someone unfamiliar to explain the diagram back. Fix any arrow or box they cannot justify.",
                "Show deployable units, databases, and protocols. Label every arrow with the protocol and direction.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Make them measurable” as: For three characteristics, define a metric, target, and measurement method. Avoid adjectives without numbers.",
            },
          ],
          flashcards: [
            {
              front: "Three criteria of an architectural characteristic",
              back: "1) nondomain design consideration, 2) influences structural design, 3) critical/important to the application's success.",
            },
            {
              front: "Explicit vs implicit characteristics",
              back: "Explicit: stated in requirements (user counts). Implicit: rarely specified but necessary (availability, reliability, security) - found via domain knowledge.",
            },
            {
              front: "How do you make them measurable?",
              back: "For three characteristics, define a metric, target, and measurement method. Avoid adjectives without numbers.",
            },
            {
              front: "How do you define ten characteristics?",
              back: "Write one-sentence definitions for availability, scalability, performance, security, and six others.",
            },
            {
              front: "How do you pick three?",
              back: "Choose the three that matter most for a sample system. Explain why the others are lower priority.",
            },
          ],
          sourceRef: {
            label: "Chapter 4. Architectural Characteristics Defined",
            pageStart: null,
            pageEnd: null,
            note: "Definition criteria, NFR terminology history, explicit/implicit, and the four characteristic categories.",
            sectionIndexes: [
              5,
              6,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Finding the Right Characteristics",
          objective: "Translate domain concerns into -ilities and decompose composite characteristics.",
          hook: "Stakeholders say 'user satisfaction.' Architects hear 'performance, availability, fault tolerance, testability...' Translation is the job.",
          paragraphs: [
            "Architects and domain stakeholders speak different languages, causing a lost-in-translation problem: you can't build 'user satisfaction,' and they don't know why you care about fault tolerance. The book's table maps concerns to characteristics: mergers and acquisitions → interoperability, scalability, adaptability; time to market → agility, testability, deployability; user satisfaction → performance, availability, fault tolerance, testability, deployability, agility, security; competitive advantage adds scalability; time and budget → simplicity and feasibility.",
            "The trap is false equivalence: agility has no single measurable definition - it's a composite of deployability, modularity, testability, and more. The end-of-day fund pricing example shows why focusing only on performance fails: it must also be available at close, scale as funds grow, be reliable mid-run, recover from an 85%-complete crash, and produce correct (auditable) prices. Decompose composites into measurable parts. And don't forget implicit domain knowledge: designing university registration, you should assume all 1,000 students register in the final ten minutes - a fact no requirements document contains.",
            "Architecture katas practice exactly this translation.",
          ],
          bullets: [
            "Translate domain concerns to -ilities with the mapping table",
            "Composites (agility) must be decomposed into measurable constituents",
            "Domain knowledge fills gaps requirements never state",
            "Katas: practice the translation on scoped problems",
            "The end-of-day fund pricing example shows why focusing only on performance fails: it must also be available at close, scale as funds grow, be reliable mid-run, recover from an 85%-complete crash, and produce correct (auditable) prices.",
            "And don't forget implicit domain knowledge: designing university registration, you should assume all 1,000 students register in the final ten minutes - a fact no requirements document contains.",
          ],
          steps: [
            {
              title: "Interview a stakeholder",
              detail: "Ask what success looks like and what failure costs. Turn the answers into candidate characteristics.",
            },
            {
              title: "Rank them",
              detail: "Score each candidate by business importance and technical risk. Keep the top five.",
            },
            {
              title: "Validate the list",
              detail: "Review the five with a developer and an operator. Remove any that cannot be measured or do not change a decision.",
            },
          ],
          takeaway: "Your first deliverable is a shared, decomposed vocabulary of characteristics that both stakeholders and engineers can measure.",
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
                label: "Interview a stakeholder",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Rank them",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Validate the list",
                emphasis: true,
              },
            ],
            title: "How Finding the Right Characteristics works",
          },
          quiz: {
            question: "A stakeholder says 'we need agility because time to market is critical.' What should the architect do?",
            options: [
              "Add 'agility' as a single measurable requirement",
              "Decompose agility into deployability, testability, modularity, and related measurable characteristics",
              "Ignore it - agility is not an architectural concern",
              "Replace it with performance testing",
            ],
            correctIndex: 1,
            explanation: "Agility is a composite characteristic: no objective single definition exists, so it must be broken into constituents that can actually be measured.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Finding the Right Characteristics”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "Translate domain concerns to -ilities with the mapping table",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Translate domain concerns to -ilities with the mapping table”",
            },
            {
              question: "Which statement best explains “Composite architectural characteristic”?",
              options: [
                "One with no single objective definition, composed of other measurable things - e.g. agility = deployability + modularity + testability +...",
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “One with no single objective definition, composed of other measurable things - e.g. agility = deployability + modularity + testability +...”",
            },
            {
              question: "Which of these is a hands-on step in “Finding the Right Characteristics”?",
              options: [
                "Write the tradeoff memo",
                "Find the friction",
                "Map the intersections",
                "Interview a stakeholder",
              ],
              correctIndex: 3,
              explanation: "“Interview a stakeholder” is part of this lesson's sequence: Ask what success looks like and what failure costs. Turn the answers into candidate characteristics.",
            },
            {
              question: "What does the hands-on step “Rank them” involve?",
              options: [
                "Score each candidate by business importance and technical risk. Keep the top five.",
                "Suggest one boundary or platform service that would reduce load. State the tradeoff and the migration cost.",
                "Identify the outcome both sides need. Reframe the decision around that outcome rather than either preference.",
                "Record the options, the cost of each, and the recommendation. Get an explicit decision and owner.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Rank them” as: Score each candidate by business importance and technical risk. Keep the top five.",
            },
          ],
          flashcards: [
            {
              front: "Domain concern → -ilities mapping (examples)",
              back: "M&A → interoperability/scalability/adaptability; time to market → agility/testability/deployability; user satisfaction → performance/availability/fault tolerance.",
            },
            {
              front: "Composite architectural characteristic",
              back: "One with no single objective definition, composed of other measurable things - e.g. agility = deployability + modularity + testability + ...",
            },
            {
              front: "How do you validate the list?",
              back: "Review the five with a developer and an operator. Remove any that cannot be measured or do not change a decision.",
            },
            {
              front: "How do you interview a stakeholder?",
              back: "Ask what success looks like and what failure costs. Turn the answers into candidate characteristics.",
            },
            {
              front: "How do you rank them?",
              back: "Score each candidate by business importance and technical risk. Keep the top five.",
            },
          ],
          sourceRef: {
            label: "Chapter 5. Identifying Architectural Characteristics",
            pageStart: null,
            pageEnd: null,
            note: "Extracting characteristics from domain concerns, composites, implicit domain knowledge, and katason.",
            sectionIndexes: [
              7,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Measuring, Governing, and Fitness Functions",
          objective: "Measure characteristics objectively and automate governance with fitness functions.",
          hook: "How do you govern 'modularity' without nagging? You turn it into a test that fails the build.",
          paragraphs: [
            "Vague terms create organizational disagreements; decomposition plus a ubiquitous language fixes all three problems (vague meanings, departmental disagreements, composites). Operational measures need nuance: average response time hides the 1% of requests taking 10x longer - measure maxima too, and mature teams build statistical models that alarm when reality drifts from prediction. Structural measures include Cyclomatic Complexity (McCabe, 1976: CC = E − N + 2P from decision points): industry accepts under 10, the authors prefer under 5, over 50 is hopeless (one C function they saw hit 800+ with liberal GOTOs).",
            "CC also catches generative AI's habit of solving problems with brute-force accidental complexity. Process measures cover code coverage (100% coverage with weak assertions still cheats the metric) and deployability (success rates, duration, defects).",
            "Governance closes the loop with fitness functions: any mechanism providing an objective integrity assessment of a characteristic - not a framework, but a new lens on existing tools. JDepend tests fail the build on cyclic package dependencies; ArchUnit (Java) and NetArchTest (. NET) encode layer rules as unit tests; Distance from the Main Sequence gets threshold tests.",
            "Netflix's Simian Army shows production-scale fitness functions: Chaos Monkey (and Chaos Kong for whole-datacenter failure), Conformity Monkey for governance rules, Security Monkey for exposed ports and config errors, Janitor Monkey for orphaned services. The checklist parallel (The Checklist Manifesto) reframes it: fitness functions aren't heavyweight oversight - they're how architects express important principles into the substrate of the architecture.",
          ],
          bullets: [
            "Decompose vague terms → measurable definitions → shared language",
            "CC = E − N + 2P; aim < 5, never let it silently grow",
            "Fitness functions: objective assessments wired into builds and production",
            "JDepend, ArchUnit, Chaos/Conformity/Security/Janitor Monkeys",
            "Operational measures need nuance: average response time hides the 1% of requests taking 10x longer - measure maxima too, and mature teams build statistical models that alarm when reality drifts from prediction.",
            "Structural measures include Cyclomatic Complexity (McCabe, 1976: CC = E − N + 2P from decision points): industry accepts under 10, the authors prefer under 5, over 50 is hopeless (one C function they saw hit 800+ with liberal GOTOs).",
          ],
          steps: [
            {
              title: "Write a fitness function",
              detail: "Add an ArchUnit or equivalent test that fails when a layer depends on a forbidden layer.",
            },
            {
              title: "Put it in CI",
              detail: "Run the fitness function on every pull request. Make the failure message name the offending dependency.",
            },
            {
              title: "Break it on purpose",
              detail: "Add a forbidden import, watch CI fail, then remove it. Confirm the guard actually protects the characteristic.",
            },
          ],
          takeaway: "What you can measure you can govern - encode characteristics as automated checks instead of hoping teams remember.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "decomp",
                from: "vague",
                label: "define",
              },
              {
                to: "ff",
                from: "decomp",
                label: "encode",
              },
              {
                to: "ci",
                from: "ff",
                label: "automate",
              },
            ],
            nodes: [
              {
                id: "vague",
                label: "Vague term (agility)",
                emphasis: false,
              },
              {
                id: "decomp",
                label: "Decompose → measure",
                emphasis: true,
              },
              {
                id: "ff",
                label: "Fitness function",
                emphasis: true,
              },
              {
                id: "ci",
                label: "Build / production check",
                emphasis: false,
              },
            ],
            title: "From vague characteristic to automated governance",
          },
          quiz: {
            question: "What is an architectural fitness function?",
            options: [
              "A framework teams must download for governance",
              "Any mechanism that provides an objective integrity assessment of an architecture characteristic",
              "A unit test covering 100% of the codebase",
              "A performance benchmark run once before release",
            ],
            correctIndex: 1,
            explanation: "The definition is deliberately broad - 'any mechanism' - spanning tests, metrics, monitors, and chaos experiments used objectively.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Measuring, Governing, and Fitness Functions”?",
              options: [
                "Decompose vague terms → measurable definitions → shared language",
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Decompose vague terms → measurable definitions → shared language”",
            },
            {
              question: "Which statement best explains “Cyclomatic Complexity”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "CC = E − N + 2P over decision points; industry accepts <10, authors prefer <5; measures code paths, not whether complexity is essential or accidental.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “CC = E − N + 2P over decision points; industry accepts <10, authors prefer <5; measures code paths, not whether complexity is essential or accidental.”",
            },
            {
              question: "Which of these is a hands-on step in “Measuring, Governing, and Fitness Functions”?",
              options: [
                "Build a topic",
                "Test replay and ordering",
                "Add an in-memory grid",
                "Write a fitness function",
              ],
              correctIndex: 3,
              explanation: "“Write a fitness function” is part of this lesson's sequence: Add an ArchUnit or equivalent test that fails when a layer depends on a forbidden layer.",
            },
            {
              question: "What does the hands-on step “Put it in CI” involve?",
              options: [
                "Run the fitness function on every pull request. Make the failure message name the offending dependency.",
                "Review the five with a developer and an operator. Remove any that cannot be measured or do not change a decision.",
                "Score each candidate by business importance and technical risk. Keep the top five.",
                "Draw synchronous calls and shared data between quanta. Mark where a characteristic must hold across a boundary.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Put it in CI” as: Run the fitness function on every pull request. Make the failure message name the offending dependency.",
            },
          ],
          flashcards: [
            {
              front: "Fitness function examples",
              back: "JDepend cycle checks, ArchUnit layer rules, Netflix's Chaos/Conformity/Security/Janitor Monkeys - automated objective assessments.",
            },
            {
              front: "Cyclomatic Complexity",
              back: "CC = E − N + 2P over decision points; industry accepts <10, authors prefer <5; measures code paths, not whether complexity is essential or accidental.",
            },
            {
              front: "How do you break it on purpose?",
              back: "Add a forbidden import, watch CI fail, then remove it. Confirm the guard actually protects the characteristic.",
            },
            {
              front: "How do you write a fitness function?",
              back: "Add an ArchUnit or equivalent test that fails when a layer depends on a forbidden layer.",
            },
            {
              front: "How do you put it in CI?",
              back: "Run the fitness function on every pull request. Make the failure message name the offending dependency.",
            },
          ],
          sourceRef: {
            label: "Chapter 6. Measuring and Governing Architecture Characteristics",
            pageStart: null,
            pageEnd: null,
            note: "Operational/structural/process measures, cyclomatic complexity, governance, and fitness function examples.",
            sectionIndexes: [
              8,
              9,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Architecture Quantum and the Scope of Characteristics",
          objective: "Use architecture quanta to scope characteristics and drive monolith-versus-distributed decisions.",
          hook: "Characteristics don't live at the system level anymore. They live at the quantum - the smallest part that runs independently.",
          paragraphs: [
            "Code-level metrics can't evaluate databases or external dependencies that dominate operational characteristics - so the authors invented architecture quantum: the smallest part of the system that runs independently, establishing the scope for a set of characteristics. A quantum features independent deployment, high functional cohesion, low external implementation static coupling, and synchronous communication with other quanta. It includes everything needed to run: a service plus its database is one quantum; a legacy system with a single shared database is a quantum of one.",
            "Understanding the coupling types makes the definition click. Semantic coupling is the problem itself (orders inherently involve inventory, carts, customers - no architecture prevents the domain from changing). Implementation coupling is your structural choices (one database or many? monolith or distributed?) Static coupling is the wiring: two services sharing a dependency or database are in the same quantum.",
            "Dynamic coupling is runtime communication - and here the book flags synchronous calls as unforgiving when quanta have mismatched characteristics (an auction flooding a payment service limited to one payment per 500ms fails outright; a queue buffers bursts). The scoping decision tree follows: one set of characteristics → monolith; multiple clusters → distributed, then define quantum boundaries, persistence, and communication style.",
            "The Going Green kata shows three clusters - public-facing (scalability, availability, agility), back office (security, integrity, auditability), assessment (maintainability, deployability, testability) - which no single design serves well.",
          ],
          bullets: [
            "Quantum = independent deployment + cohesion + low static coupling + sync comms",
            "Semantic (problem) vs implementation (structural) vs static (wiring) vs dynamic (runtime) coupling",
            "Synchronous calls are unforgiving across mismatched quanta",
            "Clustered characteristics delineate quantum boundaries (Going Green kata)",
            "It includes everything needed to run: a service plus its database is one quantum; a legacy system with a single shared database is a quantum of one.",
            "Static coupling is the wiring: two services sharing a dependency or database are in the same quantum.",
          ],
          steps: [
            {
              title: "Identify the quanta",
              detail: "For a system, group components that share a database and deployment. Each group is a candidate quantum.",
            },
            {
              title: "Map the coupling",
              detail: "Draw synchronous calls and shared data between quanta. Mark where a characteristic must hold across a boundary.",
            },
            {
              title: "Split one quantum",
              detail: "Propose splitting a shared database or deployment. List the new failure modes and the coordination cost.",
            },
          ],
          takeaway: "Scope characteristics to quanta: where independent deployment and cohesion end is where a characteristic's guarantees end too.",
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
                label: "Identify the quanta",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Map the coupling",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Split one quantum",
                emphasis: true,
              },
            ],
            title: "How Architecture Quantum and the Scope of Characteristics works",
          },
          quiz: {
            question: "Two microservices both read from the same relational database. What does the quantum definition imply?",
            options: [
              "They are separate quanta because they deploy independently",
              "They are part of the same quantum, because shared static coupling (the database) binds their characteristic scope",
              "They are quanta only if they communicate synchronously",
              "Databases are never part of a quantum",
            ],
            correctIndex: 1,
            explanation: "Quanta include everything they depend on; services sharing a coupling point like one database share static coupling and therefore form one quantum (legacy single-DB systems = quantum of one).",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Architecture Quantum and the Scope of Characteristics”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Quantum = independent deployment + cohesion + low static coupling + sync comms",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Quantum = independent deployment + cohesion + low static coupling + sync comms”",
            },
            {
              question: "Which statement best explains “Architecture quantum”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "The smallest part of a system that runs independently: independent deployment, high functional cohesion, low external static coupling, synchronous communication with other quanta.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “The smallest part of a system that runs independently: independent deployment, high functional cohesion, low external static coupling, synchronous communication with other quanta.”",
            },
            {
              question: "Which of these is a hands-on step in “Architecture Quantum and the Scope of Characteristics”?",
              options: [
                "Diagram the anti-pattern",
                "List the symptoms",
                "Propose a simplification",
                "Identify the quanta",
              ],
              correctIndex: 3,
              explanation: "“Identify the quanta” is part of this lesson's sequence: For a system, group components that share a database and deployment. Each group is a candidate quantum.",
            },
            {
              question: "What does the hands-on step “Map the coupling” involve?",
              options: [
                "Draw synchronous calls and shared data between quanta. Mark where a characteristic must hold across a boundary.",
                "Write the recommendation, the runner-up, and the conditions that would change your mind.",
                "Create a short pattern catalog for your team with one local example per pattern.",
                "Find examples of layered, pipeline, and event-driven patterns in one codebase. Note where each appears.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Map the coupling” as: Draw synchronous calls and shared data between quanta. Mark where a characteristic must hold across a boundary.",
            },
          ],
          flashcards: [
            {
              front: "Architecture quantum",
              back: "The smallest part of a system that runs independently: independent deployment, high functional cohesion, low external static coupling, synchronous communication with other quanta.",
            },
            {
              front: "Four coupling types",
              back: "Semantic (the problem), implementation (your structural choices), static (shared wiring/dependencies), dynamic (runtime calls between quanta).",
            },
            {
              front: "How do you identify the quanta?",
              back: "For a system, group components that share a database and deployment. Each group is a candidate quantum.",
            },
            {
              front: "How do you split one quantum?",
              back: "Propose splitting a shared database or deployment. List the new failure modes and the coordination cost.",
            },
            {
              front: "How do you map the coupling?",
              back: "Draw synchronous calls and shared data between quanta. Mark where a characteristic must hold across a boundary.",
            },
          ],
          sourceRef: {
            label: "Chapter 7. The Scope of Architectural Characteristics",
            pageStart: null,
            pageEnd: null,
            note: "Architecture quanta, bounded context, coupling types, synchronous communication, and the scoping decision tree.",
            sectionIndexes: [
              10,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Component-Based Thinking",
          objective: "Build a logical architecture by identifying components iteratively and assigning user stories.",
          hook: "Architects don't see classes - they see components. Like rooms in a house, each does one job.",
          paragraphs: [
            "Logical components are the major functions of a system, usually manifest as namespaces or directory leaves: order_entry/ordering/payment is Payment Processing. Logical architecture shows components and their interactions - deliberately excluding UIs, databases, and services, which belong to physical architecture. The authors warn against skipping straight to physical diagrams: payment functionality scattered across services hides how the system fits together, and teams get no guidance on organizing code. Keep logical and physical separate; the same logical map can later be deployed monolithically or as services.",
            "Creating one is iterative, never first-time-perfect: identify initial core components as 'empty buckets,' assign user stories, analyze roles and responsibilities, test the grouping against architectural characteristics, then restructure - a loop that never stops. Two proven ways to seed the buckets: the Workflow approach (components per step of the major happy-path workflow: Item Browser → Order Placement → Order Payment → Customer Notification → Fulfillment → Shipment) and the Actor/Action approach (customer, packer, system × their major actions).",
            "The Entity Trap - naming components after entities like 'Customer' - is the antipattern to avoid. Refine with the Law of Demeter (talk only to immediate neighbors), analyze static and temporal coupling, and restructure components when the characteristics demand it.",
          ],
          bullets: [
            "Logical architecture: components + interactions, no physical artifacts",
            "Iterate: buckets → user stories → roles → characteristics → restructure",
            "Seed with Workflow or Actor/Action - avoid the Entity Trap",
            "Law of Demeter and coupling analysis guide refinement",
            "Logical components are the major functions of a system, usually manifest as namespaces or directory leaves: order_entry/ordering/payment is Payment Processing.",
            "The authors warn against skipping straight to physical diagrams: payment functionality scattered across services hides how the system fits together, and teams get no guidance on organizing code.",
          ],
          steps: [
            {
              title: "Decompose the domain",
              detail: "List the business capabilities and group them into components with one reason to change each.",
            },
            {
              title: "Define contracts",
              detail: "For each component, write its responsibilities, inputs, outputs, and owned data. Note what it must not expose.",
            },
            {
              title: "Check cohesion and coupling",
              detail: "Score each component on internal cohesion and external dependencies. Merge or split the worst outliers.",
            },
          ],
          takeaway: "Start with best-guess buckets and refine forever - a logical architecture is discovered iteratively, not designed once.",
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
                label: "Decompose the domain",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Define contracts",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Check cohesion and coupling",
                emphasis: true,
              },
            ],
            title: "How Component-Based Thinking works",
          },
          quiz: {
            question: "Why does the book advise creating a logical architecture before a physical one?",
            options: [
              "Logical diagrams are faster to draw in any tool",
              "Physical architecture alone hides where functionality lives and gives teams no guidance on organizing code",
              "Logical architecture determines the database vendor",
              "It is required by all architectural standards",
            ],
            correctIndex: 1,
            explanation: "A physical diagram spreads payment logic across services and shows no internal structure; the logical map is what teams use to organize code - and it stays valid across physical styles.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Component-Based Thinking”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Logical architecture: components + interactions, no physical artifacts",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Logical architecture: components + interactions, no physical artifacts”",
            },
            {
              question: "Which statement best explains “Logical vs physical architecture”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
                "Logical: components and interactions (namespaces/directories), no UIs or databases. Physical: services, UIs, databases - one of the Part II styles.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Logical: components and interactions (namespaces/directories), no UIs or databases. Physical: services, UIs, databases - one of the Part II styles.”",
            },
            {
              question: "Which of these is a hands-on step in “Component-Based Thinking”?",
              options: [
                "Measure the cost",
                "Define module APIs",
                "Enforce boundaries",
                "Decompose the domain",
              ],
              correctIndex: 3,
              explanation: "“Decompose the domain” is part of this lesson's sequence: List the business capabilities and group them into components with one reason to change each.",
            },
            {
              question: "What does the hands-on step “Define contracts” involve?",
              options: [
                "For each component, write its responsibilities, inputs, outputs, and owned data. Note what it must not expose.",
                "Take one feature and list its local design choices versus the architectural constraints it must respect.",
                "For three systems you know, name the dominant architecture style and the patterns visible in the code.",
                "Identify one area with no clear boundaries. List the symptoms: shared tables, cyclic dependencies, or unclear ownership.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Define contracts” as: For each component, write its responsibilities, inputs, outputs, and owned data. Note what it must not expose.",
            },
          ],
          flashcards: [
            {
              front: "Workflow vs Actor/Action component identification",
              back: "Workflow: one component per major happy-path step. Actor/Action: components per major action per actor (customer, packer, system). Entity Trap is the antipattern.",
            },
            {
              front: "Logical vs physical architecture",
              back: "Logical: components and interactions (namespaces/directories), no UIs or databases. Physical: services, UIs, databases - one of the Part II styles.",
            },
            {
              front: "How do you decompose the domain?",
              back: "List the business capabilities and group them into components with one reason to change each.",
            },
            {
              front: "How do you define contracts?",
              back: "For each component, write its responsibilities, inputs, outputs, and owned data. Note what it must not expose.",
            },
            {
              front: "How do you check cohesion and coupling?",
              back: "Score each component on internal cohesion and external dependencies. Merge or split the worst outliers.",
            },
          ],
          sourceRef: {
            label: "Chapter 8. Component-Based Thinking",
            pageStart: null,
            pageEnd: null,
            note: "Logical components, logical vs physical architecture, iterative identification, and component approaches.",
            sectionIndexes: [
              11,
              12,
            ],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Monolithic Styles: Layered to Service-Based",
      summary: "Chapters 10-14: the monolithic catalog - layered, modular monolith, pipeline, microkernel, and the pragmatic service-based hybrid.",
      lessons: [
        {
          title: "Layered Architecture",
          objective: "Design a layered system with correct open/closed layer decisions and isolation.",
          hook: "Four layers, one rule: change one, break none - if your layers are closed where it counts.",
          paragraphs: [
            "Layered (n-tier) is the de facto standard for legacy applications - simple, familiar, cheap - and it's what emerges when teams 'just start coding' (Architecture by Implication / Accidental Architecture). Standard topology: Presentation, Business, Persistence, Database layers, each an abstraction owning one technical concern; variants move layers between deployment units, but the database stays external. It's technically partitioned: 'customer' spreads across every layer, which is why DDD fits it poorly.",
            "The style-specific mechanics are what separate a clean layered system from a brittle one. Layers of isolation: changes in one layer shouldn't affect others as long as contracts hold - and isolation requires closed layers on the request path (a request may not skip a layer). Open layers exist deliberately: add a Services layer holding shared objects (logging, dates, audit), mark it open so Business can bypass it, and you've architecturally forbidden Presentation from touching shared business objects.",
            "Which layers are open/closed and why must be documented and communicated - otherwise interdependencies creep in and the architecture becomes expensive to change.",
          ],
          bullets: [
            "Presentation / Business / Persistence / Database - technically partitioned",
            "Closed layers protect isolation; open layers are explicit exceptions",
            "Adding a Services layer enforces restrictions architecturally",
            "Undocumented open/closed decisions → brittle, tightly coupled systems",
            "Standard topology: Presentation, Business, Persistence, Database layers, each an abstraction owning one technical concern; variants move layers between deployment units, but the database stays external.",
            "Layers of isolation: changes in one layer shouldn't affect others as long as contracts hold - and isolation requires closed layers on the request path (a request may not skip a layer).",
          ],
          steps: [
            {
              title: "Build three layers",
              detail: "Implement presentation, domain, and persistence layers for one feature. Keep the domain free of framework imports.",
            },
            {
              title: "Enforce the rules",
              detail: "Add a test that forbids the domain from importing the web or database layer. Run it in CI.",
            },
            {
              title: "Measure the cost",
              detail: "Trace one request through the layers and count the mapping steps. Decide whether the isolation is worth it here.",
            },
          ],
          takeaway: "Decide and document which layers are closed and which are open - that single rule governs the whole style's isolation promise.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "b",
                from: "p",
                label: "closed",
              },
              {
                to: "s",
                from: "b",
                label: "may bypass",
              },
              {
                to: "pe",
                from: "b",
                label: "closed",
              },
              {
                to: "db",
                from: "pe",
                label: "closed",
              },
            ],
            nodes: [
              {
                id: "p",
                label: "Presentation",
                emphasis: false,
              },
              {
                id: "b",
                label: "Business",
                emphasis: true,
              },
              {
                id: "s",
                label: "Services (open)",
                emphasis: false,
              },
              {
                id: "pe",
                label: "Persistence",
                emphasis: false,
              },
              {
                id: "db",
                label: "Database",
                emphasis: false,
              },
            ],
            title: "Request flow through closed layers",
          },
          quiz: {
            question: "What does it mean for a layer to be 'closed'?",
            options: [
              "The layer is deprecated and no longer used",
              "A request cannot skip it - it must pass through the layer directly beneath",
              "The layer has no dependencies on other layers",
              "Only the architect may modify the layer",
            ],
            correctIndex: 1,
            explanation: "Closed layers enforce layers of isolation: Presentation → Business → Persistence → Database with no shortcuts; open layers (like an added Services layer) are deliberate bypasses.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Layered Architecture”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "Presentation / Business / Persistence / Database - technically partitioned",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Presentation / Business / Persistence / Database - technically partitioned”",
            },
            {
              question: "Which statement best explains “Layers of isolation”?",
              options: [
                "Changes in one layer don't impact others if contracts hold; supported by closed layers on the main request flow.",
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Changes in one layer don't impact others if contracts hold; supported by closed layers on the main request flow.”",
            },
            {
              question: "Which of these is a hands-on step in “Layered Architecture”?",
              options: [
                "Propose a change",
                "Find the shared constraint",
                "Role-play the conflict",
                "Build three layers",
              ],
              correctIndex: 3,
              explanation: "“Build three layers” is part of this lesson's sequence: Implement presentation, domain, and persistence layers for one feature. Keep the domain free of framework imports.",
            },
            {
              question: "What does the hands-on step “Enforce the rules” involve?",
              options: [
                "Add a test that forbids the domain from importing the web or database layer. Run it in CI.",
                "Identify long release cycles, chatty calls, and shared data. Explain how each follows from the orchestration model.",
                "Suggest two services that could merge or an event that could replace a synchronous call. Estimate the reduction in coupling.",
                "Choose two business capabilities and give each its own data store and deployable service.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Enforce the rules” as: Add a test that forbids the domain from importing the web or database layer. Run it in CI.",
            },
          ],
          flashcards: [
            {
              front: "Why layered is 'technically partitioned'",
              back: "Components split by technical role (presentation, business...), so a domain like 'customer' spreads across all layers - making DDD-style changes hard.",
            },
            {
              front: "Layers of isolation",
              back: "Changes in one layer don't impact others if contracts hold; supported by closed layers on the main request flow.",
            },
            {
              front: "How do you build three layers?",
              back: "Implement presentation, domain, and persistence layers for one feature. Keep the domain free of framework imports.",
            },
            {
              front: "How do you measure the cost?",
              back: "Trace one request through the layers and count the mapping steps. Decide whether the isolation is worth it here.",
            },
            {
              front: "How do you enforce the rules?",
              back: "Add a test that forbids the domain from importing the web or database layer. Run it in CI.",
            },
          ],
          sourceRef: {
            label: "Chapter 10. Layered Architecture Style",
            pageStart: null,
            pageEnd: null,
            note: "Topology, style specifics, layers of isolation, open/closed layers, and adding layers.",
            sectionIndexes: [
              16,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "The Modular Monolith",
          objective: "Choose between monolithic and modular structures while preserving domain boundaries.",
          hook: "One deployment, zero network calls - but organized by domain. The style that saved the monolith from the mud.",
          paragraphs: [
            "New in the second edition, the modular monolith rides the DDD wave: a single deployment unit (WAR,. NET assembly) whose functionality is grouped by domain area - the namespace difference is the tell. Layered uses com.app.presentation.customer.profile (technical node third); modular monolith uses com.app.customer.profile (domain node third), with technical concerns nested below if needed. You get domain partitioning without distribution.",
            "Two structural options trade off cleanly. Monolithic structure: all modules in one repository, simplest to maintain, test, and deploy - but it demands strict governance, because developers will reuse too much code across modules and let modules chatter until the mud returns. Modular structure: each module is a self-contained artifact (JAR/DLL) combined at deployment - cleaner boundaries, separate team ownership, less cross-module reuse - but it loses effectiveness when modules must communicate constantly.",
            "Module communication rules and governance (who may call whom, what may be shared) are the style's real work; team topology considerations follow the structure.",
          ],
          bullets: [
            "Domain-partitioned namespace: com.app.customer.profile",
            "Monolithic structure: one repo, simplest - needs hard governance",
            "Modular structure: JARs per module, cleaner boundaries, team ownership",
            "Too much reuse/communication across modules = Big Ball of Mud",
            "Monolithic structure: all modules in one repository, simplest to maintain, test, and deploy - but it demands strict governance, because developers will reuse too much code across modules and let modules chatter until the mud returns.",
            "Modular structure: each module is a self-contained artifact (JAR/DLL) combined at deployment - cleaner boundaries, separate team ownership, less cross-module reuse - but it loses effectiveness when modules must communicate constantly.",
          ],
          steps: [
            {
              title: "Define module APIs",
              detail: "Create modules with explicit public interfaces and private internals. Hide the database schema behind each module.",
            },
            {
              title: "Enforce boundaries",
              detail: "Add build or test rules that block cross-module access to internal packages. Verify a violation fails.",
            },
            {
              title: "Extract one module",
              detail: "Move a module behind an HTTP or in-process boundary. Measure the change in deployment and latency.",
            },
          ],
          takeaway: "Keep the deployment monolithic and the boundaries domain-shaped - governance is what keeps a modular monolith from rotting.",
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
                label: "Define module APIs",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Enforce boundaries",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Extract one module",
                emphasis: true,
              },
            ],
            title: "How The Modular Monolith works",
          },
          quiz: {
            question: "What is the main risk of the monolithic structure option in a modular monolith?",
            options: [
              "Network latency between modules",
              "Developers reusing too much code and communicating too freely across modules, eroding boundaries",
              "Inability to run integration tests",
              "Distributed transaction failures",
            ],
            correctIndex: 1,
            explanation: "One repo makes everything reachable; without strict governance, cross-module reuse and calls dissolve the domain boundaries and recreate a Big Ball of Mud.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “The Modular Monolith”?",
              options: [
                "Domain-partitioned namespace: com.app.customer.profile",
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Domain-partitioned namespace: com.app.customer.profile”",
            },
            {
              question: "Which statement best explains “Modular monolith definition”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "A monolithic architecture that is domain-partitioned: single deployment unit, functionality grouped by domain area (vs technical layers).",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “A monolithic architecture that is domain-partitioned: single deployment unit, functionality grouped by domain area (vs technical layers).”",
            },
            {
              question: "Which of these is a hands-on step in “The Modular Monolith”?",
              options: [
                "Find the friction",
                "Map the intersections",
                "Propose an adjustment",
                "Define module APIs",
              ],
              correctIndex: 3,
              explanation: "“Define module APIs” is part of this lesson's sequence: Create modules with explicit public interfaces and private internals. Hide the database schema behind each module.",
            },
            {
              question: "What does the hands-on step “Enforce boundaries” involve?",
              options: [
                "Add build or test rules that block cross-module access to internal packages. Verify a violation fails.",
                "Identify long release cycles, chatty calls, and shared data. Explain how each follows from the orchestration model.",
                "Suggest two services that could merge or an event that could replace a synchronous call. Estimate the reduction in coupling.",
                "Choose two business capabilities and give each its own data store and deployable service.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Enforce boundaries” as: Add build or test rules that block cross-module access to internal packages. Verify a violation fails.",
            },
          ],
          flashcards: [
            {
              front: "Modular monolith definition",
              back: "A monolithic architecture that is domain-partitioned: single deployment unit, functionality grouped by domain area (vs technical layers).",
            },
            {
              front: "Monolithic vs modular structure",
              back: "Monolithic: all modules one codebase, simplest, governance-heavy. Modular: modules as self-contained JAR/DLL artifacts, cleaner boundaries, weaker when modules interdepend.",
            },
            {
              front: "How do you extract one module?",
              back: "Move a module behind an HTTP or in-process boundary. Measure the change in deployment and latency.",
            },
            {
              front: "How do you enforce boundaries?",
              back: "Add build or test rules that block cross-module access to internal packages. Verify a violation fails.",
            },
            {
              front: "How do you define module APIs?",
              back: "Create modules with explicit public interfaces and private internals. Hide the database schema behind each module.",
            },
          ],
          sourceRef: {
            label: "Chapter 11. The Modular Monolith Architecture Style",
            pageStart: null,
            pageEnd: null,
            note: "Topology, monolithic vs modular structures, module communication, and governance.",
            sectionIndexes: [
              17,
              18,
            ],
          },
          estimatedMinutes: 3,
        },
        {
          title: "Pipeline Architecture (Pipes and Filters)",
          objective: "Decompose processing into producer, transformer, tester, and consumer filters connected by pipes.",
          hook: "Knuth wrote 10 pages of Pascal for a word-count problem. McIlroy did it in a shell one-liner. That's the pipeline style.",
          paragraphs: [
            "The pipeline (pipes and filters) style predates most of modern architecture: filters hold functionality, pipes carry data one-way between them - the principle behind Unix shells and MapReduce. Filters are self-contained, stateless, and single-purpose; composite tasks become sequences of filters rather than fat filters. Four filter types: producer (source - a UI or inbound request), transformer (map: enhance, transform, or calculate), tester (reduce: validate or decide whether processing continues), and consumer (the terminus that persists or displays results).",
            "The payoff is compositional reuse: the 'More Shell, Less Egg' story - Knuth's careful Pascal versus McIlroy's short shell pipeline for finding word frequencies - shows how simple abstractions compose into surprising power. Most implementations are monolithic, but each filter (or group) can be deployed as a service with sync or async calls, giving a distributed variant of the same topology.",
          ],
          bullets: [
            "Filters: stateless, single-task components; pipes: unidirectional links",
            "Producer, transformer (map), tester (reduce), consumer",
            "Compositional reuse: small filters chain into complex processing",
            "Distributable: filters can become services with remote calls",
            "The pipeline (pipes and filters) style predates most of modern architecture: filters hold functionality, pipes carry data one-way between them - the principle behind Unix shells and MapReduce.",
            "Filters are self-contained, stateless, and single-purpose; composite tasks become sequences of filters rather than fat filters.",
          ],
          steps: [
            {
              title: "Build a pipeline",
              detail: "Implement three filters for parsing, transforming, and writing log lines. Connect them with a simple pipe.",
            },
            {
              title: "Add a filter",
              detail: "Insert a redaction filter without changing the existing filters. Confirm the pipeline still composes.",
            },
            {
              title: "Test failure handling",
              detail: "Make one filter fail on a bad record. Decide whether to skip, retry, or stop, and implement that policy.",
            },
          ],
          takeaway: "Keep filters small and stateless, and let composition - not complexity inside any one filter - do the heavy lifting.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "trans",
                from: "prod",
                label: "pipe",
              },
              {
                to: "test",
                from: "trans",
                label: "pipe",
              },
              {
                to: "cons",
                from: "test",
                label: "pipe",
              },
            ],
            nodes: [
              {
                id: "prod",
                label: "Producer (source)",
                emphasis: false,
              },
              {
                id: "trans",
                label: "Transformer (map)",
                emphasis: false,
              },
              {
                id: "test",
                label: "Tester (reduce)",
                emphasis: true,
              },
              {
                id: "cons",
                label: "Consumer",
                emphasis: false,
              },
            ],
            title: "Pipes and filters",
          },
          quiz: {
            question: "Which filter type accepts input, tests it against criteria, and decides whether processing continues?",
            options: [
              "Producer filter",
              "Transformer filter",
              "Tester filter",
              "Consumer filter",
            ],
            correctIndex: 2,
            explanation: "Tester filters (the functional 'reduce') validate or switch flow - e.g., don't forward an order under five dollars. Producers start, transformers map, consumers terminate.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Pipeline Architecture (Pipes and Filters)”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Filters: stateless, single-task components; pipes: unidirectional links",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Filters: stateless, single-task components; pipes: unidirectional links”",
            },
            {
              question: "Which statement best explains “Four pipeline filter types”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Producer (source, outbound only), transformer (map/transform data), tester (reduce/validate), consumer (persist or display results).",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Producer (source, outbound only), transformer (map/transform data), tester (reduce/validate), consumer (persist or display results).”",
            },
            {
              question: "Which of these is a hands-on step in “Pipeline Architecture (Pipes and Filters)”?",
              options: [
                "Measure the coupling",
                "Split into services",
                "Add an idempotent consumer",
                "Build a pipeline",
              ],
              correctIndex: 3,
              explanation: "“Build a pipeline” is part of this lesson's sequence: Implement three filters for parsing, transforming, and writing log lines. Connect them with a simple pipe.",
            },
            {
              question: "What does the hands-on step “Add a filter” involve?",
              options: [
                "Insert a redaction filter without changing the existing filters. Confirm the pipeline still composes.",
                "Mark the systems each team must understand. Flag any team owning too many unrelated domains.",
                "Suggest one boundary or platform service that would reduce load. State the tradeoff and the migration cost.",
                "Identify the outcome both sides need. Reframe the decision around that outcome rather than either preference.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add a filter” as: Insert a redaction filter without changing the existing filters. Confirm the pipeline still composes.",
            },
          ],
          flashcards: [
            {
              front: "Four pipeline filter types",
              back: "Producer (source, outbound only), transformer (map/transform data), tester (reduce/validate), consumer (persist or display results).",
            },
            {
              front: "'More Shell, Less Egg'",
              back: "McIlroy's tiny shell pipeline beat Knuth's 10-page Pascal for word-frequency counting - the canonical evidence for compositional reuse.",
            },
            {
              front: "How do you build a pipeline?",
              back: "Implement three filters for parsing, transforming, and writing log lines. Connect them with a simple pipe.",
            },
            {
              front: "How do you add a filter?",
              back: "Insert a redaction filter without changing the existing filters. Confirm the pipeline still composes.",
            },
            {
              front: "How do you test failure handling?",
              back: "Make one filter fail on a bad record. Decide whether to skip, retry, or stop, and implement that policy.",
            },
          ],
          sourceRef: {
            label: "Chapter 12. Pipeline Architecture Style",
            pageStart: null,
            pageEnd: null,
            note: "Topology of pipes and filters, the four filter types, compositional reuse, and distributed variants.",
            sectionIndexes: [
              19,
              20,
            ],
          },
          estimatedMinutes: 3,
        },
        {
          title: "Microkernel (Plug-In) Architecture",
          objective: "Separate a minimal core system from extensible plug-ins registered and invoked at runtime.",
          hook: "Eclipse is a text editor until you add plug-ins. The microkernel moves complexity out of the core and into extensions.",
          paragraphs: [
            "The microkernel (plug-in) style splits application logic between a core system - the minimal functionality or happy path required to run - and plug-in components carrying custom processing. It's a natural fit for product-based applications installed at customer sites, and for domains with per-customer variation: an insurance company with state-specific rules, a shipping company with per-country logistics. The core moves cyclomatic complexity into plug-ins, improving extensibility, maintainability, and testability.",
            "The book's Running example: Going Green's device assessments become one plug-in per device type - the core locates and invokes the right plug-in, and adding a device is adding a plug-in plus a registry entry. Plug-in machinery includes the registry (where the core discovers plug-ins), contracts (the interfaces plug-ins must honor), and considerations like volatile core versus stable plug-ins and managing plug-in dependencies. A spectrum of 'microkernel-ality' exists: core systems can be layered internally or even split into domain services, and the presentation layer can live inside the core or stand apart.",
          ],
          bullets: [
            "Core = minimal happy path; plug-ins own custom logic and variation",
            "Registry discovers plug-ins; contracts define the interface",
            "Moving complexity to plug-ins buys extensibility and testability",
            "Fits products and per-customer/per-region customization",
            "It's a natural fit for product-based applications installed at customer sites, and for domains with per-customer variation: an insurance company with state-specific rules, a shipping company with per-country logistics.",
            "The book's Running example: Going Green's device assessments become one plug-in per device type - the core locates and invokes the right plug-in, and adding a device is adding a plug-in plus a registry entry.",
          ],
          steps: [
            {
              title: "Define the plug-in contract",
              detail: "Write the interface a plug-in must implement, including lifecycle and error handling. Keep the core independent of concrete plug-ins.",
            },
            {
              title: "Build two plug-ins",
              detail: "Implement one real plug-in and one stub. Load both through the same registry.",
            },
            {
              title: "Add one without core changes",
              detail: "Create a third plug-in and register it. Confirm no core file changed and the new behavior appears.",
            },
          ],
          takeaway: "Keep the core boring and push variation into registered plug-ins - extension beats modification.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "reg",
                from: "core",
                label: "discovers via",
              },
              {
                to: "p1",
                from: "reg",
                label: "invokes",
              },
              {
                to: "p2",
                from: "reg",
                label: "invokes",
              },
            ],
            nodes: [
              {
                id: "core",
                label: "Core system (happy path)",
                emphasis: true,
              },
              {
                id: "reg",
                label: "Registry + contracts",
                emphasis: false,
              },
              {
                id: "p1",
                label: "Plug-in A",
                emphasis: false,
              },
              {
                id: "p2",
                label: "Plug-in B",
                emphasis: false,
              },
            ],
            title: "Core system and plug-ins",
          },
          quiz: {
            question: "What is the 'core system' in a microkernel architecture?",
            options: [
              "The database and all persistence code",
              "The minimal functionality required to run the system - the happy path",
              "The collection of all plug-ins compiled together",
              "The user interface layer only",
            ],
            correctIndex: 1,
            explanation: "Eclipse's core is just a text editor; everything product-like arrives via plug-ins. The core is what remains when all customization is extracted.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Microkernel (Plug-In) Architecture”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Core = minimal happy path; plug-ins own custom logic and variation",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Core = minimal happy path; plug-ins own custom logic and variation”",
            },
            {
              question: "Which statement best explains “Microkernel (plug-in) style”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
                "Monolithic style of a minimal core system plus independent plug-ins discovered via a registry and bound by contracts - ideal for product/customizable apps.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Monolithic style of a minimal core system plus independent plug-ins discovered via a registry and bound by contracts - ideal for product/customizable apps.”",
            },
            {
              question: "Which of these is a hands-on step in “Microkernel (Plug-In) Architecture”?",
              options: [
                "Map the intersections",
                "Propose an adjustment",
                "Record the reversal conditions",
                "Define the plug-in contract",
              ],
              correctIndex: 3,
              explanation: "“Define the plug-in contract” is part of this lesson's sequence: Write the interface a plug-in must implement, including lifecycle and error handling. Keep the core independent of concrete plug-ins.",
            },
            {
              question: "What does the hands-on step “Build two plug-ins” involve?",
              options: [
                "Implement one real plug-in and one stub. Load both through the same registry.",
                "Draw synchronous calls and shared data between quanta. Mark where a characteristic must hold across a boundary.",
                "For a system, group components that share a database and deployment. Each group is a candidate quantum.",
                "Propose splitting a shared database or deployment. List the new failure modes and the coordination cost.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Build two plug-ins” as: Implement one real plug-in and one stub. Load both through the same registry.",
            },
          ],
          flashcards: [
            {
              front: "Microkernel (plug-in) style",
              back: "Monolithic style of a minimal core system plus independent plug-ins discovered via a registry and bound by contracts - ideal for product/customizable apps.",
            },
            {
              front: "Why move cyclomatic complexity to plug-ins?",
              back: "Each self-contained plug-in isolates custom logic, making the core simpler to extend, maintain, and test.",
            },
            {
              front: "How do you define the plug-in contract?",
              back: "Write the interface a plug-in must implement, including lifecycle and error handling. Keep the core independent of concrete plug-ins.",
            },
            {
              front: "How do you build two plug-ins?",
              back: "Implement one real plug-in and one stub. Load both through the same registry.",
            },
            {
              front: "How do you add one without core changes?",
              back: "Create a third plug-in and register it. Confirm no core file changed and the new behavior appears.",
            },
          ],
          sourceRef: {
            label: "Chapter 13. Microkernel Architecture Style",
            pageStart: null,
            pageEnd: null,
            note: "Core system, plug-in components, registry, contracts, and the spectrum of microkernel-ality.",
            sectionIndexes: [
              21,
            ],
          },
          estimatedMinutes: 3,
        },
        {
          title: "Service-Based Architecture",
          objective: "Balance coarse-grained domain services, a shared database, and ACID transactions.",
          hook: "Distributed without the drama: a handful of coarse services, one database, real transactions.",
          paragraphs: [
            "Service-based architecture is the pragmatic hybrid - distributed like microservices but far less complex and expensive, which makes it popular for business applications. Topology: separately deployed UI, separately deployed coarse-grained domain services (order fulfillment, order shipping), and typically a monolithic database that still allows SQL joins. The book recommends no more than ~12 domain services with a shared database to avoid change-control, scalability, and fault-tolerance problems; each service is usually layered internally (API facade, business, persistence) or partitioned by subdomain.",
            "Its superpower is data integrity: because services are coarse, regular ACID transactions with commits and rollbacks work inside a single service - an expired credit card rolls the whole order back cleanly. Compare microservices' fine-grained services: the order insert succeeds, the remote payment call fails, and you need a compensating update (BASE: basic availability, soft state, eventual consistency) to repair the inconsistency.",
            "The trade-off is change blast radius: modifying order placement in a coarse OrderService means testing and redeploying payment code too, whereas microservices would isolate the change to a single-purpose service. Granularity is the dial between integrity and independence.",
          ],
          bullets: [
            "UI + ≤12 coarse domain services + shared monolithic database",
            "ACID inside a service; BASE/compensating updates only when distributed",
            "API facade orchestrates the request within the service",
            "Coarse = integrity, but bigger change/redeploy blast radius",
            "Topology: separately deployed UI, separately deployed coarse-grained domain services (order fulfillment, order shipping), and typically a monolithic database that still allows SQL joins.",
            "Its superpower is data integrity: because services are coarse, regular ACID transactions with commits and rollbacks work inside a single service - an expired credit card rolls the whole order back cleanly.",
          ],
          steps: [
            {
              title: "Split into services",
              detail: "Divide a small app into two or three services with clear data ownership. Define the synchronous contracts between them.",
            },
            {
              title: "Implement the calls",
              detail: "Build REST or RPC endpoints for the contracts. Add timeouts and a clear error shape.",
            },
            {
              title: "Measure the coupling",
              detail: "Trace a request across services and count network hops. Decide whether a shared library or a coarser service would be simpler.",
            },
          ],
          takeaway: "Choose service-based when you want distribution's benefits but need transactions to stay simple - and keep services coarse but few.",
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
                label: "Split into services",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Implement the calls",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Measure the coupling",
                emphasis: true,
              },
            ],
            title: "How Service-Based Architecture works",
          },
          quiz: {
            question: "Why can a service-based architecture use normal ACID transactions where microservices often cannot?",
            options: [
              "Because it uses a message broker",
              "Because its coarse-grained services own their data within one database boundary",
              "Because it forbids rollbacks",
              "Because it runs on a single machine",
            ],
            correctIndex: 1,
            explanation: "Coarse domain services keep related data in one place, so commits/rollbacks work; fine-grained microservices span network calls and need compensating transactions (BASE).",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Service-Based Architecture”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "UI + ≤12 coarse domain services + shared monolithic database",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “UI + ≤12 coarse domain services + shared monolithic database”",
            },
            {
              question: "Which statement best explains “ACID vs BASE in the two styles”?",
              options: [
                "Service-based: atomicity/isolation/durability inside coarse services. Microservices: basic availability, soft state, eventual consistency with compensating updates.",
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Service-based: atomicity/isolation/durability inside coarse services. Microservices: basic availability, soft state, eventual consistency with compensating updates.”",
            },
            {
              question: "Which of these is a hands-on step in “Service-Based Architecture”?",
              options: [
                "Catalog three systems",
                "Find the mud",
                "Propose seams",
                "Split into services",
              ],
              correctIndex: 3,
              explanation: "“Split into services” is part of this lesson's sequence: Divide a small app into two or three services with clear data ownership. Define the synchronous contracts between them.",
            },
            {
              question: "What does the hands-on step “Implement the calls” involve?",
              options: [
                "Build REST or RPC endpoints for the contracts. Add timeouts and a clear error shape.",
                "Identify the outcome both sides need. Reframe the decision around that outcome rather than either preference.",
                "Record the options, the cost of each, and the recommendation. Get an explicit decision and owner.",
                "Take a stakeholder who wants speed and a developer who wants correctness. Write both positions fairly.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Implement the calls” as: Build REST or RPC endpoints for the contracts. Add timeouts and a clear error shape.",
            },
          ],
          flashcards: [
            {
              front: "Granularity trade-off (service-based)",
              back: "Coarse services protect data integrity but increase change blast radius; fine-grained services isolate changes but complicate consistency.",
            },
            {
              front: "ACID vs BASE in the two styles",
              back: "Service-based: atomicity/isolation/durability inside coarse services. Microservices: basic availability, soft state, eventual consistency with compensating updates.",
            },
            {
              front: "How do you measure the coupling?",
              back: "Trace a request across services and count network hops. Decide whether a shared library or a coarser service would be simpler.",
            },
            {
              front: "How do you split into services?",
              back: "Divide a small app into two or three services with clear data ownership. Define the synchronous contracts between them.",
            },
            {
              front: "How do you implement the calls?",
              back: "Build REST or RPC endpoints for the contracts. Add timeouts and a clear error shape.",
            },
          ],
          sourceRef: {
            label: "Chapter 14. Service-Based Architecture Style",
            pageStart: null,
            pageEnd: null,
            note: "Topology, service design and granularity, API facade, and ACID versus BASE trade-offs.",
            sectionIndexes: [
              22,
            ],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Distributed Styles: Events, Spaces, and Services",
      summary: "Chapters 15-19: event-driven, space-based, orchestration-driven SOA (the cautionary tale), microservices, and how to choose between them all.",
      lessons: [
        {
          title: "Event-Driven Architecture",
          objective: "Model systems with initiating and derived events through a broker and distinguish events from messages.",
          hook: "A bid isn't a request - it's something that happened. Event-driven systems react to the past, not to queries.",
          paragraphs: [
            "Most apps are request-based: an orchestrator deterministically and synchronously dispatches to processors. Event-driven architecture (EDA) instead reacts to events that have happened. Topology: an initiating event (place order) enters an event channel on a broker (federated, topic/pub-sub based); an event processor handles it, does one task, then broadcasts a derived event (order placed) - which Notification, Payment, and Inventory processors consume in parallel, each advertising their own derived events (payment applied/denied, inventory updated, order fulfilled, order shipped) until processors idle.",
            "The relay race is the mental model: once a runner hands off the baton, they're free - each processor scales independently.",
            "Details that separate working EDA from chaos: events versus messages - an event broadcasts what already happened ('I just placed an order') and needs no response; a message commands or queries ('apply the payment') and usually expects one. Avoid poison events - derived events that loop forever between processors (Inventory must not emit inventory-adjusted in response to its own adjustment). The style also wrestles with error handling, preventing data loss, request-reply processing for when a response is needed, mediated EDA variants, and data topologies (monolithic, domain, or dedicated databases per processor).",
          ],
          bullets: [
            "Initiating event → broker → processor → derived event → more processors",
            "Events are past-tense broadcasts; messages are commands/queries needing replies",
            "Poison events: derived events that loop forever - design them out",
            "Processors scale independently; data-loss prevention is a first-class concern",
            "Most apps are request-based: an orchestrator deterministically and synchronously dispatches to processors.",
            "The relay race is the mental model: once a runner hands off the baton, they're free - each processor scales independently.",
          ],
          steps: [
            {
              title: "Build a topic",
              detail: "Publish domain events to a broker such as Kafka or Redis Streams. Include an event id, type, and timestamp.",
            },
            {
              title: "Add an idempotent consumer",
              detail: "Track processed event ids and ignore duplicates. Replay the topic and verify side effects happen once.",
            },
            {
              title: "Test replay and ordering",
              detail: "Replay from the beginning and confirm the read model rebuilds. Then send an out-of-order event and handle it explicitly.",
            },
          ],
          takeaway: "Design each processor around one task, chain them with well-named derived events, and never let an event answer itself.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "broker",
                from: "init",
                label: "publish",
              },
              {
                to: "pay",
                from: "broker",
                label: "subscribe",
              },
              {
                to: "inv",
                from: "broker",
                label: "subscribe",
              },
              {
                to: "noti",
                from: "broker",
                label: "subscribe",
              },
            ],
            nodes: [
              {
                id: "init",
                label: "Initiating: order placed",
                emphasis: true,
              },
              {
                id: "broker",
                label: "Event broker",
                emphasis: false,
              },
              {
                id: "pay",
                label: "Payment processor",
                emphasis: false,
              },
              {
                id: "inv",
                label: "Inventory processor",
                emphasis: false,
              },
              {
                id: "noti",
                label: "Notification processor",
                emphasis: false,
              },
            ],
            title: "Event flow in retail order entry",
          },
          quiz: {
            question: "What makes an event different from a message in EDA?",
            options: [
              "Events are always sent over HTTP",
              "An event reports something that already happened and typically requires no response; a message is a command or query expecting one",
              "Events are synchronous; messages are asynchronous",
              "There is no difference",
            ],
            correctIndex: 1,
            explanation: "'I just placed an order' is an event (past tense, no reply needed); 'apply the payment for this order' is a message (work to do, response expected).",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Event-Driven Architecture”?",
              options: [
                "Initiating event → broker → processor → derived event → more processors",
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Initiating event → broker → processor → derived event → more processors”",
            },
            {
              question: "Which statement best explains “Four EDA topology components”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Initiating event, event broker (federated channels/topics), event processor (service), and derived event.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Initiating event, event broker (federated channels/topics), event processor (service), and derived event.”",
            },
            {
              question: "Which of these is a hands-on step in “Event-Driven Architecture”?",
              options: [
                "Put it in CI",
                "Write a fitness function",
                "Identify the quanta",
                "Build a topic",
              ],
              correctIndex: 3,
              explanation: "“Build a topic” is part of this lesson's sequence: Publish domain events to a broker such as Kafka or Redis Streams. Include an event id, type, and timestamp.",
            },
            {
              question: "What does the hands-on step “Add an idempotent consumer” involve?",
              options: [
                "Track processed event ids and ignore duplicates. Replay the topic and verify side effects happen once.",
                "Suggest a change to the architecture or the team boundary that reduces the friction. State the tradeoff.",
                "Pick two realistic architecture options and score them against five weighted characteristics.",
                "State the winner, the margin, and the assumptions that drove the result. Name the runner-up's advantage.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add an idempotent consumer” as: Track processed event ids and ignore duplicates. Replay the topic and verify side effects happen once.",
            },
          ],
          flashcards: [
            {
              front: "Poison event",
              back: "A derived event that keeps triggering a loop between services forever - e.g., responding to inventory-adjusted with another inventory-adjusted.",
            },
            {
              front: "Four EDA topology components",
              back: "Initiating event, event broker (federated channels/topics), event processor (service), and derived event.",
            },
            {
              front: "How do you test replay and ordering?",
              back: "Replay from the beginning and confirm the read model rebuilds. Then send an out-of-order event and handle it explicitly.",
            },
            {
              front: "How do you build a topic?",
              back: "Publish domain events to a broker such as Kafka or Redis Streams. Include an event id, type, and timestamp.",
            },
            {
              front: "How do you add an idempotent consumer?",
              back: "Track processed event ids and ignore duplicates. Replay the topic and verify side effects happen once.",
            },
          ],
          sourceRef: {
            label: "Chapter 15. Event-Driven Architecture Style",
            pageStart: null,
            pageEnd: null,
            note: "Request vs event models, topology, retail order flow, events versus messages, poison events, and data topologies.",
            sectionIndexes: [
              23,
              24,
              25,
              26,
              27,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Space-Based Architecture",
          objective: "Explain how in-memory data grids remove the database bottleneck under extreme, variable load.",
          hook: "Scale the web tier, the app tier, the database - and you end up with a triangle whose narrow point is your database. Space-based flips it.",
          paragraphs: [
            "The classic request flow (browser → web → app → database) bottlenecks in sequence; scaling each tier just moves the bottleneck down until the database - hardest to scale - limits everything, producing the triangle-shaped topology. Space-based architecture solves extreme scalability, elasticity, and concurrency architecturally instead of bolting on caches: it replaces the central database as the synchronous constraint with replicated in-memory data grids, named after tuple space (parallel processors communicating through shared memory).",
            "Its artifacts work together per request: the processing unit holds application functionality and in-memory data, replicated across active units; virtualized middleware manages coordination; the messaging grid manages input requests and session state; the data grid replicates data between units; the processing grid orchestrates across multiple units; the deployment manager starts and tears down processing units as load rises and falls (variable scalability); data pumps asynchronously queue updates to the database; data writers perform those updates; data readers load database data into units at startup.",
            "Because no central database participates in standard transactional processing, the bottleneck vanishes - near-infinite application-level scalability. It fits high-volume, variable, unpredictable loads where frequent reads and data collisions must be managed carefully.",
          ],
          bullets: [
            "In-memory replicated data grids replace the synchronous database",
            "Processing units scale dynamically with load (deployment manager)",
            "Data pumps/writers persist asynchronously; readers warm units at startup",
            "Best for extreme, variable concurrency with heavy read loads",
            "The classic request flow (browser → web → app → database) bottlenecks in sequence; scaling each tier just moves the bottleneck down until the database - hardest to scale - limits everything, producing the triangle-shaped topology.",
            "Because no central database participates in standard transactional processing, the bottleneck vanishes - near-infinite application-level scalability.",
          ],
          steps: [
            {
              title: "Add an in-memory grid",
              detail: "Put a cache or data grid in front of the database. Route reads and writes through it with a clear consistency policy.",
            },
            {
              title: "Test under load",
              detail: "Drive concurrent requests and measure latency with and without the grid. Record cache hit rate.",
            },
            {
              title: "Handle a node loss",
              detail: "Stop one grid node and verify data is not lost and requests reroute. Document the recovery behavior.",
            },
          ],
          takeaway: "Move the database out of the hot path: keep data in memory, replicate it, and persist in the background.",
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
                label: "Add an in-memory grid",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Test under load",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Handle a node loss",
                emphasis: true,
              },
            ],
            title: "How Space-Based Architecture works",
          },
          quiz: {
            question: "How does space-based architecture remove the database bottleneck?",
            options: [
              "By adding read replicas to the relational database",
              "By replacing the central database as the synchronous constraint with replicated in-memory data grids, persisting asynchronously via data pumps",
              "By caching only the presentation layer",
              "By sharding every table across regions",
            ],
            correctIndex: 1,
            explanation: "Application data lives in memory across processing units; the database only receives asynchronous updates through data pumps, so no request waits on it.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Space-Based Architecture”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "In-memory replicated data grids replace the synchronous database",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “In-memory replicated data grids replace the synchronous database”",
            },
            {
              question: "Which statement best explains “Space-based architecture core idea”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Tuple-space-inspired style: replicated in-memory data grids + dynamically scaled processing units for high scalability, elasticity, and concurrency.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Tuple-space-inspired style: replicated in-memory data grids + dynamically scaled processing units for high scalability, elasticity, and concurrency.”",
            },
            {
              question: "Which of these is a hands-on step in “Space-Based Architecture”?",
              options: [
                "Define the plug-in contract",
                "Implement the calls",
                "Measure the coupling",
                "Add an in-memory grid",
              ],
              correctIndex: 3,
              explanation: "“Add an in-memory grid” is part of this lesson's sequence: Put a cache or data grid in front of the database. Route reads and writes through it with a clear consistency policy.",
            },
            {
              question: "What does the hands-on step “Test under load” involve?",
              options: [
                "Drive concurrent requests and measure latency with and without the grid. Record cache hit rate.",
                "Create a third plug-in and register it. Confirm no core file changed and the new behavior appears.",
                "Implement one real plug-in and one stub. Load both through the same registry.",
                "Write the interface a plug-in must implement, including lifecycle and error handling. Keep the core independent of concrete plug-ins.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Test under load” as: Drive concurrent requests and measure latency with and without the grid. Record cache hit rate.",
            },
          ],
          flashcards: [
            {
              front: "Data pump / data writer / data reader",
              back: "Pump: async queue of updates to the DB. Writer: performs the updates. Reader: loads DB data into processing units on startup.",
            },
            {
              front: "Space-based architecture core idea",
              back: "Tuple-space-inspired style: replicated in-memory data grids + dynamically scaled processing units for high scalability, elasticity, and concurrency.",
            },
            {
              front: "How do you add an in-memory grid?",
              back: "Put a cache or data grid in front of the database. Route reads and writes through it with a clear consistency policy.",
            },
            {
              front: "How do you handle a node loss?",
              back: "Stop one grid node and verify data is not lost and requests reroute. Document the recovery behavior.",
            },
            {
              front: "How do you test under load?",
              back: "Drive concurrent requests and measure latency with and without the grid. Record cache hit rate.",
            },
          ],
          sourceRef: {
            label: "Chapter 16. Space-Based Architecture Style",
            pageStart: null,
            pageEnd: null,
            note: "Database bottleneck problem, tuple space, primary artifacts, and when to use the style.",
            sectionIndexes: [
              28,
              29,
              30,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Orchestration-Driven SOA: A Cautionary Tale",
          objective: "Explain why a logically motivated style failed and what the First Law teaches from it.",
          hook: "Expensive licenses, frantic mergers, a philosophy of reuse - and an architecture doomed by its own logic.",
          paragraphs: [
            "Orchestration-driven SOA emerged in the late 1990s: enterprises merging rapidly needed consistency between duplicated business entities, while computing resources were scarce and commercial - so 'reuse everything' became the dominant philosophy. The style organizes a strict taxonomy of services by technical responsibility (business services, application services, infrastructure services), each layer serving the dual goals of abstraction and enterprise-level reuse. Technically partitioned to an extreme, with orchestration layers coordinating flows.",
            "The book keeps it mostly for its lesson: a logical-sounding organizational idea can hinder the most important parts of development. Reuse pushed to extremes breeds coupling - the First Law in reverse: every gain has a cost, and the cost here was rigidity and shared-everything brittleness as eras changed (the 'Why So Many Service Names?' sidebar also flags semantic diffusion: entity services in SOA differ in virtually every way from microservices services). Parts remain relevant for integration scenarios, but treat the style as history that explains why modern styles optimize for decoupling instead.",
          ],
          bullets: [
            "Driven by era economics: expensive licenses + mergers → reuse philosophy",
            "Strict service taxonomy: business / application / infrastructure layers",
            "Reuse at extremes couples everything - the First Law's price",
            "'Service' means different things in SOA, service-based, and microservices",
            "Reuse pushed to extremes breeds coupling - the First Law in reverse: every gain has a cost, and the cost here was rigidity and shared-everything brittleness as eras changed (the 'Why So Many Service Names?'",
            "Parts remain relevant for integration scenarios, but treat the style as history that explains why modern styles optimize for decoupling instead.",
          ],
          steps: [
            {
              title: "Diagram the anti-pattern",
              detail: "Draw a central orchestrator calling many services with shared contracts. Mark the single point of failure and the coupling.",
            },
            {
              title: "List the symptoms",
              detail: "Identify long release cycles, chatty calls, and shared data. Explain how each follows from the orchestration model.",
            },
            {
              title: "Propose a simplification",
              detail: "Suggest two services that could merge or an event that could replace a synchronous call. Estimate the reduction in coupling.",
            },
          ],
          takeaway: "When a style optimizes one virtue (reuse) without pricing its trade-off (coupling), expect the architecture to age into irrelevance.",
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
                label: "Diagram the anti-pattern",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "List the symptoms",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Propose a simplification",
                emphasis: true,
              },
            ],
            title: "How Orchestration-Driven SOA: A Cautionary Tale works",
          },
          quiz: {
            question: "What lesson does the authors' treatment of orchest-driven SOA emphasize?",
            options: [
              "SOA is the correct style for all enterprises today",
              "A logically motivated style can fail when it pushes one trade-off (reuse) to an extreme without accounting for its cost",
              "Orchestration is always superior to choreography",
              "Service taxonomy should be avoided in every architecture",
            ],
            correctIndex: 1,
            explanation: "The chapter exists as a case study in the First Law: reuse sounded logical but its coupling cost, combined with era-specific economics, doomed the style.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Orchestration-Driven SOA: A Cautionary Tale”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Driven by era economics: expensive licenses + mergers → reuse philosophy",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Driven by era economics: expensive licenses + mergers → reuse philosophy”",
            },
            {
              question: "Which statement best explains “Orchestration-driven SOA taxonomy”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
                "A strict layered service taxonomy (business, application, infrastructure services) built for enterprise abstraction and reuse.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “A strict layered service taxonomy (business, application, infrastructure services) built for enterprise abstraction and reuse.”",
            },
            {
              question: "Which of these is a hands-on step in “Orchestration-Driven SOA: A Cautionary Tale”?",
              options: [
                "Add one without core changes",
                "Build two plug-ins",
                "Define the plug-in contract",
                "Diagram the anti-pattern",
              ],
              correctIndex: 3,
              explanation: "“Diagram the anti-pattern” is part of this lesson's sequence: Draw a central orchestrator calling many services with shared contracts. Mark the single point of failure and the coupling.",
            },
            {
              question: "What does the hands-on step “List the symptoms” involve?",
              options: [
                "Identify long release cycles, chatty calls, and shared data. Explain how each follows from the orchestration model.",
                "Run the fitness function on every pull request. Make the failure message name the offending dependency.",
                "Draw synchronous calls and shared data between quanta. Mark where a characteristic must hold across a boundary.",
                "For a system, group components that share a database and deployment. Each group is a candidate quantum.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “List the symptoms” as: Identify long release cycles, chatty calls, and shared data. Explain how each follows from the orchestration model.",
            },
          ],
          flashcards: [
            {
              front: "Orchestration-driven SOA taxonomy",
              back: "A strict layered service taxonomy (business, application, infrastructure services) built for enterprise abstraction and reuse.",
            },
            {
              front: "Semantic diffusion",
              back: "When a term like 'service' drifts in meaning across eras and styles - entity services, domain services, and microservices services differ vastly.",
            },
            {
              front: "How do you diagram the anti-pattern?",
              back: "Draw a central orchestrator calling many services with shared contracts. Mark the single point of failure and the coupling.",
            },
            {
              front: "How do you list the symptoms?",
              back: "Identify long release cycles, chatty calls, and shared data. Explain how each follows from the orchestration model.",
            },
            {
              front: "How do you propose a simplification?",
              back: "Suggest two services that could merge or an event that could replace a synchronous call. Estimate the reduction in coupling.",
            },
          ],
          sourceRef: {
            label: "Chapter 17. Orchestration-Driven Service-Oriented Architecture",
            pageStart: null,
            pageEnd: null,
            note: "Historical context, service taxonomy, reuse and coupling, and why the style declined.",
            sectionIndexes: [
              31,
              32,
            ],
          },
          estimatedMinutes: 3,
        },
        {
          title: "Microservices",
          objective: "Apply bounded contexts, granularity, data isolation, and communication choices in microservices design.",
          hook: "Named early by Fowler and Lewis in 2014, 'microservices' is a label - and taking 'micro' literally builds a distributed mud.",
          paragraphs: [
            "Microservices was shaped deliberately: the famous 2014 post codified its characteristics, and DDD's bounded context became its philosophy - a 'share nothing' architecture where each service models one subdomain with everything it needs: its classes, its schema, its database. Internal parts may couple; nothing couples outside the context. Because reuse requires coupling (inheritance or composition), microservices favors duplication over reuse - the First Law applied: decoupling is the goal, duplication is its price.",
            "Topology: many small single-purpose services, each in its own process/container - the cloud and containers made extreme decoupling practical where licensed infrastructure never could. But the costs are real: network calls dwarf method calls, endpoint security adds latency, and experienced architects forbid transactions across service boundaries - which makes granularity the key decision. Too small and you rebuild communication links between services until you've made a Big Ball of Distributed Mud; too large and you lose the isolation benefits.",
            "Data isolation follows suit (database per service, bounded context ownership), communication splits into choreography versus orchestration, cross-service consistency uses sagas and compensating transactions, and cloud considerations (per-service provisioning, operational reuse) shape deployment.",
          ],
          bullets: [
            "Bounded context: service + schema + database, coupled only inside",
            "Duplication over reuse - decoupling is the goal of the style",
            "Granularity is the key decision: too small → distributed mud",
            "No cross-boundary transactions; sagas and compensating updates instead",
            "Because reuse requires coupling (inheritance or composition), microservices favors duplication over reuse - the First Law applied: decoupling is the goal, duplication is its price.",
            "But the costs are real: network calls dwarf method calls, endpoint security adds latency, and experienced architects forbid transactions across service boundaries - which makes granularity the key decision.",
          ],
          steps: [
            {
              title: "Define boundaries",
              detail: "Choose two business capabilities and give each its own data store and deployable service.",
            },
            {
              title: "Add a gateway",
              detail: "Route external calls through a gateway or reverse proxy. Keep service discovery and auth concerns there.",
            },
            {
              title: "Test failure isolation",
              detail: "Stop one service and confirm the other still serves its own traffic. Add a timeout or circuit breaker where the failure leaked.",
            },
          ],
          takeaway: "Draw bounded contexts first, then size services to their workflows - and pay the duplication tax willingly for decoupling.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "bc1",
                from: "sys",
                label: "owns",
              },
              {
                to: "bc2",
                from: "sys",
                label: "owns",
              },
              {
                to: "bc3",
                from: "sys",
                label: "owns",
              },
              {
                to: "bc2",
                from: "bc1",
                label: "loose msgs only",
              },
            ],
            nodes: [
              {
                id: "sys",
                label: "System",
                emphasis: false,
              },
              {
                id: "bc1",
                label: "Catalog context (svc + DB)",
                emphasis: true,
              },
              {
                id: "bc2",
                label: "Checkout context (svc + DB)",
                emphasis: true,
              },
              {
                id: "bc3",
                label: "Shipping context (svc + DB)",
                emphasis: false,
              },
            ],
            title: "Bounded contexts as share-nothing services",
          },
          quiz: {
            question: "Why does microservices architecture favor duplication over shared code?",
            options: [
              "Because shared code cannot be tested",
              "Because reuse requires coupling, and the primary goal of the style is decoupling between bounded contexts",
              "Because databases cannot be shared under any circumstances",
              "Because duplication improves runtime performance",
            ],
            correctIndex: 1,
            explanation: "The First Law: reuse costs coupling. Two contexts sharing an Address class are now coupled - so each context keeps its own version and reconciles at communication points.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Microservices”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "Bounded context: service + schema + database, coupled only inside",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Bounded context: service + schema + database, coupled only inside”",
            },
            {
              question: "Which statement best explains “Bounded context (microservices)”?",
              options: [
                "A decoupled slice containing everything a subdomain needs - services, classes, schema, database - never coupled to anything outside the context.",
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “A decoupled slice containing everything a subdomain needs - services, classes, schema, database - never coupled to anything outside the context.”",
            },
            {
              question: "Which of these is a hands-on step in “Microservices”?",
              options: [
                "Split one quantum",
                "Check cohesion and coupling",
                "Decompose the domain",
                "Define boundaries",
              ],
              correctIndex: 3,
              explanation: "“Define boundaries” is part of this lesson's sequence: Choose two business capabilities and give each its own data store and deployable service.",
            },
            {
              question: "What does the hands-on step “Add a gateway” involve?",
              options: [
                "Route external calls through a gateway or reverse proxy. Keep service discovery and auth concerns there.",
                "Have a peer challenge the decision. Update the record with the strongest counterargument.",
                "Record the context, decision, alternatives, and consequences for a real choice. Give it a number and status.",
                "Choose the highest risk and write a concrete mitigation, owner, and check. Add it to the architecture backlog.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add a gateway” as: Route external calls through a gateway or reverse proxy. Keep service discovery and auth concerns there.",
            },
          ],
          flashcards: [
            {
              front: "Bounded context (microservices)",
              back: "A decoupled slice containing everything a subdomain needs - services, classes, schema, database - never coupled to anything outside the context.",
            },
            {
              front: "Big Ball of Distributed Mud",
              back: "The result of services made too small: you rebuild communication links between them, negating the point of distribution.",
            },
            {
              front: "How do you add a gateway?",
              back: "Route external calls through a gateway or reverse proxy. Keep service discovery and auth concerns there.",
            },
            {
              front: "How do you test failure isolation?",
              back: "Stop one service and confirm the other still serves its own traffic. Add a timeout or circuit breaker where the failure leaked.",
            },
            {
              front: "How do you define boundaries?",
              back: "Choose two business capabilities and give each its own data store and deployable service.",
            },
          ],
          sourceRef: {
            label: "Chapter 18. Microservices Architecture",
            pageStart: null,
            pageEnd: null,
            note: "DDD bounded context philosophy, topology, granularity, data isolation, choreography/orchestration, sagas, cloud.",
            sectionIndexes: [
              33,
              34,
              35,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Choosing the Appropriate Architecture Style",
          objective: "Use the decision process and style ratings to select a starting style for a problem domain.",
          hook: "The most important chapter is one sentence long: 'It depends!' - and here's how to make 'it depends' rigorous.",
          paragraphs: [
            "The authors refuse to name a winner: nothing is more contextual to an organization and what it builds. Choosing a style is the culmination of the whole Part I process - analyzing trade-offs for architectural characteristics, domain considerations, and constraints. The decision tree from Chapter 7 operationalizes it: can the system succeed with a single set of characteristics? If yes, choose a monolithic style (layered, modular monolith, pipeline, microkernel).",
            "If it needs multiple sets, go distributed: define quantum boundaries, choose persistence (single database vs database-per-service), then choose communication (synchronous vs asynchronous) - remembering that sync calls can reshape your quantum boundaries.",
            "Each style chapter contributes a Style Characteristics table - star ratings across scalability, elasticity, performance, etc. - which turn 'it depends' into a comparative scoring exercise. Real systems also combine styles: a modular monolith core with a service-based integration edge, or event-driven feeding a space-based analytics unit. The practical sequence: extract characteristics (Part I), score candidate styles against them, weigh team topology and deployment maturity, then record the choice - with its trade-offs - as an architecture decision.",
          ],
          bullets: [
            "Single characteristic set → monolith; multiple clusters → distributed",
            "Distributed path: quanta → persistence → communication",
            "Compare styles with the star-rated characteristics tables",
            "Styles compose; document the choice and its trade-offs",
            "The authors refuse to name a winner: nothing is more contextual to an organization and what it builds.",
            "The decision tree from Chapter 7 operationalizes it: can the system succeed with a single set of characteristics?",
          ],
          steps: [
            {
              title: "Build a decision matrix",
              detail: "List five characteristics as rows and four candidate styles as columns. Score each style 1-5 with a short justification.",
            },
            {
              title: "Weight the rows",
              detail: "Assign weights to the characteristics based on business priorities. Recompute the scores.",
            },
            {
              title: "Defend the choice",
              detail: "Write the recommendation, the runner-up, and the conditions that would change your mind.",
            },
          ],
          takeaway: "'It depends' means: run the analysis, score the options against your characteristics, and write down why.",
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
                label: "Build a decision matrix",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Weight the rows",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Defend the choice",
                emphasis: true,
              },
            ],
            title: "How Choosing the Appropriate Architecture Style works",
          },
          quiz: {
            question: "A system needs only one set of architectural characteristics. What does the decision process recommend?",
            options: [
              "Microservices immediately",
              "A monolithic style (layered, modular monolith, pipeline, or microkernel) as the starting point",
              "Space-based architecture for safety",
              "Event-driven architecture for flexibility",
            ],
            correctIndex: 1,
            explanation: "One characteristic set means the single-quantum path: pick a monolithic style and skip the distributed decision steps entirely.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Choosing the Appropriate Architecture Style”?",
              options: [
                "Single characteristic set → monolith; multiple clusters → distributed",
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Single characteristic set → monolith; multiple clusters → distributed”",
            },
            {
              question: "Which statement best explains “Style-selection decision tree”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "One set of characteristics → monolith; multiple sets → distributed: define quanta, choose persistence, choose communication style.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “One set of characteristics → monolith; multiple sets → distributed: define quanta, choose persistence, choose communication style.”",
            },
            {
              question: "Which of these is a hands-on step in “Choosing the Appropriate Architecture Style”?",
              options: [
                "Find the cognitive load",
                "Map the teams",
                "Propose a change",
                "Build a decision matrix",
              ],
              correctIndex: 3,
              explanation: "“Build a decision matrix” is part of this lesson's sequence: List five characteristics as rows and four candidate styles as columns. Score each style 1-5 with a short justification.",
            },
            {
              question: "What does the hands-on step “Weight the rows” involve?",
              options: [
                "Assign weights to the characteristics based on business priorities. Recompute the scores.",
                "For one module, count afferent and efferent dependencies. Calculate instability as efferent divided by total coupling.",
                "Introduce an interface or move a shared type to break a cycle. Recompute the metrics and show the change.",
                "Choose the three that matter most for a sample system. Explain why the others are lower priority.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Weight the rows” as: Assign weights to the characteristics based on business priorities. Recompute the scores.",
            },
          ],
          flashcards: [
            {
              front: "Style-selection decision tree",
              back: "One set of characteristics → monolith; multiple sets → distributed: define quanta, choose persistence, choose communication style.",
            },
            {
              front: "Style Characteristics tables",
              back: "Per-chapter star ratings (scalability, elasticity, performance, complexity...) used to compare candidate styles against your requirements.",
            },
            {
              front: "How do you defend the choice?",
              back: "Write the recommendation, the runner-up, and the conditions that would change your mind.",
            },
            {
              front: "How do you build a decision matrix?",
              back: "List five characteristics as rows and four candidate styles as columns. Score each style 1-5 with a short justification.",
            },
            {
              front: "How do you weight the rows?",
              back: "Assign weights to the characteristics based on business priorities. Recompute the scores.",
            },
          ],
          sourceRef: {
            label: "Chapter 19. Choosing the Appropriate Architecture Style",
            pageStart: null,
            pageEnd: null,
            note: "'It depends' - decision criteria, style ratings, and combining styles.",
            sectionIndexes: [
              36,
            ],
          },
          estimatedMinutes: 3,
        },
      ],
    },
    {
      title: "Deciding, Documenting, and Delivering",
      summary: "Chapters 20-27: recurring patterns, decision antipatterns and ADRs, risk storming, diagramming, team effectiveness, negotiation, intersections, and the laws revisited.",
      lessons: [
        {
          title: "Architectural Patterns That Recur",
          objective: "Separate domain from operational coupling using hexagonal, sidecar, and service mesh patterns.",
          hook: "Domain code should stay private; monitoring, auth, and logging should not. Patterns tell you where each belongs.",
          paragraphs: [
            "Chapter 20 distinguishes patterns from 'best practices' - the latter invites shutting off your brain - and from implementations: identify the pattern first, then pick a tool. Its worked example is reuse in distributed systems. Domain coupling should stay low: services keep internal entity representations and exchange loose name-value data (JSON), accepting duplication because in microservices, coupling is worse than duplication.",
            "But operational capabilities - monitoring, logging, authentication, circuit breakers - benefit from consistent, high-coupling standards, and leaving each team to implement them individually descends into chaos.",
            "The patterns solve different halves. Hexagonal (Ports and Adapters, Cockburn) puts domain logic in the center with ports/adapters around it - but the book flags its data-fidelity flaw for microservices: treating the database as a mere adapter ignores that schemas are business logic (Evans' correction in DDD); the name itself was Cockburn's regret. The Sidecar pattern isolates cross-cutting operational concerns in a layer that cuts across domains - orthogonal reuse, since operations must span the domain hierarchy. Service Mesh is the modern mechanism implementing that separation at infrastructure level.",
            "The broker-domain pattern closes the chapter's pattern survey for event-driven systems.",
          ],
          bullets: [
            "Patterns ≠ best practices ≠ implementations - identify before choosing tools",
            "Domain: duplicate rather than couple (JSON at the boundaries)",
            "Operational: standardize via sidecar/service mesh cross-cutting layers",
            "Hexagonal's data-fidelity trap: schemas are business logic",
            "Chapter 20 distinguishes patterns from 'best practices' - the latter invites shutting off your brain - and from implementations: identify the pattern first, then pick a tool.",
            "Domain coupling should stay low: services keep internal entity representations and exchange loose name-value data (JSON), accepting duplication because in microservices, coupling is worse than duplication.",
          ],
          steps: [
            {
              title: "Map patterns to a system",
              detail: "Find examples of layered, pipeline, and event-driven patterns in one codebase. Note where each appears.",
            },
            {
              title: "Name the forces",
              detail: "For each pattern, write the problem it solves and the cost it introduces.",
            },
            {
              title: "Document the reuse",
              detail: "Create a short pattern catalog for your team with one local example per pattern.",
            },
          ],
          takeaway: "Keep domain coupling low and operational coupling high - and let patterns, not buzzwords, decide where code goes.",
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
                label: "Map patterns to a system",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Name the forces",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Document the reuse",
                emphasis: true,
              },
            ],
            title: "How Architectural Patterns That Recur works",
          },
          quiz: {
            question: "In microservices, why is shared monitoring code per team problematic?",
            options: [
              "Monitoring cannot be written in the service's language",
              "Operational capabilities benefit from consistent standards; per-team copies create coordination and upgrade chaos - use sidecar/service mesh instead",
              "Monitoring increases domain coupling, which is required",
              "It violates the First Law of Software Architecture",
            ],
            correctIndex: 1,
            explanation: "Operational reuse wants high, consistent coupling (one standard tool); the solution is cross-cutting sidecar/service mesh layers, not per-team implementations or domain-shared libraries.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Architectural Patterns That Recur”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Patterns ≠ best practices ≠ implementations - identify before choosing tools",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Patterns ≠ best practices ≠ implementations - identify before choosing tools”",
            },
            {
              question: "Which statement best explains “Hexagonal / Ports and Adapters”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Domain logic centered with adapters around it; its flaw for microservices is treating the DB schema as a pluggable adapter rather than business logic.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Domain logic centered with adapters around it; its flaw for microservices is treating the DB schema as a pluggable adapter rather than business logic.”",
            },
            {
              question: "Which of these is a hands-on step in “Architectural Patterns That Recur”?",
              options: [
                "Map the coupling",
                "Split one quantum",
                "Check cohesion and coupling",
                "Map patterns to a system",
              ],
              correctIndex: 3,
              explanation: "“Map patterns to a system” is part of this lesson's sequence: Find examples of layered, pipeline, and event-driven patterns in one codebase. Note where each appears.",
            },
            {
              question: "What does the hands-on step “Name the forces” involve?",
              options: [
                "For each pattern, write the problem it solves and the cost it introduces.",
                "List five characteristics as rows and four candidate styles as columns. Score each style 1-5 with a short justification.",
                "Write the recommendation, the runner-up, and the conditions that would change your mind.",
                "Find a decision made without alternatives or without recording consequences. Explain the risk.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Name the forces” as: For each pattern, write the problem it solves and the cost it introduces.",
            },
          ],
          flashcards: [
            {
              front: "Sidecar / Service Mesh",
              back: "Orthogonal reuse patterns putting cross-cutting operational concerns (monitoring, auth, logging) in a consistent layer spanning domains.",
            },
            {
              front: "Hexagonal / Ports and Adapters",
              back: "Domain logic centered with adapters around it; its flaw for microservices is treating the DB schema as a pluggable adapter rather than business logic.",
            },
            {
              front: "How do you map patterns to a system?",
              back: "Find examples of layered, pipeline, and event-driven patterns in one codebase. Note where each appears.",
            },
            {
              front: "How do you document the reuse?",
              back: "Create a short pattern catalog for your team with one local example per pattern.",
            },
            {
              front: "How do you name the forces?",
              back: "For each pattern, write the problem it solves and the cost it introduces.",
            },
          ],
          sourceRef: {
            label: "Chapter 20. Architectural Patterns",
            pageStart: null,
            pageEnd: null,
            note: "Patterns vs best practices, separating domain and operational coupling, hexagonal, sidecar, service mesh, broker-domain.",
            sectionIndexes: [
              37,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Decision Antipatterns and Architecture Decision Records",
          objective: "Avoid the three decision antipatterns and document decisions in a single system of record.",
          hook: "Decide too late, you analyze forever. Decide without reasons, you relive the debate. Decide by email, you lose it entirely.",
          paragraphs: [
            "Three antipatterns usually appear in sequence. Covering Your Assets: fear of choosing wrongly leads to deferral - beat it by deciding at the last responsible moment (when the cost of deferring exceeds the risk of deciding - the cost/risk curves crossing) and by collaborating with development teams, who surface feasibility issues early (the replicated-cache decision adjusted once teams revealed memory limits).",
            "Groundhog Day: people relitigate a decision forever because it was never justified - provide technical AND business justifications; the four common business drivers are cost, time to market, user satisfaction, and strategic positioning, and if there's no business value, reconsider the decision entirely.",
            "Email-Driven Architecture: decisions scattered across inboxes become unfindable and unsupersedeable - email states context and links to a single system of record, never the decision body itself; the litmus test for recipients is 'does this directly impact you?' That record is the Architecture Decision Record: a basic structure (title, status, context, decision, consequences), stored in a single canonical place, usable as documentation and as standards, and adaptable to existing systems.",
            "The second edition adds guidance on leveraging generative AI and LLMs in architectural decisions - useful for gathering context, with human judgment firmly on the trade-offs.",
          ],
          bullets: [
            "Covering Your Assets → decide at the last responsible moment",
            "Groundhog Day → technical + business justification (cost, TTM, satisfaction, positioning)",
            "Email-Driven → one system of record; email carries context + link",
            "ADRs: title, status, context, decision, consequences - stored canonically",
            "That record is the Architecture Decision Record: a basic structure (title, status, context, decision, consequences), stored in a single canonical place, usable as documentation and as standards, and adaptable to existing systems.",
            "The second edition adds guidance on leveraging generative AI and LLMs in architectural decisions - useful for gathering context, with human judgment firmly on the trade-offs.",
          ],
          steps: [
            {
              title: "Write an ADR",
              detail: "Record the context, decision, alternatives, and consequences for a real choice. Give it a number and status.",
            },
            {
              title: "Spot an antipattern",
              detail: "Find a decision made without alternatives or without recording consequences. Explain the risk.",
            },
            {
              title: "Review the ADR",
              detail: "Have a peer challenge the decision. Update the record with the strongest counterargument.",
            },
          ],
          takeaway: "Decide when cost-of-waiting exceeds risk, justify in business terms, and write it down in one canonical place.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "gh",
                from: "cya",
                label: "overcome",
              },
              {
                to: "eda",
                from: "gh",
                label: "overcome",
              },
              {
                to: "adr",
                from: "eda",
                label: "fix with",
              },
            ],
            nodes: [
              {
                id: "cya",
                label: "Covering Your Assets",
                emphasis: true,
              },
              {
                id: "gh",
                label: "Groundhog Day",
                emphasis: true,
              },
              {
                id: "eda",
                label: "Email-Driven Architecture",
                emphasis: true,
              },
              {
                id: "adr",
                label: "ADR in one record",
                emphasis: true,
              },
            ],
            title: "The decision antipattern progression",
          },
          quiz: {
            question: "When is the 'last responsible moment' to make an architectural decision?",
            options: [
              "As early as possible, before any analysis",
              "When the cost of deferring the decision exceeds the risk associated with deciding",
              "After the development team has finished the implementation",
              "When every stakeholder unanimously agrees",
            ],
            correctIndex: 1,
            explanation: "Early on, risk is high but deferral cheap; later, risk falls but cost climbs - the crossing point (cost increase exceeds risk reduction) is the moment to decide.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Decision Antipatterns and Architecture Decision Records”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Covering Your Assets → decide at the last responsible moment",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Covering Your Assets → decide at the last responsible moment”",
            },
            {
              question: "Which statement best explains “Three architecture decision antipatterns”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
                "Covering Your Assets (fear-driven deferral), Groundhog Day (unjustified relitigating), Email-Driven Architecture (decisions lost in inboxes).",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Covering Your Assets (fear-driven deferral), Groundhog Day (unjustified relitigating), Email-Driven Architecture (decisions lost in inboxes).”",
            },
            {
              question: "Which of these is a hands-on step in “Decision Antipatterns and Architecture Decision Records”?",
              options: [
                "Add a filter",
                "Build a pipeline",
                "Test failure handling",
                "Write an ADR",
              ],
              correctIndex: 3,
              explanation: "“Write an ADR” is part of this lesson's sequence: Record the context, decision, alternatives, and consequences for a real choice. Give it a number and status.",
            },
            {
              question: "What does the hands-on step “Spot an antipattern” involve?",
              options: [
                "Find a decision made without alternatives or without recording consequences. Explain the risk.",
                "Run the fitness function on every pull request. Make the failure message name the offending dependency.",
                "Draw synchronous calls and shared data between quanta. Mark where a characteristic must hold across a boundary.",
                "For a system, group components that share a database and deployment. Each group is a candidate quantum.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Spot an antipattern” as: Find a decision made without alternatives or without recording consequences. Explain the risk.",
            },
          ],
          flashcards: [
            {
              front: "ADR basic structure",
              back: "Title, status, context, decision, consequences - kept in a single system of record, never pasted into email bodies.",
            },
            {
              front: "Three architecture decision antipatterns",
              back: "Covering Your Assets (fear-driven deferral), Groundhog Day (unjustified relitigating), Email-Driven Architecture (decisions lost in inboxes).",
            },
            {
              front: "How do you review the ADR?",
              back: "Have a peer challenge the decision. Update the record with the strongest counterargument.",
            },
            {
              front: "How do you write an ADR?",
              back: "Record the context, decision, alternatives, and consequences for a real choice. Give it a number and status.",
            },
            {
              front: "How do you spot an antipattern?",
              back: "Find a decision made without alternatives or without recording consequences. Explain the risk.",
            },
          ],
          sourceRef: {
            label: "Chapter 21. Architectural Decisions",
            pageStart: null,
            pageEnd: null,
            note: "Decision antipatterns, justifications, single system of record, ADRs, and generative AI in decisions.",
            sectionIndexes: [
              38,
              39,
              40,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Analyzing Risk with Risk Storming",
          objective: "Quantify risk with the matrix and run a three-phase risk storming session.",
          hook: "Subjective risk arguments go nowhere. Multiply impact by likelihood, add direction, and get the whole team to score it.",
          paragraphs: [
            "The risk-assessment matrix makes risk objective: rate impact and likelihood low/medium/high (1-3), multiply at each intersection - 1-2 low, 3-4 medium, 6-9 high. Rate impact first, and when unsure of likelihood, use high until proven otherwise (the book's database example: high impact × low likelihood on clustered HA servers = 3, medium).",
            "A risk assessment then plots architectural characteristics as criteria against domain contexts as columns (not services - too fine-grained to capture communication risk), totals each row and column to find priorities (data integrity at 17 vs availability at 10), and filters noise to highlight signal for stakeholders.",
            "A snapshot lacks direction, so continuous fitness-function measurement adds a third dimension: rising triangle (worsening), falling (improving), steady. Then risk storming: no architect knows the whole system alone, so run it collaboratively with senior developers and tech leads. Phase 1 - identification: participants score the architecture individually, alone, so nobody influences anyone else's attention. Phase 2 - consensus: the group reconciles scores and discusses the hotspots. Phase 3 - mitigation: agree solutions.",
            "All three phases run against an up-to-date architecture diagram (Chapter 23), with the facilitator distributing it beforehand. Availability, elasticity, and security are common dimensions to examine.",
          ],
          bullets: [
            "Matrix: impact × likelihood, 1-2 low / 3-4 medium / 6-9 high",
            "Characteristics = criteria, domains = contexts; filter signal from noise",
            "Add direction via fitness-function trends",
            "Risk storming: individual scoring → consensus → mitigation",
            "The risk-assessment matrix makes risk objective: rate impact and likelihood low/medium/high (1-3), multiply at each intersection - 1-2 low, 3-4 medium, 6-9 high.",
            "Rate impact first, and when unsure of likelihood, use high until proven otherwise (the book's database example: high impact × low likelihood on clustered HA servers = 3, medium).",
          ],
          steps: [
            {
              title: "Run the session",
              detail: "Put a diagram on the wall and have participants mark risks individually before discussing them.",
            },
            {
              title: "Rank the risks",
              detail: "Score impact and likelihood for each mark. Group duplicates and keep the top five.",
            },
            {
              title: "Mitigate one",
              detail: "Choose the highest risk and write a concrete mitigation, owner, and check. Add it to the architecture backlog.",
            },
          ],
          takeaway: "Score risk objectively, show its direction, and let the team - not one architect - find and fix the hotspots.",
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
                label: "Run the session",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Rank the risks",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Mitigate one",
                emphasis: true,
              },
            ],
            title: "How Analyzing Risk with Risk Storming works",
          },
          quiz: {
            question: "Why does phase 1 of risk storming have participants score individually and alone?",
            options: [
              "To save meeting time",
              "So participants don't influence each other or direct attention away from particular areas",
              "Because developers cannot collaborate effectively",
              "To produce a statistical average automatically",
            ],
            correctIndex: 1,
            explanation: "Individual identification prevents anchoring and groupthink; the collaborative phases come only after everyone has committed their own scores.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Analyzing Risk with Risk Storming”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "Matrix: impact × likelihood, 1-2 low / 3-4 medium / 6-9 high",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Matrix: impact × likelihood, 1-2 low / 3-4 medium / 6-9 high”",
            },
            {
              question: "Which statement best explains “Architecture risk matrix”?",
              options: [
                "Impact (1-3) × likelihood (1-3): 1-2 = low, 3-4 = medium, 6-9 = high. Consider impact first; assume high likelihood until confirmed.",
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Impact (1-3) × likelihood (1-3): 1-2 = low, 3-4 = medium, 6-9 = high. Consider impact first; assume high likelihood until confirmed.”",
            },
            {
              question: "Which of these is a hands-on step in “Analyzing Risk with Risk Storming”?",
              options: [
                "Interview a stakeholder",
                "Rank them",
                "Validate the list",
                "Run the session",
              ],
              correctIndex: 3,
              explanation: "“Run the session” is part of this lesson's sequence: Put a diagram on the wall and have participants mark risks individually before discussing them.",
            },
            {
              question: "What does the hands-on step “Rank the risks” involve?",
              options: [
                "Score impact and likelihood for each mark. Group duplicates and keep the top five.",
                "Pick a system you know and write its architecture as the set of structures, decisions, and constraints that are hard to change.",
                "Choose a system and show one decision that improved performance but hurt maintainability, or the reverse.",
                "Decide whether the tradeoff was worth it for that context. Write the conditions under which you would reverse it.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Rank the risks” as: Score impact and likelihood for each mark. Group duplicates and keep the top five.",
            },
          ],
          flashcards: [
            {
              front: "Three phases of risk storming",
              back: "1) Identification (individual scoring), 2) Consensus (group reconciles), 3) Mitigation (solutions) - all over an architecture diagram.",
            },
            {
              front: "Architecture risk matrix",
              back: "Impact (1-3) × likelihood (1-3): 1-2 = low, 3-4 = medium, 6-9 = high. Consider impact first; assume high likelihood until confirmed.",
            },
            {
              front: "How do you run the session?",
              back: "Put a diagram on the wall and have participants mark risks individually before discussing them.",
            },
            {
              front: "How do you rank the risks?",
              back: "Score impact and likelihood for each mark. Group duplicates and keep the top five.",
            },
            {
              front: "How do you mitigate one?",
              back: "Choose the highest risk and write a concrete mitigation, owner, and check. Add it to the architecture backlog.",
            },
          ],
          sourceRef: {
            label: "Chapter 22. Analyzing Architecture Risk",
            pageStart: null,
            pageEnd: null,
            note: "Risk matrix, risk assessments with direction, and the three phases of risk storming.",
            sectionIndexes: [
              41,
              42,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Diagramming Architecture",
          objective: "Communicate architecture with representational consistency, low-fidelity iteration, and semantic layers.",
          hook: "No matter how brilliant your idea, if you can't draw it, you can't fund it or build it.",
          paragraphs: [
            "Diagramming is a core architect communication skill: start with the whole topology before drilling down - show each view's place within the overall architecture or viewers get lost (representational consistency applies to diagrams and presentations alike). Tooling advice starts with restraint: build low-fidelity artifacts early, because attachment grows with time invested - the Irrational Artifact Attachment antipattern (four hours in Visio produces four hours of stubbornness).",
            "Ephemeral artifacts - index cards, whiteboards, tablet canvases with copy/paste 'what if' scenarios - keep the design honest until the team has iterated enough to deserve a polished diagram.",
            "When the polished diagram comes: use layers semantically, not decoratively. The base layer is topology - containers, databases, brokers - phrased architecturally ('synchronous communication', not 'Kafka'); the next layer adds implementation specifics; further layers can overlay DDD boundaries or transactional scope. Stencils give organizational consistency and speed; magnets snap lines correctly.",
            "Know the standards landscape - UML, C4, ArchiMate - and follow diagram guidelines (legends, consistent notation, avoid crossing lines), but remember collaboration beats artifact: the goal is shared understanding, not art.",
          ],
          bullets: [
            "Representational consistency: show the whole before the part",
            "Low-fidelity first - attachment scales with time invested",
            "Semantic layers: topology first, implementation second, overlays third",
            "UML/C4/ArchiMate as vocabulary; collaboration over polish",
            "Tooling advice starts with restraint: build low-fidelity artifacts early, because attachment grows with time invested - the Irrational Artifact Attachment antipattern (four hours in Visio produces four hours of stubbornness).",
            "Know the standards landscape - UML, C4, ArchiMate - and follow diagram guidelines (legends, consistent notation, avoid crossing lines), but remember collaboration beats artifact: the goal is shared understanding, not art.",
          ],
          steps: [
            {
              title: "Draw the context view",
              detail: "Show the system, its users, and external systems with arrows for data flow. Keep technology out of this level.",
            },
            {
              title: "Draw the container view",
              detail: "Show deployable units, databases, and protocols. Label every arrow with the protocol and direction.",
            },
            {
              title: "Review for clarity",
              detail: "Ask someone unfamiliar to explain the diagram back. Fix any arrow or box they cannot justify.",
            },
          ],
          takeaway: "Sketch cheaply, iterate with the team, then draw the polished diagram in semantic layers everyone can read.",
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
                label: "Draw the context view",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Draw the container view",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Review for clarity",
                emphasis: true,
              },
            ],
            title: "How Diagramming Architecture works",
          },
          quiz: {
            question: "What is the Irrational Artifact Attachment antipattern?",
            options: [
              "Refusing to use any diagramming tool",
              "Attachment to a diagram proportional to the time spent producing it, which resists necessary change",
              "Using too many colors in a diagram",
              "Sharing diagrams with stakeholders too early",
            ],
            correctIndex: 1,
            explanation: "Four hours in a fancy tool creates more stubbornness than two - hence low-fidelity, throwaway artifacts early in design.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Diagramming Architecture”?",
              options: [
                "Representational consistency: show the whole before the part",
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Representational consistency: show the whole before the part”",
            },
            {
              question: "Which statement best explains “Representational consistency”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Always show relationships between parts before changing views/zoom levels, so viewers keep their sense of scope.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Always show relationships between parts before changing views/zoom levels, so viewers keep their sense of scope.”",
            },
            {
              question: "Which of these is a hands-on step in “Diagramming Architecture”?",
              options: [
                "Propose a change",
                "Find the shared constraint",
                "Role-play the conflict",
                "Draw the context view",
              ],
              correctIndex: 3,
              explanation: "“Draw the context view” is part of this lesson's sequence: Show the system, its users, and external systems with arrows for data flow. Keep technology out of this level.",
            },
            {
              question: "What does the hands-on step “Draw the container view” involve?",
              options: [
                "Show deployable units, databases, and protocols. Label every arrow with the protocol and direction.",
                "Add a test that forbids the domain from importing the web or database layer. Run it in CI.",
                "Implement presentation, domain, and persistence layers for one feature. Keep the domain free of framework imports.",
                "Trace one request through the layers and count the mapping steps. Decide whether the isolation is worth it here.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Draw the container view” as: Show deployable units, databases, and protocols. Label every arrow with the protocol and direction.",
            },
          ],
          flashcards: [
            {
              front: "Representational consistency",
              back: "Always show relationships between parts before changing views/zoom levels, so viewers keep their sense of scope.",
            },
            {
              front: "Semantic layering in diagrams",
              back: "Base layer: architecture topology without implementation names. Next: implementation details. Extra layers: DDD boundaries, transactional scope, etc.",
            },
            {
              front: "How do you review for clarity?",
              back: "Ask someone unfamiliar to explain the diagram back. Fix any arrow or box they cannot justify.",
            },
            {
              front: "How do you draw the container view?",
              back: "Show deployable units, databases, and protocols. Label every arrow with the protocol and direction.",
            },
            {
              front: "How do you draw the context view?",
              back: "Show the system, its users, and external systems with arrows for data flow. Keep technology out of this level.",
            },
          ],
          sourceRef: {
            label: "Chapter 23. Diagramming Architecture",
            pageStart: null,
            pageEnd: null,
            note: "Communication, representational consistency, tools, artifact attachment, semantic layers, and standards.",
            sectionIndexes: [
              43,
            ],
          },
          estimatedMinutes: 3,
        },
        {
          title: "Making Teams Effective",
          objective: "Set constraints of the right tightness and choose the effective-architect personality.",
          hook: "Too tight a room and developers leave. Too big a room and they design the architecture themselves. Aim for the right walls.",
          paragraphs: [
            "The traditional model - architect hands drawings over a one-way barrier to developers - fails because decisions don't flow down and reality doesn't flow up. The fix is a bidirectional, collaborative relationship: architect and team as one virtual team, enabling mentoring, coaching, and architectures that evolve per iteration.",
            "Constraints form the room the team works in: too many constraints (a control-freak architect banning libraries, dictating class design, even writing pseudocode - stealing the art of programming) breeds frustration and attrition; too few (the armchair architect) force developers into endless proofs of concept and design arguments, unproductive and confused. The effective architect provides appropriate boundaries.",
            "The chapter also names the organizational mechanics: process loss (work degraded by coordination overhead), pluralistic ignorance (teams privately disagree but assume everyone else agrees), and checklists as the countermeasures - developer code-completion checklists, unit/functional testing checklists (assertions included - no metric gaming), and software-release checklists, à la The Checklist Manifesto. And architects must connect decisions to business justifications so teams understand why the walls exist - because guidance without rationale reads as arbitrary control.",
            "Leading by example, integrating with the development team, and protecting developer flow state complete the picture.",
          ],
          bullets: [
            "Replace the one-way handoff with bidirectional collaboration",
            "Constraints are a room: control-freak (too tight) vs armchair (too loose)",
            "Process loss and pluralistic ignorance quietly damage teams",
            "Checklists operationalize quality without nagging",
            "The traditional model - architect hands drawings over a one-way barrier to developers - fails because decisions don't flow down and reality doesn't flow up.",
            "And architects must connect decisions to business justifications so teams understand why the walls exist - because guidance without rationale reads as arbitrary control.",
          ],
          steps: [
            {
              title: "Map the teams",
              detail: "List teams, their ownership, and their dependencies. Identify one stream-aligned, platform, and enabling role.",
            },
            {
              title: "Find the cognitive load",
              detail: "Mark the systems each team must understand. Flag any team owning too many unrelated domains.",
            },
            {
              title: "Propose a change",
              detail: "Suggest one boundary or platform service that would reduce load. State the tradeoff and the migration cost.",
            },
          ],
          takeaway: "Give teams walls they understand - tight enough to protect the architecture, loose enough to do real work.",
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
                label: "Map the teams",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Find the cognitive load",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Propose a change",
                emphasis: true,
              },
            ],
            title: "How Making Teams Effective works",
          },
          quiz: {
            question: "What characterizes the 'armchair architect' personality?",
            options: [
              "They write pseudocode for every class",
              "They provide too few constraints, leaving developers to make architectural decisions themselves",
              "They attend every daily standup",
              "They enforce fitness functions in CI",
            ],
            correctIndex: 1,
            explanation: "Control-freaks produce tight boundaries; armchair architects produce loose ones; effective architects produce appropriate boundaries - the Goldilocks room.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Making Teams Effective”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Replace the one-way handoff with bidirectional collaboration",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Replace the one-way handoff with bidirectional collaboration”",
            },
            {
              question: "Which statement best explains “Three architect personalities”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Control-freak (too tight, steals programming), armchair (too loose, developers decide everything), effective (appropriate boundaries).",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Control-freak (too tight, steals programming), armchair (too loose, developers decide everything), effective (appropriate boundaries).”",
            },
            {
              question: "Which of these is a hands-on step in “Making Teams Effective”?",
              options: [
                "Compute coupling",
                "Draw the graph",
                "Define ten characteristics",
                "Map the teams",
              ],
              correctIndex: 3,
              explanation: "“Map the teams” is part of this lesson's sequence: List teams, their ownership, and their dependencies. Identify one stream-aligned, platform, and enabling role.",
            },
            {
              question: "What does the hands-on step “Find the cognitive load” involve?",
              options: [
                "Mark the systems each team must understand. Flag any team owning too many unrelated domains.",
                "Implement presentation, domain, and persistence layers for one feature. Keep the domain free of framework imports.",
                "Trace one request through the layers and count the mapping steps. Decide whether the isolation is worth it here.",
                "Add build or test rules that block cross-module access to internal packages. Verify a violation fails.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Find the cognitive load” as: Mark the systems each team must understand. Flag any team owning too many unrelated domains.",
            },
          ],
          flashcards: [
            {
              front: "Three architect personalities",
              back: "Control-freak (too tight, steals programming), armchair (too loose, developers decide everything), effective (appropriate boundaries).",
            },
            {
              front: "Constraints and boundaries",
              back: "The 'room' teams build in: too tight → frustration/attrition; too loose → confusion, endless PoCs, unproductive design arguments.",
            },
            {
              front: "How do you find the cognitive load?",
              back: "Mark the systems each team must understand. Flag any team owning too many unrelated domains.",
            },
            {
              front: "How do you map the teams?",
              back: "List teams, their ownership, and their dependencies. Identify one stream-aligned, platform, and enabling role.",
            },
            {
              front: "How do you propose a change?",
              back: "Suggest one boundary or platform service that would reduce load. State the tradeoff and the migration cost.",
            },
          ],
          sourceRef: {
            label: "Chapter 24. Making Teams Effective",
            pageStart: null,
            pageEnd: null,
            note: "Collaboration model, constraints as a room, architect personalities, process loss, and checklists.",
            sectionIndexes: [
              44,
              45,
              46,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Negotiating with Stakeholders, Architects, and Developers",
          objective: "Use information and quantification to negotiate architecture decisions with three audiences.",
          hook: "'Five nines!' says the VP. That's 5 minutes 35 seconds a year - now you have something to negotiate with.",
          paragraphs: [
            "Almost every architectural decision gets challenged, so negotiation is a hard skill built from practice. With business stakeholders: listen for buzzwords as clues ('I needed it yesterday' = time to market; 'zero downtime' = availability), gather information before negotiating, and translate vague goals into numbers.",
            "The book's worked scenario: a VP demands five nines for a global trading system; converting nines to downtime (five nines = 5m35s/year; three nines = 8h46m/year) plus the domain fact that markets close for two hours daily makes three nines clearly sufficient - concrete metrics beat vernacular, delivered without condescension.",
            "With other architects, acknowledge competing approaches and find shared language; with developers, respect their implementation expertise and collaborate rather than dictate (they'll surface feasibility problems your design missed - the last-responsible-moment lesson again). The chapter's framing tools: the 4 Cs of Architecture, being pragmatic yet visionary (avoid both cynicism and hype), leading teams by example, integrating with the development team instead of hovering above it, and protecting developer flow state - deep work is where architecture actually gets built.",
            "Further reading: The Staff Engineer's Path and Getting to Yes.",
          ],
          bullets: [
            "Buzzwords are clues; gather info before the negotiation",
            "Convert jargon to numbers (nines → downtime per year)",
            "Negotiate differently with stakeholders, architects, and developers",
            "Pragmatic + visionary; lead by example; protect flow state",
            "Almost every architectural decision gets challenged, so negotiation is a hard skill built from practice.",
            "With business stakeholders: listen for buzzwords as clues ('I needed it yesterday' = time to market; 'zero downtime' = availability), gather information before negotiating, and translate vague goals into numbers.",
          ],
          steps: [
            {
              title: "Role-play the conflict",
              detail: "Take a stakeholder who wants speed and a developer who wants correctness. Write both positions fairly.",
            },
            {
              title: "Find the shared constraint",
              detail: "Identify the outcome both sides need. Reframe the decision around that outcome rather than either preference.",
            },
            {
              title: "Write the tradeoff memo",
              detail: "Record the options, the cost of each, and the recommendation. Get an explicit decision and owner.",
            },
          ],
          takeaway: "Whoever brings the clearest numbers and the calmest framing to the negotiation usually wins the decision.",
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
                label: "Role-play the conflict",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Find the shared constraint",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Write the tradeoff memo",
                emphasis: true,
              },
            ],
            title: "How Negotiating with Stakeholders, Architects, and Developers works",
          },
          quiz: {
            question: "A stakeholder says the system must be 'lightning fast.' What does the book advise?",
            options: [
              "Take it literally and benchmark every endpoint at 1ms",
              "Read it as a clue that performance is a real concern, then gather information and quantify the actual requirement",
              "Ignore corporate buzzwords entirely",
              "Respond with equally exaggerated promises",
            ],
            correctIndex: 1,
            explanation: "Buzzwords contain clues: exaggerated statements signal the underlying concern (performance, availability, time to market) - then quantification begins.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Negotiating with Stakeholders, Architects, and Developers”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Buzzwords are clues; gather info before the negotiation",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Buzzwords are clues; gather info before the negotiation”",
            },
            {
              question: "Which statement best explains “Nines of availability (downtime/year)”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
                "99.9% = 8h46m; 99.99% = 52m33s; 99.999% = 5m35s. Translate nines into concrete time to negotiate realistically.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “99.9% = 8h46m; 99.99% = 52m33s; 99.999% = 5m35s. Translate nines into concrete time to negotiate realistically.”",
            },
            {
              question: "Which of these is a hands-on step in “Negotiating with Stakeholders, Architects, and Developers”?",
              options: [
                "Interview a stakeholder",
                "Rank them",
                "Validate the list",
                "Role-play the conflict",
              ],
              correctIndex: 3,
              explanation: "“Role-play the conflict” is part of this lesson's sequence: Take a stakeholder who wants speed and a developer who wants correctness. Write both positions fairly.",
            },
            {
              question: "What does the hands-on step “Find the shared constraint” involve?",
              options: [
                "Identify the outcome both sides need. Reframe the decision around that outcome rather than either preference.",
                "Score impact and likelihood for each mark. Group duplicates and keep the top five.",
                "Ask someone unfamiliar to explain the diagram back. Fix any arrow or box they cannot justify.",
                "Show deployable units, databases, and protocols. Label every arrow with the protocol and direction.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Find the shared constraint” as: Identify the outcome both sides need. Reframe the decision around that outcome rather than either preference.",
            },
          ],
          flashcards: [
            {
              front: "Nines of availability (downtime/year)",
              back: "99.9% = 8h46m; 99.99% = 52m33s; 99.999% = 5m35s. Translate nines into concrete time to negotiate realistically.",
            },
            {
              front: "The 4 Cs of Architecture",
              back: "Chapter 25's framing for architectural negotiation - paired with pragmatic-visionary leadership and by-example leading.",
            },
            {
              front: "How do you role-play the conflict?",
              back: "Take a stakeholder who wants speed and a developer who wants correctness. Write both positions fairly.",
            },
            {
              front: "How do you write the tradeoff memo?",
              back: "Record the options, the cost of each, and the recommendation. Get an explicit decision and owner.",
            },
            {
              front: "How do you find the shared constraint?",
              back: "Identify the outcome both sides need. Reframe the decision around that outcome rather than either preference.",
            },
          ],
          sourceRef: {
            label: "Chapter 25. Negotiation and Leadership Skills",
            pageStart: null,
            pageEnd: null,
            note: "Negotiation techniques with business stakeholders, architects, and developers; nines table; leadership skills.",
            sectionIndexes: [
              47,
              48,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Architectural Intersections",
          objective: "Audit alignment between architecture and implementation, data, teams, integration, standards, business, and AI.",
          hook: "Two teams both made good decisions - and the system crashed at 80,000 users. Alignment, not correctness, was the problem.",
          paragraphs: [
            "An architecture must align with everything around it. Implementation: the book's cache story shows misalignment - an architecture chosen for scalability, an implementation optimizing responsiveness with a replicated in-memory cache, both reasonable, until memory exhausted at 80k concurrent users. Structural integrity means source structure must match the logical architecture (directories = components), and architectural constraints must be stated.",
            "Infrastructure must match operational concerns (deployment topology, fault tolerance), and data topology must suit the style: monolithic database, domain databases, or database-per-service - mismatch here breaks the system outright.",
            "The remaining intersections: teams (Conway's law - if team structure doesn't match the architecture, even simple changes struggle), integration (other systems the architecture must talk to - neglect wrecks maintenance and availability), standards (organization-wide practices and principles), the business environment (the domain the architecture must serve), and - new in the second edition - generative AI and LLMs: how increasing LLM use impacts architecture is quickly becoming a critical intersection as companies embed AI into systems.",
            "The chapter's through-line: when an architecture fails, check alignment before blaming any single decision.",
          ],
          bullets: [
            "Implementation alignment: goals must match (the 80k-user cache story)",
            "Data topology must match the style: monolithic, domain, or per-service",
            "Team structure and architecture shape each other (Conway)",
            "Also audit: infrastructure, integration, standards, business, and AI/LLMs",
            "Structural integrity means source structure must match the logical architecture (directories = components), and architectural constraints must be stated.",
            "Infrastructure must match operational concerns (deployment topology, fault tolerance), and data topology must suit the style: monolithic database, domain databases, or database-per-service - mismatch here breaks the system outright.",
          ],
          steps: [
            {
              title: "Map the intersections",
              detail: "List where architecture touches product, operations, security, and org design. Give one concrete example each.",
            },
            {
              title: "Find the friction",
              detail: "Identify one place where an architectural decision creates an organizational problem, or the reverse.",
            },
            {
              title: "Propose an adjustment",
              detail: "Suggest a change to the architecture or the team boundary that reduces the friction. State the tradeoff.",
            },
          ],
          takeaway: "Architecture failures are often alignment failures - audit every intersection before re-deciding anything.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "impl",
                from: "a",
                label: "must match",
              },
              {
                to: "data",
                from: "a",
                label: "must suit",
              },
              {
                to: "team",
                from: "a",
                label: "mutually shape",
              },
              {
                to: "biz",
                from: "a",
                label: "must serve",
              },
            ],
            nodes: [
              {
                id: "a",
                label: "Architecture",
                emphasis: true,
              },
              {
                id: "impl",
                label: "Implementation",
                emphasis: false,
              },
              {
                id: "data",
                label: "Data topology",
                emphasis: false,
              },
              {
                id: "team",
                label: "Teams (Conway)",
                emphasis: false,
              },
              {
                id: "biz",
                label: "Business + AI",
                emphasis: false,
              },
            ],
            title: "Intersections of architecture",
          },
          quiz: {
            question: "In the book's example, why did the system crash at ~80,000 concurrent users?",
            options: [
              "The microservices style was wrong for the problem",
              "The architecture optimized scalability while the implementation silently optimized something else (responsiveness) - goals were misaligned",
              "The database was not ACID compliant",
              "The team used choreography instead of orchestration",
            ],
            correctIndex: 1,
            explanation: "Both teams made locally good decisions in service of different goals; the replicated cache's memory footprint blew up under load - an implementation/architecture alignment failure.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Architectural Intersections”?",
              options: [
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
                "Implementation alignment: goals must match (the 80k-user cache story)",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Implementation alignment: goals must match (the 80k-user cache story)”",
            },
            {
              question: "Which statement best explains “Architectural intersections (audit list)”?",
              options: [
                "Implementation, infrastructure/deployment, data topology, team topology, integration, standards, business environment, and AI/LLMs.",
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Implementation, infrastructure/deployment, data topology, team topology, integration, standards, business environment, and AI/LLMs.”",
            },
            {
              question: "Which of these is a hands-on step in “Architectural Intersections”?",
              options: [
                "Extract one module",
                "Add a filter",
                "Build a pipeline",
                "Map the intersections",
              ],
              correctIndex: 3,
              explanation: "“Map the intersections” is part of this lesson's sequence: List where architecture touches product, operations, security, and org design. Give one concrete example each.",
            },
            {
              question: "What does the hands-on step “Find the friction” involve?",
              options: [
                "Identify one place where an architectural decision creates an organizational problem, or the reverse.",
                "Add a forbidden import, watch CI fail, then remove it. Confirm the guard actually protects the characteristic.",
                "Add an ArchUnit or equivalent test that fails when a layer depends on a forbidden layer.",
                "Run the fitness function on every pull request. Make the failure message name the offending dependency.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Find the friction” as: Identify one place where an architectural decision creates an organizational problem, or the reverse.",
            },
          ],
          flashcards: [
            {
              front: "Structural integrity (intersection)",
              back: "The source code's directory/namespace structure must match the logical architecture - otherwise components drift and change gets unpredictable.",
            },
            {
              front: "Architectural intersections (audit list)",
              back: "Implementation, infrastructure/deployment, data topology, team topology, integration, standards, business environment, and AI/LLMs.",
            },
            {
              front: "How do you propose an adjustment?",
              back: "Suggest a change to the architecture or the team boundary that reduces the friction. State the tradeoff.",
            },
            {
              front: "How do you map the intersections?",
              back: "List where architecture touches product, operations, security, and org design. Give one concrete example each.",
            },
            {
              front: "How do you find the friction?",
              back: "Identify one place where an architectural decision creates an organizational problem, or the reverse.",
            },
          ],
          sourceRef: {
            label: "Chapter 26. Architectural Intersections",
            pageStart: null,
            pageEnd: null,
            note: "Implementation alignment, structural integrity, constraints, data topology, teams, integration, standards, business, GenAI.",
            sectionIndexes: [
              49,
              50,
              51,
            ],
          },
          estimatedMinutes: 4,
        },
        {
          title: "The Laws, Revisited: Doing Trade-Off Analysis",
          objective: "Perform a complete trade-off analysis using the book's worked examples and corollaries.",
          hook: "'Shared library or shared service?' The answer is 'it depends' - and the real skill is answering 'depends on what?'",
          paragraphs: [
            "Chapter 27 returns to the three laws with worked analysis. Shared library versus shared service: walk the contextual factors - multi-platform favoring the service (network access is stack-agnostic), code volatility (a service deploys once; a library needs recompiles everywhere), versioning (compile-time for libraries, runtime for services), change risk (compile-time verification vs runtime faults), and performance (in-process calls win). Every factor is contextual to organization and technology - that's the point: the analysis, not the answer, is the deliverable.",
            "The same method dissects synchronous versus asynchronous messaging.",
            "The corollaries get equal weight. Missing trade-offs (Corollary 1): if you can't find the downside, keep looking - 'Out of Context' antipatterns result when decisions are transplanted without their context. Can't do it once (Corollary 2): ecosystems churn, so decisions decay and must be revisited. And the authors restate the professional stance: don't evangelize - yesterday's best practice becomes tomorrow's antipattern, and organizations want an objective arbiter whose judgment they can trust.",
            "Architects rarely get credit for good decisions and always get blamed for bad ones; the durable reputation is the sober analysis itself.",
          ],
          bullets: [
            "Trade-off analysis = enumerate contextual factors, then decide",
            "Shared lib vs service: platforms, volatility, versioning, change risk, performance",
            "Corollary 1: no trade-off found? Keep looking (Out of Context antipattern)",
            "Corollary 2: re-run the analysis - decisions decay",
            "Missing trade-offs (Corollary 1): if you can't find the downside, keep looking - 'Out of Context' antipatterns result when decisions are transplanted without their context.",
            "Can't do it once (Corollary 2): ecosystems churn, so decisions decay and must be revisited.",
          ],
          steps: [
            {
              title: "Score two options",
              detail: "Pick two realistic architecture options and score them against five weighted characteristics.",
            },
            {
              title: "Write the recommendation",
              detail: "State the winner, the margin, and the assumptions that drove the result. Name the runner-up's advantage.",
            },
            {
              title: "Record the reversal conditions",
              detail: "Write what would have to change for the other option to win. Add the analysis to an ADR.",
            },
          ],
          takeaway: "Master the method, not the answers: enumerate the contextual factors, write down the trade-offs, and revisit them as the ecosystem moves.",
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
                label: "Score two options",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Write the recommendation",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Record the reversal conditions",
                emphasis: true,
              },
            ],
            title: "How The Laws, Revisited: Doing Trade-Off Analysis works",
          },
          quiz: {
            question: "You've analyzed a decision and cannot identify any downside. What does Corollary 1 direct you to do?",
            options: [
              "Ship it - a downside-free decision is the ideal",
              "Keep looking: you likely just haven't identified the trade-off yet",
              "Escalate to the CTO for final approval",
              "Document it as a best practice",
            ],
            correctIndex: 1,
            explanation: "'If you think you've discovered something that isn't a trade-off, more likely you just haven't identified the trade-off...yet.' Absence of evidence is not absence of cost.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “The Laws, Revisited: Doing Trade-Off Analysis”?",
              options: [
                "Trade-off analysis = enumerate contextual factors, then decide",
                "Style + characteristics + logical components + decisions = the four dimensions",
                "Law 1: everything is a trade-off - and you re-analyze constantly",
                "Guide rather than specify; analyze continuously; stay current; enforce compliance",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Trade-off analysis = enumerate contextual factors, then decide”",
            },
            {
              question: "Which statement best explains “Shared library vs shared service factors”?",
              options: [
                "Architecture style, architecture characteristics (-ilities), logical components, and architecture decisions.",
                "Platform diversity, code volatility/churn, versioning (compile vs runtime), change risk (compile-time confidence vs runtime faults), performance.",
                "Everything in software architecture is a trade-off. Corollaries: the trade-off just isn't identified yet; and you can't do trade-off analysis just once.",
                "Make decisions; continually analyze; keep current; ensure compliance; understand diverse technologies; know the business domain; interpersonal skills; navigate politics.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Platform diversity, code volatility/churn, versioning (compile vs runtime), change risk (compile-time confidence vs runtime faults), performance.”",
            },
            {
              question: "Which of these is a hands-on step in “The Laws, Revisited: Doing Trade-Off Analysis”?",
              options: [
                "Define module APIs",
                "Enforce boundaries",
                "Extract one module",
                "Score two options",
              ],
              correctIndex: 3,
              explanation: "“Score two options” is part of this lesson's sequence: Pick two realistic architecture options and score them against five weighted characteristics.",
            },
            {
              question: "What does the hands-on step “Write the recommendation” involve?",
              options: [
                "State the winner, the margin, and the assumptions that drove the result. Name the runner-up's advantage.",
                "Insert a redaction filter without changing the existing filters. Confirm the pipeline still composes.",
                "Make one filter fail on a bad record. Decide whether to skip, retry, or stop, and implement that policy.",
                "Create a third plug-in and register it. Confirm no core file changed and the new behavior appears.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Write the recommendation” as: State the winner, the margin, and the assumptions that drove the result. Name the runner-up's advantage.",
            },
          ],
          flashcards: [
            {
              front: "Out of Context antipattern",
              back: "Transplanting a decision without the context and trade-offs that justified it - a direct violation of 'why is more important than how.'",
            },
            {
              front: "Shared library vs shared service factors",
              back: "Platform diversity, code volatility/churn, versioning (compile vs runtime), change risk (compile-time confidence vs runtime faults), performance.",
            },
            {
              front: "How do you score two options?",
              back: "Pick two realistic architecture options and score them against five weighted characteristics.",
            },
            {
              front: "How do you record the reversal conditions?",
              back: "Write what would have to change for the other option to win. Add the analysis to an ADR.",
            },
            {
              front: "How do you write the recommendation?",
              back: "State the winner, the margin, and the assumptions that drove the result. Name the runner-up's advantage.",
            },
          ],
          sourceRef: {
            label: "Chapter 27. The Laws of Software Architecture, Revisited",
            pageStart: null,
            pageEnd: null,
            note: "Worked trade-off analyses (shared library/service, sync/async), both corollaries, and the objective-architect stance.",
            sectionIndexes: [
              52,
            ],
          },
          estimatedMinutes: 4,
        },
      ],
    },
  ],
};
