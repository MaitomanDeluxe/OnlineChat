let ws;
let userName = "";
const sentMessages = new Set();

function connect() {
  ws = new WebSocket("wss://superchat.maikanamaikana.workers.dev/chat/room1");

  ws.onmessage = (event) => {
    const msg = document.createElement("div");
    msg.innerText = event.data;
    msg.style.color = textColor;
    msg.style.backgroundColor = backgroundColor;
    document.getElementById("messages").appendChild(msg);
  };
}

let textColor = "white";
let backgroundColor = "transparent";

function send() {
  const input = document.getElementById("input");
  let text = input.value;

  if (text.startsWith("@text-color")) {
    const match = text.match(/@text-color\s+"(.+?)"/);
    if (match) {
      textColor = match[1];
      alert("テキスト色が変更されました");
    }
    input.value = "";
    return;
  }

  if (text.startsWith("@background-color")) {
    const match = text.match(/@background-color\s+"(.+?)"/);
    if (match) {
      backgroundColor = match[1];
      alert("背景色が変更されました");
    }
    input.value = "";
    return;
  }

  const fullMessage = `${userName} > ${text}`;
  if (sentMessages.has(fullMessage)) {
    alert("同じメッセージは一度しか送れません");
    return;
  }

  sentMessages.add(fullMessage);
  ws.send(fullMessage);
  input.value = "";
}

window.onload = () => {
  while (!userName) {
    userName = prompt("あなたの名前を入力してください：");
  }
  connect();
};
