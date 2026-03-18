> Source: [Claude Code Skills](https://claudecodeskills.wayjet.io)

# Build a SaaS Product from Scratch with Claude Code

## Overview

Building a SaaS product is one of the most ambitious things you can do as a developer or founder. The journey from a blank terminal to a production-ready application involves hundreds of decisions, thousands of lines of code, and countless opportunities for things to go sideways. Claude Code, equipped with the right skills, transforms this process from a chaotic scramble into a structured, repeatable methodology.

This guide is for developers, technical founders, and indie hackers who want to build a real SaaS product --- not a toy demo --- using Claude Code as their AI-powered development partner. Whether you are a solo founder bootstrapping on weekends or a small team moving fast, this guide will show you which skills to activate, in what order, and why each one matters at each stage of the build.

By the end, you will have a clear playbook that takes you from "I have an idea" to "users are paying for this" with confidence, code quality, and speed.

---

## Phase 1: Ideation & Planning

Every successful SaaS product starts with clarity. Before you write a single line of code, you need to know what you are building, for whom, and why it matters. This is where two foundational skills come into play.

### Skill: Brainstorming

The Brainstorming skill turns Claude Code into a structured ideation partner. Instead of scribbling on a whiteboard alone, you engage in a guided exploration of your problem space. The skill prompts you to articulate the core problem, identify your target users, map out competitors, and pressure-test your assumptions.

Start by describing your idea in plain language. Claude will help you decompose it: What is the core value proposition? Who are the first ten users? What existing solutions do they use, and where do those solutions fail? The Brainstorming skill does not just generate ideas --- it forces you to confront the hard questions early, before you have invested weeks of development time.

A typical brainstorming session might produce a prioritized feature list, a rough user journey, and a set of hypotheses about what will make your product sticky. Capture all of this output. It becomes the foundation for everything that follows.

### Skill: Implementation Plan

Once you have clarity on what to build, the Implementation Plan skill translates your vision into an actionable development roadmap. This skill generates a phased plan with concrete milestones, technology choices, database schema outlines, API endpoint definitions, and a recommended order of execution.

The key insight here is vertical slicing. The Implementation Plan skill does not produce a plan where you build the entire backend first, then the entire frontend. Instead, it slices the product into thin, end-to-end features that each deliver user value. Your first milestone might be "a user can sign up, see a dashboard, and create one resource." That single slice touches authentication, database, API, and UI --- and it gives you something you can demo and test immediately.

Review the plan carefully. Challenge the assumptions. Ask Claude to justify technology choices or suggest alternatives. Once you are satisfied, you have a living document that will guide the rest of the build.

**Time investment:** 2--4 hours for brainstorming and planning. This upfront investment will save you days or weeks of rework later.

---

## Phase 2: Project Setup

With a plan in hand, it is time to set up your project. This is where discipline either gets established or abandoned, and the difference echoes through the entire lifecycle of your product.

### Skill: TDD (Test-Driven Development)

Activate TDD from the very first commit. Not after you have built the core features. Not when you "have time to add tests." From day one.

The TDD skill enforces a red-green-refactor cycle: write a failing test that describes the behavior you want, write the minimum code to make it pass, then refactor while keeping tests green. When applied from the start of a SaaS project, TDD does several things simultaneously:

1. **It forces you to think about interfaces before implementations.** When you write a test for your user registration endpoint before the endpoint exists, you naturally design a clean API contract.

2. **It gives you a safety net for the entire project.** Every feature you add from this point forward is protected by tests. When you refactor your authentication system in month three, your tests will catch regressions instantly.

3. **It produces documentation as a side effect.** Your test suite becomes a living specification of what your application does.

Set up your testing infrastructure during project initialization: test runner, assertion library, database fixtures, and CI pipeline. The TDD skill will guide you through writing your first tests --- typically for your data models and core API endpoints.

**Practical tip:** Start with integration tests for your API endpoints and unit tests for your business logic. Do not obsess over achieving 100% coverage on day one. Focus on covering the critical paths: authentication, authorization, and your core domain operations.

---

## Phase 3: Core Development

This is the longest phase, where you build feature after feature according to your implementation plan. Two skills work together here to keep you productive and your codebase healthy.

### Skill: TDD (continued)

Every new feature begins with a test. This is non-negotiable. As you build out your SaaS --- adding payment integration, team management, notification systems, admin dashboards --- each feature starts with a failing test that describes the expected behavior.

The TDD skill adapts to the complexity of what you are building. For a simple CRUD endpoint, it might suggest a straightforward request-response test. For a payment webhook handler, it will guide you toward testing edge cases: duplicate events, out-of-order delivery, and partial failures. The skill helps you think about what can go wrong, not just what should go right.

### Skill: Git Worktrees

As your feature set grows, you will often need to work on multiple things in parallel or quickly switch context. The Git Worktrees skill teaches you to use Git's worktree feature to maintain multiple working directories from a single repository. Each feature gets its own worktree, its own branch, and its own isolated development environment.

Why does this matter for SaaS development? Consider a realistic scenario: you are halfway through building the team invitation system when a user reports that password reset emails are broken. Without worktrees, you either stash your work (risky), commit half-finished code (messy), or lose your flow state entirely. With worktrees, you open a new terminal, navigate to a fresh worktree on a hotfix branch, fix the issue, push, and return to your feature work without missing a beat.

The Git Worktrees skill also pairs beautifully with TDD. Each worktree runs its own test suite independently. You can have tests running in your invitation-system worktree while you debug in your hotfix worktree.

**Practical tip:** Create a naming convention for your worktrees early. Something like `feature/team-invitations`, `fix/password-reset`, `experiment/new-pricing-page`. This keeps your workspace organized as the project grows.

### Development rhythm

The rhythm during Phase 3 should feel like this:

1. Pick the next feature from your implementation plan.
2. Create a new branch (and optionally a new worktree).
3. Write failing tests for the feature.
4. Implement the feature until tests pass.
5. Refactor while tests stay green.
6. Create a pull request.
7. Repeat.

Each cycle should take hours to a couple of days, not weeks. If a feature is taking longer than two days, break it into smaller vertical slices.

---

## Phase 4: Quality Assurance

You have built the core features. The test suite is green. But before you ship, two more skills ensure you are not sending a half-baked product into the world.

### Skill: Pre-Completion Verification

The Pre-Completion Verification skill is your checklist before declaring a feature "done." It systematically walks through a verification process: Do all tests pass? Are there edge cases you haven't considered? Is error handling comprehensive? Are environment variables documented? Is the database migration reversible? Are API responses consistent with your schema?

This skill catches the things that slip through the cracks when you are moving fast. It is especially valuable for SaaS products because the surface area of potential issues is so large. Authentication, authorization, data validation, rate limiting, error messages, logging --- each of these is a domain where a small oversight can become a production incident.

Run Pre-Completion Verification for every major feature before merging it. The twenty minutes it takes will save you hours of firefighting after launch.

### Skill: Code Review

The Code Review skill turns Claude into a rigorous reviewer of your own code. It examines your changes for security vulnerabilities, performance issues, maintainability concerns, and adherence to best practices.

For a SaaS product, the Code Review skill is particularly valuable in a few areas:

- **Security:** It flags common vulnerabilities like SQL injection, insecure direct object references, and missing authorization checks. These are the kinds of bugs that do not crash your app but quietly expose your users' data.
- **Performance:** It identifies N+1 queries, missing database indexes, and unnecessary data fetching that will become painful as your user base grows.
- **Maintainability:** It catches code smells, suggests better abstractions, and points out where your code has drifted from established patterns.

Even if you are a solo developer, treat every pull request as if a teammate is reviewing it. The Code Review skill provides that second pair of eyes.

---

## Phase 5: Ship

You have built, tested, verified, and reviewed. Now it is time to put your product in front of real users.

### Final Checks

Before deployment, run through a final round of Pre-Completion Verification at the project level (not just the feature level). This means:

- All tests pass in CI.
- Environment variables are configured for production.
- Database migrations have been tested against a production-like dataset.
- Error monitoring and logging are in place.
- Rate limiting and abuse prevention are configured.
- Your landing page accurately describes what the product does.

### Deployment

Deploy to your chosen platform. Whether it is Vercel, Railway, Fly.io, AWS, or something else, your implementation plan from Phase 1 should have already defined the deployment strategy. Your first deploy should be anticlimactic --- that is a sign that your process worked.

### Post-Launch

After launch, the same skills continue to serve you. New features follow the TDD cycle. Bug reports get investigated with Systematic Debugging (see the debugging guide). Code Review catches regressions before they reach users. The skills do not just help you build --- they help you maintain and grow.

---

## Why This Combination Works

The five skills in this guide are not random selections. They form an interlocking system:

- **Brainstorming** ensures you build the right thing.
- **Implementation Plan** ensures you build it in the right order.
- **TDD** ensures every piece works correctly as you build it.
- **Git Worktrees** ensures you can move fast without creating chaos.
- **Pre-Completion Verification + Code Review** ensures nothing slips through before it reaches users.

Each skill addresses a different failure mode. Without brainstorming, you build the wrong product. Without a plan, you build features in the wrong order and waste time on rework. Without TDD, bugs accumulate silently. Without worktrees, context switching destroys your productivity. Without verification and review, you ship broken features.

Together, they create a development process that is both fast and safe. You move quickly because you have a clear plan and automated tests that catch mistakes. You move safely because every feature is verified and reviewed before it ships.

---

## Common Pitfalls

**Skipping the planning phase.** The urge to "just start coding" is strong. Resist it. Two hours of structured brainstorming and planning will save you twenty hours of rework.

**Adding TDD later.** If you tell yourself you will add tests after the core features are built, you will not. The codebase will grow in ways that make testing difficult, and the effort required to retrofit tests will feel prohibitive. Start with TDD on day one.

**Making worktrees too long-lived.** A worktree that has been open for two weeks without merging is a merge conflict waiting to happen. Keep your feature branches short-lived. Merge frequently. If a feature is too large to merge in a couple of days, break it into smaller pieces.

**Treating code review as optional when solo.** Solo developers often skip code review because "I wrote it, so I know what it does." You do not. Future-you will not remember why you made that design decision. The Code Review skill provides objectivity and catches blind spots.

**Ignoring pre-completion verification for "small" changes.** Small changes cause big outages. A one-line configuration change can take down your entire application. Run verification proportional to risk, not proportional to the size of the diff.

**Not iterating on the plan.** Your implementation plan is a living document. As you build, you will learn things that change your priorities. Update the plan. Do not rigidly follow a plan that no longer reflects reality.

---

Building a SaaS product is hard work, but it does not have to be chaotic work. With the right skills activated at the right time, Claude Code becomes more than a code generator --- it becomes a development partner that keeps you disciplined, productive, and shipping.
