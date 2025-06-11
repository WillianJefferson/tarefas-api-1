const cors = require('cors');
// importar o framework para gerenciar o servidor e as rotas
const express = require('express');
// importar o body-parser para analisar o corpo das requisições
const bodyParser = require('body-parser');
// importar o módulo fs para manipular o sistema de arquivos
const fs = require('fs');
// importar o módulo path para manipular caminhos de arquivos
const path = require('path');
// criar uma instância do express
const app = express();
// criar uma variável para armazenar a porta do servidor
const PORT = 3000;

// criar uma variável para armazenar o caminho do arquivo de tarefas
const DB_FILE = path.join(__dirname, 'db.json');

// configurar o body-parser para analisar o corpo das requisições
app.use(bodyParser.json());

app.use(cors());

// configurar o express para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
// verificar se o arquivo de tarefas existe
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({tarefas: []}));
}

//-----------ROTAS-----------


// rota para listar todas as tarefas
app.get('/tarefas', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(data.tarefas);
});

// rota para criar uma nova tarefa 
app.post('/tarefas', (req, res) => {
    // obter os dados da tarefa do corpo da requisição
    const {tarefa, descricao} = req.body;

    if (!tarefa || !descricao) {
        return res.status(400).json({message: 'Tarefa e descrição são obrigatórios'});
    }
    // ler o arquivo de tarefas
    const data = JSON.parse(fs.readFileSync(DB_FILE));

    const novaTarefa = {
        id: Date.now(),
        tarefa,
        descricao,
        dataCriacao: new Date().toISOString()//Salvar a data e hora da criação da tarefa
    };
    // adicionar a nova tarefa ao array de tarefas
    data.tarefas.push(novaTarefa);
    // escrever o arquivo de tarefas
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    // enviar a resposta com status 201 e a nova tarefa
    res.status(201).json(novaTarefa);
});

app.put('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { tarefa, descricao } = req.body;

    if (!tarefa || !descricao) {
        return res.status(400).json({ message: 'Tarefa e descrição são obrigatórios' });
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE));
    const tarefaIndex = data.tarefas.findIndex(t => t.id === id);

    if (tarefaIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    data.tarefas[tarefaIndex].tarefa = tarefa;
    data.tarefas[tarefaIndex].descricao = descricao;

    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

    res.json(data.tarefas[tarefaIndex]);
});

app.delete('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    const tarefaIndex = data.tarefas.findIndex(t => t.id === id);

    if (tarefaIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const tarefaRemovida = data.tarefas.splice(tarefaIndex, 1)[0];
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

    res.json(tarefaRemovida);
});



// iniciar o servidor na porta 3000
app.listen(PORT, () => {
    console.log('Servidor rodando na porta 3000');
});