# Design Review: Portfolio Projects Feature with Supabase Image Upload

**Design Document:** `/frontend/.agents/tasks/projects-feature/design.md`  
**Review Date:** 2026-11-07  
**Reviewer:** Kiro Design Review Agent  
**Status:** CHANGES_REQUESTED (4 HIGH findings, 1 MEDIUM finding)

---

## Verdict Summary

This design has **4 HIGH** and **1 MEDIUM** findings that must be resolved before implementation. The findings relate to:
1. Bucket name mismatch between design and codebase
2. Environment variable inconsistency and fallback logic
3. Conflicting status enum implementation approach
4. Missing VITE_SUPABASE_ANON_KEY in `.env`
5. SupabaseUploader component reuse assumption not verified

Once these are clarified and corrected, the design is implementable.

---

## Findings

### HIGH: Bucket Name Mismatch

**Problem:** The design specifies uploading images to the Supabase bucket named `"images"` (Section 1: "bucket: 'images'"). However, the existing `SupabaseUploader.jsx` component (line 11) uses `BUCKET_NAME = "portfolio-projects"`.

**Location:** Design Section 1 ("Image Upload & Cover-Image Selection") vs. actual codebase at `src/components/SupabaseUploader.jsx:11`

**Impact:** If both upload systems try to use different buckets, uploaded images will be stored in different locations, creating confusion and potential orphaned files. The admin form will upload to one bucket; any legacy uploader uses another.

**Concrete Fix:** Choose one bucket consistently:
- **Option A (RECOMMENDED):** Update design to use `"portfolio-projects"` (matches existing SupabaseUploader). Change design Section 1 to read: "bucket: 'portfolio-projects'" and update the API contracts in Section 7 if any hardcoded bucket references exist.
- **Option B:** Rename the SupabaseUploader bucket constant to `"images"` to match design, then verify no other code references the old bucket name. Requires `SupabaseUploader.jsx:11` change: `const BUCKET_NAME = "images";`

**Recommendation:** Choose Option A (use existing bucket name) to avoid breaking the existing uploader and to maintain consistency with what's already running.

---

### HIGH: Environment Variable Name Conflict & Fallback Assumption

**Problem:** The design states (Section 1, Env Fix): "Add `VITE_SUPABASE_ANON_KEY=<same value as VITE_SUPABASE_KEY>` to `.env`." However, the real `.env` file already defines `VITE_SUPABASE_KEY` (verified). The existing `mediaUpload.jsx` (line 2) reads `VITE_SUPABASE_ANON_KEY`, which does NOT exist in `.env`.

**Location:** `.env` (line 5: `VITE_SUPABASE_KEY` exists; `VITE_SUPABASE_ANON_KEY` does NOT exist) vs. design Section 1 ("Env Fix")

**Current Codebase State:**
- `.env` has: `VITE_SUPABASE_KEY=eyJ...`
- `mediaUpload.jsx` reads: `import.meta.env.VITE_SUPABASE_ANON_KEY` (undefined at runtime)
- `SupabaseUploader.jsx` reads: `import.meta.env.VITE_SUPABASE_ANON_KEY` (line 8, also undefined)

**Impact:** Both `mediaUpload.jsx` and `SupabaseUploader.jsx` will fail at initialization because `VITE_SUPABASE_ANON_KEY` is undefined, triggering the error check at line 11-13 of `mediaUpload.jsx` and line 5-7 of `SupabaseUploader.jsx`.

**Concrete Fix:**
1. **Add the missing env variable to `.env`:**
   ```
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ndGFva2hhcXNsdmt6bGd0cXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTMyNzcsImV4cCI6MjEwNDg2OTI3N30.RSt6NSMuwA-8c9hEq1YE-VqQRQbk8Mnz15-uYDSNmAo
   ```
   (Use the same value as `VITE_SUPABASE_KEY` since anon key = public key in Supabase)

2. **Verify both utilities read correctly:** After adding the env var, both `mediaUpload.jsx` and `SupabaseUploader.jsx` will initialize without error.

**Note:** The design correctly identified this issue in Section 1 ("RESOLVED") but **the fix has not been applied to the actual `.env` file**. This is a prerequisite before any frontend code runs.

---

### HIGH: Status Enum Replacement Ambiguity

**Problem:** The design (Section 3) claims the status enum was "COMPLETELY REPLACED" with `["draft", "published"]` to replace the existing `["Active", "Completed", "In Progress"]`. However, the real backend `models/projects.js` (lines 64-72) STILL contains the old enum:

```javascript
status: {
  type: String,
  enum: [
    "Active",
    "Completed",
    "In Progress",
  ],
  default: "Completed",
},
```

