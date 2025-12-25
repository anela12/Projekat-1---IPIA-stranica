
const storageKey = 'user';

function showForm(type) {
    const isLogin = type === 'login';
    
   
    document.getElementById('loginForm').classList.toggle('active', isLogin);
    document.getElementById('registerForm').classList.toggle('active', !isLogin);
  
    document.getElementById('loginTab').className = isLogin ? 'active' : '';
    document.getElementById('registerTab').className = !isLogin ? 'active' : '';
}

function register() {
    const ime = document.getElementById('regName').value;
    const mail = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;
    const odabranaTema = document.getElementById('theme').value;

    if(!ime || !mail || !pass) {
        alert('Popuni sva polja!');
        return;
    }

    const profil = { 
        name: ime, 
        email: mail, 
        password: pass, 
        theme: odabranaTema 
    };

    localStorage.setItem(storageKey, JSON.stringify(profil));
    
    applyTheme(odabranaTema);
    alert('Uspješno! Možeš se prijaviti.');
    showForm('login');
}

function login() {
    const podaci = JSON.parse(localStorage.getItem(storageKey));
    const uEmail = document.getElementById('loginEmail').value;
    const uPass = document.getElementById('loginPassword').value;

    if (podaci && uEmail === podaci.email && uPass === podaci.password) {
        applyTheme(podaci.theme);
        
        window.open('http://localhost:4200', '_blank');
    } else {
        alert('Greška: Podaci nisu ispravni.');
    }
}

function applyTheme(t) {
    
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-lila');
    
    if (t) {
        document.body.classList.add('theme-' + t);
    }
}


window.onload = () => {
    const podaci = JSON.parse(localStorage.getItem(storageKey));
    if (podaci && podaci.theme) {
        applyTheme(podaci.theme);
    }
};