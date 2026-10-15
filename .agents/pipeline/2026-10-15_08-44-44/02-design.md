# Technical Design: Admin Panel with Education & Project Management

**Revision**: YES (Design Review Findings Addressed)  
**Status**: READY FOR IMPLEMENTATION  
**Last Updated**: 2026-10-15

---

## Overview

This document describes a complete admin panel for the portfolio frontend, enabling authenticated admins to manage projects and education qualifications through nested URL-based routing. The design integrates with an existing backend providing CRUD endpoints for projects, qualifications, and messages, with a dual-token authentication system (separate `adminToken` in localStorage for admin operations).

The implementation preserves the existing dark theme UI and leverages React Router v7's nested routing for clean URL-driven navigation between dashboard, projects, education, and messages sections. All data persists via API; no client-side state stores data.

---

## Key Design Decisions

### 1. Backend Endpoint Paths: `/admin/`-Prefixed Endpoints

**Decision**: Use `/admin/`-prefixed endpoints as specified in the actual backend implementation.

**Rationale**: The code review confirmed that `src/services/adminService.js` uses `/admin/`-prefixed paths (e.g., `GET /admin/projects`, `POST /admin/education`). This is the current backend specification, confirmed through code inspection.

**Endpoints**:
- Projects: `GET /admin/projects`, `POST /admin/projects`, `PUT /admin/projects/:id`, `DELETE /admin/projects/:id`
- Education: `GET /admin/education`, `POST /admin/education`, `PUT /admin/education/:id`, `DELETE /admin/education/:id`
- Messages: `GET /messages`, `DELETE /messages/:id` (non-prefixed; shared endpoint)

**Why not `/qualifications`?**: The backend uses `/admin/education` for education CRUD. The design must align with actual backend, not an idealized REST convention.

---

### 2. Dual Token System: `adminToken` vs. `token`

**Decision**: Maintain two separate Axios instances with separate token keys:
- `adminAPI` (in `adminService.js`): Uses `localStorage.getItem("adminToken")` for admin operations
- `API` (in `api.js`): Uses `localStorage.getItem("token")` for public/non-admin operations

**Rationale**: Allows role-based separation of API calls. Admin and non-admin users may have different token keys and token lifetimes. This prevents accidental use of non-admin tokens in admin contexts.

**Implication**: Messages CRUD must live in `adminService.js` (using `adminAPI` and `adminToken`), not in `api.js`.

---

### 3. Authentication & Route Guards

**Decision**: 
- `AdminRoute` component guards all `/admin/*` routes by checking `localStorage.getItem("adminToken")`
- Unauthenticated users redirect to `/admin/login`
- 401 responses clear the token and redirect directly to `/admin/login` (not to `/admin`, which would cause double redirect)

**Rationale**: Centralizes auth guard logic; ensures only authenticated admins access protected content. Direct redirect to `/admin/login` avoids UI flicker and unnecessary route processing.

---

### 4. Nested Routing with URL-Driven Tabs

**Decision**: Use React Router v7 nested routes with `<Outlet />` in `AdminLayout`:
```
/admin
├── /admin/dashboard        → DashboardPage (default)
├── /admin/projects         → ProjectsPage
├── /admin/education        → EducationPage
└── /admin/messages         → MessagesPage
```

**Rationale**: 
- URL reflects current view → users can bookmark and share routes
- Browser back/forward navigation works automatically
- Cleaner code than state-based tab switching
- Follows React Router v7 best practices

---

### 5. Form Field Naming: Alignment with Validation

**Decision**: Education form uses standardized field names to align with `validateEducationForm()` utility:
- `title` (not `degree`): Qualification/degree name
- `school` (not `institution`): School/institution name
- `year` (not `startYear`): Primary year; `endYear` is optional
- `description`, `order`: Optional fields

**Rationale**: Prevents validation mismatches. The utility checks specific keys; the form must provide them. Using generic names (`title`, `school`, `year`) allows the validation logic to work for any qualification type (degree, diploma, certificate, etc.).

