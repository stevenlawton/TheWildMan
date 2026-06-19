// The Wild Man — public library API.
//
// Consumed by stevenlawton.com (and any other host): the research data plus
// the interactive visualisation components. The figure TEXT is rendered by
// the host for SEO; these components provide the interactive views.
//
// Visualisation components each take a single prop:
//   onFigureClick?: (figure) => void
// and read their own data internally.

// --- Data (also exposed as raw JSON via package exports: ./figures.json etc.) ---
export { FIGURES } from "./data/figures.js";
export { TREE_NODES, TREE_EDGES, EDGE_TYPE_LABELS } from "./data/tree.js";
export { SOURCES, SOURCE_TYPE_LABELS, ALL_SOURCE_REGIONS } from "./data/sources.js";
export * from "./data/labels.js";

// --- Visualisation components ---
export { default as WorldMap } from "./components/features/WorldMap.jsx";
export { default as Timeline } from "./components/features/Timeline.jsx";
export { default as FamilyTree } from "./components/features/FamilyTree.jsx";
