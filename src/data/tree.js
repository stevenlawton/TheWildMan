// Edge types:
//   direct    - documented textual or cultural transmission
//   substrate - shared Indo-European or regional substrate, not direct borrowing
//   parallel  - independent parallel development, no known connection

export const TREE_NODES = [
    // Ancient Near East
    {id: "A1", origin: "Ancient Near East", label: "Enkidu\n(Mesopotamia, c.2100 BCE)"},
    {id: "A2", origin: "Ancient Near East", label: "Humbaba\n(Mesopotamia, c.2100 BCE)"},

    // Greek / Roman
    {id: "B1", origin: "Greek", label: "Satyrs & Sileni\n(Greece)"},
    {id: "B2", origin: "Greek", label: "Pan\n(Greece)"},
    {id: "B3", origin: "Roman", label: "Silvanus / Faunus\n(Rome)"},

    // Celtic / Gaulish
    {id: "C1", origin: "Gaulish", label: "Cernunnos\n(Gaulish)"},

    // Germanic / Northern Europe
    {id: "C2", origin: "Germanic", label: "Woodwose / Wuduwasa\n(Germanic)"},
    {id: "C3", origin: "England", label: "Herne the Hunter\n(English folklore)"},
    {id: "C4", origin: "Scandinavian", label: "Huldra / Skogsra\n(Scandinavia)"},

    // Medieval European
    {id: "D1", origin: "Medieval Christian", label: "Wild Man\n(Medieval Europe)"},
    {id: "D2", origin: "Medieval Christian", label: "Green Man\n(Church carvings)"},

    // Slavic
    {id: "E1", origin: "Slavic", label: "Leshy\n(Slavic)"},

    // South Asia
    {id: "E3", origin: "India", label: "Yakshas / Tree Spirits\n(India)"},

    // Siberia
    {id: "E4", origin: "Siberia", label: "Chuchuna\n(Siberia)"},

    // East Asia
    {id: "E2", origin: "China", label: "Yeren / Maoren\n(China)"},
    {id: "H1", origin: "Himalayas", label: "Yeti / Migoi\n(Nepal/Tibet)"},
    {id: "KR1", origin: "Korea", label: "Dokkaebi\n(Korea)"},
    {id: "KR2", origin: "Korea", label: "Sansin\n(Korea)"},

    // Japan
    {id: "JP1", origin: "Japan", label: "Yamamba\n(Japan)"},
    {id: "JP2", origin: "Japan", label: "Tengu\n(Japan)"},
    {id: "JP3", origin: "Japan", label: "Kodama\n(Japan)"},
    {id: "JP4", origin: "Japan", label: "Satori\n(Japan)"},

    // Middle East
    {id: "ME1", origin: "Middle East", label: "Ghul\n(Arabian)"},
    {id: "ME2", origin: "Middle East", label: "Div / Deev\n(Persian)"},
    {id: "ME3", origin: "Middle East", label: "Nasnas\n(Arabic)"},

    // North America
    {id: "F1", origin: "North America", label: "Sasquatch / Bigfoot\n(North America)"},
    {id: "F2", origin: "Algonquian", label: "Wendigo\n(Algonquian)"},

    // South America
    {id: "F3", origin: "Amazon", label: "Mapinguari\n(Amazon)"},
    {id: "F4", origin: "Brazil", label: "Curupira\n(Brazil)"},

    // Mesoamerica
    {id: "MA1", origin: "Mesoamerica", label: "Chaneque\n(Nahua/Aztec)"},
    {id: "MA2", origin: "Mesoamerica", label: "Alux\n(Yucatec Maya)"},
    {id: "MA3", origin: "Mesoamerica", label: "Sisimite\n(Maya/Garifuna)"},

    // Africa
    {id: "AF1", origin: "West Africa", label: "Mmoatia\n(Ashanti)"},
    {id: "AF2", origin: "West Africa", label: "Aziza\n(Dahomey)"},
    {id: "AF3", origin: "West Africa", label: "Sasabonsam\n(Ashanti)"},
    {id: "AF4", origin: "Central Africa", label: "Eloko / Biloko\n(Congo)"},
    {id: "AF5", origin: "Southern Africa", label: "Tokoloshe\n(Nguni)"},
    {id: "AF6", origin: "West Africa", label: "Madebele\n(Senufo)"},

    // Southeast Asia
    {id: "SEA1", origin: "Southeast Asia", label: "Nguoi Rung\n(Vietnam)"},
    {id: "SEA2", origin: "Southeast Asia", label: "Orang Pendek\n(Sumatra)"},
    {id: "SEA3", origin: "Southeast Asia", label: "Diwata\n(Philippines)"},
    {id: "SEA4", origin: "Southeast Asia", label: "Nang Tani\n(Thailand)"},

    // Australia / Oceania
    {id: "G1", origin: "Australia", label: "Yowie\n(Australia)"},
    {id: "G2", origin: "Australia", label: "Quinkin\n(Queensland)"},
    {id: "G3", origin: "Australia", label: "Pangkarlangu\n(Northern Territory)"},

    // Pacific / Polynesia
    {id: "PA1", origin: "Pacific", label: "Maero\n(Maori, NZ)"},
    {id: "PA2", origin: "Pacific", label: "Patupaiarehe\n(Maori, NZ)"},
    {id: "PA3", origin: "Pacific", label: "Menehune\n(Hawaii)"},
    {id: "PA4", origin: "Pacific", label: "Adaro\n(Solomon Islands)"},

    // Basque
    {id: "C5", origin: "Basque", label: "Basajaun\n(Basque Country)"},

    // Finnish
    {id: "FI1", origin: "Finnish", label: "Tapio\n(Finland)"},

    // Arctic
    {id: "AR1", origin: "Arctic", label: "Ijiraq\n(Inuit)"},
    {id: "AR2", origin: "Arctic", label: "Tuniit / Tornit\n(Inuit)"},
];

