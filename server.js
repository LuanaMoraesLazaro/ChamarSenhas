const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: "localhost", // Altere para o host do seu banco de dados
  user: "lifelover", // Altere para o seu usuário do banco de dados
  password: "L1f3L0v3r@21", // Altere para a sua senha do banco de dados
  database: "projeto_luana", // Altere para o nome do seu banco de dados
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
});

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile(path.join(__dirname, "public/painel.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error loading painel.html");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.url === "/operador") {
    fs.readFile(path.join(__dirname, "public/operador.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error loading operador.html");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    // Lidar com requisições para arquivos estáticos
    const filePath = path.join(__dirname, req.url);
    const extname = path.extname(filePath);
    let contentType = "text/plain";

    switch (extname) {
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".html":
        contentType = "text/html";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
        contentType = "image/jpg";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("404 Not Found");
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  }
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  
  console.log("Novo cliente conectado");

  // Enviar histórico do dia atual para o cliente
  sendDailyHistory(ws);

  ws.on("message", (message) => {
    console.log(`${message}`);
    // Retransmitir a mensagem a todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${message}`);
      }
    });

    // Aqui você pode extrair dados do `message` e salvar no banco
    const data = JSON.parse(message);
    if (data.action === "callNext") {
      const { ticket, desk } = JSON.parse(data.data);
      saveCallToDatabase(ticket, desk);
    } else if (data.action === "clearHistory") {
      clearHistoryFromDatabase();
    } else if (data.action === "deleteLast") {
      deleteLastCallFromDatabase();
    }
  });
});

// Função para salvar chamada no banco de dados
function saveCallToDatabase(ticket, guiche) {
  const query =
    "INSERT INTO chamadas (ticket, guiche, data_chamada) VALUES (?, ?, NOW())";
  connection.query(query, [ticket, guiche], (err, results) => {
    if (err) {
      console.error("Erro ao inserir dados no banco:", err);
      return;
    }
    console.log("Dados inseridos com sucesso no banco de dados:", results);
  });
}

// Função para limpar o histórico do banco de dados
function clearHistoryFromDatabase() {
  const query = "DELETE FROM chamadas WHERE DATE(data_chamada) = CURDATE()";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao limpar histórico no banco:", err);
      return;
    }
    console.log("Histórico limpo com sucesso no banco de dados:", results);
  });
}

// Função para excluir a última chamada do banco de dados
function deleteLastCallFromDatabase() {
  const query = "DELETE FROM chamadas ORDER BY data_chamada DESC LIMIT 1";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao excluir a última chamada do banco:", err);
      return;
    }
    console.log("Última chamada excluída com sucesso do banco de dados:", results);
  });
}

// Função para enviar o histórico do dia atual para o cliente
function sendDailyHistory(ws) {
  const query = "SELECT * FROM chamadas WHERE DATE(data_chamada) = CURDATE()";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar histórico do banco:", err);
      return;
    }
    
    // Enviar os resultados para o cliente
    ws.send(JSON.stringify({ action: "sendHistory", data: results }));
  });
}

server.listen(8080, "0.0.0.0", () => {
  console.log("Server is listening on port 8080");
});
