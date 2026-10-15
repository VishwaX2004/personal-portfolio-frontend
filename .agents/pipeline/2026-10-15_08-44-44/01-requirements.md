# Requirements Document: Admin Panel with Education & Project Management

## Summary

Implement a complete admin dashboard for the portfolio frontend with authentication, nested URL-based navigation, and full CRUD management for projects and education qualifications. The admin will access the panel via `/admin` (protected route), with a login page at `/admin/login`. After successful authentication, the admin lands on a dashboard with sidebar navigation to manage projects, education, and view messages. All endpoints are already available in the backend; the frontend must wire them together with proper token handling and form validation.

**Assumptions:**
- Backend API endpoints exist: `/qualifications` (CRUD), `/projects` (CRUD including PUT), `/messages` (GET, DELETE)
- Admin role is determined by successful login response (token indicates admin status)
- Token is stored in `localStorage` under the key `"adminToken"`
- API base URL is configured in `.env` as `VITE_API_URL`
- Tailwind CSS and existing UI component patterns (cards, modals, buttons, toasts) are available

---

## Functional Requirements

### Authentication & Authorization
1. Admin must log in at `/admin/login` with credentials (email/password)
2. Successful login stores an admin token in `localStorage` with key `"adminToken"`
3. `AdminRoute` component guards all `/admin/*` routes; unauthenticated users redirect to `/admin/login`
4. Logout clears the token and redirects to `/admin/login`
5. Token is automatically attached to all API requests via request interceptor in `api.js`

### Admin Layout & Navigation
6. All admin pages share a consistent layout with:
   - Fixed sidebar with navigation menu
   - Top header with user info and logout button
   - Main content area (Outlet for nested routes)
7. Sidebar navigation includes buttons for:
   - Dashboard (default `/admin` view)
   - Projects (`/admin/projects`)
   - Education (`/admin/education`)
   - Messages (`/admin/messages`)
8. Active route is highlighted in the sidebar
9. Clicking a nav button updates the URL and loads the corresponding page

### Dashboard Page
10. Default page at `/admin` displays:
    - Overview stats (Total Projects, Featured Projects, Messages, Completed Projects)
    - Recent 3 projects as mini-cards with title, status, and delete button
    - "View all projects" link to `/admin/projects`
11. Data loads on page mount and handles loading/error states gracefully

### Projects Management
12. `/admin/projects` page displays a full list of all projects with:
    - Project title, slug, category, status (featured/draft/published)
    - Edit and Delete buttons for each project
13. Inline "Add Project" form or expandable form section with fields:
    - Title, slug, description, image URL, category, technologies (comma-separated or array), GitHub URL, live URL, featured toggle, status dropdown
14. "Edit" button opens `EditProjectModal` with project data pre-filled
15. Form validation ensures required fields are completed before submission
16. On successful add/edit/delete, list refreshes and a toast notification confirms the action
17. Errors display as toast notifications

### Education (Qualifications) Management
18. `/admin/education` page displays a list of all education entries with:
    - Title (qualification name), school/institution, year, grade
19. Inline "Add Education" form or expandable form section with fields:
    - Title, school/institution, grade (optional), year, description (optional)
20. Each education entry has Edit and Delete buttons
21. "Edit" button opens `AddEducationModal` with pre-filled data (same modal for add/edit)
22. Form validation ensures required fields are completed
23. On add/edit/delete, list refreshes and a toast confirms the action
24. Delete includes a confirmation dialog before proceeding
25. Errors display as toast notifications

### Messages Management
26. `/admin/messages` page displays a list of all messages with:
    - Sender name, email, subject, message preview, timestamp
27. Each message has a Delete button
28. Delete includes a confirmation dialog before proceeding
29. On successful delete, list refreshes and a toast confirms

### Forms & Modals
30. `EditProjectModal` component:
    - Receives project data as prop
    - Form fields pre-fill with existing values
    - Submit calls `updateProject(id, data)` from api.js
    - On success: closes modal, refreshes project list, shows success toast
    - On error: shows error toast
