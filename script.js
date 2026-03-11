// ==== Règles ====
const rules = [
  "interdiction de dire oui",
  "parler avec accent",
  "dire banane avant phrase",
  "interdiction de poser question",
  "tout le monde finit son verre"
];

// ==== Joueurs ====
let lobbyPlayers = [];
let playersGame = [];
let currentPlayerName = "";
let volume = 1;

let bananaInterval = null;

// ==== Pages ====
const welcomePage = document.getElementById("welcome");
const gamePage = document.getElementById("game");
const lobbyPage = document.getElementById("lobby");
const playPage = document.getElementById("play");
const rankingPage = document.getElementById("ranking");

// ==== Elements ====
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

const ruleBox = document.getElementById("ruleBox");
const playPlayers = document.getElementById("playPlayers");
const rankingList = document.getElementById("rankingList");

// ==== Navigation accueil → lobby ====
document.getElementById("btnToGame").onclick = () => {

  welcomePage.style.display = "none";
  gamePage.style.display = "block";

};

// ==== Activation boutons host/join ====
playerNameInput.addEventListener("input", () => {

  currentPlayerName = playerNameInput.value.trim();

  const enabled = currentPlayerName.length > 0;

  btnHostLobby.disabled = !enabled;
  btnJoinLobby.disabled = !enabled;

});

