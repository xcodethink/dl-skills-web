> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: Development Methodology

---
name: creative-problem-solving
description: Creative problem-solving techniques for breaking through stuck points - includes collision-zone thinking, inversion, pattern recognition, scale testing, and simplification. Use when stuck on a problem, need innovation beyond conventional approaches, or want to find elegant solutions.
---

# Creative Problem Solving

## Overview

A collection of techniques for breaking through stuck points and finding elegant solutions. Contains six sub-skills covering everything from problem dispatch to specific breakthrough techniques.

| Sub-Skill | Purpose |
|-----------|---------|
| When Stuck (Dispatch) | Starting point - matches your stuck-type to the right technique |
| Collision-Zone Thinking | Force unrelated concepts together to discover emergent properties |
| Inversion Exercise | Flip every assumption and see what still holds |
| Meta-Pattern Recognition | Spot universal principles appearing across 3+ domains |
| Scale Game | Test at extremes to reveal hidden fundamental truths |
| Simplification Cascades | Find one insight that eliminates multiple components |

## When to Use

| Your Situation | Use This |
|----------------|----------|
| **Don't know which technique** | When Stuck (Dispatch) |
| **Need breakthrough innovation** | Collision-Zone Thinking |
| **Constrained by assumptions** | Inversion Exercise |
| **Same issue in different places** | Meta-Pattern Recognition |
| **Unsure about production scale** | Scale Game |
| **Complexity spiraling** | Simplification Cascades |

## Quick Reference

```
Conventional solutions inadequate?     -> Collision-Zone Thinking
"This must be done this way"?          -> Inversion Exercise
Same pattern 3+ places?               -> Meta-Pattern Recognition
Will it work at scale?                 -> Scale Game
Same thing implemented 5+ ways?        -> Simplification Cascades
```

## Core Philosophy

> "One powerful abstraction > ten clever hacks"

These techniques help you find the elegant solution that makes complexity unnecessary, rather than managing complexity through brute force.

---

## Appendix A: Sub-Skill - When Stuck (Dispatch)

### Overview

Different types of "stuck" require different techniques. This skill helps you quickly identify which problem-solving sub-skill to use.

**Core Principle:** Match the stuck-symptom to the technique.

### Quick Dispatch Table

| How You're Stuck | Use This Skill |
|------------------|----------------|
| **Complexity spiraling** - 5+ ways to do the same thing, special cases growing | Simplification Cascades |
| **Need innovation** - conventional solutions inadequate, can't find the right approach | Collision-Zone Thinking |
| **Recurring patterns** - same problem in different places, reinventing the wheel | Meta-Pattern Recognition |
| **Constrained by assumptions** - "must be done this way", can't question premises | Inversion Exercise |
| **Scale uncertainty** - will it work in production? edge cases unclear? | Scale Game |
| **Code is broken** - wrong behavior, test failures, unexpected output | Systematic Debugging |
| **Multiple independent problems** - can be investigated in parallel | Parallel Agent Dispatch |
| **Root cause unknown** - symptoms are clear, cause is hidden | Root Cause Tracing |

### Process

1. **Identify stuck-type** - Which symptom matches the table above?
2. **Load the corresponding skill** - Read the specific technique
3. **Apply the technique** - Follow its process
4. **If still stuck** - Try a different technique or combine them

### Combining Techniques

Some problems need multiple techniques:

- **Simplification + Meta-Pattern**: Find the pattern, then simplify all instances
- **Collision + Inversion**: Force a metaphor, then invert its assumptions
- **Scale + Simplification**: Extremes reveal what should be eliminated

### Remember

- Match symptoms to techniques
- Use one technique at a time
- Combine if the first doesn't work
- Document what you've tried

---

## Appendix B: Sub-Skill - Collision-Zone Thinking

### Overview

Revolutionary insights come from forcing unrelated concepts together. Treat X as Y and see what emerges.

**Core Principle:** Deliberate metaphor-mixing produces novel solutions.

### Quick Reference

| Stuck On | Try Treating As | Might Discover |
|----------|-----------------|----------------|
| Code organization | DNA / genetics | Mutation testing, evolutionary algorithms |
| Service architecture | LEGO bricks | Composable microservices, plug-and-play |
| Data management | Water flow | Stream processing, data lakes, flow-based systems |
| Request handling | Postal mail | Message queues, async processing |
| Error handling | Circuit breakers | Fault isolation, graceful degradation |

