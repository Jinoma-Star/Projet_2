document.addEventListener('DOMContentLoaded', () => {
    // Éléments pour la gestion de la connexion/déconnexion et du mode édition
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const editModeBanner = document.getElementById('editModeBanner');
    const filtersDiv = document.getElementById('filters');
    const editLinkContainer = document.getElementById('editLinkContainer');
    const editLink = document.getElementById('editLink');
    const modalOverlay = document.getElementById('modalOverlay');

    const addPhotoButton = document.getElementById('workaddbutton');
    if (addPhotoButton) {
        addPhotoButton.addEventListener('click', openAddWorkModal);
    }


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
            worksGallery(works, '.gallery-modal', false); // Pas de sous-titres dans la modale
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
        editLink.removeEventListener('click', openModal);
        editLink.addEventListener('click', openModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
});

// Fonction pour supprimer une œuvre
function deleteWork(workId, figureElement) {
    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Échec de la suppression de l\'œuvre');
      }
      figureElement.remove(); // Retire l'œuvre du DOM
      openAddWorkModal();
    })
    .catch(error => console.error('Erreur lors de la suppression:', error));
  }

 

  // Fonction pour ouvrir le formulaire d'ajout d'œuvre
const openAddWorkModal = () => {
    // Modifier le titre de la modale et son contenu
    document.getElementById('modalTitle').textContent = 'Ajout Photo';
    const insideModal = document.getElementById('insideModal');
    insideModal.innerHTML = `
        <div id="add-work">
            <h3>Ajout photo</h3>
            <input type="file" id="workImage" accept="image/*" required>
            <div id="add-work-form">
                <label for="workTitle">Titre</label>
                <input type="text" id="workTitle" required>
                <label for="workCategory">Catégorie</label>
                <select id="workCategory"></select>
            </div>
            <div class="line"></div>
            <button id="submitButton" disabled>Valider</button>
        </div>
    `;

    fetchCategoriesForSelect();

    document.getElementById('workImage').addEventListener('change', checkFormCompletion);
    document.getElementById('workTitle').addEventListener('input', checkFormCompletion);

    document.getElementById('modalOverlay').style.display = 'block';
    document.getElementById('editModal').style.display = 'block';

    // Ajouter l'écouteur d'événement pour le bouton "Valider" après sa création
    document.getElementById('submitButton').addEventListener('click', submitNewWork);
};

// Fonction pour vérifier si le formulaire est complet
const checkFormCompletion = () => {
    const imageInput = document.getElementById('workImage').files.length;
    const titleInput = document.getElementById('workTitle').value.trim().length;
    const submitButton = document.getElementById('submitButton');

    submitButton.disabled = !(imageInput && titleInput);
};

// Fonction pour ajouter les catégories au sélecteur dans la modale
const fetchCategoriesForSelect = () => {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            const select = document.getElementById('workCategory');
            select.innerHTML = ''; // Nettoyer les options précédentes
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
};

// Fonction pour soumettre le nouveau travail
const submitNewWork = () => {
    const formData = new FormData();
    formData.append('image', document.getElementById('workImage').files[0]);
    formData.append('title', document.getElementById('workTitle').value);
    formData.append('category', document.getElementById('workCategory').value);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de l\'ajout de l\'œuvre');
        }
        return response.json();
    })
    .then(newWork => {
        closeModal();
        worksGallery([...works, newWork], '.gallery', true); 
    })
    .catch(error => console.error('Erreur lors de l\'ajout:', error));
};

// Fonction pour fermer la modale
const closeModal = () => {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('editModal').style.display = 'none';
};