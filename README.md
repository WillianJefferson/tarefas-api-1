# Aplicação de Tarefas

Este projeto é uma aplicação de tarefas simples desenvolvida em **React** (frontend) e **Node.js** (backend). Ele simula o armazenamento de tarefas em um arquivo JSON, permitindo adicionar, listar, atualizar e excluir tarefas.

---

## **Estrutura do Projeto**

### **Frontend**
- Desenvolvido em **React**.
- Usa **Bootstrap** para estilização.
- Consome os endpoints do backend para gerenciar tarefas.

### **Backend**
- Desenvolvido em **Node.js** com **Express**.
- Manipula o arquivo JSON (`mockTasks.json`) para simular uma base de dados.
- Fornece endpoints para listar, adicionar, atualizar e excluir tarefas.

---

## **Funcionalidades**
- **Adicionar Tarefa**: Permite criar novas tarefas com título e descrição.
- **Listar Tarefas**: Exibe todas as tarefas armazenadas.
- **Atualizar Tarefa**: Permite alternar o status de uma tarefa entre "Concluído" e "Pendente".
- **Excluir Tarefa**: Remove uma tarefa da lista.
- **Simulação de Banco de Dados**: Usa um arquivo JSON para simular o armazenamento de dados.

---

## **Pré-requisitos**
Certifique-se de ter instalado:
- **Node.js** (versão 14 ou superior)
- **npm** (gerenciador de pacotes do Node.js)

---

## **Como Executar o Projeto**

### **Passo 1: Clonar o Repositório**
Clone o repositório para sua máquina local:
```bash
git clone https://github.com/AydomSantos/tarefas-api-1.git
```

### **Passo 2: Instalar Dependências**
Entre nas pastas `frontend` e `backend` e instale as dependências:
```bash
cd frontend
npm install

cd ../backend
npm install
```

### **Passo 3: Iniciar o Backend**
Na pasta `backend`, execute o seguinte comando para iniciar o servidor:
```bash
node server.js
```
O backend estará disponível em `http://localhost:3000`.

### **Passo 4: Iniciar o Frontend**
Na pasta `frontend`, execute o seguinte comando para iniciar o servidor de desenvolvimento:
```bash
npm start
```
O frontend estará disponível em `http://localhost:3001`.

---

## **Endpoints do Backend**

### **GET /tasks**
Retorna todas as tarefas armazenadas.

### **POST /tasks**
Adiciona uma nova tarefa. Exemplo de corpo da requisição:
```json
{
  "title": "Nova Tarefa",
  "description": "Descrição da tarefa",
  "completed": false
}
```

### **PUT /tasks/:id**
Atualiza uma tarefa existente. Exemplo de corpo da requisição:
```json
{
  "title": "Tarefa Atualizada",
  "description": "Descrição atualizada",
  "completed": true
}
```

### **DELETE /tasks/:id**
Exclui uma tarefa com base no ID.

---

## **Tecnologias Utilizadas**
- **Frontend**: React, Bootstrap
- **Backend**: Node.js, Express
- **Banco de Dados Simulado**: Arquivo JSON (`mockTasks.json`)

---

## **Licença**
Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).