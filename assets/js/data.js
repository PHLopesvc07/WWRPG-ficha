/**
 * DATA.JS - MINISTÉRIO DA MAGIA
 * Banco de Dados Estático (Linhagens, Perícias e Proficiências)
 */

export const db = {
    families: {
        "Norte-Americanas": [{ name: "Durward", prejudice: 90, influence: 20 }],
        "Inglesas": [
            { name: "Finnigan", prejudice: 50, influence: 95 },
            { name: "Fudge", prejudice: 40, influence: 95 },
            { name: "Weasley", prejudice: 40, influence: 30 },
            { name: "Black", prejudice: 85, influence: 85 },
            { name: "Malfoy", prejudice: 90, influence: 90 },
            { name: "Prewett", prejudice: 60, influence: 45 },
            { name: "Crouch", prejudice: 70, influence: 40 },
            { name: "Macmillan", prejudice: 65, influence: 35 },
            { name: "Nott", prejudice: 80, influence: 75 },
            { name: "Longbottom", prejudice: 45, influence: 25 },
            { name: "Bones", prejudice: 50, influence: 35 },
            { name: "Avery", prejudice: 85, influence: 75 },
            { name: "Parkinson", prejudice: 75, influence: 70 },
            { name: "Flint", prejudice: 80, influence: 55 },
            { name: "Travers", prejudice: 80, influence: 70 },
            { name: "Yaxley", prejudice: 80, influence: 60 },
            { name: "Abbott", prejudice: 70, influence: 50 },
            { name: "Bulstrode", prejudice: 85, influence: 60 },
            { name: "Greengrass", prejudice: 65, influence: 40 },
            { name: "Shafiq", prejudice: 55, influence: 20 }
        ],
        "Francesas": [
            { name: "Fontaine", prejudice: 50, influence: 25 },
            { name: "Aingremont", prejudice: 50, influence: 95 },
            { name: "Delacour", prejudice: 50, influence: 40 }
        ],
        "Escocesas": [
            { name: "McGonagall", prejudice: 20, influence: 85 },
            { name: "Potter/Peverell", prejudice: 25, influence: 65 },
            { name: "MacDougal", prejudice: 60, influence: 30 }
        ],
        "Irlandesas": [{ name: "Ollivander", prejudice: 55, influence: 60 }],
        "Galesas": [
            { name: "Smith", prejudice: 0, influence: 70 },
            { name: "Lovegood", prejudice: 30, influence: 25 }
        ],
        "Nórdicas": [{ name: "Krum", prejudice: 65, influence: 50 }],
        "Leste Europeu (Desconhecida)": [
            { name: "Moody", prejudice: 40, influence: 45 },
            { name: "Karkaroff", prejudice: 75, influence: 55 }
        ],
        "Italianas": [{ name: "Zabini", prejudice: 70, influence: 45 }],
        "Escandinavas": [{ name: "Borgin", prejudice: 70, influence: 50 }],
        "Alemãs": [{ name: "Krum (Linhagem Alemã)", prejudice: 65, influence: 50 }],
        "Húngaras": [{ name: "Harkiss", prejudice: 80, influence: 60 }],
        "Gregas": [{ name: "Tsoukalos", prejudice: 55, influence: 40 }],
        "Romenas": [{ name: "Carpathia", prejudice: 75, influence: 55 }],
        "Australianas": [
            { name: "Brunner", prejudice: 90, influence: 90 },
            { name: "Snape", prejudice: 75, influence: 70 }
        ],
        "Russas": [
            { name: "Pavlovich", prejudice: 80, influence: 70 },
            { name: "Godunov", prejudice: 90, influence: 50 }
        ],
        "Espanholas": [{ name: "Brandhuber", prejudice: 70, influence: 60 }],
        "Japonesas": [{ name: "Chang", prejudice: 50, influence: 50 }],
        "Sem Nacionalidade Específica": [
            { name: "Dooren", prejudice: 100, influence: 0 },
            { name: "Rosier", prejudice: 85, influence: 70 },
            { name: "Lannister", prejudice: 100, influence: 20 },
            { name: "Diggory", prejudice: 25, influence: 35 },
            { name: "Shacklebolt", prejudice: 10, influence: 55 },
            { name: "Gaunt", prejudice: 95, influence: 50 },
            { name: "Rosier (Alternativa)", prejudice: 90, influence: 65 },
            { name: "Lestrange", prejudice: 95, influence: 80 },
            { name: "Selwyn", prejudice: 70, influence: 45 }
        ]
    },
    skills: {
        sabedoria: ["Prática", "Intuição", "DCAT", "Percepção"],
        inteligencia: ["Dificuldade/Lógica", "Herbologia", "Poções", "Astronomia", "Estudo dos Trouxas"],
        vitalidade: ["Persistência", "Resistência"],
        destreza: ["Trato com Criaturas", "Furtividade", "Voo"],
        corpo: ["Esgrima", "Avançar/Atletismo"],
        carisma: ["Lábia", "Persuasão", "Transfiguração", "Clarividência", "Cura"]
    },
    proficiencyLevels: [
        { label: "Muito Ruim (-3)", value: -3 },
        { label: "Ruim (-2)", value: -2 },
        { label: "Deficiente (-1)", value: -1 },
        { label: "Normal (0)", value: 0, default: true },
        { label: "Treinado (+1)", value: 1 },
        { label: "Conhecedor (+2)", value: 2 },
        { label: "Expert (+3)", value: 3 }
    ]
};