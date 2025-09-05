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
};

// Helpers
export const norm = (s) => (s || "").replace(/_/g, "-");
export const getTraitLabel = (k) => TRAIT_LABELS[k] || TRAIT_LABELS[norm(k)] || k;
export const getRoleLabel = (k) => ROLE_LABELS[k] || ROLE_LABELS[norm(k)] || k;

export const ALL_TRAITS = Array.from(new Set(Object.values(TRAIT_LABELS)));
export const ALL_ROLES = Array.from(new Set(Object.values(ROLE_LABELS)));
