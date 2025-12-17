document.addEventListener('DOMContentLoaded', function () {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoOnnaVibe')) || [];

    function atualizarCarrinho() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = carrinho.reduce((total, item) => total + item.quantidade, 0);
            localStorage.setItem('carrinhoOnnaVibe', JSON.stringify(carrinho));
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    if (document.getElementById('produtoDetalhe') && produtoId) {
        const produto = typeof getProdutoPorId === 'function' ? getProdutoPorId(produtoId) : null;

        if (produto) {
            document.getElementById('produtoNome').textContent = produto.nome;
            document.getElementById('produtoDescricao').textContent = produto.descricao;
            document.getElementById('produtoPreco').textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;

            const imgElement = document.getElementById('produtoImagem');
            const nomeFicheiro = produto.imagem.replace('img/', '');
            imgElement.src = encodeURI("/static/img/" + nomeFicheiro);

            const btnAdd = document.getElementById('btnAdicionarCarrinho');
            if (btnAdd) {
                btnAdd.onclick = function () {
                    const tam = document.getElementById('tamanhoSelect').value;
                    const qtd = parseInt(document.getElementById('quantidade').value) || 1;
                    carrinho.push({
                        ...produto,
                        tamanho: tam,
                        quantidade: qtd,
                        imagem_url: imgElement.src
                    });
                    atualizarCarrinho();
                    alert('Produto adicionado ao carrinho!');
                };
            }

            setTimeout(iniciarZoom, 500);
        }
    }
    atualizarCarrinho();
});

function iniciarZoom() {
    const container = document.querySelector('.image-zoom-container');
    const zoomImage = document.getElementById('produtoImagem');
    const zoomLens = document.querySelector('.zoom-lens');
    const zoomResult = document.querySelector('.image-zoom-result');

    if (!container || !zoomImage || !zoomLens || !zoomResult) return;

    container.onmousemove = function (e) {
        zoomLens.style.display = 'block';
        zoomResult.style.display = 'block';
        const rect = container.getBoundingClientRect();
        let x = e.pageX - rect.left - window.scrollX;
        let y = e.pageY - rect.top - window.scrollY;

        const ratio = 2.5;
        zoomResult.style.backgroundImage = `url('${zoomImage.src}')`;
        zoomResult.style.backgroundSize = `${rect.width * ratio}px ${rect.height * ratio}px`;

        let lx = x - (zoomLens.offsetWidth / 2);
        let ly = y - (zoomLens.offsetHeight / 2);

        if (lx < 0) lx = 0;
        if (ly < 0) ly = 0;
        if (lx > rect.width - zoomLens.offsetWidth) lx = rect.width - zoomLens.offsetWidth;
        if (ly > rect.height - zoomLens.offsetHeight) ly = rect.height - zoomLens.offsetHeight;

        zoomLens.style.left = lx + 'px';
        zoomLens.style.top = ly + 'px';
        zoomResult.style.backgroundPosition = `${(lx / (rect.width - zoomLens.offsetWidth)) * 100}% ${(ly / (rect.height - zoomLens.offsetHeight)) * 100}%`;
    };

    container.onmouseleave = () => {
        zoomLens.style.display = 'none';
        zoomResult.style.display = 'none';
    };
}