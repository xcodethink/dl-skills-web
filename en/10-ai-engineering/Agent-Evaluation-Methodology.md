> Source: [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit) | Category: AI Engineering

---
name: agent-evaluation-methodology
description: Evaluate and improve Claude Code agents using multi-dimensional rubrics, LLM-as-Judge patterns, and bias mitigation techniques. Covers direct scoring, pairwise comparison, and iterative improvement workflows.
---

# Agent Evaluation Methodology

## Overview

Evaluating AI agents is fundamentally different from evaluating traditional software. Agents are non-deterministic, may take multiple valid paths to a solution, and produce outputs that span multiple quality dimensions simultaneously. This guide provides a structured methodology for measuring, comparing, and improving agent performance.

**Core principle:** Judge results, not exact paths. An agent that takes a different route to the correct answer is not wrong -- it may even be better.

## When to Use

- Testing a new agent or command before deployment
- Comparing two prompt variants to determine which performs better
- Regression testing after modifying an agent's system prompt or tools
- Establishing baseline quality metrics for continuous monitoring
- Debugging inconsistent agent behavior across different inputs

## Core Evaluation Challenges

Agent evaluation must account for three fundamental difficulties:

### 1. Non-Determinism

The same agent with the same input may produce different outputs across runs. Temperature, sampling, and internal state contribute to variance.

**Implication:** Single-run evaluation is unreliable. Measure across multiple runs (minimum 3-5) and report distributions, not single scores.

### 2. Multiple Valid Paths

For most real-world tasks, there is more than one correct approach. A code review agent might organize findings by file or by severity -- both are valid.

**Implication:** Rubrics must evaluate outcome quality, not path similarity. Avoid comparing against a single "gold standard" output.

### 3. Composite Quality

Agent output quality is not a single number. An output can follow instructions perfectly but be poorly organized, or be well-written but miss half the requirements.

**Implication:** Use multi-dimensional rubrics that score each quality aspect independently.

## Multi-Dimensional Evaluation Rubric

Score agent outputs across five weighted dimensions:

| Dimension | Weight | What It Measures | Scale |
|-----------|--------|------------------|-------|
| **Instruction Following** | 0.30 | Did the agent do what was asked? | 1-5 |
| **Output Completeness** | 0.25 | Does the output cover all requirements? | 1-5 |
| **Tool Efficiency** | 0.20 | Did the agent use tools optimally (no redundant calls, no missing reads)? | 1-5 |
| **Reasoning Quality** | 0.15 | Is the agent's logic sound and its conclusions justified? | 1-5 |
| **Response Coherence** | 0.10 | Is the output well-structured, clear, and internally consistent? | 1-5 |

### Weighted Score Calculation

```
Final Score = (Instruction × 0.30) + (Completeness × 0.25) +
              (Efficiency × 0.20) + (Reasoning × 0.15) +
              (Coherence × 0.10)
```

**Score interpretation:**

| Range | Quality Level | Action |
|-------|--------------|--------|
| 4.5 - 5.0 | Excellent | Production-ready; monitor for regression |
| 3.5 - 4.4 | Good | Acceptable; targeted improvements possible |
| 2.5 - 3.4 | Fair | Needs work; identify weakest dimensions |
| 1.0 - 2.4 | Poor | Significant redesign required |

### Dimension-Level Rubric Example

**Instruction Following (Weight: 0.30):**

| Score | Description | Characteristics |
|-------|-------------|-----------------|
| 5 | Complete adherence | All instructions followed; nothing missed; no unnecessary additions |
| 4 | Minor deviations | 1-2 instructions partially addressed; core task completed |
| 3 | Partial adherence | Major instructions followed; several secondary requirements missed |
| 2 | Significant gaps | Core task partially completed; multiple instructions ignored |
| 1 | Non-compliant | Output does not address the requested task |

## Evaluation Methodologies

### LLM-as-Judge: Direct Scoring

Use a separate LLM instance to score agent outputs against the rubric. This is the most scalable approach for automated evaluation.

**Setup:**

```markdown
You are an expert evaluator. Score the following agent output against
each rubric dimension on a 1-5 scale.

## Task Description
[Original task given to the agent]

## Agent Output
[Output to evaluate]

## Rubric
[Full rubric with dimension descriptions and scale definitions]

## Instructions
For each dimension:
1. Quote specific parts of the output that inform your score
2. Explain your reasoning in 1-2 sentences
3. Assign a score (1-5)
4. Calculate the weighted final score
```

