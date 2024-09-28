# ChamarSenhas

Sistema de gerenciamento de senhas e chamadas para atendimento que utiliza WebSockets para comunicação em tempo real entre o servidor e os clientes, permitindo uma experiência dinâmica.

O projeto é composto por duas partes principais:
1. Servidor WebSocket: Gerencia as conexões e interações entre o frontend e o backend.
2. Painel de Atendimento: Interface que exibe as senhas atuais e o histórico de chamadas.

Funcionalidades

- Exibição de senha e guichê de atendimento.
- Histórico de senhas atendidas.
- Atualização em tempo real das senhas e guichês através de WebSocket.
- Limpeza do histórico
- Remoção da última senha atendida (efeito 'desfazer').

Estrutura de Diretórios

```
├── server.js            # Código do servidor WebSocket
├── assets/              # Arquivos de estilo e scripts
│   ├── css/
│   │   ├── operador.css  # Estilos para o painel de operador
│   │   └── painel.css     # Estilos para o painel de atendimento
│   └── js/
│       ├── operador.js    # Lógica do painel de operador
│       └── painel.js       # Lógica do painel de atendimento
└── public/              # Arquivos HTML
    ├── operador.html     # Interface do operador
    └── painel.html       # Interface do painel de atendimento
```

Tecnologias Utilizadas

- JavaScript: Para a lógica de programação do cliente e servidor.
- WebSocket: Para comunicação em tempo real.
- HTML/CSS: Para as interfaces.

Requisitos

- node.JS: Para o backend
- mysql2: Para a conexão com o banco de dados MySQL.
- ws: Para a comunicação WebSocket.

Instalação

Para executar o projeto:

1. Clone o repositório:
   ```bash
   git clone https://github.com/LuanaMoraesLazaro/SoftwareProduct.git
   cd SoftwareProduct
   ```

2. Instale as dependências:
   ```bash
   npm install mysql2 ws
   ```

3. Inicie o servidor:
   ```bash
   node server.js
   ```

4. Acesse `https://{{server}}:8080'.
