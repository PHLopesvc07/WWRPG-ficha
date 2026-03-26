/**
 * MAIN.JS - MINISTÉRIO DA MAGIA
 * Ponto de Entrada (Entry Point) e Orquestrador
 */

// 1. Importação da Fonte de Dados (Aplicando a Injeção de Dependência)
import { db } from './data.js';

// 2. Importações dos Módulos Funcionais
import { initTabs, setupPhotoUpload, setupNotesEditor } from './ui.js';
import { populateFamilies, populateSkills, updateSkillBonuses } from './sheet.js';
import { setupDiceRoller } from './dice.js';
import { setupEconomy, setupGringottsExchange } from './economy.js';
import { setupDynamicLists } from './spells.js';
import { setupPersistence } from './storage.js';
import { setupPets } from './pets.js';
import { setupTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa a Interface Básica (UI)
    initTabs();
    setupPhotoUpload();
    setupNotesEditor();

    // 2. Preenche os Dados da Ficha (Injetando a dependência 'db' - Princípio DIP do SOLID)
    populateFamilies(db);
    populateSkills(db);

    // 3. Inicializa os Sistemas Interativos e Dinâmicos
    setupDiceRoller();
    setupEconomy();
    setupGringottsExchange();
    setupDynamicLists();
    setupPets();
    setupTheme(); 
    
    // 4. Inicializa o Sistema de Persistência (Save/Load)
    setupPersistence();

    // 5. Configura Listeners Dinâmicos (Recalcular perícias ao alterar atributos base)
    const statInputs = document.querySelectorAll('.stats-grid input[type="number"]');
    statInputs.forEach(input => {
        // Sempre que um atributo base for alterado, o sistema recalcula os bónus totais
        input.addEventListener('input', updateSkillBonuses);
    });
});