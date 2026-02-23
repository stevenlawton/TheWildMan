import { ChevronDown } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

const MOSAIC = [
    { src: "enkidu.jpg", alt: "Enkidu cylinder seal", col: "1/2", row: "1/2" },
    { src: "cernunnos.jpg", alt: "Cernunnos cauldron detail", col: "2/4", row: "1/2" },
    { src: "woodwose.jpg", alt: "Medieval woodwose engraving", col: "1/2", row: "2/4" },
    { src: "tengu.jpg", alt: "Tengu ukiyo-e print", col: "2/3", row: "2/3" },
    { src: "green-man.jpg", alt: "Green Man carving", col: "3/4", row: "2/3" },
    { src: "yakshas.jpg", alt: "Yaksha sculpture", col: "2/3", row: "3/4" },
    { src: "huldra.jpg", alt: "Huldra painting", col: "3/4", row: "3/4" },
    { src: "pan.jpg", alt: "Pan sculpture", col: "1/2", row: "4/5" },
    { src: "leshy.jpg", alt: "Leshy illustration", col: "2/3", row: "4/5" },
    { src: "div.jpg", alt: "Persian Div manuscript", col: "3/4", row: "4/5" },
];

const MOBILE_PICKS = [0, 4, 9]; // enkidu, green-man, div

export default function Hero({ setActiveTab }) {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-10">
                {/* Mobile mosaic strip */}
                <div className="flex gap-2 mb-6 md:hidden">
                    {MOBILE_PICKS.map((idx, i) => {
                        const img = MOSAIC[idx];
                        return (
                            <div
                                key={img.src}
                                className="animate-fade-in flex-1 h-20 rounded-lg overflow-hidden"
                                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                            >
                                <img
                                    src={`${BASE}images/figures/${img.src}`}
                                    alt={img.alt}
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Text content */}
                <div className="md:w-[60%] lg:w-[55%] shrink-0">
                    <p className="animate-fade-up text-sm font-semibold tracking-widest uppercase text-accent mb-4" style={{ animationDelay: "0.1s" }}>
                        A Cross-Cultural Survey
                    </p>

                    <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-black leading-[1.05]" style={{ animationDelay: "0.2s" }}>
                        The Wild Man
                    </h1>

                    <div className="animate-fade-up h-1 w-16 bg-accent mt-4 mb-5" style={{ animationDelay: "0.3s" }} />

                    <p className="animate-fade-up text-xl md:text-2xl text-steel max-w-2xl leading-relaxed" style={{ animationDelay: "0.4s" }}>
                        Nature personifications and wild-beings across world folklore - from Enkidu and the Green Man to Leshy, Wendigo, Yowie, and beyond.
                    </p>

                    <div className="animate-fade-up flex flex-wrap gap-3 mt-7" style={{ animationDelay: "0.5s" }}>
                        <button
                            onClick={() => setActiveTab("figures")}
                            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors duration-200"
                        >
                            Explore figures
                        </button>
                        <button
                            onClick={() => setActiveTab("figures")}
                            className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 rounded-lg text-sm font-medium text-ink hover:border-accent hover:text-accent transition-colors duration-200"
                        >
                            Compare traits
                        </button>
                    </div>
                </div>

                {/* Desktop/tablet mosaic grid */}
                <div className="hidden md:block relative md:w-[40%] lg:w-[45%]">
                    <div
                        className="grid grid-cols-3 gap-2"
                        style={{ gridTemplateRows: "repeat(4, 80px)" }}
                    >
                        {MOSAIC.map((img, i) => (
                            <div
                                key={img.src}
                                className="animate-fade-in rounded-lg overflow-hidden"
                                style={{
                                    gridColumn: img.col,
                                    gridRow: img.row,
                                    animationDelay: `${0.3 + i * 0.08}s`,
                                }}
                            >
                                <img
                                    src={`${BASE}images/figures/${img.src}`}
                                    alt={img.alt}
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Gradient fade blending into cream background */}
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent pointer-events-none" />
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1s" }}>
                <a
                    href="#what"
                    onClick={(e) => { e.preventDefault(); document.getElementById("what")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="flex flex-col items-center gap-1 text-steel/50 hover:text-accent transition-colors duration-200"
                >
                    <ChevronDown className="h-5 w-5 animate-bounce" />
                </a>
            </div>
        </section>
    );
}
