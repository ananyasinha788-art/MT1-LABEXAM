import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

let tasks = [
    { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending" },
    { id: 2, taskName: "Design Dashboard", assignedTo: "Priya Verma", status: "In Progress" },
    { id: 3, taskName: "Write API Documentation", assignedTo: "Amit Kumar", status: "Completed" }
];

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data, null, 2));
}

function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
            if (body.length > 1_000_000) {
                reject(new Error("Request body is too large"));
                req.destroy();
            }
        });
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error("Invalid JSON body"));
            }
        });
        req.on("error", reject);
    });
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const route = url.pathname;

    if (req.method === "GET" && route === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Welcome to Employee Task Management</h1><p>Node.js HTTP Server is running.</p><p>Visit <a href='/tasks'>/tasks</a> or <a href='/home'>/home</a>.</p>");
        return;
    }

    if (req.method === "GET" && route === "/tasks") {
        sendJSON(res, 200, tasks);
        return;
    }

    if (req.method === "POST" && route === "/add-task") {
        try {
            const task = await readRequestBody(req);
            const requiredFields = ["id", "taskName", "assignedTo", "status"];
            const missingFields = requiredFields.filter(field =>
                task[field] === undefined || task[field] === null || String(task[field]).trim() === ""
            );

            if (missingFields.length) {
                sendJSON(res, 400, { message: "Missing required task details", missingFields });
                return;
            }
            if (!Number.isInteger(Number(task.id)) || Number(task.id) <= 0) {
                sendJSON(res, 400, { message: "Task id must be a positive integer" });
                return;
            }
            if (tasks.some(item => item.id === Number(task.id))) {
                sendJSON(res, 409, { message: "A task with this id already exists" });
                return;
            }

            const newTask = {
                id: Number(task.id),
                taskName: String(task.taskName).trim(),
                assignedTo: String(task.assignedTo).trim(),
                status: String(task.status).trim()
            };
            tasks.push(newTask);
            sendJSON(res, 201, { message: "Task added successfully", task: newTask });
        } catch (error) {
            sendJSON(res, 400, { message: error.message });
        }
        return;
    }

    if (req.method === "GET" && route === "/about") {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Employee Task Management Application built using Node.js HTTP and FS modules.");
        return;
    }

    if (req.method === "GET" && route === "/home") {
        const filePath = path.join(__dirname, "public", "index.html");
        fs.readFile(filePath, "utf8", (error, data) => {
            if (error) {
                sendJSON(res, 500, { message: "Unable to read the home page", error: error.message });
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(data);
        });
        return;
    }

    sendJSON(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
