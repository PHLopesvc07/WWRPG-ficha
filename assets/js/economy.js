/**
 * ECONOMY.JS - MINISTÉRIO DA MAGIA
 * Gestão do Cofre Principal e Balcão de Câmbio de Gringotes
 */

/**
 * Inicializa os sistemas de soma, subtração e padronização do cofre do utilizador.
 * Implementa a lógica complexa de "Empréstimo em Cascata" do sistema monetário bruxo.
 */
export function setupEconomy() {
    // ========================================================================
    // FUNÇÕES AUXILIARES (Helpers)
    // ========================================================================
    const getCoins = () => ({
        g: parseInt(document.getElementById('coin-g')?.value) || 0,
        s: parseInt(document.getElementById('coin-s')?.value) || 0,
        k: parseInt(document.getElementById('coin-k')?.value) || 0
    });
    
    const setCoins = (g, s, k) => {
        const elG = document.getElementById('coin-g');
        const elS = document.getElementById('coin-s');
        const elK = document.getElementById('coin-k');
        
        if (elG) elG.value = g;
        if (elS) elS.value = s;
        if (elK) elK.value = k;
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

    // ========================================================================
    // EVENTOS DE BOTÕES E LÓGICA DE NEGÓCIO
    // ========================================================================
    const btnConvert = document.getElementById('btn-convert-coins');
    const btnAdd = document.getElementById('btn-add-coin');
    const btnSub = document.getElementById('btn-sub-coin');

    // Botão: Converter Tudo p/ Padrão (Transforma excessos na maior moeda possível)
    if (btnConvert) {
        btnConvert.addEventListener('click', () => {
            const c = getCoins();
            const total = toKnuts(c.g, c.s, c.k);
            const std = toStandard(total);
            setCoins(std.g, std.s, std.k);
        });
    }

    // Botão: Somar Moedas
    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            const calcInput = document.getElementById('calc-amount');
            const calcType = document.getElementById('calc-type');
            if (!calcInput || !calcType) return;

            const amount = parseInt(calcInput.value) || 0;
            if (amount <= 0) return;
            
            const type = calcType.value;
            const current = getCoins();
            
            if (type === 'g') current.g += amount;
            if (type === 's') current.s += amount;
            if (type === 'k') current.k += amount;
            
            setCoins(current.g, current.s, current.k);
            calcInput.value = '';
        });
    }

    // Botão: Subtrair Moedas (Empréstimo em Cascata e Trava de Segurança)
    if (btnSub) {
        btnSub.addEventListener('click', () => {
            const calcInput = document.getElementById('calc-amount');
            const calcType = document.getElementById('calc-type');
            if (!calcInput || !calcType) return;

            const amount = parseInt(calcInput.value) || 0;
            if (amount <= 0) return;
            
            const type = calcType.value;
            let { g, s, k } = getCoins();
            let success = true;

            if (type === 'k') {
                if (k >= amount) {
                    k -= amount;
                } else {
                    let deficit = amount - k;
                    let s_needed = Math.ceil(deficit / 29); 
                    
                    if (s >= s_needed) {
                        s -= s_needed;
                        k = (k + s_needed * 29) - amount;
                    } else {
                        let s_deficit = s_needed - s;
                        let g_needed = Math.ceil(s_deficit / 17); 
                        
                        if (g >= g_needed) {
                            g -= g_needed;
                            s = (s + g_needed * 17) - s_needed;
                            k = (k + s_needed * 29) - amount;
                        } else {
                            success = false; 
                        }
                    }
                }
            } else if (type === 's') {
                if (s >= amount) {
                    s -= amount;
                } else {
                    let deficit = amount - s;
                    let g_needed = Math.ceil(deficit / 17);
                    
                    if (g >= g_needed) {
                        g -= g_needed;
                        s = (s + g_needed * 17) - amount;
                    } else {
                        success = false; 
                    }
                }
            } else if (type === 'g') {
                if (g >= amount) {
                    g -= amount;
                } else {
                    success = false; 
                }
            }

            if (success) {
                setCoins(g, s, k);
                calcInput.value = '';
            } else {
                alert('Aviso de Gringotes: O seu dinheiro é insuficiente para realizar esta transação!');
            }
        });
    }
}

/**
 * Inicializa o Balcão de Câmbio de Gringotes, permitindo quebrar moedas maiores
 * em moedas menores com feedback visual instantâneo.
 */
export function setupGringottsExchange() {
    const gVal = document.getElementById('exc-g-val');
    const sRes = document.getElementById('exc-s-res');
    const sVal = document.getElementById('exc-s-val');
    const kRes = document.getElementById('exc-k-res');

    // Atualização visual em tempo real (Galeões -> Sicles)
    if (gVal && sRes) {
        gVal.addEventListener('input', () => {
            const val = parseInt(gVal.value) || 0;
            sRes.value = val * 17;
        });
    }

    // Atualização visual em tempo real (Sicles -> Nuques)
    if (sVal && kRes) {
        sVal.addEventListener('input', () => {
            const val = parseInt(sVal.value) || 0;
            kRes.value = val * 29;
        });
    }

    const btnExcGS = document.getElementById('btn-exc-gs');
    const btnExcSK = document.getElementById('btn-exc-sk');

    // Lógica: Quebrar Galeões em Sicles
    if (btnExcGS && gVal && sRes) {
        btnExcGS.addEventListener('click', () => {
            const costG = parseInt(gVal.value) || 0;
            const gainS = costG * 17;
            
            const coinGEl = document.getElementById('coin-g');
            const coinSEl = document.getElementById('coin-s');
            
            if (!coinGEl || !coinSEl) return;

            const currentG = parseInt(coinGEl.value) || 0;
            const currentS = parseInt(coinSEl.value) || 0;

            if (currentG >= costG && costG > 0) {
                coinGEl.value = currentG - costG;
                coinSEl.value = currentS + gainS;
                gVal.value = 1; 
                sRes.value = 17;
            } else {
                alert('Aviso de Gringotes: Não tem Galeões suficientes no cofre!');
            }
        });
    }

    // Lógica: Quebrar Sicles em Nuques
    if (btnExcSK && sVal && kRes) {
        btnExcSK.addEventListener('click', () => {
            const costS = parseInt(sVal.value) || 0;
            const gainK = costS * 29;
            
            const coinSEl = document.getElementById('coin-s');
            const coinKEl = document.getElementById('coin-k');

            if (!coinSEl || !coinKEl) return;

            const currentS = parseInt(coinSEl.value) || 0;
            const currentK = parseInt(coinKEl.value) || 0;

            if (currentS >= costS && costS > 0) {
                coinSEl.value = currentS - costS;
                coinKEl.value = currentK + gainK;
                sVal.value = 1; 
                kRes.value = 29;
            } else {
                alert('Aviso de Gringotes: Não tem Sicles suficientes no cofre!');
            }
        });
    }
}