import { useMemo, useState } from "react";
import Badge from "../ui/Badge";
import Pill from "../ui/Pill";
import { FIGURES } from "../../data/figures";
import { ALL_ROLES, ALL_TRAITS, ALL_FIGURE_TYPES, getRoleLabel, getTraitLabel, getFigureTypeLabel, FIGURE_TYPE_COLOURS } from "../../data/labels";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function ComparativeTable({ onFigureClick }) {
    const [q, setQ] = useState("");
    const [traitFilters, setTraitFilters] = useState([]);
    const [roleFilters, setRoleFilters] = useState([]);
    const [typeFilters, setTypeFilters] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const toggle = (arr, setArr, value) =>
        setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

    const activeFilterCount = traitFilters.length + roleFilters.length + typeFilters.length;

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        const matchesQuery = (f) =>
            !query ||
            [f.name, f.culture, f.region, f.era, f.notes]
                .filter(Boolean)
                .some((s) => s.toLowerCase().includes(query));

        const traitActive = new Set(traitFilters);
        const roleActive = new Set(roleFilters);
        const typeActive = new Set(typeFilters);

        const matchesTraits = (f) =>
            traitActive.size === 0 || f.traits.map(getTraitLabel).some((t) => traitActive.has(t));

        const matchesRoles = (f) =>
            roleActive.size === 0 || f.roles.map(getRoleLabel).some((r) => roleActive.has(r));

        const matchesType = (f) =>
            typeActive.size === 0 || (f.figureType && typeActive.has(getFigureTypeLabel(f.figureType)));

        return FIGURES.filter((f) => matchesQuery(f) && matchesTraits(f) && matchesRoles(f) && matchesType(f));
    }, [q, traitFilters, roleFilters, typeFilters]);

    return (
        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
            {/* Search & Filter bar */}
            <div className="p-4 md:p-5 border-b border-black/5">
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-steel" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search figures..."
                            className="w-full bg-cream border border-black/8 rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-steel/60 focus:outline-none focus:border-accent/50 transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                            showFilters || activeFilterCount
                                ? "bg-accent text-white border-accent"
                                : "bg-cream border-black/8 text-steel hover:text-ink hover:border-black/15"
                        }`}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {showFilters && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                        <div>
                            <p className="text-xs text-steel mb-2 font-medium tracking-wider uppercase">Figure type</p>
                            <div className="flex flex-wrap gap-1.5">
                                {ALL_FIGURE_TYPES.map((t) => (
                                    <Pill key={t} label={t} active={typeFilters.includes(t)} onClick={() => toggle(typeFilters, setTypeFilters, t)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-steel mb-2 font-medium tracking-wider uppercase">Traits</p>
                            <div className="flex flex-wrap gap-1.5">
                                {ALL_TRAITS.map((t) => (
                                    <Pill key={t} label={t} active={traitFilters.includes(t)} onClick={() => toggle(traitFilters, setTraitFilters, t)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-steel mb-2 font-medium tracking-wider uppercase">Roles</p>
                            <div className="flex flex-wrap gap-1.5">
                                {ALL_ROLES.map((r) => (
                                    <Pill key={r} label={r} active={roleFilters.includes(r)} onClick={() => toggle(roleFilters, setRoleFilters, r)} />
                                ))}
                            </div>
                        </div>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={() => { setTraitFilters([]); setRoleFilters([]); setTypeFilters([]); }}
                                className="flex items-center gap-1 text-xs text-steel hover:text-accent transition-colors"
                            >
                                <X className="h-3 w-3" /> Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-black/5 bg-cream/50">
                            <th className="py-3 px-5 text-left font-medium text-steel text-xs tracking-wider uppercase">Figure</th>
                            <th className="py-3 px-5 text-left font-medium text-steel text-xs tracking-wider uppercase hidden sm:table-cell">Type</th>
                            <th className="py-3 px-5 text-left font-medium text-steel text-xs tracking-wider uppercase">Culture</th>
                            <th className="py-3 px-5 text-left font-medium text-steel text-xs tracking-wider uppercase hidden md:table-cell">Region</th>
                            <th className="py-3 px-5 text-left font-medium text-steel text-xs tracking-wider uppercase hidden lg:table-cell">Era</th>
                            <th className="py-3 px-5 text-left font-medium text-steel text-xs tracking-wider uppercase hidden sm:table-cell">Traits</th>
                            <th className="py-3 px-5 text-left font-medium text-steel text-xs tracking-wider uppercase hidden sm:table-cell">Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((f, i) => (
                            <tr
                                key={f.id}
                                className={`border-b border-black/3 transition-colors hover:bg-cream/60 cursor-pointer ${
                                    i % 2 === 0 ? "bg-transparent" : "bg-cream/30"
                                }`}
                                onClick={() => onFigureClick?.(f)}
                            >
                                <td className="py-3.5 px-5">
                                    <span className="font-semibold text-black">{f.name}</span>
                                    {/* Compact badge summary on mobile */}
                                    <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                                        {f.traits.slice(0, 2).map((t) => <Badge key={t} variant="trait">{getTraitLabel(t)}</Badge>)}
                                        {f.traits.length > 2 && <span className="text-[10px] text-steel self-center">+{f.traits.length - 2}</span>}
                                        {f.roles.slice(0, 2).map((r) => <Badge key={r} variant="role">{getRoleLabel(r)}</Badge>)}
                                        {f.roles.length > 2 && <span className="text-[10px] text-steel self-center">+{f.roles.length - 2}</span>}
                                    </div>
                                </td>
                                <td className="py-3.5 px-5 hidden sm:table-cell">
                                    {f.figureType && (
                                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${FIGURE_TYPE_COLOURS[f.figureType] || ""}`}>
                                            {getFigureTypeLabel(f.figureType)}
                                        </span>
                                    )}
                                </td>
                                <td className="py-3.5 px-5 text-steel text-xs">{f.culture}</td>
                                <td className="py-3.5 px-5 text-steel text-xs hidden md:table-cell">{f.region}</td>
                                <td className="py-3.5 px-5 text-steel text-xs hidden lg:table-cell">{f.era}</td>
                                <td className="py-3.5 px-5 hidden sm:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {f.traits.map((t) => <Badge key={t} variant="trait">{getTraitLabel(t)}</Badge>)}
                                    </div>
                                </td>
                                <td className="py-3.5 px-5 hidden sm:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {f.roles.map((r) => <Badge key={r} variant="role">{getRoleLabel(r)}</Badge>)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-steel">
                                    No figures match your filters. Try removing some.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Result count */}
            <div className="px-5 py-3 border-t border-black/5">
                <p className="text-xs text-steel">
                    {filtered.length} of {FIGURES.length} figures
                </p>
            </div>
        </div>
    );
}
