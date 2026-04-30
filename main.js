// ============================================
// FIREBASE CONFIGURATION
// ============================================
// TODO: Replace with your Firebase project config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const storage = firebase.storage();
const auth = firebase.auth();

// Collections
const REGISTRATIONS_COLLECTION = 'registrations';
const DISCUSSIONS_COLLECTION = 'discussions';

// ============================================
// REGISTRATION FUNCTIONS
// ============================================

async function checkDuplicateName(fullname) {
    const snapshot = await db.collection(REGISTRATIONS_COLLECTION)
        .where('fullname', '==', fullname.toLowerCase().trim())
        .get();
    return !snapshot.empty;
}

async function addRegistration(data) {
    const registrationData = {
        fullname: data.fullname.toLowerCase().trim(),
        fullnameDisplay: data.fullname.trim(),
        username: data.username.trim(),
        gmail: data.gmail.trim(),
        tel: data.tel.trim(),
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection(REGISTRATIONS_COLLECTION).add(registrationData);
    return docRef.id;
}

async function getRegistrations() {
    const snapshot = await db.collection(REGISTRATIONS_COLLECTION)
        .orderBy('timestamp', 'desc')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

async function updateRegistrationStatus(id, status) {
    await db.collection(REGISTRATIONS_COLLECTION).doc(id).update({ status });
}

async function deleteRegistration(id) {
    await db.collection(REGISTRATIONS_COLLECTION).doc(id).delete();
}

async function clearAllRegistrations() {
    const snapshot = await db.collection(REGISTRATIONS_COLLECTION).get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
}

// ============================================
// DISCUSSION FUNCTIONS
// ============================================

async function addDiscussion(text, imageUrl = null) {
    const discussionData = {
        text: text.trim(),
        imageUrl: imageUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: new Date().toISOString()
    };
    
    await db.collection(DISCUSSIONS_COLLECTION).add(discussionData);
}

async function getDiscussions() {
    const snapshot = await db.collection(DISCUSSIONS_COLLECTION)
        .orderBy('timestamp', 'desc')
        .get();
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

async function uploadImage(file) {
    const timestamp = Date.now();
    const storageRef = storage.ref(`discussions/${timestamp}_${file.name}`);
    const uploadTask = await storageRef.put(file);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    return downloadURL;
}

async function deleteDiscussion(id, imageUrl) {
    if (imageUrl) {
        // Delete from storage
        const imageRef = storage.refFromURL(imageUrl);
        await imageRef.delete().catch(() => {}); // Ignore if doesn't exist
    }
    await db.collection(DISCUSSIONS_COLLECTION).doc(id).delete();
}

// ============================================
// UI RENDERING FUNCTIONS
// ============================================

function showView(viewName) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${viewName}-view`).classList.remove('hidden');
    
    if (viewName === 'admin') {
        loadAdminData();
    } else if (viewName === 'discussions') {
        loadDiscussions();
    }
}

async function renderStudentList() {
    const list = document.getElementById('student-list');
    list.innerHTML = '<div class="loading-spinner">Loading registrations...</div>';
    
    try {
        const registrations = await getRegistrations();
        
        if (registrations.length === 0) {
            list.innerHTML = '<p style="color:#94a3b8; text-align:center; grid-column: 1/-1; padding: 20px;">Waiting for registrations...</p>';
            return;
        }

        list.innerHTML = '';
        registrations.forEach(r => {
            const card = document.createElement('div');
            card.className = `student-card ${r.status === 'pending' ? 'pending' : ''}`;
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color: #f8f8f2; font-size: 1.05rem;">${escapeHtml(r.fullnameDisplay || r.fullname)}</strong>
                    <span class="${r.status === 'approved' ? 'badge-approved' : 'badge-pending'}">${r.status}</span>
                </div>
                <div style="color: #22d3ee; margin-top: 5px;">@${escapeHtml(r.username)}</div>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading registrations:', error);
        list.innerHTML = '<p style="color:#f87171; text-align:center;">Error loading data</p>';
    }
}

async function loadAdminData() {
    const tbody = document.getElementById('admin-tbody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Loading...</td></tr>';
    
    try {
        const registrations = await getRegistrations();
        
        if (registrations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding: 20px;">No registrations yet.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        registrations.forEach(r => {
            const tr = document.createElement('tr');
            const badgeClass = r.status === 'approved' ? 'badge-approved' : 'badge-pending';
            
            const actionHtml = r.status === 'pending' 
                ? `<button class="action-btn btn-approve" onclick="approveRegistration('${r.id}')">✅ Approve</button>
                   <button class="action-btn btn-delete" onclick="removeRegistration('${r.id}')">🗑️</button>`
                : `<button class="action-btn btn-delete" onclick="removeRegistration('${r.id}')">🗑️</button>`;
            
            tr.innerHTML = `
                <td>${escapeHtml(r.fullnameDisplay || r.fullname)}</td>
                <td>@${escapeHtml(r.username)}</td>
                <td>${escapeHtml(r.gmail)}</td>
                <td><span class="${badgeClass}">${r.status.toUpperCase()}</span></td>
                <td>${actionHtml}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading admin data:', error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#f87171;">Error loading data</td></tr>';
    }
}

async function loadDiscussions() {
    const feed = document.getElementById('discFeed');
    feed.innerHTML = '<div class="loading-spinner">Loading discussions...</div>';
    
    try {
        const discussions = await getDiscussions();

        if (discussions.length === 0) {
            feed.innerHTML = '<p style="color:#94a3b8; text-align:center; padding: 20px;">No discussions yet. Start the conversation!</p>';
            return;
        }

        feed.innerHTML = '';
        discussions.forEach(d => {
            const div = document.createElement('div');
            div.className = 'disc-post fade-in';
            div.innerHTML = `
                <span class="disc-post-time">${d.createdAt ? new Date(d.createdAt).toLocaleString() : 'Recently'}</span>
                <div class="disc-post-text">${escapeHtml(d.text)}</div>
                ${d.imageUrl ? `<img src="${d.imageUrl}" alt="Discussion image" onerror="this.style.display='none'">` : ''}
            `;
            feed.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading discussions:', error);
        feed.innerHTML = '<p style="color:#f87171; text-align:center;">Error loading discussions</p>';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================
// FORM HANDLERS
// ============================================

document.getElementById('regForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const btnContent = document.getElementById('btnContent');
    const msgBox = document.getElementById('statusMessage');
    
    const fullname = document.getElementById('fullname').value.trim();
    const username = document.getElementById('username').value.trim();
    const gmail = document.getElementById('gmail').value.trim();
    const tel = document.getElementById('tel').value.trim();

    if (!fullname || !username || !gmail || !tel) {
        showMsg("Please fill all fields.", "error");
        return;
    }

    btn.disabled = true;
    btnContent.innerHTML = '<div class="spinner"></div> Checking...';
    showMsg("Checking for duplicates...", "warning");

    try {
        // Check for duplicate
        const isDuplicate = await checkDuplicateName(fullname);
        if (isDuplicate) {
            showMsg("This Full Name is already registered.", "error");
            btn.disabled = false;
            btnContent.innerHTML = 'Submit Registration 🚀';
            return;
        }

        // Add to Firestore
        btnContent.innerHTML = '<div class="spinner"></div> Submitting...';
        await addRegistration({ fullname, username, gmail, tel });
        
        showMsg("✅ Registration submitted successfully! Awaiting admin approval.", "success");
        document.getElementById('regForm').reset();
        renderStudentList();

    } catch (error) {
        console.error("Registration error:", error);
        showMsg(`❌ Submission failed: ${error.message}`, "error");
    } finally {
        btn.disabled = false;
        btnContent.innerHTML = 'Submit Registration 🚀';
    }
});

document.getElementById('discForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const text = document.getElementById('discText').value.trim();
    const imageInput = document.getElementById('discImage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!text && !imageInput.files[0]) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';

    try {
        let imageUrl = null;
        
        if (imageInput.files[0]) {
            showMsg("Uploading image...", "warning");
            imageUrl = await uploadImage(imageInput.files[0]);
        }

        await addDiscussion(text, imageUrl);
        
        document.getElementById('discForm').reset();
        document.getElementById('discFilePreview').textContent = '';
        loadDiscussions();
        showMsg("✅ Discussion posted!", "success");

    } catch (error) {
        console.error("Discussion error:", error);
        showMsg(`❌ Failed to post: ${error.message}`, "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Discussion';
    }
});

document.getElementById('discImage').addEventListener('change', function() {
    if(this.files && this.files[0]) {
        const sizeMB = this.files[0].size / (1024 * 1024);
        if (sizeMB > 5) {
            showMsg("⚠️ Image must be less than 5MB", "error");
            this.value = '';
            document.getElementById('discFilePreview').textContent = '';
            return;
        }
        document.getElementById('discFilePreview').textContent = `✅ ${this.files[0].name} (${sizeMB.toFixed(2)}MB)`;
    }
});

// ============================================
// ADMIN FUNCTIONS
// ============================================

async function approveRegistration(id) {
    try {
        await updateRegistrationStatus(id, 'approved');
        loadAdminData();
        renderStudentList();
        showMsg("✅ Registration approved!", "success");
    } catch (error) {
        console.error("Approval error:", error);
        showMsg("❌ Failed to approve", "error");
    }
}

async function removeRegistration(id) {
    if(!confirm('Remove this registration?')) return;
    try {
        await deleteRegistration(id);
        loadAdminData();
        renderStudentList();
        showMsg("✅ Registration removed", "success");
    } catch (error) {
        console.error("Delete error:", error);
        showMsg("❌ Failed to remove", "error");
    }
}

async function clearAllRegistrations() {
    if(confirm("⚠️ WARNING: This will delete ALL registrations permanently. Continue?")) {
        try {
            await clearAllRegistrations();
            loadAdminData();
            renderStudentList();
            showMsg("✅ All registrations cleared", "success");
        } catch (error) {
            console.error("Clear error:", error);
            showMsg("❌ Failed to clear", "error");
        }
    }
}

// ============================================
// ADMIN LOGIN
// ============================================

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const errorBox = document.getElementById('login-error');

    // Simple credential check (replace with Firebase Auth for production)
    if (user === "David" && pass === "david@10") {
        errorBox.classList.add('hidden');
        document.getElementById('loginForm').reset();
        showView('admin');
    } else {
        errorBox.textContent = "Invalid credentials.";
        errorBox.classList.remove('hidden');
    }
});

function logout() {
    showView('home');
}

function showMsg(text, type) {
    const box = document.getElementById('statusMessage');
    if (!box) return;
    
    box.classList.remove('hidden');
    box.textContent = text;
    box.className = '';
    
    if (type === 'success') box.classList.add('status-msg', 'bg-green-500/20', 'text-green-400', 'border', 'border-green-500/30');
    else if (type === 'error') box.classList.add('status-msg', 'bg-red-500/20', 'text-red-400', 'border', 'border-red-500/30');
    else box.classList.add('status-msg', 'bg-yellow-500/20', 'text-yellow-400', 'border', 'border-yellow-500/30');
    
    box.style.marginTop = '15px';
    box.style.padding = '12px';
    box.style.borderRadius = '8px';
    box.style.textAlign = 'center';
}

// ============================================
// TIMER & TRANSITION
// ============================================
const timerEl = document.getElementById('timer-count');
const detailsEl = document.getElementById('competition-details');
const listEl = document.getElementById('student-registrations');
let homeTimer = 15;
let showList = false;

const countdown = setInterval(() => {
    if (!showList && homeTimer > 0) {
        homeTimer--;
        timerEl.textContent = homeTimer;
        
        if (homeTimer === 0) {
            clearInterval(countdown);
            showList = true;
            detailsEl.style.transition = "opacity 0.8s ease";
            detailsEl.style.opacity = "0";
            setTimeout(() => {
                detailsEl.classList.add('hidden');
                listEl.classList.remove('hidden');
                listEl.style.opacity = "0";
                listEl.style.transition = "opacity 0.8s ease";
                setTimeout(() => {
                    listEl.style.opacity = "1";
                    renderStudentList();
                }, 50);
            }, 800);
        }
    }
}, 1000);

// ============================================
// BACKGROUND ANIMATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('codeMatrix');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops; 

    const codeLines = [
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

    const colors = ['#ff79c6', '#8be9fd', '#f1fa8c', '#50fa7b', '#ffb86c', '#bd93f9', '#f8f8f2'];

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / 20);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = {
                y: Math.random() * height / -1,
                speed: Math.random() * 2 + 1,
                text: codeLines[Math.floor(Math.random() * codeLines.length)],
                color: colors[Math.floor(Math.random() * colors.length)]
            };
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function draw() {
        requestAnimationFrame(draw);
        ctx.fillStyle = 'rgba(3, 7, 18, 0.12)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '14px monospace';
        
        for (let i = 0; i < columns; i++) {
            const drop = drops[i];
            if (Math.random() < 0.01) {
                drop.text = codeLines[Math.floor(Math.random() * codeLines.length)];
            }

            ctx.fillStyle = drop.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = drop.color;
            
            ctx.fillText(drop.text, i * 20, drop.y);
            ctx.shadowBlur = 0;
            
            drop.y += drop.speed;
            
            if (drop.y > height + 100) {
                drop.y = Math.random() * -100;
                drop.speed = Math.random() * 2 + 1;
            }
        }
    }

    draw();
    renderStudentList();
});
