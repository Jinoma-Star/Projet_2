let worksAll;

fetch('http://localhost:5678/api/works')
.then(response => response.json())
.then(works => {
  worksAll = works;
  worksGallery(worksAll);
})
.catch(error => console.error('Erreur:', error));


function worksGallery(works) {
  const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; 
  
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
  


  function fetchCategories() {
    fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(categories => {
        categoryFilter(categories);
    })
    .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}

  function categoryFilter(categories) {
  const filtersDiv = document.getElementById('filters');

  // Créer et ajouter le bouton "Tous"
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.onclick = () => worksGallery(worksAll);
  filtersDiv.appendChild(allButton);

  // Ajouter les boutons pour chaque catégorie
  categories.forEach(category => {
      const button = document.createElement('button');
      button.textContent = category.name;
      button.onclick = () => worksFilter(category.name);
      filtersDiv.appendChild(button);
  });
}

// Filtrer les œuvres en fonction de la catégorie
function worksFilter(categoryName) {
    const filteredWorks = worksAll.filter(work => work.category.name === categoryName);
    worksGallery(filteredWorks);
}

// Initialisation
fetchCategories(); // Appeler cette fonction au chargement de la page

