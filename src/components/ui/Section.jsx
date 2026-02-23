import useScrollReveal from "../../hooks/useScrollReveal";

export default function Section({ id, title, extra, children }) {
    const ref = useScrollReveal();

    return (
        <section id={id} ref={ref} className="reveal mx-auto max-w-6xl px-4 py-14 md:py-18">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold text-black">{title}</h2>
                {extra}
            </div>
            <div className="h-1 w-10 bg-accent mt-2 mb-8" />
            {children}
        </section>
    );
}
