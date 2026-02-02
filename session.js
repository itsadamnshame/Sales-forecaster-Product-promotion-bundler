let login = document.getElementById('login-form');

const user_login = (uname, pass) => {
    let checkedUname = 'user';
    let checkedPass = '1234';
    if (uname === checkedUname && pass === checkedPass) {
        window.location.replace("homepage.html");
    } 
    else {
        alert("Error: Invalid credentials");
    }
};

login.onsubmit = (e) => {
    e.preventDefault();
    const loginData =  new FormData(e.target);
    let uname = loginData.get('uname');
    let pass = loginData.get('pass');
    user_login(uname, pass);
}