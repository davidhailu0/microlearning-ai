import type { DraftCourse } from "./types";

/**
 * "Build Your Own Neural Network" — CodeCrafters-style tutorial.
 * Covers: forward propagation, loss calculation, backpropagation, gradient descent,
 * training loop, binary classification, overfitting/underfitting.
 * Typical 20-30 step guided tutorial from the build-your-own-x repo (Python: A Neural Network from Scratch).
 */
export const nnCourse: DraftCourse = {
  title: "Build Your Own Neural Network",
  description:
    "From scratch: implement matrix operations, forward propagation with sigmoid activation, compute cross-entropy loss, backpropagate errors through the network, and update weights with gradient descent. Train on synthetic data and watch the loss drop. Learn the mechanics that power modern AI.",
  category: "AI",
  level: "intermediate",
  coverEmoji: "🧠",
  tags: ["neural-network", "machine-learning", "AI", "backpropagation", "gradient-descent"],
  modules: [
    {
      title: "Foundations: Matrices and Activations",
      summary:
        "Implement matrix multiplication from scratch, then the sigmoid activation and its derivative.",
      lessons: [
        {
          title: "Matrix Multiplication from Scratch",
          objective:
            "Write a function that multiplies two 2D arrays (matrices) without using numpy or tensorflow.",
          hook:
            "Everything in a neural network starts with matrix multiplication.",
          paragraphs: [
            "Before you can train a network, you need to multiply matrices. Given input X (n×m) and weights W (m×p), compute the dot product to produce output Y (n×p). Implement this using nested loops, being careful with dimensions and the sum-over-k convention.",
          ],
          bullets: [
            "Validate that inner dimensions match: X.shape[1] == W.shape[0]",
            "Initialize an output matrix of shape (X.shape[0], W.shape[1])",
            "For each output cell y[i][j], compute sum_k X[i][k] * W[k][j]",
            "Test with small matrices (2×3 * 3×2) before scaling up",
          ],
          takeaway:
            "Matrix multiplication is the fundamental operation that layers perform — understanding it manually makes the numpy/tensorflow versions crystal clear.",
          diagram: {
            type: "process",
            title: "Matrix multiplication",
            nodes: [
              { id: "X", label: "Input (n×m)", emphasis: false },
              { id: "W", label: "Weights (m×p)", emphasis: true },
              { id: "Y", label: "Output (n×p)", emphasis: false },
              { id: "k", label: "Sum over k", emphasis: true },
            ],
            edges: [
              { from: "X", to: "k", label: "row i, col k" },
              { from: "W", to: "k", label: "row k, col j" },
              { from: "k", to: "Y", label: "accumulate sum" },
            ],
          },
          quiz: {
            question: "If X is 4×3 and W is 3×5, what is the shape of the result Y?",
            options: ["4×3", "3×5", "4×5", "12×5"],
            correctIndex: 2,
            explanation:
              "The inner dimensions (3) must match; the result has the outer dimensions: 4×5.",
          },
          flashcards: [
            {
              front: "Matrix multiplication shape rule",
              back:
                "If X is (n×m) and W is (m×p), the result Y is (n×p)",
            },
            {
              front: "Dot product convention",
              back: "y[i][j] = sum_k X[i][k] * W[k][j]",
            },
          ],
          sourceRef: {
            label: "Matrix multiplication",
            pageStart: null,
            pageEnd: null,
            note:
              "Nested loops, dimension validation, sum-over-k",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
        {
          title: "Sigmoid Activation and Derivative",
          objective:
            "Implement the sigmoid function σ(x) = 1/(1+e⁻ˣ) and its gradient σ'(x) = σ(x)(1−σ(x)).",
          hook:
            "The squashing function that turns logits into probabilities.",
          paragraphs: [
            "Sigmoid squashes any real number into (0, 1), interpretable as a probability. Its derivative — crucial for backpropagation — has a compact form: σ'(x) = σ(x) · (1 − σ(x)). You'll implement both the forward pass (compute σ(x)) and the backward pass (compute the gradient for chain-rule propagation.",
          ],
          bullets: [
            "Forward: σ(x) = 1 / (1 + e⁻ˣ), clip extreme inputs to avoid overflow",
            "Backward: σ'(x) = σ(x) · (1 − σ(x)) — reuse the forward value",
            "Numerical stability: subtract max(x) before exponentiation",
            "Test: σ(0) = 0.5, σ(∞) → 1, σ(−∞) → 0",
          ],
          takeaway:
            "Sigmoid is the building block for neuron output; its derivative is what makes backpropagation possible.",
          diagram: {
            type: "process",
            title: "Sigmoid forward and backward",
            nodes: [
              { id: "x", label: "Input", emphasis: false },
              { id: "e", label: "e⁻ˣ", emphasis: false },
              { id: "σ", label: "σ(x) = 1/(1+e⁻ˣ)", emphasis: true },
              { id: "σ'", label: "σ'(x) = σ(x)(1−σ(x))", emphasis: true },
            ],
            edges: [
              { from: "x", to: "e", label: "negate and exp" },
              { from: "e", to: "σ", label: "1 + then invert" },
              { from: "σ", to: "σ'", label: "multiply σ · (1−σ)" },
            ],
          },
          quiz: {
            question: "What is the derivative of sigmoid at x = 0?",
            options: ["0", "0.25", "0.5", "1"],
            correctIndex: 1,
            explanation:
              "σ(0) = 0.5, so σ'(0) = 0.5 · (1 − 0.5) = 0.25.",
          },
          flashcards: [
            {
              front: "Sigmoid formula",
              back: "σ(x) = 1 / (1 + e⁻ˣ)",
            },
            {
              front: "Sigmoid derivative",
              back: "σ'(x) = σ(x) · (1 − σ(x))",
            },
          ],
          sourceRef: {
            label: "Sigmoid activation",
            pageStart: null,
            pageEnd: null,
            note:
              "Forward: σ(x) = 1/(1+e⁻ˣ); Backward: σ'(x) = σ(x)(1−σ(x))",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Network Architecture: Forward Propagation",
      summary:
        "Build a 2-layer (input→hidden→output) network, compute predictions, and measure error.",
      lessons: [
        {
          title: "Two-Layer Network: Forward Pass",
          objective:
            "Compute the output of hidden = σ(X·W1 + b1) and y_hat = σ(hidden·W2 + b2).",
          hook:
            "From input to prediction in three matrix operations.",
          paragraphs: [
            "A 2-layer fully-connected network: given input x, compute h = σ(xW¹ + b¹) (hidden layer), then y_hat = σ(hW² + b²) (output layer). You'll wire these together, initialize weights (random small values or He/Xavier initialization), and bias vectors of appropriate size. This is the 'forward pass' — the entire network computation before any learning happens.",
          ],
          bullets: [
            "Initialize W1 (input_dim × hidden_dim), b1 (hidden_dim), W2 (hidden_dim × output_dim), b2 (output_dim)",
            "Compute hidden = σ(X @ W1 + b1) — broadcast bias across batch",
            "Compute y_hat = σ(hidden @ W2 + b2)",
            "Store all caches (X, W1, b1, hidden) for the backward pass",
          ],
          takeaway:
            "The forward pass is entirely deterministic — given weights and input, the output is fixed. All the 'learning' happens later during backprop.",
          diagram: {
            type: "process",
            title: "Two-layer network forward pass",
            nodes: [
              { id: "X", label: "Input", emphasis: false },
              { id: "W1", label: "Weights hidden", emphasis: true },
              { id: "b1", label: "Bias hidden", emphasis: false },
              { id: "h", label: "Hidden activation", emphasis: true },
              { id: "W2", label: "Weights output", emphasis: true },
              { id: "b2", label: "Bias output", emphasis: false },
              { id: "y_hat", label: "Prediction", emphasis: false },
            ],
            edges: [
              { from: "X", to: "W1", label: "matrix multiply" },
              { from: "W1", to: "h", label: "+ bias + σ" },
              { from: "h", to: "W2", label: "matrix multiply" },
              { from: "W2", to: "y_hat", label: "+ bias + σ" },
            ],
          },
          quiz: {
            question: "In a 2-layer network, the hidden layer applies σ to which expression?",
            options: ["X·W1 + b1", "X·W1", "X + W1", "σ(X)·W1"],
            correctIndex: 0,
            explanation:
              "The standard formulation is hidden = σ(XW¹ + b¹): the affine transform followed by the activation.",
          },
          flashcards: [
            {
              front: "Forward pass",
              back:
                "Computing the network output from input and weights — deterministic, no learning yet",
            },
            {
              front: "Caches",
              back:
                "Stored intermediate values (X, W1, b1, hidden) needed for backpropagation gradients",
            },
          ],
          sourceRef: {
            label: "Two-layer network forward",
            pageStart: null,
            pageEnd: null,
            note:
              "X·W1+b1 → σ → hidden; hidden·W2+b2 → σ → y_hat; caches for backward",
            sectionIndexes: [],
          },
          estimatedMinutes: 4,
        },
      ],
    },
    {
      title: "Learning: Backpropagation and Training",
      summary:
        "Compute gradients via the chain rule, update weights with gradient descent, and train on data.",
      lessons: [
        {
          title: "Backpropagation: Gradients through the Network",
          objective:
            "Compute ∂L/∂W and ∂L/∂b for both layers using the chain rule, starting from the output error.",
          hook:
            "The chain rule is what makes training possible — propagate the error backward from output to input.",
          paragraphs: [
            "Given a loss L = cross-entropy(y_true, y_hat), compute how much each weight contributed to that error. Starting from the output layer: δ² = (y_hat − y_true) ⊙ σ'(hidden·W² + b²), then ∂L/∂W² = hiddenᵀ · δ², ∂L/∂b² = sum(δ²). Then propagate to the hidden layer: δ¹ = (δ² · W2ᵀ) ⊙ σ'(X·W¹ + b¹), then ∂L/∂W¹ = Xᵀ · δ¹, ∂L/∂b¹ = sum(δ¹). This is the essence of backpropagation.",
          ],
          bullets: [
            "Output error: δ² = (y_hat − y_true) ⊙ σ'(·) — the gradient of cross-entropy with sigmoid",
            "Output gradients: ∂L/∂W² = hiddenᵀ · δ², ∂L/∂b² = sum(δ²)",
            "Hidden error backpropagated: δ¹ = (δ² · W2ᵀ) ⊙ σ'(·)",
            "Hidden gradients: ∂L/∂W¹ = Xᵀ · δ¹, ∂L/∂b¹ = sum(δ¹) — all gradients computed in a single backward pass",
          ],
          takeaway:
            "Backpropagation is just the chain rule applied repeatedly: the gradient of the loss w.r.t. each weight is the error signal flowing back from the output, modulated by the activation derivative at each layer.",
          diagram: {
            type: "process",
            title: "Backpropagation: error flows backward",
            nodes: [
              { id: "L", label: "Loss", emphasis: true },
              { id: "δ²", label: "Output error", emphasis: true },
              { id: "δ¹", label: "Hidden error", emphasis: true },
              { id: "W1,W2", label: "Weight gradients", emphasis: false },
            ],
            edges: [
              { from: "L", to: "δ²", label: "cross-entropy + σ'" },
              { from: "δ²", to: "δ¹", label: "· W2ᵀ ⊙ σ'" },
              { from: "δ¹", to: "W1,∂b¹", label: "compute gradients" },
            ],
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
            explanation:
              "The ⊙ symbol denotes element-wise (Hadamard) product — each error component is multiplied by the corresponding derivative value.",
          },
          flashcards: [
            {
              front: "Backpropagation",
              back:
                "Compute ∂L/∂W and ∂L/∂b for every layer by propagating error backward from the output",
            },
            {
              front: "Chain rule in neural nets",
              back:
                "δᵏ = (δᵏ⁺¹ · Wᵏ⁺¹ᵀ) ⊙ σ'(zᵏ) — pass error back one layer at a time",
            },
          ],
          sourceRef: {
            label: "Backpropagation",
            pageStart: null,
            pageEnd: null,
            note:
              "Output error δ² = (y_hat − y_true) ⊙ σ'(·); ∂L/∂W² = hiddenᵀ · δ²; δ¹ = (δ² · W2ᵀ) ⊙ σ'(·); ∂L/∂W¹ = Xᵀ · δ¹",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
    {
      title: "Training Loop and Evaluation",
      summary:
        "Run the training loop: forward → backprop → weight update → monitor loss, then evaluate on test data.",
      lessons: [
        {
          title: "Training Loop: Gradient Descent",
          objective:
            "Implement the full training loop: forward pass, compute loss, backprop, update weights with lr·grad, iterate over epochs, plot loss.",
          hook:
            "Watch the loss drop from ~0.7 to ~0.1 over 10000 steps — confirmation that learning works.",
          paragraphs: [
            "The training loop repeats: (1) Forward pass: compute y_hat from X. (2) Compute loss: cross-entropy between y_hat and true y. (3) Backprop: compute gradients of loss w.r.t. all weights and biases. (4) Weight update: W ← W − lr · ∂L/∂W, b ← b − lr · ∂L/∂b. (5) Repeat for a fixed number of epochs or until loss converges. You'll also record the loss each epoch so you can plot it and verify that the model is learning (loss decreasing) versus overfitting (training loss low but test loss high).",
          ],
          bullets: [
            "Learning rate lr controls step size — too large diverges, too small crawls forever",
            "Epoch = one pass over the entire training dataset",
            "Plot loss vs. epoch to visualize convergence",
            "Shuffle data each epoch to prevent memorization order effects and evaluate generalization",
          ],
          takeaway:
            "The training loop is where optimization happens: forward propagation makes predictions, backpropagation computes how to improve, and gradient descent takes the step.",
          diagram: {
            type: "cycle",
            title: "Training loop cycle",
            nodes: [
              { id: "forward", label: "Forward pass", emphasis: true },
              { id: "loss", label: "Compute loss", emphasis: true },
              { id: "backward", label: "Backprop gradients", emphasis: true },
              { id: "update", label: "W ← W − lr·grad", emphasis: true },
              { id: "epoch", label: "One pass over data", emphasis: false },
            ],
            edges: [
              { from: "forward", to: "loss", label: "compute predictions + cross-entropy" },
              { from: "loss", to: "backward", label: "chain rule ∂L/∂W" },
              { from: "backward", to: "update", label: "gradient descent step" },
              { from: "update", to: "epoch", label: "repeat or check convergence" },
              { from: "epoch", to: "forward", label: "next iteration" },
            ],
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
            explanation:
              "If lr is too large, the weight updates overshoot the minimum, the loss can jump around or become NaN, and the model fails to learn.",
          },
          flashcards: [
            {
              front: "Training loop step",
              back: "Forward → loss → backward → weight update → repeat",
            },
            {
              front: "Learning rate",
              back:
                "Controls step size in gradient descent; too large → diverge, too small → slow convergence",
            },
          ],
          sourceRef: {
            label: "Training loop",
            pageStart: null,
            pageEnd: null,
            note:
              "Forward → cross-entropy → backprop → W ← W − lr·grad; iterate epochs; plot loss; evaluate test set",
            sectionIndexes: [],
          },
          estimatedMinutes: 5,
        },
      ],
    },
  ],
};