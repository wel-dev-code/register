// ============================================
// 🔥 FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyD560jlVxkeo-TU32P2C5xw-lyu4JU_y7g",
  authDomain: "iscc-registration.firebaseapp.com",
  projectId: "iscc-registration",
  storageBucket: "iscc-registration.firebasestorage.app",
  messagingSenderId: "845706410060",
  appId: "1:845706410060:web:8a03f3a66b3191d0fd5ce9",
  measurementId: "G-DH6TKYEM3P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const REG_COLLECTION = 'registrations';

// ============================================
// 🔧 UTILITY FUNCTIONS
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    return text.toString().replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

function showMsg(text, type) {
    const box = document.getElementById('statusMessage');
    if (!box) return;
    box.classList.remove('hidden', 'bg-green-500/20', 'text-green-400', 'border-green-500/30', 'bg-red-500/20', 'text-red-400', 'border-red-500/30', 'bg-yellow-500/20', 'text-yellow-400', 'border-yellow-500/30');
    box.classList.add('status-msg');
    box.textContent = text;
    if (type === 'success') box.classList.add('bg-green-500/20', 'text-green-400', 'border', 'border-green-500/30');
    else if (type === 'error') box.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/30');
    else box.classList.add('bg-yellow-500/20', 'text-yellow-400', 'border', 'border-yellow-500/30');
}

function setLoading(loading, btnId = 'submitBtn', contentId = 'btnContent') {
    const btn = document.getElementById(btnId);
    const content = document.getElementById(contentId);
    if (!btn || !content) return;
    btn.disabled = loading;
    content.innerHTML = loading ? '<div class="spinner"></div> Processing...' : 'Submit Registration 🚀';
}

// ============================================
// 📡 FIRESTORE OPERATIONS
// ============================================
async function checkDuplicateName(fullname) {
    const snap = await db.collection(REG_COLLECTION).where('fullnameLower', '==', fullname.toLowerCase().trim()).get();
    return !snap.empty;
}

async function addRegistration(data) {
    return db.collection(REG_COLLECTION).add({
        fullname: data.fullname.trim(),
        fullnameLower: data.fullname.toLowerCase().trim(),
        username: data.username.trim(),
        gmail: data.gmail.trim(),
        tel: data.tel.trim(),
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

async function getRegistrations() {
    const snap = await db.collection(REG_COLLECTION).orderBy('timestamp', 'desc').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function updateStatus(id, status) {
    await db.collection(REG_COLLECTION).doc(id).update({ status });
}

async function deleteReg(id) {
    await db.collection(REG_COLLECTION).doc(id).delete();
}

async function clearAll() {
    const snap = await db.collection(REG_COLLECTION).get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
}

// ============================================
// 🖼️ UI RENDERING
// ============================================
function showView(view) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${view}-view`).classList.remove('hidden');
    if (view === 'admin') loadAdmin();
}

async function renderStudentList() {
    const list = document.getElementById('student-list');
    list.innerHTML = '<div class="loading-spinner">Loading...</div>';
    try {
        const regs = await getRegistrations();
        list.innerHTML = '';
        if (!regs.length) {
            list.innerHTML = '<p style="color:#94a3b8; text-align:center; grid-column: 1/-1;">No registrations yet.</p>';
            return;
        }
        regs.forEach(r => {
            const card = document.createElement('div');
            card.className = `student-card ${r.status === 'pending' ? 'pending' : ''}`;
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#f8f8f2;">${escapeHtml(r.fullname)}</strong>
                    <span class="${r.status === 'approved' ? 'badge-approved' : 'badge-pending'}">${r.status}</span>
                </div>
                <div style="color:#22d3ee; margin-top:5px;">@${escapeHtml(r.username)}</div>
            `;
            list.appendChild(card);
        });
    } catch (err) {
        list.innerHTML = '<p style="color:#f87171; text-align:center;">Error loading data</p>';
    }
}