---

### 6. Error Handling: Consistent Utility Pattern

**Decision**: All pages use `parseErrorMessage(error)` utility for consistent error extraction:
```javascript
catch (error) {
  console.error(error);
  toast.error(parseErrorMessage(error));
}
```

**Why**: The backend may return errors in different formats (e.g., `{ message: "..." }`, `{ error: "..." }`, plain string). `parseErrorMessage()` normalizes these variations into a single readable message. Centralizes error handling logic; easier to maintain and extend.

---

### 7. Modals for Edit Operations

**Decision**: 
- Projects: `EditProjectModal` component (receives project data as prop)
- Education: `AddEducationModal` component (handles both add and edit modes)

**Rationale**: Modals keep forms out of page overflow and provide focus isolation. Reusable `AdminModal` base component handles backdrop, escape key, and focus management.

---

## Technology Stack (Locked)

- **Framework**: React 19 with React Router v7
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios with dual instances (adminAPI and API)
- **Notifications**: react-hot-toast
- **Icons**: lucide-react
- **Build**: Vite
- **Token Storage**: localStorage
- **State Management**: React hooks (no Redux)

---

## File Structure

```
src/
├── components/admin/
│   ├── AdminLayout.jsx           (✓ EXISTS - shared sidebar + header + Outlet)
│   ├── AdminModal.jsx            (✓ EXISTS - reusable modal base)
│   ├── EditProjectModal.jsx      (⚡ CREATE - edit project modal)
│   └── AddEducationModal.jsx     (⚡ CREATE - add/edit education modal)
├── pages/admin/
│   ├── LoginPage.jsx             (✓ EXISTS - admin login)
│   ├── DashboardPage.jsx         (✓ EXISTS - stats + recent projects)
│   ├── ProjectsPage.jsx          (✓ EXISTS - project list + add form)
│   ├── EducationPage.jsx         (✓ EXISTS - education list + add form)
│   └── MessagesPage.jsx          (✓ EXISTS - message list + delete)
├── services/
│   ├── api.js                    (✓ EXISTS - for public endpoints, keep messages here during transition)
│   └── adminService.js           (✓ EXISTS - for /admin/* endpoints + messages)
├── utils/
│   ├── adminHelpers.js           (✓ EXISTS - formatDate, validation, error parsing)
│   └── adminAuth.js              (✓ EXISTS - token getters/setters)
└── App.jsx                       (✓ EXISTS - routing with nested admin routes)
```

---

## API Integration & Request Interceptor

### Two Axios Instances

**adminService.js**:
```javascript
const adminAPI = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Request interceptor: Attach adminToken
adminAPI.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: 401 → /admin/login
adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAdminToken();
      window.location.href = "/admin/login";  // Direct to login, not /admin
    }
    return Promise.reject(error);
  }
);
```

**api.js**:
```javascript
// For public endpoints; checks localStorage.getItem("token")
// Keep as-is; not used by admin pages after migration
```

### Endpoint Implementations in adminService.js

**Projects**:
```javascript
export const getAdminProjects = async () => {
  const response = await adminAPI.get("/admin/projects");
  return response.data;
};

export const createAdminProject = async (data) => {
  const response = await adminAPI.post("/admin/projects", data);
  return response.data;
};

export const updateAdminProject = async (id, data) => {
  const response = await adminAPI.put(`/admin/projects/${id}`, data);
  return response.data;
};

export const deleteAdminProject = async (id) => {
  const response = await adminAPI.delete(`/admin/projects/${id}`);
  return response.data;
};
```

**Education**:
```javascript
export const getAdminEducation = async () => {
  const response = await adminAPI.get("/admin/education");
  return response.data;
};

export const createAdminEducation = async (data) => {
  const response = await adminAPI.post("/admin/education", data);
  return response.data;
};

export const updateAdminEducation = async (id, data) => {
  const response = await adminAPI.put(`/admin/education/${id}`, data);
  return response.data;
};

export const deleteAdminEducation = async (id) => {
  const response = await adminAPI.delete(`/admin/education/${id}`);
  return response.data;
};
```

