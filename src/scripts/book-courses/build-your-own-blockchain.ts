import type { DraftCourse } from "./types";

/**
 * "Build Your Own Blockchain" — CodeCrafters-style tutorial.
 * Covers: blocks, chains, proof-of-work, mining, transactions, P2P network,
 * consensus, and a simple cryptocurrency.
 * Typical 20-30 step guided tutorial from the build-your-own-x repo (golang-blockchain).
 */
export const bcCourse: DraftCourse = {
  title: "Build Your Own Blockchain",
  description:
    "Implement a minimal blockchain from scratch: data structures for blocks and chains, proof-of-work mining, transaction handling, a minimal P2P network, and a consensus mechanism. Learn how distributed consensus and cryptographic linking secure decentralized systems.",
  category: "Blockchain",
  level: "intermediate",
  coverEmoji: "⛓️",
  tags: ["blockchain", "cryptocurrency", "distributed-systems", "consensus", "proof-of-work"],
  modules: [
    {
      title: "Blockchain fundamentals: Blocks and Chains",
      summary:
        "Define the data structures for blocks, chains, and the genesis block.",
      lessons: [
        {
          title: "Defining the Block Structure",
          objective:
            "Implement a Block type that contains an index, timestamp, transactions, proof, and hash.",
          hook:
            "The block is the fundamental data structure of a blockchain.",
          paragraphs: [
            "A block stores a batch of transactions, a reference to the previous block (via its hash), a proof-of-work value, and a timestamp. You'll define a Block struct with fields: index, timestamp, transactions (list), proof (int), and previous_hash (string). The hash of each block is computed from its contents, linking blocks together.",
          ],
          bullets: [
            "Block contains index, timestamp, transactions, proof, previous_hash",
            "Each block's hash is computed from its own contents",
            "The genesis block has index 0 and no previous_hash",
            "The hash links blocks: changing any data breaks the chain",
          ],
          takeaway:
            "The block's fields and hash computation are the foundation that makes a blockchain tamper-evident.",
          diagram: {
            type: "process",
            title: "Block structure",
            nodes: [
              { id: "idx", label: "index", emphasis: true },
              { id: "ts", label: "timestamp", emphasis: true },
              { id: "txs", label: "transactions", emphasis: true },
              { id: "prf", label: "proof", emphasis: true },
              { id: "ph", label: "previous_hash", emphasis: true },
              { id: "hsh", label: "hash", emphasis: true },
            ],
            edges: [
              { from: "idx", to: "hsh", label: "contributes to" },
              { from: "ts", to: "hsh", label: "contributes to" },
              { from: "txs", to: "hsh", label: "contributes to" },
              { from: "prf", to: "hsh", label: "contributes to" },
              { from: "ph", to: "hsh", label: "contributes to" },
            ],
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
            explanation:
              "Each block stores the hash of its predecessor, creating the chain.",
          },
          flashcards: [
            {
              front: "Block hash",
              back: "Computed from block's own contents; links to previous block",
            },
            {
              front: "Genesis block",
              back: "The first block in a blockchain; index 0, no previous hash",
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
      summary:
        "Implement proof-of-work: finding a hash that meets a difficulty target.",
      lessons: [
        {
          title: "Proof-of-Work Algorithm",
          objective:
            "Implement a function that finds a proof value where hash(proof + previous_proof) starts with N leading zeros.",
          hook:
            "Proof-of-work is the mechanism that makes mining expensive and secures the network.",
          paragraphs: [
            "Proof-of-work requires finding a number (proof) such that the SHA-256 hash of (previous_proof + proof) begins with a certain number of leading zeros. The difficulty is adjusted by changing the number of required leading zeros. Mining is the process of searching for this proof, which requires on average 2^difficulty attempts.",
          ],
          bullets: [
            "Define difficulty: number of leading zeros required in the hash",
            "Compute SHA-256 hash of (previous_proof + proof) as a hex string",
            "Iterate proof values starting from 1 until hash condition is met",
            "Higher difficulty = more computational work required",
          ],
          takeaway:
            "Proof-of-work makes block creation computationally expensive, preventing spam and securing the blockchain.",
          diagram: {
            type: "process",
            title: "Proof-of-work loop",
            nodes: [
              { id: "prev", label: "previous_proof", emphasis: true },
              { id: "proof", label: "proof (being searched)", emphasis: true },
              { id: "hash", label: "SHA-256(prev + proof)", emphasis: true },
              { id: "target", label: "leading zeros condition", emphasis: true },
            ],
            edges: [
              { from: "prev", to: "hash", label: "input" },
              { from: "proof", to: "hash", label: "input" },
              { from: "hash", to: "target", label: "compare zeros" },
            ],
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
            explanation:
              "PoW requires finding a hash with leading zeros, making block creation costly and securing the network against attacks.",
          },
          flashcards: [
            {
              front: "Proof-of-work",
              back: "Finding a hash with leading zeros; computational cost secures the network",
            },
            {
              front: "Difficulty",
              back: "Number of leading zeros required in the block hash",
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
      summary:
        "Implement transactions: creating, validating, and holding pending transactions.",
      lessons: [
        {
          title: "Creating and Validating Transactions",
          objective:
            "Implement a Transaction type with sender, receiver, amount, and a digital signature.",
          hook:
            "Transactions are the reason a blockchain has value: they move assets between participants.",
          paragraphs: [
            "A transaction records a transfer of value from one address to another. It includes a sender (public key or address), a receiver (address), an amount, and a digital signature proving the sender authorized the transfer. Transactions enter the system via a mempool (memory pool) of pending transactions waiting to be included in a block.",
          ],
          bullets: [
            "Transaction has sender, receiver, amount, and signature fields",
            "Signature proves the sender owns the sending address",
            "Transactions reside in the mempool until included in a block",
            "Each transaction must have sufficient balance in the sender's account",
          ],
          takeaway:
            "Transactions are the atomic units of state change on the blockchain; validation ensures no double-spending.",
          diagram: {
            type: "process",
            title: "Transaction flow",
            nodes: [
              { id: "sender", label: "sender address", emphasis: true },
              { id: "receiver", label: "receiver address", emphasis: true },
              { id: "amount", label: "amount", emphasis: true },
              { id: "sig", label: "digital signature", emphasis: true },
              { id: "mempool", label: "pending txs", emphasis: true },
            ],
            edges: [
              { from: "sender", to: "tx", label: "signs" },
              { from: "tx", to: "mempool", label: "enters" },
              { from: "tx", to: "block", label: "included by miner" },
            ],
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
            explanation:
              "The mempool is the holding area for valid transactions waiting to be included in the next block.",
          },
          flashcards: [
            {
              front: "Transaction",
              back: "Sender → Receiver + Amount; signed by sender's private key",
            },
            {
              front: "Mempool",
              back: "Pool of valid, unmined transactions waiting for block inclusion",
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
      summary:
        "Implement a minimal P2P network and consensus mechanism for block propagation.",
      lessons: [
        {
          title: "Network Consensus",
          objective:
            "Implement a simple consensus rule: the longest chain is the valid one.",
          hook:
            "Network nodes agree on the true state of the blockchain through consensus.",
          paragraphs: [
            "In a decentralized network, multiple nodes may mine blocks simultaneously. Consensus is achieved by the rule that the longest (most work) chain is the authoritative one. When a node receives a new block, it validates it and, if valid, replaces its chain if the new chain is longer. Nodes also gossip blocks to each other to propagate new blocks across the network.",
          ],
          bullets: [
            "Longest-chain rule: the chain with the most proof-of-work is valid",
            "Block propagation: gossip new blocks to network peers",
            "Validation: verify proof-of-work and transaction validity on block receipt",
            "Chain reorganization: replace your chain if a longer valid one appears",
          ],
          takeaway:
            "Consensus ensures all nodes agree on the same chain, even without a central authority.",
          diagram: {
            type: "cycle",
            title: "Consensus cycle",
            nodes: [
              { id: "node", label: "Node", emphasis: true },
              { id: "chain", label: "Local chain", emphasis: true },
              { id: "block", label: "New block", emphasis: true },
              { id: "gossip", label: "Propagate block", emphasis: true },
              { id: "replace", label: "Chain replace", emphasis: true },
            ],
            edges: [
              { from: "node", to: "block", label: "receives" },
              { from: "block", to: "gossip", label: "propagates" },
              { from: "block", to: "validate", label: "verifies" },
              { from: "validate", to: "replace", label: "if longer" },
              { from: "replace", to: "chain", label: "updates" },
              { from: "chain", to: "node", label: "holds" },
            ],
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
            explanation:
              "Nodes accept the chain with the most accumulated proof-of-work as the truth.",
          },
          flashcards: [
            {
              front: "Longest-chain rule",
              back: "The chain with the most proof-of-work is the valid one",
            },
            {
              front: "Gossip protocol",
              back: "Nodes propagate new blocks to their peers",
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
  ],
};