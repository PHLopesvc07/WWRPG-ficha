/**
 * STORAGE.JS - MINISTÉRIO DA MAGIA
 * Salva e Carrega a Ficha (Import/Export JSON)
 */

import { updateSkillBonuses } from './sheet.js';
import { sortSpells, addInventoryContainer, addInventoryItem, addSpellCard } from './spells.js';
import { addPet } from './pets.js';

/**
 * ============================================================================
 * HELPER FUNCTIONS (Funções Utilitárias para Robustez e Código Limpo - DRY)
 * ============================================================================
 */
const getVal = (id) => document.getElementById(id)?.value || '';
const getCheck = (id) => document.getElementById(id)?.checked || false;
const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
const setCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };

/**
 * Inicializa os ouvintes de eventos para importação, exportação e reset da ficha.
 */
export function setupPersistence() {
    const btnExport = document.getElementById('btn-export');
    const fileImport = document.getElementById('file-import');
    const btnReset = document.getElementById('btn-reset');

    if (btnExport) btnExport.addEventListener('click', exportData);
    if (fileImport) fileImport.addEventListener('change', importData);
    
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if(confirm("Tem certeza que deseja apagar todo o registro? Esta ação é irreversível.")) {
                location.reload();
            }
        });
    }
}

/**
 * Coleta todos os dados do DOM, empacota num objeto JSON estruturado 
 * e aciona o download (ou a API File System Access) para o utilizador.
 */
