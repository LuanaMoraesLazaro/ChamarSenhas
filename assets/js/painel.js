const ws_server = "localhost";
const ws = new WebSocket(`ws://${ws_server}:8080`); // Conectar ao servidor WebSocket

ws.onopen = function () {
  console.log("Conectado ao servidor WebSocket");
};

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.action === "sendHistory") {
    // Preencher o histórico recebido
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = ""; // Limpa a lista atual

    // Adiciona cada item do histórico em ordem inversa
    data.data.reverse().forEach((item) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      const ticket = item.ticket; // Ajuste conforme os nomes dos campos no banco
      const guiche = String(item.guiche).padStart(2, "0");
      li.textContent = `${ticket} - ${guiche}`;
      historyList.appendChild(li); // Adiciona ao histórico
    });

    // Atualiza a senha atual e guichê no painel
    const ticketDisplay = document.getElementById("currentTicketDisplay");
    ticketDisplay.innerText = data.data[0].ticket;

    const guicheDisplay = document.getElementById("currentGuiche");
    guicheDisplay.innerText = String(data.data[0].guiche).padStart(2, "0");

    // Rolar para o topo da lista de histórico
    historyList.parentNode.scrollTop = 0;
  } else if (data.action === "callNext") {
    const ticket = JSON.parse(data.data).ticket;
    const guiche = String(JSON.parse(data.data).desk).padStart(2, "0");

    // Atualiza a senha atual e guichê no painel
    const ticketDisplay = document.getElementById("currentTicketDisplay");
    ticketDisplay.innerText = ticket;
    const guicheDisplay = document.getElementById("currentGuiche");
    guicheDisplay.innerText = guiche;

    // Faz a senha e o guichê piscarem em vermelho
    blinkEffect(ticketDisplay);
    blinkEffect(guicheDisplay);

    // Adiciona ao histórico no topo
    const historyList = document.getElementById("historyList");
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${ticket} - ${guiche}`; // Mensagem recebida
    historyList.insertBefore(li, historyList.firstChild); // Adiciona ao topo

    // Rolar para o topo da lista de histórico
    historyList.parentNode.scrollTop = 0;
  } else if (data.action === "clearHistory") {
    // Atualiza a senha atual e guichê no painel
    document.getElementById("currentTicketDisplay").innerText = "-";
    document.getElementById("currentGuiche").innerText = "-";

    // Limpa o histórico
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
  } else if (data.action === "deleteLast") {
    const historyList = document.getElementById("historyList");
    if (historyList.children.length > 0) {
      const removedItem = historyList.firstChild; // Remove o último item
      historyList.removeChild(removedItem);

      // Atualiza as informações na tela
      if (historyList.children.length > 0) {
        const lastCalled = historyList.firstChild.textContent;
        const [newTicket, newGuiche] = lastCalled.split(" - ");
        document.getElementById("currentTicketDisplay").innerText = newTicket;
        document.getElementById("currentGuiche").innerText = newGuiche;
      } else {
        // Se não houver mais itens, resetamos o painel
        document.getElementById("currentTicketDisplay").innerText = "-";
        document.getElementById("currentGuiche").innerText = "-";
      }
    }
  }
};

function blinkEffect(element) {
  element.classList.add("blink");
  setTimeout(() => {
    element.classList.remove("blink");
  }, 3000); // Remove a classe após 3 segundos
}
