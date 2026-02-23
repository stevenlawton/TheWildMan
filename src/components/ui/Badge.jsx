const VARIANT_STYLES = {
    trait: "bg-black/5 text-ink border-black/8",
    role: "bg-accent/10 text-accent-deep border-accent/15",
    default: "bg-black/5 text-steel border-black/8",
};

export default function Badge({ children, variant = "default" }) {
    const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles}`}>
            {children}
        </span>
    );
}
