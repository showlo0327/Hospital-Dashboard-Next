# CODING_RULES

## Sources of Truth

- Prototype (`design/prototype/`) is visual source of truth
- Product spec (`docs/PRODUCT_SPEC.md`) is business source of truth
- Do not use exported React directly — implement in Vue 3

## Permanent Project Rules

### 1. Reuse Before Building
Every new UI must first determine whether an existing component can be reused.
Search the component tree before creating anything new.

### 2. No Duplicate Components
Never create duplicate components with similar responsibilities.
One component = one responsibility. If two components overlap, merge them.

### 3. Promote to Base Before Extending
If a component is likely to be used by two or more pages, convert it into a
reusable base component before implementing the next feature.
Pattern: `BaseComponent` → specializations via props/slots.

### 4. UI Components Must Be Pure
Business logic must never exist inside reusable UI components.
Data fetching, state mutations, and API calls belong in composables, stores, or services.
UI components receive data via props and emit events.

### 5. Configurable Over Hardcoded
Every reusable component must remain generic and configurable through:
- **Props** — type-safe interface with sensible defaults
- **Emits** — typed event signatures for parent communication
- **Slots** — named slots for content injection and extension

### 6. Documentation Synchronized
Documentation must always be updated together with implementation.
Never merge code without corresponding doc updates.

### 7. Module Completion Checklist
Every completed module must:
- Update `CHANGELOG.md`
- Generate a Development Report in `DEVELOPMENT_REPORT.md`
- Rate Component Maturity for every new component
- Update `COMPONENT_SPEC.md` with status changes

## Implementation Rules

1. One feature per implementation cycle
2. Never redesign UI — match prototype pixel-perfect
3. All layout dimensions via design tokens, never hardcoded
4. TypeScript strict mode — no `any` without justification
5. No dead code — remove unused imports and files

## Reusable Component Contract

Every reusable component must document:

- **Props** — Type-safe interface with defaults
- **Emits** — Typed event signatures
- **Slots** — Named slots with purpose descriptions
- **Accessibility** — Semantic HTML, visible/accessible labels
- **Design Tokens Used** — List of CSS custom properties consumed
- **Future Extension Notes** — How to extend without breaking changes
- **JSDoc Comments** — Inline documentation for component purpose

## Component Maturity

| Rating | Criteria |
|---|---|
| **Experimental** | Prototype quality, may change API, not for reuse |
| **Stable** | API stable, typed, reusable, may lack full coverage |
| **Production Ready** | Reusable, no known issues, mock-data covered, API-ready |


Never allow frontend components to access backend endpoints directly.

All HTTP communication must go through the frontend Service Layer.

Vue Component
        ↓
Frontend Service
        ↓
Backend API
        ↓
Backend Service
        ↓
Repository

## Quality Gates

- ✅ Pixel-perfect against prototype
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Type-safe (no TypeScript errors)
- ✅ No duplicated component logic
- ✅ Design tokens used consistently
- ✅ Documentation synchronized
- ✅ Component Maturity rated
- ✅ Component contract documented (props, emits, slots)

---

## Configuration Rule (v2.10.0)

**Never hardcode operational parameters.** Every tunable value must live in `system_config.json` and be accessed through `system_config` (singleton from `core/config.py`).

### What goes in system_config.json

| Domain | Examples |
|---|---|
| Ping | history_size, thresholds, worker_count, intervals, timeout, ttl, enabled |
| CSV | max_file_size, encodings, default_encoding |
| SNMP | port, community, timeout, retries, scan_interval |
| UI | auto_refresh, default_view |

### How to use

```python
from app.core.config import system_config

# Read at startup
cfg = system_config.ping
workers = cfg.worker_count

# Dynamic reload (e.g. after Settings page update)
system_config.reload()
```

### Future Settings page

The Settings page will write to `system_config.json` via a `PUT /api/system/config` endpoint. All backend services re-read config at natural boundaries (e.g. start of each scan cycle) — no restart required.

---

## API Integration Rules (v2.11.0)

### Layer isolation

```
Component → Store → Service → API Client → Backend
```

- **Components** may only call composables and stores — never `fetch()`, never services.
- **Stores** may only call services — never `apiClient` directly.
- **Services** may only call `apiClient` — the only layer allowed to make HTTP calls.
- **API Client** (`api/client.ts`) is the sole module that calls `fetch()`.

### Mock/Backend switch

Every store and service supports both modes via `DATA_MODE`:

```typescript
import { DATA_MODE } from '@/types/api'

if (DATA_MODE === 'mock') {
  // synchronous mock repository
} else {
  // async backend service
}
```

### Never bypass the stack

```typescript
// ❌ WRONG — component calls service directly
const devices = await deviceService.getAll()

// ❌ WRONG — component calls fetch directly
const res = await fetch('/api/devices')

// ✅ CORRECT — component uses store
const store = useDeviceStore()
await store.fetchAll()
// store.devices is reactive
```
