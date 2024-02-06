document.addEventListener('DOMContentLoaded', () => {
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const editModeBanner = document.getElementById('editModeBanner');
    const filtersDiv = document.getElementById('filters');
    const editLinkContainer = document.getElementById('editLinkContainer');
    const modalOverlay = document.getElementById('modalOverlay');
    const editModal = document.getElementById('editModal');
    const closeModalIcon = document.getElementById('closeModalIcon');
    const addPhotoButton = document.getElementById('workaddbutton');
    const galleryView = document.getElementById('galleryView');
    const addWorkView = document.getElementById('addWorkView'); 
    const cancelAddButton = document.getElementById('cancelAddButton');
    const submitButton = document.getElementById('submitButton');
    const workImageInput = document.getElementById('workImage');
    const workTitleInput = document.getElementById('workTitle');
    const workCategorySelect = document.getElementById('workCategory');

    // Authentification et affichage des éléments UI
    if (sessionStorage.getItem('authToken')) {
        loginLogoutLink.textContent = 'logout';
        loginLogoutLink.href = '#';
        editModeBanner.style.display = 'block';

        loginLogoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.clear(); // Clear all session storage
            window.location.reload(); // Reload the page to reflect changes
        });

        filtersDiv.style.display = 'none';
        editLinkContainer.style.display = 'block';
    } else {
        loginLogoutLink.textContent = 'login';
        loginLogoutLink.href = 'login.html';
        editModeBanner.style.display = 'none';
        filtersDiv.style.display = 'flex';
        editLinkContainer.style.display = 'none';
    }

//Chargement de la galerie de travaux dans la modale
    window.loadGalleryInModal = function(works) {
    galleryView.style.display = 'flex'; // Montrer la vue galerie
    addWorkView.style.display = 'none'; // Cacher la vue ajout
    worksGallery(works, '.gallery-modal', false); // Chargement de la galerie dans la modale sans sous-titres
}

    // Ouverture de la modale en mode galerie
    const editLink = document.getElementById('editLink');
    editLink.addEventListener('click', () => {
    modalOverlay.style.display = 'block';
    editModal.style.display = 'block';
    loadGalleryInModal(worksData); // 
});

    // Fermeture de la modale
    const closeModal = () => {
        modalOverlay.style.display = 'none';
        editModal.style.display = 'none';
        galleryView.style.display = 'none';
        addWorkView.style.display = 'none';
    };

    //Si clique sur Overlay ou icone croix, fermeture de la modale
    closeModalIcon.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    // Transition vers la vue d'ajout
    addPhotoButton.addEventListener('click', () => {
        galleryView.style.display = 'none'; // Cacher la vue galerie
        addWorkView.style.display = 'flex'; // Montrer la vue ajout
    });

    // Retour à la vue galerie 
    cancelAddButton.addEventListener('click', () => {
        galleryView.style.display = 'flex'; // Montrer la vue galerie
        addWorkView.style.display = 'none'; // Cacher la vue ajout
    });


    // Activation du bouton de soumission en fonction de la complétude du formulaire
    const checkFormCompletion = () => {
        submitButton.disabled = !workImageInput.files.length || !workTitleInput.value.trim();
    };

    workImageInput.addEventListener('change', checkFormCompletion);
    workTitleInput.addEventListener('input', checkFormCompletion);
    workCategorySelect.addEventListener('change', checkFormCompletion);

    // Soumission d'une nouvelle œuvre
    submitButton.addEventListener('click', () => {
        const formData = new FormData();
        formData.append('image', workImageInput.files[0]);
        formData.append('title', workTitleInput.value);
        formData.append('category', workCategorySelect.value);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add new work');
            }
            return response.json();
        })
        .then(newWork => {
            worksData.push(newWork); // Ajoutez la nouvelle œuvre à worksData
            refreshMainGallery(); // Rafraîchissez la galerie principale
            refreshModalGallery(); // Rafraîchissez la galerie de la modale
        })
        .catch(error => console.error('Error adding work:', error));

    });

    function refreshModalGallery() {
        if (modalOverlay.style.display === 'block') {
            window.loadGalleryInModal(worksData);
        }
    }

    // Chargement initial des catégories dans la modale pour sélécteur
    const fetchCategoriesForSelect = () => {
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(categories => {
                workCategorySelect.innerHTML = '<option value="">Select a category</option>';
                categories.forEach(category => {
                    const option = new Option(category.name, category.id);
                    workCategorySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching categories:', error));
    };

    fetchCategoriesForSelect();
});