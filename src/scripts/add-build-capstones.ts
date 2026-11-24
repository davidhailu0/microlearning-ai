import "dotenv/config";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import * as s from "../lib/db/schema";

/**
 * Adds one capstone lesson to each Build Your Own course. The early lessons
 * build a minimal working system; the capstone covers the production-facing
 * pieces those guides usually stop short of. Idempotent by lesson title.
 *
 * Usage: npx tsx src/scripts/add-build-capstones.ts
 */

type QuizDraft = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type Capstone = {
  courseTitle: string;
  moduleTitle: string;
  moduleSummary: string;
  lessonTitle: string;
  objective: string;
  hook: string;
  paragraphs: string[];
  bullets: string[];
  steps: { title: string; detail: string }[];
  takeaway: string;
  quizzes: QuizDraft[];
  cards: { front: string; back: string }[];
  coverageBasis: string;
};

const CAPSTONES: Capstone[] = [
  {
    courseTitle: "Build Your Own Database",
    moduleTitle: "Capstone: From Toy Engine to Transactional Database",
    moduleSummary:
      "Durability, isolation, compaction policy, query planning, and the wire protocol that turn a storage demo into a usable database.",
    lessonTitle: "Capstone: WAL, Transactions, Compaction, and the Server",
    objective:
      "Explain and implement the pieces a minimal database needs before it can safely store real data: a write-ahead log, atomic transactions, compaction, a query planner, and a client protocol.",
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
        detail:
          "Write length, checksum, transaction id, operation, key, and value. Reject torn tail records during recovery.",
      },
      {
        title: "Make commit atomic",
        detail:
          "Buffer writes, append one commit marker, fsync, then publish the new memtable entries to readers.",
      },
      {
        title: "Implement snapshot reads",
        detail:
          "Tag each version with a sequence number and let a transaction read the newest version at or below its snapshot.",
      },
      {
        title: "Choose a compaction policy",
        detail:
          "Start with size-tiered runs and measure read amplification; move hot levels to leveled compaction if reads dominate.",
      },
      {
        title: "Plan a simple query",
        detail:
          "Parse SELECT ... WHERE key = ?, prefer a point lookup through the B+-tree, and fall back to a full scan otherwise.",
      },
      {
        title: "Expose a framed protocol",
        detail:
          "Send a request id, statement, and parameters; return a status, row count, and rows so a client can match responses.",
      },
    ],
    takeaway:
      "A database becomes trustworthy when the WAL makes commits durable, snapshots and conflict checks make them isolated, compaction bounds read cost, and a planner plus protocol turn storage into a usable service.",
    quizzes: [
      {
        prompt: "When must a write-ahead log record be durable?",
        options: [
          "Before the transaction is acknowledged as committed",
          "Only when the memtable is full",
          "After the next compaction finishes",
          "When the client disconnects",
        ],
        correctIndex: 0,
        explanation:
          "The commit acknowledgement is a promise. The WAL record must be on stable storage before that promise is made, otherwise a crash can lose an acknowledged transaction.",
      },
      {
        prompt: "What problem does group commit solve?",
        options: [
          "It removes the need for a WAL",
          "It batches multiple transactions behind one fsync",
          "It makes every transaction serializable",
          "It compresses SSTables automatically",
        ],
        correctIndex: 1,
        explanation:
          "Fsync is expensive. Group commit waits briefly, writes several commit records, and pays for one flush instead of one per transaction.",
      },
      {
        prompt: "Why can a tombstone not be discarded immediately?",
        options: [
          "It is needed to encrypt the key",
          "Older versions may still exist in deeper SSTables",
          "Tombstones are required by SQL",
          "It keeps the memtable balanced",
        ],
        correctIndex: 1,
        explanation:
          "Dropping a tombstone while an older value remains would make deleted data visible again. It can go only after every older version is compacted.",
      },
      {
        prompt: "What is the main trade-off between tiered and leveled compaction?",
        options: [
          "Tiered favors write throughput; leveled bounds read amplification",
          "Tiered guarantees serializability; leveled does not",
          "Leveled removes the need for bloom filters",
          "Leveled stores data only in memory",
        ],
        correctIndex: 0,
        explanation:
          "Tiered compaction rewrites less data per write but leaves more overlapping runs to search. Leveled compaction searches fewer runs at the cost of more rewriting.",
      },
      {
        prompt: "What does a query planner decide?",
        options: [
          "Which access path and join order to use",
          "Which users may log in",
          "How often to fsync the WAL",
          "Which compaction level to delete",
        ],
        correctIndex: 0,
        explanation:
          "The planner turns a logical query into a physical plan: scans versus index lookups, join order, and where filters are applied.",
      },
    ],
    cards: [
      {
        front: "Write-ahead log (WAL)",
        back: "Append-only durability log written and fsynced before a commit is acknowledged; replayed from the last checkpoint after a crash.",
      },
      {
        front: "Snapshot isolation",
        back: "Each transaction reads a consistent snapshot; write-write conflicts on the same key are detected before commit.",
      },
      {
        front: "Tiered vs leveled compaction",
        back: "Tiered merges similar-sized runs for write throughput; leveled keeps non-overlapping runs per level to bound read amplification.",
      },
      {
        front: "Tombstone",
        back: "A deletion marker that must survive compaction until every older version of the key is gone.",
      },
      {
        front: "Planner vs executor",
        back: "The planner chooses access paths and join order; the executor streams rows through the chosen operators.",
      },
    ],
    coverageBasis:
      "Complete build path from SSTables through a query-serving database, extended with the durability, transaction, compaction, planning, and protocol pieces a usable engine needs.",
  },
  {
    courseTitle: "Build Your Own Blockchain",
    moduleTitle: "Capstone: From Toy Chain to Usable Ledger",
    moduleSummary:
      "Signatures, Merkle commitments, difficulty adjustment, fork choice, and the scaling layer that separate a demo chain from a ledger.",
    lessonTitle: "Capstone: Signatures, Merkle Trees, Forks, and Scaling",
    objective:
      "Explain how ownership, tamper evidence, consensus under competing chains, and scaling work in a blockchain beyond the basic block-and-PoW loop.",
    hook: "A hash-linked list proves that history is ordered. It does not prove who authorized a transfer, and it does not decide which of two histories wins.",
    paragraphs: [
      "Ownership is cryptographic. A wallet holds a private key; a transaction names the sender's public key or address and carries a signature over the transaction fields. Nodes verify the signature before accepting the transaction, and the sender's balance or unspent outputs must cover the amount. Replay protection (a nonce or chain id) stops a valid signature from being reused on another chain. Without this layer, anyone can rewrite the mempool in their favor.",
      "A Merkle tree commits to all transactions in a block with one root in the header. Changing any transaction changes the root, so the PoW hash covers the whole block. The tree also enables inclusion proofs: a light client can verify that one transaction is in a block without downloading every transaction. That is the difference between a full node and a wallet that trusts a server.",
      "Consensus under competing blocks needs an explicit fork-choice rule. Bitcoin-style chains follow the most accumulated work, not simply the longest chain; a reorg replaces recent blocks and returns their transactions to the mempool. Difficulty retargeting keeps block time stable as hash power changes, and finality is probabilistic unless the protocol adds a finality gadget. Fees prioritize mempool entries, smart contracts add deterministic execution, and rollups or channels move execution off the base chain while posting compressed proofs or data back to it.",
    ],
    bullets: [
      "A transaction is valid only with a signature over its fields and replay protection such as a nonce or chain id",
      "A Merkle root in the header commits to every transaction and enables compact inclusion proofs",
      "Fork choice follows accumulated work or an explicit finality rule, not wall-clock time",
      "Difficulty retargeting adjusts mining difficulty to keep block intervals stable",
      "Reorgs return orphaned transactions to the mempool and can invalidate recent confirmations",
      "Rollups and payment channels scale by moving execution off-chain while anchoring security on-chain",
    ],
    steps: [
      {
        title: "Add key pairs and signatures",
        detail:
          "Generate a key pair, sign the canonical transaction bytes, and reject any transaction whose signature or nonce does not verify.",
      },
      {
        title: "Build a Merkle root",
        detail:
          "Hash transaction ids in pairs up to one root, store the root in the header, and verify a sibling path for one transaction.",
      },
      {
        title: "Implement difficulty retargeting",
        detail:
          "Every fixed number of blocks, compare actual elapsed time with the target and adjust the leading-zero requirement within bounds.",
      },
      {
        title: "Choose a fork rule",
        detail:
          "Track total accumulated work per branch, switch to the heavier branch, and requeue transactions from abandoned blocks.",
      },
      {
        title: "Add fee-based mempool ordering",
        detail:
          "Sort pending transactions by fee per byte and evict the lowest-value entries when the pool is full.",
      },
      {
        title: "Sketch a scaling path",
        detail:
          "Compare an optimistic rollup with a payment channel: what executes off-chain, what data returns on-chain, and who can challenge a bad result.",
      },
    ],
    takeaway:
      "A usable ledger adds cryptographic ownership, a whole-block commitment, an explicit fork-choice and finality story, and a scaling design to the basic hash chain and mining loop.",
    quizzes: [
      {
        prompt: "What does a transaction signature prove?",
        options: [
          "That the sender authorized the transaction fields",
          "That the transaction fee is sufficient",
          "That the block has enough proof of work",
          "That the receiver is online",
        ],
        correctIndex: 0,
        explanation:
          "The signature binds the sender's key to the exact transaction bytes. Fee and block validity are separate checks.",
      },
      {
        prompt: "Why is the Merkle root stored in the block header?",
        options: [
          "It encrypts every transaction",
          "It commits the header to all transactions in the block",
          "It replaces the proof-of-work hash",
          "It stores the sender's private key",
        ],
        correctIndex: 1,
        explanation:
          "Changing any transaction changes the root, so the PoW-covered header commits to the entire transaction set. It also enables inclusion proofs.",
      },
      {
        prompt: "In a Bitcoin-style chain, which branch wins a fork?",
        options: [
          "The branch with the most accumulated work",
          "The branch with the most transactions",
          "The branch announced first",
          "The branch with the lowest difficulty",
        ],
        correctIndex: 0,
        explanation:
          "Nodes follow the branch with the greatest total proof of work, which is usually but not always the longest chain.",
      },
      {
        prompt: "What happens to transactions in an orphaned block after a reorg?",
        options: [
          "They are permanently deleted",
          "They usually return to the mempool for inclusion elsewhere",
          "They become invalid signatures",
          "They are merged into the new block automatically",
        ],
        correctIndex: 1,
        explanation:
          "A reorg removes the block from the canonical chain; its valid transactions are typically re-added to the mempool.",
      },
      {
        prompt: "What does a rollup post back to the base chain?",
        options: [
          "Every execution step",
          "Compressed transaction data or a validity proof",
          "Only the miner's private key",
          "Nothing at all",
        ],
        correctIndex: 1,
        explanation:
          "Rollups execute off-chain but post data or proofs on-chain so users can reconstruct state and challenge invalid results.",
      },
    ],
    cards: [
      {
        front: "Transaction signature",
        back: "A cryptographic signature over canonical transaction fields that proves the sender authorized the transfer; paired with a nonce or chain id for replay protection.",
      },
      {
        front: "Merkle root",
        back: "A single hash committing to all transactions in a block; stored in the header and used for compact inclusion proofs.",
      },
      {
        front: "Fork choice",
        back: "The rule nodes use to select the canonical branch, such as the most accumulated proof of work or an explicit finality gadget.",
      },
      {
        front: "Difficulty retarget",
        back: "A periodic adjustment to the mining target that keeps the average block interval stable as hash power changes.",
      },
      {
        front: "Rollup",
        back: "An off-chain execution layer that posts compressed data or validity proofs to the base chain for security and settlement.",
      },
    ],
    coverageBasis:
      "Complete build path from blocks and PoW through transactions and consensus, extended with signatures, Merkle commitments, fork choice, difficulty, fees, and scaling.",
  },
  {
    courseTitle: "Build Your Own Neural Network",
    moduleTitle: "Capstone: From Toy Network to Evaluated Model",
    moduleSummary:
      "The loss, optimizer, regularization, and evaluation choices that make a trained network useful beyond a single toy example.",
    lessonTitle: "Capstone: Loss Functions, Softmax, Regularization, and Evaluation",
    objective:
      "Choose the right loss and output layer, train with a modern optimizer, control overfitting, and evaluate a model on data it has never seen.",
    hook: "A network that reaches zero training error has proved only that it can memorize. Generalization is a separate engineering problem.",
    paragraphs: [
      "The loss function defines what the network is trying to do. Mean squared error suits regression; binary cross-entropy suits a single probability; categorical cross-entropy with a softmax output suits mutually exclusive classes. Softmax turns logits into a probability distribution, and the gradient of cross-entropy with softmax reduces to predicted minus target, which keeps learning stable. Never compare raw logits across classes without applying the matching output transform.",
      "Optimization is more than gradient descent. Momentum smooths noisy gradients; RMSProp scales each parameter by recent gradient magnitude; Adam combines both with bias correction. Learning rate remains the most important hyperparameter: too high oscillates or diverges, too low wastes epochs. A schedule that warms up and then decays often helps, and gradient clipping prevents rare batches from destroying the weights.",
      "Generalization needs a train/validation/test split and a disciplined evaluation loop. Validation data selects hyperparameters; the test set is touched once. Weight decay, dropout, early stopping, and data augmentation reduce overfitting, while accuracy alone is misleading on imbalanced data. Use precision, recall, F1, or a confusion matrix, and compare against a simple baseline before trusting a complex model.",
    ],
    bullets: [
      "Match the loss to the task: MSE for regression, binary cross-entropy for one probability, categorical cross-entropy with softmax for exclusive classes",
      "Softmax plus cross-entropy has a clean predicted-minus-target gradient",
      "Momentum, RMSProp, and Adam change how gradients update each parameter; the learning rate still dominates",
      "Gradient clipping protects training from rare exploding batches",
      "Use validation data for tuning and keep the test set untouched until the final evaluation",
      "Regularization, early stopping, and the right metric matter more than adding layers",
    ],
    steps: [
      {
        title: "Switch to a task-appropriate loss",
        detail:
          "Add a softmax output for multiclass data and train with categorical cross-entropy; compare convergence with the old MSE setup.",
      },
      {
        title: "Add an optimizer",
        detail:
          "Implement SGD with momentum, then Adam, and compare loss curves at the same learning rate.",
      },
      {
        title: "Clip gradients",
        detail:
          "Measure the gradient norm before each update and rescale it when it exceeds a threshold.",
      },
      {
        title: "Split the data",
        detail:
          "Hold out validation and test sets, tune on validation, and report the final test score only once.",
      },
      {
        title: "Add regularization",
        detail:
          "Compare weight decay, dropout, and early stopping; record both training and validation loss.",
      },
      {
        title: "Evaluate beyond accuracy",
        detail:
          "Build a confusion matrix and report precision, recall, and F1; compare with a majority-class baseline.",
      },
    ],
    takeaway:
      "A model is only as good as its objective, optimization, and evaluation: match the loss to the task, stabilize updates, control overfitting, and report metrics on untouched data.",
    quizzes: [
      {
        prompt: "Which output and loss pair suits mutually exclusive classes?",
        options: [
          "Sigmoid with mean squared error",
          "Softmax with categorical cross-entropy",
          "Linear output with hinge loss",
          "ReLU with binary cross-entropy",
        ],
        correctIndex: 1,
        explanation:
          "Softmax produces a distribution over classes, and categorical cross-entropy measures the negative log-likelihood of the correct class.",
      },
      {
        prompt: "What does Adam combine?",
        options: [
          "Momentum and per-parameter scaling with bias correction",
          "Dropout and weight decay",
          "Softmax and argmax",
          "Training and test data",
        ],
        correctIndex: 0,
        explanation:
          "Adam maintains first and second moment estimates, corrects their initial bias, and adapts each parameter's step size.",
      },
      {
        prompt: "Why keep a separate test set?",
        options: [
          "To tune the learning rate more precisely",
          "To estimate performance on data not used for training or tuning",
          "To increase the number of training epochs",
          "To replace the validation set",
        ],
        correctIndex: 1,
        explanation:
          "Repeated tuning on validation leaks information. A held-out test set gives an unbiased final estimate.",
      },
      {
        prompt: "What does dropout do during training?",
        options: [
          "Randomly zeroes activations to reduce co-adaptation",
          "Removes the loss function",
          "Permanently deletes neurons",
          "Increases the learning rate",
        ],
        correctIndex: 0,
        explanation:
          "Dropout randomly disables units on each pass, forcing the network to learn redundant representations and reducing overfitting.",
      },
      {
        prompt: "Why is accuracy misleading on an imbalanced dataset?",
        options: [
          "It always overestimates precision",
          "A majority-class predictor can score high while missing the minority class",
          "It cannot be computed for neural networks",
          "It ignores the training loss",
        ],
        correctIndex: 1,
        explanation:
          "If 95% of examples are negative, always predicting negative gives 95% accuracy but zero recall for the positive class.",
      },
    ],
    cards: [
      {
        front: "Softmax",
        back: "Converts a vector of logits into a probability distribution over mutually exclusive classes.",
      },
      {
        front: "Categorical cross-entropy",
        back: "Loss for multiclass classification; with softmax its gradient simplifies to predicted probability minus the one-hot target.",
      },
      {
        front: "Adam optimizer",
        back: "Adaptive optimizer combining momentum and RMSProp-style scaling with bias correction.",
      },
      {
        front: "Validation vs test set",
        back: "Validation data guides hyperparameter choices; the test set is held out for one final, unbiased estimate.",
      },
      {
        front: "Dropout",
        back: "Regularization that randomly zeroes activations during training to prevent co-adaptation and overfitting.",
      },
    ],
    coverageBasis:
      "Complete build path from matrix operations through forward and backward passes, extended with losses, optimizers, regularization, and evaluation.",
  },
  {
    courseTitle: "Build Your Own Operating System",
    moduleTitle: "Capstone: From Bootable Kernel to Protected OS",
    moduleSummary:
      "Interrupts, paging, privilege transitions, syscalls, drivers, and scheduling: the mechanisms that make a kernel an operating system.",
    lessonTitle: "Capstone: Interrupts, Paging, Syscalls, and Drivers",
    objective:
      "Describe how a kernel takes control from hardware, isolates user programs with paging and privilege levels, exposes syscalls, and drives devices.",
    hook: "A kernel that runs one program in a loop is a bootloader with ambitions. Interrupts and privilege boundaries are what make it an operating system.",
    paragraphs: [
      "Hardware needs a way to interrupt the CPU. The interrupt descriptor table maps each vector to a handler; the timer, keyboard, disk, and fault vectors all land there. On entry the CPU switches stacks and saves state, and the handler must acknowledge the device, do minimal work, and return. Deferring long work to a bottom half keeps interrupts short. A timer interrupt is also the heartbeat of preemptive scheduling: without it, a runaway program owns the machine forever.",
      "Isolation comes from paging and privilege rings. The kernel builds page tables that map virtual addresses to physical frames and marks user pages inaccessible to supervisor code as needed. User mode cannot execute privileged instructions or touch kernel memory; a syscall instruction traps into the kernel through a controlled gate, validates arguments, and returns a result. Copying data across the boundary must be checked, because a user pointer may be invalid or malicious.",
      "Devices are reached through drivers and a common interface. A block driver exposes read and write blocks; the virtual filesystem layer maps paths to inodes and mounts. DMA lets a device write memory directly, so the kernel must pin buffers and handle completion interrupts. The scheduler then chooses among runnable threads using round-robin, priority, or a fair-share algorithm, and a context switch saves registers and switches stacks and address spaces.",
    ],
    bullets: [
      "The IDT maps interrupt vectors to handlers; the timer interrupt enables preemption",
      "Handlers save state, acknowledge the device, and defer long work to a bottom half",
      "Page tables isolate virtual address spaces, and privilege rings block user code from kernel memory",
      "Syscalls trap through a controlled gate and must validate every user-supplied pointer",
      "Drivers expose block or character operations; the VFS maps paths to inodes and mounts",
      "DMA requires pinned buffers and completion handling; the scheduler chooses the next thread",
    ],
    steps: [
      {
        title: "Load an IDT",
        detail:
          "Install handlers for the timer, keyboard, page fault, and general protection fault, then enable interrupts.",
      },
      {
        title: "Add a timer tick",
        detail:
          "Program the PIT or APIC, count ticks, and decrement the current thread's time slice.",
      },
      {
        title: "Enable paging",
        detail:
          "Build a page directory and tables, identity-map the kernel, and map a user stack and code region.",
      },
      {
        title: "Enter user mode and trap back",
        detail:
          "Use an interrupt-return frame to enter ring 3; implement one syscall gate that validates a buffer and returns a value.",
      },
      {
        title: "Write a block driver",
        detail:
          "Expose read and write sector operations, wait for the completion interrupt, and register the device with the VFS.",
      },
      {
        title: "Switch contexts",
        detail:
          "Save callee-saved registers, switch stacks and page tables, and restore the next thread's state.",
      },
    ],
    takeaway:
      "An operating system emerges when interrupts give the kernel control, paging and rings isolate programs, syscalls form a validated boundary, drivers abstract devices, and the scheduler shares the CPU.",
    quizzes: [
      {
        prompt: "Why is the timer interrupt essential for preemptive scheduling?",
        options: [
          "It gives the kernel a periodic chance to regain control and switch threads",
          "It increases the CPU clock speed",
          "It stores files on disk",
          "It validates syscall pointers",
        ],
        correctIndex: 0,
        explanation:
          "Without a periodic interrupt, a user program that never yields keeps the CPU. The timer forces a transition back into the kernel.",
      },
      {
        prompt: "What does the IDT contain?",
        options: [
          "Handlers for interrupt and exception vectors",
          "The filesystem's inode table",
          "A list of logged-in users",
          "The scheduler's run queue",
        ],
        correctIndex: 0,
        explanation:
          "The interrupt descriptor table maps each vector to its handler and privilege requirements.",
      },
      {
        prompt: "What is the purpose of privilege rings?",
        options: [
          "To prevent user code from executing privileged instructions or touching kernel memory",
          "To encrypt disk blocks",
          "To speed up floating-point math",
          "To allocate page frames",
        ],
        correctIndex: 0,
        explanation:
          "Ring 3 user code is restricted; ring 0 kernel code can execute privileged instructions and access kernel mappings.",
      },
      {
        prompt: "Why must a syscall validate a user pointer?",
        options: [
          "The pointer may be invalid or may point into kernel memory",
          "Pointers are always physical addresses",
          "The kernel cannot read user memory",
          "It improves the scheduler's fairness",
        ],
        correctIndex: 0,
        explanation:
          "User code supplies the pointer, so the kernel must check that the range is mapped, readable or writable as required, and not kernel memory.",
      },
      {
        prompt: "What does DMA require from the kernel?",
        options: [
          "Pinned buffers and completion handling",
          "A larger scheduler quantum",
          "A user-mode driver",
          "Disabling all interrupts forever",
        ],
        correctIndex: 0,
        explanation:
          "The device writes directly to memory, so the buffer must stay resident and the kernel must learn when the transfer completes.",
      },
    ],
    cards: [
      {
        front: "Interrupt descriptor table (IDT)",
        back: "Maps interrupt and exception vectors to handlers and their privilege requirements.",
      },
      {
        front: "Timer interrupt",
        back: "Periodic hardware interrupt that lets the kernel preempt the running thread and invoke the scheduler.",
      },
      {
        front: "Privilege ring",
        back: "CPU protection level; ring 0 is kernel mode and ring 3 is user mode, which cannot execute privileged instructions or access kernel memory.",
      },
      {
        front: "Syscall gate",
        back: "A controlled trap from user mode into the kernel; arguments and user pointers must be validated before use.",
      },
      {
        front: "DMA",
        back: "Direct memory access: a device transfers data to or from RAM without the CPU copying each word, requiring pinned buffers and completion interrupts.",
      },
    ],
    coverageBasis:
      "Complete build path from bootloader through memory, scheduling, filesystem, and shell, extended with interrupts, paging, privilege transitions, syscalls, drivers, and context switching.",
  },
  {
    courseTitle: "Build Your Own Processor",
    moduleTitle: "Capstone: From Datapath to Pipelined CPU",
    moduleSummary:
      "Control logic, pipeline hazards, forwarding, caches, and branch prediction: what turns a working datapath into a credible processor.",
    lessonTitle: "Capstone: Control, Pipelining, Hazards, and Caches",
    objective:
      "Explain how control signals drive a datapath, how pipelining improves throughput, how hazards are resolved, and why caches dominate real performance.",
    hook: "A single-cycle CPU proves the datapath works. A pipelined CPU with caches is what makes the design fast enough to matter.",
    paragraphs: [
      "The control unit translates each instruction into signals: register write enable, ALU operation, memory read or write, and the next PC source. Hardwired control uses combinational logic and is fast but rigid; microcode stores a sequence of control words in a ROM and is easier to extend. Either way, the decoder must handle the full ISA, including immediate formats, branches, loads, and stores, and illegal encodings must fault rather than silently do nothing.",
      "Pipelining overlaps instruction stages to improve throughput, not single-instruction latency. A classic five-stage pipeline fetches, decodes, executes, accesses memory, and writes back. Hazards appear immediately: a load followed by a dependent instruction needs a stall, an ALU result can be forwarded from the execute stage, and a branch can fetch the wrong path. Forwarding paths, hazard-detection logic, and branch prediction keep the pipeline full without changing architectural results.",
      "Caches exist because memory is far slower than the ALU. A small direct-mapped or set-associative cache exploits temporal and spatial locality; a miss stalls the pipeline while the next level is fetched. Write-through versus write-back and write-allocate policies change traffic and complexity. Instruction and data caches are often split to avoid structural conflicts, and branch prediction plus speculation hide control hazards, provided mispredictions are flushed correctly.",
    ],
    bullets: [
      "Control signals select register writes, ALU operations, memory access, and the next PC",
      "Hardwired control is fast and rigid; microcode is slower but easier to extend",
      "Pipelining raises throughput by overlapping stages, not by shortening one instruction",
      "Forwarding resolves many data hazards; load-use hazards still require a stall",
      "Caches exploit locality, and miss latency usually dominates performance",
      "Branch prediction hides control hazards but mispredictions must flush younger instructions",
    ],
    steps: [
      {
        title: "Decode every instruction",
        detail:
          "Generate control signals for R-type, immediate, load, store, and branch instructions, and raise a fault on illegal encodings.",
      },
      {
        title: "Split the datapath into stages",
        detail:
          "Add pipeline registers between fetch, decode, execute, memory, and write-back and verify a program still produces the same result.",
      },
      {
        title: "Add forwarding",
        detail:
          "Route results from execute and memory stages back to the ALU inputs and compare against a no-forwarding baseline.",
      },
      {
        title: "Detect load-use hazards",
        detail:
          "Stall fetch and decode for one cycle when an instruction depends on a load still in the memory stage.",
      },
      {
        title: "Add a data cache",
        detail:
          "Implement a small set-associative cache with tags and valid bits; measure hit rate on a loop-heavy program.",
      },
      {
        title: "Predict branches",
        detail:
          "Start with predict-not-taken, then a one-bit predictor, and flush the pipeline on a misprediction.",
      },
    ],
    takeaway:
      "A credible processor needs complete control, a pipeline that preserves architectural results under hazards, and a cache hierarchy that hides memory latency.",
    quizzes: [
      {
        prompt: "What does pipelining improve?",
        options: [
          "Instruction throughput",
          "The latency of a single instruction",
          "The clock speed automatically",
          "The size of the register file",
        ],
        correctIndex: 0,
        explanation:
          "Overlapping stages lets the CPU finish more instructions per unit time, even though one instruction still takes all stages.",
      },
      {
        prompt: "When is forwarding insufficient?",
        options: [
          "When an instruction depends on a load that has not returned from memory yet",
          "When two instructions use different registers",
          "When a branch is correctly predicted",
          "When the cache hits",
        ],
        correctIndex: 0,
        explanation:
          "A load's data is not available until the memory stage, so a dependent instruction immediately after it needs a stall even with forwarding.",
      },
      {
        prompt: "What is the main advantage of microcoded control?",
        options: [
          "It is easier to extend and modify",
          "It always runs faster than hardwired control",
          "It removes the need for a decoder",
          "It eliminates pipeline hazards",
        ],
        correctIndex: 0,
        explanation:
          "Microcode turns control into a stored sequence, which is simpler to change than rewiring combinational logic.",
      },
      {
        prompt: "What does a cache exploit?",
        options: [
          "Temporal and spatial locality",
          "Instruction-level parallelism only",
          "Branch mispredictions",
          "Register renaming",
        ],
        correctIndex: 0,
        explanation:
          "Recently used data and nearby addresses are likely to be used again, so a small fast cache serves most accesses.",
      },
      {
        prompt: "What must happen after a branch misprediction?",
        options: [
          "Flush younger instructions fetched from the wrong path",
          "Disable the cache",
          "Write back all registers twice",
          "Restart the entire program",
        ],
        correctIndex: 0,
        explanation:
          "Speculative work on the wrong path must be discarded, and fetch must resume at the correct target.",
      },
    ],
    cards: [
      {
        front: "Control unit",
        back: "Logic that decodes an instruction and asserts the register, ALU, memory, and PC control signals needed to execute it.",
      },
      {
        front: "Hardwired vs microcoded control",
        back: "Hardwired control is fast combinational logic; microcode stores control words in ROM and is easier to extend.",
      },
      {
        front: "Load-use hazard",
        back: "A dependency on a load whose data is not yet available; requires a stall even when forwarding paths exist.",
      },
      {
        front: "Forwarding",
        back: "Bypassing a result from a later pipeline stage directly to the ALU input to avoid waiting for write-back.",
      },
      {
        front: "Cache locality",
        back: "Temporal locality reuses recently accessed data; spatial locality reuses nearby addresses, together making small caches effective.",
      },
    ],
    coverageBasis:
      "Complete build path from register file and ALU through ISA, datapath, and assembly, extended with control logic, pipelining, hazards, caches, and branch prediction.",
  },
  {
    courseTitle: "Build Your Own Programming Language",
    moduleTitle: "Capstone: From Tree-Walker to Real Language",
    moduleSummary:
      "Scopes, type checking, functions, closures, bytecode, and runtime services that make a language usable beyond arithmetic.",
    lessonTitle: "Capstone: Scopes, Types, Closures, and a Bytecode VM",
    objective:
      "Explain how symbol tables, type checking, function calls, closures, and a bytecode runtime turn a parser and evaluator into a real language implementation.",
    hook: "A tree-walking interpreter can evaluate expressions. A language also needs names that respect scope, calls that return, and values that outlive the stack frame that created them.",
    paragraphs: [
      "Names need a symbol table with lexical scope. Each block pushes a scope; declarations enter it, and lookup walks outward until it finds a binding. Shadowing, forward references, and duplicate declarations are decided here. A resolver pass can annotate each identifier with its depth, so the runtime does not search a chain of environments for every access.",
      "Types catch errors before execution. A checker walks the AST with an environment of variable types and function signatures, verifies arguments and returns, and rejects invalid operations. Static types can be simple (int, bool, string) or inferred; either way, the checker must handle recursive functions, nullability, and the difference between a declaration and an assignment. Functions add call frames, parameters, and return values. Closures capture the environment where a function was defined, not where it is called, which is why a returned function can still read its creator's variables.",
      "A bytecode VM separates compilation from execution. The compiler lowers the AST to stack instructions, resolves jumps, and emits constants and local slots; the VM fetches, decodes, and executes them with an explicit stack and frame pointer. This is faster than walking the tree and easier to optimize. A garbage collector reclaims unreachable objects, and error reporting must map bytecode offsets back to source lines. Optimization passes, from constant folding to inline caching, come after correctness.",
    ],
    bullets: [
      "Lexical scopes resolve names outward; shadowing and duplicate declarations need explicit rules",
      "A resolver can annotate identifier depth so runtime lookup is constant time",
      "A type checker walks the AST with variable types and function signatures before execution",
      "Closures capture the defining environment, not the calling environment",
      "Bytecode compilation lowers the AST to stack instructions with resolved jumps and slots",
      "A VM needs an explicit stack, call frames, garbage collection, and source-mapped errors",
    ],
    steps: [
      {
        title: "Build a scoped symbol table",
        detail:
          "Push and pop scopes for blocks, record declarations, and reject duplicate names in the same scope.",
      },
      {
        title: "Resolve identifiers",
        detail:
          "Annotate each variable reference with the number of scopes to walk, then use that depth at runtime.",
      },
      {
        title: "Add a type checker",
        detail:
          "Track variable and function types, verify calls and returns, and report the source location of the first mismatch.",
      },
      {
        title: "Implement functions and closures",
        detail:
          "Create a call frame with parameters and locals; capture the defining environment so returned functions keep working.",
      },
      {
        title: "Compile to bytecode",
        detail:
          "Emit stack instructions for expressions, jumps for control flow, and slot indices for locals; run a small program on the VM.",
      },
      {
        title: "Add runtime services",
        detail:
          "Implement a mark-and-sweep collector and map bytecode offsets to source lines for runtime errors.",
      },
    ],
    takeaway:
      "A real language implementation resolves names by scope, checks types before running, gives functions proper frames and closures, and executes compiled bytecode with a managed runtime.",
    quizzes: [
      {
        prompt: "What does a closure capture?",
        options: [
          "The environment where the function was defined",
          "The environment where the function is called",
          "Only global variables",
          "The parser's token stream",
        ],
        correctIndex: 0,
        explanation:
          "A closure keeps the defining environment alive, so a returned function can still access its creator's locals.",
      },
      {
        prompt: "Why resolve identifier depth ahead of time?",
        options: [
          "To avoid searching a chain of environments on every access",
          "To remove the need for a parser",
          "To make all variables global",
          "To skip type checking",
        ],
        correctIndex: 0,
        explanation:
          "The resolver computes how many scopes to walk, so the runtime can jump directly to the right slot.",
      },
      {
        prompt: "What is the job of a type checker?",
        options: [
          "Verify operations and calls against declared or inferred types before execution",
          "Convert the AST to machine code",
          "Collect garbage at runtime",
          "Tokenize the source",
        ],
        correctIndex: 0,
        explanation:
          "The checker walks the AST with type information and rejects programs that would perform invalid operations.",
      },
      {
        prompt: "What is a key advantage of bytecode over tree-walking?",
        options: [
          "Faster execution with resolved jumps and compact instructions",
          "It removes the need for a parser",
          "It makes every program statically typed",
          "It eliminates the call stack",
        ],
        correctIndex: 0,
        explanation:
          "Bytecode avoids repeatedly traversing the AST and gives the VM a compact instruction stream with resolved control flow.",
      },
      {
        prompt: "Why map bytecode offsets back to source lines?",
        options: [
          "So runtime errors point to the user's code",
          "So the garbage collector can find roots",
          "So the lexer can skip whitespace",
          "So closures capture the right scope",
        ],
        correctIndex: 0,
        explanation:
          "The VM executes bytecode, but users need diagnostics in terms of their source file and line.",
      },
    ],
    cards: [
      {
        front: "Lexical scope",
        back: "Name resolution based on where code is written; lookup walks outward through enclosing scopes and respects shadowing.",
      },
      {
        front: "Resolver pass",
        back: "An AST pass that annotates each identifier with its scope depth so runtime lookup does not search environment chains.",
      },
      {
        front: "Closure",
        back: "A function plus the defining environment it captured, allowing it to access outer locals after the outer call returns.",
      },
      {
        front: "Bytecode VM",
        back: "Executes a compact instruction stream with an explicit operand stack and call frames instead of walking the AST.",
      },
      {
        front: "Source map",
        back: "A mapping from bytecode offsets to source locations so runtime errors can point at the user's code.",
      },
    ],
    coverageBasis:
      "Complete build path from lexer and parser through interpreter and compiler, extended with scopes, type checking, functions, closures, bytecode, GC, and diagnostics.",
  },
];

