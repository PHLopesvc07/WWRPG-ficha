
/**
 * SPELLS.JS - MINISTÉRIO DA MAGIA
 * Gerenciamento de Listas Dinâmicas, Ordenação, Animações e Dados de Combate
 */

// ─── Tabelas de Combate ────────────────────────────────────────────────────

const CONJ_ATTR = {
    'Transfiguração': 'Transfiguração (Carisma)',
    'Charme':        'Prática (Sabedoria)',
    'Azaração':       'DCAT (Sabedoria)',
    'Maldição Menor': 'DCAT (Sabedoria)',
    'Maldição':       'DCAT (Sabedoria)',
    'Contra-feitiço': 'Prática (Sabedoria)',
    'Cura':           'Cura (Carisma)',
};

const LEVEL_DATA = {
    1: { dice:'d20', actions:'2 ações',          ranges:{disaster:'1',    fail:'2–5',   hit:'6–15',  crit:'16–20'}, fx:{dmg:{hit:'1L / 1C',         crit:'2L / 1C'},                          def:{hit:'Bloqueia 1L / 0C',      crit:'Bloqueia 2L / 1C'},                    cure:{hit:'1L',  crit:'2L'}}},
    2: { dice:'d20', actions:'2 ações',          ranges:{disaster:'1',    fail:'2–5',   hit:'6–15',  crit:'16–20'}, fx:{dmg:{hit:'1L / 1C',         crit:'2L / 1C'},                          def:{hit:'Bloqueia 1L / 0C',      crit:'Bloqueia 2L / 1C'},                    cure:{hit:'1L',  crit:'2L'}}},
    3: { dice:'d30', actions:'3 ações',          ranges:{disaster:'1–5',  fail:'6–10',  hit:'11–25', crit:'26–30'}, fx:{dmg:{hit:'2L, 1M / 1C',     crit:'3L, 2M / 1C'},                      def:{hit:'Bloqueia 2L, 1M / 1C',  crit:'Bloqueia 3L, 2M / 1C'},                cure:{hit:'3L',  crit:'6L'}}},
    4: { dice:'d30', actions:'3 ações',          ranges:{disaster:'1–5',  fail:'6–10',  hit:'11–25', crit:'26–30'}, fx:{dmg:{hit:'2L, 1M / 1C',     crit:'3L, 2M / 1C'},                      def:{hit:'Bloqueia 2L, 1M / 1C',  crit:'Bloqueia 3L, 2M / 1C'},                cure:{hit:'3L',  crit:'6L'}}},
    5: { dice:'d40', actions:'4 ações',          ranges:{disaster:'1–10', fail:'11–20', hit:'21–35', crit:'36–40'}, fx:{dmg:{hit:'3L, 2M, 1P / 1C', crit:'4L, 3M, 2P / 2C'},                  def:{hit:'Bloq. 3L, 2M, 1P / 1C', crit:'Bloq. 4L, 3M, 2P / 2C'},              cure:{hit:'9L',  crit:'12L'}}},
    6: { dice:'d40', actions:'Todas (5)',         ranges:{disaster:'1–10', fail:'11–20', hit:'21–35', crit:'36–40'}, fx:{dmg:{hit:'4L, 3M, 2P / 2C', crit:'5L, 4M, 3P / 3C'},                  def:{hit:'Bloq. 4L, 4M, 2P / 2C', crit:'Bloq. 5L, 5M, 3P / 3C'},              cure:{hit:'15L', crit:'18L'}}},
    7: { dice:'d50', actions:'Rodada de prep.',  ranges:{disaster:'1–20', fail:'21–35', hit:'36–45', crit:'46–50'}, fx:{dmg:{hit:'4L, 3M, 3P / 2C', crit:'Morte Inst. / 5L,5M,5P / 3C'},      def:{hit:'Bloq. 2L,2M,2P / 2C',   crit:'Absoluta / 5L,5M,5P / 3C'},           cure:{hit:'24L', crit:'27L — Completa'}}},
};

function inferTipo(cat) {
    if (cat === 'Cura') return 'Cura';
    if (['Maldição', 'Maldição Menor', 'Azaração'].includes(cat)) return 'Dano';
    if (cat === 'Contra-feitiço') return 'Defesa';
    return null;
}

