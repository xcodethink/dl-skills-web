> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Development Methodology

---
name: systematic-debugging
description: Systematic debugging frameworks for finding and fixing bugs - includes root cause analysis, defense-in-depth validation, and verification protocols. Use when encountering bugs, test failures, unexpected behavior, or needing to validate fixes before claiming completion.
---

# Systematic Debugging

## Overview

A collection of systematic debugging methodologies that ensure thorough investigation before attempting fixes. Covers four sub-skills from root cause analysis to verified completion.

| Sub-Skill | Purpose |
|-----------|---------|
| Systematic Debugging | Four-phase debugging framework; iron law: no fixes without root cause investigation |
| Root Cause Tracing | Trace backward through the call stack to find the original trigger |
| Defense-in-Depth Validation | Validate at every layer data passes through to make bugs structurally impossible |
| Verification Before Completion | Run verification commands and confirm output before claiming success |

## When to Use

- **Bug in production** -> Start with Systematic Debugging
- **Error deep in stack trace** -> Use Root Cause Tracing
- **Fixing a bug** -> Apply Defense-in-Depth after finding root cause
- **About to claim "done"** -> Use Verification Before Completion

## Quick Dispatch

| Symptom | Sub-Skill |
|---------|-----------|
| Test failure, unexpected behavior | Systematic Debugging |
| Error appears in wrong location | Root Cause Tracing |
| Same bug keeps recurring | Defense-in-Depth |
| Need to confirm fix works | Verification Before Completion |

## Core Philosophy

> "Systematic debugging is FASTER than guess-and-check thrashing."

From real debugging sessions:
- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%

---

## Appendix A: Sub-Skill - Systematic Debugging

### Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core Principle:** Always find the root cause before attempting a fix. Fixing symptoms is failure.

**Violating the literal requirements of this process violates its spirit.**

### The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose a fix.

### When to Use

Use for any technical issue:
- Test failures
- Production bugs
- Unexpected behavior
- Performance issues
- Build failures
- Integration problems

**Especially when:**
- Under time pressure (urgency makes guessing tempting)
- "Just a quick fix" seems obvious
- You've already tried multiple fixes
- Previous fixes didn't work
- You don't fully understand the problem

**Don't skip even if:**
- The problem looks simple (simple bugs have root causes too)
- You're in a hurry (rushing guarantees rework)
- Someone demands an immediate fix (systematic is faster than thrashing)

### Four Phases

You must complete each phase before moving to the next.

#### Phase 1: Root Cause Investigation

**Before attempting any fix:**

1. **Read the error message carefully**
   - Don't skip errors or warnings
   - They often contain the exact solution
   - Read the full stack trace
   - Note line numbers, file paths, error codes

2. **Reproduce reliably**
   - Can you trigger it consistently?
   - What are the exact steps?
   - Does it happen every time?
   - If not reproducible -> gather more data, don't guess

3. **Check recent changes**
   - What changed that could cause this?
   - Git diff, recent commits
   - New dependencies, config changes
   - Environment differences

4. **Gather evidence in multi-component systems**

   **When the system has multiple components (CI -> Build -> Signing, API -> Service -> DB):**

   **Before proposing a fix, add diagnostic instrumentation:**
   ```
   For each component boundary:
     - Log data entering the component
     - Log data leaving the component
     - Verify environment/config propagation
     - Check state at each layer

   Run once to collect evidence showing WHERE the failure occurs
   Then analyze evidence to identify the failing component
   Then investigate that specific component
   ```

   **Example (multi-layer system):**
   ```bash
   # Layer 1: Workflow
   echo "=== Secrets available in workflow: ==="
   echo "IDENTITY: ${IDENTITY:+set}${IDENTITY:-NOT SET}"

   # Layer 2: Build script
   echo "=== Environment in build script: ==="
   env | grep IDENTITY || echo "IDENTITY not in environment"

   # Layer 3: Signing script
   echo "=== Keychain state: ==="
   security list-keychains
   security find-identity -v

   # Layer 4: Actual signing
   codesign --sign "$IDENTITY" --verbose=4 "$APP"
   ```

   **This reveals:** Which layer fails (Secret -> Workflow OK, Workflow -> Build FAIL)

