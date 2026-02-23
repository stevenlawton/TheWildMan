import Badge from "../ui/Badge";
import { FIGURES } from "../../data/figures";
import { getRoleLabel, getTraitLabel, getFigureTypeLabel, FIGURE_TYPE_COLOURS } from "../../data/labels";

export default function FiguresGrid({ onFigureClick }) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIGURES.map((f) => (
                <article
                    key={f.id}
                    className="group relative rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50 focus:shadow-md"
                    onClick={() => onFigureClick?.(f)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onFigureClick?.(f); } }}
                    tabIndex={0}
                    role="button"
                    aria-label={f.name}
                >
                    {/* Orange accent bar */}
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-accent/30 group-hover:bg-accent transition-colors duration-300" />

                    <div className={`pl-3 ${f.image ? "flex gap-4" : ""}`}>
                        {f.image && (
                            <img
                                src={import.meta.env.BASE_URL + f.image.src.replace(/^\//, "")}
                                alt={f.image.alt}
                                className="w-20 h-20 rounded-lg object-cover shrink-0"
                                loading="lazy"
                            />
                        )}
                        <div className="min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-black text-lg">{f.name}</h3>
                                {f.figureType && (
                                    <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${FIGURE_TYPE_COLOURS[f.figureType] || ""}`}>
                                        {getFigureTypeLabel(f.figureType)}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-steel mt-0.5">
                                {f.culture} · {f.region} · {f.era}
                            </p>
                            <p className="mt-3 text-sm text-steel leading-relaxed">{f.notes}</p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {f.traits.map((t) => <Badge key={t} variant="trait">{getTraitLabel(t)}</Badge>)}
                            </div>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {f.roles.map((r) => <Badge key={r} variant="role">{getRoleLabel(r)}</Badge>)}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
