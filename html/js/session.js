const login = document.getElementById('login-form');
if(login){
    login.onsubmit = async (e) => {
        e.preventDefault();
        const loginData =  new FormData(e.target);
        const data = Object.fromEntries(loginData.entries());
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            console.log(result);
            sessionStorage.setItem('id', '1');
            window.location.href = "homepage.html";
        } 
        else {
            console.error("Login Failed:", result.error); 
        }
    }
}

const logout = document.getElementById('logout');
if (logout) {
    logout.onclick = async () => {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
        });
        if (response.ok) {
            sessionStorage.removeItem('id');
            window.location.href = "login.html";
        }
    }
}

const menuBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

// Ensure ALL elements exist before adding listeners
if (menuBtn && sidebar && closeBtn && overlay) {
    menuBtn.onclick = () => {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
    };

    // Close logic for both the 'X' button and the dark overlay
    [closeBtn, overlay].forEach(btn => {
        btn.onclick = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        };
    });
}