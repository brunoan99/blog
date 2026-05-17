# Review TODO — `refactor/animation-performance`

Priority focus: `src/ui/animations/data-structures`

## Critical (must fix before merge)

### 1) Crashes on unsupported click targets (fragile event handling)
- **File:** `src/ui/animations/data-structures/dynamicMemAnim.ts:57-76`, `src/ui/animations/data-structures/dynamicMemAnim.ts:115-136`
- **Snippet:**
  - Throws `Unknown target element` in default switch branches for unhandled tags.
- **Type:** Bug / edge case / resilience
- **Problem:** Valid DOM clicks on unlisted elements can throw.
- **Impact:** Runtime exception; interaction may break and leave UI blocked.
- **Fix:** Resolve target via `closest(...)` and ignore non-actionable clicks instead of throwing.

### 2) Missing error-safe reset for animation lock
- **File:** `src/ui/animations/data-structures/anim-dynamic-memory.astro:171-259`
- **Snippet:**
  - `animationBlock.set(true)` and cursor set to `wait` before async logic, but no `try/finally`.
- **Type:** Bug / reliability
- **Problem:** If any operation throws, cleanup is skipped.
- **Impact:** UI can remain stuck with blocked interactions.
- **Fix:** Wrap handler body in `try/finally` and always restore cursor + block flag.

### 3) Out-of-bounds animation index risk
- **File:** `src/ui/animations/data-structures/nonLinearSequenceAnim.ts:101-123`
- **Snippet:**
  - Hardcoded `sequenceOfAnimations` indexes into `elementsToAnimate` without bounds checks.
- **Type:** Bug / edge case
- **Problem:** Structure changes can make indexes invalid.
- **Impact:** Runtime `undefined` access and animation crash.
- **Fix:** Guard `if (!element) continue;` and/or derive sequence from actual graph structure.

### 4) Cursor can move to invalid position (-1)
- **File:** `src/ui/animations/data-structures/anim-static-memory.astro:126-143`
- **Snippet:**
  - `nextSpot = findIndex(...) || 0`
- **Type:** Bug / edge case
- **Problem:** `-1` is truthy, so fallback to `0` does not occur.
- **Impact:** Incorrect cursor movement/state and confusing UX.
- **Fix:** Use explicit check: `nextSpot = idx === -1 ? 0 : idx`.

## Important (should fix)

### 5) Input validation allows empty/NaN flow
- **File:** `src/ui/animations/data-structures/anim-comparison-linear-non-linear.astro:174-183`
- **Snippet:**
  - `parseInt(inputElem.value)` passed directly to animation timeline.
- **Type:** Edge case / bug
- **Problem:** Empty or invalid input becomes `NaN`.
- **Impact:** Unexpected behavior and inconsistent “found/not found” flow.
- **Fix:** Validate with `Number.isInteger(...)` and range check before running animation.

### 6) Repeated O(n) lookup for known-index removals
- **File:** `src/ui/animations/data-structures/dynamicMemAnim.ts:244`
- **Snippet:**
  - `elements.nodes = elements.nodes.filter(...)`
- **Type:** Performance / data-structure usage
- **Problem:** Rebuilds array for single-index removal.
- **Impact:** Unnecessary allocations and linear scans in frequent operations.
- **Fix:** Use `elements.nodes.splice(nodeIndex, 1)`.

### 7) Dead/unused helper
- **File:** `src/ui/animations/data-structures/anim-dynamic-memory.astro:117-120`
- **Snippet:**
  - `const logStores = () => { ... }` never called.
- **Type:** Dead code
- **Impact:** Noise and maintenance overhead.
- **Fix:** Remove or gate behind explicit dev-debug mode.

### 8) Over-broad config objects with unused fields
- **Files:** multiple under `src/ui/animations/data-structures/*`
- **Type:** Readability / maintainability
- **Problem:** `Sizes` contracts include fields not consumed by all functions.
- **Impact:** Higher cognitive load and stale coupling.
- **Fix:** Split into narrower interfaces passed per function responsibility.

### 9) Brittle ID parsing for index
- **File:** `src/ui/animations/data-structures/anim-static-memory.astro:148`
- **Snippet:**
  - `parseInt(node.id.charAt(node.id.length - 1)) - 1`
- **Type:** Bug risk / maintainability
- **Problem:** Breaks with 2+ digit IDs or naming changes.
- **Impact:** Wrong index updates and state corruption risk.
- **Fix:** Use `data-index` attributes.

### 10) Repeated DOM queries in update paths
- **Files:**
  - `src/ui/animations/data-structures/utils/HtmlElement.ts:1-3`
  - `src/ui/animations/data-structures/dynamicMemAnim.ts:218-219`, `261-263`
- **Type:** Performance / design
- **Problem:** Frequent `querySelector` lookups for elements already tracked.
- **Impact:** Extra overhead and stronger ID coupling.
- **Fix:** Keep references/maps and pass nodes directly.

### 11) Redundant style assignments
- **File:** `src/ui/animations/data-structures/utils/NodeWithTwoPointers.ts:42-49`
- **Snippet:**
  - `elem.style.display = "flex"` assigned twice.
- **Type:** Readability / redundancy
- **Impact:** Low but increases noise and hides accidental overrides.
- **Fix:** Remove duplicate assignment.

## Minor (nice to have)

### 12) Inconsistent equality style (`==` vs `===`)
- **Files:** multiple in `data-structures` TS files
- **Type:** Consistency / readability
- **Problem:** Mixed equality operators.
- **Impact:** Low now, future coercion bugs possible.
- **Fix:** Standardize on strict equality.

### 13) Duplicated animation/interleave patterns
- **Files:**
  - `src/ui/animations/data-structures/linearSequenceAnim.ts`
  - `src/ui/animations/data-structures/nonLinearSequenceAnim.ts`
  - `src/ui/animations/data-structures/comparisonLinearNonLinearAnim.ts`
- **Type:** Maintainability / refactor opportunity
- **Problem:** Similar timeline logic repeated.
- **Impact:** Fixes/features must be repeated in multiple places.
- **Fix:** Extract reusable timeline helper and sequence strategy.

### 14) `createElem` skips explicit empty string values
- **File:** `src/ui/animations/data-structures/utils/HtmlElement.ts:16`
- **Snippet:**
  - `if (props.innerValue) ...`
- **Type:** Edge case
- **Problem:** `""` is intentionally valid but treated as absent.
- **Impact:** Low semantic mismatch.
- **Fix:** Check `props.innerValue !== undefined`.

## Confirmed Good / Correct
- `dynamicMemAnim.ts:311-362` canvas grow/shrink behavior is sensible and includes lower bound guard.
- `comparisonLinearNonLinearAnim.ts:304-314` generic `interleave` implementation is correct.
- `utils/Arrows.ts:252-307` vector-based arrow creation between points is appropriate and flexible.
- Nanostore usage is straightforward and readable for page-local state flags.

## Overall quality summary
- The feature branch has solid educational animation intent and generally clear structure, but includes several high-risk edge-case failures around event handling, async lock cleanup, and hardcoded animation index assumptions.

## Merge recommendation
- **Request Changes**
- **Reason:** Critical runtime-resilience issues should be resolved before merge to avoid interaction-breaking behavior in production.
