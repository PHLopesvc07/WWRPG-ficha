/**
 * UI.JS - MINISTÉRIO DA MAGIA
 * Lida com interações puramente visuais (Abas, Editor de Texto, Imagens)
 */

/**
 * Inicializa o sistema de navegação por abas (Tabs).
 * Garante a atualização de classes visuais e atributos de acessibilidade (ARIA).
 */
export function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    // Prevenção de erros caso os elementos não existam na página
    if (!tabBtns.length || !panels.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' e reseta o aria-pressed de todos os botões
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            panels.forEach(p => p.classList.remove('active'));

            // Adiciona a classe 'active' apenas na aba clicada
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            // Ativa o painel correspondente
            const targetPanel = document.getElementById(btn.dataset.target);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/**
 * Configura o upload local da foto de perfil com preview dinâmico via FileReader.
 * Aplica o Princípio de Responsabilidade Única (SRP) ao delegar o visual para o CSS.
 */
export function setupPhotoUpload() {
    const photoInput = document.getElementById('char-photo');
    const preview = document.getElementById('char-photo-preview');

    if (!photoInput || !preview) return;

    photoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                preview.src = event.target.result;
                // SRP Aplicado: Remove estilos inline e usa classes CSS exclusivas
                preview.classList.remove('hidden');
                preview.classList.add('photo-preview-active');
            };

            // Tratamento de erro básico
            reader.onerror = function () {
                console.error('Erro ao ler a imagem do ficheiro.');
            };

            reader.readAsDataURL(file);
        }
    });
}

/**
 * Configura o editor de texto rico (Rich Text) para o Diário de Campo.
 * Inclui fallback de segurança para a API obsoleta execCommand.
 */
export function setupNotesEditor() {
    const formatBtns = document.querySelectorAll('.btn-format');
    const editor = document.getElementById('notes-editor');

    if (!formatBtns.length || !editor) return;

    formatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita comportamento padrão de submit/reload da página
            const cmd = btn.dataset.cmd;

            // Tratamento de Confiabilidade: document.execCommand está obsoleto.
            // Usamos try/catch para garantir que o sistema não quebra em navegadores novos.
            try {
                document.execCommand(cmd, false, null);
            } catch (error) {
                console.warn('Comando de formatação não suportado pelo navegador atual.', error);
            }

            editor.focus(); // Devolve o cursor para o campo de texto
        });
    });
}

export function setupDiceFab() {
    const fab = document.getElementById('dice-fab');
    const widget = document.getElementById('dice-widget');
    if (!fab || !widget) return;

    fab.addEventListener('click', () => {
        const isOpen = widget.classList.toggle('dice-widget--open');
        fab.setAttribute('aria-expanded', isOpen);
        fab.title = isOpen ? 'Fechar Mesa de Rolagem' : 'Mesa de Rolagem';
    });

    // Fecha ao clicar fora do widget
    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target) && e.target !== fab) {
            widget.classList.remove('dice-widget--open');
            fab.setAttribute('aria-expanded', 'false');
        }
    });
}