async function main() {
  const db = getDb();

  for (const capstone of CAPSTONES) {
    const [course] = await db
      .select({ id: s.courses.id, title: s.courses.title })
      .from(s.courses)
      .where(eq(s.courses.title, capstone.courseTitle))
      .limit(1);
    if (!course) {
      console.log(`! missing course: ${capstone.courseTitle}`);
      continue;
    }

    const [existing] = await db
      .select({ id: s.lessons.id })
      .from(s.lessons)
      .where(and(eq(s.lessons.courseId, course.id), eq(s.lessons.title, capstone.lessonTitle)))
      .limit(1);
    if (existing) {
      console.log(`= ${capstone.courseTitle}: capstone already present`);
      continue;
    }

    const modules = await db
      .select({ id: s.modules.id, position: s.modules.position })
      .from(s.modules)
      .where(eq(s.modules.courseId, course.id))
      .orderBy(asc(s.modules.position));
    const lessons = await db
      .select({ id: s.lessons.id, position: s.lessons.position, estimatedMinutes: s.lessons.estimatedMinutes })
      .from(s.lessons)
      .where(eq(s.lessons.courseId, course.id))
      .orderBy(asc(s.lessons.position));

    const modulePosition = modules.length;
    const lessonPosition = lessons.length;
    const [module] = await db
      .insert(s.modules)
      .values({
        courseId: course.id,
        position: modulePosition,
        title: capstone.moduleTitle,
        summary: capstone.moduleSummary,
      })
      .returning({ id: s.modules.id });

    const [lesson] = await db
      .insert(s.lessons)
      .values({
        courseId: course.id,
        moduleId: module.id,
        position: lessonPosition,
        title: capstone.lessonTitle,
        objective: capstone.objective,
        hook: capstone.hook,
        summary: capstone.takeaway,
        keyTakeaway: capstone.takeaway,
        estimatedMinutes: 12,
        xpReward: 20,
        audioStatus: "none",
      })
      .returning({ id: s.lessons.id });

    const blocks = [
      { type: "hook" as const, text: capstone.hook },
      ...capstone.paragraphs.map((text) => ({ type: "paragraph" as const, text })),
      { type: "bullets" as const, items: capstone.bullets },
      { type: "steps" as const, title: "Do it yourself", items: capstone.steps },
      { type: "takeaway" as const, text: capstone.takeaway },
    ];

    await db.insert(s.contentBlocks).values(
      blocks.map((block, index) => ({
        lessonId: lesson.id,
        position: index,
        type: block.type,
        payload: block as unknown as Record<string, unknown>,
      })),
    );

    await db.insert(s.citations).values({
      lessonId: lesson.id,
      label: `${capstone.courseTitle} capstone`,
      locator: { pageStart: null, pageEnd: null, sectionIndexes: [] },
      quote: capstone.coverageBasis,
    });

    const [quiz] = await db
      .insert(s.quizzes)
      .values({ lessonId: lesson.id })
      .returning({ id: s.quizzes.id });

    for (const [questionIndex, question] of capstone.quizzes.entries()) {
      const [questionRow] = await db
        .insert(s.questions)
        .values({
          quizId: quiz.id,
          position: questionIndex,
          type: "single_choice",
          prompt: question.prompt,
          explanation: question.explanation,
          points: 10,
        })
        .returning({ id: s.questions.id });

      await db.insert(s.quizOptions).values(
        question.options.map((label, optionIndex) => ({
          questionId: questionRow.id,
          position: optionIndex,
          label,
          isCorrect: optionIndex === question.correctIndex,
        })),
      );
    }

    await db.insert(s.flashcards).values(
      capstone.cards.map((card) => ({
        lessonId: lesson.id,
        courseId: course.id,
        concept: capstone.lessonTitle,
        front: card.front,
        back: card.back,
      })),
    );

    const lessonCount = lessons.length + 1;
    const totalMinutes = lessons.reduce((sum, item) => sum + item.estimatedMinutes, 12);
    await db
      .update(s.courses)
      .set({ lessonCount, estimatedMinutes: totalMinutes, updatedAt: new Date() })
      .where(eq(s.courses.id, course.id));

    const sourceRows = await db
      .select({ id: s.sources.id, metadata: s.sources.metadata })
      .from(s.sources)
      .where(eq(s.sources.courseId, course.id));
    for (const source of sourceRows) {
      await db
        .update(s.sources)
        .set({
          metadata: {
            ...((source.metadata ?? {}) as Record<string, unknown>),
            lessonCount,
            moduleCount: modules.length + 1,
            coverageBasis: capstone.coverageBasis,
          },
        })
        .where(eq(s.sources.id, source.id));
    }

    console.log(
      `+ ${capstone.courseTitle}: ${capstone.lessonTitle} (${capstone.quizzes.length} questions, ${capstone.cards.length} cards)`,
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
