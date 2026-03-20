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