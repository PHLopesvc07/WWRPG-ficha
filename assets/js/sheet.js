/**
 * SHEET.JS - MINISTÉRIO DA MAGIA
 * Lógica central da Ficha (Famílias, Perícias e Cálculos de Atributos)
 */

// Precisamos importar o banco de dados estático que criamos antes
import { db } from './data.js';

export function populateFamilies() {
    const select = document.getElementById('family-select');
    select.innerHTML = '<option value="">Selecione uma Linhagem...</option>';

    // Varre o banco de dados e cria os grupos de nacionalidade
    for (const [nationality, families] of Object.entries(db.families)) {
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

export function populateSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = ''; // Limpa antes de injetar

    const profOptions = db.proficiencyLevels.map(p => 
        `<option value="${p.value}" ${p.default ? 'selected' : ''}>${p.label}</option>`
    ).join('');

    for (const [stat, skills] of Object.entries(db.skills)) {
        skills.forEach(skillName => {
            const div = document.createElement('div');
            div.className = 'skill-item';
            
            // Note que mantivemos as classes .rollable para o sistema de dados funcionar depois
            div.innerHTML = `
                <span class="rollable skill-roll" data-stat="${stat}" data-skill="${skillName}">
                    ${skillName} <span class="skill-total" data-skill="${skillName}" style="color:var(--stamp-red); font-family:var(--font-typewriter); font-weight:bold; font-size:0.9em;">(+0)</span>
                </span>
                <select class="ink-select short-input skill-prof" data-skill="${skillName}">
                    ${profOptions}
                </select>
            `;
            container.appendChild(div);
            
            // Adiciona o ouvinte de evento diretamente no select recém-criado
            const selectElement = div.querySelector('.skill-prof');
            selectElement.addEventListener('change', updateSkillBonuses);
        });
    }

    // Calcula os bônus iniciais logo após criar a lista
    updateSkillBonuses();
}

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
        const formattedTotal = total >= 0 ? `+${total}` : `${total}`;
        
        const displaySpan = document.querySelector(`.skill-total[data-skill="${skillName}"]`);
        if (displaySpan) {
            displaySpan.textContent = `(${formattedTotal})`;
        }
    });
}