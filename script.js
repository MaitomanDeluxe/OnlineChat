// ✅ script.js（管理者ボタン付き：deathパスワードでコマンド解放 + ユーザー名クリックでキック + UUID生成）

let ws;
let userName = "";
const sentMessages = new Set();
let textColor = "white";
let backgroundColor = "transparent";
let kicked = false;
let userList = new Set();
let commandsEnabled = false;
let commandLockout = false;
let isAdmin = false;

function connect() {
  ws = new WebSocket("wss://superchat.maikanamaikana.workers.dev/chat/room1");

  ws.onopen = () => {
    ws.send(`__JOIN__${userName}`);
  };

  ws.onmessage = (event) => {
    if (event.data === `__KICK__${userName}`) {
      kicked = true;
      document.body.innerHTML += '<div id="overlay">キックされました</div>';
      document.getElementById("input").disabled = true;
      alert("キックされました");
      return;
    }

    if (event.data.startsWith("__USERLIST__")) {
      const list = event.data.replace("__USERLIST__", "").split(",").filter(Boolean);
      updateUserList(list);
      return;
    }

    if (event.data.startsWith("__DM__")) {
      const [, sender, recipient, msg] = event.data.split("|", 4);
      if (recipient === userName) {
        const dm = document.createElement("div");
        dm.textContent = `@${sender} からのメッセージ: \"${msg}\"`;
        dm.style.color = "#aaa";
        dm.style.fontStyle = "italic";
        document.getElementById("messages").appendChild(dm);
      }
      return;
    }

    const msg = document.createElement("div");
    msg.textContent = event.data;
    msg.style.color = textColor;
    msg.style.backgroundColor = backgroundColor;
    document.getElementById("messages").appendChild(msg);
  };
}

function send() {
  if (kicked || commandLockout) return;
  const input = document.getElementById("input");
  const raw = input.value;
  if (raw.trim() === "") return;

  // 🔐 コマンド有効化
  if (!commandsEnabled && raw.startsWith("@")) {
    const pass = prompt("パスワードを入力してください：");
    if (pass === "death") {
      commandsEnabled = true;
      alert("コマンドが有効化されました");
    } else {
      alert("パスワードが違います。再読み込みするまでコマンドは使えません。");
      commandLockout = true;
    }
    input.value = "";
    return;
  }

  if (!commandsEnabled && raw.startsWith("@")) {
    alert("コマンドは無効です。リロードしてください。");
    input.value = "";
    return;
  }

  if (raw.startsWith("@text-color")) {
    const match = raw.match(/@text-color\s+"?([#\w(),.\s]+)"?/);
    if (match) {
      textColor = match[1];
      alert("テキスト色が変更されました");
    } else {
      markSyntaxError();
    }
    input.value = "";
    return;
  }

  if (raw.startsWith("@background-color")) {
    const match = raw.match(/@background-color\s+"?([#\w(),.\s]+)"?/);
    if (match) {
      backgroundColor = match[1];
      alert("背景色が変更されました");
    } else {
      markSyntaxError();
    }
    input.value = "";
    return;
  }

  if (raw.startsWith("@kick")) {
    const match = raw.match(/@kick\s+"(.+?)"/);
    if (match) {
      ws.send(`__KICK__${match[1]}`);
      alert(`キック要求を送りました：${match[1]}`);
    } else {
      markSyntaxError();
    }
    input.value = "";
    return;
  }

  if (raw.startsWith("@uuid")) {
    const uuid = crypto.randomUUID();
    alert("生成されたUUID: " + uuid);
    input.value = "";
    return;
  }

  const dmMatch = raw.match(/^(.*?)\s+--\"(.+?)\"$/);
  if (dmMatch) {
    const msg = dmMatch[1];
    const toUser = dmMatch[2];
    ws.send(`__DM__${userName}|${toUser}|${msg}`);
    input.value = "";
    return;
  }

  const message = `${userName} > ${raw}`;
  if (sentMessages.has(message)) {
    alert("同じメッセージは一度しか送れません");
    return;
  }
  sentMessages.add(message);
  ws.send(message);
  input.value = "";
}

function updateUserList(list) {
  const area = document.getElementById("userlist");
  area.innerHTML = "";
  list.forEach(u => {
    const span = document.createElement("span");
    span.textContent = u;
    if (isAdmin && u !== userName) {
      span.style.cursor = "pointer";
      span.onclick = () => {
        if (confirm(`${u} をキックしますか？`)) {
          ws.send(`__KICK__${u}`);
        }
      };
    }
    area.appendChild(span);
    area.innerHTML += ", ";
  });
  userList = new Set(list);
}

function copyUserList() {
  const text = Array.from(userList).join(", ");
  navigator.clipboard.writeText(text).then(() => alert("コピーしました"));
}

function markSyntaxError() {
  const input = document.getElementById("input");
  input.style.borderBottom = "2px solid red";
  setTimeout(() => input.style.borderBottom = "", 2000);
}

function addOverlayStyle() {
  const css = document.createElement('style');
  css.innerHTML = `#overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0,0,0,0.9);
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }`;
  document.head.appendChild(css);
}

function showSuggestions(e) {
  const val = e.target.value;
  const suggestions = ["@text-color \"#ffffff\"", "@background-color \"rgba(0,0,0,0.5)\"", "@kick \"username\"", "@uuid"];
  const datalist = document.getElementById("sug");
  datalist.innerHTML = "";
  if (val.startsWith("@")) {
    suggestions.forEach(cmd => {
      if (cmd.startsWith(val)) {
        const opt = document.createElement("option");
        opt.value = cmd;
        datalist.appendChild(opt);
      }
    });
  }
}

function enableAdminMode() {
  const pass = prompt("管理者パスワードを入力：");
  if (pass === "death") {
    isAdmin = true;
    alert("管理者モード有効");
    updateUserList(Array.from(userList));
  } else {
    alert("パスワードが違います");
  }
}

window.onload = () => {
  while (!userName) {
    userName = prompt("あなたの名前を入力してください：");
    if (/\s|　|\t|,|"/.test(userName)) {
      alert("名前にスペース、全角スペース、タブ、カンマ、\" は使えません");
      userName = "";
    }
  }
  addOverlayStyle();
  connect();
  document.getElementById("input").addEventListener("input", showSuggestions);

  const adminBtn = document.createElement("button");
  adminBtn.textContent = "管理者モード";
  adminBtn.style.position = "fixed";
  adminBtn.style.bottom = "4px";
  adminBtn.style.right = "4px";
  adminBtn.onclick = enableAdminMode;
  document.body.appendChild(adminBtn);
};
