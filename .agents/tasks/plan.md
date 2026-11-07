# Implementation Plan: Connect Portfolio Backend and Frontend for Local Development

## Project Context

**Backend:**
- Express server (d:\Devlopment\portfolio\backend)
- Runs on port 5000
- CORS configured for http://localhost:5173
- Key routes: /api/projects, /api/messages, /api/auth, /api/users, /api/admin
- Built with: Express, MongoDB, Mongoose, JWT auth

**Frontend:**
- Vite React app (d:\Devlopment\portfolio\frontend)
- Runs on port 5173 (default Vite dev server)
- API service: src/services/api.js (uses axios with baseURL from VITE_API_URL)
- Admin service: src/services/adminService.js (also uses VITE_API_URL)
- Currently points to production: https://vish-portfolio-api.onrender.com

**Current issue:** Frontend is hardcoded to production API; cannot test against local backend.

---

## Implementation Plan

- [ ] 1. Create .env.local for local development
      Add VITE_API_URL=http://localhost:5000 to enable frontend to connect to local backend.
      Files: d:\Devlopment\portfolio\frontend\.env.local
      Verify: File exists with correct content and .env.local is in .gitignore (if applicable).

- [ ] 2. Verify backend CORS configuration
      Backend already has CORS configured for http://localhost:5173 in server.js, which matches the frontend dev server port. No changes needed.
      Files: d:\Devlopment\portfolio\backend\server.js (read-only verification)
      Verify: Confirm CORS origin line 19 shows "http://localhost:5173".

- [ ] 3. Test local connection between backend and frontend
      Start backend on port 5000 and frontend on port 5173, then verify a test API call succeeds.
      Files: none (manual test)
      Verify: 
        - Backend: npm run dev (or npm start) in backend/ → "Server running on port 5000"
        - Frontend: npm run dev in frontend/ → "Local: http://localhost:5173"
        - Frontend console: make a test call to GET http://localhost:5000 (e.g., fetch projects or call / health endpoint) and confirm no CORS errors.

- [ ] 4. Create development setup guide (markdown)
      Document how to run both servers locally, switch between production/local APIs, and list common endpoints.
      Files: d:\Devlopment\portfolio\LOCAL_DEV_SETUP.md (or d:\Devlopment\portfolio\DEVELOPMENT.md)
      Verify: File created with clear instructions for: (a) running both servers, (b) using .env.local, (c) switching back to production, (d) common API endpoints.

---

## Common API Endpoints Reference

### Public Endpoints (no auth required)
- `GET /api/projects` - Fetch all projects
- `GET /api/projects/featured` - Fetch featured projects
- `GET /api/projects/:id` - Fetch a single project
- `POST /api/messages` - Submit a contact message
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Admin Endpoints (requires bearer token)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/projects` - Get projects (admin view)
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project
- `GET /api/admin/education` - Get education entries
- `POST /api/admin/education` - Create education entry
- `PUT /api/admin/education/:id` - Update education entry
- `DELETE /api/admin/education/:id` - Delete education entry
- `GET /api/admin/messages` - Get contact messages
- `DELETE /api/admin/messages/:id` - Delete a message

### Frontend API Service Files
- **src/services/api.js** - Main API client (public/user endpoints with auth interceptor)
- **src/services/adminService.js** - Admin API client (admin endpoints with 401 redirect handling)

Both use `import.meta.env.VITE_API_URL` from environment variables.

---

## Notes

- .env.local will be loaded by Vite automatically when running `npm run dev` in the frontend, overriding VITE_API_URL from .env
- The backend already supports CORS for the local frontend port (5173)
- Token is stored in localStorage and attached to requests via interceptor
- 401 responses in admin endpoints trigger logout and redirect to /admin/login