5. **Trace data flow**

   **When the error is deep in the call stack:**

   See Root Cause Tracing (Appendix B) for backward-tracing techniques.

   **Quick version:**
   - Where does the bad value come from?
   - Who called this with the bad value?
   - Keep tracing up until you find the source
   - Fix at the source, not at the symptom

#### Phase 2: Pattern Analysis

**Before fixing, find patterns:**

1. **Find working examples**
   - Find similar working code in the same codebase
   - What similar feature works correctly?

2. **Compare with reference implementations**
   - If implementing a pattern, read the full reference
   - Don't skim - read line by line
   - Fully understand the pattern before applying

3. **Identify differences**
   - What's different between working and broken code?
   - List every difference, no matter how small
   - Don't assume "that can't matter"

4. **Understand dependencies**
   - What other components does this need?
   - What setup, configuration, environment?
   - What assumptions does it make?

#### Phase 3: Hypothesis and Test

**Scientific method:**

1. **Form a single hypothesis**
   - State clearly: "I believe X is the root cause because Y"
   - Write it down
   - Be specific, not vague

2. **Minimal test**
   - Make the smallest possible change to test the hypothesis
   - Change only one variable at a time
   - Don't fix multiple things simultaneously

3. **Verify before proceeding**
   - Did it work? Yes -> proceed to Phase 4
   - Didn't work? Form a new hypothesis
   - Don't pile more fixes on top

4. **When you don't know**
   - Say "I don't understand X"
   - Don't pretend to know
   - Seek help
   - Do more research

#### Phase 4: Implementation

**Fix the root cause, not the symptom:**

1. **Create a failing test case**
   - Minimal possible reproduction
   - Write an automated test if possible
   - Write a throwaway script if no framework
   - Must have a failing test before fixing

2. **Implement a single fix**
   - Targeting the identified root cause
   - Change only one thing at a time
   - No "while I'm here" improvements
   - No bundled refactoring

3. **Verify the fix**
   - Does the test pass now?
   - Are other tests still passing?
   - Is the problem actually resolved?

4. **If the fix doesn't work**
   - Stop
   - Count: how many fixes have you tried?
   - If < 3: return to Phase 1 with new information
   - **If >= 3: stop and question the architecture (see step 5)**
   - Don't attempt a 4th fix without an architecture discussion

5. **If 3+ fixes fail: Question the architecture**

   **Patterns indicating architectural issues:**
   - Each fix reveals new shared state/coupling/problems in different locations
   - Fix requires "massive refactoring" to implement
   - Each fix creates new symptoms elsewhere

   **Stop and question fundamentals:**
   - Is this pattern fundamentally sound?
   - Are we just "staying the course" out of inertia?
   - Should we refactor the architecture instead of fixing symptoms?

   **Discuss with partner before attempting more fixes**

   This is not a hypothesis failure - it's an architecture error.

### Red Flags - Stop and Follow the Process

If you find yourself thinking:
- "Quick fix first, investigate later"
- "Let me try changing X and see what happens"
- "Add multiple changes, run tests"
- "Skip tests, I'll verify manually"
- "It's probably X, let me fix it"
- "I don't fully understand but this might work"
- "The pattern says X but I'll implement differently"
- "The main issues are these: [listing fixes without investigation]"
- Proposing solutions before tracing data flow
- **"One more fix attempt" (already tried 2+)**
- **Each fix reveals new problems in different locations**

**All of the above mean: STOP. Return to Phase 1.**

**If 3+ fixes fail:** Question the architecture (see Phase 4, step 5)

### Partner Signals

