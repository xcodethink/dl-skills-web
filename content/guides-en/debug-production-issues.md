> Source: [Claude Code Skills](https://claudecodeskills.wayjet.io)

# Systematically Debug Production Issues

## Overview

A production issue is not just a technical problem --- it is a business crisis measured in minutes. Every moment your application is broken, users are leaving, revenue is lost, and trust erodes. The instinct in these moments is to panic, make rapid changes, and hope something works. That instinct is wrong.

This guide teaches you a systematic approach to production debugging using Claude Code skills. Instead of flailing, you will follow a disciplined process: stabilize, investigate, verify, and prevent. This methodology works whether the issue is a crashed server, corrupted data, a performance degradation, or a subtle logic bug that only manifests under specific conditions.

If you have ever spent three hours chasing a bug only to realize you were looking in the wrong place entirely, this guide is for you.

---

## Step 1: Stabilize the Scene

Before you investigate anything, your first job is to stop the bleeding. This is not the same as fixing the bug. Stabilization means reducing the impact on users while you figure out what went wrong.

Common stabilization tactics include:

- **Rolling back to the last known good deployment.** If the issue started after a deploy, revert first and investigate second. You can always redeploy the new code once the bug is fixed.
- **Enabling a feature flag to disable the broken feature.** If you have feature flags in place (and you should), toggle the problematic feature off. Users lose access to one feature instead of experiencing a broken application.
- **Scaling up resources temporarily.** If the issue is performance-related (database overload, memory exhaustion), adding capacity buys you time to find the root cause.
- **Communicating with users.** A brief, honest status update ("We are aware of the issue and working on a fix") reduces support tickets and preserves trust.

The stabilization phase should take minutes, not hours. Make a decision, execute it, confirm that the immediate impact is reduced, and then move to investigation.

**Key principle:** Do not try to fix the bug during stabilization. The goal is to reduce user impact, not to understand the root cause. Mixing these two objectives leads to hasty, incomplete fixes that create new problems.

---

## Step 2: Systematic Debugging

This is where the Systematic Debugging skill transforms your investigation from guesswork into science. The skill provides a structured framework for finding the root cause of any bug, no matter how complex.

### Gather Evidence First

Before forming any hypothesis, collect the facts:

- **Error logs:** What exactly is the error message? What is the stack trace? When did the first occurrence happen?
- **Metrics:** Has CPU, memory, disk, or network usage changed? Are response times elevated? Is the error rate spiking or steady?
- **Recent changes:** What deployments, configuration changes, or database migrations happened in the last 24 hours? Check your deployment logs, not your memory.
- **Reproduction:** Can you reproduce the issue? If so, under what conditions? If not, what makes the affected users different from unaffected ones?

Write down everything you find. The act of documenting evidence forces clarity and prevents you from going in circles.

### Binary Search for the Root Cause

The Systematic Debugging skill's most powerful technique is binary search applied to debugging. Instead of examining every possible cause sequentially, you divide the problem space in half with each test.

Here is how it works in practice. Suppose your API is returning 500 errors on a specific endpoint. The request flows through middleware, authentication, input validation, business logic, database queries, and response serialization. That is six layers, each with dozens of potential failure points.

Instead of examining each layer from top to bottom, bisect. Add logging or a breakpoint at the business logic layer --- the midpoint. Does the request reach business logic successfully? If yes, the bug is in the database layer or response serialization. If no, the bug is in middleware, authentication, or input validation. You have just eliminated half the codebase from consideration with a single test.

Repeat. If the bug is in the database layer, bisect again: is the query being constructed correctly? Is the database returning unexpected data? Is the ORM mapping failing? Each test eliminates half of the remaining possibilities.

This approach is dramatically faster than the common alternative of reading code top-to-bottom and hoping you notice the problem. For a system with 1,000 potential failure points, sequential search takes an average of 500 checks. Binary search takes about 10.

### Hypothesis Testing

For bugs that resist binary search --- intermittent failures, race conditions, timing-dependent issues --- the skill switches to hypothesis testing.

1. **Form a specific, testable hypothesis.** Not "something is wrong with the database" but "the connection pool is being exhausted because long-running queries are not timing out."
2. **Design a test that can prove or disprove the hypothesis.** For the connection pool example, check the number of active connections during the failure window. If connections are at the pool limit, the hypothesis is supported. If not, it is disproven.
3. **Run the test and record the result.**
4. **If disproven, form a new hypothesis based on what you learned.** The failed hypothesis still produced information --- it eliminated a possible cause.

Never test two hypotheses at once. Changing two variables simultaneously makes it impossible to determine which change had an effect.

### Know When to Ask for Help

The Systematic Debugging skill also teaches you to recognize when you have hit the limits of your own knowledge. If you have been investigating for more than an hour without making progress, it is time to bring in another perspective: a teammate, a community forum, or a different Claude Code session with fresh context.

---

## Step 3: Verify the Fix

You have found the root cause. You have written a fix. But you are not done yet. An unverified fix is just another hypothesis.

### Write a Regression Test

Before deploying the fix, write a test that reproduces the exact conditions that caused the bug. This test should fail without your fix and pass with it. The test serves two purposes: it proves your fix actually addresses the root cause (not just a symptom), and it prevents the same bug from recurring in the future.

Use the TDD skill here. Write the failing test first, then apply your fix and watch it turn green. This is TDD in its most literal and valuable application.

### Test in a Staging Environment

Deploy your fix to a staging environment that mirrors production. Run the regression test. Run your full test suite. Manually exercise the affected feature. Check that related features are unaffected.

If your staging environment does not exist or does not mirror production, that is a problem to fix after this incident. For now, be extra careful with your verification.

### Deploy with Monitoring

When you deploy to production, watch your monitoring dashboards actively for the first 15--30 minutes. Confirm that the error rate drops to zero (or to pre-incident levels). Confirm that performance metrics return to normal. Only then should you consider the issue resolved.

---

## Step 4: Prevent Recurrence

Fixing the bug is necessary but not sufficient. If you stop here, you have treated the symptom but not the disease.

### Write a Post-Incident Report

Document what happened, when, what the impact was, how you found the root cause, and what you did to fix it. This is not a blame exercise --- it is a learning exercise. The post-incident report should answer one critical question: what systemic change would prevent this class of bug from happening again?

### Implement Systemic Improvements

Based on your post-incident analysis, make changes to your process, tooling, or architecture:

- If the bug was caused by a missing validation, add input validation to your code review checklist.
- If the bug was caused by a deployment, improve your deployment pipeline with canary releases or automated rollback.
- If the bug was caused by a race condition, add concurrency tests to your test suite.
- If the bug took too long to detect, improve your monitoring and alerting.

These improvements compound over time. Each incident makes your system more resilient, but only if you invest in prevention after each fix.

---

## Real-World Example

Consider a real scenario: users report that they cannot save changes to their documents. The save button appears to work (no error message), but when they reload the page, their changes are gone.

**Stabilize:** The old version of the save feature was working last week. Check deployment history --- a new deployment went out two days ago. But a full rollback would affect other features that are working correctly. Instead, investigate quickly since users are not losing existing data, only new changes.

**Systematic Debugging:**

1. **Gather evidence:** Check the API logs. The save endpoint is returning 200 OK. The database write logs show... no writes for the affected endpoint. Interesting.
2. **Binary search:** The request reaches the API handler (confirmed by logs). The handler calls the service layer. Does the service layer receive the data? Add a log statement. Yes, it does. Does the service layer call the repository? Add a log statement. Yes, it does. Does the repository execute the query? Add a log statement. No --- the repository returns early because a new validation check (added in the recent deployment) is rejecting the input silently.
3. **Root cause identified:** A new validation rule was added that rejects document content containing certain Unicode characters. The validation returns an error to the service layer, but the service layer swallows the error and returns success to the API handler. The API returns 200 OK to the client.

**Verify:** Write a regression test that saves a document containing the problematic Unicode characters and asserts that the save either succeeds or returns a meaningful error. Fix the service layer to propagate the validation error. Fix the validation rule to handle Unicode correctly. Run the test. Green.

**Prevent:** The post-incident analysis reveals two systemic issues. First, the service layer should never swallow errors silently. Add a linting rule that flags empty catch blocks. Second, validation changes should include tests with diverse input data, including Unicode. Add this to the code review checklist.

Total debugging time with the systematic approach: 35 minutes. Estimated time without it: 2--4 hours of checking the frontend, the network layer, and the client-side cache before eventually looking at the API logs.

---

## Why This Combination Works

The debugging methodology in this guide follows the scientific method:

1. **Observe** (gather evidence during stabilization and investigation)
2. **Hypothesize** (form testable theories about the root cause)
3. **Experiment** (binary search and hypothesis testing)
4. **Conclude** (verify the fix with regression tests)
5. **Generalize** (prevent recurrence with systemic improvements)

The Systematic Debugging skill provides the investigative framework. The TDD skill provides the verification framework. Together, they turn debugging from a stressful, ad-hoc scramble into a calm, methodical process that produces reliable fixes and lasting improvements.

The most important shift is psychological. When you have a system, you do not panic. You follow the steps. Each step produces information. The information leads you to the answer. Every time.
