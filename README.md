# Exam Committee Proposal Application

This repository contains a full-stack application for managing exam committee proposals across various courses. The app includes a React frontend and an Express/MongoDB backend.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Setup & Running](#setup--running)
4. [Working Procedure](#working-procedure)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [Backend Models](#backend-models)
8. [Contributing](#contributing)

---

## Project Overview

The application allows a chairman to create, edit, and delete draft proposals for exam committees. Other roles (dean, VC, controller) can view and sign proposals to approve or cancel them. 

The express backend handles authentication, proposal management, and data persistence in MongoDB. The React frontend provides a user-friendly interface.

## Repository Structure

```
backend/
    db.js                  # MongoDB connection
    package.json
    seed.js                # optional seed data script
    server.js              # main Express server
    middleware/
        auth.js            # JWT auth and role middleware
    models/                # Mongoose schemas
        Course.js
        CourseSelection.js
        Designation.js
        Exam.js
        ExamCommittee.js
        ExamRelated.js
        External.js
        ExternalExaminer.js
        Proposal.js
        Teacher.js
        User.js
    routes/                # API endpoints
        auth.js
        committee.js
        course.js
        exam.js
        examRelated.js
        proposals.js
        summary.js
frontend/
    package.json
    public/
        index.html
    src/
        App.js
        index.css
        index.js
        api/
            service.js      # axios wrappers for backend calls
        components/         # React components for pages
            CourseSelection.js
            Dashboard.js
            ExamCommittee.js
            ExamDetails.js
            ExamRelatedTopics.js
            FinalSummary.js
            Landing.js
            Login.js
            PageLayout.js
            Signup.js
        context/            # React contexts for auth and proposal state
            AuthContext.js
            ProposalContext.js
```

## Setup & Running

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB instance

### Backend

1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with at least:
   ```env
   MONGO_URI=<your-mongo-uri>
   JWT_SECRET=<your-secret>
   PORT=5000
   ```
4. Start server:
   ```bash
   npm start
   ```
   The API will run on `http://localhost:5000` by default.

   ### Production backend

   If you have deployed the backend, you can point the frontend to it by setting `REACT_APP_API_BASE` to the backend URL (for example: `https://exam-committee-proposal-for-various.vercel.app`). The frontend defaults to that URL when the environment variable is not set.

### Frontend

1. Navigate to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) set `REACT_APP_API_BASE` in `.env` if API is on a different host/port.
4. Start development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000` and proxy API requests to backend.

## Working Procedure

1. **Signup/Login**
   - Users register with a name, email, password, and designation (`chairman`, `dean`, `vc`, or `controller`).
   - Upon login, a JWT token is stored in local storage and used for authenticated calls.

2. **Chairman Dashboard**
   - Can create new draft proposals.
   - Drafts are editable and can be deleted using the "Delete" button.
   - Drafts transition to `pending_dean` after signing.

3. **Proposal Flow**
   - Chairman fills out exam details, course selection, committee, and exam-related topics.
   - After finalizing, the chairman signs and moves the proposal for dean approval.
   - Dean, VC, and controller review proposals based on status and add their signatures.
   - If any approver cancels, status becomes `cancelled`.
   - Approved proposals are viewable in final summary.

4. **API Interaction**
   - Frontend uses `src/api/service.js` to call endpoints such as `proposals/`, `auth/`, etc.
   - Axios instance automatically adds `Authorization` header from local storage token.

## API Endpoints

| Method | Route                       | Description                                 | Role        |
|--------|-----------------------------|---------------------------------------------|-------------|
| POST   | `/api/auth/signup`          | Register a new user                         | public      |
| POST   | `/api/auth/login`           | Authenticate and receive token              | public      |
| GET    | `/api/auth/me`              | Get current user                            | authenticated |
| GET    | `/api/proposals`            | List proposals (filtered by role)           | authenticated |
| POST   | `/api/proposals`            | Create draft proposal                       | chairman    |
| DELETE | `/api/proposals/:id`        | Delete a draft                              | chairman    |
| PUT    | `/api/proposals/:id`        | Update draft fields                         | chairman    |
| POST   | `/api/proposals/:id/sign`   | Upload signature/advance status             | authenticated |
| POST   | `/api/proposals/:id/cancel` | Cancel a pending proposal                   | authenticated |
| GET    | `/api/summary`              | Fetch aggregated counts for dashboard       | authenticated |
| ...    | other resource routes        | course, exam, committee, exam-related data  | various     |

## Frontend Components

- `Landing.js` – initial page with login/signup links.
- `Login.js` / `Signup.js` – user authentication forms.
- `Dashboard.js` – shows proposals relevant to the user; includes delete functionality for drafts.
- `ExamDetails.js`, `CourseSelection.js`, `ExamCommittee.js`, `ExamRelatedTopics.js` – wizard steps for proposal creation.
- `FinalSummary.js` – review and sign/cancel actions for proposals.
- `PageLayout.js` – common layout wrapper.

## Backend Models

Each Mongoose model corresponds to collections used for storing proposal data:

- `User` – user accounts with designation.
- `Proposal` – holds all proposal data and signatures.
- Additional models link to specific parts of the form (e.g., `Exam`, `CourseSelection`, etc.) used for embedding subdocuments.

## Contributing

1. Fork the repository and create a branch for your feature or bugfix.
2. Ensure consistent code style and add comments where necessary.
3. Run the application locally and test thoroughly.
4. Submit a pull request with a clear description of your changes.

---

Feel free to extend or modify this README as the project evolves!