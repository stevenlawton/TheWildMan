import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Badge from "../ui/Badge";
import { getTraitLabel, getRoleLabel, getFigureTypeLabel, FIGURE_TYPE_COLOURS } from "../../data/labels";

function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatYear(y) {
    if (y == null) return null;
    if (y < 0) return `${formatNumber(Math.abs(y))} BCE`;
    return `${y} CE`;
}

export default function FigureDetail({ figure, onClose }) {
    const overlayRef = useRef(null);
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const previousFocusRef = useRef(null);

    // Capture the element that had focus before the modal opened
    useEffect(() => {
        previousFocusRef.current = document.activeElement;
    }, []);

    // Escape key, focus trap, and auto-focus close button
    useEffect(() => {
        if (!figure) return;
        const dialog = dialogRef.current;
        if (!dialog) return;

        // Auto-focus close button
        closeRef.current?.focus();

        const handleKey = (e) => {
            if (e.key === "Escape") { onClose(); return; }
            if (e.key !== "Tab") return;

            const focusable = dialog.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };

        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [figure, onClose]);

    // Lock body scroll while modal is open, restore focus on close
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
            previousFocusRef.current?.focus();
        };
    }, []);

    if (!figure) return null;
    const f = figure;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-label={f.name}
        >
            <div ref={dialogRef} className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-black/5 px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
                    <div>
                        <h2 className="font-bold text-black text-xl">{f.name}</h2>
                        <p className="text-xs text-steel mt-0.5">
                            {f.culture} · {f.region} · {f.era}
                        </p>
                    </div>
                    <button
                        ref={closeRef}
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-black/5 text-steel hover:text-black transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Artwork */}
                    {f.image && (
                        <div>
                            <img
                                src={f.image.src}
                                alt={f.image.alt}
                                className="w-full max-h-[250px] object-contain rounded-lg bg-black/5"
                            />
                            <p className="mt-1.5 text-[11px] text-steel">
                                {f.image.attribution}{f.image.date ? `, ${f.image.date}` : ""} · {f.image.license}
                            </p>
                        </div>
                    )}

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
