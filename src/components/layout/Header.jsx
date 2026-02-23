import { Trees, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { TABS } from "../../hooks/useHashTab";

const LEFT_IDS = new Set(["map", "timeline", "lineage"]);
const LEFT_TABS = TABS.filter((t) => LEFT_IDS.has(t.id));
const RIGHT_TABS = TABS.filter((t) => !LEFT_IDS.has(t.id));

function TabButton({ tab, activeTab, setActiveTab, onClick }) {
    return (
        <button
            onClick={onClick || (() => setActiveTab(tab.id))}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`relative px-3 py-1.5 text-sm transition-colors duration-200 ${
                activeTab === tab.id
                    ? "text-black font-medium"
                    : "text-steel hover:text-black"
            }`}
        >
            {tab.label}
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-accent transition-all duration-200 ${
                activeTab === tab.id ? "w-3/4" : "w-0"
            }`} />
        </button>
    );
}

export default function Header({ activeTab, setActiveTab }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled
                ? "bg-white/90 backdrop-blur-md shadow-sm"
                : "bg-transparent"
        }`}>
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center">
                <button
                    onClick={() => setActiveTab("home")}
                    className="flex items-center gap-2 group"
                    aria-label="Go to home"
                >
                    <Trees className="h-5 w-5 text-accent" />
                    <span className="font-bold text-black text-sm tracking-wide">
                        The Wild Man
                    </span>
                </button>

                <nav className="hidden md:flex gap-1 ml-4" role="tablist" aria-label="Visualisations">
                    {LEFT_TABS.map((tab) => (
                        <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}
                </nav>

                <nav className="hidden md:flex gap-1 ml-auto" role="tablist" aria-label="Data">
                    {RIGHT_TABS.map((tab) => (
                        <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}
                </nav>

                <button
                    className="md:hidden ml-auto text-steel hover:text-black transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {mobileOpen && (
                <nav className="md:hidden border-t border-black/5 bg-white/95 backdrop-blur-md animate-fade-in">
                    <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setMobileOpen(false); }}
                                className={`text-left text-sm transition-colors py-1 ${
                                    activeTab === tab.id
                                        ? "text-accent font-medium"
                                        : "text-steel hover:text-accent"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
}
