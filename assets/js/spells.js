/**
 * SPELLS.JS - MINISTÉRIO DA MAGIA
 * Gerenciamento de Listas Dinâmicas, Ordenação e Animações
 */

/**
 * Inicializa os ouvintes de eventos globais para adição de feitiços,
 * ferimentos customizados, recipientes de inventário e navegação por badges.
 */
export function setupDynamicLists() {
    const btnAddSpell = document.getElementById('btn-add-spell');
    const btnAddInjury = document.getElementById('btn-add-injury');
    const btnAddContainer = document.getElementById('btn-add-container');
    const spellImportInput = document.getElementById('spell-import');

    // 1. Adicionar Feitiço Manualmente
    if (btnAddSpell) {
        btnAddSpell.addEventListener('click', () => {
            addSpellCard(); // Chama a função sem dados para criar um feitiço em branco
        });
    }

    // Eventos de clique nas Badges de Navegação (Índice Superior)
    document.querySelectorAll('.spell-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            const targetCat = badge.dataset.filter;
            const container = document.getElementById('spells-list');
            if (!container) return;
            
            const cards = Array.from(container.querySelectorAll('.spell-card'));
            
            const targetSpell = cards.find(card => {
                const select = card.querySelector('.spell-cat');
                return (select ? select.value : "Feitiço") === targetCat;
            });

            if (targetSpell) {
                const header = targetSpell.previousElementSibling;
                if (header && header.classList.contains('spell-category-header')) {
                    header.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    targetSpell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // SRP Aplicado: Delega o efeito de destaque para uma classe CSS
                targetSpell.classList.add('spell-highlight');
                
                setTimeout(() => {
                    targetSpell.classList.remove('spell-highlight');
                }, 800);
            }
        });
    });

    // 2. Adicionar Ferimento Customizado
    if (btnAddInjury) {
        btnAddInjury.addEventListener('click', () => {
            const container = document.getElementById('custom-injuries-container');
            if (!container) return;
            
            const div = document.createElement('div');
            div.className = 'injury-row custom-injury animated-fade-in';
            // SRP: Estilos inline movidos para classes CSS
            div.innerHTML = `
                <input type="text" class="ink-input short-input injury-name-input" placeholder="Nome" aria-label="Nome do Ferimento">
                <input type="number" class="ink-input short-input curr" aria-label="Gravidade Atual"> / 
                <input type="number" class="ink-input short-input max" aria-label="Gravidade Máxima">
                <button class="delete-btn btn-delete-small" aria-label="Excluir Ferimento" title="Excluir">X</button>
            `;
            
            const deleteBtn = div.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => div.remove());
            }
            container.appendChild(div);
        });
    }

    // 3. Adicionar Recipiente (Inventário)
    if (btnAddContainer) {
        btnAddContainer.addEventListener('click', () => {
            addInventoryContainer("Novo Recipiente");
        });
    }

    // 4. Importar Feitiços (Individual ou Lista)
    if (spellImportInput) {
        spellImportInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);

                    // Verifica se é uma lista (array) ou um feitiço individual (object)
                    if (Array.isArray(data)) {
                        data.forEach(spell => {
                            addSpellCard(spell);
                        });
                        alert(`${data.length} feitiços importados com sucesso!`);
                    } else if (typeof data === 'object' && data !== null) {
                        addSpellCard(data);
                        alert(`Feitiço "${data.name || 'desconhecido'}" importado!`);
                    }

                    // Organiza a lista após a importação
                    sortSpells();
                    
                    // Limpa o input para permitir importar o mesmo arquivo novamente se necessário
                    spellImportInput.value = '';

                } catch (err) {
                    console.error("Erro ao importar feitiço:", err);
                    alert("Erro no arquivo: Certifique-se de que é um JSON válido do Ministério.");
                }
            };
            reader.readAsText(file);
        });
    }

    // Inicializa o primeiro recipiente padrão
    addInventoryContainer("Mochila Principal");
}

/**
 * Cria e injeta um cartão de feitiço no DOM.
 * @param {Object|null} data - Objeto contendo os dados do feitiço (usado no Load do JSON). Se null, cria vazio.
 */
