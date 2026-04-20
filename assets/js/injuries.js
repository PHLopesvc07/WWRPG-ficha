
/**
 * INJURIES.JS - MINISTÉRIO DA MAGIA
 * Barras Visuais de Injúrias e Painel de Penalidades Automáticas
 */

const ROWS = [
    { curr: 'inj-leve-curr',   max: 'inj-leve-max',   bar: 'bar-leve',   type: 'leve'   },
    { curr: 'inj-media-curr',  max: 'inj-media-max',   bar: 'bar-media',  type: 'media'  },
    { curr: 'inj-pesada-curr', max: 'inj-pesada-max',  bar: 'bar-pesada', type: 'pesada' },
];

export function setupInjuryBars() {
    ROWS.forEach(({ curr, max, bar, type }) => {
        const currEl = document.getElementById(curr);
        const maxEl  = document.getElementById(max);
        const barEl  = document.getElementById(bar);
        if (!currEl || !maxEl || !barEl) return;

        const update = () => { updateBar(currEl, maxEl, barEl, type); updatePenalties(); };
        currEl.addEventListener('input', update);
        maxEl.addEventListener('input',  update);
        update();
    });
}

// ─── Barras para Pets (escopo por card) ───────────────────────────────────

export function setupPetInjuryBars(card) {
    const rows = [
        { curr: '.pet-inj-leve-curr',   max: '.pet-inj-leve-max',   bar: '.bar-pet-leve'   },
        { curr: '.pet-inj-media-curr',  max: '.pet-inj-media-max',  bar: '.bar-pet-media'  },
        { curr: '.pet-inj-pesada-curr', max: '.pet-inj-pesada-max', bar: '.bar-pet-pesada' },
    ];

    rows.forEach(({ curr, max, bar }) => {
        const currEl = card.querySelector(curr);
        const maxEl  = card.querySelector(max);
        const barEl  = card.querySelector(bar);
        if (!currEl || !maxEl || !barEl) return;

        const update = () => { updateBar(currEl, maxEl, barEl); updatePetPenalties(card); };
        currEl.addEventListener('input', update);
        maxEl.addEventListener('input',  update);
        update();
    });
}

function updatePetPenalties(card) {
    const get = (sel) => Math.max(0, parseInt(card.querySelector(sel)?.value) || 0);

    const leveC   = get('.pet-inj-leve-curr'),   leveM   = get('.pet-inj-leve-max');
    const mediaC  = get('.pet-inj-media-curr'),  mediaM  = get('.pet-inj-media-max');
    const pesadaC = get('.pet-inj-pesada-curr'), pesadaM = get('.pet-inj-pesada-max');

    const warnings = [];

    if (mediaM > 0 && mediaC >= mediaM)
        warnings.push({ icon: '⚠', text: '-2 em todos os testes', cls: 'pen--warn' });
    if (pesadaM > 0 && pesadaC > pesadaM / 2)
        warnings.push({ icon: '⚠', text: '-1 ação por rodada', cls: 'pen--warn' });
    if (pesadaM > 0 && pesadaC >= pesadaM)
        warnings.push({ icon: '☠', text: '1 ação · sem reações', cls: 'pen--crit' });

    const todasCheias = (leveM > 0 && leveC >= leveM)
                     && (mediaM > 0 && mediaC >= mediaM)
                     && (pesadaM > 0 && pesadaC >= pesadaM);
    const algumTransb = leveC > leveM || mediaC > mediaM || pesadaC > pesadaM;

    if (todasCheias && algumTransb)
        warnings.push({ icon: '💀', text: 'MORTE', cls: 'pen--death' });

    const panel = card.querySelector('.pet-injury-penalties');
    if (!panel) return;

    panel.style.display  = warnings.length ? 'flex' : 'none';
    panel.innerHTML      = warnings.length
        ? warnings.map(w => `<span class="penalty-tag ${w.cls}">${w.icon} ${w.text}</span>`).join('')
        : '';
}

function updateBar(currEl, maxEl, barEl, type) {
    const curr = Math.max(0, parseInt(currEl.value) || 0);
    const max  = Math.max(0, parseInt(maxEl.value)  || 0);
    const pct  = max > 0 ? (curr / max) * 100 : 0;

    const fill  = barEl.querySelector('.inj-fill');
    const label = barEl.querySelector('.inj-bar-label');
    if (!fill || !label) return;

    fill.style.width = Math.min(pct, 100) + '%';
    label.textContent = max > 0 ? `${curr} / ${max}` : '—';

    fill.className = 'inj-fill';
    if (pct >= 100)     fill.classList.add('inj-fill--full');
    else if (pct >= 66) fill.classList.add('inj-fill--high');
    else if (pct >= 33) fill.classList.add('inj-fill--mid');
    else                fill.classList.add('inj-fill--low');
}

function updatePenalties() {
    const get = (id) => Math.max(0, parseInt(document.getElementById(id)?.value) || 0);

    const leveC   = get('inj-leve-curr'),   leveM   = get('inj-leve-max');
    const mediaC  = get('inj-media-curr'),  mediaM  = get('inj-media-max');
    const pesadaC = get('inj-pesada-curr'), pesadaM = get('inj-pesada-max');

    const warnings = [];

    if (mediaM > 0 && mediaC >= mediaM)
        warnings.push({ icon: '⚠', text: '-2 em todos os testes', cls: 'pen--warn' });

    if (pesadaM > 0 && pesadaC > pesadaM / 2)
        warnings.push({ icon: '⚠', text: '-1 ação por rodada', cls: 'pen--warn' });

    if (pesadaM > 0 && pesadaC >= pesadaM)
        warnings.push({ icon: '☠', text: '1 ação por turno · sem reações', cls: 'pen--crit' });

    // Morte: todas as categorias cheias E qualquer uma transbordando
    const todasCheias  = (leveM > 0 && leveC >= leveM)
                      && (mediaM > 0 && mediaC >= mediaM)
                      && (pesadaM > 0 && pesadaC >= pesadaM);
    const algumTransb  = leveC > leveM || mediaC > mediaM || pesadaC > pesadaM;

    if (todasCheias && algumTransb)
        warnings.push({ icon: '💀', text: 'MORTE', cls: 'pen--death' });

    const panel = document.getElementById('injury-penalties');
    if (!panel) return;

    if (warnings.length === 0) {
        panel.style.display = 'none';
        panel.innerHTML = '';
        return;
    }

    panel.style.display = 'flex';
    panel.innerHTML = warnings.map(w =>
        `<span class="penalty-tag ${w.cls}">${w.icon} ${w.text}</span>`
    ).join('');
}