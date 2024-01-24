document.addEventListener('DOMContentLoaded', () => {
    // Éléments pour la gestion de la connexion/déconnexion et du mode édition
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const editModeBanner = document.getElementById('editModeBanner');
    const filtersDiv = document.getElementById('filters');
    const editLinkContainer = document.getElementById('editLinkContainer');
    const editLink = document.getElementById('editLink');
    const modalOverlay = document.getElementById('modalOverlay');

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

        // Utilisateur connecté : masquer les filtres et afficher le lien d'édition
        filtersDiv.style.display = 'none';
        editLinkContainer.style.display = 'block';
    } else {
        // Utilisateur non connecté : afficher les filtres et masquer le lien d'édition
        loginLogoutLink.textContent = 'login';
        loginLogoutLink.href = 'login.html';
        editModeBanner.style.display = 'none';
        filtersDiv.style.display = 'flex';
        editLinkContainer.style.display = 'none';
    }

    // Fonction pour ouvrir la modale
    const openModal = () => {
        fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            worksGallery(works, '.gallery-modal'); // Utilisez une classe différente pour la galerie dans la modale
        })
        .catch(error => console.error('Erreur lors de la récupération des images:', error));

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('editModal').style.display = 'block';
    };

    // Fonction pour fermer la modale
    const closeModal = () => {
        document.getElementById('modalOverlay').style.display = 'none';
        document.getElementById('editModal').style.display = 'none';
    };

    // Ajout d'écouteurs d'événements
    if (editLink) {
        editLink.addEventListener('click', openModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
});