**Watch for these corrections:**
- "That's not what's happening, is it?" - You made assumptions without verification
- "Would it tell us...?" - You should add evidence gathering
- "Stop guessing" - You're proposing fixes without understanding
- "Think deeply about this" - Question fundamentals, not just symptoms
- "Are we stuck?" (frustrated) - Your approach isn't working

**When you see these:** Stop. Return to Phase 1.

### Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "The problem is simple, no need for process" | Simple problems have root causes. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is faster than guess-and-check. |
| "Try this first, then investigate" | The first fix sets the pattern. Do it right from the start. |
| "Write tests after confirming the fix works" | Untested fixes don't last. Test first to prove it. |
| "Multiple fixes at once save time" | Can't isolate what worked. Creates new bugs. |
| "Reference is too long, I'll adapt this pattern" | Partial understanding guarantees bugs. Read the full thing. |
| "I see the problem, let me fix it" | Seeing symptoms != understanding root cause. |
| "One more fix attempt" (2+ failures) | 3+ failures = architectural issue. Question the pattern, don't fix again. |

### Quick Reference

| Phase | Key Activity | Success Criteria |
|-------|-------------|-----------------|
| **1. Root Cause** | Read errors, reproduce, check changes, gather evidence | Understand what and why |
| **2. Pattern** | Find working examples, compare | Differences identified |
| **3. Hypothesis** | Form theory, minimal test | Confirmed or new hypothesis |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |

### When Process Doesn't Find Root Cause

If systematic investigation genuinely reveals the issue is environment-related, timing-dependent, or external:

1. You've completed the process
2. Document what you investigated
3. Implement appropriate handling (retries, timeouts, error messages)
4. Add monitoring/logging for future investigation

**However:** 95% of "no root cause" cases are insufficient investigation.

### Real-World Impact

From debugging sessions:
- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%
- New bugs introduced: near zero vs frequent

---

## Appendix B: Sub-Skill - Root Cause Tracing

### Overview

Bugs typically manifest deep in the call stack (git init in the wrong directory, file created in the wrong location, database opening the wrong path). Your instinct is to fix where the error appears, but that's treating symptoms.

**Core Principle:** Trace backward through the call chain until you find the original trigger, then fix at the source.

### When to Use

- Error occurs deep in execution (not at entry point)
- Stack trace shows a long call chain
- Unclear where invalid data originated
- Need to find which test/code triggered the problem

### Tracing Process

#### 1. Observe the Symptom
```
Error: git init failed in /Users/jesse/project/packages/core
```

#### 2. Find the Direct Cause
**What code directly caused this?**
```typescript
await execFileAsync('git', ['init'], { cwd: projectDir });
```

#### 3. Ask: Who Called This?
```typescript
WorktreeManager.createSessionWorktree(projectDir, sessionId)
  -> called by Session.initializeWorkspace()
  -> called by Session.create()
  -> called by Project.create() in the test
```

#### 4. Keep Tracing Up
**What values were passed?**
- `projectDir = ''` (empty string!)
- Empty string as `cwd` resolves to `process.cwd()`
- That's the source code directory!

#### 5. Find the Original Trigger
**Where did the empty string come from?**
```typescript
const context = setupCoreTest(); // returns { tempDir: '' }
Project.create('name', context.tempDir); // accessed before beforeEach!
```

### Adding Stack Traces

When manual tracing isn't possible, add diagnostic instrumentation:

```typescript
// Before the problematic operation
async function gitInit(directory: string) {
  const stack = new Error().stack;
  console.error('DEBUG git init:', {
    directory,
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    stack,
  });

  await execFileAsync('git', ['init'], { cwd: directory });
}
```

**Key:** Use `console.error()` in tests (not logger - it may be suppressed)

**Run and capture:**
```bash
npm test 2>&1 | grep 'DEBUG git init'
```

**Analyze the stack trace:**
- Look for test file names
- Find the line number that triggered the call
- Identify patterns (same test? same argument?)

### Finding Which Test Polluted

If something appears during tests but you don't know which test:

Use bisection script: @find-polluter.sh

