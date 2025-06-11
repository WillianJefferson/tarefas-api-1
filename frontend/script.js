document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tarefaForm');
    const tarefasList = document.getElementById('tarefasList');

    carregarTarefas();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const tarefaInput = document.getElementById('tarefa');
        const descricaoInput = document.getElementById('descricao');
        const tarefa = tarefaInput.value.trim();
        const descricao = descricaoInput.value.trim();

        if (!tarefa) return alert('Digite uma tarefa.');

        await adicionarTarefa({ tarefa, descricao });
        form.reset();
    });

    async function adicionarTarefa({ tarefa, descricao }) {
        try {
            const response = await fetch('http://localhost:3000/tarefas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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

        if (!tarefas.length) {
            tarefasList.innerHTML = '<p>Nenhuma tarefa encontrada</p>';
            return;
        }

        tarefas.forEach(({ tarefa, descricao, dataCriacao }) => {
            const div = document.createElement('div');
            div.className = 'tarefa-item';
            div.innerHTML = `
                <h3>${tarefa}</h3>
                <p>${descricao}</p>
                <small>Data de criação: ${new Date(dataCriacao).toLocaleDateString()}</small>
            `;
            tarefasList.appendChild(div);
        });
    }
});

