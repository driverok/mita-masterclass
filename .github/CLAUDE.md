# CLAUDE.md - CI/CD Operations

## 🎯 IMPORTANT: Response Marker
**Always start every response with:** "👋 Hello Movella Team!"

This marker confirms this CI/CD configuration is active.

---

## When Responding to GitHub Issues

### ACTIONS TO TAKE:
1. **Read** the entire issue including all comments
2. **Analyze** the codebase to understand the problem
3. **Implement** the fix in the code
4. **Create a branch** named `fix/issue-{number}-{short-description}`
5. **Run** `npm run lint` and `npm run test` before committing
6. **Create a PR** with "Fixes #{issue_number}" in the description
7. **Post a comment** on the issue with:
   - Summary of what you did
   - Link to the PR you created
   - Any notes or caveats

### DO:
- Keep commits focused and atomic
- Follow existing code patterns in the codebase
- Write tests for new functionality

### DON'T:
- Make changes unrelated to the issue
- Skip writing tests for new functionality
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