**Advantages:** Scalable, consistent, can evaluate hundreds of outputs per hour.
**Limitations:** Judge LLM has its own biases; requires calibration.

### LLM-as-Judge: Pairwise Comparison

Instead of absolute scoring, present two agent outputs and ask which is better. This is more reliable for detecting subtle quality differences.

**Setup:**

```markdown
You are an expert evaluator. Compare these two agent outputs for the
same task and determine which is better.

## Task Description
[Original task]

## Output A
[First agent's output]

## Output B
[Second agent's output]

## Instructions
For each rubric dimension:
1. Compare both outputs
2. State which is better and why
3. Assign a preference: A >> B, A > B, A = B, B > A, B >> A

Finally, give an overall winner with reasoning.
```

**Advantages:** More reliable for close comparisons; eliminates absolute scale calibration issues.
**Limitations:** Only provides relative ranking; does not tell you if both outputs are bad.

### Combined Approach

For thorough evaluation, use both methods:

1. **Direct scoring** to establish absolute quality baselines
2. **Pairwise comparison** to validate that improvements are real
3. **Cross-validation** by running the same evaluation with different judge prompts

## Bias Mitigation

LLM judges carry systematic biases that can distort evaluation results. Identify and mitigate each one.

### Position Bias

**Problem:** The judge favors whichever output appears first (or last) in the comparison prompt.

**Mitigation:**
- Run each pairwise comparison twice with swapped positions (A|B and B|A)
- Only count a preference if the judge is consistent across both orderings
- Discard results where the judge flips preference based on position

### Length Bias (Verbosity Bias)

**Problem:** The judge favors longer, more verbose outputs regardless of information density.

**Mitigation:**
- Add explicit instruction: "A concise output that covers all requirements is preferable to a verbose output with padding"
- Include examples where the shorter output is scored higher
- Normalize scores by information density, not raw token count

### Self-Enhancement Bias

**Problem:** When the judge model is the same as (or similar to) the agent model, it may favor outputs that match its own style.

**Mitigation:**
- Use a different model as judge when possible
- Include diverse example outputs in the judge prompt to calibrate expectations
- Cross-validate with human evaluation on a sample

### Authority Bias

**Problem:** The judge defers to outputs that cite sources, use confident language, or invoke authority, even when the content is incorrect.

**Mitigation:**
- Instruct the judge to verify factual claims, not just accept them
- Include test cases where a confident but wrong output should score lower than a hedged but correct one
- Separate "confidence" from "correctness" in the rubric

## Test Set Design

The quality of your evaluation is bounded by the quality of your test set.

### Complexity Stratification

Design test cases across three complexity levels:

| Level | Characteristics | Purpose | Proportion |
|-------|----------------|---------|------------|
| **Simple** | Single-step, unambiguous input, one correct answer | Baseline functionality verification | 30% |
| **Moderate** | Multi-step, some ambiguity, 2-3 valid approaches | Typical use case coverage | 50% |
| **Complex** | Multi-file, ambiguous requirements, edge cases, requires reasoning | Stress testing and ceiling measurement | 20% |

### Representative Sampling

Ensure your test set covers:

- **Input variety:** Different phrasing, different levels of detail in user requests
- **Domain spread:** If the agent works across multiple domains, test all of them
- **Edge cases:** Empty input, malformed input, conflicting requirements, very large inputs
- **Failure modes:** Inputs designed to trigger known weaknesses

### Test Case Template

```markdown
## Test Case: [ID]-[Brief Description]

**Complexity:** Simple | Moderate | Complex
**Category:** [Domain or feature being tested]

**Input:**
[Exact input to the agent]

**Context:**
[Any additional context the agent receives: files, history, etc.]

**Expected Behavior:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Evaluation Notes:**
[What to look for in the output; common failure modes for this case]
```

## Rubric Generation

For a new agent, generate a tailored rubric before running any evaluations.

### Step-by-Step Rubric Creation

1. **Define the task domain.** What does this agent do? What does a good output look like?

2. **Identify quality dimensions.** Start with the five standard dimensions, then add domain-specific ones if needed (e.g., "Security Correctness" for a security review agent).

