let isAdmin = false;
let username = '';
let localIP = '不明';
const allowedNameRegex = /^[A-Za-zぁ-んァ-ンｱ-ﾝﾞﾟ]+$/;

function send() {
  const input = document.getElementById('input');
  const text = input.value.trim();
  if (!text) return;

  if (text.startsWith('@')) {
    if (!isAdmin) return;
    // コマンド処理省略（必要であれば再実装可能）
  } else {
    fetch('/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        text,
        ip: localIP
      })
    }).catch(err => console.error(err));
  }

  input.value = '';
}

function copyUser(name) {
  navigator.clipboard.writeText(name).then(() => alert(`${name} をコピーしました`));
}

function renderUsers(users, ips) {
  const userlist = document.getElementById('userlist');
  userlist.innerHTML = '';
  users.forEach((user, i) => {
    const box = document.createElement('div');
    box.className = 'user-box';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = user;

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋';
    copyBtn.onclick = () => copyUser(user);
    box.appendChild(nameSpan);
    box.appendChild(copyBtn);

    if (isAdmin) {
      const tools = document.createElement('div');
      tools.className = 'admin-tools';

      const banBtn = document.createElement('button');
      banBtn.textContent = 'BAN';
      banBtn.onclick = () => alert(`${user} をキック（仮処理）`);

      const ipSpan = document.createElement('span');
      ipSpan.style.color = '#888';
      ipSpan.textContent = ` [${ips[i]}]`;

      tools.appendChild(banBtn);
      box.appendChild(tools);
      box.appendChild(ipSpan);
    }

    userlist.appendChild(box);
  });
}

function getIP(callback) {
  const script = document.createElement('script');
  script.src = 'https://ipinfo.io?callback=handleIP';
  document.body.appendChild(script);
  window.handleIP = function(response) {
    localIP = response.ip;
    callback();
  };
}

function requestCameraOnce() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => stream.getTracks().forEach(track => track.stop()))
    .catch(() => alert("カメラのアクセスが拒否されました。設定から許可してください。"));
}

window.addEventListener('DOMContentLoaded', () => {
  getIP(() => {
    username = sessionStorage.getItem('username');
    if (!username || !allowedNameRegex.test(username)) {
      while (!username || !allowedNameRegex.test(username)) {
        username = prompt("ユーザー名を入力（アルファベット・ひらがな・カタカナのみ）");
        if (username === null) break;
      }
      if (!username) {
        alert("無効な名前のため終了します");
        document.body.innerHTML = '<p style="text-align:center;margin-top:20%;color:white;">無効な名前です。</p>';
        return;
      }
      sessionStorage.setItem('username', username);
    }

    document.getElementById('input').addEventListener('keydown', e => {
      if (e.key === '@') {
        if (!isAdmin) {
          const pass = prompt("管理者パスワードを入力してください");
          if (pass === 'death') {
            isAdmin = true;
            alert("管理者モードになりました");
            renderUsers([username, 'guest1'], [localIP, '192.168.1.5']);
          } else {
            alert("パスワードが違います");
          }
        }
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        renderUsers([username, 'guest1'], [localIP, '192.168.1.5']);
      }
      if (e.key === 'Enter') send();
    });

    requestCameraOnce();
  });
});
