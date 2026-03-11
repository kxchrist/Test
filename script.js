// ==== Joueurs et lobby ====
let lobbyPlayers = [];    // joueurs dans le lobby réel
let playersGame = [];     // joueurs pour le jeu
let currentPlayerName = ""; // nom du joueur actuel
let volume = 1;           // volume par défaut

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

playerNameInput.addEventListener("input", () => {
    currentPlayerName = playerNameInput.value.trim();
    const enabled = currentPlayerName.length > 0;
    btnHostLobby.disabled = !enabled;
    btnJoinLobby.disabled = !enabled;
});

// ==== Paramètres ====
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
volumeRange.addEventListener("input", () => {
    volume = volumeRange.value / 100;
    singeAudio.volume = volume;
    grossingeAudio.volume = volume;
});

// ==== Lobby ====
function addLobbyPlayer(name){
    if(!lobbyPlayers.find(p => p.name === name)){
        lobbyPlayers.push({name, ready:false});
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
        html += `<div class="player" style="margin:10px; padding:10px; border:1px solid #fff; border-radius:12px;">
            ${p.name} — ${p.ready ? '✅ Prêt' : '❌ Pas prêt'}
            ${p.name===currentPlayerName? `<button onclick="toggleReady(${i})" style="margin-left:10px;">${p.ready?'Annuler':'Prêt'}</button>` : ''}
        </div>`;
    });
    lobbyPlayersContainer.innerHTML = html;
    btnStartGame.disabled = !lobbyPlayers.every(p=>p.ready);
}

// Host / Join
btnHostLobby.onclick = () => {
    gamePage.style.display = "none";
    lobbyPage.style.display = "block";
    lobbyPlayers = [];
    addLobbyPlayer(currentPlayerName);
};
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

// Back pré-lobby et lobby
btnBackFromLobby.onclick = () => {
    lobbyPlayers = [];
    renderLobbyPlayers();
    lobbyPage.style.display = "none";
    gamePage.style.display = "block";
    playerNameInput.value = "";
    currentPlayerName = "";
    btnHostLobby.disabled = true;
    btnJoinLobby.disabled = true;
    settingsPanel.style.display = "none";
    joinCodeContainer.style.display = "none";
};

// ==== Lancer la partie ====
btnStartGame.onclick = () => {
    lobbyPage.style.display = "none";
    playPage.style.display = "block";
    playersGame = [...lobbyPlayers.map(p=>({name:p.name,quart:0,shots:0}))];
    renderPlay();
};

// ==== Partie (jeu) ====
function addQuart(i){
    if(playersGame[i].quart >= 4) return;
    playersGame[i].quart++;
    playersGame[i].shots++;

    singeAudio.currentTime=0;
    singeAudio.play();

    if(playersGame[i].quart===4){
        grossingeAudio.currentTime=0;
        grossingeAudio.play();
        confetti();
    }
    renderPlay();
}

// ==== Render jeu avec joueur central + gauche/droite ====
function renderPlay(){
    const container = document.getElementById("playPlayers");
    container.innerHTML = "";

    // Container gauche (liste pseudos)
    const leftDiv = document.createElement("div");
    leftDiv.className = "leftPlayers";
    leftDiv.style.position="absolute";
    leftDiv.style.left="10px";
    leftDiv.style.top="50px";

    // Container centre (nom du joueur courant)
    const centerDiv = document.createElement("div");
    centerDiv.className = "centerPlayer";
    centerDiv.style.textAlign="center";
    centerDiv.style.fontSize="30px";
    centerDiv.style.margin="50px auto";
    centerDiv.style.cursor="pointer";
    centerDiv.innerText = currentPlayerName;
    centerDiv.onclick = ()=>{
        const idx = playersGame.findIndex(p=>p.name===currentPlayerName);
        if(idx!==-1) addQuart(idx);
    };

    // Container droite (shots)
    const rightDiv = document.createElement("div");
    rightDiv.className = "rightShots";
    rightDiv.style.position="absolute";
    rightDiv.style.right="10px";
    rightDiv.style.top="50px";

    // Trier joueurs pour que le courant soit en haut gauche
    let ordered = [...playersGame];
    ordered.sort((a,b)=>{
        if(a.name===currentPlayerName) return -1;
        if(b.name===currentPlayerName) return 1;
        return 0;
    });

    ordered.forEach(p=>{
        const leftPop = document.createElement("div");
        leftPop.innerText=p.name;
        leftPop.style.margin="5px";
        leftPop.style.padding="5px";
        leftPop.style.border="1px solid white";
        leftPop.style.borderRadius="8px";
        leftDiv.appendChild(leftPop);

        const rightPop = document.createElement("div");
        rightPop.innerText=`🍻 ${p.shots}`;
        rightPop.style.margin="5px";
        rightPop.style.padding="5px";
        rightPop.style.border="1px solid white";
        rightPop.style.borderRadius="8px";
        rightDiv.appendChild(rightPop);
    });

    container.appendChild(leftDiv);
    container.appendChild(centerDiv);
    container.appendChild(rightDiv);
}

// ==== Confetti ====
function confetti(){
    for(let i=0;i<40;i++){
        let c=document.createElement("div");
        c.className="confetti";
        c.style.left=Math.random()*100+"vw";
        c.style.background=`hsl(${Math.random()*360},100%,50%)`;
        document.body.appendChild(c);
        setTimeout(()=>c.remove(),3000);
    }
}