3. **Write level descriptions.** For each dimension, define what a score of 1, 3, and 5 looks like. Fill in 2 and 4 by interpolation.

4. **Add characteristics.** For each level, list 2-3 observable characteristics that a judge can check for.

5. **Include examples.** Provide at least one example output for a score of 5 and one for a score of 2. This anchors the judge's calibration.

6. **Document edge cases.** Describe scenarios where scoring is ambiguous and provide guidance.

### Example Domain-Specific Dimension

**Security Correctness (for a security review agent):**

| Score | Description | Characteristics |
|-------|-------------|-----------------|
| 5 | All vulnerabilities identified with correct severity and remediation | Zero false negatives; remediations are production-ready |
| 4 | Most vulnerabilities found; 1 minor miss | May miss a low-severity issue; remediations are correct |
| 3 | Major vulnerabilities found; some gaps | Misses 1-2 medium-severity issues; some remediations are vague |
| 2 | Partial coverage with false positives | Identifies some issues but also flags non-issues; confuses severity |
| 1 | Fails to identify critical vulnerabilities | Misses critical issues; output is unreliable for security decisions |

## Evaluation Workflows

### Workflow 1: Testing a New Agent

```
1. Create test set (10-20 cases across complexity levels)
2. Run agent on all test cases (3 runs each)
3. Score all outputs using direct scoring
4. Compute per-dimension and overall averages
5. Identify dimensions scoring below 3.5
6. Refine agent prompt targeting weak dimensions
7. Re-run and compare using pairwise evaluation
8. Iterate until all dimensions reach target threshold
```

### Workflow 2: Comparing Prompt Variants

```
1. Select 10 representative test cases
2. Run variant A on all cases (3 runs each)
3. Run variant B on all cases (3 runs each)
4. Run pairwise comparison (with position swapping) on all pairs
5. Calculate win rate for each variant
6. Check for statistical significance (min 60% consistent preference)
7. Analyze dimension-level differences for insights
```

### Workflow 3: Regression Testing

```
1. Maintain a fixed test set of 15-20 cases (do not modify between runs)
2. Run baseline agent and store scores
3. After any agent modification, run the same test set
4. Compare per-dimension scores against baseline
5. Flag any dimension that drops more than 0.3 points
6. Investigate and fix regressions before deployment
```

### Workflow 4: Continuous Quality Monitoring

```
1. Sample 5% of production agent invocations
2. Score sampled outputs using automated direct scoring
3. Track weekly averages per dimension
4. Alert if any dimension drops below threshold
5. Monthly: review trend data and identify systematic patterns
```

## Metrics Reference

| Metric | Use Case | Interpretation |
|--------|----------|----------------|
| **Precision** | How many of the agent's claims/findings are correct | High precision = few false positives |
| **Recall** | How many of the actual issues did the agent find | High recall = few false negatives |
| **F1 Score** | Harmonic mean of precision and recall | Balanced measure; use when both matter equally |
| **Cohen's Kappa (kappa)** | Agreement between two judges beyond chance | > 0.6 = substantial agreement; > 0.8 = strong |
| **Spearman rho** | Rank correlation between judge scores and human scores | > 0.7 = strong correlation; validates judge reliability |
| **Win Rate** | Percentage of pairwise comparisons won | > 60% with position swapping = meaningful improvement |
| **Score Variance** | Standard deviation across multiple runs | High variance = agent behavior is unstable |

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Single-run evaluation** | Non-determinism makes single runs unreliable | Run 3-5 times; report distributions |
| **Gold-standard comparison** | Penalizes valid alternative approaches | Use rubric-based evaluation, not exact-match |
| **Same model as judge** | Self-enhancement bias inflates scores | Use a different model or calibrate with human samples |
| **No position swapping** | Position bias corrupts pairwise results | Always run A|B and B|A; discard inconsistent pairs |
| **Testing only happy path** | Misses failure modes that matter in production | Include edge cases and adversarial inputs in test set |
| **Ignoring dimension breakdown** | Overall score hides specific weaknesses | Always report per-dimension scores alongside aggregate |
| **Static test set** | Test cases become stale as the agent evolves | Refresh 20% of test cases quarterly with new patterns |
| **Evaluating process, not outcome** | Penalizes agents for valid alternative paths | Judge the final output quality, not the intermediate steps |