31. `AddEducationModal` component:
    - Receives education data as prop (null for new, object for edit)
    - Form fields pre-fill if editing
    - Submit calls `createEducation(data)` or `updateEducation(id, data)` based on mode
    - On success: closes modal, refreshes education list, shows success toast
    - On error: shows error toast

### API Integration
32. `api.js` includes:
    - Request interceptor that attaches `Authorization: Bearer <token>` header from `localStorage` for all requests
    - Helper methods: `getEducation()`, `createEducation(data)`, `updateEducation(id, data)`, `deleteEducation(id)`
    - Helper methods: `getProjects()`, `createProject(data)`, `updateProject(id, data)`, `deleteProject(id)`
    - Helper methods: `getMessages()`, `deleteMessage(id)`
33. All API calls include proper error handling (catch and reject with error details)

### Utilities
34. `adminHelpers.js` includes:
    - `formatDate(dateString)` — formats timestamps for display (e.g., "Jan 15, 2024")
    - `validateProjectForm(formData)` — checks required fields (title, slug, description, etc.); returns error object or null
    - `validateEducationForm(formData)` — checks required fields (title, school, year); returns error object or null
    - `parseErrorMessage(error)` — extracts meaningful error text from API error responses

### Routing
35. App.jsx includes nested admin routes under `AdminRoute` protection:
    - `/admin` → `DashboardPage` (index redirect from `/admin`)
    - `/admin/dashboard` → `DashboardPage`
    - `/admin/projects` → `ProjectsPage`
    - `/admin/education` → `EducationPage`
    - `/admin/messages` → `MessagesPage`
    - `/admin/login` → `AdminLoginPage` (unprotected)

### Code Organization
36. Old `adminDashboard.jsx` file is deleted; all functionality is split into separate pages
37. New files created:
    - `src/components/admin/AdminLayout.jsx`
    - `src/components/admin/EditProjectModal.jsx`
    - `src/components/admin/AddEducationModal.jsx`
    - `src/pages/admin/DashboardPage.jsx`
    - `src/pages/admin/ProjectsPage.jsx`
    - `src/pages/admin/EducationPage.jsx`
    - `src/pages/admin/MessagesPage.jsx`
    - `src/utils/adminHelpers.js` (or enhanced if already exists)

---

## Non-Functional Requirements

### Performance
- Dashboard loads and renders within 2 seconds on average network
- Project and education lists lazy-load or paginate if 100+ items exist
- API requests include timeouts (recommend 30 seconds)

### Accessibility
- All modals have proper focus management (focus trap, restore on close)
- Forms include accessible labels and ARIA attributes where needed
- Delete confirmations are keyboard accessible
- Sidebar and main nav are keyboard navigable

### Code Quality
- All components follow existing project patterns (React hooks, Tailwind CSS)
- Code is linted with ESLint and formatted with Prettier (if configured)
- No console errors or warnings in admin flow
- API layer separates concerns from UI layer

### Browser Compatibility
- Works on modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design works on desktop and tablets (mobile optional)

### Error Handling
- Network errors display user-friendly toast messages
- Validation errors highlight form fields and show inline messages
- 401/403 responses clear token and redirect to login
- 500 errors show generic "Something went wrong" message with an option to retry

### State Management
- All state persists via API (no client-side state for data)
- Component-level state for UI (modals open/close, loading, errors)
- No Redux or global store required (keep existing patterns)

---

## Acceptance Criteria

### Admin Authentication
1. ✓ Navigating to `/admin` without a token redirects to `/admin/login`
2. ✓ Admin can log in at `/admin/login` with valid credentials
3. ✓ After successful login, `localStorage` contains an `"adminToken"` key with a non-empty value
4. ✓ Admin is redirected to `/admin` (dashboard) after login
5. ✓ Logout button clears the token and redirects to `/admin/login`

