/**
 * SPELLS.JS - MINISTÉRIO DA MAGIA
 * Gerenciamento de Listas Dinâmicas (Atualizado com esquema completo de feitiços)
 */

export function setupDynamicLists() {
    // 1. Adicionar Feitiço (Agora com a estrutura completa e categorias múltiplas)
    document.getElementById('btn-add-spell').addEventListener('click', () => {
        const container = document.getElementById('spells-list');
        const id = Date.now();
        const card = document.createElement('div');
        card.className = 'bureaucracy-box spell-card';
        card.dataset.id = id;
        
        // Atualizado: <select multiple> para matriz de categorias e novos inputs
        card.innerHTML = `
            <button class="delete-btn">X</button>
            <div class="wand-grid">
                <input type="text" class="ink-input spell-name" placeholder="Nome do Feitiço">
                
                <select class="ink-select spell-cat" multiple size="3" title="Segure Ctrl/Cmd para múltipla seleção">
                    <option value="Transfiguração">Transfiguração</option>
                    <option value="Feitiço" selected>Feitiço</option>
                    <option value="Azaração">Azaração</option>
                    <option value="Maldição Menor">Maldição Menor</option>
                    <option value="Maldição">Maldição</option>
                    <option value="Contra-feitiço">Contra-feitiço</option>
                    <option value="Cura">Cura</option>
                </select>
                
                <select class="ink-select spell-lvl">
                    <option value="1">Nível 1</option><option value="2">Nível 2</option>
                    <option value="3">Nível 3</option><option value="4">Nível 4</option>
                    <option value="5">Nível 5</option><option value="6">Nível 6</option>
                    <option value="7">Nível 7</option>
                </select>
            </div>
            
            <div class="wand-grid" style="margin-top: 10px;">
                <input type="text" class="ink-input spell-time" placeholder="Tempo de Conjuração (Ex: 1 Ação)">
                <input type="text" class="ink-input spell-range" placeholder="Alcance (Ex: 9m)">
                <input type="text" class="ink-input spell-comp" placeholder="Componentes (V, S, M)">
            </div>
            
            <textarea class="ink-textarea spell-desc" placeholder="Descrição do efeito..."></textarea>
        `;
        
        // Eventos Dinâmicos do Card
        card.querySelector('.delete-btn').addEventListener('click', () => { card.remove(); sortSpells(); });
        card.querySelector('.spell-cat').addEventListener('change', sortSpells);
        card.querySelector('.spell-lvl').addEventListener('change', sortSpells);
        
        container.appendChild(card);
        sortSpells();
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

    addInventoryContainer("Mochila Principal");
}

export function sortSpells() {
    const container = document.getElementById('spells-list');
    const cards = Array.from(container.children);
    
    const catConfig = {
        "Transfiguração": { order: 1, class: "cat-transfiguracao" },
        "Feitiço":        { order: 2, class: "cat-feitico" },
        "Azaração":       { order: 3, class: "cat-azaracao" },
        "Maldição Menor": { order: 4, class: "cat-maldicao-menor" },
        "Maldição":       { order: 5, class: "cat-maldicao" },
        "Contra-feitiço": { order: 6, class: "cat-contra-feitico" },
        "Cura":           { order: 7, class: "cat-cura" }
    };

    // Função auxiliar para extrair a categoria primária (a primeira do array) para fins de ordenação visual
    const getPrimaryCategory = (card) => {
        const select = card.querySelector('.spell-cat');
        if (!select) return "Feitiço";
        if (select.multiple && select.selectedOptions.length > 0) {
            return select.selectedOptions[0].value;
        }
        return select.value || "Feitiço";
    };

    cards.sort((a, b) => {
        const catA = getPrimaryCategory(a);
        const catB = getPrimaryCategory(b);
        
        // Fallback seguro caso a categoria não esteja no config
        const orderA = catConfig[catA] ? catConfig[catA].order : 99;
        const orderB = catConfig[catB] ? catConfig[catB].order : 99;
        
        if (orderA !== orderB) return orderA - orderB; 
        
        const lvlA = parseInt(a.querySelector('.spell-lvl').value) || 1;
        const lvlB = parseInt(b.querySelector('.spell-lvl').value) || 1;
        return lvlA - lvlB;
    });

    cards.forEach(card => {
        const primaryCat = getPrimaryCategory(card);
        
        // Limpa classes antigas e aplica a nova cor baseada na primeira categoria do array
        Object.values(catConfig).forEach(c => card.classList.remove(c.class));
        if(catConfig[primaryCat]) card.classList.add(catConfig[primaryCat].class);
        
        container.appendChild(card);
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
        <input type="text" class="ink-input container-name" value="${name}" style="font-size: 1.2em; font-weight: bold; width: 80%; margin-bottom: 10px;">
        <div class="items-list"></div>
        <button class="btn-teal add-item-btn">+ Adicionar Item</button>
    `;
    
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
