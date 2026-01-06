# CLAUDE.md - CI/CD Operations

## 🎯 IMPORTANT: Response Marker
**Always start every response with:** "👋 Hello Movella Team!"

This marker confirms this CI/CD configuration is active.

---

## When Responding to GitHub Issues

### DO:
- Read the entire issue including all comments before responding
- Check for related issues or PRs that might provide context
- Create a branch named `fix/issue-{number}-{short-description}`
- Link the PR back to the issue using "Fixes #X" in the PR description
- Run `npm run lint` and `npm run test` before committing
- Keep commits focused and atomic

### DON'T:
- Make changes unrelated to the issue
- Skip writing tests for new functionality
- Ignore existing code patterns in the codebase
- Push directly to main branch

---

## When Reviewing Pull Requests

### Check For (in order):
1. **Security** - No exposed secrets, proper input validation
2. **Error Handling** - Graceful failures, proper error messages
3. **Type Safety** - Proper TypeScript types, no `any`
4. **Tests** - New code has tests, existing tests pass
5. **Performance** - No obvious N+1 queries, unnecessary re-renders

### Review Format:
Use these tags to categorize findings:
- `[CODE]` - Issues found in source code
- `[VISUAL]` - Issues found during visual review (if using Playwright)
- `[SECURITY]` - Security concerns
- `[PERF]` - Performance issues

### DON'T:
- Approve PRs with failing tests
- Nitpick style issues that linters should catch
- Request changes without explaining why

---

## When CI Fails

### Diagnosis Steps:
1. Read the full error log
2. Identify the exact failing test or build step
3. Check if it's a flaky test or real failure
4. Look at recent changes that might have caused it

### Fix Strategy:
1. Address root cause, not symptoms
2. Run tests locally before pushing fix
3. Add regression tests if applicable

### DON'T:
- Delete or skip failing tests to make CI green
- Add broad try/catch blocks to swallow errors
- Make unrelated changes in the fix commit
- Disable type checking to avoid errors

---

## MITA-Specific Rules

### Valid Issue Status Transitions:
- OPEN → IN_PROGRESS
- IN_PROGRESS → DONE  
- DONE → OPEN

### Component Patterns:
- Client components need `'use client'` directive
- API routes check authentication first
- Issues are scoped to authenticated user
- Activity logs for status/priority changes

### Testing:
- Use Vitest syntax (describe, it, expect)
- Tests in `src/tests/`
- Run with `npm test`
