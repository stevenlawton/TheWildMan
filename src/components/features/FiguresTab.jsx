import { useState } from "react";
import { LayoutGrid, Table } from "lucide-react";
import Section from "../ui/Section";
import FiguresGrid from "./FiguresGrid";
import ComparativeTable from "./ComparativeTable";

export default function FiguresTab({ onFigureClick }) {
    const [view, setView] = useState("cards");

    return (
        <Section
            id="figures"
            title={view === "cards" ? "Global figures at a glance" : "Comparative table"}
            extra={
                <div className="flex gap-1 rounded-lg border border-black/8 p-0.5">
                    <button
                        onClick={() => setView("cards")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                            view === "cards"
                                ? "bg-black text-white"
                                : "text-steel hover:text-black"
                        }`}
                        aria-pressed={view === "cards"}
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Cards
                    </button>
                    <button
                        onClick={() => setView("table")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                            view === "table"
                                ? "bg-black text-white"
                                : "text-steel hover:text-black"
                        }`}
                        aria-pressed={view === "table"}
                    >
                        <Table className="h-3.5 w-3.5" />
                        Table
                    </button>
                </div>
            }
        >
            {view === "cards" ? (
                <FiguresGrid onFigureClick={onFigureClick} />
            ) : (
                <ComparativeTable onFigureClick={onFigureClick} />
            )}
        </Section>
    );
}
