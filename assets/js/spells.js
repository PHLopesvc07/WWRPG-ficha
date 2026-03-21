/**
 * SPELLS.JS - MINISTÉRIO DA MAGIA
 * Gerenciamento de Listas Dinâmicas 
 */

export function setupDynamicLists() {
    // 1. Adicionar Feitiço (Layout limpo restaurado)
    document.getElementById('btn-add-spell').addEventListener('click', () => {
        const container = document.getElementById('spells-list');
        const id = Date.now();
        const card = document.createElement('div');
        card.className = 'bureaucracy-box spell-card';
        card.dataset.id = id;
        
        card.innerHTML = `
            <button class="delete-btn">X</button>
            <div class="wand-grid">
                <input type="text" class="ink-input spell-name" placeholder="Nome do Feitiço">
                
                <select class="ink-select spell-cat">
                    <option value="Transfiguração">Transfiguração</option>
                    <option value="Feitiço" selected>Charme</option>
                    <option value="Azaração">Azaração</option>
                    <option value="Maldição Menor">Maldição Menor</option>
                    <option value="Maldição">Maldição</option>
                    <option value="Contra-feitiço">Contra-feitiço</option>
                    <option value="Cura">Cura</option>
                </select>
                
                <select class="ink-select spell-lvl">
                    <option value="1">Nível 1</option>
                    <option value="2">Nível 2</option>
                    <option value="3">Nível 3</option>
                    <option value="4">Nível 4</option>
                    <option value="5">Nível 5</option>
                    <option value="6">Nível 6</option>
                    <option value="7">Nível 7</option>
                </select>
            </div>
            
            <textarea class="ink-textarea spell-desc" placeholder="Descrição do efeito..."></textarea>
        `;
        
        card.querySelector('.delete-btn').addEventListener('click', () => { 
            card.remove(); 
            sortSpells(); 
        });
        card.querySelector('.spell-cat').addEventListener('change', sortSpells);
        card.querySelector('.spell-lvl').addEventListener('change', sortSpells);
        
        container.appendChild(card);
        sortSpells();
    });

    // Eventos de clique nas Badges de Navegação (Pílulas Coloridas)
    document.querySelectorAll('.spell-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            const targetCat = badge.dataset.filter;
            const container = document.getElementById('spells-list');
            const cards = Array.from(container.children);
            
            // Procura o primeiro card de feitiço que tenha a categoria clicada
            const targetSpell = cards.find(card => {
                return (card.querySelector('.spell-cat').value || "Feitiço") === targetCat;
            });

            if (targetSpell) {
                // Rola a página suavemente até o feitiço
                targetSpell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Pisca o feitiço para o usuário saber qual é
                targetSpell.style.transition = 'transform 0.3s, box-shadow 0.3s';
                targetSpell.style.transform = 'scale(1.02)';
                targetSpell.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
                
                setTimeout(() => {
                    targetSpell.style.transform = 'none';
                    targetSpell.style.boxShadow = '2px 2px 0 var(--ink)';
                }, 800);
            }
        });
    });

    // 2. Adicionar Ferimento Customizado
    document.getElementById('btn-add-injury').addEventListener('click', () => {
        const container = document.getElementById('custom-injuries-container');
        const div = document.createElement('div');
        div.className = 'injury-row custom-injury';
        div.innerHTML = `
            <input type="text" class="ink-input short-input" style="width:100px;" placeholder="Nome">
            <input type="number" class="ink-input short-input curr"> / 
            <input type="number" class="ink-input short-input max">
            <button class="delete-btn" style="position:relative;">X</button>
        `;
        div.querySelector('.delete-btn').addEventListener('click', () => div.remove());
        container.appendChild(div);
    });

    // 3. Adicionar Recipiente (Inventário)
    document.getElementById('btn-add-container').addEventListener('click', () => {
        addInventoryContainer("Novo Recipiente");
    });

    // Inicia a ficha com a mochila padrão
    addInventoryContainer("Mochila Principal");
}

