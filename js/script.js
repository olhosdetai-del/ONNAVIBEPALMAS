// CALCULADORA DE MEDIDAS - VERSÃO ORIGINAL
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const sizeResult = document.getElementById('sizeResult');
    const sizeDetails = document.getElementById('sizeDetails');
    const recommendation = document.getElementById('recommendation');
    
    calculateBtn.addEventListener('click', calculateSize);
    
    // Adicionar evento Enter nos inputs
    document.querySelectorAll('.measure-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateSize();
            }
        });
    });
    
    // Função principal de cálculo
    function calculateSize() {
        // Pegar valores
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const altura = parseFloat(document.getElementById('altura').value);
        const peso = parseFloat(document.getElementById('peso').value);
        const cintura = parseFloat(document.getElementById('cintura').value);
        const braco = parseFloat(document.getElementById('braco').value);
        
        // Validar
        if (!validateInputs(nome, email, telefone, altura, peso, cintura, braco)) {
            return;
        }
        
        // Mostrar loading
        showLoading(true);
        
        // Simular processamento
        setTimeout(() => {
            const result = calculateClothingSize(altura, peso, cintura, braco, nome);
            displayResult(result);
            showLoading(false);
            
            // Mudar texto do botão
            calculateBtn.innerHTML = 'CALCULAR NOVAMENTE';
            
            // Salvar dados localmente
            saveUserData(nome, email, telefone, altura, peso, cintura, braco, result.size);
        }, 1000);
    }
    
    // Função de validação
    function validateInputs(nome, email, telefone, altura, peso, cintura, braco) {
        const errors = [];
        
        if (!nome || nome.length < 3) {
            errors.push('Nome completo é obrigatório (mínimo 3 caracteres)');
        }
        
        if (!email || !email.includes('@') || !email.includes('.')) {
            errors.push('E-mail válido é obrigatório');
        }
        
        if (!telefone || telefone.length < 10) {
            errors.push('Telefone válido é obrigatório (mínimo 10 dígitos)');
        }
        
        if (!altura || altura < 100 || altura > 220) {
            errors.push('Altura deve ser entre 100cm e 220cm');
        }
        
        if (!peso || peso < 30 || peso > 150) {
            errors.push('Peso deve ser entre 30kg e 150kg');
        }
        
        if (!cintura || cintura < 50 || cintura > 120) {
            errors.push('Cintura deve ser entre 50cm e 120cm');
        }
        
        if (!braco || braco < 15 || braco > 50) {
            errors.push('Braço deve ser entre 15cm e 50cm');
        }
        
        if (errors.length > 0) {
            alert('Por favor, corrija os seguintes erros:\n\n' + errors.join('\n'));
            return false;
        }
        
        return true;
    }
    
    // Função de cálculo do tamanho (ALGORITMO ORIGINAL)
    function calculateClothingSize(altura, peso, cintura, braco, nome) {
        // Calcular IMC
        const alturaInMeters = altura / 100;
        const imc = peso / (alturaInMeters * alturaInMeters);
        
        // Sistema de pontuação ORIGINAL
        let score = 0;
        
        // Cintura (40%) - MEDIDA MAIS IMPORTANTE
        if (cintura <= 65) score += 40;
        else if (cintura <= 75) score += 30;
        else if (cintura <= 85) score += 20;
        else if (cintura <= 95) score += 10;
        else score += 0;
        
        // Braço (30%)
        if (braco <= 26) score += 30;
        else if (braco <= 30) score += 25;
        else if (braco <= 34) score += 15;
        else if (braco <= 38) score += 10;
        else score += 5;
        
        // IMC (20%)
        if (imc < 18.5) score += 20;      // Abaixo do peso
        else if (imc < 25) score += 15;   // Normal
        else if (imc < 30) score += 10;   // Sobrepeso
        else score += 5;                  // Obesidade
        
        // Altura (10%)
        if (altura <= 160) score += 10;
        else if (altura <= 170) score += 8;
        else if (altura <= 180) score += 6;
        else score += 4;
        
        // Determinar tamanho baseado na pontuação
        let size, details, rec;
        
        if (score >= 85) {
            size = 'P';
            details = 'Perfil mais delicado e alongado';
            rec = `Olá ${nome}! Com ${altura}cm e IMC de ${imc.toFixed(1)}, o tamanho P oferece ajuste perfeito para seu biotipo. Ideal para atividades de alta intensidade.`;
        } else if (score >= 70) {
            size = 'M';
            details = 'Proporções equilibradas e harmoniosas';
            rec = `${nome}, com IMC de ${imc.toFixed(1)} e medidas proporcionais, o tamanho M proporciona conforto e liberdade de movimento. Perfeito para seu tipo de corpo.`;
        } else if (score >= 55) {
            size = 'G';
            details = 'Estrutura atlética e definida';
            rec = `${nome}, seu IMC de ${imc.toFixed(1)} indica uma estrutura sólida. O G oferece amplitude nos ombros e quadris sem ficar largo na cintura. Excelente para musculação.`;
        } else if (score >= 40) {
            size = 'GG';
            details = 'Silhueta poderosa e volumosa';
            rec = `${nome}, com braço de ${braco}cm, nosso GG é desenvolvido para atletas como você. Oferece conforto total sem limitar os movimentos.`;
        } else {
            size = 'XG';
            details = 'Estrutura robusta e imponente';
            rec = `${nome}, o XG proporciona máximo conforto e mobilidade para suas medidas. Ideal para treinos pesados e alta performance.`;
        }
        
        return {
            size: size,
            details: details,
            recommendation: rec,
            imc: imc.toFixed(1),
            score: score
        };
    }
    
    // Mostrar resultado
    function displayResult(result) {
        sizeResult.textContent = result.size;
        sizeDetails.textContent = result.details;
        recommendation.textContent = result.recommendation;
        
        // Mostrar container com animação
        resultContainer.style.display = 'block';
        
        // Rolar suavemente para o resultado
        resultContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    // Mostrar/ocultar loading
    function showLoading(show) {
        if (show) {
            calculateBtn.innerHTML = '<div class="loading"></div> CALCULANDO...';
            calculateBtn.disabled = true;
        } else {
            calculateBtn.disabled = false;
        }
    }
    
    // Salvar dados do usuário
    function saveUserData(nome, email, telefone, altura, peso, cintura, braco, tamanho) {
        const userData = {
            nome: nome,
            email: email,
            telefone: telefone,
            altura: altura,
            peso: peso,
            cintura: cintura,
            braco: braco,
            tamanho: tamanho,
            data: new Date().toLocaleString('pt-BR')
        };
        
        // Salvar no localStorage
        localStorage.setItem('onnaVibeUltimoCalculo', JSON.stringify(userData));
        
        // Aqui você poderia enviar para um backend também
        console.log('Dados salvos:', userData);
        
        // Opcional: Mostrar mensagem de sucesso
        alert('Seu tamanho foi salvo! Você receberá ofertas especiais por e-mail.');
    }
    
    // Carregar dados salvos se existirem
    function loadSavedData() {
        const saved = localStorage.getItem('onnaVibeUltimoCalculo');
        if (saved) {
            const data = JSON.parse(saved);
            
            // Preencher campos com dados salvos
            document.getElementById('nome').value = data.nome || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('telefone').value = data.telefone || '';
            document.getElementById('altura').value = data.altura || '';
            document.getElementById('peso').value = data.peso || '';
            document.getElementById('cintura').value = data.cintura || '';
            document.getElementById('braco').value = data.braco || '';
        }
    }
    
    // Carregar dados ao iniciar
    loadSavedData();
});

// Carregar dados salvos quando a página abrir
window.onload = loadSavedData;
// modificação nova: 
