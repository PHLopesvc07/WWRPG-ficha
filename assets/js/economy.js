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

    // LÓGICA CORRIGIDA: Somar Moedas
    document.getElementById('btn-add-coin').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('calc-amount').value) || 0;
        if (amount <= 0) return;
        
        const type = document.getElementById('calc-type').value;
        const current = getCoins();
        
        if (type === 'g') current.g += amount;
        if (type === 's') current.s += amount;
        if (type === 'k') current.k += amount;
        
        setCoins(current.g, current.s, current.k);
        document.getElementById('calc-amount').value = '';
    });

    // LÓGICA: Subtrair Moedas com "Empréstimo em Cascata" e Trava de Segurança
    document.getElementById('btn-sub-coin').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('calc-amount').value) || 0;
        if (amount <= 0) return;
        
        const type = document.getElementById('calc-type').value;
        let { g, s, k } = getCoins();
        let success = true;

        if (type === 'k') {
            if (k >= amount) {
                // Tem Nuques suficientes, apenas subtrai
                k -= amount;
            } else {
                // Faltam Nuques, precisa pedir emprestado aos Sicles
                let deficit = amount - k;
                let s_needed = Math.ceil(deficit / 29); // Quantos Sicles precisa quebrar?
                
                if (s >= s_needed) {
                    s -= s_needed;
                    k = (k + s_needed * 29) - amount;
                } else {
                    // Faltam Sicles, precisa pedir emprestado aos Galeões primeiro
                    let s_deficit = s_needed - s;
                    let g_needed = Math.ceil(s_deficit / 17); // Quantos Galeões precisa quebrar?
                    
                    if (g >= g_needed) {
                        g -= g_needed;
                        s = (s + g_needed * 17) - s_needed;
                        k = (k + s_needed * 29) - amount;
                    } else {
                        success = false; // Não tem dinheiro nenhum cobrindo
                    }
                }
            }
        } else if (type === 's') {
            if (s >= amount) {
                s -= amount;
            } else {
                // Faltam Sicles, precisa pedir emprestado aos Galeões
                let deficit = amount - s;
                let g_needed = Math.ceil(deficit / 17);
                
                if (g >= g_needed) {
                    g -= g_needed;
                    s = (s + g_needed * 17) - amount;
                } else {
                    success = false; // Não tem Galeões suficientes
                }
            }
        } else if (type === 'g') {
            if (g >= amount) {
                g -= amount;
            } else {
                success = false; // Galeão é o limite, se faltar aqui, não tem de onde tirar
            }
        }

        // Executa a transação ou barra a operação com um alerta
        if (success) {
            setCoins(g, s, k);
            document.getElementById('calc-amount').value = '';
        } else {
            alert('Aviso de Gringotes: O seu dinheiro é insuficiente para realizar esta transação!');
        }
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
            gVal.value = 1; sRes.value = 17;
        } else {
            alert('Aviso de Gringotes: Não tem Galeões suficientes no cofre!');
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
            sVal.value = 1; kRes.value = 29;
        } else {
            alert('Aviso de Gringotes: Não tem Sicles suficientes no cofre!');
        }
    });
}
