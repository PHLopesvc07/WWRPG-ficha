/**
 * DICE.JS - MINISTÉRIO DA MAGIA
 * Motor de Rolagem de Dados e Registro Oficial (Log)
 */

export function setupDiceRoller() {
    const typeSelect = document.getElementById('dice-type');
    const customInput = document.getElementById('dice-custom');
    const rollBtn = document.getElementById('btn-roll');
    const clearLogBtn = document.getElementById('btn-clear-log');

    // Mostra/esconde input de dado personalizado
    typeSelect.addEventListener('change', () => {
        customInput.style.display = typeSelect.value === 'custom' ? 'block' : 'none';
    });

    // Rola pela interface lateral
    rollBtn.addEventListener('click', () => executeRoll());

    // Limpa o histórico de rolagens
    clearLogBtn.addEventListener('click', () => {
        const log = document.getElementById('dice-log');
        log.innerHTML = '';
    });

    // "1-Click Roll" - Delegação de eventos para Status e Perícias
    // Como as perícias são geradas dinamicamente, colocamos o listener no document
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('rollable')) {
            const isStat = e.target.classList.contains('stat-roll');
            const statName = e.target.dataset.stat;
            const statValue = parseInt(document.getElementById(`stat-${statName}`).value) || 0;
            
            let modifier = statValue;
            let rollTitle = isStat ? `Status: ${e.target.textContent}` : `Perícia: ${e.target.textContent}`;

            // Se for perícia, soma o bônus de proficiência
            if (!isStat) {
                const skillName = e.target.dataset.skill;
                const profSelect = document.querySelector(`.skill-prof[data-skill="${skillName}"]`);
                const profValue = parseInt(profSelect.value) || 0;
                modifier += profValue;
            }

            // Preenche os campos do painel lateral para refletir a rolagem
            document.getElementById('dice-qty').value = 1;
            document.getElementById('dice-type').value = "20";
            document.getElementById('dice-mod').value = modifier;
            document.getElementById('dice-custom').style.display = 'none';
            document.querySelector('input[name="adv-disadv"][value="normal"]').checked = true;

            executeRoll(rollTitle);
        }
    });
}

function executeRoll(customTitle = null) {
    const qty = Math.min(parseInt(document.getElementById('dice-qty').value) || 1, 20); // Limite de 20 dados
    const typeVal = document.getElementById('dice-type').value;
    const sides = typeVal === 'custom' ? (parseInt(document.getElementById('dice-custom').value) || 20) : parseInt(typeVal);
    const mod = parseInt(document.getElementById('dice-mod').value) || 0;
    const advState = document.querySelector('input[name="adv-disadv"]:checked').value;
    const log = document.getElementById('dice-log');

    let results = [];
    for(let i=0; i < qty; i++) {
        let roll1 = Math.floor(Math.random() * sides) + 1;
        let finalRoll = roll1;
        let rollStr = `${roll1}`;

        if (advState !== 'normal') {
            let roll2 = Math.floor(Math.random() * sides) + 1;
            if (advState === 'adv') {
                finalRoll = Math.max(roll1, roll2);
                rollStr = `<span style="color:var(--muted-teal)">[${roll1}, ${roll2}]</span> -> ${finalRoll}`;
            } else {
                finalRoll = Math.min(roll1, roll2);
                rollStr = `<span style="color:var(--stamp-red)">[${roll1}, ${roll2}]</span> -> ${finalRoll}`;
            }
        }
        results.push({ final: finalRoll, str: rollStr });
    }
    
    const total = results.reduce((acc, curr) => acc + curr.final, 0) + mod;
    const resultText = results.map(r => r.str).join(' + ');
    const modText = mod !== 0 ? (mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`) : '';
    
    const title = customTitle || `${qty}d${sides}${modText !== '' ? ` (${modText})` : ''}`;
    
    const li = document.createElement('li');
    li.innerHTML = `<strong>${title}:</strong> ${resultText}${modText} = <strong style="color:var(--stamp-red); font-size: 1.1em;">${total}</strong>`;
    log.prepend(li);
}