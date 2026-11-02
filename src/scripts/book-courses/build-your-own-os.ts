import type { DraftCourse } from "./types";

/**
 * "Build Your Own Operating System" — CodeCrafters-style tutorial.
 * Typical 20-30 step guided tutorial from the build-your-own-x repo.
 */
export const osCourse: DraftCourse = {
  title: "Build Your Own Operating System",
  description:
    "A hands-on guided tour through building a minimal x86 operating system from scratch: bootloader, kernel entry, memory management, process scheduling, filesystem, and a simple shell. Learn how an OS actually starts up and manages hardware.",
  category: "Systems",
  level: "intermediate",
  coverEmoji: "🖥️",
  tags: ["os", "kernel", "bootloader", "x86", "systems programming"],
  modules: [
    {
      title: "Getting Started: Boot and Bare Metal",
      summary:
        "Setting up the development environment, writing a bootloader, and entering protected mode.",
      lessons: [
        {
          title: "Bootloader Basics: Real Mode to Protected Mode",
          objective:
            "Understand how the BIOS hands off control and how to switch the CPU to protected mode.",
          hook:
            "The BIOS loads 512 bytes into memory and jumps to it — that's your entire OS start.",
          paragraphs: [
            "The first 512 bytes on disk are the boot sector. The BIOS loads it into memory at 0x7C00 and jumps there. From there, you're on your own: there is no OS, no libc, no OS APIs. You must set up a GDT, enable protected mode, and prepare to load your kernel.",
          ],
          bullets: [
            "BIOS loads boot sector to 0x7C00 and jumps there",
            "No runtime environment — you must set up everything",
            "GDT (Global Descriptor Table) is required for protected mode",
          ],
          takeaway:
            "A bootloader's job is minimal: switch to protected mode and load the kernel.",
          diagram: {
            type: "process",
            title: "Boot process: BIOS → bootloader → kernel",
            nodes: [
              { id: "bios", label: "BIOS boots", emphasis: false },
              { id: "boot", label: "Boot sector loaded at 0x7C00", emphasis: true },
              { id: "mode", label: "Switch to protected mode", emphasis: true },
              { id: "kernel", label: "Kernel is loaded", emphasis: false },
            ],
            edges: [
              { from: "bios", to: "boot", label: "jump" },
              { from: "boot", to: "mode", label: "set up GDT" },
              { from: "mode", to: "kernel", label: "load kernel" },
            ],
          },
          quiz: {
            question: "What does the BIOS do during boot?",
            options: [
              "Loads the boot sector (512 bytes) into memory at 0x7C00 and jumps to it",
              "Loads the entire operating system into RAM",
              "Initializes all device drivers",
              "Runs the kernel's main function",
            ],
            correctIndex: 0,
            explanation:
              "The BIOS only loads the first 512-byte boot sector and transfers control there. The rest is up to your bootloader.",
          },
          flashcards: [
            {
              front: "Boot sector size",
              back:
                "512 bytes — the first sector on disk, loaded by BIOS at address 0x7C00",
            },
            {
              front: "Protected mode",
              back:
                "CPU mode with memory protection, paging, and virtual address space — predecessor to long mode",
            },
          ],
          sourceRef: {
            label: "Bootloader entry",
            pageStart: null,
            pageEnd: null,
            note:
              "BIOS loads 512 bytes at 0x7C00 and jumps there; setting up GDT and protected mode",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Writing a Minimal Bootloader",
          objective:
            "Write a bootloader that switches to protected mode and prints a character to screen.",
          hook: "Your first line of real code on bare metal.",
          paragraphs: [
            "Using NASM or gcc, you'll write a bootloader that sets up a minimal GDT, enables the A20 line, turns on protected mode, and writes a character to video memory at 0xB8000. This is the 'Hello, world' of OS development.",
          ],
          bullets: [
            "Set up GDT with at least one code segment descriptor",
            "Enable the A20 line (address line 20, needed for >1MB memory)",
            "Set the PE bit in CR0 to enter protected mode",
            "Write to video memory at 0xB8000 (character + attribute byte)",
          ],
          takeaway:
            "A minimal bootloader does only what's needed to switch modes and display text — nothing more.",
          diagram: {
            type: "process",
            title: "Bootloader initialization flow",
            nodes: [
              { id: "gdt", label: "Set up GDT", emphasis: true },
              { id: "a20", label: "Enable A20 line", emphasis: false },
              { id: "pe", label: "Set PE bit in CR0", emphasis: true },
              { id: "video", label: "Write to 0xB8000", emphasis: false },
            ],
            edges: [
              { from: "gdt", to: "a20", label: "before protected mode" },
              { from: "a20", to: "pe", label: "GDT ready" },
              { from: "pe", to: "video", label: "in protected mode" },
            ],
          },
          quiz: {
            question: "What is the A20 line and why does it matter?",
            options: [
              "A20 is an address line that enables access to memory above 1MB; without it, the system wraps around at 1MB",
              "A20 is a keyboard controller signal",
              "A20 protects against buffer overflows",
              "A20 is the processor's power management line",
            ],
            correctIndex: 0,
            explanation:
              "The A20 line gates address bit 20. Without it, the CPU wraps physical addresses modulo 1MB, preventing access to extended memory — a classic bug in early OS development.",
          },
          flashcards: [
            {
              front: "GDT (Global Descriptor Table)",
              back:
                "A data structure used by the CPU to define memory segments and their access rights in protected mode",
            },
            {
              front: "Video memory address",
              back:
                "0xB8000 in text mode: each byte is a character, paired with an attribute byte for color/style",
            },
          ],
          sourceRef: {
            label: "Bootloader: writing to screen",
            pageStart: null,
            pageEnd: null,
            note:
              "Setting up GDT, A20 line, protected mode, writing to 0xB8000 video memory",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Kernel Foundations: Memory and Processes",
      summary:
        "Managing memory with a simple allocator, creating processes, and context switching.",
      lessons: [
        {
          title: "Simple Memory Allocator: Bump Pointer",
          objective:
            "Implement a bump-pointer allocator that manages a heap region in memory.",
          hook:
            "No more global array overflows — allocate from a growing pointer.",
          paragraphs: [
            "The simplest heap allocator imaginable: reserve a region of memory (e.g., the upper 384KB of the 1MB real-mode address space, or higher above 1MB with paging), store a 'bump' pointer, and advance it on each allocation. Free is not supported — this is for kernel bootstrapping where objects have known lifetimes.",
          ],
          bullets: [
            "Reserve a heap region at a fixed address",
            "Store a bump pointer starting at the region base",
            "Allocate by bumping the pointer forward by the aligned request size",
            "No fragmentation handling or deallocation",
          ],
          takeaway:
            "A bump allocator is fast and simple — ideal for kernel init where you know object lifetimes.",
          diagram: {
            type: "process",
            title: "Bump-pointer allocation",
            nodes: [
              { id: "heap", label: "Reserved heap region", emphasis: false },
              { id: "bp", label: "Bump pointer", emphasis: true },
              { id: "alloc", label: "Allocate: bp += size", emphasis: false },
            ],
            edges: [
              { from: "heap", to: "bp", label: "starts at base" },
              { from: "bp", to: "alloc", label: "advances on each alloc" },
            ],
          },
          quiz: {
            question: "What does a bump-pointer allocator NOT do?",
            options: [
              "Manage a heap region",
              "Track free blocks for reuse",
              "Advance a pointer on each allocation",
              "Allocate sequentially",
            ],
            correctIndex: 1,
            explanation:
              "A bump allocator never reuses freed memory — it just advances a pointer. For true heap management, you need a free-list or bit-map allocator.",
          },
          flashcards: [
            {
              front: "Bump-pointer allocator",
              back:
                "Allocate by advancing a pointer; never frees memory — use for short-lived kernel objects",
            },
            {
              front: "Heap region",
              back:
                "A reserved memory area used for dynamic allocation within the kernel",
            },
          ],
          sourceRef: {
            label: "Memory allocator",
            pageStart: null,
            pageEnd: null,
            note:
              "Bump-pointer allocator for kernel bootstrapping",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Process Scheduling: Cooperative Round-Robin",
          objective:
            "Implement a simple cooperative scheduler that runs one process at a time yielding control.",
          hook:
            "Multitasking without interrupts: each process runs until it yields.",
          paragraphs: [
            "A cooperative scheduler lets each process run briefly then explicitly yield control back to the scheduler. Unlike preemptive multitasking, it does not use hardware interrupts — each process must voluntarily call scheduler_yield(). This is suitable for educational OS kernels where interrupt handling is not yet implemented.",
          ],
          bullets: [
            "Maintain a run queue of process TCBs (task control blocks)",
            "Each process runs for a time slice then calls scheduler_yield()",
            "The scheduler saves/restores registers when switching",
            "No hardware timer interrupts needed — cooperative only",
          ],
          takeaway:
            "Cooperative multitasking is simpler than preemptive: no timer interrupts, but each process must remember to yield.",
          diagram: {
            type: "cycle",
            title: "Cooperative scheduler loop",
            nodes: [
              { id: "sched", label: "Scheduler", emphasis: true },
              { id: "run", label: "Run current process", emphasis: false },
              { id: "yield", label: "Process yields", emphasis: true },
            ],
            edges: [
              { from: "sched", to: "run", label: "dispatch" },
              { from: "run", to: "yield", label: "process finishes quantum" },
              { from: "yield", to: "sched", label: "switch to next" },
            ],
          },
          quiz: {
            question: "What distinguishes cooperative multitasking from preemptive?",
            options: [
              "Cooperative: processes yield voluntarily; Preemptive: OS uses timer interrupts",
              "Cooperative uses more memory",
              "Preemptive is slower",
              "There is no difference",
            ],
            correctIndex: 0,
            explanation:
              "In cooperative multitasking, processes decide when to switch. In preemptive, the OS kernel forces a switch via timer interrupts (e.g., every 10ms).",
          },
          flashcards: [
            {
              front: "Scheduler yield",
              back:
                "A function a process calls to voluntarily give up the CPU",
            },
            {
              front: "Run queue",
              back:
                "A queue of process TCBs waiting to be scheduled",
            },
          ],
          sourceRef: {
            label: "Cooperative scheduler",
            pageStart: null,
            pageEnd: null,
            note:
              "Run queue, TCB, yield-based switching, no timer interrupts",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Storage and Filesystem",
      summary:
        "Implementing a minimal filesystem (FAT16/minimal ext2) and reading files from disk.",
      lessons: [
        {
          title: "Minimal FAT16 Reader",
          objective:
            "Parse FAT16 directory entries and read file contents from a disk image.",
          hook:
            "Your OS can now load files from disk — time to do something useful.",
          paragraphs: [
            "FAT16 is the simplest widely-used filesystem. You'll learn to read the boot sector, parse the FAT table, follow cluster chains, and read directory entries and file data. This gives your OS the ability to load programs and resources from disk instead of embedding them binary.",
          ],
          bullets: [
            "Read the BPB (BIOS Parameter Block) from the disk boot sector",
            "Parse the FAT table to find cluster links",
            "Follow the cluster chain to find file data clusters",
            "Read directory entries (8.3 filenames, attributes, first cluster number)",
          ],
          takeaway:
            "FAT16 is simple enough to implement in a few hundred lines while teaching the core ideas of filesystem design: block allocation tables, cluster chains, and directory structures.",
          diagram: {
            type: "process",
            title: "FAT16 file lookup",
            nodes: [
              { id: "boot", label: "Boot sector / BPB", emphasis: false },
              { id: "fat", label: "FAT table lookup", emphasis: true },
              { id: "cluster", label: "Follow cluster chain", emphasis: false },
              { id: "data", label: "Read file data", emphasis: true },
            ],
            edges: [
              { from: "boot", to: "fat", label: "BPB gives FAT offset" },
              { from: "fat", to: "cluster", label: "find first cluster" },
              { from: "cluster", to: "data", label: "read clusters until EOF" },
            ],
          },
          quiz: {
            question: "What does the BPB (BIOS Parameter Block) contain?",
            options: [
              "Sector size, cluster size, reserved sectors, FAT copies, root directory size — everything the OS needs to parse the filesystem without guessing",
              "The kernel code and version string",
              "The list of all files on disk",
              "The interrupt descriptor table",
            ],
            correctIndex: 0,
            explanation:
              "The BPB is embedded in the first sector of the FAT16 volume and encodes the geometry and structure the OS needs to navigate the filesystem.",
          },
          flashcards: [
            {
              front: "FAT16 cluster",
              back:
                "A group of contiguous sectors; a file's data is stored across one or more clusters, linked by the FAT table",
            },
            {
              front: "BPB (BIOS Parameter Block)",
              back:
                "A data structure in the boot sector describing filesystem geometry: sector size, cluster size, reserved area size, etc.",
            },
          ],
          sourceRef: {
            label: "FAT16 filesystem",
            pageStart: null,
            pageEnd: null,
            note:
              "Boot sector, BPB, FAT table, cluster chain, directory entries",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Shell and Commands",
      summary:
        "A simple command-line interpreter with built-in commands and process execution.",
      lessons: [
        {
          title: "Simple Command Shell",
          objective:
            "Implement a shell that reads input, parses commands, executes external programs, and supports built-in commands (cd, exit).",
          hook:
            "Your OS now has a filesystem, a shell, and — almost — a usable system.",
          paragraphs: [
            "The shell is the user's primary interface to your OS. You'll read lines from stdin, split them into arguments, find the executable on disk, load it into memory, and jump to its entry point. Built-in commands like 'cd' (change current location in memory) and 'exit' (halt the CPU or return to the bootloader) are handled directly without loading a file.",
          ],
          bullets: [
            "Read a line of input from stdin (serial port or keyboard)",
            "Parse the line into a command name and argument vector (argv)",
            "Search for the executable on disk (check current directory, then PATH)",
            "Load the executable into memory at a fixed address and jump to its entry point",
          ],
          takeaway:
            "A shell bridges the gap between the raw OS services (file system, process loading) and the user — the final piece that makes an OS feel usable.",
          diagram: {
            type: "process",
            title: "Shell command loop",
            nodes: [
              { id: "read", label: "Read input", emphasis: true },
              { id: "parse", label: "Parse command", emphasis: false },
              { id: "exec", label: "Load + jump to program", emphasis: true },
              { id: "built", label: "Handle cd/exit", emphasis: false },
            ],
            edges: [
              { from: "read", to: "parse", label: "input line" },
              { from: "parse", to: "exec", label: "find and load program" },
              { from: "exec", to: "built", label: "is it a built-in?" },
              { from: "built", to: "read", label: "back to prompt" },
            ],
          },
          quiz: {
            question: "Which of the following is a built-in shell command?",
            options: ["ls", "cd", "cat", "grep"],
            correctIndex: 1,
            explanation:
              "cd (change directory) is a built-in because it modifies the shell's internal state (current working directory); ls, cat, grep are external programs.",
          },
          flashcards: [
            {
              front: "Shell command loop",
              back:
                "Read → Parse → Find executable → Load → Jump → Prompt (repeat)",
            },
            {
              front: "Built-in vs external command",
              back:
                "Built-in (cd, exit) runs inside the shell; external (ls, cat) loads and runs a separate program",
            },
          ],
          sourceRef: {
            label: "Simple shell",
            pageStart: null,
            pageEnd: null,
            note:
              "Input parsing, executable loading, built-in commands cd/exit",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
  ],
};