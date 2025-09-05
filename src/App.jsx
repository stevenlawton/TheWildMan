import React, {useEffect} from "react";
import {BookOpenCheck, Globe, Table as TableIcon, Trees} from "lucide-react";

import {FIGURES} from "./data/figures";
import {norm, ROLE_LABELS, TRAIT_LABELS} from "./data/labels";

import Section from "./components/ui/Section";
import FiguresGrid from "./components/features/FiguresGrid";
import ComparativeTable from "./components/features/ComparativeTable";
import Timeline from "./components/features/Timeline";
import FamilyTree from "./components/features/FamilyTree";
import Sources from "./components/features/Sources";

import Header from "./components/layout/Header";
import Hero from "./components/layout/Hero";
import Footer from "./components/layout/Footer";


// Self-tests
function useSelfTests() {
    useEffect(() => {
        const missingTraitLabels = [];
        const missingRoleLabels = [];
        for (const f of FIGURES) {
            for (const t of f.traits) if (!TRAIT_LABELS[t] && !TRAIT_LABELS[norm(t)]) missingTraitLabels.push(`${f.id}:${t}`);
            for (const r of f.roles) if (!ROLE_LABELS[r] && !ROLE_LABELS[norm(r)]) missingRoleLabels.push(`${f.id}:${r}`);
        }
        if (missingTraitLabels.length) console.error("[TEST] Missing trait labels:", missingTraitLabels);
        if (missingRoleLabels.length) console.error("[TEST] Missing role labels:", missingRoleLabels);
        if (!missingTraitLabels.length && !missingRoleLabels.length) console.log("[TEST] Label mapping OK");
    }, []);
}

// ------------------ App ------------------
export default function WildOneSite() {
    useSelfTests();

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            {/* Nav */}
            <Header/>

            {/* Hero */}
            <Hero/>

            {/* What & Why */}
            <Section id="what" title="What is the 'Wild One' archetype and why does it recur?" icon={<Trees className="h-6 w-6"/>}>
                <div className="prose prose-neutral max-w-none">
                    <ul>
                        <li><strong>Personification of Nature:</strong> figures who embody the untamed world - forest, mountain, bush, desert.</li>
                        <li><strong>Common traits:</strong> hair or leaves, liminal habitat, guardian or punisher role, and sometimes fertility or taboo themes.</li>
                        <li><strong>Independent emergence:</strong> similar stories appear in cultures with little or no contact, suggesting shared human responses to wilderness.</li>
                    </ul>
                </div>
            </Section>

            {/* Global Figures (cards) */}
            <Section id="figures" title="Global figures at a glance" icon={<Globe className="h-6 w-6"/>}>
                <FiguresGrid/>
            </Section>

            {/* Comparative Table with filters */}
            <Section id="table" title="Comparative table and filters" icon={<TableIcon className="h-6 w-6"/>}>
                <ComparativeTable/>
            </Section>

            {/* Timeline */}
            <Section id="timeline" title="Attested timeline (selected)" icon={<BookOpenCheck className="h-6 w-6"/>}>
                <Timeline/>
            </Section>

            {/* Family Tree */}
            <Section id="tree" title="Family tree (conceptual lineage)" icon={<Trees className="h-6 w-6"/>}>
                <FamilyTree/>
            </Section>

            {/* Sources */}
            <Section id="sources" title="Primary references & further reading" icon={<BookOpenCheck className="h-6 w-6"/>}>
                <Sources/>
            </Section>


            <Footer/>
        </div>
    );
}