**Messages** (moved from api.js):
```javascript
export const getMessages = async () => {
  const response = await adminAPI.get("/messages");
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await adminAPI.delete(`/messages/${id}`);
  return response.data;
};
```

---

## Form Field Normalization

### Education Form Schema

**Current (incorrect) form keys**: `institution`, `degree`, `field`, `startYear`, `endYear`, `description`, `order`  
**Correct form keys** (aligned with validation): `title`, `school`, `year`, `endYear`, `description`, `order`

**Mapping**:
| Old Key | New Key | Description |
|---------|---------|-------------|
| `degree` | `title` | Qualification name (e.g., "Bachelor of Science") |
| `institution` | `school` | School/university name |
| `field` | — | Optional; not validated, can remain or remove |
| `startYear` | `year` | Start year of qualification |
| `endYear` | `endYear` | End year (optional; if null, display "Present") |
| `description` | `description` | Additional details (optional) |
| `order` | `order` | Display order (optional) |

**Validation Rules** (from `validateEducationForm()`):
- `title` is required (non-empty string)
- `school` is required (non-empty string)
- `year` is required (number between 1900–2099)
- `endYear` is optional (number or null)
- `description` is optional
- `order` is optional

---

## Error Handling Strategy

### parseErrorMessage() Utility

Located in `src/utils/adminHelpers.js`:
```javascript
export const parseErrorMessage = (error) => {
  // Try common error response structures
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data && typeof error.response.data === "string") {
    return error.response.data;
  }
  if (error.message) {
    return error.message;
  }
  return "An error occurred";
};
```

### Usage in All Pages

Every async operation that can fail uses this pattern:
```javascript
try {
  await someApiCall();
  toast.success("Operation succeeded");
  // Refresh data
} catch (error) {
  console.error(error);  // Log for debugging
  toast.error(parseErrorMessage(error));  // Show user-friendly message
}
```

**Pages affected**: `DashboardPage`, `ProjectsPage`, `EducationPage`, `MessagesPage`

---

## Component Specifications

### AdminLayout.jsx (Existing + Verify)

**Purpose**: Shared layout wrapper for all admin pages.

**Structure**:
- Fixed sidebar (left) with navigation, user info, logout button
- Sticky header (top) with page title and portfolio link
- Main content area with `<Outlet />` for nested routes

**Sidebar Navigation** (active state driven by URL via `useLocation()`):
- Dashboard → `/admin/dashboard`
- Projects → `/admin/projects`
- Education → `/admin/education`
- Messages → `/admin/messages`

**Features**:
- Responsive (sidebar hidden on mobile, visible on lg+)
- Active link highlighting (blue background)
- Logout button clears `adminToken` and redirects to `/admin/login`
- User info display (currently hardcoded; can be fetched from auth response)

---

### DashboardPage.jsx (Existing + Adjust Imports)

**Purpose**: Admin dashboard with overview stats and recent projects.

**Layout**:
1. Welcome message
2. Four stat cards:
   - Total Projects (count)
   - Featured Projects (filter by `featured === true`)
   - Education entries (count from education list)
   - Messages (count)
3. Recent 3 projects section with delete button each

**Data Fetching**:
```javascript
const [projects, setProjects] = useState([]);
const [education, setEducation] = useState([]);
const [messages, setMessages] = useState([]);

const fetchData = async () => {
  try {
    const [proj, edu, msgs] = await Promise.all([
      getAdminProjects(),
      getAdminEducation().catch(() => []),
      getMessages().catch(() => []),  // From adminService (corrected)
    ]);
    setProjects(proj || []);
    setEducation(edu || []);
    setMessages(msgs || []);
  } catch (error) {
    toast.error(parseErrorMessage(error));
  }
};
```

**Error Handling**: Use `parseErrorMessage()` for all catch blocks.

