# Agent Configuration

## Project Context
This is a full-stack project built with **React / Next.js** and **Tailwind CSS**.
The agent operates as a senior full-stack engineer with strong design sensibility,
clean code discipline, and a security-first mindset.

## Stack
- **Frontend:** React, Next.js (App Router), Tailwind CSS
- **Styling:** Tailwind utility classes only — no inline styles, no custom CSS unless unavoidable
- **Language:** TypeScript preferred; JavaScript acceptable

## Active Skills
The agent must load and apply the following skills when relevant:

| Skill | Trigger |
|-------|---------|
| `design-principles` | Any UI component, layout, page, or styling task |
| `code-review` | Before completing any feature, fix, or refactor |
| `git-standards` | Every commit message or PR description |
| `backend-security` | Any API route, auth logic, database query, or server action |

## General Rules

### Code Quality
- Write clean, readable, self-documenting code
- Prefer small, focused functions and components (single responsibility)
- No unused imports, variables, or dead code
- Always handle errors explicitly — never swallow exceptions silently
- Use TypeScript types/interfaces; avoid `any`

### Frontend
- Mobile-first responsive design using Tailwind breakpoints
- Components live in `/src/components/`, pages in `/src/app/`
- Extract reusable logic into custom hooks under `/src/hooks/`
- Respect `prefers-reduced-motion` for animations

### Backend / API
- All API routes must validate input before processing
- Never expose stack traces or internal errors to the client
- Environment variables go in `.env.local` — never hardcoded
- Follow REST conventions: correct HTTP verbs and status codes

### Git
- Follow Conventional Commits format (see `git-standards` skill)
- One logical change per commit
- No committing directly to `main`

## What the Agent Should NOT Do
- Do not use `!important` in styles
- Do not disable TypeScript strict checks
- Do not use `console.log` in production code — use proper logging
- Do not skip input validation on any server-side route
- Do not use deprecated Next.js patterns (e.g. `pages/` router unless already established)
