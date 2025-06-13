const API_URL = 'http://localhost:3001';

// Elementos do DOM
const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');

// Função para carregar as tarefas
async function carregarTarefas() {
    try {
        const response = await fetch(`${API_URL}/tarefas`);
        const tarefas = await response.json();
        
        tasksList.innerHTML = '';
        
        tarefas.forEach(tarefa => {
            const taskCard = criarTaskCard(tarefa);
            tasksList.appendChild(taskCard);
        });
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        mostrarMensagem('Erro ao carregar tarefas. Tente novamente.', 'erro');
    }
}

// Função para criar um card de tarefa
function criarTaskCard(tarefa) {
    const card = document.createElement('div');
    card.className = `task-card ${tarefa.status}`;
    
    const data = new Date(tarefa.criadoEm).toLocaleDateString('pt-BR');
    
    card.innerHTML = `
        <h3>${tarefa.titulo}</h3>
        <p>${tarefa.descricao}</p>
        <div class="task-info">
            <span class="status ${tarefa.status}">${tarefa.status}</span>
            <span class="data">Criado em: ${data}</span>
        </div>
    `;
    
    return card;
}

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo) {
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `mensagem ${tipo}`;
    mensagemDiv.textContent = mensagem;
    
    document.body.appendChild(mensagemDiv);
    
    setTimeout(() => {
        mensagemDiv.remove();
    }, 3000);
}

// Evento de submit do formulário
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(taskForm);
    const tarefa = {
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        status: formData.get('status')
    };
    
    try {
        const response = await fetch(`${API_URL}/tarefas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa)
        });
        
        if (response.ok) {
            mostrarMensagem('Tarefa criada com sucesso!', 'sucesso');
            taskForm.reset();
            carregarTarefas();
        } else {
            throw new Error('Erro ao criar tarefa');
        }
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        mostrarMensagem('Erro ao criar tarefa. Tente novamente.', 'erro');
    }
});

// Carregar tarefas ao iniciar
carregarTarefas(); 