**Issue to Fix**: Change import from `import { getMessages } from "../../services/api"` to `import { getMessages } from "../../services/adminService"`.

---

### ProjectsPage.jsx (Existing + Verify Implementations)

**Purpose**: Full project CRUD interface.

**Layout**:
1. Header with "Add Project" button (toggles inline form)
2. Inline "Add Project" form (if `showAddForm` is true)
3. Project list as table or cards, each with Edit and Delete buttons

**Features**:
- Add form: Input fields for title, slug, description, image URL, category, technologies (comma-separated), GitHub URL, live URL, featured toggle, status
- Edit button opens `EditProjectModal` with form pre-filled
- Delete button with confirmation dialog
- Form validation (title, slug, description required)
- Success/error toasts

**Data Flow**:
1. On mount: `fetchProjects()` via `getAdminProjects()`
2. Add: Validate form → Call `createAdminProject()` → Refresh list
3. Edit: Open modal → Pre-fill form → Call `updateAdminProject(id, data)` → Refresh list
4. Delete: Confirm → Call `deleteAdminProject(id)` → Refresh list

**Error Handling**: All catch blocks use `parseErrorMessage()`.

---

### EditProjectModal.jsx (Create)

**Purpose**: Modal for editing an existing project.

**Props**:
```javascript
interface EditProjectModalProps {
  isOpen: boolean;
  project: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    image: string;
    category: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    featured: boolean;
    status: string;
  };
  onClose: () => void;
  onSuccess: () => void;  // Callback to refresh project list
}
```

**Features**:
- Uses `AdminModal` base component for backdrop, escape key, focus
- Form fields match `ProjectsPage` add form (title, slug, description, image, category, technologies, GitHub URL, live URL, featured, status)
- On submit: Validate form → Call `updateAdminProject(project._id, formData)` → Close modal → Call `onSuccess()` → Show success toast
- On error: Show error toast via `parseErrorMessage()`
- Cancel button closes modal without saving

**Implementation**:
```javascript
export default function EditProjectModal({ isOpen, project, onClose, onSuccess }) {
  const [formData, setFormData] = useState(/* initial values from project */);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.description) {
      toast.error("Please fill in required fields");
      return;
    }
    try {
      setLoading(true);
      await updateAdminProject(project._id, {
        ...formData,
        technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
      });
      toast.success("Project updated");
      onSuccess();  // Refresh parent list
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminModal isOpen={isOpen} title="Edit Project" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit" disabled={loading}>Save Changes</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </AdminModal>
  );
}
```

---

### EducationPage.jsx (Existing + Fix Field Names)

**Purpose**: Full education/qualifications CRUD interface.

**Layout**:
1. Header with "Add Education" button (toggles inline form)
2. Inline "Add Education" form (if `showAddForm` is true)
3. Education list as table, each row with Edit and Delete buttons

**Form State** (corrected keys):
```javascript
const [formData, setFormData] = useState({
  title: "",       // (was degree)
  school: "",      // (was institution)
  year: "",        // (was startYear)
  endYear: "",     // Keep as-is (optional)
  description: "", // Keep as-is (optional)
  order: "",       // Keep as-is (optional)
});
```

**Features**:
- Add form: Input fields for title, school, year, endYear, description, order
- Edit button opens `AddEducationModal` with form pre-filled (modal handles both add and edit)
- Delete button with confirmation dialog
- Form validation via `validateEducationForm()` utility (or inline if validation not called)
- Success/error toasts using `parseErrorMessage()`

**Data Flow**:
1. On mount: `fetchEducation()` via `getAdminEducation()`
2. Add: Validate form → Call `createAdminEducation()` → Refresh list
3. Edit: Open modal → Pre-fill form → Call `updateAdminEducation(id, data)` → Refresh list
4. Delete: Confirm → Call `deleteAdminEducation(id)` → Refresh list

**Error Handling**: All catch blocks use `parseErrorMessage()`.

---

### AddEducationModal.jsx (Create)

**Purpose**: Modal for adding or editing an education entry (dual-mode component).

