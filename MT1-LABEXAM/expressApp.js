import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let tasks = [
    { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending", priority: "High" },
    { id: 2, taskName: "Design Dashboard", assignedTo: "Priya Verma", status: "In Progress", priority: "Medium" },
    { id: 3, taskName: "Write API Documentation", assignedTo: "Amit Kumar", status: "Completed", priority: "Low" }
];

function validateTask(body, requireId = false) {
    const required = requireId
        ? ["id", "taskName", "assignedTo", "status"]
        : ["taskName", "assignedTo", "status"];
    return required.filter(field =>
        body[field] === undefined || body[field] === null || String(body[field]).trim() === ""
    );
}

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Employee Task Management REST API" });
});

// Retrieve all tasks
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// Retrieve one task by ID
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(item => item.id === id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
});

// Add a task
app.post("/tasks", (req, res) => {
    const missingFields = validateTask(req.body, true);
    if (missingFields.length) {
        return res.status(400).json({ message: "Missing required task details", missingFields });
    }

    const id = Number(req.body.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Task id must be a positive integer" });
    }
    if (tasks.some(item => item.id === id)) {
        return res.status(409).json({ message: "A task with this id already exists" });
    }

    const newTask = {
        id,
        taskName: String(req.body.taskName).trim(),
        assignedTo: String(req.body.assignedTo).trim(),
        status: String(req.body.status).trim(),
        priority: req.body.priority ? String(req.body.priority).trim() : "Medium"
    };
    tasks.push(newTask);
    res.status(201).json({ message: "Task added successfully", task: newTask });
});

// Update task details
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(item => item.id === id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    const allowedFields = ["taskName", "assignedTo", "status", "priority"];
    const suppliedFields = allowedFields.filter(field => req.body[field] !== undefined);
    if (suppliedFields.length === 0) {
        return res.status(400).json({ message: "Provide at least one field to update" });
    }

    for (const field of suppliedFields) {
        if (typeof req.body[field] !== "string" || req.body[field].trim() === "") {
            return res.status(400).json({ message: `${field} must be a non-empty string` });
        }
    }

    for (const field of suppliedFields) {
        task[field] = req.body[field].trim();
    }
    res.status(200).json({ message: "Task updated successfully", task });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    const deletedTask = tasks.splice(index, 1)[0];
    res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
});

// Handle malformed JSON and other errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON request body" });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});
