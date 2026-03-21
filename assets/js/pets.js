/**
 * PETS.JS - MINISTÉRIO DA MAGIA
 * Gerenciamento de Animais de Estimação / Familiares
 */

export function setupPets() {
    const btnAddPet = document.getElementById('btn-add-pet');
    if (btnAddPet) {
        btnAddPet.addEventListener('click', () => addPet());
    }
}

export function addPet(data = null) {
    const container = document.getElementById('pets-container');
    const currentPets = container.querySelectorAll('.pet-card').length;

    // Regra de Negócio: Limite de 3 animais
    if (currentPets >= 3) {
        alert("Ação não permitida pelo concelho internacional da Magia.");
        return;
    }

    const petId = Date.now() + Math.floor(Math.random() * 1000);
    const card = document.createElement('div');
    card.className = 'bureaucracy-box pet-card';
    card.dataset.id = petId;
    card.style.backgroundColor = 'rgba(243, 181, 98, 0.1)'; // Fundo levemente dourado
    
    card.innerHTML = `
        <button class="delete-btn" title="Remover Registro">X</button>
        <h4 style="margin-bottom: 15px; border-bottom: 1px dashed var(--ink);">- Registro de Animal -</h4>
        
        <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 15px;">
            <div class="photo-upload" style="flex: 0 0 120px; display: flex; flex-direction: column; align-items: center;">
                <img class="pet-photo-preview" src="${data?.photo || ''}" style="${data?.photo ? 'display:block;' : 'display:none;'} max-width: 100%; border: 2px solid var(--ink); margin-bottom: 10px;">
                <label for="pet-photo-${petId}" class="upload-label" style="font-size: 0.7rem; padding: 4px 8px; text-align: center;">Anexar Foto</label>
                <input type="file" id="pet-photo-${petId}" class="pet-photo-input" accept="image/*" style="display: none;">
            </div>
            
            <div style="flex: 1; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                <label>Nome: <input type="text" class="ink-input pet-name" value="${data?.name || ''}"></label>
                <label>Idade: <input type="number" class="ink-input short-input pet-age" value="${data?.age || ''}"></label>
                <label>Tamanho/Peso: <input type="text" class="ink-input pet-size" value="${data?.size || ''}"></label>
                <label>Espécie: <input type="text" class="ink-input pet-species" value="${data?.species || ''}"></label>
                
                <label>Origem:
                    <select class="ink-select pet-origin">
                        <option value="Magica" ${data?.origin === 'Magica' ? 'selected' : ''}>Mágica</option>
                        <option value="Não Magica" ${data?.origin === 'Não Magica' ? 'selected' : ''}>Não Mágica</option>
                        <option value="Desconhecido" ${data?.origin === 'Desconhecido' ? 'selected' : ''}>Desconhecido</option>
                    </select>
                </label>
                
                <label>Sexo:
                    <select class="ink-select pet-sex">
                        <option value="Não aplicável" ${data?.sex === 'Não aplicável' ? 'selected' : ''}>Não aplicável</option>
                        <option value="Fêmea" ${data?.sex === 'Fêmea' ? 'selected' : ''}>Fêmea</option>
                        <option value="Macho" ${data?.sex === 'Macho' ? 'selected' : ''}>Macho</option>
                    </select>
                </label>
                
                <label>Classif. Ministerial:
                    <select class="ink-select pet-class">
                        <option value="X" ${data?.classification === 'X' ? 'selected' : ''}>X</option>
                        <option value="XX" ${data?.classification === 'XX' ? 'selected' : ''}>XX</option>
                        <option value="XXX" ${data?.classification === 'XXX' ? 'selected' : ''}>XXX</option>
                        <option value="XXXX" ${data?.classification === 'XXXX' ? 'selected' : ''}>XXXX</option>
                        <option value="XXXXX" ${data?.classification === 'XXXXX' ? 'selected' : ''}>XXXXX</option>
                    </select>
                </label>
                
                <label>Licença Ministerial:
                    <select class="ink-select pet-license">
                        <option value="Inválida" ${data?.license === 'Inválida' ? 'selected' : ''}>Inválida</option>
                        <option value="Em falta" ${data?.license === 'Em falta' ? 'selected' : ''}>Em falta</option>
                        <option value="Vigente" ${data?.license === 'Vigente' ? 'selected' : ''}>Vigente</option>
                    </select>
                </label>
            </div>
        </div>

        <div style="border-top: 1px dashed var(--ink); padding-top: 10px;">
            <h5 style="font-family: var(--font-serif); margin-bottom: 5px;">Atributos do Animal</h5>
            <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 15px;">
                <label>Corpo: <input type="number" class="ink-input pet-corpo" value="${data?.stats?.corpo || 0}"></label>
                <label>Destreza: <input type="number" class="ink-input pet-destreza" value="${data?.stats?.destreza || 0}"></label>
                <label>Vitalidade: <input type="number" class="ink-input pet-vitalidade" value="${data?.stats?.vitalidade || 0}"></label>
                <label>Instinto: <input type="number" class="ink-input pet-instinto" value="${data?.stats?.instinto || 0}"></label>
            </div>
        </div>

        <textarea class="ink-textarea pet-desc" placeholder="Descrição, comportamento, alimentação e peculiaridades...">${data?.description || ''}</textarea>
    `;

    // Lógica para Remover Animal
    card.querySelector('.delete-btn').addEventListener('click', () => card.remove());

    // Lógica para Upload da Foto Isolada do Pet
    const fileInput = card.querySelector('.pet-photo-input');
    const imgPreview = card.querySelector('.pet-photo-preview');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imgPreview.src = event.target.result;
                imgPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    container.appendChild(card);
}