**Props**:
```javascript
interface AddEducationModalProps {
  isOpen: boolean;
  education: null | {
    _id: string;
    title: string;
    school: string;
    year: number;
    endYear?: number;
    description?: string;
    order?: number;
  };
  onClose: () => void;
  onSuccess: () => void;  // Callback to refresh education list
}
```

**Mode Detection**:
- If `education === null`: Add mode (new entry)
- If `education !== null`: Edit mode (pre-fill form with education data)

**Features**:
- Uses `AdminModal` base component
- Form fields: title, school, year, endYear, description, order
- On submit in add mode: Validate form → Call `createAdminEducation(formData)` → Close modal → Call `onSuccess()` → Show success toast
- On submit in edit mode: Validate form → Call `updateAdminEducation(education._id, formData)` → Close modal → Call `onSuccess()` → Show success toast
- On error: Show error toast via `parseErrorMessage()`
- Cancel button closes modal without saving

**Implementation**:
```javascript
export default function AddEducationModal({ isOpen, education, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: education?.title || "",
    school: education?.school || "",
    year: education?.year?.toString() || "",
    endYear: education?.endYear?.toString() || "",
    description: education?.description || "",
    order: education?.order?.toString() || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const errors = validateEducationForm(formData);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        school: formData.school,
        year: parseInt(formData.year, 10),
        endYear: formData.endYear ? parseInt(formData.endYear, 10) : null,
        description: formData.description,
        order: formData.order ? parseInt(formData.order, 10) : 0,
      };

      if (education) {
        // Edit mode
        await updateAdminEducation(education._id, payload);
        toast.success("Education updated");
      } else {
        // Add mode
        await createAdminEducation(payload);
        toast.success("Education added");
      }

      onSuccess();  // Refresh parent list
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(parseErrorMessage(error));
    }
  };

  return (
    <AdminModal 
      isOpen={isOpen} 
      title={education ? "Edit Education" : "Add Education"} 
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit">{education ? "Save Changes" : "Add Education"}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </AdminModal>
  );
}
```

---

### MessagesPage.jsx (Existing + Fix Imports)

**Purpose**: View and delete contact messages.

**Layout**:
1. Header with page title and description
2. Message list as cards, each showing name, email, subject, message body, timestamp
3. Delete button on each card

**Features**:
- Display all messages or empty state
- Each message shows: sender name, email badge, subject, message body, formatted timestamp
- Delete button with confirmation dialog
- Success/error toasts using `parseErrorMessage()`

**Data Flow**:
1. On mount: `fetchMessages()` via `getMessages()` from adminService (corrected)
2. Delete: Confirm → Call `deleteMessage(id)` → Refresh list

**Error Handling**: All catch blocks use `parseErrorMessage()`.

**Issue to Fix**: Change import from `import { getMessages, deleteMessage } from "../../services/api"` to `import { getMessages, deleteMessage } from "../../services/adminService"`.

---

## Routing Configuration

### App.jsx Nested Routes

```javascript
<Routes>
  {/* Public routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/projects" element={<ProjectPage />} />
  <Route path="/projects/:id" element={<ProjectDetails />} />
  <Route path="/login" element={<Login />} />
  <Route path="/admin/login" element={<AdminLoginPage />} />

  {/* Protected admin routes */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="education" element={<EducationPage />} />
      <Route path="messages" element={<MessagesPage />} />
    </Route>
  </Route>
</Routes>
```

**How It Works**:
1. User navigates to `/admin` → `AdminRoute` checks for `adminToken`
2. If no token → Redirect to `/admin/login`
3. If token exists → `AdminLayout` renders with sidebar + header + `<Outlet />`
4. `/admin` index redirects to `/admin/dashboard`
5. Each sidebar link changes URL (e.g., `/admin/projects`) → Outlet renders `ProjectsPage`

---

## Data Flow & State Management

### Per-Page State

**DashboardPage**:
- `projects`: Array of project objects
- `education`: Array of education objects
- `messages`: Array of message objects
- `loading`: Boolean

