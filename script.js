const API_URL = "https://webchat.maikanamaikana.workers.dev/messages";
const log = document.getElementById("log");
const form = document.getElementById("form");
const name = document.getElementById("name");
const message = document.getElementById("message");

async function fetchMessages() {
  const res = await fetch(API_URL);
  const data = await res.json();
  log.innerHTML = data.map(m =>
    `<div><strong>${m.user}</strong>: ${m.text}</div>`
  ).join("");
  log.scrollTop = log.scrollHeight;
}

form.onsubmit = async e => {
  e.preventDefault();
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: name.value,
      text: message.value
    })
  });
  message.value = "";
  fetchMessages();
};

setInterval(fetchMessages, 2000);
fetchMessages();
