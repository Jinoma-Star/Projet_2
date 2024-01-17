// Chargement initial des données des travaux
fetch('http://localhost:5678/api/works')
.then(response => response.json())
.then(works => {
  initializeGalleryAndFilters(works);
})
.catch(error => console.error('Erreur lors de la récupération des images:', error));

function initializeGalleryAndFilters(works) {
  worksGallery(works); // Affiche la galerie avec toutes les œuvres
  fetchCategories(works); // Initialise les filtres avec les catégories
}

function worksGallery(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = ''; // Nettoie la galerie avant l'affichage
  
  works.forEach(work => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

function fetchCategories(works) {
  fetch('http://localhost:5678/api/categories')
  .then(response => response.json())
  .then(categories => {
    categoryFilter(categories, works);
  })
  .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}

function categoryFilter(categories, works) {
  const filtersDiv = document.getElementById('filters');
  filtersDiv.innerHTML = ''; // Nettoie les filtres avant l'affichage

  // Créer et ajouter le bouton "Tous"
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.onclick = () => worksGallery(works);
  filtersDiv.appendChild(allButton);

  // Ajouter les boutons pour chaque catégorie
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.onclick = () => worksFilter(category.name, works);
    filtersDiv.appendChild(button);
  });
}

function worksFilter(categoryName, works) {
  const filteredWorks = works.filter(work => work.category.name === categoryName);
  worksGallery(filteredWorks);
}

