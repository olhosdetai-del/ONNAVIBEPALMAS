// SISTEMA DE NAVEGAÇÃO E CARRINHO
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de Carrinho
    let carrinho = JSON.parse(localStorage.getItem('carrinhoOnnaVibe')) || [];
    
    // Atualizar contador do carrinho
    function atualizarCarrinho() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
            cartCount.textContent = totalItens;
            localStorage.setItem('carrinhoOnnaVibe', JSON.stringify(carrinho));
        }
    }
    
    // 1. CARREGAR CATÁLOGO NA PÁGINA CATALOGO.HTML
    if (document.getElementById('produtosContainer')) {
        carregarCatalogo();
        adicionarEventosFiltro();
    }
    
    // 2. CARREGAR DESTAQUES NA PÁGINA HOME
    if (document.getElementById('produtosDestaque')) {
        carregarDestaques();
    }
    
    // 3. CARREGAR DETALHES DO PRODUTO NA PÁGINA PRODUTO.HTML
    if (document.getElementById('produtoDetalhe')) {
        carregarDetalhesProduto();
    }
    
    // 4. BOTÃO DO CARRINHO EM TODAS AS PÁGINAS
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`Carrinho com ${carrinho.length} produtos\nTotal: R$ ${calcularTotalCarrinho().toFixed(2)}`);
        });
    }
    
    // Função para carregar catálogo
    function carregarCatalogo() {
        const container = document.getElementById('produtosContainer');
        const urlParams = new URLSearchParams(window.location.search);
        const categoria = urlParams.get('categoria') || 'todos';
        
        const produtosFiltrados = categoria === 'todos' 
            ? produtos 
            : produtos.filter(p => p.categoria === categoria);
        
        container.innerHTML = '';
        
        if (produtosFiltrados.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-center">Nenhum produto encontrado.</p></div>';
            return;
        }
        
        produtosFiltrados.forEach(produto => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card produto-card h-100">
                    <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}" style="height: 300px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${produto.nome}</h5>
                        <p class="card-text">${produto.descricao.substring(0, 100)}...</p>
                        <div class="mt-auto">
                            <p class="h4 text-danger">R$ ${produto.preco.toFixed(2)}</p>
                            <a href="produto.html?id=${produto.id}" class="btn btn-dark w-100">Ver Detalhes</a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    }
    
    // Função para carregar destaques
    function carregarDestaques() {
        const container = document.getElementById('produtosDestaque');
        const produtosDestaque = getProdutosDestaque().slice(0, 3); // Pega 3 produtos em destaque
        
        container.innerHTML = '';
        
        produtosDestaque.forEach(produto => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card produto-card h-100">
                    <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}" style="height: 250px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${produto.nome}</h5>
                        <p class="card-text">R$ ${produto.preco.toFixed(2)}</p>
                        <a href="produto.html?id=${produto.id}" class="btn btn-dark">Ver Produto</a>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    }
    
    // Função para carregar detalhes do produto
    function carregarDetalhesProduto() {
        const urlParams = new URLSearchParams(window.location.search);
        const produtoId = urlParams.get('id');
        
        if (!produtoId) {
            window.location.href = 'catalogo.html';
            return;
        }
        
        const produto = getProdutoPorId(produtoId);
        
        if (!produto) {
            document.getElementById('produtoDetalhe').innerHTML = `
                <div class="alert alert-danger">
                    Produto não encontrado. <a href="catalogo.html">Voltar ao catálogo</a>
                </div>
            `;
            return;
        }
        
        // Preencher dados do produto
        document.getElementById('produtoImagem').src = produto.imagem;
        document.getElementById('produtoImagem').alt = produto.nome;
        document.getElementById('produtoNome').textContent = produto.nome;
        document.getElementById('produtoDescricao').textContent = produto.descricao;
        document.getElementById('produtoPreco').textContent = `R$ ${produto.preco.toFixed(2)}`;
        
        // Botão "Adicionar ao Carrinho"
        document.getElementById('btnAdicionarCarrinho').addEventListener('click', function() {
            const tamanho = document.getElementById('tamanhoSelect').value;
            const quantidade = parseInt(document.getElementById('quantidade').value);
            
            adicionarAoCarrinho(produto, tamanho, quantidade);
        });
        
        // Botão "Comprar Agora"
        document.getElementById('btnComprarAgora').addEventListener('click', function() {
            const tamanho = document.getElementById('tamanhoSelect').value;
            const quantidade = parseInt(document.getElementById('quantidade').value);
            
            adicionarAoCarrinho(produto, tamanho, quantidade);
            
            // Redireciona para uma página de checkout (futuramente)
            alert('Produto adicionado ao carrinho! Redirecionando para finalização...');
            // window.location.href = 'checkout.html'; // Página futura
        });
    }
    
    // Função para adicionar ao carrinho
    function adicionarAoCarrinho(produto, tamanho, quantidade) {
        const itemExistente = carrinho.find(item => 
            item.id === produto.id && item.tamanho === tamanho
        );
        
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            carrinho.push({
                ...produto,
                tamanho: tamanho,
                quantidade: quantidade
            });
        }
        
        atualizarCarrinho();
        mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
    }
    
    // Função para adicionar eventos aos filtros
    function adicionarEventosFiltro() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const categoria = this.dataset.filter;
                window.location.href = `catalogo.html?categoria=${categoria}`;
            });
        });
    }
    
    // Função para calcular total do carrinho
    function calcularTotalCarrinho() {
        return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }
    
    // Função para mostrar notificação
    function mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.className = 'alert alert-success position-fixed';
        notificacao.style.cssText = 'top: 20px; right: 20px; z-index: 1000;';
        notificacao.textContent = mensagem;
        document.body.appendChild(notificacao);
        
        setTimeout(() => notificacao.remove(), 3000);
    }
    
    // Atualizar carrinho ao carregar
    atualizarCarrinho();
});