export const TREE_EDGES = [
    // Ancient Near East cluster
    {from: "A1", to: "A2", type: "direct"},

    // Mesopotamia -> Greek/Roman (via Pliny, Isidore -- indirect/transformative)
    {from: "A1", to: "B1", type: "direct"},
    {from: "A1", to: "B2", type: "direct"},
    {from: "B2", to: "B3", type: "direct"},

    // Mesopotamia -> Middle East
    {from: "A1", to: "ME1", type: "direct"},
    {from: "ME1", to: "ME2", type: "substrate"},
    {from: "ME1", to: "ME3", type: "direct"},

    // Greek/Roman -> Gaulish/Celtic (shared substrate, not direct)
    {from: "B2", to: "C1", type: "substrate"},

    // Celtic <-> Germanic (shared substrate, bidirectional influence)
    {from: "C1", to: "C2", type: "substrate"},
    {from: "C1", to: "C3", type: "substrate"},

    // Germanic -> Medieval European
    {from: "C2", to: "D1", type: "direct"},
    {from: "D1", to: "D2", type: "parallel"},

    // Germanic -> Scandinavian
    {from: "C2", to: "C4", type: "substrate"},

    // Germanic/Slavic shared substrate
    {from: "C2", to: "E1", type: "substrate"},

    // Slavic -> Siberian
    {from: "E1", to: "E4", type: "substrate"},

    // South Asian (Yakshas -> Green Man parallel via trade iconography)
    {from: "E3", to: "D2", type: "parallel"},

    // East Asian cluster
    {from: "E2", to: "H1", type: "substrate"},

    // Korean cluster (independent)
    {from: "KR1", to: "KR2", type: "parallel"},

    // Japanese cluster (independent East Asian)
    {from: "JP1", to: "JP2", type: "parallel"},
    {from: "JP1", to: "JP4", type: "parallel"},
    {from: "JP3", to: "JP1", type: "parallel"},

    // North American cluster (independent)
    {from: "F1", to: "F2", type: "parallel"},

    // South American cluster (independent)
    {from: "F3", to: "F4", type: "parallel"},

    // Mesoamerican cluster (independent)
    {from: "MA1", to: "MA2", type: "parallel"},
    {from: "MA1", to: "MA3", type: "parallel"},

    // African cluster (independent)
    {from: "AF1", to: "AF3", type: "parallel"},
    {from: "AF1", to: "AF6", type: "parallel"},
    {from: "AF2", to: "AF4", type: "parallel"},
    {from: "AF5", to: "AF1", type: "parallel"},

    // Southeast Asian cluster (independent)
    {from: "SEA1", to: "SEA2", type: "parallel"},
    {from: "SEA3", to: "SEA4", type: "parallel"},

    // Australian cluster (independent)
    {from: "G1", to: "G2", type: "parallel"},
    {from: "G1", to: "G3", type: "parallel"},

    // Pacific / Polynesian cluster (Oceanian parallel to Australian)
    {from: "G1", to: "PA1", type: "parallel"},
    {from: "PA1", to: "PA2", type: "parallel"},
    {from: "PA3", to: "PA4", type: "parallel"},

    // Arctic cluster (independent)
    {from: "AR1", to: "AR2", type: "parallel"},
];

export const EDGE_TYPE_LABELS = {
    direct: "Direct influence",
    substrate: "Shared substrate",
    parallel: "Parallel development",
};