### Process

1. **Choose two unrelated concepts** - from different domains
2. **Force the combination**: "What if we treated [A] like [B]?"
3. **Explore emergent properties**: What new capabilities appear?
4. **Test the boundaries**: Where does the metaphor break down?
5. **Extract insights**: What did we learn?

### Collision Example

**Problem:** Complex distributed system with cascading failures

**Collision:** "What if we treated services like electrical circuits?"

**Emergent properties:**
- Circuit breakers (disconnect on overload)
- Fuses (one-time failure protection)
- Ground faults (error isolation)
- Load balancing (current distribution)

**What works:** Prevents cascading failures
**What breaks down:** Circuits don't have retry logic
**Insight gained:** Fault isolation patterns from electrical engineering

### Signals You Need This Skill

- "I've tried everything in this domain"
- Solutions feel incremental, not breakthrough
- Stuck in conventional thinking
- Need innovation, not optimization

### Remember

- The wildest combinations often produce the best insights
- Rigorously test the boundaries of metaphors
- Document even failed collisions (they're educational)
- Best source domains: physics, biology, economics, psychology

---

## Appendix C: Sub-Skill - Inversion Exercise

### Overview

Flip every assumption and see what still holds. Sometimes the opposite direction reveals the truth.

**Core Principle:** Inversion exposes hidden assumptions and alternatives.

### Quick Reference

| Normal Assumption | Inverted | What It Reveals |
|-------------------|----------|-----------------|
| Cache to reduce latency | Add latency to enable caching | Debouncing patterns |
| Pull data when needed | Push data before it's needed | Prefetching, eager loading |
| Handle errors when they occur | Make errors impossible | Type systems, contracts |
| Build features users want | Remove features users don't need | Simplicity >> feature bloat |
| Optimize for common case | Optimize for worst case | Resilience patterns |

### Process

1. **List core assumptions** - What "must" be true?
2. **Systematically invert each** - "What if the opposite were true?"
3. **Explore implications** - What would we do differently?
4. **Find valid inversions** - Which actually work in some scenarios?

### Example

**Problem:** Users complain the application is too slow

**Normal approach:** Make everything faster (caching, optimization, CDN)

**Inversion:** Intentionally slow things down in some places
- Search debouncing (add delay -> better results)
- Request throttling (add friction -> prevent abuse)
- Lazy content loading (delay -> reduced initial payload)

**Insight:** Strategic "slowness" can improve UX

### Signals You Need This Skill

- "There's only one way to do this"
- Forced into a solution that feels wrong
- Can't articulate why an approach is necessary
- "This is how it's always been done"

### Remember

- Not all inversions work (test the boundaries)
- Valid inversions reveal context-dependency
- Sometimes the opposite direction IS the answer
- Question "must" statements

---

## Appendix D: Sub-Skill - Meta-Pattern Recognition

### Overview

When the same pattern appears in 3+ domains, it's likely a universal principle worth extracting.

**Core Principle:** Look for patterns in the way patterns emerge.

### Quick Reference

| Pattern Appears In | Abstract Form | Where Else Could It Apply? |
|-------------------|---------------|---------------------------|
| CPU/DB/HTTP/DNS caching | Store frequently accessed data closer | LLM prompt caching, CDN |
| Layering (network/storage/compute) | Separate concerns into abstraction levels | Software architecture, org structure |
| Queues (message/task/request) | Decouple producers from consumers with buffers | Event systems, async processing |
| Pooling (connection/thread/object) | Reuse expensive resources | Memory management, resource governance |

### Process

1. **Spot repetition** - See the same shape in 3+ places
2. **Extract abstract form** - Describe it independent of any domain
3. **Identify variants** - How does it adapt in each domain?
4. **Check applicability** - Where else could it work?

### Example

**Pattern spotted:** Rate limiting appears in API throttling, traffic shaping, circuit breakers, admission control

**Abstract form:** Limit resource consumption to prevent exhaustion

**Variation points:** Which resource, what limit, what happens when exceeded

**New application:** LLM token budgets (same pattern - prevent context window exhaustion)

### Signals You're Missing Meta-Patterns

- "This problem is unique" (it probably isn't)
- Multiple teams independently solving "different" problems the same way
- Reinventing wheels across domains
- "Haven't we done something like this before?" (yes, find it)

### Remember

- 3+ domains = likely universal
- Abstract form reveals new applications
- Variants show adaptation points
- Universal patterns are battle-tested

---

## Appendix E: Sub-Skill - Scale Game

### Overview

Test your approach at extreme scales to find what breaks and what survives unexpectedly.

**Core Principle:** Extreme scales reveal fundamental truths hidden at normal scales.

### Quick Reference

| Scale Dimension | Test at Extremes | What It Reveals |
|-----------------|------------------|-----------------|
| Quantity | 1 vs 1 billion | Algorithmic complexity limits |
| Speed | Instant vs 1 year | Async requirements, caching needs |
| Users | 1 user vs 1 billion users | Concurrency issues, resource limits |
| Duration | Milliseconds vs years | Memory leaks, state growth |
| Failure rate | Never fails vs always fails | Error handling adequacy |

### Process

1. **Choose a dimension** - What could change drastically?
2. **Test the minimum** - What if 1000x smaller/faster/fewer?
3. **Test the maximum** - What if 1000x larger/slower/more?
4. **Document what breaks** - Where are the limits?
5. **Document what survives** - What is fundamentally sound?

### Examples

#### Example 1: Error Handling
**Normal scale:** "Handle errors when they occur" works fine
**At 1 billion scale:** Error volume overwhelms logging, system crashes
**Reveals:** Need to make errors impossible (type systems) or expect them (chaos engineering)

#### Example 2: Synchronous API
**Normal scale:** Direct function calls work fine
**At global scale:** Network latency makes synchronous calls unusable
**Reveals:** Async/message passing becomes a survival need, not an optimization

#### Example 3: In-Memory State
**Normal duration:** Running for hours/days is fine
**After years:** Memory grows unbounded, eventually crashes
**Reveals:** Need persistence or periodic cleanup, can't rely on memory

### Signals You Need This Skill

- "It works in development" (but what about production?)
- Don't know where the limits are
- "It should scale" (but haven't tested)
- Surprised by production behavior

### Remember

- Extremes reveal fundamentals
- What works at one scale may fail at another
- Test in both directions (larger AND smaller)
- Use insights to validate architecture early

---

## Appendix F: Sub-Skill - Simplification Cascades

### Overview

Sometimes one insight can eliminate 10 things. Look for unifying principles that make multiple components unnecessary.

**Core Principle:** "Everything is a special case of..." can dramatically collapse complexity.

### Quick Reference

| Symptom | Possible Cascade |
|---------|-----------------|
| 5+ ways to do the same thing | Abstract the common pattern |
| Growing list of special cases | Find the general case |
| Complex rules with many exceptions | Find the rule without exceptions |
| Too many configuration options | Find defaults that work for 95% of cases |

### Pattern

**Look for:**
- Multiple implementations of similar concepts
- Special case handling everywhere
- "We need to handle A, B, C, D differently..."
- Complex rules with extensive exceptions

**Ask yourself:** "What if they're all the same thing underneath?"

### Examples

#### Cascade 1: Stream Abstraction
**Before:** Separate processors for batch/realtime/file/network data
**Insight:** "All inputs are streams - just different sources"
**After:** One stream processor, multiple stream sources
**Eliminated:** 4 separate implementations

#### Cascade 2: Resource Governance
**Before:** Session tracking, rate limiting, file validation, connection pooling (all separate)
**Insight:** "All are per-entity resource limits"
**After:** One ResourceGovernor managing 4 resource types
**Eliminated:** 4 custom enforcement systems

#### Cascade 3: Immutability
**Before:** Defensive copies, locking, cache invalidation, temporal coupling
**Insight:** "Treat everything as immutable data + transformations"
**After:** FP patterns
**Eliminated:** Entire categories of synchronization issues

### Process

1. **List variants** - What is implemented multiple ways?
2. **Find the essence** - What's the same underneath?
3. **Extract the abstraction** - What's the domain-independent pattern?
4. **Test it** - Do all cases fit cleanly?
5. **Measure the cascade** - How many things become unnecessary?

### Signals You're Missing a Cascade

- "We just need to add one more case..." (repeating forever)
- "These are similar but different" (maybe they're the same?)
- Refactoring feels like whack-a-mole (fix one, break another)
- Config files keep growing
- "Don't touch that, it's complex" (complexity hides patterns)

### Remember

- Simplification cascades = 10x gains, not 10% improvements
- One powerful abstraction > ten clever hacks
- Patterns usually already exist, they just need to be recognized
- Measure by "how many things can we delete?"
