/**
 * STORAGE.JS - MINISTÉRIO DA MAGIA
 * Salva e Carrega a Ficha (Import/Export JSON)
 */

import { updateSkillBonuses } from './sheet.js';
import { sortSpells, addInventoryContainer, addInventoryItem } from './spells.js';

export function setupPersistence() {
    document.getElementById('btn-export').addEventListener('click', exportData);
    document.getElementById('file-import').addEventListener('change', importData);
    document.getElementById('btn-reset').addEventListener('click', () => {
        if(confirm("Tem certeza que deseja apagar todo o registro? Esta ação é irreversível.")) {
            location.reload();
        }
    });
}

async function exportData() {
    // 1. Coleta todos os dados da ficha
    const data = {
        profile: {
            photo: document.getElementById('char-photo-preview').src,
            name: document.getElementById('char-name').value,
            blood: document.getElementById('blood-status').value,
            school: document.getElementById('school').value,
            age: document.getElementById('age').value,
            hw: document.getElementById('height-weight').value,
            languages: document.getElementById('languages').value,
            profession: document.getElementById('profession').value,
            family: document.getElementById('family-select').value
        },
        stats: {
            corpo: document.getElementById('stat-corpo').value,
            destreza: document.getElementById('stat-destreza').value,
            inteligencia: document.getElementById('stat-inteligencia').value,
            sabedoria: document.getElementById('stat-sabedoria').value,
            vitalidade: document.getElementById('stat-vitalidade').value,
            carisma: document.getElementById('stat-carisma').value,
        },
        skills: Array.from(document.querySelectorAll('.skill-prof')).map(s => ({
            name: s.dataset.skill,
            value: s.value
        })),
        injuries: {
            leve: { c: document.getElementById('inj-leve-curr').value, m: document.getElementById('inj-leve-max').value },
            media: { c: document.getElementById('inj-media-curr').value, m: document.getElementById('inj-media-max').value },
            pesada: { c: document.getElementById('inj-pesada-curr').value, m: document.getElementById('inj-pesada-max').value },
            custom: Array.from(document.querySelectorAll('.custom-injury')).map(row => ({
                name: row.querySelector('input[type="text"]').value,
                c: row.querySelector('.curr').value,
                m: row.querySelector('.max').value
            }))
        },
        magic: {
            wand: { l: document.getElementById('wand-length').value, w: document.getElementById('wand-wood').value, c: document.getElementById('wand-core').value },
            
            // Salvando as Regras Pessoais
            rules: [
                document.getElementById('rule-1').value,
                document.getElementById('rule-2').value,
                document.getElementById('rule-3').value,
                document.getElementById('rule-4').value,
                document.getElementById('rule-5').value
            ],
            
            // NOVO: Salvando se a caixinha está marcada (true) ou não (false)
            rulesState: [
                document.getElementById('rule-check-1').checked,
                document.getElementById('rule-check-2').checked,
                document.getElementById('rule-check-3').checked,
                document.getElementById('rule-check-4').checked,
                document.getElementById('rule-check-5').checked
            ],
            
            traits: document.getElementById('traits-text').value,
            spells: Array.from(document.querySelectorAll('.spell-card')).map(card => ({
                name: card.querySelector('.spell-name').value,
                cat: card.querySelector('.spell-cat').value,
                lvl: card.querySelector('.spell-lvl').value,
                desc: card.querySelector('.spell-desc').value
            }))
        },
        inventory: {
            coins: { g: document.getElementById('coin-g').value, s: document.getElementById('coin-s').value, k: document.getElementById('coin-k').value },
            containers: Array.from(document.querySelectorAll('.inventory-container-card')).map(cont => ({
                name: cont.querySelector('.container-name').value,
                items: Array.from(cont.querySelectorAll('.item-row')).map(item => ({
                    qtd: item.querySelector('.item-qtd').value,
                    name: item.querySelector('.item-name').value,
                    desc: item.querySelector('.item-desc').value
                }))
            }))
        },
        notes: document.getElementById('notes-editor').innerHTML
    };

    const jsonString = JSON.stringify(data, null, 2);
    const suggestedFileName = `${data.profile.name || 'Bruxo'}_Ficha.json`;

    try {
        // 2. Tenta usar a API moderna para "Salvar e Substituir"
        if ('showSaveFilePicker' in window) {
            const handle = await window.showSaveFilePicker({
                suggestedName: suggestedFileName,
                types: [{
                    description: 'Arquivo JSON do Ministério',
                    accept: {'application/json': ['.json']}
                }]
            });
            
            // Abre o arquivo para escrita e substitui o conteúdo
            const writable = await handle.createWritable();
            await writable.write(jsonString);
            await writable.close();
            
            alert('Ficha carimbada e atualizada com sucesso!');
        } else {
            // 3. Fallback (Plano B) para celulares ou navegadores antigos
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = suggestedFileName;
            a.click();
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        // Ignora o erro se o usuário apenas fechou a janela de salvar sem concluir
        if (error.name !== 'AbortError') {
            console.error(error);
            alert('Erro ao tentar carimbar o registro.');
        }
    }
}

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
                img.src = data.profile.photo;
                img.style.display = 'block';
                img.style.maxWidth = '150px';
                img.style.border = '2px solid var(--ink)';
            }
            document.getElementById('char-name').value = data.profile.name || "";
            document.getElementById('blood-status').value = data.profile.blood || "puro";
            document.getElementById('school').value = data.profile.school || "";
            document.getElementById('age').value = data.profile.age || "";
            document.getElementById('height-weight').value = data.profile.hw || "";
            document.getElementById('languages').value = data.profile.languages || "";
            document.getElementById('profession').value = data.profile.profession || "";
            
            const famSelect = document.getElementById('family-select');
            famSelect.value = data.profile.family || "";
            famSelect.dispatchEvent(new Event('change'));

            // 2. Stats
            document.getElementById('stat-corpo').value = data.stats.corpo || 0;
            document.getElementById('stat-destreza').value = data.stats.destreza || 0;
            document.getElementById('stat-inteligencia').value = data.stats.inteligencia || 0;
            document.getElementById('stat-sabedoria').value = data.stats.sabedoria || 0;
            document.getElementById('stat-vitalidade').value = data.stats.vitalidade || 0;
            document.getElementById('stat-carisma').value = data.stats.carisma || 0;

            // 3. Skills
            data.skills.forEach(sk => {
                const select = document.querySelector(`.skill-prof[data-skill="${sk.name}"]`);
                if(select) select.value = sk.value;
            });

            // 4. Injuries
            document.getElementById('inj-leve-curr').value = data.injuries.leve.c || "";
            document.getElementById('inj-leve-max').value = data.injuries.leve.m || "";
            document.getElementById('inj-media-curr').value = data.injuries.media.c || "";
            document.getElementById('inj-media-max').value = data.injuries.media.m || "";
            document.getElementById('inj-pesada-curr').value = data.injuries.pesada.c || "";
            document.getElementById('inj-pesada-max').value = data.injuries.pesada.m || "";
            
            document.getElementById('custom-injuries-container').innerHTML = '';
            data.injuries.custom.forEach(inj => {
                document.getElementById('btn-add-injury').click();
                const last = document.getElementById('custom-injuries-container').lastElementChild;
                last.querySelector('input[type="text"]').value = inj.name;
                last.querySelector('.curr').value = inj.c;
                last.querySelector('.max').value = inj.m;
            });

            // 5. Magic
            document.getElementById('wand-length').value = data.magic.wand.l || "";
            document.getElementById('wand-wood').value = data.magic.wand.w || "";
            document.getElementById('wand-core').value = data.magic.wand.c || "";
            
            // Carregando as Regras Pessoais (com fallback se o arquivo antigo não as tiver)
            if (data.magic.rules) {
                document.getElementById('rule-1').value = data.magic.rules[0] || "";
                document.getElementById('rule-2').value = data.magic.rules[1] || "";
                document.getElementById('rule-3').value = data.magic.rules[2] || "";
                document.getElementById('rule-4').value = data.magic.rules[3] || "";
                document.getElementById('rule-5').value = data.magic.rules[4] || "";
            }

            // NOVO: Restaurando o estado das caixinhas (checkbox)
            if (data.magic.rulesState) {
                document.getElementById('rule-check-1').checked = data.magic.rulesState[0] || false;
                document.getElementById('rule-check-2').checked = data.magic.rulesState[1] || false;
                document.getElementById('rule-check-3').checked = data.magic.rulesState[2] || false;
                document.getElementById('rule-check-4').checked = data.magic.rulesState[3] || false;
                document.getElementById('rule-check-5').checked = data.magic.rulesState[4] || false;
            }

            document.getElementById('traits-text').value = data.magic.traits || "";

            document.getElementById('spells-list').innerHTML = '';
            data.magic.spells.forEach(sp => {
                document.getElementById('btn-add-spell').click();
                const last = document.getElementById('spells-list').lastElementChild;
                
                const setVal = (selector, val) => {
                    if (last.querySelector(selector)) last.querySelector(selector).value = val || "";
                };

                setVal('.spell-name', sp.name);
                setVal('.spell-lvl', sp.lvl);
                setVal('.spell-desc', sp.desc);

                const catSelect = last.querySelector('.spell-cat');
                if (catSelect) {
                    if (Array.isArray(sp.cat)) {
                        catSelect.value = sp.cat[0] || "Feitiço";
                    } else {
                        catSelect.value = sp.cat || "Feitiço";
                    }
                }
            });
            sortSpells();

            // 6. Inventory
            document.getElementById('coin-g').value = data.inventory.coins.g || 0;
            document.getElementById('coin-s').value = data.inventory.coins.s || 0;
            document.getElementById('coin-k').value = data.inventory.coins.k || 0;

            document.getElementById('inventory-list').innerHTML = '';
            data.inventory.containers.forEach(cont => {
                addInventoryContainer(cont.name);
                const lastCont = document.getElementById('inventory-list').lastElementChild;
                const contId = lastCont.dataset.id;
                
                cont.items.forEach(item => {
                    addInventoryItem(contId);
                    const lastItem = lastCont.querySelector('.items-list').lastElementChild;
                    lastItem.querySelector('.item-qtd').value = item.qtd;
                    lastItem.querySelector('.item-name').value = item.name;
                    lastItem.querySelector('.item-desc').value = item.desc;
                });
            });

            // 7. Notes
            if (data.notes !== undefined) {
                document.getElementById('notes-editor').innerHTML = data.notes;
            }

            updateSkillBonuses();
            alert('Registros importados com sucesso dos arquivos do Ministério.');
            
        } catch (error) {
            console.error(error);
            alert('Erro na leitura do arquivo. O pergaminho parece corrompido ou sob efeito de magia negra.');
        }
    };
    reader.readAsText(file);
    e.target.value = ''; 
}
