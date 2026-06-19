import { useState, useCallback } from "react";

// Dogfood the lib's public API - the exact surface stevenlawton.com consumes.
import { WorldMap, Timeline, FamilyTree } from "./lib.js";

// Demo-only presentation (not part of the published lib).
import Section from "./components/ui/Section";
import FiguresTab from "./components/features/FiguresTab";
import Sources from "./components/features/Sources";
import FigureDetail from "./components/features/FigureDetail";

const NAV = [
    ["figures", "Figures"],
    ["map", "Map"],
    ["timeline", "Timeline"],
    ["lineage", "Lineage"],
    ["sources", "Sources"],
];

// A plain "whitecard" demo: every section stacked on one page (so it all
// prerenders), built from the lib. The styled, SEO-canonical experience lives
// on stevenlawton.com/wildman - this just showcases the dataset + the lib.
export default function App() {
    const [selectedFigure, setSelectedFigure] = useState(null);
    const onFigureClick = useCallback((figure) => setSelectedFigure(figure), []);

    return (
        <div className="min-h-screen bg-cream text-ink">
            <header className="border-b border-black/10 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
                    <h1 className="font-bold text-lg text-black">The Wild Man</h1>
                    <p className="text-steel text-sm">
                        A cross-cultural folklore survey - 53 figures, 20 regions.
                    </p>
                    <nav className="ml-auto flex flex-wrap gap-4 text-sm">
                        {NAV.map(([id, label]) => (
                            <a key={id} href={`#${id}`} className="text-steel hover:text-black transition-colors">
                                {label}
                            </a>
                        ))}
                    </nav>
                </div>
            </header>

            <main>
                <Section id="about" title="What is the Wild Man archetype?">
                    <div className="grid md:grid-cols-3 gap-5">
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <h3 className="font-bold text-black text-lg mb-2">Personification of Nature</h3>
                            <p className="text-steel leading-relaxed">
                                Figures who embody the untamed world - forest, mountain, bush, desert. Nature given human shape, standing at the boundary between civilisation and wilderness.
                            </p>
                        </div>
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <h3 className="font-bold text-black text-lg mb-2">Shared Traits</h3>
                            <p className="text-steel leading-relaxed">
                                Hair or leaves covering the body, liminal habitats, guardian or punisher roles, and sometimes fertility or taboo themes. Remarkably consistent across cultures.
                            </p>
                        </div>
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <h3 className="font-bold text-black text-lg mb-2">Independent Emergence</h3>
                            <p className="text-steel leading-relaxed">
                                Similar stories appear in cultures with little or no contact, suggesting shared human responses to wilderness rather than a single origin myth.
                            </p>
                        </div>
                    </div>
                </Section>
                <div id="figures">
                    <FiguresTab onFigureClick={onFigureClick} />
                </div>
                <Section id="map" title="World regions">
                    <WorldMap onFigureClick={onFigureClick} />
                </Section>
                <Section id="timeline" title="Attested timeline">
                    <Timeline onFigureClick={onFigureClick} />
                </Section>
                <Section id="lineage" title="Conceptual lineage">
                    <FamilyTree onFigureClick={onFigureClick} />
                </Section>
                <Section id="sources" title="References & further reading">
                    <Sources />
                </Section>
            </main>

            {selectedFigure && (
                <FigureDetail figure={selectedFigure} onClose={() => setSelectedFigure(null)} />
            )}
        </div>
    );
}
