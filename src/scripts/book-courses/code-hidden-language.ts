import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const codeHiddenLanguageCourse: DraftCourse = {
  title: "Code: The Hidden Language of Computer Hardware and Software",
  description: "Petzold's ground-up build of a computer: from Morse code and Braille through relays, gates, binary arithmetic, memory, and the stored-program machine. Every chapter of the book is mapped to a lesson with chapter-accurate citations.",
  category: "Computer Architecture",
  level: "beginner",
  coverEmoji: "💡",
  tags: [
    "binary",
    "logic gates",
    "relays",
    "history of computing",
    "number systems",
  ],
  modules: [
    {
      title: "Module 1 — Codes, Light, and Switches (Chapters 1–8)",
      summary: "Why codes exist, why two states are enough, and how a flashlight, a telegraph, and a relay each teach the same lesson: information can ride on switching.",
      lessons: [
        {
          title: "Codes and Combinations: Best Friends and Why Codes Exist",
          objective: "Explain what a code is, why any finite set of symbols needs an agreed mapping, and how the number of available combinations grows with the bits you are willing to spend.",
          hook: "Two kids across the street with flashlights invented a code before anyone taught them what a bit was.",
          paragraphs: [
            "Petzold opens with two friends who cannot talk after dark, so they use flashlights. Any message system needs a prior agreement about what each signal means, and that agreement is the definition of a code: a mapping between a set of symbols and the meanings those symbols carry. The important consequence is that the code is invented, not discovered — Morse code and a flashlight code are equally arbitrary, and both work only because sender and receiver share the table.",
            "Chapter 2 turns that into arithmetic. If you can send one of two signals per time slot, then two slots give four messages, three slots give eight, and in general n binary choices distinguish 2^n distinct things. That is the whole power of binary: a tiny alphabet with a cheap physical implementation buys an exponential message space as you add slots. Petzold makes the point with Braille (six dots, 64 combinations) and with Morse code, where the design choice of short codes for common letters is an early, explicit act of compression.",
            "Two ideas in these chapters do real work later. First, codes are chosen to fit their channel: Braille fits a fingertip, Morse fits a single wire with on/off timing, and a flashlight code fits a visible bulb. Second, the number of codes you need determines how many bits you must spend, which is the reasoning behind every fixed-width encoding in the rest of the book. When you meet ASCII's seven bits or an instruction's opcode field, this is the chapter being applied.",
          ],
          bullets: [
            "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
            "With a two-symbol alphabet, n time slots distinguish 2^n messages — the exponential payoff that makes binary worth the inconvenience of using only two states.",
            "Braille's 64 six-dot patterns and Morse's short codes for frequent letters are both code designs fitted to a channel and to a cost model, which is compression reasoning before Shannon.",
            "Because the number of needed messages sets the number of bits, this chapter is the origin of every fixed-width field you will later see in ASCII, opcodes, and instruction formats.",
            "Any message system needs a prior agreement about what each signal means, and that agreement is the definition of a code: a mapping between a set of symbols and the meanings those symbols carry.",
            "If you can send one of two signals per time slot, then two slots give four messages, three slots give eight, and in general n binary choices distinguish 2^n distinct things.",
          ],
          steps: [
            {
              title: "Encode a small alphabet",
              detail: "Pick 8 words and assign each a unique 3-bit code. Write the table, encode a sentence, and confirm no two words share a code.",
            },
            {
              title: "Find the ambiguity",
              detail: "Remove the spaces from your encoded sentence and try to decode it. Add a separator or fixed width and show why framing is required.",
            },
            {
              title: "Add error detection",
              detail: "Append a parity bit to each code and flip one bit deliberately. Write a decoder that rejects the corrupted word instead of guessing.",
            },
          ],
          takeaway: "Information is not the physical signal; it is the agreed code layered on the signal, and the number of distinguishable messages grows exponentially in the number of binary slots.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "code",
                from: "meaning",
                label: "encode",
              },
              {
                to: "signal",
                from: "code",
                label: "transmit",
              },
              {
                to: "decode",
                from: "signal",
                label: "receive",
              },
            ],
            nodes: [
              {
                id: "meaning",
                label: "Meaning",
                emphasis: false,
              },
              {
                id: "code",
                label: "Agreed code table",
                emphasis: true,
              },
              {
                id: "signal",
                label: "Physical signal (light, current)",
                emphasis: false,
              },
              {
                id: "decode",
                label: "Decode with same table",
                emphasis: false,
              },
            ],
            title: "From meaning to signal and back",
          },
          quiz: {
            question: "Why does adding one more binary slot to a code double the number of distinguishable messages?",
            options: [
              "Because each slot adds one more symbol to the alphabet, so the alphabet grows linearly",
              "Because every existing message can be sent with either value in the new slot, so each of the 2^n messages becomes two, giving 2^(n+1) total",
              "Because binary codes must always have a power-of-two length",
              "Because the receiver can measure timing more precisely as slots are added",
            ],
            correctIndex: 1,
            explanation: "Each new binary choice is independent of the others, so it duplicates the entire existing message set. n slots give 2^n codes — the exponential growth that makes a two-state alphabet practical.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Codes and Combinations: Best Friends and Why Codes Exist”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
                "Positional notation evaluates each digit as digit times base raised to its place index, so decimal's dominance is a convention of having ten fingers rather than a property of arithmetic.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.”",
            },
            {
              question: "Which statement best explains “What makes something a code rather than just a signal?”?",
              options: [
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
                "A multiplier applied to a power of the base determined by the digit's position. In base b, the digit d in place k contributes d x b^k, and the value is the sum over all places. Nothing about this requires b to be ten; changing b changes the digit alphabet and the weights, but the rule — and hence the algorithms for carrying and borrowing — stays the same.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.”",
            },
            {
              question: "Which of these is a hands-on step in “Codes and Combinations: Best Friends and Why Codes Exist”?",
              options: [
                "Decode the bytes",
                "Encode UTF-8 yourself",
                "Build a half adder",
                "Encode a small alphabet",
              ],
              correctIndex: 3,
              explanation: "“Encode a small alphabet” is part of this lesson's sequence: Pick 8 words and assign each a unique 3-bit code. Write the table, encode a sentence, and confirm no two words share a code.",
            },
            {
              question: "What does the hands-on step “Find the ambiguity” involve?",
              options: [
                "Remove the spaces from your encoded sentence and try to decode it. Add a separator or fixed width and show why framing is required.",
                "Drive an LED through an NPN transistor and a base resistor. Measure the base current needed to switch it and compare with a relay coil.",
                "In a simulator or on a breadboard, wire four NAND gates into XOR. Verify the output is 1 only when exactly one input is 1.",
                "Use two switches in series for AND and in parallel for OR. Fill in the truth table by observing the lamp for all four input combinations.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Find the ambiguity” as: Remove the spaces from your encoded sentence and try to decode it. Add a separator or fixed width and show why framing is required.",
            },
          ],
          flashcards: [
            {
              front: "Why did Morse code give the shortest codes to the most common letters?",
              back: "Because transmission time was the scarce resource and operators paid per symbol. Assigning 'E' a single dot and rare letters long sequences minimises average message length for English text — a hand-tuned version of the same trade every compression scheme makes. It also shows that code design is driven by a cost model of the channel, not by aesthetics or alphabetical order.",
            },
            {
              front: "What makes something a code rather than just a signal?",
              back: "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
            },
            {
              front: "How do you find the ambiguity?",
              back: "Remove the spaces from your encoded sentence and try to decode it. Add a separator or fixed width and show why framing is required.",
            },
            {
              front: "How do you add error detection?",
              back: "Append a parity bit to each code and flip one bit deliberately. Write a decoder that rejects the corrupted word instead of guessing.",
            },
            {
              front: "How do you encode a small alphabet?",
              back: "Pick 8 words and assign each a unique 3-bit code. Write the table, encode a sentence, and confirm no two words share a code.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 1, Best Friends; Ch. 2, Codes and Combinations",
            pageStart: null,
            pageEnd: null,
            note: "Introduces codes as agreed mappings, the 2^n growth of message sets with binary slots, Braille's 64 combinations, and Morse code's deliberate assignment of short codes to frequent letters.",
            sectionIndexes: [
              4,
              5,
            ],
          },
          estimatedMinutes: 12,
        },
        {
          title: "Braille, Flashlights, and Communicating Around Corners",
          objective: "Show how Braille and a flashlight establish binary representation in physical form, and how the need to signal beyond line of sight forces a relay between sender and receiver.",
          hook: "Braille is a binary code you can read with your fingers, and the flashlight problem is why networks exist.",
          paragraphs: [
            "Chapter 3 analyses Braille as an engineering artefact: six positions, each either raised or flat, giving 64 patterns. Petzold reads the code carefully — the first ten letters reuse the top four dots with the bottom two indicating the decade — which shows that a code can be structured hierarchically rather than as a flat lookup. He also confronts the flaw: Braille is not a binary number system, because the positions are not weighted, so the patterns do not order or combine arithmetically. That distinction between a code and a number is easy to miss and matters constantly later.",
            "The flashlight in Chapter 4 is a physical bit. Two states — on and off — are trivially distinguishable, immune to drift, and cheap to build. Petzold notes the deeper reason engineers love two-state systems: an electrical circuit only needs to distinguish 'enough current' from 'not enough', so a two-state design tolerates noise and component variation that a ten-state design could not. That robustness argument, not mathematical elegance, is why binary won.",
            "Chapter 5 adds distance. A bulb visible across a street is useless across a city, so the signal must be carried and restored along the way — which is precisely what a relay does. This is the book's first appearance of the idea that will become networking: any signal that attenuates must be regenerated by a device that reads the weak input and produces a clean output. Once you have that device, you also have amplification, and once you have that, distance stops being a limit on the code.",
          ],
          bullets: [
            "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
            "Two-state signals win because a circuit only has to distinguish enough current from not enough, so binary tolerates noise, drift, and sloppy components that a ten-state design could not survive.",
            "Distance requires a repeater: a device that senses an attenuated signal and emits a clean copy is what makes communication beyond line of sight possible, and is the ancestor of every amplifier and network hop.",
            "The relay that regenerates a signal also inverts and amplifies it, which is why the same component later becomes the logic element in Chapter 6.",
            "Chapter 3 analyses Braille as an engineering artefact: six positions, each either raised or flat, giving 64 patterns.",
            "He also confronts the flaw: Braille is not a binary number system, because the positions are not weighted, so the patterns do not order or combine arithmetically.",
          ],
          steps: [
            {
              title: "Build a flashlight transmitter",
              detail: "Choose short and long flashes for dot and dash, then send HELLO to a friend or phone camera. Keep a fixed gap between letters.",
            },
            {
              title: "Write the decoder",
              detail: "Record the on/off durations as a list and map them back to letters. Handle an unknown pattern by printing a clear error.",
            },
            {
              title: "Test the timing boundary",
              detail: "Send at two different speeds and find where your decoder breaks. Add a start signal and a calibrated unit duration to fix it.",
            },
          ],
          takeaway: "Binary is chosen for electrical robustness rather than mathematical beauty, and the moment signal must travel, a restoring device — the relay — enters the story.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "wire",
                from: "send",
                label: "encode",
              },
              {
                to: "relay",
                from: "wire",
                label: "weak input",
              },
              {
                to: "recv",
                from: "relay",
                label: "clean copy",
              },
            ],
            nodes: [
              {
                id: "send",
                label: "Sender: two states",
                emphasis: false,
              },
              {
                id: "wire",
                label: "Attenuating wire",
                emphasis: false,
              },
              {
                id: "relay",
                label: "Relay regenerates",
                emphasis: true,
              },
              {
                id: "recv",
                label: "Receiver decodes",
                emphasis: false,
              },
            ],
            title: "A signal that must survive distance",
          },
          quiz: {
            question: "Why is Braille described as a code but not as a binary number system?",
            options: [
              "Because Braille uses six positions instead of eight, and binary requires multiples of eight",
              "Because its dot positions are not assigned place values, so patterns cannot be ordered or added arithmetically the way weighted binary digits can",
              "Because Braille letters are read by touch rather than by sight",
              "Because Braille encodes letters directly instead of encoding numbers",
            ],
            correctIndex: 1,
            explanation: "A binary number needs each position to carry a weight so patterns combine arithmetically. Braille's positions are unweighted and its structure is mnemonic, so it is a lookup code — 64 distinct symbols — rather than a numeric representation.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Braille, Flashlights, and Communicating Around Corners”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
                "Positional notation evaluates each digit as digit times base raised to its place index, so decimal's dominance is a convention of having ten fingers rather than a property of arithmetic.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.”",
            },
            {
              question: "Which statement best explains “Why do digital designers prefer two states instead of ten?”?",
              options: [
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "A multiplier applied to a power of the base determined by the digit's position. In base b, the digit d in place k contributes d x b^k, and the value is the sum over all places. Nothing about this requires b to be ten; changing b changes the digit alphabet and the weights, but the rule — and hence the algorithms for carrying and borrowing — stays the same.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.”",
            },
            {
              question: "Which of these is a hands-on step in “Braille, Flashlights, and Communicating Around Corners”?",
              options: [
                "Add error detection",
                "Encode a small alphabet",
                "Find the ambiguity",
                "Build a flashlight transmitter",
              ],
              correctIndex: 3,
              explanation: "“Build a flashlight transmitter” is part of this lesson's sequence: Choose short and long flashes for dot and dash, then send HELLO to a friend or phone camera. Keep a fixed gap between letters.",
            },
            {
              question: "What does the hands-on step “Write the decoder” involve?",
              options: [
                "Record the on/off durations as a list and map them back to letters. Handle an unknown pattern by printing a clear error.",
                "Drive an LED through an NPN transistor and a base resistor. Measure the base current needed to switch it and compare with a relay coil.",
                "In a simulator or on a breadboard, wire four NAND gates into XOR. Verify the output is 1 only when exactly one input is 1.",
                "Use two switches in series for AND and in parallel for OR. Fill in the truth table by observing the lamp for all four input combinations.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Write the decoder” as: Record the on/off durations as a list and map them back to letters. Handle an unknown pattern by printing a clear error.",
            },
          ],
          flashcards: [
            {
              front: "Why do digital designers prefer two states instead of ten?",
              back: "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
            },
            {
              front: "What problem does a relay solve that a longer wire cannot?",
              back: "Attenuation and noise. Over distance a signal weakens and picks up interference, so a receiver can no longer tell a one from a zero. A relay reads the degraded input with a coil and switches a separate, locally powered contact, emitting a clean full-strength copy. That regeneration — not mere conduction — is what lets a signal cross arbitrary distances, and it is the principle behind every repeater and amplifier since.",
            },
            {
              front: "How do you build a flashlight transmitter?",
              back: "Choose short and long flashes for dot and dash, then send HELLO to a friend or phone camera. Keep a fixed gap between letters.",
            },
            {
              front: "How do you write the decoder?",
              back: "Record the on/off durations as a list and map them back to letters. Handle an unknown pattern by printing a clear error.",
            },
            {
              front: "How do you test the timing boundary?",
              back: "Send at two different speeds and find where your decoder breaks. Add a start signal and a calibrated unit duration to fix it.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 3, Braille and Binary Codes; Ch. 4, Anatomy of a Flashlight; Ch. 5, Communicating Around Corners",
            pageStart: null,
            pageEnd: null,
            note: "Covers Braille's 64 unweighted patterns and hierarchical structure, why two-state electrical signals are robust, and why attenuation over distance forces a regenerating relay between sender and receiver.",
            sectionIndexes: [
              6,
              7,
              8,
            ],
          },
          estimatedMinutes: 12,
        },
        {
          title: "Logic with Switches: Telegraphs, Relays, and Gates",
          objective: "Show how series and parallel switches compute AND and OR, and how the relay turns that into logic gates that can drive other gates.",
          hook: "Before anyone called it logic, a switch was just a way to break a circuit.",
          paragraphs: [
            "Chapter 6 asks what a circuit of switches can do besides turn a lamp on. Two switches in series conduct only when both are closed, so the lamp lights exactly when A AND B hold. Two in parallel conduct when either is closed, so the lamp lights when A OR B holds. A single switch wired to bypass the load inverts the sense of the circuit. That is the whole foundation of digital logic, derived from nothing but wiring, and Petzold is careful to point out that the analogy is exact: the circuit computes a logical function of its inputs.",
            "Chapter 7 makes the abstract concrete with the telegraph. A single wire plus ground, a key at one end and a sounder at the other, is enough to send Morse across a continent — until losses, lightning, and multiple stations make plain wire hopeless. The repeater station solves it, and then the real insight arrives: once you can regenerate a signal, you can also route, select, and combine signals. The telegraph network that emerges is not just transport; it is conditional behaviour implemented in hardware.",
            "Chapter 8 assembles the tool kit. A relay's coil and contact are electrically separate, so a small signal on the coil can switch a large current — and, more importantly, can drive the coil of another relay. That cascading property is what makes gates into computing: the output of one gate is a legal input to the next, so complex functions can be built by composition rather than by inventing new components. Petzold also introduces the inverter and the idea of representing logic as a truth table, which frees the designer from thinking about coils and lets them think about boolean functions.",
            "The conceptual move here is worth naming: a physical device is chosen because it implements a boolean function reliably, and then that fact — not the device's physics — becomes the unit of design. Everything in the rest of the book is built from that abstraction, and it is why gates can later be etched in silicon without changing a single logical argument.",
          ],
          bullets: [
            "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
            "The telegraph's repeater station solves attenuation and, in doing so, demonstrates that regenerated signals can be routed and combined — conditional behaviour emerging from a network of relays.",
            "A relay's coil and contact are electrically isolated and a small coil current can switch a larger contact current, which allows the output of one relay to drive the coil of the next and makes composition possible.",
            "Once gates compose, the unit of design becomes the boolean function and its truth table rather than the coil and contact — the abstraction that later lets the same logic be built in silicon instead of brass.",
            "That is the whole foundation of digital logic, derived from nothing but wiring, and Petzold is careful to point out that the analogy is exact: the circuit computes a logical function of its inputs.",
            "The conceptual move here is worth naming: a physical device is chosen because it implements a boolean function reliably, and then that fact — not the device's physics — becomes the unit of design.",
          ],
          steps: [
            {
              title: "Wire AND and OR",
              detail: "Use two switches in series for AND and in parallel for OR. Fill in the truth table by observing the lamp for all four input combinations.",
            },
            {
              title: "Build XOR from NAND",
              detail: "In a simulator or on a breadboard, wire four NAND gates into XOR. Verify the output is 1 only when exactly one input is 1.",
            },
            {
              title: "Replace a relay with a transistor",
              detail: "Drive an LED through an NPN transistor and a base resistor. Measure the base current needed to switch it and compare with a relay coil.",
            },
          ],
          takeaway: "Relays give you AND, OR, and NOT for free from wiring, and because one relay can drive another, logic can be composed into arbitrary functions.",
          diagram: {
            type: "compare",
            edges: [
              {
                to: "cascade",
                from: "series",
                label: "build functions",
              },
              {
                to: "cascade",
                from: "parallel",
                label: "build functions",
              },
            ],
            nodes: [
              {
                id: "series",
                label: "Series: both closed -> AND",
                emphasis: true,
              },
              {
                id: "parallel",
                label: "Parallel: either closed -> OR",
                emphasis: true,
              },
              {
                id: "bypass",
                label: "Bypass around load -> NOT",
                emphasis: false,
              },
              {
                id: "cascade",
                label: "Relay drives relay -> composition",
                emphasis: true,
              },
            ],
            title: "Switch arrangements as logic",
          },
          quiz: {
            question: "What property of the relay makes it possible to build arbitrarily complex logic from gates?",
            options: [
              "Its contacts are made of metal, so they conduct electricity with very low resistance",
              "Its output contact can switch the coil of another relay, so gates can be wired in cascade and complex functions composed from simple ones",
              "It converts analogue signals into digital signals, which no other component can do",
              "It stores its state after the input is removed, giving memory for free",
            ],
            correctIndex: 1,
            explanation: "Composition is the requirement. Because a relay's contact can supply the current for another relay's coil, a gate's output is a valid input to another gate, so functions chain without limit. Memory comes later, from feedback wiring rather than from the relay itself.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Logic with Switches: Telegraphs, Relays, and Gates”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
                "Positional notation evaluates each digit as digit times base raised to its place index, so decimal's dominance is a convention of having ten fingers rather than a property of arithmetic.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.”",
            },
            {
              question: "Which statement best explains “Why does a series connection of two switches behave like AND?”?",
              options: [
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "A multiplier applied to a power of the base determined by the digit's position. In base b, the digit d in place k contributes d x b^k, and the value is the sum over all places. Nothing about this requires b to be ten; changing b changes the digit alphabet and the weights, but the rule — and hence the algorithms for carrying and borrowing — stays the same.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.”",
            },
            {
              question: "Which of these is a hands-on step in “Logic with Switches: Telegraphs, Relays, and Gates”?",
              options: [
                "Subtract with two's complement",
                "Add a clock",
                "Build an SR latch",
                "Wire AND and OR",
              ],
              correctIndex: 3,
              explanation: "“Wire AND and OR” is part of this lesson's sequence: Use two switches in series for AND and in parallel for OR. Fill in the truth table by observing the lamp for all four input combinations.",
            },
            {
              question: "What does the hands-on step “Build XOR from NAND” involve?",
              options: [
                "In a simulator or on a breadboard, wire four NAND gates into XOR. Verify the output is 1 only when exactly one input is 1.",
                "Encode 0-9 as four-bit nibbles and add 9 + 1. Show why binary addition gives 1010 and why BCD needs a correction step.",
                "Write functions for binary, octal, and hexadecimal to decimal and back. Round-trip every number from 0 to 255 and assert equality.",
                "Read the byte sequence back, detect continuation bytes by their high bits, and reconstruct each code point. Assert it matches the input.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Build XOR from NAND” as: In a simulator or on a breadboard, wire four NAND gates into XOR. Verify the output is 1 only when exactly one input is 1.",
            },
          ],
          flashcards: [
            {
              front: "Why does a series connection of two switches behave like AND?",
              back: "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
            },
            {
              front: "Why is electrical isolation between a relay's coil and contact important?",
              back: "Because it lets one circuit control another with no shared conductor: a weak, low-voltage signal on the coil can switch a high-voltage or high-current load, and a fault on one side cannot propagate to the other. In computing terms it means a gate's output need not match its input in power, only in logical value, which is what allows a small gate to drive many downstream gates and what later becomes signal fan-out.",
            },
            {
              front: "How do you replace a relay with a transistor?",
              back: "Drive an LED through an NPN transistor and a base resistor. Measure the base current needed to switch it and compare with a relay coil.",
            },
            {
              front: "How do you wire AND and OR?",
              back: "Use two switches in series for AND and in parallel for OR. Fill in the truth table by observing the lamp for all four input combinations.",
            },
            {
              front: "How do you build XOR from NAND?",
              back: "In a simulator or on a breadboard, wire four NAND gates into XOR. Verify the output is 1 only when exactly one input is 1.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 6, Logic with Switches; Ch. 7, Telegraphs and Relays; Ch. 8, Relays and Gates",
            pageStart: null,
            pageEnd: null,
            note: "Derives AND from series switches and OR from parallel ones, covers the telegraph and its repeater stations, explains relay coil-to-contact isolation and cascading, and introduces truth tables as the design unit above the physical device.",
            sectionIndexes: [
              9,
              10,
              11,
            ],
          },
          estimatedMinutes: 14,
        },
      ],
    },
    {
      title: "Module 2 — Numbers, Text, and Arithmetic (Chapters 9–16)",
      summary: "Positional number systems in any base, binary and hexadecimal, character encoding from ASCII to Unicode, and the construction of an adder from gates.",
      lessons: [
        {
          title: "Our Ten Digits and Alternative 10s",
          objective: "Explain why positional notation works in any base, convert between bases, and see why the choice of base is a convention rather than a mathematical necessity.",
          hook: "We count in tens only because we have ten fingers — the arithmetic is a consequence of position, not of the digit ten.",
          paragraphs: [
            "Chapter 9 dissects decimal notation to show that its power comes from position, not from the number ten. Each digit's value is the digit multiplied by a power of ten determined by its place, so 427 means 4x100 + 2x10 + 7x1. Once you see that, base is exposed as an arbitrary parameter: the same rule with powers of eight or two or sixteen works identically, and the only thing ten contributes is the size of the digit alphabet.",
            "Chapter 10 exercises that freedom. The Mayan vigesimal system shows a civilisation choosing twenty, and Petzold uses it to demonstrate that the mechanical skills — carrying, borrowing, place values — transfer unchanged. He then turns to bases that matter for computing: octal and hexadecimal exist because eight and sixteen divide neatly into binary, so four binary digits map exactly onto one hex digit, which makes hex a compact notation for bit patterns rather than a separate arithmetic.",
            "The transferable lesson is about representation versus value. The number of fingers, the number of states in a circuit, and the number of digits in a notation are all separate decisions, and a computer is free to compute in binary while humans read hex. Every later conversion in the book — bytes to hex, addresses to hex, floating point to bit fields — depends on this chapter's comfort with changing base without changing meaning.",
          ],
          bullets: [
            "Positional notation evaluates each digit as digit times base raised to its place index, so decimal's dominance is a convention of having ten fingers rather than a property of arithmetic.",
            "Carrying and borrowing are mechanical consequences of position and work identically in any base, which is why a Mayan base-20 system needs no new mathematics, only new digit symbols.",
            "Octal and hexadecimal are useful because 8 and 16 are powers of two, so grouping bits in threes or fours gives exact one-to-one digit mappings and hex becomes shorthand for bit patterns.",
            "Representation and value are independent decisions: a machine may compute in binary while people read hex, and every later byte and address notation relies on that separation.",
            "Chapter 9 dissects decimal notation to show that its power comes from position, not from the number ten.",
            "Each digit's value is the digit multiplied by a power of ten determined by its place, so 427 means 4x100 + 2x10 + 7x1.",
          ],
          steps: [
            {
              title: "Convert between bases",
              detail: "Write functions for binary, octal, and hexadecimal to decimal and back. Round-trip every number from 0 to 255 and assert equality.",
            },
            {
              title: "Add in binary by hand",
              detail: "Add 0111 + 0001 and 1111 + 0001 on paper, showing each carry. Confirm the second result overflows a 4-bit register.",
            },
            {
              title: "Use BCD",
              detail: "Encode 0-9 as four-bit nibbles and add 9 + 1. Show why binary addition gives 1010 and why BCD needs a correction step.",
            },
          ],
          takeaway: "Base is a parameter, not a truth — positional rules are identical in every base, so binary, octal, and hex are notations for the same values.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "places",
                from: "digits",
                label: "position",
              },
              {
                to: "powers",
                from: "places",
                label: "weight",
              },
              {
                to: "sum",
                from: "powers",
                label: "add",
              },
            ],
            nodes: [
              {
                id: "digits",
                label: "Digit string",
                emphasis: false,
              },
              {
                id: "places",
                label: "Place index (n, n-1, ... 0)",
                emphasis: false,
              },
              {
                id: "powers",
                label: "digit x base^place",
                emphasis: true,
              },
              {
                id: "sum",
                label: "Sum of terms = value",
                emphasis: true,
              },
            ],
            title: "Evaluating a positional number",
          },
          quiz: {
            question: "Why is hexadecimal particularly convenient for writing binary values?",
            options: [
              "Because hexadecimal digits are shorter to type than decimal digits",
              "Because 16 is 2^4, so each hex digit corresponds exactly to four binary digits and conversion is a purely mechanical regrouping",
              "Because computers store numbers internally in base sixteen",
              "Because hexadecimal avoids the need for a carry between digits",
            ],
            correctIndex: 1,
            explanation: "Sixteen is a power of two, so four bits map onto one hex digit with no remainder and no rounding. That makes hex a lossless, compact notation for bit patterns — the reason memory dumps and addresses are written in hex.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Our Ten Digits and Alternative 10s”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
                "Positional notation evaluates each digit as digit times base raised to its place index, so decimal's dominance is a convention of having ten fingers rather than a property of arithmetic.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Positional notation evaluates each digit as digit times base raised to its place index, so decimal's dominance is a convention of having ten fingers rather than a property of arithmetic.”",
            },
            {
              question: "Which statement best explains “What exactly does the digit in a positional system stand for?”?",
              options: [
                "A multiplier applied to a power of the base determined by the digit's position. In base b, the digit d in place k contributes d x b^k, and the value is the sum over all places. Nothing about this requires b to be ten; changing b changes the digit alphabet and the weights, but the rule — and hence the algorithms for carrying and borrowing — stays the same.",
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “A multiplier applied to a power of the base determined by the digit's position. In base b, the digit d in place k contributes d x b^k, and the value is the sum over all places. Nothing about this requires b to be ten; changing b changes the digit alphabet and the weights, but the rule — and hence the algorithms for carrying and borrowing — stays the same.”",
            },
            {
              question: "Which of these is a hands-on step in “Our Ten Digits and Alternative 10s”?",
              options: [
                "Add error detection",
                "Encode a small alphabet",
                "Find the ambiguity",
                "Convert between bases",
              ],
              correctIndex: 3,
              explanation: "“Convert between bases” is part of this lesson's sequence: Write functions for binary, octal, and hexadecimal to decimal and back. Round-trip every number from 0 to 255 and assert equality.",
            },
            {
              question: "What does the hands-on step “Add in binary by hand” involve?",
              options: [
                "Add 0111 + 0001 and 1111 + 0001 on paper, showing each carry. Confirm the second result overflows a 4-bit register.",
                "Use two switches in series for AND and in parallel for OR. Fill in the truth table by observing the lamp for all four input combinations.",
                "Read the byte sequence back, detect continuation bytes by their high bits, and reconstruct each code point. Assert it matches the input.",
                "Truncate a multi-byte character and confirm your decoder reports an error instead of emitting a replacement character silently.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add in binary by hand” as: Add 0111 + 0001 and 1111 + 0001 on paper, showing each carry. Confirm the second result overflows a 4-bit register.",
            },
          ],
          flashcards: [
            {
              front: "What exactly does the digit in a positional system stand for?",
              back: "A multiplier applied to a power of the base determined by the digit's position. In base b, the digit d in place k contributes d x b^k, and the value is the sum over all places. Nothing about this requires b to be ten; changing b changes the digit alphabet and the weights, but the rule — and hence the algorithms for carrying and borrowing — stays the same.",
            },
            {
              front: "Why did computing settle on hex instead of, say, base 7 or base 12?",
              back: "Because 16 = 2^4, so a hex digit is exactly four bits and grouping a binary string into nibbles converts it by inspection. Hex also compresses a byte into two characters, which fits terminal widths and keeps addresses and dumps readable. Any non-power-of-two base would require carrying across digit boundaries during conversion, destroying the easy correspondence.",
            },
            {
              front: "How do you convert between bases?",
              back: "Write functions for binary, octal, and hexadecimal to decimal and back. Round-trip every number from 0 to 255 and assert equality.",
            },
            {
              front: "How do you use BCD?",
              back: "Encode 0-9 as four-bit nibbles and add 9 + 1. Show why binary addition gives 1010 and why BCD needs a correction step.",
            },
            {
              front: "How do you add in binary by hand?",
              back: "Add 0111 + 0001 and 1111 + 0001 on paper, showing each carry. Confirm the second result overflows a 4-bit register.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 9, Our Ten Digits; Ch. 10, Alternative 10s",
            pageStart: null,
            pageEnd: null,
            note: "Explains positional notation as digit times base to a place power, shows the Mayan base-20 system to prove base is arbitrary, and establishes octal and hex as power-of-two notations that map exactly onto groups of bits.",
            sectionIndexes: [
              12,
              13,
            ],
          },
          estimatedMinutes: 12,
        },
        {
          title: "Bit by Bit, Bytes and Hexadecimal, and From ASCII to Unicode",
          objective: "Explain bits and bytes, hexadecimal notation, and how character codes evolved from Morse and Baudot through ASCII to Unicode and UTF-8.",
          hook: "A byte is a historical accident that outlived every machine that made it necessary.",
          paragraphs: [
            "Chapter 11 builds numbers out of bits directly: a byte is eight bits, each bit carries a weight of a power of two, and the value is the sum of the weights of the bits that are on. Petzold walks the conversion both ways and then introduces hexadecimal as the human-facing shorthand, because eight bits split into two groups of four and each group has sixteen patterns. The practical dividend is legibility: 10110110 and 0xB6 name the same byte, but one is countable and the other is scannable.",
            "Chapter 12 moves to text. Morse showed that character codes can be variable length, and Baudot's five-bit code showed that fixed width makes mechanical encoding possible but limits you to 32 symbols — a constraint that forced the shift codes used to squeeze a full alphabet out of five bits. ASCII then standardised seven bits: 128 codes covering control characters, punctuation, digits, uppercase, and lowercase, with a structure that was deliberate (uppercase and lowercase differ by a single bit) so that case conversion and sorting would be cheap in hardware.",
            "Chapter 13 confronts ASCII's failure at scale. Seven bits cannot cover the world's scripts, so extensions proliferated and produced mojibake — the same byte meaning different characters under different tables. Unicode fixes this by assigning every character a code point in a much larger space, and UTF-8 makes it practical by encoding code points in one to four bytes whose high bits mark continuation, so ASCII text remains byte-identical and self-synchronising.",
            "Petzold's point is that a character code is a political and historical artefact as much as a technical one, and that backward compatibility determined the shape of the solution.",
          ],
          bullets: [
            "A byte is eight weighted bits and its value is the sum of the weights of the set bits; hex is the readable shorthand because each nibble is exactly one hex digit.",
            "Fixed-width codes like Baudot's five bits make mechanical encoding simple but cap the symbol set at 32, forcing shift codes; ASCII chose seven bits, giving 128 codes and cheap case conversion by design.",
            "ASCII could not represent the world's scripts, and the resulting incompatible extensions produced mojibake — the same byte decoding to different characters under different tables.",
            "Unicode assigns code points globally and UTF-8 encodes them in one to four bytes with self-describing high bits, so ASCII files stay valid and byte-identical — compatibility, not elegance, shaped the design.",
            "Chapter 11 builds numbers out of bits directly: a byte is eight bits, each bit carries a weight of a power of two, and the value is the sum of the weights of the bits that are on.",
            "The practical dividend is legibility: 10110110 and 0xB6 name the same byte, but one is countable and the other is scannable.",
          ],
          steps: [
            {
              title: "Encode UTF-8 yourself",
              detail: "Write an encoder for A, é, €, and 😀. Print the bytes in hex and compare them with a hexdump of the same text.",
            },
            {
              title: "Decode the bytes",
              detail: "Read the byte sequence back, detect continuation bytes by their high bits, and reconstruct each code point. Assert it matches the input.",
            },
            {
              title: "Break it safely",
              detail: "Truncate a multi-byte character and confirm your decoder reports an error instead of emitting a replacement character silently.",
            },
          ],
          takeaway: "A byte is a convention, a character code is a treaty, and UTF-8 is what happens when a treaty must be signed without breaking every existing file.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "utf8",
                from: "cp",
                label: "encode",
              },
              {
                to: "byte",
                from: "utf8",
                label: "group",
              },
              {
                to: "bits",
                from: "byte",
                label: "binary",
              },
            ],
            nodes: [
              {
                id: "cp",
                label: "Code point (U+0041)",
                emphasis: false,
              },
              {
                id: "utf8",
                label: "UTF-8 bytes (41)",
                emphasis: true,
              },
              {
                id: "byte",
                label: "Byte = 8 bits",
                emphasis: false,
              },
              {
                id: "bits",
                label: "Bit pattern 01000001",
                emphasis: false,
              },
            ],
            title: "Layers of text representation",
          },
          quiz: {
            question: "What is the essential design decision that lets UTF-8 coexist with legacy ASCII data?",
            options: [
              "UTF-8 stores every character in exactly four bytes so that alignment is always known",
              "UTF-8 uses variable-length encoding where code points below 128 map to single bytes identical to ASCII, and continuation bytes are marked by high bits so the stream is self-synchronising",
              "UTF-8 replaces ASCII entirely and requires all old files to be converted",
              "UTF-8 assigns characters to the unused half of the seven-bit ASCII space",
            ],
            correctIndex: 1,
            explanation: "Because ASCII's 128 characters occupy the single-byte range, any ASCII file is already valid UTF-8. Multi-byte sequences are identifiable from their leading bits, so a decoder can resynchronise after corruption — backward compatibility and robustness in one design.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Bit by Bit, Bytes and Hexadecimal, and From ASCII to Unicode”?",
              options: [
                "A byte is eight weighted bits and its value is the sum of the weights of the set bits; hex is the readable shorthand because each nibble is exactly one hex digit.",
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “A byte is eight weighted bits and its value is the sum of the weights of the set bits; hex is the readable shorthand because each nibble is exactly one hex digit.”",
            },
            {
              question: "Which statement best explains “Why did five-bit Baudot code need shift characters?”?",
              options: [
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Five bits give only 32 patterns, far fewer than letters, digits, and punctuation require. Shift codes work like a keyboard's shift key: one reserved pattern switches the interpretation of subsequent codes into a second table. It doubles the usable symbol set at the cost of state, which means a lost character can desynchronise the interpretation of everything after it — a fragility fixed-width codes pay for their compactness.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Five bits give only 32 patterns, far fewer than letters, digits, and punctuation require. Shift codes work like a keyboard's shift key: one reserved pattern switches the interpretation of subsequent codes into a second table. It doubles the usable symbol set at the cost of state, which means a lost character can desynchronise the interpretation of everything after it — a fragility fixed-width codes pay for their compactness.”",
            },
            {
              question: "Which of these is a hands-on step in “Bit by Bit, Bytes and Hexadecimal, and From ASCII to Unicode”?",
              options: [
                "Write the control table",
                "Add an interrupt path",
                "Load a program from storage",
                "Encode UTF-8 yourself",
              ],
              correctIndex: 3,
              explanation: "“Encode UTF-8 yourself” is part of this lesson's sequence: Write an encoder for A, é, €, and 😀. Print the bytes in hex and compare them with a hexdump of the same text.",
            },
            {
              question: "What does the hands-on step “Decode the bytes” involve?",
              options: [
                "Read the byte sequence back, detect continuation bytes by their high bits, and reconstruct each code point. Assert it matches the input.",
                "Cross-couple two NOR gates and test set, reset, and hold. Record what happens when both inputs are asserted at once.",
                "Toggle both inputs quickly in a simulator and observe the metastable or undefined state. Explain why real designs avoid it.",
                "Turn the latch into a gated D flip-flop. Store a 1, remove the input, and confirm the output stays 1 across clock cycles.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Decode the bytes” as: Read the byte sequence back, detect continuation bytes by their high bits, and reconstruct each code point. Assert it matches the input.",
            },
          ],
          flashcards: [
            {
              front: "What does 'mojibake' reveal about character encoding?",
              back: "That bytes carry no intrinsic meaning; only the agreed table does. The same byte sequence decoded under Latin-1, Shift-JIS, or UTF-8 produces different text, so any file must travel with its encoding or be sniffed reliably. It is the direct consequence of ASCII's seven-bit ceiling: incompatible regional extensions became incompatible treaties, which is exactly the problem Unicode was created to end.",
            },
            {
              front: "Why did five-bit Baudot code need shift characters?",
              back: "Five bits give only 32 patterns, far fewer than letters, digits, and punctuation require. Shift codes work like a keyboard's shift key: one reserved pattern switches the interpretation of subsequent codes into a second table. It doubles the usable symbol set at the cost of state, which means a lost character can desynchronise the interpretation of everything after it — a fragility fixed-width codes pay for their compactness.",
            },
            {
              front: "How do you encode UTF-8 yourself?",
              back: "Write an encoder for A, é, €, and 😀. Print the bytes in hex and compare them with a hexdump of the same text.",
            },
            {
              front: "How do you break it safely?",
              back: "Truncate a multi-byte character and confirm your decoder reports an error instead of emitting a replacement character silently.",
            },
            {
              front: "How do you decode the bytes?",
              back: "Read the byte sequence back, detect continuation bytes by their high bits, and reconstruct each code point. Assert it matches the input.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 11, Bit by Bit by Bit; Ch. 12, Bytes and Hexadecimal; Ch. 13, From ASCII to Unicode",
            pageStart: null,
            pageEnd: null,
            note: "Builds bytes from weighted bits, presents hex as nibble shorthand, traces Morse and Baudot to seven-bit ASCII with its deliberate case-bit structure, and explains Unicode code points and UTF-8's self-synchronising variable-length encoding.",
            sectionIndexes: [
              14,
              15,
              16,
            ],
          },
          estimatedMinutes: 14,
        },
        {
          title: "Adding with Logic Gates, Real Numbers, and Subtraction",
          objective: "Build a half adder and full adder from gates, extend to multi-bit addition with ripple carry, and explain two's complement as the trick that makes subtraction the same circuit as addition.",
          hook: "The most important thing ever done with logic gates is the addition of two bits.",
          paragraphs: [
            "Chapter 14 builds arithmetic from the truth table outward. Adding two bits gives four cases; the sum bit is XOR and the carry is AND, which is a half adder in two gates. Chaining two half adders with an OR gives a full adder that accepts a carry in, and stringing those together — each carry feeding the next — yields a ripple-carry adder for any width. Petzold walks the gate-by-gate construction because it demonstrates the book's central claim: arithmetic is not a primitive of hardware but a consequence of boolean functions.",
            "Chapter 15 turns to fractions. Fixed point is simple but wastes range; floating point splits a value into a sign, an exponent, and a significand, gaining huge dynamic range at the cost of precision that varies with magnitude. Petzold shows the representation and the rounding problem directly: most decimal fractions have no exact binary form, so 0.1 is stored as an approximation. That is not a bug but the consequence of representing an infinite set with a finite number of bits, and it is why financial code uses integers or decimals.",
            "Chapter 16 solves the subtraction problem elegantly. Rather than building a separate subtractor, represent negative numbers in two's complement: invert every bit and add one. Then a - b is a + (-b), and the ordinary adder performs subtraction with no changes. Carries out of the top are simply discarded — in unsigned terms that is wraparound; in signed terms it is correct modular arithmetic — and the same hardware also gives you the sign of a result via its top bit. This is the chapter where a design decision saves an entire circuit, and it is the reason two's complement is universal.",
            "Worth noticing is the pattern across all three chapters: representation choices (unsigned versus signed, fixed versus floating) change what a fixed circuit computes without changing the circuit. The adder is one piece of hardware; the interpretation of its inputs and outputs is where the arithmetic lives, which is the book's thesis compressed into three chapters.",
          ],
          bullets: [
            "XOR gives the sum bit and AND gives the carry, so a half adder is two gates; adding a carry-in and an OR produces a full adder, and chaining full adders yields a ripple-carry adder of any width.",
            "Floating point splits a value into sign, exponent, and significand to gain dynamic range, but finite bits cannot represent most decimal fractions exactly, so rounding is inherent rather than a defect to be fixed.",
            "Two's complement — invert the bits and add one — turns subtraction into addition, letting a single adder perform a - b while the top bit doubles as the sign and discarded carries become harmless modular wraparound.",
            "The deeper pattern is that representation, not circuitry, determines semantics: one adder serves unsigned, signed, and (with different fields) floating-point interpretation depending only on how the bits are read.",
            "Petzold walks the gate-by-gate construction because it demonstrates the book's central claim: arithmetic is not a primitive of hardware but a consequence of boolean functions.",
            "Fixed point is simple but wastes range; floating point splits a value into a sign, an exponent, and a significand, gaining huge dynamic range at the cost of precision that varies with magnitude.",
          ],
          steps: [
            {
              title: "Build a half adder",
              detail: "Wire XOR for the sum and AND for the carry. Test all four input pairs and record the truth table.",
            },
            {
              title: "Chain full adders",
              detail: "Build a full adder from two half adders and an OR, then chain four to add 4-bit numbers. Test 7 + 1 and 15 + 1.",
            },
            {
              title: "Subtract with two's complement",
              detail: "Invert the second operand, add 1, and feed it to your adder. Verify 5 - 3 and 3 - 5, including the sign bit.",
            },
          ],
          takeaway: "Addition emerges from gates, and two's complement makes subtraction free — proof that the meaning of a circuit lives in its encoding, not its hardware.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "fa",
                from: "a",
                label: "operand",
              },
              {
                to: "fa",
                from: "inv",
                label: "B or ~B+1",
              },
              {
                to: "sum",
                from: "fa",
                label: "result",
              },
            ],
            nodes: [
              {
                id: "a",
                label: "A bits",
                emphasis: false,
              },
              {
                id: "inv",
                label: "Invert B for subtraction",
                emphasis: false,
              },
              {
                id: "fa",
                label: "Full adders, carry chain",
                emphasis: true,
              },
              {
                id: "sum",
                label: "Sum bits + discarded carry",
                emphasis: true,
              },
            ],
            title: "Ripple-carry addition with two's complement subtraction",
          },
          quiz: {
            question: "Why does two's complement allow subtraction to reuse the addition circuit?",
            options: [
              "Because it moves the sign bit out of the number and stores it separately",
              "Because representing -b as the bitwise inverse of b plus one makes a + (-b) arithmetically equal to a - b, with the discarded carry out of the top bit acting as modular wraparound",
              "Because it makes every negative number smaller in magnitude, so no borrowing is needed",
              "Because the adder can detect that a subtraction was requested and invert its own output",
            ],
            correctIndex: 1,
            explanation: "Two's complement is the encoding in which negation is invert-and-add-one. Adding that pattern to a produces exactly the bits of a - b, and the carry leaving the top bit falls off the fixed width, so one adder suffices for both operations.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Adding with Logic Gates, Real Numbers, and Subtraction”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "XOR gives the sum bit and AND gives the carry, so a half adder is two gates; adding a carry-in and an OR produces a full adder, and chaining full adders yields a ripple-carry adder of any width.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “XOR gives the sum bit and AND gives the carry, so a half adder is two gates; adding a carry-in and an OR produces a full adder, and chaining full adders yields a ripple-carry adder of any width.”",
            },
            {
              question: "Which statement best explains “Why is 0.1 usually not exactly representable in binary floating point?”?",
              options: [
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "Because 0.1 in base ten is one tenth, and ten is not a power of two. In binary it expands as an infinite repeating fraction, just as 1/3 does in decimal. A finite significand must truncate it, so the stored value is the nearest representable neighbour. The error is tiny, but repeated arithmetic can accumulate it, which is why money is stored as integer cents or as decimal types.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Because 0.1 in base ten is one tenth, and ten is not a power of two. In binary it expands as an infinite repeating fraction, just as 1/3 does in decimal. A finite significand must truncate it, so the stored value is the nearest representable neighbour. The error is tiny, but repeated arithmetic can accumulate it, which is why money is stored as integer cents or as decimal types.”",
            },
            {
              question: "Which of these is a hands-on step in “Adding with Logic Gates, Real Numbers, and Subtraction”?",
              options: [
                "Add an interrupt path",
                "Load a program from storage",
                "Memory-map a device",
                "Build a half adder",
              ],
              correctIndex: 3,
              explanation: "“Build a half adder” is part of this lesson's sequence: Wire XOR for the sum and AND for the carry. Test all four input pairs and record the truth table.",
            },
            {
              question: "What does the hands-on step “Chain full adders” involve?",
              options: [
                "Build a full adder from two half adders and an OR, then chain four to add 4-bit numbers. Test 7 + 1 and 15 + 1.",
                "Drive an LED through an NPN transistor and a base resistor. Measure the base current needed to switch it and compare with a relay coil.",
                "In a simulator or on a breadboard, wire four NAND gates into XOR. Verify the output is 1 only when exactly one input is 1.",
                "Use two switches in series for AND and in parallel for OR. Fill in the truth table by observing the lamp for all four input combinations.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Chain full adders” as: Build a full adder from two half adders and an OR, then chain four to add 4-bit numbers. Test 7 + 1 and 15 + 1.",
            },
          ],
          flashcards: [
            {
              front: "Why is 0.1 usually not exactly representable in binary floating point?",
              back: "Because 0.1 in base ten is one tenth, and ten is not a power of two. In binary it expands as an infinite repeating fraction, just as 1/3 does in decimal. A finite significand must truncate it, so the stored value is the nearest representable neighbour. The error is tiny, but repeated arithmetic can accumulate it, which is why money is stored as integer cents or as decimal types.",
            },
            {
              front: "What does ripple carry cost, and why do real machines not use it directly?",
              back: "Each full adder must wait for the carry out of the one below it, so the delay of an n-bit adder grows linearly with n — the carry ripples. For 64 bits that serial chain dominates the clock period. Real designs use carry-lookahead, carry-select, or carry-save techniques that compute carries in parallel or speculation, trading area and complexity for logarithmic or constant depth.",
            },
            {
              front: "How do you chain full adders?",
              back: "Build a full adder from two half adders and an OR, then chain four to add 4-bit numbers. Test 7 + 1 and 15 + 1.",
            },
            {
              front: "How do you subtract with two's complement?",
              back: "Invert the second operand, add 1, and feed it to your adder. Verify 5 - 3 and 3 - 5, including the sign bit.",
            },
            {
              front: "How do you build a half adder?",
              back: "Wire XOR for the sum and AND for the carry. Test all four input pairs and record the truth table.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 14, Adding with Logic Gates; Ch. 15, Is This for Real?; Ch. 16, But What About Subtraction?",
            pageStart: null,
            pageEnd: null,
            note: "Builds half adders from XOR and AND, full adders with carry-in, and ripple-carry chains; covers fixed versus floating point and inherent rounding; derives two's complement so a single adder performs subtraction with discarded carries.",
            sectionIndexes: [
              17,
              18,
              19,
            ],
          },
          estimatedMinutes: 15,
        },
      ],
    },
    {
      title: "Module 3 — Feedback, Time, and Memory (Chapters 17–20)",
      summary: "Feedback creates state, state makes memory, a clock makes memory usable, and a counter makes arithmetic automatic.",
      lessons: [
        {
          title: "Feedback and Flip-Flops: How a Circuit Remembers",
          objective: "Explain how feeding a gate's output back to its input creates a bistable circuit, and how that produces the flip-flop, the fundamental unit of memory.",
          hook: "Every bit of memory in every computer is a circuit that argues with itself until one side wins.",
          paragraphs: [
            "Chapter 17 breaks the rule that every previous circuit obeyed: until now the output depended only on the present inputs. Petzold connects two inverters in a loop, output to input, and finds the circuit has two stable states — either the first output is 0 and the second is 1, or the reverse. Nothing in the wiring decides which; that depends on what happened when power was applied. This is feedback, and it is the origin of state, and therefore of memory.",
            "A cross-coupled pair of NOR or NAND gates gives a controllable version. Two inputs, Set and Reset, force the circuit into one state or the other, and when both are released the circuit holds whatever was last forced. Add the ability to gate the inputs with an enable signal and you have a level-triggered latch; arrange latches so only one is transparent at a time and you have an edge-triggered flip-flop, which captures a value at a precise instant rather than throughout a window.",
            "Petzold is careful about what has and has not been achieved. A flip-flop stores one bit, but it does not let you choose an address among many; that requires decoding and selection, which is where Chapter 19 goes. He also notes the timing hazards: if setup and hold times are violated, or if the clock is too fast for the feedback to settle, the circuit can enter a metastable in-between state — the one place where a digital abstraction leaks its analogue foundation.",
            "The conceptual payload is large. Feedback converts combinational logic into sequential logic; time enters the model; and a circuit can now have a history rather than merely a function. Every register, cache line, and RAM cell in the machine is a variation on this loop, and the design discipline of clocking exists precisely to keep feedback from becoming chaos.",
          ],
          bullets: [
            "Feeding a gate's output back into its input produces a bistable circuit whose two stable states are held by the wiring itself, giving state without any moving part.",
            "Cross-coupled NOR or NAND gates add Set and Reset control, and gating the inputs yields a level-triggered latch; arranging latches in pairs gives an edge-triggered flip-flop that samples at an instant.",
            "Metastability is the cost: violating setup or hold, or clocking faster than the loop can settle, leaves the circuit in an indeterminate middle state — the point where the digital abstraction fails.",
            "Feedback turns combinational logic into sequential logic, so circuits gain history; every register, cache cell, and RAM bit is this loop, and clocking exists to tame it.",
            "Nothing in the wiring decides which; that depends on what happened when power was applied.",
            "A flip-flop stores one bit, but it does not let you choose an address among many; that requires decoding and selection, which is where Chapter 19 goes.",
          ],
          steps: [
            {
              title: "Build an SR latch",
              detail: "Cross-couple two NOR gates and test set, reset, and hold. Record what happens when both inputs are asserted at once.",
            },
            {
              title: "Add a clock",
              detail: "Turn the latch into a gated D flip-flop. Store a 1, remove the input, and confirm the output stays 1 across clock cycles.",
            },
            {
              title: "Race the latch",
              detail: "Toggle both inputs quickly in a simulator and observe the metastable or undefined state. Explain why real designs avoid it.",
            },
          ],
          takeaway: "Memory is not a component you add to logic — it is what happens when logic is wired to observe its own past.",
          diagram: {
            type: "cycle",
            edges: [
              {
                to: "inv1",
                from: "q",
                label: "",
              },
              {
                to: "qbar",
                from: "inv1",
                label: "",
              },
              {
                to: "inv2",
                from: "qbar",
                label: "",
              },
              {
                to: "q",
                from: "inv2",
                label: "feedback",
              },
            ],
            nodes: [
              {
                id: "q",
                label: "Q (output)",
                emphasis: true,
              },
              {
                id: "inv1",
                label: "Inverter 1",
                emphasis: false,
              },
              {
                id: "qbar",
                label: "~Q",
                emphasis: false,
              },
              {
                id: "inv2",
                label: "Inverter 2",
                emphasis: false,
              },
            ],
            title: "Cross-coupled inverters hold a bit",
          },
          quiz: {
            question: "Why does a cross-coupled pair of inverters hold its value after the input is removed, when a combinational gate does not?",
            options: [
              "Because each inverter amplifies its input, and amplification makes the signal permanent",
              "Because each inverter's output is the other's input, so the pair reinforces whichever state it settled into — a stable loop with no external input needed",
              "Because the inverters contain capacitors that store charge indefinitely",
              "Because the circuit is edge-triggered, so it only samples once per clock cycle",
            ],
            correctIndex: 1,
            explanation: "The loop is self-consistent in two configurations: Q=1 forces ~Q=0 which forces Q=1, and vice versa. Once settled, no input is required to maintain the state, so the circuit has memory. Combinational gates have no such loop, so their output always tracks their input.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Feedback and Flip-Flops: How a Circuit Remembers”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Feeding a gate's output back into its input produces a bistable circuit whose two stable states are held by the wiring itself, giving state without any moving part.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Feeding a gate's output back into its input produces a bistable circuit whose two stable states are held by the wiring itself, giving state without any moving part.”",
            },
            {
              question: "Which statement best explains “What is metastability, and why does it matter in real hardware?”?",
              options: [
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
                "It is the state a bistable circuit enters when its input changes too close to the clock edge, so the feedback loop cannot resolve to 0 or 1 before it is sampled again. The output hovers at an intermediate voltage for an unbounded time. In hardware it causes unpredictable values and must be handled with synchroniser flip-flops and timing analysis, which is why setup and hold times are hard constraints rather than guidelines.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “It is the state a bistable circuit enters when its input changes too close to the clock edge, so the feedback loop cannot resolve to 0 or 1 before it is sampled again. The output hovers at an intermediate voltage for an unbounded time. In hardware it causes unpredictable values and must be handled with synchroniser flip-flops and timing analysis, which is why setup and hold times are hard constraints rather than guidelines.”",
            },
            {
              question: "Which of these is a hands-on step in “Feedback and Flip-Flops: How a Circuit Remembers”?",
              options: [
                "Break it safely",
                "Decode the bytes",
                "Encode UTF-8 yourself",
                "Build an SR latch",
              ],
              correctIndex: 3,
              explanation: "“Build an SR latch” is part of this lesson's sequence: Cross-couple two NOR gates and test set, reset, and hold. Record what happens when both inputs are asserted at once.",
            },
            {
              question: "What does the hands-on step “Add a clock” involve?",
              options: [
                "Turn the latch into a gated D flip-flop. Store a 1, remove the input, and confirm the output stays 1 across clock cycles.",
                "Pick 8 words and assign each a unique 3-bit code. Write the table, encode a sentence, and confirm no two words share a code.",
                "Remove the spaces from your encoded sentence and try to decode it. Add a separator or fixed width and show why framing is required.",
                "Choose short and long flashes for dot and dash, then send HELLO to a friend or phone camera. Keep a fixed gap between letters.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add a clock” as: Turn the latch into a gated D flip-flop. Store a 1, remove the input, and confirm the output stays 1 across clock cycles.",
            },
          ],
          flashcards: [
            {
              front: "What is metastability, and why does it matter in real hardware?",
              back: "It is the state a bistable circuit enters when its input changes too close to the clock edge, so the feedback loop cannot resolve to 0 or 1 before it is sampled again. The output hovers at an intermediate voltage for an unbounded time. In hardware it causes unpredictable values and must be handled with synchroniser flip-flops and timing analysis, which is why setup and hold times are hard constraints rather than guidelines.",
            },
            {
              front: "What is the difference between a latch and a flip-flop?",
              back: "A latch is level-sensitive: while its enable is high it is transparent, so its output follows the input and can change repeatedly. A flip-flop is edge-triggered: it samples the input at a single clock transition and holds the value until the next one. Edge triggering makes timing analysis tractable and prevents races, which is why synchronous designs are built from flip-flops rather than bare latches.",
            },
            {
              front: "How do you add a clock?",
              back: "Turn the latch into a gated D flip-flop. Store a 1, remove the input, and confirm the output stays 1 across clock cycles.",
            },
            {
              front: "How do you build an SR latch?",
              back: "Cross-couple two NOR gates and test set, reset, and hold. Record what happens when both inputs are asserted at once.",
            },
            {
              front: "How do you race the latch?",
              back: "Toggle both inputs quickly in a simulator and observe the metastable or undefined state. Explain why real designs avoid it.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 17, Feedback and Flip-Flops",
            pageStart: null,
            pageEnd: null,
            note: "Introduces feedback through cross-coupled inverters, derives Set/Reset latches from NOR and NAND pairs, distinguishes level-triggered latches from edge-triggered flip-flops, and discusses setup/hold timing and metastability.",
            sectionIndexes: [
              20,
            ],
          },
          estimatedMinutes: 13,
        },
        {
          title: "Building a Clock and Assembling Memory",
          objective: "Explain how an oscillator produces a periodic signal, why synchronous design needs it, and how flip-flops plus selection logic become addressable memory.",
          hook: "A computer is a machine that makes its own heartbeat, then uses it to keep millions of bits in step.",
          paragraphs: [
            "Chapter 18 builds an oscillator from an odd number of inverters in a ring: the signal chases itself around and the loop never settles, producing a square wave. A crystal improves stability by resonating at a fixed frequency, and a divider chain produces slower clocks from a fast one. Petzold then explains why a clock is not a luxury: once circuits hold state, you must decide when a value is sampled, and a shared periodic signal gives every flip-flop the same decision instant, turning timing from an analogue puzzle into a schedule.",
            "Chapter 19 is the payoff. Eight flip-flops side by side store a byte; add a Write signal to gate their inputs and a Read signal to expose their outputs onto a shared bus, and you have a register. Now replicate the register and add a decoder: n address bits select one of 2^n registers by enabling exactly one Write line. That is random-access memory, and Petzold builds it from the parts already in hand rather than introducing a new component.",
            "Two details make the design real. First, all cells share data lines, so only the selected cell may drive them — otherwise two cells fight and produce a short. Tri-state outputs or multiplexers solve this, and the choice shapes the bus design in Chapter 22. Second, addressing has a cost structure: 2^n words mean an n-to-2^n decoder, so memory capacity grows exponentially while the address bus grows linearly, which is exactly why memory is organised in powers of two.",
            "Petzold closes by naming the limitation. This memory array stores and retrieves, but something must generate the addresses, sequence the reads and writes, and decide what to do with the data. That control problem is what the next module builds, and it is the last piece before a stored-program computer exists.",
          ],
          bullets: [
            "An odd-numbered ring of inverters never settles and so oscillates; a crystal sets the frequency and dividers derive slower clocks, giving every flip-flop a common sampling instant and making timing a schedule rather than an analogue puzzle.",
            "Eight gated flip-flops plus read and write controls form a register, and replicating registers with an n-to-2^n decoder that enables exactly one write line yields random-access memory from parts already built.",
            "Shared data lines require that only the selected cell drives them, so tri-state outputs or multiplexers are mandatory — the design decision that later becomes the shared bus.",
            "Capacity grows as 2^n while the address grows as n, which is why memory is sized in powers of two — and why the remaining problem is not storage but control: something must generate addresses and sequence operations.",
            "Chapter 18 builds an oscillator from an odd number of inverters in a ring: the signal chases itself around and the loop never settles, producing a square wave.",
            "Second, addressing has a cost structure: 2^n words mean an n-to-2^n decoder, so memory capacity grows exponentially while the address bus grows linearly, which is exactly why memory is organised in powers of two.",
          ],
          steps: [
            {
              title: "Make a clock",
              detail: "Build an astable multivibrator with a 555 timer or simulate one. Measure the frequency with a scope or simulator and change it with the RC values.",
            },
            {
              title: "Build an 8-bit register",
              detail: "Connect eight D flip-flops with a shared clock and load line. Write 10101010, disable load, and confirm the value survives.",
            },
            {
              title: "Put registers on a bus",
              detail: "Add tri-state buffers to two registers and select one at a time. Verify two drivers are never enabled together.",
            },
          ],
          takeaway: "A clock synchronises state and a decoder makes state addressable, which together turn a pile of flip-flops into memory and pose the control problem the CPU will solve.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "reg",
                from: "ff",
                label: "group by 8",
              },
              {
                to: "dec",
                from: "reg",
                label: "replicate",
              },
              {
                to: "ram",
                from: "dec",
                label: "enable one",
              },
            ],
            nodes: [
              {
                id: "ff",
                label: "Flip-flop = 1 bit",
                emphasis: false,
              },
              {
                id: "reg",
                label: "8 flip-flops + R/W = register",
                emphasis: false,
              },
              {
                id: "dec",
                label: "Decoder selects 1 of 2^n",
                emphasis: true,
              },
              {
                id: "ram",
                label: "Addressable memory array",
                emphasis: true,
              },
            ],
            title: "From a bit to an addressable byte",
          },
          quiz: {
            question: "Why does a memory with n address lines hold exactly 2^n words?",
            options: [
              "Because each word must be a power of two bits long to align with the bus",
              "Because the decoder must enable exactly one of 2^n distinct lines for each of the 2^n possible address patterns, so every combination selects a different word",
              "Because memory chips are manufactured in power-of-two sizes by convention only",
              "Because the clock divides the address space into equal time slices",
            ],
            correctIndex: 1,
            explanation: "Each address line is a bit, so n lines give 2^n combinations. A decoder maps each combination to one selection line, and since every combination must select something distinct, the array has 2^n cells. It is a consequence of binary addressing, not a manufacturing convention.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Building a Clock and Assembling Memory”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
                "An odd-numbered ring of inverters never settles and so oscillates; a crystal sets the frequency and dividers derive slower clocks, giving every flip-flop a common sampling instant and making timing a schedule rather than an analogue puzzle.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “An odd-numbered ring of inverters never settles and so oscillates; a crystal sets the frequency and dividers derive slower clocks, giving every flip-flop a common sampling instant and making timing a schedule rather than an analogue puzzle.”",
            },
            {
              question: "Which statement best explains “Why does a computer need a clock at all, if gates already compute correct results?”?",
              options: [
                "Because once feedback is involved, the order in which values settle matters. A single clock edge tells every flip-flop to sample simultaneously, so the designer can reason about the longest path between edges and guarantee that all signals are stable when sampled. Without a common time reference, races between signals would give nondeterministic results, and verification would be impossible.",
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Because once feedback is involved, the order in which values settle matters. A single clock edge tells every flip-flop to sample simultaneously, so the designer can reason about the longest path between edges and guarantee that all signals are stable when sampled. Without a common time reference, races between signals would give nondeterministic results, and verification would be impossible.”",
            },
            {
              question: "Which of these is a hands-on step in “Building a Clock and Assembling Memory”?",
              options: [
                "Chain full adders",
                "Subtract with two's complement",
                "Add a clock",
                "Make a clock",
              ],
              correctIndex: 3,
              explanation: "“Make a clock” is part of this lesson's sequence: Build an astable multivibrator with a 555 timer or simulate one. Measure the frequency with a scope or simulator and change it with the RC values.",
            },
            {
              question: "What does the hands-on step “Build an 8-bit register” involve?",
              options: [
                "Connect eight D flip-flops with a shared clock and load line. Write 10101010, disable load, and confirm the value survives.",
                "Write a tiny loader that copies bytes from a simulated disk into instruction memory and jumps to the entry point.",
                "Append a parity bit to each code and flip one bit deliberately. Write a decoder that rejects the corrupted word instead of guessing.",
                "Pick 8 words and assign each a unique 3-bit code. Write the table, encode a sentence, and confirm no two words share a code.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Build an 8-bit register” as: Connect eight D flip-flops with a shared clock and load line. Write 10101010, disable load, and confirm the value survives.",
            },
          ],
          flashcards: [
            {
              front: "What goes wrong if two memory cells drive shared data lines at once?",
              back: "They contend. If one drives a line high and another drives it low, a low-resistance path from supply to ground appears, drawing excessive current and producing an indeterminate voltage on the line — a short circuit in effect. That is why only the selected cell may drive, enforced by tri-state outputs that disconnect, or by multiplexers that select exactly one source.",
            },
            {
              front: "Why does a computer need a clock at all, if gates already compute correct results?",
              back: "Because once feedback is involved, the order in which values settle matters. A single clock edge tells every flip-flop to sample simultaneously, so the designer can reason about the longest path between edges and guarantee that all signals are stable when sampled. Without a common time reference, races between signals would give nondeterministic results, and verification would be impossible.",
            },
            {
              front: "How do you put registers on a bus?",
              back: "Add tri-state buffers to two registers and select one at a time. Verify two drivers are never enabled together.",
            },
            {
              front: "How do you make a clock?",
              back: "Build an astable multivibrator with a 555 timer or simulate one. Measure the frequency with a scope or simulator and change it with the RC values.",
            },
            {
              front: "How do you build an 8-bit register?",
              back: "Connect eight D flip-flops with a shared clock and load line. Write 10101010, disable load, and confirm the value survives.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 18, Let's Build a Clock!; Ch. 19, An Assemblage of Memory",
            pageStart: null,
            pageEnd: null,
            note: "Builds a ring-oscillator clock with crystal stabilisation and dividers, explains synchronous sampling, then assembles registers from gated flip-flops and addressable memory from a decoder, covering bus contention and the 2^n capacity of n address lines.",
            sectionIndexes: [
              21,
              22,
            ],
          },
          estimatedMinutes: 14,
        },
        {
          title: "Automating Arithmetic: The Accumulator and the First Program",
          objective: "Assemble adder, memory, and clock into a machine that sums a list of numbers automatically, and see why a counter plus memory is already a program.",
          hook: "An adding machine with a counter is a computer, even before anyone writes a line of software.",
          paragraphs: [
            "Chapter 20 combines everything built so far. Take the ripple-carry adder, latch its output into a register called the accumulator, and feed one adder input from that accumulator while the other comes from memory. Add a clock and a small sequencer and the machine can perform one addition per cycle, with the accumulator carrying the running total. This is the architecture of every desk calculator and of the earliest electronic computers, and Petzold builds it entirely from earlier chapters.",
            "The interesting problem is not adding but knowing when to stop. The machine needs an address that increments each cycle and a way to terminate. Petzold introduces a counter as the address source and shows the two ways to end: a fixed count loaded in advance, or a special value (a sentinel) that signals completion. With those two pieces — an incrementing address and a termination condition — the machine reads a list, accumulates it, and halts. That is a loop, implemented in hardware rather than expressed in a language.",
            "The final conceptual step is the one that makes the chapter pivotal. If the sequence of operations is fixed by the wiring, the machine can only ever add lists. But if the operation to perform, and the address to operate on, are themselves read from memory, then the machine's behaviour becomes data — and modifying behaviour means modifying memory. Petzold uses this to arrive at the stored-program idea, noting that the counter, the accumulator, and the instruction decoder are the three organs that will become the program counter, the ALU register, and the control unit.",
            "He also exposes the cost of the design. Each operation takes at least one clock cycle, addition chains through the carry logic, and memory access is still one word per cycle. Those three constraints — cycle time, carry delay, and memory bandwidth — are exactly the constraints that motivate the pipeline, the lookahead adder, and the cache in later chapters. Automation does not remove the bottleneck; it makes it explicit.",
          ],
          bullets: [
            "An adder whose output latches into an accumulator, with the other operand taken from memory, performs one addition per clock cycle — the desk-calculator architecture built from earlier chapters' parts.",
            "Termination requires a counter feeding addresses plus a stopping rule, either a preset count or a sentinel value; together they implement a loop in hardware before any language exists.",
            "Storing the operation and address as memory data rather than wiring them makes behaviour programmable, and the counter, accumulator, and decoder become the program counter, ALU register, and control unit.",
            "Cycle time, carry propagation, and one-word-per-cycle memory are the three visible bottlenecks — the constraints that later motivate pipelining, lookahead adders, and caches.",
            "Petzold introduces a counter as the address source and shows the two ways to end: a fixed count loaded in advance, or a special value (a sentinel) that signals completion.",
            "But if the operation to perform, and the address to operate on, are themselves read from memory, then the machine's behaviour becomes data — and modifying behaviour means modifying memory.",
          ],
          steps: [
            {
              title: "Build the accumulator",
              detail: "Connect a register to an adder with its output fed back to the input. Add load and add control signals.",
            },
            {
              title: "Hand-assemble a program",
              detail: "Write the control steps to load 2, add 3, add 4, and halt. List the signal asserted at every step.",
            },
            {
              title: "Single-step it",
              detail: "Run the program one clock at a time in your simulator and print the accumulator after each step. Confirm it reaches 9.",
            },
          ],
          takeaway: "Once addresses come from a counter and operations come from memory, arithmetic becomes a program — and the machine's limits become measurable rather than mysterious.",
          diagram: {
            type: "cycle",
            edges: [
              {
                to: "mem",
                from: "ctr",
                label: "address",
              },
              {
                to: "add",
                from: "mem",
                label: "operand",
              },
              {
                to: "add",
                from: "acc",
                label: "running total",
              },
              {
                to: "acc",
                from: "add",
                label: "store",
              },
              {
                to: "ctr",
                from: "acc",
                label: "halt check",
              },
            ],
            nodes: [
              {
                id: "mem",
                label: "Memory: next operand",
                emphasis: false,
              },
              {
                id: "add",
                label: "Adder",
                emphasis: true,
              },
              {
                id: "acc",
                label: "Accumulator latch",
                emphasis: true,
              },
              {
                id: "ctr",
                label: "Counter: next address",
                emphasis: false,
              },
            ],
            title: "Accumulator loop",
          },
          quiz: {
            question: "What distinguishes a machine that computes a fixed function from a stored-program computer?",
            options: [
              "The stored-program computer contains memory, while a fixed-function machine does not",
              "In a stored-program machine the operations and their operands come from the same memory as the data, so changing behaviour means changing memory contents rather than rewiring",
              "The stored-program computer runs faster because its adder is wider",
              "The fixed-function machine cannot loop, while the stored-program computer can",
            ],
            correctIndex: 1,
            explanation: "Both machines have memory and adders. The difference is where control comes from: if instructions are fetched from memory like data, then the machine can execute any program it is given. That is the stored-program concept, and it is what makes a computer general-purpose.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Automating Arithmetic: The Accumulator and the First Program”?",
              options: [
                "An adder whose output latches into an accumulator, with the other operand taken from memory, performs one addition per clock cycle — the desk-calculator architecture built from earlier chapters' parts.",
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “An adder whose output latches into an accumulator, with the other operand taken from memory, performs one addition per clock cycle — the desk-calculator architecture built from earlier chapters' parts.”",
            },
            {
              question: "Which statement best explains “Why is the accumulator a natural place to keep a running total?”?",
              options: [
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because it is both a source and a destination of the adder. Feeding back the previous result as one input lets a single addition per cycle accumulate a whole list with no extra storage for partial sums. This is the minimum-state accumulator machine, and it explains why early architectures were accumulator-based: the datapath needs no register file, only one latch plus the adder.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Because it is both a source and a destination of the adder. Feeding back the previous result as one input lets a single addition per cycle accumulate a whole list with no extra storage for partial sums. This is the minimum-state accumulator machine, and it explains why early architectures were accumulator-based: the datapath needs no register file, only one latch plus the adder.”",
            },
            {
              question: "Which of these is a hands-on step in “Automating Arithmetic: The Accumulator and the First Program”?",
              options: [
                "Connect two registers",
                "Extend the ALU",
                "Test every operation",
                "Build the accumulator",
              ],
              correctIndex: 3,
              explanation: "“Build the accumulator” is part of this lesson's sequence: Connect a register to an adder with its output fed back to the input. Add load and add control signals.",
            },
            {
              question: "What does the hands-on step “Hand-assemble a program” involve?",
              options: [
                "Write the control steps to load 2, add 3, add 4, and halt. List the signal asserted at every step.",
                "Remove the spaces from your encoded sentence and try to decode it. Add a separator or fixed width and show why framing is required.",
                "Choose short and long flashes for dot and dash, then send HELLO to a friend or phone camera. Keep a fixed gap between letters.",
                "Record the on/off durations as a list and map them back to letters. Handle an unknown pattern by printing a clear error.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Hand-assemble a program” as: Write the control steps to load 2, add 3, add 4, and halt. List the signal asserted at every step.",
            },
          ],
          flashcards: [
            {
              front: "Why is the accumulator a natural place to keep a running total?",
              back: "Because it is both a source and a destination of the adder. Feeding back the previous result as one input lets a single addition per cycle accumulate a whole list with no extra storage for partial sums. This is the minimum-state accumulator machine, and it explains why early architectures were accumulator-based: the datapath needs no register file, only one latch plus the adder.",
            },
            {
              front: "How does a hardware loop differ from a software loop?",
              back: "A hardware loop is a counter wired to the address input plus a comparator that stops or repeats; there is no branch instruction, just a fixed sequence that repeats until a condition holds. A software loop stores the condition and the jump target in memory and evaluates them at run time, which is far more flexible — any condition, any target — at the cost of fetch, decode, and comparison instructions per iteration.",
            },
            {
              front: "How do you build the accumulator?",
              back: "Connect a register to an adder with its output fed back to the input. Add load and add control signals.",
            },
            {
              front: "How do you hand-assemble a program?",
              back: "Write the control steps to load 2, add 3, add 4, and halt. List the signal asserted at every step.",
            },
            {
              front: "How do you single-step it?",
              back: "Run the program one clock at a time in your simulator and print the accumulator after each step. Confirm it reaches 9.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 20, Automating Arithmetic",
            pageStart: null,
            pageEnd: null,
            note: "Combines adder, accumulator register, memory, and counter into a machine that sums a list; covers termination by preset count or sentinel, the emergence of the stored-program idea from memory-resident operations, and cycle, carry, and memory-bandwidth bottlenecks.",
            sectionIndexes: [
              23,
            ],
          },
          estimatedMinutes: 14,
        },
      ],
    },
    {
      title: "Module 4 — The CPU and Beyond (Chapters 21–28)",
      summary: "The ALU, registers and buses, control signals, jumps and function calls, peripherals, the operating system, and what software ultimately makes possible.",
      lessons: [
        {
          title: "The Arithmetic Logic Unit, Registers, and Buses",
          objective: "Explain how one circuit performs several operations by selecting results, and how buses move data between registers and memory under control of enable signals.",
          hook: "The ALU is not a calculator — it is a set of calculators with a selector switch on the output.",
          paragraphs: [
            "Chapter 21 generalises the adder. Build an adder, a subtractor, and the logic operations AND, OR, XOR, and NOT, all fed from the same two input words, and then put a multiplexer on their outputs. The operation code selects which result reaches the output, so a single box computes several functions with shared input wiring. Petzold adds the status flags — carry, zero, sign, overflow — as extra outputs, and notes that these flags are what make conditional behaviour possible, which is the bridge to the next chapter.",
            "Chapter 22 solves the wiring problem that Chapter 19 raised. If every register's output went separately to every component, the number of wires would grow quadratically. Instead, all registers share one bus, and each register may drive the bus only when its enable is asserted; at most one driver at a time. Data flows register to bus, bus to register, one transfer per clock. This is the von Neumann datapath in miniature: a small number of buses plus a large number of selectable sources.",
            "Petzold is precise about the consequences. A single shared bus makes one transfer per cycle, so the machine's speed is bound by bus occupancy rather than by gate delay — the beginning of the bottleneck that caches, multiple buses, and pipelining later attack. He also shows how the register set becomes the programmer's visible state: an instruction names registers, the enable signals do the routing, and the programmer never sees the wires.",
            "The pair of chapters together define the datapath. The ALU supplies operations, registers hold operands and results, the bus carries data, and flags report conditions. What is still missing is the component that asserts those enables in the right order — the control unit — and that is Chapter 23.",
          ],
          bullets: [
            "Several circuits sharing inputs with a multiplexer on the output give an ALU: the opcode selects results rather than rewiring, and status flags carry conditions out to the rest of the machine.",
            "A single shared bus with per-register enable signals replaces quadratic point-to-point wiring, allowing at most one driver at a time and one transfer per cycle.",
            "Bus occupancy becomes the binding constraint on speed rather than gate delay, which is precisely the limit that caches, multiple buses, and pipelining later relax.",
            "Registers plus ALU plus bus form the datapath — the programmer-visible machine state — leaving only the ordering of enable signals to be supplied by the control unit.",
            "Instead, all registers share one bus, and each register may drive the bus only when its enable is asserted; at most one driver at a time.",
            "He also shows how the register set becomes the programmer's visible state: an instruction names registers, the enable signals do the routing, and the programmer never sees the wires.",
          ],
          steps: [
            {
              title: "Extend the ALU",
              detail: "Add AND, OR, XOR, and NOT to your adder with a multiplexer selected by an opcode. Include zero and carry flags.",
            },
            {
              title: "Connect two registers",
              detail: "Place two registers on a shared bus with tri-state outputs. Move a value from A to B in two cycles and verify the bus is never double-driven.",
            },
            {
              title: "Test every operation",
              detail: "Write a vector table of operands, opcode, result, and flags. Run all rows and fail loudly on the first mismatch.",
            },
          ],
          takeaway: "An ALU is selection among operations and a bus is selection among sources; together they make a datapath whose remaining need is ordering.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "bus",
                from: "src",
                label: "drive",
              },
              {
                to: "alu",
                from: "bus",
                label: "operands",
              },
              {
                to: "dst",
                from: "alu",
                label: "result + flags",
              },
            ],
            nodes: [
              {
                id: "src",
                label: "Source register (enabled)",
                emphasis: true,
              },
              {
                id: "bus",
                label: "Shared bus lines",
                emphasis: true,
              },
              {
                id: "alu",
                label: "ALU (opcode selects)",
                emphasis: false,
              },
              {
                id: "dst",
                label: "Destination register (latched)",
                emphasis: false,
              },
            ],
            title: "One transfer across a shared bus",
          },
          quiz: {
            question: "Why must only one register drive a shared bus at any instant?",
            options: [
              "Because the bus is too narrow to carry more than one word at a time",
              "Because two drivers with different values would contend, producing an indeterminate level and excessive current, so enable signals must guarantee exactly one source",
              "Because registers can only be read once per program run",
              "Because the ALU can only accept one operand",
            ],
            correctIndex: 1,
            explanation: "A bus is a wired-OR of drivers: if one drives high and another low, the result is a short circuit and an undefined voltage. Exclusive enable logic is therefore a correctness requirement, not a bandwidth optimisation.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “The Arithmetic Logic Unit, Registers, and Buses”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Several circuits sharing inputs with a multiplexer on the output give an ALU: the opcode selects results rather than rewiring, and status flags carry conditions out to the rest of the machine.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Several circuits sharing inputs with a multiplexer on the output give an ALU: the opcode selects results rather than rewiring, and status flags carry conditions out to the rest of the machine.”",
            },
            {
              question: "Which statement best explains “Why are status flags like zero, carry, and sign essential to a CPU rather than a convenience?”?",
              options: [
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "Because conditional execution depends on them. A branch instruction does not compare in the abstract; it tests a flag set by a previous operation. Without flags, the machine could compute results but could never choose between alternatives, so loops, if-then logic, and function returns would all be impossible. They are the interface between arithmetic and control flow.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Because conditional execution depends on them. A branch instruction does not compare in the abstract; it tests a flag set by a previous operation. Without flags, the machine could compute results but could never choose between alternatives, so loops, if-then logic, and function returns would all be impossible. They are the interface between arithmetic and control flow.”",
            },
            {
              question: "Which of these is a hands-on step in “The Arithmetic Logic Unit, Registers, and Buses”?",
              options: [
                "Add in binary by hand",
                "Convert between bases",
                "Use BCD",
                "Extend the ALU",
              ],
              correctIndex: 3,
              explanation: "“Extend the ALU” is part of this lesson's sequence: Add AND, OR, XOR, and NOT to your adder with a multiplexer selected by an opcode. Include zero and carry flags.",
            },
            {
              question: "What does the hands-on step “Connect two registers” involve?",
              options: [
                "Place two registers on a shared bus with tri-state outputs. Move a value from A to B in two cycles and verify the bus is never double-driven.",
                "Truncate a multi-byte character and confirm your decoder reports an error instead of emitting a replacement character silently.",
                "Write an encoder for A, é, €, and 😀. Print the bytes in hex and compare them with a hexdump of the same text.",
                "Build a full adder from two half adders and an OR, then chain four to add 4-bit numbers. Test 7 + 1 and 15 + 1.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Connect two registers” as: Place two registers on a shared bus with tri-state outputs. Move a value from A to B in two cycles and verify the bus is never double-driven.",
            },
          ],
          flashcards: [
            {
              front: "Why are status flags like zero, carry, and sign essential to a CPU rather than a convenience?",
              back: "Because conditional execution depends on them. A branch instruction does not compare in the abstract; it tests a flag set by a previous operation. Without flags, the machine could compute results but could never choose between alternatives, so loops, if-then logic, and function returns would all be impossible. They are the interface between arithmetic and control flow.",
            },
            {
              front: "What does a bus cost you compared with dedicated point-to-point wiring?",
              back: "Throughput. A shared bus carries one transfer at a time, so the machine's cycle time is set by bus occupancy rather than by logic delay, and every additional register competes for the same resource. Dedicated paths allow simultaneous transfers but grow as the square of the component count. Buses trade parallelism for wiring simplicity — a trade that caches, multiple buses, and crossbars later revisit.",
            },
            {
              front: "How do you test every operation?",
              back: "Write a vector table of operands, opcode, result, and flags. Run all rows and fail loudly on the first mismatch.",
            },
            {
              front: "How do you extend the ALU?",
              back: "Add AND, OR, XOR, and NOT to your adder with a multiplexer selected by an opcode. Include zero and carry flags.",
            },
            {
              front: "How do you connect two registers?",
              back: "Place two registers on a shared bus with tri-state outputs. Move a value from A to B in two cycles and verify the bus is never double-driven.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 21, The Arithmetic Logic Unit; Ch. 22, Registers and Busses",
            pageStart: null,
            pageEnd: null,
            note: "Builds an ALU by multiplexing adder, subtractor, and logic results under an opcode, adds carry/zero/sign/overflow flags, and introduces the shared bus with exclusive enable signals as the solution to quadratic wiring growth.",
            sectionIndexes: [
              24,
              25,
            ],
          },
          estimatedMinutes: 14,
        },
        {
          title: "CPU Control Signals, Then Loops, Jumps, and Calls",
          objective: "Explain how a control unit sequences enable signals, and how the program counter plus jump and call instructions turn fixed hardware into general computation.",
          hook: "The control unit is a tiny state machine, and the jump instruction is what makes a computer more than a calculator.",
          paragraphs: [
            "Chapter 23 asks who asserts the enables. The answer is a control unit, and Petzold builds it as a sequencer: a counter or state machine produces a series of control words, each of which is a bit pattern that turns specific enables on and off. In the simplest design the control word is stored in a ROM and addressed by a combination of the instruction opcode and the current step. This is microcoded control, and it is the mechanism that closes the loop between instruction bits and datapath activity.",
            "Every instruction becomes a short sequence of control words: fetch, decode, read operands, execute, write back. Petzold walks a load and an add in this style so the reader sees that the CPU is not magic but a schedule. He also flags the design tension: a microcoded control store is flexible and easy to change, while hardwired control is faster but frozen in silicon — the same flexibility-versus-speed trade that appears at every level of the book.",
            "Chapter 24 delivers the conceptual leap. The program counter is just a register holding the address of the next instruction, and the fetch cycle increments it. A jump instruction overwrites it with a new address, so execution can leave the linear sequence — and with a conditional jump testing a flag, the machine can loop. Petzold then shows that a call is a jump that first saves the return address on a stack, and a return pops it; that single addition turns jumps into procedures, gives recursion, and creates the stack frame.",
            "The implication is large: this handful of instructions — load, store, add, compare, jump, call, return — is sufficient to compute anything computable. The rest of a modern ISA is convenience and performance, not new power. Petzold makes this explicit because it is the book's philosophical peak: computation does not require complexity, only the ability to read, modify, and conditionally redirect.",
          ],
          bullets: [
            "The control unit is a sequencer that emits control words in order, each a bit pattern enabling particular datapath elements, addressed by opcode and step — microcoded control in its simplest form.",
            "Every instruction decomposes into fetch, decode, operand read, execute, and write-back steps, showing that the CPU is a schedule rather than a mystery; microcode trades speed for flexibility against hardwired control.",
            "The program counter makes the instruction sequence data, so a jump can redirect it, a conditional jump can loop, and a call that pushes a return address on a stack yields procedures, recursion, and stack frames.",
            "Load, store, arithmetic, compare, jump, call, and return suffice for universal computation — everything else in a modern ISA buys speed and convenience, not new capability.",
            "He also flags the design tension: a microcoded control store is flexible and easy to change, while hardwired control is faster but frozen in silicon — the same flexibility-versus-speed trade that appears at every level of the book.",
            "Petzold makes this explicit because it is the book's philosophical peak: computation does not require complexity, only the ability to read, modify, and conditionally redirect.",
          ],
          steps: [
            {
              title: "Write the control table",
              detail: "For each instruction, list which registers load, which ALU op runs, and which bus source is selected during each cycle.",
            },
            {
              title: "Implement fetch-decode-execute",
              detail: "Build a state machine that fetches the next instruction, decodes the opcode, and asserts the matching control signals.",
            },
            {
              title: "Close a loop",
              detail: "Add JMP and JZ, then write a program that counts down to zero. Trace the program counter to prove the loop exits.",
            },
          ],
          takeaway: "Control words sequence the datapath, and a program counter that instructions can overwrite is the difference between a calculator and a universal machine.",
          diagram: {
            type: "cycle",
            edges: [
              {
                to: "decode",
                from: "fetch",
                label: "",
              },
              {
                to: "exec",
                from: "decode",
                label: "select sequence",
              },
              {
                to: "wb",
                from: "exec",
                label: "",
              },
              {
                to: "pc",
                from: "wb",
                label: "",
              },
              {
                to: "fetch",
                from: "pc",
                label: "next",
              },
            ],
            nodes: [
              {
                id: "fetch",
                label: "Fetch at PC",
                emphasis: true,
              },
              {
                id: "decode",
                label: "Decode opcode",
                emphasis: false,
              },
              {
                id: "exec",
                label: "Execute via control words",
                emphasis: true,
              },
              {
                id: "wb",
                label: "Write back",
                emphasis: false,
              },
              {
                id: "pc",
                label: "PC increment or jump",
                emphasis: false,
              },
            ],
            title: "The instruction cycle",
          },
          quiz: {
            question: "What does a call instruction add that a jump instruction lacks?",
            options: [
              "It allows jumping to an address that is not known until run time",
              "It saves the return address on a stack before transferring control, so a return can resume the caller — enabling procedures, nesting, and recursion",
              "It switches the CPU into a privileged mode where memory is protected",
              "It performs the jump only if a condition flag is set",
            ],
            correctIndex: 1,
            explanation: "A jump is one-way; nothing records where to come back to. A call pushes the current program counter onto a stack and jumps, and a return pops it. Nesting works because the stack is last-in-first-out, and recursion follows directly.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “CPU Control Signals, Then Loops, Jumps, and Calls”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "The control unit is a sequencer that emits control words in order, each a bit pattern enabling particular datapath elements, addressed by opcode and step — microcoded control in its simplest form.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “The control unit is a sequencer that emits control words in order, each a bit pattern enabling particular datapath elements, addressed by opcode and step — microcoded control in its simplest form.”",
            },
            {
              question: "Which statement best explains “What is microcode, and why did early CPUs use it?”?",
              options: [
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
                "It is a layer of control words stored in an internal ROM that sequences the datapath for each instruction. Early CPUs used it because complex instructions could be implemented as sequences of simple control steps without redesigning the hardware — a bug fix meant editing the microcode, not the chip. The cost is that each instruction takes multiple internal cycles, which is why RISC designs moved toward hardwired control.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “It is a layer of control words stored in an internal ROM that sequences the datapath for each instruction. Early CPUs used it because complex instructions could be implemented as sequences of simple control steps without redesigning the hardware — a bug fix meant editing the microcode, not the chip. The cost is that each instruction takes multiple internal cycles, which is why RISC designs moved toward hardwired control.”",
            },
            {
              question: "Which of these is a hands-on step in “CPU Control Signals, Then Loops, Jumps, and Calls”?",
              options: [
                "Add in binary by hand",
                "Convert between bases",
                "Use BCD",
                "Write the control table",
              ],
              correctIndex: 3,
              explanation: "“Write the control table” is part of this lesson's sequence: For each instruction, list which registers load, which ALU op runs, and which bus source is selected during each cycle.",
            },
            {
              question: "What does the hands-on step “Implement fetch-decode-execute” involve?",
              options: [
                "Build a state machine that fetches the next instruction, decodes the opcode, and asserts the matching control signals.",
                "Run the program one clock at a time in your simulator and print the accumulator after each step. Confirm it reaches 9.",
                "Write the control steps to load 2, add 3, add 4, and halt. List the signal asserted at every step.",
                "Add AND, OR, XOR, and NOT to your adder with a multiplexer selected by an opcode. Include zero and carry flags.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Implement fetch-decode-execute” as: Build a state machine that fetches the next instruction, decodes the opcode, and asserts the matching control signals.",
            },
          ],
          flashcards: [
            {
              front: "Why is a conditional jump the single most powerful instruction in the set?",
              back: "Because it makes control flow depend on data. Without it, a program is a fixed straight line and can only compute functions with no decisions — no loops, no branching, no early exit, no procedures that return on a condition. With it, the machine can repeat, skip, and choose, which is exactly the capability that separates a calculator from a computer.",
            },
            {
              front: "What is microcode, and why did early CPUs use it?",
              back: "It is a layer of control words stored in an internal ROM that sequences the datapath for each instruction. Early CPUs used it because complex instructions could be implemented as sequences of simple control steps without redesigning the hardware — a bug fix meant editing the microcode, not the chip. The cost is that each instruction takes multiple internal cycles, which is why RISC designs moved toward hardwired control.",
            },
            {
              front: "How do you implement fetch-decode-execute?",
              back: "Build a state machine that fetches the next instruction, decodes the opcode, and asserts the matching control signals.",
            },
            {
              front: "How do you close a loop?",
              back: "Add JMP and JZ, then write a program that counts down to zero. Trace the program counter to prove the loop exits.",
            },
            {
              front: "How do you write the control table?",
              back: "For each instruction, list which registers load, which ALU op runs, and which bus source is selected during each cycle.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 23, CPU Control Signals; Ch. 24, Loops, Jumps, and Calls",
            pageStart: null,
            pageEnd: null,
            note: "Builds a microcoded control unit that sequences datapath enables, decomposes instructions into fetch/decode/execute/write-back steps, and uses the program counter with jumps, conditional jumps, and stack-based calls to reach universal computation.",
            sectionIndexes: [
              26,
              27,
            ],
          },
          estimatedMinutes: 15,
        },
        {
          title: "Peripherals, the Operating System, Coding, and the World Brain",
          objective: "Explain how I/O devices attach to a machine, what an operating system adds on top, how programming languages layer over machine code, and what Petzold concludes about computers and human thought.",
          hook: "The last four chapters leave the machine behind and ask what it is for.",
          paragraphs: [
            "Chapter 25 adds the outside world. A keyboard is a matrix of switches scanned by a controller; a display is a grid of addresses written repeatedly by a refresh circuit; a disk stores bits magnetically and retrieves them by block. Each device is slower than the CPU by orders of magnitude, so the interface is not direct but buffered: the CPU writes a value into a device register and moves on, and an interrupt later reports completion. Petzold's argument is that peripherals are not an afterthought — the interrupt and the memory-mapped register are what let a fast machine cooperate with slow ones.",
            "Chapter 26 adds the operating system as the layer that makes a pile of hardware usable by many programs. It provides a file system so that blocks have names and durability, virtual memory so that programs need not know real addresses, and a scheduler so that several programs can share one CPU. Petzold also shows the tension: each abstraction costs performance and each protection boundary costs a mode switch, which is why systems programming is the art of deciding which abstraction is worth its cost.",
            "Chapter 27, 'Coding', is the chapter that admits the book was never about hardware. Writing in machine code is possible but unmanageable, so assembly adds symbols and macros, and higher-level languages add expressions, types, and structured control flow that compilers translate back down. Petzold shows how a simple statement becomes a chain of loads, arithmetic, and stores, and argues that the stack of translations — source, compiler, assembler, linker, loader, microcode — is the same pattern of levels from Chapter 1, applied to software.",
            "Abstraction is not an escape from the machine; it is a managed delegation to it.",
            "Chapter 28, 'The World Brain', closes with H. G. Wells's 1937 proposal for a universal encyclopaedia and asks how close the internet came. Petzold's answer is careful: the network achieved the storage and the access, but the synthesis and understanding Wells imagined remain human work. He notes that a computer manipulates codes whose meanings live entirely outside it — in the conventions people agree on — and that this is both the limitation and the achievement. The book ends where it began, with two friends agreeing on what a flash of light means.",
          ],
          bullets: [
            "Peripherals attach through buffered interfaces — device registers plus interrupts — because they are orders of magnitude slower than the CPU, so memory-mapped I/O and interrupts are what let fast and slow components cooperate.",
            "The operating system supplies files, virtual memory, and scheduling so that multiple programs can share hardware safely; every abstraction and mode switch has a measurable cost, which is the central design tension of systems software.",
            "Programming languages are a managed delegation to the machine: source becomes compiler output, assembly, object code, and microcode, repeating the level structure of Chapter 1 in software rather than hardware.",
            "Petzold closes on Wells's 'World Brain': the network delivered storage and access, but meaning lives in human conventions outside the machine, so synthesis and understanding remain our work.",
            "Each device is slower than the CPU by orders of magnitude, so the interface is not direct but buffered: the CPU writes a value into a device register and moves on, and an interrupt later reports completion.",
            "Petzold also shows the tension: each abstraction costs performance and each protection boundary costs a mode switch, which is why systems programming is the art of deciding which abstraction is worth its cost.",
          ],
          steps: [
            {
              title: "Memory-map a device",
              detail: "Reserve an address for a keyboard status byte and a data byte. Poll the status bit before reading a key.",
            },
            {
              title: "Add an interrupt path",
              detail: "Trigger a handler when the keyboard flag sets, save registers, read the key, and return. Compare polling with interrupts.",
            },
            {
              title: "Load a program from storage",
              detail: "Write a tiny loader that copies bytes from a simulated disk into instruction memory and jumps to the entry point.",
            },
          ],
          takeaway: "A computer is a stack of agreed codes from a flashlight to a compiler, and its power comes from delegation across levels while meaning stays with the people who defined the codes.",
          diagram: {
            type: "hierarchy",
            edges: [
              {
                to: "cpu",
                from: "circuit",
                label: "compose gates",
              },
              {
                to: "os",
                from: "cpu",
                label: "abstract hardware",
              },
              {
                to: "lang",
                from: "os",
                label: "host programs",
              },
              {
                to: "net",
                from: "lang",
                label: "connect people",
              },
            ],
            nodes: [
              {
                id: "circuit",
                label: "Relays, gates, flip-flops",
                emphasis: false,
              },
              {
                id: "cpu",
                label: "ALU, buses, control, PC",
                emphasis: true,
              },
              {
                id: "os",
                label: "OS: files, memory, scheduling",
                emphasis: false,
              },
              {
                id: "lang",
                label: "Languages and compilers",
                emphasis: false,
              },
              {
                id: "net",
                label: "Network and shared knowledge",
                emphasis: false,
              },
            ],
            title: "The levels Petzold built, bottom to top",
          },
          quiz: {
            question: "What is Petzold's central claim about where the meaning of a computer's codes resides?",
            options: [
              "In the transistors, because their physical states determine what a program does",
              "In the conventions people agree on — the machine manipulates codes whose meanings exist outside it, which is why the same hardware can serve any purpose we define",
              "In the compiler, which is the only component that understands intent",
              "In the operating system, which arbitrates between competing interpretations",
            ],
            correctIndex: 1,
            explanation: "Hardware moves voltages; only shared conventions make a pattern mean a letter, a price, or an instruction. That is why the book opens with a code agreed between two children and closes with a world encyclopaedia: meaning is social, and the machine is a very fast, very literal participant.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Peripherals, the Operating System, Coding, and the World Brain”?",
              options: [
                "A code is an agreed mapping from symbols to meanings; it is invented rather than discovered, which is why the same information can ride on Morse, Braille, or a flashlight with equal legitimacy.",
                "Braille is six binary positions giving 64 patterns, organised hierarchically by decade rather than by weight — a code, not a number system, and the difference becomes essential when arithmetic arrives.",
                "Switches in series implement AND and switches in parallel implement OR, so boolean logic is not an analogy imposed on circuits but a description of what wiring already does.",
                "Peripherals attach through buffered interfaces — device registers plus interrupts — because they are orders of magnitude slower than the CPU, so memory-mapped I/O and interrupts are what let fast and slow components cooperate.",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Peripherals attach through buffered interfaces — device registers plus interrupts — because they are orders of magnitude slower than the CPU, so memory-mapped I/O and interrupts are what let fast and slow components cooperate.”",
            },
            {
              question: "Which statement best explains “Why are interrupts necessary instead of the CPU simply waiting for a device?”?",
              options: [
                "Because devices are vastly slower — a disk seek or a network round trip can span millions of CPU cycles. Polling wastes all of them, and a single program would monopolise the machine while waiting. An interrupt lets the CPU run other work and be notified when the device is ready, which is what makes concurrency and responsiveness possible. It also introduces the complexity of asynchronous state that later becomes device drivers and concurrency bugs.",
                "An agreed mapping between symbols and meanings that both sender and receiver possess. A signal alone carries no meaning; meaning appears only when a shared table says what each distinguishable pattern stands for. This is why the same physical channel can carry Morse, Braille, or ASCII — the channel is unchanged, only the table differs, and a receiver with the wrong table decodes nonsense.",
                "Because the physical world is analogue and noisy. A circuit must only decide whether a voltage is above or below a threshold, leaving a wide margin for temperature drift, ageing components, and interference. Ten distinguishable levels would shrink that margin by a factor of five, making circuits fragile and expensive. Binary trades representational density for reliability, and reliability is what makes billion-transistor chips possible.",
                "Because current must pass through both, so the path conducts only when switch A is closed and switch B is closed. If either opens, the circuit is broken. This is structural, not a convention: the same arrangement in parallel gives OR because either closed switch provides a complete path. Logic gates are therefore descriptions of wiring topologies rather than separate inventions.",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Because devices are vastly slower — a disk seek or a network round trip can span millions of CPU cycles. Polling wastes all of them, and a single program would monopolise the machine while waiting. An interrupt lets the CPU run other work and be notified when the device is ready, which is what makes concurrency and responsiveness possible. It also introduces the complexity of asynchronous state that later becomes device drivers and concurrency bugs.”",
            },
            {
              question: "Which of these is a hands-on step in “Peripherals, the Operating System, Coding, and the World Brain”?",
              options: [
                "Test every operation",
                "Close a loop",
                "Implement fetch-decode-execute",
                "Memory-map a device",
              ],
              correctIndex: 3,
              explanation: "“Memory-map a device” is part of this lesson's sequence: Reserve an address for a keyboard status byte and a data byte. Poll the status bit before reading a key.",
            },
            {
              question: "What does the hands-on step “Add an interrupt path” involve?",
              options: [
                "Trigger a handler when the keyboard flag sets, save registers, read the key, and return. Compare polling with interrupts.",
                "Write functions for binary, octal, and hexadecimal to decimal and back. Round-trip every number from 0 to 255 and assert equality.",
                "Read the byte sequence back, detect continuation bytes by their high bits, and reconstruct each code point. Assert it matches the input.",
                "Truncate a multi-byte character and confirm your decoder reports an error instead of emitting a replacement character silently.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add an interrupt path” as: Trigger a handler when the keyboard flag sets, save registers, read the key, and return. Compare polling with interrupts.",
            },
          ],
          flashcards: [
            {
              front: "Why are interrupts necessary instead of the CPU simply waiting for a device?",
              back: "Because devices are vastly slower — a disk seek or a network round trip can span millions of CPU cycles. Polling wastes all of them, and a single program would monopolise the machine while waiting. An interrupt lets the CPU run other work and be notified when the device is ready, which is what makes concurrency and responsiveness possible. It also introduces the complexity of asynchronous state that later becomes device drivers and concurrency bugs.",
            },
            {
              front: "How does a compiler relate to the machine levels built in this book?",
              back: "It is a translator that turns a language's abstractions into operations the lower levels already provide: arithmetic into loads and adds, control flow into compares and jumps, function calls into stack manipulation. It does not create new machine capability; it maps intent onto an instruction set whose primitives — memory, arithmetic, branches, calls — were established in Chapters 19-24. That is why understanding the machine makes you a better programmer.",
            },
            {
              front: "How do you add an interrupt path?",
              back: "Trigger a handler when the keyboard flag sets, save registers, read the key, and return. Compare polling with interrupts.",
            },
            {
              front: "How do you load a program from storage?",
              back: "Write a tiny loader that copies bytes from a simulated disk into instruction memory and jumps to the entry point.",
            },
            {
              front: "How do you memory-map a device?",
              back: "Reserve an address for a keyboard status byte and a data byte. Poll the status bit before reading a key.",
            },
          ],
          sourceRef: {
            label: "Petzold, Code 2e — Ch. 25, Peripherals; Ch. 26, The Operating System; Ch. 27, Coding; Ch. 28, The World Brain",
            pageStart: null,
            pageEnd: null,
            note: "Covers scanned keyboards, refreshed displays, and magnetic storage with interrupt-driven buffered I/O; the OS as files, virtual memory, and scheduling; languages and compilers as layered translation; and Wells's World Brain as Petzold's closing argument that meaning lives in human conventions.",
            sectionIndexes: [
              28,
              29,
              30,
              31,
            ],
          },
          estimatedMinutes: 16,
        },
      ],
    },
  ],
};
