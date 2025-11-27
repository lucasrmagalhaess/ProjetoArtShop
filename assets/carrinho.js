
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.carrinho-page')) {
        displayCartItems();
        setupPaymentControls(); // NOVO: Inicializa o controle de pagamento
        setupCheckoutSimulation();
        setupCepListener();
    }
});


/**
 * Renderiza os itens do carrinho na página carrinho.html.
 */
function displayCartItems() {
    // Usamos a variável global 'cart' definida em script.js
    const itemsContainer = document.querySelector('.carrinho-items');
    const valorTotalElement = document.getElementById('valorTotal');
    const subtotalElement = document.getElementById('subtotal');
    let subtotal = 0;

    if (!itemsContainer) return; 

    itemsContainer.innerHTML = ''; 

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<center><p>Seu carrinho está vazio.</p></center>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const variationValue = item.variation || ''; 
            const variationDisplay = item.variation ? `<p class="item-variation">Tamanho: ${item.variation}</p>` : '';
            const itemName = item.name;

            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            
            itemCard.innerHTML = `
                <img src="${item.image}" alt="${itemName}" style="width: 80px; height: 80px; object-fit: contain;">
                <div class="item-info">
                    <h4>${itemName}</h4>
                    ${variationDisplay} 
                    <p>Preço Unitário: R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    
                    <div class="quantity-controls" data-variation="${variationValue}">
                        <button class="btn-qty-change btn-secondary" data-name="${itemName}" data-change="-1">–</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="btn-qty-change btn-secondary" data-name="${itemName}" data-change="1">+</button>
                    </div>
                    
                    <p>Total Item: R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                    <button class="btn-remove-full" data-name="${itemName}">Remover Item</button>
                </div>
            `;
            itemsContainer.appendChild(itemCard);
        });
        
        // Adiciona listeners aos novos botões gerados
        document.querySelectorAll('.btn-qty-change').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });
        
        document.querySelectorAll('.btn-remove-full').forEach(button => {
            button.addEventListener('click', handleRemoveFullItem);
        });
    }
    
    // Atualiza os totais
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    valorTotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    
    // Se o controle de pagamento estiver configurado, atualiza as parcelas com o novo total
    if (typeof setupPaymentControls === 'function') {
        setupPaymentControls(); 
    }
}

/**
 * Lida com o incremento/decremento da quantidade de um item.
 */
function handleQuantityChange(event) {
    const button = event.target;
    const itemName = button.getAttribute('data-name');
    const itemCard = button.closest('.item-info'); 
    
    const variationDisplay = itemCard.querySelector('.item-variation');
    let variation = null;
    if (variationDisplay) {
         variation = variationDisplay.textContent.split(': ')[1].trim(); 
    }

    const change = parseInt(button.getAttribute('data-change')); 

    const itemIndex = cart.findIndex(item => item.name === itemName && item.variation === variation);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            const removedItemName = cart[itemIndex].name;
            cart.splice(itemIndex, 1);
            showToast(`Item ${removedItemName} removido do carrinho.`);
        } else if (change === 1) {
            showToast(`Quantidade de ${itemName} aumentada.`);
        } else if (change === -1) {
            showToast(`Quantidade de ${itemName} diminuída.`);
        }
        
        saveCart();
        displayCartItems(); 
        updateCartCount(); 
    }
}

/**
 * Lida com a remoção total de um item.
 */
function handleRemoveFullItem(event) {
    const button = event.target;
    const itemName = button.getAttribute('data-name');
    const itemCard = button.closest('.item-info'); 
    
    const variationDisplay = itemCard.querySelector('.item-variation');
    let variation = null;
    if (variationDisplay) {
         variation = variationDisplay.textContent.split(': ')[1].trim(); 
    }

    cart = cart.filter(item => !(item.name === itemName && item.variation === variation));

    saveCart();
    displayCartItems();
    updateCartCount(); 
    showToast(`❌ Item ${itemName} removido totalmente do carrinho.`);
}

/**
 * Preenche as opções de parcelamento e configura a visibilidade dos campos de pagamento.
 */