export function addSpellCard(data = null) {
    const container = document.getElementById('spells-list');
    if (!container) return;

    const id = Date.now() + Math.floor(Math.random() * 10000); // Garante um ID único
    const card = document.createElement('div');
    card.className = 'bureaucracy-box spell-card';
    card.dataset.id = id;
    card.dataset.newlyCreated = 'true';

    card.innerHTML = `
        <button class="delete-btn" aria-label="Excluir Feitiço" title="Excluir Feitiço">X</button>
        <div class="wand-grid">
            <input type="text" class="ink-input spell-name" placeholder="Nome do Feitiço" aria-label="Nome do Feitiço">
            
            <select class="ink-select spell-cat" aria-label="Categoria do Feitiço">
                <option value="Transfiguração">Transfiguração</option>
                <option value="Feitiço" selected>Charme</option>
                <option value="Azaração">Azaração</option>
                <option value="Maldição Menor">Maldição Menor</option>
                <option value="Maldição">Maldição</option>
                <option value="Contra-feitiço">Contra-feitiço</option>
                <option value="Cura">Cura</option>
            </select>
            
            <select class="ink-select spell-lvl" aria-label="Nível do Feitiço">
                <option value="1">Nível 1</option>
                <option value="2">Nível 2</option>
                <option value="3">Nível 3</option>
                <option value="4">Nível 4</option>
                <option value="5">Nível 5</option>
                <option value="6">Nível 6</option>
                <option value="7">Nível 7</option>
            </select>
        </div>
        
        <textarea class="ink-textarea spell-desc" placeholder="Descrição do efeito..." aria-label="Descrição do Feitiço"></textarea>
    `;

    // Se estivermos a importar (Load), injeta as informações
    if (data) {
        card.querySelector('.spell-name').value = data.name || "";
        card.querySelector('.spell-desc').value = data.desc || "";
        card.querySelector('.spell-lvl').value = data.lvl || "1";
        
        const catValue = Array.isArray(data.cat) ? data.cat[0] : data.cat;
        card.querySelector('.spell-cat').value = catValue || "Feitiço";
    }
    
    // Animação de Saída
    const deleteBtn = card.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => { 
            card.classList.add('spell-card-exit');
            card.addEventListener('animationend', () => {
                card.remove(); 
                sortSpells(); 
            }, { once: true });
        });
    }
    
    card.querySelector('.spell-cat').addEventListener('change', sortSpells);
    card.querySelector('.spell-lvl').addEventListener('change', sortSpells);
    
    container.appendChild(card);
    
    // Só aciona a organização mágica se for uma inserção manual. 
    if (!data) {
        sortSpells();
    }
}

/**
 * Ordena os cartões de feitiços com base na categoria e nível, 
 * injetando cabeçalhos separadores no DOM de forma dinâmica.
 */
export function sortSpells() {
    const container = document.getElementById('spells-list');
    if (!container) return;
    
    const cards = Array.from(container.querySelectorAll('.spell-card'));
    
    const currentHeaders = container.querySelectorAll('.spell-category-header');
    currentHeaders.forEach(header => header.remove());
    
    const catConfig = {
        "Transfiguração": { order: 1, class: "cat-transfiguracao", headerClass: "header-transfiguracao", label: "Transfiguração" },
        "Feitiço":        { order: 2, class: "cat-feitico", headerClass: "header-feitico", label: "Charme" },
        "Azaração":       { order: 3, class: "cat-azaracao", headerClass: "header-azaracao", label: "Azaração" },
        "Maldição Menor": { order: 4, class: "cat-maldicao-menor", headerClass: "header-maldicao-menor", label: "Maldição Menor" },
        "Maldição":       { order: 5, class: "cat-maldicao", headerClass: "header-maldicao", label: "Maldição" },
        "Contra-feitiço": { order: 6, class: "cat-contra-feitico", headerClass: "header-contra-feitico", label: "Contra-feitiço" },
        "Cura":           { order: 7, class: "cat-cura", headerClass: "header-cura", label: "Cura" }
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

    const counts = {
        "Transfiguração": 0, "Feitiço": 0, "Azaração": 0, "Maldição Menor": 0,
        "Maldição": 0, "Contra-feitiço": 0, "Cura": 0
    };

    let currentCategory = null;

    cards.forEach(card => {
        const primaryCat = card.querySelector('.spell-cat').value || "Feitiço";
        
        Object.values(catConfig).forEach(c => card.classList.remove(c.class));
        if(catConfig[primaryCat]) card.classList.add(catConfig[primaryCat].class);
        
        if(counts[primaryCat] !== undefined) counts[primaryCat]++;
        
        // Injeta os Cabeçalhos de Categoria delegando o estilo ao CSS
        if (primaryCat !== currentCategory) {
            currentCategory = primaryCat;
            const headerData = catConfig[primaryCat];
            
            const header = document.createElement('div');
            header.className = `spell-category-header ${headerData.headerClass}`;
            header.innerHTML = `✦ ${headerData.label}`;
            container.appendChild(header);
        }
        
        container.appendChild(card);

        if (card.dataset.newlyCreated === 'true') {
            delete card.dataset.newlyCreated;
            void card.offsetHeight;
            card.classList.add('spell-animate-entrance');
            card.addEventListener('animationend', () => {
                card.classList.remove('spell-animate-entrance');
            }, { once: true });
        }
    });

    const countElement = document.getElementById('total-spells-count');
    if (countElement) {
        countElement.innerText = `${cards.length} registrado(s)`;
    }

    // Gestão de visualização (Filtros na Badges)
    document.querySelectorAll('.spell-badge').forEach(badge => {
        const cat = badge.dataset.filter;
        const countSpan = badge.querySelector('.count');
        
        if (countSpan) {
            countSpan.innerText = `(${counts[cat]})`;
        }
        
        if (counts[cat] === 0) {
            badge.classList.add('badge-inactive');
        } else {
            badge.classList.remove('badge-inactive');
        }
    });

    function setupSpellFilter() {
    const searchInput = document.getElementById('spell-search');
    const lvlFilter   = document.getElementById('spell-filter-lvl');
    const clearBtn    = document.getElementById('btn-clear-spell-filter');

    if (searchInput) searchInput.addEventListener('input',  filterSpells);
    if (lvlFilter)   lvlFilter.addEventListener('change',  filterSpells);
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (lvlFilter)   lvlFilter.value   = '';
            filterSpells();
        });
    }
}

