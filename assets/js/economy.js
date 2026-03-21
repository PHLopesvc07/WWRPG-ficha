/**
 * ECONOMY.JS - MINISTÉRIO DA MAGIA
 * Gestão do Cofre Principal e Balcão de Câmbio de Gringotes
 */

export function setupEconomy() {
    // Funções auxiliares internas para pegar e setar moedas
    const getCoins = () => ({
        g: parseInt(document.getElementById('coin-g').value) || 0,
        s: parseInt(document.getElementById('coin-s').value) || 0,
        k: parseInt(document.getElementById('coin-k').value) || 0
    });
    
    const setCoins = (g, s, k) => {
        document.getElementById('coin-g').value = g;
        document.getElementById('coin-s').value = s;
        document.getElementById('coin-k').value = k;
    };

    // 1 Galeão = 17 Sicles | 1 Sicle = 29 Nuques | Logo, 1 Galeão = 493 Nuques
    const toKnuts = (g, s, k) => (g * 493) + (s * 29) + k;
    
    const toStandard = (totalKnuts) => {
        if(totalKnuts < 0) totalKnuts = 0;
        const g = Math.floor(totalKnuts / 493);
        let rem = totalKnuts % 493;
        const s = Math.floor(rem / 29);
        const k = rem % 29;
        return {g, s, k};
    };

    // Botão "Converter Tudo p/ Padrão"
    document.getElementById('btn-convert-coins').addEventListener('click', () => {
        const c = getCoins();
        const total = toKnuts(c.g, c.s, c.k);
        const std = toStandard(total);
        setCoins(std.g, std.s, std.k);
    });

    // LÓGICA CORRIGIDA E ISOLADA: Somar Moedas
    document.getElementById('btn-add-coin').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('calc-amount').value) || 0;
        if (amount <= 0) return; // Se estiver vazio ou for zero, não faz nada
        
        const type = document.getElementById('calc-type').value;
        const current = getCoins();
        
        if (type === 'g') current.g += amount;
        if (type === 's') current.s += amount;
        if (type === 'k') current.k += amount;
        
        setCoins(current.g, current.s, current.k);
        document.getElementById('calc-amount').value = ''; // Limpa o campo
    });

    // LÓGICA CORRIGIDA E ISOLADA: Subtrair Moedas
    document.getElementById('btn-sub-coin').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('calc-amount').value) || 0;
        if (amount <= 0) return; // Se estiver vazio ou for zero, não faz nada
        
        const type = document.getElementById('calc-type').value;
        const current = getCoins();
        
        // Math.max garante que o valor nunca fique negativo
        if (type === 'g') current.g = Math.max(0, current.g - amount);
        if (type === 's') current.s = Math.max(0, current.s - amount);
        if (type === 'k') current.k = Math.max(0, current.k - amount);
        
        setCoins(current.g, current.s, current.k);
        document.getElementById('calc-amount').value = ''; // Limpa o campo
    });
}

export function setupGringottsExchange() {
    const gVal = document.getElementById('exc-g-val');
    const sRes = document.getElementById('exc-s-res');
    const sVal = document.getElementById('exc-s-val');
    const kRes = document.getElementById('exc-k-res');

    // Atualização visual em tempo real
    gVal.addEventListener('input', () => {
        const val = parseInt(gVal.value) || 0;
        sRes.value = val * 17;
    });

    sVal.addEventListener('input', () => {
        const val = parseInt(sVal.value) || 0;
        kRes.value = val * 29;
    });

    // Lógica: Quebrar Galeões em Sicles
    document.getElementById('btn-exc-gs').addEventListener('click', () => {
        const costG = parseInt(gVal.value) || 0;
        const gainS = costG * 17;
        
        const currentG = parseInt(document.getElementById('coin-g').value) || 0;
        const currentS = parseInt(document.getElementById('coin-s').value) || 0;

        if (currentG >= costG && costG > 0) {
            document.getElementById('coin-g').value = currentG - costG;
            document.getElementById('coin-s').value = currentS + gainS;
            // Efeito visual rápido resetando os inputs
            gVal.value = 1; sRes.value = 17;
        } else {
            alert('Aviso de Gringotes: Você não tem Galeões suficientes no cofre!');
        }
    });

    // Lógica: Quebrar Sicles em Nuques
    document.getElementById('btn-exc-sk').addEventListener('click', () => {
        const costS = parseInt(sVal.value) || 0;
        const gainK = costS * 29;
        
        const currentS = parseInt(document.getElementById('coin-s').value) || 0;
        const currentK = parseInt(document.getElementById('coin-k').value) || 0;

        if (currentS >= costS && costS > 0) {
            document.getElementById('coin-s').value = currentS - costS;
            document.getElementById('coin-k').value = currentK + gainK;
            // Efeito visual rápido resetando os inputs
            sVal.value = 1; kRes.value = 29;
        } else {
            alert('Aviso de Gringotes: Você não tem Sicles suficientes no cofre!');
        }
    });
}