function renderCombatPanel(panel, cat, lvlStr) {
    const lvl  = parseInt(lvlStr) || 1;
    const ld   = LEVEL_DATA[lvl] || LEVEL_DATA[1];
    const attr = CONJ_ATTR[cat] || 'Sabedoria';

    const fxRows = [
        { key:'dmg',  label:'⚔ Dano',   color:'#c0392b' },
        { key:'def',  label:'⛊ Defesa', color:'#2980b9' },
        { key:'cure', label:'❤ Cura',   color:'#27ae60' },
    ].map(({ key, label, color }) => `<tr>
        <td style="color:${color};font-weight:bold;white-space:nowrap;padding:4px 6px;">${label}</td>
        <td style="padding:4px 6px;">${ld.fx[key].hit}</td>
        <td style="padding:4px 6px;">${ld.fx[key].crit}</td>
    </tr>`).join('');

    const fxTable = `
        <table style="width:100%;border-collapse:collapse;font-size:0.82rem;margin-top:8px;">
            <thead><tr>
                <th style="text-align:left;padding:4px 6px;border-bottom:1px solid rgba(0,0,0,0.15);font-size:0.75rem;">Tipo</th>
                <th style="text-align:left;padding:4px 6px;border-bottom:1px solid rgba(0,0,0,0.15);font-size:0.75rem;">✓ Acerto</th>
                <th style="text-align:left;padding:4px 6px;border-bottom:1px solid rgba(0,0,0,0.15);font-size:0.75rem;">★ Crítico</th>
            </tr></thead>
            <tbody>${fxRows}</tbody>
        </table>`;

    panel.innerHTML = `
        <div class="spell-combat-badges">
            <span class="spell-combat-badge">⚅ ${ld.dice}</span>
            <span class="spell-combat-badge">ϟ ${ld.actions}</span>
            <span class="spell-combat-badge">★ ${attr}</span>
        </div>
        <div class="spell-dice-grid">
            <div class="spell-dice-box s-disaster">☠ Desastre<br><strong>${ld.ranges.disaster}</strong></div>
            <div class="spell-dice-box s-fail">✗ Falha<br><strong>${ld.ranges.fail}</strong></div>
            <div class="spell-dice-box s-hit">✓ Acerto<br><strong>${ld.ranges.hit}</strong></div>
            <div class="spell-dice-box s-crit">★ Crítico<br><strong>${ld.ranges.crit}</strong></div>
        </div>
        ${fxTable}
    `;
}

// ─── setupDynamicLists ─────────────────────────────────────────────────────

export function setupDynamicLists() {
    const btnAddSpell     = document.getElementById('btn-add-spell');
    const btnAddInjury    = document.getElementById('btn-add-injury');
    const btnAddContainer = document.getElementById('btn-add-container');
    const spellImportInput = document.getElementById('spell-import');

    if (btnAddSpell) btnAddSpell.addEventListener('click', () => addSpellCard());

    document.querySelectorAll('.spell-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            const targetCat = badge.dataset.filter;
            const container = document.getElementById('spells-list');
            if (!container) return;

            const cards = Array.from(container.querySelectorAll('.spell-card'));
            const targetSpell = cards.find(card => {
                const select = card.querySelector('.spell-cat');
                return (select ? select.value : 'Charme') === targetCat;
            });

            if (targetSpell) {
                const header = targetSpell.previousElementSibling;
                if (header && header.classList.contains('spell-category-header')) {
                    header.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    targetSpell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                targetSpell.classList.add('spell-highlight');
                setTimeout(() => targetSpell.classList.remove('spell-highlight'), 800);
            }
        });
    });

    if (btnAddInjury) {
        btnAddInjury.addEventListener('click', () => {
            const container = document.getElementById('custom-injuries-container');
            if (!container) return;
            const div = document.createElement('div');
            div.className = 'injury-row custom-injury animated-fade-in';
            div.innerHTML = `
                <input type="text" class="ink-input short-input injury-name-input" placeholder="Nome" aria-label="Nome do Ferimento">
                <input type="number" class="ink-input short-input curr" aria-label="Gravidade Atual"> /
                <input type="number" class="ink-input short-input max" aria-label="Gravidade Máxima">
                <button class="delete-btn btn-delete-small" aria-label="Excluir Ferimento" title="Excluir">X</button>
            `;
            div.querySelector('.delete-btn').addEventListener('click', () => div.remove());
            container.appendChild(div);
        });
    }

    if (btnAddContainer) {
        btnAddContainer.addEventListener('click', () => addInventoryContainer('Novo Recipiente'));
    }

    if (spellImportInput) {
        spellImportInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    if (Array.isArray(data)) {
                        data.forEach(spell => addSpellCard(spell));
                        alert(`${data.length} feitiços importados com sucesso!`);
                    } else if (typeof data === 'object' && data !== null) {
                        addSpellCard(data);
                        alert(`Feitiço "${data.name || 'desconhecido'}" importado!`);
                    }
                    sortSpells();
                    spellImportInput.value = '';
                } catch (err) {
                    console.error('Erro ao importar feitiço:', err);
                    alert('Erro no arquivo: Certifique-se de que é um JSON válido do Ministério.');
                }
            };
            reader.readAsText(file);
        });
    }

    setupSpellFilter();
    addInventoryContainer('Mochila Principal');
}

