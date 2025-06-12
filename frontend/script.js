document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tarefaForm');
    const tarefasList = document.getElementById('tarefasList');

    carregarTarefas();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const tarefa = document.getElementById('tarefa').value;
        const descricao = document.getElementById('descricao').value;
        adicionarTarefa({ tarefa, descricao });
        form.reset();
    });

    async function adicionarTarefa({ tarefa, descricao }) {
        try {
            const response = await fetch('http://localhost:3000/tarefas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tarefa, descricao })
            });
            if (!response.ok) throw new Error('Erro ao adicionar tarefa');
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    }

    async function carregarTarefas() {
        try {
            const response = await fetch('http://localhost:3000/tarefas');
            const tarefas = await response.json();
            exibirTarefas(tarefas);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    }

    function exibirTarefas(tarefas) {
        tarefasList.innerHTML = '';
        if (tarefas.length === 0) {
            tarefasList.innerHTML = '<p>Nenhuma tarefa encontrada</p>';
            return;
        }
        tarefas.forEach(tarefa => {
            const div = document.createElement('div');
            div.className = 'tarefa-item';
            div.innerHTML = `
                <h3>${tarefa.tarefa}</h3>
                <p>${tarefa.descricao}</p>
                <small>Data de criação: ${new Date(tarefa.dataCriacao).toLocaleDateString()}</small>
                <br>
                <button class="editar-btn" data-id="${tarefa.id}">Editar</button>
                <button class="excluir-btn" data-id="${tarefa.id}">Excluir</button>
            `;
            div.querySelector('.editar-btn').addEventListener('click', () => {
                const novoTitulo = prompt('Editar tarefa:', tarefa.tarefa);
                const novaDescricao = prompt('Editar descrição:', tarefa.descricao);
                if (novoTitulo && novaDescricao) {
                    editarTarefa(tarefa.id, novoTitulo, novaDescricao);
                }
            });
            div.querySelector('.excluir-btn').addEventListener('click', () => {
                if (confirm('Deseja excluir esta tarefa?')) {
                    excluirTarefa(tarefa.id);
                }
            });
            tarefasList.appendChild(div);
        });
    }

    async function editarTarefa(id, tarefa, descricao) {
        try {
            const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tarefa, descricao })
            });
            if (!response.ok) throw new Error('Erro ao editar tarefa');
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
        }
    }

    async function excluirTarefa(id) {
        try {
            const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao excluir tarefa');
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }
});