export function sortSpells() {
    const container = document.getElementById('spells-list');
    const cards = Array.from(container.children);
    
    // Configuração das Cores de Tinta Arquivística
    const catConfig = {
        "Transfiguração": { order: 1, class: "cat-transfiguracao" },
        "Feitiço":        { order: 2, class: "cat-feitico" },
        "Azaração":       { order: 3, class: "cat-azaracao" },
        "Maldição Menor": { order: 4, class: "cat-maldicao-menor" },
        "Maldição":       { order: 5, class: "cat-maldicao" },
        "Contra-feitiço": { order: 6, class: "cat-contra-feitico" },
        "Cura":           { order: 7, class: "cat-cura" }
    };

    cards.sort((a, b) => {
        const catA = a.querySelector('.spell-cat').value || "Feitiço";
        const catB = b.querySelector('.spell-cat').value || "Feitiço";
        
        const orderA = catConfig[catA] ? catConfig[catA].order : 99;
        const orderB = catConfig[catB] ? catConfig[catB].order : 99;
        
        if (orderA !== orderB) return orderA - orderB; 
        
        const lvlA = parseInt(a.querySelector('.spell-lvl').value) || 1;
        const lvlB = parseInt(b.querySelector('.spell-lvl').value) || 1;
        return lvlA - lvlB;
    });

    // Dicionário para contar os feitiços de cada categoria
    const counts = {
        "Transfiguração": 0, "Feitiço": 0, "Azaração": 0, "Maldição Menor": 0,
        "Maldição": 0, "Contra-feitiço": 0, "Cura": 0
    };

    cards.forEach(card => {
        const primaryCat = card.querySelector('.spell-cat').value || "Feitiço";
        
        // Remove cores antigas e aplica a nova
        Object.values(catConfig).forEach(c => card.classList.remove(c.class));
        if(catConfig[primaryCat]) card.classList.add(catConfig[primaryCat].class);
        
        // Adiciona +1 ao contador desta categoria
        if(counts[primaryCat] !== undefined) counts[primaryCat]++;
        
        container.appendChild(card);
    });

    // Atualiza o contador total no título
    const countElement = document.getElementById('total-spells-count');
    if (countElement) {
        countElement.innerText = `${cards.length} registrado(s)`;
    }

    // Atualiza os números nas pílulas coloridas e "apaga" as que têm 0 feitiços
    document.querySelectorAll('.spell-badge').forEach(badge => {
        const cat = badge.dataset.filter;
        const countSpan = badge.querySelector('.count');
        
        if (countSpan) {
            countSpan.innerText = `(${counts[cat]})`;
        }
        
        if (counts[cat] === 0) {
            badge.style.opacity = '0.4';
            badge.style.filter = 'grayscale(80%)';
        } else {
            badge.style.opacity = '1';
            badge.style.filter = 'none';
        }
    });
}

export function addInventoryContainer(name = "Novo Recipiente") {
    const container = document.getElementById('inventory-list');
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const card = document.createElement('div');
    card.className = 'bureaucracy-box inventory-container-card';
    card.dataset.id = id;
    
    card.innerHTML = `
        <button class="delete-btn">X</button>
        <input type="text" class="ink-input container-name" style="font-size: 1.2em; font-weight: bold; width: 80%; margin-bottom: 10px;">
        <div class="items-list"></div>
        <button class="btn-teal add-item-btn">+ Adicionar Item</button>
    `;
    
    // Injeção de nome segura contra aspas
    card.querySelector('.container-name').value = name;
    
    card.querySelector('.delete-btn').addEventListener('click', () => card.remove());
    card.querySelector('.add-item-btn').addEventListener('click', () => addInventoryItem(id));
    
    container.appendChild(card);
}

export function addInventoryItem(containerId) {
    const container = document.querySelector(`.inventory-container-card[data-id="${containerId}"] .items-list`);
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'item-row';
    div.style.display = 'flex'; div.style.gap = '10px'; div.style.marginBottom = '5px';
    
    div.innerHTML = `
        <input type="number" class="ink-input short-input item-qtd" placeholder="Qtd" value="1" min="1" max="100">
        <input type="text" class="ink-input item-name" placeholder="Nome do Item">
        <input type="text" class="ink-input item-desc" placeholder="Descrição rápida">
        <button class="btn-danger" style="padding: 2px 8px;">X</button>
    `;
    
    div.querySelector('.item-qtd').addEventListener('change', function() {
        if(this.value > 100) this.value = 100;
    });
    
    div.querySelector('.btn-danger').addEventListener('click', () => div.remove());
    container.appendChild(div);
}