async function exportData() {
    // 1. Coleta todos os dados da ficha de forma segura
    const data = {
        profile: {
            photo: document.getElementById('char-photo-preview')?.src || '',
            name: getVal('char-name'),
            blood: getVal('blood-status'),
            school: getVal('school'),
            age: getVal('age'),
            hw: getVal('height-weight'),
            languages: getVal('languages'),
            profession: getVal('profession'),
            family: getVal('family-select')
        },
        stats: {
            corpo: getVal('stat-corpo'),
            destreza: getVal('stat-destreza'),
            inteligencia: getVal('stat-inteligencia'),
            sabedoria: getVal('stat-sabedoria'),
            vitalidade: getVal('stat-vitalidade'),
            carisma: getVal('stat-carisma')
        },
        skills: Array.from(document.querySelectorAll('.skill-prof')).map(s => ({
            name: s.dataset.skill,
            value: s.value
        })),
        injuries: {
            leve: { c: getVal('inj-leve-curr'), m: getVal('inj-leve-max') },
            media: { c: getVal('inj-media-curr'), m: getVal('inj-media-max') },
            pesada: { c: getVal('inj-pesada-curr'), m: getVal('inj-pesada-max') },
            custom: Array.from(document.querySelectorAll('.custom-injury')).map(row => ({
                name: row.querySelector('.injury-name-input')?.value || '',
                c: row.querySelector('.curr')?.value || '',
                m: row.querySelector('.max')?.value || ''
            }))
        },
        magic: {
            wand: { l: getVal('wand-length'), w: getVal('wand-wood'), c: getVal('wand-core') },
            rules: [
                getVal('rule-1'), getVal('rule-2'), getVal('rule-3'), getVal('rule-4'), getVal('rule-5')
            ],
            rulesState: [
                getCheck('rule-check-1'), getCheck('rule-check-2'), getCheck('rule-check-3'), 
                getCheck('rule-check-4'), getCheck('rule-check-5')
            ],
            traits: getVal('traits-text'),
            spells: Array.from(document.querySelectorAll('.spell-card')).map(card => ({
                name: card.querySelector('.spell-name')?.value || '',
                cat: card.querySelector('.spell-cat')?.value || '',
                lvl: card.querySelector('.spell-lvl')?.value || '',
                desc: card.querySelector('.spell-desc')?.value || ''
            }))
        },
        inventory: {
            coins: { g: getVal('coin-g'), s: getVal('coin-s'), k: getVal('coin-k') },
            containers: Array.from(document.querySelectorAll('.inventory-container-card')).map(cont => ({
                name: cont.querySelector('.container-name')?.value || '',
                items: Array.from(cont.querySelectorAll('.item-row')).map(item => ({
                    qtd: item.querySelector('.item-qtd')?.value || '',
                    name: item.querySelector('.item-name')?.value || '',
                    desc: item.querySelector('.item-desc')?.value || ''
                }))
            }))
        },
        pets: Array.from(document.querySelectorAll('.pet-card')).map(card => ({
            photo: card.querySelector('.pet-photo-preview')?.src || '',
            name: card.querySelector('.pet-name')?.value || '',
            age: card.querySelector('.pet-age')?.value || '',
            size: card.querySelector('.pet-size')?.value || '',
            species: card.querySelector('.pet-species')?.value || '',
            origin: card.querySelector('.pet-origin')?.value || '',
            sex: card.querySelector('.pet-sex')?.value || '',
            classification: card.querySelector('.pet-class')?.value || '',
            license: card.querySelector('.pet-license')?.value || '',
            stats: {
                corpo: card.querySelector('.pet-corpo')?.value || 0,
                destreza: card.querySelector('.pet-destreza')?.value || 0,
                vitalidade: card.querySelector('.pet-vitalidade')?.value || 0,
                instinto: card.querySelector('.pet-instinto')?.value || 0
            },
            description: card.querySelector('.pet-desc')?.value || ''
        })),
        notes: document.getElementById('notes-editor')?.innerHTML || ''
    };

    const jsonString = JSON.stringify(data, null, 2);
    const suggestedFileName = `${data.profile.name || 'Bruxo'}_Ficha.json`;

    try {
        // Tenta usar a File System Access API (Mais moderno e limpo)
        if ('showSaveFilePicker' in window) {
            const handle = await window.showSaveFilePicker({
                suggestedName: suggestedFileName,
                types: [{
                    description: 'Arquivo JSON do Ministério',
                    accept: {'application/json': ['.json']}
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(jsonString);
            await writable.close();
            alert('Ficha carimbada e atualizada com sucesso!');
        } else {
            // Fallback para navegadores mais antigos
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = suggestedFileName;
            a.click();
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error(error);
            alert('Erro ao tentar carimbar o registro.');
        }
    }
}

/**
 * Lê o ficheiro JSON selecionado pelo utilizador, faz o parse (análise)
 * e injeta os dados de volta nos elementos visuais e lógicos do DOM.
 * @param {Event} e - Evento de alteração do input file.
 */
function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            
            // 1. Profile
            if(data.profile.photo && !data.profile.photo.includes(window.location.host)) {
                const img = document.getElementById('char-photo-preview');
                if (img) {
                    img.src = data.profile.photo;
                    // SRP: Estilos inline removidos, utilizando as classes CSS
                    img.classList.remove('hidden');
                    img.classList.add('photo-preview-active');
                }
            }
            
            setVal('char-name', data.profile.name || "");
            setVal('blood-status', data.profile.blood || "puro");
            setVal('school', data.profile.school || "");
            setVal('age', data.profile.age || "");
            setVal('height-weight', data.profile.hw || "");
            setVal('languages', data.profile.languages || "");
            setVal('profession', data.profile.profession || "");
            
            const famSelect = document.getElementById('family-select');
            if (famSelect) {
                famSelect.value = data.profile.family || "";
                famSelect.dispatchEvent(new Event('change'));
            }

            // 2. Stats
            setVal('stat-corpo', data.stats.corpo || 0);
            setVal('stat-destreza', data.stats.destreza || 0);
            setVal('stat-inteligencia', data.stats.inteligencia || 0);
            setVal('stat-sabedoria', data.stats.sabedoria || 0);
            setVal('stat-vitalidade', data.stats.vitalidade || 0);
            setVal('stat-carisma', data.stats.carisma || 0);

            // 3. Skills
            if (data.skills && Array.isArray(data.skills)) {
                data.skills.forEach(sk => {
                    const select = document.querySelector(`.skill-prof[data-skill="${sk.name}"]`);
                    if(select) select.value = sk.value;
                });
            }

            // 4. Injuries
            setVal('inj-leve-curr', data.injuries?.leve?.c || "");
            setVal('inj-leve-max', data.injuries?.leve?.m || "");
            setVal('inj-media-curr', data.injuries?.media?.c || "");
            setVal('inj-media-max', data.injuries?.media?.m || "");
            setVal('inj-pesada-curr', data.injuries?.pesada?.c || "");
            setVal('inj-pesada-max', data.injuries?.pesada?.m || "");
            
            const customInjuriesContainer = document.getElementById('custom-injuries-container');
            const btnAddInjury = document.getElementById('btn-add-injury');
            if (customInjuriesContainer && btnAddInjury && data.injuries?.custom) {
                customInjuriesContainer.innerHTML = '';
                data.injuries.custom.forEach(inj => {
                    btnAddInjury.click();
                    const last = customInjuriesContainer.lastElementChild;
                    if (last) {
                        const nameInput = last.querySelector('.injury-name-input');
                        const currInput = last.querySelector('.curr');
                        const maxInput = last.querySelector('.max');
                        
                        if (nameInput) nameInput.value = inj.name;
                        if (currInput) currInput.value = inj.c;
                        if (maxInput) maxInput.value = inj.m;
                    }
                });
            }

            // 5. Magic
            setVal('wand-length', data.magic?.wand?.l || "");
            setVal('wand-wood', data.magic?.wand?.w || "");
            setVal('wand-core', data.magic?.wand?.c || "");
            
            if (data.magic?.rules) {
                setVal('rule-1', data.magic.rules[0] || "");
                setVal('rule-2', data.magic.rules[1] || "");
                setVal('rule-3', data.magic.rules[2] || "");
                setVal('rule-4', data.magic.rules[3] || "");
                setVal('rule-5', data.magic.rules[4] || "");
            }

            if (data.magic?.rulesState) {
                setCheck('rule-check-1', data.magic.rulesState[0] || false);
                setCheck('rule-check-2', data.magic.rulesState[1] || false);
                setCheck('rule-check-3', data.magic.rulesState[2] || false);
                setCheck('rule-check-4', data.magic.rulesState[3] || false);
                setCheck('rule-check-5', data.magic.rulesState[4] || false);
            }

            setVal('traits-text', data.magic?.traits || "");

            // --- MAGIA (FEITIÇOS) ---
            const spellsList = document.getElementById('spells-list');
            if (spellsList) {
                spellsList.innerHTML = '';
                if (data.magic?.spells && Array.isArray(data.magic.spells)) {
                    data.magic.spells.forEach(sp => addSpellCard(sp));
                    sortSpells(); 
                }
            }

            // 6. Inventory
            setVal('coin-g', data.inventory?.coins?.g || 0);
            setVal('coin-s', data.inventory?.coins?.s || 0);
            setVal('coin-k', data.inventory?.coins?.k || 0);

            const inventoryList = document.getElementById('inventory-list');
            if (inventoryList && data.inventory?.containers) {
                inventoryList.innerHTML = '';
                data.inventory.containers.forEach(cont => {
                    addInventoryContainer(cont.name);
                    const lastCont = inventoryList.lastElementChild;
                    if (!lastCont) return;
                    
                    const contId = lastCont.dataset.id;
                    const itemsList = lastCont.querySelector('.items-list');
                    
                    cont.items.forEach(item => {
                        addInventoryItem(contId);
                        if (!itemsList) return;
                        
                        const lastItem = itemsList.lastElementChild;
                        if (!lastItem) return;
                        
                        const qtdInput = lastItem.querySelector('.item-qtd');
                        const nameInput = lastItem.querySelector('.item-name');
                        const descArea = lastItem.querySelector('.item-desc');
                        
                        if (qtdInput) qtdInput.value = item.qtd;
                        if (nameInput) nameInput.value = item.name;
                        if (descArea) {
                            descArea.value = item.desc;
                            descArea.dispatchEvent(new Event('input')); // Força o auto-resize
                        }
                    });
                });
            }

            // 6.5 Pets
            const petsContainer = document.getElementById('pets-container');
            if (petsContainer) {
                petsContainer.innerHTML = ''; 
                if (data.pets && Array.isArray(data.pets)) {
                    data.pets.forEach(petData => addPet(petData));
                }
            }

            // 7. Notes
            const notesEditor = document.getElementById('notes-editor');
            if (notesEditor && data.notes !== undefined) {
                notesEditor.innerHTML = data.notes;
            }

            updateSkillBonuses();
            alert('Registros importados com sucesso dos arquivos do Ministério.');
            
        } catch (error) {
            console.error(error);
            alert('Erro na leitura do arquivo. O pergaminho parece corrompido ou sob efeito de magia negra.');
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Limpa o input para permitir carregar o mesmo ficheiro em seguida, se desejado
}