const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DB_FILE = path.join(__dirname, 'db.json');

app.use(bodyParser.json());
app.use(cors()); // <-- CORRIGIDO

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

    // CORRIGIDO: salvar o objeto data diretamente
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

    res.status(201).json(novaTarefa);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});