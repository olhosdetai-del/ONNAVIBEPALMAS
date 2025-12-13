// SISTEMA DE NAVEGAÇÃO, CARRINHO E DETALHES DO PRODUTO
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de Carrinho (persistente no localStorage)
    let carrinho = JSON.parse(localStorage.getItem('carrinhoOnnaVibe')) || [];
    
    // Atualizar contador do carrinho em todas as páginas
    function atualizarCarrinho() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
            cartCount.textContent = totalItens;
            // Salvar no localStorage
            localStorage.setItem('carrinhoOnnaVibe', JSON.stringify(carrinho));
        }
    }
    
    // 1. CARREGAR DETALHES DO PRODUTO (na página produto.html)
    if (document.getElementById('produtoDetalhe')) {
        carregarDetalhesProduto();
    }
    
    // 2. BOTÃO DO CARRINHO EM TODAS AS PÁGINAS
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarCarrinho();
        });
    }
    
    // FUNÇÃO PRINCIPAL: Carregar detalhes do produto
    function carregarDetalhesProduto() {
        console.log('Carregando detalhes do produto...');
        
        // 1. Pegar o ID do produto da URL
        const urlParams = new URLSearchParams(window.location.search);
        const produtoId = urlParams.get('id');
        
        console.log('ID do produto da URL:', produtoId);
        
        // 2. Verificar se tem ID na URL
        if (!produtoId) {
            console.error('Nenhum ID de produto encontrado na URL');
            mostrarErro('Produto não encontrado. <a href="catalogo.html">Voltar ao catálogo</a>');
            return;
        }
        
        // 3. Buscar produto pelo ID
        const produto = getProdutoPorId(produtoId);
        
        console.log('Produto encontrado:', produto);
        
        // 4. Verificar se produto existe
        if (!produto) {
            console.error('Produto com ID', produtoId, 'não encontrado');
            mostrarErro('Produto não encontrado. <a href="catalogo.html">Voltar ao catálogo</a>');
            return;
        }
        
        // 5. Preencher os dados do produto na página
        preencherDadosProduto(produto);
        
        // 6. Configurar eventos dos botões
        configurarEventos(produto);
    }
    
    // Preencher dados do produto na página
    function preencherDadosProduto(produto) {
        console.log('Preenchendo dados do produto:', produto.nome);
        
        // Imagem
        const imgElement = document.getElementById('produtoImagem');
        if (imgElement) {
            imgElement.src = produto.imagem;
            imgElement.alt = produto.nome;
            // Se a imagem não carregar, mostrar uma placeholder
            imgElement.onerror = function() {
                this.src = 'https://via.placeholder.com/500x600?text=Imagem+Não+Disponível';
            };
        }
        
        // Nome
        const nomeElement = document.getElementById('produtoNome');
        if (nomeElement) nomeElement.textContent = produto.nome;
        
        // Descrição
        const descElement = document.getElementById('produtoDescricao');
        if (descElement) descElement.textContent = produto.descricao;
        
        // Preço
        const precoElement = document.getElementById('produtoPreco');
        if (precoElement) {
            precoElement.textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
        }
        
        // Tamanhos disponíveis
        const tamanhoSelect = document.getElementById('tamanhoSelect');
        if (tamanhoSelect && produto.tamanhos) {
            // Limpar opções atuais
            tamanhoSelect.innerHTML = '<option value="">Selecione o tamanho</option>';
            
            // Adicionar opções disponíveis
            produto.tamanhos.forEach(tamanho => {
                const option = document.createElement('option');
                option.value = tamanho;
                option.textContent = tamanho;
                if (tamanho === 'M') option.selected = true; // M como padrão
                tamanhoSelect.appendChild(option);
            });
        }
        
        // Adicionar cores disponíveis (se houver)
        if (produto.cores && produto.cores.length > 0) {
            const container = document.querySelector('.col-md-6');
            const coresHTML = `
                <div class="mb-3">
                    <label class="form-label">Cor:</label>
                    <div class="d-flex gap-2">
                        ${produto.cores.map(cor => `
                            <button type="button" class="btn btn-outline-secondary cor-btn" data-cor="${cor}">
                                ${cor}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Inserir depois do preço
            const precoElement = document.getElementById('produtoPreco');
            if (precoElement) {
                precoElement.insertAdjacentHTML('afterend', coresHTML);
            }
        }
    }
    
    // Configurar eventos dos botões
    function configurarEventos(produto) {
        console.log('Configurando eventos para o produto:', produto.id);
        
        // Botão "Adicionar ao Carrinho"
        const btnAdicionar = document.getElementById('btnAdicionarCarrinho');
        if (btnAdicionar) {
            btnAdicionar.addEventListener('click', function() {
                console.log('Clicou em Adicionar ao Carrinho');
                const tamanho = document.getElementById('tamanhoSelect').value;
                const quantidade = parseInt(document.getElementById('quantidade').value);
                
                if (!tamanho) {
                    alert('Por favor, selecione um tamanho!');
                    return;
                }
                
                adicionarAoCarrinho(produto, tamanho, quantidade);
            });
        }
        
        // Botão "Comprar Agora"
        const btnComprar = document.getElementById('btnComprarAgora');
        if (btnComprar) {
            btnComprar.addEventListener('click', function() {
                console.log('Clicou em Comprar Agora');
                const tamanho = document.getElementById('tamanhoSelect').value;
                const quantidade = parseInt(document.getElementById('quantidade').value);
                
                if (!tamanho) {
                    alert('Por favor, selecione um tamanho!');
                    return;
                }
                
                adicionarAoCarrinho(produto, tamanho, quantidade);
                // Redirecionar para uma página de checkout (futuramente)
                alert('Produto adicionado ao carrinho! Em breve você será redirecionado para o pagamento.');
                // window.location.href = 'checkout.html';
            });
        }
        
        // Evento para botões de cor (se existirem)
        setTimeout(() => {
            document.querySelectorAll('.cor-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.cor-btn').forEach(b => {
                        b.classList.remove('btn-dark', 'btn-secondary');
                        b.classList.add('btn-outline-secondary');
                    });
                    this.classList.remove('btn-outline-secondary');
                    this.classList.add('btn-dark');
                });
            });
        }, 100);
    }
    
    // Adicionar produto ao carrinho
    function adicionarAoCarrinho(produto, tamanho, quantidade) {
        console.log('Adicionando ao carrinho:', produto.nome, tamanho, quantidade);
        
        // Verificar se já está no carrinho (mesmo produto e tamanho)
        const itemExistente = carrinho.find(item => 
            item.id === produto.id && item.tamanho === tamanho
        );
        
        if (itemExistente) {
            // Se já existe, aumenta a quantidade
            itemExistente.quantidade += quantidade;
            console.log('Aumentou quantidade para:', itemExistente.quantidade);
        } else {
            // Se não existe, adiciona novo item
            carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                tamanho: tamanho,
                quantidade: quantidade,
                categoria: produto.categoria
            });
            console.log('Novo item adicionado ao carrinho');
        }
        
        // Atualizar contador e salvar
        atualizarCarrinho();
        
        // Mostrar notificação
        mostrarNotificacao(`${produto.nome} (Tamanho: ${tamanho}) adicionado ao carrinho!`);
    }
    
    // Mostrar carrinho
    function mostrarCarrinho() {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        let mensagem = '📦 SEU CARRINHO:\n\n';
        let total = 0;
        
        carrinho.forEach((item, index) => {
            const itemTotal = item.preco * item.quantidade;
            total += itemTotal;
            mensagem += `${item.quantidade}x ${item.nome} (${item.tamanho})\n`;
            mensagem += `   R$ ${item.preco.toFixed(2)} cada = R$ ${itemTotal.toFixed(2)}\n\n`;
        });
        
        mensagem += `\n💳 TOTAL: R$ ${total.toFixed(2)}`;
        mensagem += `\n\nDeseja finalizar a compra?`;
        
        if (confirm(mensagem)) {
            alert('Em breve você será redirecionado para o pagamento!');
            // Aqui você redirecionaria para checkout.html
        }
    }
    
    // Mostrar notificação
    function mostrarNotificacao(mensagem) {
        // Criar elemento de notificação
        const notificacao = document.createElement('div');
        notificacao.className = 'alert alert-success position-fixed';
        notificacao.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        notificacao.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill me-2"></i>
                <span>${mensagem}</span>
            </div>
        `;
        
        // Adicionar ao body
        document.body.appendChild(notificacao);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
        
        // Adicionar animações CSS se não existirem
        if (!document.getElementById('notificacaoStyles')) {
            const style = document.createElement('style');
            style.id = 'notificacaoStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Mostrar erro
    function mostrarErro(mensagem) {
        const container = document.getElementById('produtoDetalhe');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <h4>😕 Ops! Algo deu errado</h4>
                    <p>${mensagem}</p>
                    <a href="catalogo.html" class="btn btn-dark mt-2">Voltar ao Catálogo</a>
                </div>
            `;
        }
    }
    
    // Atualizar carrinho ao carregar a página
    atualizarCarrinho();
    
    // Log para debug
    console.log('Página de detalhes do produto carregada');
    console.log('Carrinho atual:', carrinho);
});
// FUNÇÃO DE ZOOM NA IMAGEM
function iniciarZoomImagem() {
    const zoomImage = document.querySelector('.zoom-image');
    const zoomLens = document.querySelector('.zoom-lens');
    const zoomResult = document.querySelector('.image-zoom-result');
    
    if (!zoomImage || !zoomLens || !zoomResult) return;
    
    /* Cálculo da relação entre a imagem e o zoom */
    const ratio = 2; // Nível do zoom (2x)
    
    zoomImage.addEventListener('mousemove', function(e) {
        const container = this.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        /* Posição do mouse relativa à imagem */
        let x = e.clientX - containerRect.left;
        let y = e.clientY - containerRect.top;
        
        /* Limitar a lente dentro da imagem */
        x = Math.max(0, Math.min(x, containerRect.width));
        y = Math.max(0, Math.min(y, containerRect.height));
        
        /* Posicionar a lente */
        zoomLens.style.left = (x - 50) + 'px';
        zoomLens.style.top = (y - 50) + 'px';
        zoomLens.style.display = 'block';
        
        /* Calcular posição do zoom */
        const bgX = (x / containerRect.width) * 100;
        const bgY = (y / containerRect.height) * 100;
        
        /* Mostrar resultado do zoom */
        zoomResult.style.display = 'block';
        zoomResult.style.backgroundImage = `url('${zoomImage.src}')`;
        zoomResult.style.backgroundSize = `${containerRect.width * ratio}px ${containerRect.height * ratio}px`;
        zoomResult.style.backgroundPosition = `${bgX}% ${bgY}%`;
    });
    
    zoomImage.addEventListener('mouseleave', function() {
        zoomLens.style.display = 'none';
        zoomResult.style.display = 'none';
    });
}

// Versão SIMPLIFICADA (mais fácil)
function zoomSimples() {
    const imagens = document.querySelectorAll('.zoom-image');
    
    imagens.forEach(img => {
        // Adicionar classe para zoom simples
        img.classList.add('simple-zoom');
        
        // Para mobile: toque para zoom
        img.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                this.classList.toggle('zoomed');
                if (this.classList.contains('zoomed')) {
                    this.style.transform = 'scale(2)';
                    this.style.transformOrigin = 'center center';
                } else {
                    this.style.transform = 'scale(1)';
                }
            }
        });
    });
}

// Chamar a função quando a página carregar
if (document.getElementById('produtoImagem')) {
    // Escolha UMA das opções:
    // 1. Para zoom simples (recomendado):
    zoomSimples();
    
    // 2. Para zoom avançado com lente:
    // iniciarZoomImagem();
}