```bash
./find-polluter.sh '.git' 'src/**/*.test.ts'
```

Runs tests one at a time, stops at the first polluter.

### Real-World Example: Empty projectDir

**Symptom:** `.git` created in `packages/core/` (source directory)

**Trace chain:**
1. `git init` runs in `process.cwd()` <- empty cwd argument
2. WorktreeManager received empty projectDir
3. Session.create() passed empty string
4. Test accessed `context.tempDir` before beforeEach
5. setupCoreTest() initially returns `{ tempDir: '' }`

**Root cause:** Top-level variable initialization accessing empty value

**Fix:** Change tempDir to a getter that throws if accessed before beforeEach

**Also added defense-in-depth:**
- Layer 1: Project.create() validates directory
- Layer 2: WorkspaceManager validates non-empty
- Layer 3: NODE_ENV guard rejects git init outside tmpdir
- Layer 4: Stack trace logging before git init

### Key Principles

**Never fix only where the error appears.** Trace back to find the original trigger.

### Stack Trace Tips

- **In tests:** Use `console.error()` not logger - logger may be suppressed
- **Before operations:** Log before dangerous operations, not after failure
- **Include context:** directory, cwd, environment variables, timestamps
- **Capture stack:** `new Error().stack` shows the full call chain

### Real-World Impact

From debugging session (2025-10-03):
- Root cause found by tracing through 5 layers
- Fixed at source (getter validation)
- Added 4 layers of defense
- 1,847 tests passing, zero pollution

---

## Appendix C: Sub-Skill - Defense-in-Depth Validation

### Overview

When you fix a bug caused by invalid data, adding validation at one point feels sufficient. But that single check can be bypassed by different code paths, refactoring, or mocks.

**Core Principle:** Validate at every layer data passes through. Make bugs structurally impossible.

### Why Multiple Layers

Single validation: "We fixed the bug"
Multi-layer validation: "We made the bug impossible"

Different layers catch different scenarios:
- Entry validation catches most bugs
- Business logic catches edge cases
- Environment guards prevent dangerous operations in specific contexts
- Debug instrumentation helps when other layers fail

### Four Layers of Defense

#### Layer 1: Entry Point Validation
**Purpose:** Reject obviously invalid input at API boundaries

```typescript
function createProject(name: string, workingDirectory: string) {
  if (!workingDirectory || workingDirectory.trim() === '') {
    throw new Error('workingDirectory cannot be empty');
  }
  if (!existsSync(workingDirectory)) {
    throw new Error(`workingDirectory does not exist: ${workingDirectory}`);
  }
  if (!statSync(workingDirectory).isDirectory()) {
    throw new Error(`workingDirectory is not a directory: ${workingDirectory}`);
  }
  // ... continue
}
```

#### Layer 2: Business Logic Validation
**Purpose:** Ensure data makes sense for the current operation

```typescript
function initializeWorkspace(projectDir: string, sessionId: string) {
  if (!projectDir) {
    throw new Error('projectDir required for workspace initialization');
  }
  // ... continue
}
```

#### Layer 3: Environment Guards
**Purpose:** Prevent dangerous operations in specific contexts

```typescript
async function gitInit(directory: string) {
  // In tests, refuse to git init outside temp directories
  if (process.env.NODE_ENV === 'test') {
    const normalized = normalize(resolve(directory));
    const tmpDir = normalize(resolve(tmpdir()));

    if (!normalized.startsWith(tmpDir)) {
      throw new Error(
        `Refusing to git init outside temp directory during tests: ${directory}`
      );
    }
  }
  // ... continue
}
```

