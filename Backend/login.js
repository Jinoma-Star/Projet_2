document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Récupération des valeurs des champs
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Envoi des identifiants au serveur pour vérification
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La connexion a échoué');
            }
            return response.json();
        })
        .then(data => {
            // Stockage du token et redirection
            sessionStorage.setItem('authToken', data.token);
            sessionStorage.setItem('editMode', 'true'); // Stocker l'information du mode édition
            window.location.href = 'index.html';
        })
        .catch(error => {
            alert("Identifiant(s) incorrect(s) ou problème de connexion.");
        });
    });
});
