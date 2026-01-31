/**
 * smaal.pro | Game Viewer & Social Logic
 * Handles Stats, Likes, Search, and Live Chat
 */

// --- 1. FIREBASE CONFIGURATION ---
// Replace these values with your actual Firebase Project settings
const firebaseConfig = {
    apiKey: "AIzaSyBDXDtnufqucWuFPIYOnJOYxiLYriHfkVo",
    authDomain: "code-stub.firebaseapp.com",
    databaseURL: "https://code-stub-default-rtdb.firebaseio.com",
    projectId: "code-stub",
    storageBucket: "code-stub.firebasestorage.app",
    messagingSenderId: "389870178886",
    appId: "1:389870178886:web:525e1e2f4dfaf0a3f33047"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- 2. GLOBAL STATE ---
let currentChatGameId = null;
let visibleLimit = 8;
let allCards = [];

// --- 3. LOCAL STORAGE HELPERS ---
const getStored = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const saveStored = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// --- 4. COMMENT / CHAT LOGIC ---
window.openComments = function(id) {
    currentChatGameId = id;
    const panel = document.getElementById('comment-panel');
    const title = document.getElementById('panel-game-title');
    
    // Update Panel UI
    if(title) title.innerText = id.replace(/-/g, ' ');
    panel.classList.add('active');

    // Load live comments for this specific game
    const commentList = document.querySelector('.comment-list');
    db.ref(`comments/${id}`).on('value', (snapshot) => {
        commentList.innerHTML = ''; 
        const data = snapshot.val();
        
        if (data) {
            Object.values(data).forEach(msg => {
                const div = document.createElement('div');
                div.className = 'single-comment';
                div.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
                commentList.appendChild(div);
            });
            commentList.scrollTop = commentList.scrollHeight; // Auto-scroll
        } else {
            commentList.innerHTML = '<div style="text-align:center; color:#666; margin-top:20px;">No messages yet. Start the chat!</div>';
        }
    });
};

window.closeComments = function() {
    document.getElementById('comment-panel').classList.remove('active');
    if (currentChatGameId) {
        db.ref(`comments/${currentChatGameId}`).off(); // Kill listener to save data/speed
    }
};

window.sendComment = function() {
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');
    
    if (!textInput.value.trim()) return;

    const newMsg = {
        user: nameInput.value.trim() || "Guest",
        text: textInput.value.trim(),
        timestamp: Date.now()
    };

    db.ref(`comments/${currentChatGameId}`).push(newMsg);
    textInput.value = ''; 
};

// --- 5. STATS & LIKES LOGIC ---
function syncStats() {
    // Sync Clicks and Hearts
    db.ref('stats').on('value', (snapshot) => {
        const stats = snapshot.val();
        if (!stats) return;
        for (let id in stats) {
            const clickEl = document.getElementById(`clicks-${id}`);
            const heartEl = document.getElementById(`hearts-${id}`);
            if (clickEl) clickEl.innerText = stats[id].clicks || 0;
            if (heartEl) heartEl.innerText = stats[id].hearts || 0;
        }
    });

    // Sync Chat bubble counts
    db.ref('comments').on('value', (snapshot) => {
        const allComments = snapshot.val();
        if (!allComments) return;
        for (let id in allComments) {
            const count = Object.keys(allComments[id]).length;
            const btn = document.querySelector(`[onclick="openComments('${id}')"]`);
            if (btn) btn.innerText = `💬 Chat (${count})`;
        }
    });
}

window.handleGameClick = function(id) {
    let clicked = getStored('clicked_games');
    if (!clicked.includes(id)) {
        db.ref(`stats/${id}/clicks`).transaction(c => (c || 0) + 1);
        clicked.push(id);
        saveStored('clicked_games', clicked);
    }
};

window.toggleHeart = function(id) {
    const btn = document.getElementById(`heart-${id}`);
    let liked = getStored('liked_games');
    const isAlreadyLiked = liked.includes(id);

    // Atomic update in Firebase
    db.ref(`stats/${id}/hearts`).transaction(c => {
        return isAlreadyLiked ? Math.max(0, (c || 1) - 1) : (c || 0) + 1;
    });

    if (isAlreadyLiked) {
        liked = liked.filter(item => item !== id);
        btn.innerText = "🤍"; 
        btn.classList.remove('active');
    } else {
        liked.push(id);
        btn.innerText = "❤️"; 
        btn.classList.add('active');
    }
    saveStored('liked_games', liked);
};

// --- 6. SEARCH & GRID LOGIC ---
function updateGrid() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    let matches = 0;

    allCards.forEach(card => {
        const title = card.querySelector('.card-title').innerText.toLowerCase();
        if (title.includes(searchTerm)) {
            if (matches < visibleLimit) card.classList.add('visible');
            else card.classList.remove('visible');
            matches++;
        } else {
            card.classList.remove('visible');
        }
    });

    const countEl = document.getElementById('gameCount');
    if (countEl) {
        countEl.innerText = `Showing ${Math.min(matches, visibleLimit)} of ${matches} games`;
    }

    const loadBtn = document.getElementById('loadMoreBtn');
    if (loadBtn) {
        loadBtn.style.display = matches > visibleLimit ? 'inline-block' : 'none';
    }
}

window.showMore = () => { 
    visibleLimit += 8; 
    updateGrid(); 
};

// --- 7. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    allCards = Array.from(document.querySelectorAll('.card'));
    
    // Live listeners
    syncStats();
    
    // UI Setup
    getStored('liked_games').forEach(id => {
        const btn = document.getElementById(`heart-${id}`);
        if (btn) { btn.innerText = "❤️"; btn.classList.add('active'); }
    });

    // Search event
    const searchBar = document.getElementById('searchInput');
    if (searchBar) {
        searchBar.addEventListener('input', () => {
            visibleLimit = 8;
            updateGrid();
        });
    }

    // Chat "Enter" key listener
    const chatInput = document.getElementById('comment-text');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.sendComment();
            }
        });
    }

    updateGrid();

    // Log site visit
    db.ref('siteVisits').transaction(count => (count || 0) + 1);
});