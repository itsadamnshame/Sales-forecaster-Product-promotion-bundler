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

const navi = document.querySelectorAll('.navi');
if (navi) {
    navi.forEach(button => {
        button.onclick = async () => {
            const targetPage = button.getAttribute('data-page');
            if (targetPage) {
                window.location.href = targetPage;
            }
        };
    });
}