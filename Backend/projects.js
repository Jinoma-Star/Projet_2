fetch('http://localhost:5678/api/works')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    // Traitez les données ici
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });