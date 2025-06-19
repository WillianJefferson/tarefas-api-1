document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tarefaForm');
    const tarefasList = document.getElementById('tarefasList');

    // Carrega tarefas ao carregar a página
    carregarTarefas();

    // Adiciona evento de submit ao formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const tarefa = document.getElementById('tarefa').value;
        const descricao = document.getElementById('descricao').value;
        
        adicionarTarefa({ tarefa, descricao });
        
        // Limpa o formulário
        form.reset();
    });

    // Função para adicionar tarefa
    async function adicionarTarefa(tarefa) {
        try {
            const response = await fetch('http://localhost:3000/tarefas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tarefa),
            });
            
            if (!response.ok) {
                throw new Error('Erro ao adicionar tarefa');
            }
            
            carregarTarefas();
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // Função para carregar tarefas
    async function carregarTarefas() {
        try {
            const response = await fetch('http://localhost:3000/tarefas');
            const tarefas = await response.json();
            
            exibirTarefas(tarefas);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    }

    // Função para exibir tarefas na página
    function exibirTarefas(tarefas) {
        tarefasList.innerHTML = '';
        
        if (tarefas.length === 0) {
            tarefasList.innerHTML = '<p>Nenhuma tarefa cadastrada.</p>';
            return;
        }
        
        tarefas.forEach(tarefa => {
            const div = document.createElement('div');
            div.className = 'tarefa-item';
            div.innerHTML = `
                <h3>${tarefa.tarefa}</h3>
                <p>${tarefa.descricao}</p>
                <small>${new Date(tarefa.dataCriacao).toLocaleString()}</small>
            `;
            tarefasList.appendChild(div);
        });
    }
});