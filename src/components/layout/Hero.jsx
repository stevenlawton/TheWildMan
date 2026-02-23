import { ChevronDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-6xl px-4 py-24 md:py-36">
                <p className="animate-fade-up text-sm font-semibold tracking-widest uppercase text-accent mb-4" style={{ animationDelay: "0.1s" }}>
                    A Cross-Cultural Survey
                </p>

                <h1 className="animate-fade-up text-5xl md:text-7xl lg:text-8xl font-bold text-black leading-[1.05]" style={{ animationDelay: "0.2s" }}>
                    The Wild Man
                </h1>

                <div className="animate-fade-up h-1 w-16 bg-accent mt-6 mb-8" style={{ animationDelay: "0.3s" }} />

                <p className="animate-fade-up text-xl md:text-2xl text-steel max-w-2xl leading-relaxed" style={{ animationDelay: "0.4s" }}>
                    Nature personifications and wild-beings across world folklore -- from Enkidu and the Green Man to Leshy, Wendigo, Yowie, and beyond.
                </p>

                <div className="animate-fade-up flex flex-wrap gap-3 mt-10" style={{ animationDelay: "0.5s" }}>
                    <a href="#figures" className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors duration-200">
                        Explore figures
                    </a>
                    <a href="#table" className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 rounded-lg text-sm font-medium text-ink hover:border-accent hover:text-accent transition-colors duration-200">
                        Compare traits
                    </a>
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1s" }}>
                <a href="#what" className="flex flex-col items-center gap-1 text-steel/50 hover:text-accent transition-colors duration-200">
                    <ChevronDown className="h-5 w-5 animate-bounce" />
                </a>
            </div>
        </section>
    );
}
