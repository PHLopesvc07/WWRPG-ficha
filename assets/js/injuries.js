/**
 * INJURIES.JS - MINISTÉRIO DA MAGIA
 * Barras Visuais de Injúrias e Painel de Penalidades Automáticas
 */

const ROWS = [
    { curr: 'inj-leve-curr',   max: 'inj-leve-max',   bar: 'bar-leve',   type: 'leve'   },
    { curr: 'inj-media-curr',  max: 'inj-media-max',   bar: 'bar-media',  type: 'media'  },
    { curr: 'inj-pesada-curr', max: 'inj-pesada-max',  bar: 'bar-pesada', type: 'pesada' },
];

/**
 * Inicializa as barras de HP e o painel de penalidades para a ficha do personagem.
 */
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

// ─── Lógica interna ────────────────────────────────────────────────────────

function updateBar(currEl, maxEl, barEl, type) {
    const curr = Math.max(0, parseInt(currEl.value) || 0);
    const max  = Math.max(0, parseInt(maxEl.value)  || 0);
    const pct  = max > 0 ? Math.min((curr / max) * 100, 110) : 0; // 110% → morte

    const fill  = barEl.querySelector('.inj-fill');
    const label = barEl.querySelector('.inj-bar-label');
    if (!fill || !label) return;

    fill.style.width = Math.min(pct, 100) + '%';
    label.textContent = max > 0 ? `${curr} / ${max}` : '—';

    // Cor dinâmica baseada no preenchimento
    fill.className = 'inj-fill';
    if (pct >= 100) fill.classList.add('inj-fill--full');
    else if (pct >= 66) fill.classList.add('inj-fill--high');
    else if (pct >= 33) fill.classList.add('inj-fill--mid');
    else               fill.classList.add('inj-fill--low');
}

function updatePenalties() {
    const get = (id) => Math.max(0, parseInt(document.getElementById(id)?.value) || 0);

    const leveC   = get('inj-leve-curr'),   leveM   = get('inj-leve-max');
    const mediaC  = get('inj-media-curr'),  mediaM  = get('inj-media-max');
    const pesadaC = get('inj-pesada-curr'), pesadaM = get('inj-pesada-max');

    const warnings = [];

    // Regras do sistema (Guia Básico)
    if (mediaM > 0 && mediaC >= mediaM)
        warnings.push({ icon: '⚠', text: '-2 em todos os testes', cls: 'pen--warn' });

    if (pesadaM > 0 && pesadaC > pesadaM / 2)
        warnings.push({ icon: '⚠', text: '-1 ação por rodada', cls: 'pen--warn' });

    if (pesadaM > 0 && pesadaC >= pesadaM)
        warnings.push({ icon: '☠', text: '1 ação por turno · sem reações', cls: 'pen--crit' });

    if (leveM > 0 && leveC > leveM)
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
