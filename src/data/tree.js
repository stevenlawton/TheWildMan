export const TREE_NODES = [
    {id: "A1", origin: "Ancient Near East", label: "Enkidu\n(Mesopotamia, c.2100 BCE)"},

    {id: "B1", origin: "Greek", label: "Satyrs & Sileni\n(Greece)"},
    {id: "B2", origin: "Greek", label: "Pan\n(Greece)"},
    {id: "B3", origin: "Roman", label: "Silvanus / Faunus\n(Rome)"},

    {id: "C1", origin: "Celtic", label: "Cernunnos\n(Celtic)"},
    {id: "C2", origin: "Germanic", label: "Woodwose / Wuduwasa\n(Germanic)"},
    {id: "C3", origin: "England", label: "Herne the Hunter\n(English folklore)"},

    {id: "D1", origin: "Medieval Christian", label: "Wild Man\n(Medieval Europe)"},
    {id: "D2", origin: "Medieval Christian", label: "Green Man\n(Church carvings)"},

    {id: "E1", origin: "Slavic", label: "Leshy\n(Slavic)"},

    {id: "E3", origin: "India", label: "Yakshas / Tree Spirits\n(India)"},
    {id: "E4", origin: "Siberia", label: "Chuchuna\n(Siberia)"},

    {id: "F1", origin: "North America", label: "Sasquatch / Bigfoot\n(North America)"},
    {id: "F2", origin: "Algonquian", label: "Wendigo\n(Algonquian)"},
    {id: "F3", origin: "Amazon", label: "Mapinguari\n(Amazon)"},
    {id: "F4", origin: "Brazil", label: "Curupira\n(Brazil)"},

    {id: "E2", origin: "China", label: "Mao Ren\n(China)"},
    {id: "H1", origin: "Himalayas", label: "Mi-go / Yeti\n(Nepal/Tibet)"},

    {id: "G1", origin: "Australia", label: "Yowie\n(Australia)"},
    {id: "G2", origin: "Australia", label: "Quinkin\n(Queensland)"},
    {id: "G3", origin: "Australia", label: "Pangkarlangu\n(Northern Territory)"},
];

export const TREE_EDGES = [
    {from: "A1", to: "B1"},
    {from: "A1", to: "B2"},
    {from: "A1", to: "B3"},

    {from: "B2", to: "C1"},
    {from: "C1", to: "C2"},
    {from: "C1", to: "C3"},
    {from: "D1", to: "D2"},

    {from: "C2", to: "D1"},
    {from: "C2", to: "E1"},

    {from: "E1", to: "F1"},
    {from: "E1", to: "F2"},
    {from: "E1", to: "F3"},
    {from: "E1", to: "F4"},
    {from: "E1", to: "E4"},

    {from: "E2", to: "H1"},
    {from: "E3", to: "D2"},

    {from: "G1", to: "G2"},
    {from: "G1", to: "G3"},
];
