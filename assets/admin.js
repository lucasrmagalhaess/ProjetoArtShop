// admin.js (Lógica Específica da Página de Admin)

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a lógica APENAS se estiver no Painel Admin
    if (document.querySelector('.admin-panel')) {
        setupAdminPanel();
    }
});

/**
 * Carrega o log de acessos bem-sucedidos.
 * OBS: As funções load/saveLoginLog estão no script.js.
 */
// As funções loadLoginLog e saveLoginLog são definidas no script.js e acessíveis aqui.


/**
 * Configura o Painel Admin com dados de log e usuários.
 */
function setupAdminPanel() {
    // 1. Configura a simulação de Adicionar Produto
    const addProductLink = document.getElementById('addProductLink');
    if (addProductLink) {
        addProductLink.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = prompt("Digite o nome do novo produto (ex: Nova Chuteira Pro):");
            if (productName) {
                console.log(`Ação Admin: Produto "${productName}" adicionado ao catálogo (Simulação).`);
                alert(`Simulação: Produto "${productName}" adicionado com sucesso!`);
            }
        });
    }

    // 2. Exibe Contas Registradas
    displayRegisteredUsers();

    // 3. Exibe Logins Recentes
    displayLoginLog();
}

/**
 * Exibe a lista de todos os usuários registrados.
 */
function displayRegisteredUsers() {
    // As funções loadUsers/saveUsers estão no script.js
    const container = document.getElementById('registeredUsersContainer');
    const users = loadUsers();
    
    let html = '<h4>Contas de Clientes Registradas (' + users.length + ')</h4>';
    
    if (users.length === 0) {
        html += '<p>Nenhum cliente registrado ainda.</p>';
    } else {
        html += '<table class="admin-table"><thead><tr><th>Nome</th><th>Email</th><th>Senha (Simulada)</th></tr></thead><tbody>';
        users.forEach(user => {
            html += `<tr><td>${user.name}</td><td>${user.email}</td><td>********</td></tr>`;
        });
        html += '</tbody></table>';
    }
    container.innerHTML = html;
}

/**
 * Exibe o log de acessos bem-sucedidos.
 */
function displayLoginLog() {
    // As funções loadLoginLog/saveLoginLog estão no script.js
    const container = document.getElementById('loginLogContainer');
    const log = loadLoginLog().reverse(); // Mostra os mais recentes primeiro
    
    let html = '<h4>Logins Recentes (' + log.length + ' acessos)</h4>';
    
    if (log.length === 0) {
        html += '<p>Nenhum login registrado ainda.</p>';
    } else {
        html += '<table class="admin-table"><thead><tr><th>Usuário</th><th>Email</th><th>Data/Hora</th><th>Status</th></tr></thead><tbody>';
        log.slice(0, 20).forEach(entry => { // Limita aos últimos 20
            html += `<tr><td>${entry.user}</td><td>${entry.email}</td><td>${entry.time}</td><td>${entry.status}</td></tr>`;
        });
        html += '</tbody></table>';
    }
    container.innerHTML = html;
}