**Location:** Design Section 3 ("Status Enum Mismatch — RESOLVED") vs. `backend/models/projects.js:64-72`

**Impact:** If implementation attempts to save a project with `status: "draft"` or `status: "published"`, Mongoose will reject it due to enum validation. All create/update operations via the API will fail with a validation error like: `"draft" is not a valid enum value`.

**Root Cause:** The design document was written assuming the model would be updated, but the update was never actually performed on the real schema.

**Concrete Fix:** Update the backend Project model schema. Modify `backend/models/projects.js` lines 64-72:

```javascript
status: {
  type: String,
  enum: ["draft", "published"],
  default: "draft",
},
```

**Additional Step (Data Migration):** After updating the schema, all existing projects with old status values (`"Active"`, `"Completed"`, `"In Progress"`) must be migrated. Design Section 3 states: "all existing projects will be migrated to `status: "published"`". **This migration must be run as a one-time script before deployment** or added to the backend initialization.

Example migration (to run once, e.g., in `backend/migrations/migrateProjectStatus.js`):
```javascript
import Project from "../models/projects.js";

export async function migrateProjectStatus() {
  try {
    const result = await Project.updateMany(
      { status: { $in: ["Active", "Completed", "In Progress"] } },
      { $set: { status: "published" } }
    );
    console.log(`Migrated ${result.modifiedCount} projects to status: "published"`);
  } catch (error) {
    console.error("Migration failed:", error.message);
  }
}
```

---

### HIGH: Public Endpoint Filtering Not Actually Implemented

**Problem:** The design (Section 3) states: "**ADDRESSING HIGH FINDING #3:** Filter to return only `{ status: "published" }` projects" and provides a code snippet showing the filter. However, the actual `backend/controllers/projectController.js` (lines 3-15, `getProjects` function) does **NOT** include this filter:

