# Agent Tiers

This file defines practical tier guidance for Ralph-style execution in this repository.

## LOW

Use for:

- file discovery
- exact symbol lookup
- simple type export or path confirmation
- narrow read-only questions

Recommended agent types:

- `explore`
- `analyst`

## STANDARD

Use for:

- normal feature implementation in one module slice
- test creation for a defined behavior
- refactors with bounded write scope
- verification of standard code changes

Recommended agent types:

- `executor`
- `test-engineer`
- `architect`
- `verifier`

## THOROUGH

Use for:

- multi-system integration
- authentication, sync, persistence, or schema changes
- high-risk refactors
- final architectural sign-off for overnight execution waves

Recommended agent types:

- `architect`
- `executor`
- `critic`
- `security-reviewer`
- `verifier`

## Guidance For This Repo

For the first family-app overnight wave:

- implementation lane: `executor` at STANDARD
- test lane: `test-engineer` at STANDARD
- integration/data-risk lane: `architect` at THOROUGH
- final verification lane: `verifier` at STANDARD or THOROUGH depending on diff size
