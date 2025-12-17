const produtos = [
    {
        id: 1,
        nome: "Conjunto Alça Fitness",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Conjunto fitness com top alça e legging de alta compressão. Tecido dry-fit que seca rápido e oferece suporte ideal para treinos intensos.",
        imagem: "conjunto_alca_frente.jpeg",
        cores: ["Preto", "Vinho", "Verde Militar"],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: true,
        disponivel: true
    },
    {
        id: 2,
        nome: "Conjunto Branco Premium",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Conjunto branco com design moderno. Top com sustentação reforçada e legging com cintura alta modeladora.",
        imagem: "conjunto_branco_frente.jpeg",
        cores: ["Branco", "Off-White"],
        tamanhos: ["P", "M", "G"],
        destaque: true,
        disponivel: true
    },
    {
        id: 3,
        nome: "Conjunto Manga Longa",
        preco: 145.00,
        categoria: "conjuntos",
        descricao: "Perfeito para treinos em ambientes frios. Top com manga longa e legging térmica para maior conforto.",
        imagem: "conjunto_manga_cumprida_frente.jpeg",
        cores: ["Preto", "Cinza", "Azul Marinho"],
        tamanhos: ["M", "G", "GG"],
        destaque: false,
        disponivel: true
    },
    {
        id: 4,
        nome: "Conjunto Nadador",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Conjunto estilo nadador com design esportivo. Ideal para natação e treinos funcionais.",
        imagem: "conjunto_nadador_frente.jpeg",
        cores: ["Azul", "Preto"],
        tamanhos: ["P", "M", "G"],
        destaque: true,
        disponivel: true
    },
    {
        id: 5,
        nome: "Macacão Marrom",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Macacão fitness em tecido suplex com modelagem única. Conforto e estilo em uma única peça.",
        imagem: "MAQUAUINHO_MARRON.jpeg",
        cores: ["Marrom", "Preto"],
        tamanhos: ["P", "M", "G"],
        destaque: false,
        disponivel: true
    },
    {
        id: 6,
        nome: "Conjunto Saia Esportiva",
        preco: 140.00,
        categoria: "conjuntos",
        descricao: "Conjunto com saia shorts para maior liberdade de movimento. Ideal para yoga, pilates e dança.",
        imagem: "conjunto_saia.jpeg",
        cores: ["Preto", "Vinho", "Azul"],
        tamanhos: ["P", "M"],
        destaque: true,
        disponivel: true
    },
    {
        id: 7,
        nome: "Conjunto Celeste",
        preco: 130.00,
        categoria: "conjuntos",
        descricao: "Conjunto na cor celeste com detalhes em contraste. Tecido respirável e elástico.",
        imagem: "conjunto_seleste_frente.jpeg",
        cores: ["Celeste", "Branco"],
        tamanhos: ["P", "M", "G", "GG"],
        destaque: false,
        disponivel: true
    },
    {
        id: 8,
        nome: "Legging Power Black",
        preco: 89.90,
        categoria: "leggings",
        descricao: "Legging preta de alta compressão com tecnologia anti-transpirante.",
        imagem: "fotoCard.png",
        cores: ["Preto"],
        tamanhos: ["P", "M", "G", "GG", "XG"],
        destaque: true,
        disponivel: true
    }
];

function getProdutoPorId(id) {
    return produtos.find(produto => produto.id === parseInt(id));
}

function getProdutosPorCategoria(categoria) {
    if (categoria === 'todos') return produtos;
    return produtos.filter(produto => produto.categoria === categoria);
}

function getProdutosDestaque() {
    return produtos.filter(produto => produto.destaque);
}