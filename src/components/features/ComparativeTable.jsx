import {useMemo, useState} from "react";
import Badge from "../ui/Badge";
import Pill from "../ui/Pill";
import {FIGURES} from "../../data/figures";
import {ALL_ROLES, ALL_TRAITS, getRoleLabel, getTraitLabel} from "../../data/labels";
import {Filter, Search, Table as TableIcon} from "lucide-react";

export default function ComparativeTable() {
    const [q, setQ] = useState("");
    const [traitFilters, setTraitFilters] = useState([]);
    const [roleFilters, setRoleFilters] = useState([]);

    const toggle = (arr, setArr, value) => setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        const matchesQuery = (f) => !query || [f.name, f.culture, f.region, f.era, f.notes]
            .filter(Boolean)
            .some((s) => s.toLowerCase().includes(query));

        const traitActive = new Set(traitFilters);
        const roleActive = new Set(roleFilters);

        const matchesTraits = (f) => traitActive.size === 0 || f.traits.map(getTraitLabel).some((t) => traitActive.has(t));

        const matchesRoles = (f) => roleActive.size === 0 || f.roles.map(getRoleLabel).some((r) => roleActive.has(r));

        return FIGURES.filter((f) => matchesQuery(f) && matchesTraits(f) && matchesRoles(f));
    }, [q, traitFilters, roleFilters]);

    return (<div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4"/>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by name, culture, region, era or notes..."
                        className="w-full md:w-96 border rounded-xl px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Filter className="h-4 w-4"/> Filters
                </div>

                <div className="flex flex-wrap gap-2">
                    {ALL_TRAITS.map((t) => (<Pill key={t} label={t} active={traitFilters.includes(t)} onClick={() => toggle(traitFilters, setTraitFilters, t)}/>))}
                </div>

                <div className="flex flex-wrap gap-2">
                    {ALL_ROLES.map((r) => (<Pill key={r} label={r} active={roleFilters.includes(r)} onClick={() => toggle(roleFilters, setRoleFilters, r)}/>))}
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="text-left border-b">
                        <th className="py-2 pr-4">Figure</th>
                        <th className="py-2 pr-4">Culture</th>
                        <th className="py-2 pr-4">Region</th>
                        <th className="py-2 pr-4">Era</th>
                        <th className="py-2 pr-4">Traits</th>
                        <th className="py-2 pr-4">Roles</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((f) => (<tr key={f.id} className="border-b last:border-0">
                            <td className="py-3 pr-4 font-medium">{f.name}</td>
                            <td className="py-3 pr-4">{f.culture}</td>
                            <td className="py-3 pr-4">{f.region}</td>
                            <td className="py-3 pr-4">{f.era}</td>
                            <td className="py-3 pr-4">
                                <div className="flex flex-wrap gap-1">
                                    {f.traits.map((t) => <Badge key={t}>{getTraitLabel(t)}</Badge>)}
                                </div>
                            </td>
                            <td className="py-3 pr-4">
                                <div className="flex flex-wrap gap-1">
                                    {f.roles.map((r) => <Badge key={r}>{getRoleLabel(r)}</Badge>)}
                                </div>
                            </td>
                        </tr>))}
                    {filtered.length === 0 && (<tr>
                            <td colSpan={6} className="py-6 text-centre text-neutral-500">
                                <div className="flex items-centre justify-centre gap-2">
                                    <TableIcon className="h-4 w-4"/>
                                    No results - try clearing filters.
                                </div>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>);
}
