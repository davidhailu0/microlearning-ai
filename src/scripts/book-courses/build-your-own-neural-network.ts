import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on 2026-11-16.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const nnCourse: DraftCourse = {
  title: "Build Your Own Neural Network",
  description: "From scratch: implement matrix operations, forward propagation with sigmoid activation, compute cross-entropy loss, backpropagate errors through the network, and update weights with gradient descent. Train on synthetic data and watch the loss drop. Learn the mechanics that power modern AI.",
  category: "AI",
  level: "intermediate",
  coverEmoji: "🧠",
  tags: [
    "neural-network",
    "machine-learning",
    "AI",
    "backpropagation",
    "gradient-descent",
  ],
  modules: [
    {
      title: "Foundations: Matrices and Activations",
      summary: "Implement matrix multiplication from scratch, then the sigmoid activation and its derivative.",
      lessons: [
        {
          title: "Matrix Multiplication from Scratch",
          objective: "Write a function that multiplies two 2D arrays (matrices) without using numpy or tensorflow.",
          hook: "Everything in a neural network starts with matrix multiplication.",
          paragraphs: [
            "Before you can train a network, you need to multiply matrices. Given input X (n×m) and weights W (m×p), compute the dot product to produce output Y (n×p). Implement this using nested loops, being careful with dimensions and the sum-over-k convention.",
          ],
          bullets: [
            "Validate that inner dimensions match: X.shape[1] == W.shape[0]",
            "Initialize an output matrix of shape (X.shape[0], W.shape[1])",
            "For each output cell y[i][j], compute sum_k X[i][k] * W[k][j]",
            "Test with small matrices (2×3 * 3×2) before scaling up",
          ],
          steps: [
            {
              title: "Set up the project",
              detail: "Use Python with NumPy only for data loading, not for the network math, or another language with arrays. Create nn/ and tests/, plus a script that runs one forward pass on fixed inputs.",
            },
            {
              title: "Represent matrices",
              detail: "Use arrays of arrays or a flat typed array with rows and columns. Write shape checks that throw before multiplication.",
            },
            {
              title: "Implement the triple loop",
              detail: "For C = A × B, loop over rows of A, columns of B, and the shared dimension. Accumulate into C[i][j] and keep the inner loop contiguous.",
            },
            {
              title: "Test against known values",
              detail: "Multiply a 2×3 by a 3×2 matrix with hand-computed results. Add identity and zero matrices, and confirm incompatible shapes fail.",
            },
            {
              title: "Measure and optimize",
              detail: "Time the triple loop on a 200×200 multiply. Reorder loops for cache locality or use a typed array, then measure again rather than assuming.",
            },
          ],
          takeaway: "Matrix multiplication is the fundamental operation that layers perform — understanding it manually makes the numpy/tensorflow versions crystal clear.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "k",
                from: "X",
                label: "row i, col k",
              },
              {
                to: "k",
                from: "W",
                label: "row k, col j",
              },
              {
                to: "Y",
                from: "k",
                label: "accumulate sum",
              },
            ],
            nodes: [
              {
                id: "X",
                label: "Input (n×m)",
                emphasis: false,
              },
              {
                id: "W",
                label: "Weights (m×p)",
                emphasis: true,
              },
              {
                id: "Y",
                label: "Output (n×p)",
                emphasis: false,
              },
              {
                id: "k",
                label: "Sum over k",
                emphasis: true,
              },
            ],
            title: "Matrix multiplication",
          },
          quiz: {
            question: "If X is 4×3 and W is 3×5, what is the shape of the result Y?",
            options: [
              "4×3",
              "3×5",
              "4×5",
              "12×5",
            ],
            correctIndex: 2,
            explanation: "The inner dimensions (3) must match; the result has the outer dimensions: 4×5.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Matrix Multiplication from Scratch”?",
              options: [
                "Validate that inner dimensions match: X.shape[1] == W.shape[0]",
                "Forward: σ(x) = 1 / (1 + e⁻ˣ), clip extreme inputs to avoid overflow",
                "Initialize W1 (input_dim × hidden_dim), b1 (hidden_dim), W2 (hidden_dim × output_dim), b2 (output_dim)",
                "Output error: δ² = (y_hat − y_true) ⊙ σ'(·) — the gradient of cross-entropy with sigmoid",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Validate that inner dimensions match: X.shape[1] == W.shape[0]”",
            },
            {
              question: "Which statement best explains “Matrix multiplication shape rule”?",
              options: [
                "σ(x) = 1 / (1 + e⁻ˣ)",
                "If X is (n×m) and W is (m×p), the result Y is (n×p)",
                "Computing the network output from input and weights — deterministic, no learning yet",
                "Compute ∂L/∂W and ∂L/∂b for every layer by propagating error backward from the output",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “If X is (n×m) and W is (m×p), the result Y is (n×p)”",
            },
            {
              question: "Which of these is a hands-on step in “Matrix Multiplication from Scratch”?",
              options: [
                "Compute output gradients",
                "Define the loss",
                "Run a gradient check",
                "Represent matrices",
              ],
              correctIndex: 3,
              explanation: "“Represent matrices” is part of this lesson's sequence: Use arrays of arrays or a flat typed array with rows and columns. Write shape checks that throw before multiplication.",
            },
            {
              question: "What does the hands-on step “Implement the triple loop” involve?",
              options: [
                "For C = A × B, loop over rows of A, columns of B, and the shared dimension. Accumulate into C[i][j] and keep the inner loop contiguous.",
                "Use small random weights (for example, uniform in ±0.1 or Xavier) and zero biases. Record every shape: input, hidden, output.",
                "Calculate `dz1 = (dz2·W2ᵀ) * sigmoid_prime(z1)`, then `dW1 = Xᵀ·dz1` and `db1 = sum(dz1)`.",
                "Calculate `dz2 = a2 - y`, then `dW2 = a1ᵀ·dz2` and `db2 = sum(dz2)`. Confirm each gradient has the same shape as its parameter.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Implement the triple loop” as: For C = A × B, loop over rows of A, columns of B, and the shared dimension. Accumulate into C[i][j] and keep the inner loop contiguous.",
            },
          ],
          flashcards: [
            {
              front: "Matrix multiplication shape rule",
              back: "If X is (n×m) and W is (m×p), the result Y is (n×p)",
            },
            {
              front: "Dot product convention",
              back: "y[i][j] = sum_k X[i][k] * W[k][j]",
            },
            {
              front: "How do you test against known values?",
              back: "Multiply a 2×3 by a 3×2 matrix with hand-computed results. Add identity and zero matrices, and confirm incompatible shapes fail.",
            },
            {
              front: "How do you implement the triple loop?",
              back: "For C = A × B, loop over rows of A, columns of B, and the shared dimension. Accumulate into C[i][j] and keep the inner loop contiguous.",
            },
            {
              front: "How do you represent matrices?",
              back: "Use arrays of arrays or a flat typed array with rows and columns. Write shape checks that throw before multiplication.",
            },
          ],
          sourceRef: {
            label: "Matrix multiplication",
            pageStart: null,
            pageEnd: null,
            note: "Nested loops, dimension validation, sum-over-k",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Sigmoid Activation and Derivative",
          objective: "Implement the sigmoid function σ(x) = 1/(1+e⁻ˣ) and its gradient σ'(x) = σ(x)(1−σ(x)).",
          hook: "The squashing function that turns logits into probabilities.",
          paragraphs: [
            "Sigmoid squashes any real number into (0, 1), interpretable as a probability. Its derivative, crucial for backpropagation, has a compact form: σ'(x) = σ(x) · (1 − σ(x)). You'll implement both the forward pass (compute σ(x)) and the backward pass (compute the gradient for chain-rule propagation).",
          ],
          bullets: [
            "Forward: σ(x) = 1 / (1 + e⁻ˣ); clamp extreme inputs to avoid overflow",
            "Backward: σ'(x) = σ(x) · (1 − σ(x)); reuse the forward value",
            "Numerical stability: clamp x or guard the exponential; subtracting max(x) is a softmax trick, not a sigmoid one",
            "Test: σ(0) = 0.5, σ(∞) → 1, σ(−∞) → 0",
          ],
          steps: [
            {
              title: "Implement the forward pass",
              detail: "Compute `1 / (1 + exp(-x))` elementwise. Clamp large negative inputs to avoid overflow and return a new array.",
            },
            {
              title: "Implement the derivative",
              detail: "Use `sigmoid(x) * (1 - sigmoid(x))`. Accept the already-computed activation to avoid recomputing the exponential.",
            },
            {
              title: "Check numerically",
              detail: "Compare the analytic derivative with `(f(x+h) - f(x-h)) / 2h` for h = 1e-5 over several inputs. They should agree to about six digits.",
            },
            {
              title: "Plot the curve",
              detail: "Print or plot sigmoid over -8..8 and its derivative. Note the vanishing gradient at both tails before you build a deep network.",
            },
          ],
          takeaway: "Sigmoid is the building block for neuron output; its derivative is what makes backpropagation possible.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "e",
                from: "x",
                label: "negate and exp",
              },
              {
                to: "σ",
                from: "e",
                label: "1 + then invert",
              },
              {
                to: "σ'",
                from: "σ",
                label: "multiply σ · (1−σ)",
              },
            ],
            nodes: [
              {
                id: "x",
                label: "Input",
                emphasis: false,
              },
              {
                id: "e",
                label: "e⁻ˣ",
                emphasis: false,
              },
              {
                id: "σ",
                label: "σ(x) = 1/(1+e⁻ˣ)",
                emphasis: true,
              },
              {
                id: "σ'",
                label: "σ'(x) = σ(x)(1−σ(x))",
                emphasis: true,
              },
            ],
            title: "Sigmoid forward and backward",
          },
          quiz: {
            question: "What is the derivative of sigmoid at x = 0?",
            options: [
              "0",
              "0.25",
              "0.5",
              "1",
            ],
            correctIndex: 1,
            explanation: "σ(0) = 0.5, so σ'(0) = 0.5 · (1 − 0.5) = 0.25.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Sigmoid Activation and Derivative”?",
              options: [
                "Validate that inner dimensions match: X.shape[1] == W.shape[0]",
                "Forward: σ(x) = 1 / (1 + e⁻ˣ); clamp extreme inputs to avoid overflow",
                "Initialize W1 (input_dim × hidden_dim), b1 (hidden_dim), W2 (hidden_dim × output_dim), b2 (output_dim)",
                "Output error: δ² = (y_hat − y_true) ⊙ σ'(·) — the gradient of cross-entropy with sigmoid",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Forward: σ(x) = 1 / (1 + e⁻ˣ), clip extreme inputs to avoid overflow”",
            },
            {
              question: "Which statement best explains “Sigmoid formula”?",
              options: [
                "If X is (n×m) and W is (m×p), the result Y is (n×p)",
                "Computing the network output from input and weights — deterministic, no learning yet",
                "σ(x) = 1 / (1 + e⁻ˣ)",
                "Compute ∂L/∂W and ∂L/∂b for every layer by propagating error backward from the output",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “σ(x) = 1 / (1 + e⁻ˣ)”",
            },
            {
              question: "Which of these is a hands-on step in “Sigmoid Activation and Derivative”?",
              options: [
                "Run a gradient check",
                "Add mini-batches",
                "Evaluate on held-out data",
                "Implement the forward pass",
              ],
              correctIndex: 3,
              explanation: "“Implement the forward pass” is part of this lesson's sequence: Compute `1 / (1 + exp(-x))` elementwise. Clamp large negative inputs to avoid overflow and return a new array.",
            },
            {
              question: "What does the hands-on step “Implement the derivative” involve?",
              options: [
                "Use `sigmoid(x) * (1 - sigmoid(x))`. Accept the already-computed activation to avoid recomputing the exponential.",
                "Add a softmax output for multiclass data and train with categorical cross-entropy; compare convergence with the old MSE setup.",
                "Build a confusion matrix and report precision, recall, and F1; compare with a majority-class baseline.",
                "Compare weight decay, dropout, and early stopping; record both training and validation loss.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Implement the derivative” as: Use `sigmoid(x) * (1 - sigmoid(x))`. Accept the already-computed activation to avoid recomputing the exponential.",
            },
          ],
          flashcards: [
            {
              front: "Sigmoid formula",
              back: "σ(x) = 1 / (1 + e⁻ˣ)",
            },
            {
              front: "Sigmoid derivative",
              back: "σ'(x) = σ(x) · (1 − σ(x))",
            },
            {
              front: "How do you check numerically?",
              back: "Compare the analytic derivative with `(f(x+h) - f(x-h)) / 2h` for h = 1e-5 over several inputs. They should agree to about six digits.",
            },
            {
              front: "How do you implement the forward pass?",
              back: "Compute `1 / (1 + exp(-x))` elementwise. Clamp large negative inputs to avoid overflow and return a new array.",
            },
            {
              front: "How do you implement the derivative?",
              back: "Use `sigmoid(x) * (1 - sigmoid(x))`. Accept the already-computed activation to avoid recomputing the exponential.",
            },
          ],
          sourceRef: {
            label: "Sigmoid activation",
            pageStart: null,
            pageEnd: null,
            note: "Forward: σ(x) = 1/(1+e⁻ˣ); Backward: σ'(x) = σ(x)(1−σ(x))",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Network Architecture: Forward Propagation",
      summary: "Build a 2-layer (input→hidden→output) network, compute predictions, and cache the values backpropagation needs.",
      lessons: [
        {
          title: "Two-Layer Network: Forward Pass",
          objective: "Compute the output of hidden = σ(X·W1 + b1) and y_hat = σ(hidden·W2 + b2).",
          hook: "From input to prediction in three matrix operations.",
          paragraphs: [
            "A 2-layer fully-connected network: given input x, compute h = σ(xW¹ + b¹) (hidden layer), then y_hat = σ(hW² + b²) (output layer). You'll wire these together, initialize weights (random small values or He/Xavier initialization), and bias vectors of appropriate size. This is the 'forward pass' — the entire network computation before any learning happens.",
          ],
          bullets: [
            "Initialize W1 (input_dim × hidden_dim), b1 (hidden_dim), W2 (hidden_dim × output_dim), b2 (output_dim)",
            "Compute hidden = σ(X @ W1 + b1) — broadcast bias across batch",
            "Compute y_hat = σ(hidden @ W2 + b2)",
            "Store all caches (X, W1, b1, hidden) for the backward pass",
          ],
          steps: [
            {
              title: "Initialize weights and biases",
              detail: "Use small random weights (for example, uniform in ±0.1 or Xavier) and zero biases. Record every shape: input, hidden, output.",
            },
            {
              title: "Compute the hidden layer",
              detail: "Calculate `z1 = X·W1 + b1`, then `a1 = sigmoid(z1)`. Verify the result has one row per sample and one column per hidden unit.",
            },
            {
              title: "Compute the output layer",
              detail: "Calculate `z2 = a1·W2 + b2`, then `a2 = sigmoid(z2)`. For binary classification, a2 is the predicted probability.",
            },
            {
              title: "Test with fixed weights",
              detail: "Set weights by hand and feed one known sample. Compare the forward output with a calculator or spreadsheet before training anything.",
            },
          ],
          takeaway: "The forward pass is entirely deterministic — given weights and input, the output is fixed. All the 'learning' happens later during backprop.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "W1",
                from: "X",
                label: "matrix multiply",
              },
              {
                to: "h",
                from: "W1",
                label: "+ bias + σ",
              },
              {
                to: "W2",
                from: "h",
                label: "matrix multiply",
              },
              {
                to: "y_hat",
                from: "W2",
                label: "+ bias + σ",
              },
            ],
            nodes: [
              {
                id: "X",
                label: "Input",
                emphasis: false,
              },
              {
                id: "W1",
                label: "Weights hidden",
                emphasis: true,
              },
              {
                id: "b1",
                label: "Bias hidden",
                emphasis: false,
              },
              {
                id: "h",
                label: "Hidden activation",
                emphasis: true,
              },
              {
                id: "W2",
                label: "Weights output",
                emphasis: true,
              },
              {
                id: "b2",
                label: "Bias output",
                emphasis: false,
              },
              {
                id: "y_hat",
                label: "Prediction",
                emphasis: false,
              },
            ],
            title: "Two-layer network forward pass",
          },
          quiz: {
            question: "In a 2-layer network, the hidden layer applies σ to which expression?",
            options: [
              "X·W1 + b1",
              "X·W1",
              "X + W1",
              "σ(X)·W1",
            ],
            correctIndex: 0,
            explanation: "The standard formulation is hidden = σ(XW¹ + b¹): the affine transform followed by the activation.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Two-Layer Network: Forward Pass”?",
              options: [
                "Validate that inner dimensions match: X.shape[1] == W.shape[0]",
                "Forward: σ(x) = 1 / (1 + e⁻ˣ), clip extreme inputs to avoid overflow",
                "Initialize W1 (input_dim × hidden_dim), b1 (hidden_dim), W2 (hidden_dim × output_dim), b2 (output_dim)",
                "Output error: δ² = (y_hat − y_true) ⊙ σ'(·) — the gradient of cross-entropy with sigmoid",
              ],
              correctIndex: 2,
              explanation: "The lesson states: “Initialize W1 (input_dim × hidden_dim), b1 (hidden_dim), W2 (hidden_dim × output_dim), b2 (output_dim)”",
            },
            {
              question: "Which statement best explains “Forward pass”?",
              options: [
                "If X is (n×m) and W is (m×p), the result Y is (n×p)",
                "σ(x) = 1 / (1 + e⁻ˣ)",
                "Compute ∂L/∂W and ∂L/∂b for every layer by propagating error backward from the output",
                "Computing the network output from input and weights — deterministic, no learning yet",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Computing the network output from input and weights — deterministic, no learning yet”",
            },
            {
              question: "Which of these is a hands-on step in “Two-Layer Network: Forward Pass”?",
              options: [
                "Evaluate on held-out data",
                "Learn XOR",
                "Track the loss curve",
                "Initialize weights and biases",
              ],
              correctIndex: 3,
              explanation: "“Initialize weights and biases” is part of this lesson's sequence: Use small random weights (for example, uniform in ±0.1 or Xavier) and zero biases. Record every shape: input, hidden, output.",
            },
            {
              question: "What does the hands-on step “Compute the hidden layer” involve?",
              options: [
                "Calculate `z1 = X·W1 + b1`, then `a1 = sigmoid(z1)`. Verify the result has one row per sample and one column per hidden unit.",
                "Time the triple loop on a 200×200 multiply. Reorder loops for cache locality or use a typed array, then measure again rather than assuming.",
                "Use arrays of arrays or a flat typed array with rows and columns. Write shape checks that throw before multiplication.",
                "Use Python with NumPy only for data loading, not for the network math, or another language with arrays. Create nn/ and tests/, plus a script that runs one forward pass on fixed inputs.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Compute the hidden layer” as: Calculate `z1 = X·W1 + b1`, then `a1 = sigmoid(z1)`. Verify the result has one row per sample and one column per hidden unit.",
            },
          ],
          flashcards: [
            {
              front: "Forward pass",
              back: "Computing the network output from input and weights — deterministic, no learning yet",
            },
            {
              front: "Caches",
              back: "Stored intermediate values (X, W1, b1, hidden) needed for backpropagation gradients",
            },
            {
              front: "How do you compute the hidden layer?",
              back: "Calculate `z1 = X·W1 + b1`, then `a1 = sigmoid(z1)`. Verify the result has one row per sample and one column per hidden unit.",
            },
            {
              front: "How do you initialize weights and biases?",
              back: "Use small random weights (for example, uniform in ±0.1 or Xavier) and zero biases. Record every shape: input, hidden, output.",
            },
            {
              front: "How do you compute the output layer?",
              back: "Calculate `z2 = a1·W2 + b2`, then `a2 = sigmoid(z2)`. For binary classification, a2 is the predicted probability.",
            },
          ],
          sourceRef: {
            label: "Two-layer network forward",
            pageStart: null,
            pageEnd: null,
            note: "X·W1+b1 → σ → hidden; hidden·W2+b2 → σ → y_hat; caches for backward",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Learning: Backpropagation and Training",
      summary: "Compute gradients via the chain rule, update weights with gradient descent, and train on data.",
      lessons: [
        {
          title: "Backpropagation: Gradients through the Network",
          objective: "Compute ∂L/∂W and ∂L/∂b for both layers using the chain rule, starting from the output error.",
          hook: "The chain rule is what makes training possible — propagate the error backward from output to input.",
          paragraphs: [
            "Given a binary cross-entropy loss L and a sigmoid output, the output error simplifies to δ² = y_hat − y_true. Then ∂L/∂W² = hiddenᵀ · δ² and ∂L/∂b² = sum(δ²). Propagate to the hidden layer: δ¹ = (δ² · W2ᵀ) ⊙ σ'(X·W1 + b1), then ∂L/∂W¹ = Xᵀ · δ¹ and ∂L/∂b¹ = sum(δ¹). If you use mean squared error instead, multiply δ² by σ'(z²) before continuing. This is the essence of backpropagation.",
          ],
          bullets: [
            "Output error for sigmoid + cross-entropy: δ² = y_hat − y_true (multiply by σ'(z²) only for MSE)",
            "Output gradients: ∂L/∂W² = hiddenᵀ · δ², ∂L/∂b² = sum(δ²)",
            "Hidden error: δ¹ = (δ² · W2ᵀ) ⊙ σ'(X·W1 + b1)",
            "Hidden gradients: ∂L/∂W¹ = Xᵀ · δ¹, ∂L/∂b¹ = sum(δ¹)",
          ],
          steps: [
            {
              title: "Define the loss",
              detail: "Use binary cross-entropy or mean squared error. Write both the loss and its derivative with respect to the output.",
            },
            {
              title: "Compute output gradients",
              detail: "Calculate `dz2 = a2 - y`, then `dW2 = a1ᵀ·dz2` and `db2 = sum(dz2)`. Confirm each gradient has the same shape as its parameter.",
            },
            {
              title: "Backpropagate to the hidden layer",
              detail: "Calculate `dz1 = (dz2·W2ᵀ) * sigmoid_prime(z1)`, then `dW1 = Xᵀ·dz1` and `db1 = sum(dz1)`.",
            },
            {
              title: "Run a gradient check",
              detail: "Perturb one weight by ±h and compare the numerical slope with the analytic gradient. Relative error below 1e-4 means the chain rule is correct.",
            },
          ],
          takeaway: "Backpropagation is just the chain rule applied repeatedly: the gradient of the loss w.r.t. each weight is the error signal flowing back from the output, modulated by the activation derivative at each layer.",
          diagram: {
            type: "process",
            edges: [
              {
                to: "δ²",
                from: "L",
                label: "cross-entropy + σ'",
              },
              {
                to: "δ¹",
                from: "δ²",
                label: "· W2ᵀ ⊙ σ'",
              },
              {
                to: "W1,∂b¹",
                from: "δ¹",
                label: "compute gradients",
              },
            ],
            nodes: [
              {
                id: "L",
                label: "Loss",
                emphasis: true,
              },
              {
                id: "δ²",
                label: "Output error",
                emphasis: true,
              },
              {
                id: "δ¹",
                label: "Hidden error",
                emphasis: true,
              },
              {
                id: "W1,W2",
                label: "Weight gradients",
                emphasis: false,
              },
            ],
            title: "Backpropagation: error flows backward",
          },
          quiz: {
            question: "In backprop, the output error δ² is (y_hat − y_true) ⊙ σ'(·). What does ⊙ denote?",
            options: [
              "Element-wise multiplication",
              "Matrix multiplication",
              "Division",
              "Addition",
            ],
            correctIndex: 0,
            explanation: "The ⊙ symbol denotes element-wise (Hadamard) product — each error component is multiplied by the corresponding derivative value.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Backpropagation: Gradients through the Network”?",
              options: [
                "Validate that inner dimensions match: X.shape[1] == W.shape[0]",
                "Forward: σ(x) = 1 / (1 + e⁻ˣ), clip extreme inputs to avoid overflow",
                "Initialize W1 (input_dim × hidden_dim), b1 (hidden_dim), W2 (hidden_dim × output_dim), b2 (output_dim)",
                "Output error for sigmoid + cross-entropy: δ² = y_hat − y_true (multiply by σ'(z²) only for MSE)",
              ],
              correctIndex: 3,
              explanation: "The lesson states: “Output error: δ² = (y_hat − y_true) ⊙ σ'(·) — the gradient of cross-entropy with sigmoid”",
            },
            {
              question: "Which statement best explains “Backpropagation”?",
              options: [
                "Compute ∂L/∂W and ∂L/∂b for every layer by propagating error backward from the output",
                "If X is (n×m) and W is (m×p), the result Y is (n×p)",
                "σ(x) = 1 / (1 + e⁻ˣ)",
                "Computing the network output from input and weights — deterministic, no learning yet",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Compute ∂L/∂W and ∂L/∂b for every layer by propagating error backward from the output”",
            },
            {
              question: "Which of these is a hands-on step in “Backpropagation: Gradients through the Network”?",
              options: [
                "Track the loss curve",
                "Write one training step",
                "Add an optimizer",
                "Define the loss",
              ],
              correctIndex: 3,
              explanation: "“Define the loss” is part of this lesson's sequence: Use binary cross-entropy or mean squared error. Write both the loss and its derivative with respect to the output.",
            },
            {
              question: "What does the hands-on step “Compute output gradients” involve?",
              options: [
                "Calculate `dz2 = a2 - y`, then `dW2 = a1ᵀ·dz2` and `db2 = sum(dz2)`. Confirm each gradient has the same shape as its parameter.",
                "Record loss every epoch. A flat curve means the learning rate is too small; oscillation or NaN means it is too large or the inputs are unnormalized.",
                "Shuffle the dataset each epoch and process batches of 16-64 samples. Average gradients within a batch before updating.",
                "Split off a validation set, report accuracy, and stop when validation loss rises. That is your first real overfitting check.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Compute output gradients” as: Calculate `dz2 = a2 - y`, then `dW2 = a1ᵀ·dz2` and `db2 = sum(dz2)`. Confirm each gradient has the same shape as its parameter.",
            },
          ],
          flashcards: [
            {
              front: "Backpropagation",
              back: "Compute ∂L/∂W and ∂L/∂b for every layer by propagating error backward from the output",
            },
            {
              front: "Chain rule in neural nets",
              back: "δᵏ = (δᵏ⁺¹ · Wᵏ⁺¹ᵀ) ⊙ σ'(zᵏ) — pass error back one layer at a time",
            },
            {
              front: "How do you backpropagate to the hidden layer?",
              back: "Calculate `dz1 = (dz2·W2ᵀ) * sigmoid_prime(z1)`, then `dW1 = Xᵀ·dz1` and `db1 = sum(dz1)`.",
            },
            {
              front: "How do you compute output gradients?",
              back: "Calculate `dz2 = a2 - y`, then `dW2 = a1ᵀ·dz2` and `db2 = sum(dz2)`. Confirm each gradient has the same shape as its parameter.",
            },
            {
              front: "How do you define the loss?",
              back: "Use binary cross-entropy or mean squared error. Write both the loss and its derivative with respect to the output.",
            },
          ],
          sourceRef: {
            label: "Backpropagation",
            pageStart: null,
            pageEnd: null,
            note: "Sigmoid + cross-entropy: δ² = y_hat − y_true; ∂L/∂W² = hiddenᵀ · δ²; δ¹ = (δ² · W2ᵀ) ⊙ σ'(X·W1+b1); ∂L/∂W¹ = Xᵀ · δ¹",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Training Loop and Evaluation",
      summary: "Run the training loop: forward → backprop → weight update → monitor loss, then evaluate on test data.",
      lessons: [
        {
          title: "Training Loop: Gradient Descent",
          objective: "Implement the full training loop: forward pass, compute loss, backprop, update weights with lr·grad, iterate over epochs, plot loss.",
          hook: "Watch the loss drop from ~0.7 to ~0.1 over 10000 steps — confirmation that learning works.",
          paragraphs: [
            "The training loop repeats: (1) Forward pass: compute y_hat from X. (2) Compute loss: cross-entropy between y_hat and true y. (3) Backprop: compute gradients of loss w.r.t. all weights and biases. (4) Weight update: W ← W − lr · ∂L/∂W, b ← b − lr · ∂L/∂b. (5) Repeat for a fixed number of epochs or until loss converges. You'll also record the loss each epoch so you can plot it and verify that the model is learning (loss decreasing) versus overfitting (training loss low but test loss high).",
          ],
          bullets: [
            "Learning rate lr controls step size — too large diverges, too small crawls forever",
            "Epoch = one pass over the entire training dataset",
            "Plot loss vs. epoch to visualize convergence",
            "Shuffle data each epoch to prevent memorization order effects and evaluate generalization",
          ],
          steps: [
            {
              title: "Write one training step",
              detail: "Forward pass, loss, backward pass, then update every parameter with `p -= learning_rate * dp`. Keep the order identical every iteration.",
            },
            {
              title: "Add mini-batches",
              detail: "Shuffle the dataset each epoch and process batches of 16-64 samples. Average gradients within a batch before updating.",
            },
            {
              title: "Track the loss curve",
              detail: "Record loss every epoch. A flat curve means the learning rate is too small; oscillation or NaN means it is too large or the inputs are unnormalized.",
            },
            {
              title: "Learn XOR",
              detail: "Train on the four XOR examples until loss drops below 0.05. A single-layer network cannot do this; your hidden layer should.",
            },
            {
              title: "Evaluate on held-out data",
              detail: "Split off a validation set, report accuracy, and stop when validation loss rises. That is your first real overfitting check.",
            },
          ],
          takeaway: "The training loop is where optimization happens: forward propagation makes predictions, backpropagation computes how to improve, and gradient descent takes the step.",
          diagram: {
            type: "cycle",
            edges: [
              {
                to: "loss",
                from: "forward",
                label: "compute predictions + cross-entropy",
              },
              {
                to: "backward",
                from: "loss",
                label: "chain rule ∂L/∂W",
              },
              {
                to: "update",
                from: "backward",
                label: "gradient descent step",
              },
              {
                to: "epoch",
                from: "update",
                label: "repeat or check convergence",
              },
              {
                to: "forward",
                from: "epoch",
                label: "next iteration",
              },
            ],
            nodes: [
              {
                id: "forward",
                label: "Forward pass",
                emphasis: true,
              },
              {
                id: "loss",
                label: "Compute loss",
                emphasis: true,
              },
              {
                id: "backward",
                label: "Backprop gradients",
                emphasis: true,
              },
              {
                id: "update",
                label: "W ← W − lr·grad",
                emphasis: true,
              },
              {
                id: "epoch",
                label: "One pass over data",
                emphasis: false,
              },
            ],
            title: "Training loop cycle",
          },
          quiz: {
            question: "What happens if the learning rate lr is too large?",
            options: [
              "Loss diverges (NaN or explosion)",
              "Learning crawls, takes forever to converge",
              "The model overfits immediately",
              "Nothing — lr has no effect",
            ],
            correctIndex: 0,
            explanation: "If lr is too large, the weight updates overshoot the minimum, the loss can jump around or become NaN, and the model fails to learn.",
          },
          extraQuestions: [
            {
              question: "Which statement is a key claim of “Training Loop: Gradient Descent”?",
              options: [
                "Learning rate lr controls step size — too large diverges, too small crawls forever",
                "Validate that inner dimensions match: X.shape[1] == W.shape[0]",
                "Forward: σ(x) = 1 / (1 + e⁻ˣ), clip extreme inputs to avoid overflow",
                "Initialize W1 (input_dim × hidden_dim), b1 (hidden_dim), W2 (hidden_dim × output_dim), b2 (output_dim)",
              ],
              correctIndex: 0,
              explanation: "The lesson states: “Learning rate lr controls step size — too large diverges, too small crawls forever”",
            },
            {
              question: "Which statement best explains “Training loop step”?",
              options: [
                "If X is (n×m) and W is (m×p), the result Y is (n×p)",
                "Forward → loss → backward → weight update → repeat",
                "σ(x) = 1 / (1 + e⁻ˣ)",
                "Computing the network output from input and weights — deterministic, no learning yet",
              ],
              correctIndex: 1,
              explanation: "The lesson states: “Forward → loss → backward → weight update → repeat”",
            },
            {
              question: "Which of these is a hands-on step in “Training Loop: Gradient Descent”?",
              options: [
                "Compute the output layer",
                "Initialize weights and biases",
                "Test with fixed weights",
                "Write one training step",
              ],
              correctIndex: 3,
              explanation: "“Write one training step” is part of this lesson's sequence: Forward pass, loss, backward pass, then update every parameter with `p -= learning_rate * dp`. Keep the order identical every iteration.",
            },
            {
              question: "What does the hands-on step “Add mini-batches” involve?",
              options: [
                "Shuffle the dataset each epoch and process batches of 16-64 samples. Average gradients within a batch before updating.",
                "Add a softmax output for multiclass data and train with categorical cross-entropy; compare convergence with the old MSE setup.",
                "Build a confusion matrix and report precision, recall, and F1; compare with a majority-class baseline.",
                "Compare weight decay, dropout, and early stopping; record both training and validation loss.",
              ],
              correctIndex: 0,
              explanation: "The lesson describes “Add mini-batches” as: Shuffle the dataset each epoch and process batches of 16-64 samples. Average gradients within a batch before updating.",
            },
          ],
          flashcards: [
            {
              front: "Learning rate",
              back: "Controls step size in gradient descent; too large → diverge, too small → slow convergence",
            },
            {
              front: "Training loop step",
              back: "Forward → loss → backward → weight update → repeat",
            },
            {
              front: "How do you add mini-batches?",
              back: "Shuffle the dataset each epoch and process batches of 16-64 samples. Average gradients within a batch before updating.",
            },
            {
              front: "How do you write one training step?",
              back: "Forward pass, loss, backward pass, then update every parameter with `p -= learning_rate * dp`. Keep the order identical every iteration.",
            },
            {
              front: "How do you track the loss curve?",
              back: "Record loss every epoch. A flat curve means the learning rate is too small; oscillation or NaN means it is too large or the inputs are unnormalized.",
            },
          ],
          sourceRef: {
            label: "Training loop",
            pageStart: null,
            pageEnd: null,
            note: "Forward → cross-entropy → backprop → W ← W − lr·grad; iterate epochs; plot loss; evaluate test set",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Capstone: From Toy Network to Evaluated Model",
      summary: "The loss, optimizer, regularization, and evaluation choices that make a trained network useful beyond a single toy example.",
      lessons: [
        {
          title: "Capstone: Loss Functions, Softmax, Regularization, and Evaluation",
          objective: "Choose the right loss and output layer, train with a modern optimizer, control overfitting, and evaluate a model on data it has never seen.",
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
              detail: "Add a softmax output for multiclass data and train with categorical cross-entropy; compare convergence with the old MSE setup.",
            },
            {
              title: "Add an optimizer",
              detail: "Implement SGD with momentum, then Adam, and compare loss curves at the same learning rate.",
            },
            {
              title: "Clip gradients",
              detail: "Measure the gradient norm before each update and rescale it when it exceeds a threshold.",
            },
            {
              title: "Split the data",
              detail: "Hold out validation and test sets, tune on validation, and report the final test score only once.",
            },
            {
              title: "Add regularization",
              detail: "Compare weight decay, dropout, and early stopping; record both training and validation loss.",
            },
            {
              title: "Evaluate beyond accuracy",
              detail: "Build a confusion matrix and report precision, recall, and F1; compare with a majority-class baseline.",
            },
            {
              title: "Run the finished artifact",
              detail: "Train on a real dataset (XOR or a small CSV), save the weights, reload them, and confirm the reloaded model reproduces the same predictions and test metrics.",
            },
          ],
          takeaway: "A model is only as good as its objective, optimization, and evaluation: match the loss to the task, stabilize updates, control overfitting, and report metrics on untouched data.",
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
                label: "Switch to a task-appropriate loss",
                emphasis: true,
              },
              {
                id: "step-2",
                label: "Add an optimizer",
                emphasis: false,
              },
              {
                id: "step-3",
                label: "Clip gradients",
                emphasis: false,
              },
              {
                id: "step-4",
                label: "Evaluate beyond accuracy",
                emphasis: true,
              },
            ],
            title: "How Capstone: Loss Functions, Softmax, Regularization, and Evaluation w…",
          },
          quiz: {
            question: "Which output and loss pair suits mutually exclusive classes?",
            options: [
              "Sigmoid with mean squared error",
              "Softmax with categorical cross-entropy",
              "Linear output with hinge loss",
              "ReLU with binary cross-entropy",
            ],
            correctIndex: 1,
            explanation: "Softmax produces a distribution over classes, and categorical cross-entropy measures the negative log-likelihood of the correct class.",
          },
          extraQuestions: [
            {
              question: "What does Adam combine?",
              options: [
                "Momentum and per-parameter scaling with bias correction",
                "Dropout and weight decay",
                "Softmax and argmax",
                "Training and test data",
              ],
              correctIndex: 0,
              explanation: "Adam maintains first and second moment estimates, corrects their initial bias, and adapts each parameter's step size.",
            },
            {
              question: "Why keep a separate test set?",
              options: [
                "To tune the learning rate more precisely",
                "To estimate performance on data not used for training or tuning",
                "To increase the number of training epochs",
                "To replace the validation set",
              ],
              correctIndex: 1,
              explanation: "Repeated tuning on validation leaks information. A held-out test set gives an unbiased final estimate.",
            },
            {
              question: "What does dropout do during training?",
              options: [
                "Randomly zeroes activations to reduce co-adaptation",
                "Removes the loss function",
                "Permanently deletes neurons",
                "Increases the learning rate",
              ],
              correctIndex: 0,
              explanation: "Dropout randomly disables units on each pass, forcing the network to learn redundant representations and reducing overfitting.",
            },
            {
              question: "Why is accuracy misleading on an imbalanced dataset?",
              options: [
                "It always overestimates precision",
                "A majority-class predictor can score high while missing the minority class",
                "It cannot be computed for neural networks",
                "It ignores the training loss",
              ],
              correctIndex: 1,
              explanation: "If 95% of examples are negative, always predicting negative gives 95% accuracy but zero recall for the positive class.",
            },
          ],
          flashcards: [
            {
              front: "Softmax",
              back: "Converts a vector of logits into a probability distribution over mutually exclusive classes.",
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
            {
              front: "Categorical cross-entropy",
              back: "Loss for multiclass classification; with softmax its gradient simplifies to predicted probability minus the one-hot target.",
            },
          ],
          sourceRef: {
            label: "Build Your Own Neural Network capstone",
            pageStart: null,
            pageEnd: null,
            note: "Complete build path from matrix operations through forward and backward passes, extended with losses, optimizers, regularization, and evaluation.",
            sectionIndexes: [],
          },
          estimatedMinutes: 12,
        },
      ],
    },
  ],
};
