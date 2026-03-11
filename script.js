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
let lobbyPlayers = []; // Simulation lobby {name, ready}

// ==== Navigation ====
document.getElementById("btnToRules").onclick = () => {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("rules").style.display = "block";
};

document.getElementById("btnToGame").onclick = () => {
  document.getElementById("rules").style.display = "none";
  document.getElementById("game").style.display = "block";
  initLobbyButtons(); // <- On init les boutons lobby ici
};

// ==== Gestion des joueurs (avant lobby) ====
function addPlayer() {
  const name = document.getElementById("name").value.trim();
  if (!name) return;

  players.push({ name: name, quart: 0, shots: 0 });
  document.getElementById("name").value = "";
  renderPlayers();
}

function removePlayer(i) {
  players.splice(i, 1);
  renderPlayers();
}

function renderPlayers() {
  const container = document.getElementById("players");
  let html = "";

  players.forEach((p, i) => {
    html += `<div class="player">
                ${p.name}
                <span onclick="removePlayer(${i})">❌</span>
             </div>`;
  });

  if (players.length >= 2) {
    html += `<button onclick="startLobby()">Suivant</button>`;
  }

  container.innerHTML = html;
}

// ==== Lobby simulation ====
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
    html += `<div class="player" style="margin:10px; padding:10px; border:1px solid #fff; border-radius:12px;">
               ${p.name} — ${p.ready ? '✅ Prêt' : '❌ Pas prêt'}
               <button onclick="toggleReady(${i})" style="margin-left:10px;">
                 ${p.ready ? 'Annuler' : 'Prêt'}
               </button>
             </div>`;
  });

  container.innerHTML = html;

  // Activer bouton start si tous prêts
  const btnStart = document.getElementById("btnStartGame");
  if (btnStart) btnStart.disabled = !lobbyPlayers.every(p => p.ready);
}

// ==== Démarrage de la partie depuis le lobby ====
function startLobby() {
  // Masquer page de création de joueurs
  document.getElementById("game").style.display = "none";
  document.getElementById("lobby").style.display = "block";

  // Ajouter tous les joueurs existants à la simulation
  lobbyPlayers = []; // reset
  players.forEach(p => addLobbyPlayer(p.name));
}

// ==== Boutons "host" et "join" ====
function initLobbyButtons() {
  const btnHost = document.getElementById("btnHost");
  const btnJoin = document.getElementById("btnJoin");
  const joinCodeContainer = document.getElementById("joinCodeContainer");
  const btnSubmitJoin = document.getElementById("btnSubmitJoin");
  const joinCodeInput = document.getElementById("joinCodeInput");

  if (!btnHost || !btnJoin || !btnSubmitJoin) return;

  // Host = crée le lobby
  btnHost.onclick = () => {
    startLobby();
  };

  // Join = afficher champ code
  btnJoin.onclick = () => {
    joinCodeContainer.style.display = "block";
  };

  // Submit join
  btnSubmitJoin.onclick = () => {
    const code = joinCodeInput.value.trim();
    if (!code) return alert("Entrez un code de lobby !");

    // Simule un joueur qui rejoint
    const pseudo = "Joueur " + (lobbyPlayers.length + 1);
    addLobbyPlayer(pseudo);

    joinCodeContainer.style.display = "none";
    joinCodeInput.value = "";
  };
}

// ==== Partie (jeu) ====
function addQuart(i) {
  if (players[i].quart >= 4) return;

  players[i].quart++;
  players[i].shots++;

  const singe = document.getElementById("singe");
  singe.currentTime = 0;
  singe.play();

  if (players[i].quart === 4) {
    const gross = document.getElementById("grossinge");
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
    const percent = (p.quart / 4) * 100;
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

// ==== Navigation jeu ====
document.getElementById("btnBack").onclick = () => {
  players.forEach(p => p.quart = 0);
  document.getElementById("play").style.display = "none";
  document.getElementById("game").style.display = "block";
  renderPlayers();
};

document.getElementById("btnRandomRule").onclick = () => {
  const r = rules[Math.floor(Math.random() * rules.length)];
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
  const sorted = [...players].sort((a, b) => b.shots - a.shots);
  let html = "";
  sorted.forEach((p, i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}️⃣`;
    html += `<div class="rankPlayer">${medal} ${p.name} — 🍻 ${p.shots} shots</div>`;
  });
  document.getElementById("rankingList").innerHTML = html;
}

// ==== Effets ====
function confetti() {
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = `hsl(${Math.random() * 360},100%,50%)`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

function bananaRain() {
  setInterval(() => {
    const b = document.createElement("div");
    b.className = "banana";
    b.innerText = "🍌";
    b.style.left = Math.random() * 100 + "vw";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 5000);
  }, 800);
}