async function loadAdmin() {
    const tbody = document.getElementById('admin-tbody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Loading...</td></tr>';
    try {
        const regs = await getRegistrations();
        tbody.innerHTML = '';
        if (!regs.length) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:20px;">No registrations yet.</td></tr>';
            return;
        }
        regs.forEach(r => {
            const tr = document.createElement('tr');
            const actions = r.status === 'pending'
                ? `<button class="action-btn btn-approve" onclick="approveReg('${r.id}')">✅</button><button class="action-btn btn-delete" onclick="removeReg('${r.id}')">🗑️</button>`
                : `<button class="action-btn btn-delete" onclick="removeReg('${r.id}')">🗑️</button>`;
            tr.innerHTML = `
                <td>${escapeHtml(r.fullname)}</td>
                <td>@${escapeHtml(r.username)}</td>
                <td>${escapeHtml(r.gmail)}</td>
                <td><span class="${r.status === 'approved' ? 'badge-approved' : 'badge-pending'}">${r.status.toUpperCase()}</span></td>
                <td>${actions}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#f87171;">Error loading data</td></tr>';
    }
}

// ============================================
// 🎛️ EVENT LISTENERS
// ============================================
document.getElementById('regForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
        fullname: document.getElementById('fullname').value.trim(),
        username: document.getElementById('username').value.trim(),
        gmail: document.getElementById('gmail').value.trim(),
        tel: document.getElementById('tel').value.trim()
    };
    if (Object.values(data).some(v => !v)) return showMsg("Please fill all fields.", "error");

    setLoading(true);
    showMsg("Checking duplicates...", "warning");

    try {
        if (await checkDuplicateName(data.fullname)) {
            showMsg("This name is already registered.", "error");
            setLoading(false);
            return;
        }
        showMsg("Submitting...", "warning");
        await addRegistration(data);
        showMsg("✅ Registered! Awaiting admin approval.", "success");
        this.reset();
        renderStudentList();
    } catch (err) {
        showMsg(`❌ ${err.message}`, "error");
    } finally {
        setLoading(false);
    }
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const u = document.getElementById('adminUser').value;
    const p = document.getElementById('adminPass').value;
    const err = document.getElementById('login-error');
    if (u === "David" && p === "david@10") {
        err.classList.add('hidden');
        this.reset();
        showView('admin');
    } else {
        err.textContent = "Invalid credentials.";
        err.classList.remove('hidden');
    }
});

window.logout = () => showView('home');
window.approveReg = async (id) => { try { await updateStatus(id, 'approved'); loadAdmin(); renderStudentList(); } catch(e){ alert('Failed'); } };
window.removeReg = async (id) => { if(confirm('Delete?')) { try { await deleteReg(id); loadAdmin(); renderStudentList(); } catch(e){ alert('Failed'); } } };
window.clearAllRegistrations = async () => {
    if(confirm("⚠️ Delete ALL registrations permanently?")) {
        try { await clearAll(); loadAdmin(); renderStudentList(); alert("Cleared!"); } catch(e){ alert("Failed"); }
    }
};

// ============================================
// ⏱️ 15s TIMER & TRANSITION
// ============================================
let timeLeft = 15;
const timerEl = document.getElementById('timer-count');
const detailsEl = document.getElementById('competition-details');
const listEl = document.getElementById('student-registrations');

const countdown = setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
        timerEl.textContent = timeLeft;
    } else {
        clearInterval(countdown);
        detailsEl.style.opacity = '0';
        setTimeout(() => {
            detailsEl.classList.add('hidden');
            listEl.classList.remove('hidden');
            listEl.style.opacity = '1';
            renderStudentList();
        }, 500);
    }
}, 1000);

// ============================================
// 🎨 CODE MATRIX ANIMATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('codeMatrix');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, cols, drops;
    
    const lines = [
        "def dfs(graph, start):", "async function fetch(url) {", "import json",
        "const db = new Database()", "class Node:", "try {", "await response.json()",
        "if (err) throw err;", "return await result;", "print('Hello World')",
        "def binary_search(arr, t):", "function debounce(fn, d) {", "let timer;",
        "export default App;", "import React from 'react';", "const [state, setState] = useState()",
        "fetch('/api/data')", "    .then(res => res.json())", "def bubble_sort(lst):",
        "for i in range(len(lst)):", "while left <= right:", "mid = (left + right) // 2",
        "async function handler(e) {", "console.log('Ready');", "module.exports = app;",
        "CREATE TABLE users (", "SELECT * FROM data WHERE", "INSERT INTO logs VALUES",
        "def factorial(n):", "if n <= 1 return 1;", "return n * factorial(n-1)",
        "git commit -m 'fix'", "npm install --save", "docker build -t app .",
        "# BSSM IISCC-2026", "let success = true;", "return 0;",
        "firebase.firestore().collection('registrations')"
    ];
    const colors = ['#ff79c6','#8be9fd','#f1fa8c','#50fa7b','#ffb86c','#bd93f9','#f8f8f2'];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        cols = Math.floor(w / 20);
        drops = Array(cols).fill().map(() => ({
            y: Math.random() * -100,
            speed: Math.random() * 2 + 1,
            text: lines[Math.floor(Math.random() * lines.length)],
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
    }
    window.addEventListener('resize', resize);
    resize();

    function draw() {
        requestAnimationFrame(draw);
        ctx.fillStyle = 'rgba(3, 7, 18, 0.12)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = '14px monospace';
        
        for (let i = 0; i < cols; i++) {
            const d = drops[i];
            if (Math.random() < 0.01) d.text = lines[Math.floor(Math.random() * lines.length)];
            
            ctx.fillStyle = d.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = d.color;
            ctx.fillText(d.text, i * 20, d.y);
            ctx.shadowBlur = 0;
            
            d.y += d.speed;
            if (d.y > h + 100) {
                d.y = Math.random() * -100;
                d.speed = Math.random() * 2 + 1;
            }
        }
    }
    draw();
    renderStudentList();
});