### Admin Layout & Routing
6. ✓ Admin Dashboard page loads and displays layout with sidebar, header, and content area
7. ✓ Sidebar shows four navigation buttons: Dashboard, Projects, Education, Messages
8. ✓ Clicking "Dashboard" navigates to `/admin` and highlights the button
9. ✓ Clicking "Projects" navigates to `/admin/projects` and highlights the button
10. ✓ Clicking "Education" navigates to `/admin/education` and highlights the button
11. ✓ Clicking "Messages" navigates to `/admin/messages` and highlights the button
12. ✓ Browser back/forward buttons work correctly between admin pages

### Dashboard Page
13. ✓ Dashboard displays at least 3 stat cards (Total Projects, Featured, Messages)
14. ✓ Dashboard shows recent 3 projects (or fewer if < 3 exist)
15. ✓ Each recent project card displays title, status, and a delete button
16. ✓ "View all projects" link navigates to `/admin/projects`

### Projects Management
17. ✓ `/admin/projects` displays all projects as a list or table
18. ✓ Each project entry shows title, slug, category, status
19. ✓ Each project has Edit and Delete buttons
20. ✓ "Add Project" form/button allows adding a new project with all required fields
21. ✓ Form validates required fields before submission (title, slug, description, image URL)
22. ✓ Submitting the form creates a new project via POST `/projects` and refreshes the list
23. ✓ Clicking Edit opens `EditProjectModal` with form pre-filled with current project data
24. ✓ Editing and submitting updates the project via PUT `/projects/:id` and refreshes the list
25. ✓ Clicking Delete shows a confirmation dialog
26. ✓ Confirming delete removes the project via DELETE `/projects/:id` and removes from list
27. ✓ Success/error toasts display after each CRUD operation

### Education Management
28. ✓ `/admin/education` displays all education entries as a list
29. ✓ Each education entry shows title, school, year, grade (if available)
30. ✓ Each entry has Edit and Delete buttons
31. ✓ "Add Education" form/button allows adding a new entry with required fields
32. ✓ Form validates required fields before submission (title, school, year)
33. ✓ Submitting creates a new education entry via POST `/qualifications` and refreshes the list
34. ✓ Clicking Edit opens `AddEducationModal` with form pre-filled with current data
35. ✓ Editing and submitting updates the entry via PUT `/qualifications/:id` and refreshes the list
36. ✓ Clicking Delete shows a confirmation dialog
37. ✓ Confirming delete removes the entry via DELETE `/qualifications/:id` and removes from list
38. ✓ Success/error toasts display after each CRUD operation

### Messages Management
39. ✓ `/admin/messages` displays all messages as a list
40. ✓ Each message shows sender name, email, subject, timestamp
41. ✓ Each message has a Delete button
42. ✓ Clicking Delete shows a confirmation dialog
43. ✓ Confirming delete removes the message via DELETE `/messages/:id` and removes from list
44. ✓ Success/error toasts display after delete

### API Integration
45. ✓ All API requests include `Authorization: Bearer <token>` header (verified in Network tab)
46. ✓ `api.js` exports all required helper methods (education, projects, messages CRUD)
47. ✓ 401/403 responses automatically clear the token and redirect to login (or show error)
48. ✓ Network errors display a user-friendly error toast

### Build & Deployment
49. ✓ `npm run build` completes without errors or missing imports
50. ✓ No console errors or warnings in the browser during admin flow
51. ✓ All new files are created in correct directories and imported correctly

---

## Out of Scope

- Real-time notifications or WebSocket integration for updates
- Pagination or infinite scroll (list all items for now; can be added if performance issues arise)
- Admin role management or multi-user admin support
- Audit logging of admin actions
- Advanced analytics or dashboards beyond stat summary
- Image upload/resize; image URL is entered manually
- Rich text editor for descriptions; plain text or Markdown support is sufficient
- Email notifications to admins
- Mobile-optimized admin interface (desktop-first is sufficient)
- Bulk actions (e.g., delete multiple projects at once)
- Search or filtering within lists (show all for now)
- Admin profile or settings page
- Database backup or export functionality
