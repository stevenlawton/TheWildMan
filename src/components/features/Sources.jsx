const SOURCES = [
    { text: "Epic of Gilgamesh", desc: "Enkidu as archetypal Wild Man." },
    { text: "Pausanias, Ovid", desc: "Classical sources on Pan, Satyrs, Silvanus/Faunus." },
    { text: "Medieval church carvings", desc: "Green Man foliate heads catalogued across Europe." },
    { text: "Slavic folklore collections", desc: "Leshy; Siberian/Yakut Evenki oral accounts for Chuchuna." },
    { text: "Himalayan ethnographies", desc: "Tibetan/Sherpa oral traditions concerning Yeti/Mi-go." },
    { text: "Indigenous oral traditions", desc: "Salish/Coast \u2014 Sasquatch; Algonquian \u2014 Wendigo." },
    { text: "Brazilian & Aboriginal accounts", desc: "Mapinguari, Curupira, Yowie, Quinkin, Pangkarlangu." },
];

export default function Sources() {
    return (
        <div className="space-y-3">
            {SOURCES.map((s, i) => (
                <div key={i} className="flex gap-4 items-start group">
                    <span className="flex-shrink-0 mt-2 h-1.5 w-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors duration-200" />
                    <p className="text-sm text-steel leading-relaxed">
                        <span className="text-black font-medium">{s.text}</span>
                        {" \u2014 "}
                        {s.desc}
                    </p>
                </div>
            ))}
            <p className="text-xs text-steel mt-6 pt-4 border-t border-black/5">
                Each figure above is drawn from attested folklore or material culture; this site avoids invented composite myths.
            </p>
        </div>
    );
}
