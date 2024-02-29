let worksData = []; // Stockez les données de travaux dans la variable globale

// Chargement initial des données des travaux
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(works => {
    worksData = works; 
    initializeGalleryAndFilters(works);
  })
  .catch(error => console.error('Erreur lors de la récupération des images:', error));

function initializeGalleryAndFilters(works) {
  worksGallery(works, '.gallery', true); // Affiche la galerie avec toutes les œuvres et sous-titres
  fetchCategories(works); // Initialise les filtres avec les catégories
}

function worksGallery(works, gallerySelector, showCaptions) {
  const gallery = document.querySelector(gallerySelector);
  gallery.innerHTML = ''; // Nettoie la galerie avant l'affichage

  works.forEach(work => {
    const figure = document.createElement('figure');
    figure.classList.add('gallery-item'); 

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);

    // Ajouter un bouton de suppression pour chaque œuvre
    if (gallerySelector === '.gallery-modal') {
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button');
      deleteButton.innerHTML = '<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>'; // Icône de suppression
      deleteButton.onclick = () => deleteWork(work.id, figure);
      figure.appendChild(deleteButton);
    }


    if (showCaptions) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = work.title;
      figure.appendChild(figcaption);
    }

    gallery.appendChild(figure);
  });

}

function deleteWork(workId) {
  // Envoyer une requête de suppression au serveur avec l'ID du travail à supprimer
  fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
      }
  })
  .then(response => {
    if (!response.ok) {
        throw new Error('Failed to delete work');
    }
    // Retirez l'œuvre supprimée de worksData
    const index = worksData.findIndex(work => work.id === workId);
    if (index > -1) {
        worksData.splice(index, 1);
    }
    refreshMainGallery(); // Rafraîchissez la galerie principale
    refreshModalGallery(); // Rafraîchissez la galerie de la modale
})
.catch(error => console.error('Error deleting work:', error));
}


//Chargement des catégories
function fetchCategories(works) {
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(categories => {
      categoryFilter(categories, works);
    })
    .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}

// Création et assignations des boutons-filtres
function categoryFilter(categories, works) {
  const filtersDiv = document.getElementById('filters');
  filtersDiv.innerHTML = ''; 

  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.classList.add('button-active');
  allButton.onclick = () => {
    updateActiveButton(allButton);
    worksGallery(works, '.gallery', true);
  };
  filtersDiv.appendChild(allButton);

  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.onclick = () => {
      updateActiveButton(button);
      worksFilter(category.name, works);
    };
    filtersDiv.appendChild(button);
  });
}

// Ajout/Suppression de la class Button-Active sur le bouton filtre actif
function updateActiveButton(activeButton) {
  document.querySelectorAll('#filters button').forEach(button => {
    button.classList.remove('button-active');
  });

  activeButton.classList.add('button-active');
}

// Changement d'affichage de la galerie selon le filtre choisi
function worksFilter(categoryName, works) {
  const filteredWorks = works.filter(work => work.category.name === categoryName);
  worksGallery(filteredWorks, '.gallery', true);
}

// Rafraichissement de la galerie principale
function refreshMainGallery() {
  fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then(works => {
          initializeGalleryAndFilters(works);
      })
      .catch(error => console.error('Erreur lors de la récupération des images:', error));
}

// Rafraichissement de la galerie dans la modale
function refreshModalGallery() {
  if (document.getElementById('modalOverlay').style.display === 'block') {
      window.loadGalleryInModal(worksData);
  }
}