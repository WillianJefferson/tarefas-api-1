const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal que serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Caminho para o arquivo db.json
const dbPath = path.join(__dirname, 'db.json');

// Função para validar tarefa
const validarTarefa = (tarefa) => {
    const erros = [];
    if (!tarefa.tarefa) erros.push('Título é obrigatório');
    if (!tarefa.descricao) erros.push('Descrição é obrigatória');
    return erros;
};

// Função para ler o banco de dados
const readDB = () => {
    try {
        console.log('Tentando ler o arquivo db.json em:', dbPath);
        if (!fs.existsSync(dbPath)) {
            console.log('Arquivo db.json não encontrado. Criando novo arquivo...');
            const initialData = { tarefas: [] };
            fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
            console.log('Arquivo db.json criado com sucesso!');
            return initialData;
        }
        const data = fs.readFileSync(dbPath, 'utf8');
        console.log('Dados lidos com sucesso do db.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler/escrever db.json:', error);
        throw new Error('Erro ao acessar o banco de dados');
    }
};

// Função para escrever no banco de dados
const writeDB = (data) => {
    try {
        console.log('Escrevendo dados no db.json...');
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        console.log('Dados escritos com sucesso!');
    } catch (error) {
        console.error('Erro ao escrever no db.json:', error);
        throw new Error('Erro ao salvar no banco de dados');
    }
};

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    res.status(500).json({ 
        erro: 'Erro interno do servidor',
        mensagem: err.message 
    });
});

// Rotas CRUD para tarefas

// Criar tarefa (Create)
app.post('/tarefas', (req, res) => {
    try {
        console.log('Recebendo requisição POST /tarefas');
        console.log('Dados recebidos:', req.body);
        
        const erros = validarTarefa(req.body);
        if (erros.length > 0) {
            console.log('Erros de validação:', erros);
            return res.status(400).json({ erros });
        }

        const db = readDB();
        const novaTarefa = {
            id: Date.now().toString(),
            ...req.body,
            status: 'pendente',
            criadoEm: new Date().toISOString()
        };
        
        console.log('Nova tarefa a ser criada:', novaTarefa);
        db.tarefas.push(novaTarefa);
        writeDB(db);
        console.log('Nova tarefa criada com sucesso');
        res.status(201).json(novaTarefa);
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ erro: 'Erro ao criar tarefa', mensagem: error.message });
    }
});

// Listar todas as tarefas (Read)
app.get('/tarefas', (req, res) => {
    try {
        console.log('Recebendo requisição GET /tarefas');
        const db = readDB();
        console.log('Tarefas encontradas:', db.tarefas.length);
        res.json(db.tarefas);
    } catch (error) {
        console.error('Erro ao listar tarefas:', error);
        res.status(500).json({ erro: 'Erro ao listar tarefas', mensagem: error.message });
    }
});

// Buscar tarefa por ID (Read)
app.get('/tarefas/:id', (req, res) => {
    try {
        console.log('Recebendo requisição GET /tarefas/:id', req.params.id);
        const db = readDB();
        const tarefa = db.tarefas.find(t => t.id === req.params.id);
        if (!tarefa) {
            console.log('Tarefa não encontrada');
            return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }
        console.log('Tarefa encontrada:', tarefa);
        res.json(tarefa);
    } catch (error) {
        console.error('Erro ao buscar tarefa:', error);
        res.status(500).json({ erro: 'Erro ao buscar tarefa', mensagem: error.message });
    }
});

// Atualizar tarefa (Update)
app.put('/tarefas/:id', (req, res) => {
    try {
        console.log('Recebendo requisição PUT /tarefas/:id', req.params.id);
        console.log('Dados recebidos:', req.body);
        
        const erros = validarTarefa(req.body);
        if (erros.length > 0) {
            console.log('Erros de validação:', erros);
            return res.status(400).json({ erros });
        }

        const db = readDB();
        const index = db.tarefas.findIndex(t => t.id === req.params.id);
        
        if (index === -1) {
            console.log('Tarefa não encontrada');
            return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }

        // Mantém os dados originais que não devem ser alterados
        const tarefaAtualizada = {
            ...db.tarefas[index],
            ...req.body,
            atualizadoEm: new Date().toISOString()
        };

        db.tarefas[index] = tarefaAtualizada;
        writeDB(db);
        
        console.log('Tarefa atualizada com sucesso:', tarefaAtualizada);
        res.json(tarefaAtualizada);
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ erro: 'Erro ao atualizar tarefa', mensagem: error.message });
    }
});

// Deletar tarefa (Delete)
app.delete('/tarefas/:id', (req, res) => {
    try {
        console.log('Recebendo requisição DELETE /tarefas/:id', req.params.id);
        const db = readDB();
        const index = db.tarefas.findIndex(t => t.id === req.params.id);
        if (index === -1) {
            console.log('Tarefa não encontrada');
            return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }
        const tarefaRemovida = db.tarefas.splice(index, 1)[0];
        writeDB(db);
        console.log('Tarefa removida:', tarefaRemovida);
        res.json(tarefaRemovida);
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).json({ erro: 'Erro ao deletar tarefa', mensagem: error.message });
    }
});

// Rota de teste
app.get('/teste', (req, res) => {
    res.json({ mensagem: 'API está funcionando!' });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ mensagem: 'Rota não encontrada' });
});

// Função para iniciar o servidor
const iniciarServidor = (porta) => {
    return new Promise((resolve, reject) => {
        console.log(`Tentando iniciar o servidor na porta ${porta}...`);
        const server = app.listen(porta, '0.0.0.0', () => {
            console.log(`Servidor rodando em http://localhost:${porta}`);
            console.log(`Teste a API em: http://localhost:${porta}/teste`);
            resolve(server);
        }).on('error', (err) => {
            console.error(`Erro ao iniciar na porta ${porta}:`, err.message);
            if (err.code === 'EADDRINUSE') {
                console.log(`Porta ${porta} em uso, tentando porta ${porta + 1}`);
                resolve(iniciarServidor(porta + 1));
            } else {
                reject(err);
            }
        });
    });
};

// Iniciar o servidor
iniciarServidor(PORT).catch(error => {
    console.error('Erro fatal ao iniciar o servidor:', error);
    process.exit(1);
}); 