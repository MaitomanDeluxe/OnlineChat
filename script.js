
let username = "";
let isAdmin = false;
let lastSent = "";

window.addEventListener('DOMContentLoaded', () => {
  username = prompt("名前を入力（英字・ひらがな・カタカナ）:");
  if (!username || !/^[A-Za-zぁ-んァ-ンｱ-ﾝﾞﾟ]+$/.test(username)) {
    alert("無効な名前です");
    document.body.innerHTML = "<p style='text-align:center;'>終了</p>";
    return;
  }

  document.getElementById("input").addEventListener("keydown", e => {
    if (e.key === "Enter") send();
  });
});

function send() {
  const input = document.getElementById("input");
  const msg = input.value.trim();
  if (!msg || msg === lastSent) return;
  lastSent = msg;

  const div = document.createElement("div");
  div.textContent = username + " > " + msg.replace(/\\n/g, "\n");
  document.getElementById("messages").appendChild(div);
  input.value = "";
}
