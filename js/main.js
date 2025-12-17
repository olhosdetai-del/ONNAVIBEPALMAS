// SISTEMA DE CARRINHO ONNA VIBe
document.addEventListener('DOMContentLoaded', function() {
    console.log('ONNA VIBe - Sistema de Carrinho inicializado');
    
    // Carrinho (localStorage)
    let carrinho = JSON.parse(localStorage.getItem('carrinhoOnnaVibe')) || [];
    
    // Número do WhatsApp (ALTERE AQUI!)
    const NUMERO_WHATSAPP = '5511989693737'; // Formato: 55 + DDD + número
    
    // ========== ATUALIZAR CONTADOR DO CARRINHO ==========
    function atualizarCarrinho() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
            cartCount.textContent = totalItens;
            console.log('Contador atualizado:', totalItens, 'itens');
        }
    }
    
    // ========== FUNÇÃO PRINCIPAL: ADICIONAR AO CARRINHO ==========
    function adicionarAoCarrinho(item) {
        console.log('Função adicionarAoCarrinho chamada com:', item);
        
        // Validar item
        if (!item || !item.id) {
            console.error('Item inválido:', item);
            mostrarNotificacao('❌ Erro: Item inválido', 'danger');
            return false;
        }
        
        // Garantir campos obrigatórios
        if (!item.tamanho) item.tamanho = 'M'; // Tamanho padrão
        if (!item.cor) item.cor = 'Não especificada';
        if (!item.quantidade || item.quantidade < 1) item.quantidade = 1;
        
        // Verificar se item já existe
        const index = carrinho.findIndex(prod => 
            prod.id === item.id && 
            prod.tamanho === item.tamanho && 
            prod.cor === item.cor
        );
        
        if (index !== -1) {
            // Atualizar quantidade
            carrinho[index].quantidade += item.quantidade;
            console.log('Item existente atualizado:', carrinho[index]);
        } else {
            // Adicionar novo item
            carrinho.push(item);
            console.log('Novo item adicionado:', item);
        }
        
        // Salvar no localStorage
        localStorage.setItem('carrinhoOnnaVibe', JSON.stringify(carrinho));
        
        // Atualizar interface
        atualizarCarrinho();
        
        // Mostrar notificação
        mostrarNotificacao(`✅ ${item.nome} adicionado ao carrinho!`);
        
        return true;
    }
    
    // ========== REMOVER ITEM DO CARRINHO ==========
    function removerDoCarrinho(index) {
        if (index >= 0 && index < carrinho.length) {
            const itemRemovido = carrinho[index];
            carrinho.splice(index, 1);
            localStorage.setItem('carrinhoOnnaVibe', JSON.stringify(carrinho));
            atualizarCarrinho();
            mostrarNotificacao(`🗑️ ${itemRemovido.nome} removido do carrinho`);
            
            // Atualizar modal se aberto
            const modal = document.getElementById('carrinhoItens');
            if (modal) {
                modal.innerHTML = gerarHTMLCarrinho();
            }
        }
    }
    
    // ========== BOTÃO DO CARRINHO ==========
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (carrinho.length === 0) {
                mostrarNotificacao('🛒 Seu carrinho está vazio!');
                return;
            }
            
            mostrarModalCarrinho();
        });
    }
    
    // ========== GERAR HTML DO CARRINHO ==========
    function gerarHTMLCarrinho() {
        if (carrinho.length === 0) {
            return '<div class="alert alert-info">Carrinho vazio</div>';
        }
        
        let html = '<h6>Itens no carrinho:</h6>';
        let total = 0;
        
        carrinho.forEach((item, index) => {
            const subtotal = (item.preco || 0) * (item.quantidade || 1);
            total += subtotal;
            
            html += `
                <div class="border-bottom pb-2 mb-2">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${item.nome}</strong><br>
                            <small class="text-muted">
                                Tamanho: ${item.tamanho || 'M'} | 
                                Cor: ${item.cor || 'Não especificada'}
                            </small>
                        </div>
                        <div class="text-end">
                            <div>R$ ${subtotal.toFixed(2)}</div>
                            <small>${item.quantidade || 1} × R$ ${(item.preco || 0).toFixed(2)}</small><br>
                            <button class="btn btn-sm btn-danger btn-remover" data-index="${index}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
            <div class="mt-3 pt-2 border-top">
                <div class="d-flex justify-content-between">
                    <strong>TOTAL:</strong>
                    <strong class="text-danger">R$ ${total.toFixed(2)}</strong>
                </div>
            </div>
        `;
        
        return html;
    }
    
    // ========== MODAL DO CARRINHO ==========
    function mostrarModalCarrinho() {
        const modalHTML = `
            <div class="modal fade" id="modalCarrinho">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-danger text-white">
                            <h5 class="modal-title">🛍️ Meu Carrinho</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="carrinhoItens">${gerarHTMLCarrinho()}</div>
                            
                            <div class="mt-4">
                                <h6>Enviar pedido via WhatsApp</h6>
                                <form id="formPedido">
                                    <input type="text" class="form-control mb-2" placeholder="Seu nome" required>
                                    <input type="tel" class="form-control mb-2" placeholder="WhatsApp (ex: 63 99999-9999)" required>
                                    <textarea class="form-control mb-2" placeholder="Endereço completo" rows="2" required></textarea>
                                    <textarea class="form-control mb-3" placeholder="Observações (opcional)" rows="2"></textarea>
                                    <button type="button" class="btn btn-success w-100" onclick="enviarWhatsApp()">
                                        <i class="bi bi-whatsapp"></i> Enviar para WhatsApp
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar e mostrar modal
        const div = document.createElement('div');
        div.innerHTML = modalHTML;
        document.body.appendChild(div);
        
        const modal = new bootstrap.Modal(document.getElementById('modalCarrinho'));
        modal.show();
        
        // Configurar botões de remover
        setTimeout(() => {
            document.querySelectorAll('.btn-remover').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    removerDoCarrinho(index);
                });
            });
        }, 100);
    }
    
    // ========== ENVIAR PARA WHATSAPP ==========
    window.enviarWhatsApp = function() {
        // Simples: só envia a lista de produtos
        let mensagem = 'Olá! Gostaria de comprar:\n\n';
        
        carrinho.forEach(item => {
            mensagem += `• ${item.quantidade}x ${item.nome} (Tamanho: ${item.tamanho})\n`;
        });
        
        mensagem += '\nPodem me ajudar com este pedido?';
        
        const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        
        // Limpar carrinho após envio
        carrinho = [];
        localStorage.removeItem('carrinhoOnnaVibe');
        atualizarCarrinho();
        
        mostrarNotificacao('✅ Pedido enviado para o WhatsApp!');
    };
    
    // ========== NOTIFICAÇÕES ==========
    function mostrarNotificacao(mensagem, tipo = 'success') {
        const notif = document.createElement('div');
        notif.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
        notif.style.cssText = `
            bottom: 20px; 
            right: 20px; 
            z-index: 9999; 
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        notif.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notif);
        
        setTimeout(() => {
            if (notif.parentNode) {
                notif.remove();
            }
        }, 3000);
    }
    
    // ========== INICIALIZAR ==========
    atualizarCarrinho();
    
    // Exportar funções globais
    window.adicionarAoCarrinho = adicionarAoCarrinho;
    window.removerDoCarrinho = removerDoCarrinho;
    window.mostrarNotificacao = mostrarNotificacao;
    
    console.log('Sistema de carrinho pronto. Itens no carrinho:', carrinho.length);
});