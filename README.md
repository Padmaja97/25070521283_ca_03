# FLEX GYM — Fitness & Membership Management

A full-stack MERN-style college mini-project for **FLEX GYM, Gorewada Road, Nagpur, Maharashtra**. The project includes a responsive public gym website, member registration and login, membership applications, enquiry storage, and a role-protected admin management dashboard backed by MongoDB.

> **Demonstration content:** membership prices, benefits, trainer biographies/photos, and the hours created by `npm run seed:demo` are sample values for project demonstration. They are clearly marked in the app. Confirm and replace them with actual gym information before presenting them as facts. No phone number, exact street address, official accounts, awards, or verified testimonials are invented.

## Abstract

FLEX GYM provides a single website for visitors to learn about the gym, view available membership options, and submit enquiries. Registered members can apply for a plan and privately track the status and dates of their applications. Administrators can manage plans and trainers, review member and enquiry records, approve or reject applications, and maintain public gym location and hours. Express APIs enforce authorization and validation, while MongoDB stores all application data.

## Problem statement

Gym information, membership requests, and follow-up enquiries can be difficult to manage when they are spread across informal channels. This project demonstrates how a web application can organize those workflows and provide members with a clear application status without representing an application as a paid membership.

## Objectives

- Build a responsive, professional public gym website.
- Implement member registration, login, and server-verified roles.
- Save membership enquiries and applications in MongoDB.
- Let members see only their own profile and membership history.
- Give authorized administrators tools to manage records and public information.
- Demonstrate password hashing, JWT authentication, validation, and REST API structure.

## Features

### Public website

- Editorial **“ENTER YOUR NEXT FORM”** visual direction with charcoal, warm off-white, metallic details, and a restrained signal-red accent across the home, about, memberships, trainers, and contact pages.
- A lightweight, procedural Three.js metallic sculpture in the homepage hero, with pointer and scroll response, responsive sizing, and a CSS fallback when WebGL is unavailable.
- Membership plans, trainers, and gym settings are fetched from the API/database.
- Contact and feedback forms save enquiries to MongoDB.
- Location is limited to the supplied general area. Current hours are editable sample data until the owner confirms them.
- Sample prices, trainers, and testimonial copy are labelled as demonstrations.

### Member account

- Register as a member and sign in/out.
- View and update permitted profile fields.
- Apply for an active membership plan. Duplicate pending applications are rejected.
- Privately view application status and approved start/end dates.
- Submit an enquiry from the member dashboard.
- An application is **not** a payment or an automatically active paid membership.

### Admin account

- Database-backed overview statistics and recent activity.
- Search registered members.
- Review applications and approve/reject them. On approval, set a start date; the end date is calculated using the selected plan duration.
- Create, edit, deactivate, or safely delete plans. Plans with application history cannot be deleted.
- Create, edit, and remove trainer listings.
- View enquiries and mark them handled/reopen them.
- Edit the public location and hours.
- Admin registration is not available in the public interface; create the first admin using the local CLI command below.

## Technology stack

- **Client:** React, Vite, JavaScript, React Router, Axios, Three.js, Lucide icons, CSS.
- **Server:** Node.js, Express, Mongoose, JWT, bcryptjs, express-validator, Helmet, CORS, express-rate-limit.
- **Database:** MongoDB Atlas (MongoDB-compatible URI).

## Architecture

```text
Browser (React / Vite)
  └── Axios + Bearer JWT
      └── Express REST API
          ├── Authentication / role middleware
          ├── Request validation
          └── Mongoose models
              └── MongoDB Atlas
```

Public pages use public API endpoints for plans, trainers, gym details, and contact enquiries. Member endpoints scope applications and profile updates to the authenticated user. Admin endpoints check the `admin` role on the server for every protected management action.

## Folder structure

```text
Flex-Gym/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 20+ and npm.
- MongoDB Atlas cluster (or a local MongoDB connection URI).
- Atlas database user and a network access rule allowing the development machine.

## MongoDB Atlas and environment setup

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with a strong password. This is separate from the Atlas website login.
3. Configure **Network Access** to allow your current IP. Do not use an unrestricted rule for a production deployment.
4. Choose **Connect → Drivers → Node.js** and copy the MongoDB connection string.
5. From `server`, copy `.env.example` to `.env`. Edit the copy locally:

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://<database-user>:<url-encoded-password>@<cluster-host>/flexgym?retryWrites=true&w=majority
MONGODB_DNS_SERVERS=
JWT_SECRET=<a-long-random-secret-at-least-32-characters>
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Use an URL-encoded database password if it contains reserved URI characters. Generate a random JWT secret in PowerShell with:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

If the computer's configured DNS resolver cannot look up MongoDB Atlas SRV records, `MONGODB_DNS_SERVERS` may be set to comma-separated DNS server IPs supported by your network (for example, `1.1.1.1,8.8.8.8`). Leave it blank when the system resolver works.

6. Optionally copy `client/.env.example` to `client/.env` and set `VITE_API_URL=http://localhost:5000/api` if the API is not at its default address.

