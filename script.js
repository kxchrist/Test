// ==== Règles ====
const rules = [
  "interdiction de dire oui",
  "parler avec accent",
  "dire banane avant phrase",
  "interdiction de poser question",
  "tout le monde finit son verre"
];

// ==== Joueurs et partie ====
let players = []; // Joueurs pour la partie réelle
let lobbyPlayers = []; // Joueurs dans le lobby simulé {name, ready}

// ==== Navigation entre pages ====
document.getElementById("btnToRules").onclick = () => {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("rules").style.display = "block";
};

document.getElementById("btnToGame").onclick = () => {
  document.getElementById("rules").style.display = "none";
  document.getElementById("game").style.display = "block";
};

// ==== Lobby ====
// Inputs et boutons
const playerNameInput = document.getElementById("playerNameInput");
const btnHostLobby = document.getElementById("btnHostLobby");
const btnJoinLobby = document.getElementById("btnJoinLobby");
const btnBackLobby = document.getElementById("btnBackLobby");
const btnRulesFromLobby = document.getElementById("btnRulesFromLobby");
const btnSettings = document.getElementById("btnSettings");
const settingsPanel = document.getElementById("settingsPanel");
const joinCodeContainer = document.getElementById("joinCodeContainer");
const btnSubmitJoin = document.getElementById("btnSubmitJoin");
const joinCodeInput = document.getElementById("joinCodeInput");
const btnStartGame = document.getElementById("btnStartGame");
const lobbyPlayersContainer = document.getElementById("lobbyPlayers");

// Activer boutons host/join seulement si prénom entré
playerNameInput.addEventListener("input", () => {
  const hasName = playerNameInput.value.trim() !== "";
  btnHostLobby.disabled = !hasName;
  btnJoinLobby.disabled = !hasName;
});

// Bouton Back
btnBackLobby.onclick = () => {
  document.getElementById("lobby").style.display = "none";
  document.getElementById("welcome").style.display = "block";

  // Reset lobby simulation
  lobbyPlayers = [];
  lobbyPlayersContainer.innerHTML = "";
  playerNameInput.value = "";
  playerNameInput.disabled = false;
  btnHostLobby.disabled = true;
  btnJoinLobby.disabled = true;
  joinCodeContainer.style.display = "none";
  joinCodeInput.value = "";
};

// Bouton Règles
btnRulesFromLobby.onclick = () => {
  document.getElementById("rules").style.display = "block";
};

// Bouton Paramètres
btnSettings.onclick = () => {
  settingsPanel.style.display = settingsPanel.style.display === "none" ? "block" : "none";
};

// Host Lobby
btnHostLobby.onclick = () => {
  const name = playerNameInput.value.trim();
  if (!name) return;
  addLobbyPlayer(name); // Ajouter hôte
  playerNameInput.disabled = true;
  btnHostLobby.disabled = true;
  btnJoinLobby.disabled = true;
};

// Join Lobby
btnJoinLobby.onclick = () => {
  joinCodeContainer.style.display = "block";
};

btnSubmitJoin.onclick = () => {
  const code = joinCodeInput.value.trim();
  if (!code) return alert("Entrez un code de lobby !");
  const name = playerNameInput.value.trim();
  if (!name) return alert("Entrez votre prénom !");
  addLobbyPlayer(name); // Simuler ajout joueur
  playerNameInput.disabled = true;
  btnHostLobby.disabled = true;
  btnJoinLobby.disabled = true;
  joinCodeContainer.style.display = "none";
  joinCodeInput.value = "";
};

// Ajouter joueur dans le lobby simulé
function addLobbyPlayer(name) {
  lobbyPlayers.push({name, ready: false});
  renderLobbyPlayers();
}

// Changer état prêt
function toggleReady(i) {
  lobbyPlayers[i].ready = !lobbyPlayers[i].ready;
  renderLobbyPlayers();
}

// Afficher joueurs lobby
function renderLobbyPlayers() {
  let html = "";
  lobbyPlayers.forEach((p, i) => {
    html += `<div class="player" style="margin:10px; padding:10px; border:1px solid #fff; border-radius:12px;">
               ${p.name} — ${p.ready ? '✅ Prêt' : '❌ Pas prêt'}
               <button onclick="toggleReady(${i})" style="margin-left:10px;">
                 ${p.ready ? 'Annuler' : 'Prêt'}
               </button>
             </div>`;
  });
  lobbyPlayersContainer.innerHTML = html;

  // Activer bouton Start si tous prêts
  btnStartGame.disabled = !lobbyPlayers.every(p => p.ready);
}

// Lancer la partie depuis le lobby
btnStartGame.onclick = () => {
  document.getElementById("lobby").style.display = "none";
  document.getElementById("play").style.display = "block";

  // Copier joueurs du lobby dans la partie réelle
  players = lobbyPlayers.map(p => ({name: p.name, quart: 0, shots: 0}));

  renderPlay();
  bananaRain();
};

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
               <div class="progress"><div class="bar" style="width:${percent}%"></div></div>
               <button onclick="addQuart(${i})">+1 quart</button>
             </div>`;
  });
  container.innerHTML = html;
}

// Back au menu depuis jeu
document.getElementById("btnBack").onclick = () => {
  players.forEach(p => p.quart = 0);
  document.getElementById("play").style.display = "none";
  document.getElementById("welcome").style.display = "block";
};

// Règles aléatoires
document.getElementById("btnRandomRule").onclick = () => {
  const r = rules[Math.floor(Math.random() * rules.length)];
  document.getElementById("ruleBox").innerText = "🎲 " + r;
};

// Reset partie
document.getElementById("btnReset").onclick = () => {
  players.forEach(p => p.quart = 0);
  renderPlay();
};

// Classement
document.getElementById("btnEndGame").onclick = () => {
  document.getElementById("play").style.display = "none";
  document.getElementById("ranking").style.display = "block";
  showRanking();
};

function showRanking() {
  const sorted = [...players].sort((a,b) => b.shots - a.shots);
  let html = "";
  sorted.forEach((p,i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}️⃣`;
    html += `<div class="rankPlayer">${medal} ${p.name} — 🍻 ${p.shots} shots</div>`;
  });
  document.getElementById("rankingList").innerHTML = html;
}

function backToGame() {
  players = [];
  document.getElementById("rankingList").innerHTML = "";
  document.getElementById("ruleBox").innerText = "Aucune règle";
  document.getElementById("name").value = "";
  document.getElementById("ranking").style.display = "none";
  document.getElementById("play").style.display = "none";
}

// ==== Confetti & bananes ====
function confetti() {
  for (let i=0; i<40; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random()*100 + "vw";
    c.style.background = `hsl(${Math.random()*360},100%,50%)`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

function bananaRain() {
  setInterval(() => {
    const b = document.createElement("div");
    b.className = "banana";
    b.innerText = "🍌";
    b.style.left = Math.random()*100 + "vw";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 5000);
  }, 800);
}