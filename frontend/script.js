document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tarefaForm');
    const tarefasList = document.getElementById('tarefasList');

    carregarTarefas();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const tarefa = document.getElementById('tarefa').value;
        const descricao = document.getElementById('descricao').value;
        const editId = form.getAttribute('data-edit-id');

        if (editId) {
            await atualizarTarefa(editId, { tarefa, descricao });
            form.removeAttribute('data-edit-id');
        } else {
            await adicionarTarefa({ tarefa, descricao });
        }

        form.reset();
    });

    async function adicionarTarefa({ tarefa, descricao }) {
        try {
            const response = await fetch('http://localhost:3000/tarefas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tarefa,
                    descricao,
                    dataCriacao: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar tarefa');
            }

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

    async function deletarTarefa(id) {
        try {
            await fetch(`http://localhost:3000/tarefas/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
        }
    }

    async function atualizarTarefa(id, { tarefa, descricao }) {
        try {
            await fetch(`http://localhost:3000/tarefas/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tarefa, descricao })
            });
            carregarTarefas();
        } catch (error) {
            alert('Erro ao atualizar tarefa!');
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
                <div class="tarefa-footer">
                    <small>Data de criação: ${tarefa.dataCriacao ? new Date(tarefa.dataCriacao).toLocaleDateString() : ''}</small>
                    <div class="tarefa-actions">
                        <button class="deletar-btn" data-id="${tarefa.id}">Deletar</button>
                        <button class="editar-btn" data-id="${tarefa.id}">Editar</button>
                    </div>
                </div>
            `;
            tarefasList.appendChild(div);
        });

        document.querySelectorAll('.deletar-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                await deletarTarefa(id);
                carregarTarefas();
            });
        });

        document.querySelectorAll('.editar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const tarefaObj = tarefas.find(t => t.id == id);
                if (tarefaObj) {
                    document.getElementById('tarefa').value = tarefaObj.tarefa;
                    document.getElementById('descricao').value = tarefaObj.descricao;
                    form.setAttribute('data-edit-id', id);
                }
            });
        });
    }

    document.getElementById('resetarBtn').addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja apagar todas as tarefas?')) {
            await resetarTarefas();
            carregarTarefas();
        }
    });

    async function resetarTarefas() {
        try {
            const response = await fetch('http://localhost:3000/tarefas');
            const tarefas = await response.json();
            for (const tarefa of tarefas) {
                await fetch(`http://localhost:3000/tarefas/${tarefa.id}`, { method: 'DELETE' });
            }
        } catch (error) {
            alert('Erro ao resetar tarefas!');
        }
    }
});
