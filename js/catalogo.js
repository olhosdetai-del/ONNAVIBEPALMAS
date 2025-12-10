document.addEventListener('DOMContentLoaded', () => {
    const listaProdutos = document.getElementById('lista-produtos');

    // 1. Itera sobre a lista de produtos
    produtos.forEach(produto => {
        // 2. Cria o elemento principal do cartão
        const card = document.createElement('div');
        card.classList.add('produto-card');
        card.setAttribute('data-id', produto.id);

        // 3. Preenche o conteúdo do cartão
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h2>${produto.nome}</h2>
            <p class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
            <button onclick="window.location.href='detalhe.html?id=${produto.id}'">
                Ver Detalhes
            </button>
        `;

        // 4. Adiciona o cartão à lista na página
        listaProdutos.appendChild(card);
    });
});