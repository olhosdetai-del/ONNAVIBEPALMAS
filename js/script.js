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
});

function calculateSize() {
    // elementos
    const height = document.getElementById('height');
    const weight = document.getElementById('weight');
    const waist = document.getElementById('waist');
    const arm = document.getElementById('arm');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // valores
    const heightValue = parseFloat(height.value);
    const weightValue = parseFloat(weight.value);
    const waistValue = parseFloat(waist.value);
    const armValue = parseFloat(arm.value);
    
    // Validar campos
    if (!validateInputs(heightValue, weightValue, waistValue, armValue)) {
        return;
    }
    
    // Mostrar loading
    showLoading(true);
    
    // Simular processamento (para dar feedback visual)
    setTimeout(() => {
        // Calcular tamanho
        const result = calculateClothingSize(heightValue, weightValue, waistValue, armValue);
        
        // Mostrar resultado
        displayResult(result);
        
        // Esconder loading
        showLoading(false);
    }, 800);
}

function validateInputs(height, weight, waist, arm) {
    const errors = [];
    
    if (!height || height < 100 || height > 220) {
        errors.push('Altura deve ser entre 100cm e 220cm');
    }
    
    if (!weight || weight < 30 || weight > 150) {
        errors.push('Peso deve ser entre 30kg e 150kg');
    }
    
    if (!waist || waist < 50 || waist > 120) {
        errors.push('Cintura deve ser entre 50cm e 120cm');
    }
    
    if (!arm || arm < 15 || arm > 50) {
        errors.push('Braço deve ser entre 15cm e 50cm');
    }
    
    if (errors.length > 0) {
        alert('Por favor, corrija os seguintes erros:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

function calculateClothingSize(height, weight, waist, arm) {
    // Calcular IMC para referência
    const heightInMeters = height / 100;
    const imc = weight / (heightInMeters * heightInMeters);
    
    // Pontuação baseada nas medidas (algoritmo personalizado)
    let score = 0;
    
    // Cintura tem maior peso (40%)
    if (waist <= 65) score += 40;
    else if (waist <= 75) score += 30;
    else if (waist <= 85) score += 20;
    else if (waist <= 95) score += 10;
    else score += 0;
    
    // Braço (30%)
    if (arm <= 26) score += 30;
    else if (arm <= 30) score += 25;
    else if (arm <= 34) score += 15;
    else if (arm <= 38) score += 10;
    else score += 5;
    
    // IMC (20%)
    if (imc < 18.5) score += 20;      // Abaixo do peso
    else if (imc < 25) score += 15;   // Normal
    else if (imc < 30) score += 10;   // Sobrepeso
    else score += 5;                  // Obesidade
    
    // Altura (10%)
    if (height <= 160) score += 10;
    else if (height <= 170) score += 8;
    else if (height <= 180) score += 6;
    else score += 4;
    
    // Determinar tamanho baseado na pontuação
    let size, details, recommendation;
    
    if (score >= 85) {
        size = 'P';
        details = 'Perfil mais delicado e alongado';
        recommendation = 'Nossas peças P oferecem ajuste perfeito para seu biotipo. Ideal para atividades de alta intensidade.';
    } else if (score >= 70) {
        size = 'M';
        details = 'Proporções equilibradas e harmoniosas';
        recommendation = 'O tamanho M proporciona conforto e liberdade de movimento. Perfeito para seu tipo de corpo.';
    } else if (score >= 55) {
        size = 'G';
        details = 'Estrutura atlética e definida';
        recommendation = 'O G oferece amplitude nos ombros e quadris sem ficar largo na cintura. Excelente para musculação.';
    } else if (score >= 40) {
        size = 'GG';
        details = 'Silhueta poderosa e volumosa';
        recommendation = 'Nosso GG Oferece conforto total sem limitar os movimentos.';
    } else {
        size = 'XG';
        details = 'Estrutura robusta e imponente';
        recommendation = 'O XG proporciona máximo conforto e mobilidade. Ideal para treinos pesados e alta performance.';
    }
    
    return {
        size: size,
        details: details,
        recommendation: recommendation,
        score: score,
        imc: imc.toFixed(1)
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
        calculateBtn.innerHTML = 'DESCUBRA SEU TAMANHO';
        calculateBtn.disabled = false;
    }
}

// Função para resetar o formulário (extra)
function resetForm() {
    document.getElementById('height').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('waist').value = '';
    document.getElementById('arm').value = '';
    document.getElementById('result').style.display = 'none';
}