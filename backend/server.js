const cors = require('cors');
<<<<<<< HEAD
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Configurações
app.use(bodyParser.json());
app.use(cors()); // Corrigido: agora está invocando a função
app.use(express.static(path.join(__dirname, '../frontend')));

// Verificar se o arquivo de tarefas existe
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ tarefas: [] }));
}

// Rotas
=======
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

app.use(cors);

// configurar o express para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
// verificar se o arquivo de tarefas existe
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({tarefas: []}));
}

//-----------ROTAS-----------


// rota para listar todas as tarefas
>>>>>>> 282a95e689f1a41f9c58fe8b5e240ec5d3c19d23
app.get('/tarefas', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(data.tarefas);
});

<<<<<<< HEAD
app.post('/tarefas', (req, res) => {
    const { tarefa, descricao } = req.body;

    if (!tarefa || !descricao) {
        return res.status(400).json({ message: 'Tarefa e descrição são obrigatórios' });
    }

=======
// rota para criar uma nova tarefa 
app.post('/tarefas', (req, res) => {
    // obter os dados da tarefa do corpo da requisição
    const {tarefa, descricao} = req.body;

    if (!tarefa || !descricao) {
        return res.status(400).json({message: 'Tarefa e descrição são obrigatórios'});
    }
    // ler o arquivo de tarefas
>>>>>>> 282a95e689f1a41f9c58fe8b5e240ec5d3c19d23
    const data = JSON.parse(fs.readFileSync(DB_FILE));

    const novaTarefa = {
        id: Date.now(),
        tarefa,
        descricao,
<<<<<<< HEAD
        dataCriacao: new Date().toISOString()
    };

    data.tarefas.push(novaTarefa);
    
    
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    
    res.status(201).json(novaTarefa);
});

=======
        dataCriacao: new Date().toISOString()//Salvar a data e hora da criação da tarefa
    };
    // adicionar a nova tarefa ao array de tarefas
    data.tarefas.push(novaTarefa);
    // escrever o arquivo de tarefas
    fs.writeFileSync(DB_FILE, JSON.stringify({tarefas: data}));
    // enviar a resposta com status 201 e a nova tarefa
    res.status(201).json(novaTarefa);
});


// iniciar o servidor na porta 3000
>>>>>>> 282a95e689f1a41f9c58fe8b5e240ec5d3c19d23
app.listen(PORT, () => {
    console.log('Servidor rodando na porta 3000');
});