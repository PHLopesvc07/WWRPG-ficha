/**
 * PETS.JS - MINISTÉRIO DA MAGIA
 * Gerenciamento de Animais de Estimação e Integração com Magizoologista
 */

/**
 * Inicializa o ouvinte de eventos para o botão principal de adicionar animais.
 */
export function setupPets() {
    const btnAddPet = document.getElementById('btn-add-pet');
    if (btnAddPet) {
        btnAddPet.addEventListener('click', () => addPet());
    }
}

/**
 * Cria um novo card de animal. 
 * @param {Object|null} data - Dados vindos do Magizoologista ou nulo para novo registo.
 */
export function addPet(data = null) {
    const container = document.getElementById('pets-container');
    if (!container) return;

    const currentPets = container.querySelectorAll('.pet-card').length;

    // Regra: Limite de 3 animais (Artigo 73 do Estatuto de Sigilo)
    if (currentPets >= 3 && !data) {
        alert("Aviso do Departamento para Regulamentação de Criaturas: Limite máximo atingido.");
        return;
    }

    const petId = Date.now() + Math.floor(Math.random() * 1000);
    const card = document.createElement('div');
    
    card.className = 'bureaucracy-box pet-card animated-fade-in';
    card.dataset.id = petId;
    
    // Template com mapeamento de campos do Magizoologista
    card.innerHTML = `
        <button class="delete-btn" aria-label="Remover Registro" title="Remover Registro">X</button>
        
        <div class="pet-import-zone">
             <label for="import-magi-${petId}" class="btn-import-magi" title="Importar arquivo .json do Magizoologista">
                📥 Importar do Magizoologista
             </label>
             <input type="file" id="import-magi-${petId}" class="magi-import-input" accept=".json" style="display:none;">
        </div>

        <h4 class="pet-card-title">- REGISTRO DE ANIMAL -</h4>
        
        <div class="pet-main-info-flex">
            <div class="pet-photo-container">
                <img class="pet-photo-preview ${data?.photo || data?.fotoBase64 ? 'photo-preview-active' : 'hidden'}" 
                     src="${data?.photo || data?.fotoBase64 || ''}" alt="Foto do Animal">
                <label for="pet-photo-${petId}" class="upload-label pet-upload-label" tabindex="0">Anexar Foto</label>
                <input type="file" id="pet-photo-${petId}" class="pet-photo-input hidden" accept="image/*" tabindex="-1">
            </div>
            
            <div class="pet-details-col">
                <div class="pet-form-row">
                    <label class="pet-label-name">Nome: 
                        <input type="text" class="ink-input pet-name" value="${data?.name || data?.nome || ''}">
                    </label>
                    <label class="pet-label-age">Idade: 
                        <input type="number" class="ink-input short-input pet-age" value="${data?.age || ''}">
                    </label>
                    <label class="pet-label-size">Tam/Peso: 
                        <input type="text" class="ink-input pet-size" value="${data?.size || (data?.tamanho ? data.tamanho + ' / ' + data.peso : '') || ''}">
                    </label>
                </div>
                
                <div class="pet-form-row">
                    <label class="pet-label-species">Espécie: 
                        <input type="text" class="ink-input pet-species" value="${data?.species || data?.nome || ''}">
                    </label>
                    <label class="pet-label-origin">Origem:
                        <select class="ink-select pet-origin">
                            <option value="Mágica" ${data?.origin === 'Mágica' || data?.origem === 'Mágica' ? 'selected' : ''}>Mágica</option>
                            <option value="Não Mágica" ${data?.origin === 'Não Mágica' || data?.origem === 'Não Mágica' ? 'selected' : ''}>Não Mágica</option>
                            <option value="Desconhecida" ${data?.origin === 'Desconhecida' ? 'selected' : ''}>Desconhecida</option>
                        </select>
                    </label>
                    <label class="pet-label-sex">Sexo:
                        <select class="ink-select pet-sex">
                            <option value="Não aplicável" ${data?.sex === 'Não aplicável' ? 'selected' : ''}>Não aplic.</option>
                            <option value="Fêmea" ${data?.sex === 'Fêmea' ? 'selected' : ''}>Fêmea</option>
                            <option value="Macho" ${data?.sex === 'Macho' ? 'selected' : ''}>Macho</option>
                        </select>
                    </label>
                </div>
                
                <div class="pet-form-row">
                    <label class="pet-label-class">Classif. Ministerial:
                        <select class="ink-select pet-class">
                            <option value="X" ${data?.classification === 'X' || data?.classificacao === 'X' ? 'selected' : ''}>X (Tedioso)</option>
                            <option value="XX" ${data?.classification === 'XX' || data?.classificacao === 'XX' ? 'selected' : ''}>XX (Inofensivo)</option>
                            <option value="XXX" ${data?.classification === 'XXX' || data?.classificacao === 'XXX' ? 'selected' : ''}>XXX (Bruxo competente)</option>
                            <option value="XXXX" ${data?.classification === 'XXXX' || data?.classificacao === 'XXXX' ? 'selected' : ''}>XXXX (Perigoso)</option>
                            <option value="XXXXX" ${data?.classification === 'XXXXX' || data?.classificacao === 'XXXXX' ? 'selected' : ''}>XXXXX (Mata bruxos)</option>
                        </select>
                    </label>
                    <label class="pet-label-license">Licença Ministerial:
                        <select class="ink-select pet-license">
                            <option value="Inválida" ${data?.license === 'Inválida' || data?.licenca === 'Inválida' ? 'selected' : ''}>Inválida</option>
                            <option value="Em falta" ${data?.license === 'Em falta' || data?.licenca === 'Em falta' ? 'selected' : ''}>Em falta</option>
                            <option value="Vigente" ${data?.license === 'Vigente' || data?.licenca === 'Vigente' ? 'selected' : ''}>Vigente</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>

        <div class="pet-stats-section">
            <h5 class="pet-stats-title">Atributos Base</h5>
            <div class="stats-grid pet-stats-grid">
                <label>Corpo: <input type="number" class="ink-input pet-corpo" value="${data?.stats?.corpo || data?.atributos?.corpo || 0}"></label>
                <label>Destreza: <input type="number" class="ink-input pet-destreza" value="${data?.stats?.destreza || data?.atributos?.destreza || 0}"></label>
                <label>Vitalidade: <input type="number" class="ink-input pet-vitalidade" value="${data?.stats?.vitalidade || data?.atributos?.vitalidade || 0}"></label>
                <label>Instinto: <input type="number" class="ink-input pet-instinto" value="${data?.stats?.instinto || data?.atributos?.instinto || 0}"></label>
            </div>
        </div>

        <textarea class="ink-textarea pet-desc" placeholder="Descrição, comportamento e notas...">${data?.description || data?.descricao || ''}</textarea>
    `;

    // Lógica de Importação via Ficheiro JSON
    const importInput = card.querySelector(`#import-magi-${petId}`);
    if (importInput) {
        importInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const magiData = JSON.parse(event.target.result);
                    card.remove(); // Remove o card atual (vazio)
                    addPet(magiData); // Reconstrói com os dados importados
                } catch (err) {
                    alert("Erro ao ler o ficheiro ministerial. Certifique-se que é um JSON válido.");
                }
            };
            reader.readAsText(file);
        });
    }

    // Lógica para Upload Manual da Foto do Pet
    const photoInput = card.querySelector(`#pet-photo-${petId}`);
    const imgPreview = card.querySelector('.pet-photo-preview');
    if (photoInput && imgPreview) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    imgPreview.src = ev.target.result;
                    imgPreview.classList.remove('hidden');
                    imgPreview.classList.add('photo-preview-active');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Botão de Remoção (Com animação)
    card.querySelector('.delete-btn').addEventListener('click', () => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => card.remove(), 300);
    });

    container.appendChild(card);
}