import React, { useEffect, useState, useCallback } from "react";
import { BookOpenCheck, Globe, Table as TableIcon, Trees, GitBranch } from "lucide-react";

import { FIGURES } from "./data/figures";
import { norm, ROLE_LABELS, TRAIT_LABELS, FIGURE_TYPE_LABELS } from "./data/labels";

import Section from "./components/ui/Section";
import FiguresGrid from "./components/features/FiguresGrid";
import ComparativeTable from "./components/features/ComparativeTable";
import Timeline from "./components/features/Timeline";
import FamilyTree from "./components/features/FamilyTree";
import Sources from "./components/features/Sources";
import WorldMap from "./components/features/WorldMap";
import FigureDetail from "./components/features/FigureDetail";

import Header from "./components/layout/Header";
import Hero from "./components/layout/Hero";
import Footer from "./components/layout/Footer";

function useSelfTests() {
    useEffect(() => {
        const missingTraitLabels = [];
        const missingRoleLabels = [];
        const missingFigureTypes = [];
        for (const f of FIGURES) {
            for (const t of f.traits) if (!TRAIT_LABELS[t] && !TRAIT_LABELS[norm(t)]) missingTraitLabels.push(`${f.id}:${t}`);
            for (const r of f.roles) if (!ROLE_LABELS[r] && !ROLE_LABELS[norm(r)]) missingRoleLabels.push(`${f.id}:${r}`);
            if (f.figureType && !FIGURE_TYPE_LABELS[f.figureType]) missingFigureTypes.push(`${f.id}:${f.figureType}`);
        }
        if (missingTraitLabels.length) console.error("[TEST] Missing trait labels:", missingTraitLabels);
        if (missingRoleLabels.length) console.error("[TEST] Missing role labels:", missingRoleLabels);
        if (missingFigureTypes.length) console.error("[TEST] Missing figure type labels:", missingFigureTypes);
        if (!missingTraitLabels.length && !missingRoleLabels.length && !missingFigureTypes.length) console.log("[TEST] Label mapping OK");
    }, []);
}

export default function WildOneSite() {
    useSelfTests();
    const [selectedFigure, setSelectedFigure] = useState(null);

    const handleFigureClick = useCallback((figure) => {
        setSelectedFigure(figure);
    }, []);

    const handleRegionClick = useCallback((region) => {
        const el = document.getElementById("table");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <div className="min-h-screen bg-cream text-ink">
            <Header />
            <Hero />

            <Section id="what" title="What is the 'Wild One' archetype?">
                <div className="grid md:grid-cols-3 gap-5">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="font-bold text-black text-lg mb-2">Personification of Nature</h3>
                        <p className="text-steel leading-relaxed">
                            Figures who embody the untamed world -- forest, mountain, bush, desert. Nature given human shape, standing at the boundary between civilisation and wilderness.
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

            <Section id="regions" title="World regions">
                <WorldMap onRegionClick={handleRegionClick} />
            </Section>

            <Section id="figures" title="Global figures at a glance">
                <FiguresGrid onFigureClick={handleFigureClick} />
            </Section>

            <Section id="table" title="Comparative table">
                <ComparativeTable onFigureClick={handleFigureClick} />
            </Section>

            <Section id="timeline" title="Attested timeline">
                <Timeline />
            </Section>

            <Section id="tree" title="Conceptual lineage">
                <FamilyTree />
            </Section>

            <Section id="sources" title="References & further reading">
                <Sources />
            </Section>

            <Footer />

            {selectedFigure && (
                <FigureDetail
                    figure={selectedFigure}
                    onClose={() => setSelectedFigure(null)}
                />
            )}
        </div>
    );
}
