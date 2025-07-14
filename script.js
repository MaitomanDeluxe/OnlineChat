let username = sessionStorage.getItem("username");

if (!username || !/^[A-Za-zぁ-んァ-ンｱ-ﾝﾞﾟ]+$/.test(username)) {
  username = prompt("名前を入力してください（ひらがな・カタカナ・英字）");
  if (!username || !/^[A-Za-zぁ-んァ-ンｱ-ﾝﾞﾟ]+$/.test(username)) {
    alert("無効な名前です。");
    document.body.innerHTML = '<p style="color:white; text-align:center; margin-top:20%;">無効な名前</p>';
    throw new Error("無効な名前");
  }
  sessionStorage.setItem("username", username);
}

const messages = document.getElementById("messages");
const inputBox = document.getElementById("input");

function appendMessage(text) {
  const div = document.createElement("div");
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function send() {
  const text = inputBox.value.trim();
  if (!text) return;

  appendMessage(`${username}> ${text}`);
  inputBox.value = "";
  messages.scrollTop = messages.scrollHeight;

  // 通信処理が必要であればここに追加
  fetch('https://superchat.maikanamaikana.workers.dev', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name: username, text })
  });

}

inputBox.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
