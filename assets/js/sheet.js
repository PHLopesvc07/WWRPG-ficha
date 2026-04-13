/**
 * SHEET.JS - MINISTÉRIO DA MAGIA
 * Lógica central da Ficha (Famílias, Perícias e Cálculos de Atributos)
 */

export function populateFamilies(database) {
    const select = document.getElementById('family-select');
    if (!select) return;

    select.innerHTML = '<option value="">Selecione uma Linhagem...</option>';

    for (const [nationality, families] of Object.entries(database.families)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = nationality;
        
        families.forEach(fam => {
            const option = document.createElement('option');
            option.value = JSON.stringify(fam);
            option.textContent = fam.name;
            optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
    }

    select.addEventListener('change', (e) => {
        const prejudiceInput = document.getElementById('prejudice');
        const influenceInput = document.getElementById('influence');
        if (e.target.value) {
            const famData = JSON.parse(e.target.value);
            prejudiceInput.value = famData.prejudice;
            influenceInput.value = famData.influence;
        } else {
            prejudiceInput.value = '';
            influenceInput.value = '';
        }
    });
}

export function populateSkills(database) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    container.innerHTML = ''; 

    const profOptions = database.proficiencyLevels.map(p => 
        `<option value="${p.value}" ${p.default ? 'selected' : ''}>${p.label}</option>`
    ).join('');

    // Cria a lista de perícias baseada no data.js
    for (const [stat, skills] of Object.entries(database.skills)) {
        skills.forEach(skillName => {
            const div = document.createElement('div');
            div.className = 'skill-item';
            
            div.innerHTML = `
                <div class="skill-label-group">
                    <span class="rollable skill-roll" data-stat="${stat}" data-skill="${skillName}">${skillName}</span> 
                    <span class="skill-total skill-total-val" data-skill="${skillName}">(+0)</span>
                </div>
                <select class="ink-select short-input skill-prof" data-skill="${skillName}" aria-label="Nível de Proficiência em ${skillName}">
                    ${profOptions}
                </select>
            `;
            container.appendChild(div);
            
            // Recalcula quando a proficiência muda
            const selectElement = div.querySelector('.skill-prof');
            selectElement.addEventListener('change', updateSkillBonuses);
        });
    }

    // NOVA FUNÇÃO: Garante que alterar o atributo base também recalcule as perícias
    setupStatListeners();
    
    // Calcula os bônus iniciais ao carregar a página
    updateSkillBonuses();
}

/**
 * Adiciona listeners nos inputs de atributos base (Corpo, Destreza, etc.)
 */
function setupStatListeners() {
    // Pega todos os inputs numéricos dentro da seção de atributos
    const statInputs = document.querySelectorAll('.stats-grid input[type="number"]');
    statInputs.forEach(input => {
        // Toda vez que o jogador digitar um número ou usar as setinhas, atualiza as perícias
        input.addEventListener('input', updateSkillBonuses);
    });
}

export function updateSkillBonuses() {
    const skillSelects = document.querySelectorAll('.skill-prof');
    
    skillSelects.forEach(select => {
        const skillName = select.dataset.skill;
        const statElement = document.querySelector(`.skill-roll[data-skill="${skillName}"]`);
        
        if (!statElement) return;
        
        const statName = statElement.dataset.stat;
        // Busca o valor atualizado do atributo base que corresponde a esta perícia
        const statInput = document.getElementById(`stat-${statName}`);
        
        const statValue = statInput ? (parseInt(statInput.value) || 0) : 0;
        const profValue = parseInt(select.value) || 0;
        
        const total = statValue + profValue;
        
        const formattedTotal = total >= 0 ? `+${total}` : `${total}`;
        
        const displaySpan = document.querySelector(`.skill-total[data-skill="${skillName}"]`);
        if (displaySpan) {
            displaySpan.textContent = `(${formattedTotal})`;
        }
    });
}