//Lien cliquable "projets" qui emmène sur la page des projets
document.addEventListener('DOMContentLoaded', () => {
    const projectsButton = document.getElementById('projectsButton');
    projectsButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

// Lien cliquable "Login" qui emmène sur la page de connexion
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
});

