// Chargement initial des données des travaux
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(works => {
    initializeGalleryAndFilters(works);
  })
  .catch(error => console.error('Erreur lors de la récupération des images:', error));

function initializeGalleryAndFilters(works) {
  worksGallery(works, '.gallery', true); // Affiche la galerie avec toutes les œuvres et sous-titres
  fetchCategories(works); // Initialise les filtres avec les catégories
}

function worksGallery(works, gallerySelector, showCaptions = true) {
  const gallery = document.querySelector(gallerySelector);
  gallery.innerHTML = ''; // Nettoie la galerie avant l'affichage

  works.forEach(work => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    figure.appendChild(img);

    if (showCaptions) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = work.title;
      figure.appendChild(figcaption);
    }

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

function updateActiveButton(activeButton) {
  document.querySelectorAll('#filters button').forEach(button => {
    button.classList.remove('button-active');
  });

  activeButton.classList.add('button-active');
}

function worksFilter(categoryName, works) {
  const filteredWorks = works.filter(work => work.category.name === categoryName);
  worksGallery(filteredWorks, '.gallery', true); // Pass true pour afficher les sous-titres
}