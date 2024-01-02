function miseAJourGalerie(travaux) {
    const galerie = document.querySelector('.gallery'); // Sélectionne le premier élément avec la classe 'gallery'
    galerie.innerHTML = ''; // Nettoyer le contenu existant
  
    travaux.forEach(travail => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = travail.imageUrl;
      img.alt = travail.title;
  
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = travail.title;
  
      figure.appendChild(img);
      figure.appendChild(figcaption);
      galerie.appendChild(figure);
    });
  }
  
  fetch('http://localhost:5678/api/works')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(travaux => miseAJourGalerie(travaux))
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
