// DADOS DOS PRODUTOS - AQUI VOCÊ ADICIONA NOVOS PRODUTOS FACILMENTE!
const produtos = [
    {
        id: 1,
        nome: "Conjunto Alça Fitness",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Conjunto fitness com top alça e legging de alta compressão. Tecido dry-fit que seca rápido e oferece suporte ideal para treinos intensos.",
        imagem: "img/conjunto alça frente.jpeg",
        cores: ["Preto", "Vinho", "Verde Militar"],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: true
    },
    {
        id: 2,
        nome: "Conjunto Branco Premium",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Conjunto branco com design moderno. Top com sustentação reforçada e legging com cintura alta modeladora.",
        imagem: "img/conjunto branco frente.jpeg",
        cores: ["Branco", "Off-White"],
        tamanhos: ["P", "M", "G"],
        destaque: true
    },
    {
        id: 3,
        nome: "Conjunto Manga Longa",
        preco: 145.00,
        categoria: "conjuntos",
        descricao: "Perfeito para treinos em ambientes frios. Top com manga longa e legging térmica para maior conforto.",
        imagem: "img/conjunto manga cumprida frente.jpeg",
        cores: ["Preto", "Cinza", "Azul Marinho"],
        tamanhos: ["M", "G", "GG"],
        destaque: false
    },
    {
        id: 4,
        nome: "Conjunto Nadador",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Conjunto estilo nadador com design esportivo. Ideal para natação e treinos funcionais.",
        imagem: "img/conjunto nadador frente.jpeg",
        cores: ["Azul", "Preto"],
        tamanhos: ["P", "M", "G"],
        destaque: true
    },
    {
        id: 5,
        nome: "Macacão Marrom",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Macacão fitness em tecido suplex com modelagem única. Conforto e estilo em uma única peça.",
        imagem: "img/MAQUAUINHO MARRON.jpeg",
        cores: ["Marrom", "Preto"],
        tamanhos: ["P", "M", "G"],
        destaque: false
    },
    {
        id: 6,
        nome: "Conjunto Saia Esportiva",
        preco: 140.00,
        categoria: "conjuntos",
        descricao: "Conjunto com saia shorts para maior liberdade de movimento. Ideal para yoga e pilates.",
        imagem: "img/conjunto saia.jpeg",
        cores: ["Preto", "Vinho", "Azul"],
        tamanhos: ["P", "M"],
        destaque: true
    },
    {
        id: 7,
        nome: "Conjunto Celeste",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Conjunto na cor celeste com detalhes em contraste. Tecido respirável e elástico.",
        imagem: "img/conjunto seleste frente.jpeg",
        cores: ["Celeste", "Branco"],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: false
    },
    {
        id: 8,
        nome: "Legging Power Black",
        preco: 89.90,
        categoria: "leggings",
        descricao: "Legging preta de alta compressão com tecnologia anti-transpirante.",
        imagem: "img/fotoCard.png",
        cores: ["Preto"],
        tamanhos: ["P", "M", "G", "GG", "XG"],
        destaque: true
    }
];

// Função para buscar produto por ID
function getProdutoPorId(id) {
    return produtos.find(produto => produto.id === parseInt(id));
}

// Função para filtrar produtos por categoria
function getProdutosPorCategoria(categoria) {
    if (categoria === 'todos') return produtos;
    return produtos.filter(produto => produto.categoria === categoria);
}

// Função para pegar produtos em destaque
function getProdutosDestaque() {
    return produtos.filter(produto => produto.destaque);
}
// Dentro do script do produto.html, na parte que configura o botão "Adicionar ao Carrinho"
document.getElementById('btnAdicionarCarrinho').addEventListener('click', function() {
    // 1. Pegar os valores selecionados CORRETAMENTE
    let corSelecionada = 'Não especificada';
    const corBtnSelecionado = document.querySelector('#coresContainer .btn-dark');
    if (corBtnSelecionado) {
        corSelecionada = corBtnSelecionado.textContent;
    } else if (produto.cores && produto.cores.length > 0) {
        corSelecionada = produto.cores[0]; // Usa a primeira cor disponível
    }
    
    const tamanho = document.getElementById('tamanhoSelect').value;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
    
    // 2. Criar objeto itemCarrinho CORRETO
    const itemCarrinho = {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        cor: corSelecionada,
        tamanho: tamanho,
        quantidade: quantidade
    };
    
    console.log('Item sendo adicionado:', itemCarrinho); // Para debug
    
    // 3. Verificar se temos as funções disponíveis
    if (typeof adicionarAoCarrinho === 'function') {
        // Chamar função global
        adicionarAoCarrinho(itemCarrinho);
    } else {
        // Fallback - adicionar diretamente ao localStorage
        let carrinho = JSON.parse(localStorage.getItem('carrinhoOnnaVibe')) || [];
        
        // Verificar se item já existe
        const index = carrinho.findIndex(item => 
            item.id === itemCarrinho.id && 
            item.tamanho === itemCarrinho.tamanho && 
            item.cor === itemCarrinho.cor
        );
        
        if (index !== -1) {
            carrinho[index].quantidade += itemCarrinho.quantidade;
        } else {
            carrinho.push(itemCarrinho);
        }
        
        localStorage.setItem('carrinhoOnnaVibe', JSON.stringify(carrinho));
        
        // Atualizar contador
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
            cartCount.textContent = total;
        }
        
        // Mostrar notificação
        const notificacao = document.createElement('div');
        notificacao.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show position-fixed" 
                 style="bottom: 20px; right: 20px; z-index: 1050; min-width: 300px;">
                ✅ ${produto.nome} adicionado ao carrinho!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            if (notificacao.parentNode) notificacao.remove();
        }, 3000);
    }
});