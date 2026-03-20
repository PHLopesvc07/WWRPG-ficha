# WWRPG-ficha
O Registro de Pessoas Mágicas é uma ficha digital para meu RPG de mesa baseado em Harry Potter! Ele roda no navegador e faz o trabalho chato: calcula bônus, rola dados virtuais e converte moedas em Gringotes. Dispensando papel.

# 🧙‍♂️ Registro de Pessoas Mágicas - Ministério da Magia

Um sistema web completo, interativo e imersivo para gerenciamento de fichas de personagens para campanhas de RPG de mesa no universo de Harry Potter. 

Desenvolvido com foco na experiência do usuário, o sistema elimina o uso de papel, automatiza cálculos de perícias, rolagens de dados e gerencia o inventário mágico — tudo diretamente pelo navegador.

## ✨ Funcionalidades Principais

* **Ficha Dinâmica:** Cálculo automático de perícias baseado na linhagem familiar e atributos (Corpo, Destreza, Inteligência, Sabedoria, Vitalidade e Carisma).
* **Motor de Probabilidades (Dados):** Rolador de dados embutido (d4 a d100) com suporte a modificadores, Vantagem e Desvantagem, além de um histórico de rolagem oficial.
* **Economia (Balcão de Gringotes):** Sistema de conversão automática e gestão de moedas bruxas (Galeões, Sicles e Nuques).
* **Catálogo de Feitiços:** Adição dinâmica de feitiços com sistema de arquivamento por cores (Transfiguração, Azaração, Maldição, Cura, etc).
* **Diário de Campo:** Editor de texto rico (Rich Text) para anotações de campanha, relatórios e evolução do personagem.
* **Persistência de Dados:** Salve e carregue sua ficha a qualquer momento utilizando o sistema de "Carimbar & Exportar" arquivos `.json`.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando **Vanilla Web Technologies** (sem frameworks pesados), priorizando performance e uma arquitetura modular moderna:

* **HTML5:** Semântico e acessível.
* **CSS3:** Arquitetura 7-1 (simplificada) com variáveis globais e flexbox/grid.
* **JavaScript (ES6+):** Sistema arquitetado em Módulos (`import`/`export`) separando claramente os dados (Model), a interface (UI) e a lógica de negócios (Controllers).

## 📁 Estrutura do Projeto

O código foi refatorado para garantir escalabilidade. A estrutura de pastas segue o seguinte padrão:

```text
/
├── index.html                # Ponto de entrada da aplicação
├── README.md                 # Documentação do projeto
└── /assets
    ├── /img                  # Recursos visuais (Fundo de pergaminho, logos, carimbos)
    ├── /css
    │   ├── main.css          # Arquivo agregador de estilos
    │   ├── base.css          # Variáveis globais, tipografia e reset
    │   ├── layout.css        # Estrutura de grid e posicionamento
    │   ├── components.css    # Botões, inputs e formulários burocráticos
    │   └── modules.css       # Widgets isolados (Gringotes, Dados, Editor)
    └── /js
        ├── main.js           # Orquestrador (Entry Point do JS)
        ├── data.js           # Banco de dados estático (Famílias, Perícias)
        ├── ui.js             # Lógica de interface (Abas, Upload de Fotos)
        ├── sheet.js          # Cálculos de ficha e atributos
        ├── dice.js           # Motor de rolagem de dados
        ├── economy.js        # Lógica de moedas e câmbio
        ├── spells.js         # Manipulação do DOM para listas dinâmicas
        └── storage.js        # Sistema de Exportar/Importar JSON
