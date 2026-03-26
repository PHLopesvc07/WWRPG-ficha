/**
 * PETS.JS - MINISTÉRIO DA MAGIA
 * Gerenciamento de Animais de Estimação / Familiares
 */

/**
 * Inicializa o ouvinte de eventos para adicionar novos animais à ficha.
 */
export function setupPets() {
    const btnAddPet = document.getElementById('btn-add-pet');
    if (btnAddPet) {
        btnAddPet.addEventListener('click', () => addPet());
    }
}

/**
 * Cria e injeta o cartão de registro de um novo animal mágico.
 * @param {Object|null} data - Dados do animal para carregamento (Load do JSON). Se null, cria vazio.
 */
export function addPet(data = null) {
    const container = document.getElementById('pets-container');
    if (!container) return; // Defensiva: Garante que o container existe

    const currentPets = container.querySelectorAll('.pet-card').length;

    // Regra de Negócio: Limite de 3 animais
    if (currentPets >= 3) {
        alert("Aviso do Departamento para Regulamentação de Criaturas: Limite máximo atingido.");
        return;
    }

    const petId = Date.now() + Math.floor(Math.random() * 1000);
    const card = document.createElement('div');
    
    // SRP Aplicado: O fundo amarelo claro e os paddings foram movidos para a classe CSS .pet-card
    card.className = 'bureaucracy-box pet-card animated-fade-in';
    card.dataset.id = petId;
    
    card.innerHTML = `
        <button class="delete-btn" aria-label="Remover Registro de Animal" title="Remover Registro">X</button>
        <h4 class="pet-card-title">- REGISTRO DE ANIMAL -</h4>
        
        <div class="pet-main-info-flex">
            
            <div class="pet-photo-container">
                <img class="pet-photo-preview ${data?.photo ? 'photo-preview-active' : 'hidden'}" src="${data?.photo || ''}" alt="Foto do Animal">
                <label for="pet-photo-${petId}" class="upload-label pet-upload-label" tabindex="0">Anexar Foto</label>
                <input type="file" id="pet-photo-${petId}" class="pet-photo-input hidden" accept="image/*" tabindex="-1">
            </div>
            
            <div class="pet-details-col">
                
                <div class="pet-form-row">
                    <label class="pet-label-name">Nome: 
                        <input type="text" class="ink-input pet-name" value="${data?.name || ''}" aria-label="Nome do Animal">
                    </label>
                    <label class="pet-label-age">Idade: 
                        <input type="number" class="ink-input short-input pet-age" value="${data?.age || ''}" aria-label="Idade do Animal">
                    </label>
                    <label class="pet-label-size">Tamanho/Peso: 
                        <input type="text" class="ink-input pet-size" value="${data?.size || ''}" aria-label="Tamanho ou Peso do Animal">
                    </label>
                </div>
                
                <div class="pet-form-row">
                    <label class="pet-label-species">Espécie: 
                        <input type="text" class="ink-input pet-species" value="${data?.species || ''}" aria-label="Espécie do Animal">
                    </label>
                    <label class="pet-label-origin">Origem:
                        <select class="ink-select pet-origin" aria-label="Origem do Animal">
                            <option value="Mágica" ${data?.origin === 'Mágica' ? 'selected' : ''}>Mágica</option>
                            <option value="Não Mágica" ${data?.origin === 'Não Mágica' ? 'selected' : ''}>Não Mágica</option>
                            <option value="Desconhecida" ${data?.origin === 'Desconhecida' ? 'selected' : ''}>Desconhecida</option>
                        </select>
                    </label>
                    <label class="pet-label-sex">Sexo:
                        <select class="ink-select pet-sex" aria-label="Sexo do Animal">
                            <option value="Não aplicável" ${data?.sex === 'Não aplicável' ? 'selected' : ''}>Não aplic.</option>
                            <option value="Fêmea" ${data?.sex === 'Fêmea' ? 'selected' : ''}>Fêmea</option>
                            <option value="Macho" ${data?.sex === 'Macho' ? 'selected' : ''}>Macho</option>
                        </select>
                    </label>
                </div>
                
                <div class="pet-form-row">
                    <label class="pet-label-class">Classif. Ministerial:
                        <select class="ink-select pet-class" aria-label="Classificação Ministerial do Animal">
                            <option value="X" ${data?.classification === 'X' ? 'selected' : ''}>X (Tedioso)</option>
                            <option value="XX" ${data?.classification === 'XX' ? 'selected' : ''}>XX (Inofensivo)</option>
                            <option value="XXX" ${data?.classification === 'XXX' ? 'selected' : ''}>XXX (Bruxo competente)</option>
                            <option value="XXXX" ${data?.classification === 'XXXX' ? 'selected' : ''}>XXXX (Perigoso)</option>
                            <option value="XXXXX" ${data?.classification === 'XXXXX' ? 'selected' : ''}>XXXXX (Mata bruxos)</option>
                        </select>
                    </label>
                    <label class="pet-label-license">Licença Ministerial:
                        <select class="ink-select pet-license" aria-label="Licença Ministerial do Animal">
                            <option value="Inválida" ${data?.license === 'Inválida' ? 'selected' : ''}>Inválida</option>
                            <option value="Em falta" ${data?.license === 'Em falta' ? 'selected' : ''}>Em falta</option>
                            <option value="Vigente" ${data?.license === 'Vigente' ? 'selected' : ''}>Vigente</option>
                        </select>
                    </label>
                </div>

            </div>
        </div>

        <div class="pet-stats-section">
            <h5 class="pet-stats-title">Atributos Base</h5>
            
            <div class="stats-grid pet-stats-grid">
                <label>Corpo: <input type="number" class="ink-input pet-corpo" value="${data?.stats?.corpo || 0}" aria-label="Atributo Corpo do Animal"></label>
                <label>Destreza: <input type="number" class="ink-input pet-destreza" value="${data?.stats?.destreza || 0}" aria-label="Atributo Destreza do Animal"></label>
                <label>Vitalidade: <input type="number" class="ink-input pet-vitalidade" value="${data?.stats?.vitalidade || 0}" aria-label="Atributo Vitalidade do Animal"></label>
                <label>Instinto: <input type="number" class="ink-input pet-instinto" value="${data?.stats?.instinto || 0}" aria-label="Atributo Instinto do Animal"></label>
            </div>
        </div>

        <textarea class="ink-textarea pet-desc" placeholder="Descrição, comportamento, alimentação e peculiaridades..." aria-label="Descrição e peculiaridades do Animal">${data?.description || ''}</textarea>
    `;

    // Lógica para Remover Animal
    const deleteBtn = card.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            // Em vez de remover de imediato, criamos uma pequena animação de fade-out
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            card.style.transition = 'all 0.3s ease';
            setTimeout(() => card.remove(), 300);
        });
    }

    // Lógica para Upload da Foto Isolada do Pet (SRP aplicado ao usar a classe photo-preview-active)
    const fileInput = card.querySelector('.pet-photo-input');
    const imgPreview = card.querySelector('.pet-photo-preview');
    
    if (fileInput && imgPreview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imgPreview.src = event.target.result;
                    imgPreview.classList.remove('hidden');
                    imgPreview.classList.add('photo-preview-active');
                };
                reader.onerror = function() {
                    console.error('Erro ao ler a foto do animal.');
                }
                reader.readAsDataURL(file);
            }
        });
    }

    container.appendChild(card);
}