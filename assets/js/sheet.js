/**
 * SHEET.JS - MINISTÉRIO DA MAGIA
 * Gestão de Atributos Básicos e Perícias Registradas
 */

export function setupSheet() {
    setupSkills();

    // Sempre que um atributo base for alterado, recalcula as perícias atreladas
    document.querySelectorAll('input[id^="stat-"]').forEach(inp => {
        inp.addEventListener('input', updateSkillBonuses);
    });
}

function setupSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    // Dicionário Mestre de Perícias (Fácil de escalar e dar manutenção)
    const skillsDef = {
        "sabedoria": [
            { id: "clarividencia", name: "Clarividência" },
            { id: "intuicao", name: "Intuição" },
            { id: "dcat", name: "D.C.A.T." },
            { id: "medicina", name: "Cura Mágica" }
        ],
        "inteligencia": [
            { id: "logica", name: "Lógica e Enigmas" },
            { id: "herbologia", name: "Herbologia" },
            { id: "pocoes", name: "Poções" },
            { id: "astronomia", name: "Astronomia" },
            { id: "trouxas", name: "Estudo dos Trouxas" },
            { id: "percepcao", name: "Percepção" }
        ],
        "vitalidade": [
            { id: "resistencia", name: "Persistência Mágica" },
            { id: "transfiguracao", name: "Transfiguração" }
        ],
        "destreza": [
            { id: "trato", name: "Trato das Criaturas" },
            { id: "furtividade", name: "Furtividade" }
        ],
        "corpo": [
            { id: "voo", name: "Voo de Vassoura" },
            { id: "atletismo", name: "Atletismo Mágico" }
        ],
        "carisma": [
            { id: "persuasao", name: "Persuasão Mágica" },
            { id: "diplomacia", name: "Diplomacia" }
        ]
    };

    const attrNames = {
        "sabedoria": "Sabedoria", "inteligencia": "Inteligência",
        "vitalidade": "Vitalidade", "destreza": "Destreza",
        "corpo": "Corpo", "carisma": "Carisma"
    };

    container.innerHTML = '';
    container.className = 'skills-container-grouped';

    // Roda cada atributo e desenha o bloco dele
    for (const [attr, skills] of Object.entries(skillsDef)) {
        const groupBox = document.createElement('div');
        groupBox.className = 'skill-attr-group bureaucracy-box';
        
        groupBox.innerHTML = `
            <div class="skill-attr-header">
                <span>${attrNames[attr]}</span>
                <span id="mod-display-${attr}">MOD: 0</span>
            </div>
        `;

        // Desenha as perícias dentro do bloco
        skills.forEach(sk => {
            const row = document.createElement('div');
            row.className = 'skill-row';
            
            row.innerHTML = `
                <span class="rollable skill-name" data-skill="${sk.id}">${sk.name}</span>
                <div class="skill-controls">
                    <span class="skill-total" id="total-${sk.id}">0</span>
                    <select class="skill-prof" data-skill="${sk.id}" data-attr="${attr}" title="Nível de Proficiência">
                        <option value="-3">MR</option>
                        <option value="-2">R</option>
                        <option value="-1">D</option>
                        <option value="0" selected>N</option>
                        <option value="1">U</option>
                        <option value="2">C</option>
                        <option value="3">E</option>
                    </select>
                </div>
            `;
            groupBox.appendChild(row);
        });
        
        container.appendChild(groupBox);
    }
    
    // Adiciona o ouvinte para recalcular as perícias se o dropdown mudar
    document.querySelectorAll('.skill-prof').forEach(sel => {
        sel.addEventListener('change', updateSkillBonuses);
    });

    // Roda a matemática pela primeira vez
    updateSkillBonuses();
}

export function updateSkillBonuses() {
    // 1. Puxa o valor atual dos inputs de atributos base
    const getStat = (attr) => parseInt(document.getElementById(`stat-${attr}`).value) || 0;
    
    const stats = {
        "corpo": getStat("corpo"),
        "destreza": getStat("destreza"),
        "inteligencia": getStat("inteligencia"),
        "sabedoria": getStat("sabedoria"),
        "vitalidade": getStat("vitalidade"),
        "carisma": getStat("carisma")
    };

    // 2. Atualiza os cabeçalhos de cada bloco ("MOD: 3", por exemplo)
    for(let attr in stats) {
        const modDisplay = document.getElementById(`mod-display-${attr}`);
        if(modDisplay) modDisplay.innerText = `MOD: ${stats[attr]}`;
    }

    // 3. Atualiza o número final (Soma do Atributo + Nível de Proficiência escolhido)
    document.querySelectorAll('.skill-prof').forEach(sel => {
        const attr = sel.dataset.attr;
        const skillId = sel.dataset.skill;
        const profBonus = parseInt(sel.value) || 0;
        
        const total = stats[attr] + profBonus;
        
        const totalSpan = document.getElementById(`total-${skillId}`);
        if(totalSpan) totalSpan.innerText = total;
    });
}
