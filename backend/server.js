// === backend/server.js ===
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DB_FILE = path.join(__dirname, 'db.json');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ tarefas: [] }, null, 2));
}

app.get('/tarefas', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(data.tarefas);
});

app.post('/tarefas', (req, res) => {
    const { tarefa, descricao } = req.body;
    if (!tarefa || !descricao) {
        return res.status(400).json({ message: 'Tarefa e descrição são obrigatórios' });
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE));
    const novaTarefa = {
        id: Date.now(),
        tarefa,
        descricao,
        dataCriacao: new Date().toISOString()
    };
    data.tarefas.push(novaTarefa);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(novaTarefa);
});

app.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const { tarefa, descricao } = req.body;
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    const index = data.tarefas.findIndex(t => t.id == id);

    if (index === -1) return res.status(404).json({ message: 'Tarefa não encontrada' });

    data.tarefas[index].tarefa = tarefa;
    data.tarefas[index].descricao = descricao;

    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.json(data.tarefas[index]);
});

app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    const novaLista = data.tarefas.filter(t => t.id != id);

    if (novaLista.length === data.tarefas.length)
        return res.status(404).json({ message: 'Tarefa não encontrada' });

    fs.writeFileSync(DB_FILE, JSON.stringify({ tarefas: novaLista }, null, 2));
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});