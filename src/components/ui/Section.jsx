export default function Section({id, title, icon, children}) {
    return (<section id={id} className="mx-auto max-w-6xl px-4 py-12">
            <div className="mb-6 flex items-center gap-2">
                {icon}
                <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
            </div>
            {children}
        </section>);
}
