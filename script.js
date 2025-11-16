// script.js

// ====================================
// 1. VARIÁVEIS GLOBAIS E CONFIGURAÇÕES
// ====================================

// Credenciais de Administrador (Simulação - Hardcoded)
const ADMIN_CREDENTIALS = {
    email: 'admin@artsport.com.br',
    password: 'admin' 
};

// Variável para armazenar os itens do carrinho (persiste no localStorage)
let cart = []; 

// ====================================
// 2. FUNÇÕES DE ARMAZENAMENTO (localStorage)
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

// Funções para gerenciamento de usuários no localStorage
function loadUsers() {
    const storedUsers = localStorage.getItem('artsportUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
}

function saveUsers(users) {
    localStorage.setItem('artsportUsers', JSON.stringify(users));
}

// ====================================
// 3. FUNÇÕES DE INICIALIZAÇÃO E LISTENERS
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); 
    
    // Configuração dos formulários e interações por página
    if (document.getElementById('loginForm')) {
        setupLoginSimulation();
    }
    
    if (document.getElementById('cadastroForm')) {
        setupCadastroSimulation();
    }
    
    setupProductListeners(); // Para Home e Produtos
    
    if (document.querySelector('.carrinho-page')) {
        displayCartItems();
        setupCheckoutSimulation();
        setupCepListener(); // Inicializa o listener do CEP
    }
    
    if (document.querySelector('.contato-page')) {
        setupContactFormSimulation();
    }
    
    // Configuração inicial do contador do carrinho
    updateCartCount(); 
});

// ====================================
// 4. LÓGICA DE AUTENTICAÇÃO
// ====================================

/**
 * Simula o processo de Login (Admin e Usuário Comum).
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

        // 1. Validação de preenchimento básico
        if (email === '' || password === '') {
            loginMessage.textContent = 'Por favor, preencha todos os campos.';
            loginMessage.classList.add('error');
            return;
        }

        // 2. VERIFICAÇÃO DE LOGIN ADMIN
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            
            loginMessage.textContent = 'Administrador logado com sucesso! Redirecionando para o Painel...';
            loginMessage.classList.add('success');
            
            setTimeout(() => {
                 window.location.href = 'admin.html'; 
            }, 1500);
            
            return; 
        }
        
        // 3. VERIFICAÇÃO DE USUÁRIO REGISTRADO NO LOCALSTORAGE
        const registeredUsers = loadUsers();
        const foundUser = registeredUsers.find(
            u => u.email === email && u.password === password
        );

        if (foundUser) {
            // Login de Usuário Registrado Aprovado
            loginMessage.textContent = `Login realizado com sucesso, ${foundUser.name}! Redirecionando...`;
            loginMessage.classList.add('success');
            
            setTimeout(() => {
                // window.location.href = 'index.html'; 
                console.log('Login de Usuário Comum, Redirecionamento para a Home.');
            }, 1500);
            return;
        }
        
        // 4. Se não for Admin e não for um Usuário Registrado, exibe erro.
        loginMessage.textContent = 'Erro: E-mail ou senha incorretos.';
        loginMessage.classList.add('error');
    });
}

/**
 * Simula o processo de Cadastro com validação de complexidade e coincidência.
 */
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
        
        // NOVO: Verifica se o e-mail já existe
        const users = loadUsers();
        if (users.find(u => u.email === email)) {
            cadastroMessage.textContent = 'Erro: Este e-mail já está cadastrado.';
            cadastroMessage.classList.add('error');
            return;
        }

        // Cria e Salva o Novo Usuário
        const newUser = {
            name: name,
            email: email,
            password: password 
        };
        users.push(newUser);
        saveUsers(users); 

        // Simulação de Sucesso:
        cadastroMessage.textContent = 'Cadastro realizado com sucesso! Faça Login.';
        cadastroMessage.classList.add('success');
        
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        
        setTimeout(() => {
            window.location.href = 'login.html'; // Redireciona para o login
        }, 1500);
    });
}

/**
 * Verifica se a senha atende aos critérios de complexidade (REGRAS MAIS FÁCEIS).
 */
function validatePasswordComplexity(password) {
    const minLength = 6; // Reduzido de 8 para 6
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
    
    if (complexityScore < 2) { // Exige apenas 2 critérios
        return 'A senha deve conter pelo menos dois dos seguintes: letra maiúscula, letra minúscula, número ou caractere especial.';
    }

    return null; 
}


// ====================================
// 5. LÓGICA DO CARRINHO E CHECKOUT
// ====================================

/**
 * Função para buscar o CEP e preencher o endereço (ViaCEP).
 */
function searchCep(cep) {
    const addressInput = document.getElementById('address');
    const numberInput = document.getElementById('number'); 

    addressInput.value = '... Buscando ...'; 
    addressInput.disabled = true; 

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                addressInput.value = '';
                alert("CEP não encontrado. Por favor, digite o endereço manualmente.");
            } else {
                // Preenche o campo de endereço completo (Logradouro, Bairro, Cidade - UF)
                addressInput.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                
                // Foca automaticamente no campo de número
                if (numberInput) {
                    numberInput.focus(); 
                }
            }
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            addressInput.value = '';
            alert("Erro na comunicação com o serviço de CEP.");
        })
        .finally(() => {
            addressInput.disabled = false;
        });
}

