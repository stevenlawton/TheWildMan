import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { TREE_NODES, TREE_EDGES, EDGE_TYPE_LABELS } from "../../data/tree";
import { FIGURES } from "../../data/figures";
import { ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";

const EXPLICIT_ORDER = { A1: ["B2", "B3", "B1"] };

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.15;

const EDGE_STYLES = {
    direct:    { stroke: "#CC5200", width: 1.5, dash: "",      opacity: 0.6, marker: "arrow" },
    substrate: { stroke: "#666666", width: 1.2, dash: "6 3",   opacity: 0.45, marker: "arrow-dim" },
    parallel:  { stroke: "#666666", width: 1,   dash: "2 4",   opacity: 0.35, marker: "arrow-dim" },
};

const FOREST_LABELS = {
    A1: "Eurasia",
    F1: "Americas",
    AF5: "Africa",
    G1: "Oceania & Pacific",
};

// Build a lookup from edge key -> type
const edgeTypeMap = new Map(
    TREE_EDGES.map(e => [`${e.from}->${e.to}`, e.type || "direct"])
);

// Match tree nodes to FIGURES entries by first word of the name
const figureLookup = new Map();
for (const f of FIGURES) {
    figureLookup.set(f.name.toLowerCase(), f);
    const first = f.name.split(/[\s/]/)[0].toLowerCase();
    if (!figureLookup.has(first)) figureLookup.set(first, f);
}

function findFigure(nodeLabel) {
    const name = nodeLabel.split("\n")[0].trim();
    return figureLookup.get(name.toLowerCase()) ||
           figureLookup.get(name.split(/[\s/&]/)[0].toLowerCase());
}

export default function FamilyTree({ onFigureClick }) {
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

    // Detect touch device
    useEffect(() => {
        setIsTouch("ontouchstart" in window);
    }, []);

    // Measure container
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Layout computation
    const { pos, primaryEdges, secondaryEdges, width, height, nodeW, nodeH, forestLabels } = useMemo(() => {
        const nodeW = 180;
        const nodeH = 60;
        const hGap = 14;
        const vGap = 36;
        const forestGap = 50;
        const labelH = 22;
        const targetWidth = 1400;
        const pad = { l: 30, t: 30, r: 30, b: 30 };

        const byId = new Map(TREE_NODES.map(n => [n.id, { ...n }]));
        const childrenAll = new Map([...byId.keys()].map(id => [id, []]));
        const hasParent = new Set();
        for (const e of TREE_EDGES) {
            if (byId.has(e.from) && byId.has(e.to)) {
                childrenAll.get(e.from).push(e.to);
                hasParent.add(e.to);
            }
        }

        // Auto-detect roots: nodes with no incoming edges
        const roots = TREE_NODES
            .filter(n => !hasParent.has(n.id))
            .map(n => n.id);

        const include = new Set();
        function dfs(id) {
            if (include.has(id)) return;
            include.add(id);
            for (const c of childrenAll.get(id) || []) dfs(c);
        }
        roots.forEach(dfs);

        // Also include any orphaned nodes (no edges at all)
        for (const n of TREE_NODES) {
            if (!include.has(n.id)) include.add(n.id);
        }

        const children = new Map([...byId.keys()].map(id => [id, []]));
        for (const p of include) {
            const kids = (childrenAll.get(p) || []).filter(c => include.has(c));
            const order = EXPLICIT_ORDER[p];
            const ordered = order ? [...kids].sort((a, b) => order.indexOf(a) - order.indexOf(b)) : kids;
            children.set(p, ordered);
        }

        function build(id, seen = new Set()) {
            if (seen.has(id)) return { id, children: [] };
            seen.add(id);
            return { id, children: (children.get(id) || []).map(c => build(c, seen)) };
        }
        const forests = roots.map(r => build(r));

        function countNodes(tree) {
            return 1 + tree.children.reduce((sum, c) => sum + countNodes(c), 0);
        }

        // Sort largest forest first
        const sortedForests = [...forests].sort((a, b) => countNodes(b) - countNodes(a));

        const unit = nodeW + hGap;

        // Layout a single forest at origin (0,0)
        function layoutForest(tree) {
            const localPos = {};
            const localEdges = [];
            let cursor = 0;

            function layout(node, depth) {
                if (!node.children.length) {
                    const cx = cursor + unit / 2;
                    node.x = cx - nodeW / 2;
                    node.y = depth * (nodeH + vGap);
                    localPos[node.id] = { x: node.x, y: node.y };
                    cursor += unit;
                    return { minX: node.x, maxX: node.x + nodeW };
                }
                const childBoxes = node.children.map(c => layout(c, depth + 1));
                const minX = childBoxes[0].minX;
                const maxX = childBoxes[childBoxes.length - 1].maxX;
                const cx = (minX + maxX) / 2;
                node.x = cx - nodeW / 2;
                node.y = depth * (nodeH + vGap);
                localPos[node.id] = { x: node.x, y: node.y };
                for (const c of node.children) localEdges.push([node.id, c.id]);
                return { minX, maxX };
            }

            layout(tree, 0);

            // Normalize so top-left is at (0,0)
            const xs = Object.values(localPos).map(p => p.x);
            const ys = Object.values(localPos).map(p => p.y);
            const oX = Math.min(...xs);
            const oY = Math.min(...ys);
            for (const id of Object.keys(localPos)) {
                localPos[id] = { x: localPos[id].x - oX, y: localPos[id].y - oY };
            }
            const w = Math.max(...xs) + nodeW - oX;
            const h = Math.max(...ys) + nodeH - oY;

            return { pos: localPos, edges: localEdges, w, h, root: tree.id };
        }

        const laid = sortedForests.map(f => layoutForest(f));

        // Arrange forests in a wrapping grid
        const allPos = {};
        const allPrimaryEdges = [];
        const fLabels = [];
        let rowX = pad.l;
        let rowY = pad.t + labelH;
        let rowHeight = 0;

        for (const f of laid) {
            if (rowX > pad.l && rowX + f.w > targetWidth) {
                rowY += rowHeight + forestGap + labelH;
                rowX = pad.l;
                rowHeight = 0;
            }

            fLabels.push({
                text: FOREST_LABELS[f.root] || f.root,
                x: rowX,
                y: rowY - 6,
            });

            for (const [id, p] of Object.entries(f.pos)) {
                allPos[id] = { x: p.x + rowX, y: p.y + rowY };
            }
            allPrimaryEdges.push(...f.edges);

            rowX += f.w + forestGap;
            rowHeight = Math.max(rowHeight, f.h);
        }

        // Secondary edges (cross-links not in the spanning tree)
        const primarySet = new Set(allPrimaryEdges.map(([a, b]) => `${a}->${b}`));
        const secondaryEdges = TREE_EDGES
            .filter(e => include.has(e.from) && include.has(e.to))
            .filter(e => !primarySet.has(`${e.from}->${e.to}`))
            .map(e => [e.from, e.to]);

        // Canvas size
        const allXe = Object.values(allPos).map(p => p.x + nodeW);
        const allYe = Object.values(allPos).map(p => p.y + nodeH);
        const totalWidth = Math.max(...allXe) + pad.r;
        const totalHeight = Math.max(...allYe) + pad.b;

        return {
            pos: allPos, primaryEdges: allPrimaryEdges, secondaryEdges,
            width: totalWidth, height: totalHeight,
            nodeW, nodeH, forestLabels: fLabels,
        };
    }, []);

    // Fit to container (clamp min zoom to 0.45 so text stays readable)
    const fitToView = useCallback(() => {
        if (!containerSize.w || !containerSize.h) return;
        const scaleX = containerSize.w / width;
        const scaleY = containerSize.h / height;
        const natural = Math.min(scaleX, scaleY, 1);
        const fitZoom = Math.max(natural, 0.45);
        setZoom(fitZoom);
        const cw = width * fitZoom;
        const ch = height * fitZoom;
        setPan({
            x: cw <= containerSize.w ? (containerSize.w - cw) / 2 : 0,
            y: ch <= containerSize.h ? (containerSize.h - ch) / 2 : 0,
        });
    }, [containerSize.w, containerSize.h, width, height]);

    // Auto-fit on first render
    const didFit = useRef(false);
    useEffect(() => {
        if (containerSize.w > 0 && !didFit.current) {
            fitToView();
            didFit.current = true;
        }
    }, [containerSize.w, fitToView]);

    // Zoom helpers
    const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

    const zoomAtPoint = useCallback((newZoom, cx, cy) => {
        const clamped = clampZoom(newZoom);
        setPan(prev => ({
            x: cx - (cx - prev.x) * (clamped / zoom),
            y: cy - (cy - prev.y) * (clamped / zoom),
        }));
        setZoom(clamped);
    }, [zoom]);

    const handleZoomIn = () => {
        const cx = containerSize.w / 2;
        const cy = containerSize.h / 2;
        zoomAtPoint(zoom + ZOOM_STEP, cx, cy);
    };

    const handleZoomOut = () => {
        const cx = containerSize.w / 2;
        const cy = containerSize.h / 2;
        zoomAtPoint(zoom - ZOOM_STEP, cx, cy);
    };

    // Wheel zoom
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        zoomAtPoint(zoom + delta, cx, cy);
    }, [zoom, zoomAtPoint]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [handleWheel]);

    // Mouse drag
    const handlePointerDown = (e) => {
        if (e.button !== 0) return;
        setDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!dragging) return;
        setPan({
            x: dragStart.current.panX + (e.clientX - dragStart.current.x),
            y: dragStart.current.panY + (e.clientY - dragStart.current.y),
        });
    };

    const handlePointerUp = () => setDragging(false);

    function getEdgeStyle(from, to) {
        const key = `${from}->${to}`;
        const type = edgeTypeMap.get(key) || "direct";
        return EDGE_STYLES[type];
    }

    function renderPrimaryEdge(from, to, i) {
        const a = pos[from], b = pos[to];
        if (!a || !b) return null;
        const style = getEdgeStyle(from, to);
        const x1 = a.x + nodeW / 2, y1 = a.y + nodeH;
        const x2 = b.x + nodeW / 2, y2 = b.y;
        const my = (y1 + y2) / 2;
        return (
            <path
                key={`p-${i}`}
                d={`M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`}
                fill="none"
                stroke={style.stroke}
                strokeWidth={style.width}
                strokeDasharray={style.dash}
                strokeOpacity={style.opacity}
                markerEnd={`url(#${style.marker})`}
            />
        );
    }

    function renderSecondaryEdge(from, to, i) {
        const a = pos[from], b = pos[to];
        if (!a || !b) return null;
        const style = getEdgeStyle(from, to);
        const x1 = a.x + nodeW / 2, y1 = a.y + nodeH / 2;
        const x2 = b.x + nodeW / 2, y2 = b.y + nodeH / 2;
        const dx = x2 - x1, dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const arc = Math.min(dist * 0.15, 30);
        const nx = -dy / dist, ny = dx / dist;
        const mx = (x1 + x2) / 2 + nx * arc;
        const my = (y1 + y2) / 2 + ny * arc;
        return (
            <path
                key={`s-${i}`}
                d={`M ${x1} ${y1} Q ${mx} ${my}, ${x2} ${y2}`}
                fill="none"
                stroke={style.stroke}
                strokeWidth={style.width}
                strokeDasharray={style.dash}
                strokeOpacity={style.opacity * 0.7}
                markerEnd={`url(#${style.marker})`}
            />
        );
    }

    const pct = Math.round(zoom * 100);

    return (
        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2.5 border-b border-black/5 bg-cream/50">
                <button onClick={handleZoomIn} className="p-1.5 rounded-md hover:bg-black/5 text-steel hover:text-black transition-colors" title="Zoom in">
                    <ZoomIn className="h-4 w-4" />
                </button>
                <button onClick={handleZoomOut} className="p-1.5 rounded-md hover:bg-black/5 text-steel hover:text-black transition-colors" title="Zoom out">
                    <ZoomOut className="h-4 w-4" />
                </button>
                <button onClick={fitToView} className="p-1.5 rounded-md hover:bg-black/5 text-steel hover:text-black transition-colors" title="Fit to view">
                    <Maximize2 className="h-4 w-4" />
                </button>
                <span className="text-xs text-steel tabular-nums ml-1 min-w-[3ch] text-right">{pct}%</span>

                {/* Legend */}
                <div className="ml-4 flex items-center gap-3 text-[10px] text-steel">
                    <span className="flex items-center gap-1">
                        <svg width="24" height="6"><line x1="0" y1="3" x2="24" y2="3" stroke="#CC5200" strokeWidth="1.5" strokeOpacity="0.6" /></svg>
                        <span className="hidden sm:inline">{EDGE_TYPE_LABELS.direct}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <svg width="24" height="6"><line x1="0" y1="3" x2="24" y2="3" stroke="#666" strokeWidth="1.2" strokeDasharray="6 3" strokeOpacity="0.45" /></svg>
                        <span className="hidden sm:inline">{EDGE_TYPE_LABELS.substrate}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <svg width="24" height="6"><line x1="0" y1="3" x2="24" y2="3" stroke="#666" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.35" /></svg>
                        <span className="hidden sm:inline">{EDGE_TYPE_LABELS.parallel}</span>
                    </span>
                </div>

                <div className="ml-auto flex items-center gap-1.5 text-xs text-steel/60">
                    <Move className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isTouch ? "Drag to pan, pinch to zoom" : "Drag to pan, scroll to zoom"}</span>
                </div>
            </div>

            {/* Canvas */}
            <div
                ref={containerRef}
                className="relative overflow-hidden h-[60vh] min-h-[300px] max-h-[700px]"
                style={{ touchAction: "none", cursor: dragging ? "grabbing" : "grab" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div
                    style={{
                        width, height,
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: "0 0",
                        position: "absolute",
                        willChange: "transform",
                    }}
                >
                    <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
                        <defs>
                            <marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                                <path d="M0,0 L6,3 L0,6 Z" fill="#CC5200" fillOpacity="0.6" />
                            </marker>
                            <marker id="arrow-dim" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                                <path d="M0,0 L6,3 L0,6 Z" fill="#666666" fillOpacity="0.4" />
                            </marker>
                        </defs>

                        {/* Forest region labels */}
                        {forestLabels.map((lbl, i) => (
                            <text
                                key={`fl-${i}`}
                                x={lbl.x}
                                y={lbl.y}
                                fill="#888"
                                fillOpacity="0.7"
                                fontSize="11"
                                fontWeight="600"
                                letterSpacing="0.05em"
                            >
                                {lbl.text.toUpperCase()}
                            </text>
                        ))}

                        {primaryEdges.map(([from, to], i) => renderPrimaryEdge(from, to, i))}
                        {secondaryEdges.map(([from, to], i) => renderSecondaryEdge(from, to, i))}
                    </svg>

                    {Object.entries(pos).map(([id, p]) => {
                        const n = TREE_NODES.find(x => x.id === id) || {};
                        const lines = String(n.label ?? n.id).split("\n");
                        const fig = findFigure(n.label || "");
                        return (
                            <div
                                key={id}
                                className={`absolute rounded-lg border border-black/8 bg-white p-2 text-xs leading-snug shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 ${fig ? "cursor-pointer" : ""}`}
                                style={{ left: p.x, top: p.y, width: nodeW, height: nodeH }}
                                title={lines.join("\n")}
                                onClick={fig ? (e) => { e.stopPropagation(); onFigureClick?.(fig); } : undefined}
                                onKeyDown={fig ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onFigureClick?.(fig); } } : undefined}
                                tabIndex={fig ? 0 : undefined}
                                role={fig ? "button" : undefined}
                            >
                                <div className="font-semibold text-black text-[13px] leading-tight truncate">{lines[0]}</div>
                                {lines.slice(1).map((ln, i) => (
                                    <div key={i} className="text-[10px] text-steel mt-0.5 truncate">{ln}</div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
