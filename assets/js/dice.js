/**
 * DICE.JS - MINISTÉRIO DA MAGIA
 * Motor de Rolagem de Múltiplos Dados e Registro Oficial (Log)
 */

/**
 * Inicializa a mesa de rolagens, configurando os eventos para adição de dados,
 * limpeza do histórico e rolagens rápidas (1-click) a partir da ficha.
 */
export function setupDiceRoller() {
    const rollBtn = document.getElementById('btn-roll');
    const clearLogBtn = document.getElementById('btn-clear-log');
    const addDiceBtn = document.getElementById('btn-add-dice');
    const groupsContainer = document.getElementById('dice-groups-container');

    // Lógica para adicionar até 2 tipos de dados adicionais
    if (addDiceBtn && groupsContainer) {
        addDiceBtn.addEventListener('click', () => {
            const currentGroups = groupsContainer.querySelectorAll('.dice-group').length;
            
            // Limite do Ministério (1 Dado Primário + 2 Dados Extra = 3 no total)
            if (currentGroups >= 3) {
                alert("Aviso do Departamento de Mistérios: O limite máximo para rolagens combinadas é de 3 tipos de dados.");
                return;
            }
            
            const newGroup = document.createElement('div');
            // SRP: Estilos inline removidos. Utilização de classes CSS.
            newGroup.className = 'dice-group extra-dice dice-group-flex animated-fade-in';
            
            newGroup.innerHTML = `
                <span class="dice-plus-sign">+</span>
                <input type="number" class="ink-input short-input dice-qty dice-text-center" value="1" min="1" max="20" aria-label="Quantidade de Dados Extras">
                <span class="dice-d-label">d</span>
                <select class="ink-select dice-type flex-1" aria-label="Tipo de Dado Extra">
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6" selected>6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <button class="delete-btn btn-remove-dice" aria-label="Remover Dado Extra" title="Remover Dado">X</button>
            `;
            
            // Ouvinte para remover o dado extra
            const removeBtn = newGroup.querySelector('.remove-dice');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    newGroup.remove();
                    addDiceBtn.disabled = false;
                });
            }
            
            groupsContainer.appendChild(newGroup);
            
            // Se atingiu o limite de 3 dados, desativa o botão (o visual é tratado pelo CSS :disabled)
            if (currentGroups + 1 >= 3) {
                addDiceBtn.disabled = true;
            }
        });
    }

    // Rola pela interface lateral
    if (rollBtn) {
        rollBtn.addEventListener('click', () => executeRoll());
    }

    // Limpa o histórico de rolagens
    if (clearLogBtn) {
        clearLogBtn.addEventListener('click', () => {
            const log = document.getElementById('dice-log');
            if (log) log.innerHTML = '';
        });
    }

    // "1-Click Roll" - Delegação de eventos para Status e Perícias
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('rollable')) {
            const isStat = e.target.classList.contains('stat-roll');
            const statName = e.target.dataset.stat;
            const statInput = document.getElementById(`stat-${statName}`);
            const statValue = statInput ? (parseInt(statInput.value) || 0) : 0;
            
            let modifier = statValue;
            let rollTitle = isStat ? `Status: ${e.target.textContent}` : `Perícia: ${e.target.textContent}`;

            // Se for perícia, soma o bónus de proficiência
            if (!isStat) {
                const skillName = e.target.dataset.skill;
                const profSelect = document.querySelector(`.skill-prof[data-skill="${skillName}"]`);
                const profValue = profSelect ? parseInt(profSelect.value) || 0 : 0;
                modifier += profValue;
            }

            // [SEGURANÇA BUROCRÁTICA] Limpa dados extras para evitar contaminação da rolagem
            document.querySelectorAll('.extra-dice').forEach(el => el.remove());
            if (addDiceBtn) {
                addDiceBtn.disabled = false;
            }

            const diceMod = document.getElementById('dice-mod');
            if (diceMod) diceMod.value = modifier;
            
            const normalAdvRadio = document.querySelector('input[name="adv-disadv"][value="normal"]');
            if (normalAdvRadio) normalAdvRadio.checked = true;

            executeRoll(rollTitle);
        }
    });
}

/**
 * Executa o cálculo matemático, processa vantagens/desvantagens 
 * e injeta o resultado formatado no Registo Oficial (Log).
 * * @param {string|null} customTitle - Título opcional para a rolagem (ex: "Status: Corpo").
 */
function executeRoll(customTitle = null) {
    const groups = document.querySelectorAll('.dice-group');
    if (groups.length === 0) return;

    const diceModInput = document.getElementById('dice-mod');
    const mod = diceModInput ? (parseInt(diceModInput.value) || 0) : 0;
    
    const advStateRadio = document.querySelector('input[name="adv-disadv"]:checked');
    const advState = advStateRadio ? advStateRadio.value : 'normal';
    
    const log = document.getElementById('dice-log');
    if (!log) return;

    let grandTotal = 0;
    let rollExpressions = [];
    let allRollTexts = [];

    // Itera sobre todos os grupos de dados montados na mesa
    groups.forEach((group, index) => {
        const qtyInput = group.querySelector('.dice-qty');
        const typeInput = group.querySelector('.dice-type');
        
        // Limite 20 dados por grupo para não travar o browser (Eficiência de Desempenho)
        const qty = Math.min(parseInt(qtyInput ? qtyInput.value : 1) || 1, 20); 
        const sides = parseInt(typeInput ? typeInput.value : 20) || 20;
        
        let groupResults = [];
        
        for(let i = 0; i < qty; i++) {
            let roll1 = Math.floor(Math.random() * sides) + 1;
            let finalRoll = roll1;
            let rollStr = `${roll1}`;

            // Aplica Vantagem/Desvantagem APENAS ao Dado Primário (Index 0)
            if (index === 0 && advState !== 'normal') {
                let roll2 = Math.floor(Math.random() * sides) + 1;
                if (advState === 'adv') {
                    finalRoll = Math.max(roll1, roll2);
                    rollStr = `<span class="text-teal">[${roll1}, ${roll2}]</span> ➔ ${finalRoll}`;
                } else {
                    finalRoll = Math.min(roll1, roll2);
                    rollStr = `<span class="text-red">[${roll1}, ${roll2}]</span> ➔ ${finalRoll}`;
                }
            }
            
            groupResults.push({ final: finalRoll, str: rollStr });
        }
        
        const groupTotal = groupResults.reduce((acc, curr) => acc + curr.final, 0);
        grandTotal += groupTotal;
        
        const groupStr = groupResults.map(r => r.str).join(' + ');
        // Encapsula em parênteses se rolou mais de um dado para organização visual
        allRollTexts.push(qty > 1 ? `(${groupStr})` : groupStr);
        rollExpressions.push(`${qty}d${sides}`);
    });
    
    // Aplica o modificador final ao Grande Total
    grandTotal += mod;
    
    // Tratamento de formatação visual do Registo (Log) usando classes CSS
    const modText = mod !== 0 ? (mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`) : '';
    const title = customTitle || `${rollExpressions.join(' + ')}${modText !== '' ? ` (${modText})` : ''}`;
    const resultText = allRollTexts.join(' <span class="text-ink-bold">+</span> ');

    const li = document.createElement('li');
    li.innerHTML = `<strong>${title}:</strong><br><span class="log-entry-details">${resultText}${modText}</span> = <strong class="dice-grand-total">${grandTotal}</strong>`;
    
    log.prepend(li);
}