
const express = require('express');
const app = express();
const port = 3000;

// View engine
app.set('view engine', 'ejs');

// Middleware para ler dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Lista de tarefas na memória
let tasks = [];

// Página principal: mostra todas as tarefas
app.get('/', (req, res) => {
  res.render('index', { tasks });
});

// Adiciona nova tarefa
app.post('/add-task', (req, res) => {
  const { task } = req.body;
  if (task) {
    tasks.push({ id: Date.now(), task });
  }
  res.redirect('/');
});

// Renderiza a página de edição de tarefa
app.get('/edit-task/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (task) {
    res.render('edit', { task });
  } else {
    res.redirect('/');
  }
});

// Atualiza a tarefa
app.post('/edit-task/:id', (req, res) => {
  const id = req.params.id;
  const { task } = req.body;
  tasks = tasks.map(t => (t.id == id ? { ...t, task } : t));
  res.redirect('/');
});

// Exclui a tarefa
app.post('/delete-task/:id', (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.redirect('/');
});

// Inicia servidor
app.listen(port, () => {
  console.log(`Servidor rodando: http://localhost:${port}`);
});
