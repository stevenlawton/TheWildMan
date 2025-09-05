import { Trees } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
                <div className="flex items-center gap-2 font-semibold">
                    <Trees className="h-5 w-5" />
                    <span>The Wild One - A Cross-cultural Survey</span>
                </div>
                <nav className="ml-auto hidden md:flex gap-5 text-sm">
                    <a href="#what" className="hover:underline">What & Why</a>
                    <a href="#figures" className="hover:underline">Global Figures</a>
                    <a href="#table" className="hover:underline">Comparative Table</a>
                    <a href="#timeline" className="hover:underline">Timeline</a>
                    <a href="#tree" className="hover:underline">Family Tree</a>
                    <a href="#sources" className="hover:underline">Sources</a>
                </nav>
            </div>
        </header>
    );
}
