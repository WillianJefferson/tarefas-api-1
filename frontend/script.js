document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tarefaForm");
  const tarefasList = document.getElementById("tarefasList");
  let editandoId = null;

  carregarTarefas();

  // Adicionar um evento de submit ao formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tarefa = document.getElementById("tarefa").value;
    const descricao = document.getElementById("descricao").value;

    if (editandoId) {
      atualizarTarefa({ id: editandoId, tarefa, descricao });
    } else {
      adicionarTarefa({ tarefa, descricao });
    }

    form.reset();
    editandoId = null;
  });

  // Função para adicionar uma tarefa
  async function adicionarTarefa({ tarefa, descricao }) {
    try {
      const response = await fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tarefa, descricao }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar tarefa");
      }

      carregarTarefas();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  }

  // Função para carregar as tarefas
  async function carregarTarefas() {
    try {
      const response = await fetch("http://localhost:3000/tarefas");
      const tarefas = await response.json();

      exibirTarefas(tarefas);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  }

  window.editarTarefa = (id, tarefa, descricao) => {
    document.getElementById("tarefa").value = tarefa;
    document.getElementById("descricao").value = descricao;
    editandoId = id;
  };

  async function atualizarTarefa({ id, tarefa, descricao }) {
    try {
      const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tarefa, descricao }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar tarefa");
      }

      carregarTarefas();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  }
  window.deletarTarefa = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir tarefa");
      }

      carregarTarefas();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  // Função para exibir as tarefas
  function exibirTarefas(tarefas) {
    tarefasList.innerHTML = "";

    if (tarefas.length === 0) {
      tarefasList.innerHTML = "<p>Nenhuma tarefa encontrada</p>";
      return;
    }

    tarefas.forEach((tarefa) => {
      const div = document.createElement("div");
      div.className = "tarefa-item";
      div.innerHTML = `
            <h3>${tarefa.tarefa}</h3>
            <p>${tarefa.descricao}</p>
            <small>Data de criação: ${new Date(
              tarefa.dataCriacao
            ).toLocaleDateString()}</small><br>
            <button onclick="editarTarefa(${tarefa.id}, '${tarefa.tarefa}', '${
        tarefa.descricao
      }')">Editar</button>
            <button onclick="deletarTarefa(${tarefa.id})">Excluir</button>
        `;
      tarefasList.appendChild(div);
    });
  }
});
