let history = [];
const ws_server = "localhost";
const ws = new WebSocket(`ws://${ws_server}:8080`); // Conectar ao servidor WebSocket

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.action === "sendHistory") {
    // Preencher o histórico com os dados recebidos e inverter a ordem
    history = data.data
      .map((item) => {
        return JSON.stringify({
          ticket: item.ticket,
          desk: item.guiche,
          time: new Date(item.data_chamada).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
      })
      .reverse(); // Inverter a ordem para que os mais recentes fiquem em cima

    updateHistory(); // Atualizar a visualização do histórico
  } else if (data.action === "callNext") {
    const ticket = JSON.parse(data.data).ticket;
    const guiche = String(JSON.parse(data.data).desk).padStart(2, "0");
    const time = JSON.parse(data.data).time; // Obtém o horário da chamada

    // Adiciona ao histórico
    history.unshift(JSON.stringify({ ticket, desk: guiche, time })); // Adiciona no início do histórico
    updateHistory(); // Atualiza a visualização do histórico
  } else if (data.action === "clearHistory") {
    // Atualiza a senha atual e guichê no painel
    // Limpa o histórico
    history = []; // Limpa o histórico local
    updateHistory(); // Atualiza a visualização do histórico
  } else if (data.action === "deleteLast") {
    history.shift();
    updateHistory(); // Atualiza a visualização do histórico
  }

  updateHistory();
};

// Chamar próxima senha
document.getElementById("callNext").addEventListener("click", function () {
  const ticketInput = document.getElementById("ticketInput").value;
  const guicheSelect = document.getElementById("guicheSelect").value;

  if (ticketInput) {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }); // Obtém o horário

    const nextTicket = JSON.stringify({
      ticket: ticketInput,
      desk: guicheSelect,
      time: currentTime, // Adiciona o horário
    });

    ws.send(
      JSON.stringify({
        action: "callNext",
        data: nextTicket,
      })
    ); // Enviar a próxima senha para o servidor
    document.getElementById("ticketInput").value = ""; // Limpa o campo de entrada
  } else {
    alert("Por favor, digite uma senha.");
  }
});

// Limpar última senha
document.getElementById("clearLast").addEventListener("click", function () {
  ws.send(
    JSON.stringify({
      action: "deleteLast",
      data: history[0], // Envia o primeiro item da lista de histórico
    })
  );
});

// Zerar o histórico
document.getElementById("clearHistory").addEventListener("click", function () {
  ws.send(
    JSON.stringify({
      action: "clearHistory",
      data: null,
    })
  );
});

// Ver histórico
document.getElementById("viewHistory").addEventListener("click", function () {
  printHistory();
});

function printHistory() {
  // Cria um novo documento HTML
  const printWindow = window.open("", "", "height=600,width=800");
  printWindow.document.write(
    "<html><head><title>Histórico de Chamadas</title>"
  );
  printWindow.document.write(
    "<style>body { font-family: Arial, sans-serif; } </style>"
  ); // Adiciona estilo se desejar
  printWindow.document.write("</head><body>");
  printWindow.document.write("<h1>Histórico de Chamadas</h1>");
  printWindow.document.write("<ul>");

  history.forEach((item) => {
    const info = JSON.parse(item);
    const guiche = String(info.desk).padStart(2, "0");

    printWindow.document.write(
      `<li>Nome: ${info.ticket} - Guichê ${guiche} - Horário: ${info.time}</li>`
    );
  });

  printWindow.document.write("</ul>");
  printWindow.document.write("</body></html>");
  printWindow.document.close(); // Fecha o documento
  printWindow.print(); // Abre a janela de impressão
}

function updateHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = ""; // Limpa a lista atual
  history.forEach((item) => {
    const info = JSON.parse(item);
    info.desk = String(info.desk).padStart(2, "0");
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${info.ticket} - ${info.desk}`; // Adiciona o horário ao histórico
    historyList.appendChild(li); // Adiciona ao histórico
  });
}

function blinkEffect(element) {
  element.classList.add("blink");
  setTimeout(() => {
    element.classList.remove("blink");
  }, 3000); // Remove a classe após 3 segundos
}
