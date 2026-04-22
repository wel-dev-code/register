
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  background-color: white; /* Ensure the iframe has a white background */
                }

                
              </style>
                        </head>
                        <body>
                            

              <script>
                              // Animation Controls
let animationRunning = true;
let animationSpeed = 1;
let lastTime = 0;

// Enhanced Code Matrix Animation with Syntax Highlighting
// Real Python and JavaScript code snippets
const codeSnippets = [
// Python - DFS Algorithm
"def dfs(graph, start, visited=None):",
"    if visited is None:",
"        visited = set()",
"    visited.add(start)",
"    for neighbor in graph[start]:",
"        if neighbor not in visited:",
"            dfs(graph, neighbor, visited)",
"    return visited",

// JavaScript - Fetch API
"async function fetchUserData(userId) {",
"  try {",
"    const response = await fetch(`/api/users/${userId}`);",
"    if (!response.ok) throw new Error('Not found');",
"    const data = await response.json();",
"    return { success: true, user: data };",
"  } catch (error) {",
"    console.error('Fetch failed:', error.message);",
"    return { success: false, error: error.message };",
"  }",
"}",

// Python - Binary Search
"def binary_search(arr, target):",
"    left, right = 0, len(arr) - 1",
"    while left <= right:",
"        mid = (left + right) // 2",
"        if arr[mid] == target:",
"            return mid",
"        elif arr[mid] < target:",
"            left = mid + 1",
"        else:",
"            right = mid - 1",
"    return -1",

// JavaScript - Debounce
"function debounce(func, delay = 300) {",
"  let timerId;",
"  return (...args) => {",
"    clearTimeout(timerId);",
"    timerId = setTimeout(() => {",
"      func.apply(this, args);",
"    }, delay);",
"  };",
"}",

// Python - Class Definition
"class BinaryTreeNode:",
"    def __init__(self, val=0, left=None, right=None):",
"        self.val = val",
"        self.left = left",
"        self.right = right",
"",
"    def inorder_traversal(self, result=None):",
"        if result is None:",
"            result = []",
"        if self.left:",
"            self.left.inorder_traversal(result)",
"        result.append(self.val)",
"        if self.right:",
"            self.right.inorder_traversal(result)",
"        return result",

// JavaScript - React Component
"import React, { useState, useEffect } from 'react';",
"",
"function TodoApp() {",
"  const [todos, setTodos] = useState([]);",
"  const [input, setInput] = useState('');",
"",
"  const addTodo = () => {",
"    if (input.trim()) {",
"      setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }]);",
"      setInput('');",
"    }",
"  };",
"",
"  return (",
"    <div className='p-4 max-w-md mx-auto'>",
"      <input",
"        value={input}",
"        onChange={(e) => setInput(e.target.value)}",
"        placeholder='Add a task...'",
"        className='w-full p-2 border rounded'",
"      />",
"      <button onClick={addTodo} className='mt-2 bg-blue-500 text-white px-4 py-2 rounded'>",
"        Add",
"      </button>",
"      <ul className='mt-4 space-y-2'>",
"        {todos.map(todo => (",
"          <li key={todo.id} className='p-2 bg-gray-100 rounded'>{todo.text}</li>",
"        ))}",
"      </ul>",
"    </div>",
"  );",
"}",

// Python - List Comprehension
"def filter_even_squares(numbers):",
"    return [",
"        x**2",
"        for x in numbers",
"        if x % 2 == 0",
"        and x > 0",
"    ]",

// JavaScript - Array Methods
"const processNumbers = (arr) => {",
"  return arr",
"    .filter(n => n > 0)",
"    .map(n => Math.sqrt(n))",
"    .reduce((sum, val) => sum + val, 0);",
"};",

// Python - File Handling
"import json",
"",
"def load_config(filepath):",
"    with open(filepath, 'r') as f:",
"        config = json.load(f)",
"    return config.get('database', {})",

// JavaScript - Event Handler
"class EventEmitter {",
"  constructor() {",
"    this.events = {};",
"  }",
"",
"  on(event, listener) {",
"    if (!this.events[event]) this.events[event] = [];",
"    this.events[event].push(listener);",
"  }",
"",
"  emit(event, ...args) {",
"    (this.events[event] || []).forEach(fn => fn(...args));",
"  }",
"}",

// Python - Generator
"def fibonacci_generator():",
"    a, b = 0, 1",
"    while True:",
"        yield a",
"        a, b = b, a + b",
"",
"# Usage:",
"# fib = fibonacci_generator()",
"# print(next(fib))  # 0",
"# print(next(fib))  # 1",

// JavaScript - Promise Chain
"function loadUserProfile(userId) {",
"  return fetch(`/api/users/${userId}`)",
"    .then(res => res.json())",
"    .then(user => {",
"      if (user.active) {",
"        return fetch(`/api/posts?author=${user.id}`);",
"      }",
"      throw new Error('User inactive');",
"    })",
"    .then(res => res.json())",
"    .catch(err => console.error('Error:', err));",
"}",

// Python - Type Hints
"from typing import Dict, List, Optional",
"",
"class Database:",
"    def __init__(self, host: str, port: int):",
"        self.host = host",
"        self.port = port",
"        self.connection: Optional[Connection] = None",
"",
"    def query(self, sql: str, params: Dict[str, any]) -> List[Dict]:",
"        if not self.connection:",
"            raise RuntimeError('Not connected')",
"        return self.connection.execute(sql, params)",

// JavaScript - Async Generator
"async function* fetchPages(baseUrl) {",
"  let page = 1;",
"  while (true) {",
"    const res = await fetch(`${baseUrl}?page=${page}`);",
"    const data = await res.json();",
"    if (data.items.length === 0) break;",
"    yield* data.items;",
"    page++;",
"  }",
"}",

// Python - Decorator
"import time",
"",
"def timer(func):",
"    def wrapper(*args, **kwargs):",
"        start = time.perf_counter()",
"        result = func(*args, **kwargs)",
"        end = time.perf_counter()",
"        print(f'{func.__name__} took {end - start:.4f}s')",
"        return result",
"    return wrapper",
"",
"@timer",
"def slow_function():",
"    time.sleep(0.5)",
"    return 'Done'",

// JavaScript - Proxy
"const createValidator = (schema) => {",
"  return new Proxy({}, {",
"    set(target, prop, value) {",
"      const rule = schema[prop];",
"      if (rule && !rule.validate(value)) {",
"        throw new Error(rule.message);",
"      }",
"      target[prop] = value;",
"      return true;",
"    }",
"  });",
"};",
];

