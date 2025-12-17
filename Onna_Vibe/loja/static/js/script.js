// CALCULADORA DE MEDIDAS ONNA VIBe - VERSÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', function () {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const sizeResult = document.getElementById('sizeResult');
    const sizeDetails = document.getElementById('sizeDetails');
    const recommendation = document.getElementById('recommendation');

    // Verifica se o botão existe antes de adicionar o evento para evitar erros
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSize);
    }

    // Adicionar evento Enter nos inputs para facilitar o uso
    document.querySelectorAll('.measure-input').forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                calculateSize();
            }
        });
    });

    // Função principal de cálculo
    function calculateSize() {
        // Captura dos valores do formulário
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const altura = parseFloat(document.getElementById('altura').value);
        const peso = parseFloat(document.getElementById('peso').value);
        const cintura = parseFloat(document.getElementById('cintura').value);
        const braco = parseFloat(document.getElementById('braco').value);
        const telefone = document.getElementById('telefone').value.trim();

        // Validação básica dos campos antes de calcular
        if (!nome || !email || isNaN(altura) || isNaN(peso) || isNaN(cintura) || isNaN(braco)) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        // Mostrar animação de carregamento
        showLoading(true);

        // Processamento do tamanho baseado no biotipo
        setTimeout(() => {
            const result = calculateClothingSize(altura, peso, cintura, braco, nome);

            // Exibe o resultado na tela
            displayResult(result);
            showLoading(false);
            calculateBtn.innerHTML = 'CALCULAR NOVAMENTE';

            // ENVIO PARA O BANCO DE DATA (Clientes.db)
            // Enviamos apenas nome, email e o resultado (medida) conforme a tabela Cliente
            saveUserData(nome, email, result.size);
        }, 1000);
    }

    // Algoritmo de cálculo de tamanho
    function calculateClothingSize(altura, peso, cintura, braco, nome) {
        const alturaInMeters = altura / 100;
        const imc = peso / (alturaInMeters * alturaInMeters);
        let score = 0;

        // Lógica de pontuação por medidas (Cintura e Braço são prioritários)
        if (cintura <= 65) score += 40;
        else if (cintura <= 75) score += 30;
        else if (cintura <= 85) score += 20;
        else score += 10;

        if (braco <= 26) score += 30;
        else if (braco <= 30) score += 25;
        else score += 15;

        // Determinação do tamanho final
        let size, details;
        if (score >= 65) {
            size = 'P';
            details = 'Perfil delicado e ajustado.';
        } else if (score >= 50) {
            size = 'M';
            details = 'Proporções equilibradas.';
        } else if (score >= 35) {
            size = 'G';
            details = 'Estrutura atlética.';
        } else {
            size = 'GG';
            details = 'Conforto e amplitude.';
        }

        return {
            size: size,
            details: details,
            recommendation: `Olá ${nome}, o tamanho ${size} é o ideal para o seu treino!`
        };
    }

    // Função para mostrar o resultado visualmente
    function displayResult(result) {
        sizeResult.textContent = result.size;
        sizeDetails.textContent = result.details;
        recommendation.textContent = result.recommendation;
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Função que envia os dados para o Django salvar no Clientes.db
    function saveUserData(nome, email, tamanho) {
        const dados = {
            nome: nome,
            email: email,
            medida: tamanho // Campo 'medida' corresponde à coluna no banco Clientes.db
        };

        fetch("/salvar_cliente/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie('csrftoken') // Proteção obrigatória do Django
            },
            body: JSON.stringify(dados)
        })
            .then(response => response.json())
            .then(data => console.log("Dados salvos no Clientes.db:", data))
            .catch(err => console.error("Erro ao conectar com o servidor:", err));
    }

    // Função para obter o Token CSRF necessário para o Django
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function showLoading(show) {
        if (show) {
            calculateBtn.innerHTML = 'CALCULANDO...';
            calculateBtn.disabled = true;
        } else {
            calculateBtn.disabled = false;
        }
    }
});