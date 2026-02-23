const EVENTS = [
    {
        era: "c. 2100 BCE",
        title: "Enkidu \u2014 Epic of Gilgamesh",
        region: "Mesopotamia",
        text: "Earliest literary Wild Man; tamed by contact with civilisation.",
    },
    {
        era: "Classical",
        title: "Pan, Satyrs, Silvanus / Faunus",
        region: "Greece & Rome",
        text: "Goat-footed and rustic deities of the wild, fertility, and boundary spaces.",
    },
    {
        era: "Early Medieval",
        title: "Woodwose / Wuduwasa",
        region: "Germanic / Anglo-Saxon",
        text: "Hairy forest-dweller in art and text, bearing a club.",
    },
    {
        era: "11th\u201316th c.",
        title: "Green Man foliate heads",
        region: "Europe",
        text: "Leafy faces carved in churches; symbol of cycles and renewal.",
    },
    {
        era: "Medieval\u2013Modern",
        title: "Leshy, Yeti, Almas, Mao Ren",
        region: "Eurasia",
        text: "Parallel wild-beings spanning Slavic forests to Himalayan peaks.",
    },
    {
        era: "Pre-contact\u2013Modern",
        title: "Wendigo, Sasquatch, Mapinguari, Curupira, Yowie",
        region: "Americas & Australia",
        text: "Indigenous figures reflecting moral law and guardianship of wild places.",
    },
];

export default function Timeline() {
    return (
        <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[11px] md:left-[15px] top-0 bottom-0 w-px bg-black/10" />

            <ol className="relative space-y-8">
                {EVENTS.map((e, i) => (
                    <li key={i} className="relative pl-10 md:pl-12 group">
                        {/* Dot */}
                        <div className="absolute left-[5px] md:left-[9px] top-1.5 h-[13px] w-[13px] rounded-full border-[3px] border-accent bg-white transition-transform duration-300 group-hover:scale-125" />

                        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-accent mb-1">
                            {e.era}
                        </span>

                        <h4 className="font-bold text-black text-lg">{e.title}</h4>
                        <p className="text-xs text-steel mt-0.5">{e.region}</p>
                        <p className="text-sm text-steel mt-1.5 leading-relaxed">{e.text}</p>
                    </li>
                ))}
            </ol>
        </div>
    );
}