// Syntax highlighting colors (Dracula theme inspired)
const syntaxColors = {
keyword: '#ff79c6',      // Pink - def, class, if, for, etc.
function: '#8be9fd',     // Cyan - function names
string: '#f1fa8c',       // Yellow - strings
comment: '#6272a4',      // Purple-gray - comments
number: '#bd93f9',       // Purple - numbers
operator: '#ff79c6',     // Pink - operators
variable: '#f8f8f2',     // White - variables
builtin: '#50fa7b',      // Green - built-in functions
type: '#ffb86c',         // Orange - types/classes
property: '#8be9fd',     // Cyan - object properties
decorator: '#ff79c6',    // Pink - decorators
punctuation: '#f8f8f2',  // White - brackets, parentheses
boolean: '#bd93f9',      // Purple - True/False
default: '#f8f8f2'       // White - default
};

// Helper Functions
function escapeHtml(text) {
const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};
return text.replace(/[&<>"']/g, m => map[m]);
}

function isKeyword(word) {
return ['def', 'class', 'if', 'for', 'while', 'return', 'import', 'from', 'else', 'elif', 
        'try', 'catch', 'throw', 'new', 'const', 'let', 'var', 'function', 'async', 'await',
        'yield', 'with', 'as', 'in', 'not', 'and', 'or', 'is', 'True', 'False', 'None',
        'export', 'default', 'typeof', 'instanceof', 'switch', 'case', 'break', 'continue',
        'do', 'finally', 'this', 'super', 'extends', 'implements', 'interface', 'type'].includes(word);
}

function isFunction(word, line, pos) {
// Check if followed by ( - indicates function call
const trimmed = line.substring(pos).trim();
return trimmed.startsWith('(') || word === 'def' || word === 'function';
}

function isBuiltin(word) {
return ['print', 'input', 'int', 'str', 'float', 'len', 'range', 'list', 'dict', 'set',
        'tuple', 'bool', 'type', 'isinstance', 'enumerate', 'zip', 'map', 'filter', 'sorted',
        'open', 'len', 'append', 'extend', 'pop', 'remove', 'clear', 'copy', 'count',
        'index', 'insert', 'reverse', 'sort', 'join', 'split', 'strip', 'replace',
        'fetch', 'console', 'log', 'error', 'warn', 'info', 'setTimeout', 'clearTimeout',
        'setInterval', 'clearInterval', 'Promise', 'JSON', 'parse', 'stringify', 'Math',
        'floor', 'ceil', 'round', 'random', 'sqrt', 'pow', 'abs', 'max', 'min',
        'Array', 'Object', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Map', 'Set',
        'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'apply', 'call', 'bind',
        'addEventListener', 'getElementById', 'querySelector', 'querySelectorAll',
        'createElement', 'appendChild', 'removeChild', 'setAttribute', 'getAttribute',
        'addEventListener', 'removeEventListener', 'preventDefault', 'stopPropagation'].includes(word);
}

function isType(word) {
return ['List', 'Dict', 'Set', 'Tuple', 'Optional', 'Union', 'Any', 'Callable',
        'Iterable', 'Iterator', 'Generator', 'Sequence', 'Mapping', 'MutableMapping',
        'int', 'float', 'str', 'bool', 'bytes', 'bytearray', 'complex', 'frozenset',
        'UserDict', 'UserList', 'UserString'].includes(word) || /^[A-Z]/.test(word);
}

function isBoolean(word) {
return ['True', 'False', 'None', 'null', 'undefined', 'NaN', 'Infinity'].includes(word);
}

function highlightLine(line) {
let html = '';
let inString = false;
let stringChar = '';
let i = 0;

while (i < line.length) {
    const char = line[i];
    const nextChar = i + 1 < line.length ? line[i + 1] : '';
    
    // Comments
    if (!inString && (line.startsWith('#') || line.startsWith('//'))) {
        return `<span style="color:${syntaxColors.comment}">${escapeHtml(line)}</span>`;
    }
    
    // Strings
    if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
        html += `<span style="color:${syntaxColors.string}">`;
        html += escapeHtml(char);
        i++;
        continue;
    }
    
    if (inString) {
        if (char === stringChar && line[i-1] !== '\\') {
            inString = false;
            html += escapeHtml(char) + '</span>';
            i++;
            continue;
        }
        html += escapeHtml(char);
        i++;
        continue;
    }
    
    // Numbers
    if (/\d/.test(char) && (i === 0 || !/[a-zA-Z_]/.test(line[i-1]))) {
        let num = '';
        while (i < line.length && /[\d.]/.test(line[i])) {
            num += line[i];
            i++;
        }
        html += `<span style="color:${syntaxColors.number}">${escapeHtml(num)}</span>`;
        continue;
    }
    
    // Keywords and functions
    if (/[a-zA-Z_]/.test(char) && (i === 0 || !/[a-zA-Z0-9_]/.test(line[i-1]))) {
        let word = '';
        while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
            word += line[i];
            i++;
        }
        
        if (isKeyword(word)) {
            html += `<span style="color:${syntaxColors.keyword}">${escapeHtml(word)}</span>`;
        } else if (isFunction(word, line, i)) {
            html += `<span style="color:${syntaxColors.function}">${escapeHtml(word)}</span>`;
        } else if (isBuiltin(word)) {
            html += `<span style="color:${syntaxColors.builtin}">${escapeHtml(word)}</span>`;
        } else if (isType(word)) {
            html += `<span style="color:${syntaxColors.type}">${escapeHtml(word)}</span>`;
        } else if (isBoolean(word)) {
            html += `<span style="color:${syntaxColors.boolean}">${escapeHtml(word)}</span>`;
        } else {
            html += `<span style="color:${syntaxColors.variable}">${escapeHtml(word)}</span>`;
        }
        continue;
    }
    
    // Operators
    if (/[=<>+\-*/%!&|~^]/.test(char)) {
        html += `<span style="color:${syntaxColors.operator}">${escapeHtml(char)}</span>`;
        i++;
        continue;
    }
    
    // Default
    html += escapeHtml(char);
    i++;
}

