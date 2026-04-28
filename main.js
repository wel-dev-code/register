
        // --- STORAGE LOGIC ---
        const STORAGE_KEY = 'coding_comp_registrations_v2';
        
        function getRegistrations() {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        }
        
        function saveRegistrations(data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }

        function isDuplicate(fullname) {
            const regs = getRegistrations();
            const cleanName = fullname.toLowerCase().trim();
            return regs.some(r => r.fullname.toLowerCase().trim() === cleanName);
        }

        function addRegistration(data) {
            const regs = getRegistrations();
            data.status = 'pending'; // Default pending
            data.id = Date.now();
            data.timestamp = new Date().toISOString();
            regs.push(data);
            saveRegistrations(regs);
        }

        function updateRegistration(id, newStatus) {
            const regs = getRegistrations();
            const idx = regs.findIndex(r => r.id === id);
            if (idx !== -1) {
                regs[idx].status = newStatus;
                saveRegistrations(regs);
                renderAdminTable();
                renderStudentList();
            }
        }

        function deleteRegistration(id) {
            if(!confirm('Remove this registration?')) return;
            let regs = getRegistrations();
            regs = regs.filter(r => r.id !== id);
            saveRegistrations(regs);
            renderAdminTable();
            renderStudentList();
        }

        function clearAllRegistrations() {
            if(confirm("Are you sure you want to clear ALL registrations? This cannot be undone.")) {
                localStorage.removeItem(STORAGE_KEY);
                renderAdminTable();
                renderStudentList();
                alert("All accounts cleared.");
            }
        }

        // --- UI RENDERING ---
        function showView(viewName) {
            document.getElementById('home-view').classList.add('hidden');
            document.getElementById('login-view').classList.add('hidden');
            document.getElementById('admin-view').classList.add('hidden');
            
            document.getElementById(`${viewName}-view`).classList.remove('hidden');
            
            if (viewName === 'admin') {
                renderAdminTable();
            } else if (viewName === 'home') {
                renderStudentList();
            }
        }

        function renderAdminTable() {
            const tbody = document.getElementById('admin-tbody');
            tbody.innerHTML = '';
            const regs = getRegistrations();
            
            if (regs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding: 20px;">No registrations yet.</td></tr>';
                return;
            }

            // Sort by newest
            const sorted = [...regs].sort((a, b) => b.id - a.id);

            sorted.forEach(r => {
                const tr = document.createElement('tr');
                const badgeClass = r.status === 'approved' ? 'badge-approved' : 'badge-pending';
                
                const actionHtml = r.status === 'pending' 
                    ? `<button class="action-btn btn-approve" onclick="updateRegistration(${r.id}, 'approved')">✅ Approve</button>
                       <button class="action-btn btn-delete" onclick="deleteRegistration(${r.id})">🗑️</button>`
                    : `<button class="action-btn btn-delete" onclick="deleteRegistration(${r.id})">🗑️</button>`;
                
                tr.innerHTML = `
                    <td>${escapeHtml(r.fullname)}</td>
                    <td>@${escapeHtml(r.username)}</td>
                    <td>${escapeHtml(r.gmail)}</td>
                    <td><span class="${badgeClass}">${r.status.toUpperCase()}</span></td>
                    <td>${actionHtml}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        function renderStudentList() {
            const list = document.getElementById('student-list');
            list.innerHTML = '';
            const regs = getRegistrations();
            
            // Show both approved and pending as requested
            const students = regs;
            
            if (students.length === 0) {
                list.innerHTML = '<p style="color:#94a3b8; text-align:center; grid-column: 1/-1; padding: 20px;">Waiting for registrations...</p>';
                return;
            }

            students.forEach(r => {
                const card = document.createElement('div');
                card.className = `student-card ${r.status === 'pending' ? 'pending' : ''}`;
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color: #f8f8f2; font-size: 1.05rem;">${escapeHtml(r.fullname)}</strong>
                        <span class="${r.status === 'approved' ? 'badge-approved' : 'badge-pending'}">${r.status}</span>
                    </div>
                    <div style="color: #22d3ee; margin-top: 5px;">@${escapeHtml(r.username)}</div>
                `;
                list.appendChild(card);
            });
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

        // --- FORM HANDLING ---
        const EMAIL_ENDPOINT = 'https://formsubmit.co/ajax/9d6e8e62a9a4dfcc3afb4ca2633caaa1';

        document.getElementById('regForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const btnContent = document.getElementById('btnContent');
            const msgBox = document.getElementById('statusMessage');
            
            const fullname = document.getElementById('fullname').value.trim();
            const username = document.getElementById('username').value.trim();
            const gmail = document.getElementById('gmail').value.trim();
            const tel = document.getElementById('tel').value.trim();

            // Validation
            if (!fullname || !username || !gmail || !tel) {
                showMsg("Please fill all fields.", "error");
                return;
            }

            if (isDuplicate(fullname)) {
                showMsg("This Full Name is already registered.", "error");
                return;
            }

            // Loading State
            btn.disabled = true;
            btnContent.innerHTML = '<div class="spinner"></div> Sending...';
            showMsg("Processing...", "warning");

            try {
                // Send to FormSubmit
                const formData = new URLSearchParams();
                formData.append('_subject', 'New Registration - Inter Schools Coding Competition');
                formData.append('_template', 'table');
                formData.append('_captcha', 'false');
                formData.append('Full Name', fullname);
                formData.append('Preferred Username', username);
                formData.append('Gmail', gmail);
                formData.append('Phone Number', tel);

                const response = await fetch(EMAIL_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
                    body: formData
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || 'Submission failed. Please ensure email activation.');
                }

                // Success: Save locally
                addRegistration({ fullname, username, gmail, tel });
                
                showMsg("✅ Registration submitted successfully! Pending approval.", "success");
                document.getElementById('regForm').reset();
                renderStudentList();

            } catch (error) {
                console.error("Submission error:", error);
                showMsg(`❌ ${error.message}`, "error");
            } finally {
                btn.disabled = false;
                btnContent.innerHTML = 'Submit Registration 🚀';
            }
        });

        function showMsg(text, type) {
            const box = document.getElementById('statusMessage');
            box.classList.remove('hidden');
            box.textContent = text;
            box.className = ''; // reset
            
            if (type === 'success') box.classList.add('bg-green-500/20', 'text-green-400', 'border', 'border-green-500/30');
            else if (type === 'error') box.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/30');
            else box.classList.add('bg-yellow-500/20', 'text-yellow-400', 'border', 'border-yellow-500/30');
            
            // Re-add base classes if needed or rely on utility classes
            box.style.marginTop = '15px';
            box.style.padding = '12px';
            box.style.borderRadius = '8px';
            box.style.textAlign = 'center';
        }

        // --- ADMIN LOGIN ---
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const user = document.getElementById('adminUser').value;
            const pass = document.getElementById('adminPass').value;
            const errorBox = document.getElementById('login-error');

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

        // --- TIMER & TRANSITION ---
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

        // --- BACKGROUND ANIMATION (MATRIX CODE RAIN) ---
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
                "git commit -m 'fix'", "npm install --save", "docker build -t app ."
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
                    
                    // Randomly change text occasionally
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
            
            // Initial Render
            renderStudentList();
        });
