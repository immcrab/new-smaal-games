const firebaseConfig = {
  apiKey: "AIzaSyBDXDtnufqucWuFPIYOnJOYxiLYriHfkVo",
  authDomain: "code-stub.firebaseapp.com",
  databaseURL: "https://code-stub-default-rtdb.firebaseio.com", 
  projectId: "code-stub",
  storageBucket: "code-stub.firebasestorage.app",
  messagingSenderId: "389870178886",
  appId: "1:389870178886:web:525e1e2f4dfaf0a3f33047",
  measurementId: "G-5SBT0X0JGE"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
let currentGameID = "";

// SEARCH LOGIC
const searchInput = document.getElementById("searchInput");
const gameCountDisplay = document.getElementById("gameCount");

function updateGameCount() {  
    const cards = document.querySelectorAll(".card");
    let visibleCount = 0;
    cards.forEach(card => {
        if (card.style.display !== "none") visibleCount++;
    });
    gameCountDisplay.textContent = visibleCount + " games total";
}

searchInput.addEventListener("keyup", function () {
    let filter = searchInput.value.toLowerCase();
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        let title = card.querySelector(".card-title").textContent.toLowerCase();
        let desc = card.querySelector(".card-desc").textContent.toLowerCase();
        card.style.display = (title.includes(filter) || desc.includes(filter)) ? "flex" : "none";
    });
    updateGameCount();
});

// CLICKS & HEARTS LOGIC
database.ref('stats').on('value', (snapshot) => {
    const stats = snapshot.val();
    if (!stats) return;
    for (let id in stats) {
        const cSpan = document.getElementById(`clicks-${id}`);
        const hSpan = document.getElementById(`hearts-${id}`);
        if (cSpan) cSpan.innerText = stats[id].clicks || 0;
        if (hSpan) hSpan.innerText = stats[id].hearts || 0;
    }
});

function handleGameClick(gameID) {
    if (!localStorage.getItem(`voted_click_${gameID}`)) {
        database.ref(`stats/${gameID}/clicks`).transaction(c => (c || 0) + 1);
        localStorage.setItem(`voted_click_${gameID}`, "true");
    }
}

function toggleHeart(gameID) {
    const heartBtn = document.getElementById(`heart-${gameID}`);
    const alreadyHearted = localStorage.getItem(`voted_heart_${gameID}`);

    if (!alreadyHearted) {
        database.ref(`stats/${gameID}/hearts`).transaction(h => (h || 0) + 1);
        localStorage.setItem(`voted_heart_${gameID}`, "true");
        heartBtn.innerText = "❤️";
        heartBtn.classList.add('active');
    } else {
        database.ref(`stats/${gameID}/hearts`).transaction(h => Math.max(0, (h || 0) - 1));
        localStorage.removeItem(`voted_heart_${gameID}`);
        heartBtn.innerText = "🤍";
        heartBtn.classList.remove('active');
    }
}

function syncHeartsUI() {
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const id = btn.id.replace('heart-', '');
        if (localStorage.getItem(`voted_heart_${id}`)) {
            btn.innerText = "❤️";
            btn.classList.add('active');
        }
    });
}

// COMMENT LOGIC
function openComments(gameID) {
    currentGameID = gameID;
    const panel = document.getElementById('comment-panel');
    const list = document.getElementById('comment-list');
    document.getElementById('panel-title').innerText = "Chat: " + gameID.replace(/-/g, ' ');
    panel.classList.add('active');
    list.innerHTML = '<p style="text-align:center; opacity:0.5;">Loading chat...</p>';
    
    database.ref('comments/' + gameID).on('value', (snapshot) => {
        list.innerHTML = '';
        if (!snapshot.exists()) {
            list.innerHTML = '<p style="text-align:center; opacity:0.5;">No comments yet!</p>';
            return;
        }
        snapshot.forEach((child) => {
            const val = child.val();
            const div = document.createElement('div');
            div.className = 'single-comment';
            div.innerHTML = `<b style="color:#7ab8ff;">${val.name}:</b><div style="margin-top:4px;">${val.content}</div>`;
            list.appendChild(div);
        });
        list.scrollTop = list.scrollHeight;
    });
}

function closeComments() {
    document.getElementById('comment-panel').classList.remove('active');
    if(currentGameID) database.ref('comments/' + currentGameID).off();
}

document.getElementById('post-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('user-name');
    const textInput = document.getElementById('user-comment');
    const name = nameInput.value.trim() || "Guest";
    const text = textInput.value.trim();
    if (!text || !currentGameID) return;
    database.ref('comments/' + currentGameID).push({
        name: name,
        content: text,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => { textInput.value = ''; });
});

syncHeartsUI();
updateGameCount();