# 🛍️ Artsport: E-commerce de Artigos Esportivos
## Visão Geral do Projeto
O Artsport é um projeto de simulação de e-commerce de artigos esportivos, desenvolvido como um exercício prático de Programação Web realizado no 2º Semestre de Analise e Desenvolvimento de Sistemas pelo [Senac São Paulo - SP](https://www.sp.senac.br/) . O objetivo central foi implementar e simular todas as funcionalidades essenciais de uma loja virtual, desde a persistência de dados de usuários até o checkout com validação.

## Funcionalidades e Requisitos Implementados
O projeto atende aos requisitos de documentação e adiciona camadas avançadas de gestão e usabilidade.

### 1. Interação do Cliente
- Design Responsivo: Layout adaptável a diferentes tamanhos de tela (desktop e mobile) utilizando Media Queries.
- Header e Navegação: Menu completo, com contador de carrinho (Cart Badge) e links para todas as páginas.
- Seleção de Itens: Adição de produtos com seleção de Quantidade e Variação (Numeração/Tamanho).

### 2. Carrinho e Checkout Avançado
- Persistência de Dados: O estado do carrinho é mantido no localStorage.
- Controles UX: Botões de + e – para alterar a quantidade do item diretamente no carrinho.
- Integração ViaCEP: Preenchimento automático dos campos de Logradouro, Bairro e Cidade ao digitar o CEP.
- Validações: Validação de formato de cartão de crédito (16 dígitos) e validação de campos obrigatórios (Número da Casa)

### 3. Autenticação e Gestão (Simulada)
- Cadastro Simulado: Validação de complexidade de senha e persistência de novos usuários no localStorage.
- Painel Administrativo (admin.html): Acesso restrito para monitoramento.
- Registro de Logins: Rastreamento e exibição de todos os acessos bem-sucedidos (data, hora, usuário).
- Lista de Contas: Exibição da lista de todos os usuários registrados.
- Limpeza de Log: Botão para apagar todo o histórico de logins recentes.

## 💻 Como Executar o Projeto
#### 1. Clone o Repositório:

```bash
git clone https://github.com/lucasrmagalhaess/ProjetoArtShop.git
```

#### 2. Navegue até a Pasta:

```bash
cd ProjetoArtShop
```

#### 3. Abra o index.html: 

Simplesmente abra o arquivo **index.html** no seu navegador de preferência para iniciar o projeto.
