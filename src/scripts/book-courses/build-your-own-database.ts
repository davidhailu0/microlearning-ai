import type { DraftCourse } from "./types";

/**
 * "Build Your Own Database" — CodeCrafters-style tutorial.
 * Covers: storage engine, B-tree index, write-ahead log, SSTables, LSM-tree,
 * memtable, compaction, query execution, SQL parser, and a minimal relational DB.
 * Typical 20-30 step guided tutorial from the build-your-own-x repo (build-your-own-db).
 */
export const dbCourse: DraftCourse = {
  title: "Build Your Own Database",
  description:
    "Implement a minimal relational database from scratch: a storage engine with SSTables and LSM-trees, a WAL for durability, a B+-tree index for point queries, a query executor with SQL parsing, and a simple server interface. Learn how database systems actually store and retrieve data.",
  category: "Systems",
  level: "intermediate",
  coverEmoji: "💾",
  tags: ["database", "storage-engine", "B-tree", "LSM", "SSTable"],
  modules: [
    {
      title: "Storage Engine: SSTables and LSM-trees",
      summary:
        "Implement immutable SSTables and the LSM-tree structure for write-heavy workloads.",
      lessons: [
        {
          title: "Writing SSTables",
          objective:
            "Implement an immutable key-value map on disk using Sorted String Tables (SSTables).",
          hook:
            "SSTables are the immutable building blocks of the LSM-tree storage engine.",
          paragraphs: [
            "An SSTable is an immutable on-disk key-value store where keys are sorted. Data is written in blocks; each block has an offset and a filter (e.g., bloom filter). You'll implement writing SSTables to disk and reading from them, with support for seek operations by key.",
          ],
          bullets: [
            "Keys are strictly sorted within each SSTable",
            "Data is written in blocks with offsets for seek",
            "Each block can have a bloom filter for fast non-existence checks",
            "Implement compaction: merge and purge obsolete SSTables",
          ],
          takeaway:
            "SSTables provide efficient immutably stored key-value pairs; compaction keeps the store from growing unboundedly.",
          diagram: {
            type: "hierarchy",
            title: "SSTable structure",
            nodes: [
              { id: "sstable", label: "SSTable (on disk)", emphasis: true },
              { id: "blm", label: "bloom filter", emphasis: true },
              { id: "blk", label: "data block", emphasis: true },
              { id: "off", label: "file offset", emphasis: true },
            ],
            edges: [
              { from: "sstable", to: "blm", label: "contains" },
              { from: "sstable", to: "blk", label: "contains" },
              { from: "blk", to: "off", label: "offset within file" },
            ],
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
            explanation:
              "SSTables are write-once: new data is written to new SSTables; old ones are merged during compaction.",
          },
          flashcards: [
            {
              front: "SSTable",
              back:
                "Sorted String Table; immutable on-disk key-value store with sorted keys",
            },
            {
              front: "Compaction",
              back: "Merges multiple SSTables, discards deleted keys, frees space",
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
      summary:
        "Implement the in-memory Memtable and the on-disk LSM-tree structure.",
      lessons: [
        {
          title: "Memtable: In-Memory Write Buffer",
          objective:
            "Implement a Memtable that buffers writes in memory before flushing to disk as an SSTable.",
          hook:
            "The Memtable is the write-optimized layer that absorbs all incoming writes.",
          paragraphs: [
            "All incoming writes (inserts/updates) first go to a Memtable, an in-memory balanced tree (e.g., skiplist or AVL). When the Memtable reaches a size threshold, it is flushed as an immutable SSTable to disk, and a new Memtable is created. This write-path is lock-free and very fast.",
          ],
          bullets: [
            "Memtable buffers writes in memory (e.g., skiplist)",
            "Flush to disk as SSTable when size threshold reached",
            "New Memtable created after flush; write path is lock-free",
            "Reads check Memtable first, then immutable SSTables on disk",
          ],
          takeaway:
            "The Memtable + SSTable combination gives write throughput far exceeding read latency.",
          diagram: {
            type: "process",
            title: "LSM-tree write path",
            nodes: [
              { id: "write", label: "client write", emphasis: true },
              { id: "mem", label: "Memtable (in-memory)", emphasis: true },
              { id: "flush", label: "flush → SSTable", emphasis: true },
              { id: "disk", label: "immutable SSTables", emphasis: true },
            ],
            edges: [
              { from: "write", to: "mem", label: "goes to Memtable" },
              { from: "mem", to: "flush", label: "when full" },
              { from: "flush", to: "disk", label: "as SSTable" },
            ],
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
            explanation:
              "The Memtable is flushed as an immutable SSTable; a new empty Memtable begins receiving writes.",
          },
          flashcards: [
            {
              front: "Memtable",
              back: "In-memory write buffer; flushed to disk as SSTable when full",
            },
            {
              front: "LSM-tree",
              back: "Log-Structured Merge-tree: Memtable → immutable SSTables on disk",
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
      summary:
        "Implement a B+-tree index that accelerates key lookups across the stored data.",
      lessons: [
        {
          title: "B+-Tree Fundamentals",
          objective:
            "Implement a B+-tree: internal nodes route queries; leaf nodes contain data pointers or actual data.",
          hook:
            "The B+-tree is the classic index structure for database storage engines.",
          paragraphs: [
            "A B+-tree is a balanced tree where internal nodes contain only keys for routing, and leaf nodes contain all keys and associated data pointers (or data). All leaves are at the same depth, and leaves are linked forming a sorted list. This structure supports efficient point queries (single key lookup) and range scans.",
          ],
          bullets: [
            "Internal nodes: keys route search downward to child subtrees",
            "Leaf nodes: contain keys and data pointers; linked list for range scans",
            "All leaves at same depth ensures uniform query performance",
            "Node split: when a node is full, promote median key to parent",
          ],
          takeaway:
            "The B+-tree reduces disk I/O for point queries to O(log n) and supports efficient range scans via the leaf-level linked list.",
          diagram: {
            type: "hierarchy",
            title: "B+-tree structure",
            nodes: [
              { id: "root", label: "root node", emphasis: true },
              { id: "internal", label: "internal node", emphasis: true },
              { id: "leaf", label: "leaf node", emphasis: true },
              { id: "ptr", label: "data pointer", emphasis: true },
            ],
            edges: [
              { from: "root", to: "internal", label: "routes to" },
              { from: "internal", to: "leaf", label: "routes to" },
              { from: "leaf", to: "ptr", label: "points to data" },
              { from: "leaf", to: "leaf_next", label: "links to next leaf" },
            ],
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
            explanation:
              "In a B+-tree, data (or pointers to data) appears only at the leaf level; internal nodes hold only keys for routing.",
          },
          flashcards: [
            {
              front: "B+-tree",
              back: "Data only at leaves; internal nodes route; leaves linked for range scans",
            },
            {
              front: "Node split",
              back: "When a node fills up, promote median key upward",
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
      summary:
        "Implement a minimal SQL parser and query executor: SELECT, INSERT, CREATE TABLE.",
      lessons: [
        {
          title: "SQL Parsing and Planning",
          objective:
            "Implement a minimal SQL parser that produces a query plan (scan + filter).",
          hook:
            "The query executor takes a parsed SQL statement and executes it against the storage engine.",
          paragraphs: [
            "You'll implement a simple SQL parser for SELECT ... FROM ... WHERE that parses the statement into a parse tree, applies predicate filtering, and produces an execution plan. The executor then runs the plan: scan the relevant SSTables/B-trees, evaluate the WHERE clause predicate, and return matching rows.",
          ],
          bullets: [
            "Parse SQL: SELECT, FROM, WHERE clauses",
            "Produce a query plan: which storage engine to scan",
            "Execute plan: read from Memtable + SSTables, evaluate predicates",
            "Return result rows matching all conditions",
          ],
          takeaway:
            "Query execution bridges the high-level SQL language and the low-level storage engine.",
          diagram: {
            type: "process",
            title: "Query execution pipeline",
            nodes: [
              { id: "sql", label: "SQL statement", emphasis: true },
              { id: "parse", label: "parser", emphasis: true },
              { id: "plan", label: "query plan", emphasis: true },
              { id: "exec", label: "executor", emphasis: true },
              { id: "rows", label: "result rows", emphasis: true },
            ],
            edges: [
              { from: "sql", to: "parse", label: "input" },
              { from: "parse", to: "plan", label: "produces plan" },
              { from: "plan", to: "exec", label: "execute" },
              { from: "exec", to: "rows", label: "returns results" },
            ],
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
            explanation:
              "The executor runs the plan: it scans the storage engine structures and filters rows by the WHERE clause.",
          },
          flashcards: [
            {
              front: "Query plan",
              back: "Decision of which storage structures to scan and how to filter",
            },
            {
              front: "Predicate",
              back: "A condition (e.g., WHERE col = 5) that filters rows",
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
  ],
};