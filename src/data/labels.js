// Label maps with hyphen-underscore normalisation support

export const TRAIT_LABELS = {
    hairy: "Hairy",
    leafy: "Leafy",
    foliate: "Foliate",
    horned: "Horns/Antlers",
    hominin: "Hominin-like",
    beastlike: "Beast-like",
    rustic: "Rustic",
    club: "Carries club",
    savage: "Savage",
    shapeshifter: "Shape-shifter",
    "animal-lord": "Lord of animals",
    fertility: "Fertility/Renewal",
    wilderness: "Wilderness-dweller",
    forest: "Forest-dweller",
    mountain: "Mountain-dweller",
    bush: "Bush/outback",
    winter: "Winter aspect",
    spirit: "Spirit-being",
    humanlike: "Human-like",
    "backward-feet": "Backward feet",
    giant: "Giant",
    gaunt: "Gaunt",
    teachable: "Teachable/Tamed",
    nature: "Nature",
    naked: "Naked/Unclothed",
    female: "Female/Feminine",
    diminutive: "Small/Diminutive",
    nocturnal: "Nocturnal",
    "foul-smelling": "Foul-smelling",
    "cave-dweller": "Cave-dweller",
    ancient: "Ancient/Primordial",
    tusked: "Tusked/Fanged",
    aquatic: "Aquatic/Water",
    "moss-covered": "Moss/Bark-covered",
    invisible: "Invisible/Hidden",
};

export const ROLE_LABELS = {
    guardian: "Guardian",
    punisher: "Punisher",
    trickster: "Trickster",
    liminal: "Liminal",
    dangerous: "Dangerous",
    abductor: "Abductor",
    prophetic: "Prophetic",
    reclusive: "Reclusive",
    "cause-of-panic": "Causes panic",
    ecstatic: "Ecstatic/Revelry",
    companion: "Companion",
    "symbol-of-renewal": "Symbol of renewal",
    "taboo-punisher": "Taboo-punisher",
    cannibal: "Cannibal/Hunger",
    hostile: "Hostile",
    ambivalent: "Ambivalent",
    mischief: "Mischief",
    "culture-hero": "Culture hero/Teacher",
    seducer: "Seducer/Sexual",
    "cursed-human": "Lost soul/Cursed human",
    territorial: "Territorial",
    seasonal: "Seasonal transformation",
    initiator: "Initiator (of rites)",
    "chaos-agent": "Chaos agent",
};

export const FIGURE_TYPE_LABELS = {
    "hominid-cryptid": "Hominid/Cryptid",
    "nature-spirit": "Nature spirit",
    "deity-divine": "Deity/Divine",
    "cursed-human": "Cursed human",
    boundary: "Boundary/Ambivalent",
};

export const FIGURE_TYPE_COLOURS = {
    "hominid-cryptid": "bg-amber-100 text-amber-800 border-amber-200",
    "nature-spirit": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "deity-divine": "bg-violet-100 text-violet-800 border-violet-200",
    "cursed-human": "bg-red-100 text-red-800 border-red-200",
    boundary: "bg-sky-100 text-sky-800 border-sky-200",
};

// Helpers
export const norm = (s) => (s || "").replace(/_/g, "-");
export const getTraitLabel = (k) => TRAIT_LABELS[k] || TRAIT_LABELS[norm(k)] || k;
export const getRoleLabel = (k) => ROLE_LABELS[k] || ROLE_LABELS[norm(k)] || k;
export const getFigureTypeLabel = (k) => FIGURE_TYPE_LABELS[k] || k;

export const ALL_TRAITS = Array.from(new Set(Object.values(TRAIT_LABELS)));
export const ALL_ROLES = Array.from(new Set(Object.values(ROLE_LABELS)));
export const ALL_FIGURE_TYPES = Object.values(FIGURE_TYPE_LABELS);
