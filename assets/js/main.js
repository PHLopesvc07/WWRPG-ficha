/**
 * MAIN.JS - MINISTÉRIO DA MAGIA
 * Ponto de Entrada (Entry Point) e Orquestrador
 */

// Importações dos módulos (Vamos criá-los a seguir)
import { initTabs, setupPhotoUpload, setupNotesEditor } from './ui.js';
import { populateFamilies, populateSkills, updateSkillBonuses } from './sheet.js';
import { setupDiceRoller } from './dice.js';
import { setupEconomy, setupGringottsExchange } from './economy.js';
import { setupDynamicLists } from './spells.js';
import { setupPersistence } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa UI Básica
    initTabs();
    setupPhotoUpload();
    setupNotesEditor();

    // 2. Preenche os Dados da Ficha
    populateFamilies();
    populateSkills();

    // 3. Inicializa Sistemas Interativos
    setupDiceRoller();
    setupEconomy();
    setupGringottsExchange();
    setupDynamicLists();
    
    // 4. Inicializa o Sistema de Save/Load
    setupPersistence();

    // 5. Configura Listeners Dinâmicos (Recalcular perícias ao alterar atributos base)
    const statInputs = document.querySelectorAll('.stats-grid input[type="number"]');
    statInputs.forEach(input => {
        input.addEventListener('input', updateSkillBonuses);
    });
});