#### Layer 4: Debug Instrumentation
**Purpose:** Capture context for post-mortem analysis

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  logger.debug('About to git init', {
    directory,
    cwd: process.cwd(),
    stack,
  });
  // ... continue
}
```

### Applying This Pattern

When you find a bug:

1. **Trace data flow** - Where does the bad value originate? Where is it consumed?
2. **Map all checkpoints** - List every point the data passes through
3. **Add validation at each layer** - Entry, business, environment, debug
4. **Test each layer** - Try to bypass layer 1, verify layer 2 catches it

### Session Example

Bug: Empty `projectDir` caused `git init` to execute in the source code directory

**Data flow:**
1. Test setup -> empty string
2. `Project.create(name, '')`
3. `WorkspaceManager.createWorkspace('')`
4. `git init` runs in `process.cwd()`

**Four layers of defense added:**
- Layer 1: `Project.create()` validates non-empty/exists/writable
- Layer 2: `WorkspaceManager` validates projectDir non-empty
- Layer 3: `WorktreeManager` rejects git init outside tmpdir in tests
- Layer 4: Stack trace logging before git init

**Result:** All 1,847 tests passing, bug impossible to recur

### Key Insight

All four layers of defense are necessary. During testing, each layer caught bugs that the others missed:
- Different code paths bypassed entry validation
- Mocks bypassed business logic checks
- Edge cases on different platforms needed environment guards
- Debug logging identified structural misuse

**Don't stop at a single validation point.** Add checks at every layer.

---

## Appendix D: Sub-Skill - Verification Before Completion

### Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core Principle:** Evidence before claims, always.

**Violating the literal requirements of this rule violates its spirit.**

### The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you can't claim it passed.

### Gate Function

```
Before claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the full command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If no: State actual status with evidence
   - If yes: Claim with evidence attached
5. Only THEN: Make the claim

Skip any step = lying, not verifying
```

### Common Failure Patterns

| Claim | Required Evidence | Insufficient |
|-------|------------------|-------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, inference |
| Build succeeds | Build command: exit 0 | Linter passed, logs look OK |
| Bug fixed | Test for original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test only passed once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests pass |

### Red Flags - STOP Immediately

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit/push/create PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting to wrap up
- **Any wording implying success without running verification**

### Preventing Rationalization

| Excuse | Reality |
|--------|---------|
| "It should work now" | Run verification |
| "I'm very confident" | Confidence != evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter != compiler |
| "Agent said success" | Verify independently |
| "I'm tired" | Fatigue != excuse |
| "Partial check is enough" | Partial verification proves nothing |
| "Rephrased so rule doesn't apply" | Spirit over letter |

### Key Patterns

**Testing:**
```
Correct: [run test command] [see: 34/34 passed] "All tests pass"
Wrong:   "Should pass now" / "Looks correct"
```

**Regression tests (TDD red-green cycle):**
```
Correct: Write -> Run (pass) -> Revert fix -> Run (must fail) -> Restore -> Run (pass)
Wrong:   "I wrote a regression test" (no red-green verification)
```

**Build:**
```
Correct: [run build] [see: exit 0] "Build passes"
Wrong:   "Linter passed" (linter doesn't check compilation)
```

**Requirements:**
```
Correct: Re-read plan -> Create checklist -> Verify each item -> Report gaps or complete
Wrong:   "Tests passed, phase complete"
```

**Agent delegation:**
```
Correct: Agent reports success -> Check VCS diff -> Verify changes -> Report actual status
Wrong:   Trust agent report
```

### Why This Matters

From 24 failure memories:
- Partner said "I don't believe you" - trust was broken
- Undefined functions shipped - would cause crashes
- Missing requirements shipped - incomplete features
- Time wasted on false completion claims -> redirection -> rework
- Violated: "Honesty is a core value. If you lie, you will be replaced."

### When to Apply

**Always before:**
- Any form of success/completion claim
- Any expression of satisfaction
- Any positive statement about work status
- Committing, creating PRs, completing tasks
- Moving to the next task
- Delegating to agents

**Rule applies to:**
- Exact wording
- Paraphrases and synonyms
- Implications of success
- Any communication implying completion/correctness

### Bottom Line

**There are no shortcuts to verification.**

Run the command. Read the output. Then state the result.

This is non-negotiable.