// ─── addSpellCard ──────────────────────────────────────────────────────────

export function addSpellCard(data = null) {
    const container = document.getElementById('spells-list');
    if (!container) return;

    const id   = Date.now() + Math.floor(Math.random() * 10000);
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
                <option value="Charme" selected>Charme</option>
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
            <select class="ink-select spell-tipo" aria-label="Tipo de Efeito">
                <option value="">— Tipo —</option>
                <option value="Dano">Dano</option>
                <option value="Defesa">Defesa</option>
                <option value="Cura">Cura</option>
                <option value="Utilitário">Utilitário</option>
            </select>
        </div>
        <textarea class="ink-textarea spell-desc" placeholder="Descrição do efeito..." aria-label="Descrição do Feitiço"></textarea>
        <button type="button" class="btn-combat-toggle btn-teal">⚔ Dados de Combate</button>
        <div class="spell-combat-panel" style="display:none;"></div>
    `;

    // Preenche dados ao importar
    if (data) {
        card.querySelector('.spell-name').value = data.name || '';
        card.querySelector('.spell-desc').value = data.desc || '';
        card.querySelector('.spell-lvl').value  = data.lvl  || '1';
        card.querySelector('.spell-tipo').value = data.tipo || '';
        const catValue = Array.isArray(data.cat) ? data.cat[0] : data.cat;
        card.querySelector('.spell-cat').value  = catValue || 'Charme';
    }

    // Painel de combate
    const catSel  = card.querySelector('.spell-cat');
    const lvlSel  = card.querySelector('.spell-lvl');
    const tipoSel = card.querySelector('.spell-tipo');
    const panel   = card.querySelector('.spell-combat-panel');
    const toggle  = card.querySelector('.btn-combat-toggle');

    const updatePanel = () => renderCombatPanel(panel, catSel.value, lvlSel.value);

    toggle.addEventListener('click', () => {
        const open = panel.style.display === 'none';
        panel.style.display = open ? 'block' : 'none';
        toggle.textContent  = open ? '✕ Fechar Dados' : '⚔ Dados de Combate';
        if (open) updatePanel();
    });

    catSel.addEventListener('change', () => { if (panel.style.display !== 'none') updatePanel(); });
    lvlSel.addEventListener('change', () => { if (panel.style.display !== 'none') updatePanel(); });

    // Remoção com animação
    card.querySelector('.delete-btn').addEventListener('click', () => {
        card.classList.add('spell-card-exit');
        card.addEventListener('animationend', () => { card.remove(); sortSpells(); }, { once: true });
    });

    catSel.addEventListener('change', sortSpells);
    lvlSel.addEventListener('change', sortSpells);

    container.appendChild(card);
    if (!data) sortSpells();
}

// ─── sortSpells ────────────────────────────────────────────────────────────

export function sortSpells() {
    const container = document.getElementById('spells-list');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.spell-card'));
    container.querySelectorAll('.spell-category-header').forEach(h => h.remove());

    const catConfig = {
        'Transfiguração': { order:1, class:'cat-transfiguracao', headerClass:'header-transfiguracao', label:'Transfiguração' },
        'Charme':        { order:2, class:'cat-charme',        headerClass:'header-charme',        label:'Charme'         },
        'Azaração':       { order:3, class:'cat-azaracao',       headerClass:'header-azaracao',       label:'Azaração'       },
        'Maldição Menor': { order:4, class:'cat-maldicao-menor', headerClass:'header-maldicao-menor', label:'Maldição Menor' },
        'Maldição':       { order:5, class:'cat-maldicao',       headerClass:'header-maldicao',       label:'Maldição'       },
        'Contra-feitiço': { order:6, class:'cat-contra-feitico', headerClass:'header-contra-feitico', label:'Contra-feitiço' },
        'Cura':           { order:7, class:'cat-cura',           headerClass:'header-cura',           label:'Cura'           },
    };

    cards.sort((a, b) => {
        const catA = a.querySelector('.spell-cat').value || 'Charme';
        const catB = b.querySelector('.spell-cat').value || 'Charme';
        const oA   = catConfig[catA]?.order ?? 99;
        const oB   = catConfig[catB]?.order ?? 99;
        if (oA !== oB) return oA - oB;
        return (parseInt(a.querySelector('.spell-lvl').value) || 1) - (parseInt(b.querySelector('.spell-lvl').value) || 1);
    });

    const counts = Object.fromEntries(Object.keys(catConfig).map(k => [k, 0]));
    let currentCategory = null;

    cards.forEach(card => {
        const cat = card.querySelector('.spell-cat').value || 'Charme';
        Object.values(catConfig).forEach(c => card.classList.remove(c.class));
        if (catConfig[cat]) card.classList.add(catConfig[cat].class);
        if (counts[cat] !== undefined) counts[cat]++;

        if (cat !== currentCategory) {
            currentCategory = cat;
            const header = document.createElement('div');
            header.className = `spell-category-header ${catConfig[cat].headerClass}`;
            header.innerHTML = `✦ ${catConfig[cat].label}`;
            container.appendChild(header);
        }

        container.appendChild(card);

        if (card.dataset.newlyCreated === 'true') {
            delete card.dataset.newlyCreated;
            void card.offsetHeight;
            card.classList.add('spell-animate-entrance');
            card.addEventListener('animationend', () => card.classList.remove('spell-animate-entrance'), { once: true });
        }
    });

    const countEl = document.getElementById('total-spells-count');
    if (countEl) countEl.innerText = `${cards.length} registrado(s)`;

    document.querySelectorAll('.spell-badge').forEach(badge => {
        const cat      = badge.dataset.filter;
        const countSpan = badge.querySelector('.count');
        if (countSpan) countSpan.innerText = `(${counts[cat] ?? 0})`;
        badge.classList.toggle('badge-inactive', !counts[cat]);
    });

    filterSpells();
}

// ─── Filtro de Feitiços ────────────────────────────────────────────────────

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

    container.querySelectorAll('.spell-card').forEach(card => {
        const name = (card.querySelector('.spell-name')?.value || '').toLowerCase();
        const desc = (card.querySelector('.spell-desc')?.value || '').toLowerCase();
        const cardLvl = card.querySelector('.spell-lvl')?.value || '';
        const matchSearch = !search || name.includes(search) || desc.includes(search);
        const matchLvl    = !lvl    || cardLvl === lvl;
        card.style.display = (matchSearch && matchLvl) ? '' : 'none';
    });

    container.querySelectorAll('.spell-category-header').forEach(header => {
        let next = header.nextElementSibling;
        let hasVisible = false;
        while (next && !next.classList.contains('spell-category-header')) {
            if (next.classList.contains('spell-card') && next.style.display !== 'none') { hasVisible = true; break; }
            next = next.nextElementSibling;
        }
        header.style.display = hasVisible ? '' : 'none';
    });
}

// ─── Inventário ────────────────────────────────────────────────────────────

export function addInventoryContainer(name = 'Novo Recipiente') {
    const container = document.getElementById('inventory-list');
    if (!container) return;

    const id   = Date.now() + Math.floor(Math.random() * 1000);
    const card = document.createElement('div');
    card.className = 'bureaucracy-box inventory-container-card animate-entrance';
    card.dataset.id = id;
    card.innerHTML = `
        <button class="delete-btn" aria-label="Excluir Recipiente" title="Excluir Recipiente">X</button>
        <input type="text" class="ink-input container-name container-name-input" aria-label="Nome do Recipiente">
        <div class="items-list items-list-flex"></div>
        <button class="btn-teal add-item-btn btn-add-item-small">+ Adicionar Item</button>
    `;
    card.querySelector('.container-name').value = name;
    card.querySelector('.delete-btn').addEventListener('click', () => {
        card.classList.replace('animate-entrance', 'animate-exit');
        card.addEventListener('animationend', () => card.remove(), { once: true });
    });
    card.querySelector('.add-item-btn').addEventListener('click', () => addInventoryItem(id));
    container.appendChild(card);
}

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

    div.querySelector('.item-qtd').addEventListener('change', function() { if (this.value > 100) this.value = 100; });

    const descArea = div.querySelector('.item-desc');
    descArea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    div.querySelector('.btn-danger').addEventListener('click', () => {
        div.classList.replace('animate-entrance', 'animate-exit');
        div.addEventListener('animationend', () => div.remove(), { once: true });
    });

    container.appendChild(div);
}