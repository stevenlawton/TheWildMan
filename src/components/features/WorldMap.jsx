import { useMemo } from "react";
import { FIGURES } from "../../data/figures";
import { MapPin } from "lucide-react";

const REGION_META = {
    "Ancient Near East": { emoji: "Mesopotamia" },
    "Mediterranean": { emoji: "Greece & Rome" },
    "Western Europe": { emoji: "Celtic, Basque" },
    "Northern Europe": { emoji: "Germanic, Scandinavian, Finnish" },
    "Eastern Europe": { emoji: "Slavic" },
    "Europe": { emoji: "Medieval pan-European" },
    "Middle East": { emoji: "Arabian, Persian" },
    "Central Asia": { emoji: "Mongolia, Caucasus" },
    "Siberia": { emoji: "Yakut, Evenki" },
    "East Asia": { emoji: "Chinese, Japanese, Korean" },
    "Himalayas": { emoji: "Tibetan, Nepalese" },
    "South Asia": { emoji: "Indian" },
    "Southeast Asia": { emoji: "Vietnam, Sumatra, Philippines, Thailand" },
    "North America": { emoji: "Salish, Algonquian" },
    "Mesoamerica": { emoji: "Aztec, Maya, Garifuna" },
    "South America": { emoji: "Amazonian, Brazilian" },
    "Australia": { emoji: "Aboriginal" },
    "Pacific / Polynesia": { emoji: "Maori, Hawaiian, Melanesian" },
    "Africa": { emoji: "West, Central, Southern Africa" },
    "Arctic": { emoji: "Inuit" },
};

export default function WorldMap({ onRegionClick }) {
    const regionCounts = useMemo(() => {
        const counts = {};
        for (const f of FIGURES) {
            counts[f.region] = (counts[f.region] || 0) + 1;
        }
        return counts;
    }, []);

    const regions = Object.entries(regionCounts)
        .sort(([, a], [, b]) => b - a);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {regions.map(([region, count]) => {
                const meta = REGION_META[region] || {};
                return (
                    <button
                        key={region}
                        onClick={() => onRegionClick?.(region)}
                        className="group text-left rounded-xl bg-white p-4 shadow-sm hover:shadow-md hover:border-accent/30 border border-black/5 transition-all duration-200"
                    >
                        <div className="flex items-center gap-2 mb-1.5">
                            <MapPin className="h-3.5 w-3.5 text-accent/60 group-hover:text-accent transition-colors" />
                            <span className="font-bold text-black text-sm leading-tight">{region}</span>
                        </div>
                        <p className="text-[10px] text-steel leading-snug mb-2">{meta.emoji || ""}</p>
                        <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-accent/10 text-accent text-xs font-bold px-1.5">
                                {count}
                            </span>
                            <span className="text-[10px] text-steel">
                                {count === 1 ? "figure" : "figures"}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
