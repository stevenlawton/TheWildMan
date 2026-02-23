import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Badge from "../ui/Badge";
import { getTraitLabel, getRoleLabel, getFigureTypeLabel, FIGURE_TYPE_COLOURS } from "../../data/labels";

function formatYear(y) {
    if (y == null) return null;
    if (y < 0) return `${Math.abs(y).toLocaleString()} BCE`;
    return `${y} CE`;
}

export default function FigureDetail({ figure, onClose }) {
    const overlayRef = useRef(null);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    if (!figure) return null;
    const f = figure;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-black/5 px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
                    <div>
                        <h2 className="font-bold text-black text-xl">{f.name}</h2>
                        <p className="text-xs text-steel mt-0.5">
                            {f.culture} · {f.region} · {f.era}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-black/5 text-steel hover:text-black transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Figure type + date */}
                    <div className="flex flex-wrap items-center gap-2">
                        {f.figureType && (
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${FIGURE_TYPE_COLOURS[f.figureType] || ""}`}>
                                {getFigureTypeLabel(f.figureType)}
                            </span>
                        )}
                        {f.earliestDate != null && (
                            <span className="text-xs text-steel">
                                Earliest attestation: {formatYear(f.earliestDate)}
                            </span>
                        )}
                    </div>

                    {/* Notes */}
                    <p className="text-sm text-steel leading-relaxed">{f.notes}</p>

                    {/* Traits */}
                    <div>
                        <p className="text-xs text-steel font-medium tracking-wider uppercase mb-2">Traits</p>
                        <div className="flex flex-wrap gap-1.5">
                            {f.traits.map(t => (
                                <Badge key={t} variant="trait">{getTraitLabel(t)}</Badge>
                            ))}
                        </div>
                    </div>

                    {/* Roles */}
                    <div>
                        <p className="text-xs text-steel font-medium tracking-wider uppercase mb-2">Roles</p>
                        <div className="flex flex-wrap gap-1.5">
                            {f.roles.map(r => (
                                <Badge key={r} variant="role">{getRoleLabel(r)}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
