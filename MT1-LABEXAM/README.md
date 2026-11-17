# MT1-LABEXAM – Employee Task Management Web Application

Solution for the Full Stack Development Node.js lab examination.

## Requirements
- Node.js (LTS recommended)
- npm

## Project setup
Open a terminal in this folder and run:

```bash
npm install
```

## Part A – Node.js HTTP server (port 3000)
Run:

```bash
node httpServer.js
```

Open these URLs:
- http://localhost:3000/
- http://localhost:3000/tasks
- http://localhost:3000/about
- http://localhost:3000/home

To test adding a task, send a `POST` request to `http://localhost:3000/add-task` with header `Content-Type: application/json` and body:

```json
{
  "id": 4,
  "taskName": "Develop REST API",
  "assignedTo": "Amit Kumar",
  "status": "Pending"
}
```

## Part B – Express REST API (port 4000)
Open a **second terminal** in this folder and run:

```bash
node expressApp.js
```

Test these endpoints using EchoAPI, Postman, or another API client:

| Method | URL | Purpose |
|---|---|---|
| GET | http://localhost:4000/tasks | Get all tasks |
| GET | http://localhost:4000/tasks/1 | Get task with ID 1 |
| POST | http://localhost:4000/tasks | Add a task |
| PUT | http://localhost:4000/tasks/1 | Update task 1 |
| DELETE | http://localhost:4000/tasks/1 | Delete task 1 |

### Sample POST body
```json
{
  "id": 4,
  "taskName": "Develop REST API",
  "assignedTo": "Amit Kumar",
  "status": "Pending",
  "priority": "Medium"
}
```

### Sample PUT body
```json
{
  "taskName": "Develop Login Page",
  "assignedTo": "Rahul Sharma",
  "status": "Completed",
  "priority": "High"
}
```

The applications use in-memory JavaScript arrays; changes reset when the respective server is restarted. Both servers run independently.

## Screenshots and GitHub submission
Save your actual terminal, browser, and EchoAPI screenshots in the `screenshots/` folder. See `screenshots/README.txt` for the checklist.

For GitHub submission, create a repository named `MT1-LABEXAM`, then commit and push this project. Example commands:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin <your-github-repository-url>
git push -u origin main
```

Make further commits after completing/testing each module. Do not upload `node_modules`.
