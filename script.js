// ==== Règles ====
const rules = [
  "interdiction de dire oui",
  "parler avec accent",
  "dire banane avant phrase",
  "interdiction de poser question",
  "tout le monde finit son verre"
];

// ==== Joueurs et lobby ====
let players = [];        // joueurs ajoutés dans game
let lobbyPlayers = [];   // joueurs dans le lobby réel
let currentPlayerName = ""; // nom du joueur actuel
let volume = 1;          // volume par défaut

// ==== Pages ====
const welcomePage = document.getElementById("welcome");
const gamePage = document.getElementById("game");
const lobbyPage = document.getElementById("lobby");
const playPage = document.getElementById("play");

// ==== Elements lobby et paramètres ====
const playerNameInput = document.getElementById("playerNameInput");
const btnHostLobby = document.getElementById("btnHostLobby");
const btnJoinLobby = document.getElementById("btnJoinLobby");
const joinCodeContainer = document.getElementById("joinCodeContainer");
const btnSubmitJoin = document.getElementById("btnSubmitJoin");
const joinCodeInput = document.getElementById("joinCodeInput");
const lobbyPlayersContainer = document.getElementById("lobbyPlayers");
const btnStartGame = document.getElementById("btnStartGame");
const btnBackFromLobby = document.getElementById("btnBackFromLobby");

const btnSettings = document.getElementById("btnSettings");
const settingsPanel = document.getElementById("settingsPanel");
const btnSettingsSound = document.getElementById("btnSettingsSound");
const btnSettingsRules = document.getElementById("btnSettingsRules");
const soundPanel = document.getElementById("soundPanel");
const rulesPanel = document.getElementById("rulesPanel");
const volumeRange = document.getElementById("volumeRange");

const singeAudio = document.getElementById("singe");
const grossingeAudio = document.getElementById("grossinge");

// ==== Navigation ====
document.getElementById("btnToGame").onclick = () => {
  welcomePage.style.display = "none";
  gamePage.style.display = "block";
};

// Activer / désactiver les boutons Host / Join selon input prénom
playerNameInput.addEventListener("input", () => {
  currentPlayerName = playerNameInput.value.trim();
  const enabled = currentPlayerName.length > 0;
  btnHostLobby.disabled = !enabled;
  btnJoinLobby.disabled = !enabled;
});

// ==== Boutons Paramètres ====
btnSettings.onclick = () => {
  settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
  soundPanel.style.display = "none";
  rulesPanel.style.display = "none";
};

btnSettingsSound.onclick = () => {
  soundPanel.style.display = "block";
  rulesPanel.style.display = "none";
};

btnSettingsRules.onclick = () => {
  rulesPanel.style.display = "block";
  soundPanel.style.display = "none";
};

// Ajuster volume
volumeRange.addEventListener("input", () => {
  volume = volumeRange.value / 100;
  singeAudio.volume = volume;
  grossingeAudio.volume = volume;
});

// ==== Lobby simulation ====
function addLobbyPlayer(name) {
  if (!lobbyPlayers.find(p => p.name === name)) {
    lobbyPlayers.push({ name: name, ready: false });
  }
  renderLobbyPlayers();
}

function toggleReady(i) {
  lobbyPlayers[i].ready = !lobbyPlayers[i].ready;
  renderLobbyPlayers();
}

function renderLobbyPlayers() {
  let html = "";
  lobbyPlayers.forEach((p, i) => {
    html += `<div class="player" style="margin:10px; padding:10px; border:1px solid #fff; border-radius:12px;">
               ${p.name} — ${p.ready ? '✅ Prêt' : '❌ Pas prêt'}
               ${p.name === currentPlayerName ? `<button onclick="toggleReady(${i})" style="margin-left:10px;">${p.ready ? 'Annuler' : 'Prêt'}</button>` : ''}
             </div>`;
  });
  lobbyPlayersContainer.innerHTML = html;

  btnStartGame.disabled = !lobbyPlayers.every(p => p.ready);
}

// ==== Host / Join ====
btnHostLobby.onclick = () => {
  gamePage.style.display = "none";
  lobbyPage.style.display = "block";

  // Reset lobby et ajouter le joueur courant
  lobbyPlayers = [];
  addLobbyPlayer(currentPlayerName);

  // Simulation pseudo aléatoire d'autres joueurs
  addLobbyPlayer("Joueur 2");
  addLobbyPlayer("Joueur 3");
};

btnJoinLobby.onclick = () => {
  joinCodeContainer.style.display = "block";
};

btnSubmitJoin.onclick = () => {
  const code = joinCodeInput.value.trim();
  if (!code) return alert("Entrez un code de lobby !");
  addLobbyPlayer(currentPlayerName);

  // Simulation pseudo aléatoire
  addLobbyPlayer("Joueur " + (lobbyPlayers.length + 1));

  joinCodeContainer.style.display = "none";
  joinCodeInput.value = "";

  gamePage.style.display = "none";
  lobbyPage.style.display = "block";
};

// ==== Back Lobby ====
btnBackFromLobby.onclick = () => {
  lobbyPlayers = [];
  renderLobbyPlayers();
  lobbyPage.style.display = "none";
  gamePage.style.display = "block";
  playerNameInput.value = "";
  btnHostLobby.disabled = true;
  btnJoinLobby.disabled = true;
};

// ==== Lancer la partie depuis lobby ====
btnStartGame.onclick = () => {
  lobbyPage.style.display = "none";
  playPage.style.display = "block";
  renderPlay();
  bananaRain();
};

// ==== Partie (jeu) ====
let playersGame = []; // copie des joueurs pour le jeu

function startGame() {
  playersGame = [...lobbyPlayers.map(p => ({ name: p.name, quart: 0, shots: 0 }))];
  renderPlay();
}

function addQuart(i) {
  if (playersGame[i].quart >= 4) return;
  playersGame[i].quart++;
  playersGame[i].shots++;

  singeAudio.currentTime = 0;
  singeAudio.play();

  if (playersGame[i].quart === 4) {
    grossingeAudio.currentTime = 0;
    grossingeAudio.play();
    navigator.vibrate?.(400);
    confetti();
  }

  renderPlay();
}

function renderPlay() {
  const container = document.getElementById("playPlayers");
  let html = "";
  playersGame.forEach((p, i) => {
    let percent = (p.quart / 4) * 100;
    html += `<div class="player ${p.quart >= 4 ? 'singe' : ''}">
               <h3>${p.name} 🍻${p.shots} ${p.name === currentPlayerName ? '💛' : ''}</h3>
               <div class="progress"><div class="bar" style="width:${percent}%"></div></div>
               <button onclick="addQuart(${i})">+1 quart</button>
             </div>`;
  });
  container.innerHTML = html;
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