import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { TREE_NODES, TREE_EDGES } from "../../data/tree";
import { ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";

const ROOT_IDS = ["A1", "E2", "G1"];
const EXPLICIT_ORDER = { A1: ["B2", "B3", "B1"] };

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.15;

export default function FamilyTree() {
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

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

    // Layout computation (unchanged)
    const { pos, primaryEdges, secondaryEdges, width, height, nodeW, nodeH } = useMemo(() => {
        const nodeW = 260;
        const nodeH = 96;
        const hGap = 28;
        const vGap = 56;
        const rootGap = 120;
        const pad = { l: 48, t: 48, r: 48, b: 48 };

        const byId = new Map(TREE_NODES.map(n => [n.id, { ...n }]));
        const childrenAll = new Map([...byId.keys()].map(id => [id, []]));
        for (const e of TREE_EDGES) {
            if (byId.has(e.from) && byId.has(e.to)) childrenAll.get(e.from).push(e.to);
        }

        const include = new Set();
        const roots = ROOT_IDS.filter(id => byId.has(id));
        function dfs(id) {
            if (include.has(id)) return;
            include.add(id);
            for (const c of childrenAll.get(id) || []) dfs(c);
        }
        roots.forEach(dfs);

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

        const unit = nodeW + hGap;
        const pos = {};
        const primaryEdges = [];

        function layoutTree(tree, offsetX) {
            let cursor = offsetX;
            function layout(node, depth) {
                if (!node.children.length) {
                    const cx = cursor + unit / 2;
                    node.x = cx - nodeW / 2;
                    node.y = depth * (nodeH + vGap);
                    pos[node.id] = { x: node.x, y: node.y };
                    cursor += unit;
                    return { minX: node.x, maxX: node.x + nodeW };
                }
                const childBoxes = node.children.map(c => layout(c, depth + 1));
                const minX = childBoxes[0].minX;
                const maxX = childBoxes[childBoxes.length - 1].maxX;
                const cx = (minX + maxX) / 2;
                node.x = cx - nodeW / 2;
                node.y = depth * (nodeH + vGap);
                pos[node.id] = { x: node.x, y: node.y };
                for (const c of node.children) primaryEdges.push([node.id, c.id]);
                return { minX, maxX };
            }
            const box = layout(tree, 0);
            return Math.max(offsetX + (box.maxX - offsetX), cursor);
        }

        let runX = pad.l;
        for (const tree of forests) {
            runX = layoutTree(tree, runX) + rootGap;
        }

        const primarySet = new Set(primaryEdges.map(([a, b]) => `${a}->${b}`));
        const secondaryEdges = TREE_EDGES
            .filter(e => include.has(e.from) && include.has(e.to))
            .filter(e => !primarySet.has(`${e.from}->${e.to}`))
            .map(e => [e.from, e.to]);

        const xs = Object.values(pos).map(p => p.x);
        const xe = Object.values(pos).map(p => p.x + nodeW);
        const ys = Object.values(pos).map(p => p.y);
        const ye = Object.values(pos).map(p => p.y + nodeH);
        const minX = Math.min(...xs, pad.l);
        const maxX = Math.max(...xe, pad.l + 1);
        const minY = Math.min(...ys, pad.t);
        const maxY = Math.max(...ye, pad.t + 1);
        const shiftX = minX < pad.l ? pad.l - minX : 0;
        const shiftY = minY < pad.t ? pad.t - minY : 0;
        for (const id of Object.keys(pos)) {
            pos[id] = { x: pos[id].x + shiftX, y: pos[id].y + shiftY };
        }

        return {
            pos, primaryEdges, secondaryEdges, nodeW, nodeH,
            width: Math.ceil(maxX - Math.min(minX, pad.l)) + pad.r + shiftX,
            height: Math.ceil(maxY - Math.min(minY, pad.t)) + pad.b + shiftY,
        };
    }, []);

    // Fit to container
    const fitToView = useCallback(() => {
        if (!containerSize.w) return;
        const viewH = 500;
        const scaleX = containerSize.w / width;
        const scaleY = viewH / height;
        const fitZoom = Math.min(scaleX, scaleY, 1);
        setZoom(fitZoom);
        // Centre the tree
        setPan({
            x: (containerSize.w - width * fitZoom) / 2,
            y: (viewH - height * fitZoom) / 2,
        });
    }, [containerSize.w, width, height]);

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
        // Adjust pan so the point under the cursor stays fixed
        setPan(prev => ({
            x: cx - (cx - prev.x) * (clamped / zoom),
            y: cy - (cy - prev.y) * (clamped / zoom),
        }));
        setZoom(clamped);
    }, [zoom]);

    const handleZoomIn = () => {
        const cx = containerSize.w / 2;
        const cy = 250;
        zoomAtPoint(zoom + ZOOM_STEP, cx, cy);
    };

    const handleZoomOut = () => {
        const cx = containerSize.w / 2;
        const cy = 250;
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
                <div className="ml-auto flex items-center gap-1.5 text-xs text-steel/60">
                    <Move className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Drag to pan, scroll to zoom</span>
                </div>
            </div>

            {/* Canvas */}
            <div
                ref={containerRef}
                className="relative overflow-hidden"
                style={{ height: 500, cursor: dragging ? "grabbing" : "grab" }}
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

                        {primaryEdges.map(([from, to], i) => {
                            const a = pos[from], b = pos[to];
                            if (!a || !b) return null;
                            const x1 = a.x + nodeW / 2, y1 = a.y + nodeH;
                            const x2 = b.x + nodeW / 2, y2 = b.y;
                            const my = (y1 + y2) / 2;
                            return (
                                <path
                                    key={`p-${i}`}
                                    d={`M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`}
                                    fill="none" stroke="#CC5200" strokeWidth="1.5" strokeOpacity="0.5"
                                    markerEnd="url(#arrow)"
                                />
                            );
                        })}

                        {secondaryEdges.map(([from, to], i) => {
                            const a = pos[from], b = pos[to];
                            if (!a || !b) return null;
                            const x1 = a.x + nodeW / 2, y1 = a.y + nodeH;
                            const x2 = b.x + nodeW / 2, y2 = b.y;
                            const my = (y1 + y2) / 2;
                            return (
                                <path
                                    key={`s-${i}`}
                                    d={`M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`}
                                    fill="none" stroke="#666666" strokeWidth="1" strokeDasharray="4 4"
                                    strokeOpacity="0.4" markerEnd="url(#arrow-dim)"
                                />
                            );
                        })}
                    </svg>

                    {Object.entries(pos).map(([id, p]) => {
                        const n = TREE_NODES.find(x => x.id === id) || {};
                        const lines = String(n.label ?? n.id).split("\n");
                        return (
                            <div
                                key={id}
                                className="absolute rounded-lg border border-black/8 bg-white p-3 text-sm leading-snug shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200"
                                style={{ left: p.x, top: p.y, width: nodeW, height: nodeH }}
                                title={lines.join("\n")}
                            >
                                <div className="font-semibold text-black">{lines[0]}</div>
                                {lines.slice(1).map((ln, i) => (
                                    <div key={i} className="text-xs text-steel mt-0.5">{ln}</div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