Environment files are ignored by Git. Never commit actual credentials or paste them into public issues or screenshots. With no server `.env`, the API deliberately exits with a clear configuration error; it never pretends that a form was saved.

## Install and run (two terminals)

Open two PowerShell terminals in the project root.

### Terminal 1 — backend

```powershell
cd server
npm install
npm run seed:demo
npm run create-admin
npm run dev
```

`npm run seed:demo` inserts sample plans, sample trainer profiles, and sample hours only where those named records do not already exist. Review/edit those records through the admin dashboard. `npm run create-admin` prompts interactively for an admin name, email, and a password that is not echoed in a TTY. It does not expose a public admin-signup endpoint. To reset an existing admin account's password, run `npm run reset-admin-password` from `server`; enter the account email and new password at the prompts. The reset command only changes an existing admin account.

The server waits for a successful MongoDB connection before listening on port `5000`. Check `http://localhost:5000/api/health` after it starts.

### Terminal 2 — frontend

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`. First register a member through the public site. Use the admin account created from Terminal 1 to access `/admin`.

For a production client bundle, run `npm run build` in `client`.

## API documentation

Prefix: `/api`. Protected requests use `Authorization: Bearer <JWT>`. JSON validation failures include a `message` and an `errors` list. Passwords and secrets are never returned.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | Health response after database connection |
| `POST` | `/auth/register` | Public | Register a member (`name`, `email`, `password`, optional `phone`) |
| `POST` | `/auth/login` | Public | Authenticate with email/password |
| `GET` | `/auth/me` | Signed-in user | Return current profile |
| `PATCH` | `/auth/me` | Signed-in user | Update own name/phone |
| `GET` | `/settings` | Public | Read location and hours |
| `GET` | `/plans` | Public / admin | List active plans; admin token includes inactive plans |
| `POST` | `/plans` | Admin | Create plan |
| `PUT` | `/plans/:id` | Admin | Edit or deactivate plan |
| `DELETE` | `/plans/:id` | Admin | Delete only if no applications reference it |
| `GET` | `/trainers` | Public / admin | List active trainer profiles; admin token includes inactive |
| `POST` | `/trainers` | Admin | Create trainer profile |
| `PUT` | `/trainers/:id` | Admin | Edit trainer profile |
| `DELETE` | `/trainers/:id` | Admin | Delete trainer profile |
| `POST` | `/memberships` | Member | Apply using `{ "planId": "<id>" }` |
| `GET` | `/memberships/my` | Member | View only this member's applications |
| `GET` | `/memberships` | Admin | View all applications |
| `PATCH` | `/memberships/:id/status` | Admin | Approve/reject; optional `startDate` on approval |
| `POST` | `/enquiries` | Public | Save a contact enquiry |
| `GET` | `/enquiries` | Admin | View enquiries |
| `PATCH` | `/enquiries/:id/status` | Admin | Mark `New` or `Handled` |
| `GET` | `/admin/dashboard` | Admin | Database-backed statistics and recent activity |
| `GET` | `/admin/members?search=` | Admin | Search member directory |
| `GET` | `/admin/settings` | Admin | Read editable gym information |
| `PUT` | `/admin/settings` | Admin | Update location and opening hours |

Expected status codes include `201` for creation, `400` for invalid input, `401` for missing/invalid login, `403` for insufficient role, `404` for missing records/routes, and `409` for duplicate/conflicting operations.

## MongoDB collections

- **users:** name, unique normalized email, bcrypt hash, optional phone, role (`member`/`admin`), creation date.
- **membershipplans:** name, duration in days, INR price, benefits, active flag, sample marker, timestamps.
- **membershipapplications:** member and plan references, `Pending`/`Approved`/`Rejected` status, optional membership dates, timestamps.
- **trainers:** name, specialization, experience, biography, optional HTTPS image, active/sample flags, timestamps.
- **enquiries:** name, email, optional phone, message, `New`/`Handled` status, timestamps.
- **gymsettings:** singleton editable location and opening hours; sample-hours marker.

## Testing checklist

With valid MongoDB credentials and a reachable Atlas cluster:

1. Register a member and confirm the account appears in the `users` collection with a password hash (not a plaintext password).
2. Log in successfully; try a wrong password and confirm a `401` response.
3. Load plans and trainers; confirm they come from the seeded MongoDB records.
4. Submit a membership application; confirm it is stored with `Pending`, then check it appears in the member dashboard.
5. Sign in as admin, approve the application with a start date, and confirm the end date uses the selected plan duration. Verify the member sees the updated dates and status.
6. Reject another pending application and verify its dates remain empty.
7. Submit a public contact enquiry; verify it appears in the admin inbox and can be marked handled.
8. Use a member token against `/api/admin/dashboard` or `GET /api/memberships`; the server should return `403`.
9. Verify a member cannot request another member’s private application data: the member API exposes `/memberships/my` and scopes it by token identity.
10. Send invalid email, too-short password, invalid plan ID, and invalid form values; verify server validation responses.
11. Try deleting a plan referenced by an application; confirm it is refused and can instead be deactivated.
12. Edit public hours from the admin dashboard and confirm the website reads the saved value.

Database workflows require your own credentials and were not claimed as tested if no Atlas connection is configured. The frontend build and source-level checks should be run locally as part of the submission verification.

## Screenshots for the college report

1. Home hero and navigation at desktop width.
2. Home membership cards showing the sample-price disclaimer.
3. About and trainer pages showing sample-content labels.
4. Contact page and submitted-enquiry success state.
5. Member registration and login pages.
6. Member dashboard showing a pending application.
7. Admin dashboard overview and database-backed statistics.
8. Admin application review and approval/date entry.
9. Admin plan/trainer management and gym-hours editor.
10. Mobile-width home page and navigation.

Use demonstration accounts only in report screenshots. Do not expose credentials, real member phone numbers, private enquiries, MongoDB URIs, or JWT secrets.

## Viva questions and answers

**1. What is the purpose of this project?**  
It demonstrates a gym website and membership workflow. Visitors can enquire, members can apply for plans and track decisions, and authorized administrators can manage gym records.

**2. What does MERN stand for?**  
MongoDB, Express.js, React, and Node.js. MongoDB stores documents, Express/Node handle API requests, and React renders the client interface.

**3. Why is the password hashed?**  
A bcrypt hash means the original password is not stored. Even if a database copy is exposed, the password is not directly readable.

**4. What is a JWT used for here?**  
After login, the server signs a token identifying the user. The client sends it on protected API requests, and middleware verifies it before continuing.

**5. How is an admin route protected?**  
The API first authenticates the token, then checks the stored account role using authorization middleware. Hiding an admin link in React is not treated as security.

**6. How are private applications kept private?**  
The member endpoint filters applications using the authenticated user's database ID. The client cannot choose another user's ID for that route.

**7. What happens when a member applies for a plan?**  
The API checks that the plan exists and is active, then saves a `Pending` application. It does not take payment or activate a paid membership.

**8. How is the application end date calculated?**  
When an administrator approves an application, the server stores the chosen start date and adds the referenced plan's `durationInDays`.

**9. What does Mongoose do?**  
Mongoose maps JavaScript models to MongoDB collections and provides schema validation, references, timestamps, and query helpers.

**10. Why do form validations exist on both client and server?**  
Client validation provides quicker feedback. Server validation is authoritative because requests can bypass the browser interface.

**11. What is an environment variable?**  
It is configuration supplied outside source code. This project uses environment variables for the MongoDB URI, JWT secret, and API/client settings so secrets are not committed.

**12. What are the current limitations?**  
There is no payment processing, email notification, password reset, or real-time update. Prices, trainers, and default gym hours are explicitly sample content until confirmed.

## Limitations and future scope

- No payment gateway or automatic paid/active membership workflow.
- No email, SMS, or push notifications when application status changes.
- Password recovery and secure HttpOnly cookie sessions are future improvements.
- Add pagination and audit logs as member, application, and enquiry volume grows.
- Replace all demo prices, trainer profiles, and hours with owner-confirmed information.
- Production deployment should use HTTPS, managed secrets, strict CORS, and a least-privilege MongoDB user.

## Existing GitHub submission repository

This workspace was inspected and currently has **no `.git` directory** and no configured Git remote. No repository was initialized and nothing was pushed. From the existing submission repository, copy/merge this project into its intended folder, then check the diff before committing:

```powershell
git status --short --branch
git remote -v
git add README.md .gitignore client server
git diff --cached --stat
git diff --cached
git commit -m "Build Flex Gym membership management website"
git push <existing-remote-name> <existing-branch-name>
```

Replace the final placeholders with the remote and branch already configured in your existing submission repository. Review staged files to ensure `.env`, `node_modules`, and `dist` are not included. Do not run `git init` or create a new GitHub repository for this project.
