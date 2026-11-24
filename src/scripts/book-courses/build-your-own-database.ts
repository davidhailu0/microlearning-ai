import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const dbCourse: DraftCourse = {
  title: "Build Your Own Database",
  description: "Implement a minimal relational database from scratch: a storage engine with SSTables and LSM-trees, a WAL for durability, a B+-tree index for point queries, a query executor with SQL parsing, and a simple server interface. Learn how database systems actually store and retrieve data.",
  category: "Systems",
  level: "intermediate",
  coverEmoji: "💾",
  tags: [
    "database",
    "storage-engine",
    "B-tree",
    "LSM",
    "SSTable",
  ],
  modules: [
    {
      title: "Storage Engine: SSTables and LSM-trees",
      summary: "Implement immutable SSTables and the LSM-tree structure for write-heavy workloads.",
      lessons: [
        {
          title: "Writing SSTables",
          objective: "Implement an immutable key-value map on disk using Sorted String Tables (SSTables).",
          hook: "SSTables are the immutable building blocks of the LSM-tree storage engine.",
          paragraphs: [
            "An SSTable is an immutable on-disk key-value store where keys are sorted. Data is written in blocks; each block has an offset and a filter (e.g., bloom filter). You'll implement writing SSTables to disk and reading from them, with support for seek operations by key.",
          ],
          bullets: [
            "Keys are strictly sorted within each SSTable",
            "Data is written in blocks with offsets for seek",
            "Each block can have a bloom filter for fast non-existence checks",
            "Implement compaction: merge and purge obsolete SSTables",
          ],
          steps: [
            {
              title: "Set up the project",
              detail: "Pick a language with file I/O and a test runner (Go, Rust, or Python). Create src/, tests/, and one command that runs the suite. Keep a tiny key-value API (put, get, scan) as the seam every lesson plugs into.",
            },
            {
              title: "Choose the file layout",
              detail: "Write a header, then sorted key-value blocks, then a block-offset table, then a bloom filter. Every block records its offset and length.",
            },
            {
              title: "Write sorted entries",
              detail: "Buffer entries in memory, sort by key, and flush blocks of a fixed size. Reject duplicate keys or keep only the newest value.",
            },
            {
              title: "Implement point lookup",
              detail: "Check the bloom filter first, binary-search the offset table, read the block, and binary-search within it. Return not-found cleanly.",
            },
            {
              title: "Implement a range scan",
              detail: "Seek to the first key >= start, then read blocks sequentially, yielding entries until the end key.",
            },
            {
              title: "Test persistence",
              detail: "Write 10,000 random keys, close the file, reopen it, and verify every key and a sample of ranges. Corrupt one offset and confirm the reader fails loudly.",
            },
          ],
          takeaway: "SSTables provide efficient immutably stored key-value pairs; compaction keeps the store from growing unboundedly.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "blm",
                from: "sstable",
                label: "contains",
              },
              {
                to: "blk",
                from: "sstable",
                label: "contains",
              },
              {
                to: "off",
                from: "blk",
                label: "offset within file",
              },
            ],
            nodes: [
              {
                id: "sstable",
                label: "SSTable (on disk)",
                emphasis: true,
              },
              {
                id: "blm",
                label: "bloom filter",
                emphasis: true,
              },
              {
                id: "blk",
                label: "data block",
                emphasis: true,
              },
              {
                id: "off",
                label: "file offset",
                emphasis: true,
              },
            ],
            title: "SSTable structure",
          },
          quiz: {
            question: "What makes SSTables immutable?",
            options: [
              "Data is written once and never modified",
              "Data is compressed automatically",
              "Data is encrypted by default",
              "Data is replicated across nodes",
            ],
            correctIndex: 0,
            explanation: "SSTables are write-once: new data is written to new SSTables; old ones are merged during compaction.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Writing SSTables”?",
              options: [
                "Keys are strictly sorted within each SSTable",
                "Memtable buffers writes in memory (e.g., skiplist)",
                "Internal nodes: keys route search downward to child subtrees",
                "Parse SQL: SELECT, FROM, WHERE clauses",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Keys are strictly sorted within each SSTable”",
            },
            {
              question: "Which statement best explains “SSTable”?",
              options: [
                "In-memory write buffer; flushed to disk as SSTable when full",
                "Sorted String Table; immutable on-disk key-value store with sorted keys",
                "Data only at leaves; internal nodes route; leaves linked for range scans",
                "Decision of which storage structures to scan and how to filter",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Sorted String Table; immutable on-disk key-value store with sorted keys”",
            },
            {
              question: "Which of these is a hands-on step in “Writing SSTables”?",
              options: [
                "Define the node layout",
                "Implement search",
                "Implement insertion with splits",
                "Choose the file layout",
              ],
              correctIndex: 3,
              explanation: "“Choose the file layout” is part of this lesson's sequence: Write a header, then sorted key-value blocks, then a block-offset table, then a bloom filter. Every block records its offset and length.",
            },
            {
              question: "What does the hands-on step “Write sorted entries” involve?",
              options: [
                "Buffer entries in memory, sort by key, and flush blocks of a fixed size. Reject duplicate keys or keep only the newest value.",
                "Use fixed-size pages with a header (leaf/internal, key count), sorted keys, and either child pointers or values. Pick an order that fits a page.",
                "Binary-search keys in each internal node, descend to the correct child, and binary-search the leaf. Return the value or a clean miss.",
                "Insert into the leaf in sorted order. When it overflows, split it, promote the middle key to the parent, and split parents recursively up to a new root.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Write sorted entries” as: Buffer entries in memory, sort by key, and flush blocks of a fixed size. Reject duplicate keys or keep only the newest value.",
            },
          ],
          flashcards: [
            {
              front: "Compaction",
              back: "Merges multiple SSTables, discards deleted keys, frees space",
            },
            {
              front: "SSTable",
              back: "Sorted String Table; immutable on-disk key-value store with sorted keys",
            },
            {
              front: "How do you choose the file layout?",
              back: "Write a header, then sorted key-value blocks, then a block-offset table, then a bloom filter. Every block records its offset and length.",
            },
            {
              front: "How do you write sorted entries?",
              back: "Buffer entries in memory, sort by key, and flush blocks of a fixed size. Reject duplicate keys or keep only the newest value.",
            },
            {
              front: "How do you implement point lookup?",
              back: "Check the bloom filter first, binary-search the offset table, read the block, and binary-search within it. Return not-found cleanly.",
            },
          ],
          sourceRef: {
            label: "SSTable",
            pageStart: null,
            pageEnd: null,
            note: "Immutable sorted key-value file; blocks with offsets; bloom filters; compaction merges SSTables",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "LSM-Tree and Memtable",
      summary: "Implement the in-memory Memtable and the on-disk LSM-tree structure.",
      lessons: [
        {
          title: "Memtable: In-Memory Write Buffer",
          objective: "Implement a Memtable that buffers writes in memory before flushing to disk as an SSTable.",
          hook: "The Memtable is the write-optimized layer that absorbs all incoming writes.",
          paragraphs: [
            "All incoming writes (inserts/updates) first go to a Memtable, an in-memory balanced tree (e.g., skiplist or AVL). When the Memtable reaches a size threshold, it is flushed as an immutable SSTable to disk, and a new Memtable is created. This write-path is lock-free and very fast.",
          ],
          bullets: [
            "Memtable buffers writes in memory (e.g., skiplist)",
            "Flush to disk as SSTable when size threshold reached",
            "New Memtable created after flush; write path is lock-free",
            "Reads check Memtable first, then immutable SSTables on disk",
          ],
          steps: [
            {
              title: "Use a sorted in-memory map",
              detail: "Store writes in a balanced tree or sorted map keyed by the user key. Each entry carries a sequence number so newer writes win.",
            },
            {
              title: "Add a write-ahead log",
              detail: "Append every write to a WAL and fsync before acknowledging. On startup, replay the WAL to rebuild the memtable after a crash.",
            },
            {
              title: "Flush at a threshold",
              detail: "When the memtable exceeds a size limit, freeze it, write a new SSTable, and swap in an empty memtable without blocking reads.",
            },
            {
              title: "Merge reads across levels",
              detail: "Check the active memtable, then immutable memtables, then newest to oldest SSTables. Return the first hit by sequence number.",
            },
            {
              title: "Test crash recovery",
              detail: "Kill the process after writing but before flushing, restart, and confirm the WAL restores every acknowledged key exactly once.",
            },
          ],
          takeaway: "The Memtable + SSTable combination gives write throughput far exceeding read latency.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "mem",
                from: "write",
                label: "goes to Memtable",
              },
              {
                to: "flush",
                from: "mem",
                label: "when full",
              },
              {
                to: "disk",
                from: "flush",
                label: "as SSTable",
              },
            ],
            nodes: [
              {
                id: "write",
                label: "client write",
                emphasis: true,
              },
              {
                id: "mem",
                label: "Memtable (in-memory)",
                emphasis: true,
              },
              {
                id: "flush",
                label: "flush → SSTable",
                emphasis: true,
              },
              {
                id: "disk",
                label: "immutable SSTables",
                emphasis: true,
              },
            ],
            title: "LSM-tree write path",
          },
          quiz: {
            question: "What happens when the Memtable reaches its size limit?",
            options: [
              "Writes are rejected until space frees up",
              "The Memtable is flushed to disk as an SSTable, and a new one is created",
              "The oldest SSTable is deleted",
              "The database switches to read-only mode",
            ],
            correctIndex: 1,
            explanation: "The Memtable is flushed as an immutable SSTable; a new empty Memtable begins receiving writes.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Memtable: In-Memory Write Buffer”?",
              options: [
                "Keys are strictly sorted within each SSTable",
                "Memtable buffers writes in memory (e.g., skiplist)",
                "Internal nodes: keys route search downward to child subtrees",
                "Parse SQL: SELECT, FROM, WHERE clauses",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Memtable buffers writes in memory (e.g., skiplist)”",
            },
            {
              question: "Which statement best explains “Memtable”?",
              options: [
                "Sorted String Table; immutable on-disk key-value store with sorted keys",
                "Data only at leaves; internal nodes route; leaves linked for range scans",
                "In-memory write buffer; flushed to disk as SSTable when full",
                "Decision of which storage structures to scan and how to filter",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “In-memory write buffer; flushed to disk as SSTable when full”",
            },
            {
              question: "Which of these is a hands-on step in “Memtable: In-Memory Write Buffer”?",
              options: [
                "Define the node layout",
                "Implement search",
                "Implement insertion with splits",
                "Use a sorted in-memory map",
              ],
              correctIndex: 3,
              explanation: "“Use a sorted in-memory map” is part of this lesson's sequence: Store writes in a balanced tree or sorted map keyed by the user key. Each entry carries a sequence number so newer writes win.",
            },
            {
              question: "What does the hands-on step “Add a write-ahead log” involve?",
              options: [
                "Append every write to a WAL and fsync before acknowledging. On startup, replay the WAL to rebuild the memtable after a crash.",
                "Use fixed-size pages with a header (leaf/internal, key count), sorted keys, and either child pointers or values. Pick an order that fits a page.",
                "Binary-search keys in each internal node, descend to the correct child, and binary-search the leaf. Return the value or a clean miss.",
                "Insert into the leaf in sorted order. When it overflows, split it, promote the middle key to the parent, and split parents recursively up to a new root.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add a write-ahead log” as: Append every write to a WAL and fsync before acknowledging. On startup, replay the WAL to rebuild the memtable after a crash.",
            },
          ],
          flashcards: [
            {
              front: "Memtable",
              back: "In-memory write buffer; flushed to disk as SSTable when full",
            },
            {
              front: "LSM-tree",
              back: "Log-Structured Merge-tree: Memtable → immutable SSTables on disk",
            },
            {
              front: "How do you use a sorted in-memory map?",
              back: "Store writes in a balanced tree or sorted map keyed by the user key. Each entry carries a sequence number so newer writes win.",
            },
            {
              front: "How do you add a write-ahead log?",
              back: "Append every write to a WAL and fsync before acknowledging. On startup, replay the WAL to rebuild the memtable after a crash.",
            },
            {
              front: "How do you flush at a threshold?",
              back: "When the memtable exceeds a size limit, freeze it, write a new SSTable, and swap in an empty memtable without blocking reads.",
            },
          ],
          sourceRef: {
            label: "Memtable",
            pageStart: null,
            pageEnd: null,
            note: "In-memory buffer (skiplist/AVL); flushes to disk as SSTable when full",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "B+-Tree Index for Point Queries",
      summary: "Implement a B+-tree index that accelerates key lookups across the stored data.",
      lessons: [
        {
          title: "B+-Tree Fundamentals",
          objective: "Implement a B+-tree: internal nodes route queries; leaf nodes contain data pointers or actual data.",
          hook: "The B+-tree is the classic index structure for database storage engines.",
          paragraphs: [
            "A B+-tree is a balanced tree where internal nodes contain only keys for routing, and leaf nodes contain all keys and associated data pointers (or data). All leaves are at the same depth, and leaves are linked forming a sorted list. This structure supports efficient point queries (single key lookup) and range scans.",
          ],
          bullets: [
            "Internal nodes: keys route search downward to child subtrees",
            "Leaf nodes: contain keys and data pointers; linked list for range scans",
            "All leaves at same depth ensures uniform query performance",
            "Node split: when a node is full, promote median key to parent",
          ],
          steps: [
            {
              title: "Define the node layout",
              detail: "Use fixed-size pages with a header (leaf/internal, key count), sorted keys, and either child pointers or values. Pick an order that fits a page.",
            },
            {
              title: "Implement search",
              detail: "Binary-search keys in each internal node, descend to the correct child, and binary-search the leaf. Return the value or a clean miss.",
            },
            {
              title: "Implement insertion with splits",
              detail: "Insert into the leaf in sorted order. When it overflows, split it, promote the middle key to the parent, and split parents recursively up to a new root.",
            },
            {
              title: "Implement range scans",
              detail: "Find the starting leaf, then follow sibling pointers to the end key. Confirm the scan returns keys in order with no duplicates.",
            },
            {
              title: "Stress the tree",
              detail: "Insert 100,000 sequential and random keys, then verify every lookup and a full ordered scan. Check tree height stays logarithmic.",
            },
          ],
          takeaway: "The B+-tree reduces disk I/O for point queries to O(log n) and supports efficient range scans via the leaf-level linked list.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "internal",
                from: "root",
                label: "routes to",
              },
              {
                to: "leaf",
                from: "internal",
                label: "routes to",
              },
              {
                to: "ptr",
                from: "leaf",
                label: "points to data",
              },
              {
                to: "leaf_next",
                from: "leaf",
                label: "links to next leaf",
              },
            ],
            nodes: [
              {
                id: "root",
                label: "root node",
                emphasis: true,
              },
              {
                id: "internal",
                label: "internal node",
                emphasis: true,
              },
              {
                id: "leaf",
                label: "leaf node",
                emphasis: true,
              },
              {
                id: "ptr",
                label: "data pointer",
                emphasis: true,
              },
            ],
            title: "B+-tree structure",
          },
          quiz: {
            question: "What distinguishes a B+-tree from a B-tree?",
            options: [
              "B+-tree stores data only in leaf nodes; internal nodes route only",
              "B+-tree does not support range queries",
              "B+-tree has higher height than B-tree",
              "B+-tree does not allow duplicate keys",
            ],
            correctIndex: 0,
            explanation: "In a B+-tree, data (or pointers to data) appears only at the leaf level; internal nodes hold only keys for routing.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “B+-Tree Fundamentals”?",
              options: [
                "Keys are strictly sorted within each SSTable",
                "Memtable buffers writes in memory (e.g., skiplist)",
                "Internal nodes: keys route search downward to child subtrees",
                "Parse SQL: SELECT, FROM, WHERE clauses",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Internal nodes: keys route search downward to child subtrees”",
            },
            {
              question: "Which statement best explains “B+-tree”?",
              options: [
                "Sorted String Table; immutable on-disk key-value store with sorted keys",
                "In-memory write buffer; flushed to disk as SSTable when full",
                "Decision of which storage structures to scan and how to filter",
                "Data only at leaves; internal nodes route; leaves linked for range scans",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Data only at leaves; internal nodes route; leaves linked for range scans”",
            },
            {
              question: "Which of these is a hands-on step in “B+-Tree Fundamentals”?",
              options: [
                "Plan the statement",
                "Test end to end",
                "Tokenize SQL",
                "Define the node layout",
              ],
              correctIndex: 3,
              explanation: "“Define the node layout” is part of this lesson's sequence: Use fixed-size pages with a header (leaf/internal, key count), sorted keys, and either child pointers or values. Pick an order that fits a page.",
            },
            {
              question: "What does the hands-on step “Implement search” involve?",
              options: [
                "Binary-search keys in each internal node, descend to the correct child, and binary-search the leaf. Return the value or a clean miss.",
                "Create a PC register and a 256-word instruction memory. Fetch the word at PC, then increment PC by 1 (or 2 bytes) before decode.",
                "Split the fetched word into opcode, destination register, source register, and immediate. Drive the register file and ALU from those fields.",
                "Append every write to a WAL and fsync before acknowledging. On startup, replay the WAL to rebuild the memtable after a crash.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Implement search” as: Binary-search keys in each internal node, descend to the correct child, and binary-search the leaf. Return the value or a clean miss.",
            },
          ],
          flashcards: [
            {
              front: "B+-tree",
              back: "Data only at leaves; internal nodes route; leaves linked for range scans",
            },
            {
              front: "Node split",
              back: "When a node fills up, promote median key upward",
            },
            {
              front: "How do you implement search?",
              back: "Binary-search keys in each internal node, descend to the correct child, and binary-search the leaf. Return the value or a clean miss.",
            },
            {
              front: "How do you implement insertion with splits?",
              back: "Insert into the leaf in sorted order. When it overflows, split it, promote the middle key to the parent, and split parents recursively up to a new root.",
            },
            {
              front: "How do you define the node layout?",
              back: "Use fixed-size pages with a header (leaf/internal, key count), sorted keys, and either child pointers or values. Pick an order that fits a page.",
            },
          ],
          sourceRef: {
            label: "B+-tree",
            pageStart: null,
            pageEnd: null,
            note: "Internal: route; Leaf: keys + data ptrs; linked list; O(log n) point query",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Query Execution and SQL",
      summary: "Implement a minimal SQL parser and query executor: SELECT, INSERT, CREATE TABLE.",
      lessons: [
        {
          title: "SQL Parsing and Planning",
          objective: "Implement a minimal SQL parser that produces a query plan (scan + filter).",
          hook: "The query executor takes a parsed SQL statement and executes it against the storage engine.",
          paragraphs: [
            "You'll implement a simple SQL parser for SELECT... FROM... WHERE that parses the statement into a parse tree, applies predicate filtering, and produces an execution plan. The executor then runs the plan: scan the relevant SSTables/B-trees, evaluate the WHERE clause predicate, and return matching rows.",
          ],
          bullets: [
            "Parse SQL: SELECT, FROM, WHERE clauses",
            "Produce a query plan: which storage engine to scan",
            "Execute plan: read from Memtable + SSTables, evaluate predicates",
            "Return result rows matching all conditions",
          ],
          steps: [
            {
              title: "Tokenize SQL",
              detail: "Split input into keywords, identifiers, numbers, strings, operators, and punctuation. Preserve positions so syntax errors can point at the offending token.",
            },
            {
              title: "Parse into an AST",
              detail: "Support `CREATE TABLE`, `INSERT`, and `SELECT... FROM... WHERE`. Use recursive descent with clear precedence for AND/OR and comparisons.",
            },
            {
              title: "Plan the statement",
              detail: "Turn the AST into iterators: table scan, filter, projection. Choose an index scan when the WHERE clause matches an indexed column.",
            },
            {
              title: "Execute and return rows",
              detail: "Pull rows through the iterator tree, apply the filter, project the requested columns, and print a table. Handle NULLs and type mismatches explicitly.",
            },
            {
              title: "Test end to end",
              detail: "Create a table, insert rows, run filtered and unfiltered selects, and verify output order and values. Add a syntax-error test that returns a useful message.",
            },
          ],
          takeaway: "Query execution bridges the high-level SQL language and the low-level storage engine.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "parse",
                from: "sql",
                label: "input",
              },
              {
                to: "plan",
                from: "parse",
                label: "produces plan",
              },
              {
                to: "exec",
                from: "plan",
                label: "execute",
              },
              {
                to: "rows",
                from: "exec",
                label: "returns results",
              },
            ],
            nodes: [
              {
                id: "sql",
                label: "SQL statement",
                emphasis: true,
              },
              {
                id: "parse",
                label: "parser",
                emphasis: true,
              },
              {
                id: "plan",
                label: "query plan",
                emphasis: true,
              },
              {
                id: "exec",
                label: "executor",
                emphasis: true,
              },
              {
                id: "rows",
                label: "result rows",
                emphasis: true,
              },
            ],
            title: "Query execution pipeline",
          },
          quiz: {
            question: "What does the query executor do after producing a plan?",
            options: [
              "Returns the plan to the user",
              "Scans storage and evaluates predicates",
              "Writes the plan to disk",
              "Compiles the SQL to C code",
            ],
            correctIndex: 1,
            explanation: "The executor runs the plan: it scans the storage engine structures and filters rows by the WHERE clause.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “SQL Parsing and Planning”?",
              options: [
                "Keys are strictly sorted within each SSTable",
                "Memtable buffers writes in memory (e.g., skiplist)",
                "Internal nodes: keys route search downward to child subtrees",
                "Parse SQL: SELECT, FROM, WHERE clauses",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Parse SQL: SELECT, FROM, WHERE clauses”",
            },
            {
              question: "Which statement best explains “Query plan”?",
              options: [
                "Decision of which storage structures to scan and how to filter",
                "Sorted String Table; immutable on-disk key-value store with sorted keys",
                "In-memory write buffer; flushed to disk as SSTable when full",
                "Data only at leaves; internal nodes route; leaves linked for range scans",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Decision of which storage structures to scan and how to filter”",
            },
            {
              question: "Which of these is a hands-on step in “SQL Parsing and Planning”?",
              options: [
                "Define the node layout",
                "Implement search",
                "Implement insertion with splits",
                "Tokenize SQL",
              ],
              correctIndex: 3,
              explanation: "“Tokenize SQL” is part of this lesson's sequence: Split input into keywords, identifiers, numbers, strings, operators, and punctuation. Preserve positions so syntax errors can point at the offending token.",
            },
            {
              question: "What does the hands-on step “Parse into an AST” involve?",
              options: [
                "Support `CREATE TABLE`, `INSERT`, and `SELECT... FROM... WHERE`. Use recursive descent with clear precedence for AND/OR and comparisons.",
                "Use fixed-size pages with a header (leaf/internal, key count), sorted keys, and either child pointers or values. Pick an order that fits a page.",
                "Binary-search keys in each internal node, descend to the correct child, and binary-search the leaf. Return the value or a clean miss.",
                "Insert into the leaf in sorted order. When it overflows, split it, promote the middle key to the parent, and split parents recursively up to a new root.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Parse into an AST” as: Support `CREATE TABLE`, `INSERT`, and `SELECT... FROM... WHERE`. Use recursive descent with clear precedence for AND/OR and comparisons.",
            },
          ],
          flashcards: [
            {
              front: "Query plan",
              back: "Decision of which storage structures to scan and how to filter",
            },
            {
              front: "Predicate",
              back: "A condition (e.g., WHERE col = 5) that filters rows",
            },
            {
              front: "How do you tokenize SQL?",
              back: "Split input into keywords, identifiers, numbers, strings, operators, and punctuation. Preserve positions so syntax errors can point at the offending token.",
            },
            {
              front: "How do you plan the statement?",
              back: "Turn the AST into iterators: table scan, filter, projection. Choose an index scan when the WHERE clause matches an indexed column.",
            },
            {
              front: "How do you parse into an AST?",
              back: "Support `CREATE TABLE`, `INSERT`, and `SELECT... FROM... WHERE`. Use recursive descent with clear precedence for AND/OR and comparisons.",
            },
          ],
          sourceRef: {
            label: "Query execution",
            pageStart: null,
            pageEnd: null,
            note: "Parse SQL → plan → executor scans storage → filtered results",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Capstone: From Toy Engine to Transactional Database",
      summary: "Durability, isolation, compaction policy, query planning, and the wire protocol that turn a storage demo into a usable database.",
      lessons: [
        {
          title: "Capstone: WAL, Transactions, Compaction, and the Server",
          objective: "Implement the pieces a minimal database needs before it can safely store real data: a write-ahead log, atomic transactions, compaction, a query planner, and a client protocol.",
          hook: "Your LSM-tree can store a key. A database also has to survive a crash halfway through a write and tell a client exactly what happened.",
          paragraphs: [
            "Durability starts with the write-ahead log. Before a write touches the memtable, append a record containing the operation, key, value, and a checksum to an append-only log, then fsync it when the transaction commits. On restart, replay the log from the last checkpoint so committed writes survive and uncommitted tail records are discarded. Group commit batches several transactions into one fsync; that is the difference between a correct design and one that collapses under concurrent writes.",
            "Atomicity and isolation build on that log. A transaction buffers its writes, writes one commit record, and only then makes them visible. Snapshot isolation gives each transaction a consistent read view, usually by keeping multiple versions of a key (MVCC); a write conflict is detected when two transactions modify the same key from the same snapshot. The alternative, serial execution, is simpler and surprisingly competitive when transactions are short.",
            "Compaction is a policy, not a single merge. Tiered compaction optimizes write throughput by merging similarly sized runs; leveled compaction bounds read amplification by keeping non-overlapping sorted runs per level. Tombstones must survive until every older version is gone, or deleted data reappears. Above the storage engine, a planner turns SQL into a logical plan, chooses an index or scan, and the executor pulls rows through iterators. A small server then frames requests and responses so clients can connect over a socket.",
          ],
          bullets: [
            "Append to the WAL and fsync before acknowledging a commit; replay from the last checkpoint on startup",
            "Group commit amortizes fsync cost across concurrent transactions",
            "Snapshots plus MVCC provide consistent reads; detect write-write conflicts before commit",
            "Tiered compaction favors writes, leveled compaction bounds read amplification",
            "Keep tombstones until all older versions are compacted away",
            "A planner chooses access paths; an executor streams rows through iterators",
          ],
          steps: [
            {
              title: "Add a WAL record format",
              detail: "Write length, checksum, transaction id, operation, key, and value. Reject torn tail records during recovery.",
            },
            {
              title: "Make commit atomic",
              detail: "Buffer writes, append one commit marker, fsync, then publish the new memtable entries to readers.",
            },
            {
              title: "Implement snapshot reads",
              detail: "Tag each version with a sequence number and let a transaction read the newest version at or below its snapshot.",
            },
            {
              title: "Choose a compaction policy",
              detail: "Start with size-tiered runs and measure read amplification; move hot levels to leveled compaction if reads dominate.",
            },
            {
              title: "Plan a simple query",
              detail: "Parse SELECT ... WHERE key = ?, prefer a point lookup through the B+-tree, and fall back to a full scan otherwise.",
            },
            {
              title: "Expose a framed protocol",
              detail: "Send a request id, statement, and parameters; return a status, row count, and rows so a client can match responses.",
            },
            {
              title: "Run the finished artifact",
              detail: "Start the server, create a table, insert rows, commit a transaction, kill the process, restart, and verify committed rows survive. Run a point lookup and a range scan against the same data.",
            },
          ],
          takeaway: "A database becomes trustworthy when the WAL makes commits durable, snapshots and conflict checks make them isolated, compaction bounds read cost, and a planner plus protocol turn storage into a usable service.",
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
                label: "Add a WAL record format",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Make commit atomic",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Implement snapshot reads",
                emphasis: false,
              },
              {
                id: "step-4",
                label: "Expose a framed protocol",
                emphasis: true,
              },
            ],
            title: "How Capstone: WAL, Transactions, Compaction, and the Server works",
          },
          quiz: {
            question: "When must a write-ahead log record be durable?",
            options: [
              "Before the transaction is acknowledged as committed",
              "Only when the memtable is full",
              "After the next compaction finishes",
              "When the client disconnects",
            ],
            correctIndex: 0,
            explanation: "The commit acknowledgement is a promise. The WAL record must be on stable storage before that promise is made, otherwise a crash can lose an acknowledged transaction.",
          },
          extraQuestions: [
            {
              question: "What problem does group commit solve?",
              options: [
                "It removes the need for a WAL",
                "It batches multiple transactions behind one fsync",
                "It makes every transaction serializable",
                "It compresses SSTables automatically",
              ],
              correctIndex: 1,
              explanation: "Fsync is expensive. Group commit waits briefly, writes several commit records, and pays for one flush instead of one per transaction.",
            },
            {
              question: "Why can a tombstone not be discarded immediately?",
              options: [
                "It is needed to encrypt the key",
                "Older versions may still exist in deeper SSTables",
                "Tombstones are required by SQL",
                "It keeps the memtable balanced",
              ],
              correctIndex: 1,
              explanation: "Dropping a tombstone while an older value remains would make deleted data visible again. It can go only after every older version is compacted.",
            },
            {
              question: "What is the main trade-off between tiered and leveled compaction?",
              options: [
                "Tiered favors write throughput; leveled bounds read amplification",
                "Tiered guarantees serializability; leveled does not",
                "Leveled removes the need for bloom filters",
                "Leveled stores data only in memory",
              ],
              correctIndex: 0,
              explanation: "Tiered compaction rewrites less data per write but leaves more overlapping runs to search. Leveled compaction searches fewer runs at the cost of more rewriting.",
            },
            {
              question: "What does a query planner decide?",
              options: [
                "Which access path and join order to use",
                "Which users may log in",
                "How often to fsync the WAL",
                "Which compaction level to delete",
              ],
              correctIndex: 0,
              explanation: "The planner turns a logical query into a physical plan: scans versus index lookups, join order, and where filters are applied.",
            },
          ],
          flashcards: [
            {
              front: "Planner vs executor",
              back: "The planner chooses access paths and join order; the executor streams rows through the chosen operators.",
            },
            {
              front: "Tiered vs leveled compaction",
              back: "Tiered merges similar-sized runs for write throughput; leveled keeps non-overlapping runs per level to bound read amplification.",
            },
            {
              front: "Snapshot isolation",
              back: "Each transaction reads a consistent snapshot; write-write conflicts on the same key are detected before commit.",
            },
            {
              front: "Tombstone",
              back: "A deletion marker that must survive compaction until every older version of the key is gone.",
            },
            {
              front: "Write-ahead log (WAL)",
              back: "Append-only durability log written and fsynced before a commit is acknowledged; replayed from the last checkpoint after a crash.",
            },
          ],
          sourceRef: {
            label: "Build Your Own Database capstone",
            pageStart: null,
            pageEnd: null,
            note: "Complete build path from SSTables through a query-serving database, extended with the durability, transaction, compaction, planning, and protocol pieces a usable engine needs.",
            sectionIndexes: [],
          },
          estimatedMinutes: 12,
        },
      ],
    },
  ],
};
