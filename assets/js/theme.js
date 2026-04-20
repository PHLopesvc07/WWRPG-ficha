/**
 * THEME.JS - MINISTÉRIO DA MAGIA
 * Gerenciamento de Tema (Modo Escuro/Luz) e Persistência
 */

/**
 * Inicializa o sistema de temas, verificando as preferências do utilizador
 * (localStorage) ou do sistema operativo, e configura o botão de alternância.
 */
export function setupTheme() {
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (!themeBtn) return;

    // 1. Verifica preferência salva ou do sistema (Confiabilidade)
    const currentTheme = localStorage.getItem('wwrpg-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 2. Aplica tema inicial baseado nas preferências
    if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
        activateDarkMode(themeBtn);
    } else {
        activateLightMode(themeBtn);
    }

    // 3. Ouvinte do botão para alternar os temas dinamicamente
    themeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            activateLightMode(themeBtn);
        } else {
            activateDarkMode(themeBtn);
        }
    });
}

/**
 * Ativa o Modo Escuro, adicionando a classe ao body, salvando a 
 * preferência no localStorage e atualizando a interface do botão.
 * @param {HTMLElement} btn - A referência do botão de alternância de tema no DOM.
 */
function activateDarkMode(btn) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('wwrpg-theme', 'dark');
    // Se o modo escuro está ativo, o botão deve oferecer a opção de ir para o modo claro (sol)
    updateButtonUI(btn, '☀', 'Ativar Modo Claro'); 
}

/**
 * Ativa o Modo Claro, removendo a classe do body, salvando a 
 * preferência no localStorage e atualizando a interface do botão.
 * @param {HTMLElement} btn - A referência do botão de alternância de tema no DOM.
 */
function activateLightMode(btn) {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('wwrpg-theme', 'light');
    // Se o modo claro está ativo, o botão deve oferecer a opção de ir para o modo escuro (lua)
    updateButtonUI(btn, '☽', 'Ativar Modo Escuro');
}

/**
 * Atualiza o ícone e os atributos de acessibilidade (ARIA) do botão de tema,
 * garantindo a Usabilidade conforme as normas ABNT ISO/IEC 25010.
 * @param {HTMLElement} btn - O elemento do botão.
 * @param {string} icon - O emoji/ícone visual a ser exibido.
 * @param {string} ariaLabel - O texto descritivo para leitores de tela e tooltips.
 */
function updateButtonUI(btn, icon, ariaLabel) {
    if (!btn) return;
    btn.textContent = icon;
    btn.setAttribute('aria-label', ariaLabel);
    btn.setAttribute('title', ariaLabel);
}