/**
 * THEME.JS - MINISTÉRIO DA MAGIA
 * Gerenciamento de Tema (Modo Escuro/Luz) e Persistência
 */

export function setupTheme() {
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (!themeBtn) return;

    // 1. Verifica preferência salva ou do sistema
    const currentTheme = localStorage.getItem('wwrpg-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 2. Aplica tema inicial
    if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
        activateDarkMode();
    } else {
        activateLightMode();
    }

    // 3. Ouvinte do botão
    themeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            activateLightMode();
        } else {
            activateDarkMode();
        }
    });
}

function activateDarkMode() {
    document.body.classList.add('dark-mode');
    updateButtonIcon('🌙'); // Ícone de lua para indicar que modo escuro está ativo
    localStorage.setItem('wwrpg-theme', 'dark');
}

function activateLightMode() {
    document.body.classList.remove('dark-mode');
    updateButtonIcon('☀️'); // Ícone de sol para indicar que modo luz está ativo
    localStorage.setItem('wwrpg-theme', 'light');
}

function updateButtonIcon(icon) {
    const btn = document.getElementById('btn-theme-toggle');
    if(btn) btn.textContent = icon;
}