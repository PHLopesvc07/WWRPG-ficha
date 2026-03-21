/**
 * SHEET.JS - MINISTÉRIO DA MAGIA
 * Gestão de Atributos Básicos, Famílias e Perícias Registradas
 */

export function setupSheet() {
    populateFamilies();
    setupSkills();

    // Sempre que um atributo base for alterado, recalcula as perícias atreladas
    document.querySelectorAll('input[id^="stat-"]').forEach(inp => {
        inp.addEventListener('input', updateSkillBonuses);
    });
}

// ==========================================
// FUNÇÃO RESTAURADA E ATUALIZADA: Famílias por Nacionalidade
// ==========================================
export function populateFamilies() {
    const familySelect = document.getElementById('family-select');
    if (!familySelect) return;

    // Estrutura de dados usando Categorias (Nacionalidades)
    const familyGroups = [
        {
            region: "Norte-Americanas",
            families: [ { name: "Durward", p: 90, i: 20 } ]
        },
        {
            region: "Inglesas",
            families: [
                { name: "Finnigan", p: 50, i: 95 },
                { name: "Fudge", p: 40, i: 95 },
                { name: "Weasley", p: 40, i: 30 },
                { name: "Black", p: 85, i: 85 },
                { name: "Malfoy", p: 90, i: 90 },
                { name: "Prewett", p: 60, i: 45 },
                { name: "Crouch", p: 70, i: 40 },
                { name: "Macmillan", p: 65, i: 35 },
                { name: "Nott", p: 80, i: 75 },
                { name: "Longbottom", p: 45, i: 25 },
                { name: "Bones", p: 50, i: 35 },
                { name: "Avery", p: 85, i: 75 },
                { name: "Parkinson", p: 75, i: 70 },
                { name: "Flint", p: 80, i: 55 },
                { name: "Travers", p: 80, i: 70 },
                { name: "Yaxley", p: 80, i: 60 },
                { name: "Abbott", p: 70, i: 50 },
                { name: "Bulstrode", p: 85, i: 60 },
                { name: "Greengrass", p: 65, i: 40 },
                { name: "Shafiq", p: 55, i: 20 }
            ]
        },
        {
            region: "Francesas",
            families: [
                { name: "Fontaine", p: 50, i: 25 },
                { name: "Aingremont", p: 50, i: 95 },
                { name: "Delacour", p: 50, i: 40 }
            ]
        },
        {
            region: "Escocesas",
            families: [
                { name: "McGonagall", p: 20, i: 85 },
                { name: "Potter/Peverell", p: 25, i: 65 },
                { name: "MacDougal", p: 60, i: 30 }
            ]
        },
        {
            region: "Irlandesas",
            families: [ { name: "Ollivander", p: 55, i: 60 } ]
        },
        {
            region: "Galesas",
            families: [
                { name: "Smith", p: 0, i: 70 },
                { name: "Lovegood", p: 30, i: 25 }
            ]
        },
        {
            region: "Nórdicas",
            families: [ { name: "Krum", p: 65, i: 50 } ]
        },
        {
            region: "Leste Europeu",
            families: [
                { name: "Moody", p: 40, i: 45 },
                { name: "Karkaroff", p: 75, i: 55 }
            ]
        },
        {
            region: "Italianas",
            families: [ { name: "Zabini", p: 70, i: 45 } ]
        },
        {
            region: "Escandinavas",
            families: [ { name: "Borgin", p: 70, i: 50 } ]
        },
        {
            region: "Alemãs",
            families: [ { name: "Krum (Alemã)", p: 65, i: 50 } ]
        },
        {
            region: "Húngaras",
            families: [ { name: "Harkiss", p: 80, i: 60 } ]
        },
        {
            region: "Gregas",
            families: [ { name: "Tsoukalos", p: 55, i: 40 } ]
        },
        {
            region: "Romenas",
            families: [ { name: "Carpathia", p: 75, i: 55 } ]
        },
        {
            region: "Australianas",
            families: [
                { name: "Brunner", p: 90, i: 90 },
                { name: "Snape", p: 75, i: 70 }
            ]
        },
        {
            region: "Russas",
            families: [
                { name: "Pavlovich", p: 80, i: 70 },
                { name: "Godunov", p: 90, i: 50 }
            ]
        },
        {
            region: "Espanholas",
            families: [ { name: "Brandhuber", p: 70, i: 60 } ]
        },
        {
            region: "Japonesas",
            families: [ { name: "Chang", p: 50, i: 50 } ]
        },
        {
            region: "Sem Nacionalidade Específica",
            families: [
                { name: "Dooren", p: 100, i: 0 },
                { name: "Rosier (Linhagem 1)", p: 85, i: 70 },
                { name: "Lannister", p: 100, i: 20 },
                { name: "Diggory", p: 25, i: 35 },
                { name: "Shacklebolt", p: 10, i: 55 },
                { name: "Gaunt", p: 95, i: 50 },
                { name: "Rosier (Linhagem 2)", p: 90, i: 65 },
                { name: "Lestrange", p: 95, i: 80 },
                { name: "Selwyn", p: 70, i: 45 }
            ]
        }
    ];

    familySelect.innerHTML = '<option value="">Selecione uma Linhagem...</option>';
    
    // Constrói o menu com os grupos de regiões
    familyGroups.forEach(group => {
        const optGroup = document.createElement('optgroup');
        optGroup.label = `─── ${group.region.toUpperCase()} ───`;
        
        group.families.forEach(fam => {
            const opt = document.createElement('option');
            opt.value = fam.name;
            opt.textContent = fam.name;
            opt.dataset.p = fam.p;
            opt.dataset.i = fam.i;
            optGroup.appendChild(opt);
        });
        
        familySelect.appendChild(optGroup);
    });

    // Atualiza Preconceito e Influência automaticamente ao escolher a família
    familySelect.addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        if (selected && selected.value !== "") {
            document.getElementById('prejudice').value = selected.dataset.p || 0;
            document.getElementById('influence').value = selected.dataset.i || 0;
        } else {
            document.getElementById('prejudice').value = 0;
            document.getElementById('influence').value = 0;
        }
    });
}

// ==========================================
// SISTEMA DE PERÍCIAS (Agrupadas por Atributo)
// ==========================================
function setupSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    // Dicionário Mestre de Perícias
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
