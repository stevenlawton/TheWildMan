export const SOURCES = [
    // Core European
    { id: "bernheimer-1952", author: "Bernheimer, Richard", title: "Wild Men in the Middle Ages: A Study in Art, Sentiment, and Demonology", publisher: "Harvard University Press", year: 1952, type: "book", region: ["Europe"] },
    { id: "husband-1980", author: "Husband, Timothy", title: "The Wild Man: Medieval Myth and Symbolism", publisher: "Metropolitan Museum of Art", year: 1980, type: "book", region: ["Europe"] },
    { id: "bartra-1994", author: "Bartra, Roger", title: "Wild Men in the Looking Glass: The Mythic Origins of European Otherness", publisher: "University of Michigan Press", year: 1994, type: "book", region: ["Europe"] },
    { id: "dudley-novak-1972", author: "Dudley, Edward & Novak, Maximillian E. (eds.)", title: "The Wild Man Within: An Image in Western Thought from the Renaissance to Romanticism", publisher: "University of Pittsburgh Press", year: 1972, type: "book", region: ["Europe"] },
    { id: "yamamoto-2000", author: "Yamamoto, Dorothy", title: "The Boundaries of the Human in Medieval English Literature", publisher: "Oxford University Press", year: 2000, type: "book", region: ["Europe"] },
    { id: "doob-1974", author: "Doob, Penelope B.R.", title: "Nebuchadnezzar's Children: Conventions of Madness in Middle English Literature", publisher: "Yale University Press", year: 1974, type: "book", region: ["Europe"] },
    { id: "friedman-1981", author: "Friedman, John Block", title: "The Monstrous Races in Medieval Art and Thought", publisher: "Harvard University Press", year: 1981, type: "book", region: ["Europe", "Mediterranean"] },
    { id: "schama-1995", author: "Schama, Simon", title: "Landscape and Memory", publisher: "Knopf", year: 1995, type: "book", region: ["Europe"] },

    // Non-European
    { id: "forth-2008", author: "Forth, Gregory", title: "Images of the Wildman in Southeast Asia: An Anthropological Perspective", publisher: "Routledge", year: 2008, type: "book", region: ["Southeast Asia"] },
    { id: "white-1991", author: "White, David Gordon", title: "Myths of the Dog-Man", publisher: "University of Chicago Press", year: 1991, type: "book", region: ["South Asia", "Europe"] },
    { id: "witzel-2012", author: "Witzel, E.J. Michael", title: "The Origins of the World's Mythologies", publisher: "Oxford University Press", year: 2012, type: "book", region: ["Global"] },
    { id: "mayor-2000", author: "Mayor, Adrienne", title: "The First Fossil Hunters: Paleontology in Greek and Roman Times", publisher: "Princeton University Press", year: 2000, type: "book", region: ["Mediterranean"] },
    { id: "counts-arnold-2010", author: "Counts, Derek & Arnold, Bettina (eds.)", title: "The Master of Animals in Old World Iconography", publisher: "Archaeolingua", year: 2010, type: "book", region: ["Ancient Near East", "Mediterranean", "Europe"] },
    { id: "barandiaran-1960", author: "Barandiaran, Jose Miguel de", title: "Mitologia Vasca", publisher: "Editorial Txertoa", year: 1960, type: "book", region: ["Western Europe"] },

    // Primary sources
    { id: "george-2003", author: "George, Andrew R. (trans.)", title: "The Epic of Gilgamesh", publisher: "Penguin Classics", year: 2003, type: "primary", region: ["Ancient Near East"] },
    { id: "chretien-yvain", author: "Chretien de Troyes", title: "Yvain, the Knight of the Lion", publisher: "Various translations", year: 1180, type: "primary", region: ["Europe"] },
    { id: "pliny-nh", author: "Pliny the Elder", title: "Naturalis Historia", publisher: "Various translations", year: 77, type: "primary", region: ["Mediterranean"] },
    { id: "lonnrot-kalevala", author: "Lonnrot, Elias (comp.)", title: "The Kalevala", publisher: "Various translations", year: 1849, type: "primary", region: ["Northern Europe"] },

    // Specialist
    { id: "de-visser-1908", author: "de Visser, Marinus Willem", title: "The Tengu", publisher: "Transactions of the Asiatic Society of Japan", year: 1908, type: "article", region: ["East Asia"] },
    { id: "reider-2021", author: "Reider, Noriko T.", title: "Mountain Witches: Yamauba", publisher: "Utah State University Press", year: 2021, type: "book", region: ["East Asia"] },
    { id: "al-rawi-2009", author: "Al-Rawi, Ahmed K.", title: "The Mythical Ghoul in Arabic Culture", publisher: "Cultural Analysis", year: 2009, type: "article", region: ["Middle East"] },
    { id: "lebling-2010", author: "Lebling, Robert", title: "Legends of the Fire Spirits: Jinn and Genies from Arabia to Zanzibar", publisher: "I.B. Tauris", year: 2010, type: "book", region: ["Middle East", "Africa"] },
    { id: "rattray-1929", author: "Rattray, Robert Sutherland", title: "Ashanti", publisher: "Clarendon Press", year: 1929, type: "book", region: ["Africa"] },
    { id: "knappert-1971", author: "Knappert, Jan", title: "Myths and Legends of the Congo", publisher: "Heinemann", year: 1971, type: "book", region: ["Africa"] },
    { id: "kuusela-2020", author: "Kuusela, Tommy", title: "Huldra - In Between Human and Animal", publisher: "RMN Newsletter", year: 2020, type: "article", region: ["Northern Europe"] },
];

export const SOURCE_TYPE_LABELS = {
    book: "Book",
    article: "Article",
    primary: "Primary source",
};

export const ALL_SOURCE_REGIONS = Array.from(
    new Set(SOURCES.flatMap((s) => s.region))
).sort();
