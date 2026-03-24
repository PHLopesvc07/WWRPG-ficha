/**
 * MAIN.JS - MINISTÉRIO DA MAGIA
 * Ponto de Entrada (Entry Point) e Orquestrador
 */

// Importações dos módulos
import { initTabs, setupPhotoUpload, setupNotesEditor, setupInjuryValidation } from './ui.js';
import { populateFamilies, populateSkills, updateSkillBonuses } from './sheet.js';
import { setupDiceRoller } from './dice.js';
import { setupEconomy, setupGringottsExchange } from './economy.js';
import { setupDynamicLists } from './spells.js';
import { setupPersistence } from './storage.js';
import { setupPets } from './pets.js';
import { setupTheme } from './theme.js'; 

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa UI Básica
    initTabs();
    setupPhotoUpload();
    setupNotesEditor();
    setupInjuryValidation(); // <-- NOVA CHAMADA DA VALIDAÇÃO AQUI

    // 2. Preenche os Dados da Ficha
    populateFamilies();
    populateSkills();

    // 3. Inicializa Sistemas Interativos
    setupDiceRoller();
    setupEconomy();
    setupGringottsExchange();
    setupDynamicLists();
    setupPets();
    setupTheme();
    
    // 4. Inicializa o Sistema de Save/Load
    setupPersistence();

    // 5. Configura Listeners Dinâmicos (Recalcular perícias ao alterar atributos base)
    const statInputs = document.querySelectorAll('.stats-grid input[type="number"]');
    statInputs.forEach(input => {
        input.addEventListener('input', updateSkillBonuses);
    });
});