// ==== Paramètres ====
btnSettings.onclick = () => {

  settingsPanel.style.display =
    settingsPanel.style.display === "block" ? "none" : "block";

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

volumeRange.addEventListener("input", () => {

  volume = volumeRange.value / 100;

  singeAudio.volume = volume;
  grossingeAudio.volume = volume;

});

// ==== Lobby ====

function addLobbyPlayer(name){

  if(!lobbyPlayers.find(p => p.name === name)){

    lobbyPlayers.push({
      name: name,
      ready: false
    });

  }

  renderLobbyPlayers();

}

function toggleReady(i){

  lobbyPlayers[i].ready = !lobbyPlayers[i].ready;

  renderLobbyPlayers();

}

function renderLobbyPlayers(){

  let html = "";

  lobbyPlayers.forEach((p,i)=>{

    html += `
      <div class="player" style="margin:10px;padding:10px;border:1px solid #fff;border-radius:12px;">

        ${p.name} — ${p.ready ? "✅ Prêt" : "❌ Pas prêt"}

        ${p.name === currentPlayerName ?
        `<button onclick="toggleReady(${i})" style="margin-left:10px;">
        ${p.ready ? "Annuler" : "Prêt"}
        </button>` : ""}

      </div>
    `;

  });

  lobbyPlayersContainer.innerHTML = html;

  btnStartGame.disabled =
    lobbyPlayers.length === 0 ||
    !lobbyPlayers.every(p => p.ready);

}

// ==== Host lobby ====
btnHostLobby.onclick = () => {

  gamePage.style.display = "none";
  lobbyPage.style.display = "block";

  lobbyPlayers = [];

  addLobbyPlayer(currentPlayerName);

};

// ==== Join lobby ====
btnJoinLobby.onclick = () => {

  joinCodeContainer.style.display = "block";

};

btnSubmitJoin.onclick = () => {

  const code = joinCodeInput.value.trim();

  if(!code) return alert("Entrez un code !");

  lobbyPlayers = [];

  addLobbyPlayer(currentPlayerName);

  joinCodeContainer.style.display = "none";
  joinCodeInput.value = "";

  gamePage.style.display = "none";
  lobbyPage.style.display = "block";

};

// ==== Retour lobby ====
btnBackFromLobby.onclick = () => {

  lobbyPlayers = [];

  renderLobbyPlayers();

  lobbyPage.style.display = "none";
  gamePage.style.display = "block";

  playerNameInput.value = "";

  btnHostLobby.disabled = true;
  btnJoinLobby.disabled = true;

};

// ==== Retour menu principal ====
document.getElementById("btnBackLobby").onclick = () => {

  gamePage.style.display = "none";
  welcomePage.style.display = "block";

  playerNameInput.value = "";
  currentPlayerName = "";

  btnHostLobby.disabled = true;
  btnJoinLobby.disabled = true;

  settingsPanel.style.display = "none";
  joinCodeContainer.style.display = "none";

};

// ==== Lancer partie ====
btnStartGame.onclick = () => {

  lobbyPage.style.display = "none";
  playPage.style.display = "block";

  playersGame = lobbyPlayers.map(p => ({
    name: p.name,
    quart: 0,
    shots: 0
  }));

  renderPlay();

  bananaRain();

};

// ==== Retour partie → lobby ====
document.getElementById("btnBack").onclick = () => {

  playPage.style.display = "none";
  lobbyPage.style.display = "block";

  rankingPage.style.display = "none";

};

// ==== Règle aléatoire ====
document.getElementById("btnRandomRule").onclick = () => {

  const randomRule =
    rules[Math.floor(Math.random() * rules.length)];

  ruleBox.innerText = "🎲 " + randomRule;

};

// ==== Reset partie ====
document.getElementById("btnReset").onclick = () => {

  playersGame.forEach(p => {

    p.quart = 0;
    p.shots = 0;

  });

  renderPlay();

};

// ==== Ajouter quart ====
function addQuart(i){

  if(playersGame[i].quart >= 4) return;

  playersGame[i].quart++;
  playersGame[i].shots++;

  singeAudio.currentTime = 0;
  singeAudio.play();

  if(playersGame[i].quart === 4){

    grossingeAudio.currentTime = 0;
    grossingeAudio.play();

    navigator.vibrate?.(400);

    confetti();

  }

  renderPlay();

}

// ==== Affichage joueurs ====
function renderPlay(){

  let html = "";

  playersGame.forEach((p,i)=>{

    let percent = (p.quart / 4) * 100;

    html += `
      <div class="player ${p.quart >= 4 ? "singe" : ""}">

        <h3>
        ${p.name} 🍻${p.shots}
        ${p.name === currentPlayerName ? "💛" : ""}
        </h3>

        <div class="progress">
          <div class="bar" style="width:${percent}%"></div>
        </div>

        <button onclick="addQuart(${i})">
        +1 quart
        </button>

      </div>
    `;

  });

  playPlayers.innerHTML = html;

}

// ==== Fin partie ====
document.getElementById("btnEndGame").onclick = () => {

  playPage.style.display = "none";
  rankingPage.style.display = "block";

  showRanking();

};

// ==== Classement ====
function showRanking(){

  if(playersGame.length === 0){

    rankingList.innerHTML = "Aucun joueur";

    return;

  }

  let sorted =
    [...playersGame].sort((a,b)=>b.shots-a.shots);

  let html = "";

  sorted.forEach((p,i)=>{

    let medal =
      i===0 ? "🥇" :
      i===1 ? "🥈" :
      i===2 ? "🥉" :
      (i+1)+".";

    html += `
      <div class="rankPlayer">
      ${medal} ${p.name} — 🍻 ${p.shots}
      </div>
    `;

  });

  rankingList.innerHTML = html;

}

// ==== Confetti ====
function confetti(){

  for(let i=0;i<40;i++){

    let c=document.createElement("div");

    c.className="confetti";

    c.style.left=Math.random()*100+"vw";

    c.style.background=
      `hsl(${Math.random()*360},100%,50%)`;

    document.body.appendChild(c);

    setTimeout(()=>c.remove(),3000);

  }

}

// ==== Pluie de bananes ====
function bananaRain(){

  if(bananaInterval) return;

  bananaInterval = setInterval(()=>{

    let b=document.createElement("div");

    b.className="banana";

    b.innerText="🍌";

    b.style.left=Math.random()*100+"vw";

    document.body.appendChild(b);

    setTimeout(()=>b.remove(),5000);

  },800);

}