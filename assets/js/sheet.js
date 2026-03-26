/**
 * SHEET.JS - MINISTÉRIO DA MAGIA
 * Lógica central da Ficha (Famílias, Perícias e Cálculos de Atributos)
 */

/**
 * Preenche a lista de linhagens familiares no select baseado na base de dados.
 * (Cumpre o Princípio da Inversão de Dependência - recebe os dados por parâmetro)
 * * @param {Object} database - O objeto que contém os dados estáticos do sistema (famílias, perícias, etc).
 */
export function populateFamilies(database) {
    const select = document.getElementById('family-select');
    if (!select) return; // Prevenção de erros caso o elemento não exista no DOM

    select.innerHTML = '<option value="">Selecione uma Linhagem...</option>';

    // Varre o banco de dados e cria os grupos de nacionalidade
    for (const [nationality, families] of Object.entries(database.families)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = nationality;
        
        families.forEach(fam => {
            const option = document.createElement('option');
            option.value = JSON.stringify(fam); // Salva os dados como string no value
            option.textContent = fam.name;
            optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
    }

    // Atualiza Influência e Preconceito ao selecionar a família
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

/**
 * Cria a grelha de perícias dinamicamente e inicializa os seus multiplicadores.
 * * @param {Object} database - O objeto que contém os dados estáticos do sistema.
 */
export function populateSkills(database) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    container.innerHTML = ''; // Limpa antes de injetar

    // Prepara as opções de proficiência uma única vez para otimizar performance (Eficiência)
    const profOptions = database.proficiencyLevels.map(p => 
        `<option value="${p.value}" ${p.default ? 'selected' : ''}>${p.label}</option>`
    ).join('');

    for (const [stat, skills] of Object.entries(database.skills)) {
        skills.forEach(skillName => {
            const div = document.createElement('div');
            div.className = 'skill-item';
            
            // SRP: Estilos inline removidos e substituídos pelas classes .skill-label-group e .skill-total-val
            // Acessibilidade: Adicionado aria-label dinâmico ao select
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
            
            // Adiciona o ouvinte de evento diretamente no select recém-criado
            const selectElement = div.querySelector('.skill-prof');
            selectElement.addEventListener('change', updateSkillBonuses);
        });
    }

    // Calcula os bónus iniciais logo após criar a lista
    updateSkillBonuses();
}

/**
 * Recalcula e atualiza na interface o valor total de todas as perícias 
 * (Atributo Base + Nível de Proficiência).
 */
export function updateSkillBonuses() {
    const skillSelects = document.querySelectorAll('.skill-prof');
    
    skillSelects.forEach(select => {
        const skillName = select.dataset.skill;
        const statElement = document.querySelector(`.skill-roll[data-skill="${skillName}"]`);
        
        if (!statElement) return; // Evita erros se a DOM não renderizou ainda
        
        const statName = statElement.dataset.stat;
        const statInput = document.getElementById(`stat-${statName}`);
        
        const statValue = statInput ? (parseInt(statInput.value) || 0) : 0;
        const profValue = parseInt(select.value) || 0;
        
        const total = statValue + profValue;
        
        // Formatação visual para garantir o sinal de positivo (+) em números maiores ou iguais a zero
        const formattedTotal = total >= 0 ? `+${total}` : `${total}`;
        
        const displaySpan = document.querySelector(`.skill-total[data-skill="${skillName}"]`);
        if (displaySpan) {
            displaySpan.textContent = `(${formattedTotal})`;
        }
    });
}