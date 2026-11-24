import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const ddiaCourse: DraftCourse = {
  title: "Designing Data-Intensive Applications",
  description: "A cover-to-cover distillation of Kleppmann's guide to reliable, scalable, maintainable systems: data models, storage engines, replication, partitioning, transactions, distributed faults, consensus, batch and stream processing, and the future of data integration. 18 lessons across all 12 chapters.",
  category: "Distributed Systems",
  level: "advanced",
  coverEmoji: "🗄️",
  tags: [
    "distributed systems",
    "databases",
    "replication",
    "transactions",
    "data engineering",
  ],
  modules: [
    {
      title: "Foundations of Data Systems",
      summary: "Chapter 1: what reliability, scalability, and maintainability actually require from a data system, and how to reason about load, latency, and failure.",
      lessons: [
        {
          title: "Reliability: Hardware, Software, and Human Faults",
          objective: "Distinguish a fault from a failure and choose the right response to hardware, software, and human error.",
          hook: "A system that never fails is not reliable — it is untested. Reliability is the art of failing in ways users never notice.",
          paragraphs: [
            "A fault is one component deviating from its spec; a failure is the whole system stopping service. Reliable systems anticipate faults and hide them, which is why fault tolerance is not the same as preventing every fault. Hardware faults are usually random and independent — disk crashes, bad RAM, power loss — so redundancy and backup restore cover them. Software faults are systematic: a bad assumption or a resource leak appears on every node at once, so redundancy alone cannot save you. Human error is the largest source, which is why good interfaces, sandboxes, fast rollback, and telemetry matter more than blame.",
            "The book's discipline is to design for removability: allow recovery, use rollback, inject faults deliberately, and measure. A system that only works when nothing goes wrong is a prototype. Reliability also has a definition worth remembering: the system continues to work correctly even when things go wrong, and the user does not have to notice the repair.",
          ],
          bullets: [
            "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
            "Hardware faults are random and independent, so redundancy and backups work",
            "Software faults are systematic and correlated, so they need testing, isolation, and rollback",
            "Human error dominates incidents: design interfaces, sandboxes, and recovery paths for it",
            "Fault injection and chaos testing reveal weaknesses before users do",
            "Reliability is a user-facing property measured over time, not a binary claim",
          ],
          steps: [
            {
              title: "Inject faults",
              detail: "Build a tiny service backed by a file. Kill the process mid-write and simulate a disk error, then observe what the client sees.",
            },
            {
              title: "Add idempotent retries",
              detail: "Give every request an idempotency key and store completed keys. Retry a timed-out write and confirm it is applied once.",
            },
            {
              title: "Measure recovery",
              detail: "Restart after each fault and verify committed data survives. Record time to recover and any data lost.",
            },
          ],
          takeaway: "Reliability means containing faults before they become failures — through redundancy for hardware, isolation and testing for software, and recoverable workflows for people.",
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
                label: "Inject faults",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Add idempotent retries",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Measure recovery",
                emphasis: true,
              },
            ],
            title: "How Reliability: Hardware, Software, and Human Faults works",
          },
          quiz: {
            question: "Why does adding more replicas not fix a systematic software fault?",
            options: [
              "Replicas always run different code versions",
              "The same bug is present on every replica, so failures are correlated",
              "Software faults only occur on the primary node",
              "Replication automatically rolls back bad deployments",
            ],
            correctIndex: 1,
            explanation: "Replication assumes independent failures. A deterministic bug in the code is present on all replicas, so it can take them all down together; isolation, testing, rollout control, and rollback are the real defenses.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Reliability: Hardware, Software, and Human Faults”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
                "Relational: normalized tables plus joins; document: nested trees read as a unit",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Fault = one part deviates from spec; failure = the system as a whole stops providing service”",
            },
            {
              question: "Which statement best explains “Fault versus failure”?",
              options: [
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
                "The impedance between object-oriented application code and normalized relational tables, which requires mapping and sometimes joins or extra tables.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.”",
            },
            {
              question: "Which of these is a hands-on step in “Reliability: Hardware, Software, and Human Faults”?",
              options: [
                "Build a message pipeline",
                "Handle ordering",
                "Make the consumer idempotent",
                "Inject faults",
              ],
              correctIndex: 3,
              explanation: "“Inject faults” is part of this lesson's sequence: Build a tiny service backed by a file. Kill the process mid-write and simulate a disk error, then observe what the client sees.",
            },
            {
              question: "What does the hands-on step “Add idempotent retries” involve?",
              options: [
                "Give every request an idempotency key and store completed keys. Retry a timed-out write and confirm it is applied once.",
                "Drive a simple endpoint with 1, 10, and 100 concurrent clients. Record throughput and p50, p95, and p99 latency.",
                "Profile CPU, memory, and I/O under load. Identify which resource saturates first and explain the latency curve.",
                "Add a feature behind an interface, keep the old path working, and add a test that pins the previous behavior.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add idempotent retries” as: Give every request an idempotency key and store completed keys. Retry a timed-out write and confirm it is applied once.",
            },
          ],
          flashcards: [
            {
              front: "Three practical defenses against human error",
              back: "Well-designed interfaces that make mistakes hard, sandboxes for safe experimentation, and fast rollback plus detailed telemetry for recovery.",
            },
            {
              front: "Fault versus failure",
              back: "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
            },
            {
              front: "Why are software faults harder than hardware faults?",
              back: "They are systematic and correlated: the same bad assumption or bug exists on every node, so redundancy does not provide independent protection.",
            },
            {
              front: "How do you add idempotent retries?",
              back: "Give every request an idempotency key and store completed keys. Retry a timed-out write and confirm it is applied once.",
            },
            {
              front: "How do you inject faults?",
              back: "Build a tiny service backed by a file. Kill the process mid-write and simulate a disk error, then observe what the client sees.",
            },
          ],
          sourceRef: {
            label: "Chapter 1: Reliable, Scalable, and Maintainable Applications — Reliability",
            pageStart: null,
            pageEnd: null,
            note: "Faults versus failures, hardware/software/human error, redundancy, fault injection, and recovery-oriented design.",
            sectionIndexes: [
              2,
            ],
          },
          estimatedMinutes: 6,
        },
        {
          title: "Scalability: Load, Latency, and the Tail",
          objective: "Describe load with the right parameters and evaluate performance with percentiles rather than averages.",
          hook: "An average latency of 100 ms can still mean one in a hundred users waits two seconds — and that user is often your best customer.",
          paragraphs: [
            "Scalability is not a label; it is the answer to 'if load grows in a particular way, what happens?' First choose load parameters: requests per second, read/write ratio, active users, cache hit rate, or fan-out. Twitter's home timeline is the canonical example: fan-out on write makes reads cheap but writes expensive, while fan-out on read does the opposite. Neither is universally better — the decision follows the read/write ratio and the cost of each path.",
            "Performance must be measured with distributions. Averages hide the tail, so use p50, p95, p99, and p999 per endpoint and per backend call. Queueing effects mean a server is only as fast as its slowest dependency, and head-of-line blocking makes a few slow requests delay many fast ones. SLOs should be written against percentiles, and load tests should reproduce realistic fan-out and payload sizes rather than a single hot loop.",
          ],
          bullets: [
            "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
            "Pick load parameters that reflect the real bottleneck: throughput, fan-out, working set, or write rate",
            "Fan-out on write vs read trades write cost against read cost; choose from the actual read/write ratio",
            "Use p50/p95/p99/p999 per endpoint; averages conceal the slow tail that users remember",
            "Head-of-line blocking and slow dependencies dominate tail latency",
            "Write SLOs in percentiles and load-test with realistic request mixes",
          ],
          steps: [
            {
              title: "Load test a service",
              detail: "Drive a simple endpoint with 1, 10, and 100 concurrent clients. Record throughput and p50, p95, and p99 latency.",
            },
            {
              title: "Find the bottleneck",
              detail: "Profile CPU, memory, and I/O under load. Identify which resource saturates first and explain the latency curve.",
            },
            {
              title: "Scale and remeasure",
              detail: "Add a cache or a second worker, then repeat the same load test. Report the actual improvement, not the expected one.",
            },
          ],
          takeaway: "Scalability is a conditional answer about a named load parameter, and performance is a distribution — design and measure for the tail, not the mean.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "fastread",
                from: "write",
                label: "cost moves to writes",
              },
              {
                to: "fastwrite",
                from: "read",
                label: "cost moves to reads",
              },
            ],
            nodes: [
              {
                id: "write",
                label: "Fan-out on write",
                emphasis: true,
              },
              {
                id: "read",
                label: "Fan-out on read",
                emphasis: true,
              },
              {
                id: "fastread",
                label: "Reads are precomputed",
                emphasis: false,
              },
              {
                id: "fastwrite",
                label: "Writes stay cheap",
                emphasis: false,
              },
            ],
            title: "Fan-out on write vs fan-out on read",
          },
          quiz: {
            question: "A service reports a mean latency of 120 ms but a p99 of 1.8 s. What does the p99 tell you that the mean does not?",
            options: [
              "The server is definitely overloaded and must be restarted",
              "One percent of requests are much slower, which is invisible in the average",
              "The mean is wrong because percentiles replace averages",
              "All requests take between 120 ms and 1.8 s",
            ],
            correctIndex: 1,
            explanation: "Percentiles expose the tail. Averages are pulled down by the many fast requests and hide the slow cohort whose experience (and often revenue) matters most.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Scalability: Load, Latency, and the Tail”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
                "Relational: normalized tables plus joins; document: nested trees read as a unit",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'”",
            },
            {
              question: "Which statement best explains “What is a load parameter?”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "The impedance between object-oriented application code and normalized relational tables, which requires mapping and sometimes joins or extra tables.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.”",
            },
            {
              question: "Which of these is a hands-on step in “Scalability: Load, Latency, and the Tail”?",
              options: [
                "Build a message pipeline",
                "Handle ordering",
                "Make the consumer idempotent",
                "Load test a service",
              ],
              correctIndex: 3,
              explanation: "“Load test a service” is part of this lesson's sequence: Drive a simple endpoint with 1, 10, and 100 concurrent clients. Record throughput and p50, p95, and p99 latency.",
            },
            {
              question: "What does the hands-on step “Find the bottleneck” involve?",
              options: [
                "Profile CPU, memory, and I/O under load. Identify which resource saturates first and explain the latency curve.",
                "Publish events from one service to a queue and consume them in another. Include an event id and timestamp.",
                "Send events out of order and add a sequence check or reordering buffer. Show how the consumer copes with a late event.",
                "Track processed event ids and ignore duplicates. Re-deliver the same event twice and verify the effect happens once.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Find the bottleneck” as: Profile CPU, memory, and I/O under load. Identify which resource saturates first and explain the latency curve.",
            },
          ],
          flashcards: [
            {
              front: "What is a load parameter?",
              back: "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
            },
            {
              front: "Head-of-line blocking",
              back: "A slow request occupying a shared resource delays later fast requests behind it, amplifying tail latency even when average service time is low.",
            },
            {
              front: "Why are averages misleading for latency?",
              back: "They compress a skewed distribution into one number and hide the slow tail; p95/p99/p999 show the experience of the slowest users.",
            },
            {
              front: "How do you find the bottleneck?",
              back: "Profile CPU, memory, and I/O under load. Identify which resource saturates first and explain the latency curve.",
            },
            {
              front: "How do you load test a service?",
              back: "Drive a simple endpoint with 1, 10, and 100 concurrent clients. Record throughput and p50, p95, and p99 latency.",
            },
          ],
          sourceRef: {
            label: "Chapter 1: Describing Load, Latency, and Coping with Load",
            pageStart: null,
            pageEnd: null,
            note: "Load parameters, the Twitter fan-out example, latency percentiles, queueing, head-of-line blocking, and SLOs.",
            sectionIndexes: [
              3,
            ],
          },
          estimatedMinutes: 6,
        },
        {
          title: "Maintainability: Operability, Simplicity, Evolvability",
          objective: "Explain the three design principles that keep a data system healthy over years of change.",
          hook: "Most of a system's cost is paid after launch, by people who did not write it. Maintainability is the design goal that admits this.",
          paragraphs: [
            "Maintainability has three pillars. Operability means making routine work easy: good monitoring, automation, documentation, and predictable deployment so an on-call engineer can diagnose and repair without heroics. Simplicity means removing accidental complexity — the complexity introduced by the implementation rather than inherent in the problem — through good abstractions and clear boundaries. Evolvability means making change cheap: the data model, schema, and interfaces should allow new requirements without rewriting the system.",
            "These goals conflict with short-term speed, which is why they need explicit design choices. A simple system is not a feature-poor one; it is one whose parts can be understood in isolation. Evolvability is helped by loose coupling, explicit schemas, and the ability to run old and new code side by side. The test is not elegance but the cost of the next change.",
          ],
          bullets: [
            "Operability: monitoring, automation, documentation, and predictable operations",
            "Simplicity: remove accidental complexity with abstractions that hide implementation detail",
            "Evolvability: make future change cheap through loose coupling and explicit interfaces",
            "Essential complexity comes from the problem; accidental complexity comes from the solution",
            "Good abstractions let engineers reason about one part without holding the whole system in mind",
            "Evaluate design by the cost of the next change, not by how clever it looks today",
          ],
          steps: [
            {
              title: "Add observability",
              detail: "Instrument a small service with structured logs, a request counter, and a latency histogram. Expose a health endpoint.",
            },
            {
              title: "Write the runbook",
              detail: "Document how to start, stop, back up, and restore the service. Include the three most likely failures and their checks.",
            },
            {
              title: "Make a safe change",
              detail: "Add a feature behind an interface, keep the old path working, and add a test that pins the previous behavior.",
            },
          ],
          takeaway: "Maintainability is a long-term property built from operable tooling, simple abstractions, and interfaces that let the system evolve without a rewrite.",
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
                label: "Add observability",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Write the runbook",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Make a safe change",
                emphasis: true,
              },
            ],
            title: "How Maintainability: Operability, Simplicity, Evolvability works",
          },
          quiz: {
            question: "Which change best improves evolvability?",
            options: [
              "Adding more microservices for every new feature",
              "Removing an unnecessary abstraction to simplify the code",
              "Introducing a clear schema and loose coupling at module boundaries",
              "Rewriting the system whenever requirements change",
            ],
            correctIndex: 2,
            explanation: "Evolvability is about making future changes cheap. Explicit schemas and loose coupling let old and new code coexist and reduce the blast radius of each change; service count alone does not.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Maintainability: Operability, Simplicity, Evolvability”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
                "Relational: normalized tables plus joins; document: nested trees read as a unit",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Operability: monitoring, automation, documentation, and predictable operations”",
            },
            {
              question: "Which statement best explains “Three pillars of maintainability”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "The impedance between object-oriented application code and normalized relational tables, which requires mapping and sometimes joins or extra tables.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).”",
            },
            {
              question: "Which of these is a hands-on step in “Maintainability: Operability, Simplicity, Evolvability”?",
              options: [
                "Query both shapes",
                "Compare with a graph query",
                "Model a graph",
                "Add observability",
              ],
              correctIndex: 3,
              explanation: "“Add observability” is part of this lesson's sequence: Instrument a small service with structured logs, a request counter, and a latency histogram. Expose a health endpoint.",
            },
            {
              question: "What does the hands-on step “Write the runbook” involve?",
              options: [
                "Document how to start, stop, back up, and restore the service. Include the three most likely failures and their checks.",
                "Build a tiny service backed by a file. Kill the process mid-write and simulate a disk error, then observe what the client sees.",
                "Give every request an idempotency key and store completed keys. Retry a timed-out write and confirm it is applied once.",
                "Restart after each fault and verify committed data survives. Record time to recover and any data lost.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Write the runbook” as: Document how to start, stop, back up, and restore the service. Include the three most likely failures and their checks.",
            },
          ],
          flashcards: [
            {
              front: "Accidental versus essential complexity",
              back: "Essential complexity is inherent in the problem; accidental complexity is introduced by the implementation and should be removed through better abstractions.",
            },
            {
              front: "Three pillars of maintainability",
              back: "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
            },
            {
              front: "How do you judge evolvability?",
              back: "By the cost and risk of the next change — whether new requirements can be added without rewriting existing parts or breaking compatibility.",
            },
            {
              front: "How do you add observability?",
              back: "Instrument a small service with structured logs, a request counter, and a latency histogram. Expose a health endpoint.",
            },
            {
              front: "How do you write the runbook?",
              back: "Document how to start, stop, back up, and restore the service. Include the three most likely failures and their checks.",
            },
          ],
          sourceRef: {
            label: "Chapter 1: Maintainability — Operability, Simplicity, Evolvability",
            pageStart: null,
            pageEnd: null,
            note: "The three maintainability principles, accidental versus essential complexity, abstraction, and designing for change.",
            sectionIndexes: [
              4,
              5,
            ],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Data Models, Storage, and Encoding",
      summary: "Chapters 2-4: how data is modeled, queried, stored on disk, encoded on the wire, and moved between systems.",
      lessons: [
        {
          title: "Relational vs Document Models",
          objective: "Choose between relational and document models using relationships, locality, and schema flexibility.",
          hook: "The same résumé can be one row with joins, or one JSON document with duplication. The right choice depends on how you read it.",
          paragraphs: [
            "The relational model stores data in relations of tuples with no nesting, and joins reconstruct relationships. The document model stores a tree, usually JSON, where related data is nested. The object-relational mismatch — classes and objects versus tables — is real, but both models can represent the same information. Normalization removes duplication and keeps one authoritative copy; denormalization duplicates data to avoid joins and speed reads.",
            "The decision is driven by access patterns and relationships. Document models fit data that is mostly a self-contained tree read as a unit, with schema-on-read flexibility. Relational models fit many-to-many relationships and queries that combine data in unanticipated ways, with schema-on-write validation. Neither is inherently more scalable: locality of a document is an advantage for one read and a liability when only part of it is needed.",
          ],
          bullets: [
            "Relational: normalized tables plus joins; document: nested trees read as a unit",
            "Normalization keeps one copy of each fact; denormalization trades duplication for read speed",
            "Document models give locality and flexible schemas for self-contained aggregates",
            "Relational models handle many-to-many relationships and ad-hoc joins better",
            "Schema-on-write validates at write time; schema-on-read interprets at read time",
            "Choose by access pattern, not by which model sounds more modern",
          ],
          steps: [
            {
              title: "Model the same data twice",
              detail: "Store a user with posts, comments, and tags in normalized tables and as one JSONB document. Insert the same sample data into both.",
            },
            {
              title: "Query both shapes",
              detail: "Fetch a user with all posts and the latest comments from each model. Note the joins versus the single-document read.",
            },
            {
              title: "Compare evolution",
              detail: "Add a new optional field and a one-to-many relation. Record which model required a migration and which required rewriting documents.",
            },
          ],
          takeaway: "Model data around how it will be read and how its relationships behave: documents for self-contained trees, relations for many-to-many and flexible queries.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "join",
                from: "rel",
                label: "reconstruct relationships",
              },
              {
                to: "local",
                from: "doc",
                label: "one fetch, one tree",
              },
            ],
            nodes: [
              {
                id: "rel",
                label: "Relational tables",
                emphasis: true,
              },
              {
                id: "doc",
                label: "Document trees",
                emphasis: true,
              },
              {
                id: "join",
                label: "Joins at read time",
                emphasis: false,
              },
              {
                id: "local",
                label: "Locality at read time",
                emphasis: false,
              },
            ],
            title: "Relational vs document",
          },
          quiz: {
            question: "A social network needs 'friends of friends' queries over a many-to-many relationship. Which model is the better default?",
            options: [
              "A document model, because JSON can nest friends",
              "A relational or graph model, because relationships are many-to-many and traversal is the access pattern",
              "A key-value store, because lookups are always by user ID",
              "A column store, because the data is analytical",
            ],
            correctIndex: 1,
            explanation: "Many-to-many relationships and multi-hop traversal are awkward to nest in documents. Relational joins or a graph model express them directly and avoid duplicated friend lists.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Relational vs Document Models”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
                "Relational: normalized tables plus joins; document: nested trees read as a unit",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Relational: normalized tables plus joins; document: nested trees read as a unit”",
            },
            {
              question: "Which statement best explains “Object-relational mismatch”?",
              options: [
                "The impedance between object-oriented application code and normalized relational tables, which requires mapping and sometimes joins or extra tables.",
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “The impedance between object-oriented application code and normalized relational tables, which requires mapping and sometimes joins or extra tables.”",
            },
            {
              question: "Which of these is a hands-on step in “Relational vs Document Models”?",
              options: [
                "Build a hybrid logical clock",
                "Measure clock skew",
                "Test a clock jump",
                "Model the same data twice",
              ],
              correctIndex: 3,
              explanation: "“Model the same data twice” is part of this lesson's sequence: Store a user with posts, comments, and tags in normalized tables and as one JSONB document. Insert the same sample data into both.",
            },
            {
              question: "What does the hands-on step “Query both shapes” involve?",
              options: [
                "Fetch a user with all posts and the latest comments from each model. Note the joins versus the single-document read.",
                "Move one partition to a new node while reads continue. Verify no key is lost or served by two owners at once.",
                "Place nodes and keys on a ring. Add a node and count how many keys move compared with modulo hashing.",
                "Enforce a rule across two rows that each transaction checks separately. Show the violation under snapshot isolation and fix it with serializable.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Query both shapes” as: Fetch a user with all posts and the latest comments from each model. Note the joins versus the single-document read.",
            },
          ],
          flashcards: [
            {
              front: "Schema-on-write vs schema-on-read",
              back: "Schema-on-write validates structure when data is stored (relational); schema-on-read interprets structure when data is read (document/JSON), allowing heterogeneous records.",
            },
            {
              front: "When does a document model's locality hurt?",
              back: "When an application needs only a small part of a large document, or needs to join across documents; then it reads and rewrites far more data than necessary.",
            },
            {
              front: "Object-relational mismatch",
              back: "The impedance between object-oriented application code and normalized relational tables, which requires mapping and sometimes joins or extra tables.",
            },
            {
              front: "How do you model the same data twice?",
              back: "Store a user with posts, comments, and tags in normalized tables and as one JSONB document. Insert the same sample data into both.",
            },
            {
              front: "How do you query both shapes?",
              back: "Fetch a user with all posts and the latest comments from each model. Note the joins versus the single-document read.",
            },
          ],
          sourceRef: {
            label: "Chapter 2: Data Models and Query Languages — Relational Versus Document",
            pageStart: null,
            pageEnd: null,
            note: "Relational versus document models, normalization, object-relational mismatch, locality, and schema-on-read/write.",
            sectionIndexes: [
              5,
              6,
            ],
          },
          estimatedMinutes: 6,
        },
        {
          title: "Query Languages and Graph Models",
          objective: "Explain declarative querying and select the right model for highly connected data.",
          hook: "Tell the database what you want, not how to walk the loops — that is the quiet superpower behind SQL's optimizer.",
          paragraphs: [
            "Declarative languages such as SQL specify the result and let the query optimizer choose indexes, join order, and execution strategy. Imperative code tells the machine exactly how to iterate, so the application carries the optimization burden and cannot adapt when data distribution changes. MapReduce sits between the two: a restricted declarative model of map and reduce functions that the framework can parallelize.",
            "When relationships dominate, graph models beat both tables and documents. Property graphs attach key-value properties to vertices and edges and are queried with Cypher or graph queries in SQL. Triple-stores model everything as subject-predicate-object and are queried with SPARQL. Datalog expresses rules and recursive queries declaratively. The shared idea is that the model should match the shape of the traversal, not force every question through joins or nested documents.",
          ],
          bullets: [
            "Declarative queries specify the result; the optimizer chooses how to execute",
            "Imperative queries move optimization into application code and age badly as data changes",
            "MapReduce is a restricted declarative model that frameworks can distribute",
            "Property graphs use vertices, edges, and key-value properties for traversal",
            "Triple-stores use subject-predicate-object and SPARQL",
            "Datalog expresses recursive rules declaratively and suits complex graph queries",
          ],
          steps: [
            {
              title: "Model a graph",
              detail: "Create a people table and a friendships edge table in SQL. Insert a small social graph with at least two cycles.",
            },
            {
              title: "Traverse with a recursive CTE",
              detail: "Write a recursive query for friends-of-friends up to depth three. Deduplicate paths and show the depth of each result.",
            },
            {
              title: "Compare with a graph query",
              detail: "Express the same traversal in a graph query language or library. Compare readability, query length, and execution plan.",
            },
          ],
          takeaway: "Use declarative languages so the engine can optimize, and use graph models when the question is about relationships and multi-hop traversal.",
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
                label: "Model a graph",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Traverse with a recursive CTE",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Compare with a graph query",
                emphasis: true,
              },
            ],
            title: "How Query Languages and Graph Models works",
          },
          quiz: {
            question: "What is the main advantage of a declarative query language?",
            options: [
              "It always runs faster than hand-written loops",
              "It lets the query optimizer choose indexes and join strategies as data changes",
              "It removes the need for any data model",
              "It guarantees strong consistency",
            ],
            correctIndex: 1,
            explanation: "Declarative queries describe the result rather than the algorithm, so the optimizer can adapt execution to statistics, indexes, and data distribution without rewriting application code.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Query Languages and Graph Models”?",
              options: [
                "Declarative queries specify the result; the optimizer chooses how to execute",
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Declarative queries specify the result; the optimizer chooses how to execute”",
            },
            {
              question: "Which statement best explains “Declarative vs imperative querying”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "Declarative states what result is wanted and lets the engine optimize; imperative states step-by-step how to compute it, leaving optimization to the programmer.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Declarative states what result is wanted and lets the engine optimize; imperative states step-by-step how to compute it, leaving optimization to the programmer.”",
            },
            {
              question: "Which of these is a hands-on step in “Query Languages and Graph Models”?",
              options: [
                "Evolve forward",
                "Build a message pipeline",
                "Handle ordering",
                "Model a graph",
              ],
              correctIndex: 3,
              explanation: "“Model a graph” is part of this lesson's sequence: Create a people table and a friendships edge table in SQL. Insert a small social graph with at least two cycles.",
            },
            {
              question: "What does the hands-on step “Traverse with a recursive CTE” involve?",
              options: [
                "Write a recursive query for friends-of-friends up to depth three. Deduplicate paths and show the depth of each result.",
                "Assign keys to 16 partitions with a hash function. Verify the distribution on 10,000 keys and find the hottest partition.",
                "Move one partition to a new node while reads continue. Verify no key is lost or served by two owners at once.",
                "Place nodes and keys on a ring. Add a node and count how many keys move compared with modulo hashing.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Traverse with a recursive CTE” as: Write a recursive query for friends-of-friends up to depth three. Deduplicate paths and show the depth of each result.",
            },
          ],
          flashcards: [
            {
              front: "Property graph model",
              back: "Vertices and edges, each with a label and key-value properties; queried with languages such as Cypher for multi-hop traversal.",
            },
            {
              front: "Declarative vs imperative querying",
              back: "Declarative states what result is wanted and lets the engine optimize; imperative states step-by-step how to compute it, leaving optimization to the programmer.",
            },
            {
              front: "Triple-store and SPARQL",
              back: "A graph model where every fact is subject-predicate-object, queried with SPARQL; well suited to semantic and highly connected data.",
            },
            {
              front: "How do you traverse with a recursive CTE?",
              back: "Write a recursive query for friends-of-friends up to depth three. Deduplicate paths and show the depth of each result.",
            },
            {
              front: "How do you model a graph?",
              back: "Create a people table and a friendships edge table in SQL. Insert a small social graph with at least two cycles.",
            },
          ],
          sourceRef: {
            label: "Chapter 2: Query Languages for Data and Graph-Like Data Models",
            pageStart: null,
            pageEnd: null,
            note: "Declarative versus imperative queries, MapReduce, property graphs, Cypher, triple-stores, SPARQL, and Datalog.",
            sectionIndexes: [
              7,
              8,
              9,
            ],
          },
          estimatedMinutes: 6,
        },
        {
          title: "Storage Engines: Hash Indexes, LSM-Trees, and B-Trees",
          objective: "Compare log-structured and page-oriented storage engines by read, write, and space amplification.",
          hook: "Every database is a bet about whether reads or writes hurt more. The storage engine is where that bet is written in bytes.",
          paragraphs: [
            "The simplest index is an in-memory hash map from key to byte offset, as in Bitcask: fast point writes, but the whole key set must fit in RAM and range queries are impossible. Log-structured merge trees sort data in memory (the memtable) and flush immutable SSTables to disk; reads check the memtable and recent SSTables, and compaction merges them. Bloom filters avoid pointless disk reads. LSM-trees favor write throughput but pay in write amplification and compaction work.",
            "B-trees keep sorted pages on disk and update them in place, with a write-ahead log for crash safety. Their high branching factor gives shallow trees and predictable point and range reads. The trade-off is page-level write amplification: even a small update rewrites a whole page. Comparing engines means comparing read amplification, write amplification, and space amplification — there is no free option, only a choice about which cost the workload can tolerate.",
          ],
          bullets: [
            "Hash indexes give O(1) point lookups but require all keys in memory and cannot range scan",
            "LSM-trees buffer writes in a memtable and flush sorted immutable SSTables",
            "Compaction merges SSTables, removes tombstones, and controls space amplification",
            "Bloom filters skip SSTables that cannot contain a key",
            "B-trees update sorted pages in place and use a WAL for crash recovery",
            "Engine choice trades read, write, and space amplification against the workload",
          ],
          steps: [
            {
              title: "Build a log-structured store",
              detail: "Append key-value records to a file and keep an in-memory hash map from key to byte offset. Read and overwrite keys.",
            },
            {
              title: "Add SSTables and compaction",
              detail: "Flush sorted segments, keep a sparse index, and merge segments in the background. Delete tombstones during compaction.",
            },
            {
              title: "Benchmark the tradeoffs",
              detail: "Measure write throughput, point-read latency, and disk usage for your log store and an embedded B-tree database. Explain the differences.",
            },
          ],
          takeaway: "LSM-trees optimize write throughput; B-trees optimize predictable reads and range scans. Choose by which amplification your workload can least afford.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "writes",
                from: "lsm",
                label: "write-optimized",
              },
              {
                to: "pages",
                from: "btree",
                label: "read-optimized",
              },
            ],
            nodes: [
              {
                id: "lsm",
                label: "LSM-tree",
                emphasis: true,
              },
              {
                id: "btree",
                label: "B-tree",
                emphasis: true,
              },
              {
                id: "writes",
                label: "Append + compact",
                emphasis: false,
              },
              {
                id: "pages",
                label: "In-place page updates",
                emphasis: false,
              },
            ],
            title: "LSM-tree vs B-tree",
          },
          quiz: {
            question: "Which cost does an LSM-tree primarily trade away to get high write throughput?",
            options: [
              "It avoids all disk I/O by keeping everything in memory",
              "It defers work to compaction and can suffer write amplification",
              "It gives up crash recovery",
              "It cannot store keys in sorted order",
            ],
            correctIndex: 1,
            explanation: "LSM-trees append and flush rather than update pages in place, which makes writes fast, but compaction later rewrites data and consumes I/O and space.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Storage Engines: Hash Indexes, LSM-Trees, and B-Trees”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Hash indexes give O(1) point lookups but require all keys in memory and cannot range scan",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Hash indexes give O(1) point lookups but require all keys in memory and cannot range scan”",
            },
            {
              question: "Which statement best explains “Memtable and SSTable”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "The memtable is an in-memory sorted structure that absorbs writes; it is flushed to disk as an immutable, sorted SSTable.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “The memtable is an in-memory sorted structure that absorbs writes; it is flushed to disk as an immutable, sorted SSTable.”",
            },
            {
              question: "Which of these is a hands-on step in “Storage Engines: Hash Indexes, LSM-Trees, and B-Trees”?",
              options: [
                "Fix it with locking",
                "Reproduce a lost update",
                "Try write skew",
                "Build a log-structured store",
              ],
              correctIndex: 3,
              explanation: "“Build a log-structured store” is part of this lesson's sequence: Append key-value records to a file and keep an in-memory hash map from key to byte offset. Read and overwrite keys.",
            },
            {
              question: "What does the hands-on step “Add SSTables and compaction” involve?",
              options: [
                "Flush sorted segments, keep a sparse index, and merge segments in the background. Delete tombstones during compaction.",
                "Stop the leader, promote the most up-to-date follower, and redirect writes. Verify no acknowledged write disappears.",
                "Read from two replicas with different lag and observe time moving backwards. Pin a user to one replica and retest.",
                "Track the last write version per user and route that user's reads to a replica that has caught up, or to the leader.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add SSTables and compaction” as: Flush sorted segments, keep a sparse index, and merge segments in the background. Delete tombstones during compaction.",
            },
          ],
          flashcards: [
            {
              front: "Memtable and SSTable",
              back: "The memtable is an in-memory sorted structure that absorbs writes; it is flushed to disk as an immutable, sorted SSTable.",
            },
            {
              front: "Why do B-trees use a write-ahead log?",
              back: "To make in-place page updates crash-safe: the log is persisted before pages are modified so recovery can replay or undo partial writes.",
            },
            {
              front: "Write amplification",
              back: "The ratio of bytes physically written to bytes logically written; in-place page updates and compaction both increase it.",
            },
            {
              front: "How do you build a log-structured store?",
              back: "Append key-value records to a file and keep an in-memory hash map from key to byte offset. Read and overwrite keys.",
            },
            {
              front: "How do you add SSTables and compaction?",
              back: "Flush sorted segments, keep a sparse index, and merge segments in the background. Delete tombstones during compaction.",
            },
          ],
          sourceRef: {
            label: "Chapter 3: Storage and Retrieval — Data Structures That Power Your Database",
            pageStart: null,
            pageEnd: null,
            note: "Hash indexes, SSTables, memtables, LSM-trees, compaction, bloom filters, B-trees, WAL, and amplification trade-offs.",
            sectionIndexes: [
              9,
              10,
            ],
          },
          estimatedMinutes: 7,
        },
        {
          title: "Analytics: Warehouses, Stars, and Column Storage",
          objective: "Explain why analytical workloads use different storage layouts from transaction processing.",
          hook: "An OLTP database finds one row among millions. An analytics database reads millions of rows to compute one number. They should not share a layout.",
          paragraphs: [
            "OLTP systems serve many small reads and writes by key, so row-oriented storage keeps a record's fields together. OLAP systems scan huge numbers of rows but touch only a few columns, so column-oriented storage keeps each column contiguous. That layout enables compression — run-length, bitmap, and dictionary encoding — and lets the engine skip columns and row groups that a query does not need.",
            "Analytical systems are usually separated into a data warehouse fed by ETL or ELT. Star schemas put a central fact table around dimension tables; snowflake schemas normalize dimensions further. Column storage, compression, and sort order can make scans orders of magnitude cheaper. Materialized views and data cubes precompute aggregates but must be refreshed, so they trade freshness for speed.",
          ],
          bullets: [
            "OLTP is row-oriented and optimized for point reads/writes; OLAP is column-oriented and optimized for scans",
            "Column layout reads only referenced columns and compresses similar values well",
            "Run-length, bitmap, and dictionary encoding shrink columns dramatically",
            "Warehouses separate analytics from transactional systems, fed by ETL/ELT",
            "Star schemas center on a fact table; snowflake schemas normalize dimensions",
            "Materialized views and data cubes trade freshness for query speed",
          ],
          steps: [
            {
              title: "Build a star schema",
              detail: "Create one fact table and three dimension tables for sales data. Load a CSV and write a query that aggregates by region and month.",
            },
            {
              title: "Scan columns directly",
              detail: "Store the fact table as Parquet or one file per column. Read only the columns a query needs and measure bytes scanned.",
            },
            {
              title: "Compare row and column",
              detail: "Run the same aggregation against a row store and your columnar files. Report latency and I/O for both.",
            },
          ],
          takeaway: "Match storage layout to access shape: rows for transactional point operations, columns for analytical scans and compression.",
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
                label: "Build a star schema",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Scan columns directly",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Compare row and column",
                emphasis: true,
              },
            ],
            title: "How Analytics: Warehouses, Stars, and Column Storage works",
          },
          quiz: {
            question: "Why is column-oriented storage faster for an aggregate query over one column?",
            options: [
              "It stores fewer rows than a row-oriented database",
              "It reads only that column instead of every field of every row, and compresses it well",
              "It skips the need for indexes entirely",
              "It guarantees the data is in memory",
            ],
            correctIndex: 1,
            explanation: "A column store reads contiguous values for the requested column and can compress them, avoiding the I/O of loading all other fields for each matching row.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Analytics: Warehouses, Stars, and Column Storage”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "OLTP is row-oriented and optimized for point reads/writes; OLAP is column-oriented and optimized for scans",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “OLTP is row-oriented and optimized for point reads/writes; OLAP is column-oriented and optimized for scans”",
            },
            {
              question: "Which statement best explains “OLTP vs OLAP access pattern”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
                "OLTP: many small key-based reads and writes. OLAP: large scans and aggregations over few columns but many rows.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “OLTP: many small key-based reads and writes. OLAP: large scans and aggregations over few columns but many rows.”",
            },
            {
              question: "Which of these is a hands-on step in “Analytics: Warehouses, Stars, and Column Storage”?",
              options: [
                "Build an end-to-end pipeline",
                "Inject a failure",
                "Add idempotent retries",
                "Build a star schema",
              ],
              correctIndex: 3,
              explanation: "“Build a star schema” is part of this lesson's sequence: Create one fact table and three dimension tables for sales data. Load a CSV and write a query that aggregates by region and month.",
            },
            {
              question: "What does the hands-on step “Scan columns directly” involve?",
              options: [
                "Store the fact table as Parquet or one file per column. Read only the columns a query needs and measure bytes scanned.",
                "Open two transactions that read the same counter and write it back. Commit both and show that one increment vanished.",
                "Use SELECT... FOR UPDATE or an atomic increment. Repeat the concurrent test and confirm both updates survive.",
                "Combine physical time with a logical counter. Order events from two nodes and show causality is preserved across a clock jump.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Scan columns directly” as: Store the fact table as Parquet or one file per column. Read only the columns a query needs and measure bytes scanned.",
            },
          ],
          flashcards: [
            {
              front: "OLTP vs OLAP access pattern",
              back: "OLTP: many small key-based reads and writes. OLAP: large scans and aggregations over few columns but many rows.",
            },
            {
              front: "Why does column storage compress so well?",
              back: "Values in a column share type and often repeat or cluster, so run-length, bitmap, and dictionary encoding shrink them far more than mixed row data.",
            },
            {
              front: "Star schema",
              back: "A central fact table of events surrounded by dimension tables that describe the entities, keeping the fact table narrow and joinable.",
            },
            {
              front: "How do you scan columns directly?",
              back: "Store the fact table as Parquet or one file per column. Read only the columns a query needs and measure bytes scanned.",
            },
            {
              front: "How do you build a star schema?",
              back: "Create one fact table and three dimension tables for sales data. Load a CSV and write a query that aggregates by region and month.",
            },
          ],
          sourceRef: {
            label: "Chapter 3: Transaction Processing or Analytics? Warehouses and Column Storage",
            pageStart: null,
            pageEnd: null,
            note: "OLTP versus OLAP, data warehousing, star and snowflake schemas, column-oriented storage, compression, and materialized views.",
            sectionIndexes: [
              11,
              12,
              13,
            ],
          },
          estimatedMinutes: 6,
        },
        {
          title: "Encoding and Schema Evolution",
          objective: "Choose an encoding format and evolve schemas without breaking old readers or writers.",
          hook: "The data outlives the code. Encoding is how you keep tomorrow's program able to read yesterday's bytes.",
          paragraphs: [
            "Encoding turns in-memory structures into bytes; decoding reverses it. Language-specific serialization is convenient but locks data to one language and often fails on versioning. Text formats such as JSON, XML, and CSV are interoperable but verbose and weakly typed. Binary formats — Thrift, Protocol Buffers, Avro — add schemas and compact encodings. Protobuf and Thrift use field tags, so renaming a field is safe but changing its tag breaks compatibility. Avro resolves the writer's schema against the reader's schema, which suits evolving data files.",
            "Schema evolution has a direction. Backward compatibility means new code can read old data; forward compatibility means old code can read new data. Adding an optional field with a default is usually safe; removing a required field or changing a type is not. These rules matter most in dataflow: a database may hold years of history, services roll out independently, and message queues retain events long after producers change.",
          ],
          bullets: [
            "Encoding = in-memory to bytes; decoding = bytes back to in-memory",
            "Language-specific serialization couples data to one runtime and complicates versioning",
            "JSON/XML/CSV are readable but verbose and loosely typed",
            "Thrift and Protobuf use field tags; renaming is safe, retagging is not",
            "Avro resolves writer and reader schemas, supporting schema evolution in files",
            "Backward compatibility: new code reads old data; forward: old code reads new data",
          ],
          steps: [
            {
              title: "Encode with a schema",
              detail: "Define a record in Protobuf or Avro, write several records, and decode them with the same schema.",
            },
            {
              title: "Evolve forward",
              detail: "Add an optional field with a default. Confirm old readers can read new data and new readers can read old data.",
            },
            {
              title: "Break it deliberately",
              detail: "Rename a required field or change its type and observe the failure. Document which changes are safe and which are breaking.",
            },
          ],
          takeaway: "Pick a schema-aware binary format for long-lived data, and treat compatibility as a two-way contract between old and new readers and writers.",
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
                label: "Encode with a schema",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Evolve forward",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Break it deliberately",
                emphasis: true,
              },
            ],
            title: "How Encoding and Schema Evolution works",
          },
          quiz: {
            question: "Which change is safest when using Protocol Buffers?",
            options: [
              "Reusing an existing field tag for a different meaning",
              "Adding a new optional field with a new tag and a default",
              "Changing a field from string to integer in place",
              "Removing a required field that old readers expect",
            ],
            correctIndex: 1,
            explanation: "New optional fields with fresh tags can be ignored by old readers and defaulted by new ones. Reusing tags or changing types breaks the wire contract.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Encoding and Schema Evolution”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
                "Encoding = in-memory to bytes; decoding = bytes back to in-memory",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Encoding = in-memory to bytes; decoding = bytes back to in-memory”",
            },
            {
              question: "Which statement best explains “Backward vs forward compatibility”?",
              options: [
                "Backward: new code can read data written by old code. Forward: old code can read data written by new code.",
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Backward: new code can read data written by old code. Forward: old code can read data written by new code.”",
            },
            {
              question: "Which of these is a hands-on step in “Encoding and Schema Evolution”?",
              options: [
                "Partition by hash",
                "Rebalance safely",
                "Fix it with locking",
                "Encode with a schema",
              ],
              correctIndex: 3,
              explanation: "“Encode with a schema” is part of this lesson's sequence: Define a record in Protobuf or Avro, write several records, and decode them with the same schema.",
            },
            {
              question: "What does the hands-on step “Evolve forward” involve?",
              options: [
                "Add an optional field with a default. Confirm old readers can read new data and new readers can read old data.",
                "Fetch a user with all posts and the latest comments from each model. Note the joins versus the single-document read.",
                "Store a user with posts, comments, and tags in normalized tables and as one JSONB document. Insert the same sample data into both.",
                "Create a people table and a friendships edge table in SQL. Insert a small social graph with at least two cycles.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Evolve forward” as: Add an optional field with a default. Confirm old readers can read new data and new readers can read old data.",
            },
          ],
          flashcards: [
            {
              front: "How does Avro handle schema evolution?",
              back: "It stores the writer's schema and resolves it against the reader's schema, filling defaults and ignoring unknown fields during decoding.",
            },
            {
              front: "Why are field tags central to Protobuf/Thrift evolution?",
              back: "Tags identify fields on the wire, so names can change safely; reusing a tag for a new meaning silently corrupts data for other versions.",
            },
            {
              front: "Backward vs forward compatibility",
              back: "Backward: new code can read data written by old code. Forward: old code can read data written by new code.",
            },
            {
              front: "How do you evolve forward?",
              back: "Add an optional field with a default. Confirm old readers can read new data and new readers can read old data.",
            },
            {
              front: "How do you encode with a schema?",
              back: "Define a record in Protobuf or Avro, write several records, and decode them with the same schema.",
            },
          ],
          sourceRef: {
            label: "Chapter 4: Encoding and Evolution — Formats and Schema Evolution",
            pageStart: null,
            pageEnd: null,
            note: "Encoding formats, Thrift/Protobuf/Avro, field tags, writer/reader schema resolution, and backward/forward compatibility.",
            sectionIndexes: [
              13,
              14,
              15,
            ],
          },
          estimatedMinutes: 6,
        },
        {
          title: "Dataflow: Databases, Services, and Messages",
          objective: "Trace how encoded data moves through databases, service calls, and message brokers.",
          hook: "Dataflow is the study of who writes bytes and who must later read them — often a different program, running a different version, months later.",
          paragraphs: [
            "Dataflow happens in three main patterns. Through a database: one process writes, another reads later, so the database must preserve data across code versions. Through services: REST and RPC calls exchange data synchronously, coupling caller and callee in time and requiring careful versioning of APIs. Through asynchronous message passing: producers send events to brokers or directly to consumers, decoupling them and buffering bursts.",
            "Message brokers add durability, ordering, and delivery semantics. A log-based broker retains an append-only ordered log that consumers can replay, which makes it a bridge between messaging and replication. Delivery can be at-most-once, at-least-once, or effectively exactly-once with idempotent consumers. REST is simple and cacheable; RPC hides the network and can mislead about latency and failure. The right choice depends on coupling, delivery guarantees, and whether consumers need to replay history.",
          ],
          bullets: [
            "Database dataflow persists data for readers running different code versions",
            "REST is resource-oriented, cacheable, and explicit about the network; RPC hides transport",
            "Asynchronous messaging decouples producers and consumers in time",
            "Brokers provide durability, buffering, and delivery guarantees",
            "Log-based brokers retain ordered history that consumers can replay",
            "At-least-once delivery needs idempotent consumers to avoid duplicate effects",
          ],
          steps: [
            {
              title: "Build a message pipeline",
              detail: "Publish events from one service to a queue and consume them in another. Include an event id and timestamp.",
            },
            {
              title: "Make the consumer idempotent",
              detail: "Track processed event ids and ignore duplicates. Re-deliver the same event twice and verify the effect happens once.",
            },
            {
              title: "Handle ordering",
              detail: "Send events out of order and add a sequence check or reordering buffer. Show how the consumer copes with a late event.",
            },
          ],
          takeaway: "Design dataflow around coupling and replay: databases for durable shared state, synchronous calls for immediate answers, and logs or brokers when consumers must be decoupled and catch up.",
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
                label: "Build a message pipeline",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Make the consumer idempotent",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Handle ordering",
                emphasis: true,
              },
            ],
            title: "How Dataflow: Databases, Services, and Messages works",
          },
          quiz: {
            question: "What makes a log-based message broker different from a traditional queue?",
            options: [
              "It deletes each message as soon as one consumer reads it",
              "It keeps an ordered append-only log that multiple consumers can replay independently",
              "It guarantees exactly-once delivery without any consumer logic",
              "It only supports synchronous request/response calls",
            ],
            correctIndex: 1,
            explanation: "A log retains messages in order and lets each consumer track its own offset, enabling replay and multiple independent consumers; queues typically remove messages after acknowledgment.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Dataflow: Databases, Services, and Messages”?",
              options: [
                "Database dataflow persists data for readers running different code versions",
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Database dataflow persists data for readers running different code versions”",
            },
            {
              question: "Which statement best explains “Three dataflow patterns”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "Through a database (later readers), through service calls (REST/RPC), and through asynchronous message passing (brokers or direct channels).",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Through a database (later readers), through service calls (REST/RPC), and through asynchronous message passing (brokers or direct channels).”",
            },
            {
              question: "Which of these is a hands-on step in “Dataflow: Databases, Services, and Messages”?",
              options: [
                "Query both shapes",
                "Compare with a graph query",
                "Model a graph",
                "Build a message pipeline",
              ],
              correctIndex: 3,
              explanation: "“Build a message pipeline” is part of this lesson's sequence: Publish events from one service to a queue and consume them in another. Include an event id and timestamp.",
            },
            {
              question: "What does the hands-on step “Make the consumer idempotent” involve?",
              options: [
                "Track processed event ids and ignore duplicates. Re-deliver the same event twice and verify the effect happens once.",
                "Ingest events, store them, derive a materialized view, and serve it through an API. Use idempotency keys at every stage.",
                "Record the input event, the transformation version, and the output for every derived row. Make the derivation replayable.",
                "Build a tiny service backed by a file. Kill the process mid-write and simulate a disk error, then observe what the client sees.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Make the consumer idempotent” as: Track processed event ids and ignore duplicates. Re-deliver the same event twice and verify the effect happens once.",
            },
          ],
          flashcards: [
            {
              front: "Three dataflow patterns",
              back: "Through a database (later readers), through service calls (REST/RPC), and through asynchronous message passing (brokers or direct channels).",
            },
            {
              front: "Why is RPC not a local function call?",
              back: "It crosses a network with latency, partial failure, retries, and version skew; pretending otherwise hides the failure modes you must design for.",
            },
            {
              front: "At-least-once vs at-most-once delivery",
              back: "At-least-once may duplicate messages but never silently drops them; at-most-once may drop but never duplicates. Idempotence makes at-least-once practical.",
            },
            {
              front: "How do you make the consumer idempotent?",
              back: "Track processed event ids and ignore duplicates. Re-deliver the same event twice and verify the effect happens once.",
            },
            {
              front: "How do you build a message pipeline?",
              back: "Publish events from one service to a queue and consume them in another. Include an event id and timestamp.",
            },
          ],
          sourceRef: {
            label: "Chapter 4: Dataflow Through Databases, Services, and Messages",
            pageStart: null,
            pageEnd: null,
            note: "Database, service, and message-passing dataflow; REST versus RPC; brokers, log replay, and delivery semantics.",
            sectionIndexes: [
              15,
              16,
            ],
          },
          estimatedMinutes: 6,
        },
      ],
    },
    {
      title: "Distributed Data",
      summary: "Chapters 5-6: replicating and partitioning data across nodes, and the consistency problems that follow.",
      lessons: [
        {
          title: "Replication: Leaders, Followers, and Logs",
          objective: "Explain single-leader replication, failover, and the trade-offs between replication log formats.",
          hook: "Replication is easy until the leader dies. Then every design decision you postponed becomes an outage.",
          paragraphs: [
            "In single-leader replication, all writes go to one leader, which appends them to a replication log; followers replay that log to stay in sync. Synchronous replication guarantees a follower has the write before acknowledging, at the cost of availability if the follower is slow. Asynchronous replication acknowledges immediately but risks losing recent writes on failover. Semi-synchronous replication keeps one synchronous follower and the rest asynchronous — a common compromise.",
            "Setting up a new follower requires a consistent snapshot plus the log position, then catching up from that point. Failover is the hard part: detecting the leader's death, choosing a new leader, and reconfiguring clients. Split-brain — two leaders accepting writes — can lose data, so systems use fencing tokens or consensus. The log itself can be statement-based (fragile with nondeterminism), WAL shipping (physical, version-specific), logical/row-based (flexible), or trigger-based (application-controlled).",
          ],
          bullets: [
            "Single-leader: all writes to the leader, followers replay the log",
            "Synchronous replication trades availability for durability; asynchronous risks losing recent writes",
            "Semi-synchronous keeps one synchronous follower as a compromise",
            "New followers need a consistent snapshot plus a log position, then catch-up",
            "Failover needs leader election and fencing to prevent split-brain",
            "Statement, WAL, logical, and trigger-based logs differ in portability and determinism",
          ],
          steps: [
            {
              title: "Replicate an append-only log",
              detail: "Run one leader and two followers. The leader appends writes to a log and streams entries to each follower.",
            },
            {
              title: "Simulate replication lag",
              detail: "Delay one follower and read from it immediately after a write. Show the stale read and then catch up.",
            },
            {
              title: "Fail over",
              detail: "Stop the leader, promote the most up-to-date follower, and redirect writes. Verify no acknowledged write disappears.",
            },
          ],
          takeaway: "Replication is a durability and availability trade-off; the replication log format and failover protocol decide what survives a leader crash.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "leader",
                from: "client",
                label: "write",
              },
              {
                to: "f1",
                from: "leader",
                label: "log stream",
              },
              {
                to: "f2",
                from: "leader",
                label: "log stream",
              },
            ],
            nodes: [
              {
                id: "client",
                label: "Client writes",
                emphasis: false,
              },
              {
                id: "leader",
                label: "Leader appends log",
                emphasis: true,
              },
              {
                id: "f1",
                label: "Follower 1 replays",
                emphasis: false,
              },
              {
                id: "f2",
                label: "Follower 2 replays",
                emphasis: false,
              },
            ],
            title: "Single-leader replication",
          },
          quiz: {
            question: "Why can asynchronous replication lose data when the leader fails?",
            options: [
              "Followers never receive the leader's log",
              "The leader may acknowledge writes that no follower has durably received yet",
              "Asynchronous replication cannot use a write-ahead log",
              "Clients always write directly to followers",
            ],
            correctIndex: 1,
            explanation: "With asynchronous replication the leader acknowledges before followers confirm, so writes that existed only on the failed leader are lost when a follower is promoted.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Replication: Leaders, Followers, and Logs”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Single-leader: all writes to the leader, followers replay the log",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Single-leader: all writes to the leader, followers replay the log”",
            },
            {
              question: "Which statement best explains “Semi-synchronous replication”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "One follower is synchronous (must confirm before acknowledgment) while the others replicate asynchronously, balancing durability and availability.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “One follower is synchronous (must confirm before acknowledgment) while the others replicate asynchronously, balancing durability and availability.”",
            },
            {
              question: "Which of these is a hands-on step in “Replication: Leaders, Followers, and Logs”?",
              options: [
                "Rebalance safely",
                "Fix it with locking",
                "Reproduce a lost update",
                "Replicate an append-only log",
              ],
              correctIndex: 3,
              explanation: "“Replicate an append-only log” is part of this lesson's sequence: Run one leader and two followers. The leader appends writes to a log and streams entries to each follower.",
            },
            {
              question: "What does the hands-on step “Simulate replication lag” involve?",
              options: [
                "Delay one follower and read from it immediately after a write. Show the stale read and then catch up.",
                "Move one clock backwards and run your ordering again. Explain which guarantees break with raw wall-clock timestamps.",
                "Isolate the leader and try to write. Confirm the majority elects a new leader and the old one stops accepting writes.",
                "Run concurrent reads and writes through a register. Record the history and check that no read returns an older value after a completed write.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Simulate replication lag” as: Delay one follower and read from it immediately after a write. Show the stale read and then catch up.",
            },
          ],
          flashcards: [
            {
              front: "Logical (row-based) replication log",
              back: "Describes row-level changes independently of storage-engine internals, so it is more portable across versions and can be consumed by external systems.",
            },
            {
              front: "Split-brain",
              back: "Two nodes both believe they are leader and accept writes; without fencing or consensus, their histories diverge and data can be lost.",
            },
            {
              front: "Semi-synchronous replication",
              back: "One follower is synchronous (must confirm before acknowledgment) while the others replicate asynchronously, balancing durability and availability.",
            },
            {
              front: "How do you simulate replication lag?",
              back: "Delay one follower and read from it immediately after a write. Show the stale read and then catch up.",
            },
            {
              front: "How do you replicate an append-only log?",
              back: "Run one leader and two followers. The leader appends writes to a log and streams entries to each follower.",
            },
          ],
          sourceRef: {
            label: "Chapter 5: Replication — Leaders and Followers",
            pageStart: null,
            pageEnd: null,
            note: "Single-leader replication, sync/async/semi-sync trade-offs, adding followers, failover, split-brain, and log formats.",
            sectionIndexes: [
              17,
              18,
            ],
          },
          estimatedMinutes: 6,
        },
        {
          title: "Replication Lag, Multi-Leader, and Leaderless Systems",
          objective: "Reason about stale reads, write conflicts, and quorum consistency in replicated systems.",
          hook: "A user posts a comment and cannot see it on refresh. The database is not broken — the user just read from a follower that had not caught up.",
          paragraphs: [
            "With asynchronous followers, reads can be stale. Read-your-writes guarantees a user sees their own writes by routing them to the leader or tracking a timestamp. Monotonic reads prevent time from going backwards by pinning a user to one replica. Consistent prefix reads preserve causal order across partitions. These are session guarantees, not full consistency, and they cover most user-visible anomalies cheaply.",
            "Multi-leader replication lets writes happen in several datacenters, improving latency and availability, but it creates write conflicts. Last-write-wins silently discards data; version vectors detect concurrency; CRDTs merge deterministically for some data types. Leaderless systems use quorums: with N replicas, a write must reach W nodes and a read must contact R nodes, and W + R > N gives overlap. Sloppy quorums and hinted handoff improve availability but weaken the guarantee. Read repair and anti-entropy restore convergence in the background.",
          ],
          bullets: [
            "Read-your-writes, monotonic reads, and consistent prefix are cheap session guarantees",
            "Multi-leader replication lowers write latency but introduces write conflicts",
            "Last-write-wins loses concurrent updates; version vectors expose them",
            "CRDTs merge certain data types deterministically without coordination",
            "Leaderless reads/writes use quorums; W + R > N ensures overlapping replicas",
            "Sloppy quorums and hinted handoff trade consistency for availability",
          ],
          steps: [
            {
              title: "Guarantee read-your-writes",
              detail: "Track the last write version per user and route that user's reads to a replica that has caught up, or to the leader.",
            },
            {
              title: "Test monotonic reads",
              detail: "Read from two replicas with different lag and observe time moving backwards. Pin a user to one replica and retest.",
            },
            {
              title: "Resolve a conflict",
              detail: "Write the same key on two leaders and merge with last-write-wins using synchronized clocks. Then try a version vector and compare.",
            },
          ],
          takeaway: "Replication lag is a user-experience problem solved with session guarantees; multi-leader and leaderless designs need explicit conflict handling and honest quorum reasoning.",
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
                label: "Guarantee read-your-writes",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Test monotonic reads",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Resolve a conflict",
                emphasis: true,
              },
            ],
            title: "How Replication Lag, Multi-Leader, and Leaderless Systems works",
          },
          quiz: {
            question: "In a leaderless system with N=3, which quorum settings guarantee read/write overlap?",
            options: [
              "W=1, R=1",
              "W=2, R=1",
              "W=2, R=2",
              "W=3, R=0",
            ],
            correctIndex: 2,
            explanation: "Overlap requires W + R > N. With N=3, W=2 and R=2 gives 4 > 3; W=2, R=1 gives 3, which does not guarantee the read set intersects the latest write set.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Replication Lag, Multi-Leader, and Leaderless Systems”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Read-your-writes, monotonic reads, and consistent prefix are cheap session guarantees",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Read-your-writes, monotonic reads, and consistent prefix are cheap session guarantees”",
            },
            {
              question: "Which statement best explains “Read-your-writes guarantee”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
                "After a user writes, their subsequent reads see that write — often implemented by reading from the leader or tracking a write timestamp.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “After a user writes, their subsequent reads see that write — often implemented by reading from the leader or tracking a write timestamp.”",
            },
            {
              question: "Which of these is a hands-on step in “Replication Lag, Multi-Leader, and Leaderless Systems”?",
              options: [
                "Write the runbook",
                "Compare evolution",
                "Model the same data twice",
                "Guarantee read-your-writes",
              ],
              correctIndex: 3,
              explanation: "“Guarantee read-your-writes” is part of this lesson's sequence: Track the last write version per user and route that user's reads to a replica that has caught up, or to the leader.",
            },
            {
              question: "What does the hands-on step “Test monotonic reads” involve?",
              options: [
                "Read from two replicas with different lag and observe time moving backwards. Pin a user to one replica and retest.",
                "Publish events from one service to a queue and consume them in another. Include an event id and timestamp.",
                "Send events out of order and add a sequence check or reordering buffer. Show how the consumer copes with a late event.",
                "Track processed event ids and ignore duplicates. Re-deliver the same event twice and verify the effect happens once.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Test monotonic reads” as: Read from two replicas with different lag and observe time moving backwards. Pin a user to one replica and retest.",
            },
          ],
          flashcards: [
            {
              front: "Sloppy quorum",
              back: "Accepts writes on any available nodes when the home nodes are unreachable, then hands off later; it improves availability but may not satisfy W + R > N.",
            },
            {
              front: "Version vector",
              back: "Per-replica counters used to detect whether two writes are causally ordered or concurrent, so conflicts can be resolved rather than silently overwritten.",
            },
            {
              front: "Read-your-writes guarantee",
              back: "After a user writes, their subsequent reads see that write — often implemented by reading from the leader or tracking a write timestamp.",
            },
            {
              front: "How do you test monotonic reads?",
              back: "Read from two replicas with different lag and observe time moving backwards. Pin a user to one replica and retest.",
            },
            {
              front: "How do you guarantee read-your-writes?",
              back: "Track the last write version per user and route that user's reads to a replica that has caught up, or to the leader.",
            },
          ],
          sourceRef: {
            label: "Chapter 5: Problems with Replication Lag, Multi-Leader, and Leaderless Replication",
            pageStart: null,
            pageEnd: null,
            note: "Session guarantees, multi-leader conflicts, version vectors, CRDTs, quorums, sloppy quorums, read repair, and anti-entropy.",
            sectionIndexes: [
              19,
              20,
              21,
              22,
            ],
          },
          estimatedMinutes: 7,
        },
        {
          title: "Partitioning and Rebalancing",
          objective: "Partition data without hot spots and rebalance it without breaking request routing.",
          hook: "Sharding does not automatically scale you. A single celebrity key can still melt one partition.",
          paragraphs: [
            "Partitioning splits a large dataset so each node handles a subset. Key-range partitioning preserves sort order and supports efficient range scans but risks hot spots on sequential keys. Hash partitioning spreads keys evenly but destroys range locality. Compound keys — hash the first component, sort by the second — can get both. Skew is the persistent enemy: a single hot key or a celebrity user sends disproportionate traffic to one partition, and application-level key splitting is sometimes the only fix.",
            "Secondary indexes complicate partitioning. A document-partitioned index stores index entries with the document, so writes are local but reads must scatter/gather across all partitions. A term-partitioned index routes by indexed term, so reads hit one partition but writes may touch many. Rebalancing can use a fixed number of partitions, modulo hashing (which moves many keys when the node count changes), or dynamic splitting. Request routing needs a service discovery layer — a coordination service, a routing tier, or gossip.",
          ],
          bullets: [
            "Key-range partitioning keeps order and range scans but can create hot spots",
            "Hash partitioning spreads load but loses range locality",
            "Compound keys can combine hash distribution with sorted order",
            "Skew from hot keys needs application-level splitting or caching",
            "Document-partitioned secondary indexes write locally but read widely",
            "Term-partitioned secondary indexes read locally but write widely",
          ],
          steps: [
            {
              title: "Partition by hash",
              detail: "Assign keys to 16 partitions with a hash function. Verify the distribution on 10,000 keys and find the hottest partition.",
            },
            {
              title: "Add consistent hashing",
              detail: "Place nodes and keys on a ring. Add a node and count how many keys move compared with modulo hashing.",
            },
            {
              title: "Rebalance safely",
              detail: "Move one partition to a new node while reads continue. Verify no key is lost or served by two owners at once.",
            },
          ],
          takeaway: "Partition for even load on the actual key distribution, choose the secondary-index strategy by read/write pattern, and make rebalancing and routing explicit.",
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
                label: "Partition by hash",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Add consistent hashing",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Rebalance safely",
                emphasis: true,
              },
            ],
            title: "How Partitioning and Rebalancing works",
          },
          quiz: {
            question: "What is the main cost of a document-partitioned secondary index?",
            options: [
              "Writes must update every partition",
              "Reads by secondary key must scatter/gather across all partitions",
              "It cannot store more than one index",
              "It requires a global lock on every write",
            ],
            correctIndex: 1,
            explanation: "Each partition indexes only its own documents, so a query by a secondary field has to ask every partition and merge the results; writes stay local.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Partitioning and Rebalancing”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
                "Key-range partitioning keeps order and range scans but can create hot spots",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Key-range partitioning keeps order and range scans but can create hot spots”",
            },
            {
              question: "Which statement best explains “Hot spot / skew”?",
              options: [
                "A partition receiving disproportionate load because of one key or a skewed distribution, limiting the benefit of adding nodes.",
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “A partition receiving disproportionate load because of one key or a skewed distribution, limiting the benefit of adding nodes.”",
            },
            {
              question: "Which of these is a hands-on step in “Partitioning and Rebalancing”?",
              options: [
                "Test monotonic reads",
                "Fix it with locking",
                "Reproduce a lost update",
                "Partition by hash",
              ],
              correctIndex: 3,
              explanation: "“Partition by hash” is part of this lesson's sequence: Assign keys to 16 partitions with a hash function. Verify the distribution on 10,000 keys and find the hottest partition.",
            },
            {
              question: "What does the hands-on step “Add consistent hashing” involve?",
              options: [
                "Place nodes and keys on a ring. Add a node and count how many keys move compared with modulo hashing.",
                "Enforce a rule across two rows that each transaction checks separately. Show the violation under snapshot isolation and fix it with serializable.",
                "Open two transactions that read the same counter and write it back. Commit both and show that one increment vanished.",
                "Use SELECT... FOR UPDATE or an atomic increment. Repeat the concurrent test and confirm both updates survive.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add consistent hashing” as: Place nodes and keys on a ring. Add a node and count how many keys move compared with modulo hashing.",
            },
          ],
          flashcards: [
            {
              front: "Hot spot / skew",
              back: "A partition receiving disproportionate load because of one key or a skewed distribution, limiting the benefit of adding nodes.",
            },
            {
              front: "Document- vs term-partitioned index",
              back: "Document-partitioned keeps index entries with the document (local writes, scattered reads); term-partitioned routes by term (local reads, distributed writes).",
            },
            {
              front: "Why does modulo hashing rebalance badly?",
              back: "Changing the number of nodes changes key mod N for most keys, moving far more data than necessary; fixed partition counts or consistent hashing avoid this.",
            },
            {
              front: "How do you add consistent hashing?",
              back: "Place nodes and keys on a ring. Add a node and count how many keys move compared with modulo hashing.",
            },
            {
              front: "How do you partition by hash?",
              back: "Assign keys to 16 partitions with a hash function. Verify the distribution on 10,000 keys and find the hottest partition.",
            },
          ],
          sourceRef: {
            label: "Chapter 6: Partitioning — Key Range, Hash, Secondary Indexes, and Rebalancing",
            pageStart: null,
            pageEnd: null,
            note: "Key-range and hash partitioning, skew and hot spots, secondary-index strategies, rebalancing, and request routing.",
            sectionIndexes: [
              22,
              23,
              24,
              25,
            ],
          },
          estimatedMinutes: 6,
        },
      ],
    },
    {
      title: "Transactions and Distributed Systems",
      summary: "Chapters 7-9: isolation levels, partial failure, clocks, consistency, and consensus.",
      lessons: [
        {
          title: "Transactions and Isolation Levels",
          objective: "Identify the anomaly each isolation level prevents and the ones it still permits.",
          hook: "ACID is a marketing acronym until you can name the anomaly each isolation level actually stops.",
          paragraphs: [
            "A transaction groups reads and writes into one logical unit with atomicity (all or nothing), consistency (invariants hold), isolation (concurrent transactions do not interfere), and durability (committed data survives crashes). Read committed prevents dirty writes and dirty reads but allows read skew: a transaction can see different snapshots at different times. Snapshot isolation gives each transaction a consistent snapshot and prevents read skew, but write skew can still occur when two transactions read overlapping data and write disjoint rows.",
            "Lost updates happen when two transactions read-modify-write the same row and one overwrites the other; atomic operations, explicit locks, or compare-and-set prevent it. Write skew and phantoms need serializability. Actual serial execution is simple when the working set fits in memory. Two-phase locking is correct but blocks and can deadlock. Serializable snapshot isolation detects dangerous structures and aborts one transaction — optimistic, but with retry cost. The right level depends on which anomalies the application can tolerate.",
          ],
          bullets: [
            "Atomicity, consistency, isolation, durability describe guarantees, not a single implementation",
            "Read committed blocks dirty reads/writes but allows read skew",
            "Snapshot isolation gives a stable snapshot but still permits write skew",
            "Lost updates need atomic operations, locks, or compare-and-set",
            "Serializable isolation prevents write skew and phantoms at a concurrency cost",
            "2PL blocks; SSI aborts conflicting transactions optimistically",
          ],
          steps: [
            {
              title: "Reproduce a lost update",
              detail: "Open two transactions that read the same counter and write it back. Commit both and show that one increment vanished.",
            },
            {
              title: "Fix it with locking",
              detail: "Use SELECT... FOR UPDATE or an atomic increment. Repeat the concurrent test and confirm both updates survive.",
            },
            {
              title: "Try write skew",
              detail: "Enforce a rule across two rows that each transaction checks separately. Show the violation under snapshot isolation and fix it with serializable.",
            },
          ],
          takeaway: "Choose isolation by naming the anomaly you cannot tolerate: snapshot isolation for stable reads, serializable isolation when invariants span multiple rows.",
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
                label: "Reproduce a lost update",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Fix it with locking",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Try write skew",
                emphasis: true,
              },
            ],
            title: "How Transactions and Isolation Levels works",
          },
          quiz: {
            question: "Two doctors each check that another doctor is on call, then both go off call. Which anomaly is this?",
            options: [
              "Dirty read",
              "Lost update",
              "Write skew",
              "Phantom read only",
            ],
            correctIndex: 2,
            explanation: "Each transaction reads an overlapping condition and writes a different row, so both commit under snapshot isolation while violating the invariant. This is write skew and needs serializable isolation.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Transactions and Isolation Levels”?",
              options: [
                "Atomicity, consistency, isolation, durability describe guarantees, not a single implementation",
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Atomicity, consistency, isolation, durability describe guarantees, not a single implementation”",
            },
            {
              question: "Which statement best explains “Read skew”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A transaction sees different snapshots at different times, so it observes a state that never existed consistently; snapshot isolation prevents it.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “A transaction sees different snapshots at different times, so it observes a state that never existed consistently; snapshot isolation prevents it.”",
            },
            {
              question: "Which of these is a hands-on step in “Transactions and Isolation Levels”?",
              options: [
                "Measure recovery",
                "Find the bottleneck",
                "Load test a service",
                "Reproduce a lost update",
              ],
              correctIndex: 3,
              explanation: "“Reproduce a lost update” is part of this lesson's sequence: Open two transactions that read the same counter and write it back. Commit both and show that one increment vanished.",
            },
            {
              question: "What does the hands-on step “Fix it with locking” involve?",
              options: [
                "Use SELECT... FOR UPDATE or an atomic increment. Repeat the concurrent test and confirm both updates survive.",
                "Flush sorted segments, keep a sparse index, and merge segments in the background. Delete tombstones during compaction.",
                "Measure write throughput, point-read latency, and disk usage for your log store and an embedded B-tree database. Explain the differences.",
                "Create one fact table and three dimension tables for sales data. Load a CSV and write a query that aggregates by region and month.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Fix it with locking” as: Use SELECT... FOR UPDATE or an atomic increment. Repeat the concurrent test and confirm both updates survive.",
            },
          ],
          flashcards: [
            {
              front: "Serializable snapshot isolation (SSI)",
              back: "Optimistic serializability that tracks read/write dependencies and aborts a transaction when a dangerous structure appears, instead of blocking like 2PL.",
            },
            {
              front: "Write skew",
              back: "Two transactions read overlapping data, write disjoint rows, and both commit, violating a cross-row invariant; snapshot isolation permits it, serializability prevents it.",
            },
            {
              front: "Read skew",
              back: "A transaction sees different snapshots at different times, so it observes a state that never existed consistently; snapshot isolation prevents it.",
            },
            {
              front: "How do you fix it with locking?",
              back: "Use SELECT... FOR UPDATE or an atomic increment. Repeat the concurrent test and confirm both updates survive.",
            },
            {
              front: "How do you reproduce a lost update?",
              back: "Open two transactions that read the same counter and write it back. Commit both and show that one increment vanished.",
            },
          ],
          sourceRef: {
            label: "Chapter 7: Transactions — ACID, Weak Isolation, and Serializability",
            pageStart: null,
            pageEnd: null,
            note: "ACID, read committed, snapshot isolation, lost updates, write skew, phantoms, 2PL, and serializable snapshot isolation.",
            sectionIndexes: [
              25,
              26,
              27,
              28,
            ],
          },
          estimatedMinutes: 7,
        },
        {
          title: "Faults, Clocks, and Distributed Truth",
          objective: "Design for partial failure, unreliable time, and the fact that a node cannot trust its own senses.",
          hook: "On one computer a crash is obvious. In a distributed system, a node can be dead, slow, or unreachable — and you cannot tell which.",
          paragraphs: [
            "Distributed systems face partial failure: one part breaks while others keep working, and the network gives no reliable signal about which. Timeouts are guesses; an unbounded delay can look identical to a crash. Retries can duplicate work, and a request that timed out may still have succeeded. Networks drop, reorder, and duplicate packets; TCP hides some of this but cannot guarantee latency. Clocks make it worse: time-of-day clocks can jump, monotonic clocks measure elapsed time but not wall time, and NTP synchronization has error bounds.",
            "Process pauses — garbage collection, virtual machine migration, swapping — can freeze a node for seconds while its clock keeps running. A node cannot even trust that it is alive; it can only gather evidence from others. The majority defines truth in many protocols: a leader that cannot reach a majority must stop acting as leader. Byzantine faults, where nodes lie, require stronger assumptions and are usually out of scope for data systems. Safety and liveness must be defined against a system model, not wished away.",
          ],
          bullets: [
            "Partial failure means some components fail while others continue, with no reliable global signal",
            "Timeouts cannot distinguish a crash from an unbounded network delay",
            "Retries can duplicate operations; make them idempotent or deduplicate",
            "Time-of-day clocks can jump; monotonic clocks measure durations, not dates",
            "Process pauses make a live node appear dead to itself and others",
            "Majority quorums and fencing prevent a partitioned node from acting as leader",
          ],
          steps: [
            {
              title: "Measure clock skew",
              detail: "Compare timestamps from two machines over a minute. Record the offset and drift before and after an NTP sync.",
            },
            {
              title: "Build a hybrid logical clock",
              detail: "Combine physical time with a logical counter. Order events from two nodes and show causality is preserved across a clock jump.",
            },
            {
              title: "Test a clock jump",
              detail: "Move one clock backwards and run your ordering again. Explain which guarantees break with raw wall-clock timestamps.",
            },
          ],
          takeaway: "Assume the network is unreliable and clocks are wrong; design protocols around quorums, idempotence, and explicit safety/liveness definitions.",
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
                label: "Measure clock skew",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Build a hybrid logical clock",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Test a clock jump",
                emphasis: true,
              },
            ],
            title: "How Faults, Clocks, and Distributed Truth works",
          },
          quiz: {
            question: "Why is a timeout not proof that a remote node has crashed?",
            options: [
              "Timeouts only work on localhost",
              "The request or response may be delayed indefinitely by the network while the node is still alive",
              "TCP always delivers responses eventually",
              "A crashed node always sends a final error message",
            ],
            correctIndex: 1,
            explanation: "A timeout is local evidence, not global truth. The node may be slow, paused, or partitioned, and the request may still complete after the caller gives up.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Faults, Clocks, and Distributed Truth”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Partial failure means some components fail while others continue, with no reliable global signal",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Partial failure means some components fail while others continue, with no reliable global signal”",
            },
            {
              question: "Which statement best explains “Partial failure”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "A failure in one part of a distributed system while other parts continue; the hard part is that no component has a reliable global view.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “A failure in one part of a distributed system while other parts continue; the hard part is that no component has a reliable global view.”",
            },
            {
              question: "Which of these is a hands-on step in “Faults, Clocks, and Distributed Truth”?",
              options: [
                "Implement word count",
                "Aggregate in windows",
                "Capture changes",
                "Measure clock skew",
              ],
              correctIndex: 3,
              explanation: "“Measure clock skew” is part of this lesson's sequence: Compare timestamps from two machines over a minute. Record the offset and drift before and after an NTP sync.",
            },
            {
              question: "What does the hands-on step “Build a hybrid logical clock” involve?",
              options: [
                "Combine physical time with a logical counter. Order events from two nodes and show causality is preserved across a clock jump.",
                "Profile CPU, memory, and I/O under load. Identify which resource saturates first and explain the latency curve.",
                "Add a feature behind an interface, keep the old path working, and add a test that pins the previous behavior.",
                "Document how to start, stop, back up, and restore the service. Include the three most likely failures and their checks.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Build a hybrid logical clock” as: Combine physical time with a logical counter. Order events from two nodes and show causality is preserved across a clock jump.",
            },
          ],
          flashcards: [
            {
              front: "Partial failure",
              back: "A failure in one part of a distributed system while other parts continue; the hard part is that no component has a reliable global view.",
            },
            {
              front: "Monotonic vs time-of-day clock",
              back: "Monotonic clocks measure elapsed time and never jump backwards; time-of-day clocks show calendar time and can jump due to NTP or manual changes.",
            },
            {
              front: "Why does a majority define truth?",
              back: "Because a node cannot distinguish its own failure from the network's; requiring quorum agreement ensures at most one side of a partition can act as leader.",
            },
            {
              front: "How do you measure clock skew?",
              back: "Compare timestamps from two machines over a minute. Record the offset and drift before and after an NTP sync.",
            },
            {
              front: "How do you build a hybrid logical clock?",
              back: "Combine physical time with a logical counter. Order events from two nodes and show causality is preserved across a clock jump.",
            },
          ],
          sourceRef: {
            label: "Chapter 8: The Trouble with Distributed Systems — Faults, Networks, Clocks, and Truth",
            pageStart: null,
            pageEnd: null,
            note: "Partial failure, unreliable networks, timeouts, clock types, process pauses, majority truth, Byzantine faults, and system models.",
            sectionIndexes: [
              29,
              30,
              31,
              32,
              33,
            ],
          },
          estimatedMinutes: 7,
        },
        {
          title: "Consistency, Ordering, and Consensus",
          objective: "Distinguish linearizability from serializability and explain how consensus orders events.",
          hook: "Consensus is not a database feature. It is the primitive that lets a group of unreliable machines agree on one history.",
          paragraphs: [
            "Linearizability is a recency guarantee: once a write completes, every later read sees it, as if there were one copy. It is stronger than serializability, which only orders transactions, and it is expensive because it requires coordination. CAP says that during a network partition you must choose consistency or availability; PACELC adds that even without partitions, there is a latency/consistency trade-off. These are constraints, not slogans.",
            "Ordering is the foundation of consistency. Causal order captures what happened before what; total order broadcast gives every node the same sequence of messages. Lamport clocks and hybrid logical clocks provide ordering without perfectly synchronized time. Distributed transactions use two-phase commit for atomic commit across nodes, but 2PC blocks if the coordinator fails. Fault-tolerant consensus — Paxos, Raft, Zab — lets a majority agree on a sequence despite failures, which is why it underpins replicated logs, leader election, and coordination services such as ZooKeeper and etcd.",
          ],
          bullets: [
            "Linearizability guarantees recency as if there were one copy of the data",
            "Serializability orders transactions; linearizability orders individual operations",
            "CAP forces a consistency/availability choice during a partition; PACELC adds latency trade-offs",
            "Causal order preserves happens-before; total order broadcast gives one global sequence",
            "Two-phase commit is atomic but blocks if the coordinator fails",
            "Consensus (Paxos/Raft/Zab) agrees on an ordered log and powers leader election and coordination",
          ],
          steps: [
            {
              title: "Run a consensus cluster",
              detail: "Start a three-node Raft or etcd cluster. Write a key through the leader and read it back from a follower.",
            },
            {
              title: "Partition the cluster",
              detail: "Isolate the leader and try to write. Confirm the majority elects a new leader and the old one stops accepting writes.",
            },
            {
              title: "Test linearizability",
              detail: "Run concurrent reads and writes through a register. Record the history and check that no read returns an older value after a completed write.",
            },
          ],
          takeaway: "Strong consistency is a coordination cost: linearizability and consensus buy a single agreed order at the price of latency and availability during failure.",
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
                label: "Run a consensus cluster",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Partition the cluster",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Test linearizability",
                emphasis: true,
              },
            ],
            title: "How Consistency, Ordering, and Consensus works",
          },
          quiz: {
            question: "What does total order broadcast guarantee?",
            options: [
              "Every message is delivered exactly once to every node in the same order",
              "Every node can write without coordination",
              "Messages are delivered only to the leader",
              "Clocks on all nodes are perfectly synchronized",
            ],
            correctIndex: 0,
            explanation: "Total order broadcast delivers every message to every correct node in the same global order, which is the basis for replicated state machines and consensus.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Consistency, Ordering, and Consensus”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Linearizability guarantees recency as if there were one copy of the data",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Linearizability guarantees recency as if there were one copy of the data”",
            },
            {
              question: "Which statement best explains “Linearizability vs serializability”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
                "Linearizability is a recency guarantee on individual reads/writes; serializability orders transactions as if executed one at a time. They are different properties.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Linearizability is a recency guarantee on individual reads/writes; serializability orders transactions as if executed one at a time. They are different properties.”",
            },
            {
              question: "Which of these is a hands-on step in “Consistency, Ordering, and Consensus”?",
              options: [
                "Build a message pipeline",
                "Handle ordering",
                "Make the consumer idempotent",
                "Run a consensus cluster",
              ],
              correctIndex: 3,
              explanation: "“Run a consensus cluster” is part of this lesson's sequence: Start a three-node Raft or etcd cluster. Write a key through the leader and read it back from a follower.",
            },
            {
              question: "What does the hands-on step “Partition the cluster” involve?",
              options: [
                "Isolate the leader and try to write. Confirm the majority elects a new leader and the old one stops accepting writes.",
                "Drive a simple endpoint with 1, 10, and 100 concurrent clients. Record throughput and p50, p95, and p99 latency.",
                "Profile CPU, memory, and I/O under load. Identify which resource saturates first and explain the latency curve.",
                "Add a feature behind an interface, keep the old path working, and add a test that pins the previous behavior.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Partition the cluster” as: Isolate the leader and try to write. Confirm the majority elects a new leader and the old one stops accepting writes.",
            },
          ],
          flashcards: [
            {
              front: "Linearizability vs serializability",
              back: "Linearizability is a recency guarantee on individual reads/writes; serializability orders transactions as if executed one at a time. They are different properties.",
            },
            {
              front: "Two-phase commit (2PC)",
              back: "A coordinator asks participants to prepare, then commits or aborts; it is atomic but blocks if the coordinator fails after prepare.",
            },
            {
              front: "What does consensus give you?",
              back: "Agreement by a majority on a single value or ordered log despite crashes and partitions, enabling leader election, replicated logs, and coordination.",
            },
            {
              front: "How do you partition the cluster?",
              back: "Isolate the leader and try to write. Confirm the majority elects a new leader and the old one stops accepting writes.",
            },
            {
              front: "How do you run a consensus cluster?",
              back: "Start a three-node Raft or etcd cluster. Write a key through the leader and read it back from a follower.",
            },
          ],
          sourceRef: {
            label: "Chapter 9: Consistency and Consensus — Linearizability, Ordering, and Consensus",
            pageStart: null,
            pageEnd: null,
            note: "Linearizability, serializability, CAP/PACELC, causal and total order, Lamport clocks, 2PC, consensus, and coordination services.",
            sectionIndexes: [
              34,
              35,
              36,
              37,
              38,
            ],
          },
          estimatedMinutes: 7,
        },
      ],
    },
    {
      title: "Derived Data and the Future",
      summary: "Chapters 10-12: batch and stream processing, data integration, correctness, and privacy.",
      lessons: [
        {
          title: "Batch Processing and MapReduce",
          objective: "Explain how batch systems turn large inputs into derived datasets and when to use them.",
          hook: "Batch processing is the patient approach: read an immutable input, compute a new output, and never mutate the past.",
          paragraphs: [
            "Batch processing reads a bounded input and produces a derived output. The Unix philosophy — small tools connected by pipes, each doing one thing — is the model: sort, filter, aggregate, and write. MapReduce generalizes this across machines: map extracts key-value pairs, shuffle groups by key, and reduce aggregates. HDFS provides replicated storage so tasks can run near their data. The framework handles partitioning, retries, and stragglers, which is why batch jobs tolerate machine failure.",
            "Joins in batch are either reduce-side, where both inputs are shuffled by join key, or map-side, where one side is small enough to broadcast. Output is usually a new immutable dataset rather than an in-place update. Hadoop's strength is flexibility on messy data; MPP databases are faster for SQL-shaped workloads but less tolerant of heterogeneous input. Dataflow engines such as Spark and Flink generalize MapReduce with DAGs and in-memory shuffles; Pregel-style graph processing iterates over vertices; high-level APIs make the physical plan an optimizer's job.",
          ],
          bullets: [
            "Batch jobs read bounded input and write immutable derived output",
            "MapReduce: map, shuffle, reduce; the framework handles distribution and retries",
            "HDFS colocates computation with replicated data",
            "Reduce-side joins shuffle both inputs; map-side joins broadcast a small side",
            "Hadoop is flexible on messy data; MPP databases optimize SQL workloads",
            "Dataflow engines, Pregel, and high-level APIs generalize batch computation",
          ],
          steps: [
            {
              title: "Implement word count",
              detail: "Write map and reduce functions over a large text file. Shuffle by key and sum counts per word.",
            },
            {
              title: "Add a combiner and partitioner",
              detail: "Aggregate partial counts before the shuffle and route keys to reducers by hash. Measure the reduction in shuffled bytes.",
            },
            {
              title: "Handle skew",
              detail: "Create one very hot key and observe a slow reducer. Add salting or a two-stage aggregation and remeasure.",
            },
          ],
          takeaway: "Batch processing is for recomputing derived data from immutable inputs; choose map-side or reduce-side joins by data size and use dataflow engines for complex pipelines.",
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
                label: "Implement word count",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Add a combiner and partitioner",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Handle skew",
                emphasis: true,
              },
            ],
            title: "How Batch Processing and MapReduce works",
          },
          quiz: {
            question: "When is a map-side join preferable to a reduce-side join?",
            options: [
              "When both inputs are enormous and must be fully shuffled",
              "When one input is small enough to broadcast to every mapper",
              "When the join key is missing from both datasets",
              "When the output must be updated in place",
            ],
            correctIndex: 1,
            explanation: "Map-side joins avoid the shuffle by loading a small dataset into memory on each mapper; reduce-side joins are needed when both sides are large.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Batch Processing and MapReduce”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
                "Batch jobs read bounded input and write immutable derived output",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Batch jobs read bounded input and write immutable derived output”",
            },
            {
              question: "Which statement best explains “MapReduce shuffle”?",
              options: [
                "The phase that partitions and sorts map output by key so all values for a key reach the same reducer.",
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “The phase that partitions and sorts map output by key so all values for a key reach the same reducer.”",
            },
            {
              question: "Which of these is a hands-on step in “Batch Processing and MapReduce”?",
              options: [
                "Load test a service",
                "Scale and remeasure",
                "Add observability",
                "Implement word count",
              ],
              correctIndex: 3,
              explanation: "“Implement word count” is part of this lesson's sequence: Write map and reduce functions over a large text file. Shuffle by key and sum counts per word.",
            },
            {
              question: "What does the hands-on step “Add a combiner and partitioner” involve?",
              options: [
                "Aggregate partial counts before the shuffle and route keys to reducers by hash. Measure the reduction in shuffled bytes.",
                "Measure write throughput, point-read latency, and disk usage for your log store and an embedded B-tree database. Explain the differences.",
                "Create one fact table and three dimension tables for sales data. Load a CSV and write a query that aggregates by region and month.",
                "Run the same aggregation against a row store and your columnar files. Report latency and I/O for both.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add a combiner and partitioner” as: Aggregate partial counts before the shuffle and route keys to reducers by hash. Measure the reduction in shuffled bytes.",
            },
          ],
          flashcards: [
            {
              front: "MapReduce shuffle",
              back: "The phase that partitions and sorts map output by key so all values for a key reach the same reducer.",
            },
            {
              front: "Why does batch tolerate machine failure?",
              back: "Inputs are immutable and tasks are deterministic, so failed tasks can be retried and recomputed without corrupting the output.",
            },
            {
              front: "Reduce-side vs map-side join",
              back: "Reduce-side shuffles both inputs by join key; map-side broadcasts a small input so each mapper can join locally without a shuffle.",
            },
            {
              front: "How do you add a combiner and partitioner?",
              back: "Aggregate partial counts before the shuffle and route keys to reducers by hash. Measure the reduction in shuffled bytes.",
            },
            {
              front: "How do you implement word count?",
              back: "Write map and reduce functions over a large text file. Shuffle by key and sum counts per word.",
            },
          ],
          sourceRef: {
            label: "Chapter 10: Batch Processing — Unix Philosophy, MapReduce, and Dataflow",
            pageStart: null,
            pageEnd: null,
            note: "Unix philosophy, MapReduce, HDFS, job execution, reduce/map-side joins, Hadoop versus MPP, dataflow engines, and graph processing.",
            sectionIndexes: [
              38,
              39,
              40,
              41,
              42,
            ],
          },
          estimatedMinutes: 7,
        },
        {
          title: "Stream Processing and Change Data Capture",
          objective: "Design event-driven pipelines with correct time handling and delivery semantics.",
          hook: "Batch asks 'what happened yesterday?' Stream processing asks 'what is happening now?' — and never gets to stop.",
          paragraphs: [
            "Streams are unbounded sequences of events. Producers send messages through direct channels, brokers, or partitioned logs. Log-based brokers retain ordered history and let consumers replay it, which blurs the line between messaging and replication. Change data capture turns database writes into an event stream, keeping caches, search indexes, and warehouses in sync without dual writes. Event sourcing goes further: the log of events is the source of truth, and current state is a derived view.",
            "Stream processing must reason about time. Event time is when something happened; processing time is when it is handled. They diverge under load and replay, so windows, watermarks, and late-event policies are essential. Joins in streams need state and a time bound; fault tolerance needs checkpoints and exactly-once or idempotent sinks. The result is a system where derived views are continuously maintained rather than periodically rebuilt.",
          ],
          bullets: [
            "Streams are unbounded; processing must handle never-ending input",
            "Log-based brokers retain ordered history and support replay",
            "CDC turns database changes into events, avoiding dual writes",
            "Event sourcing makes the event log the source of truth and state a derived view",
            "Event time and processing time diverge; use watermarks and late-event policies",
            "Exactly-once needs checkpoints plus idempotent or transactional sinks",
          ],
          steps: [
            {
              title: "Capture changes",
              detail: "Use a database trigger or an outbox table to publish every insert and update to a stream. Include the row key and version.",
            },
            {
              title: "Aggregate in windows",
              detail: "Compute a one-minute tumbling count per key. Compare event time with processing time and emit window results.",
            },
            {
              title: "Handle late events",
              detail: "Delay an event past its window and decide whether to drop, retract, or update the result. Document the policy.",
            },
          ],
          takeaway: "Treat streams as replayable logs of events, separate event time from processing time, and make sinks idempotent so failures do not duplicate effects.",
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
                label: "Capture changes",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Aggregate in windows",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Handle late events",
                emphasis: true,
              },
            ],
            title: "How Stream Processing and Change Data Capture works",
          },
          quiz: {
            question: "Why is change data capture safer than application-level dual writes?",
            options: [
              "It guarantees lower latency than any database",
              "It derives one ordered change stream from the database log, avoiding two writes that can diverge",
              "It removes the need for a primary key",
              "It makes the database strongly consistent across regions",
            ],
            correctIndex: 1,
            explanation: "Dual writes can partially fail, leaving the database and downstream system inconsistent. CDC reads the database's own ordered log so downstream views follow the committed history.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Stream Processing and Change Data Capture”?",
              options: [
                "Streams are unbounded; processing must handle never-ending input",
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Streams are unbounded; processing must handle never-ending input”",
            },
            {
              question: "Which statement best explains “Event time vs processing time”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "Event time is when the event occurred; processing time is when the system handles it. They differ under load, replay, and late arrival.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Event time is when the event occurred; processing time is when the system handles it. They differ under load, replay, and late arrival.”",
            },
            {
              question: "Which of these is a hands-on step in “Stream Processing and Change Data Capture”?",
              options: [
                "Add observability",
                "Make a safe change",
                "Write the runbook",
                "Capture changes",
              ],
              correctIndex: 3,
              explanation: "“Capture changes” is part of this lesson's sequence: Use a database trigger or an outbox table to publish every insert and update to a stream. Include the row key and version.",
            },
            {
              question: "What does the hands-on step “Aggregate in windows” involve?",
              options: [
                "Compute a one-minute tumbling count per key. Compare event time with processing time and emit window results.",
                "Create a people table and a friendships edge table in SQL. Insert a small social graph with at least two cycles.",
                "Express the same traversal in a graph query language or library. Compare readability, query length, and execution plan.",
                "Write a recursive query for friends-of-friends up to depth three. Deduplicate paths and show the depth of each result.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Aggregate in windows” as: Compute a one-minute tumbling count per key. Compare event time with processing time and emit window results.",
            },
          ],
          flashcards: [
            {
              front: "Change data capture (CDC)",
              back: "Extracting a database's committed changes as an ordered event stream so downstream systems can stay in sync without dual writes.",
            },
            {
              front: "Watermark",
              back: "A signal that no events earlier than a certain event time are expected, allowing a streaming engine to close a window and emit results.",
            },
            {
              front: "Event time vs processing time",
              back: "Event time is when the event occurred; processing time is when the system handles it. They differ under load, replay, and late arrival.",
            },
            {
              front: "How do you aggregate in windows?",
              back: "Compute a one-minute tumbling count per key. Compare event time with processing time and emit window results.",
            },
            {
              front: "How do you capture changes?",
              back: "Use a database trigger or an outbox table to publish every insert and update to a stream. Include the row key and version.",
            },
          ],
          sourceRef: {
            label: "Chapter 11: Stream Processing — Messaging, CDC, Event Sourcing, and Time",
            pageStart: null,
            pageEnd: null,
            note: "Event streams, brokers and logs, CDC, event sourcing, stream joins, event/processing time, watermarks, and fault tolerance.",
            sectionIndexes: [
              42,
              43,
              44,
              45,
            ],
          },
          estimatedMinutes: 7,
        },
        {
          title: "The Future of Data Systems: Integration and Correctness",
          objective: "Combine specialized systems into correct derived-data pipelines without sacrificing integrity.",
          hook: "The future is not one database to rule them all. It is many specialized systems composed so their differences cannot silently corrupt the whole.",
          paragraphs: [
            "Modern applications combine databases, caches, search indexes, and warehouses. Data integration is the discipline of deriving one system's state from another through an explicit dataflow rather than ad-hoc dual writes. Unbundling the database means composing storage engines, indexes, and materialized views as separate services — powerful, but only if the dependencies are visible. Derived data should record how it was produced, and consumers should be able to rebuild it from the source of truth.",
            "Correctness in such systems depends on the end-to-end argument: a guarantee is only as strong as the weakest link. Enforcing constraints in one component does not help if another component can bypass it. Timeliness and integrity are separate goals: timeliness means seeing data soon, integrity means never losing or corrupting it. Trust-but-verify means auditing derived data against its source. Finally, predictive analytics and privacy are design constraints, not afterthoughts: data collection has consequences for the people in it.",
          ],
          bullets: [
            "Data integration derives one system's state from another through an explicit dataflow",
            "Unbundling a database means composing storage, indexes, and views as services",
            "Derived data should be rebuildable from an authoritative source",
            "The end-to-end argument: a guarantee is only as strong as the weakest component",
            "Timeliness and integrity are different goals; optimize them separately",
            "Trust-but-verify auditing and privacy constraints belong in the design",
          ],
          steps: [
            {
              title: "Build an end-to-end pipeline",
              detail: "Ingest events, store them, derive a materialized view, and serve it through an API. Use idempotency keys at every stage.",
            },
            {
              title: "Add an audit log",
              detail: "Record the input event, the transformation version, and the output for every derived row. Make the derivation replayable.",
            },
            {
              title: "Inject a failure",
              detail: "Crash a consumer mid-batch and restart it. Verify the materialized view is correct and no event is applied twice.",
            },
          ],
          takeaway: "Build systems as explicit, auditable dataflows from authoritative sources to derived views, and treat integrity and privacy as end-to-end properties.",
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
                label: "Build an end-to-end pipeline",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Add an audit log",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Inject a failure",
                emphasis: true,
              },
            ],
            title: "How The Future of Data Systems: Integration and Correctness works",
          },
          quiz: {
            question: "What does the end-to-end argument imply for a data pipeline?",
            options: [
              "The fastest component determines overall latency",
              "A guarantee holds only if every component along the path preserves it",
              "The database is always the source of truth",
              "Derived data never needs to be rebuilt",
            ],
            correctIndex: 1,
            explanation: "End-to-end correctness is limited by the weakest link. If any component drops, duplicates, or reorders data, the final guarantee is weaker regardless of stronger components elsewhere.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “The Future of Data Systems: Integration and Correctness”?",
              options: [
                "Fault = one part deviates from spec; failure = the system as a whole stops providing service",
                "Data integration derives one system's state from another through an explicit dataflow",
                "Scalability describes what happens when a specific load parameter grows, not whether a system 'is scalable'",
                "Operability: monitoring, automation, documentation, and predictable operations",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Data integration derives one system's state from another through an explicit dataflow”",
            },
            {
              question: "Which statement best explains “Derived data”?",
              options: [
                "A fault is a component deviating from its specification; a failure is the whole system no longer providing the required service to users.",
                "A number that describes current demand on a system — requests per second, read/write ratio, active users, cache hit rate, or fan-out — used to ask what happens as it grows.",
                "Data produced by transforming other data — indexes, caches, materialized views, aggregates — which should be rebuildable from its authoritative source.",
                "Operability (easy to run), simplicity (easy to understand), and evolvability (easy to change).",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Data produced by transforming other data — indexes, caches, materialized views, aggregates — which should be rebuildable from its authoritative source.”",
            },
            {
              question: "Which of these is a hands-on step in “The Future of Data Systems: Integration and Correctness”?",
              options: [
                "Test a clock jump",
                "Partition the cluster",
                "Run a consensus cluster",
                "Build an end-to-end pipeline",
              ],
              correctIndex: 3,
              explanation: "“Build an end-to-end pipeline” is part of this lesson's sequence: Ingest events, store them, derive a materialized view, and serve it through an API. Use idempotency keys at every stage.",
            },
            {
              question: "What does the hands-on step “Add an audit log” involve?",
              options: [
                "Record the input event, the transformation version, and the output for every derived row. Make the derivation replayable.",
                "Rename a required field or change its type and observe the failure. Document which changes are safe and which are breaking.",
                "Publish events from one service to a queue and consume them in another. Include an event id and timestamp.",
                "Send events out of order and add a sequence check or reordering buffer. Show how the consumer copes with a late event.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add an audit log” as: Record the input event, the transformation version, and the output for every derived row. Make the derivation replayable.",
            },
          ],
          flashcards: [
            {
              front: "Trust-but-verify in data systems",
              back: "Continuously audit derived data against its source of truth rather than assuming the pipeline preserved correctness.",
            },
            {
              front: "Derived data",
              back: "Data produced by transforming other data — indexes, caches, materialized views, aggregates — which should be rebuildable from its authoritative source.",
            },
            {
              front: "Timeliness vs integrity",
              back: "Timeliness is how quickly data reflects reality; integrity is whether data is complete and uncorrupted. A system can be timely but wrong, or correct but stale.",
            },
            {
              front: "How do you add an audit log?",
              back: "Record the input event, the transformation version, and the output for every derived row. Make the derivation replayable.",
            },
            {
              front: "How do you build an end-to-end pipeline?",
              back: "Ingest events, store them, derive a materialized view, and serve it through an API. Use idempotency keys at every stage.",
            },
          ],
          sourceRef: {
            label: "Chapter 12: The Future of Data Systems — Integration, Correctness, and Privacy",
            pageStart: null,
            pageEnd: null,
            note: "Data integration, unbundling databases, derived data, the end-to-end argument, timeliness versus integrity, auditing, and privacy.",
            sectionIndexes: [
              46,
              47,
              48,
              49,
            ],
          },
          estimatedMinutes: 7,
        },
      ],
    },
  ],
};
