import Badge from "../ui/Badge";
import { FIGURES } from "../../data/figures";
import { getRoleLabel, getTraitLabel } from "../../data/labels";

export default function FiguresGrid() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIGURES.map((f) => (
                <article
                    key={f.id}
                    className="group relative rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                    {/* Orange accent bar */}
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-accent/30 group-hover:bg-accent transition-colors duration-300" />

                    <div className="pl-3">
                        <h3 className="font-bold text-black text-lg">{f.name}</h3>
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
                </article>
            ))}
        </div>
    );
}
