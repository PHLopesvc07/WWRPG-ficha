/**
 * UI.JS - MINISTÉRIO DA MAGIA
 * Lida com interações puramente visuais (Abas, Editor de Texto, Imagens)
 */

export function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Adiciona a classe 'active' apenas na aba clicada
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });
}

export function setupPhotoUpload() {
    const photoInput = document.getElementById('char-photo');
    const preview = document.getElementById('char-photo-preview');

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
                preview.style.maxWidth = '150px';
                preview.style.border = '2px solid var(--ink)';
                preview.style.marginBottom = '10px';
            };
            reader.readAsDataURL(file);
        }
    });
}

export function setupNotesEditor() {
    const formatBtns = document.querySelectorAll('.btn-format');
    const editor = document.getElementById('notes-editor');

    formatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que a página recarregue
            const cmd = btn.dataset.cmd;
            // Executa o comando nativo do navegador (negrito, italico, lista, etc)
            document.execCommand(cmd, false, null);
            editor.focus(); // Devolve o cursor para o texto
        });
    });
}

/**
 * UI.JS - MINISTÉRIO DA MAGIA
 * Lida com interações puramente visuais (Abas, Editor de Texto, Imagens)
 */

export function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Adiciona a classe 'active' apenas na aba clicada
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });
}

export function setupPhotoUpload() {
    const photoInput = document.getElementById('char-photo');
    const preview = document.getElementById('char-photo-preview');

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
                preview.style.maxWidth = '150px';
                preview.style.border = '2px solid var(--ink)';
                preview.style.marginBottom = '10px';
            };
            reader.readAsDataURL(file);
        }
    });
}

export function setupNotesEditor() {
    const formatBtns = document.querySelectorAll('.btn-format');
    const editor = document.getElementById('notes-editor');

    formatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que a página recarregue
            const cmd = btn.dataset.cmd;
            // Executa o comando nativo do navegador (negrito, italico, lista, etc)
            document.execCommand(cmd, false, null);
            editor.focus(); // Devolve o cursor para o texto
        });
    });
}

// NOVA FUNÇÃO: Validação de Injúrias do Prontuário Médico
export function setupInjuryValidation() {
    // Array com os prefixos das injúrias fixas
    const injuryTypes = ['leve', 'media', 'pesada'];
    
    injuryTypes.forEach(type => {
        const currInput = document.getElementById(`inj-${type}-curr`);
        const maxInput = document.getElementById(`inj-${type}-max`);
        
        if (currInput && maxInput) {
            // Regra 1: Se alterar o valor atual e ele for maior que o máximo, trava no máximo
            currInput.addEventListener('input', () => {
                const currVal = parseInt(currInput.value);
                const maxVal = parseInt(maxInput.value);
                
                // Só aplica a trava se ambos os campos tiverem números válidos
                if (!isNaN(currVal) && !isNaN(maxVal)) {
                    if (currVal > maxVal) {
                        currInput.value = maxVal;
                    }
                }
            });
            
            // Regra 2: Se diminuir o máximo para um valor menor que o atual, reduz o atual também
            maxInput.addEventListener('input', () => {
                const currVal = parseInt(currInput.value);
                const maxVal = parseInt(maxInput.value);
                
                if (!isNaN(currVal) && !isNaN(maxVal)) {
                    if (currVal > maxVal) {
                        currInput.value = maxVal;
                    }
                }
            });
        }
    });
}