**ProjectsPage**:
- `projects`: Array of project objects
- `projectForm`: Form state object
- `showAddForm`: Boolean (inline form visibility)
- `editingProject`: Null or project object (for modal)
- `loading`: Boolean

**EducationPage**:
- `education`: Array of education objects
- `formData`: Form state object (with corrected keys)
- `showAddForm`: Boolean (inline form visibility)
- `editingEducation`: Null or education object (for modal)
- `loading`: Boolean

**MessagesPage**:
- `messages`: Array of message objects
- `loading`: Boolean

### Data Persistence

- **All data stored on backend** via API calls
- **No Redux or Vuex**: Component-level state via `useState()`
- **No client-side caching**: Fresh fetch on page mount and after mutations
- **Token stored in localStorage** with key `"adminToken"`

---

## Edge Cases & Error Handling

### 401 Unauthorized

**Flow**:
1. Admin API call returns 401 status
2. `adminService.js` response interceptor catches it
3. Clear `adminToken` from localStorage
4. Redirect to `/admin/login` (not `/admin`, to avoid double redirect)
5. User sees login page and can re-authenticate

**Handling**: Automatic via interceptor; no UI change needed in pages.

### Network Timeout

**Flow**:
1. API call times out or network is unreachable
2. Catch block receives error object
3. `parseErrorMessage(error)` extracts `error.message` (e.g., "Network timeout")
4. Toast shows error message
5. Page remains on same route; user can retry

**Handling**: `try/catch` with `parseErrorMessage()`.

### Empty Lists

**Flow**:
1. Fetch returns empty array `[]`
2. Component renders "No projects yet" or similar empty state
3. User can still add new items via form/button

**Handling**: Conditional rendering (e.g., `{items.length === 0 ? <EmptyState /> : <List />}`).

### Form Validation Failure

**Flow**:
1. User submits form without filling required fields
2. Validation checks (e.g., `validateEducationForm()`) return errors
3. Toast shows first error
4. Form remains open; user can correct and resubmit

**Handling**: Pre-submit validation before API call.

### Modal Close (Escape Key or Backdrop Click)

**Flow**:
1. User presses Escape or clicks outside modal
2. `AdminModal` component (via `useEffect`) catches Escape key
3. `onClose()` prop callback fires
4. Parent component (e.g., `ProjectsPage`) sets `editingProject = null`
5. `isOpen` prop becomes false → Modal unmounts

**Handling**: Already implemented in `AdminModal.jsx`; no change needed.

---

## Validation Rules

### Project Form

- `title`: Required, non-empty string
- `slug`: Required, non-empty string (URL-safe identifier)
- `description`: Required, non-empty string
- `image`: Optional, URL string
- `category`: Optional, string (defaults to "MERN Stack")
- `technologies`: Optional, comma-separated string (converted to array)
- `githubUrl`: Optional, URL string
- `liveUrl`: Optional, URL string
- `featured`: Optional, boolean
- `status`: Optional, string (defaults to "Completed")

### Education Form

- `title`: Required, non-empty string
- `school`: Required, non-empty string
- `year`: Required, number between 1900–2099
- `endYear`: Optional, number between 1900–2099 (or null/"")
- `description`: Optional, string
- `order`: Optional, number

---

## Testability

### Unit Tests

- `formatDate()`: Input date string → Output formatted string
- `validateProjectForm()`: Input form object → Output error array or empty
- `validateEducationForm()`: Input form object → Output error array or empty
- `parseErrorMessage()`: Input error object → Output user-friendly message

### Integration Tests

- Login flow: Navigate to `/admin/login` → Enter credentials → Redirect to `/admin`
- Project CRUD: Create → Read → Update → Delete; verify list updates
- Education CRUD: Create → Read → Update → Delete; verify list updates
- Message delete: Delete message → Confirm → Message removed from list
- Routing: Click sidebar links → URL changes → Page content changes
- 401 handling: Token expires → API call fails → Redirect to `/admin/login`

