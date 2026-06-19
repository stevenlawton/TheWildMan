// Lineage data lives in tree.json ({ nodes, edges }); labels stay here.
import tree from "./tree.json";

export const TREE_NODES = tree.nodes;
export const TREE_EDGES = tree.edges;

export const EDGE_TYPE_LABELS = {
    direct: "Direct influence",
    substrate: "Shared substrate",
    parallel: "Parallel development",
};
