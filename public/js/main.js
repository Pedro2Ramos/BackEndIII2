// Estado global
let currentUser = null;

// Funciones de utilidad
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Funciones de UI
function showLoginForm() {
    document.getElementById('loginForm').classList.remove('d-none');
    document.getElementById('registerForm').classList.add('d-none');
}

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('registerForm').classList.remove('d-none');
}

function showNewPetForm() {
    document.getElementById('newPetForm').classList.toggle('d-none');
}

function updateUIForLoggedInUser(user) {
    currentUser = user;
    document.getElementById('authButtons').classList.add('d-none');
    document.getElementById('userInfo').classList.remove('d-none');
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('authForms').classList.add('d-none');
    document.getElementById('mainContent').classList.remove('d-none');
    loadPets();
    loadAdoptions();
}

function updateUIForLoggedOutUser() {
    currentUser = null;
    document.getElementById('authButtons').classList.remove('d-none');
    document.getElementById('userInfo').classList.add('d-none');
    document.getElementById('authForms').classList.remove('d-none');
    document.getElementById('mainContent').classList.add('d-none');
}

// Funciones de API
async function register(event) {
    event.preventDefault();
    const data = {
        first_name: document.getElementById('registerFirstName').value,
        last_name: document.getElementById('registerLastName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value
    };

    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error en el registro');

        showAlert('Registro exitoso! Por favor, inicia sesión.');
        showLoginForm();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

async function login(event) {
    event.preventDefault();
    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error en el inicio de sesión');

        const userResponse = await fetch('/api/sessions/current');
        if (!userResponse.ok) throw new Error('Error al obtener datos del usuario');

        const userData = await userResponse.json();
        updateUIForLoggedInUser(userData.payload);
        showAlert('Inicio de sesión exitoso!');
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

async function logout() {
    try {
        await fetch('/api/sessions/logout', { method: 'POST' });
        updateUIForLoggedOutUser();
        showAlert('Sesión cerrada exitosamente');
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

async function loadPets() {
    try {
        const response = await fetch('/api/pets');
        if (!response.ok) throw new Error('Error al cargar mascotas');

        const data = await response.json();
        const petsContainer = document.getElementById('petsList');
        petsContainer.innerHTML = '';

        data.payload.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'col-md-6 mb-4';
            petCard.innerHTML = `
                <div class="pet-card">
                    <h5>${pet.name}</h5>
                    <p>Especie: ${pet.specie}</p>
                    <p>Fecha de nacimiento: ${new Date(pet.birthDate).toLocaleDateString()}</p>
                    ${!pet.adopted ? 
                        `<button class="btn btn-primary btn-adopt" onclick="adoptPet('${pet._id}')">
                            Adoptar
                        </button>` : 
                        '<button class="btn btn-secondary" disabled>Ya adoptado</button>'
                    }
                </div>
            `;
            petsContainer.appendChild(petCard);
        });
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

async function loadAdoptions() {
    try {
        const response = await fetch('/api/adoptions');
        if (!response.ok) throw new Error('Error al cargar adopciones');

        const data = await response.json();
        const adoptionsContainer = document.getElementById('adoptionsList');
        adoptionsContainer.innerHTML = '';

        if (data.status === "success" && Array.isArray(data.payload)) {
            data.payload.forEach(adoption => {
                const adoptionItem = document.createElement('div');
                adoptionItem.className = `adoption-item ${adoption.status || 'pending'}`;
                adoptionItem.innerHTML = `
                    <h5>Adopción #${adoption._id}</h5>
                    <p>Estado: ${adoption.status || 'pending'}</p>
                    <p>Fecha: ${new Date(adoption.createdAt || Date.now()).toLocaleDateString()}</p>
                `;
                adoptionsContainer.appendChild(adoptionItem);
            });
        } else if (Array.isArray(data)) {
            data.forEach(adoption => {
                const adoptionItem = document.createElement('div');
                adoptionItem.className = `adoption-item ${adoption.status || 'pending'}`;
                adoptionItem.innerHTML = `
                    <h5>Adopción #${adoption._id}</h5>
                    <p>Estado: ${adoption.status || 'pending'}</p>
                    <p>Fecha: ${new Date(adoption.createdAt || Date.now()).toLocaleDateString()}</p>
                `;
                adoptionsContainer.appendChild(adoptionItem);
            });
        } else {
            throw new Error('Formato de datos inválido');
        }
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

async function createPet(event) {
    event.preventDefault();
    const data = {
        name: document.getElementById('petName').value,
        specie: document.getElementById('petSpecie').value,
        birthDate: document.getElementById('petBirthDate').value
    };

    try {
        const response = await fetch('/api/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error al crear mascota');

        showAlert('Mascota creada exitosamente!');
        document.getElementById('newPetForm').classList.add('d-none');
        loadPets();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

async function adoptPet(petId) {
    try {
        // Obtener el ID del usuario actual
        const userResponse = await fetch('/api/sessions/current');
        if (!userResponse.ok) throw new Error('Error al obtener datos del usuario');
        
        const userData = await userResponse.json();
        if (!userData.payload || !userData.payload._id) {
            throw new Error('No se pudo obtener el ID del usuario');
        }

        const response = await fetch('/api/adoptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                petId: petId,
                userId: userData.payload._id,
                status: 'pending'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear adopción');
        }

        showAlert('Solicitud de adopción creada exitosamente!');
        loadPets();
        loadAdoptions();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

// Verificar si hay una sesión activa al cargar la página
async function checkSession() {
    try {
        const response = await fetch('/api/sessions/current');
        if (response.ok) {
            const data = await response.json();
            updateUIForLoggedInUser(data.payload);
        }
    } catch (error) {
        console.error('No hay sesión activa');
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', checkSession); 