document.addEventListener('DOMContentLoaded', () => {
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    

    // Vérifier si un token d'authentification est stocké
    if (sessionStorage.getItem('authToken')) {
        loginLogoutLink.textContent = 'logout';
        loginLogoutLink.href = '#';
        editModeBanner.style.display = 'block'; // Afficher le bandeau Mode Édition

        loginLogoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('editMode'); // Retirer l'information du mode édition
            editModeBanner.style.display = 'none'; // Masquer le bandeau Mode Édition
            window.location.href = 'index.html';
        });
    } else {
        loginLogoutLink.textContent = 'login';
        loginLogoutLink.href = 'login.html';
        editModeBanner.style.display = 'none'; // S'assurer que le bandeau est masqué si non connecté
    }
});