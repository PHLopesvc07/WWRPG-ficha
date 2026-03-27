# 🧙‍♂️ Registro de Pessoas Mágicas - Ministério da Magia (WWRPG)

Uma aplicação web estática, responsiva e de alta performance desenhada para servir como a **Ficha de Personagem Oficial** para jogadores de RPG de mesa baseados no universo bruxo.

Este projeto foi construído puramente com **Vanilla HTML5, CSS3 e JavaScript (ES6 Modules)**. Não requer a instalação de servidores locais, bases de dados ou bibliotecas externas (como React ou Bootstrap), garantindo leveza absoluta e execução imediata em qualquer navegador moderno.

---

## 🌟 Principais Funcionalidades

* **Sistema Burocrático Completo:** Gestão de status de sangue, linhagens familiares (com cálculo automático de preconceito e influência), histórico médico e regras pessoais.
* **Cálculo Automático de Atributos:** As perícias somam automaticamente o nível de proficiência com o atributo base correspondente.
* **Mesa de Rolagem Integrada (Dice Roller):** Motor de dados complexo que suporta combinações (ex: 1d20 + 2d6), rolagem com Vantagem/Desvantagem e "1-Click Roll" direto da ficha de perícias, tudo registado num Log Oficial.
* **Balcão de Câmbio de Gringotes:** Gestão económica inteligente com "Empréstimo em Cascata" (o sistema quebra automaticamente Galeões em Sicles e Sicles em Nuques nas compras) e conversão entre moedas.
* **Gestão Dinâmica de Magia e Inventário:** Criação de feitiços com categorização por cores, filtros de pesquisa e adição de mochilas/bolsos infinitos.
* **Registro de Criaturas (Pets):** Sistema para gerir até 3 animais mágicos com fotos individuais e os seus próprios atributos.
* **Modo Escuro (Dark Mode):** Alternância instantânea de tema (Pergaminho Claro vs. Fundo Escuro), sincronizado com as preferências do Sistema Operativo.
* **Persistência de Dados (Save/Load):** Como não utiliza base de dados em nuvem, o sistema exporta e importa toda a ficha (incluindo imagens convertidas em Base64) através de um ficheiro `.json` seguro, utilizando a *File System Access API*.

---

## 🏛️ Arquitetura e Engenharia de Software

O código fonte foi rigorosamente refatorado para cumprir elevados padrões da indústria de desenvolvimento:

### 1. Princípios SOLID Aplicados
* **SRP (Single Responsibility Principle):** Estrita separação de conceitos. O HTML trata apenas da semântica, o CSS da apresentação visual e as animações, e o JavaScript foca-se puramente na lógica de negócio e manipulação do DOM (sem injeção de estilos em linha).
* **DIP (Dependency Inversion Principle):** O orquestrador central (`main.js`) importa a base de dados estática e **injeta as dependências** nos módulos secundários, garantindo um baixo acoplamento.

### 2. Normas de Qualidade de Produto (ABNT ISO/IEC 25010)
* **Confiabilidade:** Programação defensiva avançada. Todos os seletores do DOM possuem checagem prévia (*null-checks*) e eventos sensíveis são protegidos por blocos `try...catch`, impedindo que a aplicação quebre.
* **Usabilidade e Acessibilidade:** Implementação de atributos de acessibilidade (como `aria-labels` e `aria-pressed`) em elementos gerados dinamicamente para suporte a leitores de ecrã, e navegação visível por teclado (`:focus-visible`).
* **Eficiência de Desempenho:** * Estruturas CSS unificadas para evitar código duplicado e tempo de leitura desnecessário pelo navegador.
  * Animações pesadas (como o surgir/desaparecer de feitiços e itens) são delegadas ao processamento da placa gráfica (GPU Accelerated) utilizando `will-change` e transformações 3D (`translateZ(0)`), garantindo 60fps constantes.
* **Manutenibilidade:** O projeto adota variáveis CSS globais para uma fácil gestão de temas, módulos isolados (ES6) e documentação extensiva utilizando padrões **JSDoc**.

---

## 📁 Estrutura de Diretórios

A modularidade foi o pilar da construção deste sistema:

```text
WWRPG-ficha/
├── index.html               # Estrutura semântica principal e templates
├── README.md                # Documentação do projeto
├── fichasTesteExemplo/      # Modelos de fichas (.json) para testes rápidos
└── assets/
    ├── img/                 # Ativos visuais (Carimbos, Texturas, Logos)
    ├── css/
    │   ├── base.css         # Variáveis, Fontes, Reset e Acessibilidade Global
    │   ├── layout.css       # Estruturas de Grid, Flexbox e Responsividade
    │   ├── components.css   # Estilos base de Botões, Inputs, Abas e Cards
    │   ├── modules.css      # Animações Complexas e Widgets Isolados (Mesa de Dados, etc.)
    │   └── theme.css        # Sobrescrita de paleta de cores para o Modo Escuro
    └── js/
        ├── main.js          # Orquestrador (Ponto de entrada)
        ├── data.js          # Simulador de Base de Dados Estática (Famílias, Perícias)
        ├── sheet.js         # Lógica da Ficha e Cálculos de Atributos
        ├── ui.js            # Interações Básicas de Interface (Abas, Upload de Foto)
        ├── dice.js          # Motor Matemático de Rolagem de Dados e Log
        ├── economy.js       # Sistema de Câmbio Monetário (Gringotes)
        ├── spells.js        # Gestão e Ordenação do Inventário e Magias
        ├── pets.js          # Gestão dos Animais Mágicos
        ├── theme.js         # Alternador de Modo Escuro/Claro (Salvo no LocalStorage)
        └── storage.js       # Sistema de I/O de ficheiros JSON (Save/Load)
