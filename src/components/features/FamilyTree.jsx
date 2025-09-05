import { useMemo } from "react";
import { TREE_NODES, TREE_EDGES } from "../../data/tree";

// Three families shown side by side. Change order to move columns.
const ROOT_IDS = ["A1", "E2", "G1"]; // Enkidu, Mao Ren, Yowie

// Optional explicit child ordering for neatness.
const EXPLICIT_ORDER = {
    A1: ["B2", "B3", "B1"], // Pan, Silvanus/Faunus, Satyrs & Sileni
    // Add more like: C1: ["C2","C3"]
};

export default function FamilyTree() {
    const { pos, primaryEdges, secondaryEdges, width, height, nodeW, nodeH } = useMemo(() => {
        // visuals
        const nodeW = 260;
        const nodeH = 96;
        const hGap = 28;   // between siblings
        const vGap = 56;   // between rows
        const rootGap = 120; // between the three family trees
        const pad = { l: 48, t: 48, r: 48, b: 48 };

        const byId = new Map(TREE_NODES.map(n => [n.id, { ...n }]));
        const labelOf = id => String(byId.get(id)?.label ?? byId.get(id)?.name ?? id);

        // full child adjacency from data
        const childrenAll = new Map([...byId.keys()].map(id => [id, []]));
        for (const e of TREE_EDGES) {
            if (byId.has(e.from) && byId.has(e.to)) childrenAll.get(e.from).push(e.to);
        }

        // collect all nodes that belong to any chosen root's descendant set
        const include = new Set();
        const roots = ROOT_IDS.filter(id => byId.has(id));
        function dfs(id) {
            if (include.has(id)) return;
            include.add(id);
            for (const c of childrenAll.get(id) || []) dfs(c);
        }
        roots.forEach(dfs);

        // prune children to included set and apply explicit ordering when present
        const children = new Map([...byId.keys()].map(id => [id, []]));
        for (const p of include) {
            const kids = (childrenAll.get(p) || []).filter(c => include.has(c));
            const order = EXPLICIT_ORDER[p];
            const ordered = order
                ? [...kids].sort((a, b) => order.indexOf(a) - order.indexOf(b))
                : kids;
            children.set(p, ordered);
        }

        // build a pure tree for each root, ignoring cross edges
        function build(id, seen = new Set()) {
            if (seen.has(id)) return { id, children: [] };
            seen.add(id);
            const ch = (children.get(id) || []).map(c => build(c, seen));
            return { id, children: ch };
        }
        const forests = roots.map(r => build(r));

        // tidy layout bottom up for a single tree, returns width used
        const unit = nodeW + hGap;
        const pos = {};
        const primaryEdges = [];

        function layoutTree(tree, offsetX) {
            // first pass: assign x,y bottom up
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
                // layout children first
                const childBoxes = node.children.map(c => layout(c, depth + 1));
                const minX = childBoxes[0].minX;
                const maxX = childBoxes[childBoxes.length - 1].maxX;
                const cx = (minX + maxX) / 2;
                node.x = cx - nodeW / 2;
                node.y = depth * (nodeH + vGap);
                pos[node.id] = { x: node.x, y: node.y };
                // record primary edges
                for (const c of node.children) primaryEdges.push([node.id, c.id]);
                return { minX, maxX };
            }
            const box = layout(tree, 0);
            return Math.max(offsetX + (box.maxX - offsetX), cursor);
        }

        // lay out each root tree left to right
        let runX = pad.l;
        for (const tree of forests) {
            const endX = layoutTree(tree, runX);
            runX = endX + rootGap;
        }

        // add dashed secondary edges for any remaining included edges that were not used as primary
        const primarySet = new Set(primaryEdges.map(([a, b]) => `${a}->${b}`));
        const secondaryEdges = TREE_EDGES
            .filter(e => include.has(e.from) && include.has(e.to))
            .filter(e => !primarySet.has(`${e.from}->${e.to}`))
            .map(e => [e.from, e.to]);

        // normalise and compute canvas size
        const xs = Object.values(pos).map(p => p.x);
        const xe = Object.values(pos).map(p => p.x + nodeW);
        const ys = Object.values(pos).map(p => p.y);
        const ye = Object.values(pos).map(p => p.y + nodeH);

        const minX = Math.min(...xs, pad.l);
        const maxX = Math.max(...xe, pad.l + 1);
        const minY = Math.min(...ys, pad.t);
        const maxY = Math.max(...ye, pad.t + 1);

        // shift everything into positive space and add top padding
        const shiftX = minX < pad.l ? pad.l - minX : 0;
        const shiftY = minY < pad.t ? pad.t - minY : 0;
        for (const id of Object.keys(pos)) {
            pos[id] = { x: pos[id].x + shiftX, y: pos[id].y + shiftY };
        }

        const width = Math.ceil(maxX - Math.min(minX, pad.l)) + pad.r + shiftX;
        const height = Math.ceil(maxY - Math.min(minY, pad.t)) + pad.b + shiftY;

        return { pos, primaryEdges, secondaryEdges, width, height, nodeW, nodeH };
    }, []);

    return (
        <div className="relative overflow-x-auto">
            <div className="relative" style={{ width, height }}>
                {/* edges */}
                <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                            <path d="M0,0 L6,3 L0,6 Z" fill="#555" />
                        </marker>
                    </defs>

                    {/* primary tree edges */}
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
                                fill="none"
                                stroke="#333"
                                strokeWidth="2"
                                markerEnd="url(#arrow)"
                            />
                        );
                    })}

                    {/* dashed cross-links within the included set */}
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
                                fill="none"
                                stroke="#888"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                markerEnd="url(#arrow)"
                                opacity="0.85"
                            />
                        );
                    })}
                </svg>

                {/* nodes */}
                {Object.entries(pos).map(([id, p]) => {
                    const n = TREE_NODES.find(x => x.id === id) || {};
                    const lines = String(n.label ?? n.id).split("\n");
                    return (
                        <div
                            key={id}
                            className="absolute rounded-2xl border bg-white shadow-sm p-3 text-sm leading-snug"
                            style={{ left: p.x, top: p.y, width: nodeW, height: nodeH }}
                            title={lines.join("\n")}
                        >
                            <div className="font-semibold">{lines[0]}</div>
                            {lines.slice(1).map((ln, i) => (
                                <div key={i} className="text-neutral-700">{ln}</div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
