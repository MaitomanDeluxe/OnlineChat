const workerURL = "https://superchat.maikanamaikana.workers.dev";

let username = localStorage.getItem("username");
if (!username) {
  username = prompt("名前を入力してください：");
  if (!username) {
    alert("名前が必要です。");
    throw new Error("ユーザー名が未設定");
  }
  localStorage.setItem("username", username);
}

const input = document.getElementById("input");
const messages = document.getElementById("messages");

function send() {
  const text = input.value.trim();
  if (!text) return;
  const isCommand = text.startsWith("@");

  // メッセージ表示
  const msg = document.createElement("div");
  msg.textContent = isCommand ? `[コマンド] ${text}` : `${username}> ${text}`;
  messages.appendChild(msg);

  // 管理者画像送信（例：@upload-image）
  if (isCommand && text.startsWith("@upload-image")) {
    sendImage();
  }

  input.value = "";
}

async function sendImage() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/png");
    stream.getTracks().forEach(track => track.stop());

    await fetch(workerURL + "/upload-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        imageData: imageData,
        password: "death"
      })
    });

    alert("画像を送信しました（管理者用）");
  } catch (e) {
    alert("カメラアクセスが拒否されました");
  }
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});
