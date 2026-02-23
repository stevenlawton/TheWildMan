import { useState, useEffect, useCallback } from "react";

export const TABS = [
    { id: "map", label: "Map", hash: "#map" },
    { id: "figures", label: "Figures", hash: "#figures" },
    { id: "timeline", label: "Timeline", hash: "#timeline" },
    { id: "lineage", label: "Lineage", hash: "#lineage" },
    { id: "sources", label: "Sources", hash: "#sources" },
];

const TAB_IDS = new Set(TABS.map((t) => t.id));

function readHash() {
    if (typeof window === "undefined") return "home";
    const raw = window.location.hash.replace("#", "");
    return TAB_IDS.has(raw) ? raw : "home";
}

export default function useHashTab() {
    const [activeTab, setActiveTabState] = useState(readHash);

    const setActiveTab = useCallback((id) => {
        setActiveTabState(id);
        const tab = TABS.find((t) => t.id === id);
        const hash = tab?.hash || "";
        history.pushState(null, "", hash || window.location.pathname + window.location.search);
        window.scrollTo({ top: 0 });
    }, []);

    useEffect(() => {
        const onHashChange = () => setActiveTabState(readHash());
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    return [activeTab, setActiveTab];
}