return html;
}

// Main execution wrapped in DOMContentLoaded to handle script in <head> safely
document.addEventListener('DOMContentLoaded', () => {
    // Animation Controls
    const toggleBtn = document.getElementById('toggleAnimation');
    const pauseIcon = document.getElementById('pauseIcon');
    const playIcon = document.getElementById('playIcon');
    const toggleText = document.getElementById('toggleText');
    const speedControl = document.getElementById('speedControl');
    const speedValue = document.getElementById('speedValue');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            animationRunning = !animationRunning;
            pauseIcon.classList.toggle('hidden', !animationRunning);
            playIcon.classList.toggle('hidden', animationRunning);
            toggleText.textContent = animationRunning ? 'Pause' : 'Play';
        });
    }

    if (speedControl) {
        speedControl.addEventListener('input', function(e) {
            animationSpeed = parseFloat(e.target.value);
            speedValue.textContent = animationSpeed + 'x';
        });
    }

    // Canvas Setup
    const canvas = document.getElementById('codeMatrix');
    if (!canvas) return; // Guard clause if canvas not found
    const ctx = canvas.getContext('2d');

    let width, height, columns, drops;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / 12);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = {
                y: Math.random() * -100,
                speed: Math.random() * 0.6 + 0.3,
                snippetIndex: Math.floor(Math.random() * codeSnippets.length),
                lineIndex: 0,
                opacity: Math.random() * 0.4 + 0.6,
                fontSize: Math.floor(Math.random() * 3) + 12
            };
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function resetDrop(drop) {
        drop.y = 0;
        drop.snippetIndex = Math.floor(Math.random() * codeSnippets.length);
        drop.lineIndex = 0;
        drop.speed = Math.random() * 0.6 + 0.3;
        drop.fontSize = Math.floor(Math.random() * 3) + 12;
    }

    function draw() {
        requestAnimationFrame(draw);

        if (!animationRunning) return;

        // Fade effect for trails
        ctx.fillStyle = 'rgba(3, 7, 18, 0.15)';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < columns; i++) {
            const drop = drops[i];
            const snippet = codeSnippets[drop.snippetIndex];
            const line = snippet[drop.lineIndex] || '';
            
            const x = i * 12;
            const y = drop.y * 18;
            
            // Skip empty lines
            if (!line.trim()) {
                drop.y += drop.speed * animationSpeed * 0.5;
                if (drop.y * 18 > height) {
                    resetDrop(drop);
                }
                continue;
            }
            
            ctx.font = `${drop.fontSize}px monospace`;
            
            // Highlight and draw
            const highlighted = highlightLine(line); // Note: HTML returned but not used directly by Canvas API without DOM parsing
            
            // Use canvas text drawing with colors
            // Check for comments
            if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
                ctx.fillStyle = syntaxColors.comment;
                ctx.fillText(line, x, y);
            } else {
                // Simple highlighting without full HTML parsing for performance
                let finalColor = syntaxColors.default;
                
                // Check if it's a string line
                const hasString = (line.includes("'") || line.includes('"'));
                const hasKeyword = line.split(/\s+/).some(w => isKeyword(w.replace(/[(){},;:]/g, '')));
                const hasFunction = line.includes('(');
                
                if (hasString) finalColor = syntaxColors.string;
                else if (hasKeyword && hasFunction) finalColor = syntaxColors.keyword;
                else if (hasKeyword) finalColor = syntaxColors.keyword;
                else if (hasFunction) finalColor = syntaxColors.function;
                else if (/\d/.test(line) && !/[a-zA-Z]/.test(line.trim())) finalColor = syntaxColors.number;
                else if (line.trim().startsWith('import ') || line.trim().startsWith('from ')) finalColor = syntaxColors.keyword;
                else if (line.includes('=>')) finalColor = syntaxColors.operator;
                else if (line.includes('def ') || line.includes('function ')) finalColor = syntaxColors.keyword;
                else if (line.includes('class ')) finalColor = syntaxColors.keyword;
                else if (line.includes('@')) finalColor = syntaxColors.decorator;
                else if (line.trim().startsWith('return ') || line.trim().startsWith('yield ')) finalColor = syntaxColors.keyword;
                else if (line.includes('async ') || line.includes('await ')) finalColor = syntaxColors.keyword;
                else if (line.includes('try') || line.includes('catch') || line.includes('finally')) finalColor = syntaxColors.keyword;
                else if (line.includes('if ') || line.includes('for ') || line.includes('while ')) finalColor = syntaxColors.keyword;
                
                // Apply color with glow for bright text
                ctx.fillStyle = finalColor;
                ctx.shadowBlur = line.trim() ? 8 : 0;
                ctx.shadowColor = finalColor;
                ctx.fillText(line, x, y);
                ctx.shadowBlur = 0;
                
                // Head of trail (bright white)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillText(line.substring(0, 8), x, y);
            }

            // Move drop down
            drop.y += drop.speed * animationSpeed;
            
            // Advance to next line in snippet
            if (drop.y * 18 > height || Math.floor(drop.y) > snippet.length) {
                drop.lineIndex = (drop.lineIndex + 1) % snippet.length;
                if (drop.lineIndex === 0) {
                    // Switch to new snippet when we cycle through
                    drop.snippetIndex = Math.floor(Math.random() * codeSnippets.length);
                }
                drop.y = 0;
                drop.speed = Math.random() * 0.6 + 0.3;
                drop.fontSize = Math.floor(Math.random() * 3) + 12;
            }
        }
    }

    draw();

    // Form Submission Logic
    const form = document.getElementById('regForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnContent = document.getElementById('btnContent');
    const statusMessage = document.getElementById('statusMessage');

    const EMAIL_ENDPOINT = 'https://formsubmit.co/ajax/davidakandwanaho2010@gmail.com';
    const SMS_WEBHOOK_URL = 'YOUR_MAKECOM_WEBHOOK_URL_HERE';

    function showStatus(message, type) {
        if (!statusMessage) return;
        statusMessage.classList.remove('hidden', 'bg-green-500/20', 'text-green-400', 'border', 'border-green-500/30', 'bg-red-500/20', 'text-red-400', 'border-red-500/30', 'bg-yellow-500/20', 'text-yellow-400', 'border-yellow-500/30');

        if (type === 'success') {
            statusMessage.classList.add('bg-green-500/20', 'text-green-400', 'border', 'border-green-500/30');
        } else if (type === 'error') {
            statusMessage.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/30');
        } else {
            statusMessage.classList.add('bg-yellow-500/20', 'text-yellow-400', 'border', 'border-yellow-500/30');
        }

        statusMessage.textContent = message;
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function setLoading(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnContent.innerHTML = '<div class="spinner"></div><span class="ml-2">Processing...</span>';
        } else {
            submitBtn.disabled = false;
            btnContent.innerHTML = 'Submit Registration<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        }
    }

    async function sendEmail(data) {
        const formData = new URLSearchParams();
        formData.append('_subject', 'New Registration - Inter Schools Coding Competition');
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('Full Name', data.fullname);
        formData.append('Preferred Username', data.username);
        formData.append('Gmail', data.gmail);
        formData.append('Phone Number', data.tel);

        const response = await fetch(EMAIL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: formData
        });

        // FormSubmit.co returns 200 OK even if the email is not activated yet or if validation fails.
        // We MUST check the JSON payload's 'success' property.
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            let msg = result.message || "Submission failed.";
            if (!msg.includes('activation') && !msg.includes('activate')) {
                msg += " Check your inbox/spam for the activation link.";
            }
            throw new Error(msg);
        }

        return result;
    }

    async function sendSMSFallback(data) {
        if (SMS_WEBHOOK_URL === 'YOUR_MAKECOM_WEBHOOK_URL_HERE') {
            throw new Error('SMS Webhook URL not configured');
        }

        const smsPayload = {
            to: '+256 758607511',
            message: `NEW REGISTRATION FAILED:\nName: ${data.fullname}\nUsername: ${data.username}\nEmail: ${data.gmail}\nPhone: ${data.tel}\n\nEmail delivery failed. Please process manually.`,
            source: 'coding-competition-form',
            timestamp: new Date().toISOString()
        };

        const response = await fetch(SMS_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(smsPayload)
        });

        if (!response.ok) {
            throw new Error(`SMS fallback failed with status: ${response.status}`);
        }

        return await response.json();
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            setLoading(true);
            showStatus('Sending registration...', 'warning');

            const formData = {
                fullname: document.getElementById('fullname').value.trim(),
                username: document.getElementById('username').value.trim(),
                gmail: document.getElementById('gmail').value.trim(),
                tel: document.getElementById('tel').value.trim()
            };

            try {
                await sendEmail(formData);
                showStatus('✅ Registration submitted successfully! Email sent.', 'success');
                form.reset();
            } catch (emailError) {
                console.warn('Email submission failed:', emailError.message);
                
                // Check if SMS fallback is configured
                if (SMS_WEBHOOK_URL !== 'YOUR_MAKECOM_WEBHOOK_URL_HERE') {
                    showStatus(`⚠️ Email delivery failed. Attempting SMS fallback...`, 'warning');
                    try {
                        await sendSMSFallback(formData);
                        showStatus('✅ Email failed but SMS alert sent successfully!', 'success');
                        form.reset();
                    } catch (smsError) {
                        showStatus(`❌ Both delivery methods failed. Please contact us directly.`, 'error');
                    }
                } else {
                    // If no SMS fallback, show specific activation warning
                    showStatus(`❌ Submission failed: ${emailError.message}`, 'error');
                }
            } finally {
                setLoading(false);
            }
        });
    }
});
