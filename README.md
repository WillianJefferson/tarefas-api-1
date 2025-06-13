# Gerenciador de Tarefas

Uma aplicação web para gerenciamento de tarefas, desenvolvida com Node.js, Express e JavaScript puro.

## 🚀 Funcionalidades

- Criar novas tarefas
- Listar todas as tarefas
- Editar tarefas existentes
- Excluir tarefas
- Interface responsiva e moderna
- Feedback visual para ações do usuário
- Armazenamento local em JSON
- Registro automático de data e hora de criação
- Formatação de data no padrão brasileiro (DD/MM/YYYY HH:MM:SS)

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM (gerenciador de pacotes do Node.js)
- Navegador web moderno

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/tarefas-api.git
cd tarefas-api
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm run dev
```

4. Acesse a aplicação:
- Abra seu navegador
- Acesse: `http://localhost:3001`

## 📦 Estrutura do Projeto

```
tarefas-api/
├── public/
│   └── index.html      # Interface do usuário
├── src/
│   ├── index.js        # Servidor e rotas da API
│   └── db.json         # Banco de dados (criado automaticamente)
├── package.json
└── README.md
```

## 🛠️ Tecnologias Utilizadas

- **Backend**:
  - Node.js
  - Express.js
  - Body-parser
  - CORS

- **Frontend**:
  - HTML5
  - CSS3 (com variáveis CSS)
  - JavaScript (ES6+)
  - Fetch API

## 📝 Como Usar

### 1. Criar uma Nova Tarefa

1. Acesse a página inicial
2. No formulário à esquerda:
   - Digite o título da tarefa
   - Adicione uma descrição (opcional)
3. Clique em "Adicionar Tarefa"
4. A tarefa será exibida na lista à direita com a data e hora de criação

### 2. Visualizar Tarefas

- Todas as tarefas são exibidas automaticamente na lista à direita
- Cada tarefa mostra:
  - Título
  - Descrição
  - Data e hora de criação (formato DD/MM/YYYY HH:MM:SS)
  - Status
  - Botões de ação (Editar e Excluir)

### 3. Editar uma Tarefa

1. Localize a tarefa na lista
2. Clique no botão "Editar"
3. No modal que abrir:
   - Atualize o título
   - Atualize a descrição
4. Clique em "Salvar Alterações"
5. A tarefa será atualizada na lista

### 4. Excluir uma Tarefa

1. Localize a tarefa na lista
2. Clique no botão "Excluir"
3. Confirme a exclusão no diálogo
4. A tarefa será removida da lista

## 🔄 API Endpoints

### GET /tarefas
- Lista todas as tarefas
- Resposta: Array de tarefas

### POST /tarefas
- Cria uma nova tarefa
- Corpo da requisição:
```json
{
    "tarefa": "Título da tarefa",
    "descricao": "Descrição da tarefa"
}
```

### PUT /tarefas/:id
- Atualiza uma tarefa existente
- Parâmetro: ID da tarefa
- Corpo da requisição:
```json
{
    "tarefa": "Novo título",
    "descricao": "Nova descrição"
}
```

### DELETE /tarefas/:id
- Remove uma tarefa específica
- Parâmetro: ID da tarefa

## 🎨 Personalização

### Cores
As cores podem ser personalizadas editando as variáveis CSS no arquivo `public/index.html`:

```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #2c3e50;
    --success-color: #2ecc71;
    --warning-color: #f1c40f;
    --danger-color: #e74c3c;
    /* ... outras variáveis ... */
}
```

## 🔍 Solução de Problemas

### Servidor não inicia
1. Verifique se a porta 3001 está disponível
2. Certifique-se de que todas as dependências estão instaladas
3. Verifique os logs do servidor

### Erro de conexão
1. Verifique se o servidor está rodando
2. Confirme se está acessando a URL correta
3. Verifique se não há bloqueio de firewall

### Dados não salvos
1. Verifique as permissões da pasta
2. Confirme se o arquivo db.json foi criado
3. Verifique os logs do servidor

### Erro ao editar tarefa
1. Verifique se o ID da tarefa está correto
2. Confirme se todos os campos obrigatórios foram preenchidos
3. Verifique os logs do servidor para mais detalhes

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Recursos Adicionais

- Interface responsiva
- Animações suaves
- Feedback visual para ações
- Confirmação antes de excluir
- Mensagens de erro amigáveis
- Design moderno e limpo
- Modal de edição
- Formatação de data no padrão brasileiro

## 📞 Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no GitHub.
