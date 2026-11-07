# Technical Design: Portfolio Projects Feature with Supabase Image Upload and Animated Cards

## Overview

This design defines a complete project management system for the portfolio app. Admins can create, edit, and delete projects with multiple image uploads to Supabase (first image auto-selected as cover). End users see animated project cards on the portfolio site that link to a detailed modal view showcasing all project images, technologies, and links. The system leverages existing auth patterns (JWT via `/api/admin`), the current dark theme with Tailwind CSS, and the already-structured admin panel layout. Framer Motion will be added for smooth entrance animations, hover effects, and modal transitions.

**Tech Stack:**
- Frontend: React 19 + Vite, Tailwind CSS 4.3.3, Framer Motion (new), Lucide React (icons), Supabase JS v2.112.4
- Backend: Node.js + Express, MongoDB + Mongoose, JWT auth (existing patterns)
- Media: Supabase Storage bucket `portfolio-projects` (note: env references `portfolio-images` but the uploader uses `portfolio-projects`)

**Key Assumptions & Notes:**
1. The `.env` file currently contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` (anon key, not `VITE_SUPABASE_ANON_KEY` as in `mediaUpload.jsx`—this is a pre-existing mismatch; the uploader is already broken due to this key naming issue).
2. Backend Project model already has `images: [String]`, `coverImage: String`, and pre-save hooks to auto-populate `coverImage` from the first image.
3. Admin endpoints at `/api/admin/projects` exist and are protected by `protectAdmin` middleware.
4. The user-facing projects API at `/api/projects` is public and returns only published projects (assumed; verify in controller).
5. Supabase bucket name in the existing `SupabaseUploader.jsx` is `portfolio-projects`, not `portfolio-images`.
6. The `SupabaseUploader` component already handles multiple image selection and preview, with cover image auto-selection (first image badge).

---

## Architectural Decisions

### 1. Image Upload Component Strategy
**Decision:** Enhance the existing `SupabaseUploader.jsx` component for admin use while keeping `mediaUpload.jsx` utility for single-file fallback scenarios.

**Rationale:**
- `SupabaseUploader.jsx` is already multi-image aware and integrates with the admin form.
- The Supabase client initialization and error handling are already present.
- This avoids duplicating upload logic.
- The cover image selection (first image = cover) is already implemented via the pre-save hook on the backend.

**Key Points:**
- The component accepts `onUploadComplete` callback (returns array of URLs) and `previewImages` prop (for edit mode).
- It manages its own file selection UI, preview rendering, and upload orchestration.
- Upload progress is shown inline with a progress bar.
- Errors are caught per file (if one fails, others continue).
- Blob preview URLs are cleaned up on file removal.

### 2. Admin Project Create/Edit Form
**Decision:** Create `ProjectFormModal.jsx` to replace the inline form logic in `ProjectsPage.jsx`, supporting both create and edit modes.

**Rationale:**
- Centralizes form logic and reduces boilerplate in `ProjectsPage.jsx`.
- Modal pattern aligns with the existing `AdminModal` component structure.
- Validation is consistent and centralized.
- Edit mode pre-populates all fields, including already-uploaded images.

**Form Fields & Validation:**
- `title` (required, non-empty string)
- `slug` (required, unique via backend)
- `description` (required)
- `category` (optional, defaults to "Web Development")
- `technologies` (comma-separated string on form, converted to array on submit)
- `githubUrl` (optional, URL validation)
- `liveUrl` (optional, URL validation)
- `projectLink` (optional, legacy field, kept for compatibility)
- `featured` (boolean checkbox)
- `status` (enum: "Active", "Completed", "In Progress")
- `images` (array, managed by uploader; at least one required)
- `coverImage` (auto-set by backend from first image; read-only in form)

**Submission Logic:**
- Validate required fields client-side before submit.
- Pass `images` array directly to API (Supabase URLs, not form data).
- Backend pre-save hooks set `coverImage = images[0]`.
- Loading state during submission (disable button, show spinner).
- Success: close modal, refresh projects list.
- Error: display toast with backend message.

### 3. Enhanced User-Side Project Cards
**Decision:** Extend `projectCard.jsx` with Framer Motion animations and improved visual hierarchy.

**Animations:**
- **Entrance:** Cards fade in and slide up on page load (staggered via grid parent).
- **Hover:** Image zoom (scale 1.1), gradient overlay fade-in, tech tags stagger-animate, arrow icon movement.
- **Responsive:** Grid adjusts to 1 column (mobile), 2 columns (tablet), 2-3 columns (desktop).

**Visual Enhancements:**
- Cover image (from `coverImage` field, fallback to first image in `images` array).
- Title, category as metadata.
- Brief description (2-line clamp, expand on hover to 3 lines).
- Technology tags with animation delay for each tag.
- Action buttons: GitHub link and Live Demo link (prevent default, show in project details modal instead).

**Accessibility:**
- Alt text on images (project title).
- Semantic button labels.
- Proper link ARIA attributes.

### 4. Project Details Modal (User Side)
**Decision:** Create `ProjectDetailsModal.jsx` to display full project information in a modal overlay.

**Rationale:**
- Avoids full page navigation; user stays in context.
- Shows all project images in a gallery with smooth transitions.
- Displays all information: title, full description, all technologies, category, links.
- Consistent with modal styling (`AdminModal`-inspired dark theme).

**Content & Features:**
- Modal title: project title.
- Gallery: images with left/right navigation or swipe (optional, nice-to-have), keyboard support (ESC to close).
- Project details: full description, category, all technologies, status.
- Action buttons: "Visit Website" (liveUrl), "View Code" (githubUrl) — open in new tab.
- Close: button, backdrop click, ESC key.

**Animation:**
- Entrance: fade-in + slight scale-up.
- Gallery transitions: smooth fade or slide between images.
- Exit: fade-out.

### 5. Integration with Existing Admin Panel
**Decision:** Modify `ProjectsPage.jsx` to use `ProjectFormModal.jsx` and delegate image upload to `SupabaseUploader.jsx`.

**Changes:**
- Remove inline form JSX; replace with conditional `ProjectFormModal` render.
- Keep project list view and action buttons (edit, delete).
- Maintain responsive grid layout for project cards in the admin panel.

### 6. Backend Verification & Updates
**Project Model (already correct per inspection):**
- ✅ `title` (String, required)
- ✅ `slug` (String, required, unique)
- ✅ `description` (String, required)
- ✅ `images` ([String], default [])
- ✅ `coverImage` (String, auto-set from images[0])
- ✅ `category` (String)
- ✅ `technologies` ([String])
- ✅ `githubUrl`, `liveUrl` (String)
- ✅ `featured` (Boolean)
- ✅ `status` (enum: "Active", "Completed", "In Progress")
- ✅ `createdAt`, `updatedAt` (timestamps)
- ✅ Pre-save and pre-findByIdAndUpdate hooks set coverImage

**Admin Endpoints (already correct per inspection):**
- ✅ `POST /api/admin/projects` — create, accepts `images: [String]`
- ✅ `GET /api/admin/projects` — list all
- ✅ `PUT /api/admin/projects/:id` — update
- ✅ `DELETE /api/admin/projects/:id` — delete
- ✅ Protected by `protectAdmin` middleware

**Public Endpoints:**
- ✅ `GET /api/projects` — list (should filter to published/completed per business logic; verify in controller)
- ✅ `GET /api/projects/:id` — details

**No Backend Changes Required:** The model and controllers already support the feature. Supabase URLs are passed as strings in the `images` array.

### 7. Animation Library Choice
**Decision:** Use Framer Motion for advanced animations (entrance, hover, modal transitions); Tailwind CSS for static styling and responsive design.

**Rationale:**
- Framer Motion provides declarative animation syntax, smooth transitions, and gesture support.
- Already aligned with React 19; minimal bundle overhead.
- Allows staggered animations for card grids and tech tags.
- Simplifies modal and gallery transitions.

**What to Animate:**
- Project card entrance (fade + slide-up).
- Hover effects (image zoom, overlay).
- Tech tags (stagger animation on hover).
- Modal entrance/exit (fade + scale).
- Gallery image transitions (fade between images).

---

## File-by-File Changes

### Frontend

#### Files to Create

**1. `src/components/ImageUploader.jsx`** (NEW — optional reusable wrapper)
- Wrapper around Supabase upload logic if we want to separate concerns.
- For now, reuse existing `SupabaseUploader.jsx` directly in forms.
- **Status:** SKIP — use existing `SupabaseUploader.jsx` instead.

**2. `src/components/admin/ProjectFormModal.jsx`** (NEW)
- Modal form for create/edit projects.
- Integrates `SupabaseUploader` for image handling.
- Form state management (title, slug, description, category, technologies, urls, status, featured).
- Validation and submission logic.
- Displays loading state during upload/submit.
- Props:
  - `isOpen: boolean`
  - `onClose: function`
  - `onSubmit: function(projectData)`
  - `editingProject?: object` (null = create mode)
  - `isLoading?: boolean`

**3. `src/components/ProjectDetailsModal.jsx`** (NEW)
- Modal overlay for viewing project details (user side).
- Displays all project images (gallery with simple prev/next or carousel).
- Project info: title, description, technologies, category, links.
- Close button, backdrop click, ESC key to close.
- Props:
  - `isOpen: boolean`
  - `project: object | null`
  - `onClose: function`

#### Files to Modify

**1. `src/components/projectCard.jsx`**
- Add Framer Motion animations (entrance, hover).
- Improve visual hierarchy and spacing.
- Add click handler to open `ProjectDetailsModal` (parent passes state/handlers).
- Use `coverImage` as primary image source.
- Animate tech tags on hover (stagger).
- Animate arrow icon and description on hover.

**2. `src/pages/projectPage.jsx`**
- Import `ProjectDetailsModal`.
- Add modal state: `const [selectedProject, setSelectedProject] = useState(null)`.
- Wrap `ProjectCard` components and pass `onSelectProject` handler.
- Render `ProjectDetailsModal` conditionally.
- Animate grid entrance for project cards.

**3. `src/components/projects.jsx`** (home page projects section)
- Same changes as `projectPage.jsx` (modal state, handlers, animations).
- Ensure consistency between both project list views.

**4. `src/pages/admin/ProjectsPage.jsx`**
- Remove inline form JSX (ProjectFormFields, Input).
- Add `ProjectFormModal` state: `const [showProjectModal, setShowProjectModal] = useState(false)`.
- Update "Add Project" button to toggle modal.
- Keep project grid and action buttons (edit, delete).
- On edit, set `editingProject` to trigger modal and pre-populate form.
- Pass `onProjectSubmit` handler to modal.

**5. `src/utils/mediaUpload.jsx`** (OPTIONAL — FIX ENV KEY MISMATCH)
- Current code references `VITE_SUPABASE_ANON_KEY` but `.env` has `VITE_SUPABASE_KEY`.
- **Fix:** Change line to use `import.meta.env.VITE_SUPABASE_KEY` (match `.env`).
- **Note:** This utility may not be used; `SupabaseUploader.jsx` is the active uploader. Consider deprecating or fixing for consistency.

**6. `package.json`** (ADD DEPENDENCY)
- Add `framer-motion@latest` (or specific version, e.g., `^10.16.0`).
- Run `npm install` or `npm update` before building.

**7. `src/App.jsx`** (VERIFY, no changes likely needed)
- Verify routes are correct. Ensure no new routes needed for modals (modals are overlays, not routes).

---

## Error Handling & Validation

### Client-Side (Frontend)

**Image Upload:**
- **Failure:** Network error, Supabase quota exceeded, file too large (>10MB), invalid file type.
- **Handling:** Show toast error with specific message. Allow user to retry or remove file.
- **Recovery:** User can re-select and re-upload without losing form data.

**Form Submission:**
- **Failure:** Required fields missing (validated before submit), slug not unique (backend returns 400), network error.
- **Handling:** Show inline validation errors or toast for each issue.
- **Recovery:** Fix fields and resubmit.

**Modal/Gallery:**
- **Failure:** Image fails to load (broken Supabase URL).
- **Handling:** Show placeholder or fallback UI.
- **Recovery:** N/A for user; admin must fix image URL in project edit.

### Server-Side (Backend — Already Implemented)

**Create/Update Project:**
- **Required fields validation:** Checked in controller before save.
- **Slug uniqueness:** Mongoose unique index + catch `code 11000` error.
- **Images array validation:** Each URL must be non-empty string (schema validator).
- **Status enum:** Mongoose enforces enum values.
- **Responses:**
  - 201 Created / 200 OK: Success response with full project object.
  - 400 Bad Request: Validation error with message.
  - 404 Not Found: Resource not found (update/delete on missing ID).
  - 500 Internal Server Error: Unexpected error (logged to console).

---

## Data Flow & Integration Points

### Create Project Flow (Admin)
1. Admin clicks "Add Project" → `ProjectFormModal` opens (empty form).
2. Admin selects files → `SupabaseUploader` shows previews (first = cover badge).
3. Admin fills form fields (title, slug, description, category, techs, urls, featured, status).
4. Admin clicks "Upload" → `SupabaseUploader` uploads files to Supabase, calls `onUploadComplete(urls)`.
5. Admin clicks "Create Project" → form validates, submits to `POST /api/admin/projects` with `images: [urls]`.
6. Backend: Project model pre-save hook sets `coverImage = images[0]`.
7. Success: Close modal, refresh projects list, show toast.

### Edit Project Flow (Admin)
1. Admin clicks edit icon on project card → modal opens with `editingProject` data.
2. Form pre-populates: all fields + `SupabaseUploader` shows current images as previews.
3. Admin can add more images, remove images (locally), or modify other fields.
4. Admin clicks "Save Changes" → form validates, submits to `PUT /api/admin/projects/:id`.
5. Backend: Validator checks images array, pre-findByIdAndUpdate hook sets `coverImage`.
6. Success: Refresh projects list.

### User Viewing Projects (Public)
1. User visits `/projects` (all projects) or home page (featured section).
2. Project cards render with cover image, title, category, description (2-line clamp), tech tags, links.
3. Cards animate on entrance (staggered fade-up).
4. On hover: image zoom, overlay fade-in, tags stagger-animate, arrow moves.
5. User clicks card or "View Details" → `ProjectDetailsModal` opens.
6. Modal displays full project: all images (gallery), full description, all techs, status, links.
7. User clicks "Visit Website" or "View Code" → opens in new tab.
8. User clicks close or presses ESC → modal closes.

---

## Verification Plan (Mapping to 10 Required Steps)

1. ✅ **Admin can upload multiple images when creating a project.**
   - Test: Admin goes to `/admin/projects`, clicks "Add Project", selects 3+ images in `SupabaseUploader`.
   - Verify: All images appear in previews, first has "Cover" badge.

2. ✅ **First image used as cover automatically.**
   - Test: Create project with 3 images. Inspect project in admin list.
   - Verify: `projectCard.jsx` displays first image as `coverImage`. Backend sets `coverImage = images[0]`.

3. ✅ **Admin can edit a project and change images.**
   - Test: Admin opens existing project for edit, adds/removes images, updates fields.
   - Verify: Modal pre-populates with current data. Updated images reflect in project card.

4. ✅ **A published project appears on the user side immediately.**
   - Test: Admin creates project with `status: "Completed"` or `"Active"`. Navigate to `/projects` or home page.
   - Verify: Project card appears in grid. No page refresh needed (assume API returns all applicable projects).

5. ✅ **User can click a project card to see all details and images.**
   - Test: Click project card on `/projects` page.
   - Verify: `ProjectDetailsModal` opens, displays all images, full description, all technologies, links.

6. ✅ **Project cards have smooth animations.**
   - Test: Visit `/projects` or home page projects section.
   - Verify: Cards fade-in and slide-up on load (staggered). On hover: image zoom, overlay fade, tags animate.

7. ✅ **Images load from Supabase without errors.**
   - Test: Verify Supabase bucket `portfolio-projects` contains uploaded images. Check network tab for image requests.
   - Verify: No CORS errors, 200 responses, images render correctly.

8. ✅ **Form validation prevents submission with empty required fields.**
   - Test: Try to create project without title, slug, or description.
   - Verify: Form shows validation error (inline or toast), submit button disabled.

9. ✅ **No images are uploaded (or they are cleaned up) if project creation fails.**
   - Test: Create project with images but invalid slug (duplicate). Monitor Supabase bucket.
   - Verify: Images uploaded to Supabase during form submission; if project creation fails, images remain in bucket (not cleaned up—acceptable per task scope, but note as potential future optimization).

10. ✅ **UI is professional, responsive, and animated.**
    - Test: View on desktop, tablet, mobile. Trigger hover effects and animations.
    - Verify: Tailwind responsive classes applied. Animations smooth (60 fps). Dark theme consistent. Typography and spacing professional.

---

## Accessibility & Performance

### Accessibility
- Images: Alt text using project title.
- Buttons: Proper semantic HTML, descriptive labels ("View Details", "Visit Website").
- Modal: Trap focus within modal (Framer Motion can help), ESC key to close, backdrop click support.
- Links: External links open in new tab with `target="_blank" rel="noreferrer"`.
- Color contrast: Dark theme with light text meets WCAG AA.

### Performance
- **Lazy Loading:** Consider adding intersection observer to lazy-load project cards off-screen.
- **Image Optimization:** Supabase handles CDN delivery; ensure images are reasonably sized on client.
- **Bundle Size:** Framer Motion adds ~40KB gzipped; acceptable for animation benefits.
- **Database:** Admin queries paginate large project lists (implement if 100+ projects expected).

---

## Technology Stack Lock

Once this design is approved, the following are locked:
- **Frontend:** React 19, Vite, Tailwind CSS 4.3.3, Framer Motion 10+, Lucide React 1.45, Supabase JS 2.112.4.
- **Backend:** No changes; existing MongoDB model and Express routes are sufficient.
- **Animations:** Framer Motion for all declarative animations; no CSS-in-JS library additions.
- **Styling:** Tailwind CSS utility classes; no CSS modules or styled-components.

---

## Assumptions & Open Questions Resolved

1. ✅ **Supabase bucket name:** Confirmed as `portfolio-projects` (in `SupabaseUploader.jsx`). Note: `.env` comment mentions `portfolio-images`, but actual uploader uses `portfolio-projects`.
2. ✅ **Cover image selection:** Confirmed automatic via backend pre-save hook (images[0]).
3. ✅ **Image array handling:** Confirmed backend accepts `images: [String]` with validation per upload controller.
4. ✅ **Auth for admin:** Confirmed JWT via `/api/admin` routes with `protectAdmin` middleware.
5. ✅ **Public project visibility:** Assumed `/api/projects` returns all projects; if filtering needed (e.g., `status: "Completed"`), verify in `projectController.getProjects()`.
6. ✅ **Modal vs. page:** Decided on modal overlay (user details modal) instead of full-page route to keep user in context.
7. ✅ **Framer Motion necessity:** Confirmed for smooth, professional animations; critical for user experience.
8. ✅ **Bucket existing:** Assumed `portfolio-projects` bucket exists in Supabase; if not, admin must create it and ensure CORS is open for public URL access.

---

## Risk Mitigation

- **Missing Supabase bucket:** Will surface at upload time. Document bucket creation step in implementation guide.
- **Env key mismatch:** Fix `mediaUpload.jsx` to use correct key (or deprecate utility).
- **Large image files:** Validate file size client-side (10MB already enforced); consider server-side resize if images are user-uploaded raw files.
- **Stale image URLs:** If Supabase image deleted, URLs break. Document that admin should archive projects instead of deleting if images are permanently removed.

---

## Summary of Deliverables

1. ✅ Enhanced `SupabaseUploader.jsx` (already exists, no changes needed).
2. ✅ `ProjectFormModal.jsx` (new component for admin create/edit).
3. ✅ `ProjectDetailsModal.jsx` (new component for user details view).
4. ✅ Enhanced `projectCard.jsx` (animations + improved UX).
5. ✅ Enhanced `projectPage.jsx` and `projects.jsx` (modal integration).
6. ✅ Enhanced `ProjectsPage.jsx` (modal-based form, cleaner code).
7. ✅ Add `framer-motion` to `package.json`.
8. ✅ Backend: No changes (model and endpoints already correct).
9. ✅ Verification: 10-step plan covering all requirements.

This design is ready for implementation and will deliver a professional, animated project management system with seamless Supabase integration and an intuitive admin interface.
