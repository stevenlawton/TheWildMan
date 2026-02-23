import { useState, useMemo } from "react";
import { SOURCES, ALL_SOURCE_REGIONS, SOURCE_TYPE_LABELS } from "../../data/sources";
import Pill from "../ui/Pill";

function formatCitation(s) {
    const yearStr = s.year < 0 ? `${Math.abs(s.year)} BCE` : s.year;
    return (
        <span className="text-sm text-steel leading-relaxed">
            <span className="text-black font-medium">{s.author}</span>
            {" "}({yearStr}).{" "}
            <em>{s.title}</em>.{" "}
            {s.publisher}.
        </span>
    );
}

export default function Sources() {
    const [regionFilter, setRegionFilter] = useState(null);
    const [typeFilter, setTypeFilter] = useState(null);

    const filtered = useMemo(() => {
        return SOURCES.filter((s) => {
            if (regionFilter && !s.region.includes(regionFilter)) return false;
            if (typeFilter && s.type !== typeFilter) return false;
            return true;
        });
    }, [regionFilter, typeFilter]);

    const hasFilters = regionFilter || typeFilter;

    return (
        <div>
            {/* Filters */}
            <div className="space-y-2 mb-6">
                <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-steel font-medium tracking-wider uppercase mr-1">Region:</span>
                    {ALL_SOURCE_REGIONS.map((r) => (
                        <Pill
                            key={r}
                            label={r}
                            active={regionFilter === r}
                            onClick={() => setRegionFilter(regionFilter === r ? null : r)}
                        />
                    ))}
                </div>
                <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-steel font-medium tracking-wider uppercase mr-1">Type:</span>
                    {Object.entries(SOURCE_TYPE_LABELS).map(([k, v]) => (
                        <Pill
                            key={k}
                            label={v}
                            active={typeFilter === k}
                            onClick={() => setTypeFilter(typeFilter === k ? null : k)}
                        />
                    ))}
                </div>
            </div>

            {/* Bibliography */}
            <div className="space-y-3">
                {filtered.map((s) => (
                    <div key={s.id} className="flex gap-4 items-start group">
                        <span className="flex-shrink-0 mt-2 h-1.5 w-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors duration-200" />
                        <div>
                            {formatCitation(s)}
                            <div className="flex flex-wrap gap-1 mt-1">
                                {s.region.map((r) => (
                                    <span key={r} className="text-[10px] text-steel/70 bg-cream px-1.5 py-0.5 rounded">{r}</span>
                                ))}
                                <span className="text-[10px] text-accent/70 bg-accent/5 px-1.5 py-0.5 rounded">
                                    {SOURCE_TYPE_LABELS[s.type]}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p className="text-sm text-steel py-4">No sources match the selected filters.</p>
                )}
            </div>

            <p className="text-xs text-steel mt-6 pt-4 border-t border-black/5">
                {hasFilters ? `${filtered.length} of ${SOURCES.length}` : SOURCES.length} references.
                Each figure is drawn from attested folklore or material culture; this site avoids invented composite myths.
            </p>
        </div>
    );
}
