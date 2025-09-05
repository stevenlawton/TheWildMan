import Badge from "../ui/Badge";
import {FIGURES} from "../../data/figures";
import {getRoleLabel, getTraitLabel} from "../../data/labels";

export default function FiguresGrid() {
    return (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FIGURES.map((f) => (<article key={f.id} className="rounded-3xl border bg-white p-5 shadow-sm hover:shadow-md transition">
                    <h3 className="text-lg font-semibold">{f.name}</h3>
                    <p className="text-sm text-neutral-700">{f.culture} · {f.region} · {f.era}</p>
                    <p className="mt-3 text-sm">{f.notes}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {f.traits.map((t) => <Badge key={t}>{getTraitLabel(t)}</Badge>)}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {f.roles.map((r) => <Badge key={r}>{getRoleLabel(r)}</Badge>)}
                    </div>
                </article>))}
        </div>);
}
