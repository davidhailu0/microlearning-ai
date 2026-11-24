import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const bcCourse: DraftCourse = {
  title: "Build Your Own Blockchain",
  description: "Implement a minimal blockchain from scratch: data structures for blocks and chains, proof-of-work mining, transaction handling, a minimal P2P network, and a consensus mechanism. Learn how distributed consensus and cryptographic linking secure decentralized systems.",
  category: "Blockchain",
  level: "intermediate",
  coverEmoji: "⛓️",
  tags: [
    "blockchain",
    "cryptocurrency",
    "distributed-systems",
    "consensus",
    "proof-of-work",
  ],
  modules: [
    {
      title: "Blockchain fundamentals: Blocks and Chains",
      summary: "Define the data structures for blocks, chains, and the genesis block.",
      lessons: [
        {
          title: "Defining the Block Structure",
          objective: "Implement a Block type that contains an index, timestamp, transactions, proof, and hash.",
          hook: "The block is the fundamental data structure of a blockchain.",
          paragraphs: [
            "A block stores a batch of transactions, a reference to the previous block (via its hash), a proof-of-work value, and a timestamp. You'll define a Block struct with fields: index, timestamp, transactions (list), proof (int), and previous_hash (string). The hash of each block is computed from its contents, linking blocks together.",
          ],
          bullets: [
            "Block contains index, timestamp, transactions, proof, previous_hash",
            "Each block's hash is computed from its own contents",
            "The genesis block has index 0 and no previous_hash",
            "The hash links blocks: changing any data breaks the chain",
          ],
          steps: [
            {
              title: "Set up the project",
              detail: "Pick a language with SHA-256 and an Ed25519 or ECDSA library (Go, Rust, Python, or TypeScript). Create blockchain/, tests/, and a CLI entry point. Define the Block and Chain module boundaries before coding.",
            },
            {
              title: "Define the block fields",
              detail: "Include index, timestamp, transactions, previous hash, nonce, and hash. Serialize fields in a fixed order so hashing is deterministic.",
            },
            {
              title: "Implement hashing",
              detail: "Hash the serialized block with SHA-256. Store the hex digest and recompute it on validation instead of trusting the stored value.",
            },
            {
              title: "Create the genesis block",
              detail: "Hard-code index 0 with no previous hash and a fixed timestamp. Every node must produce the same genesis hash or they will reject each other.",
            },
            {
              title: "Validate the chain",
              detail: "Walk from genesis: each block's previous hash must equal the prior hash, and each stored hash must match a recomputation. Reject the first mismatch.",
            },
            {
              title: "Test tampering",
              detail: "Change one transaction in an old block and confirm validation fails at that block and every block after it.",
            },
          ],
          takeaway: "The block's fields and hash computation are the foundation that makes a blockchain tamper-evident.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "hsh",
                from: "idx",
                label: "contributes to",
              },
              {
                to: "hsh",
                from: "ts",
                label: "contributes to",
              },
              {
                to: "hsh",
                from: "txs",
                label: "contributes to",
              },
              {
                to: "hsh",
                from: "prf",
                label: "contributes to",
              },
              {
                to: "hsh",
                from: "ph",
                label: "contributes to",
              },
            ],
            nodes: [
              {
                id: "idx",
                label: "index",
                emphasis: true,
              },
              {
                id: "ts",
                label: "timestamp",
                emphasis: true,
              },
              {
                id: "txs",
                label: "transactions",
                emphasis: true,
              },
              {
                id: "prf",
                label: "proof",
                emphasis: true,
              },
              {
                id: "ph",
                label: "previous_hash",
                emphasis: true,
              },
              {
                id: "hsh",
                label: "hash",
                emphasis: true,
              },
            ],
            title: "Block structure",
          },
          quiz: {
            question: "What links one block to the next in a blockchain?",
            options: [
              "The block's height/index",
              "The previous block's hash",
              "The proof-of-work difficulty",
              "The transaction count",
            ],
            correctIndex: 1,
            explanation: "Each block stores the hash of its predecessor, creating the chain.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Defining the Block Structure”?",
              options: [
                "Block contains index, timestamp, transactions, proof, previous_hash",
                "Define difficulty: number of leading zeros required in the hash",
                "Transaction has sender, receiver, amount, and signature fields",
                "Longest-chain rule: the chain with the most proof-of-work is valid",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Block contains index, timestamp, transactions, proof, previous_hash”",
            },
            {
              question: "Which statement best explains “Block hash”?",
              options: [
                "Finding a hash with leading zeros; computational cost secures the network",
                "Computed from block's own contents; links to previous block",
                "Sender → Receiver + Amount; signed by sender's private key",
                "The chain with the most proof-of-work is the valid one",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Computed from block's own contents; links to previous block”",
            },
            {
              question: "Which of these is a hands-on step in “Defining the Block Structure”?",
              options: [
                "Define the transaction shape",
                "Sign and verify",
                "Test bad inputs",
                "Define the block fields",
              ],
              correctIndex: 3,
              explanation: "“Define the block fields” is part of this lesson's sequence: Include index, timestamp, transactions, previous hash, nonce, and hash. Serialize fields in a fixed order so hashing is deterministic.",
            },
            {
              question: "What does the hands-on step “Implement hashing” involve?",
              options: [
                "Hash the serialized block with SHA-256. Store the hex digest and recompute it on validation instead of trusting the stored value.",
                "Use Ed25519 or ECDSA: sign the transaction hash with the sender's private key and verify with the public key. Reject a signature that does not match the sender.",
                "A fresh node requests the chain from a peer, validates from genesis, then subscribes to new blocks. Refuse to serve an invalid chain.",
                "On receiving a chain, validate every block and adopt it only if it is longer than the current chain. Ties keep the existing chain to avoid churn.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Implement hashing” as: Hash the serialized block with SHA-256. Store the hex digest and recompute it on validation instead of trusting the stored value.",
            },
          ],
          flashcards: [
            {
              front: "Genesis block",
              back: "The first block in a blockchain; index 0, no previous hash",
            },
            {
              front: "Block hash",
              back: "Computed from block's own contents; links to previous block",
            },
            {
              front: "How do you define the block fields?",
              back: "Include index, timestamp, transactions, previous hash, nonce, and hash. Serialize fields in a fixed order so hashing is deterministic.",
            },
            {
              front: "How do you create the genesis block?",
              back: "Hard-code index 0 with no previous hash and a fixed timestamp. Every node must produce the same genesis hash or they will reject each other.",
            },
            {
              front: "How do you implement hashing?",
              back: "Hash the serialized block with SHA-256. Store the hex digest and recompute it on validation instead of trusting the stored value.",
            },
          ],
          sourceRef: {
            label: "Block structure",
            pageStart: null,
            pageEnd: null,
            note: "Block: index, timestamp, txs, proof, prev_hash, hash; hash links blocks",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Proof-of-Work and Mining",
      summary: "Implement proof-of-work: finding a hash that meets a difficulty target.",
      lessons: [
        {
          title: "Proof-of-Work Algorithm",
          objective: "Implement a function that finds a proof value where hash(proof + previous_proof) starts with N leading zeros.",
          hook: "Proof-of-work is the mechanism that makes mining expensive and secures the network.",
          paragraphs: [
            "Proof-of-work requires finding a number (proof) such that the SHA-256 hash of (previous_proof + proof) begins with a certain number of leading zeros. The difficulty is adjusted by changing the number of required leading zeros. Mining is the process of searching for this proof, which requires on average 2^difficulty attempts.",
          ],
          bullets: [
            "Define difficulty: number of leading zeros required in the hash",
            "Compute SHA-256 hash of (previous_proof + proof) as a hex string",
            "Iterate proof values starting from 1 until hash condition is met",
            "Higher difficulty = more computational work required",
          ],
          steps: [
            {
              title: "Define the difficulty target",
              detail: "Require the block hash to start with N hexadecimal zeros. Store the difficulty in the block so other nodes can verify it.",
            },
            {
              title: "Mine with a nonce loop",
              detail: "Increment the nonce, recompute the hash, and stop when it meets the target. Print attempts per second so you can see the cost grow with N.",
            },
            {
              title: "Verify cheaply",
              detail: "Validation rehashes once and checks the prefix. Mining is expensive; verification must stay constant time.",
            },
            {
              title: "Adjust difficulty",
              detail: "Measure the time for a fixed number of blocks. If it is below target, raise the difficulty; if above, lower it. Clamp changes to avoid oscillation.",
            },
            {
              title: "Test determinism",
              detail: "Mine the same block twice with the same starting nonce and confirm the found nonce and hash are identical.",
            },
          ],
          takeaway: "Proof-of-work makes block creation computationally expensive, preventing spam and securing the blockchain.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "hash",
                from: "prev",
                label: "input",
              },
              {
                to: "hash",
                from: "proof",
                label: "input",
              },
              {
                to: "target",
                from: "hash",
                label: "compare zeros",
              },
            ],
            nodes: [
              {
                id: "prev",
                label: "previous_proof",
                emphasis: true,
              },
              {
                id: "proof",
                label: "proof (being searched)",
                emphasis: true,
              },
              {
                id: "hash",
                label: "SHA-256(prev + proof)",
                emphasis: true,
              },
              {
                id: "target",
                label: "leading zeros condition",
                emphasis: true,
              },
            ],
            title: "Proof-of-work loop",
          },
          quiz: {
            question: "What is the purpose of proof-of-work in a blockchain?",
            options: [
              "To randomly select the next block creator",
              "To make block creation computationally expensive",
              "To encrypt transaction data",
              "To store data efficiently",
            ],
            correctIndex: 1,
            explanation: "PoW requires finding a hash with leading zeros, making block creation costly and securing the network against attacks.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Proof-of-Work Algorithm”?",
              options: [
                "Block contains index, timestamp, transactions, proof, previous_hash",
                "Define difficulty: number of leading zeros required in the hash",
                "Transaction has sender, receiver, amount, and signature fields",
                "Longest-chain rule: the chain with the most proof-of-work is valid",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Define difficulty: number of leading zeros required in the hash”",
            },
            {
              question: "Which statement best explains “Proof-of-work”?",
              options: [
                "Computed from block's own contents; links to previous block",
                "Sender → Receiver + Amount; signed by sender's private key",
                "Finding a hash with leading zeros; computational cost secures the network",
                "The chain with the most proof-of-work is the valid one",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Finding a hash with leading zeros; computational cost secures the network”",
            },
            {
              question: "Which of these is a hands-on step in “Proof-of-Work Algorithm”?",
              options: [
                "Validate against balances",
                "Define the wire messages",
                "Handle forks",
                "Define the difficulty target",
              ],
              correctIndex: 3,
              explanation: "“Define the difficulty target” is part of this lesson's sequence: Require the block hash to start with N hexadecimal zeros. Store the difficulty in the block so other nodes can verify it.",
            },
            {
              question: "What does the hands-on step “Mine with a nonce loop” involve?",
              options: [
                "Increment the nonce, recompute the hash, and stop when it meets the target. Print attempts per second so you can see the cost grow with N.",
                "Try a tampered amount, a wrong key, a negative value, a duplicate id, and an overdraft. Each must be rejected with a distinct reason.",
                "Use Ed25519 or ECDSA: sign the transaction hash with the sender's private key and verify with the public key. Reject a signature that does not match the sender.",
                "A fresh node requests the chain from a peer, validates from genesis, then subscribes to new blocks. Refuse to serve an invalid chain.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Mine with a nonce loop” as: Increment the nonce, recompute the hash, and stop when it meets the target. Print attempts per second so you can see the cost grow with N.",
            },
          ],
          flashcards: [
            {
              front: "Proof-of-work",
              back: "Finding a hash with leading zeros; computational cost secures the network",
            },
            {
              front: "Difficulty",
              back: "Number of leading zeros required in the block hash",
            },
            {
              front: "How do you verify cheaply?",
              back: "Validation rehashes once and checks the prefix. Mining is expensive; verification must stay constant time.",
            },
            {
              front: "How do you define the difficulty target?",
              back: "Require the block hash to start with N hexadecimal zeros. Store the difficulty in the block so other nodes can verify it.",
            },
            {
              front: "How do you mine with a nonce loop?",
              back: "Increment the nonce, recompute the hash, and stop when it meets the target. Print attempts per second so you can see the cost grow with N.",
            },
          ],
          sourceRef: {
            label: "Proof-of-work",
            pageStart: null,
            pageEnd: null,
            note: "Find hash(prev_proof || proof) with N leading zeros; difficulty adjusts N",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Transactions and the Mempool",
      summary: "Implement transactions: creating, validating, and holding pending transactions.",
      lessons: [
        {
          title: "Creating and Validating Transactions",
          objective: "Implement a Transaction type with sender, receiver, amount, and a digital signature.",
          hook: "Transactions are the reason a blockchain has value: they move assets between participants.",
          paragraphs: [
            "A transaction records a transfer of value from one address to another. It includes a sender (public key or address), a receiver (address), an amount, and a digital signature proving the sender authorized the transfer. Transactions enter the system via a mempool (memory pool) of pending transactions waiting to be included in a block.",
          ],
          bullets: [
            "Transaction has sender, receiver, amount, and signature fields",
            "Signature proves the sender owns the sending address",
            "Transactions reside in the mempool until included in a block",
            "Each transaction must have sufficient balance in the sender's account",
          ],
          steps: [
            {
              title: "Define the transaction shape",
              detail: "Include sender, recipient, amount, a unique id, and a signature field. Serialize deterministically before signing.",
            },
            {
              title: "Sign and verify",
              detail: "Use Ed25519 or ECDSA: sign the transaction hash with the sender's private key and verify with the public key. Reject a signature that does not match the sender.",
            },
            {
              title: "Add a mempool",
              detail: "Keep pending transactions in an ordered pool. Drop duplicates by id and reject transactions that fail signature or balance checks.",
            },
            {
              title: "Validate against balances",
              detail: "Replay confirmed transactions to compute balances, then check the sender can afford the amount plus a fee. Handle the same address sending twice in one block.",
            },
            {
              title: "Test bad inputs",
              detail: "Try a tampered amount, a wrong key, a negative value, a duplicate id, and an overdraft. Each must be rejected with a distinct reason.",
            },
          ],
          takeaway: "Transactions are the atomic units of state change on the blockchain; validation ensures no double-spending.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "tx",
                from: "sender",
                label: "signs",
              },
              {
                to: "mempool",
                from: "tx",
                label: "enters",
              },
              {
                to: "block",
                from: "tx",
                label: "included by miner",
              },
            ],
            nodes: [
              {
                id: "sender",
                label: "sender address",
                emphasis: true,
              },
              {
                id: "receiver",
                label: "receiver address",
                emphasis: true,
              },
              {
                id: "amount",
                label: "amount",
                emphasis: true,
              },
              {
                id: "sig",
                label: "digital signature",
                emphasis: true,
              },
              {
                id: "mempool",
                label: "pending txs",
                emphasis: true,
              },
            ],
            title: "Transaction flow",
          },
          quiz: {
            question: "Where do pending transactions wait before being mined?",
            options: [
              "The chain",
              "The ledger",
              "The mempool",
              "The genesis block",
            ],
            correctIndex: 2,
            explanation: "The mempool is the holding area for valid transactions waiting to be included in the next block.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Creating and Validating Transactions”?",
              options: [
                "Block contains index, timestamp, transactions, proof, previous_hash",
                "Define difficulty: number of leading zeros required in the hash",
                "Transaction has sender, receiver, amount, and signature fields",
                "Longest-chain rule: the chain with the most proof-of-work is valid",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Transaction has sender, receiver, amount, and signature fields”",
            },
            {
              question: "Which statement best explains “Transaction”?",
              options: [
                "Computed from block's own contents; links to previous block",
                "Finding a hash with leading zeros; computational cost secures the network",
                "The chain with the most proof-of-work is the valid one",
                "Sender → Receiver + Amount; signed by sender's private key",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Sender → Receiver + Amount; signed by sender's private key”",
            },
            {
              question: "Which of these is a hands-on step in “Creating and Validating Transactions”?",
              options: [
                "Define the difficulty target",
                "Mine with a nonce loop",
                "Test determinism",
                "Define the transaction shape",
              ],
              correctIndex: 3,
              explanation: "“Define the transaction shape” is part of this lesson's sequence: Include sender, recipient, amount, a unique id, and a signature field. Serialize deterministically before signing.",
            },
            {
              question: "What does the hands-on step “Sign and verify” involve?",
              options: [
                "Use Ed25519 or ECDSA: sign the transaction hash with the sender's private key and verify with the public key. Reject a signature that does not match the sender.",
                "Every fixed number of blocks, compare actual elapsed time with the target and adjust the leading-zero requirement within bounds.",
                "Generate a key pair, sign the canonical transaction bytes, and reject any transaction whose signature or nonce does not verify.",
                "Hash transaction ids in pairs up to one root, store the root in the header, and verify a sibling path for one transaction.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Sign and verify” as: Use Ed25519 or ECDSA: sign the transaction hash with the sender's private key and verify with the public key. Reject a signature that does not match the sender.",
            },
          ],
          flashcards: [
            {
              front: "Transaction",
              back: "Sender → Receiver + Amount; signed by sender's private key",
            },
            {
              front: "Mempool",
              back: "Pool of valid, unmined transactions waiting for block inclusion",
            },
            {
              front: "How do you sign and verify?",
              back: "Use Ed25519 or ECDSA: sign the transaction hash with the sender's private key and verify with the public key. Reject a signature that does not match the sender.",
            },
            {
              front: "How do you add a mempool?",
              back: "Keep pending transactions in an ordered pool. Drop duplicates by id and reject transactions that fail signature or balance checks.",
            },
            {
              front: "How do you define the transaction shape?",
              back: "Include sender, recipient, amount, a unique id, and a signature field. Serialize deterministically before signing.",
            },
          ],
          sourceRef: {
            label: "Transactions",
            pageStart: null,
            pageEnd: null,
            note: "Tx: sender, receiver, amount, sig; held in mempool until mined",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Consensus and the P2P Network",
      summary: "Implement a minimal P2P network and consensus mechanism for block propagation.",
      lessons: [
        {
          title: "Network Consensus",
          objective: "Implement a simple consensus rule: the longest chain is the valid one.",
          hook: "Network nodes agree on the true state of the blockchain through consensus.",
          paragraphs: [
            "In a decentralized network, multiple nodes may mine blocks simultaneously. Consensus is achieved by the rule that the longest (most work) chain is the authoritative one. When a node receives a new block, it validates it and, if valid, replaces its chain if the new chain is longer. Nodes also gossip blocks to each other to propagate new blocks across the network.",
          ],
          bullets: [
            "Longest-chain rule: the chain with the most proof-of-work is valid",
            "Block propagation: gossip new blocks to network peers",
            "Validation: verify proof-of-work and transaction validity on block receipt",
            "Chain reorganization: replace your chain if a longer valid one appears",
          ],
          steps: [
            {
              title: "Define the wire messages",
              detail: "Use JSON messages for `hello`, `get_blocks`, `blocks`, and `new_block`. Include protocol version and chain height so peers can decide what to send.",
            },
            {
              title: "Implement the longest-chain rule",
              detail: "On receiving a chain, validate every block and adopt it only if it is longer than the current chain. Ties keep the existing chain to avoid churn.",
            },
            {
              title: "Handle forks",
              detail: "When a competing branch arrives, validate it independently, compare cumulative work or length, and reorg to the winner. Re-add orphaned transactions to the mempool.",
            },
            {
              title: "Sync a new node",
              detail: "A fresh node requests the chain from a peer, validates from genesis, then subscribes to new blocks. Refuse to serve an invalid chain.",
            },
            {
              title: "Test with two nodes",
              detail: "Run two processes, mine on each, and confirm both converge on the same chain. Partition them, mine different lengths, reconnect, and verify the longer chain wins.",
            },
          ],
          takeaway: "Consensus ensures all nodes agree on the same chain, even without a central authority.",
          diagram: {
            type: "cycle",
            edges: [
              {
                to: "block",
                from: "node",
                label: "receives",
              },
              {
                to: "gossip",
                from: "block",
                label: "propagates",
              },
              {
                to: "validate",
                from: "block",
                label: "verifies",
              },
              {
                to: "replace",
                from: "validate",
                label: "if longer",
              },
              {
                to: "chain",
                from: "replace",
                label: "updates",
              },
              {
                to: "node",
                from: "chain",
                label: "holds",
              },
            ],
            nodes: [
              {
                id: "node",
                label: "Node",
                emphasis: true,
              },
              {
                id: "chain",
                label: "Local chain",
                emphasis: true,
              },
              {
                id: "block",
                label: "New block",
                emphasis: true,
              },
              {
                id: "gossip",
                label: "Propagate block",
                emphasis: true,
              },
              {
                id: "replace",
                label: "Chain replace",
                emphasis: true,
              },
            ],
            title: "Consensus cycle",
          },
          quiz: {
            question: "What rule determines the valid chain in a decentralized network?",
            options: [
              "The first chain seen",
              "The richest chain",
              "The longest chain (most proof-of-work)",
              "The chain with the most transactions",
            ],
            correctIndex: 2,
            explanation: "Nodes accept the chain with the most accumulated proof-of-work as the truth.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Network Consensus”?",
              options: [
                "Block contains index, timestamp, transactions, proof, previous_hash",
                "Define difficulty: number of leading zeros required in the hash",
                "Transaction has sender, receiver, amount, and signature fields",
                "Longest-chain rule: the chain with the most proof-of-work is valid",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Longest-chain rule: the chain with the most proof-of-work is valid”",
            },
            {
              question: "Which statement best explains “Longest-chain rule”?",
              options: [
                "The chain with the most proof-of-work is the valid one",
                "Computed from block's own contents; links to previous block",
                "Finding a hash with leading zeros; computational cost secures the network",
                "Sender → Receiver + Amount; signed by sender's private key",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “The chain with the most proof-of-work is the valid one”",
            },
            {
              question: "Which of these is a hands-on step in “Network Consensus”?",
              options: [
                "Sign and verify",
                "Test bad inputs",
                "Validate against balances",
                "Define the wire messages",
              ],
              correctIndex: 3,
              explanation: "“Define the wire messages” is part of this lesson's sequence: Use JSON messages for `hello`, `get_blocks`, `blocks`, and `new_block`. Include protocol version and chain height so peers can decide what to send.",
            },
            {
              question: "What does the hands-on step “Implement the longest-chain rule” involve?",
              options: [
                "On receiving a chain, validate every block and adopt it only if it is longer than the current chain. Ties keep the existing chain to avoid churn.",
                "Hash transaction ids in pairs up to one root, store the root in the header, and verify a sibling path for one transaction.",
                "Sort pending transactions by fee per byte and evict the lowest-value entries when the pool is full.",
                "Start two nodes, mine a block on each, exchange chains, and confirm both converge. Submit a signed transaction, mine it, and verify the balance and a Merkle inclusion proof.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Implement the longest-chain rule” as: On receiving a chain, validate every block and adopt it only if it is longer than the current chain. Ties keep the existing chain to avoid churn.",
            },
          ],
          flashcards: [
            {
              front: "Longest-chain rule",
              back: "The chain with the most proof-of-work is the valid one",
            },
            {
              front: "Gossip protocol",
              back: "Nodes propagate new blocks to their peers",
            },
            {
              front: "How do you handle forks?",
              back: "When a competing branch arrives, validate it independently, compare cumulative work or length, and reorg to the winner. Re-add orphaned transactions to the mempool.",
            },
            {
              front: "How do you implement the longest-chain rule?",
              back: "On receiving a chain, validate every block and adopt it only if it is longer than the current chain. Ties keep the existing chain to avoid churn.",
            },
            {
              front: "How do you define the wire messages?",
              back: "Use JSON messages for `hello`, `get_blocks`, `blocks`, and `new_block`. Include protocol version and chain height so peers can decide what to send.",
            },
          ],
          sourceRef: {
            label: "Consensus",
            pageStart: null,
            pageEnd: null,
            note: "Longest-chain rule; block gossip; validation on receipt; chain reorganization",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Capstone: From Toy Chain to Usable Ledger",
      summary: "Signatures, Merkle commitments, difficulty adjustment, fork choice, and the scaling layer that separate a demo chain from a ledger.",
      lessons: [
        {
          title: "Capstone: Signatures, Merkle Trees, Forks, and Scaling",
          objective: "Implement ownership, tamper evidence, consensus under competing chains, and a scaling extension on top of the basic block-and-PoW loop.",
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
              detail: "Generate a key pair, sign the canonical transaction bytes, and reject any transaction whose signature or nonce does not verify.",
            },
            {
              title: "Build a Merkle root",
              detail: "Hash transaction ids in pairs up to one root, store the root in the header, and verify a sibling path for one transaction.",
            },
            {
              title: "Implement difficulty retargeting",
              detail: "Every fixed number of blocks, compare actual elapsed time with the target and adjust the leading-zero requirement within bounds.",
            },
            {
              title: "Choose a fork rule",
              detail: "Track total accumulated work per branch, switch to the heavier branch, and requeue transactions from abandoned blocks.",
            },
            {
              title: "Add fee-based mempool ordering",
              detail: "Sort pending transactions by fee per byte and evict the lowest-value entries when the pool is full.",
            },
            {
              title: "Sketch a scaling path",
              detail: "Compare an optimistic rollup with a payment channel: what executes off-chain, what data returns on-chain, and who can challenge a bad result.",
            },
            {
              title: "Run the finished artifact",
              detail: "Start two nodes, mine a block on each, exchange chains, and confirm both converge. Submit a signed transaction, mine it, and verify the balance and a Merkle inclusion proof.",
            },
          ],
          takeaway: "A usable ledger adds cryptographic ownership, a whole-block commitment, an explicit fork-choice and finality story, and a scaling design to the basic hash chain and mining loop.",
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
                label: "Add key pairs and signatures",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Build a Merkle root",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Implement difficulty retargeting",
                emphasis: false,
              },
              {
                id: "step-4",
                label: "Sketch a scaling path",
                emphasis: true,
              },
            ],
            title: "How Capstone: Signatures, Merkle Trees, Forks, and Scaling works",
          },
          quiz: {
            question: "What does a transaction signature prove?",
            options: [
              "That the sender authorized the transaction fields",
              "That the transaction fee is sufficient",
              "That the block has enough proof of work",
              "That the receiver is online",
            ],
            correctIndex: 0,
            explanation: "The signature binds the sender's key to the exact transaction bytes. Fee and block validity are separate checks.",
          },
          extraQuestions: [
            {
              question: "Why is the Merkle root stored in the block header?",
              options: [
                "It encrypts every transaction",
                "It commits the header to all transactions in the block",
                "It replaces the proof-of-work hash",
                "It stores the sender's private key",
              ],
              correctIndex: 1,
              explanation: "Changing any transaction changes the root, so the PoW-covered header commits to the entire transaction set. It also enables inclusion proofs.",
            },
            {
              question: "In a Bitcoin-style chain, which branch wins a fork?",
              options: [
                "The branch with the most accumulated work",
                "The branch with the most transactions",
                "The branch announced first",
                "The branch with the lowest difficulty",
              ],
              correctIndex: 0,
              explanation: "Nodes follow the branch with the greatest total proof of work, which is usually but not always the longest chain.",
            },
            {
              question: "What happens to transactions in an orphaned block after a reorg?",
              options: [
                "They are permanently deleted",
                "They usually return to the mempool for inclusion elsewhere",
                "They become invalid signatures",
                "They are merged into the new block automatically",
              ],
              correctIndex: 1,
              explanation: "A reorg removes the block from the canonical chain; its valid transactions are typically re-added to the mempool.",
            },
            {
              question: "What does a rollup post back to the base chain?",
              options: [
                "Every execution step",
                "Compressed transaction data or a validity proof",
                "Only the miner's private key",
                "Nothing at all",
              ],
              correctIndex: 1,
              explanation: "Rollups execute off-chain but post data or proofs on-chain so users can reconstruct state and challenge invalid results.",
            },
          ],
          flashcards: [
            {
              front: "Fork choice",
              back: "The rule nodes use to select the canonical branch, such as the most accumulated proof of work or an explicit finality gadget.",
            },
            {
              front: "Merkle root",
              back: "A single hash committing to all transactions in a block; stored in the header and used for compact inclusion proofs.",
            },
            {
              front: "Transaction signature",
              back: "A cryptographic signature over canonical transaction fields that proves the sender authorized the transfer; paired with a nonce or chain id for replay protection.",
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
          sourceRef: {
            label: "Build Your Own Blockchain capstone",
            pageStart: null,
            pageEnd: null,
            note: "Complete build path from blocks and PoW through transactions and consensus, extended with signatures, Merkle commitments, fork choice, difficulty, fees, and scaling.",
            sectionIndexes: [],
          },
          estimatedMinutes: 12,
        },
      ],
    },
  ],
};
