// --- Elementos do DOM ---
const userList = document.getElementById('user-list');
const searchInput = document.getElementById('searchInput');
const loadingSpinner = document.getElementById('loading');

let allUsers = []; // Armazena todos os usuários para filtragem no cliente

// --- Funções ---

/**
 * Busca os dados dos usuários da API.
 */
async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        allUsers = await response.json();
        displayUsers(allUsers);
    } catch (error) {
        console.error('Falha ao buscar usuários:', error);
        userList.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #F44336;">Erro ao carregar dados. Tente novamente mais tarde.</td></tr>`;
    } finally {
        loadingSpinner.style.display = 'none'; // Esconde o spinner
    }
}

/**
 * Renderiza a lista de usuários na tabela.
 * @param {Array} users - O array de objetos de usuário a ser exibido.
 */
function displayUsers(users) {
    userList.innerHTML = ''; // Limpa a lista atual

    if (users.length === 0) {
        userList.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum usuário encontrado.</td></tr>`;
        return;
    }

    users.forEach(user => {
        const tr = document.createElement('tr');
        
        const statusClass = user.status.toLowerCase() === 'ativo' ? 'status-active' : 'status-inactive';

        tr.innerHTML = `
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${user.cidade || 'N/A'} - ${user.estado || 'N/A'}</td>
            <td><span class="status-badge ${statusClass}">${user.status}</span></td>
        `;
        userList.appendChild(tr);
    });
}

/**
 * Filtra os usuários com base no termo de busca.
 * @param {Event} event - O evento de input do campo de busca.
 */
function filterUsers(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    const filteredUsers = allUsers.filter(user => {
        const name = user.nome ? user.nome.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        const city = user.cidade ? user.cidade.toLowerCase() : '';

        return name.includes(searchTerm) || 
               email.includes(searchTerm) || 
               city.includes(searchTerm);
    });

    displayUsers(filteredUsers);
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', fetchUsers);
searchInput.addEventListener('input', filterUsers);
