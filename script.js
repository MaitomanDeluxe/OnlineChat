const ws = new WebSocket("wss://superchat.maikanamaikana.workers.dev/chat/room1");

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

ws.onmessage = (event) => {
  const div = document.createElement("div");
  div.textContent = event.data;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
};

form.onsubmit = (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    ws.send(input.value);
    input.value = "";
  }
};
