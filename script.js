const rules=[
"interdiction de dire oui",
"parler avec accent",
"dire banane avant phrase",
"interdiction de poser question",
"tout le monde finit son verre"
];

let players=[];

document.getElementById("btnToRules").onclick=()=>{
document.getElementById("welcome").style.display="none";
document.getElementById("rules").style.display="block";
};

document.getElementById("btnToGame").onclick=()=>{
document.getElementById("rules").style.display="none";
document.getElementById("game").style.display="block";
};

function addPlayer(){

let name=document.getElementById("name").value;

if(!name)return;

players.push({name:name,quart:0,shots:0});

document.getElementById("name").value="";

renderPlayers();

}

function removePlayer(i){

players.splice(i,1);

renderPlayers();

}

function renderPlayers(){

let html="";

players.forEach((p,i)=>{

html+=`<div class="player">
${p.name}
<span onclick="removePlayer(${i})">❌</span>
</div>`;

});

if(players.length>=2){

html+=`<button onclick="startGame()">Lancer la partie</button>`;

}

document.getElementById("players").innerHTML=html;

}

function startGame(){

document.getElementById("game").style.display="none";
document.getElementById("play").style.display="block";

renderPlay();

bananaRain();

}

function addQuart(i){

if(players[i].quart>=4)return;

players[i].quart++;
players[i].shots++;

let singe=document.getElementById("singe");
singe.currentTime=0;
singe.play();

if(players[i].quart==4){

let gross=document.getElementById("grossinge");
gross.currentTime=0;
gross.play();

navigator.vibrate?.(400);

confetti();

}

renderPlay();

}

function renderPlay(){

const container=document.getElementById("playPlayers");

let html="";

players.forEach((p,i)=>{

let percent=(p.quart/4)*100;

html+=`

<div class="player ${p.quart>=4?'singe':''}">

<h3>${p.name} 🍻${p.shots}</h3>

<div class="progress">
<div class="bar" style="width:${percent}%"></div>
</div>

<button onclick="addQuart(${i})">+1 quart</button>

</div>

`;

});

container.innerHTML=html;

}

document.getElementById("btnBack").onclick=()=>{

players.forEach(p=>p.quart=0);

document.getElementById("play").style.display="none";
document.getElementById("game").style.display="block";

renderPlayers();

};

document.getElementById("btnRandomRule").onclick=()=>{

let r=rules[Math.floor(Math.random()*rules.length)];

document.getElementById("ruleBox").innerText="🎲 "+r;

};

document.getElementById("btnReset").onclick=()=>{

players.forEach(p=>p.quart=0);

renderPlay();

};

/* classement */

document.getElementById("btnEndGame").onclick=()=>{

document.getElementById("play").style.display="none"
document.getElementById("ranking").style.display="block"

showRanking()

}

function showRanking(){

let sorted=[...players].sort((a,b)=>b.shots-a.shots)

let html=""

sorted.forEach((p,i)=>{

let medal=""

if(i==0) medal="🥇"
else if(i==1) medal="🥈"
else if(i==2) medal="🥉"
else medal=`${i+1}️⃣`

html+=`
<div class="rankPlayer">
${medal} ${p.name} — 🍻 ${p.shots} shots
</div>
`

})

document.getElementById("rankingList").innerHTML=html

}

function backToGame(){

/* reset des joueurs */
players=[]

/* reset interface */
document.getElementById("rankingList").innerHTML=""
document.getElementById("ruleBox").innerText="Aucune règle"

/* vider champ nom */
document.getElementById("name").value=""

/* navigation */
document.getElementById("ranking").style.display="none"
document.getElementById("play").style.display="none"
document.getElementById("game").style.display="block"

/* refresh joueurs */
renderPlayers()

}

/* confetti */

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

/* bananes */

function bananaRain(){

setInterval(()=>{

let b=document.createElement("div");

b.className="banana";

b.innerText="🍌";

b.style.left=Math.random()*100+"vw";

document.body.appendChild(b);

setTimeout(()=>b.remove(),5000);

},800);

}

// boutons lobby
const btnHost = document.getElementById("btnHost");
const btnJoin = document.getElementById("btnJoin");
const joinCodeContainer = document.getElementById("joinCodeContainer");
const btnSubmitJoin = document.getElementById("btnSubmitJoin");
const joinCodeInput = document.getElementById("joinCodeInput");

btnHost.onclick = () => {
    alert("Lobby créé ! (fonctionalité Node à implémenter plus tard)");
    // Ici on pourra générer un code de lobby et afficher la liste des joueurs
};

btnJoin.onclick = () => {
    joinCodeContainer.style.display = "block"; // Affiche le champ code
};

btnSubmitJoin.onclick = () => {
    const code = joinCodeInput.value.trim();
    if (!code) return alert("Entrez un code de lobby !");
    alert("Rejoindre le lobby " + code + " (fonctionalité Node à implémenter plus tard)");
    joinCodeContainer.style.display = "none";
    joinCodeInput.value = "";
};
// Lobby simulation
let lobbyPlayers = []; // {name: string, ready: boolean}

// Ajouter un joueur au lobby (simulé)
function addLobbyPlayer(name) {
    lobbyPlayers.push({name: name, ready: false});
    renderLobbyPlayers();
}

// Changer l'état prêt
function toggleReady(i) {
    lobbyPlayers[i].ready = !lobbyPlayers[i].ready;
    renderLobbyPlayers();
}

// Afficher les joueurs dans le lobby
function renderLobbyPlayers() {
    const container = document.getElementById("lobbyPlayers");
    let html = '';

    lobbyPlayers.forEach((p, i) => {
        html += `
            <div class="player" style="margin:10px; padding:10px; border:1px solid #fff; border-radius:12px;">
                ${p.name} — ${p.ready ? '✅ Prêt' : '❌ Pas prêt'}
                <button onclick="toggleReady(${i})" style="margin-left:10px;">${p.ready ? 'Annuler' : 'Prêt'}</button>
            </div>
        `;
    });

    container.innerHTML = html;

    // Activer le bouton start si tous les joueurs sont prêts
    const btnStart = document.getElementById("btnStartGame");
    btnStart.disabled = !lobbyPlayers.every(p => p.ready);
}

// Lancer la partie
document.getElementById("btnStartGame").onclick = () => {
    alert("Tous les joueurs sont prêts ! La partie commence 🎉");
    // Ici tu peux masquer #lobby et afficher #play
    document.getElementById("lobby").style.display = "none";
    document.getElementById("play").style.display = "block";

    renderPlay(); // afficher ton jeu
    bananaRain();
};
document.getElementById("btnHost").onclick = () => {
    document.getElementById("game").style.display = "none";
    document.getElementById("lobby").style.display = "block";

    // Simuler le joueur hôte
    addLobbyPlayer("Moi (Hôte)");
};
btnSubmitJoin.onclick = () => {
    const code = joinCodeInput.value.trim();
    if (!code) return alert("Entrez un code de lobby !");
    
    document.getElementById("game").style.display = "none";
    document.getElementById("lobby").style.display = "block";

    // Simuler rejoindre avec un pseudo aléatoire
    const pseudo = "Joueur " + (lobbyPlayers.length + 1);
    addLobbyPlayer(pseudo);

    joinCodeContainer.style.display = "none";
    joinCodeInput.value = "";
};