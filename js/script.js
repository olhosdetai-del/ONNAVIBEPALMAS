// Esperar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const sizeResult = document.getElementById('sizeResult');
    const sizeDetails = document.getElementById('sizeDetails');
    const recommendation = document.getElementById('recommendation');
    
    // Adicionar evento de clique no botão
    calculateBtn.addEventListener('click', calculateSize);
    
    // Adicionar evento de Enter nos inputs
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateSize();
            }
        });
    });
    
    // MUDANÇA: Adicionar botão de reset (opcional)
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Limpar Formulário';
    resetBtn.className = 'reset-btn';
    resetBtn.style.cssText = 'width:100%; margin-top:15px; padding:10px; background:#980e0e; color:white; border:none; border-radius:8px; cursor:pointer;';
    resetBtn.onclick = resetForm;
    document.querySelector('.calculator-form').appendChild(resetBtn);
});

function calculateSize() {
    // Pegar elementos CORRETOS
    const altura = document.getElementById('altura');
    const peso = document.getElementById('peso');
    const cintura = document.getElementById('cintura');
    const braco = document.getElementById('braco');
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // Pegar valores
    const alturaValue = parseFloat(altura.value);
    const pesoValue = parseFloat(peso.value);
    const cinturaValue = parseFloat(cintura.value);
    const bracoValue = parseFloat(braco.value);
    const nomeValue = nome.value.trim();
    const emailValue = email.value.trim();
    const telefoneValue = telefone.value.trim();
    
    // Validar campos
    if (!validateInputs(alturaValue, pesoValue, cinturaValue, bracoValue, nomeValue, emailValue, telefoneValue)) {
        return;
    }
    
    // Mostrar loading
    showLoading(true);
    
    // Simular processamento
    setTimeout(() => {
        // Calcular tamanho usando o algoritmo de IMC
        const result = calculateClothingSize(alturaValue, pesoValue, cinturaValue, bracoValue, nomeValue);
        
        // Mostrar resultado
        displayResult(result);
        
        // Alterar texto do botão após o resultado
        calculateBtn.innerHTML = 'CALCULAR NOVAMENTE';
        
        // MUDANÇA: Salvar dados localmente (opcional)
        saveUserData(nomeValue, emailValue, telefoneValue, alturaValue, pesoValue, cinturaValue, bracoValue, result.size);
        
        // Esconder loading
        showLoading(false);
    }, 800);
}

