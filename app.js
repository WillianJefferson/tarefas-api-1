const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

// Banco de dados em memória
let users = [];
let tasks = {};

// Middleware para verificar login
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// Rotas
app.get("/", (req, res) => {
  res.render("index", { user: req.session.user });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.send("Usuário já existe!");
  }
  users.push({ username, password });
  tasks[username] = [];
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send("Usuário ou senha inválidos.");
  req.session.user = username;
  res.redirect("/tasks");
});

app.get("/tasks", checkAuth, (req, res) => {
  const userTasks = tasks[req.session.user];
  res.render("tasks", { tasks: userTasks, user: req.session.user });
});

app.post("/tasks", checkAuth, (req, res) => {
  const { task } = req.body;
  tasks[req.session.user].push(task);
  res.redirect("/tasks");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
