# CLAUDE.md - CI/CD Operations

## 🎯 IMPORTANT: Response Marker
**Always start every response with:** "👋 Hello Movella Team!"

This marker confirms this CI/CD configuration is active.

---

## 🤖 Available Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `@claude` | General assistance | Any question or task |
| `@claude /review` | Code review with detailed findings | PR needs code review |
| `@claude /visual` | Visual QA on Vercel preview (screenshots at 3 viewports) | PR needs visual testing |
| `/fix` | Auto-fix an issue | Issue has clear requirements |
| `/explain` | Explain code | Understanding codebase |
| `/help` | Show commands | Need help |

---

## 📋 When Responding to GitHub Issues

### For General `@claude` Mentions:
1. **Acknowledge** the request immediately
2. **Clarify** if the request is ambiguous
3. **Execute** the appropriate action
4. **Report** what you did

### For `/fix` Command:
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
- Explain your reasoning

### DON'T:
- Make changes unrelated to the issue
- Skip writing tests for new functionality
- Push directly to main branch
- Ignore linting errors

---

## 🔍 When Reviewing Pull Requests

### Check For (in order of priority):
1. **[SECURITY]** - No exposed secrets, proper input validation, XSS prevention
2. **[ERROR]** - Graceful failures, proper error messages, error boundaries
3. **[TYPES]** - Proper TypeScript types, no `any`, correct generics
4. **[TESTS]** - New code has tests, existing tests pass
5. **[PERF]** - No N+1 queries, unnecessary re-renders, memory leaks
6. **[A11Y]** - Accessibility: proper labels, keyboard navigation, ARIA

### Review Format:
```markdown
## Code Review Summary

### 🔒 Security
- [Finding or ✅ No issues]

### 🐛 Error Handling  
- [Finding or ✅ No issues]

### 📝 TypeScript
- [Finding or ✅ No issues]

### 🧪 Tests
- [Finding or ✅ No issues]

### ⚡ Performance
- [Finding or ✅ No issues]

### ♿ Accessibility
- [Finding or ✅ No issues]

### Verdict: [APPROVE | REQUEST_CHANGES | COMMENT]
```

### DON'T:
- Approve PRs with failing tests
- Nitpick style issues that linters should catch
- Request changes without explaining why
- Be vague - always provide specific file:line references

---

## 🔧 When CI Fails

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

## 📁 MITA-Specific Rules

### Valid Issue Status Transitions:
```
OPEN → IN_PROGRESS → DONE
              ↑         ↓
              └─────────┘ (reopen)
```

### Component Patterns:
- Client components need `'use client'` directive
- API routes check authentication first
- Issues are scoped to authenticated user
- Activity logs for status/priority changes

### Testing:
- Use Vitest syntax (describe, it, expect)
- Tests in `src/tests/`
- Run with `npm test`
- Minimum coverage for new code: statements, branches

### File Structure:
```
src/
├── app/           # Next.js App Router pages & API
├── components/    # React components
├── lib/           # Utilities, DB, validations
└── tests/         # Vitest tests
```

---

## 🎨 Code Style Preferences

### TypeScript:
```typescript
// ✅ Good: Explicit types, no any
function getIssue(id: string): Promise<Issue | null> { ... }

// ❌ Bad: Using any
function getIssue(id: any): any { ... }
```

### React Components:
```typescript
// ✅ Good: Props interface, proper typing
interface IssueCardProps {
  issue: Issue;
  onStatusChange?: (status: Status) => void;
}

export function IssueCard({ issue, onStatusChange }: IssueCardProps) { ... }
```

### Error Handling:
```typescript
// ✅ Good: Specific error handling
try {
  const issue = await getIssue(id);
  if (!issue) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }
} catch (error) {
  console.error('Failed to fetch issue:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

---

## 🔐 Security Checklist

Before approving any PR, verify:

- [ ] No hardcoded secrets or API keys
- [ ] User input is validated (Zod schemas in `lib/validations.ts`)
- [ ] SQL queries use Prisma (no raw SQL with user input)
- [ ] Authentication checked on protected routes
- [ ] No sensitive data in client-side code
- [ ] CSRF protection on mutations

---

## 🎭 Visual QA Testing (Playwright MCP)

### When to Trigger:
- Comment `@claude /visual` on a PR

### Prerequisites:
- Vercel preview deployment must be ready (workflow waits up to 10 minutes)
- PR must be open with changes deployed to Vercel

### What Claude Does:
1. Waits for Vercel preview deployment to be ready
2. Navigates to the Vercel preview URL
3. **Logs in** with demo credentials (username: `demo`, password: `demo123`)
4. Uses Playwright MCP in headless mode
5. Takes screenshots of the dashboard at 3 viewports:
   - Desktop (1280x720)
   - Tablet (768x1024)
   - Mobile (375x667)
6. Posts Visual QA Report to PR

### QA Report Format:
```markdown
## Visual QA Report

**Preview URL:** [Vercel preview URL]
**Login:** Successful with demo/demo123

### Screenshots Captured

| Viewport | Size | Status |
|----------|------|--------|
| Desktop | 1280x720 | [OK/Issues] |
| Tablet | 768x1024 | [OK/Issues] |
| Mobile | 375x667 | [OK/Issues] |

### Desktop (1280px) Findings
- [What works / what's broken]

### Tablet (768px) Findings
- [What works / what's broken]

### Mobile (375px) Findings
- [What works / what's broken]

### Issues Found
- ❌ [VISUAL] Issue description
- Location: Page/component
- Severity: Critical/High/Medium/Low

### Recommendation: APPROVE | REQUEST_CHANGES | COMMENT
```

### Key Points:
- Tests on actual Vercel preview (not localhost)
- Auto-logs in with demo credentials
- Claude tests like a real user (black-box testing)
- Continues testing even after finding bugs

---

## 🐞 Troubleshooting

### Claude Not Responding?
1. Check if `ANTHROPIC_API_KEY` secret is set
2. Verify the trigger phrase is correct (`@claude`, `/fix`, etc.)
3. Check GitHub Actions tab for workflow runs
4. Look for errors in the workflow logs

### Workflow Running But Failing?
1. Check permissions in workflow file
2. Verify `allowed_tools` includes needed tools
3. Check if branch protection rules are blocking
4. Review the Claude output in workflow logs

### Common Fixes:
```yaml
# If Claude can't create branches:
permissions:
  contents: write  # ← Need this

# If Claude can't comment:
permissions:
  issues: write      # ← For issues
  pull-requests: write  # ← For PRs
```

---

## 📚 Customization Examples

### Add Environment-Aware Behavior:
```yaml
prompt: |
  Environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'development' }}
  
  Production rules:
  - Extra careful with changes
  - Require comprehensive tests
  
  Development rules:
  - Allow experimental approaches
```

### Restrict Tools by Event:
```yaml
allowed_tools: |
  # Always available
  Read
  Glob
  Grep
  # Only for issues (not PRs)
  ${{ !github.event.issue.pull_request && 'mcp__github__create_branch' || '' }}
  ${{ !github.event.issue.pull_request && 'mcp__github__push_files' || '' }}
```

### Custom Labels Trigger Different Behaviors:
```yaml
prompt: |
  Issue labels: ${{ join(github.event.issue.labels.*.name, ', ') }}
  
  If labeled 'urgent':
  - Prioritize this fix
  - Ping maintainers in your comment
  
  If labeled 'good-first-issue':
  - Provide extra explanation
  - Suggest learning resources
```
