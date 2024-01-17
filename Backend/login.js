document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const editModeBanner = document.getElementById('editModeBanner');
    
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Récupération des valeurs des champs
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Vérifiez si les identifiants sont ceux attendus
        if (email === "sophie.bluel@test.tld" && password === "S0phie") {
            // Envoi de la demande de connexion au serveur
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
                window.location.href = 'index.html?edit=true';
            })
            .catch(error => {
                alert(error.message);
            });
        } else {
            alert("Identifiants incorrects");
        }
    });
});


/* LOGIN / LOGOUT */
document.addEventListener('DOMContentLoaded', () => {
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    

    // Vérifier si un token d'authentification est stocké
    if (sessionStorage.getItem('authToken')) {
        loginLogoutLink.textContent = 'logout';
        loginLogoutLink.href = '#';
        editModeBanner.style.display = 'block'; // Afficher le bandeau Mode Édition

        loginLogoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('editMode'); // Retirer l'information du mode édition
            editModeBanner.style.display = 'none'; // Masquer le bandeau Mode Édition
            window.location.href = 'index.html';
        });
    } else {
        loginLogoutLink.textContent = 'login';
        loginLogoutLink.href = 'login.html';
        editModeBanner.style.display = 'none'; // S'assurer que le bandeau est masqué si non connecté
    }
});