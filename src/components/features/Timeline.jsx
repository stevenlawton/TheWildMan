import { useMemo, useState } from "react";
import { FIGURES } from "../../data/figures";
import { getFigureTypeLabel, FIGURE_TYPE_COLOURS } from "../../data/labels";
import Pill from "../ui/Pill";

function formatYear(y) {
    if (y < 0) return `${Math.abs(y).toLocaleString()} BCE`;
    return `${y} CE`;
}

// Group figures into time periods for a readable timeline
const PERIODS = [
    { key: "deep", label: "Deep Antiquity", range: "25,000+ BCE", min: -Infinity, max: -3000 },
    { key: "ancient", label: "Ancient World", range: "3000 BCE -- 1 CE", min: -3000, max: 1 },
    { key: "medieval", label: "Medieval", range: "1 -- 1500 CE", min: 1, max: 1500 },
    { key: "early-modern", label: "Early Modern", range: "1500 -- 1800 CE", min: 1500, max: 1800 },
    { key: "modern", label: "Modern Records", range: "1800 CE -- present", min: 1800, max: Infinity },
];

export default function Timeline() {
    const regions = useMemo(() => {
        const set = new Set(FIGURES.map(f => f.region));
        return ["All", ...Array.from(set).sort()];
    }, []);

    const [regionFilter, setRegionFilter] = useState("All");

    const grouped = useMemo(() => {
        const figures = FIGURES
            .filter(f => f.earliestDate != null)
            .filter(f => regionFilter === "All" || f.region === regionFilter)
            .sort((a, b) => a.earliestDate - b.earliestDate);

        return PERIODS.map(period => ({
            ...period,
            figures: figures.filter(f => f.earliestDate >= period.min && f.earliestDate < period.max),
        })).filter(p => p.figures.length > 0);
    }, [regionFilter]);

    return (
        <div>
            {/* Region filter */}
            <div className="flex flex-wrap gap-1.5 mb-6">
                {regions.map(r => (
                    <Pill
                        key={r}
                        label={r}
                        active={regionFilter === r}
                        onClick={() => setRegionFilter(r)}
                    />
                ))}
            </div>

            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] md:left-[15px] top-0 bottom-0 w-px bg-black/10" />

                <ol className="relative space-y-6">
                    {grouped.map(period => (
                        <li key={period.key} className="relative pl-10 md:pl-12">
                            {/* Period marker */}
                            <div className="absolute left-[2px] md:left-[6px] top-1 h-[19px] w-[19px] rounded-full border-[3px] border-accent bg-white" />

                            <div className="mb-3">
                                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-accent">
                                    {period.label}
                                </span>
                                <span className="text-xs text-steel ml-2">{period.range}</span>
                            </div>

                            <div className="space-y-2">
                                {period.figures.map(f => (
                                    <div
                                        key={f.id}
                                        className="group flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-black text-sm">{f.name}</span>
                                                {f.figureType && (
                                                    <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${FIGURE_TYPE_COLOURS[f.figureType] || ""}`}>
                                                        {getFigureTypeLabel(f.figureType)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-steel mt-0.5">
                                                {f.culture} · {f.region} · {formatYear(f.earliestDate)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ol>
            </div>

            <p className="text-xs text-steel mt-6 pt-4 border-t border-black/5">
                Dates represent earliest known attestation (text, art, or archaeology). Oral traditions
                are dated to their earliest written record or archaeological correlate.
            </p>
        </div>
    );
}
