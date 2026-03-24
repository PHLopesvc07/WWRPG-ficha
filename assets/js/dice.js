/**
 * DICE.JS - MINISTÉRIO DA MAGIA
 * Motor de Rolagem de Múltiplos Dados e Registro Oficial (Log)
 */

export function setupDiceRoller() {
    const rollBtn = document.getElementById('btn-roll');
    const clearLogBtn = document.getElementById('btn-clear-log');
    const addDiceBtn = document.getElementById('btn-add-dice');
    const groupsContainer = document.getElementById('dice-groups-container');

    // Lógica para adicionar até 2 tipos de dados adicionais
    if (addDiceBtn) {
        addDiceBtn.addEventListener('click', () => {
            const currentGroups = groupsContainer.querySelectorAll('.dice-group').length;
            
            // Limite do Ministério (1 Dado Primário + 2 Dados Extra = 3 no total)
            if (currentGroups >= 3) {
                alert("Aviso do Departamento de Mistérios: O limite máximo para rolagens combinadas é de 3 tipos de dados.");
                return;
            }
            
            const newGroup = document.createElement('div');
            newGroup.className = 'dice-group extra-dice';
            newGroup.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px; animation: fadeInForm 0.3s ease;';
            
            newGroup.innerHTML = `
                <span style="font-size: 1.2em; color: var(--ink); font-weight: bold;">+</span>
                <input type="number" class="ink-input short-input dice-qty" value="1" min="1" max="20" style="width: 45px; text-align: center;">
                <span style="font-family: var(--font-serif); font-weight: bold;">d</span>
                <select class="ink-select dice-type" style="flex: 1;">
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
                <button class="delete-btn remove-dice" style="position: relative; top: 0; right: 0; margin: 0; width: 22px; height: 22px; font-size: 0.7rem; box-shadow: none;" title="Remover Dado">X</button>
            `;
            
            // Ouvinte para remover o dado extra
            newGroup.querySelector('.remove-dice').addEventListener('click', () => {
                newGroup.remove();
                addDiceBtn.disabled = false;
                addDiceBtn.style.opacity = '1';
            });
            
            groupsContainer.appendChild(newGroup);
            
            // Se atingiu o limite de 3 dados (1 principal + 2 extras), desabilita visualmente o botão
            if (currentGroups + 1 >= 3) {
                addDiceBtn.disabled = true;
                addDiceBtn.style.opacity = '0.5';
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

            // [SEGURANÇA BUROCRÁTICA] Limpa dados extras para evitar que um dado de dano antigo suje a rolagem de atributo
            document.querySelectorAll('.extra-dice').forEach(el => el.remove());
            if (addDiceBtn) {
                addDiceBtn.disabled = false;
                addDiceBtn.style.opacity = '1';
            }

            // Prepara a mesa primária para a rolagem padrão de sistema (1d20)
            const primaryQty = document.querySelector('.primary-dice .dice-qty');
            const primaryType = document.querySelector('.primary-dice .dice-type');
            
            if (primaryQty) primaryQty.value = 1;
            if (primaryType) primaryType.value = "20";

            const diceMod = document.getElementById('dice-mod');
            if (diceMod) diceMod.value = modifier;
            
            const normalAdvRadio = document.querySelector('input[name="adv-disadv"][value="normal"]');
            if (normalAdvRadio) normalAdvRadio.checked = true;

            executeRoll(rollTitle);
        }
    });
}

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
        
        const qty = Math.min(parseInt(qtyInput ? qtyInput.value : 1) || 1, 20); // Limite 20 dados por grupo para não travar o browser
        const sides = parseInt(typeInput ? typeInput.value : 20) || 20;
        
        let groupResults = [];
        
        for(let i=0; i < qty; i++) {
            let roll1 = Math.floor(Math.random() * sides) + 1;
            let finalRoll = roll1;
            let rollStr = `${roll1}`;

            // Aplica Vantagem/Desvantagem APENAS ao Dado Primário (Index 0)
            if (index === 0 && advState !== 'normal') {
                let roll2 = Math.floor(Math.random() * sides) + 1;
                if (advState === 'adv') {
                    finalRoll = Math.max(roll1, roll2);
                    rollStr = `<span style="color:var(--muted-teal)">[${roll1}, ${roll2}]</span> ➔ ${finalRoll}`;
                } else {
                    finalRoll = Math.min(roll1, roll2);
                    rollStr = `<span style="color:var(--stamp-red)">[${roll1}, ${roll2}]</span> ➔ ${finalRoll}`;
                }
            }
            
            groupResults.push({ final: finalRoll, str: rollStr });
        }
        
        const groupTotal = groupResults.reduce((acc, curr) => acc + curr.final, 0);
        grandTotal += groupTotal;
        
        const groupStr = groupResults.map(r => r.str).join(' + ');
        // Encapsula em parênteses se rolou mais de um dado naquele grupo para organização visual no Log
        allRollTexts.push(qty > 1 ? `(${groupStr})` : groupStr);
        rollExpressions.push(`${qty}d${sides}`);
    });
    
    // Aplica o modificador final ao Grande Total
    grandTotal += mod;
    
    // Tratamento de formatação visual do Registo (Log)
    const modText = mod !== 0 ? (mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`) : '';
    const title = customTitle || `${rollExpressions.join(' + ')}${modText !== '' ? ` (${modText})` : ''}`;
    const resultText = allRollTexts.join(' <span style="font-weight:bold; color:var(--ink);">+</span> ');

    const li = document.createElement('li');
    li.innerHTML = `<strong>${title}:</strong><br><span style="font-size:0.9em; opacity:0.9;">${resultText}${modText}</span> = <strong style="color:var(--stamp-red); font-size: 1.2em; margin-left:5px;">${grandTotal}</strong>`;
    
    log.prepend(li);
}