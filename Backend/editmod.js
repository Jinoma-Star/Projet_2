let initialModalContent = '';
let works = [];

document.addEventListener('DOMContentLoaded', () => {
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const editModeBanner = document.getElementById('editModeBanner');
    const filtersDiv = document.getElementById('filters');
    const editLinkContainer = document.getElementById('editLinkContainer');
    const editLink = document.getElementById('editLink');
    const modalOverlay = document.getElementById('modalOverlay');

    if (sessionStorage.getItem('authToken')) {
        loginLogoutLink.textContent = 'logout';
        loginLogoutLink.href = '#';
        editModeBanner.style.display = 'block';

        loginLogoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('editMode');
            editModeBanner.style.display = 'none';
            window.location.href = 'index.html';
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

    const closeModalIcon = document.getElementById('closeModalIcon');
    if (closeModalIcon) {
        closeModalIcon.addEventListener('click', () => {
            closeModal();
        });
    }

    const addPhotoButton = document.getElementById('workaddbutton');
    if (addPhotoButton) {
        addPhotoButton.addEventListener('click', openAddWorkModal);
    }

    const openModal = () => {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                works = data;
                worksGallery(works, '.gallery-modal', false);
            })
            .catch(error => console.error('Erreur lors de la récupération des images:', error));

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('editModal').style.display = 'block';
        initialModalContent = insideModal.innerHTML;

        const addPhotoButton = document.getElementById('workaddbutton');
        if (addPhotoButton) {
            addPhotoButton.removeEventListener('click', openAddWorkModal);
            addPhotoButton.addEventListener('click', openAddWorkModal);
        }
    };

    const resetModal = () => {
        const insideModal = document.getElementById('insideModal');
        insideModal.innerHTML = initialModalContent;

        const addPhotoButton = document.getElementById('workaddbutton');
        if (addPhotoButton) {
            addPhotoButton.removeEventListener('click', openAddWorkModal);
            addPhotoButton.addEventListener('click', openAddWorkModal);
        }
    };

    const closeModal = () => {
        resetModal();
        document.getElementById('modalOverlay').style.display = 'none';
        document.getElementById('editModal').style.display = 'none';
    };

    if (editLink) {
        editLink.removeEventListener('click', openModal);
        editLink.addEventListener('click', openModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
});

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
        figureElement.remove();
    })
    .catch(error => console.error('Erreur lors de la suppression:', error));
}

const openAddWorkModal = () => {
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
                <select id="workCategory" required>
                    <option value=""></option>
                </select>
            </div>
            <div class="line"></div>
            <button id="submitButton" disabled>Valider</button>
            <button id="cancelAddButton"><i class="fa-solid fa-arrow-left"></i></button>
        </div>
    `;

    const workCategorySelect = document.getElementById('workCategory');
    workCategorySelect.value = "";

    fetchCategoriesForSelect();

    document.getElementById('workImage').addEventListener('change', checkFormCompletion);
    document.getElementById('workTitle').addEventListener('input', checkFormCompletion);

    document.getElementById('modalOverlay').style.display = 'block';
    document.getElementById('editModal').style.display = 'block';

    document.getElementById('submitButton').addEventListener('click', submitNewWork);

    workCategorySelect.addEventListener('change', () => {
        if (workCategorySelect.value === "") {
            workCategorySelect.value = "";
        }
    });

    document.getElementById('cancelAddButton').addEventListener('click', () => {
        closeModal();
    });
};

const checkFormCompletion = () => {
    const imageInput = document.getElementById('workImage').files.length;
    const titleInput = document.getElementById('workTitle').value.trim().length;
    const submitButton = document.getElementById('submitButton');

    submitButton.disabled = !(imageInput && titleInput);
};

const fetchCategoriesForSelect = () => {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            const select = document.getElementById('workCategory');
            select.innerHTML = '';
            select.appendChild(new Option('', ''));
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));

    document.getElementById('workCategory').value = "";
};

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