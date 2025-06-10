const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Caminho para o arquivo JSON
const mockTasksPath = path.join(__dirname, 'mockTasks.json');

// Função auxiliar para ler tarefas do arquivo JSON
const readTasks = () => {
  try {
    return JSON.parse(fs.readFileSync(mockTasksPath, 'utf8'));
  } catch (error) {
    console.error('Erro ao ler tarefas:', error);
    throw new Error('Erro ao ler tarefas');
  }
};

// Função auxiliar para salvar tarefas no arquivo JSON
const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(mockTasksPath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Erro ao salvar tarefas:', error);
    throw new Error('Erro ao salvar tarefas');
  }
};

// Endpoint para obter todas as tarefas
app.get('/tasks', (req, res) => {
  try {
    const tasks = readTasks();
    res.json(tasks); // Retorna todas as tarefas, incluindo a descrição
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter tarefas' });
  }
});

// Endpoint para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
  try {
    const tasks = readTasks();
    const newTask = {
      id: tasks.length + 1,
      title: req.body.title,
      description: req.body.description, // Inclui a descrição
      completed: false,
    };

    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    res.status(500).json({ error: 'Erro ao adicionar tarefa' });
  }
});

// Atualizar tarefa
app.put('/tasks/:id', (req, res) => {
  try {
    console.log('ID recebido:', req.params.id);
    console.log('Dados recebidos:', req.body);

    const tasks = readTasks();
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    const updatedTask = { ...tasks[taskIndex], ...req.body };
    tasks[taskIndex] = updatedTask;

    writeTasks(tasks);
    res.json(updatedTask);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// Excluir tarefa
app.delete('/tasks/:id', (req, res) => {
  try {
    const tasks = readTasks();
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
    res.status(204).send(); 
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
});

// Iniciar o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});