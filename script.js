let ws;
let recaptchaVerified = false;
const sentMessages = {};

function onCaptchaSuccess() {
  recaptchaVerified = true;
  document.getElementById("input").disabled = false;
  connect();
}

function connect() {
  ws = new WebSocket("wss://superchat.maikanamaikana.workers.dev/chat/room1");

  ws.onmessage = (event) => {
    const msg = document.createElement("div");
    msg.textContent = event.data;
    document.getElementById("messages").appendChild(msg);
  };
}

function send() {
  const input = document.getElementById("input");
  const text = input.value.trim();

  if (!recaptchaVerified) {
    alert("reCAPTCHA を完了してください");
    return;
  }

  if (text === "") return;

  sentMessages[text] = (sentMessages[text] || 0) + 1;
  if (sentMessages[text] > 2) {
    alert("同じメッセージは2回までです");
    return;
  }

  fetch("https://superchat.maikanamaikana.workers.dev/verify", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message: text, token: grecaptcha.getResponse() })
  }).then(r => {
    if (r.ok) {
      ws.send(text);
      input.value = "";
    } else {
      alert("reCAPTCHA 検証に失敗しました");
    }
  });
}
