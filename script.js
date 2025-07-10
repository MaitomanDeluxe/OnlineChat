let ws;
let recaptchaVerified = false;

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
  if (!recaptchaVerified) {
    alert("reCAPTCHA を完了してください");
    return;
  }

  const input = document.getElementById("input");
  if (input.value.trim() !== "") {
    ws.send(input.value.trim());
    input.value = "";
  }
}