function filterSpells() {
    const search = (document.getElementById('spell-search')?.value || '').toLowerCase().trim();
    const lvl    =  document.getElementById('spell-filter-lvl')?.value || '';

    const container = document.getElementById('spells-list');
    if (!container) return;

    // Mostra/esconde cada card
    container.querySelectorAll('.spell-card').forEach(card => {
        const name = (card.querySelector('.spell-name')?.value || '').toLowerCase();
        const desc = (card.querySelector('.spell-desc')?.value || '').toLowerCase();
        const cardLvl = card.querySelector('.spell-lvl')?.value || '';

        const matchSearch = !search || name.includes(search) || desc.includes(search);
        const matchLvl    = !lvl    || cardLvl === lvl;

        card.style.display = (matchSearch && matchLvl) ? '' : 'none';
    });

    // Esconde headers cujos cards estejam todos ocultos
    container.querySelectorAll('.spell-category-header').forEach(header => {
        let next = header.nextElementSibling;
        let hasVisible = false;
        while (next && !next.classList.contains('spell-category-header')) {
            if (next.classList.contains('spell-card') && next.style.display !== 'none') {
                hasVisible = true;
                break;
            }
            next = next.nextElementSibling;
        }
        header.style.display = hasVisible ? '' : 'none';
    });
}

}

/**
 * Adiciona um novo recipiente/mochila ao inventário do utilizador.
 * @param {string} name - Nome padrão inicial do recipiente.
 */
export function addInventoryContainer(name = "Novo Recipiente") {
    const container = document.getElementById('inventory-list');
    if (!container) return;

    const id = Date.now() + Math.floor(Math.random() * 1000);
    const card = document.createElement('div');
    
    card.className = 'bureaucracy-box inventory-container-card animate-entrance';
    card.dataset.id = id;
    
    // SRP: Uso de classes CSS ao invés de inline styles complexos
    card.innerHTML = `
        <button class="delete-btn" aria-label="Excluir Recipiente" title="Excluir Recipiente">X</button>
        <input type="text" class="ink-input container-name container-name-input" aria-label="Nome do Recipiente">
        <div class="items-list items-list-flex"></div>
        <button class="btn-teal add-item-btn btn-add-item-small">+ Adicionar Item</button>
    `;
    
    card.querySelector('.container-name').value = name;
    
    const deleteBtn = card.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            card.classList.remove('animate-entrance'); 
            card.classList.add('animate-exit');        
            card.addEventListener('animationend', () => card.remove(), { once: true });
        });
    }
    
    const addBtn = card.querySelector('.add-item-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => addInventoryItem(id));
    }
    
    container.appendChild(card);
}

/**
 * Adiciona uma linha de item a um recipiente de inventário específico.
 * @param {number|string} containerId - ID único do recipiente pai.
 */
export function addInventoryItem(containerId) {
    const container = document.querySelector(`.inventory-container-card[data-id="${containerId}"] .items-list`);
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'item-row animate-entrance';
    
    div.innerHTML = `
        <input type="number" class="ink-input short-input item-qtd" placeholder="Qtd" value="1" min="1" max="100" aria-label="Quantidade">
        <input type="text" class="ink-input item-name" placeholder="Nome" aria-label="Nome do Item">
        <textarea class="ink-input item-desc item-desc-textarea" placeholder="Descrição rápida" rows="1" aria-label="Descrição do Item"></textarea>
        <button class="btn-danger btn-remove-item-small" aria-label="Remover item" title="Remover item">X</button>
    `;
    
    const qtdInput = div.querySelector('.item-qtd');
    if (qtdInput) {
        qtdInput.addEventListener('change', function() {
            if(this.value > 100) this.value = 100;
        });
    }

    // Auto-expansão do campo de descrição
    const descArea = div.querySelector('.item-desc');
    if (descArea) {
        descArea.addEventListener('input', function() {
            this.style.height = 'auto'; // É necessário o inline-style para forçar o recalculo dinâmico da altura no DOM
            this.style.height = this.scrollHeight + 'px'; 
        });
    }
    
    const removeBtn = div.querySelector('.btn-danger');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            div.classList.remove('animate-entrance');
            div.classList.add('animate-exit');
            div.addEventListener('animationend', () => div.remove(), { once: true });
        });
    }
    
    container.appendChild(div);
}