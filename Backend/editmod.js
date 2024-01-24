document.addEventListener('DOMContentLoaded', () => {
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const editModeBanner = document.getElementById('editModeBanner');
    

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

document.addEventListener('DOMContentLoaded', () => {
    const filtersDiv = document.getElementById('filters');
    const editLinkContainer = document.getElementById('editLinkContainer');
    const editLink = document.getElementById('editLink');
    // Supposons que vous avez une fonction pour ouvrir la modale
    const openModal = () => {
        // Logique pour ouvrir la modale
    };

    if (sessionStorage.getItem('authToken')) {
        filtersDiv.style.display = 'none';
        editLinkContainer.style.display = 'block';
    } else {
        filtersDiv.style.display = 'flex';
        editLinkContainer.style.display = 'none';
    }

    editLink.addEventListener('click', openModal);
});

const openModal = () => {
    document.getElementById('editModal').style.display = 'block';
};

const closeModal = () => {
    document.getElementById('editModal').style.display = 'none';
};