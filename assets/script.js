// script.js

// ====================================
// 1. VARIÁVEIS GLOBAIS E CONFIGURAÇÕES
// ====================================

const ADMIN_CREDENTIALS = {
    email: 'admin@artsport.com.br',
    password: 'admin' 
};
let cart = []; 

// ====================================
// 2. FUNÇÕES DE ARMAZENAMENTO (Universais)
// ====================================

function loadCart() {
    const storedCart = localStorage.getItem('artsportCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function saveCart() {
    localStorage.setItem('artsportCart', JSON.stringify(cart));
}

function loadUsers() {
    const storedUsers = localStorage.getItem('artsportUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
}

function saveUsers(users) {
    localStorage.setItem('artsportUsers', JSON.stringify(users));
}

function loadLoginLog() {
    const log = localStorage.getItem('artsportLoginLog');
    return log ? JSON.parse(log) : [];
}

function saveLoginLog(log) {
    localStorage.setItem('artsportLoginLog', JSON.stringify(log));
}

/**
 * Exibe uma notificação temporária (toast) na tela.
 */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
        }, 500); 
    }, 3000);
}

// ====================================
// 3. FUNÇÕES DE INICIALIZAÇÃO E LISTENERS
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); 
    
    if (document.getElementById('loginForm')) {
        setupLoginSimulation();
    }
    
    if (document.getElementById('cadastroForm')) {
        setupCadastroSimulation();
    }
    
    setupProductListeners(); 
    
    // Inicializa a lógica específica do carrinho (se estiver na página)
    if (document.querySelector('.carrinho-page')) {
        // As funções de display/checkout são chamadas no carrinho.js
    }

    // Inicializa o Painel Admin
    if (document.querySelector('.admin-panel')) {
        setupAdminPanel();
    }
    
    // Contato
    if (document.querySelector('.contato-page')) {
        setupContactFormSimulation();
    }
    
    updateCartCount(); 
});

// ====================================
// 4. LÓGICA DE AUTENTICAÇÃO
// ====================================

/**
 * Simula o processo de Login e registra o acesso.
 */
function setupLoginSimulation() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        loginMessage.textContent = '';
        loginMessage.className = 'message';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === '' || password === '') {
            loginMessage.textContent = 'Por favor, preencha todos os campos.';
            loginMessage.classList.add('error');
            return;
        }

        let loginSuccess = false;
        let userName = 'Usuário Comum';

        // 1. VERIFICAÇÃO DE LOGIN ADMIN
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            loginSuccess = true;
            userName = 'Administrador';
            loginMessage.textContent = 'Administrador logado com sucesso! Redirecionando para o Painel...';
            loginMessage.classList.add('success');
            
            setTimeout(() => { window.location.href = 'admin.html'; }, 1500);
        } else {
            // 2. VERIFICAÇÃO DE USUÁRIO REGISTRADO NO LOCALSTORAGE
            const registeredUsers = loadUsers();
            const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

            if (foundUser) {
                loginSuccess = true;
                userName = foundUser.name;
                loginMessage.textContent = `Login realizado com sucesso, ${userName}! Redirecionando...`;
                loginMessage.classList.add('success');
                
                // CORREÇÃO: REDIRECIONAMENTO PARA O INDEX.HTML
                setTimeout(() => { 
                    window.location.href = 'index.html'; 
                }, 1500);
            } else {
                loginMessage.textContent = 'Erro: E-mail ou senha incorretos.';
                loginMessage.classList.add('error');
            }
        }
        
        // Registro do Log
        if (loginSuccess) {
            const log = loadLoginLog();
            log.push({
                user: userName,
                email: email,
                time: new Date().toLocaleString(),
                status: 'SUCESSO'
            });
            saveLoginLog(log);
        }

    });
}

function setupCadastroSimulation() {
    const cadastroForm = document.getElementById('cadastroForm');
    const cadastroMessage = document.getElementById('cadastroMessage');
    
    cadastroForm.addEventListener('submit', (event) => {
        event.preventDefault();

        cadastroMessage.textContent = '';
        cadastroMessage.className = 'message';

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validações
        if (name === '' || email === '' || password === '' || confirmPassword === '') {
            cadastroMessage.textContent = 'Por favor, preencha todos os campos.';
            cadastroMessage.classList.add('error');
            return;
        }

        if (password !== confirmPassword) {
            cadastroMessage.textContent = 'As senhas digitadas não coincidem.';
            cadastroMessage.classList.add('error');
            return;
        }
        
        const complexityError = validatePasswordComplexity(password);
        if (complexityError) {
            cadastroMessage.textContent = complexityError;
            cadastroMessage.classList.add('error');
            return;
        }
        
        const users = loadUsers();
        if (users.find(u => u.email === email)) {
            cadastroMessage.textContent = 'Erro: Este e-mail já está cadastrado.';
            cadastroMessage.classList.add('error');
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password 
        };
        users.push(newUser);
        saveUsers(users); 

        cadastroMessage.textContent = 'Cadastro realizado com sucesso! Faça Login.';
        cadastroMessage.classList.add('success');
        
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 1500);
    });
}

