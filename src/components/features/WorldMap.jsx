import { useState, useMemo } from "react";
import { feature } from "topojson-client";
import landTopo from "world-atlas/land-110m.json";
import { FIGURES } from "../../data/figures";
import Badge from "../ui/Badge";
import { getRoleLabel, getTraitLabel, getFigureTypeLabel, FIGURE_TYPE_COLOURS } from "../../data/labels";

// Convert TopoJSON land to SVG path strings (equirectangular projection)
const W = 1000;
const H = 500;

function project([lon, lat]) {
    return [(lon + 180) / 360 * W, (90 - lat) / 180 * H];
}

function projectRing(ring) {
    const pts = ring.map(project);
    return "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L") + "Z";
}

function ringsToPath(rings) {
    return rings.map(ring => {
        // Fast path: no antimeridian crossing
        let hasCrossing = false;
        for (let i = 1; i < ring.length; i++) {
            if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) { hasCrossing = true; break; }
        }
        if (!hasCrossing) return projectRing(ring);

        // Split ring into segments at each antimeridian crossing
        const segments = [];
        let current = [ring[0]];

        for (let i = 1; i < ring.length; i++) {
            const [lon1, lat1] = ring[i - 1];
            const [lon2, lat2] = ring[i];
            const diff = lon2 - lon1;

            if (Math.abs(diff) > 180) {
                // Crossing: large negative diff = eastward, large positive = westward
                const eastward = diff < -180;
                const exitLon = eastward ? 180 : -180;
                const enterLon = eastward ? -180 : 180;
                const normLon2 = lon2 + (eastward ? 360 : -360);
                const t = (exitLon - lon1) / (normLon2 - lon1);
                const crossLat = lat1 + t * (lat2 - lat1);

                current.push([exitLon, crossLat]);
                segments.push(current);
                current = [[enterLon, crossLat]];
            }
            current.push(ring[i]);
        }
        if (current.length > 1) segments.push(current);

        // Merge first and last segments (they share the ring's start/end point)
        if (segments.length > 1) {
            const merged = [...segments[segments.length - 1], ...segments[0].slice(1)];
            segments[0] = merged;
            segments.pop();
        }

        // Each segment now starts and ends at a map edge - Z closes along that edge
        return segments.map(seg => projectRing(seg)).join("");
    }).join("");
}

function geoToSvgPaths(geojson) {
    const paths = [];
    for (const feat of geojson.features) {
        const g = feat.geometry;
        if (g.type === "Polygon") {
            paths.push(ringsToPath(g.coordinates));
        } else if (g.type === "MultiPolygon") {
            for (const poly of g.coordinates) {
                paths.push(ringsToPath(poly));
            }
        }
    }
    return paths;
}

const landGeo = feature(landTopo, landTopo.objects.land);
const LAND_PATHS = geoToSvgPaths(landGeo);

const REGION_META = {
    "Ancient Near East": "Mesopotamia",
    "Mediterranean": "Greece & Rome",
    "Western Europe": "Celtic, Basque",
    "Northern Europe": "Germanic, Scandinavian, Finnish",
    "Eastern Europe": "Slavic",
    "Europe": "Medieval pan-European",
    "Middle East": "Arabian, Persian",
    "Central Asia": "Mongolia, Caucasus",
    "Siberia": "Yakut, Evenki",
    "East Asia": "Chinese, Japanese, Korean",
    "Himalayas": "Tibetan, Nepalese",
    "South Asia": "Indian",
    "Southeast Asia": "Vietnam, Sumatra, Philippines, Thailand",
    "North America": "Salish, Algonquian",
    "Mesoamerica": "Aztec, Maya, Garifuna",
    "South America": "Amazonian, Brazilian",
    "Australia": "Aboriginal",
    "Pacific / Polynesia": "Maori, Hawaiian, Melanesian",
    "Africa": "West, Central, Southern Africa",
    "Arctic": "Inuit",
};

// Approximate equirectangular positions [x, y] on a 1000x500 viewBox
// x = (lon + 180) / 360 * 1000, y = (90 - lat) / 180 * 500
const REGION_COORDS = {
    "Ancient Near East": [622, 158],   // Iraq/Mesopotamia 44°E 33°N
    "Mediterranean": [550, 142],       // Greece/S. Italy 18°E 39°N
    "Western Europe": [500, 122],      // France 0°E 46°N
    "Northern Europe": [539, 78],      // Scandinavia 14°E 62°N
    "Eastern Europe": [578, 106],      // Ukraine/Poland 28°E 52°N
    "Europe": [522, 111],              // Central Europe 8°E 50°N
    "Middle East": [633, 172],         // Iran/Gulf 48°E 28°N
    "Central Asia": [681, 128],        // Kazakhstan 65°E 44°N
    "Siberia": [764, 78],             // Central Siberia 95°E 62°N
    "East Asia": [828, 150],           // China/Korea 118°E 36°N
    "Himalayas": [736, 172],           // Nepal 85°E 28°N
    "South Asia": [717, 194],          // India 78°E 20°N
    "Southeast Asia": [792, 222],      // Thailand/Vietnam 105°E 10°N
    "North America": [222, 117],       // US/Canada 100°W 48°N
    "Mesoamerica": [250, 200],         // Central America 90°W 18°N
    "South America": [347, 283],       // Brazil 55°W 12°S
    "Australia": [872, 319],           // Central Australia 134°E 25°S
    "Pacific / Polynesia": [978, 292], // Fiji/Tonga 172°E 15°S
    "Africa": [550, 236],             // W/Central Africa 18°E 5°N
    "Arctic": [264, 50],              // Northern Canada 85°W 72°N
};

