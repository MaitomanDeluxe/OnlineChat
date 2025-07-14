const workerURL = "https://superchat.maikanamaikana.workers.dev";

let username = localStorage.getItem("username");
if (!username) {
  username = prompt("名前を入力してください（ひらがな、カタカナ、英字）");
  if (!username || !/^[A-Za-zぁ-んァ-ンｱ-ﾝﾞﾟ]+$/.test(username)) {
    alert("無効な名前です。");
    throw new Error("ユーザー名が無効");
  }
  localStorage.setItem("username", username);
}

const input = document.getElementById("input");
const messages = document.getElementById("messages");

function send() {
  const text = input.value.trim();
  if (!text) return;

  const msg = document.createElement("div");
  msg.textContent = `${username}> ${text}`;
  messages.appendChild(msg);

  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  // 通信が必要であればここで fetch を送る
  /*
  fetch(`${workerURL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, text })
  }).then(res => res.text()).then(console.log);
  */
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});
