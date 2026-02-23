import { Trees, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
    { href: "#what", label: "What & Why" },
    { href: "#regions", label: "Regions" },
    { href: "#figures", label: "Figures" },
    { href: "#table", label: "Table" },
    { href: "#timeline", label: "Timeline" },
    { href: "#tree", label: "Lineage" },
    { href: "#sources", label: "Sources" },
];

export default function Header() {
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
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-6">
                <a href="#" className="flex items-center gap-2 group">
                    <Trees className="h-5 w-5 text-accent" />
                    <span className="font-bold text-black text-sm tracking-wide">
                        The Wild Man
                    </span>
                </a>

                <nav className="ml-auto hidden md:flex gap-1">
                    {NAV_LINKS.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            className="relative px-3 py-1.5 text-sm text-steel hover:text-black transition-colors duration-200 group"
                        >
                            {label}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-3/4" />
                        </a>
                    ))}
                </nav>

                <button
                    className="md:hidden ml-auto text-steel hover:text-black transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {mobileOpen && (
                <nav className="md:hidden border-t border-black/5 bg-white/95 backdrop-blur-md animate-fade-in">
                    <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
                        {NAV_LINKS.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm text-steel hover:text-accent transition-colors py-1"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
}