function validateInputs(altura, peso, cintura, braco, nome, email, telefone) {
    const errors = [];
    
    if (!nome || nome.length < 3) {
        errors.push('Nome completo é obrigatório (mínimo 3 caracteres)');
    }
    
    if (!email || !email.includes('@') || !email.includes('.')) {
        errors.push('E-mail válido é obrigatório');
    }
    
    if (!telefone || telefone.length < 10) {
        errors.push('Telefone válido é obrigatório');
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

function calculateClothingSize(altura, peso, cintura, braco, nome) {
    // Calcular IMC para referência
    const alturaInMeters = altura / 100;
    const imc = peso / (alturaInMeters * alturaInMeters);
    
    // Pontuação baseada nas medidas (algoritmo personalizado) - MESMO DO SEU ANTERIOR
    let score = 0;
    
    // Cintura tem maior peso (40%) - PARA ROUPAS FITNESS
    if (cintura <= 65) score += 40;
    else if (cintura <= 75) score += 30;
    else if (cintura <= 85) score += 20;
    else if (cintura <= 95) score += 10;
    else score += 0;
    
    // Braço (30%) - IMPORTANTE PARA BLUSAS/CAMISETAS
    if (braco <= 26) score += 30;
    else if (braco <= 30) score += 25;
    else if (braco <= 34) score += 15;
    else if (braco <= 38) score += 10;
    else score += 5;
    
    // IMC (20%) - INDICADOR GERAL DE COMPOSIÇÃO
    if (imc < 18.5) score += 20;      // Abaixo do peso
    else if (imc < 25) score += 15;   // Normal
    else if (imc < 30) score += 10;   // Sobrepeso
    else score += 5;                  // Obesidade
    
    // Altura (10%) - AJUSTE DE COMPRIMENTO
    if (altura <= 160) score += 10;
    else if (altura <= 170) score += 8;
    else if (altura <= 180) score += 6;
    else score += 4;
    
    // Determinar tamanho baseado na pontuação - MESMA LÓGICA
    let size, details, recommendation;
    
    if (score >= 85) {
        size = 'P';
        details = 'Perfil mais delicado e alongado';
        recommendation = `Olá ${nome}! Com ${altura}cm e IMC de ${imc.toFixed(1)}, o tamanho P oferece ajuste perfeito para seu biotipo. Ideal para atividades de alta intensidade.`;
    } else if (score >= 70) {
        size = 'M';
        details = 'Proporções equilibradas e harmoniosas';
        recommendation = `${nome}, com IMC de ${imc.toFixed(1)} e medidas proporcionais, o tamanho M proporciona conforto e liberdade de movimento. Perfeito para seu tipo de corpo.`;
    } else if (score >= 55) {
        size = 'G';
        details = 'Estrutura atlética e definida';
        recommendation = `${nome}, seu IMC de ${imc.toFixed(1)} indica uma estrutura sólida. O G oferece amplitude nos ombros e quadris sem ficar largo na cintura. Excelente para musculação.`;
    } else if (score >= 40) {
        size = 'GG';
        details = 'Silhueta poderosa e volumosa';
        recommendation = `${nome}, com braço de ${braco}cm, nosso GG é desenvolvido para atletas como você. Oferece conforto total sem limitar os movimentos.`;
    } else {
        size = 'XG';
        details = 'Estrutura robusta e imponente';
        recommendation = `${nome}, o XG proporciona máximo conforto e mobilidade para suas medidas. Ideal para treinos pesados e alta performance.`;
    }
    
    // Adicionar dica extra baseada nas medidas específicas
    if (cintura < 70 && braco > 35) {
        recommendation += ' Sugerimos modelos com ajuste na cintura e amplos nos braços.';
    } else if (altura > 175) {
        recommendation += ' Recomendamos peças de comprimento longo para melhor ajuste.';
    }
    
    return {
        size: size,
        details: details,
        recommendation: recommendation,
        score: score,
        imc: imc.toFixed(1),
        nome: nome
    };
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    const sizeResult = document.getElementById('sizeResult');
    const sizeDetails = document.getElementById('sizeDetails');
    const recommendation = document.getElementById('recommendation');
    
    // Atualizar conteúdo
    sizeResult.textContent = result.size;
    sizeDetails.textContent = result.details;
    recommendation.textContent = result.recommendation;
    
    // Mostrar resultado com animação
    resultDiv.style.display = 'block';
    
    // Rolar suavemente até o resultado
    resultDiv.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

function showLoading(show) {
    const calculateBtn = document.getElementById('calculateBtn');
    
    if (show) {
        calculateBtn.innerHTML = '<div class="loading"></div> CALCULANDO...';
        calculateBtn.disabled = true;
    } else {
        calculateBtn.innerHTML = 'CALCULAR NOVAMENTE';
        calculateBtn.disabled = false;
    }
}

// Função para salvar dados localmente (opcional)
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
        data: new Date().toLocaleString()
    };
    
    // Salvar no localStorage (para demonstração)
    localStorage.setItem('onnaVibeUltimoCalculo', JSON.stringify(userData));
    
    // Poderia enviar para um backend aqui
    console.log('Dados salvos:', userData);
}

// Função para resetar o formulário
function resetForm() {
    document.getElementById('nome').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('altura').value = '';
    document.getElementById('peso').value = '';
    document.getElementById('cintura').value = '';
    document.getElementById('braco').value = '';
    document.getElementById('result').style.display = 'none';
    document.getElementById('calculateBtn').innerHTML = 'Veja sua indicação ONNA VIBE';
    
    // Foco no primeiro campo
    document.getElementById('nome').focus();
}

// MUDANÇA: Função para carregar dados salvos (se existirem)
function loadSavedData() {
    const saved = localStorage.getItem('onnaVibeUltimoCalculo');
    if (saved) {
        const data = JSON.parse(saved);
        if (confirm('Encontramos um cálculo anterior. Deseja carregar esses dados?')) {
            document.getElementById('nome').value = data.nome || '';
            document.getElementById('telefone').value = data.telefone || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('altura').value = data.altura || '';
            document.getElementById('peso').value = data.peso || '';
            document.getElementById('cintura').value = data.cintura || '';
            document.getElementById('braco').value = data.braco || '';
        }
    }
}

// Carregar dados salvos quando a página abrir
window.onload = loadSavedData;