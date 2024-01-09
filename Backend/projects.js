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
  
  function worksFilter(category) {
    let url = 'http://localhost:5678/api/works';
    if (category !== 'Tous') {
        url += `?category=${encodeURIComponent(category)}`;
    }

    fetch(url)
    .then(response => response.json())
    .then(works => {
        worksGallery(works);
    })
    .catch(error => console.error('Erreur:', error));
}