```javascript
export const getProjects = async (req, res) => {
  try {
    const projects = await Project
      .find()  // <-- NO FILTER; returns ALL projects including drafts
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Location:** Design Section 3 (code snippet proposing the filter) vs. `backend/controllers/projectController.js:3-15`

**Impact:** All projects (including drafts) are returned to users on the public `/projects` endpoint. Drafts are **NOT hidden** as intended. This means admin work-in-progress projects are visible to the public, defeating the draft/published distinction.

**Concrete Fix:** Update `backend/controllers/projectController.js` lines 3-15:

```javascript
export const getProjects = async (req, res) => {
  try {
    const projects = await Project
      .find({ status: "published" })  // <-- ADD THIS FILTER
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

Alternatively, update `getFeaturedProjects` (lines 20-31) to also filter by status:

```javascript
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project
      .find({ featured: true, status: "published" })  // <-- ADD status filter
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

### MEDIUM: SupabaseUploader Component Reuse Assumption Not Verified

**Problem:** The design (Section 2) states: "Create a new reusable `ImageUploader` component that wraps mediaUpload... The component is isolated and reusable across the app if other features need image uploads later." However, the codebase already has a `SupabaseUploader.jsx` component (verified in `src/components/SupabaseUploader.jsx`). The design does not clarify the relationship between the proposed new `ImageUploader` and the existing `SupabaseUploader`.

**Location:** Design Section 2 ("File to Create: `src/components/ImageUploader.jsx`") + Files to Modify list

**Current Codebase Evidence:**
- `SupabaseUploader.jsx` (lines 11+) already exists and:
  - Manages multi-file upload state
  - Shows previews
  - Displays progress bars
  - Handles drag-and-drop
  - Returns array of URLs via `onUploadComplete` callback
- `ProjectsPage.jsx` (line 8) already imports and uses `SupabaseUploader`:
  - `import SupabaseUploader from "../../components/SupabaseUploader";`
  - Line 123-128 renders the component within the form

**Ambiguity:** The design proposes creating a **new** `ImageUploader.jsx` component, but the required functionality already exists in `SupabaseUploader.jsx`. The design does not address whether to:
1. **Extend/Refactor** the existing `SupabaseUploader` to match design specs?
2. **Create a new** `ImageUploader` and deprecate/replace `SupabaseUploader`?
3. **Reuse** `SupabaseUploader` as-is instead of creating a new component?

**Impact:** If implementation creates a duplicate `ImageUploader`, code maintenance becomes harder and two similar components will diverge. If the existing `SupabaseUploader` is ignored, the ProjectsPage (which already uses it) will need rework.

**Concrete Fix:** Clarify and choose one path:

**Option A (RECOMMENDED - Minimal Changes):** Reuse the existing `SupabaseUploader` component. Update the design to:
- Remove "File to Create: `src/components/ImageUploader.jsx`"
- Change Section 2 to: "The existing `SupabaseUploader.jsx` component already provides batch upload, previews, and progress tracking. No new component needed. Enhance ProjectFormModal to integrate with SupabaseUploader."
- The ProjectFormModal (new) will pass `onUploadComplete` and `previewImages` to `SupabaseUploader`, matching the existing props (verified in ProjectsPage usage).

**Option B:** Create the new `ImageUploader` as a wrapper/enhancement around `SupabaseUploader` for consistency with design intent. Update the design to explain that `ImageUploader` wraps or extends `SupabaseUploader`.

**Recommendation:** Choose Option A. The existing `SupabaseUploader` is already feature-complete for the requirements (batch upload, previews, cover image auto-selection via first-image badge). Reusing it avoids duplication and keeps the codebase simpler. The design's core concepts (batch upload, cover-image selection, progress tracking) are already implemented.

---

## Verified Assumptions

✅ **Supabase Credentials Provided:** `.env` contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`.

✅ **Admin Auth Flow Exists:** `adminService.js` provides `getAdminProjects`, `createAdminProject`, `updateAdminProject`, `deleteAdminProject` functions with JWT bearer token handling.

✅ **Project Model Has Backward Compatibility Fields:** Backend model includes both legacy `image` field (line 22-26) and new `images[]` + `coverImage` fields (lines 29-46). Pre-save hooks auto-set `coverImage` (lines 64-71).

✅ **Admin Routes Protected:** `projectRoutes.js` (lines 23-35) uses `protect` and `adminOnly` middleware on POST/PUT/DELETE endpoints. Public GET endpoints are accessible.

✅ **ProjectsPage Structure in Place:** `ProjectsPage.jsx` already has create/edit/delete forms, modal support via `AdminModal`, and `SupabaseUploader` integration.

✅ **Route Structure Correct:** `App.jsx` confirms `/admin` routes exist and are protected, matching design expectations.

✅ **Context Available:** `authContext.jsx` provides admin auth context (token, isAdmin), usable for protected operations.

---

## Unverified / Wrong Assumptions

❌ **WRONG: mediaUpload.jsx Env Variable Setup**  
Design assumed `VITE_SUPABASE_ANON_KEY` was already in `.env`, but it is not. This is a runtime blocker.

❌ **WRONG: Status Enum Already Migrated**  
Design assumed backend model was updated to use `["draft", "published"]`, but the schema still uses the old enum. Enum validation will fail at save time.

❌ **WRONG: Public Endpoint Already Filters by Status**  
Design assumed the filter was implemented, but `getProjects` in projectController.js returns all projects unfiltered.

❌ **WRONG: ImageUploader is a New Component**  
Design proposes creating a new `ImageUploader.jsx`, but `SupabaseUploader.jsx` already provides the same functionality. Duplication risk.

❌ **UNVERIFIED: Bucket "images" Exists in Supabase**  
Design mentions uploading to bucket `"images"`, but actual code uses `"portfolio-projects"`. No verification that either bucket exists or is configured correctly. **Note:** If neither bucket exists, uploads will fail with a 404 error from Supabase.

---

## Summary of Changes Required Before Implementation

### Backend
1. **Update Project model schema** (`models/projects.js:64-72`): Replace status enum with `["draft", "published"]`.
2. **Run migration script:** Update all existing projects with old status values to `status: "published"`.
3. **Add status filter to public endpoint** (`controllers/projectController.js:3-15`): Add `.find({ status: "published" })`.

### Frontend
1. **Add missing env variable** (`.env`): Add `VITE_SUPABASE_ANON_KEY` with the same value as `VITE_SUPABASE_KEY`.
2. **Update design or codebase** for bucket consistency: Either change design to use `"portfolio-projects"` OR update `SupabaseUploader.jsx` to use `"images"`.
3. **Clarify ImageUploader approach:** Decide whether to reuse `SupabaseUploader` or create a new `ImageUploader` component. Update design accordingly.

---

## Next Steps

1. **Fix all 4 HIGH findings:** These are hard blockers. Implementation cannot proceed until resolved.
2. **Resolve the 1 MEDIUM finding:** Choose the ImageUploader strategy and update design/code.
3. **Re-run design review** after changes to confirm findings are closed.
4. **Install Framer Motion dependency** (already flagged in design Section 6): `npm install framer-motion@^11.0.0` before Phase 7 animation work.
5. **Begin implementation** once all findings are cleared and the status is APPROVED.

---

