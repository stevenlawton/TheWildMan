import useScrollReveal from "../../hooks/useScrollReveal";

export default function Section({ id, title, extra, children }) {
    const ref = useScrollReveal();

    return (
        <section id={id} ref={ref} className="reveal mx-auto max-w-6xl px-4 py-10 md:py-14">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold text-black">{title}</h2>
                {extra}
            </div>
            <div className="h-1 w-10 bg-accent mt-2 mb-5" />
            {children}
        </section>
    );
}
