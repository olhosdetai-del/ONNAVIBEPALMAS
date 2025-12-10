const produtos = [
    {
        id: 1,
        nome: "Smartwatch Ultra",
        preco: 59.90,
        descricao: "Relógio inteligente com monitoramento de saúde e bateria de longa duração. Cores disponíveis: Preto, Prata.",
        imagem: "caminho/para/smartwatch.jpg" // Troque pelo caminho real
    },
    {
        id: 2,
        nome: "Fone Bluetooth P9",
        preco: 129.50,
        descricao: "Fone de ouvido sem fio, cancelamento de ruído ativo e som de alta fidelidade. Ideal para exercícios.",
        imagem: "caminho/para/fone.jpg" // Troque pelo caminho real
    },
    {
        id: 3,
        nome: "Conjunto Bicolor",
        preco: 135.00,
        descricao: "Luminária articulável com 3 níveis de intensidade. Perfeita para estudo ou trabalho.",
        imagem: ""
    }
    // Adicione mais produtos aqui
];

// Função para buscar um produto pelo ID
function getProdutoPorId(id) {
    // Note o '+id' para garantir que a comparação seja entre números
    return produtos.find(produto => produto.id === +id);
}