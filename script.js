// ==== Règles ====
const rules = [
  "interdiction de dire oui",
  "parler avec accent",
  "dire banane avant phrase",
  "interdiction de poser question",
  "tout le monde finit son verre"
];

// ==== Joueurs et partie ====
let players = [];
let lobbyPlayers = []; // {name: string, ready: boolean}

// ==== Navigation entre pages ====
document.getElementById("btnToRules").onclick = () => {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("rules").style.display = "block";
};

document.getElementById("btnToGame").onclick = () => {
  document.getElementById("rules").style.display = "none";
  document.getElementById("game").style.display = "block";
};

// ==== Champ prénom + activation boutons lobby ====
const playerNameInput = document.getElementById("playerName");
const btnHost = document.getElementById("btnHost");
const btnJoin = document.getElementById("btnJoin");
const joinCodeContainer = document.getElementById("joinCodeContainer");
const btnSubmitJoin = document.getElementById("btnSubmitJoin");
const joinCodeInput = document.getElementById("joinCodeInput");

playerNameInput.addEventListener("input", () => {
  const nameFilled = playerNameInput.value.trim() !== "";
  btnHost.disabled = !nameFilled;
  btnJoin.disabled = !nameFilled;
});

// ==== Lobby functions ====
function addLobbyPlayer(name) {
  lobbyPlayers.push({ name: name, ready: false });
  renderLobbyPlayers();
}

function toggleReady(i) {
  lobbyPlayers[i].ready = !lobbyPlayers[i].ready;
  renderLobbyPlayers();
}

function renderLobbyPlayers() {
  const container = document.getElementById("lobbyPlayers");
  let html = "";

  lobbyPlayers.forEach((p, i) => {
    html += `
      <div class="player" style="margin:10px; padding:10px; border:1px solid #fff; border-radius:12px;">
        ${p.name} — ${p.ready ? '✅ Prêt' : '❌ Pas prêt'}
        <button onclick="toggleReady(${i})" style="margin-left:10px;">
          ${p.ready ? 'Annuler' : 'Prêt'}
        </button>
      </div>
    `;
  });

  container.innerHTML = html;

  const btnStart = document.getElementById("btnStartGame");
  btnStart.disabled = !lobbyPlayers.every(p => p.ready);
}

// ==== Boutons host/join ====
btnHost.onclick = () => {
  const name = playerNameInput.value.trim();
  if (!name) return;

  document.getElementById("game").style.display = "none";
  document.getElementById("lobby").style.display = "block";

  // Ajouter le joueur hôte
  addLobbyPlayer(name);
};

btnJoin.onclick = () => {
  joinCodeContainer.style.display = "block";
};

btnSubmitJoin.onclick = () => {
  const code = joinCodeInput.value.trim();
  if (!code) return alert("Entrez un code de lobby !");

  const name = playerNameInput.value.trim();
  if (!name) return alert("Entrez votre prénom !");

  addLobbyPlayer(name);

  joinCodeContainer.style.display = "none";
  joinCodeInput.value = "";
};

// ==== Lancer la partie depuis le lobby ====
document.getElementById("btnStartGame").onclick = () => {
  document.getElementById("lobby").style.display = "none";
  document.getElementById("play").style.display = "block";

  // Ajouter tous les joueurs du lobby à la partie
  players = lobbyPlayers.map(p => ({ name: p.name, quart: 0, shots: 0 }));

  renderPlay();
  bananaRain();
};

// ==== Partie (jeu) ====
function addQuart(i) {
  if (players[i].quart >= 4) return;

  players[i].quart++;
  players[i].shots++;

  let singe = document.getElementById("singe");
  singe.currentTime = 0;
  singe.play();

  if (players[i].quart == 4) {
    let gross = document.getElementById("grossinge");
    gross.currentTime = 0;
    gross.play();
    navigator.vibrate?.(400);
    confetti();
  }

  renderPlay();
}

function renderPlay() {
  const container = document.getElementById("playPlayers");
  let html = "";

  players.forEach((p, i) => {
    let percent = (p.quart / 4) * 100;
    html += `<div class="player ${p.quart >= 4 ? 'singe' : ''}">
               <h3>${p.name} 🍻${p.shots}</h3>
               <div class="progress">
                 <div class="bar" style="width:${percent}%"></div>
               </div>
               <button onclick="addQuart(${i})">+1 quart</button>
             </div>`;
  });

  container.innerHTML = html;
}

document.getElementById("btnBack").onclick = () => {
  players.forEach(p => p.quart = 0);
  document.getElementById("play").style.display = "none";
  document.getElementById("game").style.display = "block";
};

document.getElementById("btnRandomRule").onclick = () => {
  let r = rules[Math.floor(Math.random() * rules.length)];
  document.getElementById("ruleBox").innerText = "🎲 " + r;
};

document.getElementById("btnReset").onclick = () => {
  players.forEach(p => p.quart = 0);
  renderPlay();
};

// ==== Classement ====
document.getElementById("btnEndGame").onclick = () => {
  document.getElementById("play").style.display = "none";
  document.getElementById("ranking").style.display = "block";
  showRanking();
};

function showRanking() {
  let sorted = [...players].sort((a, b) => b.shots - a.shots);
  let html = "";
  sorted.forEach((p, i) => {
    let medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}️⃣`;
    html += `<div class="rankPlayer">${medal} ${p.name} — 🍻 ${p.shots} shots</div>`;
  });
  document.getElementById("rankingList").innerHTML = html;
}

// ==== Confetti & bananes ====
function confetti() {
  for (let i = 0; i < 40; i++) {
    let c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = `hsl(${Math.random() * 360},100%,50%)`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

function bananaRain() {
  setInterval(() => {
    let b = document.createElement("div");
    b.className = "banana";
    b.innerText = "🍌";
    b.style.left = Math.random() * 100 + "vw";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 5000);
  }, 800);
}