export default function WorldMap({ onFigureClick }) {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [hoveredRegion, setHoveredRegion] = useState(null);

    const regionCounts = useMemo(() => {
        const counts = {};
        for (const f of FIGURES) {
            counts[f.region] = (counts[f.region] || 0) + 1;
        }
        return counts;
    }, []);

    const selectedFigures = useMemo(() => {
        if (!selectedRegion) return [];
        return FIGURES.filter(f => f.region === selectedRegion);
    }, [selectedRegion]);

    const handleMarkerClick = (region) => {
        setSelectedRegion(prev => prev === region ? null : region);
    };

    return (
        <div>
            <svg
                viewBox="0 20 1000 380"
                className="w-full h-auto rounded-xl bg-white shadow-sm border border-black/5"
                role="img"
                aria-label="World map showing regions with wild man figures"
            >
                {LAND_PATHS.map((d, i) => (
                    <path key={i} d={d} fill="#E2DDD4" stroke="#CCC5B9" strokeWidth="0.5" strokeLinejoin="round" />
                ))}

                {Object.entries(REGION_COORDS).map(([region, [x, y]]) => {
                    const count = regionCounts[region] || 0;
                    if (!count) return null;
                    const r = Math.min(4 + count * 1.2, 16);
                    const isSelected = selectedRegion === region;
                    const isHovered = hoveredRegion === region;

                    return (
                        <g
                            key={region}
                            className="cursor-pointer outline-none"
                            onClick={() => handleMarkerClick(region)}
                            onPointerEnter={() => setHoveredRegion(region)}
                            onPointerLeave={() => setHoveredRegion(null)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleMarkerClick(region);
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`${region} - ${count} ${count === 1 ? "figure" : "figures"}`}
                        >
                            {isSelected && (
                                <circle
                                    cx={x} cy={y} r={r + 5}
                                    fill="none"
                                    stroke="#FF6600"
                                    strokeWidth="1.5"
                                    opacity="0.35"
                                />
                            )}
                            <circle
                                cx={x} cy={y} r={r}
                                fill={isSelected ? "#FF6600" : isHovered ? "rgba(255,102,0,0.75)" : "rgba(255,102,0,0.55)"}
                                stroke={isSelected ? "#CC5200" : "rgba(255,102,0,0.3)"}
                                strokeWidth="1.5"
                                style={{ transition: "fill 0.2s, stroke 0.2s" }}
                            />
                            {count >= 3 && (
                                <text
                                    x={x} y={y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill={isSelected ? "white" : "#CC5200"}
                                    fontSize={r > 8 ? "9" : "7"}
                                    fontWeight="bold"
                                    className="pointer-events-none select-none"
                                >
                                    {count}
                                </text>
                            )}
                            <title>{`${region} - ${count} ${count === 1 ? "figure" : "figures"}`}</title>
                        </g>
                    );
                })}
            </svg>

            {/* Region selector -- tappable on mobile where markers are too small */}
            <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(REGION_COORDS).map(([region]) => {
                    const count = regionCounts[region] || 0;
                    if (!count) return null;
                    const isSelected = selectedRegion === region;
                    return (
                        <button
                            key={region}
                            onClick={() => handleMarkerClick(region)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 ${
                                isSelected
                                    ? "bg-accent text-white border-accent"
                                    : "bg-white text-steel border-black/10 hover:border-accent hover:text-accent"
                            }`}
                        >
                            {region}
                            <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-steel/50"}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {selectedRegion && (
                <div className="mt-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-black text-xl">{selectedRegion}</h3>
                            <p className="text-sm text-steel mt-0.5">
                                {REGION_META[selectedRegion]} - {selectedFigures.length}{" "}
                                {selectedFigures.length === 1 ? "figure" : "figures"}
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedRegion(null)}
                            className="text-xs text-steel hover:text-black border border-black/10 rounded-full px-3 py-1.5 transition-colors"
                        >
                            Clear selection
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedFigures.map((f) => (
                            <article
                                key={f.id}
                                className="group relative rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
                                onClick={() => onFigureClick?.(f)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onFigureClick?.(f);
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={f.name}
                            >
                                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-accent/30 group-hover:bg-accent transition-colors duration-300" />
                                <div className="pl-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-bold text-black text-lg">{f.name}</h4>
                                        {f.figureType && (
                                            <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${FIGURE_TYPE_COLOURS[f.figureType] || ""}`}>
                                                {getFigureTypeLabel(f.figureType)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-steel mt-0.5">{f.culture} - {f.era}</p>
                                    <p className="mt-3 text-sm text-steel leading-relaxed line-clamp-3">{f.notes}</p>
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
                </div>
            )}
        </div>
    );
}
