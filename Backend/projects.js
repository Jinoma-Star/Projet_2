function miseAJourGalerie(travaux) {
    const galerie = document.querySelector('.gallery');
    galerie.innerHTML = ''; 
  
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
  
  function filtrerTravaux(categorie) {
    if (categorie === 'Tous') {
      miseAJourGalerie(travauxTous);
    } else {
      const travauxFiltres = travauxTous.filter(travail => travail.category.name === categorie);
      miseAJourGalerie(travauxFiltres);
    }
  }

  fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(travaux => {
    travauxTous = travaux;
    miseAJourGalerie(travauxTous);
  })
  .catch(error => console.error('Erreur:', error));