### Manual Testing Checklist

1. ✓ Login as admin → Lands on `/admin/dashboard`
2. ✓ Click "Projects" → Navigate to `/admin/projects`
3. ✓ Click "Add Project" → Form appears
4. ✓ Fill form and submit → New project added to list
5. ✓ Click "Edit" on a project → Modal opens with form pre-filled
6. ✓ Update project and submit → Modal closes, list updates
7. ✓ Click "Delete" on a project → Confirm dialog → Project deleted
8. ✓ Similar flow for Education
9. ✓ Messages page: Delete message with confirmation
10. ✓ 401 test: Manually expire token → Next API call → Redirect to login
11. ✓ Browser back/forward → Navigation works correctly
12. ✓ No console errors or warnings

---

## Responses to Design Review Findings

### HIGH-1: API Endpoint Paths Mismatch

**Finding**: Design claimed standard paths (`/projects`), but code uses `/admin/`-prefixed paths.

**Response**: **ADDRESSED** — Design now explicitly specifies `/admin/`-prefixed endpoints (e.g., `GET /admin/projects`, `POST /admin/education`). This aligns with the actual backend implementation verified in `adminService.js`.

**Decision**: Use `/admin/` prefixes as the source of truth. The backend specification is final.

---

### HIGH-2: MessagesPage and DashboardPage Import from Wrong Service

**Finding**: Both pages import `getMessages()` and `deleteMessage()` from `api.js`, which uses wrong token key (`"token"` instead of `"adminToken"`).

**Response**: **ADDRESSED** — Design specifies moving messages CRUD methods from `api.js` to `adminService.js`. Both `MessagesPage` and `DashboardPage` will import from `adminService`, which uses the correct `adminToken` key.

**Updated Imports**:
```javascript
// OLD (INCORRECT):
import { getMessages, deleteMessage } from "../../services/api";

// NEW (CORRECT):
import { getMessages, deleteMessage } from "../../services/adminService";
```

---

### HIGH-3: 401 Response Interceptor Redirects to Wrong URL

**Finding**: 401 redirects to `/admin` instead of `/admin/login`, causing a double redirect.

**Response**: **ADDRESSED** — Design now specifies that `adminService.js` response interceptor should redirect directly to `/admin/login`:
```javascript
if (error.response?.status === 401) {
  clearAdminToken();
  window.location.href = "/admin/login";  // Direct to login
}
```

This prevents the `/admin` → `/admin/login` double redirect.

---

### MEDIUM-1: Form Field Name Mismatch in EducationPage

**Finding**: Validation expects keys `title`, `school`, `year`, but form uses `degree`, `institution`, `startYear`.

**Response**: **ADDRESSED** — Design now specifies corrected form field names:
| Old Key | New Key |
|---------|---------|
| `degree` | `title` |
| `institution` | `school` |
| `startYear` | `year` |

The updated form in `EducationPage` will use `title`, `school`, `year` to match `validateEducationForm()` expectations.

---

### MEDIUM-2: Inconsistent Error Handling Across Pages

**Finding**: Error handling varies by page; some use direct property access, others use generic messages.

**Response**: **ADDRESSED** — Design now specifies that all pages use `parseErrorMessage(error)` utility consistently:
```javascript
try {
  await someOperation();
} catch (error) {
  console.error(error);
  toast.error(parseErrorMessage(error));
}
```

This applies to all CRUD operations in `DashboardPage`, `ProjectsPage`, `EducationPage`, and `MessagesPage`.

---

## Summary

This revised design addresses all HIGH and MEDIUM severity findings from the design review. The implementation will:

1. ✓ Use correct `/admin/`-prefixed API endpoints
2. ✓ Move messages CRUD to `adminService.js` with correct token handling
3. ✓ Fix 401 redirect to `/admin/login` (no double redirect)
4. ✓ Align education form field names with validation utility
5. ✓ Use consistent error handling pattern across all pages

The design is concrete, implementable without architectural decisions, and ready for development.

