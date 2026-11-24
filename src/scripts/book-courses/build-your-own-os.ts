import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const osCourse: DraftCourse = {
  title: "Build Your Own Operating System",
  description: "A hands-on guided tour through building a minimal x86 operating system from scratch: bootloader, kernel entry, memory management, process scheduling, filesystem, and a simple shell. Learn how an OS actually starts up and manages hardware.",
  category: "Systems",
  level: "intermediate",
  coverEmoji: "🖥️",
  tags: [
    "os",
    "kernel",
    "bootloader",
    "x86",
    "systems programming",
  ],
  modules: [
    {
      title: "Getting Started: Boot and Bare Metal",
      summary: "Setting up the development environment, writing a bootloader, and entering protected mode.",
      lessons: [
        {
          title: "Bootloader Basics: Real Mode to Protected Mode",
          objective: "Understand how the BIOS hands off control and how to switch the CPU to protected mode.",
          hook: "The BIOS loads 512 bytes into memory and jumps to it — that's your entire OS start.",
          paragraphs: [
            "The first 512 bytes on disk are the boot sector. The BIOS loads it into memory at 0x7C00 and jumps there. From there, you're on your own: there is no OS, no libc, no OS APIs. You must set up a GDT, enable protected mode, and prepare to load your kernel.",
          ],
          bullets: [
            "BIOS loads boot sector to 0x7C00 and jumps there",
            "No runtime environment — you must set up everything",
            "GDT (Global Descriptor Table) is required for protected mode",
            "The boot sector is only 512 bytes, so it must load the rest of the kernel from disk using BIOS services before jumping to it.",
          ],
          steps: [
            {
              title: "Set up the project",
              detail: "Create boot/, kernel/, drivers/, fs/, and a Makefile that builds boot.bin, kernel.bin, and a disk image. Add a run target that launches QEMU so every later lesson boots the same image.",
            },
            {
              title: "Install the toolchain",
              detail: "Install nasm, qemu-system-i386, and gdb. Verify with `nasm -v` and `qemu-system-i386 --version` before writing any code.",
            },
            {
              title: "Create a 512-byte boot sector",
              detail: "Write boot.asm with `[bits 16]`, `[org 0x7c00]`, and a label. Assemble with `nasm -f bin boot.asm -o boot.bin` and confirm the file is exactly 512 bytes.",
            },
            {
              title: "Add the boot signature",
              detail: "Pad to byte 510 and append `dw 0xaa55`. The BIOS only treats the sector as bootable when those two bytes are present.",
            },
            {
              title: "Run it in QEMU",
              detail: "Boot with `qemu-system-i386 -drive format=raw,file=boot.bin`. Attach `-s -S` and connect gdb to inspect the first instruction at 0x7c00.",
            },
          ],
          takeaway: "A bootloader's job is minimal: switch to protected mode and load the kernel.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "boot",
                from: "bios",
                label: "jump",
              },
              {
                to: "mode",
                from: "boot",
                label: "set up GDT",
              },
              {
                to: "kernel",
                from: "mode",
                label: "load kernel",
              },
            ],
            nodes: [
              {
                id: "bios",
                label: "BIOS boots",
                emphasis: false,
              },
              {
                id: "boot",
                label: "Boot sector loaded at 0x7C00",
                emphasis: true,
              },
              {
                id: "mode",
                label: "Switch to protected mode",
                emphasis: true,
              },
              {
                id: "kernel",
                label: "Kernel is loaded",
                emphasis: false,
              },
            ],
            title: "Boot process: BIOS → bootloader → kernel",
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
            explanation: "The BIOS only loads the first 512-byte boot sector and transfers control there. The rest is up to your bootloader.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Bootloader Basics: Real Mode to Protected Mode”?",
              options: [
                "BIOS loads boot sector to 0x7C00 and jumps there",
                "Set up GDT with at least one code segment descriptor",
                "Reserve a heap region at a fixed address",
                "Maintain a run queue of process TCBs (task control blocks)",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “BIOS loads boot sector to 0x7C00 and jumps there”",
            },
            {
              question: "Which statement best explains “Boot sector size”?",
              options: [
                "A data structure used by the CPU to define memory segments and their access rights in protected mode",
                "512 bytes — the first sector on disk, loaded by BIOS at address 0x7C00",
                "Allocate by advancing a pointer; never frees memory — use for short-lived kernel objects",
                "A function a process calls to voluntarily give up the CPU",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “512 bytes — the first sector on disk, loaded by BIOS at address 0x7C00”",
            },
            {
              question: "Which of these is a hands-on step in “Bootloader Basics: Real Mode to Protected Mode”?",
              options: [
                "Add a timer tick",
                "Enable paging",
                "Enter user mode and trap back",
                "Install the toolchain",
              ],
              correctIndex: 3,
              explanation: "“Install the toolchain” is part of this lesson's sequence: Install nasm, qemu-system-i386, and gdb. Verify with `nasm -v` and `qemu-system-i386 --version` before writing any code.",
            },
            {
              question: "What does the hands-on step “Create a 512-byte boot sector” involve?",
              options: [
                "Write boot.asm with `[bits 16]`, `[org 0x7c00]`, and a label. Assemble with `nasm -f bin boot.asm -o boot.bin` and confirm the file is exactly 512 bytes.",
                "Boot the image, run ls to list the root directory, cat a known file, clear the screen, and run the external test program. Confirm each output matches the disk contents.",
                "Implement help, clear, echo, ls, cat, and exit using your FAT16 reader. Compare argv[0] against a table of names and call the matching function.",
                "Poll the keyboard or use your serial input, echo characters to VGA, handle backspace, and terminate on Enter.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Create a 512-byte boot sector” as: Write boot.asm with `[bits 16]`, `[org 0x7c00]`, and a label. Assemble with `nasm -f bin boot.asm -o boot.bin` and confirm the file is exactly 512 bytes.",
            },
          ],
          flashcards: [
            {
              front: "Protected mode",
              back: "CPU mode with memory protection, paging, and virtual address space — predecessor to long mode",
            },
            {
              front: "Boot sector size",
              back: "512 bytes — the first sector on disk, loaded by BIOS at address 0x7C00",
            },
            {
              front: "How do you install the toolchain?",
              back: "Install nasm, qemu-system-i386, and gdb. Verify with `nasm -v` and `qemu-system-i386 --version` before writing any code.",
            },
            {
              front: "How do you create a 512-byte boot sector?",
              back: "Write boot.asm with `[bits 16]`, `[org 0x7c00]`, and a label. Assemble with `nasm -f bin boot.asm -o boot.bin` and confirm the file is exactly 512 bytes.",
            },
            {
              front: "How do you add the boot signature?",
              back: "Pad to byte 510 and append `dw 0xaa55`. The BIOS only treats the sector as bootable when those two bytes are present.",
            },
          ],
          sourceRef: {
            label: "Bootloader entry",
            pageStart: null,
            pageEnd: null,
            note: "BIOS loads 512 bytes at 0x7C00 and jumps there; setting up GDT and protected mode",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Writing a Minimal Bootloader",
          objective: "Write a bootloader that switches to protected mode, loads the kernel from disk, and jumps to its entry point.",
          hook: "Your first line of real code on bare metal.",
          paragraphs: [
            "Using NASM or gcc, you'll write a bootloader that sets up a minimal GDT, loads the kernel from disk with BIOS int 0x13, enables the A20 line, turns on protected mode, and far-jumps to the kernel entry point. The kernel then writes characters to video memory at 0xB8000. This is the 'Hello, world' of OS development: the first 512 bytes hand control to code you wrote.",
          ],
          bullets: [
            "Set up a GDT with at least one code segment descriptor",
            "Enable the A20 line (address line 20, needed for >1MB memory)",
            "Load kernel.bin with BIOS int 0x13 while still in real mode",
            "Set the PE bit in CR0 to enter protected mode",
            "Far-jump to the kernel entry point so it runs in your flat code segment",
            "The boot sector must end with the 0xAA55 signature, or the BIOS will refuse to treat it as bootable.",
          ],
          steps: [
            {
              title: "Build a GDT",
              detail: "Define a null descriptor, a flat 32-bit code descriptor (base 0, limit 0xfffff, granularity 4K, access 0x9a), and a data descriptor (access 0x92). Load it with `lgdt [gdt_descriptor]`.",
            },
            {
              title: "Enable the A20 line",
              detail: "Use BIOS int 0x15, ax=0x2401, or the fast A20 port 0x92. Without A20, addresses above 1 MiB wrap around and your kernel cannot load.",
            },
            {
              title: "Load the kernel from disk",
              detail: "Still in real mode, call BIOS int 0x13, ah=0x02 to read the kernel's sectors into a known segment:offset such as 0x1000:0x0000 (physical 0x10000). Retry on carry set, and record how many sectors you read so the kernel entry address is fixed.",
            },
            {
              title: "Switch to protected mode",
              detail: "Set CR0 bit 0 (PE), then far-jump to a 32-bit code selector so the CPU reloads CS with the new descriptor.",
            },
            {
              title: "Jump to the kernel entry",
              detail: "Far-jump to the load address (0x10000) with your flat code segment selected. The kernel's first instructions should write a character to 0xB8000 and then spin in `cli; hlt` until you add interrupts.",
            },
            {
              title: "Verify the boot path",
              detail: "Run QEMU with `-d int` or attach gdb: CR0.PE must be 1, EIP must land at the kernel entry, and the kernel must print. A triple fault here means a bad GDT base, a wrapped address from A20, or a wrong load segment.",
            },
          ],
          takeaway: "A minimal bootloader does only what's needed to switch modes and display text — nothing more.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "a20",
                from: "gdt",
                label: "before protected mode",
              },
              {
                to: "pe",
                from: "a20",
                label: "GDT ready",
              },
              {
                to: "video",
                from: "pe",
                label: "in protected mode",
              },
            ],
            nodes: [
              {
                id: "gdt",
                label: "Set up GDT",
                emphasis: true,
              },
              {
                id: "a20",
                label: "Enable A20 line",
                emphasis: false,
              },
              {
                id: "pe",
                label: "Set PE bit in CR0",
                emphasis: true,
              },
              {
                id: "video",
                label: "Write to 0xB8000",
                emphasis: false,
              },
            ],
            title: "Bootloader initialization flow",
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
            explanation: "The A20 line gates address bit 20. Without it, the CPU wraps physical addresses modulo 1MB, preventing access to extended memory — a classic bug in early OS development.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Writing a Minimal Bootloader”?",
              options: [
                "BIOS loads boot sector to 0x7C00 and jumps there",
                "Set up a GDT with at least one code segment descriptor",
                "Reserve a heap region at a fixed address",
                "Maintain a run queue of process TCBs (task control blocks)",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Set up GDT with at least one code segment descriptor”",
            },
            {
              question: "Which statement best explains “GDT (Global Descriptor Table)”?",
              options: [
                "512 bytes — the first sector on disk, loaded by BIOS at address 0x7C00",
                "Allocate by advancing a pointer; never frees memory — use for short-lived kernel objects",
                "A data structure used by the CPU to define memory segments and their access rights in protected mode",
                "A function a process calls to voluntarily give up the CPU",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “A data structure used by the CPU to define memory segments and their access rights in protected mode”",
            },
            {
              question: "Which of these is a hands-on step in “Writing a Minimal Bootloader”?",
              options: [
                "Add the boot signature",
                "Create a 512-byte boot sector",
                "Install the toolchain",
                "Build a GDT",
              ],
              correctIndex: 3,
              explanation: "“Build a GDT” is part of this lesson's sequence: Define a null descriptor, a flat 32-bit code descriptor (base 0, limit 0xfffff, granularity 4K, access 0x9a), and a data descriptor (access 0x92). Load it with `lgdt [gdt_descriptor]`.",
            },
            {
              question: "What does the hands-on step “Enable the A20 line” involve?",
              options: [
                "Use BIOS int 0x15, ax=0x2401, or the fast A20 port 0x92. Without A20, addresses above 1 MiB wrap around and your kernel cannot load.",
                "Compute the root directory's first sector from the reserved and FAT regions. Read entries until you find a name matching an 8.3 filename.",
                "Copy each cluster's sectors into a buffer until the chain ends. Compare the bytes with the file on your host to verify the read.",
                "Load sector 0 and parse bytes per sector, sectors per cluster, reserved sectors, number of FATs, root entry count, and FAT size from the BPB.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Enable the A20 line” as: Use BIOS int 0x15, ax=0x2401, or the fast A20 port 0x92. Without A20, addresses above 1 MiB wrap around and your kernel cannot load.",
            },
          ],
          flashcards: [
            {
              front: "GDT (Global Descriptor Table)",
              back: "A data structure used by the CPU to define memory segments and their access rights in protected mode",
            },
            {
              front: "Video memory address",
              back: "0xB8000 in text mode: each byte is a character, paired with an attribute byte for color/style",
            },
            {
              front: "How do you enable the A20 line?",
              back: "Use BIOS int 0x15, ax=0x2401, or the fast A20 port 0x92. Without A20, addresses above 1 MiB wrap around and your kernel cannot load.",
            },
            {
              front: "How do you switch to protected mode?",
              back: "Set CR0 bit 0 (PE), then far-jump to a 32-bit code selector so the CPU reloads CS with the new descriptor.",
            },
            {
              front: "How do you build a GDT?",
              back: "Define a null descriptor, a flat 32-bit code descriptor (base 0, limit 0xfffff, granularity 4K, access 0x9a), and a data descriptor (access 0x92). Load it with `lgdt [gdt_descriptor]`.",
            },
          ],
          sourceRef: {
            label: "Bootloader: writing to screen",
            pageStart: null,
            pageEnd: null,
            note: "GDT, A20 line, BIOS int 0x13 kernel load, protected mode, far jump to the kernel entry at 0x10000",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Kernel Foundations: Memory and Processes",
      summary: "Managing memory with a simple allocator, creating processes, and context switching.",
      lessons: [
        {
          title: "Simple Memory Allocator: Bump Pointer",
          objective: "Implement a bump-pointer allocator that manages a heap region in memory.",
          hook: "No more global array overflows — allocate from a growing pointer.",
          paragraphs: [
            "The simplest heap allocator imaginable: reserve a region of memory (e.g., the upper 384KB of the 1MB real-mode address space, or higher above 1MB with paging), store a 'bump' pointer, and advance it on each allocation. Free is not supported — this is for kernel bootstrapping where objects have known lifetimes.",
          ],
          bullets: [
            "Reserve a heap region at a fixed address",
            "Store a bump pointer starting at the region base",
            "Allocate by bumping the pointer forward by the aligned request size",
            "No fragmentation handling or deallocation",
          ],
          steps: [
            {
              title: "Find the end of the kernel",
              detail: "Export a linker symbol such as `kernel_end` in your linker script and read its address in C. Align it up to 16 bytes.",
            },
            {
              title: "Implement kmalloc",
              detail: "Keep a global `next_free` pointer. On allocation, align the requested size, return the current pointer, then advance `next_free` by that size.",
            },
            {
              title: "Add alignment and zeroing",
              detail: "Align every allocation to 8 or 16 bytes and optionally zero the returned region. Reject requests that would cross your reserved memory limit.",
            },
            {
              title: "Test and inspect",
              detail: "Allocate several blocks, write distinct patterns, and verify no block overlaps. Print `next_free` before and after to confirm the pointer only moves forward.",
            },
          ],
          takeaway: "A bump allocator is fast and simple — ideal for kernel init where you know object lifetimes.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "bp",
                from: "heap",
                label: "starts at base",
              },
              {
                to: "alloc",
                from: "bp",
                label: "advances on each alloc",
              },
            ],
            nodes: [
              {
                id: "heap",
                label: "Reserved heap region",
                emphasis: false,
              },
              {
                id: "bp",
                label: "Bump pointer",
                emphasis: true,
              },
              {
                id: "alloc",
                label: "Allocate: bp += size",
                emphasis: false,
              },
            ],
            title: "Bump-pointer allocation",
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
            explanation: "A bump allocator never reuses freed memory — it just advances a pointer. For true heap management, you need a free-list or bit-map allocator.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Simple Memory Allocator: Bump Pointer”?",
              options: [
                "BIOS loads boot sector to 0x7C00 and jumps there",
                "Set up GDT with at least one code segment descriptor",
                "Reserve a heap region at a fixed address",
                "Maintain a run queue of process TCBs (task control blocks)",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Reserve a heap region at a fixed address”",
            },
            {
              question: "Which statement best explains “Bump-pointer allocator”?",
              options: [
                "512 bytes — the first sector on disk, loaded by BIOS at address 0x7C00",
                "A data structure used by the CPU to define memory segments and their access rights in protected mode",
                "A function a process calls to voluntarily give up the CPU",
                "Allocate by advancing a pointer; never frees memory — use for short-lived kernel objects",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Allocate by advancing a pointer; never frees memory — use for short-lived kernel objects”",
            },
            {
              question: "Which of these is a hands-on step in “Simple Memory Allocator: Bump Pointer”?",
              options: [
                "Switch to protected mode",
                "Verify the mode switch",
                "Define a task control block",
                "Find the end of the kernel",
              ],
              correctIndex: 3,
              explanation: "“Find the end of the kernel” is part of this lesson's sequence: Export a linker symbol such as `kernel_end` in your linker script and read its address in C. Align it up to 16 bytes.",
            },
            {
              question: "What does the hands-on step “Implement kmalloc” involve?",
              options: [
                "Keep a global `next_free` pointer. On allocation, align the requested size, return the current pointer, then advance `next_free` by that size.",
                "Create boot/, kernel/, drivers/, fs/, and a Makefile that builds boot.bin, kernel.bin, and a disk image. Add a run target that launches QEMU so every later lesson boots the same image.",
                "Install nasm, qemu-system-i386, and gdb. Verify with `nasm -v` and `qemu-system-i386 --version` before writing any code.",
                "Pad to byte 510 and append `dw 0xaa55`. The BIOS only treats the sector as bootable when those two bytes are present.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Implement kmalloc” as: Keep a global `next_free` pointer. On allocation, align the requested size, return the current pointer, then advance `next_free` by that size.",
            },
          ],
          flashcards: [
            {
              front: "Bump-pointer allocator",
              back: "Allocate by advancing a pointer; never frees memory — use for short-lived kernel objects",
            },
            {
              front: "Heap region",
              back: "A reserved memory area used for dynamic allocation within the kernel",
            },
            {
              front: "How do you implement kmalloc?",
              back: "Keep a global `next_free` pointer. On allocation, align the requested size, return the current pointer, then advance `next_free` by that size.",
            },
            {
              front: "How do you add alignment and zeroing?",
              back: "Align every allocation to 8 or 16 bytes and optionally zero the returned region. Reject requests that would cross your reserved memory limit.",
            },
            {
              front: "How do you find the end of the kernel?",
              back: "Export a linker symbol such as `kernel_end` in your linker script and read its address in C. Align it up to 16 bytes.",
            },
          ],
          sourceRef: {
            label: "Memory allocator",
            pageStart: null,
            pageEnd: null,
            note: "Bump-pointer allocator for kernel bootstrapping",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Process Scheduling: Cooperative Round-Robin",
          objective: "Implement a simple cooperative scheduler that runs one process at a time yielding control.",
          hook: "Multitasking without interrupts: each process runs until it yields.",
          paragraphs: [
            "A cooperative scheduler lets each process run briefly then explicitly yield control back to the scheduler. Unlike preemptive multitasking, it does not use hardware interrupts — each process must voluntarily call scheduler_yield(). This is suitable for educational OS kernels where interrupt handling is not yet implemented.",
          ],
          bullets: [
            "Maintain a run queue of process TCBs (task control blocks)",
            "Each process runs for a time slice then calls scheduler_yield()",
            "The scheduler saves/restores registers when switching",
            "No hardware timer interrupts needed — cooperative only",
          ],
          steps: [
            {
              title: "Define a task control block",
              detail: "Store task id, saved stack pointer, state (ready/running/done), and an entry function. Keep a fixed array of tasks plus a current index.",
            },
            {
              title: "Give each task its own stack",
              detail: "Allocate a stack per task from your bump allocator and set the saved stack pointer to its top, 16-byte aligned.",
            },
            {
              title: "Write the context switch",
              detail: "In assembly, push callee-saved registers, save ESP into the current task, load the next task's ESP, pop registers, and `ret` into the new task.",
            },
            {
              title: "Yield cooperatively",
              detail: "Implement `task_yield()` that calls the scheduler explicitly. Run two tasks that print and yield in a loop; confirm output interleaves fairly.",
            },
            {
              title: "Detect completion",
              detail: "Mark a task done when its entry function returns, skip done tasks in the round-robin scan, and halt when no runnable tasks remain.",
            },
          ],
          takeaway: "Cooperative multitasking is simpler than preemptive: no timer interrupts, but each process must remember to yield.",
          diagram: {
            type: "cycle",
            edges: [
              {
                to: "run",
                from: "sched",
                label: "dispatch",
              },
              {
                to: "yield",
                from: "run",
                label: "process finishes quantum",
              },
              {
                to: "sched",
                from: "yield",
                label: "switch to next",
              },
            ],
            nodes: [
              {
                id: "sched",
                label: "Scheduler",
                emphasis: true,
              },
              {
                id: "run",
                label: "Run current process",
                emphasis: false,
              },
              {
                id: "yield",
                label: "Process yields",
                emphasis: true,
              },
            ],
            title: "Cooperative scheduler loop",
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
            explanation: "In cooperative multitasking, processes decide when to switch. In preemptive, the OS kernel forces a switch via timer interrupts (e.g., every 10ms).",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Process Scheduling: Cooperative Round-Robin”?",
              options: [
                "BIOS loads boot sector to 0x7C00 and jumps there",
                "Set up GDT with at least one code segment descriptor",
                "Reserve a heap region at a fixed address",
                "Maintain a run queue of process TCBs (task control blocks)",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Maintain a run queue of process TCBs (task control blocks)”",
            },
            {
              question: "Which statement best explains “Scheduler yield”?",
              options: [
                "A function a process calls to voluntarily give up the CPU",
                "512 bytes — the first sector on disk, loaded by BIOS at address 0x7C00",
                "A data structure used by the CPU to define memory segments and their access rights in protected mode",
                "Allocate by advancing a pointer; never frees memory — use for short-lived kernel objects",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “A function a process calls to voluntarily give up the CPU”",
            },
            {
              question: "Which of these is a hands-on step in “Process Scheduling: Cooperative Round-Robin”?",
              options: [
                "Install the toolchain",
                "Run it in QEMU",
                "Build a GDT",
                "Define a task control block",
              ],
              correctIndex: 3,
              explanation: "“Define a task control block” is part of this lesson's sequence: Store task id, saved stack pointer, state (ready/running/done), and an entry function. Keep a fixed array of tasks plus a current index.",
            },
            {
              question: "What does the hands-on step “Give each task its own stack” involve?",
              options: [
                "Allocate a stack per task from your bump allocator and set the saved stack pointer to its top, 16-byte aligned.",
                "Read the starting cluster from the directory entry, then walk the FAT: each entry gives the next cluster, with 0xFFF8+ marking end of file.",
                "Return clear failures for missing files, bad signatures, and chains that loop or point outside the volume. Never read past the buffer you allocated.",
                "Boot the image, run ls to list the root directory, cat a known file, clear the screen, and run the external test program. Confirm each output matches the disk contents.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Give each task its own stack” as: Allocate a stack per task from your bump allocator and set the saved stack pointer to its top, 16-byte aligned.",
            },
          ],
          flashcards: [
            {
              front: "Run queue",
              back: "A queue of process TCBs waiting to be scheduled",
            },
            {
              front: "Scheduler yield",
              back: "A function a process calls to voluntarily give up the CPU",
            },
            {
              front: "How do you define a task control block?",
              back: "Store task id, saved stack pointer, state (ready/running/done), and an entry function. Keep a fixed array of tasks plus a current index.",
            },
            {
              front: "How do you give each task its own stack?",
              back: "Allocate a stack per task from your bump allocator and set the saved stack pointer to its top, 16-byte aligned.",
            },
            {
              front: "How do you write the context switch?",
              back: "In assembly, push callee-saved registers, save ESP into the current task, load the next task's ESP, pop registers, and `ret` into the new task.",
            },
          ],
          sourceRef: {
            label: "Cooperative scheduler",
            pageStart: null,
            pageEnd: null,
            note: "Run queue, TCB, yield-based switching, no timer interrupts",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Storage and Filesystem",
      summary: "Parse a FAT16 volume from a raw disk image: boot sector, FAT, root directory, and cluster chains, then read a file into memory.",
      lessons: [
        {
          title: "Minimal FAT16 Reader",
          objective: "Parse FAT16 directory entries and read file contents from a disk image.",
          hook: "Your OS can now load files from disk — time to do something useful.",
          paragraphs: [
            "FAT16 is the simplest widely-used filesystem. You'll learn to read the boot sector, parse the FAT table, follow cluster chains, and read directory entries and file data. This gives your OS the ability to load programs and resources from disk instead of embedding them binary.",
          ],
          bullets: [
            "Read the BPB (BIOS Parameter Block) from the disk boot sector",
            "Parse the FAT table to find cluster links",
            "Follow the cluster chain to find file data clusters",
            "Read directory entries (8.3 filenames, attributes, first cluster number)",
          ],
          steps: [
            {
              title: "Read the boot sector",
              detail: "Load sector 0 and parse bytes per sector, sectors per cluster, reserved sectors, number of FATs, root entry count, and FAT size from the BPB.",
            },
            {
              title: "Locate the root directory",
              detail: "Compute the root directory's first sector from the reserved and FAT regions. Read entries until you find a name matching an 8.3 filename.",
            },
            {
              title: "Follow the cluster chain",
              detail: "Read the starting cluster from the directory entry, then walk the FAT: each entry gives the next cluster, with 0xFFF8+ marking end of file.",
            },
            {
              title: "Load a file into memory",
              detail: "Copy each cluster's sectors into a buffer until the chain ends. Compare the bytes with the file on your host to verify the read.",
            },
            {
              title: "Handle errors",
              detail: "Return clear failures for missing files, bad signatures, and chains that loop or point outside the volume. Never read past the buffer you allocated.",
            },
          ],
          takeaway: "FAT16 is simple enough to implement in a few hundred lines while teaching the core ideas of filesystem design: block allocation tables, cluster chains, and directory structures.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "fat",
                from: "boot",
                label: "BPB gives FAT offset",
              },
              {
                to: "cluster",
                from: "fat",
                label: "find first cluster",
              },
              {
                to: "data",
                from: "cluster",
                label: "read clusters until EOF",
              },
            ],
            nodes: [
              {
                id: "boot",
                label: "Boot sector / BPB",
                emphasis: false,
              },
              {
                id: "fat",
                label: "FAT table lookup",
                emphasis: true,
              },
              {
                id: "cluster",
                label: "Follow cluster chain",
                emphasis: false,
              },
              {
                id: "data",
                label: "Read file data",
                emphasis: true,
              },
            ],
            title: "FAT16 file lookup",
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
            explanation: "The BPB is embedded in the first sector of the FAT16 volume and encodes the geometry and structure the OS needs to navigate the filesystem.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Minimal FAT16 Reader”?",
              options: [
                "Read the BPB (BIOS Parameter Block) from the disk boot sector",
                "BIOS loads boot sector to 0x7C00 and jumps there",
                "Set up GDT with at least one code segment descriptor",
                "Reserve a heap region at a fixed address",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Read the BPB (BIOS Parameter Block) from the disk boot sector”",
            },
            {
              question: "Which statement best explains “FAT16 cluster”?",
              options: [
                "512 bytes — the first sector on disk, loaded by BIOS at address 0x7C00",
                "A group of contiguous sectors; a file's data is stored across one or more clusters, linked by the FAT table",
                "A data structure used by the CPU to define memory segments and their access rights in protected mode",
                "Allocate by advancing a pointer; never frees memory — use for short-lived kernel objects",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “A group of contiguous sectors; a file's data is stored across one or more clusters, linked by the FAT table”",
            },
            {
              question: "Which of these is a hands-on step in “Minimal FAT16 Reader”?",
              options: [
                "Switch to protected mode",
                "Verify the mode switch",
                "Add alignment and zeroing",
                "Read the boot sector",
              ],
              correctIndex: 3,
              explanation: "“Read the boot sector” is part of this lesson's sequence: Load sector 0 and parse bytes per sector, sectors per cluster, reserved sectors, number of FATs, root entry count, and FAT size from the BPB.",
            },
            {
              question: "What does the hands-on step “Locate the root directory” involve?",
              options: [
                "Compute the root directory's first sector from the reserved and FAT regions. Read entries until you find a name matching an 8.3 filename.",
                "Boot with `qemu-system-i386 -drive format=raw,file=boot.bin`. Attach `-s -S` and connect gdb to inspect the first instruction at 0x7c00.",
                "Create boot/, kernel/, drivers/, fs/, and a Makefile that builds boot.bin, kernel.bin, and a disk image. Add a run target that launches QEMU so every later lesson boots the same image.",
                "Install nasm, qemu-system-i386, and gdb. Verify with `nasm -v` and `qemu-system-i386 --version` before writing any code.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Locate the root directory” as: Compute the root directory's first sector from the reserved and FAT regions. Read entries until you find a name matching an 8.3 filename.",
            },
          ],
          flashcards: [
            {
              front: "FAT16 cluster",
              back: "A group of contiguous sectors; a file's data is stored across one or more clusters, linked by the FAT table",
            },
            {
              front: "BPB (BIOS Parameter Block)",
              back: "A data structure in the boot sector describing filesystem geometry: sector size, cluster size, reserved area size, etc.",
            },
            {
              front: "How do you follow the cluster chain?",
              back: "Read the starting cluster from the directory entry, then walk the FAT: each entry gives the next cluster, with 0xFFF8+ marking end of file.",
            },
            {
              front: "How do you locate the root directory?",
              back: "Compute the root directory's first sector from the reserved and FAT regions. Read entries until you find a name matching an 8.3 filename.",
            },
            {
              front: "How do you read the boot sector?",
              back: "Load sector 0 and parse bytes per sector, sectors per cluster, reserved sectors, number of FATs, root entry count, and FAT size from the BPB.",
            },
          ],
          sourceRef: {
            label: "FAT16 filesystem",
            pageStart: null,
            pageEnd: null,
            note: "Boot sector, BPB, FAT table, cluster chain, directory entries",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Shell and Commands",
      summary: "A simple command-line interpreter with built-in commands and process execution.",
      lessons: [
        {
          title: "Simple Command Shell",
          objective: "Implement a shell that reads input, parses commands, runs built-ins, and loads a flat binary program from disk.",
          hook: "Your OS now has a filesystem, a shell, and — almost — a usable system.",
          paragraphs: [
            "The shell is the user's primary interface to your OS. You'll read lines from stdin, split them into arguments, dispatch built-in commands, and load a flat binary from the FAT16 filesystem into a fixed buffer and jump to its entry point. Built-ins such as help, clear, echo, ls, cat, and exit run inside the kernel; external programs return to the shell through a known return address or a trap.",
          ],
          bullets: [
            "Read a line from the keyboard or serial port and echo it to VGA",
            "Tokenize the line into a command name and an argv array",
            "Run built-ins in the kernel: help, clear, echo, ls, cat, exit",
            "Load a flat binary from the FAT16 filesystem at a fixed address and jump to it",
          ],
          steps: [
            {
              title: "Read a line",
              detail: "Poll the keyboard or use your serial input, echo characters to VGA, handle backspace, and terminate on Enter.",
            },
            {
              title: "Tokenize the command",
              detail: "Split on spaces into argv, preserving the command name. Handle empty input and a fixed maximum number of arguments.",
            },
            {
              title: "Dispatch built-ins",
              detail: "Implement help, clear, echo, ls, cat, and exit using your FAT16 reader. Compare argv[0] against a table of names and call the matching function.",
            },
            {
              title: "Load and run an external program",
              detail: "Read a flat binary from the FAT16 filesystem into a fixed buffer, jump to its entry point, and return to the shell through a known return address or a trap. Test with a tiny program that prints a character and returns.",
            },
            {
              title: "Add a prompt loop",
              detail: "Print a prompt, read, execute, and repeat forever. Keep the loop small so a bad command prints an error instead of halting the kernel.",
            },
            {
              title: "Try it end to end",
              detail: "Boot the image, run ls to list the root directory, cat a known file, clear the screen, and run the external test program. Confirm each output matches the disk contents.",
            },
          ],
          takeaway: "A shell bridges the gap between the raw OS services (file system, process loading) and the user — the final piece that makes an OS feel usable.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "parse",
                from: "read",
                label: "input line",
              },
              {
                to: "exec",
                from: "parse",
                label: "find and load program",
              },
              {
                to: "built",
                from: "exec",
                label: "is it a built-in?",
              },
              {
                to: "read",
                from: "built",
                label: "back to prompt",
              },
            ],
            nodes: [
              {
                id: "read",
                label: "Read input",
                emphasis: true,
              },
              {
                id: "parse",
                label: "Parse command",
                emphasis: false,
              },
              {
                id: "exec",
                label: "Load + jump to program",
                emphasis: true,
              },
              {
                id: "built",
                label: "Handle cd/exit",
                emphasis: false,
              },
            ],
            title: "Shell command loop",
          },
          quiz: {
            question: "Which of the following is a built-in shell command?",
            options: [
              "ls",
              "cd",
              "cat",
              "grep",
            ],
            correctIndex: 1,
            explanation: "cd (change directory) is a built-in because it modifies the shell's internal state (current working directory); ls, cat, grep are external programs.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Simple Command Shell”?",
              options: [
                "BIOS loads boot sector to 0x7C00 and jumps there",
                "Read a line from the keyboard or serial port and echo it to VGA",
                "Set up GDT with at least one code segment descriptor",
                "Reserve a heap region at a fixed address",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Read a line of input from stdin (serial port or keyboard)”",
            },
            {
              question: "Which statement best explains “Shell command loop”?",
              options: [
                "512 bytes — the first sector on disk, loaded by BIOS at address 0x7C00",
                "A data structure used by the CPU to define memory segments and their access rights in protected mode",
                "Read → Parse → Find executable → Load → Jump → Prompt (repeat)",
                "Allocate by advancing a pointer; never frees memory — use for short-lived kernel objects",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Read → Parse → Find executable → Load → Jump → Prompt (repeat)”",
            },
            {
              question: "Which of these is a hands-on step in “Simple Command Shell”?",
              options: [
                "Print from protected mode",
                "Switch to protected mode",
                "Verify the mode switch",
                "Read a line",
              ],
              correctIndex: 3,
              explanation: "“Read a line” is part of this lesson's sequence: Poll the keyboard or use your serial input, echo characters to VGA, handle backspace, and terminate on Enter.",
            },
            {
              question: "What does the hands-on step “Tokenize the command” involve?",
              options: [
                "Split on spaces into argv, preserving the command name. Handle empty input and a fixed maximum number of arguments.",
                "In gdb, confirm CR0. PE is set and EIP is in your 32-bit code. If QEMU triple-faults, recheck the GDT base, limit, and far jump selector.",
                "Set CR0 bit 0 (PE), then far-jump to a 32-bit code selector so the CPU reloads CS with the new descriptor.",
                "Use BIOS int 0x15, ax=0x2401, or the fast A20 port 0x92. Without A20, addresses above 1 MiB wrap around and your kernel cannot load.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Tokenize the command” as: Split on spaces into argv, preserving the command name. Handle empty input and a fixed maximum number of arguments.",
            },
          ],
          flashcards: [
            {
              front: "Built-in vs external command",
              back: "Built-in (help, clear, echo, ls, cat, exit) runs inside the kernel; an external program is loaded from FAT16 into a fixed buffer and run until it returns to the shell.",
            },
            {
              front: "Shell command loop",
              back: "Read → Parse → Find executable → Load → Jump → Prompt (repeat)",
            },
            {
              front: "How do you tokenize the command?",
              back: "Split on spaces into argv, preserving the command name. Handle empty input and a fixed maximum number of arguments.",
            },
            {
              front: "How do you dispatch built-ins?",
              back: "Implement `help`, `clear`, `echo`, `ls`, and `cat` using your FAT16 reader. Compare argv[0] against a table of names and call the matching function.",
            },
            {
              front: "How do you read a line?",
              back: "Poll the keyboard or use your serial input, echo characters to VGA, handle backspace, and terminate on Enter.",
            },
          ],
          sourceRef: {
            label: "Simple shell",
            pageStart: null,
            pageEnd: null,
            note: "Line input, argv tokenizing, built-ins (help, clear, echo, ls, cat, exit), loading a flat binary from FAT16",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Capstone: From Bootable Kernel to Protected OS",
      summary: "Interrupts, paging, privilege transitions, syscalls, drivers, and scheduling: the mechanisms that make a kernel an operating system.",
      lessons: [
        {
          title: "Capstone: Interrupts, Paging, Syscalls, and Drivers",
          objective: "Implement how a kernel takes control from hardware, isolates user programs with paging and privilege levels, exposes syscalls, and drives devices.",
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
              detail: "Install handlers for the timer, keyboard, page fault, and general protection fault, then enable interrupts.",
            },
            {
              title: "Add a timer tick",
              detail: "Program the PIT or APIC, count ticks, and decrement the current thread's time slice.",
            },
            {
              title: "Enable paging",
              detail: "Build a page directory and tables, identity-map the kernel, and map a user stack and code region.",
            },
            {
              title: "Enter user mode and trap back",
              detail: "Use an interrupt-return frame to enter ring 3; implement one syscall gate that validates a buffer and returns a value.",
            },
            {
              title: "Write a block driver",
              detail: "Expose read and write sector operations, wait for the completion interrupt, and register the device with the VFS.",
            },
            {
              title: "Switch contexts",
              detail: "Save callee-saved registers, switch stacks and page tables, and restore the next thread's state.",
            },
            {
              title: "Run the finished artifact",
              detail: "Boot the image in QEMU, run ls and cat on a file, then execute a user program. Confirm a page fault and a syscall both return control to the kernel.",
            },
          ],
          takeaway: "An operating system emerges when interrupts give the kernel control, paging and rings isolate programs, syscalls form a validated boundary, drivers abstract devices, and the scheduler shares the CPU.",
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
                label: "Load an IDT",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Add a timer tick",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Enable paging",
                emphasis: false,
              },
              {
                id: "step-4",
                label: "Switch contexts",
                emphasis: true,
              },
            ],
            title: "How Capstone: Interrupts, Paging, Syscalls, and Drivers works",
          },
          quiz: {
            question: "Why is the timer interrupt essential for preemptive scheduling?",
            options: [
              "It gives the kernel a periodic chance to regain control and switch threads",
              "It increases the CPU clock speed",
              "It stores files on disk",
              "It validates syscall pointers",
            ],
            correctIndex: 0,
            explanation: "Without a periodic interrupt, a user program that never yields keeps the CPU. The timer forces a transition back into the kernel.",
          },
          extraQuestions: [
            {
              question: "What does the IDT contain?",
              options: [
                "Handlers for interrupt and exception vectors",
                "The filesystem's inode table",
                "A list of logged-in users",
                "The scheduler's run queue",
              ],
              correctIndex: 0,
              explanation: "The interrupt descriptor table maps each vector to its handler and privilege requirements.",
            },
            {
              question: "What is the purpose of privilege rings?",
              options: [
                "To prevent user code from executing privileged instructions or touching kernel memory",
                "To encrypt disk blocks",
                "To speed up floating-point math",
                "To allocate page frames",
              ],
              correctIndex: 0,
              explanation: "Ring 3 user code is restricted; ring 0 kernel code can execute privileged instructions and access kernel mappings.",
            },
            {
              question: "Why must a syscall validate a user pointer?",
              options: [
                "The pointer may be invalid or may point into kernel memory",
                "Pointers are always physical addresses",
                "The kernel cannot read user memory",
                "It improves the scheduler's fairness",
              ],
              correctIndex: 0,
              explanation: "User code supplies the pointer, so the kernel must check that the range is mapped, readable or writable as required, and not kernel memory.",
            },
            {
              question: "What does DMA require from the kernel?",
              options: [
                "Pinned buffers and completion handling",
                "A larger scheduler quantum",
                "A user-mode driver",
                "Disabling all interrupts forever",
              ],
              correctIndex: 0,
              explanation: "The device writes directly to memory, so the buffer must stay resident and the kernel must learn when the transfer completes.",
            },
          ],
          flashcards: [
            {
              front: "Privilege ring",
              back: "CPU protection level; ring 0 is kernel mode and ring 3 is user mode, which cannot execute privileged instructions or access kernel memory.",
            },
            {
              front: "DMA",
              back: "Direct memory access: a device transfers data to or from RAM without the CPU copying each word, requiring pinned buffers and completion interrupts.",
            },
            {
              front: "Interrupt descriptor table (IDT)",
              back: "Maps interrupt and exception vectors to handlers and their privilege requirements.",
            },
            {
              front: "Syscall gate",
              back: "A controlled trap from user mode into the kernel; arguments and user pointers must be validated before use.",
            },
            {
              front: "Timer interrupt",
              back: "Periodic hardware interrupt that lets the kernel preempt the running thread and invoke the scheduler.",
            },
          ],
          sourceRef: {
            label: "Build Your Own Operating System capstone",
            pageStart: null,
            pageEnd: null,
            note: "Complete build path from bootloader through memory, scheduling, filesystem, and shell, extended with interrupts, paging, privilege transitions, syscalls, drivers, and context switching.",
            sectionIndexes: [],
          },
          estimatedMinutes: 12,
        },
      ],
    },
  ],
};