function validatePasswordComplexity(password) {
    const minLength = 6; 
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return `A senha deve ter pelo menos ${minLength} caracteres.`;
    }
    
    let complexityScore = 0;
    if (hasUpperCase) complexityScore++;
    if (hasLowerCase) complexityScore++;
    if (hasNumbers) complexityScore++;
    if (hasSpecialChars) complexityScore++;
    
    if (complexityScore < 2) { 
        return 'A senha deve conter pelo menos dois dos seguintes: letra maiúscula, letra minúscula, número ou caractere especial.';
    }

    return null; 
}


// ====================================
// 5. LÓGICA DO PAINEL DE ADMINISTRAÇÃO 
// ====================================

function setupAdminPanel() {
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

    displayRegisteredUsers();
    displayLoginLog();
}

function displayRegisteredUsers() {
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

function displayLoginLog() {
    const container = document.getElementById('loginLogContainer');
    const log = loadLoginLog().reverse(); 
    
    let html = '<h4>Logins Recentes (' + log.length + ' acessos)</h4>';
    
    if (log.length === 0) {
        html += '<p>Nenhum login registrado ainda.</p>';
    } else {
        html += '<table class="admin-table"><thead><tr><th>Usuário</th><th>Email</th><th>Data/Hora</th><th>Status</th></tr></thead><tbody>';
        log.slice(0, 20).forEach(entry => { 
            html += `<tr><td>${entry.user}</td><td>${entry.email}</td><td>${entry.time}</td><td>${entry.status}</td></tr>`;
        });
        html += '</tbody></table>';
    }
    container.innerHTML = html;
}


// ====================================
// 6. LÓGICA DO CARRINHO (Adicionar Item)
// ====================================

function setupProductListeners() {
    const addButtons = document.querySelectorAll('.btn-carrinho');
    addButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

function handleAddToCart(event) {
    const productCard = event.target.closest('.produto-card');
    const button = event.target; 
    
    const quantityInput = productCard.querySelector('.quantidade-input');
    const quantity = parseInt(quantityInput.value) || 1; 

    const productName = productCard.querySelector('h3').textContent; 
    const productPriceText = productCard.querySelector('.valor').textContent.replace('R$', '').replace(',', '.').trim();
    const productPrice = parseFloat(productPriceText);

    const variationSelect = productCard.querySelector('.product-variation');
    const variation = variationSelect ? variationSelect.value : null; 
    
    const imagePath = button.getAttribute('data-caminho'); 

    const newItem = {
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: imagePath,
        variation: variation
    };

    const existingItem = cart.find(item => item.name === productName && item.variation === variation);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push(newItem);
    }

    saveCart(); 
    
    let toastMessage = `✅ ${productName}`;
    if (variation) {
        toastMessage += ` (Tam.: ${variation})`;
    }
    showToast(toastMessage + ` adicionado ao carrinho!`);
    
    if (typeof displayCartItems === 'function' && document.querySelector('.carrinho-page')) {
        displayCartItems(); 
    }
    updateCartCount(); 
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return; 

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'inline-block' : 'none';
}


// ====================================
// 7. LÓGICA DE CONTATO (Mantida)
// ====================================

function setupContactFormSimulation() {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackMessage = document.getElementById('feedbackMessage');

    if (!feedbackForm) return;

    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();

        feedbackMessage.textContent = '';
        feedbackMessage.className = 'message';

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;

        if (nome === '' || email === '' || mensagem === '') {
            feedbackMessage.textContent = 'Por favor, preencha seu nome, email e a mensagem.';
            feedbackMessage.classList.add('error');
            return;
        }

        feedbackMessage.textContent = 'Mensagem enviada com sucesso! Agradecemos sua observação.';
        feedbackMessage.classList.add('success');
        
        showToast('Mensagem enviada com sucesso!');

        setTimeout(() => {
            feedbackForm.reset(); 
            feedbackMessage.textContent = '';
            feedbackMessage.className = 'message';
        }, 3000);
    });
}