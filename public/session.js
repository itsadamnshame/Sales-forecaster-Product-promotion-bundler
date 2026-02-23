const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();

        // 1. Extract data from form
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // 2. Send as JSON
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Login success:", result.message);
                // 3. Redirect to the ROUTE, not the file
                window.location.href = "/homepage.html";
            } else {
                alert(result.error || "Login failed");
            }
        } catch (err) {
            console.error("Connection error:", err);
        }
    };
}

const menuBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

// Ensure ALL elements exist on the current page before adding listeners
if (menuBtn && sidebar && closeBtn && overlay) {
    menuBtn.onclick = () => {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
    };

    [closeBtn, overlay].forEach(btn => {
        btn.onclick = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        };
    });
}

// public/session.js
const logoutBtn = document.getElementById('logout');

if (logoutBtn) {
    logoutBtn.onclick = async () => {
        const response = await fetch('/logout', { method: 'POST' });
        
        if (response.ok) {
            // 1. Clear the session flag
            sessionStorage.removeItem('id');
            
            // 2. CRITICAL: Clear the OptimaModel data so the next user starts fresh
            localStorage.removeItem('OptimaData');
            localStorage.removeItem('uploadedFilename');
            
            window.location.href = "login.html";
        }
    };
}