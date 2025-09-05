import { ChevronRight, Leaf, MountainSnow, BookOpenCheck, Globe, Table as TableIcon } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Wild Man, Green Man, Forest Spirits
                    </h1>
                    <p className="mt-4 text-lg text-neutral-700">
                        A concise, factual guide to nature personifications and wild-beings across world folklore - from Enkidu and the Green Man to Leshy, Wendigo, Yowie, and more.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <a href="#figures" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 shadow-sm hover:bg-neutral-50">
                            <Globe className="h-4 w-4" /> Explore figures
                            <ChevronRight className="h-4 w-4" />
                        </a>
                        <a href="#table" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 shadow-sm hover:bg-neutral-50">
                            <TableIcon className="h-4 w-4" /> Compare traits
                            <ChevronRight className="h-4 w-4" />
                        </a>
                        <a href="#timeline" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 shadow-sm hover:bg-neutral-50">
                            <BookOpenCheck className="h-4 w-4" /> Jump to timeline
                            <ChevronRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
                <div className="relative">
                    <div className="rounded-3xl border bg-white p-6 shadow-lg">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 rounded-2xl bg-neutral-50 border">
                                <Leaf className="mx-auto h-6 w-6" />
                                <p className="mt-2 text-sm">Fertility & Renewal</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-neutral-50 border">
                                <MountainSnow className="mx-auto h-6 w-6" />
                                <p className="mt-2 text-sm">Wilderness Dweller</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-neutral-50 border">
                                <BookOpenCheck className="mx-auto h-6 w-6" />
                                <p className="mt-2 text-sm">Attested Traditions</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-neutral-600">
                            These motifs recur globally: hairy wild-beings, leafy faces, guardians and punishers at the edge of civilisation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