/**
 * Adiciona listener para o campo CEP.
 */
function setupCepListener() {
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('blur', (event) => {
            const cep = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
            if (cep.length === 8) {
                searchCep(cep);
            }
        });
    }
}


/**
 * Configura os listeners dos botões "Adicionar ao Carrinho" nas páginas de produto.
 */
function setupProductListeners() {
    const addButtons = document.querySelectorAll('.btn-carrinho');
    
    addButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

/**
 * Adiciona um produto ao array do carrinho e salva no localStorage.
 */
function handleAddToCart(event) {
    const productCard = event.target.closest('.produto-card');
    
    const productName = productCard.querySelector('h3').textContent; 
    
    const productPriceText = productCard.querySelector('.valor').textContent.replace('R$', '').replace(',', '.').trim();
    const productPrice = parseFloat(productPriceText);

    const newItem = {
        name: productName,
        price: productPrice,
        quantity: 1
    };

    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(newItem);
    }

    saveCart(); 
    
    showToast(`✅ ${productName} adicionado ao carrinho!`);
    
    if (document.querySelector('.carrinho-page')) {
        displayCartItems();
    }
    updateCartCount(); 
}

/**
 * Renderiza os itens do carrinho na página carrinho.html.
 */
function displayCartItems() {
    const itemsContainer = document.querySelector('.carrinho-items');
    const valorTotalElement = document.getElementById('valorTotal');
    const subtotalElement = document.getElementById('subtotal');
    let subtotal = 0;

    if (!itemsContainer) return; 

    itemsContainer.innerHTML = ''; 

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            
            // Note: A imagem é gerada com um src vazio, o CSS a estiliza para ser pequena.
            itemCard.innerHTML = `
                <img src="" alt="${item.name}" style="width: 80px; height: 80px; object-fit: contain;">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Preço Unitário: R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    <p>Quantidade: <span>${item.quantity}</span></p>
                    <p>Total Item: R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                    <button class="btn-remover" data-name="${item.name}">Remover</button>
                </div>
            `;
            itemsContainer.appendChild(itemCard);
        });
    }
    
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    valorTotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    
    document.querySelectorAll('.btn-remover').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
}

/**
 * Remove um item do carrinho.
 */
function handleRemoveItem(event) {
    const itemName = event.target.getAttribute('data-name');
    cart = cart.filter(item => item.name !== itemName);
    saveCart();
    displayCartItems();
    updateCartCount(); 
    showToast(`❌ ${itemName} removido do carrinho.`);
}

/**
 * Calcula o total de itens no carrinho e atualiza o contador visual.
 */
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return; 

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'inline-block' : 'none';
}


/**
 * Simula a validação de checkout e a finalização da compra.
 */
function setupCheckoutSimulation() {
    const checkoutForm = document.getElementById('checkoutForm');
    const confirmMessage = document.getElementById('confirmMessage');

    if (!checkoutForm) return;

    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();

        confirmMessage.textContent = '';
        confirmMessage.className = 'message';
        
        // Captura e limpeza dos campos
        const cep = document.getElementById('cep').value;
        const address = document.getElementById('address').value;
        const number = document.getElementById('number').value; 
        const cardNumber = document.getElementById('cardNumber').value;

        // Validação 1: Carrinho Vazio
        if (cart.length === 0) {
             confirmMessage.textContent = 'O carrinho está vazio.';
             confirmMessage.classList.add('error');
             return;
        }

        // Validação 2: Preenchimento (todos os campos obrigatórios)
        if (cep === '' || address === '' || number === '' || cardNumber === '') {
            confirmMessage.textContent = 'Por favor, preencha todos os dados de entrega e pagamento.';
            confirmMessage.classList.add('error');
            return;
        }
        
        // Validação 3: Número do Cartão (16 dígitos)
        const cleanedCardNumber = cardNumber.replace(/\s/g, ''); 
        if (!/^\d{16}$/.test(cleanedCardNumber)) {
            confirmMessage.textContent = 'O número do cartão deve conter exatamente 16 dígitos numéricos.';
            confirmMessage.classList.add('error');
            return;
        }

        // Simulação de Sucesso:
        confirmMessage.textContent = 'Compra realizada com sucesso!';
        confirmMessage.classList.add('success');
        
        showToast('🎉 Compra realizada com sucesso!');

        cart = [];
        saveCart();
        
        setTimeout(() => {
            displayCartItems();
            updateCartCount(); 
            checkoutForm.reset();
        }, 1000);
    });
}


// ====================================
// 6. LÓGICA DE CONTATO E UTILITÁRIOS
// ====================================

/**
 * Simula o envio do formulário de Contato.
 */
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

        // Validação simples
        if (nome === '' || email === '' || mensagem === '') {
            feedbackMessage.textContent = 'Por favor, preencha seu nome, email e a mensagem.';
            feedbackMessage.classList.add('error');
            return;
        }

        // Simulação de sucesso:
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

    // 1. Mostra o toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // 2. Remove o toast após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        // Espera a transição e remove o elemento
        setTimeout(() => {
            container.removeChild(toast);
        }, 500); 
    }, 3000);
}