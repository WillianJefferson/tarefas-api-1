const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Função para ler o arquivo JSON
async function lerTarefas() {
    try {
        const dados = await fs.readFile(DB_FILE, 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        return { tarefas: [] };
    }
}

// Função para salvar no arquivo JSON
async function salvarTarefas(dados) {
    await fs.writeFile(DB_FILE, JSON.stringify(dados, null, 4), 'utf-8');
}

// Rota de teste
app.get('/teste', (req, res) => {
    res.json({ mensagem: 'API funcionando!' });
});

// Rota para listar todas as tarefas
app.get('/tarefas', async (req, res) => {
    try {
        const dados = await lerTarefas();
        res.json(dados.tarefas);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar tarefas' });
    }
});

// Rota para criar uma nova tarefa
app.post('/tarefas', async (req, res) => {
    try {
        const { tarefa, descricao } = req.body;
        if (!tarefa) {
            return res.status(400).json({ erro: 'Nome da tarefa é obrigatório' });
        }

        const dados = await lerTarefas();
        const novaTarefa = {
            id: Date.now(),
            tarefa,
            descricao: descricao || '',
            dataCriacao: new Date().toISOString()
        };

        dados.tarefas.push(novaTarefa);
        await salvarTarefas(dados);
        res.status(201).json(novaTarefa);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar tarefa' });
    }
});

// Rota para remover uma tarefa
app.delete('/tarefas/:id', async (req, res) => {
    try {
        const dados = await lerTarefas();
        const tarefaId = parseInt(req.params.id);
        
        const tarefaIndex = dados.tarefas.findIndex(t => t.id === tarefaId);
        if (tarefaIndex === -1) {
            return res.status(404).json({ erro: 'Tarefa não encontrada' });
        }

        dados.tarefas.splice(tarefaIndex, 1);
        await salvarTarefas(dados);
        res.status(204).send();
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao remover tarefa' });
    }
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});