function setupPaymentControls() {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const installmentsGroup = document.getElementById('installmentsGroup');
    const installmentsSelect = document.getElementById('installments');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardLabel = document.querySelector('label[for="cardNumber"]');
    const subtotalElement = document.getElementById('subtotal');
    
    // Captura o total atualizado na tela
    const totalValue = parseFloat(subtotalElement.textContent.replace('R$', '').replace(',', '.').trim()) || 0;
    
    // Função para preencher as opções de parcelamento
    function populateInstallments(maxInstallments) {
        installmentsSelect.innerHTML = '';
        
        for (let i = 1; i <= maxInstallments; i++) {
            const installmentValue = (totalValue / i).toFixed(2).replace('.', ',');
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}x de R$ ${installmentValue} ${i === 1 ? '(À vista)' : ''}`;
            installmentsSelect.appendChild(option);
        }
    }

    // Listener principal para mostrar/esconder campos
    paymentMethodSelect.addEventListener('change', (event) => {
        const selectedMethod = event.target.value;
        
        // 1. Oculta ou exibe campos de cartão e parcelamento
        if (selectedMethod === 'credit') {
            installmentsGroup.style.display = 'block';
            cardNumberInput.style.display = 'block';
            cardLabel.style.display = 'block';
            cardNumberInput.required = true;
            populateInstallments(12); // Simula parcelamento em até 12x
        } else if (selectedMethod === 'pix' || selectedMethod === 'boleto') {
            installmentsGroup.style.display = 'none';
            cardNumberInput.style.display = 'none';
            cardLabel.style.display = 'none';
            cardNumberInput.required = false;
        } else {
            installmentsGroup.style.display = 'none';
            cardNumberInput.style.display = 'none';
            cardLabel.style.display = 'none';
            cardNumberInput.required = false;
        }
    });

    // Garante que as parcelas sejam preenchidas com o valor inicial (para 1x)
    populateInstallments(12); 
    
    // Inicialmente esconde os campos
    const initialMethod = paymentMethodSelect.value;
    if (initialMethod !== 'credit') {
        installmentsGroup.style.display = 'none';
        cardNumberInput.style.display = 'none';
        cardLabel.style.display = 'none';
        cardNumberInput.required = false;
    }
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
        
        const paymentMethod = document.getElementById('paymentMethod').value;
        const cep = document.getElementById('cep').value;
        const address = document.getElementById('address').value;
        const number = document.getElementById('number').value; 
        const cardNumber = document.getElementById('cardNumber').value;
        const installments = paymentMethod === 'credit' ? document.getElementById('installments').value : '1';

        if (cart.length === 0) {
             confirmMessage.textContent = 'O carrinho está vazio.';
             confirmMessage.classList.add('error');
             return;
        }
        
        // Validação 1: Seleção de Método
        if (paymentMethod === '') {
            confirmMessage.textContent = 'Por favor, selecione um método de pagamento.';
            confirmMessage.classList.add('error');
            return;
        }

        // Validação 2: Dados de Entrega
        if (cep === '' || address === '' || number === '') {
            confirmMessage.textContent = 'Por favor, preencha todos os dados de entrega.';
            confirmMessage.classList.add('error');
            return;
        }

        // Validação 3: Específica para Cartão de Crédito
        if (paymentMethod === 'credit') {
            const cleanedCardNumber = cardNumber.replace(/\s/g, ''); 
            
            if (cardNumber === '') {
                confirmMessage.textContent = 'Por favor, digite o número do cartão.';
                confirmMessage.classList.add('error');
                return;
            }

            if (!/^\d{16}$/.test(cleanedCardNumber)) {
                confirmMessage.textContent = 'O número do cartão deve conter exatamente 16 dígitos numéricos.';
                confirmMessage.classList.add('error');
                return;
            }
        }
        
        // Se todas as validações passarem
        console.log(`Simulação de Compra OK! Método: ${paymentMethod}, Parcelas: ${installments}`);

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


/**
 * Busca o endereço completo usando a API ViaCEP e preenche o formulário.
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
                addressInput.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                
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
            const cep = event.target.value.replace(/\D/g, ''); 
            if (cep.length === 8) {
                searchCep(cep);
            }
        });
    }
}