# Authentication Bug Fix Report

**Date:** 2026-07-10  
**Milestone:** Authentication UI Bug Fix  
**Status:** ✅ COMPLETE — All 5 bugs fixed

---

## BUG #1 — Email Validation Removed ✅

**Root Cause:** `<input type="email">` triggered browser-level email validation requiring `@`.

**Fix:** Changed to `type="text"` with `autocomplete="username"`. Placeholder changed from "Enter your ID" to "Enter your username". Accepts any string (`admin`, `operator`, `guest`).

---

## BUG #2 — Form Disappears on Error ✅

**Root Cause:** Vue `v-else` directive on `<form>` was paired with `v-if="loginError"`, not `v-if="signedIn"`. When loginError was set, the error div rendered and the v-else form was hidden.

**Fix:** Restructured template:
```
<div v-if="signedIn">   ← success only
<form v-else>            ← form when NOT signed in
  <p v-if="loginError">  ← error inside form, below button
```
Form now only disappears on successful login.

---

## BUG #3 — Error Position Below Button ✅

**Fix:** Error message moved inside the form, below the submit button. Uses subtle red text styling — no alert(), no modal.

---

## BUG #4 — Shake Animation ✅

**Fix:** CSS `@keyframes shake` animation (300ms, ±4px amplitude). Applied via `.shake` class toggled on/off with 350ms timeout. Subtle horizontal shake — professional, not jarring.

---

## BUG #5 — Input Preservation ✅

**Fix:** On login failure:
- Username is preserved (bound via `v-model="username"`)
- Password is cleared (`password.value = ''`)
- Password input receives focus (`nextTick → passwordRef.value?.focus()`)

Matches modern auth UX (Apple, GitHub, Linear).

---

## Files Modified

| File | Bugs Fixed |
|------|-----------|
| `frontend/src/components/login/LoginCard.vue` | #1, #2, #3, #4, #5 |

## Build Verification

| Check | Result |
|-------|--------|
| `vue-tsc --noEmit` | ✅ Zero errors |
| `vite build` | ✅ 1.44s |
